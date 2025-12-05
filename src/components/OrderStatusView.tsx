import Link from 'next/link';

type Props = {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
};

export default function OrderStatusView({ icon, title, subtitle }: Props) {
  return (
    <main className="container-page py-16 flex flex-col items-center">
      <div className="text-6xl" aria-hidden>
        {icon}
      </div>
      <h1
        className="mt-4 text-4xl sm:text-5xl font-extrabold text-center"
        style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}
      >
        {title}
      </h1>
      {subtitle ? <div className="mt-1 text-center text-lg font-semibold">{subtitle}</div> : null}
      <Link href="/" className="mt-6 h-10 rounded-md px-4 btn-accent inline-flex items-center">
        Retour à l’accueil
      </Link>
    </main>
  );
}
