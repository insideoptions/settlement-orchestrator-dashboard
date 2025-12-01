import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM bot_config_rut WHERE id = 1');
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching RUT config:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { is_enabled, current_level, min_delta, max_delta } = body;

    const result = await pool.query(
      `UPDATE bot_config_rut 
       SET is_enabled = $1, current_level = $2, min_delta = $3, max_delta = $4, updated_at = NOW() 
       WHERE id = 1 
       RETURNING *`,
      [is_enabled, current_level, min_delta, max_delta]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating RUT config:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
