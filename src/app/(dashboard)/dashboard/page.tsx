import { getDashboardData } from '@/lib/db-service';
import { DashboardView } from './dashboard-view';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardView initialData={data} />;
}
