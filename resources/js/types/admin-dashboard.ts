export interface DashboardSummary {
    totalRevenue: number;
    activeStudents: number;
    totalCourses: number;
    averageOrderValue: number;
}

export interface TrendPoint {
    label: string;
    value: number;
}

export interface StatusBreakdownItem {
    status: string;
    total: number;
}

export interface TopCourseItem {
    id: number;
    title: string;
    slug: string;
    enrollments: number;
    revenue: number;
}

export interface RecentTransactionItem {
    id: number;
    invoiceNumber: string;
    status: string;
    total: number;
    paymentMethod: string;
    paidAt?: string | null;
    createdAt?: string | null;
    customer?: string | null;
    course?: string | null;
}

export interface UserBreakdown {
    totalUsers: number;
    instructors: number;
    students: number;
}
