import { CourseCard } from '@/components/site/course-card';
import { CourseFilterBar } from '@/components/site/course-filter-bar';
import { PageHeader } from '@/components/site/page-header';
import HomeLayout from '@/layouts/home-layout';
import type { CatalogFilters, CatalogOptions, Course, PaginationMeta } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface CourseCatalogPageProps {
    courses: Course[];
    meta: PaginationMeta;
    filters: CatalogFilters;
    options: CatalogOptions;
}

export default function CourseCatalogPage({ courses, meta, filters, options }: CourseCatalogPageProps) {
    const goToPage = (page: number) => {
        router.get(
            '/courses',
            {
                ...filters,
                page,
            },
            { preserveState: true, replace: true },
        );
    };

    const canPrev = meta.currentPage > 1;
    const canNext = meta.currentPage < meta.lastPage;

    return (
        <HomeLayout>
            <Head title="Katalog Kursus" />

            <PageHeader
                title="Jelajahi Kursus"
                description="Temukan kursus sesuai minatmu. Gunakan filter untuk mempersempit pencarian dan mulailah belajar dengan lebih terarah."
            />

            <main className="-mt-16 bg-white pb-24 pt-20 sm:-mt-24 sm:pt-28">
                <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <CourseFilterBar filters={filters} options={options} />

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {courses.length === 0 ? (
                            <p className="col-span-full rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                                Belum ada kursus yang cocok dengan pencarianmu.
                            </p>
                        ) : (
                            courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))
                        )}
                    </div>

                    {meta.lastPage > 1 ? (
                        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-slate-500">
                                Halaman {meta.currentPage} dari {meta.lastPage}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    disabled={!canPrev}
                                    onClick={() => goToPage(meta.currentPage - 1)}
                                    className="rounded-full border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
                                    disabled={!canNext}
                                    onClick={() => goToPage(meta.currentPage + 1)}
                                    className="rounded-full border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    Selanjutnya
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </main>
        </HomeLayout>
    );
}

CourseCatalogPage.layout = (page: ReactNode) => page;
