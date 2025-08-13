'use client';

import React from 'react';
import StormTracker from '../../components/StormTracker';

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🌊 Live Tropical Storm Tracker
          </h1>
          <p className="text-xl text-blue-100">
            Real-time tracking of Tropical Storm ERIN with live NHC tracking maps and updates
          </p>
        </div>

        {/* Hurricane Tracker */}
        <StormTracker />
      </div>
    </div>
  );
}
