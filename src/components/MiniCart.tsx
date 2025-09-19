"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MiniCart({ open, onClose }: Props) {
  const { items, total, updateQty, remove } = useCart();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      const target = e.target as Node;
      if (open && ref.current && !ref.current.contains(target)) onClose();
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} className="absolute right-0 mt-2 w-[340px] rounded-[12px] bg-[#111] border border-white/10 shadow-xl p-3 z-50">
      <div className="max-h-[320px] overflow-auto flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="text-sm text-white/70">Votre panier est vide.</div>
        ) : (
          items.map((it) => (
            <div key={it.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-md">
                <Image src={it.image} alt={it.title} fill unoptimized className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-sm leading-tight">{it.title}</div>
                <div className="text-xs text-white/70">{(it.price).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-7 w-7 rounded-md bg-white/10" onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))}>-</button>
                <input
                  className="h-7 w-10 rounded-md bg-white/10 text-center"
                  value={it.qty}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isFinite(n)) updateQty(it.id, n);
                  }}
                />
                <button className="h-7 w-7 rounded-md bg-white/10" onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
              </div>
              <button className="text-xs text-red-400 ml-2" onClick={() => remove(it.id)}>Supprimer</button>
            </div>
          ))
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-base font-semibold">{total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</div>
        <div className="flex items-center gap-2">
          <Link href="/panier" className="h-9 rounded-md px-3 text-sm bg-white/10 hover:bg-white/20 inline-flex items-center">Voir panier</Link>
          <Link href="/commande/preparation" className="h-9 rounded-md px-3 text-sm btn-accent inline-flex items-center">Payer</Link>
        </div>
      </div>
    </div>
  );
}


