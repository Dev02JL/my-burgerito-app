"use client";

import React from "react";
import type { JSX } from "react";
import { useCart } from "@/lib/cart";

type Props = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export default function AddToCartButton({ id, title, price, image }: Props): JSX.Element {
  const { add } = useCart();
  return (
    <button
      onClick={() => {
        add({ id, title, price, image });
        if (typeof window !== "undefined") window.dispatchEvent(new Event("cart:added"));
      }}
      className="h-9 rounded-full px-4 text-sm btn-accent font-medium"
    >
      Ajouter au panier
    </button>
  );
}


