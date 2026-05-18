<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'name' => 'Umum',
                'slug' => 'umum',
                'sort_order' => 1,
                'faqs' => [
                    [
                        'question' => 'Apa itu Posave?',
                        'answer'   => 'Posave adalah aplikasi manajemen toko berbasis AI yang dirancang khusus untuk UMKM Indonesia. Kamu bisa mencatat transaksi, memantau stok, dan melihat laporan hanya dengan mengetik perintah seperti chat biasa.',
                        'sort_order' => 1,
                    ],
                    [
                        'question' => 'Apakah Posave terpercaya?',
                        'answer'   => 'Ya. Data kamu tersimpan secara aman di server kami dengan enkripsi standar industri. Kami tidak menjual atau membagikan data pengguna kepada pihak ketiga.',
                        'sort_order' => 2,
                    ],
                    [
                        'question' => 'Kenapa harus Posave?',
                        'answer'   => 'Posave satu-satunya aplikasi kasir di Indonesia yang menggunakan AI untuk menerima input dalam bahasa natural. Tidak perlu pelatihan, tidak perlu hardware mahal — cukup smartphone yang kamu punya sekarang.',
                        'sort_order' => 3,
                    ],
                ],
            ],
            [
                'name' => 'Akun',
                'slug' => 'akun',
                'sort_order' => 2,
                'faqs' => [
                    [
                        'question' => 'Bagaimana cara mendaftar akun Posave?',
                        'answer'   => 'Klik tombol "Daftar" di halaman utama, isi nama, email, dan nomor HP kamu. Verifikasi via OTP, lalu buat toko pertamamu dalam 5 menit.',
                        'sort_order' => 1,
                    ],
                    [
                        'question' => 'Bisakah satu akun dipakai di beberapa toko?',
                        'answer'   => 'Bisa. Satu akun owner bisa mengelola beberapa cabang sekaligus. Masing-masing cabang punya data terpisah dan bisa diassign ke kepala toko yang berbeda.',
                        'sort_order' => 2,
                    ],
                    [
                        'question' => 'Bagaimana jika lupa password?',
                        'answer'   => 'Klik "Lupa Password" di halaman login, masukkan email kamu, dan ikuti instruksi reset password yang dikirim ke email tersebut.',
                        'sort_order' => 3,
                    ],
                ],
            ],
            [
                'name' => 'Pembayaran',
                'slug' => 'pembayaran',
                'sort_order' => 3,
                'faqs' => [
                    [
                        'question' => 'Apakah Posave gratis?',
                        'answer'   => 'Posave tersedia dalam versi Lite (gratis) dan Pro (berbayar). Versi Lite sudah mencakup fitur AI chatbot dasar, transaksi, dan manajemen stok untuk satu toko.',
                        'sort_order' => 1,
                    ],
                    [
                        'question' => 'Metode pembayaran apa yang diterima?',
                        'answer'   => 'Kami menerima transfer bank, kartu kredit/debit, dan dompet digital seperti GoPay, OVO, dan Dana untuk pembayaran langganan Pro.',
                        'sort_order' => 2,
                    ],
                ],
            ],
            [
                'name' => 'Keamanan',
                'slug' => 'keamanan',
                'sort_order' => 4,
                'faqs' => [
                    [
                        'question' => 'Apakah data transaksi saya aman?',
                        'answer'   => 'Semua data dienkripsi menggunakan AES-256 dan disimpan di server yang berlokasi di Indonesia. Kami rutin melakukan backup harian untuk mencegah kehilangan data.',
                        'sort_order' => 1,
                    ],
                    [
                        'question' => 'Bisakah saya membatasi akses staf?',
                        'answer'   => 'Bisa. Posave punya sistem role: Owner, Kepala Toko, dan Kasir. Setiap role punya batasan akses yang berbeda — kasir hanya bisa input transaksi, sementara owner bisa melihat seluruh laporan cabang.',
                        'sort_order' => 2,
                    ],
                ],
            ],
            [
                'name' => 'Bantuan',
                'slug' => 'bantuan',
                'sort_order' => 5,
                'faqs' => [
                    [
                        'question' => 'Bagaimana cara menghubungi tim support Posave?',
                        'answer'   => 'Kamu bisa menghubungi kami via email di support@posave.com, WhatsApp di +62 811 2345 567, atau langsung lewat fitur chat di aplikasi.',
                        'sort_order' => 1,
                    ],
                    [
                        'question' => 'Apakah ada panduan penggunaan aplikasi?',
                        'answer'   => 'Ya, kami menyediakan dokumentasi lengkap, video tutorial, dan artikel panduan di halaman Artikel. Kamu juga bisa langsung tanya ke AI assistant di dalam aplikasi.',
                        'sort_order' => 2,
                    ],
                ],
            ],
        ];

        foreach ($data as $categoryData) {
            $category = FaqCategory::create([
                'name'       => $categoryData['name'],
                'slug'       => $categoryData['slug'],
                'sort_order' => $categoryData['sort_order'],
            ]);

            foreach ($categoryData['faqs'] as $faqData) {
                Faq::create([
                    'faq_category_id' => $category->id,
                    'question'        => $faqData['question'],
                    'answer'          => $faqData['answer'],
                    'sort_order'      => $faqData['sort_order'],
                    'is_active'       => true,
                ]);
            }
        }
    }
}
