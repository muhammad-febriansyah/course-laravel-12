import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Plus, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { CrudActions } from '@/components/table-actions';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';

interface PromoCode {
    id: number;
    name: string;
    code: string;
    discount: number;
    status: boolean;
    image: string;
    created_at: string;
}

interface Props {
    promoCodes: PromoCode[];
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
        title: 'Kode Promo',
        href: '/promo-codes',
    },
];

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

export default function Index({ promoCodes }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(
        null,
    );
    const [createPreview, setCreatePreview] = useState<string | null>(null);
    const [editPreview, setEditPreview] = useState<string | null>(null);

    const createForm = useForm({
        name: '',
        code: '',
        discount: '',
        status: '1',
        image: null as File | null,
    });

    const editForm = useForm({
        name: '',
        code: '',
        discount: '',
        status: '1',
        image: null as File | null,
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createForm.post('/promo-codes', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Kode promo berhasil ditambahkan!');
                setCreateOpen(false);
                createForm.reset();
                setCreatePreview(null);
            },
            onError: () => {
                toast.error('Gagal menambahkan kode promo');
            },
        });
    };

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedPromoCode) return;

        editForm.put(`/promo-codes/${selectedPromoCode.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Kode promo berhasil diperbarui!');
                setEditOpen(false);
                editForm.reset();
                setEditPreview(null);
            },
            onError: () => {
                toast.error('Gagal memperbarui kode promo');
            },
        });
    };

    const handleDelete = () => {
        if (!selectedPromoCode) return;

        router.delete(`/promo-codes/${selectedPromoCode.id}`, {
            onSuccess: () => {
                toast.success('Kode promo berhasil dihapus!');
                setDeleteOpen(false);
                setSelectedPromoCode(null);
            },
            onError: () => {
                toast.error('Gagal menghapus kode promo');
            },
        });
    };

    const openCreateDialog = () => {
        createForm.reset();
        setCreatePreview(null);
        setCreateOpen(true);
    };

    const openEditDialog = (promoCode: PromoCode) => {
        setSelectedPromoCode(promoCode);
        editForm.setData({
            name: promoCode.name,
            code: promoCode.code,
            discount: String(promoCode.discount),
            status: promoCode.status ? '1' : '0',
            image: null,
        });
        setEditPreview(resolveImageUrl(promoCode.image));
        setEditOpen(true);
    };

    const openDeleteDialog = (promoCode: PromoCode) => {
        setSelectedPromoCode(promoCode);
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

    const columns: ColumnDef<PromoCode>[] = useMemo(
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
                        Nama Kode Promo
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue('name')}</div>
                ),
            },
            {
                accessorKey: 'code',
                header: 'Kode',
                cell: ({ row }) => (
                    <div className="font-mono text-sm">{row.getValue('code')}</div>
                ),
            },
            {
                accessorKey: 'discount',
                header: 'Diskon',
                cell: ({ row }) => (
                    <div className="font-medium">
                        {row.getValue('discount')}%
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const active = row.getValue<boolean>('status');
                    return (
                        <Badge variant={active ? 'default' : 'outline'}>
                            {active ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                    );
                },
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
                    const promoCode = row.original;
                    return (
                        <div className="flex justify-end">
                            <CrudActions
                                onEdit={() => openEditDialog(promoCode)}
                                onDelete={() => openDeleteDialog(promoCode)}
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
            <Head title="Kode Promo" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Kelola Kode Promo
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Buat, ubah, dan kelola kode promo di platform.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Kode Promo
                    </Button>
                </div>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Daftar Kode Promo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={promoCodes}
                            searchKey="name"
                            searchPlaceholder="Cari kode promo..."
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Kode Promo</DialogTitle>
                        <DialogDescription>
                            Buat kode promo baru untuk memberikan diskon
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-name">Nama Promo</Label>
                                <Input
                                    id="create-name"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama promo"
                                />
                                {createForm.errors.name && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-code">Kode Promo</Label>
                                <Input
                                    id="create-code"
                                    value={createForm.data.code}
                                    onChange={(e) =>
                                        createForm.setData('code', e.target.value.toUpperCase())
                                    }
                                    placeholder="Masukkan kode unik"
                                />
                                {createForm.errors.code && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.code}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="create-discount">Diskon (%)</Label>
                                    <Input
                                        id="create-discount"
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={createForm.data.discount}
                                        onChange={(e) =>
                                            createForm.setData('discount', e.target.value)
                                        }
                                        placeholder="Masukkan nilai diskon"
                                    />
                                    {createForm.errors.discount && (
                                        <p className="text-sm text-red-500">
                                            {createForm.errors.discount}
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
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Aktif</SelectItem>
                                            <SelectItem value="0">Tidak Aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {createForm.errors.status && (
                                        <p className="text-sm text-red-500">
                                            {createForm.errors.status}
                                        </p>
                                    )}
                                </div>
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
                        <DialogTitle>Edit Kode Promo</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi kode promo
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nama Promo</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama promo"
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-code">Kode Promo</Label>
                                <Input
                                    id="edit-code"
                                    value={editForm.data.code}
                                    onChange={(e) =>
                                        editForm.setData('code', e.target.value.toUpperCase())
                                    }
                                    placeholder="Masukkan kode unik"
                                />
                                {editForm.errors.code && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.code}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-discount">Diskon (%)</Label>
                                    <Input
                                        id="edit-discount"
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={editForm.data.discount}
                                        onChange={(e) =>
                                            editForm.setData('discount', e.target.value)
                                        }
                                        placeholder="Masukkan nilai diskon"
                                    />
                                    {editForm.errors.discount && (
                                        <p className="text-sm text-red-500">
                                            {editForm.errors.discount}
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
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Aktif</SelectItem>
                                            <SelectItem value="0">Tidak Aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.status && (
                                        <p className="text-sm text-red-500">
                                            {editForm.errors.status}
                                        </p>
                                    )}
                                </div>
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
                        <AlertDialogTitle>Hapus Kode Promo</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kode promo "
                            {selectedPromoCode?.name}"? Tindakan ini tidak dapat
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
