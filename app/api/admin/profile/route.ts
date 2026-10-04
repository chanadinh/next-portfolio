import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/admin-auth';
import { getProfileSettings, ProfileInputError, saveLinkedinUrl } from '../../../../lib/profile-settings';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'no-store' };

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request); if (denied) return denied;
  try { return NextResponse.json(await getProfileSettings(), { headers }); }
  catch { return NextResponse.json({ error: 'Could not load your profile settings. Check the database connection and try again.' }, { status: 503, headers }); }
}

export async function PATCH(request: NextRequest) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some(key => key !== 'linkedinUrl')) throw new ProfileInputError('Send only your LinkedIn profile URL.');
    return NextResponse.json(await saveLinkedinUrl(body.linkedinUrl), { headers });
  } catch (error) {
    const invalid = error instanceof ProfileInputError || error instanceof SyntaxError;
    return NextResponse.json({ error: invalid ? error.message : 'Could not save your LinkedIn URL. Your previous link is unchanged.' }, { status: invalid ? 400 : 503, headers });
  }
}
