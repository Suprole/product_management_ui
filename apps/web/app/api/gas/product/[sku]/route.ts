import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { sku: string } }) {
  const base = process.env.GAS_API_BASE!;
  const key  = process.env.GAS_API_KEY!;
  const from = req.nextUrl.searchParams.get('from') ?? '';
  const to   = req.nextUrl.searchParams.get('to') ?? '';
  const grain= req.nextUrl.searchParams.get('grain') ?? 'day';

  const url = new URL(base);
  url.searchParams.set('path','product');
  url.searchParams.set('key', key);
  url.searchParams.set('sku', params.sku);
  if (from) url.searchParams.set('from', from);
  if (to)   url.searchParams.set('to', to);
  url.searchParams.set('grain', grain);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  const data = await res.json();
  const status = (typeof data._status === 'number' && data._status >= 400) ? data._status : 200;
  return NextResponse.json(data, { status });
}


