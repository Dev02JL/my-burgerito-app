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

 

export default function Home() {
  const products: Product[] = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: "Lorem ipsum",
    price: "€7,90",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
  }));

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
