import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    DollarSign,
    Edit,
    Eye,
    FileQuestion,
    Check,
    X as XIcon,
    Tag,
    TrendingUp,
    User,
    Video,
} from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Type {
    id: number;
    name: string;
}

interface Level {
    id: number;
    name: string;
}

interface UserType {
    id: number;
    name: string;
    email: string;
}

interface VideoType {
    id: number;
    title: string;
    slug: string;
    video: string;
    embed_url?: string;
}

interface Section {
    id: number;
    title: string;
    videos: VideoType[];
}

interface Quiz {
    id: number;
    question: string;
    answer: string | string[];
    image: string | null;
    point: number;
}

interface TransactionSummary {
    id: number;
    total: number;
    status: string;
    paid_at: string | null;
    user?: { name: string } | null;
}

interface Kelas {
    id: number;
    title: string;
    slug: string;
    price: number;
    discount: number;
    status: string;
    views: number;
    benefit: string | null;
    desc: string | null;
    body: string | null;
    image: string | null;
    category: Category;
    type: Type;
    level: Level;
    user: UserType;
    sections: Section[];
    quizzes: Quiz[];
    transactions?: TransactionSummary[];
    created_at: string;
}

interface Props {
    kelas: Kelas;
    canManage?: boolean;
    canReview?: boolean;
    basePath?: string;
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

const STATUS_LABEL: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    draft: { label: 'Draft', variant: 'secondary' },
    pending: { label: 'Menunggu', variant: 'outline' },
    approved: { label: 'Disetujui', variant: 'default' },
    published: { label: 'Disetujui', variant: 'default' },
    rejected: { label: 'Ditolak', variant: 'destructive' },
};

const formatCurrency = (value: number | string | undefined) => {
    if (value === undefined || value === null) {
        return 'Rp 0';
    }

    const numeric = typeof value === 'string' ? Number.parseFloat(value) : value;
    return `Rp ${Number(numeric || 0).toLocaleString('id-ID')}`;
};

