import { getAddedLinesFromPatch, makeFinding } from './helpers.js';

const secretRules = [
  {
    title: 'Possible OpenAI API key exposed',
    severity: 'critical',
    regex: /\bsk-[A-Za-z0-9_-]{20,}\b/,
    message: 'This looks like an OpenAI-style API key. Move it to environment variables and rotate the exposed key.'
  },
  {
    title: 'Possible GitHub token exposed',
    severity: 'critical',
    regex: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
    message: 'This looks like a GitHub token. Remove it from code and rotate it immediately.'
  },
  {
    title: 'Possible AWS access key exposed',
    severity: 'critical',
    regex: /\bAKIA[0-9A-Z]{16}\b/,
    message: 'This looks like an AWS access key. Remove it from code and rotate the key in AWS IAM.'
  },
  {
    title: 'Possible Stripe secret key exposed',
    severity: 'critical',
    regex: /\bsk_(live|test)_[A-Za-z0-9]{20,}\b/,
    message: 'This looks like a Stripe secret key. Move it to secure environment variables and rotate it.'
  },
  {
    title: 'Private key block added',
    severity: 'critical',
    regex: /-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
    message: 'Private keys should never be committed. Remove this key and generate a replacement.'
  },
  {
    title: 'Database URL added',
    severity: 'high',
    regex: /\b(postgres|postgresql|mysql|mongodb|redis):\/\/[^\s'"`]+/i,
    message: 'Database connection URLs often contain credentials. Move them to environment variables.'
  },
  {
    title: 'JWT token-like value added',
    severity: 'high',
    regex: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/,
    message: 'This looks like a JWT. Avoid committing tokens or session credentials.'
  },
  {
    title: 'Suspicious hardcoded secret assignment',
    severity: 'medium',
    regex: /(api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"\n]{8,}['"]/i,
    message: 'This looks like a hardcoded secret or credential. Use environment variables or a secret manager.'
  }
];

export function scanSecrets(files) {
  const findings = [];
  for (const file of files) {
    const addedLines = getAddedLinesFromPatch(file.patch || '');
    for (const { lineNumber, text } of addedLines) {
      for (const rule of secretRules) {
        if (rule.regex.test(text)) {
          findings.push(makeFinding({
            type: 'secret',
            severity: rule.severity,
            file: file.filename,
            line: lineNumber,
            title: rule.title,
            message: rule.message,
            snippet: text,
            confidence: 'high'
          }));
          break;
        }
      }
    }
  }
  return findings;
}
