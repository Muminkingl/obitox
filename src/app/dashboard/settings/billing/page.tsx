'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useSubscription } from '@/contexts/subscription-context'
import { Button } from '@/components/base/buttons/button'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowDown, ArrowUp, Check } from 'lucide-react'
import { BadgeWithDot } from "@/components/base/badges/badges"
import { cn } from "@/lib/utils"

export default function BillingPage() {
    const router = useRouter()

    // ✅ Use subscription context instead of fetching
    const { subscription, loading } = useSubscription()
    const subscriptionData = subscription?.data

    const [upgradeLoading, setUpgradeLoading] = React.useState(false)
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
    const [selectedInvoices, setSelectedInvoices] = React.useState<string[]>([])

    // Mock Data
    const invoices = [
        { id: '1', plan: 'Basic Plan', month: 'Dec 2025', amount: 'USD $10.00', date: 'Dec 1, 2025', status: 'Paid' },
        { id: '2', plan: 'Basic Plan', month: 'Nov 2025', amount: 'USD $10.00', date: 'Nov 1, 2025', status: 'Paid' },
        { id: '3', plan: 'Basic Plan', month: 'Oct 2025', amount: 'USD $10.00', date: 'Oct 1, 2025', status: 'Paid' },
        { id: '4', plan: 'Basic Plan', month: 'Sep 2025', amount: 'USD $10.00', date: 'Sep 1, 2025', status: 'Paid' },
        { id: '5', plan: 'Basic Plan', month: 'Aug 2025', amount: 'USD $10.00', date: 'Aug 1, 2025', status: 'Paid' },
        { id: '6', plan: 'Basic Plan', month: 'Jul 2025', amount: 'USD $10.00', date: 'Jul 1, 2025', status: 'Paid' },
        { id: '7', plan: 'Basic Plan', month: 'Jun 2025', amount: 'USD $10.00', date: 'Jun 1, 2025', status: 'Paid' },
    ]

    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
    }

    const toggleSelect = (id: string) => {
        setSelectedInvoices(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        if (selectedInvoices.length === invoices.length) {
            setSelectedInvoices([])
        } else {
            setSelectedInvoices(invoices.map(i => i.id))
        }
    }



    const sortedInvoices = React.useMemo(() => {
        return [...invoices].sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
        })
    }, [sortOrder, invoices]) // Added dependency on invoices, though it's constant here.

    const handleUpgrade = () => {
        setUpgradeLoading(true)
        router.push('/pricing')
    }

    // ✅ No need to fetch - using SubscriptionContext!

    return (
        <div className="max-w-5xl">
            <div className="space-y-8">
                {/* Page Header */}
                <div className="space-y-1 border-b pb-6">
                    <h2 className="text-2xl font-semibold tracking-tight">Billing</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your billing and payment details.
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Plan Card */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">
                                            {loading ? 'Loading...' : (subscriptionData?.plan_name || 'Free')} Plan
                                        </h3>
                                        <Badge variant="outline" className="text-xs font-normal text-muted-foreground">Monthly</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground max-w-[200px]">
                                        Our most popular plan for Hobby projects.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-4xl font-bold">
                                        {subscriptionData?.plan_name === 'Pro' ? '$29' : '$0'}
                                    </span>
                                    <span className="text-muted-foreground text-sm ml-1">per month</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">
                                        {loading ? '...' : subscriptionData?.requests_used?.toLocaleString() || 0} of {loading ? '...' : subscriptionData?.requests_limit?.toLocaleString() || 1000} requests
                                    </span>
                                </div>
                                <Progress
                                    value={subscriptionData?.usage_percent || 0}
                                    className="h-2"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end pt-4 border-t border-border/50">
                            <Button
                                color="primary"
                                size="md"
                                isLoading={upgradeLoading}
                                onClick={handleUpgrade}
                            >
                                {upgradeLoading ? 'Loading...' : 'Upgrade Plan'}
                            </Button>
                        </div>
                    </div>

                    {/* Payment Method Card */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between h-full">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">Payment method</h3>
                                <p className="text-sm text-muted-foreground">
                                    Change how you pay for your plan.
                                </p>
                            </div>

                            <div className="rounded-lg border bg-background p-4 flex items-center justify-between mt-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-16 bg-white rounded border flex items-center justify-center p-1">
                                        {/* Visa Logo */}
                                        <svg viewBox="0 0 48 16" fill="none" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.5332 0.857143L12.5645 15.0086H8.65479L5.50104 3.70286C5.31854 3.02571 5.16229 2.76857 4.61479 2.45143C3.70229 1.95429 2.16479 1.45714 0.835938 1.17429L0.914792 0.857143H6.46479C7.29854 0.857143 8.05479 1.42286 8.23729 2.39143L9.80104 10.9114L14.5973 0.857143H18.5332ZM34.7298 10.68C34.781 8.89714 37.0735 8.12571 38.8023 7.28571C39.6885 6.84857 39.9885 6.57429 39.976 6.18C39.9635 5.61429 39.3635 5.35714 38.5685 5.37429C37.291 5.4 36.561 5.75143 35.9748 6.02571L35.3498 3.2C36.9648 2.46286 38.4885 2.12857 40.0673 2.13714C43.8323 2.13714 46.281 3.98857 46.2935 6.94286C46.306 9.15429 44.9123 10.38 42.241 11.6657C41.056 12.2314 40.691 12.6 40.6785 13.0629C40.666 13.5686 41.226 13.7914 41.7985 13.8086C42.5935 13.8429 44.0648 13.68 45.341 13.0886L46.0185 15.9086C44.821 16.4571 42.631 16.92 40.6398 16.9029C36.3135 16.9029 33.3235 14.6314 33.311 11.2371L33.3235 10.68H34.7298ZM44.976 16.8429H47.9985L50.591 0.857143H47.6985C46.8248 0.857143 46.551 1.62857 46.3423 2.50286L44.976 16.8429ZM29.9835 0.865714L26.5435 16.8429H23.5985L27.0385 0.865714H29.9835Z" fill="#1A1F71" />
                                        </svg>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium leading-none">Visa ending in 1234</p>
                                        <div className="text-xs text-muted-foreground">
                                            Expiry 06/2025
                                            <div className="mt-0.5 text-[10px]">billing@untitled.com</div>
                                        </div>
                                    </div>
                                </div>
                                <Button color="outline" size="sm" className="h-8">
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing History */}
                <div className="space-y-4 pt-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium">Billing History</h3>
                            <p className="text-sm text-muted-foreground">
                                Download your previous invoices.
                            </p>
                        </div>
                        <Button color="outline" size="sm" className="gap-2 text-foreground">
                            <Download className="h-4 w-4" />
                            Download selected
                        </Button>
                    </div>

                    <div className="rounded-xl border bg-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/40 text-muted-foreground">
                                    <tr>
                                        <th className="w-12 px-6 py-3">
                                            <div
                                                className={cn(
                                                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border cursor-pointer transition-colors",
                                                    selectedInvoices.length === invoices.length && invoices.length > 0
                                                        ? "bg-primary border-primary text-primary-foreground"
                                                        : "border-input hover:border-primary/50"
                                                )}
                                                onClick={toggleSelectAll}
                                            >
                                                {selectedInvoices.length === invoices.length && invoices.length > 0 && <Check className="h-3 w-3" />}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 font-medium cursor-pointer hover:text-foreground transition-colors group" onClick={toggleSort}>
                                            <div className="flex items-center gap-1 select-none">
                                                Invoice
                                                {sortOrder === 'desc' ? (
                                                    <ArrowDown className="h-3.5 w-3.5 text-foreground" />
                                                ) : (
                                                    <ArrowUp className="h-3.5 w-3.5 text-foreground" />
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 font-medium">Amount</th>
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="w-12 px-6 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y border-border/50">
                                    {sortedInvoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div
                                                    className={cn(
                                                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border cursor-pointer transition-colors",
                                                        selectedInvoices.includes(invoice.id)
                                                            ? "bg-primary border-primary text-primary-foreground"
                                                            : "border-input hover:border-primary/50"
                                                    )}
                                                    onClick={() => toggleSelect(invoice.id)}
                                                >
                                                    {selectedInvoices.includes(invoice.id) && <Check className="h-3 w-3" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                {invoice.plan} – {invoice.month}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {invoice.amount}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {invoice.date}
                                            </td>
                                            <td className="px-6 py-4">
                                                <BadgeWithDot type="modern" color="brand" size="sm">
                                                    {invoice.status}
                                                </BadgeWithDot>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button color="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}
