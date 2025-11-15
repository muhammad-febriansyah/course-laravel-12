import { z } from 'zod';

/**
 * Validation schema untuk form Kelas
 * Menggunakan Zod untuk type-safe validation dengan pesan error bahasa Indonesia
 */
export const kelasFormSchema = z.object({
    // Informasi Dasar
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
    benefit: z.string().optional().or(z.literal('')),
    desc: z.string().optional().or(z.literal('')),
    body: z.string().optional().or(z.literal('')),
    image: z.any().optional(),
    status: z.enum(['draft', 'published'], {
        message: 'Status harus dipilih',
    }),

    // Sections & Videos
    sections: z
        .array(
            z.object({
                id: z.number().optional(),
                title: z
                    .string({ message: 'Judul section harus diisi' })
                    .min(1, 'Judul section harus diisi'),
                videos: z
                    .array(
                        z.object({
                            id: z.number().optional(),
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

    // Quizzes
    quizzes: z
        .array(
            z.object({
                id: z.number().optional(),
                question: z
                    .string({ message: 'Pertanyaan harus diisi' })
                    .min(1, 'Pertanyaan harus diisi'),
                answer: z
                    .string({ message: 'Jawaban harus diisi' })
                    .min(1, 'Jawaban harus diisi'),
                image: z.any().optional(),
                point: z
                    .string({ message: 'Poin harus diisi' })
                    .min(1, 'Poin harus diisi'),
            }),
        )
        .optional(),
});

export type KelasFormData = z.infer<typeof kelasFormSchema>;

/**
 * Field groups untuk validasi per step
 */
export const validationFieldsByStep = {
    1: ['title', 'category_id', 'type_id', 'level_id', 'price'] as Array<
        keyof KelasFormData
    >,
    2: [] as Array<keyof KelasFormData>, // Sections optional
    3: [] as Array<keyof KelasFormData>, // Quizzes optional
};
