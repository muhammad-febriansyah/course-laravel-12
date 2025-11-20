import { home } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

interface PageProps {
    settings?: {
        site_name: string;
        logo: string;
        desc: string;
        thumbnail?: string;
    };
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { settings } = usePage<PageProps>().props;
    const siteName = settings?.site_name || 'CourseHub';
    const siteLogo = settings?.logo;
    // Always use thumbnail, fallback to Unsplash if not available
    const backgroundImage = settings?.thumbnail || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop';

    return (
        <div className="flex min-h-screen">
            <Toaster position="top-right" richColors closeButton />

            {/* Left Side - Form */}
            <div className="flex w-full flex-col bg-white lg:w-1/2">
                {/* Logo */}
                <div className="p-6 md:p-8">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-2 font-medium"
                    >
                        {siteLogo ? (
                            <img
                                src={siteLogo}
                                alt={siteName}
                                className="h-16 w-auto object-cover md:h-20"
                            />
                        ) : (
                            <>
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <span className="text-2xl font-semibold">{siteName}</span>
                            </>
                        )}
                    </Link>
                </div>

                {/* Form Content */}
                <div className="flex flex-1 items-center justify-center px-6 py-8 md:px-12">
                    <div className="w-full max-w-sm">
                        <div className="mb-6">
                            <h1 className="mb-2 text-2xl font-bold text-slate-900">{title}</h1>
                            <p className="text-sm text-slate-600">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="relative hidden lg:block lg:w-1/2">
                <img
                    src={backgroundImage}
                    alt="Login illustration"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop') {
                            target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop';
                        }
                    }}
                />
            </div>
        </div>
    );
}
