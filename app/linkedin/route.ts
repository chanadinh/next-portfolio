import { NextResponse } from 'next/server';
import { getProfileSettings, normalizeLinkedinUrl } from '../../lib/profile-settings';
import { DEFAULT_LINKEDIN_URL } from '../../lib/profile-types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'no-store' };

export async function GET() {
  try {
    const url = process.env.MONGODB_URI ? (await getProfileSettings()).linkedinUrl : DEFAULT_LINKEDIN_URL;
    return NextResponse.redirect(normalizeLinkedinUrl(url), { status: 307, headers });
  } catch { return new NextResponse('The LinkedIn link is temporarily unavailable. Please try again shortly.', { status: 503, headers }); }
}
