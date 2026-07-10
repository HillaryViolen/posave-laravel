import { SettingsCard } from '@/features/advance/management/company-settings/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface ReceiptSetting {
    id?: number;
    logo?: string;
    address?: string;
    province?: string;
    city?: string;
    zip?: string;
    phone?: string;
    email?: string;
    notes?: string;
}

interface Props {
    receipt: ReceiptSetting | null;
    company_name: string;
}

export default function ReceiptSettingsPage({ receipt, company_name }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        logo: null as File | null,
        address: receipt?.address ?? '',
        province: receipt?.province ?? '',
        city: receipt?.city ?? '',
        zip: receipt?.zip ?? '',
        phone: receipt?.phone ?? '',
        email: receipt?.email ?? '',
        notes: receipt?.notes ?? '',
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(receipt?.logo ? `/storage/${receipt.logo}` : null);
    const logoRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('logo', file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.receipt.update'), { forceFormData: true });
    };

    const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const inputClass =
        'w-full rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring transition-all';

    return (
        <DashboardSidebarLayout title="Bukti Bayar" description="Kelola tampilan struk pembayaran untuk semua cabang">
            <Head title="Bukti Bayar" />

            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Form */}
                    <form onSubmit={submit}>
                        <SettingsCard title="Informasi Struk">
                            {/* Logo upload — stack di HP, sejajar mulai sm */}
                            <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--page-bg)]">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="logo" className="h-full w-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-[var(--grey-text)]">Logo</span>
                                    )}
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => logoRef.current?.click()}
                                        className="rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 py-1.5 text-xs font-medium text-[var(--grey-text)] transition-all hover:bg-[var(--second-accent)]"
                                    >
                                        Upload Logo
                                    </button>
                                    <p className="mt-1 text-xs text-[var(--grey-text-muted)]">JPG, PNG, WEBP. Maks 2MB</p>
                                </div>
                                <input
                                    aria-label="input-file"
                                    ref={logoRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">Alamat</label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Jl. Merdeka No. 123"
                                    className={inputClass}
                                />
                            </div>

                            {/* 1 kolom di HP, 3 kolom mulai sm — sebelumnya 3 kolom fixed */}
                            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">Provinsi</label>
                                    <input
                                        type="text"
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                        placeholder="DKI Jakarta"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">Kota</label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="Jakarta Pusat"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">Kode Pos</label>
                                    <input
                                        type="text"
                                        value={data.zip}
                                        onChange={(e) => setData('zip', e.target.value)}
                                        placeholder="10110"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* 1 kolom di HP, 2 kolom mulai sm */}
                            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">Nomor Telepon</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+62 812 3456 7890"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="hello@posave.id"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">Catatan</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Terima kasih telah berbelanja..."
                                    rows={3}
                                    className="focus:ring-ring w-full resize-none rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3.5 py-2.5 text-sm outline-none focus:ring-1"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-[var(--surface-header)] py-2.5 text-sm font-medium text-[var(--text-light)] transition-all hover:bg-[var(--surface-header-hover)] disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </SettingsCard>
                    </form>

                    {/* Live Preview — self-start biar tinggi natural, gak ketarik stretch sama kolom form */}
                    <SettingsCard title="Preview Struk" className="lg:self-start">
                        <div className="flex items-start justify-center">
                            <div className="w-full max-w-[280px] rounded-lg border border-[var(--border-strong)] bg-[var(--page-bg)] p-5 font-mono text-xs">
                                {logoPreview && (
                                    <div className="mb-3 flex justify-center">
                                        <img src={logoPreview} alt="logo" className="h-12 w-auto object-contain" />
                                    </div>
                                )}

                                <div className="mb-3 text-center">
                                    <p className="font-bold text-[var(--primary-900,#22303f)]">{company_name || 'Nama Perusahaan'}</p>
                                    {data.address && (
                                        <p className="mt-0.5 text-xs text-[var(--grey-text)]">
                                            {[data.address, data.city, data.province].filter(Boolean).join(', ')}
                                        </p>
                                    )}
                                    {(data.phone || data.email) && (
                                        <p className="mt-0.5 text-xs text-[var(--grey-text)]">
                                            {[data.phone, data.email].filter(Boolean).join(' | ')}
                                        </p>
                                    )}
                                </div>

                                <div className="my-2 border-t border-dashed border-[var(--border-strong)]" />

                                <div className="mb-2 space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--grey-text)]">Tanggal</span>
                                        <span>{today}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--grey-text)]">No. Struk</span>
                                        <span>INV-001</span>
                                    </div>
                                </div>

                                <div className="my-2 border-t border-dashed border-[var(--border-strong)]" />

                                <div className="mb-2">
                                    <div className="flex justify-between">
                                        <span>Contoh Produk x1</span>
                                        <span>Rp 50.000</span>
                                    </div>
                                </div>

                                <div className="my-2 border-t border-dashed border-[var(--border-strong)]" />

                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--grey-text)]">Subtotal</span>
                                        <span>Rp 50.000</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--grey-text)]">Pajak (5%)</span>
                                        <span>Rp 2.500</span>
                                    </div>
                                    <div className="mt-1 flex justify-between font-bold">
                                        <span>TOTAL</span>
                                        <span>Rp 52.500</span>
                                    </div>
                                </div>

                                {data.notes && (
                                    <>
                                        <div className="my-2 border-t border-dashed border-[var(--border-strong)]" />
                                        <p className="text-center text-xs text-[var(--grey-text)]">{data.notes}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </SettingsCard>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
