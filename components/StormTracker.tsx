'use client';

import React from 'react';
import SimplifiedHurricaneTracker from './SimplifiedHurricaneTracker';

const StormTracker: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hurricane Tracker Section */}
      <div>
        <SimplifiedHurricaneTracker />
      </div>
    </div>
  );
};

export default StormTracker;
