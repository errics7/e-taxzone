import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Add, Edit, Delete, CalendarToday, Close } from '@mui/icons-material';

// ─────────────────────────────────────────────────────────────────────────────
// L13C — Daftar Fasilitas Pengurangan PPh Badan
// (List of Corporate Income Tax Payable Reduction Facility)
//
// Pola implementasi identik L10A.js / L13A.js (CRUD modal, satu modal = satu
// row). Berbeda dari L10A: setiap row memiliki 3 field READONLY yang dihitung
// (Taxable Income, Income Tax Payable, Tax Reduction Facility) — sesuai
// Blueprint §Formula Simulasi. HANYA raw input (Grant/Utilization Decision,
// Facility Period, Utilization Year, Reduction Percentage) yang dipersist ke
// Save Draft; ketiga field readonly SELALU dihitung ulang saat render/Load
// Draft (Recalculate Contract), TIDAK PERNAH dibaca langsung dari draft.
//
// Taxable Income (Penghasilan Kena Pajak) BUKAN raw input milik L13C — nilai
// ini adalah data perusahaan yang sama untuk seluruh row, diteruskan dari
// parent (SptTahunanBadan.js → MainFormBadan.js, Point 9 Profit & Loss
// Section D: sptData.profit_loss.p9_taxable_income) melalui prop
// `taxableIncome`. Pola ini identik dengan a10Value/activeEbitdaComponents —
// nilai company-wide yang diteruskan sebagai prop readonly, bukan state lokal
// L13C.
//
// L13C REVISION (FOLLOW L13A AS BASELINE) — perubahan UI/UX murni, TIDAK ADA
// perubahan business rule/data structure/callback/payload:
//   1-3. Table UI & grouped header structure (Action/No. rowSpan, Grant of Tax
//        Facility Decision colSpan, Facility Utilization Decision colSpan,
//        Facility Duration/Utilization Year/Reduction Percentage standalone,
//        Corporate Income Tax Reduction Calculation colSpan) + body grid tipis
//        (#E5E7EB) — pola identik L13A.
//   4. Date Field: satu ikon kalender saja (native browser icon disembunyikan).
//   5. Utilization Year kini pakai YearPickerField (tidak bisa diketik manual,
//      tanpa bulan/tanggal); Facility Period tetap float+suffix Years tanpa
//      spinner; Reduction Percentage tetap numeric+suffix %.
//   7. Taxable Income: helper diganti "ⓘ Source: Main Form → Section D → Item 9
//      (Taxable Income)" — bukan helper kalkulasi.
//   8-9. Income Tax Payable & Tax Reduction Facility: helper kalkulasi tetap
//      sama persis.
//   10-12. Alignment/currency/date format tabel disamakan L13A.
//   13-14. Modal spacing/typography/helper style disamakan L13A.
// ─────────────────────────────────────────────────────────────────────────────

// ── HELPER — Formatter & Parser Rupiah (pola identik L10A.js) ─────────────────
const formatRupiahDisplay = (value) => new Intl.NumberFormat('id-ID').format(value || 0);
const parseRupiahInput = (str) => parseFloat(String(str).replace(/[.,]/g, '')) || 0;

