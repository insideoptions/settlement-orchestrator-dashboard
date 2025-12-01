import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LAMBDA_URL = 'https://pu3qevb4iuuqqhgjgzswmmgkxe0xzmkq.lambda-url.us-east-1.on.aws/';

export async function GET() {
  try {
    const response = await fetch(LAMBDA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: 'RUT', adminAction: 'getConfig' })
    });
    
    const result = await response.json();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching RUT config:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
