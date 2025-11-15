import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Eye, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Category {
    id: number;
    name: string;
}

interface Post {
    id: number;
    category_id: number;
    category?: Category | null;
    title: string;
    slug: string;
    desc: string;
    body: string;
    image: string | null;
    status: boolean | number;
    views: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    post: Post;
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

const STATUS_META: Record<
    number,
    {
        label: string;
        variant: 'default' | 'secondary' | 'outline';
    }
> = {
    1: { label: 'Dipublikasikan', variant: 'default' },
    0: { label: 'Draft', variant: 'secondary' },
};

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short',
    });

export default function NewsShow({ post }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blog',
            href: '/admin/news',
        },
        {
            title: post.title,
            href: `/admin/news/${post.id}`,
        },
    ];

    const statusValue =
        typeof post.status === 'boolean'
            ? Number(post.status)
            : (post.status as number);
    const statusMeta = STATUS_META[statusValue] ?? STATUS_META[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail: ${post.title}`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/news">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-2xl mb-2">
                                    {post.title}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDateTime(post.created_at)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {post.views} views
                                    </div>
                                    {post.category && (
                                        <Badge variant="outline">
                                            {post.category.name}
                                        </Badge>
                                    )}
                                    <Badge variant={statusMeta.variant}>
                                        {statusMeta.label}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {post.image && (
                            <div className="rounded-lg overflow-hidden border border-muted">
                                <img
                                    src={resolveImageUrl(post.image) ?? ''}
                                    alt={post.title}
                                    className="w-full h-auto object-cover max-h-[500px]"
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Deskripsi Singkat
                                </h3>
                                <p className="text-muted-foreground">{post.desc}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Konten</h3>
                                <div
                                    className="prose prose-sm max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: post.body }}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-muted">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">
                                        Dibuat:
                                    </span>{' '}
                                    <span className="font-medium">
                                        {formatDateTime(post.created_at)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">
                                        Terakhir diperbarui:
                                    </span>{' '}
                                    <span className="font-medium">
                                        {formatDateTime(post.updated_at)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Slug:</span>{' '}
                                    <code className="text-xs bg-muted px-2 py-1 rounded">
                                        {post.slug}
                                    </code>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">ID:</span>{' '}
                                    <code className="text-xs bg-muted px-2 py-1 rounded">
                                        {post.id}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
