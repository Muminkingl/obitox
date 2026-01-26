
okay now look here is what i did 
`GET /dashboard/usage 200 in 1187ms
 ○ Compiling /api/subscription ...
 ✓ Compiled /api/subscription in 2.8s (2504 modules)
 ✓ Compiled (2506 modules)
[RATE LIMIT] Checking ratelimit:api:::1, limit: 100, window: 60s
[SUBSCRIPTION] Request from IP: ::1
[RATE LIMIT] Checking ratelimit:subscription:::1, limit: 10, window: 60s
✅ Redis connected successfully
 GET /api/audit/unread-count 200 in 4896ms
[RATE LIMIT] Removed 0 old entries
[RATE LIMIT] Current count: 1/100
[RATE LIMIT] ✅ ALLOWED - Remaining: 99/100
[RATE LIMIT] Removed 0 old entries
[RATE LIMIT] Current count: 1/10
[RATE LIMIT] ✅ ALLOWED - Remaining: 9/10
[SUBSCRIPTION] Rate limit result: { success: true, remaining: 9 }
[SUBSCRIPTION] ✅ Request allowed (9 remaining)
 GET /api/usage/history?startDate=2025-12-18T21%3A00%3A00.000Z&endDate=2026-01-19T13%3A09%3A26.792Z 200 in 5710ms
 GET /api/subscription 200 in 5945ms
 GET /api/audit/unread-count 200 in 949ms
 GET /pricing 200 in 1140ms
[SUBSCRIPTION] Request from IP: ::1
[RATE LIMIT] Checking ratelimit:subscription:::1, limit: 10, window: 60s
[RATE LIMIT] Removed 0 old entries
[RATE LIMIT] Current count: 2/10
[RATE LIMIT] ✅ ALLOWED - Remaining: 8/10
[SUBSCRIPTION] Rate limit result: { success: true, remaining: 8 }
[SUBSCRIPTION] ✅ Request allowed (8 remaining)
 GET /api/subscription 200 in 984ms
 ○ Compiling /api/billing/create-payment-link ...
 ✓ Compiled /api/billing/create-payment-link in 4.2s (2510 modules)
[BILLING] Price calculation: {
  amountCents: 2400,
  amountUSD: 24,
  usdToIqdRate: 1310,
  amountInIQD: 31440
}
[WAYL] Creating payment link: {
  referenceId: 'wayl_fbe54d314aea_pro_1768828234714',
  total: 31440,
  currency: 'IQD',
  webhookUrl: 'SET',
  webhookSecret: 'SET',
  redirectionUrl: 'SET',
  planName: 'SET'
}
[WAYL] Full request body: {
  "referenceId": "wayl_fbe54d314aea_pro_1768828234714",
  "total": 31440,
  "currency": "IQD",
  "customParameter": "",
  "webhookUrl": "http://localhost:3000/api/webhooks/wayl",
  "webhookSecret": "f01988b960b8bb5359fba23d59f9f18267b78123303811de83e391b42f45ccaf",
  "redirectionUrl": "http://localhost:3000/billing/processing?referenceId=wayl_fbe54d314aea_pro_1768828234714",
  "lineItem": [
    {
      "amount": 31440,
      "label": "Pro Plan (monthly)",
      "type": "increase",
      "image": "https://i.imgur.com/7MmN4jh_d.webp?maxwidth=760&fidelity=grand"
    }
  ]
}
[WAYL] Full response: {
  "data": {
    "customParameter": "",
    "referenceId": "wayl_fbe54d314aea_pro_1768828234714",
    "id": "cmkl6nswq029vjb08fcf8qw8r",
    "total": "31440",
    "currency": "IQD",
    "code": "9H14A3B3",
    "paymentMethod": null,
    "type": "Schrödinger",
    "status": "Created",
    "completedAt": null,
    "createdAt": "2026-01-19T13:10:34.779Z",
    "updatedAt": "2026-01-19T13:10:34.779Z",
    "url": "https://link.thewayl.com/pay?id=cmkl6nswq029vjb08fcf8qw8r",
    "webhookUrl": "http://localhost:3000/api/webhooks/wayl",
    "redirectionUrl": "http://localhost:3000/billing/processing?referenceId=wayl_fbe54d314aea_pro_1768828234714/?referenceId=wayl_fbe54d314aea_pro_1768828234714&orderid=cmkl6nswq029vjb08fcf8qw8r"
  },
  "message": "Done",
  "success": true
}
[BILLING] Payment link created: {
  userId: 'fbe54d31-4aea-47ed-bb1d-e79fd66eae50',
  referenceId: 'wayl_fbe54d314aea_pro_1768828234714',
  plan: 'pro',
  amount: 31440,
  currency: 'IQD'
}
 POST /api/billing/create-payment-link 200 in 10373ms
 ○ Compiling /api/webhooks/wayl/test ...
 ✓ Compiled /api/webhooks/wayl/test in 5.6s (2511 modules)
 ✓ Compiled in 0ms (2511 modules)
 ✓ Compiled in 0ms (2511 modules)
 ✓ Compiled in 1ms (2511 modules)
[TEST WEBHOOK GET] Found pending transaction: wayl_73f15e26175b_pro_1768827462712
[TEST WEBHOOK] Simulating webhook: {
  referenceId: 'wayl_73f15e26175b_pro_1768827462712',
  status: 'Complete'
}
 GET /api/audit/unread-count 200 in 5498ms
 GET /dashboard/settings/billing 200 in 3207ms
[TEST WEBHOOK] Audit log created for account_upgraded
[INVOICE] Generated number: INV-2026-000004
[INVOICE] ✅ Created invoice INV-2026-000004 for user 73f15e26-175b-47aa-9adb-04c4992d16dc
[TEST WEBHOOK] ✅ Invoice generated for transaction 6ee04e3b-7303-4d79-960e-5b47cfc91c43
[TEST WEBHOOK] Successfully processed: {
  userId: '73f15e26-175b-47aa-9adb-04c4992d16dc',
  plan: 'pro',
  billingCycle: 'monthly'
}
 GET /api/webhooks/wayl/test 200 in 10405ms
 ○ Compiling /favicon.ico ...
 ✓ Compiled /favicon.ico in 2.3s (2513 modules)
 GET /favicon.ico 200 in 2436ms



`



