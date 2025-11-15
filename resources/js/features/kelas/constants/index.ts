import { FormStep } from '../types';

/**
 * Form steps configuration
 */
export const FORM_STEPS: FormStep[] = [
    { title: 'Informasi Dasar', description: 'Detail kelas' },
    { title: 'Materi & Video', description: 'Konten pembelajaran' },
    { title: 'Kuis', description: 'Evaluasi siswa' },
];

/**
 * Default form values
 */
export const DEFAULT_FORM_VALUES = {
    status: 'draft' as const,
    discount: '0',
    sections: [],
    quizzes: [],
};

/**
 * Default quiz point value
 */
export const DEFAULT_QUIZ_POINT = '10';
