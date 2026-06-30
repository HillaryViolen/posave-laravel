import React, { useState } from 'react';
import { AppLayout } from '@/layouts';
import { Button } from '@/components/ui/button'; // Sesuaikan path jika perlu
import { Card, CardContent } from '@/components/ui/card'; // Menggunakan Card buatan Yang Mulia
import { Badge } from '@/components/ui/badge'; // Komponen global baru di atas
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from '@inertiajs/react';

// --- MOCK DATA ---
const categories = ['Semua', 'Tips Bisnis', 'Keuangan', 'Teknologi', 'Manajemen Toko'];

const recentArticles = [
    {
        id: 2,
        title: 'Tips Mengatur Stok Barang untuk UMKM',
        desc: 'Pelajari cara mengatur stok barang agar tidak kehabisan atau menumpuk di gudang.',
        category: 'Manajemen Toko',
        date: '21 April 2026',
        readTime: '4 Menit Baca',
        image: '/assets/blog/thumb-stok-barang-1.png'
    },    
    {
        id: 3,
        title: 'Cara Meningkatkan Penjualan di Toko Kecil',
        desc: 'Strategi sederhana yang bisa Anda terapkan untuk meningkatkan penjualan setiap hari.',
        category: 'Tips Bisnis',
        date: '14 April 2026',
        readTime: '6 Menit Baca',
        image: '/assets/blog/thumb-tips-bisnis-2.png'
    },
    {
        id: 4,
        title: 'Pentingnya Laporan Keuangan untuk Bisnis',
        desc: 'Kenali manfaat laporan keuangan dan bagaimana data dapat membantu pengambilan keputusan.',
        category: 'Keuangan',
        date: '9 April 2026',
        readTime: '5 Menit Baca',
        image: '/assets/blog/thumb-keuangan-1.png'
    },
    {
        id: 5,
        title: 'Kenapa POS Berbasis Cloud Lebih Menguntungkan?',
        desc: 'Temukan keuntungan menggunakan sistem POS cloud untuk bisnis modern.',
        category: 'Teknologi',
        date: '7 April 2026',
        readTime: '4 Menit Baca',
        image: '/assets/blog/thumb-teknologi-1.png'
    }
];

