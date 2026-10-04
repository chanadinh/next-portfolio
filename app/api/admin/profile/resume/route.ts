import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../lib/admin-auth';
import { ProfileInputError, readResumeUpload, saveResume } from '../../../../../lib/profile-settings';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request); if (denied) return denied;
  try { return NextResponse.json(await saveResume(await readResumeUpload(request)), { headers: { 'Cache-Control': 'no-store' } }); }
  catch (error) {
    return NextResponse.json({ error: error instanceof ProfileInputError ? error.message : 'Could not save your résumé. Please try again.' }, { status: error instanceof ProfileInputError ? error.status : 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
