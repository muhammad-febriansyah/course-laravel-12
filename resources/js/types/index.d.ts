import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Menu {
    id: number;
    name: string;
    title: string;
    url: string | null;
    icon: string | null;
    parent_id: number | null;
    order: number;
    is_active: boolean;
    children?: Menu[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    menus: Menu[];
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PageProps {
    settings?: {
        site_name: string;
        logo: string;
        desc?: string;
        thumbnail?: string;
        home_thumbnail?: string;
        hero_title?: string;
        hero_subtitle?: string;
        hero_stat1_number?: string;
        hero_stat1_label?: string;
        hero_stat2_number?: string;
        hero_stat2_label?: string;
        hero_stat3_number?: string;
        hero_stat3_label?: string;
        hero_badge_title?: string;
        hero_badge_subtitle?: string;
        hero_active_label?: string;
        hero_active_value?: string;
    };
    [key: string]: unknown;
}
