import { NextRequest, NextResponse } from 'next/server';
import Profile from '../../models/ProfileSettings';
import { profileDatabase } from '../../lib/profile-settings';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

export async function GET(request: NextRequest) {
  const fallback = () => NextResponse.redirect(new URL('/resume.pdf', request.url), { status: 307, headers });
  if (!process.env.MONGODB_URI) return fallback();
  try {
    await profileDatabase();
    const profile = await Profile.findById('portfolio').select('+resumeData');
    if (!profile?.resumeData) return fallback();
    return new NextResponse(new Uint8Array(profile.resumeData), { headers: { ...headers, 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="Chan-Dinh-Resume.pdf"', 'Content-Length': String(profile.resumeData.length) } });
  } catch { return new NextResponse('The résumé is temporarily unavailable. Please try again shortly.', { status: 503, headers }); }
}
