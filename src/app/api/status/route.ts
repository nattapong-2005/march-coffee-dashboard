import { NextResponse } from 'next/server';
import { testConnection, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const conn = await testConnection();
  if (!conn.ok) {
    return NextResponse.json(
      {
        status: 'disconnected',
        database: 'Supabase PostgreSQL',
        error: conn.error,
        latencyMs: conn.latencyMs,
      },
      { status: 500 }
    );
  }

  try {
    const counts = await query<{
      orders_count: string;
      items_count: string;
      menu_count: string;
      payments_count: string;
      users_count: string;
    }>(`
      SELECT
        (SELECT count(*) FROM orders) as orders_count,
        (SELECT count(*) FROM order_items) as items_count,
        (SELECT count(*) FROM menu_items) as menu_count,
        (SELECT count(*) FROM payments) as payments_count,
        (SELECT count(*) FROM users) as users_count
    `);

    return NextResponse.json({
      status: 'connected',
      database: 'Supabase PostgreSQL (Java POS Synced)',
      latencyMs: conn.latencyMs,
      counts: {
        orders: Number(counts[0]?.orders_count || 0),
        orderItems: Number(counts[0]?.items_count || 0),
        menuItems: Number(counts[0]?.menu_count || 0),
        payments: Number(counts[0]?.payments_count || 0),
        users: Number(counts[0]?.users_count || 0),
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 'connected',
      database: 'Supabase PostgreSQL',
      latencyMs: conn.latencyMs,
      error: String(error),
    });
  }
}
