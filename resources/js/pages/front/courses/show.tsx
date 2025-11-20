import { CourseCard } from '@/components/site/course-card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/site/page-header';
import HomeLayout from '@/layouts/home-layout';
import type { Course, CourseReview, CourseSection, CourseVideo } from '@/types/course';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    CheckCircle2,
    Clock,
    Info,
    Layers,
    Lock,
    MessageCircle,
    PlayCircle,
    Star,
    Users,
} from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { useMemo, useState } from 'react';

interface CourseDetailPageProps {
    course: Course;
    relatedCourses: Course[];
}

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const reviewDateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const formatReviewDate = (value?: string | null) => {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return reviewDateFormatter.format(date);
};

const getInitials = (value?: string | null) => {
    if (!value) return 'IN';
    const parts = value.trim().split(' ');
    const initials = parts.slice(0, 2).map((part) => part.charAt(0));
    return initials.join('').toUpperCase();
};

const resolveVideoSource = (
    video: CourseVideo,
): { src: string; iframe: boolean } => {
    const raw = (video.embedUrl || video.url || '').trim();

    if (!raw) {
        return { src: '', iframe: false };
    }

    try {
        const parsed = new URL(raw);
        const host = parsed.hostname.toLowerCase();

        const buildYouTubeEmbed = (id: string) =>
            `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&showinfo=0`;

        if (host.includes('youtube.com') || host === 'youtu.be') {
            let videoId = '';

            if (host === 'youtu.be') {
                videoId = parsed.pathname.replace('/', '');
            } else {
                videoId = parsed.searchParams.get('v') ?? '';

                if (!videoId && parsed.pathname.startsWith('/embed/')) {
                    videoId = parsed.pathname.replace('/embed/', '');
                }

                if (!videoId && parsed.pathname.startsWith('/shorts/')) {
                    videoId = parsed.pathname.replace('/shorts/', '');
                }
            }

            if (videoId) {
                return { src: buildYouTubeEmbed(videoId), iframe: true };
            }

            return { src: raw, iframe: true };
        }

        if (host.includes('vimeo.com')) {
            const pathParts = parsed.pathname.split('/').filter(Boolean);
            const videoId = pathParts.pop();

            if (videoId) {
                return {
                    src: `https://player.vimeo.com/video/${videoId}`,
                    iframe: true,
                };
            }

            return { src: raw, iframe: true };
        }
    } catch (error) {
        return { src: raw, iframe: false };
    }

    return { src: raw, iframe: false };
};

