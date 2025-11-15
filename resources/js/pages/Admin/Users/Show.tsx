import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { ManagedUser } from '@/types/user';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

interface ShowUserPageProps {
    user: {
        data: ManagedUser;
        stats: {
            enrollments: number;
            transactions: number;
        };
    };
}

const STATUS_META: Record<number, { label: string; variant: 'default' | 'outline' }> = {
    1: { label: 'Aktif', variant: 'default' },
    0: { label: 'Nonaktif', variant: 'outline' },
};

export default function ShowUserPage({ user }: ShowUserPageProps) {
    const { flash, errors } = usePage<{ flash?: { success?: string; error?: string }; errors?: Record<string, string> }>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error || errors?.error) {
            toast.error(flash?.error ?? errors?.error ?? 'Terjadi kesalahan');
        }
    }, [flash, errors]);

    const details = [
        { label: 'Email', value: user.data.email },
        { label: 'Nomor Telepon', value: user.data.phone ?? '—' },
        { label: 'Alamat', value: user.data.address ?? '—' },
        {
            label: 'Peran',
            value: user.data.role ? user.data.role.charAt(0).toUpperCase() + user.data.role.slice(1) : '—',
        },
        { label: 'Dibuat', value: user.data.createdAt ?? '—' },
        { label: 'Diperbarui', value: user.data.updatedAt ?? '—' },
    ];

    const statusMeta = STATUS_META[user.data.status] ?? STATUS_META[0];

    const breadcrumbs = [
        { title: 'Pengguna', href: '/admin/users' },
        { title: user.data.name, href: `/admin/users/${user.data.id}` },
    ];

    const handleDelete = () => {
        if (confirm('Hapus pengguna ini? Tindakan tidak dapat dibatalkan.')) {
            router.delete(`/admin/users/${user.data.id}`);
        }
    };

    const initials = useMemo(() => {
        if (!user.data.name) {
            return 'USR';
        }

        const parts = user.data.name.trim().split(' ');
        const letters = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase());

        return letters.join('') || 'USR';
    }, [user.data.name]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${user.data.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{user.data.name}</h1>
                        <p className="text-sm text-muted-foreground">Informasi lengkap akun pengguna.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild className="gap-2">
                            <Link href={`/admin/users/${user.data.id}/edit`}>
                                <Edit className="h-4 w-4" /> Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" className="gap-2" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" /> Hapus
                        </Button>
                    </div>
                </div>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Profil</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Data utama pengguna dan status akun.
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user.data.avatar ?? undefined} alt={user.data.name} />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {details.map((item) => (
                            <div key={item.label}>
                                <p className="text-xs font-medium uppercase text-muted-foreground">
                                    {item.label}
                                </p>
                                <p className="text-sm text-foreground">{item.value}</p>
                                <Separator className="mt-3" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Statistik Aktivitas</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border bg-muted/20 p-4">
                            <p className="text-sm text-muted-foreground">Total Enrollment</p>
                            <p className="text-2xl font-semibold">
                                {user.stats.enrollments.toLocaleString('id-ID')}
                            </p>
                        </div>
                        <div className="rounded-xl border bg-muted/20 p-4">
                            <p className="text-sm text-muted-foreground">Total Transaksi</p>
                            <p className="text-2xl font-semibold">
                                {user.stats.transactions.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
