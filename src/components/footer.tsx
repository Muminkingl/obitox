import { Logo } from '@/components/logo'
import Link from 'next/link'

const links = [
    {
        group: 'Product',
        items: [
            {
                title: 'Features',
                href: '#features',
            },
            {
                title: 'Solution',
                href: '#solution',
            },

            {
                title: 'Pricing',
                href: '/pricing',
            },
            {
                title: 'Help',
                href: 'mailto:support@obitox.dev',
            },
        ],
    },

    {
        group: 'Handbook',
        items: [
            {
                title: 'Why we exist',
                href: '/handbook/company/why-we-exist',
            },
            {
                title: 'What we believe',
                href: '/handbook/company/what-we-believe',
            },
            {
                title: 'How we make money',
                href: '/handbook/company/how-we-make-money',
            },
            {
                title: 'Request signing',
                href: '/handbook/security/request-signing',
            },
            {
                title: 'Rate limits & abuse',
                href: '/handbook/security/rate-limits-and-abuse',
            },
            {
                title: 'Performance',
                href: '/handbook/architecture/performance-philosophy',
            },
        ],
    },
    {
        group: 'Legal',
        items: [
            {
                title: 'Licence',
                href: '/legal/licence',
            },
            {
                title: 'Privacy',
                href: '/legal/privacy',
            },
            {
                title: 'Cookies',
                href: '/legal/cookies',
            },
            {
                title: 'Security',
                href: '/legal/security',
            },
        ],
    },
]

export default function FooterSection() {
    return (
        <footer className="border-b bg-white pt-20 dark:bg-transparent relative z-50">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-12 md:grid-cols-6">
                    <div className="md:col-span-1">
                        <Link
                            href="/"
                            aria-label="go home"
                            className="block size-fit">
                            <Logo />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5 md:col-span-5">
                        {links.map((link, index) => (
                            <div
                                key={index}
                                className="space-y-4 text-sm">
                                <span className="block font-medium">{link.group}</span>
                                {link.items.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="text-muted-foreground hover:text-primary block duration-150">
                                        <span>{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
                    <span className="text-muted-foreground order-last block text-center text-sm md:order-first">© {new Date().getFullYear()} ObitoX, All rights reserved</span>
                    <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
                        <Link
                            href="https://discord.gg/c9xHHgmVHx"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Discord"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.2 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.67-.53 3.4-1.33 5.2-2.65c.02-.01.03-.03.03-.05c.44-4.52-.6-9.67-3.1-11.95c-.01-.01-.02-.02-.03-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.85 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.85 2.12-1.89 2.12z"
                                ></path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
