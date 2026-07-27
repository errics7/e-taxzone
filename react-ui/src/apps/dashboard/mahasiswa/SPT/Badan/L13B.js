import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Add, Edit, Delete, CalendarToday, Close } from '@mui/icons-material';

// ─────────────────────────────────────────────────────────────────────────────
// L13B — Daftar Tambahan Pengurangan Penghasilan Bruto
// (Additional Gross Income Deduction — Vocational §A/B & R&D §C/D)
//
// Source of Truth: l13bData (nested object per section — Pendekatan B, pola
// identik l9Data/l10bData di SptTahunanBadan.js). Initial state SELALU
// buildInitialL13BData() sehingga struktur penuh terjamin (Blueprint L13B).
//
// Section A — CRUD modal, satu modal = satu row (vocational agreement).
// Section B — kategori FIXED, tidak ada Add — hanya Edit nominal (amount).
// Section C — CRUD modal, satu modal = satu row (R&D), field hasil readonly
//             dengan formula simulasi (lihat computeAdditionalDeduction).
// Section D — Readonly Summary — Σ Section C, TIDAK PERNAH dipersist
//             (Save Draft Contract: hanya raw input).
//
// L13B REVISION (FOLLOW L13A AS BASELINE) — perubahan UI/UX murni, TIDAK ADA
// perubahan business rule/data structure/callback:
//   1. Table UI (header multi-level + white separator + kuning, body grid tipis
//      abu-abu #E5E7EB) mengikuti L13A persis.
//   2. Date Field: satu ikon kalender saja (native browser icon disembunyikan),
//      pola identik L13A (`l13b-date-input` + DATE_INPUT_HIDE_NATIVE_ICON_CSS).
//   3. Cost Period — From/To Year & IP Right/Commercialization Year kini pakai
//      YearPickerField (tidak bisa diketik manual), pola identik L13A.
//   4. Validasi From/To Year: To Year hanya boleh >= From Year; mengganti From
//      Year yang membuat To Year lama tidak valid akan mereset To Year ke
//      kosong (TIDAK auto-diisi ke From Year baru — user wajib memilih ulang).
//      IP Right/Commercialization Year tetap independen, tanpa validasi silang.
//   5. Section A & C: multi-level header (Action/No. rowSpan, group header
//      colSpan) mengikuti struktur Coretax & gaya L13A.
//   6. Section B: business logic TIDAK berubah (fixed master rows, tanpa Add,
//      tanpa Delete, Edit hanya nominal) — hanya tampilan header/border/
//      alignment/spacing disamakan dengan L13A.
//   7. Section D: TIDAK diubah jadi tabel, formula & helper caption tetap sama.
// ─────────────────────────────────────────────────────────────────────────────

// ── HELPER — Formatter & Parser Rupiah (pola identik L10A.js/L13A.js) ─────────
const formatRupiahDisplay = (value) => new Intl.NumberFormat('id-ID').format(value || 0);
const parseRupiahInput = (str) => parseFloat(String(str).replace(/[.,]/g, '')) || 0;

// ── HELPER — Currency Display Formatter (ACCOUNTING FORMAT, pola identik L13A.js) ─
// Tanda minus SELALU di depan "Rp" untuk nilai negatif (mis. "-Rp125.000"),
// bukan "Rp-125.000". Tidak mengubah logika kalkulasi apa pun — murni
// perbaikan format tampilan pada table values/computed values/totals.
const formatCurrencyDisplay = (value) => {
    const num = Number(value) || 0;
    const sign = num < 0 ? '-' : '';
    return `${sign}Rp${formatRupiahDisplay(Math.abs(num))}`;
};

