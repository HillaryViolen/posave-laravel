import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/layouts';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Facebook, Link as LinkIcon, Twitter } from 'lucide-react';

// Menangkap properti 'articleId' yang dikirim dari web.php
export default function ArticleDetail({ articleId }: { articleId: string }) {
    // 1. DATABASE BOHONGAN (MOCK DATA)
    // Sesuai dengan 4 gambar referensi Yang Mulia!
    const articlesDb = [
        {
            id: '1',
            category: 'Tips Bisnis',
            title: 'Cara Mengelola Toko Kecil Agar Lebih Efisien',
            date: '21 April 2026',
            readTime: '5 Menit Baca',
            image: '/assets/blog/thumb-tips-bisnis-1.png',
            content:
                'Tips praktis untuk membantu toko kecil Anda lebih efisien dalam operasional sehari-hari dan meningkatkan penjualan dengan teknologi kasir digital...',
        },
        {
            id: '2', // Biasanya ID berupa angka/string
            category: 'Manajemen Toko',
            title: 'Tips Mengatur Stok Barang untuk UMKM',
            date: '21 April 2026',
            readTime: '4 Menit Baca',
            image: '/assets/blog/thumb-stok-barang-1.png',
            content:
                'Mengelola stok barang seringkali menjadi tantangan terbesar bagi pelaku Usaha Mikro, Kecil, dan Menengah (UMKM)... (isi artikel 1)',
        },
        {
            id: '3',
            category: 'Tips Bisnis',
            title: 'Cara Meningkatkan Penjualan di Toko Kecil',
            date: '14 April 2026',
            readTime: '6 Menit Baca',
            image: '/assets/blog/thumb-tips-bisnis-2.png',
            content:
                'Strategi sederhana yang bisa Anda terapkan untuk meningkatkan penjualan di toko Anda secara instan tanpa biaya marketing mahal... (isi artikel 2)',
        },
        {
            id: '4',
            category: 'Keuangan',
            title: 'Pentingnya Laporan Keuangan untuk Bisnis',
            date: '9 April 2026',
            readTime: '5 Menit Baca',
            image: '/assets/blog/thumb-keuangan-1.png',
            content:
                'Kenali manfaat laporan keuangan dan bagaimana data dapat membantu Anda mengambil keputusan bisnis yang lebih menguntungkan... (isi artikel 3)',
        },
        {
            id: '5',
            category: 'Teknologi',
            title: 'Kenapa POS Berbasis Cloud Lebih Menguntungkan',
            date: '7 April 2026',
            readTime: '4 Menit Baca',
            image: '/assets/blog/thumb-teknologi-1.png',
            content:
                'Temukan keuntungan menggunakan sistem POS cloud untuk bisnis modern agar bisa dipantau dari mana saja dan kapan saja... (isi artikel 4)',
        },
    ];

    // 2. MENCARI ARTIKEL YANG SESUAI ID
    // Kita suruh Javascript mencari artikel yang ID-nya sama dengan ID di URL
    const article = articlesDb.find((a) => a.id === String(articleId));

    // 3. JIKA ARTIKEL TIDAK DITEMUKAN (Contoh user iseng ketik /artikel/99)
    if (!article) {
        return (
            <AppLayout>
                <div className="py-32 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-slate-900">Artikel Tidak Ditemukan</h1>
                    <Link href="/artikel" className="text-[#1A2B4C] hover:underline">
                        Kembali ke Blog
                    </Link>
                </div>
            </AppLayout>
        );
    }

    // 4. JIKA KETEMU, MASUKKAN KE DALAM BINGKAI!
    return (
        <AppLayout>
            <div className="mx-auto max-w-4xl px-4 py-12 font-sans sm:px-6 lg:px-8">
                <Link
                    href="/artikel"
                    className="group mb-8 flex w-fit items-center font-medium text-slate-500 transition-colors hover:text-[#1A2B4C]"
                >
                    <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span>Kembali ke Blog</span>
                </Link>

                <header className="mb-10 text-center md:text-left">
                    {/* Variabel Dinamis Kategori */}
                    <Badge className="mb-6 rounded-full border-none bg-[#EAF3FA] px-4 py-1.5 text-sm font-medium text-[#1A2B4C] hover:bg-[#EAF3FA]">
                        {article.category}
                    </Badge>

                    {/* Variabel Dinamis Judul */}
                    <h1 className="mb-6 text-4xl leading-[1.15] font-extrabold tracking-tight text-slate-900 md:text-5xl">{article.title}</h1>

                    <div className="flex flex-col items-center justify-between gap-4 border-y border-slate-200 py-5 md:flex-row">
                        <div className="flex items-center space-x-6 text-sm font-medium text-slate-500">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{article.date}</span> {/* Variabel Dinamis Tanggal */}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>{article.readTime}</span> {/* Variabel Dinamis Waktu */}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <span className="mr-2 text-sm font-medium text-slate-500">Bagikan:</span>
                            <button
                                aria-label="Facebook"
                                className="rounded-full bg-slate-100 p-2.5 text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-[#1A2B4C] hover:text-white"
                            >
                                <Facebook className="h-4 w-4" />
                            </button>
                            <button
                                aria-label="Twitter"
                                className="rounded-full bg-slate-100 p-2.5 text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-[#1A2B4C] hover:text-white"
                            >
                                <Twitter className="h-4 w-4" />
                            </button>
                            <button
                                aria-label="Copy Link"
                                className="rounded-full bg-slate-100 p-2.5 text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-[#1A2B4C] hover:text-white"
                            >
                                <LinkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="mb-12 h-64 w-full overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm md:h-[450px]">
                    {/* Variabel Dinamis Gambar */}
                    <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                </div>

                <article className="prose prose-slate prose-lg md:prose-xl mx-auto max-w-3xl leading-relaxed text-slate-700">
                    {/* Variabel Dinamis Konten Text */}
                    <p className="lead font-medium text-slate-600">{article.content}</p>

                    {/* Konten dummy statis untuk meramaikan tampilan bawahnya */}
                    <h2 className="mt-12 mb-6 text-3xl font-bold tracking-tight text-slate-900">Mulai Terapkan Sekarang</h2>
                    <p>
                        Teori tanpa eksekusi hanyalah angan-angan. Segera terapkan strategi di atas pada bisnis Anda hari ini juga, dan rasakan
                        perbedaannya di bulan depan.
                    </p>
                </article>
            </div>
        </AppLayout>
    );
}
