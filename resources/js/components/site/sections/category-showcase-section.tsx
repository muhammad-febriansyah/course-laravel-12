import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryHighlight {
    id: number;
    name: string;
    slug?: string | null;
    image?: string | null;
    courses_count: number;
}

interface CategoryShowcaseSectionProps {
    categories: CategoryHighlight[];
}

export function CategoryShowcaseSection({ categories }: CategoryShowcaseSectionProps) {
    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="bg-gradient-to-b from-blue-50/60 via-white to-white py-16 lg:py-24">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        Kategori pilihan
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                        Temukan materi sesuai minatmu
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 sm:text-base">
                        Jelajahi kategori terpopuler dengan koleksi kelas lengkap untuk mengembangkan skill kamu.
                    </p>
                </motion.div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category, index) => (
                        <motion.a
                            key={category.id}
                            href={category.slug ? `/courses?category=${category.slug}` : '/courses'}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: "easeOut"
                            }}
                            className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-md transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                        >
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="absolute inset-0 h-full w-full object-cover opacity-5 transition duration-500 group-hover:opacity-10"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-transparent to-blue-100/40 opacity-60 transition group-hover:opacity-90" />
                            )}
                            <div className="relative flex h-full flex-col justify-between gap-6">
                                <div className="space-y-3">
                                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                                        {category.courses_count} kelas
                                    </span>
                                    <h3 className="text-xl font-semibold text-slate-900">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Kelas pilihan dengan mentor terbaik di bidang {category.name.toLowerCase()}.
                                    </p>
                                </div>
                                <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                                    Lihat kelas
                                    <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
