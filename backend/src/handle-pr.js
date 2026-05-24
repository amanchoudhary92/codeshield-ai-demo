import { createInstallationToken } from './github/auth.js';
import { listPullRequestFiles } from './github/api.js';
import { formatScanComment, upsertScanComment } from './github/comments.js';
import { runSecurityScan } from './scanners/index.js';
import { saveScan } from './db/memory.js';
import { config } from './utils/config.js';
import { logger } from './utils/logger.js';

export async function handlePullRequestEvent(payload) {
  const action = payload.action;
  if (!['opened', 'synchronize', 'reopened'].includes(action)) {
    logger.info({ action }, 'Ignoring pull request action');
    return { ignored: true, reason: `Unsupported action ${action}` };
  }

  const installationId = payload.installation?.id;
  const repoFullName = payload.repository?.full_name;
  const [owner, repo] = repoFullName.split('/');
  const pullNumber = payload.pull_request?.number;
  const headSha = payload.pull_request?.head?.sha;

  logger.info({ repo: repoFullName, pullNumber, action, installationId }, 'Processing pull request');

  const tokenResponse = await createInstallationToken(installationId);
  const token = tokenResponse.token;

  const files = await listPullRequestFiles({ owner, repo, pullNumber, token, maxFiles: config.maxFilesPerPr });
  const scan = runSecurityScan(files);

  const body = formatScanComment({ repo: repoFullName, prNumber: pullNumber, scan });
  await upsertScanComment({ owner, repo, issueNumber: pullNumber, token, body });

  const saved = saveScan({
    repo: repoFullName,
    pullNumber,
    headSha,
    action,
    status: 'completed',
    scannedFiles: scan.scannedFiles,
    skippedFiles: scan.skippedFiles,
    summary: scan.summary,
    findingsCount: scan.findings.length
  });

  logger.info({ repo: repoFullName, pullNumber, findings: scan.findings.length }, 'Scan completed');
  return saved;
}
