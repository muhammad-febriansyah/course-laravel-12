import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import {
    Plus,
    Pencil,
    Trash2,
    ArrowUpDown,
    Check,
    X as XIcon,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Category {
    id: number;
    name: string;
}

interface Type {
    id: number;
    name: string;
}

interface Level {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface Kelas {
    id: number;
    title: string;
    slug: string;
    price: number;
    discount: number;
    status: string;
    views: number;
    image: string | null;
    category: Category;
    type: Type;
    level: Level;
    user?: User;
    created_at: string;
    total_sales?: number;
    total_revenue?: number | string;
}

interface Props {
    kelas: Kelas[];
    categories: Category[];
    types: Type[];
    levels: Level[];
    canManage: boolean;
    isMentor?: boolean;
    canReview?: boolean;
    basePath?: string;
}

const STATUS_LABEL: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
    draft: { label: 'Draft', variant: 'secondary' },
    pending: { label: 'Menunggu', variant: 'outline' },
    approved: { label: 'Disetujui', variant: 'default' },
    published: { label: 'Disetujui', variant: 'default' },
    rejected: { label: 'Ditolak', variant: 'destructive' },
};

const formatCurrency = (value: number | string | undefined) => {
    if (value === undefined || value === null) {
        return 'Rp 0';
    }

    const numeric = typeof value === 'string' ? Number.parseFloat(value) : value;
    return `Rp ${Number(numeric || 0).toLocaleString('id-ID')}`;
};

const resolveImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('blob:')) {
        return path;
    }
    return `/storage/${path}`;
};

