import { motion } from 'framer-motion';
import { CourseCard } from '@/components/site/course-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Course } from '@/types/course';
import { Link } from '@inertiajs/react';
import { Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

interface PopularCoursesSectionProps {
    courses: Course[];
}

export function PopularCoursesSection({ courses }: PopularCoursesSectionProps) {
    if (!courses || courses.length === 0) {
        return null;
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white py-20 lg:py-28">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-4 top-1/4 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
                <div className="absolute -right-4 bottom-1/4 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl" />
                <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-400/5 blur-3xl" />
            </div>

            {/* Floating Decorative Icons */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute left-10 top-20 hidden lg:block"
            >
                <div className="rounded-2xl p-3 backdrop-blur-sm" style={{ background: 'linear-gradient(to right, rgba(37, 71, 249, 0.1), rgba(30, 63, 212, 0.1))' }}>
                    <Sparkles className="h-6 w-6" style={{ color: '#2547F9' }} />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                className="absolute right-16 top-32 hidden lg:block"
            >
                <div className="rounded-2xl p-3 backdrop-blur-sm" style={{ background: 'linear-gradient(to right, rgba(37, 71, 249, 0.1), rgba(30, 63, 212, 0.1))' }}>
                    <TrendingUp className="h-6 w-6" style={{ color: '#1e3fd4' }} />
                </div>
            </motion.div>

            <div className="relative mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 flex flex-col gap-6 text-center lg:mb-16 lg:flex-row lg:items-center lg:justify-between lg:text-left"
                >
                    <div className="flex-1 space-y-5">
                        {/* Badge with Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex"
                        >
                            <Badge className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg" style={{ background: 'linear-gradient(to right, #2547F9, #1e3fd4)', boxShadow: '0 10px 15px -3px rgba(37, 71, 249, 0.3), 0 4px 6px -2px rgba(37, 71, 249, 0.05)' }}>
                                <Sparkles className="h-3.5 w-3.5" />
                                Pilihan terbaik
                            </Badge>
                        </motion.div>

                        {/* Enhanced Title with Gradient */}
                        <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Kelas unggulan untuk kamu
                            <br className="hidden sm:block" />
                            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #2547F9, #1e3fd4)' }}>
                                {' '}mulai sekarang
                            </span>
                        </h2>

                        {/* Enhanced Description */}
                        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 lg:mx-0 lg:text-lg lg:leading-relaxed">
                            Pilih kelas populer yang sudah dipercaya{' '}
                            <span className="font-semibold text-blue-600">ribuan siswa</span>{' '}
                            dengan mentor expert dan materi up-to-date.
                        </p>

                        {/* Stats Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="font-semibold text-blue-600">{courses.length}</span> Kelas Tersedia
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                Akses Selamanya
                            </div>
                        </div>
                    </div>

                    {/* Enhanced CTA Button */}
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
                            <Link href="/kelas" className="inline-flex items-center gap-2">
                                Lihat semua kelas
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Course Grid with Enhanced Container */}
                <div className="relative">
                    <div className="grid gap-8 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    ease: "easeOut"
                                }}
                            >
                                <CourseCard course={course} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
