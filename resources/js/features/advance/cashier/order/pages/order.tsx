import { AppShell, AppSidebar } from '@/components';
import { cashierNavItems } from '@/data';
import { Badge, Button, Card, CardContent, Input, Separator, Sheet, SheetContent } from '@/components/ui';
import { Head } from '@inertiajs/react';
import { Banknote, ChevronLeft, ChevronRight, QrCode, Search, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
    { name: 'Snack', icon: '🍟' },
    { name: 'Susu', icon: '🥛' },
    { name: 'Coklat', icon: '🍫' },
    { name: 'Tepung', icon: '🌾' },
    { name: 'Minuman', icon: '🥤' },
    { name: 'Mentega', icon: '🧈' },
];

const PRODUCTS = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: 'Japota',
    subtitle: 'Rumput Laut',
    price: 10000,
}));

const QUICK_AMOUNTS = [20000, 50000, 50000, 100000];

type CartItem = { id: number; name: string; price: number; qty: number; note: string };

export default function OrderPage() {
    const [activeCategory, setActiveCategory] = useState('Snack');
    const [selectedProductId, setSelectedProductId] = useState<number | null>(1);
    const [cart, setCart] = useState<CartItem[]>([
        { id: 1, name: 'Susu Kental Manis', price: 5000, qty: 5, note: '' },
        { id: 2, name: 'Susu Kental Manis', price: 5000, qty: 5, note: '' },
    ]);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
    const [customerMoney, setCustomerMoney] = useState(0);
    const [showQris, setShowQris] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);

    const discount = 0;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalTagihan = subtotal - discount;
    const kembalian = customerMoney > totalTagihan ? customerMoney - totalTagihan : 0;
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);

    const updateNote = (index: number, note: string) =>
        setCart((prev) => prev.map((item, i) => (i === index ? { ...item, note } : item)));

    const handleLanjutPembayaran = () => {
        setShowPayment(true);
        if (window.innerWidth < 1024) setSheetOpen(true);
    };

    const handleCancel = () => {
        setShowPayment(false);
        setShowQris(false);
        setCustomerMoney(0);
        setSheetOpen(false);
    };

    // ── Panel content — shared between desktop sidebar & mobile Sheet ────────

    const orderDetailInner = (
        <>
            <div className="p-5">
                <h2 className="text-base font-bold uppercase tracking-widest">Order Detail</h2>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-300">Kopiakin Resto</span>
                    <span className="text-slate-400">Tuesday, 2 Feb 2021</span>
                </div>
            </div>
            <Separator className="bg-white/10" />

            <div className="flex justify-between px-5 pb-2 pt-3 text-[11px] text-slate-400">
                <span>Item</span>
                <div className="flex gap-8">
                    <span>Qty</span>
                    <span>Price</span>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-2">
                {cart.map((item, index) => (
                    <div key={index} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-lg">
                                    🥛
                                </div>
                                <div>
                                    <p className="text-xs font-semibold leading-tight text-slate-200">{item.name}</p>
                                    <p className="text-[10px] text-slate-400">Rp. {item.price.toLocaleString('id-ID')}</p>
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
                            value={item.note}
                            onChange={(e) => updateNote(index, e.target.value)}
                            placeholder="Catatan"
                            className="h-8 rounded-lg border-white/20 bg-white text-xs text-slate-900 placeholder:text-slate-400"
                        />
                    </div>
                ))}
            </div>

            <Separator className="bg-white/10" />
            <div className="space-y-1.5 p-5">
                <div className="flex justify-between text-xs text-slate-400">
                    <span>Discount</span>
                    <span>Rp. {discount}</span>
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
                    Cetak
                </Button>
                {!showPayment && (
                    <Button
                        onClick={handleLanjutPembayaran}
                        className="h-11 w-full bg-white text-xs font-bold text-slate-900 hover:bg-slate-100"
                    >
                        Lanjut Pembayaran
                    </Button>
                )}
            </div>
        </>
    );

    const paymentInner = (
        <>
            <div className="p-5">
                <h2 className="text-base font-bold">Payment</h2>
                <p className="text-[11px] text-sky-300">3 payment methods</p>
            </div>
            <Separator className="bg-sky-800" />

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
                <div>
                    <p className="mb-3 text-xs font-bold text-sky-200">Payment Methods</p>
                    <div className="grid grid-cols-2 gap-3">
                        {(
                            [
                                { id: 'cash', label: 'Cash', icon: <Banknote className="h-6 w-6" /> },
                                { id: 'qris', label: 'Qris', icon: <QrCode className="h-6 w-6" /> },
                            ] as const
                        ).map((method) => (
                            <button
                                key={method.id}
                                onClick={() => {
                                    setPaymentMethod(method.id);
                                    setShowQris(false);
                                }}
                                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-4 transition ${
                                    paymentMethod === method.id
                                        ? 'border-white bg-sky-800 text-white'
                                        : 'border-sky-700 bg-sky-950/50 text-sky-300 hover:bg-sky-800'
                                }`}
                            >
                                {method.icon}
                                <span className="text-[11px] font-bold">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <Separator className="bg-sky-800" />

                <div className="flex items-center justify-between">
                    <span className="text-xs text-sky-200">Total Tagihan</span>
                    <span className="text-sm font-bold text-white">
                        Rp. {totalTagihan.toLocaleString('id-ID')}
                    </span>
                </div>

                {paymentMethod === 'cash' && (
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-sky-200">Nominal Pelanggan</p>
                        <div className="grid grid-cols-2 gap-2">
                            {QUICK_AMOUNTS.map((amount, i) => (
                                <Button
                                    key={i}
                                    onClick={() => setCustomerMoney(amount)}
                                    className={`h-9 text-xs font-medium ${
                                        customerMoney === amount
                                            ? 'bg-white text-slate-900 hover:bg-slate-100'
                                            : 'border border-sky-700 bg-sky-950/60 text-sky-100 hover:bg-sky-800'
                                    }`}
                                >
                                    Rp. {amount.toLocaleString('id-ID')}
                                </Button>
                            ))}
                        </div>
                        <Input
                            type="number"
                            value={customerMoney || ''}
                            onChange={(e) => setCustomerMoney(Number(e.target.value))}
                            placeholder="Nominal Pelanggan"
                            className="h-10 border-sky-700 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-sky-200">Kembalian</span>
                            <span className="font-bold text-white">
                                Rp. {kembalian.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                )}

                {paymentMethod === 'qris' && (
                    <div className="flex items-center justify-center rounded-xl bg-sky-950/50 py-8">
                        {showQris ? (
                            <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-4 text-black">
                                <div className="flex h-36 w-36 items-center justify-center rounded border-2 border-slate-200 bg-slate-100 text-[10px] font-bold text-slate-400">
                                    QRIS CODE
                                </div>
                                <span className="text-[10px] text-slate-500">Scan untuk POSAVE</span>
                            </div>
                        ) : (
                            <Button
                                onClick={() => setShowQris(true)}
                                className="bg-white px-8 text-xs font-bold text-slate-900 hover:bg-slate-100"
                            >
                                Tampilkan Qris
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <Separator className="bg-sky-800" />
            <div className="space-y-2 p-5">
                <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="h-10 w-full border-sky-700 bg-transparent text-xs text-white hover:bg-sky-800 hover:text-white"
                >
                    Cancel
                </Button>
                <Button className="h-11 w-full bg-white text-xs font-bold text-slate-900 hover:bg-slate-100">
                    Confirm payment
                </Button>
            </div>
        </>
    );

    return (
        <AppShell variant="sidebar">
            <Head title="Kasir - POSAVE" />
            <AppSidebar items={cashierNavItems} />
            <main className="flex flex-1 h-screen overflow-hidden">

                {/* ── LEFT: Menu area ─────────────────────────────────── */}
                <div className="flex flex-1 flex-col overflow-y-auto bg-white p-6">

                    {/* Search + AI button */}
                    <div className="mb-6 flex items-center gap-4">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search"
                                className="h-10 rounded-full border-slate-200 bg-slate-50 pl-10"
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="ml-auto rounded-full border-blue-200 bg-blue-50 font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                        >
                            🤖 Tanya Temanmu
                        </Button>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-800">Kategori</h2>
                            <div className="flex gap-1">
                                <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border-slate-200">
                                    <ChevronLeft className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border-slate-200">
                                    <ChevronRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`flex min-w-[76px] cursor-pointer flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 transition ${
                                        activeCategory === cat.name
                                            ? 'border-blue-500 bg-blue-500 text-white'
                                            : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="text-xl leading-none">{cat.icon}</span>
                                    <span className="text-[11px] font-semibold">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product grid */}
                    <div>
                        <h2 className="mb-3 text-sm font-bold text-slate-800">Menu</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {PRODUCTS.map((product) => {
                                const isSelected = selectedProductId === product.id;
                                return (
                                    <Card
                                        key={product.id}
                                        onClick={() => setSelectedProductId(product.id)}
                                        className={`cursor-pointer overflow-hidden transition ${
                                            isSelected
                                                ? 'border-2 border-blue-500 shadow-md'
                                                : 'border border-slate-200 hover:shadow-sm'
                                        }`}
                                    >
                                        <CardContent className="flex flex-col items-center p-3">
                                            <div className="mb-3 flex h-24 w-full items-center justify-center rounded-xl bg-slate-100 text-4xl">
                                                🍟
                                            </div>
                                            <p className="text-center text-xs font-bold leading-tight text-slate-700">
                                                {product.name}
                                            </p>
                                            <p className="mb-3 text-center text-xs text-slate-500">{product.subtitle}</p>
                                            <Button
                                                size="sm"
                                                className="w-full rounded-full bg-slate-700 text-xs font-medium text-white hover:bg-slate-800"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Tambah
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── MIDDLE: Order Detail (desktop only) ─────────────── */}
                <div className="hidden lg:flex w-[340px] flex-col border-l border-white/10 bg-[var(--sidebar)] text-white">
                    {orderDetailInner}
                </div>

                {/* ── RIGHT: Payment panel (desktop only) ──────────────── */}
                {showPayment && (
                    <div className="hidden lg:flex w-[320px] flex-col border-l border-sky-950 bg-sky-900 text-white">
                        {paymentInner}
                    </div>
                )}

                {/* ── FAB: opens Sheet on mobile/tablet ────────────────── */}
                {cartCount > 0 && (
                    <button
                        onClick={() => setSheetOpen(true)}
                        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[var(--sidebar)] px-5 py-3.5 text-white shadow-2xl lg:hidden"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="text-sm font-bold">
                            {cartCount} item · Rp. {subtotal.toLocaleString('id-ID')}
                        </span>
                    </button>
                )}

                {/* ── Sheet: Order Detail + Payment on mobile/tablet ───── */}
                <Sheet
                    open={sheetOpen}
                    onOpenChange={(open) => {
                        if (!open) handleCancel();
                        else setSheetOpen(true);
                    }}
                >
                    <SheetContent
                        side="right"
                        className="flex w-[85vw] flex-col p-0 text-white border-l-0 sm:max-w-[400px]"
                        style={{ background: showPayment ? 'rgb(12 74 110)' : 'var(--sidebar)' }}
                    >
                        <div className="flex flex-1 flex-col overflow-hidden">
                            {showPayment ? paymentInner : orderDetailInner}
                        </div>
                    </SheetContent>
                </Sheet>
            </main>
        </AppShell>
    );
}
