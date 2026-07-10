import { DashboardSidebarLayout } from '@/layouts';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface CompanyProfile {
    name?: string;
    logo?: string;
    address?: string;
    province?: string;
    city?: string;
    zip?: string;
    phone?: string;
    instagram?: string;
    facebook?: string;
    x?: string;
    youtube?: string;
    whatsapp?: string;
    website?: string;
}

interface Props {
    company: {
        id: number;
        type: string;
        profile: CompanyProfile | null;
    };
}

export default function CompanyProfilePage({ company }: Props) {
    const profile = company.profile;

    const { data, setData, post, processing, errors } = useForm({
        name: profile?.name ?? '',
        phone: profile?.phone ?? '',
        address: profile?.address ?? '',
        province: profile?.province ?? '',
        city: profile?.city ?? '',
        zip: profile?.zip ?? '',
        instagram: profile?.instagram ?? '',
        facebook: profile?.facebook ?? '',
        x: profile?.x ?? '',
        youtube: profile?.youtube ?? '',
        whatsapp: profile?.whatsapp ?? '',
        website: profile?.website ?? '',
        logo: null as File | null,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(profile?.logo ? `/storage/${profile.logo}` : null);
    const logoRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('logo', file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.company-profile.update'), { forceFormData: true });
    };

    const inputClass =
        'w-full rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring transition-all';

    return (
        <DashboardSidebarLayout title="Profil Perusahaan" description="Kelola informasi dan identitas perusahaan kamu">
            <Head title="Profil Perusahaan" />

            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <form onSubmit={submit}>
                    <div className="space-y-5">
                        {/* Logo & Nama */}
                        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                            <div className="border-b border-[var(--border-strong)] bg-[var(--surface-header)] px-4 py-3 sm:px-6 sm:py-4">
                                <h2 className="text-sm font-medium text-[var(--text-light)]">Identitas Perusahaan</h2>
                            </div>

                            <div className="p-4 sm:p-6">
                                {/* Logo — stack vertikal di HP, sejajar mulai sm */}
                                <div className="mb-6 flex flex-col items-start gap-4 border-b border-[var(--border-strong)] pb-6 sm:flex-row sm:items-center sm:gap-5">
                                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--page-bg)]">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo perusahaan" className="h-full w-full object-contain" />
                                        ) : (
                                            <span className="text-2xl" aria-hidden="true">
                                                🏢
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-[var(--grey-text)]">Logo Perusahaan</p>
                                        <p className="mb-2 text-xs text-[var(--grey-text-muted)]">JPG, PNG, atau WEBP. Maksimal 2MB.</p>
                                        <button
                                            type="button"
                                            aria-label="Ganti logo perusahaan"
                                            onClick={() => logoRef.current?.click()}
                                            className="rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 py-1.5 text-xs font-medium text-[var(--grey-text)] transition-all hover:bg-[var(--second-accent)]"
                                        >
                                            Ganti Logo
                                        </button>
                                        <input
                                            ref={logoRef}
                                            type="file"
                                            accept="image/*"
                                            aria-label="Upload logo perusahaan"
                                            className="hidden"
                                            onChange={handleLogoChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label htmlFor="company-name" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                            Nama Perusahaan
                                        </label>
                                        <input
                                            id="company-name"
                                            type="text"
                                            aria-label="Nama perusahaan"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="PT. Maju Bersama"
                                            className={inputClass}
                                            style={{ borderColor: errors.name ? '#ef4444' : undefined }}
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="company-phone" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                            Nomor Telepon
                                        </label>
                                        <input
                                            id="company-phone"
                                            type="text"
                                            aria-label="Nomor telepon perusahaan"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+62 812 3456 7890"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="company-website" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                            Website
                                        </label>
                                        <input
                                            id="company-website"
                                            type="url"
                                            aria-label="Website perusahaan"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://posave.id"
                                            className={inputClass}
                                            style={{ borderColor: errors.website ? '#ef4444' : undefined }}
                                        />
                                        {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alamat */}
                        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                            <div className="border-b border-[var(--border-strong)] bg-[var(--surface-header)] px-4 py-3 sm:px-6 sm:py-4">
                                <h2 className="text-sm font-medium text-[var(--text-light)]">Alamat</h2>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="mb-4">
                                    <label htmlFor="company-address" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                        Alamat Lengkap
                                    </label>
                                    <input
                                        id="company-address"
                                        type="text"
                                        aria-label="Alamat lengkap perusahaan"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Jl. Sudirman No. 1"
                                        className={inputClass}
                                    />
                                </div>

                                {/* 1 kolom di HP, 3 kolom mulai sm — sebelumnya 3 kolom fixed, berantakan di layar sempit */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div>
                                        <label htmlFor="company-province" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                            Provinsi
                                        </label>
                                        <input
                                            id="company-province"
                                            type="text"
                                            aria-label="Provinsi"
                                            value={data.province}
                                            onChange={(e) => setData('province', e.target.value)}
                                            placeholder="DKI Jakarta"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="company-city" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                            Kota
                                        </label>
                                        <input
                                            id="company-city"
                                            type="text"
                                            aria-label="Kota"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Jakarta Pusat"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="company-zip" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                            Kode Pos
                                        </label>
                                        <input
                                            id="company-zip"
                                            type="text"
                                            aria-label="Kode pos"
                                            value={data.zip}
                                            onChange={(e) => setData('zip', e.target.value)}
                                            placeholder="10110"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sosial Media */}
                        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                            <div className="border-b border-[var(--border-strong)] bg-[var(--surface-header)] px-4 py-3 sm:px-6 sm:py-4">
                                <h2 className="text-sm font-medium text-[var(--text-light)]">Media Sosial</h2>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="company-instagram" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                            Instagram
                                        </label>
                                        <div className="flex">
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)]">
                                                @
                                            </span>
                                            <input
                                                id="company-instagram"
                                                type="text"
                                                aria-label="Username Instagram"
                                                value={data.instagram}
                                                onChange={(e) => setData('instagram', e.target.value)}
                                                placeholder="posave.id"
                                                className="w-full rounded-r-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3.5 py-2.5 text-sm outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="company-facebook" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                            Facebook
                                        </label>
                                        <div className="flex">
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)]">
                                                fb/
                                            </span>
                                            <input
                                                id="company-facebook"
                                                type="text"
                                                aria-label="Username Facebook"
                                                value={data.facebook}
                                                onChange={(e) => setData('facebook', e.target.value)}
                                                placeholder="posave"
                                                className="w-full rounded-r-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3.5 py-2.5 text-sm outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="company-x" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                            X (Twitter)
                                        </label>
                                        <div className="flex">
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)]">
                                                @
                                            </span>
                                            <input
                                                id="company-x"
                                                type="text"
                                                aria-label="Username X (Twitter)"
                                                value={data.x}
                                                onChange={(e) => setData('x', e.target.value)}
                                                placeholder="posave"
                                                className="w-full rounded-r-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3.5 py-2.5 text-sm outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="company-youtube" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                            YouTube
                                        </label>
                                        <div className="flex">
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)]">
                                                @
                                            </span>
                                            <input
                                                id="company-youtube"
                                                type="text"
                                                aria-label="Username YouTube"
                                                value={data.youtube}
                                                onChange={(e) => setData('youtube', e.target.value)}
                                                placeholder="posave"
                                                className="w-full rounded-r-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3.5 py-2.5 text-sm outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="company-whatsapp" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                            WhatsApp
                                        </label>
                                        <input
                                            id="company-whatsapp"
                                            type="text"
                                            aria-label="Nomor WhatsApp"
                                            value={data.whatsapp}
                                            onChange={(e) => setData('whatsapp', e.target.value)}
                                            placeholder="+62 812 3456 7890"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                aria-label="Simpan perubahan profil perusahaan"
                                disabled={processing}
                                className="w-full rounded-lg bg-[var(--surface-header)] px-6 py-2.5 text-sm font-medium text-[var(--text-light)] transition-all hover:bg-[var(--surface-header-hover)] disabled:opacity-50 sm:w-auto"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardSidebarLayout>
    );
}
