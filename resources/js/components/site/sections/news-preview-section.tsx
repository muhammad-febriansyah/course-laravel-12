import { motion } from 'framer-motion';
import { ArrowRight, CalendarFold, Clock, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

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
        slug?: string | null;
    } | null;
}

interface NewsPreviewSectionProps {
    news: NewsItem[];
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

export function NewsPreviewSection({ news }: NewsPreviewSectionProps) {
    if (!news || news.length === 0) {
        return null;
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 lg:py-28">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-4 top-1/3 h-96 w-96 rounded-full bg-blue-400/5 blur-3xl" />
                <div className="absolute -right-4 bottom-1/3 h-96 w-96 rounded-full bg-purple-400/5 blur-3xl" />
            </div>

            <div className="relative mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 flex flex-col gap-6 text-center lg:mb-16 lg:flex-row lg:items-center lg:justify-between lg:text-left"
                >
                    <div className="flex-1 space-y-4">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex"
                        >
                            <Badge className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg" style={{ background: 'linear-gradient(to right, #2547F9, #1e3fd4)', boxShadow: '0 10px 15px -3px rgba(37, 71, 249, 0.3), 0 4px 6px -2px rgba(37, 71, 249, 0.05)' }}>
                                <Sparkles className="h-3.5 w-3.5" />
                                Blog & Berita
                            </Badge>
                        </motion.div>

                        {/* Title */}
                        <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Insight & cerita terbaru{' '}
                            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #2547F9, #1e3fd4)' }}>
                                dari kami
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 lg:mx-0 lg:text-lg">
                            Dapatkan informasi terbaru seputar dunia pembelajaran, teknologi, dan karier.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Button
                            asChild
                            size="lg"
                            className="group h-12 rounded-full px-8 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                            style={{
                                background: 'linear-gradient(to right, #2547F9, #1e3fd4)',
                                boxShadow: '0 10px 15px -3px rgba(37, 71, 249, 0.3), 0 4px 6px -2px rgba(37, 71, 249, 0.05)'
                            }}
                        >
                            <Link href="/blog" className="inline-flex items-center gap-2">
                                Lihat Semua Artikel
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* News Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {news.map((item, index) => (
                        <motion.article
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: "easeOut"
                            }}
                            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            {/* Image Section */}
                            {item.image && (
                                <a
                                    href={`/blog/${item.slug}`}
                                    className="relative block aspect-video overflow-hidden"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                                    {/* Category Badge */}
                                    {item.category?.name && (
                                        <Badge className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-sm" style={{ color: '#2547F9' }}>
                                            {item.category.name}
                                        </Badge>
                                    )}

                                    {/* Gradient Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                </a>
                            )}

                            {/* Content Section */}
                            <div className="relative flex flex-1 flex-col gap-4 p-6">
                                {/* Date Badge */}
                                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formatDate(item.published_at)}
                                </div>

                                {/* Title */}
                                <a href={`/blog/${item.slug}`}>
                                    <h3 className="line-clamp-2 text-xl font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-[#2547F9]">
                                        {item.title}
                                    </h3>
                                </a>

                                {/* Description */}
                                {item.desc && (
                                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                                        {item.desc}
                                    </p>
                                )}

                                {/* Spacer */}
                                <div className="flex-1" />

                                {/* Divider */}
                                <div className="h-px bg-slate-200" />

                                {/* Read More Button */}
                                <Button
                                    asChild
                                    size="lg"
                                    className="group/btn h-11 w-full rounded-2xl text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                                    style={{
                                        background: 'linear-gradient(to right, #2547F9, #1e3fd4)',
                                        boxShadow: '0 10px 15px -3px rgba(37, 71, 249, 0.3), 0 4px 6px -2px rgba(37, 71, 249, 0.05)'
                                    }}
                                >
                                    <a href={`/blog/${item.slug}`} className="inline-flex items-center justify-center gap-2">
                                        Baca Artikel
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                    </a>
                                </Button>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
