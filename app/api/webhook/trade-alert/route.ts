import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate webhook secret (optional but recommended)
    const webhookSecret = request.headers.get('x-webhook-secret');
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return formatted data for Zapier
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for Zapier to test the webhook
export async function GET() {
  return NextResponse.json({
    message: 'Trade Alert Webhook Endpoint',
    status: 'active'
  });
}
