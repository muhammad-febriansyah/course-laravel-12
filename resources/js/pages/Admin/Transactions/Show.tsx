import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Receipt, Check, X, ArrowLeft, User, BookOpen, CreditCard, FileText, Copy, ExternalLink, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Transaction {
    id: number;
    invoice_number: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    kelas: {
        id: number;
        title: string;
        price: number;
    };
    promo_code: {
        id: number;
        code: string;
    } | null;
    payment_method: string;
    payment_channel: string | null;
    amount: number;
    discount: number;
    total: number;
    admin_fee: number;
    status: string;
    payment_url: string | null;
    notes: string | null;
    paid_at: string | null;
    expired_at: string | null;
    created_at: string;
}

interface Props {
    transaction: Transaction;
}

export default function Show({ transaction }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Transaksi', href: '/admin/transactions' },
        { title: transaction.invoice_number, href: `/admin/transactions/${transaction.id}` },
    ];

    const handleApprove = () => {
        if (!confirm('Apakah Anda yakin ingin approve transaksi ini?')) return;

        router.post(`/admin/transactions/${transaction.id}/approve`, {}, {
            onSuccess: () => {
                toast.success('Transaksi berhasil di-approve!');
            },
            onError: () => {
                toast.error('Gagal approve transaksi');
            },
        });
    };

    const handleReject = () => {
        const notes = prompt('Alasan reject (opsional):');
        if (notes === null) return;

        router.post(`/admin/transactions/${transaction.id}/reject`, { notes }, {
            onSuccess: () => {
                toast.success('Transaksi berhasil di-reject!');
            },
            onError: () => {
                toast.error('Gagal reject transaksi');
            },
        });
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            expired: 'bg-red-100 text-red-800',
            failed: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || colors.pending;
    };

    const statusLabel = (status: string) => {
        const map: Record<string, string> = {
            pending: 'Pending',
            paid: 'Berhasil',
            expired: 'Kedaluwarsa',
            failed: 'Gagal',
        };
        return map[status] ?? status.toUpperCase();
    };

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Disalin ke clipboard');
        } catch {
            toast.error('Gagal menyalin');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transaksi - ${transaction.invoice_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div className="w-full">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.get('/admin/transactions')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">Detail Transaksi</h1>
                                <p className="text-sm text-muted-foreground">{transaction.invoice_number}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(transaction.status)}>
                                {statusLabel(transaction.status)}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => window.print()} className="hidden md:inline-flex gap-2">
                                <Printer className="h-4 w-4" /> Cetak
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* Transaction Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5" />
                                    Informasi Transaksi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Invoice Number</p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-mono font-medium break-all">{transaction.invoice_number}</p>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => copy(transaction.invoice_number)}
                                                aria-label="Copy invoice number"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tanggal Transaksi</p>
                                        <p className="font-medium">{formatDate(transaction.created_at)}</p>
                                    </div>
                                </div>

                                {transaction.paid_at && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tanggal Pembayaran</p>
                                        <p className="font-medium">{formatDate(transaction.paid_at)}</p>
                                    </div>
                                )}

                                {transaction.expired_at && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Expired At</p>
                                        <p className="font-medium">{formatDate(transaction.expired_at)}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* User Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informasi Pembeli
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nama</p>
                                    <p className="font-medium">{transaction.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{transaction.user.email}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Course Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Informasi Kelas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <p className="font-medium">{transaction.kelas.title}</p>
                                <p className="text-sm text-muted-foreground">Harga Normal: {formatCurrency(transaction.kelas.price)}</p>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Informasi Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Metode</p>
                                        <p className="font-medium capitalize">{transaction.payment_method}</p>
                                    </div>
                                    {transaction.payment_channel && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Channel</p>
                                            <p className="font-medium">{transaction.payment_channel}</p>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Harga Kelas</span>
                                        <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                                    </div>
                                    {transaction.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Diskon {transaction.promo_code && `(${transaction.promo_code.code})`}</span>
                                            <span>-{formatCurrency(transaction.discount)}</span>
                                        </div>
                                    )}
                                    {transaction.admin_fee > 0 && (
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Biaya Admin</span>
                                            <span>{formatCurrency(transaction.admin_fee)}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>{formatCurrency(transaction.total)}</span>
                                    </div>
                                </div>

                                {transaction.payment_url && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm text-muted-foreground">Payment URL</p>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={transaction.payment_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline break-all"
                                            >
                                                {transaction.payment_url}
                                            </a>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copy(transaction.payment_url!)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={transaction.payment_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                                                    <ExternalLink className="h-4 w-4" /> Buka
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {transaction.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Catatan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{transaction.notes}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Action Buttons (Only for Cash & Pending) */}
                        {transaction.payment_method === 'cash' && transaction.status === 'pending' && (
                            <Card className="border-2 border-yellow-200 bg-yellow-50/50">
                                <CardHeader>
                                    <CardTitle>Aksi Admin</CardTitle>
                                    <CardDescription>
                                        Transaksi Cash menunggu approval
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleApprove}
                                            className="flex-1 gap-2"
                                            variant="default"
                                        >
                                            <Check className="h-4 w-4" />
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={handleReject}
                                            className="flex-1 gap-2"
                                            variant="destructive"
                                        >
                                            <X className="h-4 w-4" />
                                            Reject
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
