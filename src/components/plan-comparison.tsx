/**
 * Plan Comparison Table
 * 
 * Shows Free, Pro, and Enterprise tiers side-by-side
 * Highlights user's current tier
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles } from 'lucide-react';

interface PlanComparisonProps {
    currentTier: string;
}

const plans = [
    {
        tier: 'free',
        name: 'Free',
        price: 0,
        description: 'Perfect for testing',
        features: [
            { name: '1,000 API requests/month', included: true },
            { name: '3 domains', included: true },
            { name: '5 API keys', included: true },
            { name: 'Batch operations (10 files)', included: true },
            { name: 'Basic analytics', included: true },
            { name: 'JWT tokens', included: false },
            { name: 'Advanced analytics', included: false },
            { name: 'Priority support', included: false },
            { name: 'Commercial use', included: false }
        ],
        cta: 'Current Plan',
        highlighted: false
    },
    {
        tier: 'pro',
        name: 'Pro',
        price: 9,
        description: 'Best for startups',
        features: [
            { name: '50,000 API requests/month', included: true },
            { name: '10 domains', included: true },
            { name: '20 API keys', included: true },
            { name: 'Batch operations (100 files)', included: true },
            { name: 'JWT access tokens', included: true },
            { name: 'Advanced analytics', included: true },
            { name: 'Priority support (24-48h)', included: true },
            { name: 'Commercial use allowed', included: true },
            { name: 'Custom integrations', included: false }
        ],
        cta: 'Upgrade to Pro',
        highlighted: true
    },
    {
        tier: 'enterprise',
        name: 'Enterprise',
        price: null,
        priceLabel: 'Custom',
        description: 'For high-volume apps',
        features: [
            { name: 'Custom API request limits', included: true },
            { name: 'Unlimited domains', included: true },
            { name: 'Unlimited API keys', included: true },
            { name: 'Batch operations (10,000 files)', included: true },
            { name: 'JWT tokens + custom domains', included: true },
            { name: 'Dedicated infrastructure', included: true },
            { name: 'Dedicated support (4h SLA)', included: true },
            { name: 'Custom features', included: true },
            { name: 'Volume discounts', included: true }
        ],
        cta: 'Contact Sales',
        highlighted: false
    }
];

export function PlanComparison({ currentTier }: PlanComparisonProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Choose Your Plan</h2>
                <p className="text-gray-600 mt-1">Upgrade anytime to unlock more features</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const isCurrentPlan = plan.tier === currentTier;
                    const isPro = plan.tier === 'pro';

                    return (
                        <Card
                            key={plan.tier}
                            className={`relative ${isPro ? 'border-2 border-blue-500 shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
                        >
                            {isPro && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-blue-500 text-white px-4 py-1">
                                        <Sparkles className="h-3 w-3 inline mr-1" />
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            {isCurrentPlan && (
                                <div className="absolute -top-3 right-4">
                                    <Badge className="bg-green-500 text-white">Current</Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                                <div className="text-3xl font-bold">
                                    {plan.price !== null ? (
                                        <>
                                            ${plan.price}
                                            <span className="text-sm font-normal text-gray-600">/month</span>
                                        </>
                                    ) : (
                                        plan.priceLabel
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            {feature.included ? (
                                                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                                            )}
                                            <span className={`text-sm ${feature.included ? '' : 'text-gray-400'}`}>
                                                {feature.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className="w-full"
                                    variant={isPro ? 'default' : 'outline'}
                                    disabled={isCurrentPlan}
                                >
                                    {isCurrentPlan ? 'Current Plan' : plan.cta}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
