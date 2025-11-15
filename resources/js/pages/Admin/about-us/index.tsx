import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/rich-text-editor';
import { useMemo, useState } from 'react';

interface AboutUs {
    id: number;
    title: string;
    body: string;
    image: string;
}

interface Props {
    aboutUs: AboutUs;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tentang Kami',
        href: '/admin/about-us',
    },
];

export default function Index({ aboutUs }: Props) {
    const initialData = useMemo(
        () => ({
            title: aboutUs?.title ?? '',
            body: aboutUs?.body ?? '',
            image: null as File | null,
        }),
        [aboutUs],
    );

    const { data, setData, post, processing, errors, reset } = useForm(initialData);
    const [imagePreview, setImagePreview] = useState<string | null>(aboutUs?.image ?? null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/admin/about-us', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Tentang Kami berhasil diperbarui!', {
                    description: 'Perubahan telah disimpan.',
                });
            },
            onError: () => {
                toast.error('Gagal memperbarui Tentang Kami', {
                    description: 'Periksa kembali form dan coba lagi.',
                });
            },
        });
    };

    const handleReset = () => {
        reset();
        setImagePreview(aboutUs?.image ?? null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tentang Kami" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Tentang Kami</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola konten tentang kami untuk platform Anda.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5" />
                                Konten Tentang Kami
                            </CardTitle>
                            <CardDescription>
                                Perbarui judul, gambar, dan isi konten tentang kami yang ditampilkan kepada pengguna.
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
                                <Label htmlFor="image">Gambar</Label>
                                <div className="space-y-4">
                                    {imagePreview && (
                                        <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg"
                                            onChange={handleImageChange}
                                            className="cursor-pointer"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => document.getElementById('image')?.click()}
                                        >
                                            <ImageIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Format: JPG, JPEG, PNG. Maksimal 4MB
                                    </p>
                                </div>
                                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
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
