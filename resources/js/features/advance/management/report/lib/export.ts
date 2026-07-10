import { formatNumber, formatPct, formatRupiah } from '@/lib/format';

/**
 * Modul export laporan (CSV / Excel / PDF) — sepenuhnya sisi klien.
 *
 * Library berat (write-excel-file, jspdf) di-`import()` dinamis di dalam handler
 * supaya tidak membebani load awal halaman; baru diunduh saat user menekan export.
 *
 * Warna di-hardcode dari resources/css/app.css (tema terang) karena file dibuka
 * di luar aplikasi (Excel/PDF reader) yang tidak mengenal CSS variable.
 */

const BRAND = {
    headerFill: '#22303F', // --surface-header
    headerText: '#FFFFFF', // --text-light
    stripe: '#F1F5F9', // --second-accent (baris total)
    stripeLight: '#F8FAFC', // slate-50 (zebra baris genap)
    subtle: '#394F67', // --grey-text
    border: '#E2E8F0', // --border
    boldTop: '#CBD5E1', // slate-300 (garis atas baris total)
} as const;

const BRAND_RGB = {
    headerFill: [34, 48, 63] as [number, number, number],
    stripe: [241, 245, 249] as [number, number, number],
    subtle: [57, 79, 103] as [number, number, number],
    border: [226, 232, 240] as [number, number, number],
};

type CellKind = 'currency' | 'number' | 'percent';

/** Sel: string apa adanya, atau angka bertipe agar bisa diformat per-target. */
export type Cell = string | { n: number; kind: CellKind };

export const cur = (n: number): Cell => ({ n, kind: 'currency' });
export const num = (n: number): Cell => ({ n, kind: 'number' });
export const pct = (n: number): Cell => ({ n, kind: 'percent' });

export interface ExportColumn {
    header: string;
    align?: 'left' | 'right';
    /** Lebar kolom Excel (satuan karakter). */
    width?: number;
}

/** Identitas usaha untuk kop laporan cetak. Nanti bisa diisi dari Company Profile. */
export interface CompanyInfo {
    name: string;
    address?: string;
    phone?: string;
}

export interface ReportExport {
    /** Judul di dalam file (mis. "Laporan Penjualan"). */
    title: string;
    /** Sub-judul (periode + outlet). */
    subtitle?: string;
    columns: ExportColumn[];
    rows: Cell[][];
    /** Nama file tanpa ekstensi (sudah termasuk rentang tanggal). */
    filenameBase: string;
    /** Index baris data yang perlu ditebalkan (mis. Nett Sales, Total Collected). */
    boldRows?: number[];
    /** Kop usaha untuk header PDF (opsional). */
    company?: CompanyInfo;
}

/** Teks tampilan untuk PDF. */
function cellText(c: Cell): string {
    if (typeof c === 'string') return c;
    if (c.kind === 'currency') return formatRupiah(c.n);
    if (c.kind === 'percent') return formatPct(c.n);
    return formatNumber(c.n);
}

/** Nilai mentah untuk CSV (angka dibiarkan numerik agar terbaca sebagai angka). */
function cellCsv(c: Cell): string | number {
    if (typeof c === 'string') return c;
    if (c.kind === 'percent') return Math.round(c.n * 10) / 10;
    return Math.round(c.n);
}

function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ CSV --- */

export function exportReportCsv(report: ReportExport) {
    // Delimiter ";" agar langsung terbagi kolom di Excel (locale Indonesia).
    const DELIMITER = ';';
    const escape = (v: string | number) => {
        const s = String(v);
        return /["\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    // Kop laporan sebagai baris preamble (kolom A), lalu tabel data.
    const preamble: (string | number)[][] = [];
    if (report.company?.name) preamble.push([report.company.name]);
    const contact = [report.company?.address, report.company?.phone].filter(Boolean).join(' · ');
    if (contact) preamble.push([contact]);
    preamble.push([report.title]);
    if (report.subtitle) preamble.push([report.subtitle]);
    preamble.push([]); // baris kosong

    const headerLine = report.columns.map((c) => c.header);
    const lines = [...preamble, headerLine, ...report.rows.map((r) => r.map(cellCsv))];
    const csv = lines.map((r) => r.map(escape).join(DELIMITER)).join('\r\n');
    // BOM (﻿) supaya karakter non-ASCII terbaca benar di Excel.
    triggerDownload(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }), `${report.filenameBase}.csv`);
}

