'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, BarChart3, Eye, Globe, Monitor, Users } from 'lucide-react';
import { ANALYTICS_RANGES, type AnalyticsRange, type AnalyticsResult } from '../lib/analytics-types';
import styles from './portfolio/editorial.module.css';

export default function AnalyticsDashboard() {
  const [result, setResult] = useState<AnalyticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<AnalyticsRange>('7d');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`, { cache: 'no-store', signal: controller.signal });
        if (response.status === 401) throw new Error('Your session has expired. Sign in again to view analytics.');
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || payload.error || 'Analytics could not be loaded. Try again.');
        if (!['ready', 'empty', 'not_configured', 'unavailable'].includes(payload.status)) throw new Error('Analytics returned an unexpected response. Try again.');
        if (!controller.signal.aborted) setResult(payload);
      } catch (failure) {
        if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : 'Analytics could not be loaded. Try again.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [timeRange, refresh]);

  const report = result && (result.status === 'ready' || result.status === 'empty') ? result : null;
  const panel = 'border border-[#c9c5be] bg-[#f8f5ef] p-5 sm:p-6';
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h3 className="text-xl text-[#101214]">Website analytics</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Analytics time range">
          {ANALYTICS_RANGES.map(range => (
            <button key={range} type="button" aria-pressed={timeRange === range} onClick={() => setTimeRange(range)}
              className={`min-h-11 px-3 text-sm ${timeRange === range ? 'bg-[#ff6248] text-[#101214]' : 'bg-[#e2ded6] text-[#444843]'}`}>
              {range === '24h' ? '24 hours' : range === '7d' ? '7 days' : '30 days'}
            </button>
          ))}
        </div>
      </div>

      {loading && <p role="status" className={styles.inlineLoading}>Loading visitor insights…</p>}
      {!loading && error && (
        <div role="alert" className={panel}>
          <h4 className="font-semibold text-[#101214]">Analytics unavailable</h4>
          <p className="mt-2 text-sm text-[#626663]">{error}</p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <button type="button" className="min-h-11 underline underline-offset-4" onClick={() => setRefresh(value => value + 1)}>Try again</button>
            <a className="inline-flex min-h-11 items-center underline underline-offset-4" href="/login">Sign in</a>
          </div>
        </div>
      )}
      {!loading && result?.status === 'not_configured' && (
        <div role="status" className={panel}>
          <h4 className="font-semibold text-[#101214]">Connect visitor insights</h4>
          <p className="mt-2 text-sm text-[#626663]">{result.message} Traffic reports are available in your Vercel project’s Analytics tab once Web Analytics is enabled.</p>
          <p className="mt-4 text-sm text-[#626663]">To show those reports here, add the following server environment variables, then redeploy:</p>
          <ul className="mt-3 space-y-2 text-sm">
            {result.missing.map(key => <li key={key}><code className="break-all">{key}</code></li>)}
          </ul>
          <p className="mt-3 text-sm text-[#626663]">For a team-owned project, also set <code>VERCEL_TEAM_ID</code>. Keep the access token on the server.</p>
          <a className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4" href="https://vercel.com/docs/analytics/web-analytics-api" target="_blank" rel="noopener noreferrer">Connection guide <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      )}
      {!loading && result?.status === 'unavailable' && <p role="alert" className={panel}>{result.message}</p>}
      {!loading && report && (
        <>
          {report.status === 'empty' && <p role="status" className="text-sm text-[#626663]">No page views were recorded in this period. Try a longer range or check that Web Analytics is enabled in Vercel.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: 'Page views', value: report.data.pageViews, Icon: Eye },
              { label: 'Visitors', value: report.data.visitors, Icon: Users },
            ].map(({ label, value, Icon }) => (
              <div key={label} className={`${panel} flex items-center justify-between gap-4`}>
                <div><p className="text-sm text-[#626663]">{label}</p><p className="mt-2 text-3xl font-semibold text-[#101214]">{value.toLocaleString()}</p></div>
                <Icon size={25} className="shrink-0 text-[#b53523]" aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { title: 'Top pages', Icon: BarChart3, rows: report.data.topPages.map(page => ({ name: page.path, views: page.views })) },
              { title: 'Referrers', Icon: Globe, rows: report.data.referrers.map(referrer => ({ name: referrer.source, views: referrer.views })) },
            ].map(({ title, Icon, rows }) => (
              <section key={title} className={`${panel} min-w-0`}>
                <h4 className="flex items-center gap-2 font-semibold text-[#101214]"><Icon size={18} aria-hidden="true" />{title}</h4>
                <p className="mt-2 text-xs text-[#626663]">Page views</p>
                {rows.length ? <ul className="mt-4 space-y-3">{rows.map(row => <li key={row.name} className="flex justify-between gap-4 text-sm"><span className="min-w-0 break-words">{row.name}</span><span className="shrink-0 font-semibold">{row.views.toLocaleString()}</span></li>)}</ul> : <p className="mt-4 text-sm text-[#626663]">No data in this period.</p>}
              </section>
            ))}
          </div>
          <section className={panel}>
            <h4 className="flex items-center gap-2 font-semibold text-[#101214]"><Monitor size={18} aria-hidden="true" />Devices</h4>
            <p className="mt-2 text-xs text-[#626663]">Share of page views</p>
            {report.data.deviceTypes.length ? <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">{report.data.deviceTypes.map(device => <li key={device.device} className="bg-[#eeeae2] p-4"><p className="text-2xl text-[#b53523]">{device.percentage}%</p><p className="mt-1 text-sm capitalize">{device.device}</p></li>)}</ul> : <p className="mt-4 text-sm text-[#626663]">No device data in this period.</p>}
          </section>
          <p className="text-xs text-[#626663]">Source: Vercel Web Analytics · Production traffic · Requested at {new Date(report.until).toLocaleString()}</p>
        </>
      )}
    </div>
  );
}