// ── HELPER — Currency Display Formatter (ACCOUNTING FORMAT, pola identik L13A.js) ─
// Tanda minus SELALU di depan "Rp" untuk nilai negatif (mis. "-Rp125.000"),
// bukan "Rp-125.000". Tidak mengubah logika kalkulasi apa pun — murni
// perbaikan format tampilan pada table values, readonly currency fields,
// computed values, dan total values.
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
const generateRowId = () => `l13c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// ── BUSINESS RULE — Simulation Formula (Temporary) — TIDAK BERUBAH ─────────────
const DEFAULT_CORPORATE_TAX_RATE = 0.22; // 22%

const computeIncomeTaxPayable = (taxableIncome) => (Number(taxableIncome) || 0) * DEFAULT_CORPORATE_TAX_RATE;
const computeTaxReductionFacility = (taxableIncome, reductionPercentage) =>
    computeIncomeTaxPayable(taxableIncome) * ((Number(reductionPercentage) || 0) / 100);

const buildEmptyL13CForm = () => ({
    grantDecisionNumber: '',
    grantDecisionDate: '',
    utilizationDecisionNumber: '',
    utilizationDecisionDate: '',
    facilityPeriod: '', // Float, Years — tanpa spinner, mendukung desimal
    utilizationYear: '',
    reductionPercentage: 0,
});

const validateL13CForm = (form) => {
    const errors = {};
    if (!form.grantDecisionNumber || !form.grantDecisionNumber.trim()) errors.grantDecisionNumber = 'Grant Decision Number wajib diisi.';
    if (!form.grantDecisionDate) errors.grantDecisionDate = 'Grant Decision Date wajib diisi.';
    return errors;
};

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

// ── HelperCaption — Standar caption "ⓘ Calculation: ..." (Global UI Contract
// Phase 2 §Helper Caption Standard, pola identik L13A.js) — grey, ditempatkan
// tepat di bawah field readonly, Bahasa Inggris.
const HelperCaption = ({ formula }) => (
    <p className="text-xs text-gray-400 mt-1">ⓘ Calculation: {formula}</p>
);

// ── HelperSource — varian caption untuk field yang nilainya berasal dari
// sumber lain (bukan hasil kalkulasi lokal), Blueprint L13C Revision §7:
// "ⓘ Source: Main Form → Section D → Item 9 (Taxable Income)". Style identik
// HelperCaption (grey, kecil) — hanya label prefix yang berbeda ("Source"
// alih-alih "Calculation").
const HelperSource = ({ path }) => (
    <p className="text-xs text-gray-400 mt-1">ⓘ Source: {path}</p>
);

// ─────────────────────────────────────────────────────────────────────────────
// DateField — Date Input + Calendar Button (biru) + Clear Date Button (merah).
// SATU icon kalender saja — indikator kalender bawaan browser pada
// <input type="date"> disembunyikan via CSS scoped class `l13c-date-input`
// (lihat DATE_INPUT_HIDE_NATIVE_ICON_CSS), pola identik L13A.js.
// ─────────────────────────────────────────────────────────────────────────────
const DateField = ({ label, required, value, onChange, error }) => {
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
                    className={`l13c-date-input flex-1 min-w-0 px-3 py-2 border rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : 'border-gray-300'}`}
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
// <input type="date"> — dirender sekali oleh L13CModal saat modal terbuka
// (pola identik L13A.js).
const DATE_INPUT_HIDE_NATIVE_ICON_CSS = `
.l13c-date-input::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }
.l13c-date-input::-webkit-inner-spin-button { display: none; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// YearPickerField — Year Picker (bukan Date Picker penuh), pola identik
// L13A.js/L13B.js. User TIDAK BOLEH mengetik tahun secara manual — input
// readOnly, satu-satunya cara mengisi nilai adalah mengklik tombol Calendar
// lalu memilih salah satu tahun pada panel grid 12 tahun (navigasi ‹ › antar
// rentang). Dipakai untuk Utilization Year — sepenuhnya independen, tanpa
// validasi silang terhadap field lain.
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

// ── FloatField — Facility Period (Years). Tanpa spinner (type="text" +
// inputMode="decimal"), user mengetik manual, mendukung angka desimal
// (2 / 2.5 / 3.75). Suffix "Years" di kanan field. TIDAK BERUBAH.
const FloatField = ({ label, value, onChange, suffix }) => (
    <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
        <div className="flex">
            <input
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(e) => {
                    const raw = e.target.value;
                    // Hanya izinkan digit dan SATU titik desimal — tanpa spinner, murni teks.
                    if (raw === '' || /^\d*\.?\d*$/.test(raw)) onChange(raw);
                }}
                placeholder="0.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-l-lg text-sm text-left focus:ring-2 focus:ring-blue-500"
            />
            <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-100 text-gray-500 text-sm whitespace-nowrap">{suffix}</span>
        </div>
    </div>
);

// ── PercentField — Number Input, suffix "%", LEFT ALIGN. TIDAK BERUBAH. ────────
const PercentField = ({ label, value, onChange }) => (
    <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
        <div className="flex">
            <input
                type="text"
                inputMode="decimal"
                value={value || ''}
                onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '' || /^\d*\.?\d*$/.test(raw)) onChange(raw === '' ? 0 : parseFloat(raw));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-lg text-sm text-left focus:ring-2 focus:ring-blue-500"
            />
            <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-100 text-gray-500 text-sm">%</span>
        </div>
    </div>
);

