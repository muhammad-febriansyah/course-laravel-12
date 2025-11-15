import { FloatingNavbar } from '@/components/site/floating-navbar';
import { Footer } from '@/components/site/footer';
import type { PropsWithChildren } from 'react';

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-white text-foreground">
            <FloatingNavbar />
            <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
