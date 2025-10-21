import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 簡易版: サーバールートでの保護はAPI側で行い、画面はサインインページで守る
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const isApiAuth = url.pathname.startsWith('/api/auth');
  if (isApiAuth) return NextResponse.next();

  // allowlist は実サーバでセッションから評価（ここでは通過）。
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};


