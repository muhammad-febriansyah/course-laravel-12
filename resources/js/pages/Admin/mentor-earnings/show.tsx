import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, TrendingUp, Wallet, ShoppingCart, Download } from 'lucide-react';

interface Transaction {
    id: number;
    invoice_number: string;
    kelas: {
        id: number;
        title: string;
    };
    user: {
        id: number;
        name: string;
    };
    total: number;
    mentor_earnings: number;
    platform_fee: number;
    created_at: string;
}

interface PaginatedTransactions {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Mentor {
    id: number;
    name: string;
    email: string;
}

interface Summary {
    total_transactions: number;
    total_revenue: number;
    total_mentor_earnings: number;
    total_platform_fees: number;
}

interface Props {
    mentor: Mentor;
    transactions: PaginatedTransactions;
    summary: Summary;
}

const formatCurrency = (value: number) => {
    return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function MentorEarningsShow({ mentor, transactions, summary }: Props) {
    const columns = useMemo<ColumnDef<Transaction>[]>(() => [
        {
            header: '#',
            cell: ({ row }) => row.index + 1,
            enableSorting: false,
            size: 40,
        },
        {
            accessorKey: 'invoice_number',
            header: 'Invoice',
            cell: ({ row }) => (
                <span className="font-mono text-sm font-medium text-slate-900">
                    {row.original.invoice_number}
                </span>
            ),
        },
        {
            accessorKey: 'kelas.title',
            header: 'Kelas',
            cell: ({ row }) => (
                <div className="max-w-xs">
                    <p className="truncate font-medium text-slate-900">{row.original.kelas.title}</p>
                </div>
            ),
        },
        {
            accessorKey: 'user.name',
            header: 'Pembeli',
            cell: ({ row }) => (
                <span className="text-slate-700">{row.original.user.name}</span>
            ),
        },
        {
            accessorKey: 'total',
            header: 'Total',
            cell: ({ row }) => (
                <div className="text-right font-medium text-slate-900">
                    {formatCurrency(row.original.total)}
                </div>
            ),
        },
        {
            accessorKey: 'mentor_earnings',
            header: 'Pendapatan',
            cell: ({ row }) => (
                <div className="text-right font-semibold text-emerald-600">
                    {formatCurrency(row.original.mentor_earnings)}
                </div>
            ),
        },
        {
            accessorKey: 'platform_fee',
            header: 'Fee',
            cell: ({ row }) => (
                <div className="text-right font-medium text-amber-600">
                    {formatCurrency(row.original.platform_fee)}
                </div>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Tanggal',
            cell: ({ row }) => (
                <span className="text-sm text-slate-600">
                    {formatDate(row.original.created_at)}
                </span>
            ),
        },
    ], []);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Pendapatan Mentor', href: '/admin/mentor-earnings' },
                { title: mentor.name, href: `/admin/mentor-earnings/${mentor.id}` },
            ]}
        >
            <Head title={`Pendapatan ${mentor.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <Button variant="outline" size="sm" asChild className="w-fit">
                            <Link href="/admin/mentor-earnings">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Kembali
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <a href={`/admin/mentor-earnings/${mentor.id}/export/pdf`} target="_blank">
                                <Download className="h-4 w-4 mr-2" />
                                Export PDF
                            </a>
                        </Button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            {mentor.name}
                        </h1>
                        <p className="text-sm text-slate-600">{mentor.email}</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                    <ShoppingCart className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-blue-900/80">
                                        Total Transaksi
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {summary.total_transactions.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-indigo-200 bg-indigo-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <TrendingUp className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-indigo-900/80">
                                        Total Revenue
                                    </p>
                                    <p className="text-xl font-bold text-indigo-600">
                                        {formatCurrency(summary.total_revenue)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-200 bg-emerald-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
                                    <Wallet className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-900/80">
                                        Pendapatan Mentor
                                    </p>
                                    <p className="text-xl font-bold text-emerald-600">
                                        {formatCurrency(summary.total_mentor_earnings)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600">
                                    <DollarSign className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-amber-900/80">
                                        Fee Platform
                                    </p>
                                    <p className="text-xl font-bold text-amber-600">
                                        {formatCurrency(summary.total_platform_fees)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={transactions.data}
                            searchPlaceholder="Cari invoice atau kelas..."
                            searchColumn="invoice_number"
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
