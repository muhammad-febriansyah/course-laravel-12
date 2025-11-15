import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import type { Course } from '@/types/course';
import { Link } from '@inertiajs/react';
import { ArrowRight, Eye, Layers } from 'lucide-react';

interface CourseCardProps {
    course: Course;
    showCategory?: boolean;
}

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const getInitials = (value?: string | null) => {
    if (!value) return 'IN';
    const parts = value.trim().split(' ');
    const initials = parts.slice(0, 2).map((part) => part.charAt(0));
    return initials.join('').toUpperCase();
};

export function CourseCard({ course, showCategory = true }: CourseCardProps) {
    const discountNominal = Math.max(course.discount ?? 0, 0);
    const hasDiscount = discountNominal > 0 && discountNominal < course.price;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="flex flex-1 flex-col gap-4 p-5 sm:gap-5 sm:p-6">
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                    <Link
                        href={`/courses/${course.slug}`}
                        prefetch
                        className="block"
                    >
                        <div className="aspect-[16/9] overflow-hidden rounded-[18px]">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    </Link>

                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,71,249,0.2),_transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                        {showCategory && course.category ? (
                            <Badge className="rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700 shadow-sm">
                                {course.category.name}
                            </Badge>
                        ) : null}
                        {hasDiscount ? (
                            <Badge
                                className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #2547F9 0%, #1e3fd4 100%)',
                                }}
                            >
                                -{Math.round((discountNominal / course.price) * 100)}%
                            </Badge>
                        ) : null}
                    </div>

                    <div className="absolute bottom-4 right-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow">
                            <Eye className="h-3.5 w-3.5 text-blue-600" />
                            {course.views.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Link href={`/courses/${course.slug}`} prefetch>
                        <h3 className="line-clamp-2 min-h-[3rem] text-base font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-blue-600 sm:text-lg">
                            {course.title}
                        </h3>
                    </Link>
                    <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                        {course.shortDescription}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {course.type?.name ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
                            <SparklesIcon />
                            {course.type.name}
                        </span>
                    ) : null}
                    {course.level?.name ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
                            <Layers className="h-3.5 w-3.5 text-blue-500" />
                            {course.level.name}
                        </span>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-xl font-bold text-slate-900 sm:text-2xl">
                                {currency.format(course.finalPrice)}
                            </span>
                            {hasDiscount ? (
                                <span className="text-xs font-medium text-slate-400 line-through sm:text-sm">
                                    {currency.format(course.price)}
                                </span>
                            ) : null}
                        </div>
                        {hasDiscount ? (
                            <span className="inline-flex w-fit items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                Hemat {currency.format(discountNominal)}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    {course.instructor ? (
                        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                            <Avatar className="size-10 shrink-0">
                                {course.instructor.avatar ? (
                                    <AvatarImage
                                        src={course.instructor.avatar}
                                        alt={course.instructor.name}
                                    />
                                ) : null}
                                <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                                    {getInitials(course.instructor.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-slate-900">
                                    {course.instructor.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Instruktur Expert
                                </p>
                            </div>
                        </div>
                    ) : null}

                    <Button
                        asChild
                        size="lg"
                        className="group/btn h-11 w-full rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                        style={{
                            background:
                                'linear-gradient(135deg, #2547F9 0%, #1e3fd4 100%)',
                            boxShadow:
                                '0 12px 18px -8px rgba(37, 71, 249, 0.45), 0 6px 10px -6px rgba(30, 63, 212, 0.25)',
                        }}
                    >
                        <Link
                            href={`/courses/${course.slug}`}
                            prefetch
                            className="inline-flex items-center justify-center gap-2"
                        >
                            Lihat Detail Kelas
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </article>
    );
}

function SparklesIcon() {
    return (
        <svg
            className="h-3.5 w-3.5 text-blue-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M10 2.5c.3 0 .57.18.68.46l1.2 3.05a1 1 0 0 0 .59.59l3.05 1.2a.75.75 0 0 1 0 1.4l-3.05 1.2a1 1 0 0 0-.59.59l-1.2 3.05a.75.75 0 0 1-1.4 0l-1.2-3.05a1 1 0 0 0-.59-.59l-3.05-1.2a.75.75 0 0 1 0-1.4l3.05-1.2a1 1 0 0 0 .59-.59l1.2-3.05A.75.75 0 0 1 10 2.5Zm6.5 10a.6.6 0 0 1 .54.36l.64 1.62a.5.5 0 0 0 .3.3l1.62.64a.6.6 0 0 1 0 1.12l-1.62.64a.5.5 0 0 0-.3.3l-.64 1.62a.6.6 0 0 1-1.12 0l-.64-1.62a.5.5 0 0 0-.3-.3l-1.62-.64a.6.6 0 0 1 0-1.12l1.62-.64a.5.5 0 0 0 .3-.3l.64-1.62a.6.6 0 0 1 .54-.36Z" />
        </svg>
    );
}
