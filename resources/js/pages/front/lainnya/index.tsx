import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import HomeLayout from '@/layouts/home-layout';
import { Link } from '@inertiajs/react';
import {
    ChevronRight,
    FileText,
    HelpCircle,
    Info,
    LogIn,
    Menu,
    UserPlus,
} from 'lucide-react';

export default function index() {
    const menuItems = [
        {
            icon: LogIn,
            label: 'Login',
            href: '/login',
        },
        {
            icon: UserPlus,
            label: 'Registrasi',
            href: '/register',
        },
        {
            icon: Info,
            label: 'Tentang Kami',
            href: '/about',
        },
        {
            icon: FileText,
            label: 'Syarat & Ketentuan',
            href: '/terms',
        },
        {
            icon: HelpCircle,
            label: 'FAQ',
            href: '/faq',
        },
    ];

    return (
        <HomeLayout>
            <div className="relative h-64 overflow-hidden bg-biru">
                <DottedGlowBackground
                    color="rgba(255, 255, 255, 0.3)"
                    glowColor="rgba(147, 197, 253, 0.8)"
                    gap={20}
                    radius={1.5}
                    opacity={0.8}
                />
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 shadow-lg backdrop-blur-md">
                        <Menu className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="mt-4 text-3xl font-bold text-white">
                        Lainnya
                    </h1>
                    <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-white/80">
                        Akses informasi dan pengaturan untuk pengalaman belajar
                        yang lebih baik.
                    </p>
                </div>
            </div>

            <div className="relative -mt-4 min-h-screen bg-gray-50 pb-24">
                <div className="mx-auto max-w-screen-md px-4">
                    <br />
                    <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="group flex items-center justify-between border-b border-gray-100 px-6 py-5 transition-all last:border-b-0 hover:bg-blue-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-biru transition-all group-hover:from-biru group-hover:to-blue-600 group-hover:text-white group-hover:shadow-md">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-base font-medium text-gray-800 transition-colors group-hover:text-biru">
                                        {item.label}
                                    </span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-biru" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}
