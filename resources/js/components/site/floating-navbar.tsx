import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, Menu, User } from 'lucide-react';
import * as React from 'react';

export function FloatingNavbar() {
    const page = usePage<PageProps>();
    const { settings, auth } = page.props as PageProps & { auth?: { user?: { name: string; email: string; avatar?: string } } };
    const currentUrl = page.url;
    const siteName = settings?.site_name || 'Laravel Starter Kit';
    const siteLogo = settings?.logo;
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);
    const [mobileProfileOpen, setMobileProfileOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const profileMenuItems = [
        { title: 'Tentang Kami', href: '/tentang-kami' },
        { title: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
        { title: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
        { title: 'FAQ', href: '/faq' },
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return currentUrl === '/';
        }

        return currentUrl.startsWith(href);
    };

    const isProfileActive = () => profileMenuItems.some((item) => isActive(item.href));

    const user = auth?.user;
    const initials = user?.name
        ? user.name
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
        : 'U';

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div
            className={cn(
                'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
                isScrolled ? 'flex justify-center px-4 pt-4' : 'px-0 pt-0',
            )}
        >
            <nav
                className={cn(
                    'relative mx-auto w-full transition-all duration-300',
                    isScrolled
                        ? 'max-w-6xl rounded-full border border-slate-200/50 bg-white/80 shadow-xl backdrop-blur-md'
                        : 'max-w-full bg-white',
                )}
            >
                <div
                    className={cn(
                        'mx-auto flex items-center justify-between transition-all duration-300',
                        isScrolled
                            ? 'h-16 max-w-full px-6 lg:px-8'
                            : 'h-20 max-w-7xl px-4 sm:px-6 lg:px-8',
                    )}
                >
                    <Link
                        href="/"
                        className="flex shrink-0 items-center gap-2 transition-all duration-300 hover:opacity-80"
                    >
                        {siteLogo ? (
                            <img
                                src={siteLogo}
                                alt={siteName}
                                className={cn(
                                    'w-20 object-cover transition-all duration-300',
                                    isScrolled ? 'h-8' : 'h-10',
                                )}
                            />
                        ) : (
                            <span
                                className={cn(
                                    'font-bold text-slate-900 transition-all duration-300',
                                    isScrolled ? 'text-lg' : 'text-xl',
                                )}
                            >
                                {siteName}
                            </span>
                        )}
                    </Link>

                    <div className="hidden items-center gap-1 lg:flex">
                        <Link
                            href="/"
                            className={cn(
                                'rounded-full font-medium transition-all hover:bg-slate-100',
                                isScrolled ? 'px-3.5 py-2 text-sm' : 'px-4 py-2 text-base',
                                isActive('/')
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                                    : 'text-slate-700 hover:text-slate-900',
                            )}
                        >
                            Home
                        </Link>

                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className={cn(
                                    'flex items-center gap-1 rounded-full font-medium transition-all hover:bg-slate-100',
                                    isScrolled ? 'px-3.5 py-2 text-sm' : 'px-4 py-2 text-base',
                                    isProfileActive()
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                                        : 'text-slate-700 hover:text-slate-900',
                                )}
                            >
                                Profile
                                <ChevronDown
                                    className={cn(
                                        'transition-transform',
                                        profileOpen && 'rotate-180',
                                        isScrolled ? 'h-4 w-4' : 'h-5 w-5',
                                    )}
                                />
                            </button>

                            {profileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setProfileOpen(false)}
                                    />

                                    <div className="absolute top-full left-0 z-20 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                        {profileMenuItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setProfileOpen(false)}
                                                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                            >
                                                {item.title}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <Link
                            href="/kelas"
                            className={cn(
                                'rounded-full font-medium transition-all hover:bg-slate-100',
                                isScrolled ? 'px-3.5 py-2 text-sm' : 'px-4 py-2 text-base',
                                isActive('/kelas')
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                                    : 'text-slate-700 hover:text-slate-900',
                            )}
                        >
                            Kelas
                        </Link>

                        <Link
                            href="/blog"
                            className={cn(
                                'rounded-full font-medium transition-all hover:bg-slate-100',
                                isScrolled ? 'px-3.5 py-2 text-sm' : 'px-4 py-2 text-base',
                                isActive('/blog')
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                                    : 'text-slate-700 hover:text-slate-900',
                            )}
                        >
                            Blog
                        </Link>

                        <Link
                            href="/contact-us"
                            className={cn(
                                'rounded-full font-medium transition-all hover:bg-slate-100',
                                isScrolled ? 'px-3.5 py-2 text-sm' : 'px-4 py-2 text-base',
                                isActive('/contact-us')
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                                    : 'text-slate-700 hover:text-slate-900',
                            )}
                        >
                            Contact Us
                        </Link>
                    </div>

                    <div className={cn('hidden items-center lg:flex', isScrolled ? 'gap-2' : 'gap-3')}>
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100">
                                    <Avatar className="size-8 border border-slate-200">
                                        {user.avatar ? (
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                        ) : null}
                                        <AvatarFallback className="bg-[#2547F9] text-xs font-semibold text-white">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="max-w-[120px] truncate text-left">
                                        {user.name}
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lg" align="end">
                                    <DropdownMenuItem asChild className="cursor-pointer">
                                        <Link href="/dashboard" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="cursor-pointer">
                                        <Link href="/dashboard/profile" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Profil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-1" />
                                    <DropdownMenuItem
                                        onSelect={(event) => {
                                            event.preventDefault();
                                            handleLogout();
                                        }}
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    className={cn(
                                        'rounded-full bg-slate-200 text-slate-700 transition-all hover:bg-slate-300',
                                        isScrolled ? 'h-9 px-4 text-sm' : 'h-10 px-5 text-base',
                                    )}
                                >
                                    <Link href="/masuk">Login</Link>
                                </Button>
                                <Button
                                    asChild
                                    className={cn(
                                        'rounded-full text-white transition-all',
                                        isScrolled ? 'h-9 px-4 text-sm' : 'h-10 px-5 text-base',
                                    )}
                                    style={{ backgroundColor: '#2547F9' }}
                                    onMouseEnter={(event) => {
                                        event.currentTarget.style.backgroundColor = '#1e3fd4';
                                    }}
                                    onMouseLeave={(event) => {
                                        event.currentTarget.style.backgroundColor = '#2547F9';
                                    }}
                                >
                                    <Link href="/daftar">Register</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:w-[400px]">
                            <SheetHeader className="text-left">
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="mt-8 flex flex-col gap-2">
                                <Link
                                    href="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-slate-100"
                                >
                                    Home
                                </Link>
                                <div>
                                    <button
                                        onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                                        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-slate-100"
                                    >
                                        <span>Profile</span>
                                        <ChevronDown
                                            className={cn(
                                                'h-5 w-5 transition-transform',
                                                mobileProfileOpen && 'rotate-180',
                                            )}
                                        />
                                    </button>
                                    {mobileProfileOpen && (
                                        <div className="mt-1 flex flex-col">
                                            {profileMenuItems.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                                >
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Link
                                    href="/kelas"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-slate-100"
                                >
                                    Kelas
                                </Link>
                                <Link
                                    href="/blog"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-slate-100"
                                >
                                    Blog
                                </Link>
                                <Link
                                    href="/contact-us"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-slate-100"
                                >
                                    Contact Us
                                </Link>
                            </div>

                            {user ? (
                                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <Avatar className="size-12 border border-slate-200">
                                        {user.avatar ? (
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                        ) : null}
                                        <AvatarFallback className="bg-[#2547F9] text-sm font-semibold text-white">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-sm">
                                        <p className="font-semibold text-slate-900">{user.name}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="rounded-full border-slate-300 text-slate-600 hover:bg-slate-100"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="mt-8 flex flex-col gap-3 px-2">
                                    <Button
                                        asChild
                                        className="h-11 rounded-full bg-slate-200 text-base font-medium text-slate-700 hover:bg-slate-300"
                                    >
                                        <Link
                                            href="/masuk"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className="h-11 rounded-full text-base font-medium text-white"
                                        style={{ backgroundColor: '#2547F9' }}
                                        onMouseEnter={(event) => {
                                            event.currentTarget.style.backgroundColor = '#1e3fd4';
                                        }}
                                        onMouseLeave={(event) => {
                                            event.currentTarget.style.backgroundColor = '#2547F9';
                                        }}
                                    >
                                        <Link
                                            href="/daftar"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </div>
    );
}
