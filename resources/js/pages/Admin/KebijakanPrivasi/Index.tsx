import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Save } from 'lucide-react';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/rich-text-editor';
import { useMemo } from 'react';

interface KebijakanPrivasi {
    id: number;
    title: string;
    body: string;
}

interface Props {
    kebijakanPrivasi: KebijakanPrivasi;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kebijakan Privasi',
        href: '/admin/kebijakan-privasi',
    },
];

export default function Index({ kebijakanPrivasi }: Props) {
    const initialData = useMemo(
        () => ({
            title: kebijakanPrivasi?.title ?? '',
            body: kebijakanPrivasi?.body ?? '',
        }),
        [kebijakanPrivasi],
    );

    const { data, setData, post, processing, errors, reset } = useForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/admin/kebijakan-privasi', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Kebijakan Privasi berhasil diperbarui!', {
                    description: 'Perubahan telah disimpan.',
                });
            },
            onError: () => {
                toast.error('Gagal memperbarui Kebijakan Privasi', {
                    description: 'Periksa kembali form dan coba lagi.',
                });
            },
        });
    };

    const handleReset = () => {
        reset();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kebijakan Privasi" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Kebijakan Privasi</h1>
                        <p className="text-sm text-muted-foreground">
                            Susun dan perbarui kebijakan privasi agar pengguna memahami perlindungan datanya.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Shield className="h-5 w-5" />
                                Konten Kebijakan Privasi
                            </CardTitle>
                            <CardDescription>
                                Jelaskan bagaimana data pengguna dikumpulkan, digunakan, dan dilindungi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
                                    placeholder="Masukkan judul"
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Konten</Label>
                                <RichTextEditor content={data.body} onChange={(content) => setData('body', content)} />
                                {errors.body && <p className="text-sm text-red-500">{errors.body}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={handleReset} disabled={processing}>
                            Reset
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
