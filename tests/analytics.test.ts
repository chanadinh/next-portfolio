import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { NextRequest } from 'next/server';
import { ADMIN_COOKIE, createAdminToken } from '../lib/admin-auth';
import { GET, POST } from '../app/api/analytics/route';
import { getAnalytics } from '../lib/vercel-analytics';

const originalEnv = { ...process.env };
const origin = 'https://chandinh.dev';
const fixtures: Record<string, unknown[]> = {
  environment: [{ environment: 'production', pageviews: 120, visitors: 65 }],
  requestPath: [{ requestPath: '/work/escape-room', pageviews: 40, visitors: 30 }, { requestPath: '/', pageviews: 80, visitors: 55 }],
  referrerHostname: [{ referrerHostname: null, pageviews: 85, visitors: 50 }, { referrerHostname: 'github.com', pageviews: 35, visitors: 25 }],
  deviceType: [{ deviceType: 'desktop', pageviews: 90, visitors: 45 }, { deviceType: 'mobile', pageviews: 30, visitors: 20 }],
};

beforeEach(() => {
  process.env.ADMIN_USERNAME = 'analytics-test-admin';
  process.env.ADMIN_PASSWORD = 'test-only-analytics-password';
  process.env.JWT_SECRET = 'test-only-analytics-secret-at-least-thirty-two-characters';
  process.env.APP_ORIGIN = origin;
  process.env.VERCEL_ANALYTICS_TOKEN = 'test-only-vercel-token';
  process.env.VERCEL_PROJECT_ID = 'prj_test';
  process.env.VERCEL_TEAM_ID = 'team_test';
  // Unmocked network access should always fail in these regression tests.
  mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected network request'); });
});

afterEach(() => {
  mock.restoreAll();
  for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
  Object.assign(process.env, originalEnv);
});

function request(method = 'GET', body?: string, auth = true, headers: Record<string, string> = {}, query = '') {
  return new NextRequest(`${origin}/api/analytics${query}`, {
    method, body, headers: { ...(auth ? { cookie: `${ADMIN_COOKIE}=${createAdminToken()}` } : {}), ...headers },
  });
}

test('analytics requires authentication and rejects cross-origin POST requests before contacting Vercel', async () => {
  assert.equal((await GET(request('GET', undefined, false))).status, 401);
  assert.equal((await POST(request('POST', '{}', false))).status, 401);
  assert.equal((await POST(request('POST', '{}', true, { origin: 'https://other.example' }))).status, 403);
  assert.equal((fetch as unknown as { mock: { calls: unknown[] } }).mock.calls.length, 0);
});

test('missing analytics setup returns a truthful state instead of 400, fake counts, or zero counts', async () => {
  delete process.env.VERCEL_ANALYTICS_TOKEN;
  delete process.env.VERCEL_PROJECT_ID;
  for (const response of [await GET(request()), await POST(request('POST', '{"timeRange":"7d"}'))]) {
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const result = await response.json();
    assert.equal(result.status, 'not_configured');
    assert.deepEqual(result.missing, ['VERCEL_ANALYTICS_TOKEN', 'VERCEL_PROJECT_ID']);
    assert.equal(result.data, undefined);
    assert.equal(result.pageViews, undefined);
  }
  assert.equal((fetch as unknown as { mock: { calls: unknown[] } }).mock.calls.length, 0);
});

test('malformed bodies and unsupported time ranges remain bad requests', async () => {
  for (const body of ['{broken', 'null', '[]', '42', '{"timeRange":"all"}', '{"timeRange":null}', '{"timeRange":{}}']) {
    assert.equal((await POST(request('POST', body))).status, 400, body);
  }
  assert.equal((await GET(request('GET', undefined, true, {}, '?timeRange=1y'))).status, 400);
});

test('real reports use the selected interval, production filter, server token, and distinct visitor total', async () => {
  const calls: URL[] = [];
  mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input));
    calls.push(url);
    assert.equal(url.origin, 'https://api.vercel.com');
    assert.equal(url.pathname, '/v1/query/web-analytics/visits/aggregate');
    assert.equal(url.searchParams.get('projectId'), 'prj_test');
    assert.equal(url.searchParams.get('teamId'), 'team_test');
    assert.equal(url.searchParams.get('filter'), "environment eq 'production'");
    assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer test-only-vercel-token');
    assert.equal(init?.cache, 'no-store');
    assert.equal(init?.redirect, 'error');
    assert.ok(init?.signal);
    return Response.json({ data: fixtures[url.searchParams.get('by')!] });
  });
  const now = new Date('2026-10-05T12:00:00.000Z');
  for (const [range, days] of [['24h', 1], ['7d', 7], ['30d', 30]] as const) {
    const result = await getAnalytics(range, now);
    assert.equal(result.status, 'ready');
    assert.ok('data' in result);
    assert.equal(result.data.pageViews, 120);
    assert.equal(result.data.visitors, 65); // Page-level visitors overlap; never sum 30 + 55.
    assert.equal(result.since, new Date(now.getTime() - days * 86400000).toISOString());
    assert.equal(result.until, now.toISOString());
    assert.equal(result.data.topPages[0].path, '/');
    assert.equal(result.data.referrers[0].source, 'Direct / unknown');
    assert.deepEqual(result.data.deviceTypes.map(device => device.percentage), [75, 25]);
    for (const call of calls.slice(-4)) {
      assert.equal(call.searchParams.get('since'), result.since);
      assert.equal(call.searchParams.get('until'), result.until);
    }
    assert.doesNotMatch(JSON.stringify(result), /test-only-vercel-token/);
  }
  assert.equal(calls.length, 12);
});

test('an empty Vercel response is a genuine zero-traffic report, and personal projects omit teamId', async () => {
  delete process.env.VERCEL_TEAM_ID;
  mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    assert.equal(new URL(String(input)).searchParams.has('teamId'), false);
    return Response.json({ data: [] });
  });
  const response = await POST(request('POST', '{"timeRange":"24h"}'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const result = await response.json();
  assert.equal(result.status, 'empty');
  assert.equal(result.data.pageViews, 0);
  assert.equal(result.data.visitors, 0);
  assert.deepEqual(result.data.deviceTypes, []);
});

test('provider failures never become real-looking zero or demo traffic and do not expose upstream secrets', async () => {
  for (const status of [400, 401, 402, 403, 404, 429, 500]) {
    mock.method(globalThis, 'fetch', async () => Response.json({ error: 'test-only-vercel-token private detail' }, { status }));
    const response = await GET(request());
    assert.equal(response.status, 502);
    const result = await response.json();
    assert.equal(result.status, 'unavailable');
    assert.equal(result.data, undefined);
    assert.doesNotMatch(JSON.stringify(result), /test-only-vercel-token|private detail/);
  }
});

test('network failures and malformed provider payloads report unavailable rather than success', async () => {
  const responses = [
    () => { throw new Error('Network error with private detail'); },
    () => new Response('not json'),
    () => Response.json({ data: {} }),
    () => Response.json({ data: [{ environment: 'production', pageviews: -1, visitors: 3 }] }),
    () => Response.json({ data: [{ environment: 'production', pageviews: '120', visitors: 3 }] }),
    () => Response.json({ data: [{ pageviews: 120, visitors: 3 }] }),
  ];
  for (const respond of responses) {
    mock.method(globalThis, 'fetch', async () => respond());
    const response = await GET(request());
    assert.equal(response.status, 502);
    const result = await response.json();
    assert.equal(result.status, 'unavailable');
    assert.equal(result.data, undefined);
    assert.doesNotMatch(result.message, /private detail/);
  }
});
