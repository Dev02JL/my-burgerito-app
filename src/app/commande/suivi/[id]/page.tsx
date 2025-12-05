'use client';

import dynamic from 'next/dynamic';
import { use } from 'react';

type Params = { params: Promise<{ id: string }> };

const Tracker = dynamic(() => import('@/components/OrderRealtimeTracker'), { ssr: false });

export default function CommandeSuiviPage({ params }: Params) {
  const { id } = use(params);
  return <Tracker orderId={id} />;
}
