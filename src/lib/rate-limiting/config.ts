/**
 * Rate Limiting Configuration
 * Centralized configuration for all rate limiting rules
 */

export const RATE_LIMIT_CONFIG = {
    // Memory guard limits (per-minute, in-memory)
    MEMORY: {
        'domain-create': 10,      // Max 10 domain creations per minute
        'domain-verify': 20,      // Max 20 verify attempts per minute
        'domain-list': 60,        // Max 60 list requests per minute
        'domain-delete': 10,      // Max 10 deletions per minute
    },

    // Redis limits (per-hour, distributed)
    HOURLY: {
        free: {
            'domain-create': 3,     // Free tier: 3 domains per hour
            'domain-verify': 30,    // 30 verify attempts per hour
            'domain-delete': 5,     // 5 deletions per hour
        },
        pro: {
            'domain-create': 20,    // Pro tier: 20 domains per hour
            'domain-verify': 100,   // 100 verify attempts
            'domain-delete': 50,    // 50 deletions
        },
        enterprise: {
            'domain-create': 100,   // Enterprise: 100 domains per hour
            'domain-verify': -1,    // Unlimited verify attempts
            'domain-delete': -1,    // Unlimited deletions
        },
    },

    // Database limits (daily, quota-based)
    DAILY: {
        free: {
            'domain-create': 5,     // Free: max 5 domains per day
            'domain-verify': 50,
        },
        pro: {
            'domain-create': 50,    // Pro: max 50 domains per day
            'domain-verify': 500,
        },
        enterprise: {
            'domain-create': 500,   // Enterprise: 500 per day
            'domain-verify': -1,    // Unlimited
        },
    },

    // Maximum total domains per tier
    MAX_DOMAINS: {
        free: 3,                  // Free: 3 domains total
        pro: 50,                  // Pro: 50 domains total
        enterprise: 1000,         // Enterprise: 1000 domains total
    },

    // Verification cooldown (seconds between verify button clicks)
    VERIFY_COOLDOWN: {
        free: 300,                // Free: 5 minutes cooldown
        pro: 60,                  // Pro: 1 minute cooldown
        enterprise: 0,            // Enterprise: no cooldown
    },
} as const;

// Type exports
export type UserTier = 'free' | 'pro' | 'enterprise';
export type Operation = 'domain-create' | 'domain-verify' | 'domain-list' | 'domain-delete';
