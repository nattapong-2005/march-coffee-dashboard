import { NextResponse } from 'next/server';
import { getOrdersData } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getOrdersData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API /api/orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders data' },
      { status: 500 }
    );
  }
}
