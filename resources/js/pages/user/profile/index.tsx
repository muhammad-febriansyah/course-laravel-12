import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface ProfilePageProps {
    profile: {
        name: string;
        email: string;
        phone?: string | null;
        address?: string | null;
        avatar?: string | null;
        joinedAt?: string | null;
    };
    stats: {
        enrollmentCount: number;
        completedCount: number;
        totalSpent: number;
    };
}

export default function ProfilePage({ profile, stats }: ProfilePageProps) {
    const initials = profile.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Profil', href: '/dashboard/profile' },
            ]}
        >
            <Head title="Profil" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <Card className="border-slate-200">
                    <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="size-16 border-4 border-[#2547F9]/20">
                                {profile.avatar ? (
                                    <AvatarImage src={profile.avatar} alt={profile.name} />
                                ) : null}
                                <AvatarFallback className="bg-[#2547F9] text-lg font-semibold text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                                    {profile.name}
                                </h1>
                                <p className="text-sm text-slate-500">{profile.email}</p>
                                {profile.joinedAt ? (
                                    <p className="text-xs text-slate-400">
                                        Bergabung sejak {new Date(profile.joinedAt).toLocaleDateString('id-ID')}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild variant="outline" className="rounded-full border-[#2547F9] text-[#2547F9] hover:bg-[#2547F9]/10">
                                <Link href="/settings/profile">Ubah Profil</Link>
                            </Button>
                            <Button asChild className="rounded-full bg-[#2547F9] px-5 text-white hover:bg-[#1e3fd4]">
                                <Link href="/dashboard/transactions">Lihat Transaksi</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <section className="grid gap-4 sm:grid-cols-3">
                    {[
                        {
                            label: 'Total Kelas',
                            value: stats.enrollmentCount,
                            description: 'Jumlah kelas yang pernah kamu ikuti',
                        },
                        {
                            label: 'Kelas Selesai',
                            value: stats.completedCount,
                            description: 'Pembelajaran yang telah dituntaskan',
                        },
                        {
                            label: 'Total Pengeluaran',
                            value: `Rp ${stats.totalSpent.toLocaleString('id-ID')}`,
                            description: 'Investasi yang sudah kamu lakukan',
                        },
                    ].map((item) => (
                        <Card key={item.label} className="border-slate-200">
                            <CardContent className="space-y-2 p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    {item.label}
                                </p>
                                <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                                <p className="text-xs text-slate-500">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <Card className="border-slate-200">
                    <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <h2 className="text-sm font-semibold text-slate-500">Informasi Kontak</h2>
                            <Separator />
                            <p className="text-sm text-slate-700">
                                <span className="block text-xs uppercase tracking-wide text-slate-400">Email</span>
                                {profile.email ?? '-'}
                            </p>
                            <p className="text-sm text-slate-700">
                                <span className="block text-xs uppercase tracking-wide text-slate-400">Nomor Telepon</span>
                                {profile.phone ?? '-'}
                            </p>
                            <p className="text-sm text-slate-700">
                                <span className="block text-xs uppercase tracking-wide text-slate-400">Alamat</span>
                                {profile.address ?? '-'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-sm font-semibold text-slate-500">Keamanan Akun</h2>
                            <Separator />
                            <p className="text-sm text-slate-700">
                                Pastikan email dan kata sandi kamu selalu up-to-date untuk melindungi akun.
                            </p>
                        <Button asChild variant="outline" className="rounded-full border-slate-300 text-slate-600 hover:bg-slate-100">
                            <Link href="/settings/password">Ubah Kata Sandi</Link>
                        </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
