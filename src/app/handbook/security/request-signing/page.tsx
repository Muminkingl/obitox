import Link from "next/link";

export default function RequestSigningPage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    Request Signing
                </h1>
                
                <section className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Why we sign requests, not just authenticate them
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Authentication proves <strong className="text-white">who you are</strong>. 
                        Signing proves <strong className="text-white">the request hasn't been tampered with</strong>.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Example attack without signing:
                    </p>
                    <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-lg mt-2">
                        <div className="text-sm space-y-2">
                            <div className="text-neutral-300">
                                1. You send: <code className="text-neutral-400">{"{ filename: 'photo.jpg' }"}</code>
                            </div>
                            <div className="text-neutral-300">
                                2. Attacker intercepts (man-in-the-middle)
                            </div>
                            <div className="text-neutral-300">
                                3. Changes to: <code className="text-red-400">{"{ filename: '../../etc/passwd' }"}</code>
                            </div>
                            <div className="text-neutral-300">
                                4. We receive modified request, think it's from you
                            </div>
                            <div className="text-red-400 font-bold">
                                ❌ Result: Path traversal attack succeeds
                            </div>
                        </div>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        With request signing:
                    </p>
                    <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-lg mt-2">
                        <div className="text-sm space-y-2">
                            <div className="text-neutral-300">
                                1. You send: <code className="text-neutral-400">{"{ filename: 'photo.jpg' }"}</code> + signature of this exact body
                            </div>
                            <div className="text-neutral-300">
                                2. Attacker intercepts, modifies body
                            </div>
                            <div className="text-neutral-300">
                                3. Signature no longer matches modified body
                            </div>
                            <div className="text-neutral-300">
                                4. We detect tampering, reject request
                            </div>
                            <div className="text-green-400 font-bold">
                                ✅ Result: Attack blocked, you get 401 Unauthorized
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        How HMAC-SHA256 works (simple explanation)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        HMAC = Hash-based Message Authentication Code. It's a way to create a "fingerprint" of your request that only you can create.
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4 space-y-4">
                        <div>
                            <div className="text-neutral-500 text-sm mb-2">Step 1: Build the message</div>
                            <div className="text-neutral-300 text-sm font-mono">
                                message = "POST|/api/v1/upload|1704672000123|{'{\"filename\":\"photo.jpg\"}'}"
                            </div>
                            <div className="text-neutral-400 text-xs mt-1">
                                Format: METHOD | PATH | TIMESTAMP | BODY
                            </div>
                        </div>

                        <div className="border-t border-neutral-700 pt-4">
                            <div className="text-neutral-500 text-sm mb-2">Step 2: Hash with your secret</div>
                            <div className="text-neutral-300 text-sm font-mono">
                                signature = HMAC-SHA256(message, your_secret)
                            </div>
                            <div className="text-neutral-400 text-xs mt-1">
                                Output: "a3f2b9c1d4e5f6a7b8c9d0e1f2a3b4c5..." (64 hex characters)
                            </div>
                        </div>

                        <div className="border-t border-neutral-700 pt-4">
                            <div className="text-neutral-500 text-sm mb-2">Step 3: We verify</div>
                            <div className="text-neutral-300 text-sm">
                                We rebuild the same message, hash it with your secret (from our database), compare signatures.
                            </div>
                            <div className="text-neutral-400 text-xs mt-1">
                                If match → Valid ✅ | If mismatch → Tampered ❌
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Timestamp validation (replay attack prevention)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Every request includes a timestamp. We only accept requests within <strong className="text-white">5 minutes</strong> of the current time.
                    </p>

                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-4">
                        <pre className="text-neutral-300 text-sm">
{`// Client side:
const timestamp = Date.now(); // 1704672000123 (Unix ms)
headers['X-Timestamp'] = timestamp.toString();

// Server side:
const now = Date.now();
const requestTime = parseInt(headers['X-Timestamp']);
const age = Math.abs(now - requestTime);

if (age > 5 * 60 * 1000) { // 5 minutes in milliseconds
  return res.status(401).json({
    error: 'Request timestamp expired',
    hint: 'Timestamp must be within 5 minutes of current time'
  });
}`}
                        </pre>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">Why this matters:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Attacker captures your request at 10:00 AM</li>
                        <li>Tries to replay it at 10:10 AM (10 minutes later)</li>
                        <li>Timestamp is 10 minutes old → Rejected</li>
                        <li>Even though signature is valid, request is too old</li>
                    </ul>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">Clock skew tolerance:</strong>
                    </p>
                    <p className="leading-7 text-neutral-300">
                        We allow ±5 minutes to account for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Server clocks slightly out of sync</li>
                        <li>Network latency (request takes a few seconds to arrive)</li>
                        <li>Time zone confusion (always use UTC/Unix timestamps)</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        If your clock is off by ~5 minutes, you'll get <code className="text-red-400">401: Timestamp expired</code>. 
                        Fix: Sync your system clock with NTP.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        What gets signed (and what doesn't)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Included in signature:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">HTTP method</strong> — GET, POST, DELETE, etc.</li>
                        <li><strong className="text-white">Request path</strong> — /api/v1/upload/r2/signed-url</li>
                        <li><strong className="text-white">Timestamp</strong> — Unix milliseconds</li>
                        <li><strong className="text-white">Request body</strong> — Full JSON payload</li>
                    </ul>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">NOT included in signature:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">Query parameters</strong> — We don't use query params in API, only body</li>
                        <li><strong className="text-white">Headers (except timestamp)</strong> — Can be modified by proxies</li>
                        <li><strong className="text-white">User agent</strong> — Not security-relevant</li>
                    </ul>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">Why this matters:</strong> If we included headers, a proxy could add/modify headers and break the signature. 
                        By only signing method, path, timestamp, and body, we ensure the signature is stable.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Edge cases and gotchas
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <div className="text-white font-bold mb-2">Empty body (GET/DELETE requests)</div>
                            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                                <pre className="text-neutral-300 text-sm">
{`// For GET/DELETE (no body):
const message = \`\${method}|\${path}|\${timestamp}|\`; // Empty string after last |

// Example:
"GET|/api/v1/upload/list|1704672000123|"

// NOT:
"GET|/api/v1/upload/list|1704672000123" // Missing trailing |`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-2">JSON object key order</div>
                            <div className="text-neutral-300 text-sm mb-2">
                                JavaScript objects don't guarantee key order. Use <code className="text-neutral-400">JSON.stringify()</code> consistently:
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                                <pre className="text-neutral-300 text-sm">
{`// ❌ BAD (key order may vary):
const body = { filename: 'a.jpg', contentType: 'image/jpeg' };
const message = \`POST|/path|\${timestamp}|\${JSON.stringify(body)}\`;
// Could be: {"filename":"a.jpg","contentType":"image/jpeg"}
// Or:       {"contentType":"image/jpeg","filename":"a.jpg"}

// ✅ GOOD (consistent):
const bodyString = JSON.stringify(body); // Consistent order
const message = \`POST|/path|\${timestamp}|\${bodyString}\`;`}
                                </pre>
                            </div>
                            <div className="text-neutral-400 text-sm mt-2">
                                We use the <em>exact</em> body string you send. Don't re-serialize it differently when verifying.
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-2">Whitespace in JSON</div>
                            <div className="text-neutral-300 text-sm mb-2">
                                <code className="text-neutral-400">JSON.stringify()</code> doesn't add whitespace by default. Don't add it manually:
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                                <pre className="text-neutral-300 text-sm">
{`// ❌ BAD:
const bodyString = JSON.stringify(body, null, 2); // Pretty-printed
// {"\\n  \\"filename\\": \\"a.jpg\\"\\n}" (includes newlines/spaces)

// ✅ GOOD:
const bodyString = JSON.stringify(body); // Compact
// {"filename":"a.jpg"}`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-2">Path normalization</div>
                            <div className="text-neutral-300 text-sm mb-2">
                                Always use the <em>exact</em> path from your request:
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                                <pre className="text-neutral-300 text-sm">
{`// ❌ BAD (inconsistent):
const path = '/api/v1/upload/r2/signed-url/'; // Trailing slash
// vs
const path = '/api/v1/upload/r2/signed-url';  // No trailing slash

// ✅ GOOD (use URL object):
const url = new URL(request.url);
const path = url.pathname; // Always consistent`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Full implementation example
                    </h2>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                        <pre className="text-neutral-300 text-sm overflow-x-auto">
{`import crypto from 'crypto';

// Your credentials (from environment variables)
const API_KEY = process.env.OBITOX_API_KEY;
const API_SECRET = process.env.OBITOX_API_SECRET;

// Generate signature for a request
function generateSignature(method, path, timestamp, body, secret) {
  // Convert body to string
  const bodyString = typeof body === 'string' 
    ? body 
    : body 
      ? JSON.stringify(body) 
      : '';
  
  // Build message: METHOD|PATH|TIMESTAMP|BODY
  const message = \`\${method.toUpperCase()}|\${path}|\${timestamp}|\${bodyString}\`;
  
  // Sign with HMAC-SHA256
  const signature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
  
  return signature;
}

// Make a signed request
async function makeSignedRequest(method, path, body = null) {
  const timestamp = Date.now();
  const signature = generateSignature(method, path, timestamp, body, API_SECRET);
  
  const response = await fetch(\`https://api.obitox.com\${path}\`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      'X-API-Secret': API_SECRET,
      'X-Signature': signature,
      'X-Timestamp': timestamp.toString()
    },
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(\`API Error: \${error.error}\`);
  }
  
  return response.json();
}

// Usage:
const result = await makeSignedRequest('POST', '/api/v1/upload/r2/signed-url', {
  filename: 'photo.jpg',
  contentType: 'image/jpeg',
  r2AccessKey: '...',
  r2SecretKey: '...',
  r2Bucket: 'my-uploads'
});

console.log('Upload URL:', result.uploadUrl);`}
                        </pre>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Debugging signature mismatches
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        If you're getting <code className="text-red-400">401: Invalid signature</code>, try this:
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4">
                        <pre className="text-neutral-300 text-sm overflow-x-auto">
{`// Add this before making request:
const message = \`\${method}|\${path}|\${timestamp}|\${bodyString}\`;
console.log('Message being signed:', message);
console.log('Signature:', signature);
console.log('Timestamp:', timestamp);
console.log('Body:', bodyString);

// Check:
// 1. Is method uppercase? (POST not post)
// 2. Is path correct? (/api/v1/... not /v1/...)
// 3. Is timestamp a number? (1704672000123 not "2024-01-08")
// 4. Is body exactly what you're sending?
// 5. Are you using the right secret?`}
                        </pre>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-6">
                        Still stuck? Email support@obitox.com with:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Request ID (from error response)</li>
                        <li>Message you signed (sanitize secrets!)</li>
                        <li>Timestamp you used</li>
                        <li>First 8 characters of your API key (e.g., ox_196ae...)</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        We'll check our logs and tell you exactly what we received vs what you signed.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Why we chose HMAC-SHA256 (not JWT, not OAuth)
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <div className="text-white font-bold mb-1">vs JWT:</div>
                            <div className="text-neutral-300 text-sm">
                                JWT is great for <em>sessions</em> (user logged in, here's a token). 
                                We're doing <em>API authentication</em> (every request needs verification). 
                                HMAC is simpler, faster, and more secure for this use case.
                            </div>
                        </div>
                        <div>
                            <div className="text-white font-bold mb-1">vs OAuth:</div>
                            <div className="text-neutral-300 text-sm">
                                OAuth is for <em>delegated access</em> ("let this app access your Google Drive"). 
                                We're doing <em>direct API access</em> (you own the account, you make requests). 
                                OAuth adds complexity we don't need.
                            </div>
                        </div>
                        <div>
                            <div className="text-white font-bold mb-1">Why HMAC-SHA256:</div>
                            <div className="text-neutral-300 text-sm">
                                <ul className="list-disc list-inside ml-4">
                                    <li>Simple to implement (10 lines of code)</li>
                                    <li>Fast to verify (~1ms)</li>
                                    <li>Cryptographically secure (SHA256 is battle-tested)</li>
                                    <li>Request-specific (signature changes per request)</li>
                                    <li>Tamper-evident (any change breaks signature)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Minimalist Footer Navigation */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/handbook/security/api-keys-and-secrets"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            API keys & secrets
                        </div>
                    </Link>
                    <Link
                        href="/handbook/security/rate-limits-and-abuse"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Rate limits & abuse
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}