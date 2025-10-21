import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const base = process.env.GAS_API_BASE!;
  const key  = process.env.GAS_API_KEY!;
  const from = req.nextUrl.searchParams.get('from') ?? '';
  const to   = req.nextUrl.searchParams.get('to') ?? '';
  const grain= req.nextUrl.searchParams.get('grain') ?? 'day';

  const url = new URL(base);
  url.searchParams.set('path','dashboard');
  url.searchParams.set('key', key);
  if (from) url.searchParams.set('from', from);
  if (to)   url.searchParams.set('to', to);
  url.searchParams.set('grain', grain);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  const data = await res.json();
  const status = (typeof data._status === 'number' && data._status >= 400) ? data._status : 200;
  return NextResponse.json(data, { status });
}


