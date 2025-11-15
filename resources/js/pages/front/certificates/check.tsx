import { PageHeader } from '@/components/site/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import HomeLayout from '@/layouts/home-layout';
import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    FileText,
    GraduationCap,
    HelpCircle,
    ShieldCheck,
    Sparkles,
    UserCheck,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface SettingsPayload {
    site_name?: string | null;
}

interface CertificateCheckPageProps {
    settings?: SettingsPayload | null;
}

const sampleCertificates = [
    {
        code: 'SKILLUP-2024-0001',
        name: 'Ayu Pratiwi',
        course: 'Fundamental Pengembangan Web Modern',
        issuedAt: '12 Januari 2024',
        mentor: 'Dimas Mahendra',
        status: 'Valid',
    },
    {
        code: 'SKILLUP-2024-0002',
        name: 'Rangga Saputra',
        course: 'UI/UX Design untuk Produk Digital',
        issuedAt: '21 Februari 2024',
        mentor: 'Salsa Putri',
        status: 'Valid',
    },
];

const verificationSteps = [
    {
        title: 'Masukkan kode sertifikat',
        description: 'Salin kode unik yang tertera pada sertifikat digital kamu.',
    },
    {
        title: 'Sistem melakukan validasi',
        description: 'Platform {brand} otomatis mengecek keabsahan kode pada basis data resmi.',
    },
    {
        title: 'Lihat detail sertifikat',
        description: 'Jika valid, tampilkan peserta, kelas, mentor, serta tanggal penerbitan.',
    },
];

const supportHighlights = [
    {
        icon: FileText,
        title: 'Download PDF resmi',
        description: 'Unduh sertifikat berkualitas tinggi lengkap dengan QR validator.',
    },
    {
        icon: Sparkles,
        title: 'Bagikan ke LinkedIn',
        description: 'Publikasikan tautan verifikasi untuk memperkuat personal branding.',
    },
    {
        icon: UserCheck,
        title: 'Mudah diverifikasi HR',
        description: 'Perekrut dapat mengecek keaslian sertifikat kamu secara instan.',
    },
];

