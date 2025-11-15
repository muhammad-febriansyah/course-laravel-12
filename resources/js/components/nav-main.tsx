import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type Menu, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { resolveMenuIcon } from '@/lib/menu-icons';

export function NavMain({ items = [] }: { items: NavItem[] | Menu[] }) {
    const page = usePage();
    const userRole = (page.props as { auth?: { user?: { role?: string } } })
        ?.auth?.user?.role;
    const isUserRole = userRole === 'user';

    const isMenu = (item: NavItem | Menu): item is Menu => {
        return (item as any) && typeof (item as any).id !== 'undefined';
    };

    let menuItems = items;

    if (userRole === 'mentor') {
        const allowedTopLevel = new Set(['dashboard', 'courses']);
        const allowedChildren = new Set(['kelas']);

        menuItems = items
            .map((item) => {
                if (isMenu(item)) {
                    if (!allowedTopLevel.has(item.name)) {
                        if (item.children && item.children.length > 0) {
                            const filteredChildren = item.children.filter(
                                (child) => allowedChildren.has(child.name),
                            );

                            if (filteredChildren.length === 0) {
                                return null;
                            }

                            return {
                                ...item,
                                children: filteredChildren,
                            } satisfies Menu;
                        }

                        return null;
                    }

                    if (item.name === 'dashboard') {
                        return {
                            ...item,
                            url: '/mentor/dashboard',
                        } satisfies Menu;
                    }

                    if (item.children && item.children.length > 0) {
                        const filteredChildren = item.children
                            .filter((child) => allowedChildren.has(child.name))
                            .map((child) => {
                                // Update URL for kelas to mentor prefix
                                if (child.name === 'kelas') {
                                    return {
                                        ...child,
                                        url: '/mentor/kelas',
                                    };
                                }
                                return child;
                            });

                        if (filteredChildren.length === 0) {
                            return null;
                        }

                        return {
                            ...item,
                            children: filteredChildren,
                        } satisfies Menu;
                    }

                    return item;
                }

                if (typeof item.href === 'string') {
                    const allowedLinks = [
                        '/dashboard',
                        '/mentor/dashboard',
                        '/mentor/kelas',
                    ];
                    if (
                        allowedLinks.some((href) => item.href.startsWith(href))
                    ) {
                        return item;
                    }

                    return null;
                }

                return item;
            })
            .filter(Boolean) as (NavItem | Menu)[];
    }

    // Track open state for groups so clicking reliably toggles.
    const initialOpen = useMemo(() => {
        const map = new Map<string, boolean>();
        for (const it of menuItems) {
            if (isMenu(it) && it.children && it.children.length > 0) {
                const active = it.children.some((c) =>
                    c.url ? (page.url === c.url || page.url.startsWith(c.url + '/') || page.url.startsWith(c.url + '?')) : false,
                );
                map.set(String(it.id), active);
            }
        }
        return map;
    }, [page.url, menuItems]);

    const [openGroups, setOpenGroups] = useState<Map<string, boolean>>(initialOpen);

    const toggleGroup = (id?: number | string) => {
        if (id === undefined || id === null) return;
        const key = String(id);
        setOpenGroups((prev) => {
            const next = new Map(prev);
            next.set(key, !prev.get(key));
            return next;
        });
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {menuItems.map((item) => {
                    if (isMenu(item)) {
                        const Icon = item.icon ? resolveMenuIcon(item.icon) : null;
                        const hasChildren =
                            item.children && item.children.length > 0;

                        if (hasChildren) {
                            const isOpen = openGroups.get(String(item.id)) || false;

                            return (
                                <SidebarMenuItem key={item.id}>
                                    <Collapsible open={isOpen} className="group/collapsible">
                                        <SidebarMenuButton onClick={() => toggleGroup(item.id)}>
                                            {Icon && <Icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.children?.map((child) => {
                                                    const ChildIcon = child.icon
                                                        ? resolveMenuIcon(child.icon)
                                                        : null;
                                                    return (
                                                        <SidebarMenuSubItem
                                                            key={child.id}
                                                        >
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={
                                                                    child.url
                                                                        ? page.url === child.url || page.url.startsWith(
                                                                              child.url + '/',
                                                                          ) || page.url.startsWith(
                                                                              child.url + '?',
                                                                          )
                                                                        : false
                                                                }
                                                            >
                                                                <Link
                                                                    href={
                                                                        child.url ||
                                                                        '#'
                                                                    }
                                                                    prefetch
                                                                >
                                                                    {ChildIcon && (
                                                                        <ChildIcon />
                                                                    )}
                                                                    <span>
                                                                        {
                                                                            child.title
                                                                        }
                                                                    </span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    );
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </SidebarMenuItem>
                            );
                        }

                        return (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        item.url
                                            ? page.url === item.url || page.url.startsWith(item.url + '/') || page.url.startsWith(item.url + '?')
                                            : false
                                    }
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.url || '#'} prefetch>
                                        {Icon && <Icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    // Original NavItem rendering
                    const href =
                        typeof item.href === 'string'
                            ? item.href
                            : (item.href?.url ?? '#');
                    const isActive = href && href !== '#'
                        ? isUserRole
                            ? page.url === href
                            : (page.url === href || page.url.startsWith(href + '/') || page.url.startsWith(href + '?'))
                        : false;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={href} prefetch>
                                    {item.icon ? (() => {
                                        const Icon = resolveMenuIcon(item.icon);
                                        return <Icon />;
                                    })() : null}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
