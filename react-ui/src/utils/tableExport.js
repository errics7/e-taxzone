// ─────────────────────────────────────────────────────────────────────────────
// src/utils/tableExport.js
//
// Reusable frontend table export utility (CSV / Excel / PDF).
//
// SCOPE / DESIGN NOTE:
//   This utility is intentionally independent from any single Lampiran's
//   business logic. It receives an already-shaped, display-ready `config`
//   object and turns it into a downloadable file. It never fetches data,
//   never talks to the API, and never knows anything about L13A, L9, L10A,
//   etc. — the calling component is responsible for translating its own
//   React state (the same data already rendered in its table) into the
//   generic shape below.
//
// CONFIG SHAPE (shared by exportTableToCSV / exportTableToExcel / exportTableToPDF):
//   {
//     formTitle:    string   // e.g. "CORPORATE INCOME TAX RETURN (SPT TAHUNAN BADAN)"
//     lampiranTitle:string   // e.g. "LAMPIRAN 13-A — LIST OF INVESTMENT FACILITIES"
//     taxYear:      string | number | undefined
//     tin:          string | undefined
//     columns: [
//       {
//         key:      string   // matches a property name on each row object
//         header:   string   // column label
//         group:    string | null  // parent/grouped header label, or null for an ungrouped column
//         align:    'left' | 'right' | 'center' (optional, default 'left')
//         dataType: 'text' | 'number' | 'currency' | 'date' (optional, default 'text')
//       }, ...
//     ],
//     rows: [ { [column.key]: rawValue, ... }, ... ],   // raw values, NOT pre-formatted strings
//     totalsRow: { [column.key]: rawValue, ... } | null | undefined,
//     filename: string  // WITHOUT extension, e.g. "SPT_Badan_Lampiran_13A"
//   }
//
// Consecutive columns that share the same non-null `group` are rendered as a
// single spanning group header (Excel merged cell / PDF colSpan cell). CSV
// has no concept of merged cells, so grouped columns are flattened to
// "Group - Column" in the CSV header row instead.
// ─────────────────────────────────────────────────────────────────────────────

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

// ── Notification helpers ───────────────────────────────────────────────────
// Uses react-hot-toast because it is already a project dependency
// (package.json) — no new notification library is introduced. If a
// <Toaster /> is not mounted somewhere in the app tree, toast() calls are
// silently swallowed by react-hot-toast itself, so we fall back to
// window.alert to guarantee the user is never left without feedback.
const notify = (message) => {
    try {
        if (typeof toast === 'function' || (toast && typeof toast.error === 'function')) {
            toast.error(message);
            return;
        }
    } catch (_err) {
        // fall through to alert fallback below
    }
    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert(message);
    }
};

const notifyNoData = () => notify('There is no data to export.');
const notifyExportError = (formatLabel) => notify(`Failed to export ${formatLabel}. Please try again.`);

// ── Generic value helpers ──────────────────────────────────────────────────
const sanitize = (value) => (value === null || value === undefined ? '' : value);

const formatRupiahNumber = (value) => new Intl.NumberFormat('id-ID').format(Number(value) || 0);

// Accounting-style Rupiah display: "-Rp125.000" style sign placement,
// consistent with the formatCurrencyDisplay convention already used across
// the Lampiran components (L13A, L10A, etc.).
const formatCurrencyValue = (value) => {
    const num = Number(value) || 0;
    const sign = num < 0 ? '-' : '';
    return `${sign}Rp${formatRupiahNumber(Math.abs(num))}`;
};

