import { motion } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

interface FaqPreviewSectionProps {
    faqs: FaqItem[];
}

export function FaqPreviewSection({ faqs }: FaqPreviewSectionProps) {
    if (!faqs || faqs.length === 0) {
        return null;
    }

    return (
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16 lg:py-24">
            <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        Pertanyaan Umum
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                        Masih ada yang ingin ditanyakan?
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 sm:text-base">
                        Berikut beberapa pertanyaan yang sering diajukan oleh para siswa kami.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="rounded-3xl border border-slate-200 bg-white p-4 shadow">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={faq.id}
                                value={`faq-${faq.id}`}
                                className="border-none"
                            >
                            <AccordionTrigger className="text-left text-base font-semibold text-slate-800">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600">
                                <div
                                    className="prose prose-sm max-w-none text-slate-600"
                                    dangerouslySetInnerHTML={{
                                        __html: faq.answer,
                                    }}
                                />
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center text-sm text-slate-500"
                >
                    Tidak menemukan jawaban?{' '}
                    <a
                        href="/contact-us"
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Hubungi tim kami
                    </a>
                    .
                </motion.p>
            </div>
        </section>
    );
}
