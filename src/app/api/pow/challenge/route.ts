/**
 * CRITICAL SECURITY: PoW Challenge Generation
 * 
 * Generates cryptographically secure challenges for Proof-of-Work
 * Prevents attackers from bypassing PoW by generating their own challenges
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRedisClient } from '@/lib/rate-limiting/redis-client';
import crypto from 'crypto';

// Tier-based difficulty (leading zeros required)
// Security is in SERVER VERIFICATION, not torturing users!
const DIFFICULTY_BY_TIER = {
    free: 4,        // ~2-3 seconds (good balance)
    pro: 3,         // ~500ms (fast, they pay)
    enterprise: 2   // ~50ms (nearly instant)
} as const;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user's subscription tier
        // ✅ SMART EXPIRATION: Use profiles_with_tier for computed tier
        const { data: profile } = await supabase
            .from('profiles_with_tier')  // ← Using computed view!
            .select('subscription_tier')
            .eq('id', user.id)
            .single();


        const tier = (profile?.subscription_tier || 'free') as keyof typeof DIFFICULTY_BY_TIER;
        const difficulty = DIFFICULTY_BY_TIER[tier];

        // Generate cryptographically secure challenge
        const challenge = crypto.randomBytes(32).toString('hex');

        // Store challenge in Redis (5 minute TTL)
        const redis = getRedisClient();
        const challengeKey = `pow_challenge:${user.id}`;
        await redis.setex(challengeKey, 300, JSON.stringify({
            challenge,
            difficulty,
            createdAt: Date.now()
        }));

        return NextResponse.json({
            success: true,
            challenge,
            difficulty,
            tier,
            estimatedTime: difficulty === 4 ? '~2 seconds' : difficulty === 3 ? '~500ms' : '~50ms'
        });

    } catch (error: any) {
        console.error('[POW CHALLENGE] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate challenge' },
            { status: 500 }
        );
    }
}
