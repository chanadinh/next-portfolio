import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../lib/admin-auth';
import { discoverRepositories, GitHubError } from '../../../../../lib/github';

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const result = await discoverRepositories(Number(request.nextUrl.searchParams.get('page') || '1'));
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const known = error instanceof GitHubError;
    return NextResponse.json({ error: known ? error.message : 'Could not load repositories.' }, {
      status: known ? error.status : 500, headers: known && error.retryAfter ? { 'Retry-After': error.retryAfter } : {},
    });
  }
}
