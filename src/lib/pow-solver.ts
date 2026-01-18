/**
 * Browser-based Proof-of-Work Solver
 * 
 * Solves crypto puzzles to prevent mass API key creation
 * - Non-blocking UI (uses setTimeout batches)
 * - Progress callbacks
 * - ~500ms for difficulty 4
 * 
 * Used by: Create API Key flow
 */

/**
 * Solve a Proof-of-Work challenge
 * 
 * @param challenge - Challenge string from server
 * @param difficulty - Number of leading zeros required (3-6)
 * @param onProgress - Optional progress callback (0-100)
 * @returns Promise<number> - The solution nonce
 * 
 * @example
 * const solution = await solveChallenge(
 *   'abc123def456',
 *   4,
 *   (progress) => console.log(`${progress}%`)
 * );
 */
export async function solveChallenge(
    challenge: string,
    difficulty: number,
    onProgress?: (progress: number) => void
): Promise<number> {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        let nonce = 0;
        const maxIterations = 10_000_000; // Safety limit
        const batchSize = 5000; // Check 5k hashes per batch

        console.log(`🔧 Starting PoW solver (difficulty: ${difficulty})...`);
        console.log(`   Challenge: ${challenge.substring(0, 20)}...`);
        console.log(`   Target: Hash must start with ${'0'.repeat(difficulty)}`);

        const solve = async () => {
            const batchStart = nonce;
            const batchEnd = Math.min(nonce + batchSize, maxIterations);

            // Log start of batch
            if (batchStart % (batchSize * 5) === 0) {
                console.log(`   Checking hashes ${batchStart}-${batchEnd}...`);
            }

            // Process one batch
            while (nonce < batchEnd) {
                const hash = await sha256(challenge + nonce);

                // Check if solution found!
                if (hash.startsWith('0'.repeat(difficulty))) {
                    const elapsed = Date.now() - startTime;
                    console.log(`✅ PoW SOLVED!`);
                    console.log(`   Time: ${elapsed}ms`);
                    console.log(`   Attempts: ${nonce.toLocaleString()}`);
                    console.log(`   Solution: ${nonce}`);
                    console.log(`   Hash: ${hash}`);
                    resolve(nonce);
                    return;
                }

                nonce++;
            }

            // Update progress
            if (onProgress) {
                const estimatedAttempts = Math.pow(16, difficulty);
                const progress = Math.min((nonce / estimatedAttempts) * 100, 99);
                onProgress(Math.round(progress));
            }

            // Continue or abort
            if (nonce < maxIterations) {
                setTimeout(solve, 0); // Keep UI responsive
            } else {
                const elapsed = Date.now() - startTime;
                reject(new Error(`Max iterations reached after ${elapsed}ms`));
            }
        };

        solve();
    });
}

/**
 * SHA-256 hash using Web Crypto API (browser-native, fast!)
 * 
 * @param message - String to hash
 * @returns Promise<string> - Hex string of hash
 */
async function sha256(message: string): Promise<string> {
    // Encode message to bytes
    const msgBuffer = new TextEncoder().encode(message);

    // Hash using native Web Crypto API (FAST!)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return hashHex;
}

/**
 * Estimate solving time based on difficulty
 * 
 * @param difficulty - Difficulty level (3-6)
 * @returns Estimated time in milliseconds
 * 
 * Benchmarks (approximate, varies by device):
 * - Difficulty 3: ~50-100ms
 * - Difficulty 4: ~300-600ms
 * - Difficulty 5: ~3-7 seconds
 * - Difficulty 6: ~30-90 seconds
 */
export function estimateSolvingTime(difficulty: number): number {
    const baseTime = 150; // ms per difficulty level
    return difficulty * baseTime;
}

/**
 * Test if PoW solver is working
 * (For development/debugging)
 */
export async function testPoWSolver() {
    console.log('🧪 Testing PoW Solver...');

    const challenge = 'test_challenge_12345';
    const difficulty = 3; // Easy for testing

    try {
        const solution = await solveChallenge(
            challenge,
            difficulty,
            (progress) => console.log(`Progress: ${progress}%`)
        );

        console.log(`✅ Test passed! Solution: ${solution}`);
        return true;
    } catch (error) {
        console.error('❌ Test failed:', error);
        return false;
    }
}
