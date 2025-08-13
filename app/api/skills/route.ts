import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Skill from '../../../models/Skill';

export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find({}).sort({ order: 1, category: 1 });
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.category || !body.proficiency) {
      return NextResponse.json(
        { error: 'Name, category, and proficiency are required' },
        { status: 400 }
      );
    }

    // Set default order if not provided
    if (body.order === undefined) {
      const maxOrder = await Skill.findOne({}).sort({ order: -1 }).select('order');
      body.order = maxOrder ? maxOrder.order + 1 : 0;
    }

    const skill = await Skill.create(body);
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    const skill = await Skill.findByIdAndUpdate(
      body._id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    const skill = await Skill.findByIdAndDelete(id);
    
    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}
