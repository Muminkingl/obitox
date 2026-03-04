'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsFour() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'Is ObitoX production-ready?',
            answer: 'Yes. Pro and Enterprise plans are designed for production workloads, with JWT auth, abuse detection, and SLA-backed infrastructure. We focus on being the rock-solid orchestration layer for your mission-critical uploads.',
        },
        {
            id: 'item-2',
            question: 'Do you store my files?',
            answer: 'No. Your files stay in your own storage provider (R2, S3, Supabase). ObitoX only manages access, security, and APIs. This means you have zero vendor lock-in and total control over your data assets.',
        },
        {
            id: 'item-3',
            question: 'Why is ObitoX more cost-efficient than traditional providers?',
            answer: 'Because we don’t charge for storage or bandwidth markups. You pay only for our orchestration and security layer—the actual file transfer happens directly with your own storage provider at cost.',
        },
        {
            id: 'item-4',
            question: 'What happens if I exceed my plan limits?',
            answer: 'Transparency is key. We’ll notify you before limits are reached. You can upgrade instantly to maintain throughput or continue on the Free plan with temporary rate limits—no surprise charges, ever.',
        },
        {
            id: 'item-5',
            question: 'Can I cancel or change plans anytime?',
            answer: 'Yes. You can upgrade, downgrade, or cancel directly from your dashboard at any time. No long-term contracts, no hidden fees, and no friction to scale as you grow.',
        },
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-muted dark:bg-muted/50 w-full rounded-2xl p-1">
                        {faqItems.map((item) => (
                            <div
                                className="group"
                                key={item.id}>
                                <AccordionItem
                                    value={item.id}
                                    className="data-[state=open]:bg-card dark:data-[state=open]:bg-muted peer rounded-xl border-none px-7 py-1 data-[state=open]:border-none data-[state=open]:shadow-sm">
                                    <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-base">{item.answer}</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <hr className="mx-7 border-dashed group-last:hidden peer-data-[state=open]:opacity-0" />
                            </div>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6 px-8">
                        Can't find what you're looking for? Contact our{' '}
                        <Link
                            href="#"
                            className="text-primary font-medium hover:underline">
                            customer support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
