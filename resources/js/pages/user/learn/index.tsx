import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { Enrollment } from '@/types/enrollment';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, GraduationCap, PlayCircle, TrendingUp } from 'lucide-react';

interface LearnPageProps {
    enrollments: Enrollment[];
    recentCourse: Enrollment | null;
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
        border: 'border-emerald-200 bg-emerald-50/50',
    },
    completed: {
        badge: 'border-primary/20 bg-primary/5 text-primary',
        border: 'border-primary/20 bg-primary/5',
    },
    expired: {
        badge: 'border-slate-200 bg-slate-200 text-slate-600',
        border: 'border-slate-200 bg-slate-100',
    },
};

export default function LearnPage({ enrollments, recentCourse }: LearnPageProps) {
    const totalProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
        : 0;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Belajar', href: '/dashboard/learn' },
            ]}
        >
            <Head title="Belajar" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Ruang Belajar</h1>
                        <p className="text-sm text-muted-foreground">
                            Lanjutkan perjalanan belajarmu dan raih target pembelajaran hari ini
                        </p>
                    </div>
                    <Button asChild className="rounded-full bg-[#2547F9] px-5 text-sm font-semibold text-white hover:bg-[#1e3fd4]">
                        <Link href="/kelas">Jelajahi Kelas</Link>
                    </Button>
                </div>

                {enrollments.length === 0 ? (
                    /* Empty State */
                    <Card className="border-dashed border-slate-200">
                        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                            <div className="rounded-full bg-primary/10 p-4">
                                <BookOpen className="h-10 w-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-lg font-semibold text-slate-700">Mulai Perjalanan Belajarmu</p>
                                <p className="max-w-md text-sm text-muted-foreground">
                                    Belum ada kelas aktif saat ini. Pilih kelas yang sesuai dengan minatmu dan mulai belajar bersama mentor berpengalaman.
                                </p>
                            </div>
                            <Button asChild className="mt-2 rounded-full bg-[#2547F9] px-6 text-white hover:bg-[#1e3fd4]">
                                <Link href="/kelas">Cari Kelas</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <BookOpen className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Kelas Aktif
                                        </span>
                                        <span className="text-2xl font-semibold text-slate-900">{enrollments.length}</span>
                                        <span className="text-xs text-muted-foreground">Sedang berjalan</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="rounded-full bg-emerald-100 p-3">
                                        <TrendingUp className="h-6 w-6 text-emerald-700" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Rata-rata Progress
                                        </span>
                                        <span className="text-2xl font-semibold text-slate-900">{totalProgress}%</span>
                                        <span className="text-xs text-muted-foreground">Dari semua kelas</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="rounded-full bg-amber-100 p-3">
                                        <GraduationCap className="h-6 w-6 text-amber-700" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Total Video
                                        </span>
                                        <span className="text-2xl font-semibold text-slate-900">
                                            {enrollments.reduce((sum, e) => sum + (e.videosCompleted || 0), 0)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">Video diselesaikan</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Continue Learning Section */}
                        {recentCourse && (
                            <Card className="border-primary/20 bg-gradient-to-br from-slate-50 to-primary/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PlayCircle className="h-5 w-5 text-primary" />
                                        Lanjutkan Belajar
                                    </CardTitle>
                                    <CardDescription>
                                        Kelas terakhir yang kamu akses
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 md:h-24 md:w-24">
                                                {recentCourse.course.image ? (
                                                    <img
                                                        src={recentCourse.course.image}
                                                        alt={recentCourse.course.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-slate-500">
                                                        {recentCourse.course.title.slice(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    {recentCourse.course.title}
                                                </h3>
                                                {recentCourse.course.shortDescription && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {recentCourse.course.shortDescription}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4" />
                                                        <span>Terakhir akses: {formatDateTime(recentCourse.lastAccessedAt)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-48 overflow-hidden rounded-full bg-slate-200">
                                                        <div
                                                            className="h-full rounded-full bg-[#2547F9] transition-all"
                                                            style={{ width: `${clampProgress(recentCourse.progress)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-600">
                                                        {clampProgress(recentCourse.progress)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-full bg-[#2547F9] px-6 text-white hover:bg-[#1e3fd4]"
                                        >
                                            <Link href={`/dashboard/learn/${recentCourse.course.slug}`} prefetch>
                                                <PlayCircle className="mr-2 h-5 w-5" />
                                                Lanjutkan
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* All Active Courses */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-slate-900">Semua Kelas Aktif</h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {enrollments.map((enrollment) => (
                                    <Card
                                        key={enrollment.id}
                                        className="group transition-all hover:shadow-md"
                                    >
                                        <CardHeader className="p-0">
                                            <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-slate-100">
                                                {enrollment.course.image ? (
                                                    <img
                                                        src={enrollment.course.image}
                                                        alt={enrollment.course.title}
                                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-400">
                                                        {enrollment.course.title.slice(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <Badge
                                                    className={cn(
                                                        'absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold capitalize',
                                                        STATUS_STYLES[enrollment.status]?.badge ?? STATUS_STYLES.active.badge
                                                    )}
                                                >
                                                    {enrollment.status === 'active' ? 'Aktif' : enrollment.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <h3 className="line-clamp-2 font-semibold text-slate-900">
                                                        {enrollment.course.title}
                                                    </h3>
                                                    {enrollment.course.shortDescription && (
                                                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                            {enrollment.course.shortDescription}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>Progress</span>
                                                        <span className="font-semibold text-slate-700">
                                                            {clampProgress(enrollment.progress)}%
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                                        <div
                                                            className="h-full rounded-full bg-[#2547F9] transition-all"
                                                            style={{ width: `${clampProgress(enrollment.progress)}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                                                    <span>{enrollment.videosCompleted || 0} video selesai</span>
                                                    <span>{enrollment.quizzesCompleted || 0} quiz selesai</span>
                                                </div>

                                                <Button
                                                    asChild
                                                    size="sm"
                                                    className="w-full rounded-full bg-[#2547F9] text-white hover:bg-[#1e3fd4]"
                                                >
                                                    <Link href={`/dashboard/learn/${enrollment.course.slug}`} prefetch>
                                                        Buka Kelas
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
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
