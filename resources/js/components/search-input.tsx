import { Search } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    placeholder?: string;
    variant?: 'default' | 'kiosk';
}

const THEME = {
    default: {
        wrapper: 'h-10 rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] pr-4 pl-9 text-sm',
        icon: 'text-[var(--grey-text)]',
    },
    kiosk: {
        wrapper: 'h-10 rounded-full border border-slate-200 bg-slate-50 pr-4 pl-10 text-sm focus-visible:border-blue-400',
        icon: 'text-slate-400',
    },
};

export function SearchInput({ value, onChange, onSubmit, placeholder = 'Search', variant = 'default' }: SearchInputProps) {
    const theme = THEME[variant];

    return (
        <form onSubmit={onSubmit}>
            <div className="relative">
                <Search className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 ${theme.icon}`} aria-hidden="true" />
                <input
                    type="text"
                    aria-label={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`focus:ring-ring w-full outline-none focus:ring-1 ${theme.wrapper}`}
                />
            </div>
        </form>
    );
}