const TABLE_DATE_MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formatDateValue = (isoDate) => {
    if (!isoDate) return '';
    const parts = String(isoDate).split('-');
    if (parts.length !== 3) return String(isoDate);
    const [year, month, day] = parts;
    const monthIndex = parseInt(month, 10) - 1;
    if (!year || !day || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return String(isoDate);
    return `${String(day).padStart(2, '0')}-${TABLE_DATE_MONTH_ABBR[monthIndex]}-${year}`;
};

// Produces the display string for a cell, used by CSV and PDF (both are
// text-only formats). Excel keeps numeric types as real numbers instead —
// see exportTableToExcel.
const formatDisplayValue = (rawValue, dataType) => {
    const value = sanitize(rawValue);
    if (value === '') return '';
    switch (dataType) {
        case 'currency':
            return formatCurrencyValue(value);
        case 'number':
            return formatRupiahNumber(value);
        case 'date':
            return formatDateValue(value);
        default:
            return String(value);
    }
};

const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Groups consecutive columns sharing the same non-null `group` value.
// Returns an ordered list of { label, span, group } segments covering every
// column exactly once (ungrouped columns get span = 1, group = null).
const buildHeaderSegments = (columns) => {
    const segments = [];
    let i = 0;
    while (i < columns.length) {
        const col = columns[i];
        if (col.group) {
            let span = 1;
            while (i + span < columns.length && columns[i + span].group === col.group) span += 1;
            segments.push({ label: col.group, span, grouped: true });
            i += span;
        } else {
            segments.push({ label: col.header, span: 1, grouped: false });
            i += 1;
        }
    }
    return segments;
};

const sheetNameFromFilename = (filename) => {
    const clean = String(filename || 'Sheet1').replace(/[:\\/?*[\]]/g, ' ').trim();
    return clean.slice(0, 31) || 'Sheet1';
};

// ─────────────────────────────────────────────────────────────────────────────
// CSV
// ─────────────────────────────────────────────────────────────────────────────
export const exportTableToCSV = (config) => {
    const { formTitle, lampiranTitle, taxYear, tin, columns, rows, totalsRow, filename } = config || {};
    try {
        if (!rows || rows.length === 0) {
            notifyNoData();
            return;
        }

        const escapeCSV = (value) => {
            const str = String(sanitize(value));
            if (/[",\r\n]/.test(str)) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const lines = [];
        if (formTitle) lines.push(escapeCSV(formTitle));
        if (lampiranTitle) lines.push(escapeCSV(lampiranTitle));
        if (taxYear !== undefined && taxYear !== null && taxYear !== '') lines.push(escapeCSV(`Tax Year: ${taxYear}`));
        if (tin) lines.push(escapeCSV(`TIN: ${tin}`));
        lines.push('');

        // CSV has no merged cells, so a grouped column is flattened to
        // "Group - Column" to preserve the header's identity.
        const headerLine = columns.map((col) => escapeCSV(col.group ? `${col.group} - ${col.header}` : col.header)).join(',');
        lines.push(headerLine);

        rows.forEach((row) => {
            const line = columns.map((col) => escapeCSV(formatDisplayValue(row[col.key], col.dataType))).join(',');
            lines.push(line);
        });

        if (totalsRow) {
            const line = columns.map((col) => escapeCSV(formatDisplayValue(totalsRow[col.key], col.dataType))).join(',');
            lines.push(line);
        }

        // UTF-8 BOM so Excel / other spreadsheet apps open Indonesian
        // characters and the "Rp" currency prefix correctly.
        const csvContent = lines.join('\r\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, `${filename}.csv`);
    } catch (err) {
        console.error('[tableExport] CSV export failed:', err);
        notifyExportError('CSV');
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// EXCEL (.xlsx)
// ─────────────────────────────────────────────────────────────────────────────
export const exportTableToExcel = (config) => {
    const { formTitle, lampiranTitle, taxYear, tin, columns, rows, totalsRow, filename } = config || {};
    try {
        if (!rows || rows.length === 0) {
            notifyNoData();
            return;
        }

        const colCount = columns.length;
        const segments = buildHeaderSegments(columns);

        const aoa = [];
        const identityRows = [];
        if (formTitle) identityRows.push(formTitle);
        if (lampiranTitle) identityRows.push(lampiranTitle);
        if (taxYear !== undefined && taxYear !== null && taxYear !== '') identityRows.push(`Tax Year: ${taxYear}`);
        if (tin) identityRows.push(`TIN: ${tin}`);
        identityRows.forEach((text) => aoa.push([text]));
        aoa.push([]); // blank separator row

        const groupHeaderRowIndex = aoa.length;
        const labelHeaderRowIndex = aoa.length + 1;

        // Row 1: group labels (spanning) / ungrouped column labels (row-spanning).
        const groupRowValues = [];
        segments.forEach((seg) => {
            groupRowValues.push(seg.label);
            for (let k = 1; k < seg.span; k += 1) groupRowValues.push('');
        });
        aoa.push(groupRowValues);

        // Row 2: individual column labels (blank under row-spanned ungrouped columns).
        const labelRowValues = [];
        columns.forEach((col) => labelRowValues.push(col.group ? col.header : ''));
        aoa.push(labelRowValues);

        const toCellValue = (rawValue, dataType) => {
            const value = sanitize(rawValue);
            if (value === '') return '';
            if (dataType === 'number' || dataType === 'currency') return Number(value) || 0;
            if (dataType === 'date') return formatDateValue(value);
            return String(value);
        };

        rows.forEach((row) => {
            aoa.push(columns.map((col) => toCellValue(row[col.key], col.dataType)));
        });

        if (totalsRow) {
            aoa.push(columns.map((col) => toCellValue(totalsRow[col.key], col.dataType)));
        }

        const ws = XLSX.utils.aoa_to_sheet(aoa);

        // ── Merges ──
        const merges = [];
        // Title/identity rows span the full table width.
        for (let r = 0; r < identityRows.length; r += 1) {
            merges.push({ s: { r, c: 0 }, e: { r, c: colCount - 1 } });
        }
        // Grouped/ungrouped header merges.
        let colCursor = 0;
        segments.forEach((seg) => {
            if (seg.grouped) {
                merges.push({ s: { r: groupHeaderRowIndex, c: colCursor }, e: { r: groupHeaderRowIndex, c: colCursor + seg.span - 1 } });
            } else {
                merges.push({ s: { r: groupHeaderRowIndex, c: colCursor }, e: { r: labelHeaderRowIndex, c: colCursor } });
            }
            colCursor += seg.span;
        });
        ws['!merges'] = merges;

        // ── Column widths ──
        ws['!cols'] = columns.map((col) => ({ wch: Math.max(12, String(col.header || '').length + 2) }));

        // Best-effort freeze of the header rows so they stay visible while
        // scrolling. Community builds of the `xlsx` package do not
        // guarantee this is honored on write — see deliverable report.
        ws['!freeze'] = { xSplit: 0, ySplit: labelHeaderRowIndex + 1 };

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetNameFromFilename(filename));
        XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (err) {
        console.error('[tableExport] Excel export failed:', err);
        notifyExportError('Excel');
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PDF
// ─────────────────────────────────────────────────────────────────────────────
export const exportTableToPDF = (config) => {
    const { formTitle, lampiranTitle, taxYear, tin, columns, rows, totalsRow, filename } = config || {};
    try {
        if (!rows || rows.length === 0) {
            notifyNoData();
            return;
        }

        // Wide tables (many columns) read better in landscape.
        const orientation = columns.length > 9 ? 'landscape' : 'portrait';
        const doc = new jsPDF({ orientation, unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        let cursorY = 36;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        if (formTitle) {
            doc.text(formTitle, pageWidth / 2, cursorY, { align: 'center' });
            cursorY += 15;
        }
        if (lampiranTitle) {
            doc.setFontSize(10);
            doc.text(lampiranTitle, pageWidth / 2, cursorY, { align: 'center' });
            cursorY += 15;
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        if (taxYear !== undefined && taxYear !== null && taxYear !== '') {
            doc.text(`Tax Year: ${taxYear}`, 30, cursorY);
            cursorY += 12;
        }
        if (tin) {
            doc.text(`TIN: ${tin}`, 30, cursorY);
            cursorY += 12;
        }
        cursorY += 4;

        const segments = buildHeaderSegments(columns);

        // Header row 1 — group cells (colSpan) or ungrouped labels (rowSpan 2).
        const headRow1 = segments.map((seg) => (
            seg.grouped
                ? { content: seg.label, colSpan: seg.span, styles: { halign: 'center' } }
                : { content: seg.label, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }
        ));

        // Header row 2 — only grouped columns contribute a cell; row-spanned
        // ungrouped columns already occupy that slot from row 1.
        const headRow2 = [];
        columns.forEach((col) => {
            if (col.group) headRow2.push(col.header);
        });
        const head = headRow2.length > 0 ? [headRow1, headRow2] : [headRow1];

        const body = rows.map((row) => columns.map((col) => formatDisplayValue(row[col.key], col.dataType)));
        const foot = totalsRow ? [columns.map((col) => formatDisplayValue(totalsRow[col.key], col.dataType))] : undefined;

        const columnStyles = {};
        columns.forEach((col, idx) => {
            columnStyles[idx] = { halign: col.align === 'right' ? 'right' : col.align === 'center' ? 'center' : 'left' };
        });

        autoTable(doc, {
            startY: cursorY,
            head,
            body,
            foot,
            theme: 'grid',
            styles: { fontSize: 7, cellPadding: 3, overflow: 'linebreak', lineColor: [200, 200, 200], lineWidth: 0.5 },
            headStyles: { fillColor: [250, 204, 21], textColor: [30, 41, 59], fontStyle: 'bold', fontSize: 7 },
            footStyles: { fillColor: [243, 244, 246], textColor: [30, 41, 59], fontStyle: 'bold', fontSize: 7 },
            columnStyles,
            margin: { top: 24, left: 20, right: 20, bottom: 24 },
            showHead: 'everyPage', // repeats the (grouped) header on every page
            showFoot: 'lastPage',
        });

        doc.save(`${filename}.pdf`);
    } catch (err) {
        console.error('[tableExport] PDF export failed:', err);
        notifyExportError('PDF');
    }
};
