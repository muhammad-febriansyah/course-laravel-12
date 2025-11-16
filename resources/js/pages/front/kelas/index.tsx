import { PageHeader } from '@/components/site/page-header';
import { CourseCard } from '@/components/site/course-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HomeLayout from '@/layouts/home-layout';
import type { Course } from '@/types/course';
import { Link, router, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Layers, Search, Sparkles, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Filters {
    search?: string | null;
}

interface CoursesPagination {
    data: Course[];
    meta: PaginationMeta;
}

interface Props {
    courses: CoursesPagination;
    filters: Filters;
}

type PageItem = number | 'ellipsis';

const createPageItems = (current: number, last: number): PageItem[] => {
    if (last <= 5) {
        return Array.from({ length: last }, (_, index) => index + 1);
    }

    const items: PageItem[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    if (start > 2) {
        items.push('ellipsis');
    }

    for (let page = start; page <= end; page += 1) {
        items.push(page);
    }

    if (end < last - 1) {
        items.push('ellipsis');
    }

    items.push(last);

    return items;
};

const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('id-ID');

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatNumber = (value: number) => numberFormatter.format(value);

type HeroStat = {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
};

export default function CoursesIndex() {
    const { courses, filters } = usePage<Props>().props;

    const [searchTerm, setSearchTerm] = useState(filters.search ?? '');

    const pageItems = useMemo(
        () =>
            createPageItems(
                courses.meta.current_page,
                courses.meta.last_page,
            ),
        [courses.meta.current_page, courses.meta.last_page],
    );

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const params: Record<string, unknown> = {};
        const trimmed = searchTerm.trim();

        if (trimmed.length > 0) {
            params.search = trimmed;
        }

        router.get('/kelas', params, {
            preserveScroll: true,
            replace: true,
        });
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        router.get('/kelas', {}, { preserveScroll: true, replace: true });
    };

    const handleQuickSearch = (keyword: string) => {
        const trimmed = keyword.trim();
        setSearchTerm(trimmed);

        const params: Record<string, unknown> = {};

        if (trimmed.length > 0) {
            params.search = trimmed;
        }

        router.get('/kelas', params, {
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePageChange = (page: number) => {
        if (
            page < 1 ||
            page > courses.meta.last_page ||
            page === courses.meta.current_page
        ) {
            return;
        }

        const params: Record<string, unknown> = {};
        const trimmed = searchTerm.trim();
        if (trimmed.length > 0) {
            params.search = trimmed;
        }

        params.page = page;

        router.get('/kelas', params, {
            preserveScroll: true,
            replace: true,
        });
    };

    const showingRange =
        courses.meta.total > 0 &&
        courses.meta.from !== null &&
        courses.meta.to !== null
            ? `Menampilkan ${courses.meta.from}–${courses.meta.to} dari ${courses.meta.total} kelas`
            : null;

    const featuredCourse = courses.data.length > 0 ? courses.data[0] : null;

    const heroStats: HeroStat[] = useMemo(() => {
        const instructorSet = new Set<string>();
        let discountedCount = 0;

        courses.data.forEach((course) => {
            if (course.instructor?.name) {
                instructorSet.add(course.instructor.name);
            }

            if (course.discount > 0) {
                discountedCount += 1;
            }
        });

        return [
            {
                label: 'Total kelas',
                value: formatNumber(courses.meta.total),
                description: 'Pilihan materi kurasi tim kami',
                icon: Layers,
            },
            {
                label: 'Mentor aktif',
                value: formatNumber(instructorSet.size),
                description: 'Profesional siap membimbingmu',
                icon: Users,
            },
            {
                label: 'Promo berjalan',
                value: formatNumber(discountedCount),
                description: 'Diskon spesial yang sedang berlangsung',
                icon: Sparkles,
            },
        ];
    }, [courses.data, courses.meta.total]);

    const popularCategories = useMemo(() => {
        const collected = new Map<string, string>();

        courses.data.forEach((course) => {
            const categoryName = course.category?.name;
            if (!categoryName) {
                return;
            }

            const key =
                course.category?.slug ??
                categoryName.trim().toLowerCase();

            if (!collected.has(key)) {
                collected.set(key, categoryName);
            }
        });

        return Array.from(collected.values()).slice(0, 6);
    }, [courses.data]);

    return (
        <HomeLayout>
            <PageHeader
                title="Koleksi Kelas Unggulan"
                description="Temukan kelas yang sesuai dengan tujuan belajar Anda. Kami menyiapkan materi berkualitas dengan mentor expert dan komunitas interaktif."
            />

            <main className="-mt-16 bg-white pb-24 pt-20 sm:-mt-24 sm:pt-28">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
                    <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="space-y-3">
                                    <span
                                        className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #2547F9 0%, #1e3fd4 100%)',
                                        }}
                                    >
                                        Telusuri katalog
                                    </span>
                                    <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                                        Temukan pembelajaran paling relevan untukmu
                                    </h2>
                                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                                        Gunakan kata kunci atau pilih kategori populer untuk menemukan kelas dengan mentor terbaik dan materi terstruktur.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-inner sm:flex-row sm:items-center sm:gap-3"
                                >
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            value={searchTerm}
                                            onChange={(event) =>
                                                setSearchTerm(event.target.value)
                                            }
                                            placeholder="Cari kelas, topik, atau mentor..."
                                            className="h-12 rounded-xl border-slate-200 pl-12 pr-4 text-sm shadow-sm focus-visible:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex gap-2 sm:w-auto">
                                        <Button
                                            type="submit"
                                            className="h-12 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600/90"
                                        >
                                            Cari kelas
                                        </Button>
                                        {(filters.search || searchTerm.length > 0) && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-12 rounded-xl border-blue-200 bg-blue-50/60 px-5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                                                onClick={handleResetSearch}
                                            >
                                                Reset
                                            </Button>
                                        )}
                                    </div>
                                </form>

                                {popularCategories.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                                            Pencarian cepat
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {popularCategories.map((category) => (
                                                <Button
                                                    key={category}
                                                    type="button"
                                                    variant="outline"
                                                    className="rounded-full border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                                                    onClick={() => handleQuickSearch(category)}
                                                >
                                                    {category}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                            <div className="flex h-full flex-col gap-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                                        Statistik katalog
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Data terkini membantu memilih kelas yang tepat.
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    {heroStats.map(({ label, value, description, icon: Icon }) => (
                                        <div
                                            key={label}
                                            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm"
                                        >
                                            <div
                                                className="flex size-10 items-center justify-center rounded-xl text-white"
                                                style={{
                                                    background: 'linear-gradient(135deg, #2547F9 0%, #1e3fd4 100%)',
                                                }}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                                                    {label}
                                                </span>
                                                <span className="text-xl font-semibold text-slate-900">
                                                    {value}
                                                </span>
                                                <p className="text-xs text-slate-500">{description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {featuredCourse ? (
                        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                            <div className="flex flex-col md:flex-row">
                                <div className="relative w-full md:w-1/2">
                                    <img
                                        src={featuredCourse.image}
                                        alt={featuredCourse.title}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                    <div
                                        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                                        style={{
                                            background: 'linear-gradient(180deg, rgba(37,71,249,0) 0%, rgba(30,63,212,0.65) 100%)',
                                        }}
                                    />
                                </div>
                                <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
                                    <span
                                        className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #2547F9 0%, #1e3fd4 100%)',
                                        }}
                                    >
                                        Rekomendasi editor
                                    </span>
                                    <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                                        {featuredCourse.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                                        {featuredCourse.shortDescription}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                        {featuredCourse.category?.name ? (
                                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                                                <Layers className="h-4 w-4 text-blue-500" />
                                                {featuredCourse.category.name}
                                            </span>
                                        ) : null}
                                        {featuredCourse.instructor?.name ? (
                                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                                                <Users className="h-4 w-4 text-blue-500" />
                                                {featuredCourse.instructor.name}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                                                Harga mulai
                                            </p>
                                            <div className="mt-1 flex items-baseline gap-2">
                                                <span className="text-2xl font-semibold text-slate-900">
                                                    {formatCurrency(featuredCourse.finalPrice)}
                                                </span>
                                                {featuredCourse.discount > 0 ? (
                                                    <span className="text-sm text-slate-400 line-through">
                                                        {formatCurrency(featuredCourse.price)}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <Button
                                            asChild
                                            className="h-11 rounded-xl px-6 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                                            style={{
                                                background: 'linear-gradient(135deg, #2547F9 0%, #1e3fd4 100%)',
                                            }}
                                        >
                                            <Link href={`/courses/${featuredCourse.slug}`} prefetch>
                                                Lihat detail kelas
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : null}

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-10">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                                    Semua kelas
                                </h2>
                                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                                    Jelajahi daftar lengkap kelas dan temukan materi yang paling sesuai.
                                </p>
                            </div>
                            {showingRange ? (
                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                                    {showingRange}
                                </span>
                            ) : null}
                        </div>

                        {(filters.search || showingRange) && (
                            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                {filters.search ? (
                                    <Badge className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-blue-600">
                                        Hasil untuk “{filters.search}”
                                    </Badge>
                                ) : null}
                                {showingRange ? (
                                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                                        {showingRange}
                                    </span>
                                ) : null}
                            </div>
                        )}

                        {courses.data.length > 0 ? (
                            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {courses.data.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-blue-500/10">
                                    <Search className="h-6 w-6 text-blue-600" />
                                </div>
                                <p className="text-lg font-semibold text-slate-900">
                                    Belum ada kelas yang cocok.
                                </p>
                                <p className="mt-2 max-w-md text-sm text-slate-600">
                                    Coba gunakan kata kunci lain atau jelajahi{' '}
                                    <Link
                                        href="/blog"
                                        className="font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        insight terbaru kami
                                    </Link>
                                    .
                                </p>
                            </div>
                        )}

                        {courses.meta.last_page > 1 && (
                            <nav className="mt-12 flex justify-center px-2">
                                <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-2 shadow-md">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full px-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 disabled:text-slate-300"
                                        disabled={courses.meta.current_page === 1}
                                        onClick={() =>
                                            handlePageChange(
                                                courses.meta.current_page - 1,
                                            )
                                        }
                                    >
                                        Sebelumnya
                                    </Button>

                                    <div className="flex items-center gap-1.5">
                                        {pageItems.map((item, index) =>
                                            item === 'ellipsis' ? (
                                                <span
                                                    key={`ellipsis-${index}`}
                                                    className="px-2 text-sm text-slate-400"
                                                >
                                                    …
                                                </span>
                                            ) : (
                                                <Button
                                                    key={item}
                                                    type="button"
                                                    size="sm"
                                                    variant={
                                            item === courses.meta.current_page
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className={`rounded-full px-3 text-sm ${
                                            item === courses.meta.current_page
                                                ? ''
                                                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                                        }`}
                                                    onClick={() =>
                                                        handlePageChange(item)
                                                    }
                                                >
                                                    {item}
                                                </Button>
                                            ),
                                        )}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full px-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 disabled:text-slate-300"
                                        disabled={
                                            courses.meta.current_page ===
                                            courses.meta.last_page
                                        }
                                        onClick={() =>
                                            handlePageChange(
                                                courses.meta.current_page + 1,
                                            )
                                        }
                                    >
                                        Berikutnya
                                    </Button>
                                </div>
                            </nav>
                        )}
                    </section>
                </div>
            </main>
        </HomeLayout>
    );
}
