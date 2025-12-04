import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function POST(request: NextRequest) {
  try {
    const { symbol, level } = await request.json();

    if (!symbol || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE bot_config SET current_level = $1 WHERE symbol = $2 RETURNING *`,
      [level, symbol]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Bot config not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      config: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating bot level:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
