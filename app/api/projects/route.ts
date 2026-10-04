import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Project from '../../../models/Project';
import { requireAdmin } from '../../../lib/admin-auth';
import { editorialInput, ProjectInputError, publishedFilter, publicProjection } from '../../../lib/project-editor';

export async function GET(request: NextRequest) {
  const admin = request.nextUrl.searchParams.get('view') === 'admin';
  if (admin) { const denied = requireAdmin(request); if (denied) return denied; }
  try {
    await connectDB();
    const placement = request.nextUrl.searchParams.get('placement');
    const filter = admin ? {} : { ...publishedFilter, ...(placement === 'playground' ? { placement: 'playground' } : placement === 'work' ? { placement: { $ne: 'playground' } } : {}) };
    const projects = await Project.find(filter).select(admin ? '' : publicProjection).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(projects, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Could not load projects. Check the database connection.' }, { status: 503 });
  }
}
export async function POST(request: NextRequest) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const input = editorialInput(await request.json());
    await connectDB();
    return NextResponse.json(await Project.create(input), { status: 201 });
  } catch (error) {
    const invalid = error instanceof ProjectInputError || error instanceof SyntaxError;
    return NextResponse.json({ error: invalid ? error.message : 'Could not save the project.' }, { status: invalid ? 400 : 500 });
  }
}
