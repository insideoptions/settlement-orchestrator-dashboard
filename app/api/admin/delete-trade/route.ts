import { NextRequest, NextResponse } from 'next/server';

const LAMBDA_URL = 'https://pu3qevb4iuuqqhgjgzswmmgkxe0xzmkq.lambda-url.us-east-1.on.aws/';

export async function POST(request: NextRequest) {
  try {
    const { id, symbol } = await request.json();
    
    if (!id || !symbol) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call Lambda function instead of direct DB access
    const response = await fetch(LAMBDA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminAction: 'deleteTrade',
        tradeId: id,
        symbol: symbol
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { error: data.error || 'Failed to delete trade' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trade:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
