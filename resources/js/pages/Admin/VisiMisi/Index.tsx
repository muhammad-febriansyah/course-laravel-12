import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, Target, Users } from 'lucide-react';
import { RichTextEditor } from '@/components/rich-text-editor';

interface VisiMisi {
    visi: string;
    misi: string;
}

interface Props {
    visiMisi: VisiMisi | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Visi & Misi',
        href: '/admin/visi-misi',
    },
];

export default function Index({ visiMisi }: Props) {
    const initialData = useMemo(
        () => ({
            visi: visiMisi?.visi ?? '',
            misi: visiMisi?.misi ?? '',
        }),
        [visiMisi],
    );

    const { data, setData, post, processing, errors, reset } = useForm(initialData);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        post('/admin/visi-misi', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Visi dan Misi berhasil diperbarui!', {
                    description: 'Perubahan telah disimpan.',
                });
            },
            onError: () => {
                toast.error('Gagal memperbarui Visi dan Misi', {
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
            <Head title="Visi &amp; Misi" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Visi &amp; Misi</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola konten visi dan misi organisasi Anda dalam satu tempat.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Target className="h-5 w-5" />
                                Visi Organisasi
                            </CardTitle>
                            <CardDescription>
                                Perbarui pernyataan visi sebagai arah utama perkembangan organisasi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label>Visi</Label>
                            <RichTextEditor content={data.visi} onChange={(content) => setData('visi', content)} />
                            {errors.visi && <p className="text-sm text-red-500">{errors.visi}</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5" />
                                Misi Organisasi
                            </CardTitle>
                            <CardDescription>
                                Rinci langkah dan komitmen organisasi melalui pernyataan misi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label>Misi</Label>
                            <RichTextEditor content={data.misi} onChange={(content) => setData('misi', content)} />
                            {errors.misi && <p className="text-sm text-red-500">{errors.misi}</p>}
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
