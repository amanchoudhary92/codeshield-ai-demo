# CodeShield AI Demo Test Cases

Use these test cases before inviting beta users.

## 1. Clean PR

Add:

```js
export function add(a, b) {
  return a + b;
}
```

Expected: clean scan comment.

## 2. OpenAI-style fake key

Add:

```js
const OPENAI_API_KEY = "sk-test123456789012345678901234";
```

Expected: critical secret finding.

## 3. Database URL

Add:

```js
const db = "postgres://user:pass@localhost:5432/app";
```

Expected: high secret finding.

## 4. SQL injection

Add:

```js
db.query("SELECT * FROM users WHERE email = '" + req.query.email + "'");
```

Expected: high vulnerability finding.

## 5. Unsafe eval

Add:

```js
eval(req.query.code);
```

Expected: high vulnerability finding.

## 6. Weak hashing

Add:

```js
crypto.createHash("md5").update(password).digest("hex");
```

Expected: medium vulnerability finding.

## 7. XSS risk

Add:

```jsx
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

Expected: medium vulnerability finding.
