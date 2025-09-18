export default function ConnexionPage() {
  return (
    <main className="container-page py-16">
      <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-center" style={{ fontFamily: "var(--font-display)" }}>
        Je me connecte
      </h1>

      <form className="mx-auto mt-10 w-full max-w-3xl">
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
          <button type="submit" className="mt-8 h-12 w-[360px] rounded-[12px] btn-accent font-medium">Connexion</button>
        </div>
      </form>
    </main>
  );
}


