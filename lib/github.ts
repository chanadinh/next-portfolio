import { GitHubSnapshot, safeProjectUrl } from './project-types';

export class GitHubError extends Error {
  constructor(message: string, public status = 502, public retryAfter?: string) { super(message); }
}
export interface GitHubRepository {
  id: number; name: string; full_name: string; description: string | null;
  html_url: string; homepage: string | null; language: string | null; topics: string[];
  stargazers_count: number; fork: boolean; archived: boolean; private: boolean;
  pushed_at: string | null; owner: { login: string };
}
export function githubUsername() {
  const username = process.env.GITHUB_USERNAME || 'chanadinh';
  if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)) throw new GitHubError('Set a valid GITHUB_USERNAME on the server.', 503);
  return username;
}
async function githubRequest(path: string) {
  let response: Response;
  try {
    response = await fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'chandinh-portfolio',
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000),
    });
  } catch { throw new GitHubError('GitHub could not be reached. Try again shortly.'); }
  if (!response.ok) {
    const limited = response.status === 429 || (response.status === 403 && (response.headers.get('x-ratelimit-remaining') === '0' || response.headers.has('retry-after')));
    if (limited) {
      const reset = Number(response.headers.get('x-ratelimit-reset')) * 1000;
      const retry = response.headers.get('retry-after') || String(Math.max(60, Math.ceil((reset - Date.now()) / 1000) || 60));
      throw new GitHubError('GitHub rate limit reached. Wait before syncing again, or configure a server-side GitHub token.', 429, retry);
    }
    if (response.status === 404) throw new GitHubError('The repository or requested file is unavailable.', 404);
    throw new GitHubError('GitHub rejected the request. Check the configured account and token.', 502);
  }
  return response;
}

// Cache discovery only, not imported content or authentication decisions.
const discoveryCache = new Map<string, { expires: number; repos: GitHubRepository[]; hasNext: boolean }>();
export async function discoverRepositories(page = 1) {
  if (!Number.isInteger(page) || page < 1 || page > 1000) throw new GitHubError('Invalid page number.', 400);
  const username = githubUsername();
  const key = `${username}:${page}`;
  for (const [k,v] of discoveryCache) if (v.expires <= Date.now()) discoveryCache.delete(k);
  const cached = discoveryCache.get(key);
  if (cached) return { username, repos: cached.repos, hasNext: cached.hasNext };
  const response = await githubRequest(`/users/${encodeURIComponent(username)}/repos?type=owner&sort=pushed&direction=desc&per_page=30&page=${page}`);
  const repos = (await response.json() as GitHubRepository[]).filter(repo => !repo.private && repo.owner.login.toLowerCase() === username.toLowerCase());
  const hasNext = /rel="next"/.test(response.headers.get('link') || '');
  if (discoveryCache.size >= 100) discoveryCache.delete(discoveryCache.keys().next().value!);
  discoveryCache.set(key, { expires: Date.now() + 300000, repos, hasNext });
  return { username, repos, hasNext };
}

export async function readRepository(repoId: number): Promise<GitHubSnapshot> {
  if (!Number.isSafeInteger(repoId) || repoId <= 0) throw new GitHubError('Choose a valid repository.', 400);
  const repo = await (await githubRequest(`/repositories/${repoId}`)).json() as GitHubRepository;
  if (repo.private || repo.owner.login.toLowerCase() !== githubUsername().toLowerCase()) throw new GitHubError('Only public repositories owned by the configured account can be imported.', 403);
  const path = `/repos/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}`;
  const [languages, readme] = await Promise.all([
    githubRequest(`${path}/languages`).then(r => r.json()) as Promise<Record<string, number>>,
    githubRequest(`${path}/readme`).then(r => r.json()).catch(error => {
      if (error instanceof GitHubError && error.status === 404) return null;
      throw error;
    }) as Promise<{ content?: string; encoding?: string; size?: number } | null>,
  ]);
  const text = readme?.encoding === 'base64' ? Buffer.from(readme.content || '', 'base64').toString('utf8') : '';
  return {
    repoId: repo.id, name: repo.name, fullName: repo.full_name, description: repo.description || '',
    htmlUrl: `https://github.com/${repo.owner.login}/${repo.name}`,
    homepage: repo.homepage && safeProjectUrl(repo.homepage) ? repo.homepage : '',
    languages: Object.keys(languages).slice(0,30), topics: (repo.topics || []).slice(0,30),
    readme: text.slice(0,100000), readmeTruncated: text.length > 100000 || (readme?.size || 0) > 100000,
    stars: repo.stargazers_count, fork: repo.fork, archived: repo.archived,
    pushedAt: repo.pushed_at, syncedAt: new Date().toISOString(),
  };
}
