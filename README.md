# CodeShield AI Demo

Free GitHub PR Security Bot: catch secrets and common security bugs before merge.

This is a working demo project for validation. It is not yet a full SaaS.

## What it does

When a pull request is opened, updated, or reopened, CodeShield AI:

1. Receives a GitHub App webhook
2. Fetches changed files from the PR
3. Scans only added lines in the PR diff
4. Detects leaked secrets and basic vulnerability patterns
5. Posts or updates a GitHub PR comment
6. Adds a feedback link

## Features in this demo

- GitHub App webhook receiver
- GitHub installation token auth
- PR changed files fetch
- Built-in secret scanner
- Built-in vulnerability scanner
- PR comment formatter
- Duplicate comment prevention by updating existing CodeShield AI comment
- Landing page
- Dockerfile for backend
- Stage-by-stage setup guide

## What is intentionally not included yet

- Billing
- Dashboard
- AI explanations
- Team management
- Slack alerts
- Merge blocking
- Full Semgrep/Gitleaks integration
- Database persistence

These should be added only after demo validation.

## Project structure

```text
codeshield-ai-demo/
  backend/          GitHub App backend bot
  frontend/         Next.js landing page
  docs/             Step-by-step setup guide
  docker-compose.yml
```

## Quick local start

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run test:scanner
npm run dev
```

Backend health check:

```text
http://localhost:4000/health
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## GitHub App setup

Read the full guide:

```text
docs/STAGE_BY_STAGE_GUIDE.md
```

Minimum GitHub App permissions:

```text
Repository contents: Read-only
Pull requests: Read and write
Metadata: Read-only
Checks: Read and write
```

Webhook event:

```text
Pull request
```

Webhook URL:

```text
https://your-backend-url/webhooks/github
```

## Important security notes

- The demo scans PR diffs only, not full repositories.
- Secret-looking snippets are redacted in GitHub comments.
- The in-memory scan log is for demo only.
- Do not use this as your only security review.
- Before production SaaS, add persistent DB, job queue, stronger scanners, rate limits, and security review.

## Recommended validation target

Before building SaaS features, aim for:

- 50+ GitHub App installs
- 100+ repos connected
- 500+ PR scans
- 20+ repeat users
- 5+ teams asking for dashboard/private repo features
- 3+ users asking for paid plan
