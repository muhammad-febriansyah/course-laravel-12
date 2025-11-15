import { PageHeader } from '@/components/site/page-header';
import HomeLayout from '@/layouts/home-layout';
import { Head, Link } from '@inertiajs/react';
import * as Icons from 'lucide-react';

interface Statistic {
    icon?: string | null;
    value: string;
    label: string;
}

interface AboutUs {
    title: string;
    body: string;
    image: string | null;
    vision?: string | null;
    mission?: string | null;
    statistics?: Statistic[] | null;
}

interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
    order: number;
}

interface Props {
    aboutUs: AboutUs | null;
    features: Feature[];
}

const resolveImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('blob:')) {
        return path;
    }

    if (path.startsWith('/')) {
        return path;
    }

    const normalized = path.replace(/^\/+/, '');

    if (normalized.startsWith('storage/')) {
        return `/${normalized}`;
    }

    if (normalized.startsWith('images/')) {
        return `/${normalized}`;
    }

    return `/storage/${normalized}`;
};

const getIconComponent = (
    iconName: string | null | undefined,
    fallback: keyof typeof Icons,
) => {
    if (iconName && iconName in Icons) {
        return Icons[iconName as keyof typeof Icons];
    }

    return Icons[fallback];
};

const splitMission = (mission?: string | null) =>
    mission
        ? mission
              .split(/\r?\n|\|/)
              .map((item) => item.trim())
              .filter(Boolean)
        : [];

