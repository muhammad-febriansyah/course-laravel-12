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

interface TypeItem {
    id: number;
    name: string;
    slug: string;
    image: string;
    created_at: string;
}

interface Props {
    types: TypeItem[];
}

const resolveImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('blob:')) {
        return path;
    }

    if (path.startsWith('/')) {
        return path;
    }

    const normalized = path.replace(/^\/+/, '');

    if (normalized.startsWith('storage/')) {
        return `/${normalized}`;
    }

    if (normalized.startsWith('images/')) {
        return `/${normalized}`;
    }

    return `/storage/${normalized}`;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tipe Kelas',
        href: '/types',
    },
];

const formatDateTime = (value: string) => {
    return new Date(value).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

export default function Index({ types }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<TypeItem | null>(null);
    const [createPreview, setCreatePreview] = useState<string | null>(null);
    const [editPreview, setEditPreview] = useState<string | null>(null);

    const createForm = useForm({
        name: '',
        image: null as File | null,
    });

    const editForm = useForm({
        name: '',
        image: null as File | null,
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createForm.post('/admin/types', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Tipe kelas berhasil ditambahkan!');
                setCreateOpen(false);
                createForm.reset();
                setCreatePreview(null);
            },
            onError: () => {
                toast.error('Gagal menambahkan tipe kelas');
            },
        });
    };

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedType) return;

        editForm.transform((data) => {
            const formData = new FormData();
            formData.append('name', data.name);
            if (data.image) {
                formData.append('image', data.image);
            }
            formData.append('_method', 'PUT');
            return formData as any;
        });

        editForm.post(`/admin/types/${selectedType.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Tipe kelas berhasil diperbarui!');
                setEditOpen(false);
                editForm.reset();
                setEditPreview(null);
            },
            onError: () => {
                toast.error('Gagal memperbarui tipe kelas');
            },
        });
    };

    const handleDelete = () => {
        if (!selectedType) return;

        router.delete(`/admin/types/${selectedType.id}`, {
            onSuccess: () => {
                toast.success('Tipe kelas berhasil dihapus!');
                setDeleteOpen(false);
                setSelectedType(null);
            },
            onError: () => {
                toast.error('Gagal menghapus tipe kelas');
            },
        });
    };

    const openCreateDialog = () => {
        setCreatePreview(null);
        createForm.reset();
        setCreateOpen(true);
    };

    const openEditDialog = (type: TypeItem) => {
        setSelectedType(type);
        editForm.setData({
            name: type.name,
            image: null,
        });
        setEditPreview(resolveImageUrl(type.image));
        setEditOpen(true);
    };

    const openDeleteDialog = (type: TypeItem) => {
        setSelectedType(type);
        setDeleteOpen(true);
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        form: typeof createForm | typeof editForm,
        setPreview: (value: string | null) => void,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const columns: ColumnDef<TypeItem>[] = useMemo(
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
                accessorKey: 'image',
                header: 'Gambar',
                cell: ({ row }) => (
                    <div className="flex items-center">
                        <div className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-white shadow-md">
                            <img
                                src={resolveImageUrl(row.getValue<string | null>('image')) ?? ''}
                                alt={row.getValue('name')}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                ),
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
                        Nama Tipe
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue('name')}</div>
                ),
            },
            {
                accessorKey: 'slug',
                header: 'Slug',
                cell: ({ row }) => (
                    <div className="text-muted-foreground">
                        {row.getValue('slug')}
                    </div>
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
                const type = row.original;
                return (
                    <div className="flex justify-end">
                        <CrudActions
                            onEdit={() => openEditDialog(type)}
                            onDelete={() => openDeleteDialog(type)}
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
            <Head title="Tipe Kelas" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Kelola Tipe Kelas
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Buat, ubah, dan kelola tipe kelas di platform.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Tipe
                    </Button>
                </div>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Daftar Tipe Kelas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={types}
                            searchKey="name"
                            searchPlaceholder="Cari tipe kelas..."
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Tipe Kelas</DialogTitle>
                        <DialogDescription>
                            Buat tipe kelas baru untuk mempermudah pengelompokan kursus
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-name">Nama Tipe</Label>
                                <Input
                                    id="create-name"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama tipe kelas"
                                />
                                {createForm.errors.name && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Gambar</Label>
                                {createPreview && (
                                    <div className="mb-2">
                                        <img
                                            src={createPreview}
                                            alt="Preview"
                                            className="h-32 w-32 rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="create-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleImageChange(
                                            e,
                                            createForm,
                                            setCreatePreview,
                                        )
                                    }
                                />
                                {createForm.errors.image && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.image}
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
                                    setCreatePreview(null);
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
                        <DialogTitle>Edit Tipe Kelas</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi tipe kelas
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nama Tipe</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama tipe kelas"
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Gambar</Label>
                                {editPreview && (
                                    <div className="mb-2">
                                        <img
                                            src={editPreview}
                                            alt="Preview"
                                            className="h-32 w-32 rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="edit-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleImageChange(
                                            e,
                                            editForm,
                                            setEditPreview,
                                        )
                                    }
                                />
                                <p className="text-sm text-muted-foreground">
                                    Kosongkan jika tidak ingin mengubah gambar
                                </p>
                                {editForm.errors.image && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.image}
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
                                    setEditPreview(null);
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
                        <AlertDialogTitle>Hapus Tipe Kelas</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus tipe "
                            {selectedType?.name}"? Tindakan ini tidak dapat
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
