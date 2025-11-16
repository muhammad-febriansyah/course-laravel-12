import { PageHeader } from '@/components/site/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import HomeLayout from '@/layouts/home-layout';
import { Head, router } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle,
    FileText,
    GraduationCap,
    HelpCircle,
    Loader2,
    ShieldCheck,
    Sparkles,
    UserCheck,
    XCircle,
    Zap,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import axios from 'axios';

interface SettingsPayload {
    site_name?: string | null;
}

interface CertificateCheckPageProps {
    settings?: SettingsPayload | null;
}

interface CertificateData {
    code: string;
    name: string;
    course: string;
    issuedAt: string;
    mentor: string;
    status: string;
    completedAt?: string;
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
    const [isLoading, setIsLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState<{
        success: boolean;
        message: string;
        data?: CertificateData;
    } | null>(null);

    const organization = settings?.site_name ?? 'SkillUp Academy';
    const placeholderCode = useMemo(() => sampleCertificates[0]?.code ?? 'SKILLUP-2024-0001', []);

    const handleVerifyCertificate = async (e: FormEvent) => {
        e.preventDefault();

        if (!certificateCode.trim()) {
            setVerificationResult({
                success: false,
                message: 'Mohon masukkan kode sertifikat.',
            });
            return;
        }

        setIsLoading(true);
        setVerificationResult(null);

        try {
            const response = await axios.post('/api/certificates/verify', {
                code: certificateCode.trim(),
            });

            setVerificationResult({
                success: true,
                message: response.data.message,
                data: response.data.data,
            });
        } catch (error: any) {
            setVerificationResult({
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat memverifikasi sertifikat.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <HomeLayout>
            <Head title="Cek Sertifikat" />

            <PageHeader
                title="Cek Sertifikat"
                description="Verifikasi keaslian sertifikat digital peserta secara instan dan pastikan pencapaianmu diakui."
            />

            <main className="bg-slate-50 pb-24 pt-12 sm:pt-16">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
                    {/* Hero / Form */}
                    <section className="grid gap-8 rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-2xl sm:p-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:p-12">
                        <div className="space-y-6">
                            {/* Header with Gradient Blur Effect */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 p-8 sm:p-10">
                                {/* Blur Orbs */}
                                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
                                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-indigo-400/20 blur-3xl" />
                                <div className="absolute right-1/3 top-1/2 h-24 w-24 rounded-full bg-purple-400/15 blur-2xl" />

                                {/* Content */}
                                <div className="relative z-10 space-y-4">
                                    <Badge className="w-fit border-blue-200 bg-white/80 text-blue-700 shadow-sm backdrop-blur-sm">
                                        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                                            <GraduationCap className="h-3.5 w-3.5" />
                                            Verifikasi Resmi {organization}
                                        </span>
                                    </Badge>
                                    <div className="space-y-3">
                                        <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-4xl">
                                            Masukkan kode sertifikatmu
                                        </h1>
                                        <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                                            Salin kode yang tertera pada sertifikat digital atau PDF kamu. Sistem akan menampilkan status dan detail jika kode tersebut terdaftar.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form with Enhanced Styling */}
                            <form onSubmit={handleVerifyCertificate} className="space-y-3">
                                <div className="relative">
                                    <Input
                                        value={certificateCode}
                                        onChange={(event) => setCertificateCode(event.target.value)}
                                        placeholder={`Contoh: ${placeholderCode}`}
                                        className="h-14 rounded-2xl border-2 border-slate-200 bg-white pl-5 pr-5 text-base font-medium shadow-lg shadow-blue-500/5 transition-all duration-200 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-4 focus-visible:ring-blue-100 disabled:opacity-60 sm:text-lg"
                                        disabled={isLoading}
                                    />
                                    {!certificateCode && (
                                        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5" />
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-bold tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-60 sm:text-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Memverifikasi...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="mr-2 h-5 w-5" />
                                            Verifikasi Sertifikat
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Verification Result */}
                            {verificationResult && (
                                <div className={`rounded-2xl border p-4 shadow-sm ${
                                    verificationResult.success
                                        ? 'border-emerald-200 bg-emerald-50'
                                        : 'border-red-200 bg-red-50'
                                }`}>
                                    <div className="flex items-start gap-3">
                                        {verificationResult.success ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <p className={`font-semibold ${
                                                verificationResult.success ? 'text-emerald-900' : 'text-red-900'
                                            }`}>
                                                {verificationResult.message}
                                            </p>
                                            {verificationResult.success && verificationResult.data && (
                                                <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-4">
                                                    <dl className="grid gap-3 sm:grid-cols-2">
                                                        <div>
                                                            <dt className="text-xs uppercase tracking-wide text-slate-400">Kode Sertifikat</dt>
                                                            <dd className="text-sm font-semibold text-slate-900">{verificationResult.data.code}</dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-xs uppercase tracking-wide text-slate-400">Status</dt>
                                                            <dd>
                                                                <Badge className="rounded-full bg-emerald-100 text-emerald-700">{verificationResult.data.status}</Badge>
                                                            </dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-xs uppercase tracking-wide text-slate-400">Nama Peserta</dt>
                                                            <dd className="text-sm font-medium text-slate-900">{verificationResult.data.name}</dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-xs uppercase tracking-wide text-slate-400">Tanggal Terbit</dt>
                                                            <dd className="text-sm font-medium text-slate-900">{verificationResult.data.issuedAt}</dd>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <dt className="text-xs uppercase tracking-wide text-slate-400">Kelas</dt>
                                                            <dd className="text-sm font-medium text-slate-900">{verificationResult.data.course}</dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-xs uppercase tracking-wide text-slate-400">Mentor</dt>
                                                            <dd className="text-sm font-medium text-slate-900">{verificationResult.data.mentor}</dd>
                                                        </div>
                                                    </dl>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tips Section */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
                                    <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-blue-400/10 blur-2xl transition-all duration-200 group-hover:bg-blue-400/20" />
                                    <div className="relative">
                                        <div className="mb-2 flex items-center gap-2">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100">
                                                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                                            </div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Tips cepat</p>
                                        </div>
                                        <p className="text-sm leading-relaxed text-slate-600">
                                            Gunakan fitur copy pada sertifikat digital agar kode yang dimasukkan tidak salah ketik.
                                        </p>
                                    </div>
                                </div>
                                <div className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
                                    <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-indigo-400/10 blur-2xl transition-all duration-200 group-hover:bg-indigo-400/20" />
                                    <div className="relative">
                                        <div className="mb-2 flex items-center gap-2">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100">
                                                <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
                                            </div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Butuh bantuan?</p>
                                        </div>
                                        <p className="text-sm leading-relaxed text-slate-600">
                                            Tim sertifikasi kami siap membantu pengesahan manual untuk kebutuhan perusahaan atau instansi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Enhanced Verification Steps Card */}
                            <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 shadow-xl">
                                {/* Decorative Blur Orbs */}
                                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
                                <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />

                                <div className="relative z-10 p-8">
                                    {/* Header */}
                                    <div className="mb-6 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                                                <ShieldCheck className="h-5 w-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900">
                                                Cara kerja verifikasi
                                            </h3>
                                        </div>
                                        <p className="pl-12 text-sm leading-relaxed text-slate-600">
                                            Prosesnya sederhana namun akurat untuk memastikan sertifikatmu sah.
                                        </p>
                                    </div>

                                    {/* Steps */}
                                    <ol className="space-y-5">
                                        {verificationSteps.map((step, index) => (
                                            <li key={step.title} className="group flex items-start gap-4">
                                                <div className="relative">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/30">
                                                        {index + 1}
                                                    </div>
                                                    {index < verificationSteps.length - 1 && (
                                                        <div className="absolute left-1/2 top-12 h-5 w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-300 to-transparent" />
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-1 pt-1">
                                                    <p className="font-semibold text-slate-900">{step.title}</p>
                                                    <p className="text-sm leading-relaxed text-slate-600">{step.description.replace('{brand}', organization)}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>

                                    {/* Info Banner */}
                                    <div className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            <p className="text-xs leading-relaxed text-emerald-800">
                                                Sertifikat dengan kode valid akan menampilkan badge hijau "Valid" lengkap dengan detail peserta dan kelas yang ditempuh.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </HomeLayout>
    );
}
