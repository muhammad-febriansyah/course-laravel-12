import { RichTextEditor } from '@/components/rich-text-editor';
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
import { Badge } from '@/components/ui/badge';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Image as ImageIcon, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
}

interface Post {
    id: number;
    category_id: number;
    category?: Category | null;
    title: string;
    slug: string;
    desc: string;
    body: string;
    image: string | null;
    status: boolean | number;
    views: number;
    created_at: string;
}

interface Props {
    posts: Post[];
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blog',
        href: '/admin/news',
    },
];

const STATUS_META: Record<
    number,
    {
        label: string;
        variant: 'default' | 'secondary' | 'outline';
    }
> = {
    1: { label: 'Dipublikasikan', variant: 'default' },
    0: { label: 'Draft', variant: 'secondary' },
};

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

export default function NewsIndex({ posts, categories }: Props) {
    const page = usePage();
    const flash = (
        page.props as { flash?: { success?: string; error?: string } }
    ).flash;

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const [createPreview, setCreatePreview] = useState<string | null>(null);
    const [editPreview, setEditPreview] = useState<string | null>(null);

    const resolveImageUrl = (path: string | null | undefined) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('blob:')) {
            return path;
        }
        if (path.startsWith('/')) {
            return path;
        }

        const normalized = path.replace(/^\/+/, '');

        if (normalized.startsWith('images/')) {
            return `/${normalized}`;
        }

        if (normalized.startsWith('storage/')) {
            return `/${normalized}`;
        }

        return `/storage/${normalized}`;
    };

    const createForm = useForm({
        category_id: categories[0] ? String(categories[0].id) : '',
        title: '',
        desc: '',
        body: '',
        status: '0',
        image: null as File | null,
    });

    const editForm = useForm({
        category_id: '',
        title: '',
        desc: '',
        body: '',
        status: '0',
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

    const sanitizeCreatePayload = (data: typeof createForm.data) => ({
        category_id: data.category_id,
        title: data.title,
        desc: data.desc,
        body: data.body,
        status: data.status,
        ...(data.image ? { image: data.image } : {}),
    });

    const sanitizeEditPayload = (data: typeof editForm.data) => ({
        category_id: data.category_id,
        title: data.title,
        desc: data.desc,
        body: data.body,
        status: data.status,
        ...(data.image ? { image: data.image } : {}),
    });

    const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        createForm.transform((data) => sanitizeCreatePayload(data));
        createForm.post('/admin/news', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Artikel blog berhasil ditambahkan!');
                setCreateOpen(false);
                createForm.reset();
                createForm.clearErrors();
                setCreatePreview(null);
                router.reload({ only: ['posts'] });
            },
            onError: () => {
                toast.error('Gagal menambahkan artikel blog.');
            },
            onFinish: () => {
                createForm.transform((data) => data);
            },
        });
    };

    const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedPost) return;

        editForm.transform((data) => ({
            ...sanitizeEditPayload(data),
            _method: 'PUT',
        }));
        editForm.post(`/admin/news/${selectedPost.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Artikel blog berhasil diperbarui!');
                setEditOpen(false);
                editForm.reset();
                editForm.clearErrors();
                setEditPreview(null);
                router.reload({ only: ['posts'] });
            },
            onError: () => {
                toast.error('Gagal memperbarui artikel blog.');
            },
            onFinish: () => {
                editForm.transform((data) => data);
            },
        });
    };

    const handleDelete = () => {
        if (!selectedPost) return;

        router.delete(`/admin/news/${selectedPost.id}`, {
            onSuccess: () => {
                toast.success('Artikel blog berhasil dihapus!');
                setDeleteOpen(false);
                setSelectedPost(null);
                router.reload({ only: ['posts'] });
            },
            onError: () => {
                toast.error('Gagal menghapus artikel blog.');
            },
        });
    };

    const openCreateDialog = () => {
        createForm.reset();
        createForm.clearErrors();
        setCreatePreview(null);
        setCreateOpen(true);
    };

    const openEditDialog = (post: Post) => {
        setSelectedPost(post);
        editForm.setData((formData) => ({
            ...formData,
            category_id: String(post.category_id),
            title: post.title ?? '',
            desc: post.desc ?? '',
            body: post.body ?? '',
            status: post.status ? '1' : '0',
            image: null,
        }));
        editForm.clearErrors();
        setEditPreview(resolveImageUrl(post.image));
        setEditOpen(true);
    };

    const openDeleteDialog = (post: Post) => {
        setSelectedPost(post);
        setDeleteOpen(true);
    };

    const columns = useMemo<ColumnDef<Post>[]>(
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
                        {row.original.image ? (
                            <img
                                src={resolveImageUrl(row.original.image)}
                                alt={row.original.title}
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
                        <span className="font-medium">
                            {row.original.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {row.original.slug}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'category',
                header: 'Kategori',
                cell: ({ row }) => (
                    <span>{row.original.category?.name ?? '—'}</span>
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const value =
                        typeof row.original.status === 'boolean'
                            ? Number(row.original.status)
                            : (row.original.status as number);
                    const meta = STATUS_META[value] ?? STATUS_META[0];

                    return <Badge variant={meta.variant}>{meta.label}</Badge>;
                },
            },
            {
                accessorKey: 'views',
                header: 'Dilihat',
                cell: ({ row }) => <span>{row.original.views ?? 0}</span>,
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
                    const post = row.original;
                    return (
                        <div className="flex justify-end">
                            <CrudActions
                                detailHref={`/admin/news/${post.id}`}
                                onEdit={() => openEditDialog(post)}
                                onDelete={() => openDeleteDialog(post)}
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
            <Head title="Kelola Blog" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Kelola Blog
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Buat, ubah, dan kelola artikel blog untuk platform
                            Anda.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateDialog}
                        className="gap-2"
                        disabled={categories.length === 0}
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Artikel
                    </Button>
                </div>

                {categories.length === 0 && (
                    <div className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 p-4 text-sm text-muted-foreground">
                        Tambahkan kategori berita terlebih dahulu sebelum
                        membuat artikel blog.
                    </div>
                )}

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Daftar Artikel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={posts}
                            searchKey="title"
                            searchPlaceholder="Cari artikel..."
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl lg:max-w-5xl">
                    <DialogHeader>
                        <DialogTitle>Tambah Artikel</DialogTitle>
                        <DialogDescription>
                            Publikasikan konten baru untuk blog Anda.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-category">
                                    Kategori
                                </Label>
                                <Select
                                    value={createForm.data.category_id}
                                    onValueChange={(value) =>
                                        createForm.setData('category_id', value)
                                    }
                                >
                                    <SelectTrigger id="create-category">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={String(category.id)}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {createForm.errors.category_id && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-title">Judul</Label>
                                <Input
                                    id="create-title"
                                    value={createForm.data.title}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'title',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Masukkan judul artikel"
                                />
                                {createForm.errors.title && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-desc">
                                    Deskripsi Singkat
                                </Label>
                                <Textarea
                                    id="create-desc"
                                    value={createForm.data.desc}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'desc',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Tulis ringkasan singkat artikel"
                                    rows={3}
                                />
                                {createForm.errors.desc && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.desc}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Konten</Label>
                                <RichTextEditor
                                    content={createForm.data.body}
                                    onChange={(content) =>
                                        createForm.setData('body', content)
                                    }
                                    placeholder="Tulis konten lengkap artikel"
                                />
                                {createForm.errors.body && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.body}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={createForm.data.status}
                                    onValueChange={(value) =>
                                        createForm.setData('status', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            Dipublikasikan
                                        </SelectItem>
                                        <SelectItem value="0">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                                {createForm.errors.status && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.status}
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
                                    createForm.clearErrors();
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
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl lg:max-w-5xl">
                    <DialogHeader>
                        <DialogTitle>Edit Artikel</DialogTitle>
                        <DialogDescription>
                            Perbarui detail artikel blog Anda.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Kategori</Label>
                                <Select
                                    value={editForm.data.category_id}
                                    onValueChange={(value) =>
                                        editForm.setData('category_id', value)
                                    }
                                >
                                    <SelectTrigger id="edit-category">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={String(category.id)}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editForm.errors.category_id && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-title">Judul</Label>
                                <Input
                                    id="edit-title"
                                    value={editForm.data.title}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'title',
                                            event.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.title && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-desc">
                                    Deskripsi Singkat
                                </Label>
                                <Textarea
                                    id="edit-desc"
                                    value={editForm.data.desc}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'desc',
                                            event.target.value,
                                        )
                                    }
                                    rows={3}
                                />
                                {editForm.errors.desc && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.desc}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Konten</Label>
                                <RichTextEditor
                                    content={editForm.data.body}
                                    onChange={(content) =>
                                        editForm.setData('body', content)
                                    }
                                    placeholder="Tulis konten lengkap artikel"
                                />
                                {editForm.errors.body && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.body}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={editForm.data.status}
                                    onValueChange={(value) =>
                                        editForm.setData('status', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            Dipublikasikan
                                        </SelectItem>
                                        <SelectItem value="0">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editForm.errors.status && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.status}
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
                                                resolveImageUrl(
                                                    selectedPost?.image,
                                                ),
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
                                    editForm.clearErrors();
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
                        <AlertDialogTitle>Hapus Artikel</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus artikel "
                            {selectedPost?.title}"? Tindakan ini tidak dapat
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
