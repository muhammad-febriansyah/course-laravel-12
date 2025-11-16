import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, MessageCircle, User } from 'lucide-react';
import { toast } from 'sonner';

interface DiscussionUser {
    id: number;
    name: string;
    email?: string;
    avatar?: string | null;
}

interface DiscussionReply {
    id: number;
    content: string;
    created_at: string;
    user: DiscussionUser;
}

interface Discussion {
    id: number;
    title: string;
    content: string;
    image?: string | null;
    is_resolved: boolean;
    created_at: string;
    resolved_at?: string | null;
    user: DiscussionUser;
    replies: DiscussionReply[];
    resolvedBy?: DiscussionUser | null;
}

interface Kelas {
    id: number;
    title: string;
    slug: string;
}

interface MentorDiscussionShowProps {
    kelas: Kelas;
    discussion: Discussion;
    basePath?: string;
}

const formatDateTime = (value: string | null | undefined) => {
    if (!value) return '';

    return new Date(value).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function MentorDiscussionShow({
    kelas,
    discussion,
    basePath,
}: MentorDiscussionShowProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
    });

    const backUrl = basePath ?? `/mentor/kelas/${kelas.id}/discussions`;

    const breadcrumbs: BreadcrumbItem[] = basePath
        ? [
              { title: 'Dashboard', href: '/mentor/dashboard' },
              { title: 'Diskusi', href: basePath },
              { title: discussion.title, href: `${backUrl}/${discussion.id}` },
          ]
        : [
              { title: 'Dashboard', href: '/mentor/dashboard' },
              { title: 'Kelas Saya', href: '/mentor/kelas' },
              { title: kelas.title, href: `/mentor/kelas/${kelas.id}` },
              { title: 'Diskusi', href: `/mentor/kelas/${kelas.id}/discussions` },
              {
                  title: discussion.title,
                  href: `/mentor/kelas/${kelas.id}/discussions/${discussion.id}`,
              },
          ];

    const handleReplySubmit = (event: React.FormEvent) => {
        event.preventDefault();

        post(`/mentor/kelas/${kelas.id}/discussions/${discussion.id}/reply`, {
            preserveScroll: true,
            onSuccess: () => {
                reset('content');
                toast.success('Balasan berhasil dikirim!');
            },
            onError: () => {
                toast.error('Gagal mengirim balasan. Silakan coba lagi.');
            },
        });
    };

    const handleToggleResolved = () => {
        const action = discussion.is_resolved ? 'unresolve' : 'resolve';

        router.post(
            `/mentor/kelas/${kelas.id}/discussions/${discussion.id}/${action}`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Diskusi - ${kelas.title}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {discussion.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Diskusi di kelas {kelas.title}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={backUrl}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>

                        <Button
                            variant={discussion.is_resolved ? 'outline' : 'default'}
                            size="sm"
                            onClick={handleToggleResolved}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {discussion.is_resolved
                                ? 'Tandai belum selesai'
                                : 'Tandai selesai'}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                {discussion.user.avatar ? (
                                    <img
                                        src={discussion.user.avatar}
                                        alt={discussion.user.name}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-foreground">
                                    {discussion.user.name}
                                </p>
                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {formatDateTime(discussion.created_at)}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end">
                            <Badge
                                variant={
                                    discussion.is_resolved ? 'default' : 'secondary'
                                }
                                className={
                                    discussion.is_resolved
                                        ? 'bg-green-500'
                                        : 'bg-orange-500'
                                }
                            >
                                {discussion.is_resolved ? 'Selesai' : 'Pending'}
                            </Badge>
                            {discussion.resolvedBy && discussion.resolved_at && (
                                <p className="text-xs text-muted-foreground">
                                    Diselesaikan oleh {discussion.resolvedBy.name} pada{' '}
                                    {formatDateTime(discussion.resolved_at)}
                                </p>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="whitespace-pre-wrap text-slate-700">
                            {discussion.content}
                        </p>

                        {discussion.image && (
                            <img
                                src={discussion.image}
                                alt="Lampiran diskusi"
                                className="max-h-64 w-auto rounded-lg border object-cover"
                            />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <MessageCircle className="h-4 w-4" />
                            Tambah Balasan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleReplySubmit}
                            className="space-y-4"
                            noValidate
                        >
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Tulis balasan untuk diskusi ini..."
                                    rows={4}
                                    value={data.content}
                                    onChange={(event) =>
                                        setData('content', event.target.value)
                                    }
                                    className={cn(
                                        'min-h-[120px]',
                                        errors.content && 'border-red-500',
                                    )}
                                />
                                {errors.content && (
                                    <p className="text-sm text-red-500">
                                        {errors.content}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Kirim Balasan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <MessageCircle className="h-4 w-4" />
                            Balasan ({discussion.replies.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {discussion.replies.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Belum ada balasan pada diskusi ini.
                            </p>
                        ) : (
                            discussion.replies.map((reply) => (
                                <div
                                    key={reply.id}
                                    className="rounded-lg border bg-muted/40 p-4"
                                >
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                            {reply.user.avatar ? (
                                                <img
                                                    src={reply.user.avatar}
                                                    alt={reply.user.name}
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {reply.user.name}
                                            </p>
                                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {formatDateTime(reply.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="whitespace-pre-wrap text-sm text-slate-700">
                                        {reply.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
