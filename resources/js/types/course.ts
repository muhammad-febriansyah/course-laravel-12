export interface CourseCategory {
    id: number;
    name: string;
    slug?: string;
}

export interface CourseInstructor {
    id: number;
    name: string;
    avatar?: string | null;
}

export interface CourseVideo {
    id: number;
    title: string;
    slug: string;
    url: string;
    embedUrl?: string | null;
}

export interface CourseSection {
    id: number;
    title: string;
    videos: CourseVideo[];
}

export interface CourseQuiz {
    id: number;
    question: string;
    point: number;
    answer: Record<string, unknown>;
}

export interface CourseReviewAuthor {
    id?: number;
    name?: string;
    avatar?: string | null;
}

export interface CourseReview {
    id: number;
    rating: number;
    comment?: string | null;
    createdAt?: string;
    created_at?: string;
    user?: CourseReviewAuthor;
    author?: CourseReviewAuthor;
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    price: number;
    discount: number;
    finalPrice: number;
    image: string;
    shortDescription: string;
    body?: string;
    benefits: string[];
    level?: CourseCategory;
    type?: CourseCategory;
    category?: CourseCategory;
    instructor?: CourseInstructor;
    sections?: CourseSection[];
    quizzes?: CourseQuiz[];
    reviews?: CourseReview[];
    views: number;
    isEnrolled?: boolean;
    previewLimit?: number;
}

export interface CourseWithStats extends Course {
    enrollments_count?: number;
    rating_avg?: number;
    progress?: number;
}

export interface CatalogFilters {
    search?: string;
    category?: string;
    level?: string;
    type?: string;
}

export interface CatalogOptions {
    categories: CourseCategory[];
    levels: CourseCategory[];
    types: CourseCategory[];
}

export interface PaginationMeta {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
}
