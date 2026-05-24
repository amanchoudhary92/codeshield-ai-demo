import crypto from 'crypto';

export function verifyGitHubSignature({ rawBody, signatureHeader, secret }) {
  if (!signatureHeader || !secret) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = `sha256=${hmac.update(rawBody).digest('hex')}`;
  const a = Buffer.from(digest, 'utf8');
  const b = Buffer.from(signatureHeader, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
