import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import type { Enrollment } from '@/types/enrollment';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

interface PurchasesPageProps {
    enrollments: Enrollment[];
}

const STATUS_STYLES: Record<
    Enrollment['status'],
    {
        badge: string;
        border: string;
    }
> = {
    active: {
        badge: 'border-emerald-100 bg-emerald-50 text-emerald-700',
        border: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
    completed: {
        badge: 'border-primary/20 bg-primary/5 text-primary',
        border: 'border-primary/20 bg-primary/5 text-primary',
    },
    expired: {
        badge: 'border-slate-200 bg-slate-200 text-slate-600',
        border: 'border-slate-200 bg-slate-100 text-slate-600',
    },
};

export default function PurchasesPage({ enrollments }: PurchasesPageProps) {
    const columns = useMemo<ColumnDef<Enrollment>[]>(() => {
        return [
            {
                accessorKey: 'courseTitle',
                header: 'Kelas',
                accessorFn: (row) => row.course.title,
                cell: ({ row }) => {
                    const course = row.original.course;

                    return (
                        <div className="flex items-center gap-3">
                            <div className="hidden h-12 w-12 overflow-hidden rounded-xl bg-slate-100 sm:block">
                                {course.image ? (
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500">
                                        {course.title.slice(0, 2).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Link
                                    href={`/courses/${course.slug}`}
                                    className="text-sm font-semibold text-slate-900 transition-colors hover:text-[#2547F9]"
                                    prefetch
                                >
                                    {course.title}
                                </Link>
                                {course.shortDescription ? (
                                    <p className="line-clamp-1 text-xs text-muted-foreground">{course.shortDescription}</p>
                                ) : null}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.original.status;
                    const style = STATUS_STYLES[status] ?? STATUS_STYLES.active;

                    return (
                        <Badge className={cn('rounded-full border px-3 py-1 text-xs font-semibold capitalize', style.badge)}>
                            {status === 'active' ? 'Sedang Berjalan' : status === 'completed' ? 'Selesai' : 'Kadaluarsa'}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'progress',
                header: 'Progres',
                cell: ({ row }) => {
                    const progress = clampProgress(row.original.progress);

                    return (
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                            <div className="h-2 w-full max-w-[140px] overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-[#2547F9] transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="w-10 text-right text-xs font-semibold text-slate-600">{progress}%</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'enrolledAt',
                header: 'Mulai',
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">{formatDate(row.original.enrolledAt)}</span>
                ),
            },
            {
                accessorKey: 'lastAccessedAt',
                header: 'Terakhir Akses',
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                        {formatDateTime(row.original.lastAccessedAt)}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <Button asChild size="sm" variant="outline" className="rounded-full">
                        <Link href={`/courses/${row.original.course.slug}`} prefetch>
                            Buka Kelas
                        </Link>
                    </Button>
                ),
                enableSorting: false,
            },
        ];
    }, []);

    const summary = useMemo(() => getEnrollmentSummary(enrollments), [enrollments]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Kelas Saya', href: '/dashboard/purchases' },
            ]}
        >
            <Head title="Kelas Saya" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Kelas Saya</h1>
                        <p className="text-sm text-muted-foreground">
                            Akses seluruh kelas yang sudah kamu ikuti dan lanjutkan progres belajar.
                        </p>
                    </div>
                    <Button asChild className="rounded-full bg-[#2547F9] px-5 text-sm font-semibold text-white hover:bg-[#1e3fd4]">
                        <Link href="/kelas">Tambah Kelas Baru</Link>
                    </Button>
                </div>

                {enrollments.length === 0 ? (
                    <Card className="border-dashed border-slate-200">
                        <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-slate-500">
                            <p className="text-lg font-semibold text-slate-700">Belum ada kelas yang diikuti</p>
                            <p className="max-w-md text-sm">
                                Temukan kelas favoritmu di katalog dan mulai perjalanan belajar dengan mentor berpengalaman.
                            </p>
                            <Button asChild className="rounded-full bg-[#2547F9] px-6 text-white hover:bg-[#1e3fd4]">
                                <Link href="/kelas">Jelajahi Kelas</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-3">
                            {summary.map((item) => (
                                <Card key={item.title} className={cn('border', item.style)}>
                                    <CardContent className="flex flex-col gap-1 p-4">
                                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            {item.title}
                                        </span>
                                        <span className="text-2xl font-semibold text-slate-900">{item.value}</span>
                                        <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="border-muted-foreground/20">
                            <CardHeader className="pb-2">
                                <CardTitle>Daftar Kelas</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <DataTable
                                    columns={columns}
                                    data={enrollments}
                                    searchKey="courseTitle"
                                    searchPlaceholder="Cari berdasarkan nama kelas"
                                />
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </AppLayout>
    );
}

function clampProgress(value?: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return 0;
    }

    return Math.min(Math.max(Math.round(value), 0), 100);
}

function formatDate(date?: string | null): string {
    if (!date) {
        return '-';
    }

    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function formatDateTime(date?: string | null): string {
    if (!date) {
        return '-';
    }

    return new Date(date).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getEnrollmentSummary(enrollments: Enrollment[]) {
    const total = enrollments.length;
    const active = enrollments.filter((item) => item.status === 'active').length;
    const completed = enrollments.filter((item) => item.status === 'completed').length;

    return [
        {
            title: 'Total Kelas',
            value: total,
            subtitle: 'Seluruh kelas yang sudah kamu ambil',
            style: 'border-primary/20 bg-primary/5 text-primary',
        },
        {
            title: 'Sedang Berjalan',
            value: active,
            subtitle: 'Teruskan progres belajarmu sekarang',
            style: STATUS_STYLES.active.border,
        },
        {
            title: 'Selesai Dipelajari',
            value: completed,
            subtitle: 'Kelas yang sudah kamu selesaikan',
            style: STATUS_STYLES.completed.border,
        },
    ];
}
