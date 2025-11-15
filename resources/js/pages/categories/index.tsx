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
import { useState } from 'react';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    created_at: string;
}

interface Props {
    categories: Category[];
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
        title: 'Kategori',
        href: '/categories',
    },
];

export default function Index({ categories }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    );
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const createForm = useForm({
        name: '',
        image: null as File | null,
    });

    const editForm = useForm({
        name: '',
        image: null as File | null,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/categories', {
            forceFormData: true,
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
                setImagePreview(null);
                toast.success('Kategori berhasil ditambahkan!');
            },
            onError: () => {
                toast.error('Gagal menambahkan kategori');
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory) return;

        editForm.post(`/admin/categories/${selectedCategory.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditOpen(false);
                editForm.reset();
                setImagePreview(null);
                toast.success('Kategori berhasil diperbarui!');
            },
            onError: () => {
                toast.error('Gagal memperbarui kategori');
            },
        });
    };

    const handleDelete = () => {
        if (!selectedCategory) return;

        router.delete(`/admin/categories/${selectedCategory.id}`, {
            onSuccess: () => {
                setDeleteOpen(false);
                setSelectedCategory(null);
                toast.success('Kategori berhasil dihapus!');
            },
            onError: () => {
                toast.error('Gagal menghapus kategori');
            },
        });
    };

    const openEditDialog = (category: Category) => {
        setSelectedCategory(category);
        editForm.setData({
            name: category.name,
            image: null,
        });
        setImagePreview(resolveImageUrl(category.image));
        setEditOpen(true);
    };

    const openDeleteDialog = (category: Category) => {
        setSelectedCategory(category);
        setDeleteOpen(true);
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        form: typeof createForm | typeof editForm,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const columns: ColumnDef<Category>[] = [
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
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        <div className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-white shadow-md">
                            <img
                                src={resolveImageUrl(row.getValue<string | null>('image')) ?? ''}
                                alt={row.getValue('name')}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="-ml-4 hover:bg-transparent"
                    >
                        Nama Kategori
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return (
                    <div className="font-medium">{row.getValue('name')}</div>
                );
            },
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }) => {
                return (
                    <div className="text-muted-foreground">
                        {row.getValue('slug')}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <div className="flex justify-end">
                        <CrudActions
                            onEdit={() => openEditDialog(category)}
                            onDelete={() => openDeleteDialog(category)}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Kelola Kategori
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Buat, ubah, dan kelola kategori kelas di platform.
                        </p>
                    </div>
                    <Button
                        onClick={() => setCreateOpen(true)}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Daftar Kategori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={categories}
                            searchKey="name"
                            searchPlaceholder="Cari kategori..."
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Kategori</DialogTitle>
                        <DialogDescription>
                            Buat kategori baru untuk kelas Anda
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-name">
                                    Nama Kategori
                                </Label>
                                <Input
                                    id="create-name"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama kategori"
                                />
                                {createForm.errors.name && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Gambar</Label>
                                {imagePreview && (
                                    <div className="mb-2">
                                        <img
                                            src={imagePreview}
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
                                        handleImageChange(e, createForm)
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
                                    setImagePreview(null);
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                {createForm.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Kategori</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi kategori
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nama Kategori</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama kategori"
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Gambar</Label>
                                {imagePreview && (
                                    <div className="mb-2">
                                        <img
                                            src={imagePreview}
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
                                        handleImageChange(e, editForm)
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
                                    setImagePreview(null);
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

            {/* Delete Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kategori "
                            {selectedCategory?.name}"? Tindakan ini tidak dapat
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
