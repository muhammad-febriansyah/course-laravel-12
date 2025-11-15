import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import * as Icons from 'lucide-react';

interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
    order: number;
    is_active: boolean;
}

interface Props {
    features: Feature[];
}

export default function FeaturesIndex({ features }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

    const createForm = useForm({
        title: '',
        description: '',
        icon: '',
        order: features.length + 1,
        is_active: true,
    });

    const editForm = useForm({
        title: '',
        description: '',
        icon: '',
        order: 0,
        is_active: true,
    });

    const deleteForm = useForm({});
    const { delete: destroyFeature, processing: isDeleting } = deleteForm;

    // Get icon component dynamically
    const getIcon = (iconName: string) => {
        const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
        return IconComponent || Icons.HelpCircle;
    };

    const activeCount = features.filter((feature) => feature.is_active).length;
    const inactiveCount = features.length - activeCount;

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.features.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEdit = (feature: Feature) => {
        setEditingFeature(feature);
        editForm.setData({
            title: feature.title,
            description: feature.description,
            icon: feature.icon,
            order: feature.order,
            is_active: feature.is_active,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFeature) {
            editForm.put(route('admin.features.update', editingFeature.id), {
                onSuccess: () => {
                    setIsEditOpen(false);
                    setEditingFeature(null);
                    editForm.reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus feature ini?')) {
            return;
        }

        destroyFeature(route('admin.features.destroy', id), {
            preserveScroll: true,
        });
    };

    const columns: ColumnDef<Feature>[] = [
        {
            accessorKey: 'order',
            header: 'Urutan',
            cell: ({ row }) => (
                <span className="font-semibold text-foreground">
                    {row.getValue('order')}
                </span>
            ),
        },
        {
            accessorKey: 'icon',
            header: 'Icon',
            enableSorting: false,
            cell: ({ row }) => {
                const IconComponent = getIcon(row.original.icon);

                return (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <IconComponent className="h-5 w-5" />
                        </div>
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                            {row.original.icon}
                        </code>
                    </div>
                );
            },
        },
        {
            accessorKey: 'title',
            header: 'Judul',
            cell: ({ row }) => (
                <span className="font-medium text-foreground">
                    {row.getValue('title')}
                </span>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Deskripsi',
            enableSorting: false,
            cell: ({ row }) => (
                <p className="max-w-md text-sm text-muted-foreground line-clamp-2">
                    {row.getValue('description')}
                </p>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.original.is_active;
                const StatusIcon = isActive ? Eye : EyeOff;

                return (
                    <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4 text-muted-foreground" />
                        <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => (
                <div className="flex justify-end text-xs font-semibold uppercase text-muted-foreground">
                    Aksi
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            cell: ({ row }) => {
                const feature = row.original;

                return (
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(feature)}
                        >
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(feature.id)}
                            disabled={isDeleting}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout>
            <Head title="Kelola Features" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Kelola Features
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Tambah, edit, dan atur urutan fitur yang tampil di halaman beranda.
                            </p>
                        </div>
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Feature
                        </Button>
                    </div>

                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription>Total Features</CardDescription>
                                <CardTitle className="text-3xl">
                                    {features.length}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription>Aktif</CardDescription>
                                <CardTitle className="text-3xl text-green-600">
                                    {activeCount}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription>Nonaktif</CardDescription>
                                <CardTitle className="text-3xl text-gray-600">
                                    {inactiveCount}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Features</CardTitle>
                            <CardDescription>
                                Kelola fitur yang ditampilkan di halaman beranda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DataTable
                                columns={columns}
                                data={features}
                                searchKey="title"
                                searchPlaceholder="Cari feature..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Feature Baru</DialogTitle>
                            <DialogDescription>
                                Isi form di bawah untuk menambahkan feature baru
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-title">Judul</Label>
                                <Input
                                    id="create-title"
                                    value={createForm.data.title}
                                    onChange={(e) =>
                                        createForm.setData('title', e.target.value)
                                    }
                                    placeholder="Instruktur Berpengalaman"
                                    required
                                />
                                {createForm.errors.title && (
                                    <p className="text-sm text-red-600">
                                        {createForm.errors.title}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-description">Deskripsi</Label>
                                <Textarea
                                    id="create-description"
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData('description', e.target.value)
                                    }
                                    placeholder="Belajar langsung dari para ahli..."
                                    rows={3}
                                    required
                                />
                                {createForm.errors.description && (
                                    <p className="text-sm text-red-600">
                                        {createForm.errors.description}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-icon">Icon (Lucide Icon Name)</Label>
                                <Input
                                    id="create-icon"
                                    value={createForm.data.icon}
                                    onChange={(e) =>
                                        createForm.setData('icon', e.target.value)
                                    }
                                    placeholder="GraduationCap"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Lihat icon di:{' '}
                                    <a
                                        href="https://lucide.dev/icons"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        lucide.dev/icons
                                    </a>
                                </p>
                                {createForm.errors.icon && (
                                    <p className="text-sm text-red-600">
                                        {createForm.errors.icon}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-order">Urutan</Label>
                                <Input
                                    id="create-order"
                                    type="number"
                                    value={createForm.data.order}
                                    onChange={(e) =>
                                        createForm.setData('order', parseInt(e.target.value))
                                    }
                                    min="0"
                                    required
                                />
                                {createForm.errors.order && (
                                    <p className="text-sm text-red-600">
                                        {createForm.errors.order}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="create-active"
                                    checked={createForm.data.is_active}
                                    onCheckedChange={(checked) =>
                                        createForm.setData('is_active', checked)
                                    }
                                />
                                <Label htmlFor="create-active">Aktif</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
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

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Feature</DialogTitle>
                            <DialogDescription>
                                Update informasi feature
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">Judul</Label>
                                <Input
                                    id="edit-title"
                                    value={editForm.data.title}
                                    onChange={(e) =>
                                        editForm.setData('title', e.target.value)
                                    }
                                    required
                                />
                                {editForm.errors.title && (
                                    <p className="text-sm text-red-600">
                                        {editForm.errors.title}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">Deskripsi</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) =>
                                        editForm.setData('description', e.target.value)
                                    }
                                    rows={3}
                                    required
                                />
                                {editForm.errors.description && (
                                    <p className="text-sm text-red-600">
                                        {editForm.errors.description}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-icon">Icon (Lucide Icon Name)</Label>
                                <Input
                                    id="edit-icon"
                                    value={editForm.data.icon}
                                    onChange={(e) =>
                                        editForm.setData('icon', e.target.value)
                                    }
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Lihat icon di:{' '}
                                    <a
                                        href="https://lucide.dev/icons"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        lucide.dev/icons
                                    </a>
                                </p>
                                {editForm.errors.icon && (
                                    <p className="text-sm text-red-600">
                                        {editForm.errors.icon}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-order">Urutan</Label>
                                <Input
                                    id="edit-order"
                                    type="number"
                                    value={editForm.data.order}
                                    onChange={(e) =>
                                        editForm.setData('order', parseInt(e.target.value))
                                    }
                                    min="0"
                                    required
                                />
                                {editForm.errors.order && (
                                    <p className="text-sm text-red-600">
                                        {editForm.errors.order}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-active"
                                    checked={editForm.data.is_active}
                                    onCheckedChange={(checked) =>
                                        editForm.setData('is_active', checked)
                                    }
                                />
                                <Label htmlFor="edit-active">Aktif</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
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
        </AppLayout>
    );
}
