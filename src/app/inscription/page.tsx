'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InscriptionPage() {
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
      name: String(root?.querySelector<HTMLInputElement>('#register-name')?.value || '').trim(),
      email: String(root?.querySelector<HTMLInputElement>('#register-email')?.value || '').trim(),
      password: String(root?.querySelector<HTMLInputElement>('#register-password')?.value || ''),
    };
    try {
      const res = await fetch(`/api/session/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Inscription échouée');
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:changed'));
      setOk(true);
      setTimeout(() => router.push('/'), 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="container-page py-16">
      <h1
        className="text-6xl md:text-8xl font-extrabold text-center"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Je m’inscris
      </h1>

      <div className="mx-auto mt-10 w-full max-w-3xl" ref={formRef}>
        <div className="flex flex-col gap-4">
          <label className="sr-only" htmlFor="register-name">
            Nom
          </label>
          <input
            id="register-name"
            name="name"
            className="h-12 md:h-14 w-full rounded-[12px] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]
                       bg-white/10 dark:bg-white/10 border border-white/10
                       placeholder-white/70 text-white text-center"
            placeholder="Nom"
            type="text"
            autoComplete="name"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="sr-only" htmlFor="register-email">
                E-mail
              </label>
              <input
                id="register-email"
                name="email"
                className="h-12 md:h-14 w-full rounded-[12px] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]
                           bg-white/10 border border-white/10 placeholder-white/70 text-white text-center"
                placeholder="E-mail"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="register-password">
                Mot de passe
              </label>
              <input
                id="register-password"
                name="password"
                className="h-12 md:h-14 w-full rounded-[12px] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]
                           bg-white/10 border border-white/10 placeholder-white/70 text-white text-center"
                placeholder="Mot de passe"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="mt-8 h-12 w-[360px] rounded-[12px] btn-accent font-medium disabled:opacity-60"
          >
            {loading ? 'En cours...' : 'Confirmer'}
          </button>
        </div>
        {error ? <p className="mt-4 text-center text-red-400 text-sm">{error}</p> : null}
        {ok ? (
          <p className="mt-4 text-center text-green-400 text-sm">Compte créé ! Redirection...</p>
        ) : null}
      </div>
    </main>
  );
}
