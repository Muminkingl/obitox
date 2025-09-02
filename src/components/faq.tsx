'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsFour() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'Can I change my plan anytime?',
            answer: 'Yes, you can upgrade, downgrade, or cancel your plan at any time from your account dashboard. Changes will be reflected in the next billing cycle.',
        },
        {
            id: 'item-2',
            question: 'What happens if I exceed my monthly API calls?',
            answer: "If you exceed your plan's API call limit, we offer pay-as-you-go pricing for additional calls. Alternatively, you can upgrade to a higher plan with more included calls.",
        },
        {
            id: 'item-3',
            question: 'Is there a free trial available?',
            answer: 'Yes, our Monthly Plan includes a 14-day free trial for you to test out our platform.',
        },
        {
            id: 'item-4',
            question: 'What kind of support do you offer?',
            answer: "We offer email support for all plans. Pro and Enterprise customers have access to priority support with faster response times.",
        },
        {
            id: 'item-5',
            question: 'Do you offer discounts for non-profits or students?',
            answer: 'Yes, we offer special discounts for non-profit organizations and educational institutions. Please contact our support team for more information.',
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
