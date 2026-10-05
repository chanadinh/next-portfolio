'use client'
import styles from './portfolio/editorial.module.css';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Eye, MousePointer, TrendingUp, Globe, Clock, Activity, AlertCircle } from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  visitors: number;
  topPages: Array<{ path: string; views: number }>;
  referrers: Array<{ source: string; visits: number }>;
  deviceTypes: Array<{ device: string; percentage: number }>;
  timeOnSite: number;
  bounceRate: number;
}

interface VercelAnalyticsData {
  pageViews: number;
  visitors: number;
  topPages: Array<{ path: string; views: number }>;
  referrers: Array<{ source: string; visits: number }>;
  deviceTypes: Array<{ device: string; percentage: number }>;
  timeOnSite: number;
  bounceRate: number;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch real Vercel Analytics data
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ timeRange }),
        });

        if (response.ok) {
          const realData: VercelAnalyticsData = await response.json();
          setAnalyticsData(realData);
          setIsRealData(true);
        } else {
          // Fallback to mock data if API fails
          throw new Error('Failed to fetch real analytics');
        }
      } catch (err) {
        console.warn('Using mock data as fallback:', err);
        setError('Real analytics unavailable - showing demo data');
        
        // Fallback to mock data
        const mockData: AnalyticsData = {
          pageViews: 1247,
          visitors: 892,
          topPages: [
            { path: '/', views: 456 },
            { path: '/projects', views: 234 },
            { path: '/about', views: 189 },
            { path: '/skills', views: 156 },
            { path: '/contact', views: 98 }
          ],
          referrers: [
            { source: 'Direct', visits: 456 },
            { source: 'Google', visits: 234 },
            { source: 'LinkedIn', visits: 123 },
            { source: 'GitHub', visits: 89 },
            { source: 'Twitter', visits: 67 }
          ],
          deviceTypes: [
            { device: 'Desktop', percentage: 65 },
            { device: 'Mobile', percentage: 28 },
            { device: 'Tablet', percentage: 7 }
          ],
          timeOnSite: 145, // seconds
          bounceRate: 32.5
        };
        
        setAnalyticsData(mockData);
        setIsRealData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <p role="status" className={styles.inlineLoading}>Loading visitor insights…</p>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center text-[#626663] py-8">
        No analytics data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-[#101214]">Website Analytics</h2>
        <div className="flex space-x-2">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              aria-pressed={timeRange === range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-none text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-[#ff6248] text-[#101214]'
                  : 'bg-[#e2ded6] text-[#626663] hover:bg-[#d5d0c7]'
              }`}
            >
              {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Data Source Indicator */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-none p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Demo Mode</h4>
              <p className="text-sm text-yellow-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#626663]">Page Views</p>
              <p className="text-2xl font-bold text-[#101214]">{analyticsData.pageViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-[#f3d3c9] rounded-none">
              <Eye className="w-6 h-6 text-[#a12e20]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#626663]">Unique Visitors</p>
              <p className="text-2xl font-bold text-[#101214]">{analyticsData.visitors.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-none">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#626663]">Avg. Time on Site</p>
              <p className="text-2xl font-bold text-[#101214]">{Math.floor(analyticsData.timeOnSite / 60)}m {analyticsData.timeOnSite % 60}s</p>
            </div>
            <div className="p-3 bg-[#e2ded6] rounded-none">
              <Clock className="w-6 h-6 text-[#626663]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#626663]">Bounce Rate</p>
              <p className="text-2xl font-bold text-[#101214]">{analyticsData.bounceRate}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-none">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Detailed Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Top Pages
          </h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#626663] w-6">#{index + 1}</span>
                  <span className="text-sm text-[#444843] font-mono">{page.path}</span>
                </div>
                <span className="text-sm font-semibold text-[#101214]">{page.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Traffic Sources
          </h3>
          <div className="space-y-3">
            {analyticsData.referrers.map((referrer, index) => (
              <div key={referrer.source} className="flex items-center justify-between">
                <span className="text-sm text-[#444843]">{referrer.source}</span>
                <span className="text-sm font-semibold text-[#101214]">{referrer.visits.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Device Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
      >
        <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
          <MousePointer className="w-5 h-5" />
          Device Types
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyticsData.deviceTypes.map((device) => (
            <div key={device.device} className="text-center p-4 bg-[#eeeae2] rounded-none">
              <p className="text-2xl font-bold text-[#b53523]">{device.percentage}%</p>
              <p className="text-sm text-[#626663]">{device.device}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Analytics Status */}
      <div className={`border rounded-none p-4 ${isRealData ? 'bg-green-50 border-green-200' : 'bg-[#f3e0d9] border-[#d4a59a]'}`}>
        <div className="flex items-start gap-3">
          <TrendingUp className={`w-5 h-5 ${isRealData ? 'text-green-600' : 'text-[#a12e20]'} mt-0.5`} />
          <div>
            <h4 className={`text-sm font-medium ${isRealData ? 'text-green-900' : 'text-[#7f281c]'}`}>
              {isRealData ? 'Real Analytics Active' : 'Analytics Setup Required'}
            </h4>
            <p className={`text-sm ${isRealData ? 'text-green-700' : 'text-[#7f281c]'} mt-1`}>
              {isRealData 
                ? 'Your dashboard is now showing real-time analytics data from Vercel.'
                : 'To see real analytics data, deploy to Vercel and enable Web Analytics in your project dashboard.'
              }
            </p>
            {!isRealData && (
              <ul className="text-sm text-[#7f281c] mt-2 list-disc list-inside space-y-1">
                <li>Deploy to Vercel to enable real-time analytics</li>
                <li>Wait 24-48 hours for initial data collection</li>
                <li>Create an API route to fetch analytics data</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