export default function Show({ kelas, canManage = false, canReview = false, basePath = '/admin/kelas' }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Kelas',
            href: basePath,
        },
        {
            title: kelas.title,
            href: `${basePath}/${kelas.id}`,
        },
    ];

    const getYoutubeEmbedUrl = (url: string) => {
        const patterns = [
            /youtube\.com\/watch\?v=([^&]+)/,
            /youtube\.com\/embed\/([^?]+)/,
            /youtu\.be\/([^?]+)/,
            /youtube\.com\/v\/([^?]+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return `https://www.youtube.com/embed/${match[1]}`;
            }
        }
        return url;
    };

    const handleApprove = () => {
        router.post(`${basePath}/${kelas.id}/approve`, {}, { preserveScroll: true });
    };

    const handleReject = () => {
        const reason = window.prompt('Masukkan alasan penolakan (opsional):', '');
        router.post(`${basePath}/${kelas.id}/reject`, { reason }, { preserveScroll: true });
    };

    const statusMeta = STATUS_LABEL[kelas.status] ?? STATUS_LABEL.draft;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={kelas.title} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {kelas.title}
                            </h1>
                            <Badge variant={statusMeta.variant}>
                                {statusMeta.label}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Tag className="h-4 w-4" />
                                {kelas.category?.name ?? '-'}
                            </div>
                            <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                {kelas.level?.name ?? '-'}
                            </div>
                            <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {kelas.type?.name ?? '-'}
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {(kelas.views ?? 0).toLocaleString('id-ID')} views
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={basePath}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        {canManage && (
                            <Button asChild>
                                <Link href={`${basePath}/${kelas.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Kelas
                                </Link>
                            </Button>
                        )}
                        {canReview && (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleApprove}>
                                    <Check className="mr-2 h-4 w-4" /> Terima
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleReject}>
                                    <XIcon className="mr-2 h-4 w-4" /> Tolak
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Course Image */}
                        {kelas.image && (
                            <Card className="overflow-hidden">
                                <img
                                    src={resolveImageUrl(kelas.image) ?? ''}
                                    alt={kelas.title}
                                    className="w-full h-80 object-cover"
                                />
                            </Card>
                        )}

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tentang Kelas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {kelas.desc ? (
                                    <div>
                                        <h4 className="font-semibold mb-2">Deskripsi</h4>
                                        <div
                                            className="text-sm text-muted-foreground prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: kelas.desc }}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Belum ada deskripsi.</p>
                                )}

                                {kelas.benefit ? (
                                    <div>
                                        <h4 className="font-semibold mb-2">Benefit</h4>
                                        <div
                                            className="text-sm text-muted-foreground prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: kelas.benefit }}
                                        />
                                    </div>
                                ) : null}

                                {kelas.body ? (
                                    <div>
                                        <h4 className="font-semibold mb-2">Deskripsi Lengkap</h4>
                                        <div
                                            className="text-sm text-muted-foreground prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: kelas.body }}
                                        />
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>

                        {/* Sections & Videos */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Video className="h-5 w-5" />
                                        <CardTitle>Materi Pembelajaran</CardTitle>
                                    </div>
                                    <Badge variant="outline">
                                        {(kelas.sections ?? []).reduce((acc, section) => acc + section.videos.length, 0)} Video
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {(kelas.sections?.length ?? 0) === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Belum ada bagian materi.
                                    </p>
                                ) : (
                                    <Accordion type="multiple" className="space-y-2">
                                        {kelas.sections!.map((section, index) => (
                                            <AccordionItem
                                                key={section.id}
                                                value={`section-${section.id}`}
                                                className="border rounded-lg px-4"
                                            >
                                                <AccordionTrigger className="hover:no-underline">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                                            {index + 1}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-medium">{section.title}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {section.videos.length} video
                                                            </p>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="space-y-3 pt-4">
                                                    {section.videos.length === 0 ? (
                                                        <p className="text-sm text-muted-foreground text-center py-4">
                                                            Belum ada video
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {section.videos.map((video, vIndex) => (
                                                                <div
                                                                    key={video.id}
                                                                    className="space-y-2 p-3 border rounded-lg bg-muted/30"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/20 text-primary text-xs font-semibold">
                                                                            {vIndex + 1}
                                                                        </div>
                                                                        <h4 className="font-medium text-sm">
                                                                            {video.title}
                                                                        </h4>
                                                                    </div>
                                                                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                                                        <iframe
                                                                            src={getYoutubeEmbedUrl(video.video)}
                                                                            title={video.title}
                                                                            className="w-full h-full"
                                                                            allowFullScreen
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quizzes */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileQuestion className="h-5 w-5" />
                                        <CardTitle>Kuis</CardTitle>
                                    </div>
                                    <Badge variant="outline">
                                        {kelas.quizzes?.length ?? 0} Pertanyaan
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(kelas.quizzes?.length ?? 0) === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Belum ada kuis.
                                    </p>
                                ) : (
                                    (kelas.quizzes ?? []).map((quiz, index) => (
                                        <div
                                            key={quiz.id}
                                            className="p-4 border rounded-lg space-y-3 bg-muted/30"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex items-center justify-center min-w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="font-medium">{quiz.question}</p>
                                                        <Badge variant="secondary">{quiz.point} Poin</Badge>
                                                    </div>

                                                    {quiz.image && (
                                                        <img
                                                            src={resolveImageUrl(quiz.image) ?? ''}
                                                            alt="Quiz"
                                                            className="w-full max-w-md rounded-lg border"
                                                        />
                                                    )}

                                                    <div className="space-y-2">
                                                        <p className="text-xs font-medium text-muted-foreground uppercase">
                                                            Jawaban Benar:
                                                        </p>
                                                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-3 rounded-lg">
                                                            <p className="text-sm text-green-900 dark:text-green-100">
                                                                {typeof quiz.answer === 'string'
                                                                    ? quiz.answer
                                                                    : Array.isArray(quiz.answer)
                                                                    ? quiz.answer.join(', ')
                                                                    : JSON.stringify(quiz.answer)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Harga Kelas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-3xl font-bold text-primary">
                                        Rp {Number(kelas.price ?? 0).toLocaleString('id-ID')}
                                    </p>
                                    {Number(kelas.discount ?? 0) > 0 && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <Badge variant="destructive">Diskon</Badge>
                                            <p className="text-sm font-medium text-green-600">
                                                -Rp {Number(kelas.discount ?? 0).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Statistik</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Eye className="h-4 w-4" />
                                        <span>Total Views</span>
                                    </div>
                                    <span className="font-semibold">{(kelas.views ?? 0).toLocaleString('id-ID')}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Video className="h-4 w-4" />
                                        <span>Total Video</span>
                                    </div>
                                    <span className="font-semibold">
                                        {(kelas.sections ?? []).reduce((acc, section) => acc + section.videos.length, 0)}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <FileQuestion className="h-4 w-4" />
                                        <span>Total Kuis</span>
                                    </div>
                                    <span className="font-semibold">{kelas.quizzes?.length ?? 0}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {canManage && kelas.transactions && kelas.transactions.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Penjualan Terbaru</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {kelas.transactions?.map((transaction) => (
                                        <div key={transaction.id} className="rounded-lg border border-muted-foreground/20 p-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{transaction.user?.name ?? 'Pengguna'}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {transaction.paid_at
                                                            ? new Date(transaction.paid_at).toLocaleString('id-ID', {
                                                                  dateStyle: 'medium',
                                                                  timeStyle: 'short',
                                                              })
                                                            : 'Menunggu pembayaran'}
                                                    </span>
                                                </div>
                                                <span className="font-semibold">{formatCurrency(transaction.total)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Informasi Kelas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Kategori</p>
                                    <p className="text-sm font-medium">{kelas.category?.name ?? '-'}</p>
                                </div>
                                <Separator />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Level</p>
                                    <p className="text-sm font-medium">{kelas.level?.name ?? '-'}</p>
                                </div>
                                <Separator />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Tipe</p>
                                    <p className="text-sm font-medium">{kelas.type?.name ?? '-'}</p>
                                </div>
                                <Separator />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Instruktur</p>
                                    <p className="text-sm font-medium">{kelas.user?.name ?? '-'}</p>
                                    <p className="text-xs text-muted-foreground">{kelas.user?.email ?? '-'}</p>
                                </div>
                                <Separator />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Dibuat</p>
                                    <p className="text-sm font-medium">
                                        {new Date(kelas.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
