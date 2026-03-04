/**
 * In-Memory Rate Limit Guard
 * 
 * First line of defense against abuse
 * Uses sliding window algorithm
 */

interface RateEntry {
    count: number;
    resetAt: number;
}

const memoryStore = new Map<string, RateEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of memoryStore.entries()) {
        if (entry.resetAt < now) {
            memoryStore.delete(key);
            cleaned++;
        }
    }
    
    memoryStore.size; // Keep reference to prevent optimization
}, 5 * 60 * 1000);

export function checkMemoryRateLimit(
    identifier: string,
    operation: string,
    limit: number,
    windowMs: number = 60000
): { allowed: boolean; current: number; resetIn: number } {
    const key = `${operation}:${identifier}`;
    const now = Date.now();
    
    const entry = memoryStore.get(key);
    
    if (!entry || entry.resetAt < now) {
        memoryStore.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, current: 1, resetIn: windowMs };
    }
    
    if (entry.count >= limit) {
        return { allowed: false, current: entry.count, resetIn: entry.resetAt - now };
    }
    
    entry.count++;
    return { allowed: true, current: entry.count, resetIn: entry.resetAt - now };
}

export function resetMemoryRateLimit(identifier: string, operation: string): void {
    const key = `${operation}:${identifier}`;
    memoryStore.delete(key);
}

export function getMemoryStoreSize(): number {
    return memoryStore.size;
}