export default function CourseDetailPage({
    course,
    relatedCourses,
}: CourseDetailPageProps) {
    const hasDiscount =
        (course.discount ?? 0) > 0 &&
        (course.discount ?? 0) < (course.price ?? 0);
    const benefits = useMemo(
        () => (Array.isArray(course.benefits) ? course.benefits : []),
        [course.benefits],
    );
    const sections: CourseSection[] = useMemo(
        () => (Array.isArray(course.sections) ? course.sections : []),
        [course.sections],
    );
    const totalVideos = useMemo(
        () =>
            sections.reduce(
                (total, section) =>
                    total +
                    (Array.isArray(section?.videos)
                        ? section.videos.length
                        : 0),
                0,
            ),
        [sections],
    );

    const reviews: CourseReview[] = useMemo(() => {
        if (!Array.isArray(course.reviews)) {
            return [];
        }

        return (course.reviews as CourseReview[]).map((review) => {
            const fallbackUser = review.user ?? review.author ?? null;
            const rawRating = (review.rating ?? (fallbackUser as unknown as { rating?: unknown })?.rating) as
                | number
                | string
                | undefined;
            const parsedRating = Number.parseFloat(String(rawRating ?? 0));
            const normalizedRating = Number.isFinite(parsedRating)
                ? Math.max(0, Math.min(5, parsedRating))
                : 0;

            return {
                ...review,
                rating: normalizedRating,
                comment: review.comment ?? '',
                user: fallbackUser ?? undefined,
            };
        });
    }, [course.reviews]);
    const reviewsCount = reviews.length;
    const reviewsCountLabel = reviewsCount.toLocaleString('id-ID');
    const averageRating = useMemo(() => {
        if (!reviews.length) {
            return 0;
        }

        const total = reviews.reduce((sum, review) => {
            const value = Number(review.rating ?? 0);
            return sum + (Number.isFinite(value) ? value : 0);
        }, 0);

        return Math.round((total / reviews.length) * 10) / 10;
    }, [reviews]);
    const ratingBuckets = useMemo(() => {
        const buckets = [0, 0, 0, 0, 0];

        reviews.forEach((review) => {
            const value = Number(review.rating ?? 0);
            const rating = Math.round(Number.isFinite(value) ? value : 0);

            if (rating >= 1 && rating <= 5) {
                buckets[rating - 1] += 1;
            }
        });

        return buckets;
    }, [reviews]);

    const [previewVideo, setPreviewVideo] = useState<CourseVideo | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const page = usePage<{ auth?: { user?: unknown } }>();
    const isAuthenticated = Boolean(page.props.auth?.user);
    const isEnrolled = course.isEnrolled ?? false;
    const previewLimit = Math.max(course.previewLimit ?? 0, 0);
    const shouldLimitPreview = !isEnrolled && previewLimit > 0;
    const relatedCount = relatedCourses.length;

    const tabItems = useMemo(
        () => [
            {
                value: 'curriculum',
                label: 'Kurikulum & Materi',
                helper: `${totalVideos} video pembelajaran`,
                icon: BookOpen,
            },
            {
                value: 'info',
                label: 'Informasi Singkat',
                helper: 'Ringkasan detail kelas',
                icon: Info,
            },
            {
                value: 'reviews',
                label: 'Ulasan Peserta',
                helper:
                    reviewsCount > 0
                        ? `${reviewsCountLabel} ulasan peserta`
                        : 'Belum ada ulasan',
                icon: MessageCircle,
            },
            {
                value: 'related',
                label: 'Kelas Terkait',
                helper: `${relatedCount} rekomendasi untukmu`,
                icon: Layers,
            },
        ],
        [relatedCount, reviewsCount, totalVideos],
    );

    const openPreview = (video: CourseVideo) => {
        setPreviewVideo(video);
        setPreviewOpen(true);
    };

    const closePreview = () => {
        setPreviewOpen(false);
        setPreviewVideo(null);
    };

    const renderPreviewContent = () => {
        if (!previewVideo) {
            return null;
        }

        const { src, iframe } = resolveVideoSource(previewVideo);

        if (!src) {
            return (
                <p className="text-sm text-slate-500">
                    Konten video belum tersedia. Silakan coba lagi nanti.
                </p>
            );
        }

        if (iframe) {
            return (
                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200">
                    <iframe
                        src={src}
                        title={previewVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                    />
                </div>
            );
        }

        return (
            <video
                src={src}
                controls
                className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-black"
            >
                Browser kamu tidak mendukung pemutar video.
            </video>
        );
    };

    const headerDescription =
        course.shortDescription ??
        'Pelajari informasi lengkap, kurikulum, dan ulasan peserta untuk memahami pengalaman belajar di kelas ini.';

    return (
        <div className="bg-slate-50 pb-24">
            <Head title={course.title} />

            <PageHeader title={course.title} description={headerDescription} />

            <div className="-mt-12 sm:-mt-16">
                <div className="relative isolate">
                    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
                        <div className="h-[22rem] w-[68rem] rounded-full bg-gradient-to-r from-[#2547F9]/30 via-[#1e3fd4]/25 to-transparent blur-3xl" />
                    </div>
                    <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28 space-y-12">
                        <CourseHeroSection
                            course={course}
                            hasDiscount={hasDiscount}
                            totalVideos={totalVideos}
                            currency={currency}
                            getInitials={getInitials}
                        />
                        <CourseDetailSections
                            course={course}
                            benefits={benefits}
                            sections={sections}
                            totalVideos={totalVideos}
                            shouldLimitPreview={shouldLimitPreview}
                            previewLimit={previewLimit}
                            openPreview={openPreview}
                            tabItems={tabItems}
                            reviews={reviews}
                            averageRating={averageRating}
                            ratingBuckets={ratingBuckets}
                            reviewsCount={reviewsCount}
                            reviewsCountLabel={reviewsCountLabel}
                            relatedCourses={relatedCourses}
                            getInitials={getInitials}
                        />
                    </div>
                </div>
            </div>

            <Dialog
                open={previewOpen}
                onOpenChange={(open) =>
                    open ? setPreviewOpen(true) : closePreview()
                }
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-slate-900">
                            {previewVideo?.title ?? 'Pratinjau Video'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {renderPreviewContent()}
                        {previewVideo?.url ? (
                            <p className="text-xs text-slate-500">
                                Sumber: {previewVideo.url}
                            </p>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

CourseDetailPage.layout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;

interface CourseHeroSectionProps {
    course: Course;
    hasDiscount: boolean;
    totalVideos: number;
    currency: Intl.NumberFormat;
    getInitials: (value?: string | null) => string;
}

function CourseHeroSection({
    course,
    hasDiscount,
    totalVideos,
    currency,
    getInitials,
}: CourseHeroSectionProps) {
    return (
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,3.5fr)_minmax(0,2.5fr)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-slate-900/5 shadow-xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2547F9]/20 via-transparent to-[#1e3fd4]/35 opacity-80" />
                    <img
                        src={course.image}
                        alt={course.title}
                        className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                </motion.div>

                <div className="space-y-6 rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-lg backdrop-blur-sm sm:p-10">
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge
                            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-md"
                            style={{
                                background: 'linear-gradient(to right, #2547F9, #1e3fd4)',
                                boxShadow: '0 12px 20px -8px rgba(37, 71, 249, 0.45)',
                            }}
                        >
                            <Star className="h-3.5 w-3.5 fill-current" />
                            Kelas Premium
                        </Badge>
                        {course.category ? (
                            <Badge className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700 shadow-sm">
                                {course.category.name}
                            </Badge>
                        ) : null}
                        {course.level ? (
                            <Badge className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
                                {course.level.name}
                            </Badge>
                        ) : null}
                        {course.type ? (
                            <Badge className="rounded-full bg-purple-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-purple-700 shadow-sm">
                                {course.type.name}
                            </Badge>
                        ) : null}
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            {course.title}
                        </h1>
                        <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                            {course.shortDescription}
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                            {
                                icon: Users,
                                label: 'Dilihat',
                                value: course.views.toLocaleString('id-ID'),
                            },
                            {
                                icon: PlayCircle,
                                label: 'Materi Video',
                                value: `${totalVideos} video`,
                            },
                            {
                                icon: Clock,
                                label: 'Akses',
                                value: 'Seumur hidup',
                            },
                        ].map(({ icon: Icon, label, value }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-100/60 p-4 text-sm text-slate-600 shadow-sm"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl bg-white text-[#2547F9] shadow-inner">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        {label}
                                    </span>
                                    <span className="text-base font-semibold text-slate-900">
                                        {value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-full space-y-6 lg:sticky lg:top-24"
            >
                <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl backdrop-blur-sm sm:p-8">
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Harga kelas
                            </p>
                            <div className="mt-2 flex items-end gap-3">
                                <span className="bg-gradient-to-r from-[#2547F9] to-[#1e3fd4] bg-clip-text text-3xl font-bold leading-none text-transparent sm:text-4xl">
                                    {currency.format(course.finalPrice)}
                                </span>
                                {hasDiscount ? (
                                    <span className="text-base text-slate-400 line-through sm:text-lg">
                                        {currency.format(course.price)}
                                    </span>
                                ) : null}
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-slate-500">
                                Dapatkan akses penuh ke seluruh materi, komunitas, dan pembaruan kelas tanpa biaya tambahan.
                            </p>
                        </div>

                        <div className="grid gap-3 text-sm text-slate-700">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                                <span>Akses seumur hidup ke materi premium</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                                <span>Termasuk kuis interaktif & komunitas diskusi</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                                <span>Sertifikat penyelesaian resmi</span>
                            </div>
                        </div>

                        <Button
                            asChild
                            size="lg"
                            className="h-14 w-full rounded-2xl text-base font-bold text-white shadow-lg transition-all hover:shadow-xl"
                            style={{ background: 'linear-gradient(to right, #2547F9, #1e3fd4)' }}
                        >
                            <Link href={`/checkout/${course.slug}`} prefetch>
                                Beli kelas sekarang
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                    <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                        <div className="flex flex-col rounded-2xl bg-slate-100/60 px-4 py-3">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Dilihat
                            </dt>
                            <dd className="text-base font-semibold text-slate-900">
                                {course.views.toLocaleString('id-ID')}
                            </dd>
                        </div>
                        <div className="flex flex-col rounded-2xl bg-slate-100/60 px-4 py-3">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Video
                            </dt>
                            <dd className="text-base font-semibold text-slate-900">{totalVideos}</dd>
                        </div>
                        <div className="flex flex-col rounded-2xl bg-slate-100/60 px-4 py-3">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Akses
                            </dt>
                            <dd className="text-base font-semibold text-slate-900">Seumur hidup</dd>
                        </div>
                        {course.category?.name ? (
                            <div className="flex flex-col rounded-2xl bg-slate-100/60 px-4 py-3">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Kategori
                                </dt>
                                <dd className="text-base font-semibold text-slate-900">
                                    {course.category.name}
                                </dd>
                            </div>
                        ) : null}
                    </dl>
                </div>

                {course.instructor ? (
                    <div className="flex items-center gap-4 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                        <Avatar className="size-16">
                            {course.instructor.avatar ? (
                                <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                            ) : null}
                            <AvatarFallback
                                className="text-base font-bold text-white"
                                style={{ background: 'linear-gradient(to right, #2547F9, #1e3fd4)' }}
                            >
                                {getInitials(course.instructor.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-base font-bold text-slate-900">{course.instructor.name}</span>
                            <span className="text-xs text-slate-500 sm:text-sm">Mentor & fasilitator kelas</span>
                        </div>
                    </div>
                ) : null}
            </motion.aside>
        </div>
    );
}

interface CourseDetailSectionsProps {
    course: Course;
    benefits: string[];
    sections: CourseSection[];
    totalVideos: number;
    shouldLimitPreview: boolean;
    previewLimit: number;
    openPreview: (video: CourseVideo) => void;
    tabItems: Array<{
        value: string;
        label: string;
        helper: string;
        icon: ComponentType<{ className?: string }>;
    }>;
    reviews: CourseReview[];
    averageRating: number;
    ratingBuckets: number[];
    reviewsCount: number;
    reviewsCountLabel: string;
    relatedCourses: Course[];
    getInitials: (value?: string | null) => string;
}

function CourseDetailSections({
    course,
    benefits,
    sections,
    totalVideos,
    shouldLimitPreview,
    previewLimit,
    openPreview,
    tabItems,
    reviews,
    averageRating,
    ratingBuckets,
    reviewsCount,
    reviewsCountLabel,
    relatedCourses,
    getInitials,
}: CourseDetailSectionsProps) {
    let unlockedCounter = 0;
    return (
        <section className="space-y-12">
            <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm backdrop-blur-sm sm:p-10"
            >
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Tentang kelas ini</h2>
                <div
                    className="prose prose-slate mt-6 max-w-none text-slate-600 sm:prose-lg"
                    dangerouslySetInnerHTML={{ __html: course.body ?? '' }}
                />
            </motion.article>

            {benefits.length ? (
                <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Manfaat yang kamu dapatkan
                    </h2>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {benefits.map((benefit, index) => (
                            <motion.li
                                key={benefit}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.35 }}
                                className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-5 text-sm leading-relaxed text-slate-700 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                                <span>{benefit}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.article>
            ) : null}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8"
            >
                <Tabs defaultValue="curriculum" className="flex flex-col gap-16">
                    <TabsList className="mb-4 grid w-full grid-cols-2 gap-3 rounded-3xl bg-transparent sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {tabItems.map(({ value, label, helper, icon: Icon }) => (
                            <TabsTrigger
                                key={value}
                                value={value}
                                className="group relative flex w-full min-w-0 flex-1 items-start gap-3 rounded-2xl border border-transparent bg-white px-3 py-4 text-left text-xs font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/60 hover:text-slate-900 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]/30 sm:gap-4 sm:px-6 sm:py-5 sm:text-sm data-[state=active]:border-[#2547F9] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#2547F9]/10 data-[state=active]:to-[#1e3fd4]/10 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg"
                            >
                                <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#2547F9] transition group-data-[state=active]:bg-[#2547F9] group-data-[state=active]:text-white sm:size-11">
                                    <Icon className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />
                                </span>
                                <span className="flex min-w-0 flex-col">
                                    <span className="truncate text-xs font-semibold sm:text-sm">
                                        {label}
                                    </span>
                                    <span className="truncate text-[11px] text-slate-400 transition group-data-[state=active]:text-slate-600 sm:text-xs">
                                        {helper}
                                    </span>
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="mt-10 sm:mt-20" />

                    <TabsContent value="curriculum" className="mt-0">
                        {sections.length ? (
                            <div className="space-y-4">
                                {shouldLimitPreview ? (
                                    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white px-6 py-4 text-sm text-amber-700 shadow-sm">
                                        <Info className="mt-0.5 h-5 w-5 shrink-0" />
                                        <p>
                                            Kamu belum terdaftar di kelas ini. {previewLimit} video bisa dipratinjau
                                            sebelum membeli kelas.
                                        </p>
                                    </div>
                                ) : null}

                                <Accordion type="single" collapsible className="space-y-3">
                                    {sections.map((section) => (
                                        <AccordionItem
                                            key={section.id}
                                            value={`section-${section.id}`}
                                            className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                                        >
                                            <AccordionTrigger className="px-6 py-4 text-left text-base font-semibold text-slate-900 transition group-data-[state=open]:bg-slate-50/80">
                                                {section.title}
                                            </AccordionTrigger>
                                            <AccordionContent className="space-y-3 bg-slate-50/80 px-6 py-4">
                                                {(Array.isArray(section.videos) ? section.videos : []).map((video) => {
                                                    const isLocked =
                                                        shouldLimitPreview && unlockedCounter >= previewLimit;

                                                    if (!isLocked) {
                                                        unlockedCounter += 1;
                                                    }

                                                    return (
                                                        <button
                                                            key={video.id ?? video.title}
                                                            type="button"
                                                            onClick={() => {
                                                                if (!isLocked) {
                                                                    openPreview(video);
                                                                }
                                                            }}
                                                            disabled={isLocked}
                                                            className={`flex w-full flex-col gap-1 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-left text-sm shadow-sm transition ${
                                                                isLocked
                                                                    ? 'cursor-not-allowed opacity-60'
                                                                    : 'text-slate-600 hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                                                            }`}
                                                        >
                                                            <span className="flex items-center justify-between text-slate-900">
                                                                <span className="font-semibold">{video.title}</span>
                                                                {isLocked ? (
                                                                    <Lock className="h-4 w-4 text-slate-400" />
                                                                ) : null}
                                                            </span>
                                                            <span className="text-xs text-slate-500">
                                                                {isLocked
                                                                    ? 'Beli kelas untuk membuka video ini'
                                                                    : 'Klik untuk melihat pratinjau'}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ) : (
                            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                                Belum ada kurikulum tersedia
                            </p>
                        )}
                    </TabsContent>

                    <TabsContent value="info" className="mt-4">
                        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm sm:p-8">
                            <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                                {course.type?.name ? (
                                    <div className="flex flex-col rounded-2xl bg-slate-100/60 px-4 py-3">
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Tipe kelas
                                        </dt>
                                        <dd className="text-base font-semibold text-slate-900">{course.type.name}</dd>
                                    </div>
                                ) : null}
                                {course.level?.name ? (
                                    <div className="flex flex-col rounded-2xl bg-slate-100/60 px-4 py-3">
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Level
                                        </dt>
                                        <dd className="text-base font-semibold text-slate-900">{course.level.name}</dd>
                                    </div>
                                ) : null}
                                {course.category?.name ? (
                                    <div className="flex flex-col rounded-2xl bg-slate-100/60 px-4 py-3">
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Kategori
                                        </dt>
                                        <dd className="text-base font-semibold text-slate-900">{course.category.name}</dd>
                                    </div>
                                ) : null}
                                <div className="flex flex-col rounded-2xl bg-slate-100/60 px-4 py-3">
                                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Video materi
                                    </dt>
                                    <dd className="text-base font-semibold text-slate-900">{totalVideos} video</dd>
                                </div>
                            </dl>
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-4">
                        {reviews.length ? (
                            <div className="space-y-6">
                                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                                    <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm sm:p-8">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Rating rata-rata
                                        </p>
                                        <div className="mt-4 flex items-end gap-3">
                                            <span className="text-4xl font-bold text-slate-900 sm:text-5xl">
                                                {averageRating.toFixed(1)}
                                            </span>
                                            <div className="flex gap-1">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <Star
                                                        key={`avg-rating-${index}`}
                                                        className={`h-5 w-5 ${
                                                            index < Math.round(averageRating)
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'fill-slate-200 text-slate-200'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="mt-3 text-sm text-slate-500">
                                            Berdasarkan {reviewsCountLabel} ulasan peserta.
                                        </p>
                                    </div>
                                    <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm sm:p-8">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Distribusi rating
                                        </p>
                                        <div className="mt-4 space-y-3">
                                            {[5, 4, 3, 2, 1].map((rating) => {
                                                const index = rating - 1;
                                                const count = ratingBuckets[index] ?? 0;
                                                const percent = reviewsCount
                                                    ? Math.round((count / reviewsCount) * 100)
                                                    : 0;

                                                return (
                                                    <div key={`rating-${rating}`} className="flex items-center gap-3 text-sm">
                                                        <span className="w-7 font-semibold text-slate-700">{rating}★</span>
                                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-[#2547F9] to-[#1e3fd4] transition-all"
                                                                style={{ width: `${percent}%` }}
                                                            />
                                                        </div>
                                                        <span className="w-10 text-right text-xs text-slate-500">
                                                            {percent}%
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {reviews.map((review) => {
                                        const author = review.user ?? review.author ?? {};
                                        const displayName = author?.name ?? 'Peserta';
                                        const avatarUrl = author?.avatar ?? null;
                                        const reviewDate = formatReviewDate(review.createdAt ?? review.created_at);
                                        const ratingValue = Number.isFinite(review.rating)
                                            ? Math.max(0, Math.min(5, Math.round(review.rating)))
                                            : 0;

                                        return (
                                            <article
                                                key={review.id}
                                                className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <Avatar className="size-12">
                                                        {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
                                                        <AvatarFallback
                                                            className="text-sm font-semibold text-white"
                                                            style={{ background: 'linear-gradient(to right, #2547F9, #1e3fd4)' }}
                                                        >
                                                            {getInitials(displayName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="font-semibold text-slate-900">{displayName}</span>
                                                            <div className="ml-2 flex items-center gap-1">
                                                                {Array.from({ length: 5 }).map((_, index) => (
                                                                    <Star
                                                                        key={`review-${review.id}-star-${index}`}
                                                                        className={`h-4 w-4 ${
                                                                            index < ratingValue
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'fill-slate-200 text-slate-200'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            {reviewDate ? (
                                                                <span className="text-xs text-slate-400">• {reviewDate}</span>
                                                            ) : null}
                                                        </div>
                                                        {review.comment ? (
                                                            <p className="text-sm leading-relaxed text-slate-600">
                                                                {review.comment}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                                Belum ada ulasan peserta
                            </p>
                        )}
                    </TabsContent>

                    <TabsContent value="related" className="mt-4">
                        {relatedCourses.length ? (
                            <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm sm:p-8">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {relatedCourses.slice(0, 6).map((related) => (
                                        <CourseCard key={related.id} course={related} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                                Belum ada kelas terkait
                            </p>
                        )}
                    </TabsContent>
                </Tabs>
            </motion.div>
        </section>
    );
}
