'use client';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NumberFlow from '@number-flow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CountUp from '@/components/ui/CountUp';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight, Check, Star, Zap, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const plans = [
  {
    id: 'free',
    name: 'Free',
    icon: Star,
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Perfect for development and hobby projects',
    features: [
      '1,000 API requests/month',
      '1 domain',
      '1 API key',
      'Basic usage stats',
      'Community support',
      'Rate limiting: 10 req/min',
    ],
    cta: 'Start for free',
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Zap,
    priceMonthly: 23,
    priceYearly: 19, // $228 billed annually
    description: 'Mission critical infra for startups',
    features: [
      '50,000 API requests/month',
      '10 domains',
      '20 API keys',
      'Batch operations (max 100 files)',
      'Production-grade auth (JWT)',
      'Usage & abuse detection',
      'Priority support (24-48h)',
    ],
    cta: 'Get Started with Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Shield,
    priceMonthly: null,
    priceYearly: null,
    description: 'Scale ready infra with custom control',
    features: [
      'Custom API request limits',
      'Enterprise grade domain & credential management',
      'Compliance & audit support',
      'Custom legal agreements (DPA)',
      'Private Slack or shared channel',
      'Migration & onboarding assistance',
      'Custom SLA (99.95%+)',
      'Dedicated support (4h response)',
    ],
    cta: 'Contact Sales',
    enterprise: true,
  },
];

