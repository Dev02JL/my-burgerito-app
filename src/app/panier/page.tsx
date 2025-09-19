"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

function formatEUR(value: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export default function PanierPage() {
  const { items, remove, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function commander() {
    if (total === 0 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth.token") : null;
      if (!token) throw new Error("Vous devez être connecté");
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetch(`${base}/api/products`, { cache: "no-store" });
      if (!res.ok) throw new Error("Impossible de charger les produits");
      type ApiProduct = { _id?: string; name?: string };
      const data: { items?: ApiProduct[] } | ApiProduct[] = await res.json();
      const all: ApiProduct[] = Array.isArray(data) ? data : (data?.items ?? []);

      const norm = (s: string) => s.trim().toLowerCase();
      const nameToId = new Map<string, string>();
      all.forEach((p: ApiProduct) => {
        if (p?.name && p?._id) nameToId.set(norm(String(p.name)), String(p._id));
      });

      const apiItems: string[] = [];
      for (const it of items) {
        const id = nameToId.get(norm(it.title));
        if (!id) continue; // ignore si non trouvé
        for (let q = 0; q < it.qty; q += 1) apiItems.push(id);
      }

      if (apiItems.length === 0) throw new Error("Aucun article valide");

      const create = await fetch(`${base}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: apiItems }),
      });
      if (!create.ok) throw new Error(`Erreur commande ${create.status}`);

      clear();
      router.push("/commande/prete");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }

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
                    <Image src={it.image} alt={it.title} fill unoptimized className="object-cover" />
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
          <button
            onClick={commander}
            disabled={total === 0 || loading}
            className={`mt-6 h-12 w-full rounded-md btn-accent font-semibold inline-flex items-center justify-center ${total === 0 || loading ? "opacity-50 pointer-events-none" : ""}`}
          >
            {loading ? "En cours..." : "Commander"}
          </button>
          {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}
        </aside>
      </div>
    </main>
  );
}


