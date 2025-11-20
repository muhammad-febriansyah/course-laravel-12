import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Eye, DollarSign, TrendingUp, Wallet, Download } from 'lucide-react';

interface Mentor {
    id: number;
    name: string;
    email: string;
    total_courses: number;
    total_sales: number;
    total_revenue: number;
    mentor_earnings: number;
    platform_fees: number;
}

interface Summary {
    total_mentors: number;
    total_sales: number;
    total_revenue: number;
    total_mentor_earnings: number;
    total_platform_fees: number;
}

interface Props {
    mentors: Mentor[];
    summary: Summary;
}

const formatCurrency = (value: number) => {
    return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
};

export default function MentorEarningsIndex({ mentors, summary }: Props) {
    const columns = useMemo<ColumnDef<Mentor>[]>(() => [
        {
            header: '#',
            cell: ({ row }) => row.index + 1,
            enableSorting: false,
            size: 40,
        },
        {
            accessorKey: 'name',
            header: 'Nama Mentor',
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-slate-900">{row.original.name}</p>
                    <p className="text-sm text-slate-500">{row.original.email}</p>
                </div>
            ),
        },
        {
            accessorKey: 'total_courses',
            header: 'Total Kelas',
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-700">
                        {row.original.total_courses}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'total_sales',
            header: 'Penjualan',
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-sm font-medium text-green-700">
                        {row.original.total_sales}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'total_revenue',
            header: 'Total Revenue',
            cell: ({ row }) => (
                <div className="text-right font-medium text-slate-900">
                    {formatCurrency(row.original.total_revenue)}
                </div>
            ),
        },
        {
            accessorKey: 'mentor_earnings',
            header: 'Pendapatan Mentor',
            cell: ({ row }) => (
                <div className="text-right font-semibold text-emerald-600">
                    {formatCurrency(row.original.mentor_earnings)}
                </div>
            ),
        },
        {
            accessorKey: 'platform_fees',
            header: 'Fee Platform',
            cell: ({ row }) => (
                <div className="text-right font-medium text-amber-600">
                    {formatCurrency(row.original.platform_fees)}
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/mentor-earnings/${row.original.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                        </Link>
                    </Button>
                </div>
            ),
        },
    ], []);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Pendapatan Mentor', href: '/admin/mentor-earnings' },
            ]}
        >
            <Head title="Pendapatan Mentor" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                            <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Pendapatan Mentor
                            </h1>
                            <p className="text-sm text-slate-600">
                                Laporan pendapatan dan fee platform dari semua mentor
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <a href="/admin/mentor-earnings/export/pdf" target="_blank">
                            <Download className="h-4 w-4 mr-2" />
                            Export PDF
                        </a>
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                                    <TrendingUp className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-green-900/80">
                                        Total Penjualan
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {summary.total_sales.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-indigo-200 bg-indigo-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <DollarSign className="h-5 w-5 text-white" />
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

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Mentor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={mentors}
                            searchPlaceholder="Cari mentor..."
                            searchColumn="name"
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
