import { AppShell, AppSidebar } from '@/components';
import { Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, Sheet, SheetContent } from '@/components/ui';
import { cashierNavItems } from '@/data';
import { Head } from '@inertiajs/react';
import { CalendarDays, ChevronLeft, ChevronRight, Mail, Printer, Search } from 'lucide-react';
import { useRef, useState } from 'react';

type CartItem = { name: string; price: number; qty: number; note: string };

type Transaction = {
    id: string;
    invoice: string;
    time: string;
    date: string;
    dateLabel: string;
    paymentMethod: string;
    total: number;
    status: 'Selesai' | 'Dibatalkan' | 'Pending';
    items: CartItem[];
    discount: number;
};

const DUMMY_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        invoice: '#INV-0023',
        time: '14:23',
        date: '12 April 2024',
        dateLabel: 'Tuesday, 2 Apr 2026',
        paymentMethod: 'Cash',
        total: 45000,
        status: 'Selesai',
        discount: 0,
        items: [
            { name: 'Susu Kental Manis', price: 5000, qty: 5, note: '' },
            { name: 'Susu Kental Manis', price: 5000, qty: 5, note: '' },
        ],
    },
    {
        id: '2',
        invoice: '#INV-0023',
        time: '14:23',
        date: '12 April 2024',
        dateLabel: 'Tuesday, 2 Apr 2026',
        paymentMethod: 'Cash',
        total: 45000,
        status: 'Selesai',
        discount: 0,
        items: [
            { name: 'Susu Kental Manis', price: 5000, qty: 5, note: '' },
            { name: 'Susu Kental Manis', price: 5000, qty: 5, note: '' },
        ],
    },
    {
        id: '3',
        invoice: '#INV-0023',
        time: '14:23',
        date: '12 April 2024',
        dateLabel: 'Tuesday, 2 Apr 2026',
        paymentMethod: 'Cash',
        total: 45000,
        status: 'Selesai',
        discount: 0,
        items: [
            { name: 'Susu Kental Manis', price: 5000, qty: 5, note: '' },
            { name: 'Susu Kental Manis', price: 5000, qty: 5, note: '' },
        ],
    },
    {
        id: '4',
        invoice: '#INV-0023',
        time: '14:23',
        date: '12 April 2024',
        dateLabel: 'Tuesday, 2 Apr 2026',
        paymentMethod: 'Cash',
        total: 45000,
        status: 'Selesai',
        discount: 0,
        items: [
            { name: 'Susu Kental Manis', price: 5000, qty: 5, note: '' },
            { name: 'Susu Kental Manis', price: 5000, qty: 5, note: '' },
        ],
    },
];

const STATUS_STYLES: Record<Transaction['status'], string> = {
    Selesai: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Dibatalkan: 'bg-red-100 text-red-700 border-red-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const STATUS_BADGE_STYLES: Record<Transaction['status'], string> = {
    Selesai: 'bg-emerald-600 text-white',
    Dibatalkan: 'bg-red-600 text-white',
    Pending: 'bg-yellow-500 text-white',
};

