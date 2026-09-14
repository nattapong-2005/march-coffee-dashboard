import { getReportsData } from '@/lib/db-service';
import { ReportsView } from './reports-view';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const data = await getReportsData();
  return <ReportsView initialData={data} />;
}
