import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HighScore from '@/models/HighScore';

// GET - Retrieve top high scores or scores for specific IP
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');
    
    if (ip) {
      // Get scores for specific IP address
      const ipScores = await HighScore.find({ userIP: ip })
        .sort({ score: -1, createdAt: -1 })
        .select('name score createdAt')
        .lean();
      
      return NextResponse.json({ success: true, scores: ipScores });
    } else {
      // Get top 10 scores globally
      const topScores = await HighScore.find()
        .sort({ score: -1, createdAt: -1 })
        .limit(10)
        .select('name score createdAt userIP')
        .lean();

      return NextResponse.json({ success: true, scores: topScores });
    }
  } catch (error) {
    console.error('Error fetching high scores:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch high scores' },
      { status: 500 }
    );
  }
}

// POST - Save or update a high score
export async function POST(request: NextRequest) {
  try {
    const { name, score, userIP } = await request.json();

    if (!name || typeof score !== 'number' || !userIP) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if this IP already has a record
    const existingScore = await HighScore.findOne({ userIP }).sort({ score: -1 });
    
    if (existingScore) {
      // IP exists - only update if new score is higher
      if (existingScore.score >= score) {
        return NextResponse.json({
          success: false,
          message: 'Score not high enough to update',
          currentHighScore: existingScore.score
        });
      }
      
      // Update existing record with new score
      existingScore.score = score;
      existingScore.name = name.trim(); // Update name in case it changed
      existingScore.createdAt = new Date(); // Update timestamp
      await existingScore.save();
      
      console.log('📝 Updated existing record for IP:', userIP, 'New score:', score);
      
      // Get updated top scores
      const topScores = await HighScore.find()
        .sort({ score: -1, createdAt: -1 })
        .limit(10)
        .select('name score createdAt userIP')
        .lean();

      return NextResponse.json({
        success: true,
        message: 'High score updated successfully',
        updatedScore: existingScore,
        topScores
      });
      
    } else {
      // IP doesn't exist - create new record
      const newHighScore = new HighScore({
        name: name.trim(),
        score,
        userIP
      });

      await newHighScore.save();
      
      console.log('🆕 Created new record for IP:', userIP, 'Score:', score);

      // Get updated top scores
      const topScores = await HighScore.find()
        .sort({ score: -1, createdAt: -1 })
        .limit(10)
        .select('name score createdAt userIP')
        .lean();

      return NextResponse.json({
        success: true,
        message: 'High score created successfully',
        newScore: newHighScore,
        topScores
      });
    }

  } catch (error) {
    console.error('Error saving high score:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save high score' },
      { status: 500 }
    );
  }
}
