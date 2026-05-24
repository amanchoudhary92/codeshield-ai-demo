# CodeShield AI

**CodeShield AI** is a free GitHub PR security bot that scans pull requests for leaked secrets, hardcoded credentials, and common vulnerability patterns before code gets merged.

It is currently a working demo built to validate whether developers find PR-level security comments useful.

---

## Live Demo

Frontend:

https://codeshield-ai-demo.vercel.app

GitHub Repository:

https://github.com/amanchoudhary92/codeshield-ai-demo

---

## What It Does

CodeShield AI automatically scans pull request diffs and comments security findings directly on the PR.

Current demo checks for:

- Leaked API keys and secrets
- Hardcoded credentials
- Database URLs
- Possible SQL injection
- Unsafe `eval()` usage
- Common JavaScript / TypeScript / Python security risks

---

## How It Works

1. Install the CodeShield AI GitHub App.
2. Select a repository.
3. Open or update a pull request.
4. CodeShield AI scans the changed files.
5. The bot comments security findings directly on the PR.
6. When new commits are pushed, the bot updates the existing comment.

---

## Demo Status

This project is currently an early demo.

It is not a replacement for a full security review. It may produce false positives or miss vulnerabilities.

The goal of this demo is to test whether developers and teams find automated PR security comments useful.

---

## Tech Stack

### Backend

- Node.js
- GitHub App API
- Webhook signature verification
- Pull request diff scanning
- Custom secret scanner
- Custom vulnerability scanner
- Render deployment

### Frontend

- Next.js
- Tailwind CSS
- Vercel deployment

---

## Project Structure

```text
codeshield-ai-demo/
  backend/
    src/
      github/
      scanners/
      utils/
      server.js
    package.json

  frontend/
    app/
    package.json

  docs/
    STAGE_BY_STAGE_GUIDE.md
    TEST_CASES.md

  README.md
  docker-compose.yml