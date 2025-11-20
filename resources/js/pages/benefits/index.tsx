import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Plus, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { CrudActions } from '@/components/table-actions';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';

interface Benefit {
    id: number;
    name: string;
    created_at: string;
}

interface Props {
    benefits: Benefit[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Benefit',
        href: '/benefits',
    },
];

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

export default function Index({ benefits }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);

    const createForm = useForm({
        name: '',
    });

    const editForm = useForm({
        name: '',
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createForm.post('/admin/benefits', {
            onSuccess: () => {
                toast.success('Benefit berhasil ditambahkan!');
                setCreateOpen(false);
                createForm.reset();
            },
            onError: () => {
                toast.error('Gagal menambahkan benefit');
            },
        });
    };

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedBenefit) return;

        editForm.put(`/admin/benefits/${selectedBenefit.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Benefit berhasil diperbarui!');
                setEditOpen(false);
                editForm.reset();
            },
            onError: () => {
                toast.error('Gagal memperbarui benefit');
            },
        });
    };

    const handleDelete = () => {
        if (!selectedBenefit) return;

        router.delete(`/admin/benefits/${selectedBenefit.id}`, {
            onSuccess: () => {
                toast.success('Benefit berhasil dihapus!');
                setDeleteOpen(false);
                setSelectedBenefit(null);
            },
            onError: () => {
                toast.error('Gagal menghapus benefit');
            },
        });
    };

    const openCreateDialog = () => {
        createForm.reset();
        setCreateOpen(true);
    };

    const openEditDialog = (benefit: Benefit) => {
        setSelectedBenefit(benefit);
        editForm.setData({
            name: benefit.name,
        });
        setEditOpen(true);
    };

    const openDeleteDialog = (benefit: Benefit) => {
        setSelectedBenefit(benefit);
        setDeleteOpen(true);
    };

    const columns: ColumnDef<Benefit>[] = useMemo(
        () => [
            {
                id: 'index',
                header: '#',
                cell: ({ row, table }) => {
                    const pagination = table.getState().pagination;
                    const pageIndex = pagination?.pageIndex ?? 0;
                    const pageSize =
                        pagination?.pageSize ??
                        (table.getRowModel().rows.length || 1);
                    return (
                        <div className="w-10 text-right font-medium">
                            {pageIndex * pageSize + row.index + 1}
                        </div>
                    );
                },
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'name',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="-ml-4 hover:bg-transparent"
                    >
                        Nama Benefit
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue('name')}</div>
                ),
            },
            {
                accessorKey: 'created_at',
                header: 'Dibuat Pada',
                cell: ({ row }) => (
                    <div className="text-muted-foreground">
                        {formatDateTime(row.getValue('created_at'))}
                    </div>
                ),
            },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => {
                const benefit = row.original;
                return (
                    <div className="flex justify-end">
                        <CrudActions
                            onEdit={() => openEditDialog(benefit)}
                            onDelete={() => openDeleteDialog(benefit)}
                        />
                    </div>
                );
            },
        },
        ],
        [],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Benefit" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Kelola Benefit
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Buat, ubah, dan kelola benefit kursus di platform.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Benefit
                    </Button>
                </div>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Daftar Benefit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={benefits}
                            searchKey="name"
                            searchPlaceholder="Cari benefit..."
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Benefit</DialogTitle>
                        <DialogDescription>
                            Tambahkan benefit baru untuk kursus
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-name">Nama Benefit</Label>
                                <Input
                                    id="create-name"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama benefit"
                                />
                                {createForm.errors.name && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setCreateOpen(false);
                                    createForm.reset();
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Benefit</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi benefit kursus
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nama Benefit</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama benefit"
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditOpen(false);
                                    editForm.reset();
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Benefit</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus benefit "
                            {selectedBenefit?.name}"? Tindakan ini tidak dapat
                            dibatalkan.
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
        </AppLayout>
    );
}
