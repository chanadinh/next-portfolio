import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/admin-auth';
export async function GET(request: NextRequest) {
  return requireAdmin(request) || NextResponse.json({ authenticated: true }, { headers: { 'Cache-Control': 'no-store' } });
}
