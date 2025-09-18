import Image from "next/image";
import ProductCard, { Product } from "@/components/ProductCard";
import React from "react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

type Params = { params: Promise<{ slug: string }> };

export default async function BurgerDetail({ params }: Params) {
  const { slug } = await params;
  const idMatch = slug.match(/(\d+)$/);
  const numericFromSlug = idMatch ? parseInt(idMatch[1], 10) : NaN;
  const titlePart = slug.replace(/-\d+$/, "");
  const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const listRes = await fetch(`${base}/api/products`, { next: { revalidate: 60 } });
  const listJson: unknown = listRes.ok ? await listRes.json().catch(() => ({ items: [] as unknown[] })) : ({ items: [] as unknown[] } as const);
  type ApiProduct = { id?: string; _id?: string; name?: string; price?: number | string; imageUrl?: string; isAvailable?: boolean };
  const items: Array<ApiProduct> = Array.isArray(listJson)
    ? (listJson as Array<ApiProduct>)
    : ((listJson as { items?: unknown[] })?.items as Array<ApiProduct> | undefined) ?? [];

  const sameTitle = (p: ApiProduct) => toSlug(String(p?.name ?? "")) === toSlug(titlePart);
  const currentIndex = Number.isFinite(numericFromSlug) ? numericFromSlug - 1 : -1;
  const chosen = items.find(sameTitle) ?? (currentIndex >= 0 ? items[currentIndex] : undefined);

  if (!chosen) {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  const priceNum = typeof chosen!.price === "number" ? chosen!.price : Number(chosen!.price);
  const priceStr = Number.isFinite(priceNum)
    ? `€${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(priceNum)}`
    : "€0,00";
  const image = typeof chosen!.imageUrl === "string" && /^https?:\/\//.test(chosen!.imageUrl as string)
    ? (chosen!.imageUrl as string)
    : "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop";

  const product: Product = {
    id: Number.isFinite(numericFromSlug) ? numericFromSlug : 1,
    title: String(chosen!.name || titlePart.replace(/-/g, " ")).replace(/\b\w/g, (c) => c.toUpperCase()),
    price: priceStr,
    image,
    available: (chosen as ApiProduct).isAvailable ?? true,
  };

  const suggestions: Product[] = items
    .filter((p) => p !== chosen)
    .slice(0, 8)
    .map((p, idx) => ({
      id: idx + 2,
      title: String(p.name || "Burger"),
      price: Number.isFinite(Number(p.price))
        ? `€${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(p.price))}`
        : "€7,90",
      image: typeof p.imageUrl === "string" && /^https?:\/\//.test(p.imageUrl)
        ? p.imageUrl
        : "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
      available: p.isAvailable ?? true,
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
          <Image src={product.image} alt={product.title} fill unoptimized className="object-cover" />
          {product.available === false && (
            <span className="absolute bottom-3 left-3 rounded-md bg-[#ef4444] text-white text-xs font-medium px-3 py-1 shadow">
              Produit indisponible
            </span>
          )}
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
            {product.available === false ? (
              <button
                className="h-9 rounded-full px-4 text-sm btn-accent font-medium opacity-50 pointer-events-none"
                aria-disabled
              >
                Ajouter au panier
              </button>
            ) : (
              <AddToCartButton id={product.id} title={product.title} price={priceNum} image={product.image} />
            )}
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


