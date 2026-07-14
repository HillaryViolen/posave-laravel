import { useRef, useState } from 'react';

interface MenuPosition {
    top: number;
    left: number;
}

export function useDropdownMenu(menuWidth: number = 144) {
    const [openId, setOpenId] = useState<number | null>(null);
    const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const toggleMenu = (id: number) => {
        if (openId === id) {
            setOpenId(null);
            return;
        }
        const btn = buttonRefs.current[id];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            setPosition({ top: rect.bottom + window.scrollY + 4, left: rect.right + window.scrollX - menuWidth });
        }
        setOpenId(id);
    };

    const closeMenu = () => setOpenId(null);

    return { openId, position, buttonRefs, toggleMenu, closeMenu };
}