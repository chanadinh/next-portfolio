import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache (in production, use Redis or similar)
const weatherCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const type = searchParams.get('type') || 'forecast';

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const cacheKey = `${type}_${lat}_${lon}`;
    const cached = weatherCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    let apiUrl: string;
    
    switch (type) {
      case 'points':
        apiUrl = `https://api.weather.gov/points/${lat},${lon}`;
        break;
      case 'forecast':
        // First get grid data, then forecast
        const gridResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
        if (!gridResponse.ok) {
          throw new Error('Failed to get grid data');
        }
        const gridData = await gridResponse.json();
        const { gridX, gridY, gridId } = gridData.properties;
        apiUrl = `https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`;
        break;
      case 'alerts':
        const alertsGridResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
        if (!alertsGridResponse.ok) {
          throw new Error('Failed to get grid data for alerts');
        }
        const alertsGridData = await alertsGridResponse.json();
        const { gridId: alertsGridId } = alertsGridData.properties;
        apiUrl = `https://api.weather.gov/alerts/active?area=${alertsGridId}`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'StormTracker/1.0 (https://chandinh.org)',
        'Accept': 'application/geo+json'
      }
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the response
    weatherCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

// Clean up old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of weatherCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      weatherCache.delete(key);
    }
  }
}, CACHE_DURATION);