export default function KelasIndex({
    kelas,
    categories,
    types,
    levels,
    canManage,
    isMentor = false,
    canReview = false,
    basePath = '/admin/kelas',
}: Props) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
    const [approvingId, setApprovingId] = useState<number | null>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);

    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [levelFilter, setLevelFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const filteredData = useMemo(() => {
        return kelas.filter((item) => {
            const matchCategory =
                categoryFilter === 'all' || item.category.id === Number(categoryFilter);
            const matchType =
                typeFilter === 'all' || item.type.id === Number(typeFilter);
            const matchLevel =
                levelFilter === 'all' || item.level.id === Number(levelFilter);
            const matchStatus =
                statusFilter === 'all' || item.status === statusFilter;

            return matchCategory && matchType && matchLevel && matchStatus;
        });
    }, [kelas, categoryFilter, typeFilter, levelFilter, statusFilter]);

    const summary = useMemo(() => {
        if (!isMentor) return null;
        const totalSales = filteredData.reduce((sum, item) => {
            const sales = Number(item.total_sales ?? 0);
            return sum + sales;
        }, 0);
        const totalRevenue = filteredData.reduce(
            (sum, item) => sum + Number(item.total_revenue ?? 0),
            0,
        );
        return {
            totalClass: filteredData.length,
            totalSales: totalSales.toLocaleString('id-ID'),
            totalRevenue: formatCurrency(totalRevenue),
        };
    }, [filteredData, isMentor]);

    const handleDelete = () => {
        if (!selectedKelas) return;

        router.delete(`${basePath}/${selectedKelas.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                toast.success('Kelas berhasil dihapus.');
            },
            onError: () => {
                toast.error('Gagal menghapus kelas.');
            },
        });
    };

    const handleApprove = useCallback((item: Kelas) => {
        if (approvingId) return;
        setApprovingId(item.id);
        router.post(
            `${basePath}/${item.id}/approve`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Kelas disetujui.'),
                onError: () => toast.error('Gagal menyetujui kelas.'),
                onFinish: () => setApprovingId(null),
            },
        );
    }, [approvingId, basePath]);

    const handleReject = useCallback((item: Kelas) => {
        const reason = window.prompt('Masukkan alasan penolakan (opsional):', '');
        setRejectingId(item.id);
        router.post(
            `${basePath}/${item.id}/reject`,
            { reason },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Kelas ditolak.'),
                onError: () => toast.error('Gagal menolak kelas.'),
                onFinish: () => setRejectingId(null),
            },
        );
    }, [basePath]);

    const columns = useMemo<ColumnDef<Kelas>[]>(() => {
        const baseColumns: ColumnDef<Kelas>[] = [
            {
                header: '#',
                cell: ({ row }) => row.index + 1,
                enableSorting: false,
                size: 40,
            },
            {
                accessorKey: 'image',
                header: 'Gambar',
                enableSorting: false,
                cell: ({ row }) => {
                    const imageUrl = resolveImageUrl(row.original.image);
                    return (
                        <div className="flex items-center justify-center">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={row.original.title}
                                    className="h-16 w-24 rounded-md object-cover"
                                />
                            ) : (
                                <div className="h-16 w-24 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'title',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="-ml-4 hover:bg-transparent"
                    >
                        Judul
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.title}</span>
                        <span className="text-xs text-muted-foreground">
                            {row.original.category.name}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'type.name',
                header: 'Tipe',
                cell: ({ row }) => row.original.type.name,
            },
            {
                accessorKey: 'level.name',
                header: 'Level',
                cell: ({ row }) => row.original.level.name,
            },
            {
                accessorKey: 'price',
                header: 'Harga',
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium">
                            {formatCurrency(row.original.price)}
                        </span>
                        {row.original.discount > 0 && (
                            <span className="text-xs text-green-600">
                                Diskon: {formatCurrency(row.original.discount)}
                            </span>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const meta = STATUS_LABEL[row.original.status] ?? STATUS_LABEL.draft;
                    return <Badge variant={meta.variant}>{meta.label}</Badge>;
                },
            },
        ];

        if (isMentor) {
            baseColumns.push(
                {
                    id: 'sales',
                    header: 'Penjualan',
                    cell: ({ row }) => (
                        <div className="flex flex-col text-sm">
                            <span className="font-medium">
                                {row.original.total_sales ?? 0} transaksi
                            </span>
                            <span className="text-muted-foreground">
                                {formatCurrency(row.original.total_revenue)}
                            </span>
                        </div>
                    ),
                },
            );
        }

        if (canManage) {
            baseColumns.push({
                id: 'actions',
                header: 'Aksi',
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            asChild
                            className="bg-amber-500 text-white hover:bg-amber-600"
                        >
                            <Link href={`${basePath}/${row.original.id}/edit`}>
                                <Pencil className="h-4 w-4" /> Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                setSelectedKelas(row.original);
                                setDeleteOpen(true);
                            }}
                        >
                            <Trash2 className="h-4 w-4" /> Hapus
                        </Button>
                    </div>
                ),
            });
        } else if (canReview) {
            baseColumns.push({
                id: 'review',
                header: 'Review',
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-2">
                        <Button
                            className="bg-green-600 text-white hover:bg-green-700"
                            size="sm"
                            disabled={approvingId === row.original.id}
                            onClick={() => handleApprove(row.original)}
                        >
                            <Check className="mr-2 h-4 w-4" /> Terima
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={rejectingId === row.original.id}
                            onClick={() => handleReject(row.original)}
                        >
                            <XIcon className="mr-2 h-4 w-4" /> Tolak
                        </Button>
                        <Button
                            size="sm"
                            asChild
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            <Link href={`${basePath}/${row.original.id}`}>
                                <Eye className="h-4 w-4" /> Detail
                            </Link>
                        </Button>
                    </div>
                ),
            });
        } else {
            baseColumns.push({
                id: 'detail',
                header: 'Detail',
                enableSorting: false,
                cell: ({ row }) => (
                    <Button size="sm" asChild className="bg-blue-600 text-white hover:bg-blue-700">
                        <Link href={`${basePath}/${row.original.id}`}>
                            <Eye className="h-4 w-4" /> Detail
                        </Link>
                    </Button>
                ),
            });
        }

        return baseColumns;
    }, [approvingId, basePath, canManage, canReview, handleApprove, handleReject, rejectingId, isMentor]);

    const resetFilters = () => {
        setCategoryFilter('all');
        setTypeFilter('all');
        setLevelFilter('all');
        setStatusFilter('all');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelas', href: basePath }]}>
            <Head title={isMentor ? 'Kelas Saya' : 'Kelas'} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {isMentor ? 'Kelas Saya' : 'Kelola Kelas'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isMentor
                                ? 'Kelola konten kelas dan pantau performa penjualannya.'
                                : 'Tinjau kelas yang dibuat oleh para mentor.'}
                        </p>
                    </div>
                    {canManage && (
                        <Button asChild className="gap-2">
                            <Link href={`${basePath}/create`}>
                                <Plus className="h-4 w-4" /> Tambah Kelas
                            </Link>
                        </Button>
                    )}
                </div>

                {summary && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistik Penjualan</CardTitle>
                            <CardDescription>
                                Ringkasan performa kelas yang kamu kelola.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg border border-muted-foreground/20 p-4">
                                <p className="text-sm text-muted-foreground">Total Kelas</p>
                                <p className="text-2xl font-semibold">{summary.totalClass}</p>
                            </div>
                            <div className="rounded-lg border border-muted-foreground/20 p-4">
                                <p className="text-sm text-muted-foreground">Total Penjualan</p>
                                <p className="text-2xl font-semibold">{summary.totalSales}</p>
                            </div>
                            <div className="rounded-lg border border-muted-foreground/20 p-4">
                                <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                                <p className="text-2xl font-semibold">{summary.totalRevenue}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6">
                    <div className="space-y-6">
                        <Card className="border-muted-foreground/20">
                            <CardHeader>
                                <CardTitle>Filter</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Kategori
                                    </label>
                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Semua kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua kategori</SelectItem>
                                            {categories.map((item) => (
                                                <SelectItem key={item.id} value={String(item.id)}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Tipe
                                    </label>
                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Semua tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua tipe</SelectItem>
                                            {types.map((item) => (
                                                <SelectItem key={item.id} value={String(item.id)}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Level
                                    </label>
                                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Semua level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua level</SelectItem>
                                            {levels.map((item) => (
                                                <SelectItem key={item.id} value={String(item.id)}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Semua status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua status</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="pending">Menunggu</SelectItem>
                                            <SelectItem value="approved">Disetujui</SelectItem>
                                            <SelectItem value="rejected">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-4 flex justify-end">
                                    <Button variant="outline" onClick={resetFilters}>
                                        Reset
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-muted-foreground/20">
                            <CardHeader>
                                <CardTitle>Daftar Kelas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    columns={columns}
                                    data={filteredData}
                                    searchKey="title"
                                    searchPlaceholder="Cari berdasarkan judul"
                                />
                            </CardContent>
                        </Card>
                    </div>

                </div>

                {selectedKelas && (
                    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Kelas</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus kelas "
                                    {selectedKelas?.title}"? Tindakan ini tidak dapat dibatalkan dan akan
                                    menghapus materi terkait.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </AppLayout>
    );
}
