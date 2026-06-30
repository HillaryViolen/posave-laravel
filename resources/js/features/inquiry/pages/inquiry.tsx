import { Button } from '@/components';
import { AppLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { ArrowRight, Clock, Headphones, HelpCircle, Mail, MapPin, PhoneCall } from 'lucide-react';
import { ContactForm } from '../components';

export default function Inquiry() {
    return (
        <AppLayout>
            <Head title="Hubungi Kami" />
            <div className="flex flex-col gap-8 py-8">
                {/* 1. BAGIAN HERO (Atas) */}
                <div className="flex flex-col overflow-hidden rounded-3xl bg-blue-50/50 md:flex-row">
                    {/* Gambar */}
                    <div className="p-5 md:w-1/2">
                        <img
                            src="/assets/contact-us/banner1.png"
                            alt="Customer Service"
                            className="h-full min-h-[300px] w-full rounded-2xl object-cover"
                        />
                    </div>
                    {/* Teks Hero */}
                    <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-16">
                        <h1 className="text-4xl font-bold text-slate-800">
                            Butuh Bantuan? <br />
                            <span className="text-[#22303F]">Kami Ada Disini</span>
                        </h1>
                        <p className="mt-4 text-slate-600">
                            Punya pertanyaan tentang POSIVE? <br />
                            Tim kami selalu siap untuk membantu Anda!
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button className="rounded-full bg-[#22303F] px-8 hover:bg-[#002266]">
                                <PhoneCall className="mr-2 h-4 w-4" /> Hubungi Kami
                            </Button>
                            <Button variant="outline" className="rounded-full border-[#22303F] px-8 text-[#22303F] hover:bg-blue-50">
                                <HelpCircle className="mr-2 h-4 w-4" /> FAQ
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. BANNER FAQ (Tengah) */}
                <div className="flex flex-col items-center justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm md:flex-row md:px-12">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#22303F]">
                            <HelpCircle className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Kami sudah menjawab pertanyaanmu!</h3>
                            <p className="mt-1 text-sm text-slate-500">Pergi ke halaman FAQ kami untuk jawaban pertanyaan umum dengan cepat.</p>
                        </div>
                    </div>
                    <Button className="mt-6 w-full rounded-full bg-[#22303F] px-8 hover:bg-[#002266] md:mt-0 md:w-auto">
                        Buka FAQ <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* 3. BAGIAN KONTAK (Bawah Kiri: Info, Bawah Kanan: Form) */}
                <div className="mt-4 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
                    {/* Kiri: Informasi Kontak */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-slate-800">Hubungi Kami!</h2>
                        <div className="mt-2 h-1 w-12 bg-[#22303F]"></div> {/* Garis biru kecil */}
                        <p className="mt-6 text-slate-600">Anda memiliki pertanyaan? Tim kami siap menjawab dalam 24 jam.</p>
                        <p className="mt-4 mb-8 text-slate-600">Tuliskan berbagai pertanyaan atau kendala yang anda rasakan di formulir tersebut.</p>
                        {/* List Info Kontak */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#22303F]">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Jam Operasional</h4>
                                    <p className="text-sm text-slate-600">
                                        Senin - Minggu
                                        <br />
                                        08:00 - 22:00 WIB
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#22303F]">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Email</h4>
                                    <p className="text-sm text-slate-600">support@posive.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#22303F]">
                                    <PhoneCall className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Nomor Telepon</h4>
                                    <p className="text-sm text-slate-600">+62 811 2345 567</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#22303F]">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Alamat</h4>
                                    <p className="text-sm text-slate-600">Indonesia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kanan: Form Kontak (Memanggil komponen lokal yang kita buat) */}
                    <div>
                        <ContactForm />
                    </div>
                </div>

                {/* 4. BANNER BAWAH (Masih Butuh Bantuan) */}
                <div className="mt-8 flex flex-col items-center justify-between rounded-2xl bg-blue-50/50 p-8 md:flex-row md:px-12">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Headphones className="h-10 w-10 text-[#22303F]" />
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Masih butuh bantuan?</h3>
                            <p className="mt-1 text-slate-600">Tim support kami siap membantu Anda kapan saja.</p>
                        </div>
                    </div>
                    <Button className="mt-6 h-12 w-full rounded-md bg-[#22303F] px-8 hover:bg-[#002266] md:mt-0 md:w-auto">
                        <Headphones className="mr-2 h-4 w-4" /> Hubungi Sekarang
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
