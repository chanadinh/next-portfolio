# Contributing

This repo uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, pull request titles, version tags, and GitHub Releases.

## Commit messages

```
type(scope): short description

Optional body explaining why.
```

| Type | Version bump | Use for |
| --- | --- | --- |
| `feat` | minor | New behavior |
| `fix` | patch | Bug fix |
| `perf` | patch | Performance improvement |
| `docs`, `style`, `refactor`, `test` | none | No user-facing behavior change |
| `build`, `ci`, `chore` | none | Tooling, CI, deps, maintenance |
| `BREAKING CHANGE:` footer or `feat!:` | major | Breaking change |

Examples:

```
feat(admin): add project image upload
fix(api): handle missing JWT secret
chore(deps): update mongoose
```

Do not start the subject with a capital letter or a trailing period.

## Pull requests

- Title uses the same conventional format as commits (`feat: …`, `fix(scope): …`).
- Fill in `.github/pull_request_template.md`.
- Keep the PR focused; CI rejects non-conventional titles and commit messages on the branch.

## Version tags and releases

Versions follow semver and Git tags `vX.Y.Z` (for example `v0.2.0`).

After a PR merges to `main`, the Release workflow runs [semantic-release](https://semantic-release.gitbook.io/):

1. Reads conventional commits since the last tag
2. Bumps `package.json` when `feat` / `fix` / breaking changes landed
3. Updates `CHANGELOG.md`
4. Pushes tag `vX.Y.Z`
5. Creates a GitHub Release

`v0.1.0` is the baseline tag for the state of `main` before this workflow. There is no npm publish (`private: true`).
