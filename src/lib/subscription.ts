import { createClient } from '@/lib/supabase/server';

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export interface UserSubscription {
  plan: SubscriptionPlan;
  trialEndsAt: Date | null;
  isInTrial: boolean;
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const supabase = await createClient();

  // Validate user authentication first
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('No authenticated user found when fetching subscription');
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_start_date, trial_ends_at')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching user subscription:', error);
    return null;
  }

  const trialEndsAt = data.trial_ends_at ? new Date(data.trial_ends_at) : null;
  const now = new Date();
  const isInTrial = trialEndsAt ? now < trialEndsAt : false;

  return {
    plan: (data.subscription_tier || 'free') as SubscriptionPlan,
    trialEndsAt,
    isInTrial
  };
}

export async function getApiKeyLimit(userId: string): Promise<number> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) return 1; // Default to Free tier (stricter limit)

  // Match the limits from subscription_plans table
  switch (subscription.plan) {
    case 'free':
      return 1;
    case 'pro':
      return 15;
    case 'enterprise':
      return 999999; // Effectively unlimited
    default:
      return 1;
  }
}

export async function getRemainingApiKeys(userId: string): Promise<number> {
  const supabase = await createClient();
  const limit = await getApiKeyLimit(userId);

  const { data, error } = await supabase
    .rpc('count_user_api_keys', { user_uuid: userId });

  if (error || data === null) {
    console.error('Error counting API keys:', error);
    return 0;
  }

  return Math.max(0, limit - data);
}
