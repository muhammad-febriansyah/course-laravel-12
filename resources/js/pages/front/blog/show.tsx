import HomeLayout from '@/layouts/home-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowUpRight,
    Calendar,
    Clock,
    Facebook,
    MessageCircle,
    Share2,
    Twitter,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string | null;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    desc?: string | null;
    body?: string | null;
    image?: string | null;
    published_at?: string | null;
    category?: Category | null;
}

interface Props {
    post: Post;
    related?: Post[];
}

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

const estimateReadingTime = (content?: string | null) => {
    if (!content) return null;

    const text = content
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (!text) return null;

    const words = text.split(' ').length;
    const wordsPerMinute = 200;
    const minutes = Math.max(1, Math.round(words / wordsPerMinute));
    return `${minutes} menit baca`;
};

export default function BlogShow({ post, related = [] }: Props) {
    const publishedAt = formatDate(post.published_at);
    const readingTime = estimateReadingTime(post.body);
    const [copied, setCopied] = useState(false);

    const shareUrl = useMemo(() => {
        if (typeof window !== 'undefined') {
            return window.location.href;
        }
        return `/blog/${post.slug}`;
    }, [post.slug]);

    const shareLinks = useMemo(
        () => [
            {
                label: 'WhatsApp',
                href: `https://wa.me/?text=${encodeURIComponent(`${post.title} - ${shareUrl}`)}`,
                icon: MessageCircle,
            },
            {
                label: 'Facebook',
                href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                icon: Facebook,
            },
            {
                label: 'Twitter',
                href: `https://twitter.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
                icon: Twitter,
            },
        ],
        [post.title, shareUrl],
    );

    const handleCopyLink = async () => {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                return;
            }
        } catch (error) {
            // fallback below
        }

        window.prompt('Salin tautan blog', shareUrl);
    };

    return (
        <HomeLayout>
            <Head title={post.title} />

            <article className="min-h-screen bg-slate-50">
                <div className="relative">
                    <div className="absolute inset-0">
                        {post.image ? (
                            <img
                                src={post.image}
                                alt={post.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-br from-blue-700 via-blue-500 to-indigo-700" />
                        )}
                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
                    </div>

                    <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
                        <Link
                            href="/blog"
                            className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 shadow-md shadow-slate-950/20 transition hover:bg-white/20"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Blog
                        </Link>
                        <div className="max-w-3xl space-y-6">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-100">
                                {post.category?.name && (
                                    <Badge className="rounded-full border border-white/30 bg-white/15 px-4 py-1 text-white">
                                        {post.category.name}
                                    </Badge>
                                )}
                                {publishedAt && (
                                    <Badge className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-blue-100/90">
                                        <Calendar className="h-4 w-4" />
                                        {publishedAt}
                                    </Badge>
                                )}
                                {readingTime && (
                                    <Badge className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-blue-100/90">
                                        <Clock className="h-4 w-4" />
                                        {readingTime}
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                                {post.title}
                            </h1>

                            {post.desc && (
                                <p className="max-w-2xl text-base leading-relaxed text-blue-100 sm:text-lg">
                                    {post.desc}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative -mt-16 pb-24">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
                            <div className="space-y-8">
                                <div className="overflow-hidden rounded-[32px] bg-white/95 shadow-2xl ring-1 ring-slate-100">
                                    {post.image && (
                                        <div className="relative h-72 w-full overflow-hidden bg-slate-100 sm:h-96">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="prose prose-slate mx-auto max-w-none px-6 py-10 prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-blockquote:border-blue-200 prose-blockquote:text-slate-600 prose-img:rounded-xl sm:px-10 lg:px-16">
                                        {post.body ? (
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: post.body,
                                                }}
                                            />
                                        ) : (
                                            <p className="text-slate-600">
                                                Konten artikel belum tersedia.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-blue-50/70 to-white/90 p-6 shadow-inner">
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Tetap Terhubung
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Dapatkan artikel terbaru langsung ke email Anda setiap minggu, lengkap dengan tips dan wawasan eksklusif.
                                    </p>
                                    <form className="mt-4 flex flex-col gap-3 sm:flex-row">
                                        <input
                                            type="email"
                                            placeholder="Masukkan email Anda"
                                            className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        />
                                        <Button
                                            type="button"
                                            className="h-11 rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600/90"
                                        >
                                            Langganan
                                        </Button>
                                    </form>
                                    <p className="mt-2 text-xs text-slate-500">
                                        Dengan berlangganan, Anda menyetujui kebijakan privasi kami.
                                    </p>
                                </div>
                            </div>

                            <aside className="mt-10 flex flex-col gap-6 lg:mt-0">
                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                        Informasi Artikel
                                    </h3>
                                    <dl className="mt-4 space-y-3 text-sm text-slate-600">
                                        {post.category?.name && (
                                            <div className="flex items-center justify-between rounded-xl bg-blue-50/70 px-4 py-3">
                                                <dt className="font-medium text-blue-700">
                                                    Kategori
                                                </dt>
                                                <dd className="text-blue-600">
                                                    {post.category.name}
                                                </dd>
                                            </div>
                                        )}
                                        {publishedAt && (
                                            <div className="flex items-center justify-between px-4">
                                                <dt>Tanggal terbit</dt>
                                                <dd className="font-medium text-slate-800">
                                                    {publishedAt}
                                                </dd>
                                            </div>
                                        )}
                                        {readingTime && (
                                            <div className="flex items-center justify-between px-4">
                                                <dt>Durasi baca</dt>
                                                <dd className="font-medium text-slate-800">
                                                    {readingTime}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-md">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                            Bagikan artikel ini
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            Sebarkan informasi bermanfaat ini ke teman dan rekan Anda.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-center rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
                                        onClick={handleCopyLink}
                                    >
                                        <Share2 className="mr-2 h-4 w-4" />
                                        {copied ? 'Tautan disalin' : 'Salin tautan'}
                                    </Button>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {shareLinks.map(({ label, href, icon: Icon }) => (
                                            <a
                                                key={label}
                                                href={href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-200 hover:bg-blue-100"
                                            >
                                                <Icon className="h-4 w-4" />
                                                {label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </div>

                        {related.length > 0 && (
                            <div className="mt-20 rounded-[32px] border border-slate-200 bg-gradient-to-br from-blue-50/70 to-white/90 p-8 shadow-inner">
                                <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-slate-900">
                                            Artikel Rekomendasi
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            Pilihan lain yang mungkin menarik untuk Anda jelajahi.
                                        </p>
                                    </div>
                                    <Link
                                        href="/blog"
                                        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
                                    >
                                        Lihat semua artikel
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {related.map((item) => {
                                        const date = formatDate(item.published_at);

                                        return (
                                            <article
                                                key={item.id}
                                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100/60 bg-white/95 shadow-lg transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl"
                                            >
                                                {item.image && (
                                                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
                                                    </div>
                                                )}
                                                <div className="flex flex-1 flex-col p-6">
                                                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                                                        {item.category?.name && (
                                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                                                                {item.category?.name}
                                                            </span>
                                                        )}
                                                        {date && (
                                                            <span className="inline-flex items-center gap-2 text-slate-400">
                                                                <Calendar className="h-4 w-4" />
                                                                {date}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                        {item.title}
                                                    </h3>
                                                    {item.desc && (
                                                        <p className="mt-3 flex-1 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                                            {item.desc}
                                                        </p>
                                                    )}
                                                    <Link
                                                        href={`/blog/${item.slug}`}
                                                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition group-hover:gap-3"
                                                    >
                                                        Baca selengkapnya
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </HomeLayout>
    );
}
