"use client";
import React from "react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";
import type { JSX } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MiniCart from "@/components/MiniCart";

export default function Header(): JSX.Element {
  const router = useRouter();
  const { count } = useCart();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const autoCloseTimer = useRef<number | null>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function updateUser() {
      try {
        const res = await fetch(`/api/session/me`, { cache: "no-store" });
        if (res.status === 401 || res.status === 403) {
          setUserName(null);
          return;
        }
        if (!res.ok) {
          if (process.env.NODE_ENV !== "production") console.warn("/auth/me a échoué:", res.status);
          return;
        }
        type MeResponse = { user?: { name?: string } } | { name?: string };
        const data: MeResponse = await res.json().catch(() => ({}) as MeResponse);
        if ((data as any)?.user?.name) setUserName((data as any).user.name);
        else if ((data as any)?.name) setUserName((data as any).name);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.warn("/auth/me erreur réseau:", err);
      }
    }

    updateUser();
    const onAuthChanged = () => { void updateUser(); };
    window.addEventListener("auth:changed", onAuthChanged);
    const onCart = () => {
      setIsMiniCartOpen(true);
      if (autoCloseTimer.current) window.clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = window.setTimeout(() => setIsMiniCartOpen(false), 3000);
    };
    window.addEventListener("cart:added", onCart);
    return () => {
      window.removeEventListener("auth:changed", onAuthChanged);
      window.removeEventListener("cart:added", onCart);
      if (autoCloseTimer.current) window.clearTimeout(autoCloseTimer.current);
    };
  }, []);

  function logout() {
    fetch("/api/session/logout", { method: "POST" }).finally(() => {
      setUserName(null);
      window.dispatchEvent(new Event("auth:changed"));
      router.refresh();
    });
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
          <div className="relative">
            <Link
              href="/panier"
              className="relative inline-flex items-center justify-center h-9 w-9 rounded-md bg-white/10 hover:bg-white/20 transition"
              aria-label="Ouvrir le panier"
              title="Panier"
              onClick={(e) => {
                if (!(e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  setIsMiniCartOpen((v) => !v);
                }
              }}
            >
            <ShoppingCart size={18} className="text-white" />
            {mounted && count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ef4444] text-white text-[10px] leading-[18px] text-center">
                {count}
              </span>
            )}
            </Link>
            <MiniCart open={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
          </div>
          {userName ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="h-9 rounded-md px-3 text-sm inline-flex items-center bg-white/10 text-white hover:bg-white/20 transition" title="Voir mon profil">
                {userName}
              </Link>
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


