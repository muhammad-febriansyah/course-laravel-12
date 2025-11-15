import { PageHeader } from '@/components/site/page-header';
import HomeLayout from '@/layouts/home-layout';
import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';

interface TermCondition {
    title: string;
    body: string;
    updated_at?: string | null;
}

interface Props {
    term: TermCondition | null;
}

const stripHtml = (html: string) =>
    html
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();

const summarize = (html: string) => {
    const plain = stripHtml(html);
    if (!plain) return '';
    return plain.length > 220 ? `${plain.slice(0, 220)}…` : plain;
};

const formatDate = (value?: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

export default function TermsPage({ term }: Props) {
    if (!term) {
        return (
            <HomeLayout>
                <Head title="Syarat & Ketentuan" />
                <div className="flex min-h-screen items-center justify-center px-6">
                    <div className="max-w-xl rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-10 text-center">
                        <FileText className="mx-auto h-12 w-12 text-primary" />
                        <h2 className="mt-6 text-2xl font-semibold text-slate-900">
                            Syarat &amp; Ketentuan belum tersedia
                        </h2>
                        <p className="mt-3 text-sm text-slate-600">
                            Konten halaman ini belum diatur. Silakan hubungi
                            administrator untuk memperbarui informasi.
                        </p>
                    </div>
                </div>
            </HomeLayout>
        );
    }

    const description =
        'Pelajari ketentuan penggunaan layanan kami agar pengalaman belajar Anda tetap aman dan nyaman.';
    const lastUpdated = formatDate(term.updated_at);

    return (
        <HomeLayout>
            <Head title={term.title || 'Syarat & Ketentuan'} />

            <PageHeader
                title={term.title || 'Syarat & Ketentuan'}
                description={description}
            />

            <section className="bg-white py-16 sm:py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                        {lastUpdated && (
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold tracking-wide text-primary uppercase">
                                <FileText className="h-4 w-4" />
                                Terakhir diperbarui pada {lastUpdated}
                            </div>
                        )}

                        <div
                            className="prose prose-sm prose-a:text-primary hover:prose-a:underline sm:prose max-w-none text-slate-700"
                            dangerouslySetInnerHTML={{ __html: term.body }}
                        />
                    </article>
                </div>
            </section>
        </HomeLayout>
    );
}
