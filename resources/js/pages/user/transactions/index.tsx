import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import type { TransactionSummary } from '@/types/transaction';
import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

interface TransactionPageProps {
    transactions: TransactionSummary[];
}

const STATUS_STYLES: Record<
    string,
    {
        pill: string;
        soft: string;
    }
> = {
    paid: {
        pill: 'border-emerald-100 bg-emerald-50 text-emerald-700',
        soft: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
    pending: {
        pill: 'border-amber-100 bg-amber-50 text-amber-700',
        soft: 'border-amber-200 bg-amber-50 text-amber-700',
    },
    expired: {
        pill: 'border-slate-200 bg-slate-200 text-slate-600',
        soft: 'border-slate-200 bg-slate-100 text-slate-600',
    },
    failed: {
        pill: 'border-rose-100 bg-rose-50 text-rose-700',
        soft: 'border-rose-200 bg-rose-50 text-rose-700',
    },
};

export default function TransactionPage({ transactions }: TransactionPageProps) {
    const columns = useMemo<ColumnDef<TransactionSummary>[]>(() => {
        return [
            {
                accessorKey: 'invoiceNumber',
                header: 'No. Invoice',
                cell: ({ row }) => (
                    <Link
                        href={route('user.transactions.show', { transaction: row.original.id })}
                        className="font-semibold text-[#2547F9] hover:underline"
                        prefetch
                    >
                        {row.original.invoiceNumber}
                    </Link>
                ),
            },
            {
                accessorKey: 'course',
                header: 'Kelas',
                cell: ({ row }) => {
                    const course = row.original.course;

                    if (!course) {
                        return <span className="text-sm text-muted-foreground">-</span>;
                    }

                    return (
                        <Link
                            href={`/courses/${course.slug}`}
                            className="line-clamp-2 text-sm font-medium text-slate-900 transition-colors hover:text-[#2547F9]"
                            prefetch
                        >
                            {course.title}
                        </Link>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const statusKey = row.original.status.toLowerCase();
                    const style = STATUS_STYLES[statusKey] ?? STATUS_STYLES.expired;

                    return (
                        <Badge className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${style.pill}`}>
                            {row.original.status}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'createdAt',
                header: 'Tanggal',
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
                        {formatDate(row.original.createdAt)}
                    </div>
                ),
            },
            {
                accessorKey: 'total',
                header: 'Total',
                cell: ({ row }) => (
                    <div className="text-right font-semibold">{formatCurrency(row.original.total)}</div>
                ),
            },
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }) => (
                    <div className="flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('user.transactions.show', { transaction: row.original.id })} prefetch>
                                Lihat Detail
                            </Link>
                        </Button>
                    </div>
                ),
            },
        ];
    }, []);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Histori Transaksi', href: '/dashboard/transactions' },
            ]}
        >
            <Head title="Histori Transaksi" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Histori Transaksi</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola pembayaran kelas dan pantau status transaksi kamu.
                        </p>
                    </div>
                    <Badge
                        variant="outline"
                        className="rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-sm font-medium text-primary"
                    >
                        Total {transactions.length} transaksi
                    </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {getStatusSummary(transactions).map((item) => (
                        <Card key={item.title} className={`border ${item.className}`}>
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
                        <CardTitle>Daftar Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <DataTable
                            columns={columns}
                            data={transactions}
                            searchKey="invoiceNumber"
                            searchPlaceholder="Cari berdasarkan nomor invoice"
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(date?: string | null): string {
    if (!date) {
        return '-';
    }

    return new Date(date).toLocaleString('id-ID');
}

function getStatusSummary(transactions: TransactionSummary[]) {
    const total = transactions.length;
    const paid = transactions.filter((item) => item.status.toLowerCase() === 'paid').length;
    const pending = transactions.filter((item) => item.status.toLowerCase() === 'pending').length;

    return [
        {
            title: 'Total Transaksi',
            value: total,
            subtitle: 'Semua transaksi yang pernah kamu lakukan',
            className: 'border-primary/20 bg-primary/5 text-primary',
        },
        {
            title: 'Menunggu Pembayaran',
            value: pending,
            subtitle: 'Transaksi yang masih menunggu pelunasan',
            className: 'border-amber-200 bg-amber-50 text-amber-700',
        },
        {
            title: 'Berhasil Dibayar',
            value: paid,
            subtitle: 'Transaksi yang telah selesai dibayar',
            className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        },
    ];
}
