import { Head, Link } from '@inertiajs/react';
import { AppLayout } from "@/layouts";
import { FeatureCard } from "../components/featureCard";
import { AnimatedLink } from '../components/animatedLink';

export default function Services() {
    return (
        <AppLayout>
            <Head title="Layanan - POSAVE" />
            
            <div className="py-4 md:py-8">
                
                {/* --- HERO SECTION --- */}
                <div className="relative h-[350px] md:h-[450px] rounded-[30px] md:rounded-[50px] flex items-center justify-center bg-[var(--black)] overflow-hidden mx-4 md:mx-0">
                    <img 
                        src="assets/services/services-banner.png" 
                        alt="Pemilik Toko"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    
                    <div className="absolute inset-0 bg-[var(--black)] opacity-20 md:bg-transparent"></div>

                    <div className="relative z-10 flex flex-col items-center text-center px-6">
                        <h1 className="text-3xl md:text-[63px] font-semibold text-[var(--white)] drop-shadow-[2px_6px_10px_rgba(0,0,0,0.7)] tracking-wide mt-10 md:mt-25 leading-tight">
                            Kelola Toko Jadi Lebih Mudah
                        </h1>
                        
                        <p className="text-base md:text-[26px] text-[var(--second-accent)] mt-3 mb-10 md:mb-20 drop-shadow-[1px_3px_5px_rgba(0,0,0,0.7)]">
                            Satu Sistem untuk Semua Kebutuhan Toko
                        </p>
                        
                        <AnimatedLink 
                            href="/register" 
                            className="bg-[var(--primary-900)] text-lg md:text-[22px] text-[var(--text-light)] font-medium px-8 md:px-10 py-2.5 md:py-2 rounded-full shadow-lg"
                            hoverBgClass="bg-[var(--secondary-900)]"
                        >
                            Coba Sekarang
                        </AnimatedLink>
                    </div>
                </div>

                {/* --- CARA BARU MENGELOLA TOKO --- */}
                <div className="mt-16 md:mt-24 mb-16 md:mb-20 px-6 md:px-20 lg:px-28">
                    <h2 className="text-center text-3xl md:text-[48px] font-semibold text-[var(--black)] mb-8 md:mb-12">
                        Cara Baru Mengelola Toko
                    </h2>
                    
                    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-0">
                        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className="text-2xl md:text-[28px] font-medium text-[var(--black)] mb-3 md:mb-4">
                                Semua Urusan Toko, Bisa Lewat Chat
                            </h3>
                            <p className="text-[var(--black)] mb-8 leading-relaxed text-base md:text-[20px]">
                                Catat transaksi, cek stok, dan lihat laporan hanya dengan chat sederhana
                            </p>
                            <AnimatedLink 
                                href="#" 
                                className="bg-[#243447] text-[var(--text-light)] px-8 py-3 md:py-2.5 rounded-full text-base md:text-[20px] font-regular shadow-sm"
                                hoverBgClass="bg-[#1a2634]"
                            >
                                Lihat Cara Kerja
                            </AnimatedLink>
                        </div>
                        
                        <div className="md:w-1/2 flex justify-center md:justify-end">
                            <img 
                                src="assets/services/chat-toko.png" 
                                alt="Chat Toko" 
                                className="w-full max-w-[240px] md:max-w-[320px] object-contain" 
                            />
                        </div>
                    </div>
                </div>

                {/* --- WADAH ABU-ABU BAWAH --- */}
                <div className="bg-[var(--second-accent)] rounded-[30px] md:rounded-[40px] py-12 md:py-16 px-5 md:px-12 mx-4 md:mx-0 mb-10">
                    
                    {/* FITUR UTAMA */}
                    <div className="mb-16 md:mb-20">
                        <h2 className="text-center text-3xl md:text-[48px] font-semibold text-[var(--black)] mb-8 md:mb-10">
                            Fitur Utama POSAVE
                        </h2>
                        <FeatureCard /> 
                    </div>

                    {/* CARA KERJA */}
                    <div className="mb-16 md:mb-20">
                        <h2 className="text-center text-3xl md:text-[48px] font-semibold text-[var(--black)] mb-8 md:mb-10">
                            Cara Kerja POSAVE
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-7">
                            <span className="bg-[var(--primary-900)] text-[var(--text-light)] px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-[24px] font-semibold text-center w-full sm:w-auto">
                                1. Tambahkan Produk
                            </span>
                            <span className="bg-[var(--primary-900)] text-[var(--text-light)] px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-[24px] font-semibold text-center w-full sm:w-auto">
                                2. Catat Transaksi/Chat
                            </span>
                            <span className="bg-[var(--primary-900)] text-[var(--text-light)] px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-[24px] font-semibold text-center w-full sm:w-auto">
                                3. Lihat Laporan
                            </span>
                        </div>
                    </div>

                    <div className="bg-[var(--accent-700)] rounded-[24px] md:rounded-[30px] p-6 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-sm gap-8 md:gap-0 text-center md:text-left">
                        
                        <div className="md:w-[60%] flex flex-col items-center md:items-start w-full">
                            <h2 className="text-2xl sm:text-3xl md:text-[44px] font-semibold text-[var(--black)] mb-3 md:mb-6 leading-snug">
                                Siap Mengembangkan<br className="hidden md:block"/> Bisnis Anda?
                            </h2>
                            
                            <p className="text-[15px] sm:text-base md:text-[20px] text-[var(--black)] mb-6 md:mb-8 px-2 md:px-0">
                                Ambil langkah pertama anda bersama POSAVE
                            </p>
                            
                            <AnimatedLink 
                                href="/register" 
                                className="bg-[var(--primary-900)] text-[var(--text-light)] px-6 md:px-8 py-3 md:py-3.5 rounded-full text-base sm:text-lg md:text-[24px] font-medium inline-block shadow-md"
                                hoverBgClass="bg-[var(--secondary-900)]"
                            >
                                Mulai Sekarang
                            </AnimatedLink>
                        </div>
                        
                        <div className="md:w-[40%] flex justify-center md:justify-end w-full mt-2 md:mt-0">
                            <img 
                                src="assets/services/mulai-sekarang.png" 
                                alt="Mulai Sekarang" 
                                className="w-full max-w-[260px] md:max-w-[380px] rounded-2xl object-cover" 
                            />
                        </div>
                        
                    </div>

                </div>

            </div>
        </AppLayout>
    );
}