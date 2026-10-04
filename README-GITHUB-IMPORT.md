# GitHub project imports

The dashboard discovers public repositories for `GITHUB_USERNAME`, imports selected repositories as private drafts, and lets the owner curate and publish their project stories. GitHub refreshes only update the separate source record; they never overwrite portfolio copy, images, links, ordering, or publication settings.

## Local setup

Use Node.js 22.13+ (validated with Node.js 24), then run:

```sh
npm ci
```

Copy `env.example` to `.env.local` and configure:

- `MONGODB_URI`: your development MongoDB connection.
- `ADMIN_USERNAME`: your admin username.
- `ADMIN_PASSWORD`: a unique password of at least 12 characters.
- `JWT_SECRET`: a random secret of at least 32 characters.
- `GITHUB_USERNAME=chanadinh`.
- `APP_ORIGIN=http://localhost:3000` for local development; use `https://chandinh.dev` in production. Omit it to use the incoming request origin.
- `GITHUB_TOKEN`: optional, server-only, read-only GitHub token for higher API limits. Public repository metadata and contents access are sufficient. Never prefix it with `NEXT_PUBLIC_`.

The existing R2 variables are required for image uploads. You can also use an existing `/images/...` asset or a public image URL. Do not run the old generic seed scripts against an existing database.

```sh
npm run dev
```

Open `/login`, sign in, then use the Projects tab. Login fails closed when credentials are absent or still placeholders. There are no default credentials. Previous localStorage tokens are no longer accepted; sign in again for an HttpOnly, SameSite=Strict session. Production uses a Secure cookie and requires HTTPS on your public host.

## Workflow

1. Choose **Import from GitHub**. Repository discovery is paginated in batches of 30; the search and forks/archive toggles filter the current page. Discovery responses are cached on the server for five minutes.
2. Choose **Import draft**. The server retrieves metadata, languages, topics, and README source for the selected public repository, then saves a draft. A missing README is allowed. Private repositories and repositories owned by another account are rejected, even if the token could access them.
3. Choose **Edit & preview**. Add your cover, description, contribution, decisions, results, technology labels, display order, and links. Select Work or Playground and optionally feature the project.
4. Choose **Preview project**, then **Publish project**. Publishing requires a title, description, and image. There is no automatic publication.
5. Use **Move to draft** or **Hide project** to remove it from public lists and direct URLs. The saved entry remains editable.
6. Use **Refresh metadata** for an imported project. Its stable GitHub ID survives repository renames. Your editorial content is preserved, including your chosen links. The updated repository URL is available in its source record if you want to change a link manually.

Manually created employer case studies remain supported. Delete removes the portfolio entry only; it does not alter GitHub repositories or shared image assets.

## Profile settings

Open **Profile** in the signed-in dashboard to:

- Upload a PDF résumé (up to 3 MB), preview the selected file, and open the current résumé.
- Save your LinkedIn `/in/...` profile URL. The dashboard normalizes it to HTTPS and removes tracking parameters.

These controls use the existing `MONGODB_URI` and admin session. Résumé bytes and metadata are saved atomically in one singleton profile document; résumé storage does not require R2. An invalid or failed upload preserves the current file. Only résumé downloads read the PDF bytes; the settings API returns metadata. Updating the résumé does not rewrite the homepage story or project text.

Public résumé links use `/resume`, and LinkedIn links use `/linkedin`. Both resolve the latest saved setting on each visit with `Cache-Control: no-store`, so no rebuild is needed after saving. Before the first upload, `/resume` redirects to the bundled July 2026 `/resume.pdf`. Before the first LinkedIn edit, `/linkedin` uses the existing profile. If MongoDB is not configured, those public defaults still work; the dashboard reports that storage is unavailable. A configured but unreachable database returns a temporary error instead of silently serving an older résumé.

- `GET /api/admin/profile`: authenticated settings and résumé metadata.
- `PATCH /api/admin/profile`: authenticated `{ "linkedinUrl": "https://www.linkedin.com/in/your-name" }`.
- `POST /api/admin/profile/resume`: authenticated multipart upload with one `file` field. The server bounds the request body, checks the PDF header/end marker and size, and rejects cross-origin writes.

