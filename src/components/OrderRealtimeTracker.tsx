'use client';

import { useEffect, useMemo, useState } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';

type Props = { orderId: string };
type StateKey = 'preparation' | 'cuisson' | 'prete' | 'livree';

const LABELS: Record<StateKey, string> = {
  preparation: 'En préparation',
  cuisson: 'En cuisson',
  prete: 'Prête à être livrée',
  livree: 'Livrée',
};

export default function OrderRealtimeTracker({ orderId }: Props): JSX.Element {
  const [current, setCurrent] = useState<StateKey>('preparation');
  const [connected, setConnected] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const url = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `/api/order-status/${encodeURIComponent(orderId)}`;
  }, [orderId]);

  useEffect(() => {
    if (!url) return;
    const es = new EventSource(url);
    setConnected(true);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as { state?: StateKey };
        if (data?.state) {
          setCurrent(data.state);
          if (data.state === 'livree') setDone(true);
        }
      } catch {
        // ignore
      }
    };
    es.onerror = () => {
      setConnected(false);
      es.close();
    };
    return () => {
      es.close();
    };
  }, [url]);

  const steps: StateKey[] = ['preparation', 'cuisson', 'prete', 'livree'];

  return (
    <div className="container-page py-10" role="region" aria-live="polite" aria-atomic="true">
      <h1
        className="text-4xl sm:text-5xl font-extrabold tracking-tight"
        style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}
      >
        Suivi de commande
      </h1>
      <p className="mt-1 text-white/70 text-sm">
        Commande #{orderId} — {connected ? 'en temps réel' : 'déconnecté'}
      </p>

      <ol className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((k) => {
          const reached = steps.indexOf(k) <= steps.indexOf(current);
          return (
            <li key={k} className={`card p-4 ${reached ? 'border-white/30' : 'border-white/10'}`}>
              <div className="text-base font-semibold">{LABELS[k]}</div>
              <div className={`text-xs mt-1 ${reached ? 'text-green-400' : 'text-white/60'}`}>
                {reached ? 'Atteint' : 'En attente'}
              </div>
            </li>
          );
        })}
      </ol>

      {done ? (
        <div className="mt-8">
          <Link
            href="/commande/livree"
            className="h-10 rounded-md px-4 btn-accent inline-flex items-center"
          >
            Voir le récapitulatif
          </Link>
        </div>
      ) : null}
    </div>
  );
}
