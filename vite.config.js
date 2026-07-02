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
    build: {
        rollupOptions: {
            output: {
                // Pisahkan vendor besar ke chunk sendiri agar caching browser lebih baik
                // dan chunk per-halaman lebih ramping. (jspdf/write-excel-file sengaja
                // dibiarkan default supaya tetap dynamic-import terpisah saat export.)
                manualChunks(id) {
                    if (!id.includes('node_modules')) return;
                    if (id.includes('recharts') || id.includes('victory-vendor') || id.includes('/d3-')) return 'charts';
                    if (id.includes('@radix-ui')) return 'radix';
                },
            },
        },
    },
});
