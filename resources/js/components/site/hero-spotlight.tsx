import { Button } from '@/components/ui/button';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, PlayCircle, User } from 'lucide-react';

export function HeroSpotlight() {
    const { settings } = usePage<PageProps>().props;
    const heroTitle =
        settings?.hero_title || 'Raih Skill Masa Depan';
    const heroSubtitle =
        settings?.hero_subtitle ||
        settings?.desc ||
        'Platform pembelajaran online terbaik di Indonesia. Kami menyediakan berbagai kursus berkualitas dengan instruktur berpengalaman untuk membantu Anda mengembangkan skill dan karir.';
    const heroImage =
        settings?.home_thumbnail ||
        settings?.thumbnail ||
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop';
    const badgeTitle =
        settings?.hero_badge_title || 'Kursus Terpopuler';
    const badgeSubtitle =
        settings?.hero_badge_subtitle || 'Web Development Bootcamp';

    const features = [
        'Akses seumur hidup',
        'Sertifikat resmi',
        'Mentor berpengalaman',
    ];

    const stats = [
        {
            number: settings?.hero_stat1_number || '10K+',
            label: settings?.hero_stat1_label || 'Siswa Aktif',
        },
        {
            number: settings?.hero_stat2_number || '100+',
            label: settings?.hero_stat2_label || 'Kursus Premium',
        },
        {
            number: settings?.hero_stat3_number || '50+',
            label: settings?.hero_stat3_label || 'Mentor Expert',
        },
    ];

    return (
        <section className="relative min-h-[90vh] w-full overflow-hidden bg-white pt-24 sm:pt-28">
            {/* Blur Drop Background Effects */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {/* Large blur shape - top left */}
                <div
                    className="absolute left-[10%] top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
                    style={{ backgroundColor: '#2547F9' }}
                ></div>

                {/* Medium blur shape - top right */}
                <div
                    className="absolute right-[15%] top-[10%] h-[400px] w-[400px] translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
                    style={{ backgroundColor: '#4d6bff' }}
                ></div>

                {/* Large blur shape - center */}
                <div
                    className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
                    style={{ backgroundColor: '#2547F9' }}
                ></div>

                {/* Small blur shape - bottom left */}
                <div
                    className="absolute bottom-[10%] left-[20%] h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full opacity-25 blur-3xl"
                    style={{ backgroundColor: '#1e3fd4' }}
                ></div>

                {/* Medium blur shape - bottom right */}
                <div
                    className="absolute bottom-[5%] right-[10%] h-[450px] w-[450px] translate-x-1/2 translate-y-1/2 rounded-full opacity-15 blur-3xl"
                    style={{ backgroundColor: '#4d6bff' }}
                ></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid min-h-[85vh] items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-center space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#2547F9]"
                            style={{ backgroundColor: '#2547F9' + '10' }}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: '#2547F9' + '66' }}></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: '#2547F9' }}></span>
                            </span>
                            Belajar Kapan Saja, Di Mana Saja
                        </motion.div>

                        {/* Main Heading */}
                        <div className="space-y-6">
                            <h1 className="font-poppins text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                                {heroTitle.split(' ').slice(0, -2).join(' ')}{' '}
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #2547F9, #1e3fd4, #1837af)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                                        {heroTitle.split(' ').slice(-2).join(' ')}
                                    </span>
                                    <svg
                                        className="absolute -bottom-2 left-0 w-full"
                                        height="12"
                                        viewBox="0 0 300 12"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 10C50 5 100 2 150 3C200 4 250 7 298 10"
                                            stroke="url(#gradient)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="gradient"
                                                x1="0%"
                                                y1="0%"
                                                x2="100%"
                                                y2="0%"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#2547F9"
                                                />
                                                <stop
                                                    offset="50%"
                                                    stopColor="#1e3fd4"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#1837af"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </h1>
                            <p className="font-poppins text-lg leading-relaxed text-slate-600 sm:text-xl">
                                {heroSubtitle}
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: 0.4 + index * 0.1,
                                        duration: 0.5,
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    <span className="font-poppins text-sm font-medium text-slate-700">
                                        {feature}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="flex flex-col gap-4 sm:flex-row sm:items-center"
                        >
                            <Button
                                size="lg"
                                asChild
                                className="group h-14 rounded-xl px-8 font-poppins text-base font-semibold shadow-lg transition-all hover:shadow-xl"
                                style={{
                                    background: 'linear-gradient(to right, #2547F9, #1e3fd4)',
                                    boxShadow: '0 10px 15px -3px rgba(37, 71, 249, 0.3)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(37, 71, 249, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 71, 249, 0.3)';
                                }}
                            >
                                <Link href="/kelas">
                                    Mulai Belajar Sekarang
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="group h-14 rounded-xl border-2 border-slate-200 bg-white px-8 font-poppins text-base font-semibold hover:border-slate-300 hover:bg-slate-50"
                            >
                                <Link href="/tentang-kami">
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    Lihat Demo
                                </Link>
                            </Button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="flex flex-wrap gap-8 border-t border-slate-200 pt-8"
                        >
                            {stats.map((stat, index) => (
                                <div key={index}>
                                    <div className="font-poppins text-3xl font-bold text-slate-900">
                                        {stat.number}
                                    </div>
                                    <div className="font-poppins text-sm text-slate-600">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="relative hidden lg:block"
                    >
                        {/* Main Image Container */}
                        <div className="relative">
                            {/* Image with Border and Shadow */}
                            <div className="relative">
                                {/* Main Image */}
                                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                                    <img
                                        src={heroImage}
                                        alt="Learning Platform"
                                        className="aspect-[4/5] h-full w-full object-cover"
                                    />

                                    {/* Floating Badge - Bottom */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 1,
                                            duration: 0.6,
                                        }}
                                        className="absolute bottom-6 left-6 right-6"
                                    >
                                        <motion.div
                                            animate={{ y: [0, -8, 0] }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="rounded-2xl border border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur-xl"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="font-poppins text-sm font-semibold text-slate-900">
                                                        {badgeTitle}
                                                    </p>
                                                    <p className="font-poppins text-xs text-slate-600">
                                                        {badgeSubtitle}
                                                    </p>
                                                </div>
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full shadow-lg" style={{ background: 'linear-gradient(to bottom right, #2547F9, #1837af)', boxShadow: '0 10px 15px -3px rgba(37, 71, 249, 0.5)' }}>
                                                    <svg
                                                        className="h-6 w-6 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>

                                    {/* Floating Stats Card - Top Right */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 1.2,
                                            duration: 0.6,
                                        }}
                                        className="absolute right-6 top-6"
                                    >
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 0.5,
                                            }}
                                            className="rounded-xl border border-white/30 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-xl"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-600">
                                                    <svg
                                                        className="h-5 w-5 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-poppins text-xs font-medium text-slate-600">
                                                        Rating
                                                    </p>
                                                    <p className="font-poppins text-lg font-bold text-slate-900">
                                                        4.9/5
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>

                                    {/* Floating Students Card - Top Left */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 1.4,
                                            duration: 0.6,
                                        }}
                                        className="absolute left-6 top-20"
                                    >
                                        <motion.div
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{
                                                duration: 3.5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 1,
                                            }}
                                            className="rounded-xl border border-white/30 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-xl"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-2">
                                                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white" style={{ background: 'linear-gradient(to bottom right, #4d6bff, #2547F9)' }}>
                                                        <User className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white" style={{ background: 'linear-gradient(to bottom right, #2547F9, #1e3fd4)' }}>
                                                        <User className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white" style={{ background: 'linear-gradient(to bottom right, #1e3fd4, #1837af)' }}>
                                                        <User className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-poppins text-xs font-medium text-slate-600">
                                                        {settings?.hero_active_label || 'Active Now'}
                                                    </p>
                                                    <p className="font-poppins text-sm font-bold text-slate-900">
                                                        {settings?.hero_active_value || '2.5K+ Students'}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Floating Elements */}
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 10, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -right-8 top-16 h-20 w-20 rounded-2xl opacity-20 blur-xl"
                            style={{ background: 'linear-gradient(to bottom right, #4d6bff, #2547F9)' }}
                        ></motion.div>

                        <motion.div
                            animate={{
                                y: [0, 20, 0],
                                rotate: [0, -10, 0],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1,
                            }}
                            className="absolute -left-6 bottom-20 h-24 w-24 rounded-full opacity-20 blur-xl"
                            style={{ background: 'linear-gradient(to bottom right, #2547F9, #1837af)' }}
                        ></motion.div>

                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                                x: [0, 10, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2,
                            }}
                            className="absolute -right-4 -bottom-4 h-16 w-16 rounded-xl opacity-20 blur-lg"
                            style={{ background: 'linear-gradient(to bottom right, #1e3fd4, #1329a3)' }}
                        ></motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Wave - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
        </section>
    );
}
