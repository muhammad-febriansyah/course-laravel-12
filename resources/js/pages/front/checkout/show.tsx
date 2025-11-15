import { PageHeader } from '@/components/site/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HomeLayout from '@/layouts/home-layout';
import type { Course } from '@/types/course';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

interface TripayChannel {
    code: string;
    name: string;
    group?: string | null;
    feeCustomer: number;
    feeMerchant: number;
    iconUrl?: string | null;
}

interface CheckoutPageProps {
    course: Course;
    promos: { id: number; name: string; code: string; discount: number }[];
    alreadyEnrolled: boolean;
    tripayChannels: TripayChannel[];
    settings?: {
        fee?: string | number | null;
    } | null;
}

const parseAdminFeePercentage = (value: unknown): number => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.min(Math.max(value, 0), 100) / 100;
    }

    if (typeof value === 'string') {
        const sanitized = value
            .replace(/[^0-9,\.]/g, '')
            .replace(/\./g, '')
            .replace(/,/g, '.');

        const parsed = Number.parseFloat(sanitized);
        if (Number.isFinite(parsed)) {
            return Math.min(Math.max(parsed, 0), 100) / 100;
        }
    }

    return 0;
};

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export default function CheckoutPage({ course, promos, alreadyEnrolled, tripayChannels, settings }: CheckoutPageProps) {
    const defaultMethod = tripayChannels.length ? 'tripay' : 'cash';
    const defaultChannel = tripayChannels[0]?.code ?? '';

    const { data, setData, post, processing, errors } = useForm({
        payment_method: defaultMethod,
        payment_channel: defaultChannel,
        promo_code: '',
    });

    const appliedPromo = data.promo_code
        ? promos.find((promo) => promo.code.toLowerCase() === data.promo_code.toLowerCase())
        : null;

    const promoDiscount = appliedPromo?.discount ?? 0;
    const baseTotal = Math.max(course.finalPrice - promoDiscount, 0);

    const adminFeePercentage = useMemo(() => parseAdminFeePercentage(settings?.fee), [settings?.fee]);
    const adminFeeValue = useMemo(
        () => Math.max(0, Math.round(baseTotal * adminFeePercentage)),
        [baseTotal, adminFeePercentage],
    );
    const adminFee = data.payment_method === 'tripay' ? adminFeeValue : 0;
    const grandTotal = baseTotal + adminFee;

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/checkout/${course.slug}`);
    };

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const method = event.target.value as 'cash' | 'tripay';
        setData('payment_method', method);

        if (method === 'tripay' && !data.payment_channel && tripayChannels[0]) {
            setData('payment_channel', tripayChannels[0].code);
        }
    };

    const disableForm = alreadyEnrolled || processing;

    return (
        <>
            <Head title={`Checkout - ${course.title}`} />

            <PageHeader
                title="Checkout"
                description="Selesaikan pembayaran untuk mendapatkan akses penuh ke materi kelas."
            />

            <main className="-mt-12 pb-20 sm:-mt-16 sm:pb-24">
                <div className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-8 px-4 sm:mt-12 sm:px-6 lg:px-8">
                    {alreadyEnrolled ? (
                        <Card className="border-amber-400/60 bg-amber-50 shadow-sm">
                            <CardContent className="flex flex-col gap-3 p-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between">
                                <span className="font-semibold">Kamu sudah terdaftar di kursus ini.</span>
                                <Button variant="outline" size="sm" asChild>
                                    <a href="/dashboard">Pergi ke Dashboard</a>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : null}

                    <div className="grid gap-8 rounded-[32px] border border-slate-100 bg-white/95 p-6 shadow-xl backdrop-blur sm:gap-10 sm:p-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-12 lg:p-14">
                        <form onSubmit={submit} className="space-y-6">
                            <Card className="border-slate-200/70 shadow-sm">
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-xl font-semibold text-slate-900">
                                        Pilih Metode Pembayaran
                                    </CardTitle>
                                    <p className="text-sm text-slate-500">
                                        Sesuaikan dengan kebutuhanmu. Tripay menyediakan channel pembayaran otomatis.
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {[
                                            {
                                                id: 'payment-cash',
                                                label: 'Transfer Manual',
                                                description:
                                                    'Konfirmasi pembayaran dilakukan oleh tim kami secara manual.',
                                                value: 'cash' as const,
                                                disabled: disableForm,
                                            },
                                            {
                                                id: 'payment-tripay',
                                                label: 'Tripay (VA / QRIS)',
                                                description:
                                                    'Instruksi pembayaran otomatis dengan notifikasi instan dari Tripay.',
                                                value: 'tripay' as const,
                                                disabled: disableForm || tripayChannels.length === 0,
                                            },
                                        ].map((option) => {
                                            const isActive = data.payment_method === option.value;
                                            return (
                                                <label
                                                    key={option.id}
                                                    htmlFor={option.id}
                                                    className={[
                                                        'flex h-full cursor-pointer flex-col justify-between rounded-2xl border px-5 py-4 transition-all',
                                                        isActive
                                                            ? 'border-primary bg-primary/5 ring-2 ring-primary/10 shadow-sm'
                                                            : 'border-slate-200 hover:border-primary/40',
                                                    ].join(' ')}
                                                >
                                                    <div className="space-y-2">
                                                        <p className="text-base font-semibold text-slate-900">
                                                            {option.label}
                                                        </p>
                                                        <p className="text-sm leading-relaxed text-slate-500">
                                                            {option.description}
                                                        </p>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            {option.value === 'tripay' ? 'Rekomendasi' : 'Manual'}
                                                        </span>
                                                        <input
                                                            type="radio"
                                                            id={option.id}
                                                            name="payment_method"
                                                            value={option.value}
                                                            checked={isActive}
                                                            onChange={handlePaymentMethodChange}
                                                            disabled={option.disabled}
                                                            className="size-4 accent-primary"
                                                        />
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {errors.payment_method ? (
                                        <p className="text-sm text-red-500">{errors.payment_method}</p>
                                    ) : null}

                                    {data.payment_method === 'tripay' ? (
                                        tripayChannels.length ? (
                                            <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-inner">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            Kanal Pembayaran
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Pilih opsi yang paling nyaman untukmu.
                                                        </p>
                                                    </div>
                                                    <Badge className="rounded-full bg-primary/10 text-primary">
                                                        {tripayChannels.length} pilihan tersedia
                                                    </Badge>
                                                </div>
                                                <div className="grid gap-3 md:grid-cols-2">
                                                    {tripayChannels.map((channel) => {
                                                        const isActive = data.payment_channel === channel.code;
                                                        return (
                                                            <button
                                                                type="button"
                                                                key={channel.code}
                                                                onClick={() => setData('payment_channel', channel.code)}
                                                                disabled={disableForm}
                                                                className={[
                                                                    'flex h-full flex-col items-start gap-2 rounded-2xl border px-4 py-3 text-left transition-all',
                                                                    isActive
                                                                        ? 'border-primary bg-primary/5 shadow-sm'
                                                                        : 'border-slate-200 hover:border-primary/40',
                                                                ].join(' ')}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    {channel.iconUrl ? (
                                                                        <img
                                                                            src={channel.iconUrl}
                                                                            alt={channel.name}
                                                                            className="h-8 w-8 rounded-lg object-contain"
                                                                        />
                                                                    ) : (
                                                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                                                                            {channel.code.slice(0, 2).toUpperCase()}
                                                                        </span>
                                                                    )}
                                                                    <div>
                                                                        <p className="text-sm font-semibold text-slate-900">
                                                                            {channel.name}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500">
                                                                            {channel.group ?? 'Online Payment'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {errors.payment_channel ? (
                                                    <p className="text-sm text-red-500">{errors.payment_channel}</p>
                                                ) : null}
                                            </div>
                                        ) : (
                                            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                                Kanal pembayaran Tripay belum tersedia. Silakan gunakan transfer manual.
                                            </p>
                                        )
                                    ) : null}
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/70 shadow-sm">
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-xl font-semibold text-slate-900">
                                        Gunakan Kode Promo
                                    </CardTitle>
                                    <p className="text-sm text-slate-500">
                                        Masukkan kode promo untuk menikmati potongan harga tambahan.
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="promo_code">Kode Promo</Label>
                                        <Input
                                            id="promo_code"
                                            value={data.promo_code}
                                            onChange={(event) => setData('promo_code', event.target.value)}
                                            placeholder="KODEPROMO"
                                            disabled={disableForm}
                                        />
                                        {errors.promo_code ? (
                                            <p className="text-sm text-red-500">{errors.promo_code}</p>
                                        ) : null}
                                    </div>

                                    {promos.length ? (
                                        <div className="space-y-3 rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                                Promo Tersedia
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {promos.map((promo) => (
                                                    <Badge
                                                        key={promo.id}
                                                        className="cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition"
                                                        variant={data.promo_code === promo.code ? 'default' : 'secondary'}
                                                        onClick={() => {
                                                            if (disableForm) return;
                                                            setData('promo_code', promo.code);
                                                        }}
                                                    >
                                                        {promo.code}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500">
                                            Belum ada promo aktif untuk saat ini. Nantikan promo menarik lainnya.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/70 shadow-sm">
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-xl font-semibold text-slate-900">
                                        Ringkasan Pembayaran
                                    </CardTitle>
                                    <p className="text-sm text-slate-500">
                                        Periksa kembali total biaya sebelum melanjutkan pembayaran.
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                                        <InfoRow label="Harga Kelas" value={currency.format(course.finalPrice)} />
                                        <InfoRow
                                            label="Diskon"
                                            value={`- ${currency.format(promoDiscount)}`}
                                            valueClassName="text-red-500"
                                        />
                                        {adminFee ? (
                                            <InfoRow
                                                label="Biaya Admin"
                                                value={currency.format(adminFee)}
                                                valueClassName="text-slate-900"
                                            />
                                        ) : null}
                                        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                                            <span>Total Dibayar</span>
                                            <span>{currency.format(grandTotal)}</span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-xs text-primary">
                                        Pembayaran Tripay akan mengarahkanmu ke halaman instruksi otomatis. Pastikan
                                        menyelesaikan pembayaran sebelum waktu kedaluwarsa.
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={disableForm}>
                                        {processing ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>

                        <aside className="space-y-6">
                            <Card className="overflow-hidden border-slate-200/70 shadow-sm">
                                {course.image ? (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                                        <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-2 text-xs">
                                            {course.category ? (
                                                <Badge className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-900">
                                                    {course.category.name}
                                                </Badge>
                                            ) : null}
                                            {course.level ? (
                                                <Badge className="rounded-full bg-primary/90 px-3 py-1 text-[11px] font-semibold text-white">
                                                    {course.level.name}
                                                </Badge>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}
                                <CardHeader className="space-y-3">
                                    <CardTitle className="text-xl font-semibold text-slate-900">
                                        {course.title}
                                    </CardTitle>
                                    <p className="text-sm leading-relaxed text-slate-500">{course.shortDescription}</p>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-slate-600">
                                    <div className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                                        <InfoRow label="Dilihat" value={`${course.views.toLocaleString('id-ID')} kali`} />
                                        {course.type ? (
                                            <InfoRow label="Tipe Kelas" value={course.type.name} />
                                        ) : null}
                                        <InfoRow label="Level" value={course.level?.name ?? 'Semua level'} />
                                    </div>
                                    {course.benefits?.length ? (
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Apa yang kamu dapatkan
                                            </p>
                                            <ul className="space-y-2 text-sm text-slate-600">
                                                {course.benefits?.slice(0, 4).map((benefit) => (
                                                    <li key={benefit} className="flex items-start gap-2">
                                                        <span className="mt-1 size-1.5 rounded-full bg-primary" />
                                                        <span>{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}
                                </CardContent>
                            </Card>

                            <Card className="border-primary/20 bg-primary/5 shadow-sm">
                                <CardContent className="space-y-4 p-5 text-sm text-primary">
                                    <p className="text-base font-semibold">
                                        Butuh bantuan terkait pembayaran?
                                    </p>
                                    <p>
                                        Tim support kami siap membantu. Kirim pesan melalui WhatsApp atau email ke
                                        support@skillup.id.
                                    </p>
                                    <Button variant="outline" size="sm" className="border-primary text-primary" asChild>
                                        <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                                            Hubungi Support
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}

function InfoRow({
    label,
    value,
    valueClassName,
}: {
    label: string;
    value: React.ReactNode;
    valueClassName?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">{label}</span>
            <span className={['font-semibold text-slate-900', valueClassName ?? ''].join(' ').trim()}>{value}</span>
        </div>
    );
}

CheckoutPage.layout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;
