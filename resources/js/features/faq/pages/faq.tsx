import { AppLayout } from '@/layouts';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

// Types

interface FaqCategory {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
}

interface FaqItem {
    id: number;
    faq_category_id: number;
    question: string;
    answer: string;
    sort_order: number;
}

interface Props {
    categories: FaqCategory[];
    faqs: FaqItem[];
}

// ─── AccordionItem Component ──────────────────────────────────────────────────

function AccordionItem({ faq, isOpen, onToggle }: { faq: FaqItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="overflow-hidden rounded-xl border border-[#1d3a5e]">
            {/* Question row */}
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between bg-[#1e3a5f] px-5 py-4 text-left text-white transition-colors hover:bg-[#1a3355]"
            >
                <span className="pr-4 text-sm font-medium">{faq.question}</span>
                <svg
                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Answer — smooth height animation using CSS grid trick */}
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <p className="bg-[#162d4a] px-5 py-4 text-sm leading-relaxed text-blue-200">{faq.answer}</p>
                </div>
            </div>
        </div>
    );
}

export default function Faq({ categories, faqs }: Props) {
    const [activeCategory, setActiveCategory] = useState<number>(categories[0]?.id ?? 0);
    const [openItem, setOpenItem] = useState<number | null>(null);

    const filteredFaqs = faqs.filter((f) => f.faq_category_id === activeCategory);

    const handleCategoryChange = (id: number) => {
        setActiveCategory(id);
        setOpenItem(null);
    };

    const handleToggle = (id: number) => {
        setOpenItem((prev) => (prev === id ? null : id));
    };

    return (
        <AppLayout>
            <Head title="FAQ - Posave" />

            {/* Hero */}
            <section className="relative min-h-[260px] overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
                {/* Overlay gradient dari kiri */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900/90 to-transparent" />

                {/* Decorative blur circles */}
                <div className="absolute top-1/2 right-32 h-56 w-56 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute top-1/4 right-56 h-36 w-36 rounded-full bg-indigo-400/10 blur-2xl" />

                <div className="relative z-20 flex min-h-[260px] items-center px-8 py-16">
                    <h1 className="max-w-xl text-3xl leading-tight font-medium text-white md:text-4xl">
                        Anda Punya Pertanyaan,
                        <br />
                        <span className="font-semibold">Kami Punya Jawaban</span>
                    </h1>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="px-4 py-16">
                <div className="mx-auto max-w-5xl">
                    {/* Heading */}
                    <div className="mb-12 text-center">
                        <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Frequently Asked Question</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Pertanyaan yang sudah terjawab</p>
                    </div>

                    <div className="flex flex-col gap-8 md:flex-row">
                        {/* Category sidebar */}
                        <div className="flex flex-row flex-wrap gap-2 md:w-36 md:flex-col md:flex-nowrap">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`rounded-lg px-4 py-2 text-left text-sm font-medium transition-all duration-200 ${
                                        activeCategory === cat.id
                                            ? 'bg-[#1e3a5f] text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Accordion list */}
                        <div className="flex flex-1 flex-col gap-3">
                            {filteredFaqs.length === 0 ? (
                                <div className="py-12 text-center text-sm text-gray-400">Belum ada pertanyaan untuk kategori ini.</div>
                            ) : (
                                filteredFaqs.map((faq) => (
                                    <AccordionItem key={faq.id} faq={faq} isOpen={openItem === faq.id} onToggle={() => handleToggle(faq.id)} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 pb-20">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-3xl bg-gray-900 px-8 py-12 text-center dark:bg-slate-800">
                        <h3 className="text-xl font-medium text-white">Pertanyaanmu belum terjawab?</h3>
                        <p className="mt-2 text-sm text-gray-400">Kontak kami melalui tombol dibawah ini</p>
                        <Link
                            href="/contact"
                            className="mt-8 inline-block rounded-full bg-white px-8 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                        >
                            Hubungi Kami
                        </Link>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
