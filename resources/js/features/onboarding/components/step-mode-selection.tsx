import { ModeCard } from './mode-card';

type Mode = 'lite' | 'advance';

interface StepModeSelectionProps {
    selectedMode: Mode | null;
    onSelect: (mode: Mode) => void;
    onNext: () => void;
}

export function StepModeSelection({ selectedMode, onSelect, onNext }: StepModeSelectionProps) {
    return (
        <div>
            <h1 className="mb-1 text-xl font-medium" style={{ color: 'var(--primary-900)' }}>
                Pilih mode POSave
            </h1>
            <p className="mb-8 text-sm leading-relaxed" style={{ color: '#64748b' }}>
                Mode menentukan fitur yang tersedia. Bisa disesuaikan dengan kebutuhan bisnismu.
            </p>

            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ModeCard
                    icon="🏪"
                    badgeLabel="Lite"
                    badgeBg="#dcfce7"
                    badgeColor="#166534"
                    iconBg="#e0f2fe"
                    title="Mode Lite"
                    description="Untuk warung atau UMKM kecil. Satu cabang, satu akun owner, fitur esensial POS."
                    selected={selectedMode === 'lite'}
                    onClick={() => onSelect('lite')}
                />
                <ModeCard
                    icon="🏢"
                    badgeLabel="Advance"
                    badgeBg="#ede9fe"
                    badgeColor="#4c1d95"
                    iconBg="#e0e7ff"
                    title="Mode Advance"
                    description="Untuk bisnis berkembang. Multi-cabang, multi-role (owner, branch manager, cashier)."
                    selected={selectedMode === 'advance'}
                    onClick={() => onSelect('advance')}
                />
            </div>

            <button
                type="button"
                onClick={onNext}
                disabled={!selectedMode}
                className="w-full rounded-lg py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50"
                style={{ background: 'var(--primary-900)' }}
            >
                Lanjut
            </button>
        </div>
    );
}
