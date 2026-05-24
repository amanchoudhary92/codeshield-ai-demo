import jwt from 'jsonwebtoken';
import { config } from '../utils/config.js';

function normalizePrivateKey(key) {
  if (!key) return key;
  return key.replace(/\\n/g, '\n');
}

export function createAppJwt() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60,
    exp: now + 9 * 60,
    iss: config.githubAppId
  };
  return jwt.sign(payload, normalizePrivateKey(config.githubPrivateKey), { algorithm: 'RS256' });
}

export async function createInstallationToken(installationId) {
  const appJwt = createAppJwt();
  const res = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${appJwt}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create installation token: ${res.status} ${text}`);
  }
  return res.json();
}
