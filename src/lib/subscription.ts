import { createClient } from '@/lib/supabase/server';

export type SubscriptionPlan = 'basic' | 'pro';

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
    .select('subscription_plan, subscription_start_date, trial_ends_at')
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
    plan: data.subscription_plan as SubscriptionPlan,
    trialEndsAt,
    isInTrial
  };
}

export async function getApiKeyLimit(userId: string): Promise<number> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) return 0;
  
  switch (subscription.plan) {
    case 'basic':
      return 2;
    case 'pro':
      return 100; // Effectively unlimited
    default:
      return 0;
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
