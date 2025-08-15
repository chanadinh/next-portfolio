'use client';

import React from 'react';

import Navigation from '../../components/Navigation';

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <Navigation />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🌤️ Weather Dashboard
            </h1>
            <p className="text-xl text-blue-100">
              Check current weather conditions and forecasts
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600 mb-4">Weather information will be displayed here.</p>
            <p className="text-sm text-gray-500">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
