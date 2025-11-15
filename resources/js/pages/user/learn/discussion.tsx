import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import user from '@/routes/user';
import { toast } from 'sonner';
import {
    ArrowLeft,
    MessageCircle,
    Send,
    ImagePlus,
    X,
    CheckCircle2,
    User
} from 'lucide-react';
import { useState, useRef } from 'react';

interface User {
    id: number;
    name: string;
    avatar: string | null;
}

interface Discussion {
    id: number;
    title: string;
    content: string;
    image: string | null;
    isResolved: boolean;
    createdAt: string;
    user: User;
    repliesCount: number;
}

interface Course {
    id: number;
    title: string;
    slug: string;
}

interface DiscussionPageProps {
    course: Course;
    discussions: Discussion[];
}

export default function DiscussionPage({ course, discussions }: DiscussionPageProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        image: null as File | null,
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setData('image', file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setData('image', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(user.discussion.store.url(course.slug), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Diskusi berhasil dibuat!');
                reset();
                removeImage();
            },
            onError: () => {
                toast.error('Gagal membuat diskusi. Silakan coba lagi.');
            },
        });
    };

    return (
        <>
            <Head title={`Diskusi - ${course.title}`} />

            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <header className="sticky top-0 z-20 border-b bg-white">
                    <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 lg:px-6 lg:py-4">
                        <div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="shrink-0 text-slate-600 hover:text-slate-900"
                            >
                                <Link href={user.learn.course.url(course.slug)}>
                                    <ArrowLeft className="h-4 w-4 lg:mr-2" />
                                    <span className="hidden lg:inline">Kembali ke Kelas</span>
                                </Link>
                            </Button>

                            <Separator orientation="vertical" className="h-6 shrink-0" />

                            <div className="min-w-0">
                                <h1 className="truncate text-sm font-semibold leading-tight text-slate-900 lg:text-base">
                                    Diskusi - {course.title}
                                </h1>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
                    <div className="mx-auto max-w-4xl space-y-6">
                        {/* Create Discussion Form */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-semibold text-slate-900">Buat Diskusi Baru</h2>
                                <p className="text-sm text-muted-foreground">
                                    Tanyakan sesuatu atau mulai diskusi dengan mentor dan peserta lain
                                </p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Judul Diskusi</Label>
                                        <Input
                                            id="title"
                                            placeholder="Tulis judul diskusi..."
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className={cn(errors.title && 'border-red-500')}
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content">Pesan</Label>
                                        <Textarea
                                            id="content"
                                            placeholder="Tulis pertanyaan atau diskusi..."
                                            rows={5}
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            className={cn(errors.content && 'border-red-500')}
                                        />
                                        {errors.content && (
                                            <p className="text-sm text-red-500">{errors.content}</p>
                                        )}
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <Label>Gambar (Opsional)</Label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageSelect}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <ImagePlus className="mr-2 h-4 w-4" />
                                                Pilih Gambar
                                            </Button>
                                            {selectedImage && (
                                                <span className="text-sm text-muted-foreground">
                                                    {selectedImage.name}
                                                </span>
                                            )}
                                        </div>
                                        {errors.image && (
                                            <p className="text-sm text-red-500">{errors.image}</p>
                                        )}

                                        {/* Image Preview */}
                                        {imagePreview && (
                                            <div className="relative inline-block">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-32 w-auto rounded-lg border object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                                                    onClick={removeImage}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={processing}>
                                            <Send className="mr-2 h-4 w-4" />
                                            Kirim Diskusi
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Discussions List */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Semua Diskusi ({discussions.length})
                            </h2>

                            {discussions.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <MessageCircle className="mx-auto h-12 w-12 text-slate-300" />
                                        <p className="mt-4 text-sm text-muted-foreground">
                                            Belum ada diskusi. Jadilah yang pertama memulai diskusi!
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                discussions.map((discussion) => (
                                    <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                {/* User Info */}
                                                <div className="flex items-start justify-between">
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
                                                            <p className="font-medium text-slate-900">
                                                                {discussion.user.name}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {discussion.createdAt}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {discussion.isResolved && (
                                                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Terjawab
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    {discussion.title}
                                                </h3>

                                                {/* Content */}
                                                <p className="text-slate-700 whitespace-pre-wrap">
                                                    {discussion.content}
                                                </p>

                                                {/* Image */}
                                                {discussion.image && (
                                                    <img
                                                        src={discussion.image}
                                                        alt="Discussion attachment"
                                                        className="max-h-64 w-auto rounded-lg border object-cover"
                                                    />
                                                )}

                                                {/* Footer */}
                                                <div className="flex items-center justify-between border-t pt-4">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MessageCircle className="h-4 w-4" />
                                                        <span>{discussion.repliesCount} balasan</span>
                                                    </div>

                                                    <Button variant="outline" size="sm">
                                                        Lihat Diskusi
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
