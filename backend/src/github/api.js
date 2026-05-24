const BASE = 'https://api.github.com';

async function gh(path, { token, method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${method} ${path} failed: ${res.status} ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function listPullRequestFiles({ owner, repo, pullNumber, token, maxFiles = 40 }) {
  const files = [];
  let page = 1;
  while (files.length < maxFiles) {
    const data = await gh(`/repos/${owner}/${repo}/pulls/${pullNumber}/files?per_page=100&page=${page}`, { token });
    files.push(...data);
    if (data.length < 100) break;
    page += 1;
  }
  return files.slice(0, maxFiles);
}

export async function listIssueComments({ owner, repo, issueNumber, token }) {
  return gh(`/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=100`, { token });
}

export async function createIssueComment({ owner, repo, issueNumber, token, body }) {
  return gh(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    token,
    method: 'POST',
    body: { body }
  });
}

export async function updateIssueComment({ owner, repo, commentId, token, body }) {
  return gh(`/repos/${owner}/${repo}/issues/comments/${commentId}`, {
    token,
    method: 'PATCH',
    body: { body }
  });
}
