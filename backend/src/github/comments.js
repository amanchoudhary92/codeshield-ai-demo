import { config } from '../utils/config.js';
import { createIssueComment, listIssueComments, updateIssueComment } from './api.js';

const BOT_MARKER = '<!-- CODESHIELD_AI_SCAN_COMMENT -->';

function severityEmoji(severity) {
  return {
    critical: '🚨',
    high: '🔴',
    medium: '🟠',
    low: '🟡'
  }[severity] || 'ℹ️';
}

export function formatScanComment({ repo, prNumber, scan }) {
  const { summary, findings, scannedFiles, skippedFiles } = scan;
  let body = `${BOT_MARKER}\n## 🛡️ CodeShield AI Security Scan\n\n`;
  body += `Scan completed for PR **#${prNumber}** in \`${repo}\`.\n\n`;
  body += `### Summary\n\n`;
  body += `| Severity | Count |\n|---|---:|\n`;
  body += `| 🚨 Critical | ${summary.critical} |\n`;
  body += `| 🔴 High | ${summary.high} |\n`;
  body += `| 🟠 Medium | ${summary.medium} |\n`;
  body += `| 🟡 Low | ${summary.low} |\n\n`;
  body += `Scanned files: **${scannedFiles}**  \nSkipped files: **${skippedFiles}**\n\n`;

  if (findings.length === 0) {
    body += `### Result\n\nNo obvious secrets or common vulnerabilities were found in the changed code.\n\n`;
  } else {
    body += `### Findings\n\n`;
    for (const finding of findings) {
      body += `#### ${severityEmoji(finding.severity)} ${finding.severity.toUpperCase()}: ${finding.title}\n\n`;
      body += `File: \`${finding.file}\`  \n`;
      if (finding.line) body += `Line: **${finding.line}**  \n`;
      body += `Type: \`${finding.type}\`  \n`;
      body += `Confidence: \`${finding.confidence}\`\n\n`;
      body += `${finding.message}\n\n`;
      if (finding.snippet) {
        const safeSnippet = finding.type === 'secret' ? '[redacted sensitive-looking line]' : finding.snippet.replace(/`/g, '\\`');
        body += `<details><summary>Snippet</summary>\n\n\`\`\`\n${safeSnippet}\n\`\`\`\n\n</details>\n\n`;
      }
    }
  }

  body += `---\n`;
  body += `**Demo disclaimer:** This is a free demo scanner. It may produce false positives or miss vulnerabilities. Do not rely on it as your only security review.\n\n`;
  body += `Was this useful? Share feedback: ${config.feedbackFormUrl}\n`;
  return body;
}

export async function upsertScanComment({ owner, repo, issueNumber, token, body }) {
  const comments = await listIssueComments({ owner, repo, issueNumber, token });
  const existing = comments.find((comment) => comment.body?.includes(BOT_MARKER));
  if (existing) {
    return updateIssueComment({ owner, repo, commentId: existing.id, token, body });
  }
  return createIssueComment({ owner, repo, issueNumber, token, body });
}
