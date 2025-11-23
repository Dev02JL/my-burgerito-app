"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

type Order = {
  id: string;
  createdAt: string;
  total: number;
};

type PopulatedItem = {
  id: string;
  priceAtPurchase: number;
  product?: {
    id?: string;
    name?: string;
    imageUrl?: string;
  } | null;
};

type OrderWithItems = Order & { items: PopulatedItem[] };

function formatEUR(value: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

function formatSectionDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(d);
}

export default function ProfilePage() {
  const [orders, setOrders] = useState<OrderWithItems[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = "";

    async function load() {
      try {
        const res = await fetch(`/api/proxy/orders/me`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data: { items?: Array<{ id: string; createdAt: string; total: number }> } = await res.json();
        const list = data.items ?? [];

        const withItems: OrderWithItems[] = await Promise.all(
          list.map(async (o) => {
            const itemsRes = await fetch(`/api/proxy/orders/${o.id}/items`, { cache: "no-store" });
            const itemsData: { items?: PopulatedItem[] } = itemsRes.ok ? await itemsRes.json() : { items: [] };
            return { id: o.id, createdAt: o.createdAt, total: o.total, items: itemsData.items ?? [] };
          })
        );

        setOrders(withItems);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inattendue");
        setOrders([]);
      }
    }

    void load();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, OrderWithItems[]>();
    (orders ?? []).forEach((o) => {
      const key = formatSectionDate(o.createdAt);
      const arr = map.get(key) ?? [];
      arr.push(o);
      map.set(key, arr);
    });
    return Array.from(map.entries());
  }, [orders]);

  return (
    <main className="container-page py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-3 text-sm text-white/70 hover:text-white/90 transition-colors">
        <ArrowLeft size={20} className="text-white/60" aria-hidden />
        <span>Retour à l’accueil</span>
      </Link>
      <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none" style={{ fontFamily: "var(--font-display)" }}>
        Profil
      </h1>

      {error ? <div className="mt-6 card p-4 text-red-300">{error}</div> : null}
      {orders === null ? (
        <div className="mt-8 text-white/70">Chargement…</div>
      ) : orders.length === 0 ? (
        <div className="mt-8 text-white/70">Aucune commande pour le moment.</div>
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          {grouped.map(([dateLabel, ords]) => (
            <section key={dateLabel} className="border-t border-white/10 pt-6">
              <h2 className="text-sm text-white/70">{dateLabel}</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ords.flatMap((o) =>
                  o.items.map((it) => {
                    const title = it.product?.name ?? "Article";
                    const image = it.product?.imageUrl ??
                      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop";
                    return (
                      <div key={`${o.id}:${it.id}`} className="card p-3">
                        <div className="relative h-[90px] w-full overflow-hidden rounded-[12px]">
                          <Image src={image} alt={title} fill unoptimized className="object-cover" />
                        </div>
                        <div className="mt-3">
                          <p className="text-sm leading-tight">{title}</p>
                          <p className="text-xs text-white/70">{formatEUR(it.priceAtPurchase)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}


