import { PageHeader } from '@/components/site/page-header';
import HomeLayout from '@/layouts/home-layout';
import { Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

interface PrivacyPolicy {
    title: string;
    body: string;
    updated_at?: string | null;
}

interface Props {
    policy: PrivacyPolicy | null;
}

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

export default function PrivacyPage({ policy }: Props) {
    if (!policy) {
        return (
            <HomeLayout>
                <Head title="Kebijakan Privasi" />
                <div className="flex min-h-screen items-center justify-center px-6">
                    <div className="max-w-xl rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-10 text-center">
                        <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
                        <h2 className="mt-6 text-2xl font-semibold text-slate-900">
                            Kebijakan privasi belum tersedia
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
        'Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.';
    const lastUpdated = formatDate(policy.updated_at);

    return (
        <HomeLayout>
            <Head title={policy.title || 'Kebijakan Privasi'} />

            <PageHeader
                title={policy.title || 'Kebijakan Privasi'}
                description={description}
            />

            <section className="bg-white py-16 sm:py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                        {lastUpdated && (
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold tracking-wide text-primary uppercase">
                                <ShieldCheck className="h-4 w-4" />
                                Terakhir diperbarui pada {lastUpdated}
                            </div>
                        )}

                        <div
                            className="prose prose-sm prose-a:text-primary hover:prose-a:underline sm:prose max-w-none text-slate-700"
                            dangerouslySetInnerHTML={{ __html: policy.body }}
                        />
                    </article>
                </div>
            </section>
        </HomeLayout>
    );
}
