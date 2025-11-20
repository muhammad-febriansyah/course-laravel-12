export interface ManagedUser {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    role?: 'admin' | 'mentor' | 'user' | null;
    status: number;
    avatar?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface UserCollection {
    data: ManagedUser[];
    meta: {
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
    };
}
