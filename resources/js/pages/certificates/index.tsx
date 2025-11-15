import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import {
    Plus,
    ArrowUpDown,
    FileText,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { CrudActions } from '@/components/table-actions';

interface LayoutField {
    key: string;
    label: string;
    type: 'text';
    x: number;
    y: number;
    fontFamily: string;
    fontSize: number;
    color: string;
    align: 'left' | 'center' | 'right';
}

interface CertificateTemplate {
    id: number;
    name: string;
    description: string | null;
    background_image: string | null;
    layout: LayoutField[];
    is_active: boolean;
    created_at: string;
}

interface Props {
    templates: CertificateTemplate[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Template Sertifikat',
        href: '/admin/certificates',
    },
];

const STATUS_META: Record<boolean, { label: string; variant: 'default' | 'secondary' }> = {
    true: { label: 'Aktif', variant: 'default' },
    false: { label: 'Nonaktif', variant: 'secondary' },
};

export default function CertificatesIndex({ templates }: Props) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);
    const [generatingPreview, setGeneratingPreview] = useState(false);

    const openDeleteDialog = (template: CertificateTemplate) => {
        setSelectedTemplate(template);
        setDeleteOpen(true);
    };

    const handleDelete = () => {
        if (!selectedTemplate) return;

        router.delete(`/admin/certificates/${selectedTemplate.id}`, {
            onSuccess: () => {
                toast.success('Template sertifikat berhasil dihapus!');
                setDeleteOpen(false);
                setSelectedTemplate(null);
            },
            onError: () => {
                toast.error('Gagal menghapus template sertifikat.');
            },
        });
    };

    const handleGeneratePreview = async (template: CertificateTemplate) => {
        setGeneratingPreview(true);

        try {
            const response = await fetch(`/admin/certificates/${template.id}/preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Preview sertifikat berhasil dibuat!');
                window.open(data.url, '_blank');
            } else {
                toast.error(data.message || 'Gagal generate preview sertifikat.');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat generate preview.');
            console.error(error);
        } finally {
            setGeneratingPreview(false);
        }
    };

    const columns = useMemo<ColumnDef<CertificateTemplate>[]>(
        () => [
            {
                id: 'index',
                header: '#',
                cell: ({ row, table }) => {
                    const pagination = table.getState().pagination;
                    const pageIndex = pagination?.pageIndex ?? 0;
                    const pageSize = pagination?.pageSize ?? (table.getRowModel().rows.length || 1);

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
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="-ml-4 hover:bg-transparent"
                    >
                        Nama Template
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {row.original.layout?.length ?? 0} elemen teks
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'description',
                header: 'Deskripsi',
                cell: ({ row }) => (
                    <span className="text-muted-foreground line-clamp-2">
                        {row.original.description || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'is_active',
                header: 'Status',
                cell: ({ row }) => {
                    const meta = STATUS_META[row.original.is_active];
                    return <Badge variant={meta.variant}>{meta.label}</Badge>;
                },
            },
            {
                accessorKey: 'created_at',
                header: 'Dibuat',
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {new Date(row.original.created_at).toLocaleDateString('id-ID', {
                            dateStyle: 'medium',
                        })}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: () => <div className="text-right">Aksi</div>,
                cell: ({ row }) => {
                    const template = row.original;
                    return (
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.visit(`/admin/certificates/${template.id}`)}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat
                            </Button>
                            <CrudActions
                                onEdit={() => router.visit(`/admin/certificates/${template.id}/edit`)}
                                onDelete={() => openDeleteDialog(template)}
                            />
                        </div>
                    );
                },
            },
        ],
        [generatingPreview],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Template Sertifikat" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Template Sertifikat</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola template sertifikat dengan upload PDF/gambar dan konfigurasi dynamic fields.
                        </p>
                    </div>
                    <Link href="/admin/certificates/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Template
                        </Button>
                    </Link>
                </div>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Daftar Template</CardTitle>
                        <CardDescription>Kelola semua template sertifikat yang tersedia.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={templates}
                            searchKey="name"
                            searchPlaceholder="Cari template..."
                        />
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Template Sertifikat</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus template sertifikat "
                            {selectedTemplate?.name}"? Tindakan ini tidak dapat dibatalkan.
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
