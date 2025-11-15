import { CrudActions } from '@/components/table-actions';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Image as ImageIcon, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface NewsCategory {
    id: number;
    name: string;
    slug: string;
    image: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    categories: NewsCategory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Blog', href: '/admin/news' },
    { title: 'Kategori Blog', href: '/admin/news-categories' },
];

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

export default function NewsCategoriesIndex({ categories }: Props) {
    const page = usePage();
    const flash = (
        page.props as { flash?: { success?: string; error?: string } }
    ).flash;

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<NewsCategory | null>(null);
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

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        createForm.post('/admin/news-categories', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Kategori blog berhasil ditambahkan!');
                setCreateOpen(false);
                createForm.reset();
                setCreatePreview(null);
                router.reload({ only: ['categories'] });
            },
            onError: () => {
                toast.error('Gagal menambahkan kategori blog.');
            },
        });
    };

    const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedCategory) return;

        editForm.put(`/admin/news-categories/${selectedCategory.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Kategori blog berhasil diperbarui!');
                setEditOpen(false);
                editForm.reset();
                setEditPreview(null);
                router.reload({ only: ['categories'] });
            },
            onError: () => {
                toast.error('Gagal memperbarui kategori blog.');
            },
        });
    };

    const handleDelete = () => {
        if (!selectedCategory) return;

        router.delete(`/admin/news-categories/${selectedCategory.id}`, {
            onSuccess: () => {
                toast.success('Kategori blog berhasil dihapus!');
                setDeleteOpen(false);
                setSelectedCategory(null);
            },
            onError: () => {
                toast.error('Gagal menghapus kategori blog.');
            },
        });
    };

    const openCreateDialog = () => {
        createForm.reset();
        setCreatePreview(null);
        setCreateOpen(true);
    };

    const openEditDialog = (category: NewsCategory) => {
        setSelectedCategory(category);
        editForm.setData({
            name: category.name,
            image: null,
        });
        setEditPreview(category.image_url);
        setEditOpen(true);
    };

    const columns = useMemo<ColumnDef<NewsCategory>[]>(
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
                    <div className="flex items-center justify-center">
                        {row.original.image_url ? (
                            <img
                                src={row.original.image_url}
                                alt={row.original.name}
                                className="h-16 w-16 rounded-md object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-muted-foreground/50 bg-muted/30">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                ),
                enableSorting: false,
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
                        Nama
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {row.original.slug}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'created_at',
                header: 'Dibuat',
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {formatDateTime(row.original.created_at)}
                    </span>
                ),
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
                                onDelete={() => {
                                    setSelectedCategory(category);
                                    setDeleteOpen(true);
                                }}
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
            <Head title="Kategori Blog" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Kategori Blog
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola kategori untuk mengelompokkan artikel blog
                            Anda.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog} className="gap-2">
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

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tambah Kategori</DialogTitle>
                        <DialogDescription>
                            Buat kategori baru untuk artikel blog.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-name">Nama</Label>
                                <Input
                                    id="create-name"
                                    value={createForm.data.name}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'name',
                                            event.target.value,
                                        )
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
                                <Label htmlFor="create-image">Gambar</Label>
                                <Input
                                    id="create-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file =
                                            event.target.files?.[0] ?? null;
                                        createForm.setData('image', file);
                                        if (file) {
                                            setCreatePreview(
                                                URL.createObjectURL(file),
                                            );
                                        } else {
                                            setCreatePreview(null);
                                        }
                                    }}
                                />
                                {createPreview ? (
                                    <img
                                        src={createPreview}
                                        alt="Pratinjau gambar"
                                        className="h-40 w-full rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/50 text-sm text-muted-foreground">
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        Belum ada gambar dipilih
                                    </div>
                                )}
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

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Kategori</DialogTitle>
                        <DialogDescription>
                            Perbarui detail kategori blog.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nama</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-image">Gambar</Label>
                                <Input
                                    id="edit-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file =
                                            event.target.files?.[0] ?? null;
                                        editForm.setData('image', file);
                                        if (file) {
                                            setEditPreview(
                                                URL.createObjectURL(file),
                                            );
                                        } else {
                                            setEditPreview(
                                                selectedCategory?.image_url ?? null,
                                            );
                                        }
                                    }}
                                />
                                {editPreview ? (
                                    <img
                                        src={editPreview}
                                        alt="Pratinjau gambar"
                                        className="h-40 w-full rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/50 text-sm text-muted-foreground">
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        Belum ada gambar
                                    </div>
                                )}
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
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

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
