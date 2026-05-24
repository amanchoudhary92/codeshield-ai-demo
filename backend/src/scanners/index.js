import { config } from '../utils/config.js';
import { shouldSkipFile } from './helpers.js';
import { scanSecrets } from './secrets.js';
import { scanVulnerabilities } from './vulnerabilities.js';

const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export function prepareFiles(files) {
  return files
    .filter((file) => !shouldSkipFile(file))
    .map((file) => ({
      ...file,
      patch: (file.patch || '').slice(0, config.maxPatchCharsPerFile)
    }));
}

export function runSecurityScan(files) {
  const prepared = prepareFiles(files);
  const findings = [
    ...scanSecrets(prepared),
    ...scanVulnerabilities(prepared)
  ]
    .sort((a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9))
    .slice(0, config.maxFindingsPerPr);

  const summary = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const finding of findings) summary[finding.severity] += 1;

  return {
    scannedFiles: prepared.length,
    skippedFiles: files.length - prepared.length,
    findings,
    summary
  };
}