export default function Blog() {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const filteredArticles = activeCategory === 'Semua' 
    ? recentArticles 
    : recentArticles.filter(article => article.category === activeCategory);

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 font-sans">
                
                {/* 1. HERO SECTION */}
                <section className="relative w-full rounded-[2.5rem] overflow-hidden min-h-[350px] flex items-center bg-[#F0F5F9]">
                    {/* Catatan: Sesuaikan hex #F0F5F9 dengan warna biru muda di background asli gambar Anda */}

                    {/* Lapisan 1: Gambar di Kanan (Mencegah Zoom Berlebih) */}
                    <div className="absolute top-0 right-0 w-full md:w-[95%] h-full z-0 flex justify-end">
                        <img 
                            src="/assets/blog/hero-blog.png" 
                            alt="Cerita dan Tips Bisnis POSAVE" 
                            className="w-full h-full object-cover object-left"  
                        />
                        {/* Lapisan 2: Gradasi Tipis Hanya di Tepi Kiri Gambar */}
                        <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-[#F0F5F9] to-transparent z-10"></div>
                    </div>

                    {/* Lapisan 3: Konten Teks (Font Diperkecil) */}
                    <div className="relative z-20 w-full md:w-[60%] p-12 space-y-3 sm:p-12">
                        <h1 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] leading-[1.25] tracking-tight">
                            Cerita & Tips untuk <br className="hidden md:block" /> Bisnis Anda
                        </h1>
                        <p className="text-base md:text-lg text-slate-600 max-w-sm mt-3">
                            Insight dan tips untuk mengembangkan bisnis anda
                        </p>
                    </div>
                    
                </section>

                {/* 2. FEATURED ARTICLE */}
                <section>
                    <Card className="flex flex-col md:flex-row overflow-hidden border-none shadow-md rounded-3xl">
                        {/* Sisi Kiri: Gambar Artikel (Dibuat Full Cover) */}
                        <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                            {/* absolute inset-0 memaksa gambar ditarik ke 4 sudut wadahnya */}
                            {/* object-cover akan melakukan zoom otomatis agar proporsinya terjaga */}
                            <Link href='/artikel/1'>
                                <img 
                                    src="/assets/blog/thumb-tips-bisnis-1.png" 
                                    alt="Cara Mengelola Toko Kecil" 
                                    className="absolute inset-0 w-full h-110 object-cover object-center transition-transform duration-500 hover:scale-105"
                                />
                            </Link>
                        </div>
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                            <Badge className="w-fit mb-4 bg-[#EAF3FA] text-[#1A2B4C] text-sm hover:bg-[#EAF3FA]">Tips Bisnis</Badge>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Cara Mengelola Toko Kecil Agar Lebih Efisien
                            </h2>
                            <p className="text-slate-600 mb-6 line-clamp-3">
                                Tips praktis untuk membantu toko kecil Anda lebih efisien dalam operasional sehari-hari dan meningkatkan penjualan.
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-slate-500 mb-8">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>25 April 2026</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>5 Menit Baca</span>
                                </div>
                            </div>
                            <div>
                                {/* Kita tambahkan Link ke artikel dengan ID 1 */}
                                <Link href="/artikel/1">
                                    <Button className="bg-[#1A2B4C] hover:bg-[#1A2B4C]/90 rounded-full px-8 transition-transform hover:-translate-y-0.5">
                                        Baca Selengkapnya
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* 3. CATEGORY FILTER */}
                <section className="flex flex-wrap items-center justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm transition-all duration-300 border ${
                                activeCategory === cat 
                                ? 'bg-[#EAF3FA] text-[#1A2B4C] border-[#EAF3FA] font-semibold shadow-sm' 
                                : 'bg-white text-slate-500 border-slate-400 font-medium hover:bg-[#EAF3FA]/50 hover:text-[#1A2B4C] hover:border-[#1A2B4C]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </section>

                {/* 4. RECENT ARTICLES */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-slate-900">Artikel Terbaru</h3>
                        <Link href="/artikel/semua" className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center group">
                            Lihat Semua Artikel 
                            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Link> 
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* PERHATIKAN: Sekarang kita menggunakan filteredArticles, bukan recentArticles */}
                        {filteredArticles.map((article) => (
                            // Bungkus seluruh Card dengan Link agar bisa diklik menuju detail
                            <Link href={`/artikel/${article.id}`} key={article.id} className="block group">
                                <Card className="overflow-hidden flex flex-col h-full border-none shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 rounded-2xl">
                                    
                                    {/* BAGIAN GAMBAR ARTIKEL */}
                                    <div className="h-48 w-full overflow-hidden bg-slate-100">
                                        <img 
                                            src={article.image} // <-- Ini akan mengambil jalur gambar dari data Anda
                                            alt={article.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    
                                    <CardContent className="p-5 pt-5 flex flex-col flex-grow bg-white">
                                        <Badge className="w-fit mb-3 bg-[#EAF3FA] text-[#1A2B4C] hover:bg-[#EAF3FA] border-none">
                                            {article.category}
                                        </Badge>
                                        <h4 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-[#1A2B4C] transition-colors">
                                            {article.title}
                                        </h4>
                                        <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-grow leading-relaxed">
                                            {article.desc}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100 font-medium">
                                            <div className="flex items-center space-x-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{article.date}</span>
                                            </div>
                                            <div className="flex items-center space-x-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{article.readTime}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* PESAN JIKA KATEGORI KOSONG (Opsional tapi elegan) */}
                    {filteredArticles.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500">Belum ada artikel untuk kategori ini.</p>
                        </div>
                    )}
                </section>

                {/* 5. BOTTOM CTA PROMO */}
                <section className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mt-16 mb-8">
                    
                    {/* Sisi Kiri: Ilustrasi (Di Luar Kotak Biru) */}
                    <div className="w-full md:w-2/5 flex justify-center shrink-0">
                        <img 
                            src="/assets/blog/ill-toko-posave.png" 
                            alt="Ilustrasi Toko POSAVE" 
                            // drop-shadow memberi bayangan pada bentuk objeknya, bukan pada kotaknya
                            className="w-64 md:w-full max-w-[380px]"
                        />
                    </div>

                    {/* Sisi Kanan: Kotak Teks Biru */}
                    <div className="w-full md:w-3/5 bg-[#BBD6E8] rounded-[2rem] p-8 md:p-12 shadow-md flex flex-col justify-center text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                            Kelola Toko Lebih Mudah dengan POSAVE
                        </h2>
                        <p className="text-slate-700 text-lg mb-8 max-w-lg mx-auto md:mx-0">
                            Semua fitur yang Anda butuhkan untuk mengembangkan bisnis, dalam satu platform.
                        </p>
                        <div>
                            <Link href="/register">
                                <Button className="bg-[#24334A] hover:bg-[#111827] text-white rounded-full px-8 py-6 text-base font-medium shadow-sm transition-transform hover:-translate-y-1">
                                    Coba POSAVE Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>

                </section>

            </div>
        </AppLayout>
    );
}