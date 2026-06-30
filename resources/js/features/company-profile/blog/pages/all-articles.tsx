import React from 'react';
import { AppLayout } from '@/layouts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function AllArticles() {
    // Kumpulan seluruh data artikel (Bisa ditambah sesuai kebutuhan nanti)
    const allArticlesDb = [
        {
            id: "1", category: "Tips Bisnis", title: "Cara Mengelola Toko Kecil Agar Lebih Efisien", date: "25 April 2026", readTime: "5 Menit Baca", desc: "Tips praktis untuk membantu toko kecil Anda lebih efisien dalam operasional...", image: "/assets/blog/thumb-tips-bisnis-1.png"
        },
        {
            id: "2", category: "Manajemen Toko", title: "Tips Mengatur Stok Barang untuk UMKM", date: "21 April 2026", readTime: "4 Menit Baca", desc: "Mengelola stok barang seringkali menjadi tantangan terbesar bagi pelaku UMKM...", image: "/assets/blog/thumb-stok-barang-1.png"
        },
        {
            id: "3", category: "Tips Bisnis", title: "Cara Meningkatkan Penjualan di Toko Kecil", date: "14 April 2026", readTime: "6 Menit Baca", desc: "Strategi sederhana yang bisa Anda terapkan untuk meningkatkan penjualan...", image: "/assets/blog/thumb-tips-bisnis-2.png"
        },
        {
            id: "4", category: "Keuangan", title: "Pentingnya Laporan Keuangan untuk Bisnis", date: "9 April 2026", readTime: "5 Menit Baca", desc: "Kenali manfaat laporan keuangan dan bagaimana data dapat membantu...", image: "/assets/blog/thumb-keuangan-1.png"
        },
        {
            id: "5", category: "Teknologi", title: "Kenapa POS Berbasis Cloud Lebih Menguntungkan", date: "7 April 2026", readTime: "4 Menit Baca", desc: "Temukan keuntungan menggunakan sistem POS cloud untuk bisnis modern...", image: "/assets/blog/thumb-teknologi-1.png"
        }
    ];

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
                
                <Link href='/artikel' className="flex items-center w-fit text-slate-500 hover:text-[#1A2B4C] transition-colors mb-8 group font-medium">
                    <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                    <span>Kembali ke Blog Utama</span>
                </Link>

                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Semua Artikel
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        Eksplorasi seluruh insight, cerita, dan tips praktis untuk membantu mengembangkan bisnis Anda ke level selanjutnya.
                    </p>
                </div>

                {/* Menggunakan grid 3 kolom agar lebih elegan untuk daftar panjang */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allArticlesDb.map((article) => (
                        <Link href={`/artikel/${article.id}`} key={article.id} className="block group h-full">
                            <Card className="overflow-hidden flex flex-col h-full border-none shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 rounded-2xl">
                                
                                <div className="h-56 w-full overflow-hidden bg-slate-100">
                                    <img 
                                        src={article.image} 
                                        alt={article.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                
                                <CardContent className="p-6 pt-6 flex flex-col flex-grow bg-white">
                                    <Badge className="w-fit mb-4 bg-[#EAF3FA] text-[#1A2B4C] hover:bg-[#EAF3FA] border-none">
                                        {article.category}
                                    </Badge>
                                    <h4 className="font-bold text-xl text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-[#1A2B4C] transition-colors">
                                        {article.title}
                                    </h4>
                                    <p className="text-base text-slate-500 mb-6 line-clamp-3 flex-grow leading-relaxed">
                                        {article.desc}
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm text-slate-500 mt-auto pt-5 border-t border-slate-100 font-medium">
                                        <div className="flex items-center space-x-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>{article.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <Clock className="w-4 h-4" />
                                            <span>{article.readTime}</span>
                                        </div>
                                    </div>
                                </CardContent>

                            </Card>
                        </Link>
                    ))}
                </div>

            </div>
        </AppLayout>
    );
}