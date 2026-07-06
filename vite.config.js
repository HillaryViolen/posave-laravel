import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    // Pra-bundle dependency berat saat server dev start → load pertama halaman
    // (mis. dashboard dengan recharts) tidak lagi terhambat optimisasi on-demand.
    optimizeDeps: {
        // Termasuk lib export yang di-dynamic-import: tanpa ini, ekspor pertama di dev
        // memicu optimisasi on-demand + full reload yang mengganggu. (Produksi tetap
        // memakai code-splitting rollup, tak terpengaruh daftar ini.)
        include: ['react', 'react-dom', '@inertiajs/react', 'recharts', 'lucide-react', 'jspdf', 'jspdf-autotable', 'write-excel-file/browser'],
    },
    server: {
        warmup: {
            clientFiles: ['resources/js/app.tsx'],
        },
    },
    // Catatan: JANGAN pakai manualChunks untuk memisah vendor di sini. Chunk manual
    // (mis. 'charts' berisi recharts) ikut menyerap dependency bersama seperti clsx,
    // sehingga SEMUA halaman (login sekalipun) mengeksekusi chunk besar itu secara
    // statis. Default chunking Rollup sudah benar: lib yang hanya di-dynamic-import
    // (recharts via React.lazy, jspdf/write-excel-file saat export) tetap terpisah
    // dan baru dimuat saat dibutuhkan.
});
