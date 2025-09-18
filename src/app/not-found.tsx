import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-page py-24 flex flex-col items-center text-center">
      <h1 className="text-6xl md:text-8xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
        Page 404
      </h1>
      <p className="mt-4 text-white/70 max-w-prose">
        La page que vous cherchez est introuvable.
      </p>
      <Link href="/" className="mt-8 h-12 rounded-[12px] px-6 btn-accent inline-flex items-center">
        Retour à l’accueil
      </Link>
    </main>
  );
}


