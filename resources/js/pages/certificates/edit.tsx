import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
}

interface Props {
    certificate: CertificateTemplate;
}

const isPdfPath = (path: string | null | undefined): boolean => {
    if (!path) return false;
    const normalized = path.split('?')[0];
    return normalized.toLowerCase().endsWith('.pdf');
};

const isPdfFile = (file: File | null): boolean => {
    if (!file) return false;
    if (file.type) {
        return file.type === 'application/pdf';
    }
    return file.name.toLowerCase().endsWith('.pdf');
};

export default function CertificatesEdit({ certificate }: Props) {
    const [preview, setPreview] = useState<string | null>(certificate.background_image);
    const [previewType, setPreviewType] = useState<'image' | 'pdf' | null>(
        isPdfPath(certificate.background_image) ? 'pdf' : certificate.background_image ? 'image' : null
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Template Sertifikat',
            href: '/admin/certificates',
        },
        {
            title: certificate.name,
            href: `/admin/certificates/${certificate.id}/edit`,
        },
    ];

    const form = useForm({
        name: certificate.name,
        description: certificate.description ?? '',
        is_active: certificate.is_active ? '1' : '0',
        layout: (certificate.layout ?? []).map((field) => ({ ...field })),
        background_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.put(`/admin/certificates/${certificate.id}`, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Template sertifikat berhasil diperbarui!');
            },
            onError: () => {
                toast.error('Gagal memperbarui template sertifikat.');
            },
        });
    };

    const handleFieldChange = (index: number, key: keyof LayoutField, value: string) => {
        const fields = [...form.data.layout];
        const field = { ...fields[index] };

        if (key === 'x' || key === 'y') {
            field[key] = Number.parseFloat(value) || 0;
        } else if (key === 'fontSize') {
            field[key] = Number.parseInt(value, 10) || 12;
        } else if (key === 'align') {
            field[key] = value as LayoutField['align'];
        } else if (key === 'type') {
            field[key] = 'text';
        } else {
            field[key] = value as never;
        }

        fields[index] = field;
        form.setData('layout', fields);
    };

    const addField = () => {
        const fields = [...form.data.layout];
        const suffix = fields.length + 1;
        fields.push({
            key: `custom_field_${suffix}`,
            label: `Teks Custom ${suffix}`,
            type: 'text',
            x: 50,
            y: 50,
            fontFamily: 'Inter',
            fontSize: 20,
            color: '#1f2937',
            align: 'center',
        });
        form.setData('layout', fields);
    };

    const removeField = (index: number) => {
        const fields = [...form.data.layout];
        fields.splice(index, 1);
        form.setData('layout', fields);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${certificate.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/certificates">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Edit Template Sertifikat</h1>
                        <p className="text-sm text-muted-foreground">
                            Perbarui detail dan konfigurasi template sertifikat.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-muted-foreground/20">
                        <CardHeader>
                            <CardTitle>Informasi Template</CardTitle>
                            <CardDescription>Detail basic template sertifikat.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nama Template <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="Sertifikat Kelulusan"
                                    />
                                    {form.errors.name && (
                                        <p className="text-sm text-red-500">{form.errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="is_active">Status</Label>
                                    <Select value={form.data.is_active} onValueChange={(value) => form.setData('is_active', value)}>
                                        <SelectTrigger id="is_active">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Aktif</SelectItem>
                                            <SelectItem value="0">Nonaktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {form.errors.is_active && (
                                        <p className="text-sm text-red-500">{form.errors.is_active}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    rows={3}
                                    placeholder="Deskripsi singkat mengenai penggunaan template ini."
                                />
                                {form.errors.description && (
                                    <p className="text-sm text-red-500">{form.errors.description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="background_image">
                                    File Template (PDF/Gambar)
                                </Label>
                                <Input
                                    id="background_image"
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        form.setData('background_image', file);
                                        if (file) {
                                            const url = URL.createObjectURL(file);
                                            setPreview(url);
                                            setPreviewType(isPdfFile(file) ? 'pdf' : 'image');
                                        } else {
                                            setPreview(certificate.background_image);
                                            setPreviewType(
                                                isPdfPath(certificate.background_image)
                                                    ? 'pdf'
                                                    : certificate.background_image
                                                    ? 'image'
                                                    : null
                                            );
                                        }
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format: JPG, PNG, WEBP, PDF. Max: 8MB. Kosongkan jika tidak ingin mengubah.
                                </p>
                                {form.errors.background_image && (
                                    <p className="text-sm text-red-500">{form.errors.background_image}</p>
                                )}
                            </div>

                            {preview && (
                                <div className="space-y-2">
                                    <Label>Pratinjau Template</Label>
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-muted-foreground/30 bg-muted">
                                        {previewType === 'pdf' ? (
                                            <iframe src={preview} title="Preview sertifikat" className="h-full w-full" />
                                        ) : (
                                            <img src={preview} alt="Preview sertifikat" className="h-full w-full object-contain" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-muted-foreground/20">
                        <CardHeader>
                            <CardTitle>Dynamic Fields</CardTitle>
                            <CardDescription>
                                Konfigurasi field-field dynamic yang akan di-generate pada sertifikat.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="rounded-md bg-muted p-4 text-sm">
                                <p className="font-medium mb-2">Field Keys yang tersedia:</p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    <li>
                                        <code className="text-xs bg-background px-1 py-0.5 rounded">recipient_name</code> - Nama penerima sertifikat
                                    </li>
                                    <li>
                                        <code className="text-xs bg-background px-1 py-0.5 rounded">course_name</code> - Nama kursus/kelas
                                    </li>
                                    <li>
                                        <code className="text-xs bg-background px-1 py-0.5 rounded">issue_date</code> - Tanggal terbit sertifikat
                                    </li>
                                    <li>
                                        <code className="text-xs bg-background px-1 py-0.5 rounded">certificate_id</code> - ID unik sertifikat
                                    </li>
                                    <li>
                                        <code className="text-xs bg-background px-1 py-0.5 rounded">signature_name</code> - Nama penandatangan
                                    </li>
                                </ul>
                                <p className="mt-3 text-muted-foreground">
                                    Posisi X dan Y dalam persen (0-100). Contoh: X=50, Y=50 untuk tengah template.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {form.data.layout.map((field, index) => (
                                    <div
                                        key={`${field.key}-${index}`}
                                        className="rounded-lg border border-muted-foreground/20 p-4 space-y-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <h4 className="font-medium">Field #{index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeField(index)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label>Key</Label>
                                                <Input
                                                    value={field.key}
                                                    onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                                                    placeholder="recipient_name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Label</Label>
                                                <Input
                                                    value={field.label}
                                                    onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                                                    placeholder="Nama Penerima"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Font Family</Label>
                                                <Input
                                                    value={field.fontFamily}
                                                    onChange={(e) => handleFieldChange(index, 'fontFamily', e.target.value)}
                                                    placeholder="Inter"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Posisi X (%)</Label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    value={field.x}
                                                    onChange={(e) => handleFieldChange(index, 'x', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Posisi Y (%)</Label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    value={field.y}
                                                    onChange={(e) => handleFieldChange(index, 'y', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Ukuran Font (px)</Label>
                                                <Input
                                                    type="number"
                                                    min={8}
                                                    max={120}
                                                    value={field.fontSize}
                                                    onChange={(e) => handleFieldChange(index, 'fontSize', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Warna (Hex)</Label>
                                                <Input
                                                    value={field.color}
                                                    onChange={(e) => handleFieldChange(index, 'color', e.target.value)}
                                                    placeholder="#1f2937"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Perataan</Label>
                                                <Select
                                                    value={field.align}
                                                    onValueChange={(value) => handleFieldChange(index, 'align', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="left">Kiri</SelectItem>
                                                        <SelectItem value="center">Tengah</SelectItem>
                                                        <SelectItem value="right">Kanan</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <Button type="button" variant="outline" onClick={addField} className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Field
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Link href="/admin/certificates">
                            <Button type="button" variant="outline" disabled={form.processing}>
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
