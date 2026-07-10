import { useForm } from '@inertiajs/react';
import { useState } from 'react';

type Mode = 'lite' | 'advance';

export default function Onboarding() {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        type: '' as Mode | '',
        company_name: '',
        branch_name: '',
    });

    const selectMode = (mode: Mode) => {
        setSelectedMode(mode);
        setData('type', mode);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('onboarding.setup'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 sm:p-8" style={{ background: 'var(--page-bg)' }}>
            <div className="w-full max-w-[560px] rounded-2xl border bg-white p-6 sm:p-10" style={{ borderColor: 'var(--border)' }}>
                {/* Stepper — teks label disembunyiin di HP, cuma lingkaran+garis yang selalu tampil */}
                <div className="mb-10 flex items-center">
                    <div className="flex items-center gap-2">
                        <div
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium"
                            style={{ background: 'var(--primary-900)', color: '#fff' }}
                        >
                            {step > 1 ? (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                '1'
                            )}
                        </div>
                        <span
                            className="hidden text-sm font-medium sm:inline"
                            style={{ color: step === 1 ? 'var(--primary-900)' : 'var(--primary-600)' }}
                        >
                            Pilih mode
                        </span>
                    </div>

                    <div
                        className="mx-3 h-px flex-1 transition-all duration-300"
                        style={{ background: step > 1 ? 'var(--primary-900)' : '#e2e8f0' }}
                    />

                    <div className="flex items-center gap-2">
                        <div
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all"
                            style={{
                                background: step === 2 ? 'var(--primary-900)' : '#f1f5f9',
                                color: step === 2 ? '#fff' : 'var(--primary-600)',
                            }}
                        >
                            2
                        </div>
                        <span className="hidden text-sm font-medium sm:inline" style={{ color: step === 2 ? 'var(--primary-900)' : '#94a3b8' }}>
                            Informasi bisnis
                        </span>
                    </div>
                </div>

                {/* Label langkah saat ini — cuma tampil di HP, gantiin teks stepper yang disembunyiin */}
                <p className="-mt-8 mb-6 text-center text-xs font-medium sm:hidden" style={{ color: 'var(--primary-600)' }}>
                    Langkah {step} dari 2: {step === 1 ? 'Pilih mode' : 'Informasi bisnis'}
                </p>

                {/* Step 1 */}
                {step === 1 && (
                    <div>
                        <h1 className="mb-1 text-xl font-medium" style={{ color: 'var(--primary-900)' }}>
                            Pilih mode POSave
                        </h1>
                        <p className="mb-8 text-sm leading-relaxed" style={{ color: '#64748b' }}>
                            Mode menentukan fitur yang tersedia. Bisa disesuaikan dengan kebutuhan bisnismu.
                        </p>

                        {/* 1 kolom di HP, 2 kolom mulai sm — sebelumnya 2 kolom fixed, berantakan di layar sempit */}
                        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {/* Lite */}
                            <button
                                type="button"
                                onClick={() => selectMode('lite')}
                                className="relative rounded-xl border-2 p-5 text-left transition-all"
                                style={{
                                    borderColor: selectedMode === 'lite' ? 'var(--primary-900)' : '#e2e8f0',
                                    background: selectedMode === 'lite' ? '#f8fafc' : '#fff',
                                }}
                            >
                                {selectedMode === 'lite' && (
                                    <div
                                        className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full"
                                        style={{ background: 'var(--primary-900)' }}
                                    >
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                            <path
                                                d="M1.5 5l2.5 2.5 4.5-4.5"
                                                stroke="#fff"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ background: '#e0f2fe' }}>
                                    🏪
                                </div>
                                <span
                                    className="mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                                    style={{ background: '#dcfce7', color: '#166534' }}
                                >
                                    Lite
                                </span>
                                <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-900)' }}>
                                    Mode Lite
                                </p>
                                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                                    Untuk warung atau UMKM kecil. Satu cabang, satu akun owner, fitur esensial POS.
                                </p>
                            </button>

                            {/* Advance */}
                            <button
                                type="button"
                                onClick={() => selectMode('advance')}
                                className="relative rounded-xl border-2 p-5 text-left transition-all"
                                style={{
                                    borderColor: selectedMode === 'advance' ? 'var(--primary-900)' : '#e2e8f0',
                                    background: selectedMode === 'advance' ? '#f8fafc' : '#fff',
                                }}
                            >
                                {selectedMode === 'advance' && (
                                    <div
                                        className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full"
                                        style={{ background: 'var(--primary-900)' }}
                                    >
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                            <path
                                                d="M1.5 5l2.5 2.5 4.5-4.5"
                                                stroke="#fff"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ background: '#e0e7ff' }}>
                                    🏢
                                </div>
                                <span
                                    className="mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                                    style={{ background: '#ede9fe', color: '#4c1d95' }}
                                >
                                    Advance
                                </span>
                                <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-900)' }}>
                                    Mode Advance
                                </p>
                                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                                    Untuk bisnis berkembang. Multi-cabang, multi-role (owner, branch manager, cashier).
                                </p>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            disabled={!selectedMode}
                            className="w-full rounded-lg py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50"
                            style={{ background: 'var(--primary-900)' }}
                        >
                            Lanjut
                        </button>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <form onSubmit={submit}>
                        <h1 className="mb-1 text-xl font-medium" style={{ color: 'var(--primary-900)' }}>
                            Informasi bisnis
                        </h1>
                        <p className="mb-8 text-sm leading-relaxed" style={{ color: '#64748b' }}>
                            Isi nama bisnis dan cabang utama kamu. Bisa diubah kapan saja di pengaturan.
                        </p>

                        <div className="mb-5">
                            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                Nama bisnis
                            </label>
                            <input
                                type="text"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                placeholder="cth. Warung Bu Sari"
                                className="w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all outline-none focus:ring-2"
                                style={{
                                    borderColor: errors.company_name ? '#ef4444' : '#e2e8f0',
                                    color: 'var(--primary-900)',
                                    fontFamily: 'Poppins, sans-serif',
                                }}
                            />
                            {errors.company_name && <p className="mt-1 text-xs text-red-500">{errors.company_name}</p>}
                            <p className="mt-1 text-xs" style={{ color: '#94a3b8' }}>
                                Nama yang ditampilkan di seluruh sistem POSave
                            </p>
                        </div>

                        <div className="mb-5">
                            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                Nama cabang utama
                            </label>
                            <input
                                type="text"
                                value={data.branch_name}
                                onChange={(e) => setData('branch_name', e.target.value)}
                                placeholder="cth. Cabang Pusat"
                                className="w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all outline-none focus:ring-2"
                                style={{
                                    borderColor: errors.branch_name ? '#ef4444' : '#e2e8f0',
                                    color: 'var(--primary-900)',
                                    fontFamily: 'Poppins, sans-serif',
                                }}
                            />
                            {errors.branch_name && <p className="mt-1 text-xs text-red-500">{errors.branch_name}</p>}
                            <p className="mt-1 text-xs" style={{ color: '#94a3b8' }}>
                                Cabang pertama yang dibuat otomatis
                            </p>
                        </div>

                        <div className="mt-8 flex gap-2.5">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="shrink-0 rounded-lg border px-5 py-2.5 text-sm font-medium transition-all"
                                style={{
                                    borderColor: '#e2e8f0',
                                    color: 'var(--primary-600)',
                                    background: 'transparent',
                                }}
                            >
                                Kembali
                            </button>
                            <button
                                type="submit"
                                disabled={processing || !data.company_name.trim() || !data.branch_name.trim()}
                                className="flex-1 rounded-lg py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50"
                                style={{ background: 'var(--primary-900)' }}
                            >
                                {processing ? 'Menyimpan...' : 'Mulai gunakan POSave'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
