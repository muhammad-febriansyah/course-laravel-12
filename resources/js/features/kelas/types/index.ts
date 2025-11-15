// Core entity types
export interface Category {
    id: number;
    name: string;
}

export interface Type {
    id: number;
    name: string;
}

export interface Level {
    id: number;
    name: string;
}

export interface Video {
    id?: number;
    title: string;
    video: string;
    slug?: string;
}

export interface Section {
    id?: number;
    title: string;
    videos?: Video[];
}

export interface Quiz {
    id?: number;
    question: string;
    answer: string;
    image?: File | string | null;
    point: string | number;
}

export interface Kelas {
    id?: number;
    title: string;
    slug?: string;
    category_id: number | string;
    type_id: number | string;
    level_id: number | string;
    price: number | string;
    discount?: number | string;
    benefit?: string | null;
    desc?: string | null;
    body?: string | null;
    image?: File | string | null;
    status: 'draft' | 'published';
    views?: number;
    sections?: Section[];
    quizzes?: Quiz[];
    created_at?: string;
    updated_at?: string;
}

// Form props types
export interface KelasFormProps {
    categories: Category[];
    types: Type[];
    levels: Level[];
    kelas?: Kelas;
}

// Form step configuration
export interface FormStep {
    title: string;
    description: string;
}
