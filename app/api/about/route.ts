import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import About from '../../../models/About';

export async function GET() {
  try {
    await connectDB();
    const about = await About.findOne({}).sort({ order: 1 });
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const about = await About.create(body);
    return NextResponse.json(about, { status: 201 });
  } catch (error) {
    console.error('Error creating about:', error);
    return NextResponse.json(
      { error: 'Failed to create about' },
      { status: 500 }
    );
  }
}
