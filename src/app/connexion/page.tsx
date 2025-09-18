"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnexionPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submit() {
    setError(null);
    setOk(false);
    setLoading(true);
    const root = formRef.current;
    const payload = {
      email: String(root?.querySelector<HTMLInputElement>("#login-email")?.value || "").trim(),
      password: String(root?.querySelector<HTMLInputElement>("#login-password")?.value || ""),
    };
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://node-eemi.vercel.app";
      const res = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Connexion échouée");
      if (data?.token) localStorage.setItem("auth.token", data.token);
      // prévenir le Header que l'auth a changé
      if (typeof window !== "undefined") window.dispatchEvent(new Event("auth:changed"));
      setOk(true);
      setTimeout(() => router.push("/"), 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="container-page py-16">
      <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-center" style={{ fontFamily: "var(--font-display)" }}>
        Je me connecte
      </h1>

      <div className="mx-auto mt-10 w-full max-w-3xl" ref={formRef}>
        <div className="flex flex-col gap-4">
          <label className="sr-only" htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            name="email"
            className="h-12 md:h-14 w-full rounded-[12px] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]
                       bg-white/10 border border-white/10 placeholder-white/70 text-white text-center"
            placeholder="E-mail"
            type="email"
            autoComplete="email"
            required
          />
          <label className="sr-only" htmlFor="login-password">Mot de passe</label>
          <input
            id="login-password"
            name="password"
            className="h-12 md:h-14 w-full rounded-[12px] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]
                       bg-white/10 border border-white/10 placeholder-white/70 text-white text-center"
            placeholder="Mot de passe"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
          />
        </div>
        <div className="flex justify-center">
          <button type="button" onClick={submit} disabled={loading} className="mt-8 h-12 w-[360px] rounded-[12px] btn-accent font-medium disabled:opacity-60">
            {loading ? "En cours..." : "Connexion"}
          </button>
        </div>
        {error ? <p className="mt-4 text-center text-red-400 text-sm">{error}</p> : null}
        {ok ? <p className="mt-4 text-center text-green-400 text-sm">Connecté ! Redirection...</p> : null}
      </div>
    </main>
  );
}


