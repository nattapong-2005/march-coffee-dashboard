import { NextResponse } from 'next/server';
import { getReportsData } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getReportsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API /api/reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports data' },
      { status: 500 }
    );
  }
}
