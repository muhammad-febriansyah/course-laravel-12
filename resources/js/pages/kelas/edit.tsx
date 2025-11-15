import { CurrencyInput } from '@/components/currency-input';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { YouTubeInput } from '@/components/youtube-preview';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    FileQuestion,
    GripVertical,
    ImageIcon,
    Plus,
    Trash2,
    Upload,
    Video,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const getBreadcrumbs = (
    basePath: string,
    kelasId: number,
    kelasTitle: string,
): BreadcrumbItem[] => [
    {
        title: 'Kelas',
        href: basePath,
    },
    {
        title: kelasTitle,
        href: `${basePath}/${kelasId}`,
    },
    {
        title: 'Edit',
        href: `${basePath}/${kelasId}/edit`,
    },
];

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

interface VideoType {
    id?: number;
    title: string;
    video: string;
}

interface SectionType {
    id?: number;
    title: string;
    videos?: VideoType[];
}

interface QuizType {
    id?: number;
    question: string;
    answer: string;
    image?: any;
    point: string;
}

interface Kelas {
    id: number;
    title: string;
    category_id: number;
    type_id: number;
    level_id: number;
    price: number;
    discount: number;
    benefit: string | null;
    desc: string | null;
    body: string | null;
    image: string | null;
    status: 'draft' | 'published';
    sections: SectionType[];
    quizzes: QuizType[];
}

