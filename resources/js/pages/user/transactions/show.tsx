import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { TransactionDetail, TripayInstruction } from '@/types/transaction';
import { Head, Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    Banknote,
    CalendarCheck,
    Clock,
    CreditCard,
    Hash,
    QrCode,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface TransactionDetailPageProps {
    transaction: TransactionDetail;
}

const STATUS_STYLES: Record<
    string,
    {
        pill: string;
    }
> = {
    paid: {
        pill: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    },
    pending: {
        pill: 'border-amber-100 bg-amber-50 text-amber-700',
    },
    expired: {
        pill: 'border-slate-200 bg-slate-200 text-slate-600',
    },
    failed: {
        pill: 'border-rose-100 bg-rose-50 text-rose-700',
    },
    refund: {
        pill: 'border-purple-100 bg-purple-50 text-purple-700',
    },
};

const DEFAULT_STATUS_STYLE = {
    pill: 'border-slate-200 bg-slate-200 text-slate-600',
};

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export default function TransactionDetailPage({ transaction }: TransactionDetailPageProps) {
    const statusKey = transaction.status.toLowerCase();
    const statusStyle = STATUS_STYLES[statusKey] ?? DEFAULT_STATUS_STYLE;
    const isPaid = statusKey === 'paid';
    const createdAtLabel = transaction.createdAt
        ? new Date(transaction.createdAt).toLocaleString('id-ID')
        : '-';
    const paidAtLabel = transaction.paidAt ? new Date(transaction.paidAt).toLocaleString('id-ID') : null;
    const expiredAtLabel = transaction.expiredAt
        ? new Date(transaction.expiredAt).toLocaleString('id-ID')
        : null;
    const courseTitle = transaction.course?.title ?? 'Detail Kelas';
    const courseSlug = transaction.course?.slug ?? null;
    const courseImage = transaction.course?.image ?? null;
    const courseInitials = courseTitle.slice(0, 2).toUpperCase();

    const breakdown: Array<{ label: string; value: string }> = [
        { label: 'Harga Kelas', value: currency.format(transaction.amount) },
    ];

    if (transaction.discount && transaction.discount > 0) {
        breakdown.push({ label: 'Diskon', value: `- ${currency.format(transaction.discount)}` });
    }

    const subtotal = Math.max(transaction.amount - transaction.discount, 0);
    const totalToPay = transaction.total ?? subtotal + (transaction.adminFee ?? 0);

    const detailRows: Array<{ label: string; value: ReactNode; icon: LucideIcon }> = [
        {
            label: 'Metode Pembayaran',
            value: transaction.paymentMethod ? transaction.paymentMethod.toUpperCase() : '-',
            icon: CreditCard,
        },
    ];

    if (transaction.paymentChannel) {
        detailRows.push({
            label: 'Kanal Pembayaran',
            value: transaction.paymentChannel,
            icon: QrCode,
        });
    }

    if (transaction.tripayReference) {
        detailRows.push({
            label: 'Tripay Reference',
            value: transaction.tripayReference,
            icon: Hash,
        });
    }

    detailRows.push({
        label: 'Status',
        value: (
            <Badge
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle.pill}`}
            >
                {transaction.status}
            </Badge>
        ),
        icon: Banknote,
    });

    if (paidAtLabel) {
        detailRows.push({
            label: 'Dibayar pada',
            value: paidAtLabel,
            icon: CalendarCheck,
        });
    }

    if (expiredAtLabel) {
        detailRows.push({
            label: 'Kadaluarsa',
            value: expiredAtLabel,
            icon: Clock,
        });
    }

    const timelineItems = [
        {
            title: 'Invoice dibuat',
            timestamp: createdAtLabel,
            description: 'Transaksi berhasil tercatat di sistem',
        },
        {
            title: 'Pembayaran diterima',
            timestamp: paidAtLabel ?? 'Belum dibayar',
            description: paidAtLabel
                ? 'Pembayaran sudah diverifikasi'
                : 'Menunggu konfirmasi pembayaran',
        },
        {
            title: 'Kadaluarsa',
            timestamp: expiredAtLabel ?? 'Belum kadaluarsa',
            description: expiredAtLabel
                ? 'Transaksi melewati batas waktu'
                : 'Masih dalam periode aktif',
        },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Histori Transaksi', href: '/dashboard/transactions' },
                { title: transaction.invoiceNumber, href: `/dashboard/transactions/${transaction.id}` },
            ]}
        >
            <Head title={`Transaksi ${transaction.invoiceNumber}`} />

            <div className="space-y-6 pb-16">
                <Card className="border border-muted-foreground/20 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-6 py-6 sm:px-8">
                        <div className="space-y-2">
                            <p className="text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">Transaksi</p>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2.3rem]">
                                {transaction.invoiceNumber}
                            </h1>
                            <p className="max-w-xl text-sm text-muted-foreground">
                                Lihat status pembayaran, instruksi, dan detail transaksi kelas Anda.
                            </p>
                        </div>
                        <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground sm:items-end">
                            <Badge className={`rounded-full border px-4 py-1 text-sm font-semibold capitalize ${statusStyle.pill}`}>
                                {transaction.status}
                            </Badge>
                            <span>Dibuat pada {createdAtLabel}</span>
                        </div>
                    </div>
                    <div className="grid gap-6 bg-white p-6 sm:p-8 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-slate-500">
                                            Total yang harus dibayar
                                        </p>
                                        <p className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                                            {currency.format(totalToPay)}
                                        </p>
                                    </div>
                                    {transaction.paymentUrl && !isPaid ? (
                                        <Button asChild size="lg">
                                            <a href={transaction.paymentUrl} target="_blank" rel="noopener noreferrer">
                                                Bayar Sekarang
                                            </a>
                                        </Button>
                                    ) : null}
                                </div>

                                <div className="mt-6 space-y-3 text-sm">
                                    {breakdown.map((item) => (
                                        <div key={item.label} className="flex items-center justify-between">
                                            <span className="text-slate-500">{item.label}</span>
                                            <span className="font-semibold text-slate-900">{item.value}</span>
                                        </div>
                                    ))}
                                    {transaction.adminFee ? (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Biaya Admin</span>
                                            <span className="font-semibold text-slate-900">
                                                {currency.format(transaction.adminFee)}
                                            </span>
                                        </div>
                                    ) : null}
                                    <Separator className="my-4" />
                                    <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                                        <span>Total Pembayaran</span>
                                        <span>{currency.format(totalToPay)}</span>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="grid gap-3">
                                    {detailRows.map((item) => (
                                        <InfoRow key={item.label} label={item.label} value={item.value} icon={item.icon} />
                                    ))}
                                </div>
                            </div>
                            <Card className="border border-slate-200 bg-slate-50/60">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-semibold text-slate-900">
                                        Timeline Transaksi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    {timelineItems.map((item, index) => (
                                        <div key={item.title} className="relative pl-6 text-sm">
                                            {index !== timelineItems.length - 1 ? (
                                                <span className="absolute left-1 top-5 h-full w-px bg-slate-200" />
                                            ) : null}
                                            <span className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-[#2547F9]" />
                                            <div className="font-semibold text-slate-900">{item.title}</div>
                                            <div className="text-xs text-muted-foreground">{item.timestamp}</div>
                                            <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <aside className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-4">
                                    {courseImage ? (
                                        <img
                                            src={courseImage}
                                            alt={courseTitle}
                                            className="h-16 w-16 rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500">
                                            {courseInitials}
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <h2 className="text-base font-semibold text-slate-900">
                                            {courseSlug ? (
                                                <Link
                                                    href={`/courses/${courseSlug}`}
                                                    className="transition-colors hover:text-[#2547F9]"
                                                    prefetch
                                                >
                                                    {courseTitle}
                                                </Link>
                                            ) : (
                                                courseTitle
                                            )}
                                        </h2>
                                        <p className="text-xs text-slate-500">Invoice: {transaction.invoiceNumber}</p>
                                    </div>
                                </div>

                                {courseSlug ? (
                                    <Button asChild variant="outline">
                                        <Link href={`/courses/${courseSlug}`} prefetch>
                                            Buka Halaman Kelas
                                        </Link>
                                    </Button>
                                ) : null}

                                <Button
                                    asChild
                                    variant="secondary"
                                    className="rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                    <Link href={`/dashboard/transactions/${transaction.id}/invoice`} prefetch>
                                        Unduh Invoice
                                    </Link>
                                </Button>
                            </div>

                            <Card className="border border-slate-200 bg-white">
                                <CardContent className="space-y-3 p-4 text-sm text-slate-600">
                                    <p className="font-semibold text-slate-900">Butuh bantuan?</p>
                                    <p>
                                        Hubungi tim dukungan kami melalui{' '}
                                        <Link
                                            href="/contact-us"
                                            className="font-semibold text-[#2547F9] hover:underline"
                                        >
                                            halaman kontak
                                        </Link>{' '}
                                        atau WhatsApp yang tertera pada detail pembayaran.
                                    </p>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </Card>

                {renderInstructions(transaction.paymentInstructions)}
            </div>
        </AppLayout>
    );
}

function InfoRow({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: ReactNode;
    icon?: LucideIcon;
}) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-sm">
            {Icon ? (
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200">
                    <Icon className="h-4 w-4" />
                </span>
            ) : null}
            <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold text-slate-900">{value}</span>
            </div>
        </div>
    );
}

function renderInstructions(instructions?: TripayInstruction[] | null) {
    if (!instructions || instructions.length === 0) {
        return null;
    }

    return (
        <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle>Instruksi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {instructions.map((instruction) => (
                    <div key={instruction.title} className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5">
                        <h3 className="text-base font-semibold text-slate-900">{instruction.title}</h3>
                        <ol className="space-y-2 text-sm text-slate-600">
                            {instruction.steps.map((step, index) => (
                                <li key={index} className="flex gap-3">
                                    <span className="font-semibold text-slate-500">{index + 1}.</span>
                                    <span dangerouslySetInnerHTML={{ __html: step }} />
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
