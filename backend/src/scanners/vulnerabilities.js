import { getAddedLinesFromPatch, makeFinding } from './helpers.js';

const vulnRules = [
  {
    title: 'Possible SQL Injection',
    severity: 'high',
    regex: /(SELECT|INSERT|UPDATE|DELETE).*\+|\+.*(SELECT|INSERT|UPDATE|DELETE)|query\s*\([^)]*\+|execute\s*\([^)]*\+/i,
    message: 'User-controlled input appears to be concatenated into a SQL query. Use parameterized queries or prepared statements.'
  },
  {
    title: 'Unsafe eval usage',
    severity: 'high',
    regex: /\beval\s*\(/,
    message: 'eval() can execute arbitrary code. Avoid it or strictly validate and sandbox inputs.'
  },
  {
    title: 'Possible command injection',
    severity: 'high',
    regex: /(exec|execSync|spawn|system|popen)\s*\([^)]*\+/,
    message: 'Shell command appears to include dynamic input. Use safe argument arrays and strict validation.'
  },
  {
    title: 'Weak hash algorithm',
    severity: 'medium',
    regex: /(md5|sha1)\s*\(|createHash\s*\(\s*['"](md5|sha1)['"]\s*\)/i,
    message: 'MD5/SHA1 are weak for security-sensitive hashing. Use bcrypt/argon2 for passwords or SHA-256+ where appropriate.'
  },
  {
    title: 'Insecure random usage',
    severity: 'medium',
    regex: /Math\.random\s*\(/,
    message: 'Math.random() is not cryptographically secure. Use crypto.randomBytes or Web Crypto for secrets/tokens.'
  },
  {
    title: 'Possible XSS risk',
    severity: 'medium',
    regex: /(dangerouslySetInnerHTML|innerHTML\s*=)/,
    message: 'Direct HTML injection can lead to XSS. Sanitize input or avoid raw HTML rendering.'
  },
  {
    title: 'Path traversal risk',
    severity: 'medium',
    regex: /(readFile|writeFile|createReadStream|sendFile)\s*\([^)]*\+|open\s*\([^)]*\+/,
    message: 'File path appears to include dynamic input. Normalize paths and restrict access to an allowed directory.'
  },
  {
    title: 'Overly permissive CORS',
    severity: 'low',
    regex: /origin\s*:\s*['"]\*['"]|Access-Control-Allow-Origin['"]?\s*,\s*['"]\*['"]/i,
    message: 'Wildcard CORS may expose APIs broadly. Restrict origins for production.'
  }
];

export function scanVulnerabilities(files) {
  const findings = [];
  for (const file of files) {
    const addedLines = getAddedLinesFromPatch(file.patch || '');
    for (const { lineNumber, text } of addedLines) {
      for (const rule of vulnRules) {
        if (rule.regex.test(text)) {
          findings.push(makeFinding({
            type: 'vulnerability',
            severity: rule.severity,
            file: file.filename,
            line: lineNumber,
            title: rule.title,
            message: rule.message,
            snippet: text,
            confidence: 'medium'
          }));
          break;
        }
      }
    }
  }
  return findings;
}
