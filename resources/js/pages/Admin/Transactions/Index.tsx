import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CrudActions } from '@/components/table-actions';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import { useState, useMemo } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Kelas {
    id: number;
    title: string;
    price: number;
}

interface PromoCode {
    id: number;
    code: string;
}

interface Transaction {
    id: number;
    invoice_number: string;
    user: User;
    kelas: Kelas;
    promo_code: PromoCode | null;
    payment_method: string;
    payment_channel: string | null;
    amount: number;
    discount: number;
    total: number;
    status: string;
    paid_at: string | null;
    created_at: string;
}

interface PaginatedTransactions {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
}

interface Props {
    transactions: PaginatedTransactions;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi',
        href: '/transactions',
    },
];

export default function Index({ transactions }: Props) {
    const [paymentMethod, setPaymentMethod] = useState('all');
    const [status, setStatus] = useState('all');

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
            paid: { label: 'Paid', variant: 'default' as const, icon: CheckCircle },
            expired: { label: 'Expired', variant: 'destructive' as const, icon: XCircle },
            failed: { label: 'Failed', variant: 'destructive' as const, icon: AlertCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="gap-1">
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const getPaymentMethodBadge = (method: string) => {
        return method === 'cash' ? (
            <Badge variant="outline">Cash</Badge>
        ) : (
            <Badge variant="outline" className="bg-blue-50">Tripay</Badge>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredData = useMemo(() => {
        return transactions.data.filter((transaction) => {
            const matchPayment =
                paymentMethod === 'all' || transaction.payment_method === paymentMethod;
            const matchStatus =
                status === 'all' || transaction.status === status;

            return matchPayment && matchStatus;
        });
    }, [transactions.data, paymentMethod, status]);

    const columns = useMemo<ColumnDef<Transaction>[]>(() => {
        return [
            {
                header: '#',
                cell: ({ row, table }) => {
                    const pagination = table.getState().pagination as {
                        pageIndex: number;
                        pageSize: number;
                    };

                    return (
                        pagination.pageIndex * pagination.pageSize +
                        row.index +
                        1
                    );
                },
                enableSorting: false,
                enableHiding: false,
                size: 60,
            },
            {
                accessorKey: 'invoice_number',
                header: 'Invoice',
                cell: ({ row }) => (
                    <div className="font-mono text-sm">
                        {row.original.invoice_number}
                    </div>
                ),
            },
            {
                accessorKey: 'user',
                header: 'User',
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {row.original.user.email}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'kelas',
                header: 'Kelas',
                cell: ({ row }) => (
                    <div className="max-w-xs truncate">
                        {row.original.kelas.title}
                    </div>
                ),
            },
            {
                accessorKey: 'payment_method',
                header: 'Payment',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-1">
                        {getPaymentMethodBadge(row.original.payment_method)}
                        {row.original.payment_channel && (
                            <span className="text-xs text-muted-foreground">
                                {row.original.payment_channel}
                            </span>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'total',
                header: 'Total',
                cell: ({ row }) => (
                    <div className="font-semibold">
                        {formatCurrency(row.original.total)}
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => getStatusBadge(row.original.status),
            },
            {
                accessorKey: 'created_at',
                header: 'Tanggal',
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
                        {formatDate(row.original.created_at)}
                    </div>
                ),
            },
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }) => (
                    <CrudActions detailHref={`/admin/transactions/${row.original.id}`} />
                ),
                enableSorting: false,
            },
        ];
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Kelola Transaksi
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Monitor dan kelola transaksi pembayaran platform.
                        </p>
                    </div>
                </div>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Metode Pembayaran
                            </label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Semua metode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua metode</SelectItem>
                                    <SelectItem value="tripay">Tripay</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Status
                            </label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Semua status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end justify-end md:col-span-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setPaymentMethod('all');
                                    setStatus('all');
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Daftar Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            searchKey="invoice_number"
                            searchPlaceholder="Cari berdasarkan invoice"
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