/* ---------------------------------------------------------------- Excel --- */

type XlsxCell = {
    value: string | number | null;
    type?: typeof String | typeof Number;
    format?: string;
    fontWeight?: 'bold';
    fontSize?: number;
    align?: 'left' | 'right' | 'center';
    alignVertical?: 'top' | 'center' | 'bottom';
    backgroundColor?: string;
    textColor?: string;
    height?: number;
    borderColor?: string;
    borderStyle?: string;
    topBorderColor?: string;
    topBorderStyle?: string;
    bottomBorderColor?: string;
    bottomBorderStyle?: string;
};

/**
 * Signature minimal write-excel-file v4 (mode baris) — hindari friksi overload tipe library.
 * v4 TIDAK mengunduh langsung; ia mengembalikan objek { toBlob() } (di build /browser).
 */
type WriteXlsxFile = (
    rows: XlsxCell[][],
    options?: { columns?: { width?: number }[]; showGridLines?: boolean },
) => Promise<{ toBlob: () => Promise<Blob> }> | { toBlob: () => Promise<Blob> };

export async function exportReportExcel(report: ReportExport) {
    // Subpath /browser: build tanpa dependensi Node (fs/stream), aman untuk Vite.
    const writeXlsxFile = (await import('write-excel-file/browser')).default as unknown as WriteXlsxFile;
    const bold = new Set(report.boldRows ?? []);
    const company = report.company;

    // Currency diberi awalan "Rp" agar jelas mata uang tapi tetap numerik (bisa dijumlah).
    const numberFormat = (kind: CellKind) => (kind === 'percent' ? '0.0"%"' : kind === 'currency' ? '"Rp"\\ #,##0' : '#,##0');

    // === Kop laporan ===
    const preamble: XlsxCell[][] = [];
    if (company?.name) preamble.push([{ value: company.name, type: String, fontWeight: 'bold', fontSize: 16, textColor: BRAND.headerFill }]);
    const contact = [company?.address, company?.phone].filter(Boolean).join('  ·  ');
    if (contact) preamble.push([{ value: contact, type: String, fontSize: 9, textColor: BRAND.subtle }]);
    preamble.push([{ value: report.title, type: String, fontWeight: 'bold', fontSize: 13, textColor: BRAND.headerFill }]);
    if (report.subtitle) preamble.push([{ value: report.subtitle, type: String, fontSize: 10, textColor: BRAND.subtle }]);
    preamble.push([{ value: '', type: String }]); // baris kosong pemisah

    // === Header tabel ===
    const headerRow: XlsxCell[] = report.columns.map((c) => ({
        value: c.header,
        type: String,
        fontWeight: 'bold',
        backgroundColor: BRAND.headerFill,
        textColor: BRAND.headerText,
        align: c.align ?? 'left',
        alignVertical: 'center',
        height: 22,
        borderColor: BRAND.headerFill,
        borderStyle: 'thin',
    }));

    // === Baris data (zebra + baris total ditonjolkan + garis pembatas) ===
    const dataRows: XlsxCell[][] = report.rows.map((row, i) => {
        const isBold = bold.has(i);
        const rowBg = isBold ? BRAND.stripe : i % 2 === 1 ? BRAND.stripeLight : undefined;
        return row.map((cell, col): XlsxCell => {
            const base: XlsxCell = {
                value: null,
                align: report.columns[col]?.align ?? 'left',
                alignVertical: 'center',
                fontWeight: isBold ? 'bold' : undefined,
                backgroundColor: rowBg,
                bottomBorderColor: BRAND.border,
                bottomBorderStyle: 'thin',
                topBorderColor: isBold ? BRAND.boldTop : undefined,
                topBorderStyle: isBold ? 'thin' : undefined,
            };
            if (typeof cell === 'string') return { ...base, value: cell, type: String };
            return {
                ...base,
                value: cell.kind === 'percent' ? Math.round(cell.n * 10) / 10 : Math.round(cell.n),
                type: Number,
                format: numberFormat(cell.kind),
            };
        });
    });

    const data = [...preamble, headerRow, ...dataRows];
    const columns = report.columns.map((c) => ({ width: c.width ?? (c.align === 'right' ? 18 : 30) }));

    // v4: ambil Blob dari objek hasil, lalu unduh via jalur yang sama & terbukti (CSV/PDF).
    // showGridLines:false — pakai border sel sendiri agar tampilan bersih & fokus.
    const workbook = await writeXlsxFile(data, { columns, showGridLines: false });
    triggerDownload(await workbook.toBlob(), `${report.filenameBase}.xlsx`);
}

