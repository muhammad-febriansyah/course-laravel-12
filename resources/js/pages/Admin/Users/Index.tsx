import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CrudActions } from '@/components/table-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { ManagedUser, UserCollection } from '@/types/user';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface UsersIndexPageProps {
    users: UserCollection;
    filters: {
        role?: string | null;
        status?: number | null;
    };
    roles: string[];
    flash?: {
        success?: string;
        error?: string;
    };
    errors?: Record<string, string>;
}

const STATUS_META: Record<
    number,
    {
        label: string;
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
    }
> = {
    1: { label: 'Aktif', variant: 'default' },
    0: { label: 'Nonaktif', variant: 'outline' },
};

const breadcrumbs = [{ title: 'Pengguna', href: '/admin/users' }];

export default function UsersIndexPage({
    users,
    filters,
    roles,
    flash,
    errors,
}: UsersIndexPageProps) {
    const [role, setRole] = useState(filters.role ?? 'all');
    const [status, setStatus] = useState(
        typeof filters.status === 'number' ? String(filters.status) : 'all',
    );

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error || errors?.error) {
            toast.error(flash?.error ?? errors?.error ?? 'Terjadi kesalahan');
        }
    }, [flash, errors]);

    const filteredData = useMemo(() => {
        return users.data.filter((user) => {
            const matchRole =
                role === 'all' ||
                (role === 'none' ? !user.role : user.role === role);
            const matchStatus =
                status === 'all' || user.status === Number.parseInt(status, 10);

            return matchRole && matchStatus;
        });
    }, [users, role, status]);

    const columns = useMemo<ColumnDef<ManagedUser>[]>(() => {
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
                id: 'avatar',
                header: 'Avatar',
                cell: ({ row }) => {
                    const initials = row.original.name
                        ? row.original.name
                              .trim()
                              .split(' ')
                              .slice(0, 2)
                              .map((part) => part.charAt(0).toUpperCase())
                              .join('') || 'USR'
                        : 'USR';

                    return (
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={row.original.avatar ?? undefined}
                                alt={row.original.name}
                            />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    );
                },
                enableSorting: false,
                enableHiding: false,
                size: 80,
            },
            {
                accessorKey: 'name',
                header: 'Nama',
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.name}</span>
                        <span className="text-xs text-muted-foreground">
                            ID #{row.original.id}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'phone',
                header: 'Telepon',
                cell: ({ row }) => row.original.phone ?? '—',
            },
            {
                accessorKey: 'address',
                header: 'Alamat',
                cell: ({ row }) => row.original.address ?? '—',
            },
            {
                accessorKey: 'role',
                header: 'Peran',
                cell: ({ row }) =>
                    row.original.role
                        ? row.original.role.charAt(0).toUpperCase() +
                          row.original.role.slice(1)
                        : '—',
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const meta =
                        STATUS_META[row.original.status] ?? STATUS_META[0];
                    return <Badge variant={meta.variant}>{meta.label}</Badge>;
                },
            },
            {
                accessorKey: 'createdAt',
                header: 'Dibuat',
            },
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }) => (
                    <CrudActions detailHref={`/admin/users/${row.original.id}`} />
                ),
                enableSorting: false,
            },
        ];
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Pengguna" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Kelola Pengguna
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Buat, ubah, dan kelola akun pengguna platform.
                        </p>
                    </div>
                    <Button asChild className="gap-2">
                        <Link href="/admin/users/create">
                            <Plus className="h-4 w-4" /> Tambah Pengguna
                        </Link>
                    </Button>
                </div>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Peran
                            </label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Semua peran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua peran
                                    </SelectItem>
                                    <SelectItem value="none">
                                        Tanpa peran
                                    </SelectItem>
                                    {roles.map((item) => (
                                        <SelectItem value={item} key={item}>
                                            {item.charAt(0).toUpperCase() +
                                                item.slice(1)}
                                        </SelectItem>
                                    ))}
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
                                    <SelectItem value="all">
                                        Semua status
                                    </SelectItem>
                                    <SelectItem value="1">Aktif</SelectItem>
                                    <SelectItem value="0">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end justify-end md:col-span-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setRole('all');
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
                        <CardTitle>Daftar Pengguna</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            searchKey="name"
                            searchPlaceholder="Cari berdasarkan nama"
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
