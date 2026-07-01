import type { NavItem } from '@/types';
import { BookOpen, ClipboardList, Folder, Group, LayoutGrid, MessageCircle, Package, ReceiptPoundSterling, ShoppingCart } from 'lucide-react';

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
                routeName: '',
            },
            {
                title: 'Akses Karyawan',
                routeName: '',
            },
        ],
    },
    {
        title: 'Laporan',
        routeName: '',
        icon: ReceiptPoundSterling,
    },
    {
        title: 'Pesan',
        routeName: '',
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
        routeName: '',
        icon: MessageCircle,
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
