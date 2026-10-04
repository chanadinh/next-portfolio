import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminCookieOptions, isSameOrigin } from '../../../../lib/admin-auth';
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, '', { ...adminCookieOptions(), maxAge: 0 });
  return response;
}
