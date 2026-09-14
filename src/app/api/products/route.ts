import { NextResponse } from 'next/server';
import { getProductsData } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getProductsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products data' },
      { status: 500 }
    );
  }
}
