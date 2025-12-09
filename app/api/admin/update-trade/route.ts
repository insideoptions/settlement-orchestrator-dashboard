import { NextRequest, NextResponse } from 'next/server';

const LAMBDA_URL = 'https://pu3qevb4iuuqqhgjgzswmmgkxe0xzmkq.lambda-url.us-east-1.on.aws/';

export async function POST(request: NextRequest) {
  try {
    const { id, symbol, updates } = await request.json();
    
    if (!id || !symbol || !updates) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call Lambda function with updateTrade action
    const response = await fetch(LAMBDA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminAction: 'updateTrade',
        tradeId: id,
        symbol: symbol,
        ...updates  // Spread all the update fields
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { error: data.error || 'Failed to update trade' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating trade:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
