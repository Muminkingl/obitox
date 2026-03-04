import Link from "next/link";

export default function KeyRevocationPage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    Key Revocation & Rotation
                </h1>
                
                <section className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Revocation takes effect in under 5 minutes
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        If your API key leaks (committed to Git, exposed in logs, stolen in a breach), you can revoke it instantly from the dashboard.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Timeline:</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <div className="text-neutral-400">Click "Revoke" in dashboard</div>
                            <div className="text-green-400">0 seconds</div>
                        </div>
                        <div className="flex justify-between text-sm border-t border-neutral-700 pt-3">
                            <div className="text-neutral-400">Database updated</div>
                            <div className="text-green-400">~100ms</div>
                        </div>
                        <div className="flex justify-between text-sm border-t border-neutral-700 pt-3">
                            <div className="text-neutral-400">Redis cache invalidated</div>
                            <div className="text-green-400">~500ms</div>
                        </div>
                        <div className="flex justify-between text-sm border-t border-neutral-700 pt-3">
                            <div className="text-neutral-400">Workers cache expires</div>
                            <div className="text-yellow-400">~5 minutes (TTL)</div>
                        </div>
                        <div className="flex justify-between text-sm border-t border-neutral-700 pt-3">
                            <div className="text-neutral-400">Key fully revoked</div>
                            <div className="text-green-400 font-bold">~5 minutes ✅</div>
                        </div>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">Why not instant?</strong> We cache API keys in Redis (5min TTL) for performance. 
                        Without caching, every request would hit the database (20-50ms), making the API slower.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Tradeoff:</strong> 99.9% of requests are cached (fast), but revocation takes up to 5 minutes to propagate fully.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        How to revoke a key
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <div className="text-white font-bold mb-2">Method 1: Dashboard (recommended)</div>
                            <ol className="list-decimal list-inside space-y-2 text-neutral-300 leading-7 ml-4 text-sm">
                                <li>Go to <a href="/dashboard/api-keys" className="text-blue-400 hover:underline">/dashboard/api-keys</a></li>
                                <li>Find the key you want to revoke</li>
                                <li>Click the <span className="text-red-400">🗑️</span> icon or "Revoke" button</li>
                                <li>Confirm (no undo!)</li>
                                <li>Key is immediately marked as revoked in database</li>
                            </ol>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-2">Method 2: API (for automation)</div>
                            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                                <pre className="text-neutral-300 text-sm">
{`DELETE /api/v1/keys/:keyId
Headers:
  X-API-Key: YOUR_MASTER_KEY
  X-API-Secret: YOUR_MASTER_SECRET
  X-Signature: ...
  X-Timestamp: ...

Response:
{
  "success": true,
  "message": "API key revoked",
  "keyId": "key_abc123",
  "revokedAt": "2024-01-08T10:30:00Z",
  "cacheExpiry": "~5 minutes"
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        What happens after revocation
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                            <div className="text-neutral-500 text-sm mb-2">Immediately (0-1 minute):</div>
                            <ul className="list-disc list-inside space-y-1 text-neutral-300 text-sm ml-4">
                                <li>New requests with this key start failing (cache miss → DB lookup → revoked)</li>
                                <li>Dashboard shows key as "Revoked" with red indicator</li>
                            </ul>
                        </div>

                        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                            <div className="text-neutral-500 text-sm mb-2">After 5 minutes (cache TTL):</div>
                            <ul className="list-disc list-inside space-y-1 text-neutral-300 text-sm ml-4">
                                <li>All requests with this key fail (100% blocked)</li>
                                <li>Error: <code className="text-red-400 text-xs">401: API key revoked</code></li>
                            </ul>
                        </div>

                        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                            <div className="text-neutral-500 text-sm mb-2">Permanent:</div>
                            <ul className="list-disc list-inside space-y-1 text-neutral-300 text-sm ml-4">
                                <li>Key cannot be un-revoked (create a new one)</li>
                                <li>Key stays in database for audit trail</li>
                                <li>Old request logs still reference this key ID</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Key rotation (recommended every 90 days)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Why rotate?</strong> Even if your key hasn't leaked, rotating regularly limits damage if it does leak later.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Rotation process (zero downtime):</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4 space-y-4">
                        <div>
                            <div className="text-green-400 font-bold mb-2">Step 1: Create new key</div>
                            <div className="text-neutral-300 text-sm">
                                Dashboard → API Keys → "Create New Key"<br />
                                Copy new key and secret (shown only once!)
                            </div>
                        </div>

                        <div className="border-t border-neutral-700 pt-4">
                            <div className="text-green-400 font-bold mb-2">Step 2: Deploy new key to production</div>
                            <div className="text-neutral-300 text-sm">
                                Update environment variables:<br />
                                <code className="text-neutral-400 text-xs">OBITOX_API_KEY=ox_new...</code><br />
                                <code className="text-neutral-400 text-xs">OBITOX_API_SECRET=sk_new...</code><br />
                                Restart/redeploy your application
                            </div>
                        </div>

                        <div className="border-t border-neutral-700 pt-4">
                            <div className="text-green-400 font-bold mb-2">Step 3: Verify new key works</div>
                            <div className="text-neutral-300 text-sm">
                                Make a test request, check logs/monitoring<br />
                                Confirm no errors
                            </div>
                        </div>

                        <div className="border-t border-neutral-700 pt-4">
                            <div className="text-yellow-400 font-bold mb-2">Step 4: Wait 24 hours (optional but recommended)</div>
                            <div className="text-neutral-300 text-sm">
                                Keep old key active for 1 day<br />
                                Catches any services still using old key<br />
                                Check logs for requests with old key
                            </div>
                        </div>

                        <div className="border-t border-neutral-700 pt-4">
                            <div className="text-red-400 font-bold mb-2">Step 5: Revoke old key</div>
                            <div className="text-neutral-300 text-sm">
                                Dashboard → Find old key → Revoke<br />
                                Old key stops working within 5 minutes<br />
                                If anything breaks, you know what service still needs updating
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Automatic rotation reminders
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        We'll email you:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">7 days before 90-day mark:</strong> "Consider rotating your API keys soon"</li>
                        <li><strong className="text-white">At 90 days:</strong> "Your API keys are 90 days old (security best practice: rotate)"</li>
                        <li><strong className="text-white">At 180 days:</strong> "Your API keys are 6 months old (strongly recommend rotating)"</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">We don't force rotation</strong> (your keys will keep working), 
                        but we'll nag you because it's good security hygiene.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Emergency revocation (compromised key)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Scenario:</strong> You discover your API key was committed to a public GitHub repo 2 weeks ago.
                    </p>
                    <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-lg mt-4 space-y-4">
                        <div>
                            <div className="text-red-400 font-bold mb-2">1. Revoke immediately (do this first!)</div>
                            <div className="text-neutral-300 text-sm">
                                Don't wait. Don't investigate. Revoke now.<br />
                                Dashboard → API Keys → Revoke<br />
                                Takes effect in 5 minutes
                            </div>
                        </div>

                        <div className="border-t border-neutral-700 pt-4">
                            <div className="text-red-400 font-bold mb-2">2. Create new key</div>
                            <div className="text-neutral-300 text-sm">
                                Generate fresh key + secret<br />
                                Update environment variables<br />
                                Deploy to production ASAP
                            </div>
                        </div>

                        <div className="border-t border-neutral-700 pt-4">
                            <div className="text-yellow-400 font-bold mb-2">3. Check logs (optional)</div>
                            <div className="text-neutral-300 text-sm">
                                Dashboard → API Keys → View old key → Request logs<br />
                                Look for suspicious IPs, unusual usage patterns<br />
                                Email support@obitox.com if you see abuse
                            </div>
                        </div>

                        <div className="border-t border-neutral-700 pt-4">
                            <div className="text-green-400 font-bold mb-2">4. Remove from Git history</div>
                            <div className="text-neutral-300 text-sm">
                                <code className="text-neutral-400 text-xs">git filter-branch</code> or BFG Repo-Cleaner<br />
                                Force push to rewrite history<br />
                                Even though key is revoked, clean up the leak
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        What we do on our side
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        When you revoke a key:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">Mark key as revoked</strong> in database (immediate)</li>
                        <li><strong className="text-white">Delete from Redis cache</strong> (500ms)</li>
                        <li><strong className="text-white">Set TTL to 0</strong> on Workers cache (forces refresh)</li>
                        <li><strong className="text-white">Log revocation event</strong> (audit trail)</li>
                        <li><strong className="text-white">Email you confirmation</strong> ("Key ox_196a... revoked")</li>
                    </ul>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">We do NOT:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Delete the key from database (kept for audit trail)</li>
                        <li>Notify you of every failed request (would be spam)</li>
                        <li>Automatically create a new key (you control this)</li>
                    </ul>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Best practices (actually follow these)
                    </h2>
                    <div className="bg-yellow-900/10 border border-yellow-500/20 p-6 rounded-lg space-y-4">
                        <div>
                            <div className="text-yellow-400 font-bold mb-2">⚠️ Rotate keys every 90 days</div>
                            <div className="text-neutral-300 text-sm">
                                Set a calendar reminder. We'll email you, but don't rely on that.<br />
                                Takes 10 minutes, prevents months of potential exposure if leaked.
                            </div>
                        </div>

                        <div>
                            <div className="text-yellow-400 font-bold mb-2">⚠️ Use separate keys per environment</div>
                            <div className="text-neutral-300 text-sm">
                                Dev: <code className="text-neutral-400 text-xs">ox_test_...</code><br />
                                Staging: <code className="text-neutral-400 text-xs">ox_staging_...</code><br />
                                Production: <code className="text-neutral-400 text-xs">ox_live_...</code><br />
                                If dev key leaks, prod is safe.
                            </div>
                        </div>

                        <div>
                            <div className="text-yellow-400 font-bold mb-2">⚠️ Never hardcode keys in source code</div>
                            <div className="text-neutral-300 text-sm">
                                ❌ <code className="text-red-400 text-xs">const API_KEY = "ox_196aed8..."; // NEVER DO THIS</code><br />
                                ✅ <code className="text-green-400 text-xs">const API_KEY = process.env.OBITOX_API_KEY;</code>
                            </div>
                        </div>

                        <div>
                            <div className="text-yellow-400 font-bold mb-2">⚠️ Add .env to .gitignore</div>
                            <div className="text-neutral-300 text-sm">
                                Most common leak: <code className="text-neutral-400 text-xs">.env</code> file committed to Git.<br />
                                Check <code className="text-neutral-400 text-xs">.gitignore</code> includes <code className="text-neutral-400 text-xs">.env*</code>
                            </div>
                        </div>

                        <div>
                            <div className="text-yellow-400 font-bold mb-2">⚠️ Limit key scope (future feature)</div>
                            <div className="text-neutral-300 text-sm">
                                Coming soon: Create keys with limited permissions (read-only, specific providers, IP restrictions).<br />
                                For now: Create separate keys for different services, revoke individually if needed.
                            </div>
                        </div>

                        <div>
                            <div className="text-yellow-400 font-bold mb-2">⚠️ Monitor key usage</div>
                            <div className="text-neutral-300 text-sm">
                                Dashboard → API Keys → Click key → View usage<br />
                                Unexpected spikes? Revoke and investigate.
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        FAQ
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <div className="text-white font-bold mb-1">Can I un-revoke a key?</div>
                            <div className="text-neutral-300 text-sm">
                                No. Revocation is permanent. Create a new key instead.<br />
                                Why: Simpler logic, prevents accidents (can't un-revoke compromised key by mistake).
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-1">How many keys can I have?</div>
                            <div className="text-neutral-300 text-sm">
                                Free: 5 active keys<br />
                                Pro: 20 active keys<br />
                                Enterprise: Unlimited<br />
                                Revoked keys don't count toward limit.
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-1">What if I lose my secret?</div>
                            <div className="text-neutral-300 text-sm">
                                We show it <strong>only once</strong> when you create the key. If you lose it:<br />
                                1. Revoke the old key<br />
                                2. Create a new key<br />
                                3. Save the secret this time (use a password manager)
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-1">Can I rename keys?</div>
                            <div className="text-neutral-300 text-sm">
                                Yes. Dashboard → API Keys → Click key → Edit name<br />
                                Name is for your reference only (not used in API calls).
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-1">Do revoked keys show in logs?</div>
                            <div className="text-neutral-300 text-sm">
                                Yes. Old requests still reference the key ID.<br />
                                Dashboard shows "(Revoked)" badge next to key name in logs.
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Minimalist Footer Navigation */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/handbook/security/rate-limits-and-abuse"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Rate limits & abuse
                        </div>
                    </Link>
                    <Link
                        href="/handbook/reliability/failure-modes"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Failure modes
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}