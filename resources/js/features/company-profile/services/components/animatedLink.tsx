import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface AnimatedLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    hoverBgClass?: string;
}

export const AnimatedLink = ({ 
    href, 
    children, 
    className = "", 
    hoverBgClass = "bg-[var(--secondary-900)]" 
}: AnimatedLinkProps) => {
    return (
        <Link 
            href={href} 
            className={`relative overflow-hidden group inline-block ${className}`}
        >

            <span 
                className={`absolute inset-0 rounded-full scale-0 origin-center transition-transform duration-500 ease-out group-hover:scale-100 ${hoverBgClass}`}
            ></span>
            
            <span className="relative z-10">
                {children}
            </span>
        </Link>
    );
};