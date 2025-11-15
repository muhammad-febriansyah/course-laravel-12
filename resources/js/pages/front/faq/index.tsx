import { PageHeader } from '@/components/site/page-header';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import HomeLayout from '@/layouts/home-layout';
import { Head } from '@inertiajs/react';
import { HelpCircle, Mail, MessageCircle, Phone, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

interface Props {
    faqs?: FaqItem[];
}

export default function Index({ faqs = [] }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const hasFaqs = faqs.length > 0;

    const filteredFaqs = useMemo(() => {
        if (!searchQuery.trim()) return faqs;

        const query = searchQuery.toLowerCase();
        return faqs.filter(
            (faq) =>
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query),
        );
    }, [faqs, searchQuery]);

    const defaultItem =
        filteredFaqs.length > 0 ? `faq-${filteredFaqs[0].id}` : undefined;

    return (
        <HomeLayout>
            <Head title="FAQ" />
            <PageHeader
                title="FAQ"
                description="Temukan jawaban atas pertanyaan yang sering diajukan oleh pengguna kami."
            />

            <main className="relative">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
                    {/* Introduction Section */}
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-slate-900">
                            Pertanyaan yang Sering Diajukan
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-slate-600">
                            Kami telah mengumpulkan jawaban untuk pertanyaan
                            yang paling sering ditanyakan. Jika Anda tidak
                            menemukan jawaban yang Anda cari, jangan ragu untuk
                            menghubungi kami.
                        </p>
                    </div>

                    {/* Search Box */}
                    {hasFaqs && (
                        <div className="mb-12">
                            <div className="relative mx-auto max-w-2xl">
                                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Cari pertanyaan..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-14 rounded-2xl border-slate-200 bg-white pr-4 pl-12 text-base shadow-sm transition-shadow focus:shadow-md"
                                />
                            </div>
                            {searchQuery && (
                                <p className="mt-4 text-center text-sm text-slate-500">
                                    Ditemukan {filteredFaqs.length} pertanyaan
                                    dari {faqs.length} total pertanyaan
                                </p>
                            )}
                        </div>
                    )}

                    <div className="grid gap-12 lg:grid-cols-[2fr,1fr]">
                        {/* FAQ List */}
                        <div>
                            {hasFaqs && filteredFaqs.length > 0 ? (
                                <>
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-slate-900">
                                            Semua Pertanyaan (
                                            {filteredFaqs.length})
                                        </h3>
                                    </div>
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="space-y-4"
                                        defaultValue={defaultItem}
                                    >
                                        {filteredFaqs.map((faq) => (
                                            <AccordionItem
                                                key={faq.id}
                                                value={`faq-${faq.id}`}
                                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
                                            >
                                                <AccordionTrigger className="px-6 py-5 text-left text-base font-semibold text-slate-900 sm:text-lg">
                                                    <div className="flex items-start gap-3">
                                                        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                                        <span>
                                                            {faq.question}
                                                        </span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-6 pb-6 text-slate-600 sm:text-base">
                                                    <div className="ml-8">
                                                        <div
                                                            className="prose prose-sm sm:prose max-w-none text-slate-600"
                                                            dangerouslySetInnerHTML={{
                                                                __html: faq.answer,
                                                            }}
                                                        />
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </>
                            ) : hasFaqs && filteredFaqs.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                                    <Search className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                        Tidak ada hasil ditemukan
                                    </h3>
                                    <p className="text-slate-500">
                                        Coba gunakan kata kunci yang berbeda
                                        atau hubungi kami untuk bantuan lebih
                                        lanjut.
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                                    <HelpCircle className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                        Belum ada FAQ tersedia
                                    </h3>
                                    <p className="text-slate-500">
                                        FAQ akan segera ditambahkan. Sementara
                                        itu, silakan hubungi kami jika ada
                                        pertanyaan.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                    Butuh Bantuan Lebih?
                                </h3>
                                <p className="mb-6 text-sm text-slate-600">
                                    Tidak menemukan jawaban yang Anda cari?
                                    Hubungi tim dukungan kami dan kami akan
                                    dengan senang hati membantu Anda.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                                        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                        <div className="min-w-0 flex-1">
                                            <h4 className="mb-1 text-sm font-medium text-slate-900">
                                                Email Support
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                support@example.com
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                                        <Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                        <div className="min-w-0 flex-1">
                                            <h4 className="mb-1 text-sm font-medium text-slate-900">
                                                Telepon
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                +62 123 4567 890
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                                        <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                        <div className="min-w-0 flex-1">
                                            <h4 className="mb-1 text-sm font-medium text-slate-900">
                                                Live Chat
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                Tersedia 24/7
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tips Card */}
                            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                                    Tips Pencarian
                                </h3>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                                        <span>
                                            Gunakan kata kunci yang spesifik
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                                        <span>
                                            Coba variasi kata yang berbeda
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                                        <span>
                                            Periksa ejaan kata kunci Anda
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </HomeLayout>
    );
}
