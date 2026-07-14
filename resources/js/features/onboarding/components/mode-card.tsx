interface ModeCardProps {
    icon: string;
    badgeLabel: string;
    badgeBg: string;
    badgeColor: string;
    iconBg: string;
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
}

export function ModeCard({ icon, badgeLabel, badgeBg, badgeColor, iconBg, title, description, selected, onClick }: ModeCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="relative rounded-xl border-2 p-5 text-left transition-all"
            style={{
                borderColor: selected ? 'var(--primary-900)' : '#e2e8f0',
                background: selected ? '#f8fafc' : '#fff',
            }}
        >
            {selected && (
                <div
                    className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ background: 'var(--primary-900)' }}
                >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ background: iconBg }}>
                {icon}
            </div>
            <span className="mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: badgeBg, color: badgeColor }}>
                {badgeLabel}
            </span>
            <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-900)' }}>
                {title}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                {description}
            </p>
        </button>
    );
}