export default function HistoryPage() {
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeDate, setActiveDate] = useState(() => new Date());
    const [sheetOpen, setSheetOpen] = useState(false);

    const formattedDate = activeDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const prevDay = () => setActiveDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });
    const nextDay = () => setActiveDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });

    const transactions = search
        ? DUMMY_TRANSACTIONS.filter(
              (t) =>
                  t.invoice.toLowerCase().includes(search.toLowerCase()) ||
                  t.paymentMethod.toLowerCase().includes(search.toLowerCase()),
          )
        : DUMMY_TRANSACTIONS;

    const selected = transactions.find((t) => t.id === selectedId) ?? null;
    const subtotal = selected ? selected.items.reduce((s, i) => s + i.price * i.qty, 0) : 0;

    const handleRowClick = (id: string) => {
        setSelectedId(id);
        if (window.innerWidth < 1024) setSheetOpen(true);
    };

    // ── Detail panel content — shared between desktop sidebar & mobile Sheet ─

    const historyDetailInner = (
        <>
            {/* Header */}
            <div className="p-5">
                <h2 className="text-base font-bold uppercase tracking-widest">History Order Detail</h2>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-300">Kopiakin Resto</span>
                    {selected && <span className="text-slate-400">{selected.dateLabel}</span>}
                </div>
            </div>
            <Separator className="bg-white/10" />

            {/* Detail body */}
            <div className="flex-1 overflow-y-auto">
                {selected ? (
                    <div className="p-5 space-y-4">
                        {/* Status + invoice */}
                        <div className="flex items-center justify-between">
                            <Badge className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_STYLES[selected.status]}`}>
                                {selected.status}
                            </Badge>
                            <span className="text-sm font-bold text-white">{selected.invoice}</span>
                        </div>

                        {/* Meta */}
                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Waktu</span>
                                <span className="text-slate-200 font-medium">
                                    {selected.date}, {selected.time}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Metode Pembayaran</span>
                                <span className="text-slate-200 font-medium">{selected.paymentMethod}</span>
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Column labels */}
                        <div className="flex justify-between text-[11px] text-slate-400">
                            <span>Item</span>
                            <div className="flex gap-8">
                                <span>Qty</span>
                                <span>Price</span>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            {selected.items.map((item, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg">
                                                🥛
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold leading-tight text-slate-200">
                                                    {item.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400">
                                                    Rp. {item.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-shrink-0 items-center gap-3">
                                            <Badge className="rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
                                                {item.qty}
                                            </Badge>
                                            <span className="text-[11px] font-medium text-slate-300">
                                                Rp. {(item.price * item.qty).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                    <Input
                                        readOnly
                                        value={item.note}
                                        placeholder="Catatan"
                                        className="h-8 rounded-lg border-white/20 bg-white text-xs text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">
                        Pilih transaksi untuk melihat detail
                    </div>
                )}
            </div>

            {/* Footer totals + actions */}
            <div>
                <Separator className="bg-white/10" />
                <div className="space-y-1.5 p-5">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>Discount</span>
                        <span>Rp. {selected ? selected.discount.toLocaleString('id-ID') : 0}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white">
                        <span>Subtotal</span>
                        <span>Rp. {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-2 p-5">
                    <Button
                        variant="outline"
                        className="h-10 w-full border-white/20 bg-transparent text-xs font-semibold text-white hover:bg-white/10 hover:text-white"
                    >
                        <Printer className="h-3.5 w-3.5" />
                        Cetak
                    </Button>
                    <Button className="h-11 w-full bg-white text-xs font-bold text-slate-900 hover:bg-slate-100">
                        <Mail className="h-3.5 w-3.5" />
                        Kirim via Email
                    </Button>
                </div>
            </div>
        </>
    );

    return (
        <AppShell variant="sidebar">
            <Head title="Riwayat Pesanan - POSAVE" />
            <AppSidebar items={cashierNavItems} />

            <main className="flex h-screen flex-1 overflow-hidden">

                {/* ── LEFT: Transaction list ───────────────────────────── */}
                <div className="flex flex-1 flex-col overflow-hidden bg-white">

                    {/* Search + AI */}
                    <div className="flex items-center gap-4 p-6">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search"
                                className="h-10 rounded-full border-slate-200 bg-slate-50 pl-10 focus-visible:border-blue-400"
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="ml-auto rounded-full border-blue-200 bg-blue-50 font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                        >
                            🤖 <span className="hidden sm:inline">Tanya Temanmu</span>
                        </Button>
                    </div>

                    {/* Date nav + category filter */}
                    <div className="flex items-center px-6 pb-2">
                        <div className="flex items-center gap-2">
                            <button onClick={prevDay} className="rounded p-1 hover:bg-slate-100">
                                <ChevronLeft className="h-4 w-4 text-slate-500" />
                            </button>
                            <div
                                onClick={() => dateInputRef.current?.showPicker()}
                                className="relative flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                            >
                                <CalendarDays className="h-4 w-4 text-slate-400" />
                                {formattedDate}
                                <input
                                    ref={dateInputRef}
                                    type="date"
                                    value={activeDate.toISOString().split('T')[0]}
                                    onChange={(e) => e.target.value && setActiveDate(new Date(e.target.value + 'T00:00:00'))}
                                    className="absolute bottom-0 left-0 h-0 w-0 opacity-0 pointer-events-none"
                                />
                            </div>
                            <button onClick={nextDay} className="rounded p-1 hover:bg-slate-100">
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                            </button>
                        </div>

                        <div className="ml-auto">
                            <Select defaultValue="all">
                                <SelectTrigger className="h-9 w-44 border-slate-200 bg-slate-50 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="qris">QRIS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="px-6 pb-6 pt-4">
                            {/* Column headers — hidden on small screens, shown on sm+ */}
                            <div className="mb-3 hidden grid-cols-[1.2fr_1fr_1fr_1fr_1fr] px-4 sm:grid">
                                {[
                                    { label: 'ORDER', align: 'text-left' },
                                    { label: 'WAKTU', align: 'text-left' },
                                    { label: 'METODE BAYAR', align: 'text-center' },
                                    { label: 'TOTAL', align: 'text-center' },
                                    { label: 'STATUS', align: 'text-right' },
                                ].map(({ label, align }) => (
                                    <span key={label} className={`text-sm font-bold tracking-wide text-slate-700 ${align}`}>
                                        {label}
                                    </span>
                                ))}
                            </div>

                            {transactions.length === 0 ? (
                                <div className="flex h-64 items-center justify-center text-sm text-slate-400">
                                    Oops belum ada history transaksi...
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {transactions.map((tx) => (
                                        <button
                                            key={tx.id}
                                            onClick={() => handleRowClick(tx.id)}
                                            className={`w-full rounded-xl border px-4 py-4 text-left transition ${
                                                selectedId === tx.id
                                                    ? 'border-blue-300 bg-blue-50'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {/* Mobile layout: stacked */}
                                            <div className="flex items-start justify-between sm:hidden">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700">{tx.invoice}</p>
                                                    <p className="text-xs text-slate-500">{tx.date} · {tx.time}</p>
                                                    <p className="mt-0.5 text-xs text-slate-500">{tx.paymentMethod.toUpperCase()}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1.5">
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        Rp. {tx.total.toLocaleString('id-ID')}
                                                    </span>
                                                    <Badge className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[tx.status]}`}>
                                                        {tx.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Desktop layout: grid columns */}
                                            <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_1fr] items-center sm:grid">
                                                <span className="text-sm font-semibold text-slate-700">{tx.invoice}</span>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">{tx.time}</p>
                                                    <p className="text-xs text-slate-400">{tx.date}</p>
                                                </div>
                                                <span className="text-center text-sm text-slate-600">
                                                    {tx.paymentMethod.toUpperCase()}
                                                </span>
                                                <span className="text-center text-sm font-semibold text-slate-700">
                                                    Rp. {tx.total.toLocaleString('id-ID')}
                                                </span>
                                                <span className="flex justify-end">
                                                    <Badge className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[tx.status]}`}>
                                                        {tx.status}
                                                    </Badge>
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: History Order Detail (desktop only) ────────── */}
                <div className="hidden lg:flex w-[340px] flex-col border-l border-white/10 bg-[var(--sidebar)] text-white">
                    {historyDetailInner}
                </div>

                {/* ── Sheet: History Order Detail on mobile/tablet ──────── */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetContent
                        side="right"
                        className="flex w-[85vw] flex-col p-0 text-white border-l-0 bg-[var(--sidebar)] sm:max-w-[400px]"
                    >
                        <div className="flex flex-1 flex-col overflow-hidden">
                            {historyDetailInner}
                        </div>
                    </SheetContent>
                </Sheet>
            </main>
        </AppShell>
    );
}
