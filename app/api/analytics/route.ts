import { requireAdmin } from '../../../lib/admin-auth';
import { isAnalyticsRange } from '../../../lib/analytics-types';
import { AnalyticsError, getAnalytics } from '../../../lib/vercel-analytics';
import { NextRequest, NextResponse } from 'next/server';

const headers = { 'Cache-Control': 'no-store' };

async function respond(timeRange: unknown) {
  if (!isAnalyticsRange(timeRange)) {
    return NextResponse.json({ error: 'Choose 24h, 7d, or 30d.' }, { status: 400, headers });
  }
  try {
    return NextResponse.json(await getAnalytics(timeRange), { headers });
  } catch (error) {
    return NextResponse.json({
      status: 'unavailable',
      message: error instanceof AnalyticsError ? error.message : 'Analytics could not be loaded. Try again later.',
    }, { status: 502, headers });
  }
}

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  return respond(request.nextUrl.searchParams.get('timeRange') ?? '7d');
}

// Accept the earlier dashboard's POST method as well as read-only GET requests.
export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Send a valid JSON object.' }, { status: 400, headers }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Send a timeRange in a JSON object.' }, { status: 400, headers });
  }
  return respond('timeRange' in body ? body.timeRange : '7d');
}
