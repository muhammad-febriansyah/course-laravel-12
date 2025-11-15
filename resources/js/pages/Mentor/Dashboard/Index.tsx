import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface MentorDashboardProps {
    stats: {
        totalCourses: number;
        publishedCourses: number;
        draftCourses: number;
        totalViews: number;
        totalStudents: number;
        unresolvedDiscussions: number;
        averageRating: number;
    };
    recentCourses: Array<{
        id: number;
        title: string;
        status: 'draft' | 'published';
        views: number;
        enrollments_count?: number;
        category?: { name: string } | null;
        level?: { name: string } | null;
        type?: { name: string } | null;
        created_at: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Mentor',
        href: '/mentor/dashboard',
    },
];

export default function MentorDashboard({ stats, recentCourses }: MentorDashboardProps) {
    const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
        new Intl.NumberFormat('id-ID', options).format(value);

    const highlightStats = [
        {
            label: 'Total Kelas',
            value: formatNumber(stats.totalCourses),
            description: 'Seluruh kelas yang kamu ajarkan',
        },
        {
            label: 'Total Siswa',
            value: formatNumber(stats.totalStudents),
            description: 'Siswa terdaftar di semua kelas',
        },
        {
            label: 'Total Views',
            value: formatNumber(stats.totalViews),
            description: 'Total kunjungan ke kelas kamu',
        },
    ];

    const otherStats = [
        {
            label: 'Kelas Terpublikasi',
            value: formatNumber(stats.publishedCourses),
            description: 'Kelas aktif yang bisa diakses siswa',
        },
        {
            label: 'Kelas Draft',
            value: formatNumber(stats.draftCourses),
            description: 'Kelas yang masih kamu persiapkan',
        },
        {
            label: 'Diskusi Pending',
            value: formatNumber(stats.unresolvedDiscussions),
            description: 'Pertanyaan yang belum dijawab',
        },
        {
            label: 'Rating Rata-rata',
            value: stats.averageRating.toFixed(1),
            description: 'Rating dari semua kelas',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Mentor" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Halo, Mentor!</h1>
                    <p className="text-sm text-muted-foreground">
                        Pantau performa kelas yang kamu ajarkan dan segera publikasikan materi terbaikmu.
                    </p>
                </div>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {highlightStats.map((item) => (
                        <Card key={item.label} className="border-muted-foreground/20 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {item.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-semibold">{item.value}</div>
                                <p className="mt-3 text-xs text-muted-foreground">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {otherStats.map((item) => (
                        <Card key={item.label} className="border-muted-foreground/20">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {item.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-semibold">{item.value}</div>
                                <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Kelas Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentCourses.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Kamu belum memiliki kelas. Hubungi admin untuk mulai mengajar.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recentCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/20 p-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-foreground">
                                                    {course.title}
                                                </h3>
                                                <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                                                    {course.status === 'published' ? 'Published' : 'Draft'}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {(course.category?.name ?? 'Tanpa kategori')} • {(course.level?.name ?? 'Tanpa level')} • {(course.type?.name ?? 'Tanpa tipe')}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {course.enrollments_count ?? 0} siswa • {course.views.toLocaleString('id-ID')} views
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/mentor/kelas/${course.id}`}>Detail</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
