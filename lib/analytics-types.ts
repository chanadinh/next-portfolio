export const ANALYTICS_RANGES = ['24h', '7d', '30d'] as const;
export type AnalyticsRange = typeof ANALYTICS_RANGES[number];

export interface AnalyticsData {
  pageViews: number;
  visitors: number;
  topPages: Array<{ path: string; views: number }>;
  referrers: Array<{ source: string; views: number }>;
  deviceTypes: Array<{ device: string; views: number; percentage: number }>;
}

export type AnalyticsResult = {
  status: 'ready' | 'empty';
  source: 'vercel';
  timeRange: AnalyticsRange;
  since: string;
  until: string;
  data: AnalyticsData;
} | {
  status: 'not_configured';
  message: string;
  missing: string[];
} | {
  status: 'unavailable';
  message: string;
};

export function isAnalyticsRange(value: unknown): value is AnalyticsRange {
  return typeof value === 'string' && ANALYTICS_RANGES.some(range => range === value);
}
