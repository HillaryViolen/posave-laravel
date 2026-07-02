/** Helper format angka & mata uang (Rupiah) untuk Dashboard & Laporan. */

const idr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat('id-ID');

/** "Rp 12.450.000" */
export function formatRupiah(value: number): string {
    return idr.format(Math.round(value || 0));
}

/** "12.450.000" (tanpa simbol) */
export function formatNumber(value: number): string {
    return number.format(Math.round(value || 0));
}

/** Versi ringkas untuk axis chart: "Rp 12,4 jt", "Rp 850 rb". */
export function formatCompactRupiah(value: number): string {
    const v = Math.abs(value);
    if (v >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1).replace('.', ',')} M`;
    if (v >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1).replace('.', ',')} jt`;
    if (v >= 1_000) return `Rp ${Math.round(value / 1_000)} rb`;
    return `Rp ${Math.round(value)}`;
}

/** Persentase bertanda untuk badge perubahan: "+15,5%", "−3,2%", "0%". */
export function formatSignedPct(value: number): string {
    if (!value) return '0%';
    const sign = value > 0 ? '+' : '−';
    return `${sign}${Math.abs(value).toFixed(1).replace('.', ',')}%`;
}

/** Persentase biasa: "24,2%". */
export function formatPct(value: number): string {
    return `${(value || 0).toFixed(1).replace('.', ',')}%`;
}
