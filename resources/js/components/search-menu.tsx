import * as React from 'react';
import { Search } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { resolveMenuIcon } from '@/lib/menu-icons';

interface MenuItem {
    id: number;
    name: string;
    title: string;
    url: string | null;
    icon: string;
    parent_id: number | null;
    children?: MenuItem[];
}

export function SearchMenu() {
    const [open, setOpen] = React.useState(false);
    const { menus } = usePage().props;

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleSelect = (url: string) => {
        setOpen(false);
        router.visit(url);
    };

    // Flatten menu structure for search
    const flattenMenus = (items: MenuItem[]): MenuItem[] => {
        return items.reduce((acc: MenuItem[], item) => {
            acc.push(item);
            if (item.children && item.children.length > 0) {
                acc.push(...flattenMenus(item.children));
            }
            return acc;
        }, []);
    };

    const allMenus = flattenMenus(menus as MenuItem[]);
    const searchableMenus = allMenus.filter((menu) => menu.url !== null);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start text-muted-foreground md:w-40 lg:w-64"
            >
                <Search className="mr-2 h-4 w-4" />
                <span>Search menu...</span>
                <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Cari menu..." />
                <CommandList>
                    <CommandEmpty>Tidak ada menu yang ditemukan.</CommandEmpty>
                    <CommandGroup heading="Menu">
                        {searchableMenus.map((menu) => (
                            <CommandItem
                                key={menu.id}
                                value={menu.title}
                                onSelect={() => handleSelect(menu.url!)}
                                className="flex items-center gap-2"
                            >
                                {(() => {
                                    const Icon = resolveMenuIcon(menu.icon);
                                    return (
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    );
                                })()}
                                <span>{menu.title}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
