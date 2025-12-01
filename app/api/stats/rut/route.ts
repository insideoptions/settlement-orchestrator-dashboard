import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_trades,
        COUNT(*) FILTER (WHERE status = 'Open') as open_trades,
        COUNT(*) FILTER (WHERE status = 'Closed') as closed_trades,
        COALESCE(SUM(pnl), 0) as total_pnl,
        COALESCE(AVG(pnl) FILTER (WHERE pnl > 0), 0) as avg_win,
        COALESCE(AVG(pnl) FILTER (WHERE pnl < 0), 0) as avg_loss,
        ROUND(
          (COUNT(*) FILTER (WHERE pnl > 0)::decimal / NULLIF(COUNT(*) FILTER (WHERE status = 'Closed'), 0)) * 100, 
          2
        ) as win_rate
      FROM trade_alert_rut
    `);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching RUT stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
