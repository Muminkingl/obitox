import Link from "next/link";

export default function ApiKeysPage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    API Keys & Secrets
                </h1>
                
                <section className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        We use dual-key authentication, not just bearer tokens
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Most APIs give you one key and call it a day. We give you <strong className="text-white">two</strong>:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">API Key</strong> (public, identifies you) — <code className="text-green-400">ox_196aed8...</code></li>
                        <li><strong className="text-white">API Secret</strong> (private, signs requests) — <code className="text-red-400">sk_0d94df0...</code></li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        The key identifies you. The secret <strong className="text-white">proves it's actually you</strong> via HMAC-SHA256 signatures.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        Why? Because <strong className="text-white">if someone steals your API key from browser network logs, they still can't make requests without the secret</strong>.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        How request signing works
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Every request must include 4 headers:
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-4">
                        <pre className="text-neutral-300 text-sm overflow-x-auto">
{`X-API-Key: ox_196aed8312066f42b12566f79bc30b55ff2e3209794abc23
X-API-Secret: sk_0d94df0aa198e04f49035122063b650b5c73fa96020ac81f...
X-Signature: a3f2b9c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7
X-Timestamp: 1704672000123`}
                        </pre>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">Step 1: Create the signature payload</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                        <pre className="text-neutral-300 text-sm overflow-x-auto">
{`// In your code:
const method = 'POST';
const path = '/api/v1/upload/r2/signed-url';
const timestamp = Date.now(); // Current Unix timestamp in ms
const body = { filename: 'photo.jpg', ... };

// Build the message to sign:
const message = \`\${method.toUpperCase()}|\${path}|\${timestamp}|\${JSON.stringify(body)}\`;

// Example output:
"POST|/api/v1/upload/r2/signed-url|1704672000123|{"filename":"photo.jpg",...}"`}
                        </pre>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">Step 2: Sign with HMAC-SHA256</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                        <pre className="text-neutral-300 text-sm overflow-x-auto">
{`import crypto from 'crypto';

const signature = crypto
  .createHmac('sha256', API_SECRET)
  .update(message)
  .digest('hex');

// Example output:
"a3f2b9c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7"`}
                        </pre>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">Step 3: Send the request</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                        <pre className="text-neutral-300 text-sm overflow-x-auto">
{`const response = await fetch('https://api.obitox.com/v1/upload/r2/signed-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
    'X-API-Secret': API_SECRET,
    'X-Signature': signature,
    'X-Timestamp': timestamp.toString()
  },
  body: JSON.stringify(body)
});`}
                        </pre>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">What we do on our side:</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Extract <code className="text-neutral-400">X-API-Key</code> → Lookup your account</li>
                        <li>Extract <code className="text-neutral-400">X-API-Secret</code> → Fetch your stored secret (hashed)</li>
                        <li>Extract <code className="text-neutral-400">X-Timestamp</code> → Check it's within 5 minutes (prevents replay attacks)</li>
                        <li>Rebuild the message: <code className="text-neutral-400">METHOD|PATH|TIMESTAMP|BODY</code></li>
                        <li>Sign it with your secret → Compare to <code className="text-neutral-400">X-Signature</code></li>
                        <li>If signatures match → Request is authentic ✅</li>
                        <li>If not → 401 Unauthorized ❌</li>
                    </ol>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Why this is more secure than bearer tokens
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-lg">
                            <div className="text-red-400 font-bold mb-2">❌ Bearer Token (most APIs):</div>
                            <div className="text-neutral-300 text-sm">
                                <code className="text-neutral-400">Authorization: Bearer sk_live_abc123...</code>
                            </div>
                            <div className="text-neutral-400 text-sm mt-2">
                                <strong>Problem:</strong> If someone intercepts this (browser DevTools, network logs, compromised proxy), 
                                they can replay it forever until you manually revoke it.
                            </div>
                        </div>

                        <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-lg">
                            <div className="text-green-400 font-bold mb-2">✅ HMAC Signature (us):</div>
                            <div className="text-neutral-300 text-sm space-y-1">
                                <div><code className="text-neutral-400">X-API-Key: ox_...</code> (can be public)</div>
                                <div><code className="text-neutral-400">X-API-Secret: sk_...</code> (never logged, never cached)</div>
                                <div><code className="text-neutral-400">X-Signature: a3f2b9...</code> (unique per request)</div>
                                <div><code className="text-neutral-400">X-Timestamp: 1704672000123</code> (5min window)</div>
                            </div>
                            <div className="text-neutral-400 text-sm mt-2">
                                <strong>Why better:</strong>
                                <ul className="list-disc list-inside ml-4 mt-1">
                                    <li>Signature changes every request (includes timestamp + body)</li>
                                    <li>Can't replay old requests (timestamp expires after 5 minutes)</li>
                                    <li>Can't forge requests (need secret to generate valid signature)</li>
                                    <li>Body tampering detected (signature includes full body)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Attack scenarios we prevent
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <div className="text-white font-bold mb-1">Replay Attack:</div>
                            <div className="text-neutral-300 text-sm">
                                Attacker captures your request, tries to replay it 10 minutes later.
                            </div>
                            <div className="text-green-400 text-sm mt-1">
                                ✅ Blocked: Timestamp is ~5 minutes old → 401 Unauthorized
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-1">Man-in-the-Middle:</div>
                            <div className="text-neutral-300 text-sm">
                                Attacker intercepts request, modifies body (changes filename from "safe.jpg" to "../../etc/passwd")
                            </div>
                            <div className="text-green-400 text-sm mt-1">
                                ✅ Blocked: Signature doesn't match modified body → 401 Unauthorized
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-1">Stolen API Key (from logs):</div>
                            <div className="text-neutral-300 text-sm">
                                Attacker sees <code className="text-neutral-400">X-API-Key: ox_...</code> in browser DevTools
                            </div>
                            <div className="text-green-400 text-sm mt-1">
                                ✅ Blocked: Without secret, can't generate valid signature → 401 Unauthorized
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-1">Brute Force Signature:</div>
                            <div className="text-neutral-300 text-sm">
                                Attacker tries to guess valid signature (SHA256 has 2^256 possibilities)
                            </div>
                            <div className="text-green-400 text-sm mt-1">
                                ✅ Blocked: Would take longer than age of universe to brute force
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Key format and storage
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">API Key format:</strong> <code className="text-green-400">ox_[40 hex characters]</code><br />
                        <strong className="text-white">API Secret format:</strong> <code className="text-red-400">sk_[64 hex characters]</code>
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">How we store them:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">API Key:</strong> Stored in plaintext (needs to be looked up fast, Redis cache)</li>
                        <li><strong className="text-white">API Secret:</strong> Hashed with bcrypt (12 rounds), never stored in plaintext</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">What this means:</strong> If our database leaks:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Attacker gets API keys → Useless without secrets</li>
                        <li>Attacker gets hashed secrets → Can't reverse bcrypt (computationally infeasible)</li>
                        <li>You still need to rotate keys (we'll email you), but damage is minimal</li>
                    </ul>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Best practices (actually important)
                    </h2>
                    <div className="bg-yellow-900/10 border border-yellow-500/20 p-6 rounded-lg space-y-4">
                        <div>
                            <div className="text-yellow-400 font-bold mb-2">⚠️ NEVER commit secrets to Git</div>
                            <div className="text-neutral-300 text-sm">
                                Use environment variables:
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded mt-2">
                                <pre className="text-neutral-300 text-xs">
{`// .env (gitignored!)
OBITOX_API_KEY=ox_196aed8312066f42b12566f79bc30b55ff2e3209794abc23
OBITOX_API_SECRET=sk_0d94df0aa198e04f49035122063b650b5c73fa96020ac81f...

// In your code:
const API_KEY = process.env.OBITOX_API_KEY;
const API_SECRET = process.env.OBITOX_API_SECRET;`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <div className="text-yellow-400 font-bold mb-2">⚠️ Use separate keys for dev/prod</div>
                            <div className="text-neutral-300 text-sm">
                                Create different keys for:
                                <ul className="list-disc list-inside ml-4 mt-1">
                                    <li>Local development (<code className="text-neutral-400">ox_test_...</code>)</li>
                                    <li>Staging environment (<code className="text-neutral-400">ox_staging_...</code>)</li>
                                    <li>Production (<code className="text-neutral-400">ox_live_...</code>)</li>
                                </ul>
                                If dev key leaks, production is safe.
                            </div>
                        </div>

                        <div>
                            <div className="text-yellow-400 font-bold mb-2">⚠️ Rotate keys every 90 days</div>
                            <div className="text-neutral-300 text-sm">
                                Create new key → Update environment variables → Delete old key.<br />
                                We'll remind you via email 7 days before expiry.
                            </div>
                        </div>

                        <div>
                            <div className="text-yellow-400 font-bold mb-2">⚠️ Revoke immediately if compromised</div>
                            <div className="text-neutral-300 text-sm">
                                Dashboard → API Keys → Click "Revoke" → Takes effect in 5 minutes (cache TTL).<br />
                                Better safe than sorry.
                            </div>
                        </div>

                        <div>
                            <div className="text-yellow-400 font-bold mb-2">⚠️ Don't send secrets to client-side code</div>
                            <div className="text-neutral-300 text-sm">
                                <strong className="text-red-400">Bad:</strong> React app making signed requests from browser (secret exposed in JS bundle)<br />
                                <strong className="text-green-400">Good:</strong> Backend API makes signed requests, React calls your backend
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Helper library (we provide this)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Don't want to write HMAC signing yourself? Use our SDK:
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-4">
                        <pre className="text-neutral-300 text-sm overflow-x-auto">
{`npm install @obitox/sdk

import { ObitoX } from '@obitox/sdk';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,
  apiSecret: process.env.OBITOX_API_SECRET
});

// SDK handles signing automatically:
const { uploadUrl } = await client.r2.getSignedUrl({
  filename: 'photo.jpg',
  r2AccessKey: '...',
  r2SecretKey: '...',
  r2Bucket: 'my-uploads'
});

// Behind the scenes:
// 1. Generates timestamp
// 2. Creates signature
// 3. Sends request with all 4 headers
// 4. Handles errors, retries, rate limits`}
                        </pre>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        What happens if you get it wrong
                    </h2>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-4">
                        <div>
                            <div className="text-red-400 font-bold mb-1">Missing X-Signature header:</div>
                            <div className="text-neutral-300 text-sm">
                                <code className="text-xs">401 Unauthorized: Missing signature header</code>
                            </div>
                        </div>
                        <div>
                            <div className="text-red-400 font-bold mb-1">Signature doesn't match:</div>
                            <div className="text-neutral-300 text-sm">
                                <code className="text-xs">401 Unauthorized: Invalid signature</code>
                            </div>
                        </div>
                        <div>
                            <div className="text-red-400 font-bold mb-1">Timestamp too old (~5 minutes):</div>
                            <div className="text-neutral-300 text-sm">
                                <code className="text-xs">401 Unauthorized: Request timestamp expired</code>
                            </div>
                        </div>
                        <div>
                            <div className="text-red-400 font-bold mb-1">Timestamp in future (clock skew):</div>
                            <div className="text-neutral-300 text-sm">
                                <code className="text-xs">401 Unauthorized: Request timestamp in future (check system clock)</code>
                            </div>
                        </div>
                        <div>
                            <div className="text-red-400 font-bold mb-1">Invalid API key:</div>
                            <div className="text-neutral-300 text-sm">
                                <code className="text-xs">401 Unauthorized: API key not found or revoked</code>
                            </div>
                        </div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        All errors include a <code className="text-neutral-400">requestId</code> for debugging. 
                        If you're stuck, email support with the request ID and we'll check our logs.
                    </p>
                </section>
            </div>

            {/* Minimalist Footer Navigation */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/handbook/architecture/performance-philosophy"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Performance philosophy
                        </div>
                    </Link>
                    <Link
                        href="/handbook/security/request-signing"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Request signing
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}