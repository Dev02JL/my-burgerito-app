import dynamic from "next/dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function CommandeSuiviPage({ params }: Params) {
  const { id } = await params;
  const Tracker = dynamic(() => import("@/components/OrderRealtimeTracker"), { ssr: false });
  return <Tracker orderId={id} />;
}


