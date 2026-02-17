# Billing Cycle Mismatch Bug Fix Plan

## Problem Description

When a user selects a plan on the pricing page, the system correctly prevents duplicate payment links within a 15-minute window. However, if the user:

1. Selects "Annual" billing cycle
2. Clicks "Pro" plan → Creates payment link for **yearly** (314,400 IQD)
3. Goes back to pricing page
4. Changes to "Monthly" billing cycle
5. Clicks "Pro" plan again → **Returns the existing yearly payment link instead of creating a new monthly one**

This happens because the duplicate check doesn't verify if the `billing_cycle` or `plan` matches the new request.

---

## Current Code Analysis

**File:** [`src/app/api/billing/create-payment-link/route.ts`](src/app/api/billing/create-payment-link/route.ts)

**Current Logic (Lines 36-54):**
```typescript
// ✅ SECURITY FIX #3: Check for duplicate pending payments (15 min window)
const { data: recentPending } = await supabase
    .from('billing_transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
    .maybeSingle();

// Only reuse if payment URL actually exists (not null from failed Wayl calls)
if (recentPending && recentPending.wayl_payment_url) {
    console.log('[BILLING] Returning existing payment link for user:', user.id);
    return NextResponse.json({
        success: true,
        paymentUrl: recentPending.wayl_payment_url,
        referenceId: recentPending.wayl_reference_id,
        isExisting: true
    });
}
```

**Issue:** The query only checks:
- ✅ Same user (`user_id`)
- ✅ Status is pending (`status`)
- ✅ Within 15 minutes (`created_at`)

**Missing checks:**
- ❌ Same plan (`plan`)
- ❌ Same billing cycle (`billing_cycle`)

---

## Solution

### Option 1: Strict Match (Recommended)

Only reuse the payment link if **both** plan AND billing cycle match:

```typescript
// Check for duplicate pending payments with SAME plan and billing cycle
const { data: recentPending } = await supabase
    .from('billing_transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .eq('plan', plan)                    // ← NEW: Match plan
    .eq('billing_cycle', billingCycle)   // ← NEW: Match billing cycle
    .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
    .maybeSingle();
```

**Pros:**
- User always gets exactly what they selected
- Simple implementation
- Clear behavior

**Cons:**
- Creates more payment links if user switches between options
- Still prevents spam for the same plan+cycle combination

### Option 2: Delete Old + Create New

If a pending payment exists but with different plan/cycle, delete it and create a new one:

```typescript
// Check for ANY pending payment
const { data: recentPending } = await supabase
    .from('billing_transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
    .maybeSingle();

if (recentPending) {
    // Check if plan or billing cycle differs
    if (recentPending.plan !== plan || recentPending.billing_cycle !== billingCycle) {
        // Delete the old transaction
        console.log('[BILLING] Deleting mismatched pending transaction:', {
            old: { plan: recentPending.plan, cycle: recentPending.billing_cycle },
            new: { plan, cycle: billingCycle }
        });
        await supabase
            .from('billing_transactions')
            .delete()
            .eq('id', recentPending.id);
        // Continue to create new payment link
    } else if (recentPending.wayl_payment_url) {
        // Same plan and cycle - reuse existing
        console.log('[BILLING] Returning existing payment link for user:', user.id);
        return NextResponse.json({
            success: true,
            paymentUrl: recentPending.wayl_payment_url,
            referenceId: recentPending.wayl_reference_id,
            isExisting: true
        });
    }
}
```

**Pros:**
- Cleaner database (no orphaned pending transactions)
- User gets exactly what they selected
- Still prevents rapid-fire requests

**Cons:**
- More complex logic
- Creates Wayl orders that are never used

---

## Recommended Implementation: Option 1 (Strict Match)

This is the simplest and most reliable fix. The 15-minute window still prevents spam for the same plan+cycle combination.

### Code Changes Required

**File:** `src/app/api/billing/create-payment-link/route.ts`

**Change lines 36-43 from:**
```typescript
// ✅ SECURITY FIX #3: Check for duplicate pending payments (15 min window)
const { data: recentPending } = await supabase
    .from('billing_transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
    .maybeSingle();
```

**To:**
```typescript
// ✅ SECURITY FIX #3: Check for duplicate pending payments (15 min window)
// Only reuse if SAME plan AND billing cycle
const { data: recentPending } = await supabase
    .from('billing_transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .eq('plan', plan)
    .eq('billing_cycle', billingCycle)
    .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
    .maybeSingle();
```

### Additional Enhancement: Add Logging

Add logging to help debug future issues:

```typescript
if (recentPending && recentPending.wayl_payment_url) {
    console.log('[BILLING] Returning existing payment link for user:', {
        userId: user.id,
        plan: recentPending.plan,
        billingCycle: recentPending.billing_cycle,
        amount: recentPending.amount
    });
    return NextResponse.json({
        success: true,
        paymentUrl: recentPending.wayl_payment_url,
        referenceId: recentPending.wayl_reference_id,
        isExisting: true,
        plan: recentPending.plan,
        billingCycle: recentPending.billing_cycle
    });
}
```

---

## Testing Plan

1. **Test Case 1: Same Plan + Same Cycle**
   - Select Pro Yearly → Get payment link
   - Go back, select Pro Yearly again
   - **Expected:** Returns same payment link (isExisting: true)

2. **Test Case 2: Same Plan + Different Cycle**
   - Select Pro Yearly → Get payment link
   - Go back, select Pro Monthly
   - **Expected:** Creates NEW payment link for monthly

3. **Test Case 3: Different Plan**
   - Select Pro Yearly → Get payment link
   - Go back, select Enterprise Yearly
   - **Expected:** Creates NEW payment link for Enterprise

4. **Test Case 4: Expired Window**
   - Select Pro Yearly → Get payment link
   - Wait 16 minutes
   - Select Pro Yearly again
   - **Expected:** Creates NEW payment link (old one expired)

---

## Summary

| Aspect | Current | Fixed |
|--------|---------|-------|
| Duplicate prevention | Only checks user + status + time | Also checks plan + billing_cycle |
| User experience | Wrong payment link shown | Correct payment link always |
| Spam prevention | 15 min window | 15 min window per plan+cycle |
| Database impact | Fewer transactions | Slightly more transactions |

The fix is minimal (2 lines added) and ensures users always get the payment link for exactly what they selected.