/* ------------------------------------------------------------------ PDF --- */

export async function exportReportPdf(report: ReportExport) {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
    const bold = new Set(report.boldRows ?? []);

    const landscape = report.columns.length > 5;
    const doc = new jsPDF({ orientation: landscape ? 'landscape' : 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 40;

    const company = report.company ?? { name: 'Posave' };
    const hf = BRAND_RGB.headerFill;
    const sub = BRAND_RGB.subtle;
    const brd = BRAND_RGB.border;
    let y = 46;

    // === Kop usaha ===
    // Nama usaha (kiri) + waktu cetak (kanan).
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(hf[0], hf[1], hf[2]);
    doc.text(company.name, marginX, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(sub[0], sub[1], sub[2]);
    const generated = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    doc.text(`Dicetak: ${generated}`, pageWidth - marginX, y - 3, { align: 'right' });

    // Alamat / telepon usaha (jika tersedia — mis. dari Company Profile nanti).
    const contact = [company.address, company.phone].filter(Boolean).join('  ·  ');
    if (contact) {
        y += 14;
        doc.setFontSize(9);
        doc.text(contact, marginX, y);
    }

    // Garis pemisah kop.
    y += 10;
    doc.setDrawColor(brd[0], brd[1], brd[2]);
    doc.setLineWidth(1);
    doc.line(marginX, y, pageWidth - marginX, y);

    // Judul laporan.
    y += 22;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(hf[0], hf[1], hf[2]);
    doc.text(report.title, marginX, y);

    // Meta: periode + outlet.
    if (report.subtitle) {
        y += 15;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(sub[0], sub[1], sub[2]);
        doc.text(report.subtitle, marginX, y);
    }

    const headerBottom = y;

    const columnStyles: Record<number, { halign: 'left' | 'right' }> = {};
    report.columns.forEach((c, i) => {
        columnStyles[i] = { halign: c.align === 'right' ? 'right' : 'left' };
    });

    autoTable(doc, {
        startY: headerBottom + 14,
        head: [report.columns.map((c) => c.header)],
        body: report.rows.map((r) => r.map(cellText)),
        styles: { fontSize: 9, cellPadding: 5, lineColor: [226, 232, 240], lineWidth: 0.5 },
        headStyles: { fillColor: BRAND_RGB.headerFill, textColor: 255, fontStyle: 'bold', halign: 'left' },
        alternateRowStyles: { fillColor: BRAND_RGB.stripe },
        columnStyles,
        margin: { left: marginX, right: marginX },
        didParseCell: (data) => {
            if (data.section === 'body' && bold.has(data.row.index)) {
                data.cell.styles.fontStyle = 'bold';
            }
        },
        didDrawPage: () => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(sub[0], sub[1], sub[2]);
            doc.text(company.name, marginX, pageHeight - 16);
            doc.text(`Halaman ${doc.getNumberOfPages()}`, pageWidth - marginX, pageHeight - 16, { align: 'right' });
        },
    });

    // Pakai jalur download blob yang sama dengan CSV/Excel — lebih andal daripada
    // doc.save() bawaan jsPDF yang kadang gagal senyap di lingkungan Vite/ESM.
    triggerDownload(doc.output('blob'), `${report.filenameBase}.pdf`);
}

/* ---------------------------------------------------------------- helper -- */

export type ExportFormat = 'csv' | 'excel' | 'pdf';

export function runExport(format: ExportFormat, report: ReportExport): void | Promise<void> {
    if (format === 'excel') return exportReportExcel(report);
    if (format === 'pdf') return exportReportPdf(report);
    return exportReportCsv(report);
}
