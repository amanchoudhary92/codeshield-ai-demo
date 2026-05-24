# CodeShield AI Demo - Step-by-Step Build and Launch Guide

This guide tells you exactly what to do, stage by stage.

## Stage 0 - Decide scope

Build only this first:

- GitHub App
- Pull request webhook
- PR diff scanner
- Secret scanner
- Basic vulnerability scanner
- PR comment
- Feedback link

Do not build dashboard, billing, AI, team management, or Slack alerts yet.

Completion: you can explain the demo in one line: “When a PR opens, CodeShield AI scans changed code and comments security findings.”

---

## Stage 1 - Run project locally

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run test:scanner
npm run dev
```

Open:

```bash
http://localhost:4000/health
```

Expected result:

```json
{ "ok": true, "name": "CodeShield AI backend" }
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

Completion: frontend and backend both run locally.

---

## Stage 2 - Create GitHub App

Go to GitHub:

```text
Settings -> Developer settings -> GitHub Apps -> New GitHub App
```

Use:

```text
App name: CodeShield AI Demo
Homepage URL: http://localhost:3000 initially
Webhook URL: temporary ngrok/cloudflared URL + /webhooks/github
Webhook secret: generate a random secret
```

Permissions:

```text
Repository contents: Read-only
Pull requests: Read and write
Metadata: Read-only
Checks: Read and write
```

Subscribe to events:

```text
Pull request
```

Then generate a private key and download it.

Completion: GitHub App is created and installable.

---

## Stage 3 - Configure backend env

Open `backend/.env` and set:

```env
GITHUB_APP_ID=your_app_id
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_secret
```

Important: use App ID, not Client ID.

Completion: backend starts without GitHub credential errors.

---

## Stage 4 - Expose local backend for webhook test

Use ngrok or cloudflared.

### Option A: ngrok

```bash
ngrok http 4000
```

Webhook URL becomes:

```text
https://your-ngrok-url.ngrok-free.app/webhooks/github
```

### Option B: cloudflared

```bash
cloudflared tunnel --url http://localhost:4000
```

Webhook URL becomes:

```text
https://your-cloudflared-url.trycloudflare.com/webhooks/github
```

Update this URL in GitHub App settings.

Completion: GitHub can send webhook deliveries to your local backend.

---

## Stage 5 - Install GitHub App on test repo

Create a test repo, for example:

```text
codeshield-ai-test-repo
```

Install the GitHub App only on this repo.

Completion: GitHub App installation is complete.

---

## Stage 6 - Test clean PR

Create a branch and open a PR with a simple safe change.

Expected GitHub comment:

```text
No obvious secrets or common vulnerabilities were found in the changed code.
```

Completion: bot posts or updates a PR comment.

---

## Stage 7 - Test secret detection

Create a new PR with a fake secret:

```js
const OPENAI_API_KEY = "sk-test123456789012345678901234";
```

Expected finding:

```text
Critical: Possible OpenAI API key exposed
```

Completion: secret scanner works.

---

## Stage 8 - Test vulnerability detection

Add unsafe code:

```js
db.query("SELECT * FROM users WHERE email = '" + req.query.email + "'");
eval(req.query.code);
```

Expected findings:

```text
High: Possible SQL Injection
High: Unsafe eval usage
```

Completion: vulnerability scanner works.

---

## Stage 9 - Deploy backend

Use Render, Railway, Fly.io, or any Docker host.

Recommended for demo:

```text
Render Web Service from Dockerfile
```

Set production env vars:

```env
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
FEEDBACK_FORM_URL=https://forms.gle/your-form
GITHUB_APP_ID=your_app_id
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_secret
```

After deploy, backend URL will look like:

```text
https://codeshield-ai-backend.onrender.com
```

Update GitHub App webhook URL:

```text
https://codeshield-ai-backend.onrender.com/webhooks/github
```

Completion: production backend receives GitHub webhooks.

---

## Stage 10 - Deploy frontend

Use Vercel.

Set env vars:

```env
NEXT_PUBLIC_GITHUB_APP_INSTALL_URL=https://github.com/apps/your-app-name/installations/new
NEXT_PUBLIC_FEEDBACK_FORM_URL=https://forms.gle/your-form
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url
```

Completion: landing page is live and install button works.

---

## Stage 11 - Private beta

Invite 10 developers.

Message:

```text
Hey, I built CodeShield AI, a free GitHub PR security bot.
It scans PRs for leaked secrets and common vulnerabilities.
Can you install it on a test repo and open 1-2 PRs?
I only need feedback on whether the PR comment is useful.
```

Track:

- Installs
- Repos
- PR scans
- Findings
- False positives
- Repeat usage
- Feedback responses

Completion: 10 users, 30 PR scans, 5 feedback responses.

---

## Stage 12 - Public launch

Launch on:

- LinkedIn
- Twitter/X
- Dev.to
- Hashnode
- Reddit r/webdev
- Reddit r/github
- Indie Hackers
- college/startup groups

Target in 14 days:

- 50 installs
- 100 repos
- 300 PR scans
- 20 feedback responses

Completion: decide whether to convert into SaaS.
