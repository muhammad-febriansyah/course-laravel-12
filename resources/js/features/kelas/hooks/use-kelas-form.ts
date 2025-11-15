import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { kelasFormSchema, KelasFormData, validationFieldsByStep } from '../schemas/kelas-schema';
import { DEFAULT_FORM_VALUES } from '../constants';
import { Kelas } from '../types';

interface UseKelasFormOptions {
    initialData?: Kelas;
    isEditing?: boolean;
}

/**
 * Custom hook untuk handle form logic kelas
 * Memisahkan business logic dari UI components
 */
export function useKelasForm({ initialData, isEditing = false }: UseKelasFormOptions = {}) {
    const [currentStep, setCurrentStep] = useState(1);

    const form = useForm<KelasFormData>({
        resolver: zodResolver(kelasFormSchema),
        defaultValues: initialData
            ? {
                  title: initialData.title,
                  category_id: String(initialData.category_id),
                  type_id: String(initialData.type_id),
                  level_id: String(initialData.level_id),
                  price: String(initialData.price),
                  discount: initialData.discount ? String(initialData.discount) : '0',
                  benefit: initialData.benefit || '',
                  desc: initialData.desc || '',
                  body: initialData.body || '',
                  status: initialData.status,
                  sections: initialData.sections || [],
                  quizzes:
                      initialData.quizzes?.map((q) => ({
                          ...q,
                          point: String(q.point),
                      })) || [],
              }
            : DEFAULT_FORM_VALUES,
    });

    const nextStep = async () => {
        const fieldsToValidate = validationFieldsByStep[currentStep as keyof typeof validationFieldsByStep];
        const isValid = await form.trigger(fieldsToValidate);

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, 3));
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

        // Append basic fields
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

        // Append image
        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }

        // Append sections with videos
        if (data.sections && data.sections.length > 0) {
            data.sections.forEach((section, sIndex) => {
                if (section.id) {
                    formData.append(`sections[${sIndex}][id]`, String(section.id));
                }
                formData.append(`sections[${sIndex}][title]`, section.title);

                if (section.videos && section.videos.length > 0) {
                    section.videos.forEach((video, vIndex) => {
                        if (video.id) {
                            formData.append(
                                `sections[${sIndex}][videos][${vIndex}][id]`,
                                String(video.id)
                            );
                        }
                        formData.append(
                            `sections[${sIndex}][videos][${vIndex}][title]`,
                            video.title
                        );
                        formData.append(
                            `sections[${sIndex}][videos][${vIndex}][video]`,
                            video.video
                        );
                    });
                }
            });
        }

        // Append quizzes
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

        const url = isEditing ? `/kelas/${initialData?.id}` : '/kelas';
        const method = isEditing ? 'post' : 'post';

        if (isEditing) {
            formData.append('_method', 'PUT');
        }

        router[method](url, formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success(
                    isEditing ? 'Kelas berhasil diupdate!' : 'Kelas berhasil dibuat!'
                );
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Gagal menyimpan kelas. Periksa form Anda.');
            },
        });
    };

    return {
        form,
        currentStep,
        nextStep,
        prevStep,
        goToStep,
        onSubmit,
    };
}
