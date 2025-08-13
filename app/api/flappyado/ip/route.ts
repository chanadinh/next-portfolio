import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get IP from various headers (for different hosting environments)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    
    let ip = 'unknown';
    
    if (forwarded) {
      ip = forwarded.split(',')[0].trim();
    } else if (realIP) {
      ip = realIP;
    } else if (cfConnectingIP) {
      ip = cfConnectingIP;
    } else {
      // Fallback for local development
      ip = '127.0.0.1';
    }

    return NextResponse.json({ 
      success: true, 
      ip,
      headers: {
        forwarded,
        realIP,
        cfConnectingIP
      }
    });
  } catch (error) {
    console.error('Error getting IP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get IP address' },
      { status: 500 }
    );
  }
}
