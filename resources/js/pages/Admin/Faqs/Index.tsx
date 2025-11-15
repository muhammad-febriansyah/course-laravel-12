import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { CrudActions } from '@/components/table-actions';
import { toast } from 'sonner';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Plus } from 'lucide-react';

interface Faq {
    id: number;
    question: string;
    answer: string;
    created_at: string;
}

interface Props {
    faqs: Faq[];
}

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

export default function AdminFaqsIndex({ faqs }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);

    const createForm = useForm({
        question: '',
        answer: '',
    });

    const editForm = useForm({
        question: '',
        answer: '',
    });

    const openCreateDialog = () => {
        createForm.reset();
        setCreateOpen(true);
    };

    const openEditDialog = (faq: Faq) => {
        setSelectedFaq(faq);
        editForm.setData({
            question: faq.question,
            answer: faq.answer,
        });
        setEditOpen(true);
    };

    const openDeleteDialog = (faq: Faq) => {
        setSelectedFaq(faq);
        setDeleteOpen(true);
    };

    const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        createForm.post(route('admin.faqs.store'), {
            onSuccess: () => {
                toast.success('FAQ berhasil ditambahkan!');
                setCreateOpen(false);
                createForm.reset();
            },
            onError: () => {
                toast.error('Gagal menambahkan FAQ');
            },
        });
    };

    const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFaq) return;

        editForm.put(route('admin.faqs.update', selectedFaq.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('FAQ berhasil diperbarui!');
                setEditOpen(false);
                editForm.reset();
                setSelectedFaq(null);
            },
            onError: () => {
                toast.error('Gagal memperbarui FAQ');
            },
        });
    };

    const handleDelete = () => {
        if (!selectedFaq) return;

        router.delete(route('admin.faqs.destroy', selectedFaq.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('FAQ berhasil dihapus!');
                setDeleteOpen(false);
                setSelectedFaq(null);
            },
            onError: () => {
                toast.error('Gagal menghapus FAQ');
            },
        });
    };

    const columns: ColumnDef<Faq>[] = [
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
            accessorKey: 'question',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="-ml-4 hover:bg-transparent"
                >
                    Pertanyaan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('question')}</div>
            ),
        },
        {
            accessorKey: 'answer',
            header: 'Jawaban',
            cell: ({ row }) => (
                <div className="max-w-2xl text-muted-foreground">
                    {row.getValue('answer')}
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
                const faq = row.original;

                return (
                    <div className="flex justify-end">
                        <CrudActions
                            onEdit={() => openEditDialog(faq)}
                            onDelete={() => openDeleteDialog(faq)}
                        />
                    </div>
                );
            },
            enableSorting: false,
        },
    ];

    return (
        <AppLayout>
            <Head title="Kelola FAQ" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Kelola FAQ
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Buat, ubah, dan kelola pertanyaan umum di platform.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah FAQ
                    </Button>
                </div>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Daftar FAQ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={faqs}
                            searchKey="question"
                            searchPlaceholder="Cari pertanyaan..."
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah FAQ</DialogTitle>
                        <DialogDescription>
                            Buat pertanyaan baru beserta jawabannya.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-question">
                                    Pertanyaan
                                </Label>
                                <Input
                                    id="create-question"
                                    value={createForm.data.question}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'question',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Masukkan pertanyaan"
                                />
                                {createForm.errors.question && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.question}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-answer">Jawaban</Label>
                                <Textarea
                                    id="create-answer"
                                    value={createForm.data.answer}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'answer',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Masukkan jawaban"
                                    rows={4}
                                />
                                {createForm.errors.answer && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.answer}
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit FAQ</DialogTitle>
                        <DialogDescription>
                            Perbarui pertanyaan atau jawaban.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-question">Pertanyaan</Label>
                                <Input
                                    id="edit-question"
                                    value={editForm.data.question}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'question',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Masukkan pertanyaan"
                                />
                                {editForm.errors.question && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.question}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-answer">Jawaban</Label>
                                <Textarea
                                    id="edit-answer"
                                    value={editForm.data.answer}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'answer',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Masukkan jawaban"
                                    rows={4}
                                />
                                {editForm.errors.answer && (
                                    <p className="text-sm text-red-500">
                                        {editForm.errors.answer}
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
                                    setSelectedFaq(null);
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
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
                        <AlertDialogTitle>Hapus FAQ</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus pertanyaan "
                            {selectedFaq?.question}"? Tindakan ini tidak dapat
                            dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setSelectedFaq(null)}
                        >
                            Batal
                        </AlertDialogCancel>
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
