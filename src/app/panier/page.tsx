"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { ArrowLeft } from "lucide-react";

function formatEUR(value: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export default function PanierPage() {
  const { items, remove, total } = useCart();

  return (
    <main className="container-page py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-3 text-sm text-white/70 hover:text-white/90 transition-colors">
        <ArrowLeft size={20} className="text-white/60" aria-hidden />
        <span>Retour à l’accueil</span>
      </Link>
      <h1
        className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Panier
      </h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="flex flex-col gap-4">
          {items.length === 0 && (
            <div className="card p-6 text-white/70">Votre panier est vide.</div>
          )}
          {items.map((it) => (
            <div key={it.id} className="card p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image src={it.image} alt={it.title} fill className="object-cover" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-base font-medium">{it.title}</div>
                    <div className="text-sm text-white/70">{formatEUR(it.price)} × {it.qty}</div>
                  </div>
                </div>
                <button
                  onClick={() => remove(it.id)}
                  className="h-9 rounded-md px-4 text-sm bg-[#ef4444] text-white hover:bg-[#dc2626]"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="card p-6 sticky top-8">
          <div className="text-sm text-white/70">Récapitulatif</div>
          <div className="mt-2 text-base">Totale</div>
          <div className="mt-1 text-3xl font-extrabold tracking-tight">{formatEUR(total)}</div>
          <Link
            href="/commande/preparation"
            className={`mt-6 h-12 w-full rounded-md btn-accent font-semibold inline-flex items-center justify-center ${total === 0 ? "opacity-50 pointer-events-none" : ""}`}
          >
            Commander
          </Link>
        </aside>
      </div>
    </main>
  );
}


