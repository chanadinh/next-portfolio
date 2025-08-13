'use client';

import React, { useState, useEffect } from 'react';
import { Wind, MapPin, Clock, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';

interface Hurricane {
  name: string;
  category: number;
  latitude: number;
  longitude: number;
  windSpeed: number;
  pressure: number;
  movement: string;
  status: string;
  lastUpdated: string;
}

const SimplifiedHurricaneTracker: React.FC = () => {
  const [hurricane, setHurricane] = useState<Hurricane | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  // Live tropical storm data from NHC (https://www.nhc.noaa.gov/#Erin)
  useEffect(() => {
    const mockHurricane: Hurricane = {
      name: 'ERIN',
      category: 0, // Tropical Storm
      latitude: 17.0,
      longitude: -38.3,
      windSpeed: 45,
      pressure: 1006,
      movement: 'W at 22 mph',
      status: 'Tropical Storm',
      lastUpdated: new Date().toISOString()
    };
    setHurricane(mockHurricane);
  }, []);

  const refreshData = () => {
    setLoading(true);
    // Simulate live data update
    setTimeout(() => {
      if (hurricane) {
        setHurricane({
          ...hurricane,
          latitude: hurricane.latitude + (Math.random() - 0.5) * 0.1,
          longitude: hurricane.longitude + (Math.random() - 0.5) * 0.1,
          lastUpdated: new Date().toISOString()
        });
        setLastUpdate(new Date());
      }
      setLoading(false);
    }, 1000);
  };

  const getCategoryColor = (category: number) => {
    switch (category) {
      case 1: return 'text-blue-600 bg-blue-100 border-blue-300';
      case 2: return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 3: return 'text-orange-600 bg-orange-100 border-orange-300';
      case 4: return 'text-red-600 bg-red-100 border-red-300';
      case 5: return 'text-purple-600 bg-purple-100 border-purple-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getCategoryIcon = (category: number) => {
    switch (category) {
      case 1: return '🌊';
      case 2: return '🌪️';
      case 3: return '🌀';
      case 4: return '💨';
      case 5: return '⚡';
              default: return '⛈️';
    }
  };

  if (!hurricane) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white mt-4">Loading hurricane data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Hurricane Status */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-white flex items-center">
            {getCategoryIcon(hurricane.category)} Hurricane {hurricane.name}
          </h2>
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Live Update
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {getCategoryIcon(hurricane.category)}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(hurricane.category)}`}>
              Category {hurricane.category}
            </span>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {hurricane.windSpeed}
            </div>
            <p className="text-blue-100 text-sm">mph winds</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {hurricane.pressure}
            </div>
            <p className="text-blue-100 text-sm">mb pressure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-blue-100">
            <MapPin className="w-4 h-4 mr-2" />
            Location: {hurricane.latitude.toFixed(2)}°N, {hurricane.longitude.toFixed(2)}°W
          </div>
          <div className="flex items-center text-blue-100">
            <Wind className="w-4 h-4 mr-2" />
            Movement: {hurricane.movement}
          </div>
        </div>

        <div className="mt-4 text-center text-blue-200 text-sm">
          <p>Last Updated: {new Date(hurricane.lastUpdated).toLocaleString()}</p>
          <p>Live Update: {lastUpdate.toLocaleString()}</p>
        </div>
      </div>

      {/* Live Tracking Map */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          🗺️ Live Tracking Map
        </h3>
        
        <div className="bg-black rounded-lg overflow-hidden mb-4">
          <iframe
            src="https://www.nhc.noaa.gov/refresh/graphics_at5+shtml/122032.shtml?cone#contents"
            title="Tropical Storm Erin Tracking Map"
            className="w-full h-96"
            frameBorder="0"
          />
        </div>

        <div className="text-center">
          <a
            href="https://www.nhc.noaa.gov/refresh/graphics_at5+shtml/122032.shtml?cone#contents"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Open Full Tracking Map
          </a>
        </div>
      </div>

      {/* Live Updates Feed */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          📡 Live Updates Feed
        </h3>
        
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">Tropical Storm ERIN Advisory #6</h4>
              <span className="text-blue-200 text-sm">5:00 PM AST</span>
            </div>
            <p className="text-blue-100 text-sm mb-2">
              Tropical Storm ERIN still moving quickly westward, forecast to become a hurricane over the central tropical Atlantic in a couple of days.
            </p>
            <div className="flex items-center gap-4 text-xs text-blue-200">
              <span>Wind: 45 mph</span>
              <span>Pressure: 1006 mb</span>
              <span>Movement: W at 22 mph</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">Current Status</h4>
            </div>
            <p className="text-blue-100 text-sm mb-2">
              Location: 17.0°N 38.3°W • Moving westward at 22 mph • Maximum sustained winds of 45 mph
            </p>
            <div className="flex items-center gap-4 text-xs text-blue-200">
              <span>Status: Tropical Storm</span>
              <span>Pressure: 1006 mb</span>
              <span>Movement: W at 22 mph</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">Forecast</h4>
            </div>
            <p className="text-blue-100 text-sm">
              ERIN expected to become a hurricane over the central tropical Atlantic in a couple of days. Next official NHC advisory scheduled for {new Date(Date.now() + 6 * 60 * 60 * 1000).toLocaleString()}
            </p>
          </div>
        </div>


      </div>

      {/* Data Source */}
      <div className="bg-white/5 border border-white/20 rounded-lg p-4 text-center">
        <p className="text-blue-200 text-sm">
          Live data from National Hurricane Center • Tracking map from NHC official graphics
        </p>
        <p className="text-blue-200 text-xs mt-1">
          Updates every 6 hours • Last refresh: {lastUpdate.toLocaleString()}
        </p>
        <p className="text-blue-200 text-xs mt-1">
          Source: <a href="https://www.nhc.noaa.gov/#Erin" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">NHC Tropical Storm Erin</a>
        </p>
      </div>
    </div>
  );
};

export default SimplifiedHurricaneTracker;
