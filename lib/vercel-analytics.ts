import type { AnalyticsRange, AnalyticsResult } from './analytics-types';

const endpoint = 'https://api.vercel.com/v1/query/web-analytics/visits/aggregate';
const rangeDays: Record<AnalyticsRange, number> = { '24h': 1, '7d': 7, '30d': 30 };
type Dimension = 'environment' | 'requestPath' | 'referrerHostname' | 'deviceType';
type Row = { pageviews: number; visitors: number } & Partial<Record<Dimension, string | null>>;

export class AnalyticsError extends Error {}

function parseRows(payload: unknown, dimension: Dimension): Row[] {
  const data = payload && typeof payload === 'object' && 'data' in payload ? payload.data : undefined;
  if (!Array.isArray(data) || !data.every(row => row && typeof row === 'object' &&
    Number.isSafeInteger(row.pageviews) && row.pageviews >= 0 &&
    Number.isSafeInteger(row.visitors) && row.visitors >= 0 &&
    (row[dimension] === null || typeof row[dimension] === 'string'))) {
    throw new AnalyticsError('Vercel returned an unexpected analytics response. Try again later.');
  }
  return data;
}

export async function getAnalytics(timeRange: AnalyticsRange, now = new Date()): Promise<AnalyticsResult> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN?.trim();
  const projectId = process.env.VERCEL_PROJECT_ID?.trim();
  const teamId = process.env.VERCEL_TEAM_ID?.trim();
  const missing = [!token && 'VERCEL_ANALYTICS_TOKEN', !projectId && 'VERCEL_PROJECT_ID'].filter((key): key is string => Boolean(key));
  if (!token || !projectId) {
    return { status: 'not_configured', missing, message: 'Connect Vercel Web Analytics to see visitor insights here.' };
  }

  const until = now.toISOString();
  const since = new Date(now.getTime() - rangeDays[timeRange] * 86400000).toISOString();
  const signal = AbortSignal.timeout(10000);
  async function query(by: Dimension) {
    const url = new URL(endpoint);
    url.search = new URLSearchParams({ projectId: projectId!, since, until, by, limit: '10', filter: "environment eq 'production'", ...(teamId ? { teamId } : {}) }).toString();
    let response: Response;
    try {
      response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        cache: 'no-store', redirect: 'error', signal,
      });
    } catch {
      throw new AnalyticsError('Vercel could not be reached. Try again shortly.');
    }
    if (!response.ok) {
      if ([401, 403].includes(response.status)) throw new AnalyticsError('Vercel denied analytics access. Check the server token and project team permissions.');
      if (response.status === 429) throw new AnalyticsError('Vercel is limiting analytics requests. Wait a moment before trying again.');
      if ([400, 402, 404].includes(response.status)) throw new AnalyticsError('Check the Vercel project and team settings, enable Web Analytics, and choose a range supported by your plan.');
      throw new AnalyticsError('Vercel analytics is temporarily unavailable. Try again later.');
    }
    try { return parseRows(await response.json(), by); }
    catch (error) {
      if (error instanceof AnalyticsError) throw error;
      throw new AnalyticsError('Vercel returned an unexpected analytics response. Try again later.');
    }
  }

  // One production group preserves distinct visitors across the entire range;
  // summing visitors from individual days or pages would double-count people.
  const [totals, pages, referrers, devices] = await Promise.all([
    query('environment'), query('requestPath'), query('referrerHostname'), query('deviceType'),
  ]);
  if (totals.length > 1 || (totals[0] && totals[0].environment !== 'production')) {
    throw new AnalyticsError('Vercel returned an unexpected analytics response. Try again later.');
  }
  const pageViews = totals[0]?.pageviews ?? 0;
  const visitors = totals[0]?.visitors ?? 0;
  const byViews = (rows: Row[]) => [...rows].sort((a, b) => b.pageviews - a.pageviews);
  const deviceViews = devices.reduce((sum, row) => sum + row.pageviews, 0);
  return {
    status: pageViews === 0 ? 'empty' : 'ready', source: 'vercel', timeRange, since, until,
    data: {
      pageViews, visitors,
      topPages: byViews(pages).map(row => ({ path: row.requestPath || 'Unknown', views: row.pageviews })),
      referrers: byViews(referrers).map(row => ({ source: row.referrerHostname || 'Direct / unknown', views: row.pageviews })),
      deviceTypes: byViews(devices).map(row => ({
        device: row.deviceType || 'Unknown', views: row.pageviews,
        percentage: deviceViews ? Math.round(row.pageviews / deviceViews * 1000) / 10 : 0,
      })),
    },
  };
}
