import jwt from 'jsonwebtoken';
import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
export const ADMIN_COOKIE = 'portfolio_admin';
const issuer = 'portfolio-admin';
const audience = 'portfolio-dashboard';
export const SESSION_SECONDS = 60 * 60 * 8;
export function adminConfigured() {
  const { ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET } = process.env;
  return Boolean(ADMIN_USERNAME && ADMIN_PASSWORD && ADMIN_PASSWORD.length >= 12 &&
    !ADMIN_PASSWORD.startsWith('your_') && JWT_SECRET && JWT_SECRET.length >= 32 && !JWT_SECRET.startsWith('your'));
}
export function equalSecret(actual: unknown, expected: string) {
  if (typeof actual !== 'string') return false;
  const a = Buffer.from(actual), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function createAdminToken() {
  if (!adminConfigured()) throw new Error('Admin credentials are not configured.');
  return jwt.sign({ role: 'admin' }, process.env.JWT_SECRET!, {
    algorithm: 'HS256', issuer, audience, subject: process.env.ADMIN_USERNAME!, expiresIn: SESSION_SECONDS,
  });
}
export function verifyAdminToken(token?: string) {
  if (!token || !adminConfigured()) return false;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'], issuer, audience });
    return typeof payload !== 'string' && payload.role === 'admin' &&
      payload.sub === process.env.ADMIN_USERNAME && typeof payload.exp === 'number';
  } catch { return false; }
}
export function isSameOrigin(request: NextRequest) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(process.env.APP_ORIGIN || request.url).origin;
}
export function requireAdmin(request: NextRequest) {
  if (!verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Please sign in to the dashboard.' }, { status: 401 });
  }
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && !isSameOrigin(request)) {
    return NextResponse.json({ error: 'Cross-origin changes are not allowed.' }, { status: 403 });
  }
  return null;
}
export const adminCookieOptions = () => ({
  httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const,
  path: '/', maxAge: SESSION_SECONDS,
});
