import dotenv from 'dotenv';
dotenv.config();

function required(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function bool(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'y'].includes(value.toLowerCase());
}

function int(name, fallback) {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  port: int('PORT', 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  feedbackFormUrl: process.env.FEEDBACK_FORM_URL || 'https://forms.gle/replace-with-your-form',
  githubAppId: process.env.GITHUB_APP_ID,
  githubPrivateKey: process.env.GITHUB_PRIVATE_KEY,
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  allowUnverifiedWebhooks: bool('ALLOW_UNVERIFIED_WEBHOOKS', false),
  maxFilesPerPr: int('MAX_FILES_PER_PR', 40),
  maxPatchCharsPerFile: int('MAX_PATCH_CHARS_PER_FILE', 50000),
  maxFindingsPerPr: int('MAX_FINDINGS_PER_PR', 25)
};

export function validateProductionConfig() {
  if (!config.githubAppId) required('GITHUB_APP_ID');
  if (!config.githubPrivateKey) required('GITHUB_PRIVATE_KEY');
  if (!config.githubWebhookSecret) required('GITHUB_WEBHOOK_SECRET');
}
