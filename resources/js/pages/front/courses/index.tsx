import { CourseCard } from '@/components/site/course-card';
import { CourseFilterBar } from '@/components/site/course-filter-bar';
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
        <div className="pb-24">
            <Head title="Katalog Kursus" />

            <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="space-y-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Jelajahi Kursus
                    </h1>
                    <p className="text-base text-slate-600 sm:text-lg">
                        Temukan kursus sesuai minatmu. Gunakan filter untuk mempersempit pencarian.
                    </p>
                </div>

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
        </div>
    );
}

CourseCatalogPage.layout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;
