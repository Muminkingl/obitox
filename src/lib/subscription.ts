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
    return null;
  }

  // Use profiles_with_tier view for computed tier
  const { data, error } = await supabase
    .from('profiles_with_tier')
    .select('subscription_tier, is_subscription_expired, days_until_expiration')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    plan: (data.subscription_tier || 'free') as SubscriptionPlan,
    trialEndsAt: null,
    isInTrial: false
  };
}


export async function getApiKeyLimit(userId: string): Promise<number> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) return 1;

  switch (subscription.plan) {
    case 'free':
      return 1;
    case 'pro':
      return 15;
    case 'enterprise':
      return 999999;
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
    return 0;
  }

  return Math.max(0, limit - data);
}
