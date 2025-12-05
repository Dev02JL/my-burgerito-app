'use client';

import Image from 'next/image';
import React from 'react';
import { useCart } from '@/lib/cart';
import Link from 'next/link';
import type { JSX } from 'react';
import { Info } from 'lucide-react';

export type Product = {
  id: number;
  title: string;
  price: string;
  image: string;
  available?: boolean;
};

export default function ProductCard({ product }: { product: Product }): JSX.Element {
  const { add } = useCart();
  const slug = `${product.title.toLowerCase().replace(/\s+/g, '-')}-${product.id}`;
  return (
    <div className="card p-3">
      <Link href={`/burger/${slug}`} className="block group">
        <div className="relative h-[140px] w-full overflow-hidden rounded-[12px]">
          <Image
            src={product.image}
            alt={product.title}
            fill
            unoptimized
            className="object-cover transition-transform group-hover:scale-[1.02]"
          />
          {product.available === false && (
            <span className="absolute bottom-2 left-2 rounded-md bg-[#ef4444] text-white text-[11px] font-medium px-2 py-1 shadow">
              Produit indisponible
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-sm leading-tight group-hover:underline">{product.title}</p>
          <p className="text-xs text-white/70">{product.price}</p>
        </div>
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <Link
          href={`/burger/${slug}`}
          className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition"
          aria-label="Voir les détails du produit"
          title="Détails"
        >
          <Info size={16} className="text-white/80" />
        </Link>
        <button
          type="button"
          onClick={() => {
            add({
              id: product.id,
              title: product.title,
              price: parseFloat(product.price.replace(/[€\s,]/g, (m) => (m === ',' ? '.' : ''))),
              image: product.image,
            });
            if (typeof window !== 'undefined') window.dispatchEvent(new Event('cart:added'));
          }}
          disabled={product.available === false}
          aria-disabled={product.available === false}
          className={`h-8 rounded-md px-3 text-xs btn-accent font-medium ${product.available === false ? 'opacity-50 pointer-events-none' : ''}`}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