// ── ReadonlyCurrencyField — background abu-abu, tetap rata kiri. Prefix "Rp."
// SELALU statis (tidak pernah dilekati tanda minus) — tanda minus melekat
// pada ANGKA di dalam box angka (mis. "Rp." | "-129.653.123"), BUKAN pada
// prefix (mis. "-Rp." | "129.653.123"). Ini KHUSUS untuk InputGroup readonly
// di dalam modal — TIDAK memengaruhi format tabel (formatCurrencyDisplay pada
// tabel tetap menghasilkan string tunggal "-Rp129.653.123", tidak disentuh).
// Tidak mengubah logika kalkulasi apa pun — murni perbaikan format tampilan.
const ReadonlyCurrencyField = ({ label, value }) => (
    <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
        <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-200 text-gray-500 text-sm">Rp.</span>
            <div className="w-full px-3 py-2 border border-gray-200 rounded-r-lg text-sm text-left bg-gray-100 text-gray-600 min-h-[36px]">
                {formatRupiahDisplay(value)}
            </div>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MODAL — Add/Edit. Struktur & spacing disamakan L13A: bordered box per group
// dengan judul subsection (text-xs font-semibold text-gray-500 uppercase),
// body modal space-y-6, tiap box space-y-4.
// ─────────────────────────────────────────────────────────────────────────────
const L13CModal = ({ mode, formData, errors, taxableIncome, onFieldChange, onSave, onClose }) => {
    if (!mode) return null;
    const incomeTaxPayable = computeIncomeTaxPayable(taxableIncome);
    const taxReductionFacility = computeTaxReductionFacility(taxableIncome, formData.reductionPercentage);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <style>{DATE_INPUT_HIDE_NATIVE_ICON_CSS}</style>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800">Tax Facility for Corporate Income Tax Reduction</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>

                <div className="px-6 py-5 space-y-6 overflow-y-auto">
                    {/* Grant of Tax Facility Decision */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Grant of Tax Facility Decision</p>
                        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Decision Number <span className="text-red-500">*</span></label>
                                <input type="text" value={formData.grantDecisionNumber}
                                    onChange={(e) => onFieldChange('grantDecisionNumber', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500 ${errors.grantDecisionNumber ? 'border-red-400' : 'border-gray-300'}`} />
                                {errors.grantDecisionNumber && <p className="text-xs text-red-500 mt-1">{errors.grantDecisionNumber}</p>}
                            </div>
                            <DateField label="Decision Date" required value={formData.grantDecisionDate}
                                onChange={(v) => onFieldChange('grantDecisionDate', v)} error={errors.grantDecisionDate} />
                        </div>
                    </div>

                    {/* Facility Utilization Decision */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Facility Utilization Decision</p>
                        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
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

                    {/* Facility Details */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Facility Details</p>
                        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                            <FloatField label="Facility Period" suffix="Years" value={formData.facilityPeriod}
                                onChange={(v) => onFieldChange('facilityPeriod', v)} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Utilization Year</label>
                                <YearPickerField value={formData.utilizationYear}
                                    onChange={(v) => onFieldChange('utilizationYear', v)} />
                            </div>
                            <PercentField label="Reduction Percentage" value={formData.reductionPercentage}
                                onChange={(v) => onFieldChange('reductionPercentage', v)} />
                        </div>
                    </div>

                    {/* Corporate Income Tax Reduction Calculation */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Corporate Income Tax Reduction Calculation</p>
                        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                            <div>
                                <ReadonlyCurrencyField label="Taxable Income" value={taxableIncome} />
                                <HelperSource path="Main Form → Section D → Item 9 (Taxable Income)" />
                            </div>
                            <div>
                                <ReadonlyCurrencyField label="Income Tax Payable" value={incomeTaxPayable} />
                                <HelperCaption formula="Taxable Income × Default Corporate Income Tax Rate (22%)" />
                            </div>
                            <div>
                                <ReadonlyCurrencyField label="Tax Reduction Facility" value={taxReductionFacility} />
                                <HelperCaption formula="Income Tax Payable × Reduction Percentage" />
                            </div>
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
// L13C — Daftar Fasilitas Pengurangan PPh Badan
// Props: taxYear, tin, rows, onRowsChange (pola identik L10A/L13A),
// taxableIncome (company-wide readonly value — lihat catatan di atas).
// Signature TIDAK BERUBAH dari implementasi sebelumnya.
// ─────────────────────────────────────────────────────────────────────────────
const L13C = ({ taxYear, tin, rows, onRowsChange, taxableIncome, onTotalTaxReductionFacilityChange }) => {
    const safeRows = rows || [];

    const [modalMode, setModalMode] = useState(null);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [formData, setFormData] = useState(buildEmptyL13CForm());
    const [formErrors, setFormErrors] = useState({});
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const resetForm = useCallback(() => {
        setFormData(buildEmptyL13CForm());
        setFormErrors({});
    }, []);

    const handleOpenAdd = useCallback(() => {
        setModalMode('create'); setSelectedRowId(null); resetForm();
    }, [resetForm]);

    const handleOpenEdit = useCallback((row) => {
        setModalMode('edit'); setSelectedRowId(row.id);
        setFormData({ ...buildEmptyL13CForm(), ...row });
        setFormErrors({});
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalMode(null); setSelectedRowId(null); resetForm();
    }, [resetForm]);

    const handleFieldChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = useCallback(() => {
        const errors = validateL13CForm(formData);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        // HANYA raw input yang dipersist — field readonly (Taxable Income,
        // Income Tax Payable, Tax Reduction Facility) TIDAK PERNAH ditulis ke
        // row (Recalculate Contract — selalu dihitung ulang saat render/tabel).
        if (modalMode === 'create') {
            onRowsChange([...safeRows, { id: generateRowId(), ...formData }]);
        } else if (modalMode === 'edit') {
            onRowsChange(safeRows.map((row) => (row.id === selectedRowId ? { ...formData, id: selectedRowId } : row)));
        }
        setModalMode(null); setSelectedRowId(null); resetForm();
    }, [formData, modalMode, selectedRowId, safeRows, onRowsChange, resetForm]);

    const handleRequestDelete = useCallback((rowId) => setPendingDeleteId(rowId), []);
    const handleCancelDelete = useCallback(() => setPendingDeleteId(null), []);
    const handleConfirmDelete = useCallback(() => {
        onRowsChange(safeRows.filter((row) => row.id !== pendingDeleteId));
        setPendingDeleteId(null);
    }, [safeRows, pendingDeleteId, onRowsChange]);

    // Footer — Total Tax Reduction Facility = Σ seluruh row (derived, tidak dipersist)
    const totalTaxReductionFacility = useMemo(
        () => safeRows.reduce((sum, row) => sum + computeTaxReductionFacility(taxableIncome, row.reductionPercentage), 0),
        [safeRows, taxableIncome]
    );

    // ── MAIN FORM MAPPING — Total Tax Reduction Facility → Section E Question 16
    // (q16_payable_deduction_amount). L13C.js HANYA melaporkan total mentah
    // lewat callback (pola identik onTotalNetIncomeDeductionChange L13A.js /
    // onSectionBTotalChange L13B.js) — keputusan "kirim total vs kirim 0"
    // berdasarkan jawaban Yes/No Question 16 SEPENUHNYA menjadi tanggung jawab
    // MainFormBadan.js (Consumer), BUKAN L13C.js. Data Lampiran 13-C TIDAK
    // PERNAH dihapus hanya karena Question 16 dijawab "No" — hanya nilai yang
    // dikirim ke Main Form yang dipaksa 0 di sisi Consumer; begitu dijawab
    // "Yes" kembali, total yang sudah dihitung otomatis terkirim ulang tanpa
    // user perlu mengisi ulang data.
    useEffect(() => {
        if (onTotalTaxReductionFacilityChange) onTotalTaxReductionFacilityChange(totalTaxReductionFacility);
    }, [totalTaxReductionFacility, onTotalTaxReductionFacilityChange]);

    const rowCount = safeRows.length;

    return (
        <div className="bg-white">
            <div className="p-6 space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                        Lampiran 13-C — List of Corporate Income Tax Reduction Facility
                    </h2>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <ReadonlyField label="Tax Year" value={taxYear} />
                        <ReadonlyField label="TIN (NPWP)" value={tin} />
                    </div>
                </div>

                {/* Toolbar — Blueprint L13C: hanya tombol Add, tanpa Refresh/Export */}
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                    <Add fontSize="small" /> Add
                </button>

                {/* Table — MULTI-LEVEL HEADER mengikuti struktur Coretax (pola identik
                    L13A): Action/No. rowSpan, Grant of Tax Facility Decision colSpan
                    (Decision Number, Decision Date), Facility Utilization Decision
                    colSpan (Utilization Decision Number, Utilization Decision Date),
                    Facility Duration (Years)/Utilization Year/Reduction Percentage
                    standalone (rowSpan, tanpa child karena tidak ada sub-kolom),
                    Corporate Income Tax Reduction Calculation colSpan (Taxable Income,
                    Income Tax Payable, Tax Reduction Facility). Background kuning +
                    separator putih, body grid tipis abu-abu (#E5E7EB), sticky header +
                    freeze kolom Action & No dipertahankan. */}
                <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-[520px] overflow-y-auto">
                    <table className="min-w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-yellow-400 text-xs font-bold text-gray-800 uppercase">
                                <th rowSpan={2} style={{ position: 'sticky', top: 0, left: 0, zIndex: 21, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-20">Action</th>
                                <th rowSpan={2} style={{ position: 'sticky', top: 0, left: 80, zIndex: 21, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-12">No.</th>
                                <th colSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Grant of Tax Facility Decision</th>
                                <th colSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Facility Utilization Decision</th>
                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Facility Duration (Years)</th>
                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Utilization Year</th>
                                <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Reduction Percentage</th>
                                <th colSpan={3} style={{ position: 'sticky', top: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Corporate Income Tax Reduction Calculation</th>
                            </tr>
                            <tr className="bg-yellow-400 text-xs font-semibold text-gray-800 uppercase">
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Decision Number</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Decision Date</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Utilization Decision Number</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Utilization Decision Date</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Taxable Income</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Income Tax Payable</th>
                                <th style={{ position: 'sticky', top: 36, zIndex: 20 }} className="bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap">Tax Reduction Facility</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowCount === 0 && (
                                <tr><td colSpan={12} className="px-3 py-8 text-center text-gray-400 text-sm border border-gray-200">No data found.</td></tr>
                            )}
                            {safeRows.map((row, idx) => {
                                const incomeTaxPayable = computeIncomeTaxPayable(taxableIncome);
                                const taxReductionFacility = computeTaxReductionFacility(taxableIncome, row.reductionPercentage);
                                return (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td style={{ position: 'sticky', left: 0, zIndex: 10 }} className="bg-white px-3 py-2 whitespace-nowrap border border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleOpenEdit(row)} className="text-blue-600 hover:text-blue-800" title="Edit"><Edit fontSize="small" /></button>
                                                <button onClick={() => handleRequestDelete(row.id)} className="text-red-500 hover:text-red-700" title="Delete"><Delete fontSize="small" /></button>
                                            </div>
                                        </td>
                                        <td style={{ position: 'sticky', left: 80, zIndex: 10 }} className="bg-white px-3 py-2 text-gray-700 border border-gray-200">{idx + 1}</td>
                                        <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.grantDecisionNumber}</td>
                                        <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{formatTableDate(row.grantDecisionDate)}</td>
                                        <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.utilizationDecisionNumber}</td>
                                        <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{formatTableDate(row.utilizationDecisionDate)}</td>
                                        <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{row.facilityPeriod || 0} Years</td>
                                        <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{row.utilizationYear}</td>
                                        <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{row.reductionPercentage || 0}%</td>
                                        <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap bg-gray-50 border border-gray-200">{formatCurrencyDisplay(taxableIncome)}</td>
                                        <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap bg-gray-50 border border-gray-200">{formatCurrencyDisplay(incomeTaxPayable)}</td>
                                        <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap bg-gray-50 border border-gray-200 font-medium">{formatCurrencyDisplay(taxReductionFacility)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50 font-semibold">
                                <td colSpan={10} className="bg-gray-50 px-3 py-2 border border-gray-200"></td>
                                <td className="bg-gray-50 px-3 py-2 text-right text-gray-700 border border-gray-200 whitespace-nowrap">Total Tax Reduction Facility</td>
                                <td className={`px-3 py-2 text-right border border-gray-200 ${totalTaxReductionFacility < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                    {formatCurrencyDisplay(totalTaxReductionFacility)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <L13CModal
                mode={modalMode}
                formData={formData}
                errors={formErrors}
                taxableIncome={taxableIncome}
                onFieldChange={handleFieldChange}
                onSave={handleSave}
                onClose={handleCloseModal}
            />
            <DeleteConfirmDialog open={!!pendingDeleteId} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
        </div>
    );
};

export default L13C;