// ── HELPER — Table Date Display Formatter (DISPLAY ONLY, pola identik L13A.js) ─
// Value tersimpan TETAP ISO date string — formatter ini hanya untuk tampilan
// tabel, TIDAK PERNAH menulis balik ke state/draft.
const TABLE_DATE_MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formatTableDate = (isoDate) => {
    if (!isoDate) return '';
    const parts = String(isoDate).split('-');
    if (parts.length !== 3) return isoDate;
    const [year, month, day] = parts;
    const monthIndex = parseInt(month, 10) - 1;
    if (!year || !day || isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return isoDate;
    return `${day.padStart(2, '0')}-${TABLE_DATE_MONTH_ABBR[monthIndex]}-${year}`;
};

// ── HELPER — Row identifier (frontend-only) ────────────────────────────────────
const generateRowId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// ── REFERENCE DATA — Section C Facility Percentage (dropdown, bukan business
// rule fix — Simulation Formula Temporary, siap diganti reference resmi Coretax)
const FACILITY_PERCENTAGE_OPTIONS = [200, 175, 150, 125, 100, 75, 50, 25];

// ── SECTION B — Kategori FIXED (Blueprint: "Kategori sudah fixed. User hanya
// dapat Edit nominal. Description readonly.") — pola identik reference roster
// L1A/L1C/L1D (fixed list, bukan hardcode business rule, siap diganti reference
// data module project bila tersedia).
const SECTION_B_CATEGORIES = [
    { id: 'sb-1', description: 'Cost of providing special physical facilities such as workshops or similar training venues related to work practice and/or apprenticeship' },
    { id: 'sb-2', description: 'Cost of instructors or teachers as work practice, apprenticeship, and/or learning supervisors' },
    { id: 'sb-3', description: 'Goods and/or materials for the purposes of work practice, apprenticeship, and/or learning activities' },
    { id: 'sb-4', description: 'Honorarium or similar payments given to work practice and/or apprenticeship participants' },
    { id: 'sb-5', description: 'Certification costs and electricity, water, and fuel costs for work practice and/or apprenticeship activities' },
];

// ─────────────────────────────────────────────────────────────────────────────
// buildInitialL13BData / mergeWithInitial — pola identik buildInitialL10BData/
// mergeL10BWithInitial (diimpor SptTahunanBadan.js). Diekspor agar SptTahunanBadan
// dapat menerapkan Draft Compatibility Contract yang sama seperti L10B.
//
// sectionD DITAMBAHKAN (Blueprint L13B — Part D Business Rule): HANYA
// menyimpan raw input No.2/No.4/No.5 (manual input). No.1/No.3/No.6 TIDAK
// PERNAH disimpan — selalu derived (No.1 dari Σ Section C, No.3 = No.1−No.2,
// No.6 = No.3−No.5), dihitung ulang setiap render/Load Draft (Recalculate
// Contract). Penambahan sectionD bersifat ADDITIVE — draft lama tanpa key
// sectionD tetap kompatibel (fallback ke default 0 di mergeWithInitial).
// ─────────────────────────────────────────────────────────────────────────────
const buildEmptySectionD = () => ({ row2: 0, row4: 0, row5: 0 });

export const buildInitialL13BData = () => ({
    sectionA: [], // array of { id, agreementNumber, agreementDate, partner, description }
    sectionB: SECTION_B_CATEGORIES.map((c) => ({ id: c.id, description: c.description, amount: 0 })),
    sectionC: [], // array of { id, proposalNumber, periodFrom, periodTo, costAmount, facilityPercentage, ipYear }
    sectionD: buildEmptySectionD(), // { row2, row4, row5 } — raw input, No.1/3/6 derived
});

// additionalGrossIncomeDeduction SELALU derived — tidak pernah dibaca dari
// draft, selalu dihitung ulang dari costAmount & facilityPercentage
// (Blueprint L13B §Section C — "Recalculate ketika Cost Amount / Facility
// Percentage berubah", LOAD DRAFT §Recalculate). TIDAK BERUBAH.
const computeAdditionalDeduction = (row) => (Number(row.costAmount) || 0) * ((Number(row.facilityPercentage) || 0) / 100);

export const mergeWithInitial = (data) => {
    const initial = buildInitialL13BData();
    if (!data || typeof data !== 'object') return initial;

    const sectionA = Array.isArray(data.sectionA) ? data.sectionA : initial.sectionA;

    // Section B: struktur kategori SELALU mengikuti SECTION_B_CATEGORIES
    // (fixed roster) — hanya `amount` yang diambil dari draft, mencegah
    // kategori usang/hilang apabila roster berubah di kemudian hari.
    const draftSectionBById = new Map((Array.isArray(data.sectionB) ? data.sectionB : []).map((r) => [r.id, r]));
    const sectionB = SECTION_B_CATEGORIES.map((c) => ({
        id: c.id,
        description: c.description,
        amount: Number(draftSectionBById.get(c.id)?.amount) || 0,
    }));

    // Section C: raw fields dipertahankan, additionalGrossIncomeDeduction
    // SELALU dihitung ulang (bukan dibaca dari draft) — Recalculate Contract.
    const sectionC = (Array.isArray(data.sectionC) ? data.sectionC : []).map((row) => ({
        id: row.id,
        proposalNumber: row.proposalNumber || '',
        periodFrom: row.periodFrom || '',
        periodTo: row.periodTo || '',
        costAmount: Number(row.costAmount) || 0,
        facilityPercentage: row.facilityPercentage || '',
        ipYear: row.ipYear || '',
        additionalGrossIncomeDeduction: computeAdditionalDeduction(row),
    }));

    // Section D: HANYA row2/row4/row5 (raw input manual) — draft lama tanpa
    // key sectionD otomatis fallback ke buildEmptySectionD() (Draft
    // Compatibility Contract, pola identik sectionB fallback di atas).
    const sectionD = {
        row2: Number(data.sectionD?.row2) || 0,
        row4: Number(data.sectionD?.row4) || 0,
        row5: Number(data.sectionD?.row5) || 0,
    };

    return { sectionA, sectionB, sectionC, sectionD };
};

// ── HelperCaption — Standar caption "ⓘ Calculation: ..." (Global UI Contract
// Phase 2 §Helper Caption Standard, pola identik L13A.js) — grey, ditempatkan
// tepat di bawah field readonly, Bahasa Inggris.
const HelperCaption = ({ formula }) => (
    <p className="text-xs text-gray-400 mt-1">ⓘ Calculation: {formula}</p>
);

// ─────────────────────────────────────────────────────────────────────────────
// SectionDRow — satu baris Section D (No.1–No.6). Untuk baris readOnly
// (derived: No.1/No.3/No.6), nilai ditampilkan lewat shared formatter
// `formatCurrencyDisplay` (accounting format, "-Rp123.456" bukan "Rp-123.456")
// dengan warna TEKS merah saat negatif — TANPA background khusus, TANPA ikon
// peringatan (Blueprint §2 Negative Value Display). Untuk baris editable
// (raw input: No.2/No.4/No.5), tetap pola Rp. prefix + input biasa.
// ─────────────────────────────────────────────────────────────────────────────
const SectionDRow = ({ number, label, value, onChange, readOnly, helper }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{number}. {label}</label>
        {readOnly ? (
            <div className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-right bg-gray-100 min-h-[36px] ${Number(value) < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                {formatCurrencyDisplay(value)}
            </div>
        ) : (
            <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-100 text-gray-500 text-sm">Rp.</span>
                <input type="text" inputMode="numeric" value={value ? formatRupiahDisplay(value) : ''}
                    onChange={(e) => onChange(parseRupiahInput(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg text-sm text-left focus:ring-2 focus:ring-blue-500" />
            </div>
        )}
        {helper && <HelperCaption formula={helper} />}
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ReadonlyField — pola identik L1D.js / L10A.js / L13A.js
// ─────────────────────────────────────────────────────────────────────────────
const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DateField — Date Input + Calendar Button (biru) + Clear Date Button (merah).
// SATU icon kalender saja — indikator kalender bawaan browser pada
// <input type="date"> disembunyikan via CSS scoped class `l13b-date-input`
// (lihat DATE_INPUT_HIDE_NATIVE_ICON_CSS), pola identik L13A.js. Internal Data
// Representation tetap ISO date string — hanya tampilan ikon bawaan browser
// yang disembunyikan, tidak ada perubahan business rule/struktur data.
// ─────────────────────────────────────────────────────────────────────────────
const DateField = ({ label, value, onChange }) => {
    const inputRef = useRef(null);
    const openPicker = () => {
        if (inputRef.current?.showPicker) {
            try { inputRef.current.showPicker(); } catch (e) { inputRef.current.focus(); }
        } else {
            inputRef.current?.focus();
        }
    };
    return (
        <div>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
            <div className="flex items-stretch gap-1.5">
                <input
                    ref={inputRef}
                    type="date"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="l13b-date-input flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={openPicker} title="Open Calendar"
                    className="w-9 flex items-center justify-center rounded-lg bg-blue-900 hover:bg-blue-800 text-white flex-shrink-0">
                    <CalendarToday style={{ fontSize: 16 }} />
                </button>
                <button type="button" onClick={() => onChange('')} title="Clear Date"
                    className="w-9 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white flex-shrink-0">
                    <Close style={{ fontSize: 16 }} />
                </button>
            </div>
        </div>
    );
};

// Style global untuk menyembunyikan icon kalender bawaan browser pada
// <input type="date"> — dirender sekali oleh masing-masing modal saat terbuka
// (pola identik L13A.js).
const DATE_INPUT_HIDE_NATIVE_ICON_CSS = `
.l13b-date-input::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }
.l13b-date-input::-webkit-inner-spin-button { display: none; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// YearPickerField — Year Picker (bukan Date Picker penuh), pola identik L13A.js.
// User TIDAK BOLEH mengetik tahun secara manual — input readOnly, satu-satunya
// cara mengisi nilai adalah mengklik tombol Calendar lalu memilih salah satu
// tahun pada panel grid 12 tahun (dengan navigasi ‹ › antar rentang).
//
// Prop opsional `minYear`: jika diisi, tahun < minYear ditampilkan namun
// DISABLED (tidak bisa diklik) — dipakai untuk validasi "To Year >= From Year"
// pada Section C (Blueprint L13B Revision §4). Ketika minYear tidak diberikan
// (mis. From Year / IP Right Year), seluruh tahun tetap dapat dipilih bebas.
// ─────────────────────────────────────────────────────────────────────────────
const YearPickerField = ({ value, onChange, minYear }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const currentYear = new Date().getFullYear();
    const [rangeStart, setRangeStart] = useState(() => {
        const parsed = parseInt(value, 10);
        const base = !isNaN(parsed) ? parsed : currentYear;
        return base - (base % 12) - 5;
    });

    useEffect(() => {
        // Reset rentang halaman ke sekitar nilai terpilih setiap kali popover dibuka.
        if (open) {
            const parsed = parseInt(value, 10);
            const base = !isNaN(parsed) ? parsed : currentYear;
            setRangeStart(base - (base % 12) - 5);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const years = Array.from({ length: 12 }, (_, i) => rangeStart + i);
    const hasMin = minYear !== undefined && minYear !== null && minYear !== '' && !isNaN(Number(minYear));

    return (
        <div className="relative" ref={containerRef}>
            <div className="flex items-stretch gap-1.5">
                <input
                    type="text"
                    readOnly
                    value={value || ''}
                    placeholder="Select Year"
                    onClick={() => setOpen((o) => !o)}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm text-left bg-white cursor-pointer focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => setOpen((o) => !o)} title="Select Year"
                    className="w-9 flex items-center justify-center rounded-lg bg-blue-900 hover:bg-blue-800 text-white flex-shrink-0">
                    <CalendarToday style={{ fontSize: 16 }} />
                </button>
                <button type="button" onClick={() => { onChange(''); setOpen(false); }} title="Clear Year"
                    className="w-9 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white flex-shrink-0">
                    <Close style={{ fontSize: 16 }} />
                </button>
            </div>
            {open && (
                <div className="absolute z-30 mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                        <button type="button" onClick={() => setRangeStart((r) => r - 12)}
                            className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded">‹</button>
                        <span className="text-xs font-semibold text-gray-600">{years[0]} – {years[years.length - 1]}</span>
                        <button type="button" onClick={() => setRangeStart((r) => r + 12)}
                            className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded">›</button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                        {years.map((y) => {
                            const disabled = hasMin && y < Number(minYear);
                            return (
                                <button key={y} type="button" disabled={disabled}
                                    onClick={() => { if (!disabled) { onChange(String(y)); setOpen(false); } }}
                                    className={`px-2 py-1.5 text-sm rounded transition-colors ${
                                        disabled
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : String(y) === String(value) ? 'bg-blue-900 text-white' : 'hover:bg-blue-50 text-gray-700'
                                    }`}>
                                    {y}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION A — Cooperation Agreement (CRUD modal). Modal spacing/typography
// disamakan dengan L13A (bordered box per group, space-y-6 pada body modal).
// ─────────────────────────────────────────────────────────────────────────────
const buildEmptySectionAForm = () => ({ agreementNumber: '', agreementDate: '', partner: '', description: '' });

const SectionAModal = ({ mode, formData, onFieldChange, onSave, onClose }) => {
    if (!mode) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <style>{DATE_INPUT_HIDE_NATIVE_ICON_CSS}</style>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800">Cooperation Agreement</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>
                <div className="px-6 py-5 space-y-6 overflow-y-auto">
                    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Agreement Number</label>
                            <input type="text" value={formData.agreementNumber}
                                onChange={(e) => onFieldChange('agreementNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <DateField label="Agreement Date" value={formData.agreementDate} onChange={(v) => onFieldChange('agreementDate', v)} />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Partner</label>
                            <input type="text" value={formData.partner}
                                onChange={(e) => onFieldChange('partner', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                            <textarea rows={3} value={formData.description}
                                onChange={(e) => onFieldChange('description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">Close</button>
                    <button onClick={onSave} className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION C — R&D Cost (CRUD modal, formula simulasi). Cost Period From/To &
// IP Right/Commercialization Year kini pakai YearPickerField (Blueprint L13B
// Revision §2/§3/§4).
// ─────────────────────────────────────────────────────────────────────────────
const buildEmptySectionCForm = () => ({ proposalNumber: '', periodFrom: '', periodTo: '', costAmount: 0, facilityPercentage: '', ipYear: '' });

const SectionCModal = ({ mode, formData, onFieldChange, onSave, onClose }) => {
    if (!mode) return null;
    const preview = computeAdditionalDeduction(formData);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <style>{DATE_INPUT_HIDE_NATIVE_ICON_CSS}</style>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800">Research &amp; Development Cost</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>
                <div className="px-6 py-5 space-y-6 overflow-y-auto">
                    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Proposal Number</label>
                            <input type="text" value={formData.proposalNumber}
                                onChange={(e) => onFieldChange('proposalNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cost Period — From Year</label>
                                <YearPickerField value={formData.periodFrom}
                                    onChange={(v) => onFieldChange('periodFrom', v)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cost Period — To Year</label>
                                <YearPickerField value={formData.periodTo} minYear={formData.periodFrom}
                                    onChange={(v) => onFieldChange('periodTo', v)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cost Amount</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-100 text-gray-500 text-sm">Rp.</span>
                                <input type="text" inputMode="numeric" value={formData.costAmount ? formatRupiahDisplay(formData.costAmount) : ''}
                                    onChange={(e) => onFieldChange('costAmount', parseRupiahInput(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg text-sm text-left focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Facility Percentage</label>
                            <select value={formData.facilityPercentage}
                                onChange={(e) => onFieldChange('facilityPercentage', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500">
                                <option value="">Please Select</option>
                                {FACILITY_PERCENTAGE_OPTIONS.map((v) => <option key={v} value={v}>{v}%</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">IP Right / Commercialization Year</label>
                            <YearPickerField value={formData.ipYear}
                                onChange={(v) => onFieldChange('ipYear', v)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Gross Income Deduction</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-200 text-gray-500 text-sm">{preview < 0 ? '-' : ''}Rp.</span>
                                <input type="text" readOnly value={formatRupiahDisplay(Math.abs(preview))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-r-lg text-sm text-left bg-gray-100 text-gray-600" />
                            </div>
                            <HelperCaption formula="Cost Amount × Facility Percentage" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">Close</button>
                    <button onClick={onSave} className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmDialog = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-2">Delete Confirmation</h3>
                <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this data?</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// L13B — Main Component
// Props: taxYear, tin, showPartB (vocational §A/B), showPartD (R&D §C/D),
// data (l13bData), onDataChange — TIDAK BERUBAH (pola identik L10B, nested
// object, no CRUD state lifted to parent; hanya `data` yang naik ke
// SptTahunanBadan.js). Callback names & payload structure tetap sama persis.
// ─────────────────────────────────────────────────────────────────────────────
const L13B = ({ taxYear, tin, showPartB, showPartD, data, onDataChange, onSectionBTotalChange, onSectionDRow5Change }) => {
    const safeData = data || buildInitialL13BData();

    // ── Section A modal state ──────────────────────────────────────────────
    const [modalAMode, setModalAMode] = useState(null);
    const [selectedARowId, setSelectedARowId] = useState(null);
    const [formA, setFormA] = useState(buildEmptySectionAForm());

    // ── Section C modal state ──────────────────────────────────────────────
    const [modalCMode, setModalCMode] = useState(null);
    const [selectedCRowId, setSelectedCRowId] = useState(null);
    const [formC, setFormC] = useState(buildEmptySectionCForm());

    const [pendingDelete, setPendingDelete] = useState(null); // { section: 'A'|'C', id }

    // ── Section A handlers ──────────────────────────────────────────────────
    const handleOpenAddA = useCallback(() => {
        setModalAMode('create'); setSelectedARowId(null); setFormA(buildEmptySectionAForm());
    }, []);
    const handleOpenEditA = useCallback((row) => {
        setModalAMode('edit'); setSelectedARowId(row.id); setFormA({ ...buildEmptySectionAForm(), ...row });
    }, []);
    const handleCloseModalA = useCallback(() => { setModalAMode(null); setSelectedARowId(null); setFormA(buildEmptySectionAForm()); }, []);
    const handleFieldChangeA = useCallback((field, value) => setFormA((prev) => ({ ...prev, [field]: value })), []);
    const handleSaveA = useCallback(() => {
        const sectionA = safeData.sectionA || [];
        if (modalAMode === 'create') {
            onDataChange({ ...safeData, sectionA: [...sectionA, { id: generateRowId('l13b-a'), ...formA }] });
        } else if (modalAMode === 'edit') {
            onDataChange({ ...safeData, sectionA: sectionA.map((r) => (r.id === selectedARowId ? { ...formA, id: selectedARowId } : r)) });
        }
        handleCloseModalA();
    }, [formA, modalAMode, selectedARowId, safeData, onDataChange, handleCloseModalA]);

    // ── Section B handlers (Edit nominal saja, tanpa modal — inline input) ──
    // TIDAK BERUBAH: tanpa Add, tanpa Delete, kategori fixed.
    const handleSectionBAmountChange = useCallback((rowId, value) => {
        const sectionB = (safeData.sectionB || []).map((r) => (r.id === rowId ? { ...r, amount: value } : r));
        onDataChange({ ...safeData, sectionB });
    }, [safeData, onDataChange]);

    // ── Section C handlers ──────────────────────────────────────────────────
    const handleOpenAddC = useCallback(() => {
        setModalCMode('create'); setSelectedCRowId(null); setFormC(buildEmptySectionCForm());
    }, []);
    const handleOpenEditC = useCallback((row) => {
        setModalCMode('edit'); setSelectedCRowId(row.id); setFormC({ ...buildEmptySectionCForm(), ...row });
    }, []);
    const handleCloseModalC = useCallback(() => { setModalCMode(null); setSelectedCRowId(null); setFormC(buildEmptySectionCForm()); }, []);

    // Year Validation (Blueprint L13B Revision §4): mengubah From Year yang
    // membuat To Year lama < From Year baru akan mereset To Year ke kosong —
    // TIDAK auto-diisi ke From Year baru, user wajib memilih ulang secara
    // eksplisit. IP Right/Commercialization Year sepenuhnya independen, tidak
    // divalidasi terhadap Cost Period sama sekali.
    const handleFieldChangeC = useCallback((field, value) => {
        setFormC((prev) => {
            if (field === 'periodFrom') {
                const fromNum = parseInt(value, 10);
                const toNum = parseInt(prev.periodTo, 10);
                if (prev.periodTo && !isNaN(fromNum) && !isNaN(toNum) && toNum < fromNum) {
                    return { ...prev, periodFrom: value, periodTo: '' };
                }
                return { ...prev, periodFrom: value };
            }
            return { ...prev, [field]: value };
        });
    }, []);

    const handleSaveC = useCallback(() => {
        const sectionC = safeData.sectionC || [];
        const withDerived = { ...formC, additionalGrossIncomeDeduction: computeAdditionalDeduction(formC) };
        if (modalCMode === 'create') {
            onDataChange({ ...safeData, sectionC: [...sectionC, { id: generateRowId('l13b-c'), ...withDerived }] });
        } else if (modalCMode === 'edit') {
            onDataChange({ ...safeData, sectionC: sectionC.map((r) => (r.id === selectedCRowId ? { ...withDerived, id: selectedCRowId } : r)) });
        }
        handleCloseModalC();
    }, [formC, modalCMode, selectedCRowId, safeData, onDataChange, handleCloseModalC]);

    // ── Delete flow (Section A / C) — selalu lewat Confirmation Dialog ─────
    const handleRequestDelete = useCallback((section, id) => setPendingDelete({ section, id }), []);
    const handleCancelDelete = useCallback(() => setPendingDelete(null), []);
    const handleConfirmDelete = useCallback(() => {
        if (!pendingDelete) return;
        if (pendingDelete.section === 'A') {
            onDataChange({ ...safeData, sectionA: (safeData.sectionA || []).filter((r) => r.id !== pendingDelete.id) });
        } else if (pendingDelete.section === 'C') {
            onDataChange({ ...safeData, sectionC: (safeData.sectionC || []).filter((r) => r.id !== pendingDelete.id) });
        }
        setPendingDelete(null);
    }, [pendingDelete, safeData, onDataChange]);

    // ── Section D — 6 Baris (Blueprint Part D Business Rule) ───────────────────
    // No.1 — Total Additional Gross Income Deduction dari Section C. Otomatis,
    // readonly, derived (Σ Section C) — TIDAK PERNAH dipersist.
    const sectionDRow1 = useMemo(
        () => (safeData.sectionC || []).reduce((sum, row) => sum + computeAdditionalDeduction(row), 0),
        [safeData.sectionC]
    );
    // Alias lama dipertahankan (dipakai juga oleh Section C table footer di atas) —
    // nilai identik dengan sectionDRow1, TIDAK ada perhitungan ganda.
    const totalAdditionalDeduction = sectionDRow1;

    const sectionD = safeData.sectionD || buildEmptySectionD();
    // No.2 — manual input (raw, dipersist). No.3 = No.1 − No.2, readonly, derived.
    const sectionDRow3 = sectionDRow1 - (Number(sectionD.row2) || 0);
    // No.4 — manual input SEMENTARA (raw, dipersist; kelak otomatis saat formula
    // resmi DJP tersedia). No.5 — manual input SEMENTARA (raw, dipersist).
    // No.6 = No.3 − No.5, readonly, derived.
    const sectionDRow6 = sectionDRow3 - (Number(sectionD.row5) || 0);

    const handleSectionDFieldChange = useCallback((field, value) => {
        onDataChange({ ...safeData, sectionD: { ...(safeData.sectionD || buildEmptySectionD()), [field]: value } });
    }, [safeData, onDataChange]);

    // ── FOOTER TOTAL Section C (Part D) — Σ Cost Amount, untuk baris TOTAL pada
    // tabel Section C. Murni derived/display value untuk footer tabel — TIDAK
    // ditambahkan ke state, TIDAK dipersist ke Save Draft, dan TIDAK mengubah
    // formula/business rule yang sudah ada.
    const totalSectionCCostAmount = useMemo(
        () => (safeData.sectionC || []).reduce((sum, row) => sum + (Number(row.costAmount) || 0), 0),
        [safeData.sectionC]
    );

    // ── Section B Total (Cost Recapitulation) — dipakai baris TOTAL Section B
    // (sudah ada sebelumnya) DAN dilaporkan ke Main Form (Question 6).
    const totalSectionBAmount = useMemo(
        () => (safeData.sectionB || []).reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
        [safeData.sectionB]
    );

    // ── MAIN FORM MAPPING ────────────────────────────────────────────────────
    // L13B.js HANYA melaporkan nilai mentah lewat callback (pola identik
    // onCreditAmountChange L3.js / onTotalNetIncomeDeductionChange L13A.js) —
    // keputusan "kirim total vs kirim 0" berdasarkan jawaban Yes/No Question
    // 6/10 SEPENUHNYA menjadi tanggung jawab MainFormBadan.js (Consumer), BUKAN
    // L13B.js. Data Lampiran 13-B TIDAK PERNAH dihapus hanya karena Question
    // 6/10 dijawab "No" — hanya nilai yang dikirim ke Main Form yang dipaksa 0
    // di sisi Consumer.
    useEffect(() => {
        if (onSectionBTotalChange) onSectionBTotalChange(totalSectionBAmount);
    }, [totalSectionBAmount, onSectionBTotalChange]);

    useEffect(() => {
        if (onSectionDRow5Change) onSectionDRow5Change(Number(sectionD.row5) || 0);
    }, [sectionD.row5, onSectionDRow5Change]);

    return (
        <div className="bg-white">
            <div className="p-6 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                        Lampiran 13-B — Additional Gross Income Deduction
                    </h2>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <ReadonlyField label="Tax Year" value={taxYear} />
                        <ReadonlyField label="TIN (NPWP)" value={tin} />
                    </div>
                </div>

                {/* ── VOCATIONAL — Section A & B ─────────────────────────────────── */}
                {showPartB && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-800">Vocational Cost Deduction</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Gross income deduction for work practice, apprenticeship, and/or vocational learning activities</p>
                        </div>
                        <div className="p-4 space-y-6">
                            {/* Section A — multi-level header: Action/No. rowSpan, Cooperation
                                Agreement colSpan(Agreement Number, Agreement Date), Partner &
                                Description rowSpan (pola identik L13A). */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">A. Cooperation Agreement</p>
                                <button onClick={handleOpenAddA}
                                    className="flex items-center gap-1.5 px-4 py-2 mb-3 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                                    <Add fontSize="small" /> Add
                                </button>
                                <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-[360px] overflow-y-auto">
                                    <table className="min-w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-yellow-400 text-xs font-bold text-gray-800 uppercase">
                                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-20">Action</th>
                                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-10">No.</th>
                                                <th colSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Cooperation Agreement</th>
                                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Partner</th>
                                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Description</th>
                                            </tr>
                                            <tr className="bg-yellow-400 text-xs font-semibold text-gray-800 uppercase">
                                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Agreement Number</th>
                                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Agreement Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(safeData.sectionA || []).length === 0 && (
                                                <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-400 text-sm border border-gray-200">No data found.</td></tr>
                                            )}
                                            {(safeData.sectionA || []).map((row, idx) => (
                                                <tr key={row.id} className="hover:bg-gray-50">
                                                    <td className="px-3 py-2 whitespace-nowrap border border-gray-200">
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => handleOpenEditA(row)} className="text-blue-600 hover:text-blue-800" title="Edit"><Edit fontSize="small" /></button>
                                                            <button onClick={() => handleRequestDelete('A', row.id)} className="text-red-500 hover:text-red-700" title="Delete"><Delete fontSize="small" /></button>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 text-gray-700 border border-gray-200">{idx + 1}</td>
                                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.agreementNumber}</td>
                                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{formatTableDate(row.agreementDate)}</td>
                                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.partner}</td>
                                                    <td className="px-3 py-2 text-gray-700 max-w-xs truncate border border-gray-200" title={row.description}>{row.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Section B — business logic TIDAK berubah, hanya tampilan disamakan
                                dengan L13A (header kuning + border putih, body grid tipis). */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">B. Cost Recapitulation</p>
                                <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-[360px] overflow-y-auto">
                                    <table className="min-w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-yellow-400 text-xs font-bold text-gray-800 uppercase">
                                                <th style={{ position: 'sticky', top: 0 }} className="bg-yellow-400 px-3 py-2 text-center border border-white w-10">No.</th>
                                                <th style={{ position: 'sticky', top: 0 }} className="bg-yellow-400 px-3 py-2 text-center border border-white">Description</th>
                                                <th style={{ position: 'sticky', top: 0 }} className="bg-yellow-400 px-3 py-2 text-center border border-white w-56">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(safeData.sectionB || []).map((row, idx) => (
                                                <tr key={row.id} className="hover:bg-gray-50">
                                                    <td className="px-3 py-2 text-gray-700 border border-gray-200">{idx + 1}</td>
                                                    <td className="px-3 py-2 text-gray-700 bg-gray-50 border border-gray-200">{row.description}</td>
                                                    <td className="px-3 py-2 border border-gray-200">
                                                        <div className="flex">
                                                            <span className="inline-flex items-center px-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-100 text-gray-500 text-xs">Rp.</span>
                                                            <input type="text" inputMode="numeric" value={row.amount ? formatRupiahDisplay(row.amount) : ''}
                                                                onChange={(e) => handleSectionBAmountChange(row.id, parseRupiahInput(e.target.value))}
                                                                className="w-full px-2 py-1.5 border border-gray-300 rounded-r-lg text-sm text-left focus:ring-2 focus:ring-blue-500" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gray-50 font-semibold">
                                                <td colSpan={2} className="px-3 py-2 text-right text-gray-700 border border-gray-200">Total</td>
                                                <td className="px-3 py-2 text-right text-gray-800 border border-gray-200">{formatCurrencyDisplay((safeData.sectionB || []).reduce((s, r) => s + (Number(r.amount) || 0), 0))}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── R&D — Section C & D ─────────────────────────────────────────── */}
                {showPartD && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-800">Research &amp; Development Cost Deduction</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Gross income deduction for research and development activities</p>
                        </div>
                        <div className="p-4 space-y-6">
                            {/* Section C — multi-level header mengikuti struktur Coretax:
                                Action/No. rowSpan, Proposal(colSpan1), Cost Period(colSpan2:
                                From Year/To Year), Cost Amount rowSpan, IP Right/Commercialization
                                (colSpan1: Year), Facility Percentage rowSpan, Additional Gross
                                Income Deduction rowSpan. */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">C. Research &amp; Development Cost</p>
                                <button onClick={handleOpenAddC}
                                    className="flex items-center gap-1.5 px-4 py-2 mb-3 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                                    <Add fontSize="small" /> Add
                                </button>
                                <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-[360px] overflow-y-auto">
                                    <table className="min-w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-yellow-400 text-xs font-bold text-gray-800 uppercase">
                                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-20">Action</th>
                                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-10">No.</th>
                                                <th style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Proposal</th>
                                                <th colSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Cost Period</th>
                                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Cost Amount</th>
                                                <th style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">IP Right / Commercialization</th>
                                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Facility Percentage</th>
                                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Additional Gross Income Deduction</th>
                                            </tr>
                                            <tr className="bg-yellow-400 text-xs font-semibold text-gray-800 uppercase">
                                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Proposal Number</th>
                                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">From Year</th>
                                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">To Year</th>
                                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Year</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(safeData.sectionC || []).length === 0 && (
                                                <tr><td colSpan={9} className="px-3 py-6 text-center text-gray-400 text-sm border border-gray-200">No data found.</td></tr>
                                            )}
                                            {(safeData.sectionC || []).map((row, idx) => (
                                                <tr key={row.id} className="hover:bg-gray-50">
                                                    <td className="px-3 py-2 whitespace-nowrap border border-gray-200">
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => handleOpenEditC(row)} className="text-blue-600 hover:text-blue-800" title="Edit"><Edit fontSize="small" /></button>
                                                            <button onClick={() => handleRequestDelete('C', row.id)} className="text-red-500 hover:text-red-700" title="Delete"><Delete fontSize="small" /></button>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 text-gray-700 border border-gray-200">{idx + 1}</td>
                                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.proposalNumber}</td>
                                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{row.periodFrom || '—'}</td>
                                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{row.periodTo || '—'}</td>
                                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{formatCurrencyDisplay(row.costAmount)}</td>
                                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{row.ipYear || '—'}</td>
                                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{row.facilityPercentage ? `${row.facilityPercentage}%` : '—'}</td>
                                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap bg-gray-50 border border-gray-200 font-medium">{formatCurrencyDisplay(computeAdditionalDeduction(row))}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        {(safeData.sectionC || []).length > 0 && (
                                            <tfoot>
                                                <tr className="bg-gray-50 font-semibold">
                                                    <td colSpan={5} className="px-3 py-2 text-right text-gray-700 border border-gray-200">Total</td>
                                                    <td className="px-3 py-2 text-right text-gray-800 border border-gray-200">{formatCurrencyDisplay(totalSectionCCostAmount)}</td>
                                                    <td colSpan={2} className="px-3 py-2 border border-gray-200"></td>
                                                    <td className="px-3 py-2 text-right text-gray-800 border border-gray-200">{formatCurrencyDisplay(totalAdditionalDeduction)}</td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>
                                </div>
                            </div>

                            {/* Section D — 6 Baris (Blueprint Part D Business Rule). No.1/No.3/No.6
                                readonly & derived (shared formatter + teks merah saat negatif,
                                TANPA background khusus/ikon peringatan). No.2/No.4/No.5 manual
                                input, raw, dipersist ke Save Draft. No.4/No.5 sementara manual
                                (kelak otomatis saat formula resmi DJP tersedia). */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">D. Additional Gross Income Deduction Summary</p>
                                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                                    <SectionDRow number={1} label="Total Additional Gross Income Deduction from Section C"
                                        value={sectionDRow1} readOnly
                                        helper="Total = Σ Additional Gross Income Deduction from Section C" />
                                    <SectionDRow number={2} label="Deduction Already Utilized"
                                        value={sectionD.row2} onChange={(v) => handleSectionDFieldChange('row2', v)} />
                                    <SectionDRow number={3} label="Remaining Additional Gross Income Deduction"
                                        value={sectionDRow3} readOnly
                                        helper="No. 3 = No. 1 − No. 2" />
                                    <SectionDRow number={4} label="Utilized in Current Fiscal Year"
                                        value={sectionD.row4} onChange={(v) => handleSectionDFieldChange('row4', v)} />
                                    <SectionDRow number={5} label="Utilized in Prior Fiscal Years"
                                        value={sectionD.row5} onChange={(v) => handleSectionDFieldChange('row5', v)} />
                                    <SectionDRow number={6} label="Additional Gross Income Deduction Carried Forward"
                                        value={sectionDRow6} readOnly
                                        helper="No. 6 = No. 3 − No. 5" />
                                    <p className="text-xs text-gray-400 italic">
                                        No. 4 and No. 5 are currently manual input pending the official DJP calculation formula.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!showPartB && !showPartD && (
                    <p className="text-sm text-gray-400 italic text-center py-4">
                        No section is active. Answer the relevant questions on Section D to display Vocational and/or R&amp;D cost deduction.
                    </p>
                )}
            </div>

            <SectionAModal mode={modalAMode} formData={formA} onFieldChange={handleFieldChangeA} onSave={handleSaveA} onClose={handleCloseModalA} />
            <SectionCModal mode={modalCMode} formData={formC} onFieldChange={handleFieldChangeC} onSave={handleSaveC} onClose={handleCloseModalC} />
            <DeleteConfirmDialog open={!!pendingDelete} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
        </div>
    );
};

export default L13B;