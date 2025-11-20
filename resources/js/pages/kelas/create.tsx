const getBreadcrumbs = (basePath: string): BreadcrumbItem[] => [
    { title: 'Kelas', href: basePath },
    { title: 'Tambah Kelas', href: `${basePath}/create` },
];

import { CurrencyInput } from '@/components/currency-input';
import { FormStepper } from '@/components/form-stepper';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
    ArrowLeft,
    ArrowRight,
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
import { useState } from 'react';
import {
    Control,
    Controller,
    FieldErrors,
    useFieldArray,
    useForm,
    UseFormRegister,
    UseFormWatch,
} from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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

interface Benefit {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    types: Type[];
    levels: Level[];
    benefits: Benefit[];
    basePath?: string;
}

const kelasSchema = z.object({
    title: z
        .string({ message: 'Judul harus diisi' })
        .min(1, 'Judul harus diisi'),
    category_id: z
        .string({ message: 'Kategori harus dipilih' })
        .min(1, 'Kategori harus dipilih'),
    type_id: z
        .string({ message: 'Tipe harus dipilih' })
        .min(1, 'Tipe harus dipilih'),
    level_id: z
        .string({ message: 'Level harus dipilih' })
        .min(1, 'Level harus dipilih'),
    price: z
        .string({ message: 'Harga harus diisi' })
        .min(1, 'Harga harus diisi'),
    discount: z.string().optional().or(z.literal('')),
    benefits: z.array(z.number()).optional(),
    desc: z.string().optional().or(z.literal('')),
    body: z.string().optional().or(z.literal('')),
    image: z.any().optional(),
    status: z.enum(['draft', 'pending'], {
        message: 'Status harus dipilih',
    }),
    sections: z
        .array(
            z.object({
                title: z
                    .string({ message: 'Judul section harus diisi' })
                    .min(1, 'Judul section harus diisi'),
                videos: z
                    .array(
                        z.object({
                            title: z
                                .string({ message: 'Judul video harus diisi' })
                                .min(1, 'Judul video harus diisi'),
                            video: z
                                .string({ message: 'URL YouTube harus diisi' })
                                .url('URL YouTube harus valid'),
                        }),
                    )
                    .optional(),
            }),
        )
        .optional(),
    quizzes: z
        .array(
            z.object({
                question: z
                    .string({ message: 'Pertanyaan harus diisi' })
                    .min(1, 'Pertanyaan harus diisi'),
                image: z.any().optional(),
                answers: z
                    .array(
                        z.object({
                            answer: z
                                .string({ message: 'Jawaban harus diisi' })
                                .min(1, 'Jawaban harus diisi'),
                            point: z
                                .string({ message: 'Poin harus diisi' })
                                .min(1, 'Poin harus diisi'),
                        }),
                    )
                    .min(4, 'Minimal 4 jawaban diperlukan')
                    .optional(),
            }),
        )
        .optional(),
});

type KelasFormData = z.infer<typeof kelasSchema>;

