import Image from 'next/image';

export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Image
        src="/logo.svg"
        alt="Burgerito"
        width={160}
        height={60}
        className="opacity-80 animate-pulse"
        priority
      />
    </main>
  );
}