interface Props {
    kelas: Kelas;
    categories: Category[];
    types: Type[];
    levels: Level[];
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

// Zod schema for validation
const kelasSchema = z.object({
    title: z.string().min(1, 'Judul harus diisi'),
    category_id: z.string().min(1, 'Kategori harus dipilih'),
    type_id: z.string().min(1, 'Tipe harus dipilih'),
    level_id: z.string().min(1, 'Level harus dipilih'),
    price: z.string().min(1, 'Harga harus diisi'),
    discount: z.string().optional(),
    benefit: z.string().optional(),
    desc: z.string().optional(),
    body: z.string().optional(),
    image: z.any().optional(),
    status: z.enum(['draft', 'published']),
    sections: z
        .array(
            z.object({
                id: z.number().optional(),
                title: z.string().min(1, 'Judul section harus diisi'),
                videos: z
                    .array(
                        z.object({
                            id: z.number().optional(),
                            title: z.string().min(1, 'Judul video harus diisi'),
                            video: z.string().url('URL YouTube harus valid'),
                        }),
                    )
                    .optional(),
            }),
        )
        .optional(),
    quizzes: z
        .array(
            z.object({
                id: z.number().optional(),
                question: z.string().min(1, 'Pertanyaan harus diisi'),
                answer: z.string().min(1, 'Jawaban harus diisi'),
                image: z.any().optional(),
                point: z.string().min(1, 'Poin harus diisi'),
            }),
        )
        .optional(),
});

type KelasFormData = z.infer<typeof kelasSchema>;

export default function Edit({
    kelas,
    categories,
    types,
    levels,
    basePath = '/mentor/kelas',
}: Props) {
    const breadcrumbs = getBreadcrumbs(basePath, kelas.id, kelas.title);
    const [imagePreview, setImagePreview] = useState<string | null>(
        resolveImageUrl(kelas.image),
    );
    const [quizImagePreviews, setQuizImagePreviews] = useState<{
        [key: number]: string;
    }>({});

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<KelasFormData>({
        resolver: zodResolver(kelasSchema),
        defaultValues: {
            title: kelas.title,
            category_id: String(kelas.category_id),
            type_id: String(kelas.type_id),
            level_id: String(kelas.level_id),
            price: String(kelas.price),
            discount: kelas.discount ? String(kelas.discount) : '',
            benefit: kelas.benefit || '',
            desc: kelas.desc || '',
            body: kelas.body || '',
            status: kelas.status,
            sections: kelas.sections || [],
            quizzes:
                kelas.quizzes.map((q) => ({
                    ...q,
                    point: String(q.point),
                })) || [],
        },
    });

    const {
        fields: sectionFields,
        append: appendSection,
        remove: removeSection,
    } = useFieldArray({
        control,
        name: 'sections',
    });

    const {
        fields: quizFields,
        append: appendQuiz,
        remove: removeQuiz,
    } = useFieldArray({
        control,
        name: 'quizzes',
    });

    // Set quiz image previews from existing data
    useEffect(() => {
        const previews: { [key: number]: string } = {};
        kelas.quizzes.forEach((quiz, index) => {
            if (quiz.image) {
                const url = resolveImageUrl(quiz.image);
                if (url) {
                    previews[index] = url;
                }
            }
        });
        setQuizImagePreviews(previews);
    }, [kelas.quizzes]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQuizImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQuizImagePreviews((prev) => ({
                    ...prev,
                    [index]: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        const input = document.getElementById('image') as HTMLInputElement;
        if (input) input.value = '';
    };

    const removeQuizImage = (index: number) => {
        setQuizImagePreviews((prev) => {
            const newPreviews = { ...prev };
            delete newPreviews[index];
            return newPreviews;
        });
        const input = document.getElementById(
            `quiz-image-${index}`,
        ) as HTMLInputElement;
        if (input) input.value = '';
    };

    const onSubmit = (data: KelasFormData) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');

        // Basic fields
        formData.append('title', data.title);
        formData.append('category_id', data.category_id);
        formData.append('type_id', data.type_id);
        formData.append('level_id', data.level_id);
        formData.append('price', data.price);
        if (data.discount) formData.append('discount', data.discount);
        if (data.benefit) formData.append('benefit', data.benefit);
        if (data.desc) formData.append('desc', data.desc);
        if (data.body) formData.append('body', data.body);
        formData.append('status', data.status);

        // Image
        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }

        // Sections with videos
        if (data.sections && data.sections.length > 0) {
            data.sections.forEach((section, sIndex) => {
                if (section.id) {
                    formData.append(
                        `sections[${sIndex}][id]`,
                        String(section.id),
                    );
                }
                formData.append(`sections[${sIndex}][title]`, section.title);

                if (section.videos && section.videos.length > 0) {
                    section.videos.forEach((video, vIndex) => {
                        if (video.id) {
                            formData.append(
                                `sections[${sIndex}][videos][${vIndex}][id]`,
                                String(video.id),
                            );
                        }
                        formData.append(
                            `sections[${sIndex}][videos][${vIndex}][title]`,
                            video.title,
                        );
                        formData.append(
                            `sections[${sIndex}][videos][${vIndex}][video]`,
                            video.video,
                        );
                    });
                }
            });
        }

        // Quizzes
        if (data.quizzes && data.quizzes.length > 0) {
            data.quizzes.forEach((quiz, qIndex) => {
                if (quiz.id) {
                    formData.append(`quizzes[${qIndex}][id]`, String(quiz.id));
                }
                formData.append(`quizzes[${qIndex}][question]`, quiz.question);
                formData.append(`quizzes[${qIndex}][answer]`, quiz.answer);
                formData.append(`quizzes[${qIndex}][point]`, quiz.point);

                if (quiz.image && quiz.image[0]) {
                    formData.append(`quizzes[${qIndex}][image]`, quiz.image[0]);
                }
            });
        }

        router.post(`${basePath}/${kelas.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Kelas berhasil diupdate!');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Gagal mengupdate kelas. Periksa form Anda.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${kelas.title}`} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            <CardTitle>Informasi Dasar</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 pb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="title">
                                    Judul Kelas
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    {...register('title')}
                                    placeholder="Masukkan judul kelas"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category_id">
                                    Kategori
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name="category_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem
                                                        key={cat.id}
                                                        value={String(cat.id)}
                                                    >
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.category_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.category_id.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type_id">
                                    Tipe
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name="type_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih tipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {types.map((type) => (
                                                    <SelectItem
                                                        key={type.id}
                                                        value={String(type.id)}
                                                    >
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.type_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.type_id.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="level_id">
                                    Level
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name="level_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {levels.map((level) => (
                                                    <SelectItem
                                                        key={level.id}
                                                        value={String(level.id)}
                                                    >
                                                        {level.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.level_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.level_id.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">
                                    Harga
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field }) => (
                                        <CurrencyInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            placeholder="0"
                                        />
                                    )}
                                />
                                {errors.price && (
                                    <p className="text-sm text-destructive">
                                        {errors.price.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="discount">Diskon</Label>
                                <Controller
                                    name="discount"
                                    control={control}
                                    render={({ field }) => (
                                        <CurrencyInput
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            placeholder="0"
                                        />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">
                                    Status
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">
                                                    Draft
                                                </SelectItem>
                                                <SelectItem value="pending">
                                                    Ajukan Review
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="image">Gambar Kelas</Label>
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-48 w-full rounded-lg border object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={removeImage}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:border-muted-foreground/50">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="rounded-full bg-muted p-4">
                                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium">
                                                    Upload gambar kelas
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG, JPEG hingga 2MB
                                                </p>
                                            </div>
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                {...register('image', {
                                                    onChange: handleImageChange,
                                                })}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    document
                                                        .getElementById('image')
                                                        ?.click()
                                                }
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Pilih Gambar
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="benefit">Benefit</Label>
                                <Textarea
                                    id="benefit"
                                    {...register('benefit')}
                                    placeholder="Masukkan benefit kelas"
                                    rows={3}
                                />
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="desc">Deskripsi Singkat</Label>
                                <Textarea
                                    id="desc"
                                    {...register('desc')}
                                    placeholder="Masukkan deskripsi singkat"
                                    rows={3}
                                />
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="body">Deskripsi Lengkap</Label>
                                <Textarea
                                    id="body"
                                    {...register('body')}
                                    placeholder="Masukkan deskripsi lengkap"
                                    rows={5}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sections & Videos - Same as create.tsx */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div className="flex items-center gap-2">
                            <Video className="h-5 w-5" />
                            <CardTitle>Materi & Video</CardTitle>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                appendSection({ title: '', videos: [] })
                            }
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Section
                        </Button>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        {sectionFields.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                Belum ada section. Klik "Tambah Section" untuk
                                memulai.
                            </p>
                        ) : (
                            <Accordion type="multiple" className="space-y-4">
                                {sectionFields.map((section, sIndex) => (
                                    <SectionItem
                                        key={section.id}
                                        sIndex={sIndex}
                                        register={register}
                                        control={control}
                                        errors={errors}
                                        removeSection={removeSection}
                                        watch={watch}
                                    />
                                ))}
                            </Accordion>
                        )}
                    </CardContent>
                </Card>

                {/* Quizzes - Same structure as create.tsx */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div className="flex items-center gap-2">
                            <FileQuestion className="h-5 w-5" />
                            <CardTitle>Kuis</CardTitle>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                appendQuiz({
                                    question: '',
                                    answer: '',
                                    point: '10',
                                })
                            }
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kuis
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 pb-6">
                        {quizFields.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                Belum ada kuis. Klik "Tambah Kuis" untuk
                                memulai.
                            </p>
                        ) : (
                            quizFields.map((quiz, qIndex) => (
                                <div
                                    key={quiz.id}
                                    className="space-y-4 rounded-lg border p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">
                                            Kuis #{qIndex + 1}
                                        </h4>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeQuiz(qIndex)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-2">
                                            <Label>Pertanyaan</Label>
                                            <Textarea
                                                {...register(
                                                    `quizzes.${qIndex}.question`,
                                                )}
                                                placeholder="Masukkan pertanyaan"
                                                rows={3}
                                            />
                                            {errors.quizzes?.[qIndex]
                                                ?.question && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors.quizzes[qIndex]
                                                            .question.message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label>Jawaban</Label>
                                            <Textarea
                                                {...register(
                                                    `quizzes.${qIndex}.answer`,
                                                )}
                                                placeholder="Masukkan jawaban"
                                                rows={2}
                                            />
                                            {errors.quizzes?.[qIndex]
                                                ?.answer && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors.quizzes[qIndex]
                                                            .answer.message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Poin</Label>
                                            <Input
                                                type="number"
                                                {...register(
                                                    `quizzes.${qIndex}.point`,
                                                )}
                                                placeholder="10"
                                            />
                                            {errors.quizzes?.[qIndex]
                                                ?.point && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors.quizzes[qIndex]
                                                            .point.message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Gambar (Opsional)</Label>
                                            {quizImagePreviews[qIndex] ? (
                                                <div className="relative">
                                                    <img
                                                        src={
                                                            quizImagePreviews[
                                                                qIndex
                                                            ]
                                                        }
                                                        alt="Preview"
                                                        className="h-32 w-full rounded-lg border object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-8 w-8"
                                                        onClick={() =>
                                                            removeQuizImage(
                                                                qIndex,
                                                            )
                                                        }
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 text-center transition-colors hover:border-muted-foreground/50">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                        <p className="text-xs text-muted-foreground">
                                                            PNG, JPG, JPEG
                                                            hingga 2MB
                                                        </p>
                                                        <Input
                                                            id={`quiz-image-${qIndex}`}
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            {...register(
                                                                `quizzes.${qIndex}.image`,
                                                                {
                                                                    onChange: (
                                                                        e,
                                                                    ) =>
                                                                        handleQuizImageChange(
                                                                            e,
                                                                            qIndex,
                                                                        ),
                                                                },
                                                            )}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                document
                                                                    .getElementById(
                                                                        `quiz-image-${qIndex}`,
                                                                    )
                                                                    ?.click()
                                                            }
                                                        >
                                                            <Upload className="mr-2 h-3 w-3" />
                                                            Pilih Gambar
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.visit('/kelas')}
                    >
                        Batal
                    </Button>
                    <Button type="submit">Update Kelas</Button>
                </div>
            </form>
        </AppLayout>
    );
}

// Separate component for Section Item (same as create.tsx)
function SectionItem({
    sIndex,
    register,
    control,
    errors,
    removeSection,
    watch,
}: any) {
    const {
        fields: videoFields,
        append: appendVideo,
        remove: removeVideo,
    } = useFieldArray({
        control,
        name: `sections.${sIndex}.videos`,
    });

    return (
        <AccordionItem
            value={`section-${sIndex}`}
            className="rounded-lg border px-4"
        >
            <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center justify-between pr-4">
                    <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span>Section #{sIndex + 1}</span>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeSection(sIndex);
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label>Judul Section</Label>
                    <Input
                        {...register(`sections.${sIndex}.title`)}
                        placeholder="Masukkan judul section"
                    />
                    {errors.sections?.[sIndex]?.title && (
                        <p className="text-sm text-destructive">
                            {errors.sections[sIndex].title.message}
                        </p>
                    )}
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">Video</h5>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                appendVideo({ title: '', video: '' })
                            }
                        >
                            <Plus className="mr-2 h-3 w-3" />
                            Tambah Video
                        </Button>
                    </div>

                    {videoFields.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            Belum ada video
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {videoFields.map((video, vIndex) => (
                                <div
                                    key={video.id}
                                    className="space-y-3 rounded-lg bg-muted/50 p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            Video #{vIndex + 1}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeVideo(vIndex)}
                                        >
                                            <Trash2 className="h-3 w-3 text-destructive" />
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs">
                                            Judul Video
                                        </Label>
                                        <Input
                                            {...register(
                                                `sections.${sIndex}.videos.${vIndex}.title`,
                                            )}
                                            placeholder="Masukkan judul video"
                                        />
                                        {errors.sections?.[sIndex]?.videos?.[
                                            vIndex
                                        ]?.title && (
                                            <p className="text-xs text-destructive">
                                                {
                                                    errors.sections[sIndex]
                                                        .videos[vIndex].title
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs">
                                            URL YouTube
                                        </Label>
                                        <Controller
                                            name={`sections.${sIndex}.videos.${vIndex}.video`}
                                            control={control}
                                            render={({ field }) => (
                                                <YouTubeInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    title={watch(
                                                        `sections.${sIndex}.videos.${vIndex}.title`,
                                                    )}
                                                    error={
                                                        errors.sections?.[
                                                            sIndex
                                                        ]?.videos?.[vIndex]
                                                            ?.video?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
