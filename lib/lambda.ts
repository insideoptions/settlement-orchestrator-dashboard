const LAMBDA_URL = 'https://pu3qevb4iuuqqhgjgzswmmgkxe0xzmkq.lambda-url.us-east-1.on.aws/';

export async function callLambda(payload: any) {
  const response = await fetch(LAMBDA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Lambda call failed');
  }
  
  return result.data;
}
