/** Placeholder berdenyut selagi chunk chart (recharts) dimuat lazy. */
export function ChartSkeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded-lg bg-[var(--second-accent)] ${className ?? 'h-[240px]'}`} />;
}
