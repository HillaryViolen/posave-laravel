import type { NavItem } from '@/types';
import {
    BookOpen,
    Building,
    ClipboardList,
    Folder,
    Group,
    LayoutGrid,
    MessageCircle,
    Package,
    ReceiptPoundSterling,
    ShoppingCart,
} from 'lucide-react';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        routeName: 'dashboard.index',
        icon: LayoutGrid,
    },
    {
        title: 'Penyimpanan',
        url: '#',
        icon: Package,
        routeName: '',
        children: [
            {
                title: 'Daftar Barang',
                routeName: 'dashboard.inventory.items.index',
            },
            {
                title: 'Pemasok',
                routeName: 'dashboard.inventory.suppliers.index',
            },
            {
                title: 'Pembelian',
                routeName: 'dashboard.inventory.purchase-orders.index',
            },
            {
                title: 'Kiriman',
                routeName: 'dashboard.inventory.transfers.index',
            },
            {
                title: 'Perubahan',
                routeName: 'dashboard.inventory.adjustments.index',
            },
            {
                title: 'Kategori',
                routeName: 'dashboard.inventory.categories.index',
            },
        ],
    },
    {
        title: 'Karyawan',
        icon: Group,
        routeName: '',
        children: [
            {
                title: 'Daftar Karyawan',
                routeName: 'dashboard.employees.index',
            },
            {
                title: 'Akses Karyawan',
                routeName: 'dashboard.employees-access.index',
            },
        ],
    },
    {
        title: 'Laporan',
        routeName: 'dashboard.reports.index',
        icon: ReceiptPoundSterling,
    },
    {
        title: 'Pesan',
        routeName: 'messaging.index',
        icon: MessageCircle,
    },
    {
        title: 'Pengaturan',
        routeName: '',
        icon: Building,
        children: [
            {
                title: 'Perusahaan',
                routeName: 'settings.company-profile',
            },
            {
                title: 'Bukti Bayar',
                routeName: 'settings.receipt',
            },
            {
                title: 'Toko',
                routeName: 'settings.branches',
            },
        ],
    },
];

export const branchManagerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        routeName: 'dashboard.index',
        icon: LayoutGrid,
    },
    {
        title: 'Penyimpanan',
        url: '#',
        icon: Package,
        routeName: '',
        children: [
            {
                title: 'Daftar Barang',
                routeName: 'dashboard.inventory.items.index',
            },
            {
                title: 'Pembelian',
                routeName: 'dashboard.inventory.purchase-orders.index',
            },
            {
                title: 'Kiriman',
                routeName: 'dashboard.inventory.transfers.index',
            },
            {
                title: 'Perubahan',
                routeName: 'dashboard.inventory.adjustments.index',
            },
        ],
    },
    {
        title: 'Karyawan',
        icon: Group,
        routeName: 'dashboard.employees.index',
    },
    {
        title: 'Laporan',
        routeName: 'dashboard.reports.index',
        icon: ReceiptPoundSterling,
    },
    {
        title: 'Pesan',
        routeName: 'messaging.index',
        icon: MessageCircle,
    },
];

export const cashierNavItems: NavItem[] = [
    {
        title: 'Pesanan',
        routeName: 'cashier.order.index',
        icon: ShoppingCart,
    },
    {
        title: 'Riwayat Pesanan',
        routeName: 'cashier.history.index',
        icon: ClipboardList,
    },
    {
        title: 'Pesan',
        routeName: 'messaging.index',
        icon: MessageCircle,
    },
];

export const liteNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        routeName: 'dashboard.index',
        icon: LayoutGrid,
    },
    {
        title: 'Penyimpanan',
        url: '#',
        icon: Package,
        routeName: '',
        children: [
            { title: 'Daftar Barang', routeName: 'lite.inventory.items.index' },
            { title: 'Perubahan', routeName: 'lite.inventory.adjustments.index' },
            { title: 'Kategori', routeName: 'lite.inventory.categories.index' },
        ],
    },
    {
        title: 'Pesanan',
        routeName: 'lite.order.index',
        icon: ShoppingCart,
    },
    {
        title: 'Riwayat Pesanan',
        routeName: 'lite.history.index',
        icon: ClipboardList,
    },
    {
        title: 'Pengaturan',
        url: '#',
        icon: Building,
        routeName: '',
        children: [
            { title: 'Profil', routeName: 'lite.settings.profile.index' },
            { title: 'Bukti Bayar', routeName: 'lite.settings.receipt.index' },
        ],
    },
];

export const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        routeName: '',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        routeName: '',
        icon: BookOpen,
    },
];
