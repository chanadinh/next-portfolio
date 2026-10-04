import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminConfigured, adminCookieOptions, createAdminToken, equalSecret, isSameOrigin } from '../../../../lib/admin-auth';
// Per-instance backstop; configure a shared platform rate limit for multi-instance hosting.
const failures = new Map<string, { count: number; until: number }>();
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!adminConfigured()) return NextResponse.json({ error: 'Configure ADMIN_USERNAME, ADMIN_PASSWORD (12+ characters), and JWT_SECRET (32+ characters) on the server.' }, { status: 503 });
  const key = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  const now = Date.now();
  for (const [ip, record] of failures) if (record.until <= now) failures.delete(ip);
  const attempts = failures.get(key);
  if ((failures.size >= 1000 && !attempts) || (attempts && attempts.count >= 10)) {
    return NextResponse.json({ error: 'Too many sign-in attempts. Try again later.' }, { status: 429, headers: { 'Retry-After': '900' } });
  }
  let input;
  try { input = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const usernameMatches = equalSecret(input?.username, process.env.ADMIN_USERNAME!);
  const passwordMatches = equalSecret(input?.password, process.env.ADMIN_PASSWORD!);
  if (!usernameMatches || !passwordMatches) {
    failures.set(key, { count: (attempts?.count || 0) + 1, until: attempts?.until || now + 900_000 });
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }
  failures.delete(key);
  const response = NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  response.cookies.set(ADMIN_COOKIE, createAdminToken(), adminCookieOptions());
  return response;
}
