"use client";
import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";
import type { JSX } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header(): JSX.Element {
  const router = useRouter();
  const { count } = useCart();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function updateUser() {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth.token") : null;
      if (!token) {
        setUserName(null);
        return;
      }
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${base}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.status === 401 || res.status === 403) {
          try { localStorage.removeItem("auth.token"); } catch {}
          setUserName(null);
          return;
        }
        if (!res.ok) {
          if (process.env.NODE_ENV !== "production") console.warn("/auth/me a échoué:", res.status);
          return;
        }
        type MeResponse = { user?: { name?: string } };
        const data: MeResponse = await res.json().catch(() => ({}) as MeResponse);
        if (data?.user?.name) setUserName(data.user.name);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.warn("/auth/me erreur réseau:", err);
      }
    }

    updateUser();
    const onAuthChanged = () => { void updateUser(); };
    window.addEventListener("auth:changed", onAuthChanged);
    return () => window.removeEventListener("auth:changed", onAuthChanged);
  }, []);

  function logout() {
    try {
      localStorage.removeItem("auth.token");
    } catch {}
    setUserName(null);
    window.dispatchEvent(new Event("auth:changed"));
    router.refresh();
  }
  return (
    <header className="w-full border-b border-white/5">
      <div className="container-page flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex items-center">
            <Image src="/logo.svg" alt="Burgerito" width={128} height={24} priority />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/panier"
            className="relative inline-flex items-center justify-center h-9 w-9 rounded-md bg-white/10 hover:bg-white/20 transition"
            aria-label="Ouvrir le panier"
            title="Panier"
          >
            <ShoppingCart size={18} className="text-white" />
            {mounted && count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ef4444] text-white text-[10px] leading-[18px] text-center">
                {count}
              </span>
            )}
          </Link>
          {userName ? (
            <div className="flex items-center gap-2">
              <div className="h-9 rounded-md px-3 text-sm inline-flex items-center bg-white/10 text-white">
                {userName}
              </div>
              <button onClick={logout} className="h-9 rounded-md px-3 text-sm inline-flex items-center transition bg-white/20 text-white hover:bg-white/30">
                Déconnexion
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/inscription"
                className="h-9 rounded-md px-4 text-sm inline-flex items-center transition
                           bg-white/20 text-white hover:bg-white/30"
              >
                Inscription
              </Link>
              <Link href="/connexion" className="h-9 rounded-md px-4 text-sm btn-accent font-medium inline-flex items-center">
                Connexion
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


