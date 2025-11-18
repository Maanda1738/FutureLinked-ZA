CV parsing diagnostics and recommended fixes

Context
- In the current dev environment, `pdf-parse` and `mammoth` sometimes fail when imported dynamically inside Next.js API routes. The repo already falls back to a demo CV when parsing fails.

Symptoms
- Uploaded PDFs/DOCX return filename only or minimal text.
- Match scores low because text extraction is incomplete.

Possible Causes
- Next.js serverless runtime and ESM/CJS interop (some native bindings or dynamic imports behave differently).
- Missing native dependencies or incompatible versions in the environment.
- Large PDFs that need streaming parsing rather than buffering fully.

Short-term mitigation
- Keep the demo fallback CV for testing.
- Pre-validate uploaded files on the client (size/type) and warn users if parsing may fail.

Long-term fixes
1. Move parsing to a small standalone worker/service (recommended)
   - Create a tiny Express or Fastify microservice that runs outside Next.js serverless environment.
   - Install `pdf-parse` and `mammoth` there and call it via internal HTTP from your API route.
   - Pros: isolates native deps, easier to control runtime, easier to scale.

2. Use a lambda-compatible parsing library or paid API
   - Services like AWS Textract, Google Document AI, or third-party parsing APIs are robust but cost money.

3. Add robust dynamic import handling and polyfills
   - Ensure the libraries are installed and imported correctly. For CJS-only libs, use `await import('module').then(m => m.default || m)`.
   - Try running `npm rebuild` and ensure Node version compatibility.

Debug commands
- From project root:

```powershell
cd frontend
npm ls pdf-parse mammoth || true
node -e "console.log(process.version)"
```

Quick experiments
- Try extracting text from a sample PDF in a separate Node script (outside Next.js) to isolate the problem.

```javascript
// scripts/try-pdf-parse.mjs
import fs from 'fs';
import pdf from 'pdf-parse';
const data = await pdf(fs.readFileSync('sample.pdf'));
console.log(data.text.slice(0, 1000));
```

Notes
- If you'd like, I can implement option (1) (microservice) in this repo as a small local service and wire the Next.js API to call it. That requires adding a tiny server and a dev script to run it alongside Next.js.
