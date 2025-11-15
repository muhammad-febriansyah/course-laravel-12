import { Dock, DockIcon } from '@/components/ui/dock';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FileText,
    HelpCircle,
    Home,
    LogIn,
    Menu,
    Newspaper,
    Shield,
    UserCircle2,
} from 'lucide-react';
import { useMemo } from 'react';

export default function MobileBottomBar() {
    const page = usePage();
    const currentPath = (page as any).url as string;
    const authUser = (page.props as any)?.auth?.user;

    const items = useMemo(() => {
        const common = [
            { href: '/', label: 'Beranda', Icon: Home },
            { href: '/courses', label: 'Kursus', Icon: BookOpen },
        ];
        const account = authUser
            ? { href: '/dashboard', label: 'Akun', Icon: UserCircle2 }
            : { href: '/masuk', label: 'Masuk', Icon: LogIn };

        return [...common, account];
    }, [authUser]);

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-2 z-30">
            <nav aria-label="Navigasi bawah" className="pointer-events-auto">
                <Dock
                    className="!mt-0 w-full max-w-md border bg-background/80 px-3 py-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60"
                    direction="bottom"
                    iconSize={46}
                    iconMagnification={60}
                    iconDistance={120}
                >
                    {items.map(({ href, label, Icon }) => {
                        const active =
                            currentPath === href ||
                            (href !== '/' && currentPath.startsWith(href));

                        return (
                            <DockIcon
                                key={href}
                                disableMagnification
                                className={[
                                    'relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1 text-[11px]',
                                    active
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted/40',
                                ].join(' ')}
                            >
                                <Link
                                    href={href}
                                    prefetch
                                    aria-current={active ? 'page' : undefined}
                                    className="flex h-full w-full flex-col items-center justify-center gap-1"
                                >
                                    <Icon
                                        className={[
                                            'h-5 w-5 transition-transform duration-300',
                                            active
                                                ? 'scale-105'
                                                : 'hover:scale-105',
                                        ].join(' ')}
                                    />
                                    <span
                                        className={[
                                            'font-medium',
                                            active
                                                ? 'text-foreground'
                                                : 'text-muted-foreground',
                                        ].join(' ')}
                                    >
                                        {label}
                                    </span>
                                </Link>
                            </DockIcon>
                        );
                    })}

                    <Sheet>
                        <DockIcon
                            disableMagnification
                            className="relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted/40"
                        >
                            <SheetTrigger asChild>
                                <button className="flex h-full w-full flex-col items-center justify-center gap-1">
                                    <Menu className="h-5 w-5" />
                                    <span className="font-medium">Lainnya</span>
                                </button>
                            </SheetTrigger>
                        </DockIcon>
                        <SheetContent side="bottom" className="rounded-t-xl">
                            <SheetHeader>
                                <SheetTitle>Menu Lainnya</SheetTitle>
                            </SheetHeader>
                            <div className="grid gap-3 p-4">
                                <Link
                                    href="/blog"
                                    prefetch
                                    className="flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-muted"
                                >
                                    <Newspaper className="h-4 w-4" />
                                    <span>Blog</span>
                                </Link>
                                <Link
                                    href="/faq"
                                    prefetch
                                    className="flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-muted"
                                >
                                    <HelpCircle className="h-4 w-4" />
                                    <span>FAQ</span>
                                </Link>
                                <Link
                                    href="/terms"
                                    prefetch
                                    className="flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-muted"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span>Syarat & Ketentuan</span>
                                </Link>
                                <Link
                                    href="/privacy"
                                    prefetch
                                    className="flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-muted"
                                >
                                    <Shield className="h-4 w-4" />
                                    <span>Kebijakan Privasi</span>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </Dock>

                <div className="h-[calc(env(safe-area-inset-bottom)+8px)]" />
            </nav>
        </div>
    );
}
