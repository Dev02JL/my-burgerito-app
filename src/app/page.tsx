import Image from "next/image";
import ProductCard, { Product } from "@/components/ProductCard";

function Hero() {
  return (
    <section className="container-page mt-6">
      <div className="relative overflow-hidden rounded-[16px] card">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1500&auto=format&fit=crop"
            alt="burger hero"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        <div className="relative p-6 sm:p-8">
          <p className="max-w-xl text-sm text-white/80">
            Lorem ipsum dolor sit amet consectetur. Velit netus tempor mattis sit mauris nunc adipiscing et massa. Maecenas vel facilisis orci turpis nunc.
          </p>
          <h1 className="mt-3 text-5xl sm:text-6xl font-extrabold tracking-tight" style={{ color: "#ffffff", fontFamily: "var(--font-display)" }}>
            BURGERITO
          </h1>
        </div>
      </div>
    </section>
  );
}

 

type ApiProduct = {
  id?: number | string;
  _id?: string;
  name?: string;
  title?: string;
  price?: number | string;
  prix?: number | string;
  imageUrl?: string;
  image?: string;
  isAvailable?: boolean;
};

type ApiList = { items?: ApiProduct[] } | ApiProduct[];

export default async function Home() {
  async function fetchBurgers(): Promise<Product[]> {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${base}/api/products`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Bad response");
      const data: ApiList = await res.json();
      const list: ApiProduct[] = Array.isArray(data) ? data : (data?.items ?? []);
      const toPrice = (value: unknown): string => {
        const num = typeof value === "number" ? value : Number(value);
        if (!isFinite(num)) return "€7,90";
        const formatted = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        return `€${formatted}`;
      };
      const toTitle = (item: ApiProduct): string => item?.name ?? item?.title ?? "Burger";
      const toImage = (item: ApiProduct): string => {
        const url = typeof item?.imageUrl === "string" ? item.imageUrl : (typeof item?.image === "string" ? item.image : "");
        return /^https?:\/\//.test(url)
          ? url
          : "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop";
      };

      return list.map((item: ApiProduct, idx: number) => ({
        id: Number(item?.id ?? item?._id),
        // Assure un id numérique pour ProductCard; fallback à l'index si NaN
        ...(Number.isFinite(Number(item?.id ?? item?._id)) ? {} : { id: idx + 1 }),
        title: toTitle(item),
        price: toPrice(item?.price ?? item?.prix),
        image: toImage(item),
        available: item.isAvailable ?? true,
      }));
    } catch {
      return Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        title: "Lorem ipsum",
        price: "€7,90",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
      }));
    }
  }

  const products = await fetchBurgers();

  return (
    <div className="min-h-screen">
      <main className="container-page py-6">
        <Hero />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </div>
  );
}
