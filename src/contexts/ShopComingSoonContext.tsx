/**
 * ShopComingSoonContext — shared "shop coming soon" state.
 *
 * SHOP LAUNCH FREEZE: Commerce interactions are temporarily disabled. Any purchase
 * action should call openShopComingSoon() instead of mutating the cart, creating an
 * order, or navigating to checkout. The underlying cart/checkout implementation is
 * kept intact for future activation — this context only swaps the interaction layer.
 *
 * The provider mounts a single shared {@link ShopComingSoonModal} instance; consumers
 * use the {@link useShopComingSoon} hook from anywhere in the tree.
 */
"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ShopComingSoonModal from "@/components/shop/ShopComingSoonModal";

interface ShopComingSoonContextValue {
  openShopComingSoon: () => void;
  closeShopComingSoon: () => void;
}

const ShopComingSoonContext = createContext<ShopComingSoonContextValue | null>(null);

export function useShopComingSoon(): ShopComingSoonContextValue {
  const ctx = useContext(ShopComingSoonContext);
  if (!ctx) {
    throw new Error("useShopComingSoon must be used within a <ShopComingSoonProvider>");
  }
  return ctx;
}

export function ShopComingSoonProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openShopComingSoon = useCallback(() => setIsOpen(true), []);
  const closeShopComingSoon = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ openShopComingSoon, closeShopComingSoon }),
    [openShopComingSoon, closeShopComingSoon],
  );

  return (
    <ShopComingSoonContext.Provider value={value}>
      {children}
      <ShopComingSoonModal open={isOpen} onClose={closeShopComingSoon} />
    </ShopComingSoonContext.Provider>
  );
}