import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LAMBDA_URL = 'https://pu3qevb4iuuqqhgjgzswmmgkxe0xzmkq.lambda-url.us-east-1.on.aws/';

export async function GET() {
  try {
    // Fetch both SPX and RUT configs
    const [spxRes, rutRes] = await Promise.all([
      fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: 'SPXW', adminAction: 'getConfig' })
      }),
      fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: 'RUT', adminAction: 'getConfig' })
      })
    ]);

    const spxData = await spxRes.json();
    const rutData = await rutRes.json();

    const configs = [];
    if (spxData.success && spxData.data) {
      configs.push(spxData.data);
    }
    if (rutData.success && rutData.data) {
      configs.push(rutData.data);
    }

    return NextResponse.json(configs);
  } catch (error) {
    console.error('Error fetching configs:', error);
    return NextResponse.json({ error: 'Failed to fetch configs' }, { status: 500 });
  }
}