The editable favicon source is `public/favicon.svg`. Run `node scripts/generate-favicon.cjs` to regenerate the PNG, multi-size ICO, Apple touch, and Windows tile icons. Metadata references the new assets with a version query to refresh previously cached browser icons.

## Data and visibility

`Project` adds `status` (`draft`, `published`, `hidden`), `placement` (`work`, `playground`), `role`, `technicalDecisions`, `outcomes`, `githubRepoId`, and `github` (a metadata/README snapshot).

New projects default to draft. Existing records without a status remain published for backward compatibility. Imports recognize an existing project with the same GitHub URL, attach the repository identity, and retain its editorial content. A sparse unique index on `githubRepoId` and atomic upserts prevent duplicate concurrent imports. The import waits for this index before proceeding.

The public APIs omit drafts, hidden entries, and the raw source snapshot. `/api/projects?view=admin` and the equivalent individual-project query require a signed admin session. Privileged project, upload, skills, about, personal-info, contact-list, analytics, and email-test handlers validate the session on the server. The admin layout independently verifies it before rendering. Cross-origin writes are rejected.

The README is displayed as plain text in the editor; no imported Markdown HTML or code is executed. Publication uses your edited content. The existing chat service has its own public session-history model; this change is not a complete security audit of every legacy feature.

## Pages and endpoints

- `/`: current copy and selected-work collection.
- `/play`: published Playground projects plus existing experiments.
- `/work/[id]`: a published project's full story; drafts/hidden IDs render the not-found page without project content.
- `GET /api/admin/github/repositories?page=1`: authenticated discovery.
- `POST /api/admin/github/import` with `{ "repoId": 12345 }`: authenticated import or metadata refresh.
- `GET /api/projects?view=admin`: dashboard library.
- Existing project POST/PUT/DELETE endpoints: authenticated, allowlisted editorial fields.
- `/api/admin/login`, `/api/admin/session`, `/api/admin/logout`: signed session lifecycle.

Public visitors read saved MongoDB entries and never need a GitHub API request. No webhook, scheduler, or background publishing job is installed. Network errors and rate-limit responses preserve existing saved data. Missing DB configuration produces an explicit error state.

## Checks

```sh
npm run test
npm run typecheck
npm run lint
npm run build
```

The integration tests use a disposable MongoDB instance and mocked GitHub responses. The test dependency downloads a MongoDB binary on first installation/run. Tests never use the configured production database. They exercise authentication, CSRF rejection, private drafts, validation, publication, hidden records, legacy records, concurrent deduplication, refresh preservation, missing README, and upstream errors.

Login's failed-attempt limit is an in-process backstop. Configure an infrastructure-level shared limiter for a multi-instance deployment. This local implementation does not change DNS, provision hosting, or deploy to chandinh.dev.

The July 2026 résumé is served from `/resume.pdf`. Profile and experience copy lives in `content/portfolio.ts`. The primary public contact address is the email from that résumé. The new public presentation uses Unbounded and Space Mono, a motorsport-inspired palette, and four narrative chapters. The earlier design concepts are superseded; final employer case-study assets still need curation. Story copy lives in `content/story.ts`, and the presentation lives in `components/portfolio/`.

On the reviewed Windows machine, port 3000 is reserved by the OS. Use `npm run dev -- --port 4000` and `APP_ORIGIN=http://localhost:4000` locally. The production origin remains `https://chandinh.dev`.

Validation on October 4, 2026: eight integration tests passed; TypeScript, lint (zero errors, ten existing warnings), and the production build passed. A production HTTP smoke check used live GitHub reads and a disposable database to verify discovery, draft import, publication, refresh preservation, hidden content, sign-in, and the résumé asset. Next.js may stream redirects/not-found pages with an HTTP 200 shell; the checks verified the framework redirect/not-found marker and absence of protected content as well as API 401/404 responses. Browser visual testing was blocked by declined browser permission. R2, email, and production hosting were not exercised.

The October 4 visual rebuild passed production build/type checks and an HTTP smoke check with no database configured. Core résumé-based stories render on the server; the dynamic project library handles database availability separately. The contact form uses the existing contact API. Browser visual QA remains unverified because browser permission was declined.
