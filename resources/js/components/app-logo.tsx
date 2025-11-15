import AppLogoIcon from './app-logo-icon';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

export default function AppLogo() {
    const { settings } = usePage<PageProps>().props;
    const siteName = settings?.site_name || 'Laravel Starter Kit';
    const siteLogo = settings?.logo;

    return (
        <>
            {siteLogo ? (
                <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden bg-white">
                    <img src={siteLogo} alt={siteName} className="size-8 object-contain" />
                </div>
            ) : (
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                    <AppLogoIcon className="size-5 fill-current text-white" />
                </div>
            )}
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {siteName}
                </span>
            </div>
        </>
    );
}