export default function CheckCertificatePage({ settings }: CertificateCheckPageProps) {
    const [certificateCode, setCertificateCode] = useState('');

    const organization = settings?.site_name ?? 'SkillUp Academy';
    const placeholderCode = useMemo(() => sampleCertificates[0]?.code ?? 'SKILLUP-2024-0001', []);

    return (
        <HomeLayout>
            <Head title="Cek Sertifikat" />

            <PageHeader
                title="Cek Sertifikat"
                description="Verifikasi keaslian sertifikat digital peserta secara instan dan pastikan pencapaianmu diakui."
            />

            <main className="-mt-12 bg-slate-50 pb-24 pt-12 sm:-mt-16 sm:pt-16">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
                    {/* Hero / Form */}
                    <section className="grid gap-8 rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-2xl sm:p-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:p-12">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Badge className="w-fit bg-primary/10 text-primary">
                                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                                        <GraduationCap className="h-3.5 w-3.5" />
                                        Verifikasi Resmi {organization}
                                    </span>
                                </Badge>
                                <div className="space-y-2">
                                    <h1 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
                                        Masukkan kode sertifikatmu
                                    </h1>
                                    <p className="max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                                        Salin kode yang tertera pada sertifikat digital atau PDF kamu. Sistem akan menampilkan status dan detail jika kode tersebut terdaftar.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                                <Input
                                    value={certificateCode}
                                    onChange={(event) => setCertificateCode(event.target.value)}
                                    placeholder={`Contoh: ${placeholderCode}`}
                                    className="h-12 rounded-xl border-slate-300 bg-white text-base shadow-sm focus-visible:ring-primary"
                                />
                                <Button type="button" className="h-12 rounded-xl px-6 text-sm font-semibold tracking-wide">
                                    Cek Sertifikat
                                </Button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                                    <p className="text-xs uppercase tracking-wide text-slate-400">Tips cepat</p>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                        Gunakan fitur copy pada sertifikat digital agar kode yang dimasukkan tidak salah ketik.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                                    <p className="text-xs uppercase tracking-wide text-slate-400">Butuh bantuan?</p>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                        Tim sertifikasi kami siap membantu pengesahan manual untuk kebutuhan perusahaan atau instansi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-slate-900">
                                        Cara kerja verifikasi
                                    </CardTitle>
                                    <CardDescription className="text-sm leading-relaxed text-slate-500">
                                        Prosesnya sederhana namun akurat untuk memastikan sertifikatmu sah.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <ol className="space-y-4">
                                        {verificationSteps.map((step, index) => (
                                            <li key={step.title} className="flex items-start gap-4">
                                                <span className="mt-1 flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                    {index + 1}
                                                </span>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                                                    <p className="text-xs text-slate-500">{step.description.replace('{brand}', organization)}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                    <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs leading-relaxed text-primary">
                                        Sertifikat dengan kode valid akan menampilkan badge hijau "Valid" lengkap dengan detail peserta dan kelas yang ditempuh.
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-slate-900">
                                        Waktu verifikasi cepat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    {[
                                        { label: 'Rata-rata durasi', value: '< 3 detik' },
                                        { label: 'Total sertifikat aktif', value: '15.200+' },
                                        { label: 'Pengguna diverifikasi', value: '98% peserta' },
                                        { label: 'Tersedia 24/7', value: 'Tanpa batasan waktu' },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm">
                                            <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                                            <p className="mt-2 text-base font-semibold text-slate-900">{item.value}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Sample certificate & support */}
                    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
                        <Card className="rounded-[28px] border border-slate-200 bg-white shadow-xl">
                            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-slate-900">Contoh hasil verifikasi</CardTitle>
                                    <CardDescription className="text-sm leading-relaxed text-slate-500">
                                        Begini tampilan informasi ketika kode sertifikat dinyatakan valid oleh sistem kami.
                                    </CardDescription>
                                </div>
                                <Badge className="rounded-full bg-emerald-100 text-emerald-700">Valid</Badge>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {sampleCertificates.map((item) => (
                                    <div
                                        key={item.code}
                                        className="rounded-2xl border border-slate-200 bg-white/75 p-5 shadow-sm shadow-primary/5 transition hover:border-primary/50"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-400">Kode Sertifikat</p>
                                                <p className="text-base font-semibold text-slate-900">{item.code}</p>
                                            </div>
                                            <Badge className="rounded-full bg-primary/10 text-primary">{item.status}</Badge>
                                        </div>
                                        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-xs uppercase tracking-wide text-slate-400">Nama Peserta</dt>
                                                <dd className="text-sm font-medium text-slate-900">{item.name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs uppercase tracking-wide text-slate-400">Tanggal Terbit</dt>
                                                <dd className="text-sm font-medium text-slate-900">{item.issuedAt}</dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-xs uppercase tracking-wide text-slate-400">Kelas</dt>
                                                <dd className="text-sm font-medium text-slate-900">{item.course}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs uppercase tracking-wide text-slate-400">Mentor</dt>
                                                <dd className="text-sm font-medium text-slate-900">{item.mentor}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="rounded-[28px] border border-slate-200 bg-white/95 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-slate-900">Manfaatkan sertifikatmu</CardTitle>
                                    <CardDescription className="text-sm leading-relaxed text-slate-500">
                                        Jadikan hasil verifikasi sebagai nilai tambah pada portofolio profesionalmu.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {supportHighlights.map(({ icon: Icon, title, description }) => (
                                        <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4">
                                            <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-slate-900">{title}</p>
                                                <p className="text-xs leading-relaxed text-slate-500">{description}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-primary">
                                        Tip: bagikan tautan verifikasi ke HR agar mereka dapat memastikan keaslian sertifikatmu secara instan.
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[28px] border border-slate-200 bg-white/95 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-slate-900">Perlu bantuan manual?</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm leading-relaxed text-slate-600">
                                    <p>
                                        Tim sertifikasi kami siap membantu memastikan validitas sertifikat untuk kebutuhan instansi pendidikan, perusahaan, maupun beasiswa.
                                    </p>
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button variant="default" className="h-11 flex-1 rounded-xl px-6 text-sm font-semibold" asChild>
                                            <a href="mailto:support@skillup.id" className="flex items-center justify-center gap-2">
                                                <ShieldCheck className="h-4 w-4" />
                                                Hubungi Tim Sertifikasi
                                            </a>
                                        </Button>
                                        <Button variant="outline" className="h-11 flex-1 rounded-xl px-6 text-sm font-semibold" asChild>
                                            <a href="/faq" className="flex items-center justify-center gap-2">
                                                <HelpCircle className="h-4 w-4" />
                                                Pusat Bantuan
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* CTA banner */}
                    <section className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-xl sm:p-10">
                        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
                            <div className="space-y-4">
                                <Badge className="w-fit bg-primary/10 text-primary">
                                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                                        <Zap className="h-3.5 w-3.5" />
                                        Rekomendasi penggunaan
                                    </span>
                                </Badge>
                                <h2 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
                                    Tingkatkan kredibilitas dengan sertifikat terverifikasi
                                </h2>
                                <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
                                    Bagikan hasil verifikasi kepada rekan kerja, HR, atau klien sehingga mereka yakin terhadap kompetensi yang telah kamu pelajari di {organization}.
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button variant="default" className="h-11 rounded-xl px-6 text-sm font-semibold" asChild>
                                        <a href="#" className="flex items-center justify-center gap-2">
                                            <ArrowRight className="h-4 w-4" />
                                            Salin tautan validasi
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="h-11 rounded-xl px-6 text-sm font-semibold" asChild>
                                        <a href="#" className="flex items-center justify-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Panduan sertifikat
                                        </a>
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {sampleCertificates.slice(0, 2).map((item) => (
                                    <div key={item.code} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                                        <p className="text-xs uppercase tracking-wide text-slate-400">Kode</p>
                                        <p className="text-sm font-semibold text-slate-900">{item.code}</p>
                                        <p className="mt-3 text-xs text-slate-500">Peserta</p>
                                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                        <p className="mt-2 text-xs text-slate-500">Kelas</p>
                                        <p className="text-sm font-semibold text-slate-900">{item.course}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </HomeLayout>
    );
}
