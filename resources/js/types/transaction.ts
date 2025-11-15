export interface TransactionSummary {
    id: number;
    invoiceNumber: string;
    status: string;
    paymentMethod: string;
    paymentChannel?: string | null;
    amount: number;
    discount: number;
    total: number;
    adminFee: number;
    paymentUrl?: string | null;
    tripayReference?: string | null;
    paymentInstructions?: TripayInstruction[] | null;
    metadata?: Record<string, unknown> | null;
    paidAt?: string | null;
    expiredAt?: string | null;
    createdAt?: string | null;
    course?: {
        id: number;
        title: string;
        slug: string;
        image?: string;
    } | null;
}

export interface TripayInstruction {
    title: string;
    steps: string[];
}

export interface TransactionDetail extends TransactionSummary {}
