import Link from 'next/link'
import { Logo } from './icons/logo'

const links = [
    {
        title: 'Docs',
        href: '#',
    },
    {
        title: 'Privacy',
        href: '#',
    },
    {
        title: 'Terms',
        href: '#',
    },
    {
        title: 'Support',
        href: '#',
    },
]

export default function FooterSection() {
    return (
        <footer className="border-t py-12">
            <div className="mx-auto max-w-5xl px-6">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Logo />
                        <span className="text-xl font-semibold">ObitoX</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-sm md:order-last">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-muted-foreground hover:text-primary block duration-150">
                                <span>{link.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <hr className="my-8" />
                <div className="text-muted-foreground text-center text-sm">
                    © {new Date().getFullYear()} ObitoX (by exon). The all-in-one email toolkit for developers.
                </div>
            </div>
        </footer>
    )
}
