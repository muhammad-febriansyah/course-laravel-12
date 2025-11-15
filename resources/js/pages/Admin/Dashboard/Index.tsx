import { RevenueLineChart } from '@/components/charts/apex/revenue-line-chart';
import { StatusDonutChart } from '@/components/charts/apex/status-donut-chart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type {
    DashboardSummary,
    RecentTransactionItem,
    StatusBreakdownItem,
    TopCourseItem,
    TrendPoint,
    UserBreakdown,
} from '@/types/admin-dashboard';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const STATUS_LABELS: Record<string, string> = {
    paid: 'Berhasil',
    pending: 'Menunggu',
    expired: 'Kadaluarsa',
    failed: 'Gagal',
    refund: 'Refund',
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    paid: 'default',
    pending: 'secondary',
    expired: 'outline',
    failed: 'destructive',
    refund: 'outline',
};

interface AdminDashboardPageProps {
    summary: DashboardSummary;
    revenueTrend: TrendPoint[];
    statusBreakdown: StatusBreakdownItem[];
    topCourses: TopCourseItem[];
    recentTransactions: RecentTransactionItem[];
    userBreakdown: UserBreakdown;
    breadcrumbs?: BreadcrumbItem[];
}

const formatCurrency = (value: number) =>
    `Rp ${value.toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

const summaryCards = (
    summary: DashboardSummary,
    userBreakdown: UserBreakdown,
) => [
    {
        title: 'Total Revenue',
        value: formatCurrency(summary.totalRevenue),
        description: `${userBreakdown.totalUsers} pengguna terdaftar`,
    },
    {
        title: 'Siswa Aktif',
        value: summary.activeStudents.toLocaleString('id-ID'),
        description: `${userBreakdown.students} akun student`,
    },
    {
        title: 'Total Kursus',
        value: summary.totalCourses.toLocaleString('id-ID'),
        description: `${userBreakdown.instructors} instruktur aktif`,
    },
    {
        title: 'Average Order Value',
        value: formatCurrency(summary.averageOrderValue),
        description: 'Rerata transaksi berhasil',
    },
];

export default function AdminDashboardPage({
    summary,
    revenueTrend,
    statusBreakdown,
    topCourses,
    recentTransactions,
    userBreakdown,
    breadcrumbs = [],
}: AdminDashboardPageProps) {
    const statusChartData = statusBreakdown.map((item) => ({
        label: STATUS_LABELS[item.status] ?? item.status,
        value: item.total,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {summaryCards(summary, userBreakdown).map((card) => (
                        <Card key={card.title} className="border-muted-foreground/20">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="text-2xl font-semibold tracking-tight">
                                    {card.value}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {card.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                    <Card className="border-muted-foreground/20">
                        <CardHeader>
                            <CardTitle>Pendapatan 6 Bulan Terakhir</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RevenueLineChart data={revenueTrend} />
                        </CardContent>
                    </Card>

                    <Card className="border-muted-foreground/20">
                        <CardHeader>
                            <CardTitle>Status Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StatusDonutChart data={statusChartData} />
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                    <Card className="border-muted-foreground/20">
                        <CardHeader>
                            <CardTitle>Kursus Teratas</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kursus</TableHead>
                                        <TableHead className="text-right">Enrol</TableHead>
                                        <TableHead className="text-right">Revenue</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topCourses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                Belum ada data kursus.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        topCourses.map((course) => (
                                            <TableRow key={course.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{course.title}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {course.slug}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {course.enrollments.toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(course.revenue)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="border-muted-foreground/20">
                        <CardHeader>
                            <CardTitle>Ringkasan Pengguna</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                                <span className="text-muted-foreground">Total Pengguna</span>
                                <span className="font-semibold">
                                    {userBreakdown.totalUsers.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                                <span className="text-muted-foreground">Instruktur</span>
                                <span className="font-semibold">
                                    {userBreakdown.instructors.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                                <span className="text-muted-foreground">Siswa</span>
                                <span className="font-semibold">
                                    {userBreakdown.students.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Transaksi Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead>Kursus</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            Belum ada transaksi.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-medium">
                                                {transaction.invoiceNumber}
                                            </TableCell>
                                            <TableCell>{transaction.customer ?? '-'}</TableCell>
                                            <TableCell>{transaction.course ?? '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={STATUS_VARIANTS[transaction.status] ?? 'outline'}>
                                                    {STATUS_LABELS[transaction.status] ?? transaction.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(transaction.total)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
