import { getOrdersData } from '@/lib/db-service';
import { OrdersView } from './orders-view';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const { orders, summary } = await getOrdersData();
  return <OrdersView initialOrders={orders} initialSummary={summary} />;
}
