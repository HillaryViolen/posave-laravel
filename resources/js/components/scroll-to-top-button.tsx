import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            type="button"
            aria-label="Kembali ke atas"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed right-5 bottom-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-header)] text-white shadow-lg transition hover:bg-[var(--surface-header-hover)]"
        >
            <ArrowUp className="h-5 w-5" />
        </button>
    );
}
