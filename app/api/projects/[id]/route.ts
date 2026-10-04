import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
import { requireAdmin } from '../../../../lib/admin-auth';
import { editorialInput, ProjectInputError, publishedFilter, publicProjection } from '../../../../lib/project-editor';
type Context = { params: Promise<{ id: string }> };
const missing = () => NextResponse.json({ error: 'Project not found.' }, { status: 404 });

export async function GET(request: NextRequest, { params }: Context) {
  const admin = request.nextUrl.searchParams.get('view') === 'admin';
  if (admin) { const denied = requireAdmin(request); if (denied) return denied; }
  const { id } = await params;
  if (!mongoose.isObjectIdOrHexString(id)) return missing();
  try {
    await connectDB();
    const project = await Project.findOne({ _id: id, ...(admin ? {} : publishedFilter) }).select(admin ? '' : publicProjection).lean();
    return project ? NextResponse.json(project, { headers: { 'Cache-Control': 'no-store' } }) : missing();
  } catch { return NextResponse.json({ error: 'Could not load project.' }, { status: 503 }); }
}
export async function PUT(request: NextRequest, { params }: Context) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { id } = await params;
  if (!mongoose.isObjectIdOrHexString(id)) return missing();
  try {
    const body = await request.json();
    await connectDB();
    const existing = await Project.findById(id).lean();
    if (!existing) return missing();
    const input = editorialInput(body, { ...existing, _id: String(existing._id) });
    const project = await Project.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).lean();
    return NextResponse.json(project);
  } catch (error) {
    const invalid = error instanceof ProjectInputError || error instanceof SyntaxError;
    return NextResponse.json({ error: invalid ? error.message : 'Could not update the project.' }, { status: invalid ? 400 : 500 });
  }
}
export async function DELETE(request: NextRequest, { params }: Context) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { id } = await params;
  if (!mongoose.isObjectIdOrHexString(id)) return missing();
  try {
    await connectDB();
    // Shared images can be reused by other entries. Removing a project does not delete remote assets.
    const result = await Project.findByIdAndDelete(id);
    return result ? NextResponse.json({ success: true }) : missing();
  } catch { return NextResponse.json({ error: 'Could not delete the project.' }, { status: 500 }); }
}
