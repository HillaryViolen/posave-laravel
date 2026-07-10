import { formatCompactRupiah, formatRupiah } from '@/lib/format';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface HourPoint {
    hour: string;
    total: number;
    count: number;
}

function HourTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload as HourPoint;
    return (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--neutral-white)] px-3 py-2 shadow-md">
            <p className="text-xs text-[var(--grey-text)]">Jam {label}.00</p>
            <p className="text-sm font-semibold text-[var(--subheading)]">{formatRupiah(p.total)}</p>
            <p className="text-xs text-[var(--grey-text)]">{p.count} transaksi</p>
        </div>
    );
}

export function HourlySalesChart({ data }: { data: HourPoint[] }) {
    const active = data.filter((d) => d.total > 0);
    const minHour = active.length ? Number(active[0].hour) : 7;
    const maxHour = active.length ? Number(active[active.length - 1].hour) : 21;
    const visible = data.filter((d) => Number(d.hour) >= minHour && Number(d.hour) <= maxHour);

    const peak = Math.max(...visible.map((d) => d.total), 0);
    const interval = Math.max(0, Math.ceil(visible.length / 8) - 1);

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={visible} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
                <XAxis dataKey="hour" interval={interval} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={6} />
                <YAxis tickFormatter={formatCompactRupiah} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} width={64} />
                <Tooltip cursor={{ fill: 'rgba(148,163,184,0.08)' }} content={<HourTooltip />} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {visible.map((d) => (
                        <Cell key={d.hour} fill={d.total === peak && peak > 0 ? '#377ba3' : '#bcd4e4'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
