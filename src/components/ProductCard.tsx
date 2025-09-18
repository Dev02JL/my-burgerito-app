"use client";

import Image from "next/image";
import React from "react";
import { useCart } from "@/lib/cart";
import Link from "next/link";
import type { JSX } from "react";

export type Product = { id: number; title: string; price: string; image: string };

export default function ProductCard({ product }: { product: Product }): JSX.Element {
  const { add } = useCart();
  const slug = `${product.title.toLowerCase().replace(/\s+/g, "-")}-${product.id}`;
  return (
    <div className="card p-3">
      <Link href={`/burger/${slug}`} className="block group">
        <div className="relative h-[140px] w-full overflow-hidden rounded-[12px]">
          <Image src={product.image} alt={product.title} fill unoptimized className="object-cover transition-transform group-hover:scale-[1.02]" />
        </div>
        <div className="mt-3">
          <p className="text-sm leading-tight group-hover:underline">{product.title}</p>
          <p className="text-xs text-white/70">{product.price}</p>
        </div>
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-white/60 text-xs">
          <span>0</span>
        </div>
        <button
          onClick={() => add({ id: product.id, title: product.title, price: parseFloat(product.price.replace(/[€\s,]/g, (m) => (m === "," ? "." : ""))), image: product.image })}
          className="h-8 rounded-md px-3 text-xs btn-accent font-medium"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}


