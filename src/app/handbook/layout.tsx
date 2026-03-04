import { HandbookSidebar } from '@/components/handbook-sidebar';
import { Newsreader } from 'next/font/google';

const newsreader = Newsreader({
    subsets: ['latin'],
    variable: '--font-newsreader',
    style: ['normal', 'italic'],
    display: 'swap',
});

export default function HandbookLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`flex min-h-screen flex-col bg-black text-white ${newsreader.variable}`}>
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                <HandbookSidebar />
                <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
                    <div className="mx-auto w-full min-w-0">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
