import { home } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import type { PropsWithChildren } from 'react';

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
    const siteThumbnail = settings?.thumbnail || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop';

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 font-medium"
                    >
                        {siteLogo ? (
                            <>
                                <img
                                    src={siteLogo}
                                    alt={siteName}
                                    className="size-24 object-cover"
                                />
                            </>
                        ) : (
                            <>
                                <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                    <BookOpen className="size-4" />
                                </div>
                                {siteName}
                            </>
                        )}
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h1 className="text-2xl font-bold">{title}</h1>
                                <p className="text-sm text-balance text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="relative hidden bg-muted lg:block">
                <img
                    src={siteThumbnail}
                    alt={siteName}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </div>
    );
}