export default function SimplePricing() {
  const [mounted, setMounted] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [currentTier, setCurrentTier] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchCurrentTier();
  }, []);

  async function fetchCurrentTier() {
    try {
      const response = await fetch('/api/subscription');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCurrentTier(data.data.tier);
        }
      }
    } catch (error) {
      console.error('Failed to fetch current tier:', error);
      // If user is not logged in or fetch fails, assume they need to sign up
      setCurrentTier(null);
    }
  }

  async function handleUpgrade(planId: string) {
    // Free plan: redirect to signup (no payment needed)
    if (planId === 'free') {
      window.location.href = '/auth';
      return;
    }

    if (planId === 'enterprise') {
      window.location.href = '/enterprise';
      return;
    }

    setUpgrading(true);

    try {
      const response = await fetch('/api/billing/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          billingCycle: isAnnual ? 'yearly' : 'monthly'
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create payment link');
      }

      // Redirect to Wayl payment page
      window.location.href = data.paymentUrl;
    } catch (error: any) {
      console.error('Upgrade error:', error);
      alert(error.message || 'Failed to start upgrade process. Please try again.');
      setUpgrading(false);
    }
  }

  if (!mounted) return null;


  return (
    <div className="not-prose flex w-full flex-col gap-12 px-4 py-24 text-center sm:px-8">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center space-y-2">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 mb-4 rounded-full px-4 py-1 text-sm font-medium"
          >
            <Sparkles className="text-primary mr-1 h-3.5 w-3.5 animate-pulse" />
            Pricing Plans
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="from-foreground to-foreground/30 bg-gradient-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
          >
            Pick the perfect plan for your needs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-md pt-2 text-lg"
          >
            Simple, transparent pricing that scales with your business. No
            hidden fees, no surprises.
          </motion.p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <Tabs value={isAnnual ? 'yearly' : 'monthly'} onValueChange={(v) => setIsAnnual(v === 'yearly')}>
            <TabsList className="bg-muted/50 border p-1 h-11 rounded-full px-1">
              <TabsTrigger value="monthly" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Badge variant="outline" className="text-destructive bg-destructive/10 border-destructive/20 rounded-full px-3 py-1 text-xs font-semibold">
            20% off
          </Badge>
        </div>

        <div className="mt-8 grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex"
            >
              <Card
                className={cn(
                  'bg-secondary/20 relative h-full w-full text-left transition-all duration-300 hover:shadow-lg',
                  plan.popular
                    ? 'ring-primary/50 dark:shadow-primary/10 shadow-md ring-2'
                    : 'hover:border-primary/30',
                  plan.popular &&
                  'from-primary/[0.03] bg-gradient-to-b to-transparent',
                  plan.enterprise && 'border-primary/30'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-0 left-0 mx-auto w-fit">
                    <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 shadow-sm font-semibold">
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className={cn('pb-4', plan.popular && 'pt-8')}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        plan.popular
                          ? 'bg-primary/10 text-primary'
                          : plan.enterprise
                            ? 'bg-zinc-800 text-zinc-400'
                            : 'bg-secondary text-foreground',
                      )}
                    >
                      <plan.icon className="h-5 w-5" />
                    </div>
                    <CardTitle
                      className={cn(
                        'text-xl font-bold',
                        plan.popular && 'text-primary',
                      )}
                    >
                      {plan.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="mt-3 space-y-2">
                    <p className="text-sm">{plan.description}</p>
                    <div className="pt-2">
                      {plan.enterprise ? (
                        <div className="text-2xl font-bold text-foreground leading-tight mt-2">
                          Get in touch for pricing
                        </div>
                      ) : (
                        <div className="flex items-baseline">
                          <span
                            className={cn(
                              'text-3xl font-bold',
                              plan.popular ? 'text-primary' : 'text-foreground',
                            )}
                          >
                            $
                          </span>
                          <NumberFlow
                            value={isAnnual ? plan.priceYearly! : plan.priceMonthly!}
                            className={cn(
                              'text-3xl font-bold',
                              plan.popular ? 'text-primary' : 'text-foreground',
                            )}
                          />
                          <span className="text-muted-foreground ml-1 text-sm">
                            /month
                          </span>
                        </div>
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 pb-6">
                  {plan.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full',
                          plan.popular
                            ? 'bg-primary/20 text-primary'
                            : 'bg-secondary text-secondary-foreground',
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span
                        className={
                          plan.popular
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }
                      >
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading || (plan.id === currentTier) || (currentTier === 'pro' && plan.id === 'free') || (currentTier === 'enterprise' && plan.id !== 'enterprise')}
                    variant={plan.popular ? 'default' : 'outline'}
                    className={cn(
                      'w-full font-semibold transition-all duration-300 h-11 rounded-xl group/btn',
                      plan.popular
                        ? 'bg-primary hover:bg-primary/90 hover:shadow-primary/20 hover:shadow-md'
                        : plan.enterprise
                          ? 'bg-zinc-100 hover:bg-white text-zinc-950 border-none'
                          : 'hover:border-primary/30 hover:bg-primary/5 hover:text-primary',
                      (plan.id === currentTier || (currentTier === 'pro' && plan.id === 'free') || (currentTier === 'enterprise' && plan.id !== 'enterprise')) && 'opacity-60 cursor-not-allowed',
                    )}
                  >
                    {plan.id === currentTier
                      ? 'Current Plan'
                      : (currentTier === 'pro' && plan.id === 'free')
                        ? 'Included'
                        : (currentTier === 'enterprise' && plan.id !== 'enterprise')
                          ? 'Contact Sales to Change'
                          : upgrading
                            ? 'Processing...'
                            : plan.cta
                    }
                    {!upgrading && plan.id !== currentTier && !(currentTier === 'pro' && plan.id === 'free') && !(currentTier === 'enterprise' && plan.id !== 'enterprise') && (
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    )}
                  </Button>
                </CardFooter>

                {/* Subtle gradient effects */}
                {plan.popular ? (
                  <>
                    <div className="from-primary/[0.05] pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 rounded-b-lg bg-gradient-to-t to-transparent" />
                    <div className="border-primary/20 pointer-events-none absolute inset-0 rounded-lg border" />
                  </>
                ) : (
                  <div className="hover:border-primary/10 pointer-events-none absolute inset-0 rounded-lg border border-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Sections */}
        <div className="mx-auto mt-24 grid w-full max-w-5xl gap-12 text-left md:grid-cols-2">
          {/* Request Quotas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-foreground">Transparent API Usage</h3>
            <div className="bg-secondary/20 rounded-2xl border p-6 space-y-4">
              <p className="text-muted-foreground text-sm">
                Each operational call to the ObitoX API counts as 1 request. To ensure maximum value, the data transfer (actual file upload) happens directly between your client and your storage provider, and is never billed by ObitoX.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <div className="h-5 w-1 bg-primary rounded-full" />
                  <span>Authorized Upload Request → <strong>1 request</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-5 w-1 bg-primary rounded-full" />
                  <span>Upload Lifecycle Tracking → <strong>1 request</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-5 w-1 bg-primary rounded-full" />
                  <span>Management & Audit Ops → <strong>1 request</strong></span>
                </li>
                <li className="flex items-center gap-3 text-primary font-medium">
                  <Zap className="h-4 w-4" />
                  <span>High-Throughput Batch Op → <strong>1 request</strong></span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground pt-2 border-t">
                Batch thresholds: 5 files (Free), 100 files (Pro), up to 10k (Enterprise).
              </p>
            </div>
          </motion.div>

          {/* Architecture / The ObitoX Advantage */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-foreground">A Decoupled High-Performance Architecture</h3>
            <div className="bg-secondary/20 rounded-2xl border p-6 space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                Traditional platforms bundle storage markup and bandwidth surcharges into their API pricing.
                <strong> ObitoX decoupling gives you total control.</strong>
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div className="space-y-2">
                  <span className="text-destructive/80 uppercase tracking-widest text-[10px]">Bundled Legacy</span>
                  <ul className="space-y-1 text-muted-foreground font-normal">
                    <li>❌ Storage Upcharge</li>
                    <li>❌ Bandwidth Markup</li>
                    <li>❌ Proprietary Lock-in</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <span className="text-primary uppercase tracking-widest text-[10px]">ObitoX Optimized</span>
                  <ul className="space-y-1 text-foreground font-normal">
                    <li>✅ Dedicated Logic Layer</li>
                    <li>✅ Global Security Compliance</li>
                    <li>✅ Real-time Observability</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm border-t pt-4 italic text-muted-foreground">
                We provide the orchestration and security. You own your data and your infrastructure. This decoupled model eliminates overhead and maximizes efficiency at scale.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
