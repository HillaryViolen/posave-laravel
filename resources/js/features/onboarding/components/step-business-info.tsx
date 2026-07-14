import type { FormEventHandler } from 'react';

interface StepBusinessInfoProps {
    companyName: string;
    branchName: string;
    onCompanyNameChange: (value: string) => void;
    onBranchNameChange: (value: string) => void;
    companyNameError?: string;
    branchNameError?: string;
    processing: boolean;
    onBack: () => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
}

export function StepBusinessInfo({
    companyName,
    branchName,
    onCompanyNameChange,
    onBranchNameChange,
    companyNameError,
    branchNameError,
    processing,
    onBack,
    onSubmit,
}: StepBusinessInfoProps) {
    return (
        <form onSubmit={onSubmit}>
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
                    value={companyName}
                    onChange={(e) => onCompanyNameChange(e.target.value)}
                    placeholder="cth. Warung Bu Sari"
                    className="w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all outline-none focus:ring-2"
                    style={{
                        borderColor: companyNameError ? '#ef4444' : '#e2e8f0',
                        color: 'var(--primary-900)',
                        fontFamily: 'Poppins, sans-serif',
                    }}
                />
                {companyNameError && <p className="mt-1 text-xs text-red-500">{companyNameError}</p>}
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
                    value={branchName}
                    onChange={(e) => onBranchNameChange(e.target.value)}
                    placeholder="cth. Cabang Pusat"
                    className="w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all outline-none focus:ring-2"
                    style={{
                        borderColor: branchNameError ? '#ef4444' : '#e2e8f0',
                        color: 'var(--primary-900)',
                        fontFamily: 'Poppins, sans-serif',
                    }}
                />
                {branchNameError && <p className="mt-1 text-xs text-red-500">{branchNameError}</p>}
                <p className="mt-1 text-xs" style={{ color: '#94a3b8' }}>
                    Cabang pertama yang dibuat otomatis
                </p>
            </div>

            <div className="mt-8 flex gap-2.5">
                <button
                    type="button"
                    onClick={onBack}
                    className="shrink-0 rounded-lg border px-5 py-2.5 text-sm font-medium transition-all"
                    style={{ borderColor: '#e2e8f0', color: 'var(--primary-600)', background: 'transparent' }}
                >
                    Kembali
                </button>
                <button
                    type="submit"
                    disabled={processing || !companyName.trim() || !branchName.trim()}
                    className="flex-1 rounded-lg py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50"
                    style={{ background: 'var(--primary-900)' }}
                >
                    {processing ? 'Menyimpan...' : 'Mulai gunakan POSave'}
                </button>
            </div>
        </form>
    );
}
