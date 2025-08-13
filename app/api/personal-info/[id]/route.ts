import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    
    // Validate ID
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const { hobbies, favoriteAnime, favoriteShows, waifu, favoriteGames, favoriteMusic, otherInterests } = body;
    
    const updateData = {
      hobbies: hobbies || [],
      favoriteAnime: favoriteAnime || [],
      favoriteShows: favoriteShows || [],
      waifu: waifu || [],
      favoriteGames: favoriteGames || [],
      favoriteMusic: favoriteMusic || [],
      otherInterests: otherInterests || [],
      updatedAt: new Date().toISOString()
    };
    
    const result = await db.collection('personalInfo').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Personal info not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      _id: params.id,
      ...updateData
    });
  } catch (error) {
    console.error('Error updating personal info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    
    // Validate ID
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const result = await db.collection('personalInfo').deleteOne({
      _id: new ObjectId(params.id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Personal info not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Personal info deleted successfully' });
  } catch (error) {
    console.error('Error deleting personal info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
