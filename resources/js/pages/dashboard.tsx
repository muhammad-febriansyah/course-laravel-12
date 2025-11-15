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
import type { Enrollment } from '@/types/enrollment';
import type { TransactionSummary } from '@/types/transaction';
import { Head } from '@inertiajs/react';

interface DashboardPageProps {
    enrollments: Enrollment[];
    transactions: TransactionSummary[];
    stats: {
        activeCourses: number;
        completedCourses: number;
        totalTransactions: number;
    };
}

const STATUS_LABEL: Record<Enrollment['status'], string> = {
    active: 'Sedang Belajar',
    completed: 'Selesai',
    expired: 'Kadaluarsa',
};

const STATUS_VARIANT: Record<Enrollment['status'], 'default' | 'secondary' | 'destructive'> = {
    active: 'default',
    completed: 'secondary',
    expired: 'destructive',
};

export default function Dashboard({ enrollments, transactions, stats }: DashboardPageProps) {
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                },
            ]}
        >
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <section className="grid gap-4 md:grid-cols-3">
                    {[
                        {
                            title: 'Kursus Aktif',
                            value: stats.activeCourses,
                            description: 'Kelas yang sedang kamu ikuti',
                        },
                        {
                            title: 'Kursus Selesai',
                            value: stats.completedCourses,
                            description: 'Jumlah kursus yang sudah selesai',
                        },
                        {
                            title: 'Total Transaksi',
                            value: stats.totalTransactions,
                            description: 'Riwayat pembayaran yang pernah dilakukan',
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-3xl border border-[#2547F9]/20 bg-gradient-to-br from-[#2547F9]/10 to-white p-6 shadow-sm"
                        >
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#2547F9]">
                                {item.title}
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
                            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                        </div>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle>Progres Belajar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {enrollments.length === 0 ? (
                                <p className="rounded-lg border bg-muted/30 p-6 text-center text-muted-foreground">
                                    Kamu belum memiliki kursus aktif. Mulai eksplorasi di katalog kursus!
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {enrollments.map((enrollment) => (
                                        <div
                                            key={enrollment.id}
                                            className="rounded-xl border bg-muted/20 p-4 transition hover:bg-muted/30"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="space-y-1">
                                                    <h3 className="text-base font-semibold">
                                                        {enrollment.course.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {enrollment.course.category?.name} ·{' '}
                                                        {enrollment.course.level?.name}
                                                    </p>
                                                </div>
                                                <Badge variant={STATUS_VARIANT[enrollment.status]}>
                                                    {STATUS_LABEL[enrollment.status]}
                                                </Badge>
                                            </div>
                                            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                    className="h-full rounded-full bg-[#2547F9] transition-all"
                                                    style={{ width: `${enrollment.progress ?? 0}%` }}
                                                />
                                            </div>
                                            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                                <span>Mulai: {enrollment.enrolledAt ?? '-'}</span>
                                                <span>{enrollment.progress ?? 0}% selesai</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle>Riwayat Transaksi Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {transactions.length === 0 ? (
                                <p className="rounded-lg border bg-muted/30 p-4 text-center text-muted-foreground">
                                    Belum ada transaksi.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>No. Invoice</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell>{transaction.invoiceNumber}</TableCell>
                                                <TableCell className="capitalize">{transaction.status}</TableCell>
                                                <TableCell>
                                                    Rp {transaction.total.toLocaleString('id-ID')}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
