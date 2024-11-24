// http://localhost:3000/でアクセスした場合、http://localhost:3000/homeにリダイレクトする
import { NextRequest, NextResponse } from 'next/server';
export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', req.url));
  }
}
