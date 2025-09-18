import OrderStatusView from "@/components/OrderStatusView";

type Params = { params: Promise<{ etat: string }> };

const MAP: Record<string, { title: string; subtitle?: string; icon: string }> = {
  preparation: { title: "Votre commande est en préparation", icon: "🍳" },
  cuisson: { title: "Votre commande est en cuisson", icon: "🔥" },
  prete: { title: "Votre commande est prête", subtitle: "pour être livrée", icon: "🚚" },
  livree: { title: "Votre commande a été livré!", icon: "✅" },
};

export default async function CommandeEtatPage({ params }: Params) {
  const { etat } = await params;
  const key = etat as keyof typeof MAP;
  const conf = MAP[key] ?? MAP.preparation;
  return <OrderStatusView title={conf.title} subtitle={conf.subtitle} icon={<span>{conf.icon}</span>} />;
}


