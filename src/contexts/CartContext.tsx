/**
 * Cart Context — lightweight React Context + useReducer for basket management.
 * Persists to localStorage under "wenaya-cart-v1" with SSR-safe hydration.
 * No external state libraries. Follows the same pattern as LanguageContext.
 */
"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// ── Types ──

export interface CartItem {
  productSlug: string;
  productName: string;
  image: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

interface CartState {
  items: CartItem[];
}

export interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  increment: (productSlug: string) => void;
  decrement: (productSlug: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isEmpty: boolean;
  /** Whether the cart has been hydrated from localStorage (prevents SSR mismatches) */
  hydrated: boolean;
}

// ── Reducer ──

type CartAction =
  | { type: "ADD_ITEM"; payload: { item: Omit<CartItem, "quantity">; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productSlug: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productSlug: string; quantity: number } }
  | { type: "INCREMENT"; payload: { productSlug: string } }
  | { type: "DECREMENT"; payload: { productSlug: string } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: { items: CartItem[] } };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity } = action.payload;
      const existing = state.items.find((i) => i.productSlug === item.productSlug);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productSlug === item.productSlug
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity }] };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) => i.productSlug !== action.payload.productSlug),
      };

    case "UPDATE_QUANTITY": {
      const { productSlug, quantity } = action.payload;
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.productSlug !== productSlug) };
      }
      return {
        items: state.items.map((i) =>
          i.productSlug === productSlug ? { ...i, quantity } : i
        ),
      };
    }

    case "INCREMENT":
      return {
        items: state.items.map((i) =>
          i.productSlug === action.payload.productSlug
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };

    case "DECREMENT":
      return {
        items: state.items
          .map((i) =>
            i.productSlug === action.payload.productSlug
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0),
      };

    case "CLEAR":
      return { items: [] };

    case "HYDRATE":
      return { items: action.payload.items };

    default:
      return state;
  }
}

// ── Persistence ──

const STORAGE_KEY = "wenaya-cart-v1";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as CartItem[];
    return [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

// ── Context ──

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ──

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const items = loadCart();
    if (items.length > 0) {
      dispatch({ type: "HYDRATE", payload: { items } });
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on every cart change (only after hydration)
  useEffect(() => {
    if (hydrated) {
      saveCart(state.items);
    }
  }, [state.items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { item, quantity } });
  }, []);

  const removeItem = useCallback((productSlug: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productSlug } });
  }, []);

  const updateQuantity = useCallback((productSlug: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productSlug, quantity } });
  }, []);

  const increment = useCallback((productSlug: string) => {
    dispatch({ type: "INCREMENT", payload: { productSlug } });
  }, []);

  const decrement = useCallback((productSlug: string) => {
    dispatch({ type: "DECREMENT", payload: { productSlug } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const isEmpty = state.items.length === 0;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        increment,
        decrement,
        clearCart,
        totalItems,
        subtotal,
        isEmpty,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ──

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