`
-- ========================================
-- ADD NEW COLUMNS TO PROFILES
-- ========================================
-- 1. Add subscription_tier_paid (stores what they PAID for)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_tier_paid VARCHAR(20) DEFAULT 'free';
-- 2. Add subscription_status for explicit status tracking
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'expired', 'cancelled', 'grace_period'));
-- 3. Migrate existing data (copy current tier to tier_paid)
UPDATE profiles 
SET subscription_tier_paid = COALESCE(subscription_tier, 'free')
WHERE subscription_tier_paid = 'free' OR subscription_tier_paid IS NULL;
-- 4. Update status for those with subscriptions
UPDATE profiles
SET subscription_status = 'active'
WHERE subscription_tier IS NOT NULL AND subscription_tier != 'free';


-- ========================================
-- CREATE COMPUTED TIER FUNCTION
-- ========================================
CREATE OR REPLACE FUNCTION get_effective_subscription_tier(
    p_tier_paid VARCHAR,
    p_status VARCHAR,
    p_cycle_end TIMESTAMPTZ,
    p_grace_period_days INTEGER DEFAULT 3
)
RETURNS VARCHAR AS $$
BEGIN
    -- If cancelled, immediately downgrade
    IF p_status = 'cancelled' THEN
        RETURN 'free';
    END IF;
    
    -- If no cycle end date, return paid tier (lifetime or free)
    IF p_cycle_end IS NULL THEN
        RETURN COALESCE(p_tier_paid, 'free');
    END IF;
    
    -- If expired and past grace period, downgrade
    IF p_cycle_end < NOW() THEN
        IF p_cycle_end < NOW() - INTERVAL '1 day' * p_grace_period_days THEN
            RETURN 'free';  -- Past grace period = downgraded
        ELSE
            RETURN COALESCE(p_tier_paid, 'free');  -- Still in grace period
        END IF;
    END IF;
    
    -- Active subscription (not expired yet)
    RETURN COALESCE(p_tier_paid, 'free');
END;
$$ LANGUAGE plpgsql STABLE;  -- STABLE because it uses NOW()


-- ========================================
-- CREATE PROFILES_WITH_TIER VIEW (FIXED)
-- ========================================

CREATE OR REPLACE VIEW profiles_with_tier AS
SELECT 
    p.id,
    p.subscription_tier_paid,
    p.subscription_status,
    p.api_requests_used,
    p.billing_cycle_start,
    p.billing_cycle_end,
    
    -- ✅ COMPUTED: Effective subscription tier
    get_effective_subscription_tier(
        p.subscription_tier_paid,
        p.subscription_status,
        p.billing_cycle_end,
        3
    ) AS subscription_tier,
    
    -- ✅ COMPUTED: Is subscription expired?
    CASE 
        WHEN p.billing_cycle_end IS NOT NULL AND p.billing_cycle_end < NOW() 
        THEN TRUE 
        ELSE FALSE 
    END AS is_subscription_expired,
    
    -- ✅ COMPUTED: Is in grace period?
    CASE 
        WHEN p.billing_cycle_end IS NOT NULL 
         AND p.billing_cycle_end < NOW() 
         AND p.billing_cycle_end >= NOW() - INTERVAL '3 days'
        THEN TRUE 
        ELSE FALSE 
    END AS is_in_grace_period,
    
    -- ✅ COMPUTED: Days until expiration (negative = expired)
    CASE 
        WHEN p.billing_cycle_end IS NOT NULL 
        THEN EXTRACT(DAY FROM (p.billing_cycle_end - NOW()))::INTEGER
        ELSE NULL
    END AS days_until_expiration,
    
    -- ✅ JOINED: Plan limits from subscription_plans
    COALESCE(sp.api_requests_monthly, 1000) AS api_requests_limit,
    COALESCE(sp.max_domains, 1) AS max_domains,
    COALESCE(sp.max_api_keys, 2) AS max_api_keys,
    COALESCE(sp.batch_operations_enabled, FALSE) AS batch_operations_enabled,
    COALESCE(sp.jwt_tokens_enabled, FALSE) AS jwt_tokens_enabled,
    sp.name AS plan_name

FROM profiles p
LEFT JOIN subscription_plans sp ON sp.tier::TEXT = get_effective_subscription_tier(
    p.subscription_tier_paid,
    p.subscription_status,
    p.billing_cycle_end,
    3
);

-- ========================================
-- GRANT PERMISSIONS
-- ========================================
GRANT SELECT ON profiles_with_tier TO authenticated;
GRANT SELECT ON profiles_with_tier TO anon;
`

