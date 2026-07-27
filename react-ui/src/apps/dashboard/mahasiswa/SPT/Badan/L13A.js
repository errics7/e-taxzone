import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Add, Edit, Delete, Refresh, Description, GridOn, PictureAsPdf, CalendarToday, Close } from '@mui/icons-material';

// ─────────────────────────────────────────────────────────────────────────────
// L13A — Daftar Fasilitas Penanaman Modal (List of Investment Facilities)
//
// Pola implementasi identik L10A.js (baseline CRUD project ini):
//   - Row identifier lokal (frontend-only, bukan primary key database).
//   - Modal Add/Edit menghasilkan SATU row per submit.
//   - Save Draft HANYA raw input — Approved Investment Total & derived summary
//     TIDAK PERNAH dipersist, selalu dihitung ulang (Recalculate Contract).
//   - Helper (formatter Rupiah, ReadonlyField) didefinisikan lokal per file,
//     mengikuti konvensi L10A.js (bukan diimpor dari module bersama).
//
// PHASE 2 AUDIT FIXES (dibandingkan implementasi awal):
//   1. Toolbar: CSV/Excel/PDF kini masing-masing ikon berbeda (Description/
//      GridOn/PictureAsPdf), bukan GridOn dobel.
//   2. Approved Investment Amount dipecah jadi Foreign Currency + Equivalent +
//      Rupiah (editable) dan Total (readonly, formula Foreign Currency +
//      Equivalent + Rupiah) — helper caption ditambahkan di bawah Total.
//   3. Investment Type → Radio Button (New Investment / Expansion).
//   4. Granted Facilities → SINGLE SELECTION (radio group notionally, memilih
//      fasilitas lain otomatis mengganti pilihan sebelumnya). Field tambahan
//      (Percentage / Loss Compensation Year) hanya aktif sesuai fasilitas yang
//      dipilih — data disimpan terpisah (facilityType, facilityPercentage,
//      lossCompensationYear), TIDAK ada parsing dari string tabel.
//   5. Net Income Deduction Facility: Amount hanya dapat diinput setelah Year
//      dipilih.
//   6. Table: currency/readonly/computed number RIGHT ALIGN, format "Rp100.000"
//      (tanpa spasi setelah "Rp", header tabel tanpa tulisan "Rp").
// ─────────────────────────────────────────────────────────────────────────────

// ── HELPER — Formatter & Parser Rupiah (pola identik L10A.js) ─────────────────
const formatRupiahDisplay = (value) => new Intl.NumberFormat('id-ID').format(value || 0);
const parseRupiahInput = (str) => parseFloat(String(str).replace(/[.,]/g, '')) || 0;

// ── HELPER — Currency Display Formatter (ACCOUNTING FORMAT) ───────────────────
// Menggabungkan prefix "Rp" dengan angka, dengan tanda minus SELALU di depan
// "Rp" untuk nilai negatif (mis. "-Rp125.000"), bukan "Rp-125.000". Dipakai di
// setiap tempat yang sebelumnya menulis `Rp${formatRupiahDisplay(x)}` secara
// manual (table values, readonly currency fields, computed values, totals).
// Tidak mengubah logika kalkulasi apa pun — murni perbaikan format tampilan.
const formatCurrencyDisplay = (value) => {
    const num = Number(value) || 0;
    const sign = num < 0 ? '-' : '';
    return `${sign}Rp${formatRupiahDisplay(Math.abs(num))}`;
};

