import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Get the most recent personal info (assuming only one record)
    const personalInfo = await db.collection('personalInfo').findOne({}, { sort: { updatedAt: -1 } });
    
    if (!personalInfo) {
      return NextResponse.json({ error: 'No personal information found' }, { status: 404 });
    }
    
    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error('Error fetching personal info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    
    // Validate required fields
    const { hobbies, favoriteAnime, favoriteShows, waifu, favoriteGames, favoriteMusic, otherInterests } = body;
    
    if (!hobbies || !favoriteAnime || !favoriteShows || !waifu || !favoriteGames || !favoriteMusic || !otherInterests) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    const personalInfo = {
      hobbies: hobbies || [],
      favoriteAnime: favoriteAnime || [],
      favoriteShows: favoriteShows || [],
      waifu: waifu || [],
      favoriteGames: favoriteGames || [],
      favoriteMusic: favoriteMusic || [],
      otherInterests: otherInterests || [],
      updatedAt: new Date().toISOString()
    };
    
    const result = await db.collection('personalInfo').insertOne(personalInfo);
    
    return NextResponse.json({
      _id: result.insertedId,
      ...personalInfo
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating personal info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    
    // Validate required fields
    const { _id, hobbies, favoriteAnime, favoriteShows, waifu, favoriteGames, favoriteMusic, otherInterests } = body;
    
    if (!_id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
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
      { _id: _id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Personal info not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      _id,
      ...updateData
    });
  } catch (error) {
    console.error('Error updating personal info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
