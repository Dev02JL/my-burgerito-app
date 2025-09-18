"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { JSX } from "react";

export type CartItem = {
  id: number;
  title: string;
  price: number; // euros
  image: string;
  qty: number;
};

type CartState = { items: CartItem[] };
type Action =
  | { type: "ADD"; item: Omit<CartItem, "qty">; qty?: number }
  | { type: "REMOVE"; id: number }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const qtyToAdd = action.qty ?? 1;
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + qtyToAdd } : i
          ),
        };
      }
      return {
        items: [...state.items, { ...action.item, qty: qtyToAdd }],
      };
    }
    case "REMOVE": {
      return { items: state.items.filter((i) => i.id !== action.id) };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<
  | (CartState & {
      add: (item: Omit<CartItem, "qty">, qty?: number) => void;
      remove: (id: number) => void;
      clear: () => void;
      total: number;
      count: number;
    })
  | null
>(null);

const STORAGE_KEY = "burgerito.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => {
    if (typeof window === "undefined") return { items: [] } as CartState;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartState) : { items: [] };
    } catch {
      return { items: [] };
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const api = useMemo(() => {
    const add = (item: Omit<CartItem, "qty">, qty?: number) => dispatch({ type: "ADD", item, qty });
    const remove = (id: number) => dispatch({ type: "REMOVE", id });
    const clear = () => dispatch({ type: "CLEAR" });
    const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const count = state.items.reduce((sum, i) => sum + i.qty, 0);
    return { ...state, add, remove, clear, total, count };
  }, [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