// ── HELPER — Table Date Display Formatter (DISPLAY ONLY) ───────────────────────
// Value yang disimpan di state/draft TETAP ISO date string (yyyy-mm-dd, bawaan
// <input type="date">) — formatter ini HANYA dipakai saat merender tabel,
// TIDAK PERNAH menulis balik ke formData/row. Save Draft & Load Draft payload
// tidak berubah sama sekali.
const TABLE_DATE_MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formatTableDate = (isoDate) => {
    if (!isoDate) return '';
    const parts = String(isoDate).split('-');
    if (parts.length !== 3) return isoDate; // fallback — jangan sampai merusak tampilan bila format tak terduga
    const [year, month, day] = parts;
    const monthIndex = parseInt(month, 10) - 1;
    if (!year || !day || isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return isoDate;
    return `${day.padStart(2, '0')}-${TABLE_DATE_MONTH_ABBR[monthIndex]}-${year}`;
};

// ── HELPER — Row identifier (frontend-only) ────────────────────────────────────
const generateRowId = () => `l13a-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// ── REFERENCE DATA — bukan business logic, siap diganti reference data module ─
const INVESTMENT_TYPE_OPTIONS = [
    { value: 'New Investment', label: 'New Investment' },
    { value: 'Expansion', label: 'Expansion' },
];
const NET_INCOME_DEDUCTION_YEAR_OPTIONS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];

// Granted Facilities — SINGLE SELECTION, urutan mengikuti screenshot Coretax
// (Blueprint Phase 2 §Granted Facilities).
const FACILITY_TYPE_OPTIONS = [
    { value: 'netIncomeDeduction', label: 'Net Income Deduction' },
    { value: 'acceleratedDepreciation', label: 'Accelerated Depreciation / Amortization' },
    { value: 'lossCompensationExtension', label: 'Additional Loss Compensation' },
    { value: 'dividendTaxFacility', label: 'Dividend Income Tax Facility' },
];

const buildEmptyL13AForm = () => ({
    decisionNumber: '',
    decisionDate: '',
    utilizationDecisionNumber: '',
    utilizationDecisionDate: '',
    // Approved Investment — editable: foreignCurrency, equivalent, rupiah.
    // Total SELALU derived (Foreign Currency + Equivalent + Rupiah) — tidak
    // pernah ditulis langsung oleh user (readonly).
    approvedInvestmentForeignCurrency: 0,
    approvedInvestmentEquivalent: 0,
    approvedInvestmentRupiah: 0,
    investmentType: '',
    businessSectorArea: '',
    // Granted Facilities — single selection.
    facilityType: '',
    facilityPercentage: 0,
    lossCompensationYear: '',
    investmentRealizationCumulative: 0,
    investmentRealizationAtCommercial: 0,
    commercialProductionDate: '',
    netIncomeDeductionYear: '',
    netIncomeDeductionAmount: 0,
});

// Total Approved Investment — DERIVED, tidak pernah dipersist sebagai sumber
// kebenaran terpisah (Recalculate Contract — selalu dihitung ulang dari
// foreignCurrency + equivalent + rupiah).
const computeApprovedInvestmentTotal = (form) =>
    (Number(form.approvedInvestmentForeignCurrency) || 0)
    + (Number(form.approvedInvestmentEquivalent) || 0)
    + (Number(form.approvedInvestmentRupiah) || 0);

// Validasi ringan — hanya field identitas keputusan yang wajib, mengikuti
// prinsip Save Draft permisif (Blueprint L13A: "Save Draft hanya menyimpan
// raw input"). Validasi ini dipakai HANYA untuk tombol Save pada modal.
const validateL13AForm = (form) => {
    const errors = {};
    if (!form.decisionNumber || !form.decisionNumber.trim()) errors.decisionNumber = 'Decision Number wajib diisi.';
    if (!form.decisionDate) errors.decisionDate = 'Decision Date wajib diisi.';
    return errors;
};

// Ringkasan Granted Facilities untuk tabel — TANPA tanda kurung (Blueprint
// Phase 2: "Net Income Deduction 5%", bukan "Net Income Deduction (5%)").
// Data tetap tersimpan terpisah (facilityType/facilityPercentage/
// lossCompensationYear) — string ini HANYA untuk tampilan, tidak pernah
// di-parse balik.
const grantedFacilitySummary = (row) => {
    switch (row.facilityType) {
        case 'netIncomeDeduction':
            return `Net Income Deduction ${row.facilityPercentage || 0}%`;
        case 'acceleratedDepreciation':
            return 'Accelerated Depreciation / Amortization';
        case 'lossCompensationExtension':
            return `Additional Loss Compensation Year ${row.lossCompensationYear || '—'}`;
        case 'dividendTaxFacility':
            return 'Dividend Income Tax Facility';
        default:
            return '—';
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ReadonlyField — pola identik L1D.js / L10A.js
// ─────────────────────────────────────────────────────────────────────────────
const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

// ── HelperCaption — Standar caption "ⓘ Calculation: ..." (Global UI Contract
// Phase 2 §Helper Caption Standard) — grey, ditempatkan tepat di bawah field
// readonly, Bahasa Inggris.
const HelperCaption = ({ formula }) => (
    <p className="text-xs text-gray-400 mt-1">ⓘ Calculation: {formula}</p>
);

// ─────────────────────────────────────────────────────────────────────────────
// DateField — Date Input + Calendar Button (biru) + Clear Date Button (merah)
// SATU icon kalender saja — indikator kalender bawaan browser pada
// <input type="date"> disembunyikan via CSS scoped class `l13a-date-input`
// (lihat <style> di L13AModal), tombol biru custom yang memicu showPicker().
// Internal Data Representation tetap ISO date string (type="date" dipertahankan)
// — hanya tampilan ikon bawaan browser yang disembunyikan, tidak ada perubahan
// business rule maupun struktur data.
// ─────────────────────────────────────────────────────────────────────────────
const DateField = ({ label, required, value, onChange, error }) => {
    const inputRef = React.useRef(null);
    const openPicker = () => {
        if (inputRef.current?.showPicker) {
            try { inputRef.current.showPicker(); } catch (e) { inputRef.current.focus(); }
        } else {
            inputRef.current?.focus();
        }
    };
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="flex items-stretch gap-1.5">
                <input
                    ref={inputRef}
                    type="date"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`l13a-date-input flex-1 min-w-0 px-3 py-2 border rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : 'border-gray-300'}`}
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
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};

// Style global untuk menyembunyikan icon kalender bawaan browser pada
// <input type="date"> — dirender sekali oleh L13AModal saat modal terbuka.
const DATE_INPUT_HIDE_NATIVE_ICON_CSS = `
.l13a-date-input::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }
.l13a-date-input::-webkit-inner-spin-button { display: none; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// YearPickerField — Year Picker (bukan Date Picker penuh) untuk
// "Additional Loss Compensation Year". User TIDAK BOLEH mengetik tahun secara
// manual — input bersifat readOnly, satu-satunya cara mengisi nilai adalah
// dengan mengklik tombol Calendar lalu memilih salah satu tahun pada panel
// (grid 12 tahun per halaman, dengan navigasi ‹ › antar rentang). Nilai yang
// tersimpan TETAP `lossCompensationYear` berupa string angka tahun murni
// (mis. "2021"), bukan string hasil formatting tanggal.
// ─────────────────────────────────────────────────────────────────────────────
const YearPickerField = ({ value, onChange }) => {
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

    return (
        <div className="relative" ref={containerRef}>
            <div className="flex items-stretch gap-1.5">
                <input
                    type="text"
                    readOnly
                    value={value || ''}
                    placeholder="Select Year"
                    onClick={() => setOpen((o) => !o)}
                    className="flex-1 min-w-0 px-3 py-1.5 border border-gray-300 rounded-l-lg text-sm text-left bg-white cursor-pointer focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => setOpen((o) => !o)} title="Select Year"
                    className="w-9 flex items-center justify-center bg-blue-900 hover:bg-blue-800 text-white flex-shrink-0">
                    <CalendarToday style={{ fontSize: 16 }} />
                </button>
                <button type="button" onClick={() => { onChange(''); setOpen(false); }} title="Clear Year"
                    className="w-9 flex items-center justify-center rounded-r-lg bg-red-600 hover:bg-red-700 text-white flex-shrink-0">
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
                        {years.map((y) => (
                            <button key={y} type="button"
                                onClick={() => { onChange(String(y)); setOpen(false); }}
                                className={`px-2 py-1.5 text-sm rounded transition-colors ${String(y) === String(value) ? 'bg-blue-900 text-white' : 'hover:bg-blue-50 text-gray-700'}`}>
                                {y}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// CurrencyField — Number Input Rp., LEFT ALIGN (Global UI Contract §Input).
// Untuk mode readOnly (mis. field Total), tanda minus ditampilkan di depan
// prefix "Rp." (accounting format, mis. "-Rp.") — konsisten dengan
// formatCurrencyDisplay pada tabel. Mode editable TIDAK berubah sama sekali
// (parseRupiahInput/onChange logic tetap identik).
// ─────────────────────────────────────────────────────────────────────────────
const CurrencyField = ({ label, value, onChange, required, error, readOnly }) => {
    const num = Number(value) || 0;
    const sign = readOnly && num < 0 ? '-' : '';
    const displayValue = readOnly ? formatRupiahDisplay(Math.abs(num)) : (value ? formatRupiahDisplay(value) : '');
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="flex">
                <span className={`inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm ${readOnly ? 'bg-gray-200' : 'bg-gray-100'}`}>{sign}Rp.</span>
                <input
                    type="text"
                    inputMode="numeric"
                    readOnly={readOnly}
                    value={displayValue}
                    onChange={(e) => onChange && onChange(parseRupiahInput(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-r-lg text-sm text-left focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : 'border-gray-300'} ${readOnly ? 'bg-gray-100 text-gray-600' : ''}`}
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MODAL — Add/Edit — dideklarasikan di luar komponen utama (pola identik L10A)
// ─────────────────────────────────────────────────────────────────────────────
const L13AModal = ({ mode, formData, errors, onFieldChange, onSave, onClose }) => {
    if (!mode) return null;
    const total = computeApprovedInvestmentTotal(formData);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <style>{DATE_INPUT_HIDE_NATIVE_ICON_CSS}</style>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800">Investment Facility</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>

                <div className="px-6 py-5 space-y-6 overflow-y-auto">
                    {/* 1. COMPANY RECEIVES TAX FACILITY */}
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">1. Company Receives Tax Facility</p>
                        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                            {/* A. Decision / Grant of Tax Facility */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">A. Decision / Grant of Tax Facility</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Decision Number <span className="text-red-500">*</span></label>
                                        <input type="text" value={formData.decisionNumber}
                                            onChange={(e) => onFieldChange('decisionNumber', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500 ${errors.decisionNumber ? 'border-red-400' : 'border-gray-300'}`} />
                                        {errors.decisionNumber && <p className="text-xs text-red-500 mt-1">{errors.decisionNumber}</p>}
                                    </div>
                                    <DateField label="Decision Date" required value={formData.decisionDate}
                                        onChange={(v) => onFieldChange('decisionDate', v)} error={errors.decisionDate} />
                                </div>
                            </div>
                            {/* B. Facility Utilization Decision */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">B. Facility Utilization Decision</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Utilization Decision Number</label>
                                        <input type="text" value={formData.utilizationDecisionNumber}
                                            onChange={(e) => onFieldChange('utilizationDecisionNumber', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <DateField label="Utilization Decision Date" value={formData.utilizationDecisionDate}
                                        onChange={(v) => onFieldChange('utilizationDecisionDate', v)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. APPROVED INVESTMENT */}
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">2. Approved Investment</p>
                        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                            {/* A. Approved Investment Amount */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">A. Approved Investment Amount</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Foreign Currency</label>
                                        <input type="text" inputMode="numeric"
                                            value={formData.approvedInvestmentForeignCurrency ? formatRupiahDisplay(formData.approvedInvestmentForeignCurrency) : ''}
                                            onChange={(e) => onFieldChange('approvedInvestmentForeignCurrency', parseRupiahInput(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <CurrencyField label="Equivalent" value={formData.approvedInvestmentEquivalent}
                                        onChange={(v) => onFieldChange('approvedInvestmentEquivalent', v)} />
                                </div>
                                <div className="mt-4">
                                    <CurrencyField label="Rupiah" value={formData.approvedInvestmentRupiah}
                                        onChange={(v) => onFieldChange('approvedInvestmentRupiah', v)} />
                                </div>
                                <div className="mt-4">
                                    <CurrencyField label="Total" value={total} readOnly />
                                    <HelperCaption formula="Foreign Currency + Equivalent + Rupiah" />
                                </div>
                            </div>

                            {/* B. Investment Type */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">B. Investment Type</p>
                                <div className="flex items-center gap-6">
                                    {INVESTMENT_TYPE_OPTIONS.map((opt) => (
                                        <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700">
                                            <input type="radio" name="investmentType" value={opt.value}
                                                checked={formData.investmentType === opt.value}
                                                onChange={() => onFieldChange('investmentType', opt.value)} />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* C. Business Sector / Area */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">C. Business Sector / Area</p>
                                <input type="text" value={formData.businessSectorArea}
                                    onChange={(e) => onFieldChange('businessSectorArea', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500" />
                            </div>

                            {/* D. Granted Facility — SINGLE SELECTION */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">D. Granted Facility</p>
                                <div className="space-y-2">
                                    {FACILITY_TYPE_OPTIONS.map((opt) => (
                                        <div key={opt.value}>
                                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                                <input type="radio" name="facilityType" value={opt.value}
                                                    checked={formData.facilityType === opt.value}
                                                    onChange={() => onFieldChange('facilityType', opt.value)} />
                                                {opt.label}
                                            </label>
                                            {opt.value === 'netIncomeDeduction' && formData.facilityType === 'netIncomeDeduction' && (
                                                <div className="ml-6 mt-1.5 max-w-[220px]">
                                                    <label className="block text-xs text-gray-500 mb-1">Percentage</label>
                                                    <div className="flex">
                                                        <input type="text" inputMode="decimal" value={formData.facilityPercentage || ''}
                                                            onChange={(e) => onFieldChange('facilityPercentage', parseFloat(e.target.value) || 0)}
                                                            className="w-full px-3 py-1.5 border border-gray-300 rounded-l-lg text-sm text-left focus:ring-2 focus:ring-blue-500" />
                                                        <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-100 text-gray-500 text-sm">%</span>
                                                    </div>
                                                </div>
                                            )}
                                            {opt.value === 'lossCompensationExtension' && formData.facilityType === 'lossCompensationExtension' && (
                                                <div className="ml-6 mt-1.5 max-w-[240px]">
                                                    <label className="block text-xs text-gray-500 mb-1">Year</label>
                                                    <YearPickerField value={formData.lossCompensationYear}
                                                        onChange={(v) => onFieldChange('lossCompensationYear', v)} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. INVESTMENT REALIZATION */}
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">3. Investment Realization</p>
                        <div className="border border-gray-200 rounded-lg p-4">
                            {/* items-stretch + label wrapper ber-min-height sama (leading-tight, flex items-end)
                                agar textbox A & B tetap sejajar meskipun judul B dua baris sedangkan judul A satu baris. */}
                            <div className="grid grid-cols-2 gap-4 items-stretch">
                                <div className="flex flex-col">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2 min-h-[2rem] leading-tight flex items-end">A. Realization Cumulative to Date</p>
                                    <CurrencyField value={formData.investmentRealizationCumulative}
                                        onChange={(v) => onFieldChange('investmentRealizationCumulative', v)} />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2 min-h-[2rem] leading-tight flex items-end">B. Realization at Commercial Production Start</p>
                                    <CurrencyField value={formData.investmentRealizationAtCommercial}
                                        onChange={(v) => onFieldChange('investmentRealizationAtCommercial', v)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. COMMERCIAL PRODUCTION DATE — HARUS setelah Investment Realization */}
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">4. Commercial Production Date</p>
                        <div className="border border-gray-200 rounded-lg p-4">
                            <DateField label="Commercial Production Date" value={formData.commercialProductionDate}
                                onChange={(v) => onFieldChange('commercialProductionDate', v)} />
                        </div>
                    </div>

                    {/* 5. NET INCOME DEDUCTION FACILITY — Year wajib dipilih dulu sebelum Amount aktif */}
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">5. Net Income Deduction Facility</p>
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Year</label>
                                    <select value={formData.netIncomeDeductionYear}
                                        onChange={(e) => onFieldChange('netIncomeDeductionYear', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500">
                                        <option value="">Please Select</option>
                                        {NET_INCOME_DEDUCTION_YEAR_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <CurrencyField label="Amount" readOnly={!formData.netIncomeDeductionYear}
                                    value={formData.netIncomeDeductionAmount}
                                    onChange={(v) => onFieldChange('netIncomeDeductionAmount', v)} />
                            </div>
                            {!formData.netIncomeDeductionYear && (
                                <p className="text-xs text-gray-400 mt-2">Select the year first to enable the amount field.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <button onClick={onClose}
                        className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                        Close
                    </button>
                    <button onClick={onSave}
                        className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRMATION DIALOG — pola identik L10A.js
// ─────────────────────────────────────────────────────────────────────────────
const DeleteConfirmDialog = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-2">Delete Confirmation</h3>
                <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this data?</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// L13A — Daftar Fasilitas Penanaman Modal
// Props: taxYear, tin, rows, onRowsChange — pola identik L10A.js.
// ─────────────────────────────────────────────────────────────────────────────
const L13A = ({ taxYear, tin, rows, onRowsChange, onTotalNetIncomeDeductionChange }) => {
    const safeRows = rows || [];

    const [modalMode, setModalMode] = useState(null); // null | 'create' | 'edit'
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [formData, setFormData] = useState(buildEmptyL13AForm());
    const [formErrors, setFormErrors] = useState({});
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const resetForm = useCallback(() => {
        setFormData(buildEmptyL13AForm());
        setFormErrors({});
    }, []);

    const handleOpenAdd = useCallback(() => {
        setModalMode('create');
        setSelectedRowId(null);
        resetForm();
    }, [resetForm]);

    const handleOpenEdit = useCallback((row) => {
        setModalMode('edit');
        setSelectedRowId(row.id);
        setFormData({ ...buildEmptyL13AForm(), ...row });
        setFormErrors({});
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalMode(null);
        setSelectedRowId(null);
        resetForm();
    }, [resetForm]);

    const handleFieldChange = useCallback((field, value) => {
        setFormData((prev) => {
            // Net Income Deduction Amount hanya boleh aktif ketika Year sudah
            // dipilih (Blueprint Phase 2 §Net Income Deduction Facility) — bila
            // Year dikosongkan kembali, Amount ikut direset ke 0.
            if (field === 'netIncomeDeductionYear' && !value) {
                return { ...prev, netIncomeDeductionYear: value, netIncomeDeductionAmount: 0 };
            }
            return { ...prev, [field]: value };
        });
    }, []);

    const handleSave = useCallback(() => {
        const errors = validateL13AForm(formData);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        // Total Approved Investment TIDAK dipersist sebagai field independen —
        // hanya raw input (foreignCurrency/equivalent/rupiah) yang disimpan;
        // total dihitung ulang di render (lihat computeApprovedInvestmentTotal).
        if (modalMode === 'create') {
            const newRow = { id: generateRowId(), ...formData };
            onRowsChange([...safeRows, newRow]);
        } else if (modalMode === 'edit') {
            const updatedRows = safeRows.map((row) => (row.id === selectedRowId ? { ...formData, id: selectedRowId } : row));
            onRowsChange(updatedRows);
        }
        setModalMode(null);
        setSelectedRowId(null);
        resetForm();
    }, [formData, modalMode, selectedRowId, safeRows, onRowsChange, resetForm]);

    const handleRequestDelete = useCallback((rowId) => setPendingDeleteId(rowId), []);
    const handleCancelDelete = useCallback(() => setPendingDeleteId(null), []);
    const handleConfirmDelete = useCallback(() => {
        onRowsChange(safeRows.filter((row) => row.id !== pendingDeleteId));
        setPendingDeleteId(null);
    }, [safeRows, pendingDeleteId, onRowsChange]);

    // Refresh Table — read-only no-op, pola identik L10A.js (tabel sudah
    // reaktif terhadap `rows` melalui render normal React).
    const handleRefreshTable = useCallback(() => {}, []);

    const rowCount = safeRows.length;

    // ── FOOTER TOTAL — Σ seluruh kolom nominal (currency/money columns), agar
    // user dapat melihat jumlah keseluruhan sebelum dikirim ke Main Form.
    // Murni derived/display value untuk footer tabel — TIDAK ditambahkan ke
    // state, TIDAK dipersist ke Save Draft, dan TIDAK mengubah formula atau
    // business rule yang sudah ada (computeApprovedInvestmentTotal per-row
    // tetap sama persis; ini hanya Σ dari hasil computeApprovedInvestmentTotal
    // di setiap row).
    const totalApprovedInvestmentForeignCurrency = useMemo(
        () => safeRows.reduce((sum, row) => sum + (Number(row.approvedInvestmentForeignCurrency) || 0), 0),
        [safeRows]
    );
    const totalApprovedInvestmentEquivalent = useMemo(
        () => safeRows.reduce((sum, row) => sum + (Number(row.approvedInvestmentEquivalent) || 0), 0),
        [safeRows]
    );
    const totalApprovedInvestmentRupiah = useMemo(
        () => safeRows.reduce((sum, row) => sum + (Number(row.approvedInvestmentRupiah) || 0), 0),
        [safeRows]
    );
    const totalApprovedInvestmentTotal = useMemo(
        () => safeRows.reduce((sum, row) => sum + computeApprovedInvestmentTotal(row), 0),
        [safeRows]
    );
    const totalInvestmentRealizationAtCommercial = useMemo(
        () => safeRows.reduce((sum, row) => sum + (Number(row.investmentRealizationAtCommercial) || 0), 0),
        [safeRows]
    );
    const totalInvestmentRealizationCumulative = useMemo(
        () => safeRows.reduce((sum, row) => sum + (Number(row.investmentRealizationCumulative) || 0), 0),
        [safeRows]
    );
    const totalNetIncomeDeductionAmount = useMemo(
        () => safeRows.reduce((sum, row) => sum + (Number(row.netIncomeDeductionAmount) || 0), 0),
        [safeRows]
    );

    // ── MAIN FORM MAPPING — Total Net Income Deduction Facility → Section D
    // Question 5 (p5_investment_facility_amount). L13A.js HANYA melaporkan
    // total mentah lewat callback (pola identik onCreditAmountChange L3.js /
    // onA10Change L1A.js) — keputusan "kirim total vs kirim 0" berdasarkan
    // jawaban Yes/No Question 5 SEPENUHNYA menjadi tanggung jawab
    // MainFormBadan.js (Consumer), BUKAN L13A.js. Data Lampiran 13-A TIDAK
    // PERNAH dihapus hanya karena Question 5 dijawab "No" — hanya nilai yang
    // dikirim ke Main Form yang dipaksa 0 di sisi Consumer.
    useEffect(() => {
        if (onTotalNetIncomeDeductionChange) onTotalNetIncomeDeductionChange(totalNetIncomeDeductionAmount);
    }, [totalNetIncomeDeductionAmount, onTotalNetIncomeDeductionChange]);

    return (
        <div className="bg-white">
            <div className="p-6 space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                        Lampiran 13-A — List of Investment Facilities
                    </h2>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <ReadonlyField label="Tax Year" value={taxYear} />
                        <ReadonlyField label="TIN (NPWP)" value={tin} />
                    </div>
                </div>

                <div className="text-sm font-semibold text-gray-700">Tax Facilities in Relation to Investment</div>

                {/* Toolbar — Blueprint L13A: Add & Refresh aktif, CSV/Excel/PDF placeholder (pola identik L10A) */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                        <Add fontSize="small" /> Add
                    </button>
                    <div className="flex-1" />
                    <button
                        type="button"
                        onClick={handleRefreshTable}
                        title="Refresh Table"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 text-white transition-colors">
                        <Refresh fontSize="small" />
                    </button>
                    <button type="button" title="Export CSV (belum tersedia)"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-400 text-white cursor-default opacity-90">
                        <Description fontSize="small" />
                    </button>
                    <button type="button" title="Export Excel (belum tersedia)"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-green-600 text-white cursor-default opacity-90">
                        <GridOn fontSize="small" />
                    </button>
                    <button type="button" title="Export PDF (belum tersedia)"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-red-600 text-white cursor-default opacity-90">
                        <PictureAsPdf fontSize="small" />
                    </button>
                </div>

                {/* Table — MULTI-LEVEL HEADER mengikuti struktur Coretax (parent header
                    per section modal + child header per field). Data/state/payload TIDAK
                    berubah — hanya struktur & tampilan header + kolom tabel disesuaikan agar
                    setiap section modal (Decision, Utilization, Approved Investment,
                    Investment Realization, Net Income Deduction) punya representasi jelas
                    di tabel. Sticky header 2 baris (top: 0 untuk parent row & rowSpan=2,
                    top: 36 untuk child row — mengikuti tinggi baris header h-9/36px),
                    freeze kolom Action & No tetap dipertahankan (pola identik L10A).
                    White border (border-white) memisahkan setiap group/child header agar
                    tidak menyatu jadi satu blok kuning besar; child header row memakai
                    border-b-gray-300 di baris bawah untuk memisahkan header dari body. */}
                <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-[520px] overflow-y-auto">
                    <table className="min-w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-yellow-400 text-xs font-bold text-gray-800 uppercase">
                                <th rowSpan={2} style={{ position: 'sticky', top: 0, left: 0, zIndex: 21, height: 36 }}
                                    className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-20">Action</th>
                                <th rowSpan={2} style={{ position: 'sticky', top: 0, left: 80, zIndex: 21, height: 36 }}
                                    className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-12">No.</th>
                                <th colSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }}
                                    className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Decision / Grant of Tax Facility</th>
                                <th colSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }}
                                    className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Facility Utilization Decision</th>
                                <th colSpan={4} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }}
                                    className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Approved Investment Amount</th>
                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }}
                                    className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Investment Type</th>
                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }}
                                    className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Business Sector / Area</th>
                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }}
                                    className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Granted Facilities</th>
                                <th colSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }}
                                    className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Investment Realization</th>
                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }}
                                    className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Commercial Production Date</th>
                                <th colSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }}
                                    className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Net Income Deduction Facility</th>
                            </tr>
                            <tr className="bg-yellow-400 text-xs font-semibold text-gray-800 uppercase">
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Decision Number</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Decision Date</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Utilization Decision Number</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Utilization Decision Date</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Foreign Currency</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Equivalent</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">In Rupiah</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Total</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Commercial Production Start</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Cumulative to Date</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Year</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowCount === 0 && (
                                <tr>
                                    <td colSpan={18} className="px-3 py-8 text-center text-gray-400 text-sm border border-gray-200">No data found.</td>
                                </tr>
                            )}
                            {safeRows.map((row, idx) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td style={{ position: 'sticky', left: 0, zIndex: 10 }} className="bg-white px-3 py-2 whitespace-nowrap border border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpenEdit(row)} className="text-blue-600 hover:text-blue-800" title="Edit">
                                                <Edit fontSize="small" />
                                            </button>
                                            <button onClick={() => handleRequestDelete(row.id)} className="text-red-500 hover:text-red-700" title="Delete">
                                                <Delete fontSize="small" />
                                            </button>
                                        </div>
                                    </td>
                                    <td style={{ position: 'sticky', left: 80, zIndex: 10 }} className="bg-white px-3 py-2 text-gray-700 border border-gray-200">{idx + 1}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.decisionNumber}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{formatTableDate(row.decisionDate)}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.utilizationDecisionNumber}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{formatTableDate(row.utilizationDecisionDate)}</td>
                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{row.approvedInvestmentForeignCurrency ? formatRupiahDisplay(row.approvedInvestmentForeignCurrency) : '—'}</td>
                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{formatCurrencyDisplay(row.approvedInvestmentEquivalent)}</td>
                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{formatCurrencyDisplay(row.approvedInvestmentRupiah)}</td>
                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap font-medium bg-gray-50 border border-gray-200">{formatCurrencyDisplay(computeApprovedInvestmentTotal(row))}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.investmentType}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.businessSectorArea}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{grantedFacilitySummary(row)}</td>
                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{formatCurrencyDisplay(row.investmentRealizationAtCommercial)}</td>
                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{formatCurrencyDisplay(row.investmentRealizationCumulative)}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{formatTableDate(row.commercialProductionDate)}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.netIncomeDeductionYear || '—'}</td>
                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{formatCurrencyDisplay(row.netIncomeDeductionAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                        {rowCount > 0 && (
                            <tfoot>
                                <tr className="bg-gray-50 font-semibold">
                                    <td colSpan={6} style={{ position: 'sticky', left: 0 }} className="bg-gray-50 px-3 py-2 text-right text-gray-700 border border-gray-200">Total</td>
                                    <td className="px-3 py-2 text-right text-gray-800 border border-gray-200">{formatRupiahDisplay(totalApprovedInvestmentForeignCurrency)}</td>
                                    <td className="px-3 py-2 text-right text-gray-800 border border-gray-200">{formatCurrencyDisplay(totalApprovedInvestmentEquivalent)}</td>
                                    <td className="px-3 py-2 text-right text-gray-800 border border-gray-200">{formatCurrencyDisplay(totalApprovedInvestmentRupiah)}</td>
                                    <td className="px-3 py-2 text-right text-gray-800 border border-gray-200">{formatCurrencyDisplay(totalApprovedInvestmentTotal)}</td>
                                    <td colSpan={3} className="px-3 py-2 border border-gray-200"></td>
                                    <td className="px-3 py-2 text-right text-gray-800 border border-gray-200">{formatCurrencyDisplay(totalInvestmentRealizationAtCommercial)}</td>
                                    <td className="px-3 py-2 text-right text-gray-800 border border-gray-200">{formatCurrencyDisplay(totalInvestmentRealizationCumulative)}</td>
                                    <td colSpan={2} className="px-3 py-2 border border-gray-200"></td>
                                    <td className="px-3 py-2 text-right text-gray-800 border border-gray-200">{formatCurrencyDisplay(totalNetIncomeDeductionAmount)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            <L13AModal
                mode={modalMode}
                formData={formData}
                errors={formErrors}
                onFieldChange={handleFieldChange}
                onSave={handleSave}
                onClose={handleCloseModal}
            />
            <DeleteConfirmDialog
                open={!!pendingDeleteId}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default L13A;