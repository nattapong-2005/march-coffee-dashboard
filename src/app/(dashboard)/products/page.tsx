import { getProductsData } from '@/lib/db-service';
import { ProductsView } from './products-view';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const { products } = await getProductsData();
  return <ProductsView initialProducts={products} />;
}
