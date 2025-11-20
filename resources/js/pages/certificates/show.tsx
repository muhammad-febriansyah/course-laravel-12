import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    background_image_url: string | null;
    layout: LayoutField[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    certificate: CertificateTemplate;
}

const STATUS_META: Record<boolean, { label: string; variant: 'default' | 'secondary' }> = {
    true: { label: 'Aktif', variant: 'default' },
    false: { label: 'Nonaktif', variant: 'secondary' },
};

const isPdfPath = (path: string | null | undefined): boolean => {
    if (!path) return false;
    const normalized = path.split('?')[0];
    return normalized.toLowerCase().endsWith('.pdf');
};

export default function CertificatesShow({ certificate }: Props) {
    const [generatingPreview, setGeneratingPreview] = useState(false);
    const [generatedCertUrl, setGeneratedCertUrl] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Template Sertifikat',
            href: '/admin/certificates',
        },
        {
            title: certificate.name,
            href: `/admin/certificates/${certificate.id}`,
        },
    ];

    const previewType = isPdfPath(certificate.background_image) ? 'pdf' : certificate.background_image ? 'image' : null;

    const handleGeneratePreview = () => {
        setGeneratingPreview(true);

        // Manual fetch with CSRF from meta tag
        fetch(`/admin/certificates/${certificate.id}/preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    setGeneratedCertUrl(data.url);
                    toast.success('Sertifikat berhasil di-generate!');
                } else {
                    toast.error(data.message || 'Gagal generate sertifikat.');
                }
            })
            .catch(error => {
                console.error('Error generating certificate:', error);
                toast.error('Terjadi kesalahan saat generate sertifikat.');
            })
            .finally(() => {
                setGeneratingPreview(false);
            });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Preview: ${certificate.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/certificates">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight">{certificate.name}</h1>
                            <Badge variant={STATUS_META[certificate.is_active].variant}>
                                {STATUS_META[certificate.is_active].label}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {certificate.description || 'Tidak ada deskripsi'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/admin/certificates/${certificate.id}/edit`}>
                            <Button variant="outline">Edit Template</Button>
                        </Link>
                        <Button onClick={handleGeneratePreview} disabled={generatingPreview}>
                            <FileText className="mr-2 h-4 w-4" />
                            {generatingPreview ? 'Generating...' : 'Generate Preview'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Template Preview */}
                    <Card className="border-muted-foreground/20">
                        <CardHeader>
                            <CardTitle>Template Background</CardTitle>
                            <CardDescription>File template yang digunakan sebagai background sertifikat.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {certificate.background_image_url ? (
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-muted-foreground/30 bg-muted">
                                        {previewType === 'pdf' ? (
                                            <iframe
                                                src={certificate.background_image_url}
                                                title="Template background"
                                                className="h-full w-full"
                                            />
                                        ) : (
                                            <img
                                                src={certificate.background_image_url}
                                                alt="Template background"
                                                className="h-full w-full object-contain"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted">
                                        <p className="text-sm text-muted-foreground">Tidak ada file template</p>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Type:</span>
                                    <span className="font-medium">{previewType === 'pdf' ? 'PDF' : previewType === 'image' ? 'Image' : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Created:</span>
                                    <span className="font-medium">
                                        {new Date(certificate.created_at).toLocaleDateString('id-ID', {
                                            dateStyle: 'long',
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Last Updated:</span>
                                    <span className="font-medium">
                                        {new Date(certificate.updated_at).toLocaleDateString('id-ID', {
                                            dateStyle: 'long',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Generated Certificate Preview */}
                    <Card className="border-muted-foreground/20">
                        <CardHeader>
                            <CardTitle>Generated Certificate</CardTitle>
                            <CardDescription>
                                Preview sertifikat yang di-generate dengan sample data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {generatedCertUrl ? (
                                <div className="space-y-4">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-muted-foreground/30 bg-muted">
                                        <iframe
                                            src={generatedCertUrl}
                                            title="Generated certificate"
                                            className="h-full w-full"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => window.open(generatedCertUrl, '_blank')}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Lihat Full Screen
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = generatedCertUrl;
                                                link.download = `certificate-preview-${certificate.id}.pdf`;
                                                link.click();
                                            }}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download PDF
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted">
                                    <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground mb-2">Belum ada sertifikat yang di-generate</p>
                                    <Button onClick={handleGeneratePreview} disabled={generatingPreview} size="sm">
                                        {generatingPreview ? 'Generating...' : 'Generate Preview'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Dynamic Fields Configuration */}
                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Dynamic Fields Configuration</CardTitle>
                        <CardDescription>
                            Field-field yang akan di-generate secara dynamic pada sertifikat.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {certificate.layout && certificate.layout.length > 0 ? (
                            <div className="space-y-4">
                                {certificate.layout.map((field, index) => (
                                    <div
                                        key={`${field.key}-${index}`}
                                        className="rounded-lg border border-muted-foreground/20 p-4"
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div>
                                                <h4 className="font-medium">
                                                    {field.label}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    <code className="rounded bg-muted px-1 py-0.5">{field.key}</code>
                                                </p>
                                            </div>
                                            <Badge variant="outline">{field.type}</Badge>
                                        </div>

                                        <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
                                            <div>
                                                <span className="text-muted-foreground">Position:</span>
                                                <p className="font-medium">X: {field.x}%, Y: {field.y}%</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Font:</span>
                                                <p className="font-medium">{field.fontFamily} {field.fontSize}px</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Color:</span>
                                                <p className="font-medium flex items-center gap-2">
                                                    <span
                                                        className="inline-block h-4 w-4 rounded border"
                                                        style={{ backgroundColor: field.color }}
                                                    />
                                                    {field.color}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Align:</span>
                                                <p className="font-medium capitalize">{field.align}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted p-8 text-center">
                                <p className="text-sm text-muted-foreground">Tidak ada dynamic fields yang dikonfigurasi</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Sample Data Info */}
                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Sample Data untuk Preview</CardTitle>
                        <CardDescription>
                            Data yang digunakan saat generate preview sertifikat.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-lg border border-muted-foreground/20 p-3">
                                <p className="text-xs text-muted-foreground mb-1">recipient_name</p>
                                <p className="font-medium">John Doe</p>
                            </div>
                            <div className="rounded-lg border border-muted-foreground/20 p-3">
                                <p className="text-xs text-muted-foreground mb-1">course_name</p>
                                <p className="font-medium">Laravel Advanced Course</p>
                            </div>
                            <div className="rounded-lg border border-muted-foreground/20 p-3">
                                <p className="text-xs text-muted-foreground mb-1">issue_date</p>
                                <p className="font-medium">{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                            </div>
                            <div className="rounded-lg border border-muted-foreground/20 p-3">
                                <p className="text-xs text-muted-foreground mb-1">certificate_id</p>
                                <p className="font-medium">CERT-XXXXXXXX</p>
                            </div>
                            <div className="rounded-lg border border-muted-foreground/20 p-3">
                                <p className="text-xs text-muted-foreground mb-1">signature_name</p>
                                <p className="font-medium">Jane Smith</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
