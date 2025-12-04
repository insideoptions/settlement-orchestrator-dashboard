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
    const { id, symbol, updates } = await request.json();

    if (!id || !symbol || !updates) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine which table to use
    const table = symbol === 'RUT' ? 'trade_alert_rut' : 'trade_alert';

    // Build the UPDATE query dynamically
    const allowedFields = [
      'level',
      'expiration',
      'call_buy_strike',
      'call_sell_strike',
      'put_sell_strike',
      'put_buy_strike',
      'credit',
      'max_risk',
      'entry_price',
      'call_delta',
      'put_delta',
      'status',
      'pnl',
      'settlement_price'
    ];

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        setClauses.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    values.push(id);
    const query = `
      UPDATE ${table}
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      trade: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating trade:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
