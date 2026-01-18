# 📋 DATABASE DEPLOYMENT GUIDE

## 🚀 STEP-BY-STEP INSTRUCTIONS

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **ObitoX** project
3. Click **SQL Editor** in the left sidebar

### Step 2: Deploy Migration
1. Click **"New Query"** button
2. Open this file: `supabase/migrations/20260102_domain_security_schema.sql`
3. **Copy ALL the SQL code** (Ctrl+A, Ctrl+C)
4. **Paste into Supabase SQL Editor** (Ctrl+V)
5. Click **"RUN"** button (or press F5)
6. Wait 5-10 seconds for completion

### Step 3: Verify Success ✅

You should see output like this:
```
✅ All 5 tables created successfully!
✅ All 3 tier quotas configured!

╔═══════════════════════════════════════════════════════╗
║   🎉 MIGRATION COMPLETED SUCCESSFULLY! 🎉            ║
╚═══════════════════════════════════════════════════════╝
```

### Step 4: Verify Tables Exist
1. In Supabase Dashboard, go to **Table Editor**
2. You should see these new tables:
   - ✅ `domains`
   - ✅ `dns_records`
   - ✅ `domain_verification_logs`
   - ✅ `domain_abuse_events`
   - ✅ `domain_quotas`

### Step 5: Check Quotas
1. Open the `domain_quotas` table
2. Verify 3 rows exist:
   - **free**: 3 domains max
   - **pro**: 50 domains max
   - **enterprise**: 1000 domains max

---

## 📊 WHAT WAS CREATED

### Tables (5)
| Table | Purpose | Records |
|-------|---------|---------|
| `domains` | Main domain management | Empty (ready for data) |
| `dns_records` | DNS verification records | Empty |
| `domain_verification_logs` | Audit trail | Empty |
| `domain_abuse_events` | Security monitoring | Empty |
| `domain_quotas` | Tier limits | **3 rows (populated)** |

### Security Features ✅
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own domains
- ✅ Auto-update triggers for timestamps
- ✅ Input validation via CHECK constraints

---

## 🧪 TESTING THE SCHEMA

After deployment, run this test:

```bash
npm run test:database
```

Or manually test in Supabase SQL Editor:

```sql
-- Test 1: Check quotas
SELECT * FROM domain_quotas ORDER BY tier;

-- Test 2: Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'domain%';

-- Test 3: Count tables
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('domains', 'dns_records', 'domain_verification_logs', 'domain_abuse_events', 'domain_quotas');
-- Should return: 5
```

---

## ❌ TROUBLESHOOTING

### Error: "relation already exists"
**Solution**: Tables already created. This is safe to ignore, or drop tables first:
```sql
DROP TABLE IF EXISTS domain_abuse_events CASCADE;
DROP TABLE IF EXISTS domain_verification_logs CASCADE;
DROP TABLE IF EXISTS dns_records CASCADE;
DROP TABLE IF EXISTS domains CASCADE;
DROP TABLE IF EXISTS domain_quotas CASCADE;
```
Then re-run the migration.

### Error: "permission denied"
**Solution**: Make sure you're using the correct Supabase project and have admin access.

### RLS Blocking Queries
**Solution**: When testing from SQL Editor, wrap queries in:
```sql
SET ROLE authenticated;
-- Your test query here
RESET ROLE;
```

---

## ✅ VALIDATION CHECKLIST

- [ ] All 5 tables created
- [ ] 3 quota rows inserted (free, pro, enterprise)
- [ ] RLS enabled on 4 tables
- [ ] Indexes created (check with `\di` in psql)
- [ ] Triggers active for updated_at columns
- [ ] No errors in Supabase logs

---

## 🎯 NEXT STEPS

After successful deployment:
1. ✅ Test schema with test script
2. ✅ Verify RLS policies work
3. ➡️  **Week 1, Day 2**: Create Domain APIs
4. ➡️  **Week 1, Day 3**: Build rate limiting integration

---

**Questions?** Check the SQL file comments or contact the team! 🚀
