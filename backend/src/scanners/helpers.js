export function getAddedLinesFromPatch(patch = '') {
  const lines = [];
  let newLineNumber = 0;
  for (const rawLine of patch.split('\n')) {
    const hunk = rawLine.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      newLineNumber = Number.parseInt(hunk[1], 10) - 1;
      continue;
    }
    if (rawLine.startsWith('+') && !rawLine.startsWith('+++')) {
      newLineNumber += 1;
      lines.push({ lineNumber: newLineNumber, text: rawLine.slice(1) });
    } else if (!rawLine.startsWith('-')) {
      newLineNumber += 1;
    }
  }
  return lines;
}

export function makeFinding({ type, severity, file, line, title, message, snippet, confidence = 'medium' }) {
  return { type, severity, file, line, title, message, snippet: snippet?.slice(0, 160), confidence };
}

export function isSupportedFile(filename) {
  const supported = ['.js', '.jsx', '.ts', '.tsx', '.py', '.env', '.json', '.yml', '.yaml', '.sh'];
  return supported.some((ext) => filename.endsWith(ext)) || filename.includes('.env');
}

export function shouldSkipFile(file) {
  const name = file.filename || '';
  const ignored = ['node_modules/', 'dist/', 'build/', 'coverage/', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'];
  if (ignored.some((part) => name.includes(part) || name.endsWith(part))) return true;
  if (!isSupportedFile(name)) return true;
  return false;
}
