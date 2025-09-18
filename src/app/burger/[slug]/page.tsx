import Image from "next/image";
import ProductCard, { Product } from "@/components/ProductCard";
import React from "react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

type Params = { params: Promise<{ slug: string }> };

export default async function BurgerDetail({ params }: Params) {
  const { slug } = await params;

  const idMatch = slug.match(/(\d+)$/);
  const productId = idMatch ? parseInt(idMatch[1], 10) : 1;
  const titlePart = slug.replace(/-\d+$/, "");
  const product = {
    id: productId,
    title: titlePart.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    price: "€8,85",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
  } satisfies Product;

  const suggestions: Product[] = Array.from({ length: 4 }).map((_, i) => ({
    id: i + 2,
    title: "Lorem ipsum",
    price: "€7,90",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
  }));

  return (
    <main className="container-page py-6">
      <div className="mb-6 text-sm text-white/80 flex items-center gap-2">
        <span aria-hidden>←</span>
        <Link href="/" className="hover:underline">Retour à l’accueil</Link>
      </div>

      <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{product.title}</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[420px_1fr] gap-6">
        <div className="relative w-full h-[260px] md:h-[320px] overflow-hidden rounded-[16px] card">
          <Image src={product.image} alt={product.title} fill className="object-cover" />
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-2 text-sm text-white/80 max-w-prose">
            Lorem ipsum dolor sit amet consectetur. Eros quis sed gravida volutpat dis mattis congue. Dictum id elementum eget
            commodo in nibh. Sit nullam aliquam in viverra commodo eget amet in faucibus pretium. Lobortis tempor nunc
            condimentum id varius metus accumsan at. Lectus tristique purus cubilia nibh commodo suscipit tortor.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-sm font-medium text-black shadow">
              {product.price}
            </div>
            <AddToCartButton
              id={product.id}
              title={product.title}
              price={parseFloat(product.price.replace(/[€\s,]/g, (m) => (m === "," ? "." : "")))}
              image={product.image}
            />
          </div>
        </div>
      </div>

      <h3 className="mt-10 text-xl font-semibold">Nos autres propositions</h3>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {suggestions.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}


