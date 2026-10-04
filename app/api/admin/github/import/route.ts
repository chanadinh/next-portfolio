import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../lib/admin-auth';
import { GitHubError, readRepository } from '../../../../../lib/github';
import { importRepository } from '../../../../../lib/github-import';
import connectDB from '../../../../../lib/mongodb';

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request); if (denied) return denied;
  let input;
  try { input = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  try {
    const snapshot = await readRepository(input?.repoId);
    await connectDB();
    const project = await importRepository(snapshot);
    return NextResponse.json(project, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const known = error instanceof GitHubError;
    if (!known) console.error('GitHub import failed:', error);
    return NextResponse.json({ error: known ? error.message : 'Could not save the project. Check the database connection and retry.' }, {
      status: known ? error.status : 500, headers: known && error.retryAfter ? { 'Retry-After': error.retryAfter } : {},
    });
  }
}
