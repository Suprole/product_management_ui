import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const path = req.nextUrl.searchParams.get('path') || '/';
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }
  try {
    // Next 14 App Router: revalidateTag/path ではなく ISR をページ側で設定推奨。
    // ここでは no-op とし、将来の拡張ポイントにする。
    return NextResponse.json({ revalidated: true, path });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'error' }, { status: 500 });
  }
}