export default function AboutUsPage({ aboutUs, features }: Props) {
    if (!aboutUs) {
        return (
            <HomeLayout>
                <Head title="Tentang Kami" />
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-muted-foreground">
                        Data belum tersedia.
                    </p>
                </div>
            </HomeLayout>
        );
    }

    const statistics = (aboutUs.statistics ?? []).filter(
        (stat): stat is Statistic => Boolean(stat && stat.value && stat.label),
    );
    const missionItems = splitMission(aboutUs.mission);
    const featureList = (features ?? [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const AboutImage = resolveImageUrl(aboutUs.image);

    return (
        <HomeLayout>
            <Head title={aboutUs.title || 'Tentang Kami'} />

            <PageHeader
                title="Tentang Kami"
                description="Platform pembelajaran online yang berdedikasi untuk memberikan pendidikan berkualitas tinggi dengan mentor profesional"
            />

            <section className="relative overflow-hidden bg-white py-16 sm:py-24">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
                    <div className="absolute right-0 bottom-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-200/40 blur-3xl sm:h-[22rem] sm:w-[22rem]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
                        <div className="space-y-6">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                                Profil Singkat
                            </span>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                {aboutUs.title || 'Berkenalan Dengan Kami'}
                            </h1>

                            {aboutUs.body && (
                                <div
                                    className="prose prose-slate lg:prose-lg max-w-none text-slate-600"
                                    dangerouslySetInnerHTML={{
                                        __html: aboutUs.body,
                                    }}
                                />
                            )}

                            {statistics.length > 0 && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {statistics
                                        .slice(0, 2)
                                        .map((stat, index) => {
                                            const IconComponent =
                                                getIconComponent(
                                                    stat.icon,
                                                    'BarChart3',
                                                );

                                            return (
                                                <div
                                                    key={`${stat.label}-${index}`}
                                                    className="rounded-2xl border border-primary/10 bg-white/70 p-5 shadow-sm backdrop-blur"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                            <IconComponent className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                                                                {stat.label}
                                                            </p>
                                                            <p className="text-2xl font-bold text-slate-900">
                                                                {stat.value}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-2xl" />
                            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl ring-1 ring-black/5">
                                {AboutImage ? (
                                    <img
                                        src={AboutImage}
                                        alt={aboutUs.title || 'Tentang kami'}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full min-h-[320px] w-full items-center justify-center bg-gradient-to-br from-primary/50 to-indigo-500 text-white">
                                        <Icons.Image className="h-16 w-16 opacity-80" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {statistics.length > 0 && (
                <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-20">
                    <div className="absolute inset-0 opacity-60">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
                    </div>
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-12 max-w-2xl text-white">
                            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-wide uppercase">
                                Pencapaian Kami
                            </span>
                            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                                Dampak nyata yang telah kami ciptakan
                            </h2>
                            <p className="mt-3 text-base text-slate-200">
                                Angka-angka ini menggambarkan komitmen kami
                                dalam menghadirkan pengalaman belajar terbaik
                                untuk semua orang.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {statistics.map((stat, index) => {
                                const IconComponent = getIconComponent(
                                    stat.icon,
                                    'Trophy',
                                );

                                return (
                                    <div
                                        key={`${stat.label}-${index}`}
                                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                                    >
                                        <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.3),_transparent_65%)]" />
                                        </div>
                                        <div className="relative flex items-start gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur">
                                                <IconComponent className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-3xl font-bold text-white">
                                                    {stat.value}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-200">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {(aboutUs.vision || missionItems.length > 0) && (
                <section className="bg-white py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto mb-12 max-w-2xl text-center">
                            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                Visi &amp; Misi Kami
                            </h2>
                            <p className="mt-3 text-base text-slate-600">
                                Nilai dan tujuan yang menjadi kompas seluruh
                                perjalanan kami dalam membangun platform
                                pembelajaran ini.
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-2">
                            {aboutUs.vision && (
                                <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:p-10">
                                    <div className="absolute top-0 right-0 h-48 w-48 translate-x-16 -translate-y-16 rounded-full bg-primary/10 blur-2xl" />
                                    <div className="relative space-y-5">
                                        <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                                            <Icons.Target className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-2xl font-semibold text-slate-900">
                                            Visi Kami
                                        </h3>
                                        <div className="text-base leading-relaxed text-slate-600">
                                            {aboutUs.vision.includes('<') ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: aboutUs.vision,
                                                    }}
                                                />
                                            ) : (
                                                <p>{aboutUs.vision}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {missionItems.length > 0 && (
                                <div className="relative overflow-hidden rounded-3xl border border-purple-200 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:p-10">
                                    <div className="absolute top-0 left-0 h-48 w-48 -translate-x-12 -translate-y-12 rounded-full bg-purple-100 blur-2xl" />
                                    <div className="relative space-y-5">
                                        <div className="inline-flex rounded-2xl bg-purple-100 p-3 text-purple-700">
                                            <Icons.Sparkles className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-2xl font-semibold text-slate-900">
                                            Misi Kami
                                        </h3>
                                        <ul className="space-y-3 text-base leading-relaxed text-slate-600">
                                            {missionItems.map((item, idx) => (
                                                <li
                                                    key={`${item}-${idx}`}
                                                    className="flex gap-3"
                                                >
                                                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">
                                                        {idx + 1}
                                                    </span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {missionItems.length === 0 && aboutUs.mission && (
                                <div className="relative overflow-hidden rounded-3xl border border-purple-200 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:p-10">
                                    <div className="absolute top-0 left-0 h-48 w-48 -translate-x-12 -translate-y-12 rounded-full bg-purple-100 blur-2xl" />
                                    <div className="relative space-y-5">
                                        <div className="inline-flex rounded-2xl bg-purple-100 p-3 text-purple-700">
                                            <Icons.Sparkles className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-2xl font-semibold text-slate-900">
                                            Misi Kami
                                        </h3>
                                        <div className="text-base leading-relaxed text-slate-600">
                                            {aboutUs.mission}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {featureList.length > 0 && (
                <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
                    <div className="absolute inset-0">
                        <div className="absolute inset-y-0 left-1/2 h-[120%] w-[120%] -translate-x-1/2 bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.22),_transparent_60%)]" />
                    </div>
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-wide uppercase">
                                Keunggulan Kami
                            </span>
                            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                                Transformasi belajar yang lebih personal dan
                                relevan
                            </h2>
                            <p className="mt-3 text-base text-slate-200">
                                Tim kami menghadirkan kombinasi kurikulum
                                mutakhir, mentor ahli, dan dukungan penuh agar
                                Anda tetap berkembang di mana pun berada.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featureList.map((feature) => {
                                const IconComponent = getIconComponent(
                                    feature.icon,
                                    'Sparkles',
                                );

                                return (
                                    <div
                                        key={feature.id}
                                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/15"
                                    >
                                        <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_65%)]" />
                                        </div>
                                        <div className="relative space-y-4">
                                            <div className="inline-flex rounded-2xl bg-white/15 p-3 text-white backdrop-blur">
                                                <IconComponent className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-white">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm leading-relaxed text-slate-200">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            <section className="bg-white py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-blue-600 px-8 py-12 text-white shadow-2xl sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-xs font-semibold tracking-wide uppercase">
                                Mulai Belajar
                            </span>
                            <h3 className="text-3xl font-bold sm:text-4xl">
                                Wujudkan rencana karier bersama mentor terbaik
                                kami
                            </h3>
                            <p className="text-base text-white/80">
                                Temukan kelas yang relevan dengan tujuan Anda,
                                dan nikmati dukungan berkelanjutan dari
                                komunitas belajar kami.
                            </p>
                        </div>
                        <div className="mt-8 flex flex-shrink-0 items-center gap-3 lg:mt-0">
                            <Link
                                href="/kelas"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary transition hover:bg-slate-100"
                            >
                                Jelajahi Kelas
                                <Icons.ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/contact-us"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                            >
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </HomeLayout>
    );
}
