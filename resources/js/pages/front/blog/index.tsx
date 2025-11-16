import { PageHeader } from '@/components/site/page-header';
import HomeLayout from '@/layouts/home-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowUpRight, Calendar, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string | null;
    value?: string;
}

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    desc?: string | null;
    image?: string | null;
    published_at?: string | null;
    category?: {
        id: number;
        name: string;
        slug: string | null;
    } | null;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface PaginatedNews {
    data: NewsItem[];
    meta: PaginationMeta;
}

interface Filters {
    search?: string | null;
    category?: string | null;
}

interface Props {
    news?: PaginatedNews;
    categories?: Category[];
    filters?: Filters;
}

type PageItem = number | 'ellipsis';

const EMPTY_NEWS: PaginatedNews = {
    data: [],
    meta: {
        current_page: 1,
        last_page: 1,
        per_page: 6,
        total: 0,
        from: null,
        to: null,
    },
};

const formatDate = (value?: string | null) => {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

function CategoryButton({
    label,
    isActive,
    onClick,
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition ${
                isActive
                    ? 'border-blue-600 bg-blue-600 text-white shadow-blue-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/80 hover:text-blue-600'
            }`}
        >
            {label}
        </button>
    );
}

export default function BlogIndex({
    news,
    categories,
    filters,
}: Props) {
    const paginatedNews =
        news && news.meta && news.data ? news : EMPTY_NEWS;
    const categoryList = categories ?? [];
    const resolvedFilters: Filters = filters ?? {};

    const [searchQuery, setSearchQuery] = useState(
        resolvedFilters.search ?? '',
    );
    const [activeCategory, setActiveCategory] = useState<string>(
        resolvedFilters.category ?? 'all',
    );

    useEffect(() => {
        setSearchQuery(resolvedFilters.search ?? '');
    }, [resolvedFilters.search]);

    useEffect(() => {
        setActiveCategory(resolvedFilters.category ?? 'all');
    }, [resolvedFilters.category]);

    const categoryOptions = useMemo(
        () =>
            categoryList.map((category) => ({
                value:
                    category.value ??
                    category.slug ??
                    String(category.id),
                label: category.name,
            })),
        [categoryList],
    );

    const hasPosts = paginatedNews.data.length > 0;
    const featuredPost = hasPosts ? paginatedNews.data[0] : null;
    const otherPosts = hasPosts ? paginatedNews.data.slice(1) : [];
    const featuredDate = featuredPost
        ? formatDate(featuredPost.published_at)
        : '';
    const totalResults = paginatedNews.meta.total;

    const pageItems = useMemo<PageItem[]>(() => {
        const totalPages = paginatedNews.meta.last_page;
        const currentPage = paginatedNews.meta.current_page;

        if (totalPages <= 7) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1,
            ) as PageItem[];
        }

        const items: PageItem[] = [1];
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        if (start > 2) {
            items.push('ellipsis');
        }

        for (let page = start; page <= end; page += 1) {
            items.push(page);
        }

        if (end < totalPages - 1) {
            items.push('ellipsis');
        }

        items.push(totalPages);

        return items;
    }, [paginatedNews.meta.current_page, paginatedNews.meta.last_page]);

    const navigateWithFilters = ({
        search,
        category,
        page,
    }: {
        search?: string | null;
        category?: string | null;
        page?: number | null;
    }) => {
        const params: Record<string, unknown> = {};
        const resolvedSearch =
            search !== undefined ? search : searchQuery.trim();
        const resolvedCategory =
            category !== undefined
                ? category
                : activeCategory !== 'all'
                ? activeCategory
                : null;
        const resolvedPage = page ?? undefined;

        if (resolvedSearch && resolvedSearch.length > 0) {
            params.search = resolvedSearch;
        }

        if (resolvedCategory && resolvedCategory.length > 0) {
            params.category = resolvedCategory;
        }

        if (resolvedPage && resolvedPage > 1) {
            params.page = resolvedPage;
        }

        router.get('/blog', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onSuccess: () => {
                if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            },
        });
    };

    const handleCategoryChange = (value: string) => {
        setActiveCategory(value);
        navigateWithFilters({
            category: value === 'all' ? null : value,
            page: 1,
        });
    };

    const handleSearchSubmit = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        const trimmed = searchQuery.trim();
        setSearchQuery(trimmed);
        navigateWithFilters({
            search: trimmed.length > 0 ? trimmed : null,
            page: 1,
        });
    };

    const handleResetSearch = () => {
        setSearchQuery('');
        navigateWithFilters({
            search: null,
            page: 1,
        });
    };

    const handlePageChange = (page: number) => {
        if (
            page < 1 ||
            page > paginatedNews.meta.last_page ||
            page === paginatedNews.meta.current_page
        ) {
            return;
        }

        navigateWithFilters({ page });
    };

    const buildPostHref = (slug?: string) =>
        slug && slug.trim().length > 0 ? `/blog/${slug}` : '#';

    const showingRange =
        paginatedNews.meta.total > 0 &&
        paginatedNews.meta.from !== null &&
        paginatedNews.meta.to !== null
            ? `Menampilkan ${paginatedNews.meta.from}–${paginatedNews.meta.to} dari ${paginatedNews.meta.total} artikel`
            : null;

    return (
        <HomeLayout>
            <Head title="Blog" />
            <PageHeader
                title="Blog"
                description="Berita dan artikel terbaru dari kami."
            />

            <main className="-mt-12 bg-gradient-to-b from-slate-100 via-slate-50 to-white pb-20 pt-[4.5rem] sm:-mt-16 sm:pb-24 sm:pt-24">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <section className="mx-auto w-full max-w-6xl rounded-[32px] bg-white/95 p-6 shadow-xl backdrop-blur ring-1 ring-slate-100/80 sm:p-8 lg:p-12">
                        <div className="flex flex-col gap-6 border-b border-slate-100 pb-8">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
                                        Jelajahi Artikel Terbaru
                                    </h2>
                                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-relaxed">
                                        Temukan kumpulan berita, cerita, dan
                                        tips terbaru untuk mendukung perjalanan
                                        belajar Anda.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end"
                                >
                                    <div className="relative w-full sm:w-80">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            value={searchQuery}
                                            onChange={(event) =>
                                                setSearchQuery(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Cari artikel..."
                                            className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm transition focus-visible:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            className="h-11 rounded-xl"
                                        >
                                            Cari
                                        </Button>
                                        {(searchQuery.length > 0 ||
                                            resolvedFilters.search) && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-11 rounded-xl"
                                                onClick={handleResetSearch}
                                            >
                                                Reset
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {categoryOptions.length > 0 && (
                                <div className="flex w-full items-center gap-2 overflow-x-auto pb-1">
                                    <CategoryButton
                                        label="Semua"
                                        isActive={activeCategory === 'all'}
                                        onClick={() =>
                                            handleCategoryChange('all')
                                        }
                                    />
                                    {categoryOptions.map((category) => (
                                        <CategoryButton
                                            key={category.value}
                                            label={category.label}
                                            isActive={
                                                activeCategory ===
                                                category.value
                                            }
                                            onClick={() =>
                                                handleCategoryChange(
                                                    category.value,
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            {(resolvedFilters.search ||
                                showingRange ||
                                totalResults > 0) && (
                                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                    {totalResults > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full bg-blue-50 px-3 py-1 text-blue-700"
                                        >
                                            {totalResults} artikel tersedia
                                        </Badge>
                                    )}
                                    {resolvedFilters.search && (
                                        <Badge
                                            variant="outline"
                                            className="rounded-full border-blue-200 px-3 py-1 text-blue-600"
                                        >
                                            Kata kunci: “{resolvedFilters.search}”
                                        </Badge>
                                    )}
                                    {showingRange && (
                                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 shadow-sm">
                                            {showingRange}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {hasPosts && featuredPost ? (
                            <article className="group relative mt-10 min-h-[26rem] overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl ring-1 ring-slate-900/20 sm:min-h-[32rem] lg:min-h-[36rem]">
                                <div className="absolute inset-0">
                                    {featuredPost.image ? (
                                        <img
                                            src={featuredPost.image}
                                            alt={featuredPost.title}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-blue-700 via-blue-500 to-slate-900" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/80 to-slate-900/30" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-transparent" />
                                </div>

                                <div className="relative flex h-full flex-col justify-end p-10 pt-20 sm:p-12 sm:pt-24 lg:px-16 lg:pb-16">
                                    <div className="mb-4 inline-flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-blue-100">
                                        {featuredPost.category?.name && (
                                            <span className="rounded-full bg-white/15 px-4 py-1 text-xs font-medium text-white shadow-sm shadow-black/20">
                                                {featuredPost.category.name}
                                            </span>
                                        )}
                                        {featuredDate && (
                                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-blue-100/80">
                                                {featuredDate}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                                        {featuredPost.title}
                                    </h3>
                                    {featuredPost.desc && (
                                        <p className="mt-5 max-w-3xl text-base leading-relaxed text-blue-100/90 sm:text-lg sm:leading-relaxed">
                                            {featuredPost.desc}
                                        </p>
                                    )}
                                    <Link
                                        href={buildPostHref(featuredPost.slug)}
                                        className="mt-8 inline-flex w-auto items-center gap-2 self-start rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-blue-100 transition hover:bg-white/25 hover:text-white sm:text-sm"
                                    >
                                        Baca selengkapnya
                                        <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </article>
                        ) : (
                            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-16 text-center">
                                <p className="text-lg font-semibold text-slate-900">
                                    {resolvedFilters.search
                                        ? 'Pencarian tidak ditemukan'
                                        : 'Belum ada artikel untuk kategori ini.'}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    {resolvedFilters.search
                                        ? 'Coba gunakan kata kunci lain atau hapus filter pencarian.'
                                        : 'Silakan kembali lagi nanti untuk mendapatkan pembaruan terbaru.'}
                                </p>
                                {resolvedFilters.search && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-6 rounded-full"
                                        onClick={handleResetSearch}
                                    >
                                        Hapus pencarian
                                    </Button>
                                )}
                            </div>
                        )}
                    </section>

                    {hasPosts && otherPosts.length > 0 && (
                        <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                            {otherPosts.map((item) => {
                                const formattedDate = formatDate(
                                    item.published_at,
                                );

                                return (
                                    <article
                                        key={item.id}
                                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl"
                                    >
                                        {item.image && (
                                            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-1 flex-col p-6">
                                            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                                                {item.category?.name && (
                                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600 shadow-inner shadow-blue-100">
                                                        {item.category.name}
                                                    </span>
                                                )}
                                                {formattedDate && (
                                                    <span className="flex items-center gap-2 text-slate-400">
                                                        <Calendar className="h-4 w-4" />
                                                        {formattedDate}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {item.title}
                                            </h3>
                                            {item.desc && (
                                                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                                                    {item.desc}
                                                </p>
                                            )}
                                            <Link
                                                href={buildPostHref(item.slug)}
                                                className="mt-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50/60 hover:text-blue-700"
                                            >
                                                Baca selengkapnya
                                                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {paginatedNews.meta.last_page > 1 && (
                        <nav className="mx-auto mt-12 flex max-w-6xl justify-center">
                            <div className="flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-lg ring-1 ring-slate-200 backdrop-blur">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    disabled={paginatedNews.meta.current_page === 1}
                                    onClick={() =>
                                        handlePageChange(
                                            paginatedNews.meta.current_page - 1,
                                        )
                                    }
                                >
                                    Sebelumnya
                                </Button>
                                <div className="flex items-center gap-2">
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
                                                className="rounded-full"
                                                variant={
                                                    item ===
                                                    paginatedNews.meta
                                                        .current_page
                                                        ? 'default'
                                                        : 'outline'
                                                }
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
                                    className="rounded-full"
                                    disabled={
                                        paginatedNews.meta.current_page ===
                                        paginatedNews.meta.last_page
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            paginatedNews.meta.current_page + 1,
                                        )
                                    }
                                >
                                    Berikutnya
                                </Button>
                            </div>
                        </nav>
                    )}
                </div>
            </main>
        </HomeLayout>
    );
}
