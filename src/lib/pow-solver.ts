/**
 * Proof-of-Work Solver
 * 
 * Used for client-side challenge solving to prevent API abuse
 * Finds a nonce where SHA256(challenge + nonce) starts with N zeros
 */

export async function solvePoW(
    challenge: string,
    difficulty: number,
    onProgress?: (percent: number) => void
): Promise<number> {
    const targetPrefix = '0'.repeat(difficulty);
    const batchSize = 100000;
    let nonce = 0;
    const maxIterations = 100000000; // 100M max

    while (nonce < maxIterations) {
        const batchEnd = Math.min(nonce + batchSize, maxIterations);

        for (let i = nonce; i < batchEnd; i++) {
            const data = challenge + String(i);
            const hash = await sha256(data);

            if (hash.startsWith(targetPrefix)) {
                return i;
            }
        }

        if (onProgress) {
            const progress = Math.floor((batchEnd / maxIterations) * 100);
            onProgress(progress);
        }

        nonce = batchEnd;
        // Yield to event loop
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    throw new Error('Failed to find solution within iteration limit');
}

async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function testPoWSolver(): Promise<boolean> {
    try {
        const challenge = 'test-challenge-123';
        const difficulty = 3;
        await solvePoW(challenge, difficulty);
        return true;
    } catch (error) {
        console.error('[PoW] Test failed:', error);
        return false;
    }
}

// Aliases for backward compatibility
export const solveChallenge = solvePoW;

// Estimate solving time based on difficulty
export function estimateSolvingTime(difficulty: number): number {
    // Average iterations needed: 16^difficulty
    // With ~10K iterations per second in browser
    const avgIterations = Math.pow(16, difficulty);
    const iterationsPerSecond = 10000;
    return Math.ceil(avgIterations / iterationsPerSecond);
}
