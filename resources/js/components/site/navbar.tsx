import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import * as React from 'react';

export default function Navbar() {
    const { settings } = usePage<PageProps>().props;
    const siteName = settings?.site_name || 'Laravel Starter Kit';
    const siteLogo = settings?.logo;
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const profileMenuItems = [
        {
            title: 'Tentang Kami',
            href: '/tentang-kami',
            description: 'Pelajari lebih lanjut tentang kami',
        },
        {
            title: 'Syarat & Ketentuan',
            href: '/syarat-ketentuan',
            description: 'Baca syarat dan ketentuan layanan',
        },
        {
            title: 'Kebijakan Privasi',
            href: '/kebijakan-privasi',
            description: 'Lihat kebijakan privasi kami',
        },
        {
            title: 'FAQ',
            href: '/faq',
            description: 'Pertanyaan yang sering diajukan',
        },
    ];

    return (
        <nav
            className={cn(
                'fixed top-0 right-0 left-0 z-50 w-full border-b transition-all duration-300',
                isScrolled
                    ? 'bg-white/70 shadow-md backdrop-blur-lg'
                    : 'bg-white/95 backdrop-blur-sm',
            )}
        >
            <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                {/* Logo - Kiri */}
                <Link
                    href="/"
                    className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
                >
                    {siteLogo ? (
                        <img
                            src={siteLogo}
                            alt={siteName}
                            className="size-20 object-cover"
                        />
                    ) : (
                        <span className="text-lg font-bold text-gray-900 sm:text-xl">
                            {siteName}
                        </span>
                    )}
                </Link>

                {/* Desktop Navigation Menu - Tengah */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList className="gap-1">
                        {/* Home */}
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/" className="font-medium">
                                    Home
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* Profile Dropdown */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="font-medium">
                                Profile
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {profileMenuItems.map((item) => (
                                        <ListItem
                                            key={item.title}
                                            title={item.title}
                                            href={item.href}
                                        >
                                            {item.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Blog */}
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/blog" className="font-medium">
                                    Blog
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* Kelas */}
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/kelas" className="font-medium">
                                    Kelas
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* Contact Us */}
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link
                                    href="/contact-us"
                                    className="font-medium"
                                >
                                    Contact Us
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Auth Buttons - Kanan */}
                <div className="hidden items-center gap-2 lg:flex">
                    <Button variant="ghost" size="default" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button size="default" asChild>
                        <Link href="/register">Register</Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:w-[400px]">
                        <SheetHeader className="text-left">
                            <SheetTitle>Menu</SheetTitle>
                            <SheetDescription>
                                Navigate through our website
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-8 flex flex-col gap-4">
                            {/* Mobile Menu Items */}
                            <Link
                                href="/"
                                className="rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>

                            {/* Mobile Profile Accordion */}
                            <Accordion type="single" collapsible>
                                <AccordionItem
                                    value="profile"
                                    className="border-none"
                                >
                                    <AccordionTrigger className="rounded-md px-4 py-3 text-base font-medium hover:bg-accent hover:no-underline">
                                        Profile
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-0">
                                        <div className="flex flex-col gap-1 pt-2 pl-4">
                                            {profileMenuItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="rounded-md px-4 py-3 text-sm transition-colors hover:bg-accent"
                                                    onClick={() =>
                                                        setMobileMenuOpen(false)
                                                    }
                                                >
                                                    <div className="font-medium">
                                                        {item.title}
                                                    </div>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {item.description}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Link
                                href="/blog"
                                className="rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Blog
                            </Link>

                            <Link
                                href="/kelas"
                                className="rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Kelas
                            </Link>

                            <Link
                                href="/contact-us"
                                className="rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact Us
                            </Link>

                            {/* Mobile Auth Buttons */}
                            <div className="mt-4 flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    asChild
                                    className="w-full"
                                >
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                </Button>
                                <Button size="lg" asChild className="w-full">
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}

const ListItem = ({
    className,
    title,
    children,
    href,
}: {
    title: string;
    href: string;
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className={cn(
                        'block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className,
                    )}
                >
                    <div className="text-sm leading-none font-medium">
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
};
