import client, { collectDefaultMetrics } from 'prom-client';

collectDefaultMetrics();

export async function GET() {
  const data = await client.register.metrics();
  return new Response( data );
}