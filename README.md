# Posave

Aplikasi kasir (POS) untuk UMKM — Laravel 12 + Inertia (React 19 + TypeScript) + Tailwind CSS v4.

## Menjalankan Proyek

Prasyarat: PHP 8.2+, Composer, MySQL, Node.js 20+.

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate
# atur koneksi MySQL di .env: DB_CONNECTION=mysql, DB_DATABASE=posave, dst.

php artisan migrate:fresh --seed   # buat ulang tabel + isi data demo "Berkah Mart"
composer run dev                   # atau: php artisan serve + npm run dev di dua terminal
```

> Setiap kali menarik perubahan yang menyentuh `database/migrations` atau `database/seeders`,
> jalankan ulang `php artisan migrate:fresh --seed` (dan `npm install` bila `package.json` berubah).

## Akun Demo

Seeder mengisi data toko **Berkah Mart** (3 cabang, ±6 bulan riwayat transaksi).
Semua akun memakai password **`password`**.

| Peran          | Email                 | Catatan                                   |
| -------------- | --------------------- | ----------------------------------------- |
| Owner          | `test@example.com`    | Dashboard advance, laporan, semua menu    |
| Manajer Cabang | `manajer@posave.test` | Cabang Berkah Mart Merdeka                |
| Kasir          | `kasir@posave.test`   | Diarahkan ke halaman kasir (Order)        |

Kasir lain yang muncul di data transaksi juga bisa dipakai login
(`andi.saputra@posave.test`, `dewi.anggraini@posave.test`, dst. — pola `nama.depan@posave.test`).
