import type { Course } from '@/types/course';

export interface Enrollment {
    id: number;
    status: 'active' | 'completed' | 'expired';
    enrolledAt?: string | null;
    completedAt?: string | null;
    expiresAt?: string | null;
    course: Course;
    progress?: number;
    videosCompleted?: number;
    quizzesCompleted?: number;
    lastAccessedAt?: string | null;
}