export default function Create({
    categories,
    types,
    levels,
    benefits,
    basePath = '/mentor/kelas',
}: Props) {
    const breadcrumbs = getBreadcrumbs(basePath);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [quizImagePreviews, setQuizImagePreviews] = useState<{
        [key: number]: string;
    }>({});
    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        { title: 'Informasi Dasar', description: 'Detail kelas' },
        { title: 'Materi & Video', description: 'Konten pembelajaran' },
        { title: 'Kuis', description: 'Evaluasi siswa' },
        { title: 'Review', description: 'Periksa & simpan' },
    ];

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
    } = useForm<KelasFormData>({
        resolver: zodResolver(kelasSchema),
        defaultValues: {
            status: 'draft',
            discount: '0',
            sections: [],
            quizzes: [],
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

    const nextStep = async () => {
        let fieldsToValidate: Array<keyof KelasFormData> = [];

        // Validate fields based on current step
        if (currentStep === 1) {
            fieldsToValidate = [
                'title',
                'category_id',
                'type_id',
                'level_id',
                'price',
            ];
        }

        const isValid = await trigger(fieldsToValidate);

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const goToStep = (step: number) => {
        if (step <= currentStep) {
            setCurrentStep(step);
        }
    };

    const onSubmit = (data: KelasFormData) => {
        const formData = new FormData();

        // Basic fields
        formData.append('title', data.title);
        formData.append('category_id', data.category_id);
        formData.append('type_id', data.type_id);
        formData.append('level_id', data.level_id);
        formData.append('price', data.price);
        if (data.discount) formData.append('discount', data.discount);
        if (data.benefits && data.benefits.length > 0) {
            data.benefits.forEach((benefitId, index) => {
                formData.append(`benefits[${index}]`, String(benefitId));
            });
        }
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
                formData.append(`sections[${sIndex}][title]`, section.title);

                if (section.videos && section.videos.length > 0) {
                    section.videos.forEach((video, vIndex) => {
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
                formData.append(`quizzes[${qIndex}][question]`, quiz.question);

                // Quiz answers
                if (quiz.answers && quiz.answers.length > 0) {
                    quiz.answers.forEach((ans, ansIndex) => {
                        formData.append(
                            `quizzes[${qIndex}][answers][${ansIndex}][answer]`,
                            ans.answer,
                        );
                        formData.append(
                            `quizzes[${qIndex}][answers][${ansIndex}][point]`,
                            ans.point,
                        );
                    });
                }

                if (quiz.image && quiz.image[0]) {
                    formData.append(`quizzes[${qIndex}][image]`, quiz.image[0]);
                }
            });
        }

        toast.promise(
            new Promise((resolve, reject) => {
                router.post(basePath, formData, {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        resolve('success');
                    },
                    onError: (errors) => {
                        console.error('Create errors:', errors);
                        const firstError = Object.values(errors)[0];
                        const errorMessage = Array.isArray(firstError)
                            ? firstError[0]
                            : firstError || 'Terjadi kesalahan saat membuat kelas';
                        reject(new Error(errorMessage));
                    },
                });
            }),
            {
                loading: 'Menyimpan kelas...',
                success: 'Kelas berhasil dibuat dan disimpan.',
                error: (err) => err.message || 'Gagal membuat kelas',
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kelas" />

            <div className="space-y-8 px-4 py-5">
                {/* Stepper */}
                <Card className="p-6">
                    <FormStepper
                        steps={steps}
                        currentStep={currentStep}
                        onStepClick={goToStep}
                    />
                </Card>

                <form
                    onSubmit={handleSubmit(
                        onSubmit,
                        (errors) => {

                            // Find first error
                            const firstErrorField = Object.keys(errors)[0];
                            const firstError = firstErrorField ? (errors as any)[firstErrorField] : null;
                            const errorMessage = firstError?.message || 'Mohon lengkapi semua field yang wajib diisi';

                            toast.error('Validasi Gagal!', {
                                description: errorMessage,
                                duration: 5000,
                            });
                        }
                    )}
                    className="space-y-6"
                >
                    {/* Step 1: Informasi Dasar */}
                    {currentStep === 1 && (
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
                                            <span className="text-destructive">
                                                *
                                            </span>
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
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Controller
                                            name="category_id"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih kategori" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map(
                                                            (cat) => (
                                                                <SelectItem
                                                                    key={cat.id}
                                                                    value={String(
                                                                        cat.id,
                                                                    )}
                                                                >
                                                                    {cat.name}
                                                                </SelectItem>
                                                            ),
                                                        )}
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
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Controller
                                            name="type_id"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih tipe" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {types.map((type) => (
                                                            <SelectItem
                                                                key={type.id}
                                                                value={String(
                                                                    type.id,
                                                                )}
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
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Controller
                                            name="level_id"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {levels.map((level) => (
                                                            <SelectItem
                                                                key={level.id}
                                                                value={String(
                                                                    level.id,
                                                                )}
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
                                            <span className="text-destructive">
                                                *
                                            </span>
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
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
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
                                        <Label htmlFor="image">
                                            Gambar Kelas
                                        </Label>
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
                                                            PNG, JPG, JPEG
                                                            hingga 2MB
                                                        </p>
                                                    </div>
                                                    <Input
                                                        id="image"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        {...register('image', {
                                                            onChange:
                                                                handleImageChange,
                                                        })}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    'image',
                                                                )
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

                                    <div className="col-span-2 space-y-3">
                                        <Label>Benefits Kelas</Label>
                                        <Controller
                                            name="benefits"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="space-y-2 rounded-lg border p-4">
                                                    {benefits.map((benefit) => (
                                                        <div key={benefit.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`benefit-${benefit.id}`}
                                                                checked={field.value?.includes(benefit.id)}
                                                                onCheckedChange={(checked) => {
                                                                    const currentValues = field.value || [];
                                                                    if (checked) {
                                                                        field.onChange([...currentValues, benefit.id]);
                                                                    } else {
                                                                        field.onChange(
                                                                            currentValues.filter((id) => id !== benefit.id)
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`benefit-${benefit.id}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                            >
                                                                {benefit.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="desc">
                                            Deskripsi Singkat
                                        </Label>
                                        <Textarea
                                            id="desc"
                                            {...register('desc')}
                                            placeholder="Masukkan deskripsi singkat"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="body">
                                            Deskripsi Lengkap
                                        </Label>
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
                    )}

                    {/* Step 2: Sections & Videos */}
                    {currentStep === 2 && (
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
                                        Belum ada section. Klik "Tambah Section"
                                        untuk memulai.
                                    </p>
                                ) : (
                                    <Accordion
                                        type="multiple"
                                        className="space-y-4"
                                    >
                                        {sectionFields.map(
                                            (section, sIndex) => (
                                                <SectionItem
                                                    key={section.id}
                                                    sIndex={sIndex}
                                                    register={register}
                                                    control={control}
                                                    errors={errors}
                                                    removeSection={
                                                        removeSection
                                                    }
                                                    watch={watch}
                                                />
                                            ),
                                        )}
                                    </Accordion>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Quizzes */}
                    {currentStep === 3 && (
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
                                            answers: [
                                                { answer: '', point: '0' },
                                                { answer: '', point: '0' },
                                                { answer: '', point: '0' },
                                                { answer: '', point: '0' },
                                            ],
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
                                        <QuizItem
                                            key={quiz.id}
                                            qIndex={qIndex}
                                            register={register}
                                            control={control}
                                            errors={errors}
                                            removeQuiz={removeQuiz}
                                            quizImagePreviews={
                                                quizImagePreviews
                                            }
                                            handleQuizImageChange={
                                                handleQuizImageChange
                                            }
                                            removeQuizImage={removeQuizImage}
                                        />
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/kelas')}
                        >
                            Batal
                        </Button>
                        {currentStep > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Sebelumnya
                            </Button>
                        )}
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/kelas')}
                            >
                                Batal
                            </Button>
                            {currentStep < steps.length ? (
                                <Button type="button" onClick={nextStep}>
                                    Selanjutnya
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="submit">Simpan Kelas</Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

// Separate component for Section Item to handle nested videos
interface SectionItemProps {
    sIndex: number;
    register: UseFormRegister<KelasFormData>;
    control: Control<KelasFormData>;
    errors: FieldErrors<KelasFormData>;
    removeSection: (index: number) => void;
    watch: UseFormWatch<KelasFormData>;
}

function SectionItem({
    sIndex,
    register,
    control,
    errors,
    removeSection,
    watch,
}: SectionItemProps) {
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
                    <span
                        role="button"
                        className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeSection(sIndex);
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </span>
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
                                            size-sm
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
                                                    value={field.value || ''}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    title={
                                                        watch(
                                                            `sections.${sIndex}.videos.${vIndex}.title`,
                                                        ) || ''
                                                    }
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

// Separate component for Quiz Item
interface QuizItemProps {
    qIndex: number;
    register: UseFormRegister<KelasFormData>;
    control: Control<KelasFormData>;
    errors: FieldErrors<KelasFormData>;
    removeQuiz: (index: number) => void;
    quizImagePreviews: { [key: number]: string };
    handleQuizImageChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => void;
    removeQuizImage: (index: number) => void;
}

function QuizItem({
    qIndex,
    register,
    control,
    errors,
    removeQuiz,
    quizImagePreviews,
    handleQuizImageChange,
    removeQuizImage,
}: QuizItemProps) {
    return (
        <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium">Kuis #{qIndex + 1}</h4>
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
                        {...register(`quizzes.${qIndex}.question`)}
                        placeholder="Masukkan pertanyaan"
                        rows={3}
                    />
                    {errors.quizzes?.[qIndex]?.question && (
                        <p className="text-sm text-destructive">
                            {errors.quizzes[qIndex].question.message}
                        </p>
                    )}
                </div>

                <div className="col-span-2 space-y-2">
                    <Label>Gambar (Opsional)</Label>
                    {quizImagePreviews[qIndex] ? (
                        <div className="relative">
                            <img
                                src={quizImagePreviews[qIndex]}
                                alt="Preview"
                                className="h-32 w-full rounded-lg border object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={() => removeQuizImage(qIndex)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 text-center transition-colors hover:border-muted-foreground/50">
                            <div className="flex flex-col items-center gap-2">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG, JPEG hingga 2MB
                                </p>
                                <Input
                                    id={`quiz-image-${qIndex}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    {...register(`quizzes.${qIndex}.image`, {
                                        onChange: (e) =>
                                            handleQuizImageChange(e, qIndex),
                                    })}
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

                <QuizAnswers
                    qIndex={qIndex}
                    control={control}
                    register={register}
                    errors={errors}
                />
            </div>
        </div>
    );
}

// Component for Quiz Answers
interface QuizAnswersProps {
    qIndex: number;
    control: Control<KelasFormData>;
    register: UseFormRegister<KelasFormData>;
    errors: FieldErrors<KelasFormData>;
}

function QuizAnswers({ qIndex, control, register, errors }: QuizAnswersProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `quizzes.${qIndex}.answers`,
    });

    return (
        <div className="col-span-2 space-y-3">
            <div className="flex items-center justify-between">
                <Label>Opsi Jawaban</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ answer: '', point: '0' })}
                >
                    <Plus className="mr-2 h-3 w-3" />
                    Tambah Jawaban
                </Button>
            </div>

            <div className="space-y-3">
                {fields.map((field, ansIndex) => (
                    <div
                        key={field.id}
                        className="grid grid-cols-12 items-start gap-2"
                    >
                        <div className="col-span-8 space-y-1">
                            <Input
                                {...register(
                                    `quizzes.${qIndex}.answers.${ansIndex}.answer`,
                                )}
                                placeholder={`Jawaban ${ansIndex + 1}`}
                            />
                            {errors.quizzes?.[qIndex]?.answers?.[ansIndex]
                                ?.answer && (
                                <p className="text-xs text-destructive">
                                    {
                                        errors.quizzes[qIndex].answers![
                                            ansIndex
                                        ]!.answer!.message
                                    }
                                </p>
                            )}
                        </div>
                        <div className="col-span-3 space-y-1">
                            <Input
                                type="number"
                                {...register(
                                    `quizzes.${qIndex}.answers.${ansIndex}.point`,
                                )}
                                placeholder="Poin"
                            />
                            {errors.quizzes?.[qIndex]?.answers?.[ansIndex]
                                ?.point && (
                                <p className="text-xs text-destructive">
                                    {
                                        errors.quizzes[qIndex].answers![
                                            ansIndex
                                        ]!.point!.message
                                    }
                                </p>
                            )}
                        </div>
                        <div className="col-span-1 flex items-center">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(ansIndex)}
                                disabled={fields.length <= 4}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {errors.quizzes?.[qIndex]?.answers &&
                typeof errors.quizzes[qIndex].answers === 'object' &&
                'message' in errors.quizzes[qIndex].answers! && (
                    <p className="text-sm text-destructive">
                        {
                            (
                                errors.quizzes[qIndex].answers as {
                                    message?: string;
                                }
                            ).message
                        }
                    </p>
                )}
        </div>
    );
}
