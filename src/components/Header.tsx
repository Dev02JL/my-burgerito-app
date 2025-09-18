"use client";
import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";
import type { JSX } from "react";

export default function Header(): JSX.Element {
  const { count } = useCart();
  return (
    <header className="w-full border-b border-white/5">
      <div className="container-page flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex items-center">
            <div className="h-6 w-16 rounded bg-black/80 dark:bg-white/80" />
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
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ef4444] text-white text-[10px] leading-[18px] text-center">
                {count}
              </span>
            )}
          </Link>
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
        </div>
      </div>
    </header>
  );
}


