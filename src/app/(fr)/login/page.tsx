/**
 * Login Page — admin entry point. Authenticates with username + password,
 * stores token in localStorage, and redirects to /admin dashboard.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("wenaya_admin_token", data.token);
      localStorage.setItem("wenaya_admin_user", JSON.stringify({ username: data.username, name: data.name }));
      router.push("/admin");
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col">
      <div className="flex-1 bg-[#F2EFE9] flex items-center justify-center px-6 pt-24 pb-20">
        <div className="w-full max-w-md">
          <div
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-[#0B1220]/[0.06]"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.06)" }}
          >
            <div className="text-center mb-8">
              <h1>
                <Link href="/" className="inline-block heading-serif text-[#0B1220] text-[clamp(1.5rem,3vw,2rem)]">
                  Wenaya
                </Link>
              </h1>
              <p className="text-[#2B2F36]/50 text-sm mt-1">Admin access</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[#0B1220]/60 text-xs font-medium tracking-wide mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoFocus
                  className="w-full rounded-xl border border-[#0B1220]/[0.08] bg-white/80 px-4 py-3 text-sm text-[#0B1220] placeholder-[#0B1220]/25 outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)]"
                />
              </div>

              <div>
                <label className="block text-[#0B1220]/60 text-xs font-medium tracking-wide mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-[#0B1220]/[0.08] bg-white/80 px-4 py-3 text-sm text-[#0B1220] placeholder-[#0B1220]/25 outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)]"
                />
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full h-11 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0 disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 4px 16px rgba(184,138,90,0.28)",
                }}
              >
                {loading ? "..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
