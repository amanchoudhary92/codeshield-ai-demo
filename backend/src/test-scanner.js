import { runSecurityScan } from './scanners/index.js';

const files = [
  {
    filename: 'src/config.js',
    patch: `@@ -0,0 +1,5 @@\n+const OPENAI_API_KEY = "sk-test123456789012345678901234";\n+const db = "postgres://user:pass@localhost:5432/app";`
  },
  {
    filename: 'src/api/users.js',
    patch: `@@ -0,0 +1,4 @@\n+app.get('/users', (req, res) => {\n+  db.query("SELECT * FROM users WHERE email = '" + req.query.email + "'");\n+  eval(req.query.code);\n+});`
  }
];

console.log(JSON.stringify(runSecurityScan(files), null, 2));
