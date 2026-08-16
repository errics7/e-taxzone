import React, { useState, useEffect, useMemo, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// LAMPIRAN 11-A — Rekapitulasi Biaya-Biaya Tertentu
// Sumber: Blueprint & Contract L11 (final, disepakati) + L11A.xlsx + Screenshot
// Coretax (Gambar74 dst).
//
// STRUKTUR (5 sub-bagian, seluruhnya RAW INPUT, tidak ada dependency ke
// Lampiran lain — Blueprint L11 §8 Cross Lampiran Contract):
//   I    — Nominatif Promosi & Natura/Kenikmatan     (promotionRows)
//   II   — Nominatif Entertainment                    (entertainmentRows)
//   III  — Piutang Tidak Tertagih                      (badDebtRows)
//   IV.A — Sarana & Fasilitas + Penyusutan              (facilitiesRows)
//   IV.B — Natura/Kenikmatan Daerah Tertentu            (regionalBenefitData, nested)
//   V    — Debitur Non-Performing Loan                  (nonPerformingLoanRows)
//
// OPEN CLARIFICATION (Blueprint L11 §1/§2 — TIDAK diasumsikan, placeholder aman):
//   OC-4 — Depreciation IV.A/IV.B: saat ini MANUAL INPUT (belum computed,
//          belum ada link ke L9 — lihat Blueprint L11 §8 Cross Lampiran Contract)
//   OC-6 — Cross-validation ke akun 5320/5321/5318 L1: TIDAK dibangun (murni
//          supporting schedule berdiri sendiri untuk saat ini)
//
// Opsi dropdown (Jenis Biaya, Metode Pembebanan, dsb.) bersifat ILUSTRATIF —
// menunggu daftar resmi dari Coretax/client, TIDAK mengunci business rule.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Helpers (pola identik L1D/L11B — tidak ada shared util module di project) ─

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};
const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;
// fmtRp — pembungkus tampilan tabel: tambah prefix "Rp" hanya saat ada nilai
// (sel kosong/nol tetap kosong). Tidak menyentuh fmt()/parse() asli.
const fmtRp = (v) => { const s = fmt(v); return s ? `Rp${s}` : ''; };

let _uid = 0;
const genId = (prefix) => `${prefix}-${Date.now()}-${_uid++}`;

// ─── Draft Compatibility Contract (Blueprint L11 §5) ──────────────────────────
// Export agar dapat dipakai SptTahunanBadan.js (pola identik buildInitialL9Data /
// mergeWithInitial L9.js — Pendekatan B, nested object, source of truth tunggal).

export const buildInitialL11AData = () => ({
    promotionRows: [],
    entertainmentRows: [],
    badDebtRows: [],
    facilitiesRows: [],
    regionalBenefitData: {
        locationAddress: '',
        decreeNumber: '', decreeDate: '',
        extDecreeNumber: '', extDecreeDate: '',
        costs: { housing: '', healthcare: '', education: '', worship: '', transport: '', sports: '' },
        facilitiesRows: [],
    },
    nonPerformingLoanRows: [],
});

export const mergeWithInitial = (draft) => {
    const base = buildInitialL11AData();
    return {
        ...base,
        promotionRows:         Array.isArray(draft?.promotionRows) ? draft.promotionRows : [],
        entertainmentRows:     Array.isArray(draft?.entertainmentRows) ? draft.entertainmentRows : [],
        badDebtRows:           Array.isArray(draft?.badDebtRows) ? draft.badDebtRows : [],
        facilitiesRows:        Array.isArray(draft?.facilitiesRows) ? draft.facilitiesRows : [],
        nonPerformingLoanRows: Array.isArray(draft?.nonPerformingLoanRows) ? draft.nonPerformingLoanRows : [],
        regionalBenefitData: {
            ...base.regionalBenefitData,
            ...(draft?.regionalBenefitData || {}),
            costs: { ...base.regionalBenefitData.costs, ...(draft?.regionalBenefitData?.costs || {}) },
            facilitiesRows: Array.isArray(draft?.regionalBenefitData?.facilitiesRows)
                ? draft.regionalBenefitData.facilitiesRows : [],
        },
    };
};

// ─── Field specs per section (dipakai GenericRowModal & GenericTable) ─────────
// type: 'text' | 'rp' | 'date' | 'select'

const FIELDS_PROMOTION = [
    { key: 'identityNumber', label: 'Identity Number (NPWP/NIK/Other)', type: 'text' },
    { key: 'recipientName',  label: 'Recipient Name', type: 'text' },
    { key: 'address',        label: 'Address', type: 'text' },
    { key: 'date',            label: 'Date', type: 'date' },
    { key: 'expenseType',    label: 'Form and Type of Expense', type: 'select', options: [
        'Biaya Promosi', 'Biaya Penjualan', 'Natura/Kenikmatan', 'Lainnya',
    ]},
    { key: 'amount',          label: 'Value', type: 'rp' },
    { key: 'description',    label: 'Description', type: 'text' },
    { key: 'withholdingAmount', label: 'Withholding Tax Amount', type: 'rp' },
    { key: 'withholdingSlipNumber', label: 'Withholding Slip Number', type: 'text' },
];

const FIELDS_ENTERTAINMENT = [
    { key: 'date',    label: 'Date', type: 'date' },
    { key: 'place',   label: 'Place', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'type',    label: 'Type', type: 'select', options: ['Jamuan', 'Hiburan', 'Representasi', 'Lainnya'] },
    { key: 'amount',  label: 'Value', type: 'rp' },
    { key: 'partnerName',        label: 'Partner Name', type: 'text' },
    { key: 'partnerPosition',    label: 'Position', type: 'text' },
    { key: 'partnerCompanyName', label: 'Partner Company Name', type: 'text' },
    { key: 'partnerBusinessType', label: 'Partner Business Type', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
];

const FIELDS_BAD_DEBT = [
    { key: 'identityNumber', label: 'Identity Number', type: 'text' },
    { key: 'debtorName',     label: 'Debtor Name', type: 'text' },
    { key: 'address',         label: 'Address', type: 'text' },
    { key: 'creditCeiling',  label: 'Credit Ceiling', type: 'rp' },
    { key: 'uncollectibleDebt', label: 'Uncollectible Debt', type: 'rp' },
    { key: 'deductionMethod', label: 'Deduction Method', type: 'select', options: ['Metode Langsung', 'Metode Tidak Langsung'] },
    { key: 'documentType', label: 'Type of Supporting Document', type: 'select', options: [
        'Daftar Piutang yang Nyata Tidak Dapat Ditagih', 'Bukti Penyerahan Perkara Pengadilan',
        'Perjanjian Penyelesaian Utang Piutang', 'Publikasi Media Massa', 'Lainnya',
    ]},
];

const FIELDS_FACILITIES = [
    { key: 'assetType',           label: 'Type of Tangible Asset', type: 'select', options: [
        'Bangunan', 'Kendaraan', 'Peralatan', 'Perabotan', 'Lainnya',
    ]},
    { key: 'acquisitionYear',     label: 'Year of Acquisition', type: 'year' },
    { key: 'acquisitionValue',    label: 'Acquisition Value', type: 'rp' },
    // OPEN CLARIFICATION #4 (Blueprint L11 §1/§2) — MANUAL INPUT, belum computed,
    // belum ada link ke L9. Lihat Blueprint L11 §8 Cross Lampiran Contract.
    { key: 'depreciationPriorYear', label: 'Depreciation up to Last Year (manual — OPEN CLARIFICATION #4)', type: 'rp' },
    { key: 'depreciationCurrentYear', label: 'Depreciation This Year (manual — OPEN CLARIFICATION #4)', type: 'rp' },
];

const FIELDS_NPL = [
    { key: 'identityNumber', label: 'Identity Number', type: 'text' },
    { key: 'debtorName',      label: 'Debtor Name', type: 'text' },
    { key: 'address',          label: 'Address', type: 'text' },
    { key: 'creditBeginning', label: 'Substandard Credit Value at Beginning of Year', type: 'rp' },
    { key: 'creditEnding',    label: 'Substandard Credit Value at End of Year', type: 'rp' },
    { key: 'interestAmount', label: 'Interest Amount for Fiscal Year/Accrual', type: 'rp' },
    { key: 'category', label: 'Category', type: 'select', options: ['Kurang Lancar', 'Diragukan', 'Macet'] },
];

// ─── Generic field components ──────────────────────────────────────────────

// disabled — FIX (L11A audit): default false, TIDAK mengubah pemanggilan
// existing manapun yang belum meneruskan prop ini (semua usage lain di file
// ini tetap bersih). Hanya dipakai oleh field IV.B Regional Benefit saat
// section dikunci (locked) — lihat CollapsibleSection IV.B di bawah.
const RpField = ({ label, value, onChange, disabled = false }) => {
    const inputRef  = useRef(null);
    const isFocused = useRef(false);
    const [displayValue, setDisplayValue] = useState(() => {
        const n = parse(value);
        return n !== 0 ? fmt(n) : (value || '');
    });

    useEffect(() => {
        if (!isFocused.current) {
            const n = parse(value);
            setDisplayValue(n !== 0 ? fmt(n) : (value || ''));
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFocus = () => {
        isFocused.current = true;
        const n = parse(value);
        setDisplayValue(n !== 0 ? String(n) : (value || ''));
    };
    const handleChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, '');
        setDisplayValue(digitsOnly === '' ? '' : Number(digitsOnly).toLocaleString('id-ID'));
        onChange(digitsOnly);
    };
    const handleBlur = () => {
        isFocused.current = false;
        const n = parse(value);
        setDisplayValue(n !== 0 ? fmt(n) : '');
    };

    return (
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
            <div className={`flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden ${disabled ? 'bg-gray-100' : ''}`}>
                <span className="px-2 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-r border-gray-200 select-none">Rp</span>
                <input
                    ref={inputRef} type="text" inputMode="numeric" value={displayValue}
                    onFocus={handleFocus} onChange={handleChange} onBlur={handleBlur}
                    disabled={disabled}
                    className={`flex-1 px-3 py-2 text-sm text-left focus:outline-none min-w-0 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                />
            </div>
        </div>
    );
};

const TextField = ({ label, value, onChange, type = 'text', disabled = false }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type} value={value || ''} onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
        />
    </div>
);

const SelectField = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <select
            value={value || ''} onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Please Select</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

// DateField — REUSE 100% pola L10D.js (native <input type="date"> + tombol
// silang/clear terpisah, bg-red-600, title="Clear date"). Tidak ada
// implementasi date-picker baru: kalender = native date-input browser
// (bawaan, bukan widget custom), silang = tombol yang sama persis dengan
// L10D (hanya rounded/padding mengikuti konvensi field lain di L11A agar
// konsisten dengan project — mekanisme & perilakunya identik L10D).
const DateField = ({ label, value, onChange, disabled = false }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-2">
            <input
                type="date"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
            />
            <button
                type="button"
                onClick={() => onChange('')}
                title="Clear date"
                disabled={disabled}
                className={`w-8 h-8 flex items-center justify-center rounded text-white text-sm shrink-0 ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
            >
                &times;
            </button>
        </div>
    </div>
);

// YearPickerField — Year Picker (bukan free-text) untuk "Year of Acquisition"
// (IV.A & IV.B). User TIDAK mengetik tahun secara manual — input readOnly,
// satu-satunya cara mengisi nilai adalah klik lalu memilih salah satu tahun
// pada panel (grid 12 tahun per halaman, navigasi ‹ › antar rentang). Nilai
// yang tersimpan TETAP `acquisitionYear` berupa string angka tahun murni
// (mis. "2021") — shape data tidak berubah. Pola identik YearPickerField L13A,
// diimplementasikan ulang di sini secara mandiri (tanpa dependency MUI baru,
// karena L11A belum memakai MUI icons — icon kalender pakai inline SVG).
const YearPickerField = ({ label, value, onChange }) => {
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
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative" ref={containerRef}>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        readOnly
                        value={value || ''}
                        placeholder="Select Year"
                        onClick={() => setOpen((o) => !o)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-left bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        title="Clear year"
                        className="w-8 h-8 flex items-center justify-center rounded bg-red-600 hover:bg-red-700 text-white text-sm shrink-0"
                    >
                        &times;
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
        </div>
    );
};

const renderField = (field, value, onChange) => {
    switch (field.type) {
        case 'rp':     return <RpField key={field.key} label={field.label} value={value} onChange={onChange} />;
        case 'date':   return <DateField key={field.key} label={field.label} value={value} onChange={onChange} />;
        case 'year':   return <YearPickerField key={field.key} label={field.label} value={value} onChange={onChange} />;
        case 'select': return <SelectField key={field.key} label={field.label} value={value} onChange={onChange} options={field.options} />;
        default:       return <TextField key={field.key} label={field.label} value={value} onChange={onChange} />;
    }
};

// ─── Generic Modal: Add/Edit satu row berdasarkan field spec ─────────────────

const GenericRowModal = ({ title, fields, row, onClose, onSave }) => {
    const [form, setForm] = useState(() => {
        const init = {};
        fields.forEach(f => { init[f.key] = row?.[f.key] ?? ''; });
        return init;
    });
    const setField = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4 overflow-y-auto">
                    {fields.map(f => renderField(f, form[f.key], setField(f.key)))}
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                    <button onClick={() => onSave(form)} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

// ─── Generic Section: header + Add button + table + modal wiring ─────────────

// Style tabel — UI mengikuti referensi tabel L13A.js (header kuning, border
// putih antar-header, border penuh pada body cell, sticky header + sticky
// kolom Action). HANYA style/className — tidak ada logic yang berubah.
const thCls = "px-3 py-2 text-center align-middle text-xs font-bold text-gray-800 uppercase bg-yellow-400 border border-white border-b-gray-300 whitespace-nowrap";
const tdCls = "px-3 py-2 text-xs text-gray-700 border border-gray-200 whitespace-nowrap";

// Sticky header (top) & sticky kolom Action (left) — pola identik L13A.
const thStickyTop    = { position: 'sticky', top: 0, zIndex: 20, backgroundColor: '#facc15' };
const thStickyAction = { position: 'sticky', top: 0, left: 0, zIndex: 21, backgroundColor: '#facc15' };
const tdStickyAction = { position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff' };

// ─── CollapsibleSection — REUSE 100% dari pola AssetSection di L9.js ──────────
// (styling, icon ▾/▸, default collapsed, transisi) — tidak ada implementasi
// collapse baru dibuat di sini, hanya disalin agar konsisten (tidak ada shared
// util module di project ini, setiap Lampiran berdiri sendiri — lihat catatan
// arsitektur L2.js/L11B.js).

const CollapsibleSection = ({ title, defaultExpanded = false, nested = false, children }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    return (
        <div className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${nested ? '' : 'mb-4'}`}>
            <button
                type="button"
                onClick={() => setExpanded(prev => !prev)}
                className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <span className={`text-sm font-bold uppercase tracking-wide ${nested ? 'text-blue-700' : 'text-blue-800'}`}>
                    {expanded ? '▾' : '▸'} {title}
                </span>
            </button>
            {expanded && <div className="p-5">{children}</div>}
        </div>
    );
};

// ─── Generic Section: Add button + table + modal wiring, dibungkus CollapsibleSection ─

const GenericSection = ({ title, fields, rows, onRowsChange, idPrefix, computedColumns = [], nested = false }) => {
    const [editing, setEditing] = useState(null); // null | 'new' | index

    const handleSave = (form) => {
        onRowsChange(prev => {
            if (editing === 'new') return [...prev, { id: genId(idPrefix), ...form }];
            return prev.map((r, i) => i === editing ? { ...r, ...form } : r);
        });
        setEditing(null);
    };
    const handleDelete = (idx) => onRowsChange(prev => prev.filter((_, i) => i !== idx));

    const fullFields = fields;

    return (
        <CollapsibleSection title={title} nested={nested}>
            <div className="flex justify-end mb-3">
                <button onClick={() => setEditing('new')} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700">+ Add</button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-x-auto overflow-y-auto" style={{ maxHeight: 420 }}>
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr>
                            <th className={thCls} style={thStickyAction}>Action</th>
                            {fullFields.map(f => <th key={f.key} className={thCls} style={thStickyTop}>{f.label.split('(')[0].trim()}</th>)}
                            {computedColumns.map(c => <th key={c.key} className={thCls} style={thStickyTop}>{c.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr><td colSpan={fullFields.length + 1 + computedColumns.length} className="px-3 py-6 text-center text-gray-400 text-xs border border-gray-200">No data found.</td></tr>
                        )}
                        {rows.map((r, idx) => (
                            <tr key={r.id || idx} className="hover:bg-gray-50">
                                <td className={tdCls} style={tdStickyAction}>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEditing(idx)}
                                            title="Edit"
                                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(idx)}
                                            title="Delete"
                                            className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                {fullFields.map(f => (
                                    <td key={f.key} className={`${tdCls} ${f.type === 'rp' ? 'text-right font-mono' : ''}`}>
                                        {f.type === 'rp' ? fmtRp(r[f.key]) : (r[f.key] || '')}
                                    </td>
                                ))}
                                {computedColumns.map(c => (
                                    <td key={c.key} className={`${tdCls} text-right font-mono font-semibold`}>{fmtRp(c.compute(r))}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editing !== null && (
                <GenericRowModal
                    title={editing === 'new' ? `Add — ${title}` : `Edit — ${title}`}
                    fields={fields}
                    row={editing === 'new' ? null : rows[editing]}
                    onClose={() => setEditing(null)}
                    onSave={handleSave}
                />
            )}
        </CollapsibleSection>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
//
// Props:
//   taxYear, tin       — header (pola identik L1D)
//   l11aData            — restore draft, SELALU objek lengkap via mergeWithInitial
//                         (Draft Compatibility Contract, Blueprint L11 §5)
//   onL11ADataChange     — emit gabungan raw input ke parent (1 callback,
//                         Blueprint L11 §3 Penyederhanaan Callback)

// regionalBenefitLocked, onConfirmRegionalBenefit, onEditRegionalBenefit —
// TAMBAHAN untuk UX Save→Lock→Edit IV.B (lihat SptTahunanBadan.js, pemilik
// state locked/confirmed sesungguhnya — komponen ini murni UI + memicu
// callback). Semua default aman (locked=false, callback opsional) supaya
// TIDAK mematahkan pemanggilan lain yang belum meneruskan prop ini.
const L11A = ({ taxYear, tin, l11aData, onL11ADataChange, regionalBenefitLocked = false, onConfirmRegionalBenefit, onEditRegionalBenefit }) => {
    const initial = useMemo(() => mergeWithInitial(l11aData), []); // eslint-disable-line react-hooks/exhaustive-deps

    const [promotionRows, setPromotionRows]         = useState(initial.promotionRows);
    const [entertainmentRows, setEntertainmentRows] = useState(initial.entertainmentRows);
    const [badDebtRows, setBadDebtRows]             = useState(initial.badDebtRows);
    const [facilitiesRows, setFacilitiesRows]       = useState(initial.facilitiesRows);
    const [regionalBenefitData, setRegionalBenefitData] = useState(initial.regionalBenefitData);
    const [nonPerformingLoanRows, setNonPerformingLoanRows] = useState(initial.nonPerformingLoanRows);

    // Anti-loop guard — pola identik skipRestoreA di L1A/L1D & L11B.
    const skipRestore = useRef(false);

    useEffect(() => {
        if (skipRestore.current) { skipRestore.current = false; return; }
        if (l11aData) {
            const merged = mergeWithInitial(l11aData);
            setPromotionRows(merged.promotionRows);
            setEntertainmentRows(merged.entertainmentRows);
            setBadDebtRows(merged.badDebtRows);
            setFacilitiesRows(merged.facilitiesRows);
            setRegionalBenefitData(merged.regionalBenefitData);
            setNonPerformingLoanRows(merged.nonPerformingLoanRows);
        }
    }, [l11aData]); // eslint-disable-line react-hooks/exhaustive-deps

    const combinedData = useMemo(() => ({
        promotionRows, entertainmentRows, badDebtRows, facilitiesRows,
        regionalBenefitData, nonPerformingLoanRows,
    }), [promotionRows, entertainmentRows, badDebtRows, facilitiesRows, regionalBenefitData, nonPerformingLoanRows]);

    useEffect(() => {
        if (onL11ADataChange) {
            skipRestore.current = true;
            onL11ADataChange(combinedData);
        }
    }, [combinedData, onL11ADataChange]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── IV.B — Save→Lock→Edit UX (tombol SIMPAN/EDIT). State locked itu
    // sendiri dikelola PARENT (SptTahunanBadan.js) via prop
    // `regionalBenefitLocked` — komponen ini hanya menyimpan status
    // in-flight/error tombol secara lokal. Global Save Draft TIDAK memanggil
    // handler ini sama sekali (lihat MainFormBadan.js) — SATU-SATUNYA jalur
    // yang mengubah `regionalBenefitLocked` adalah klik tombol di sini.
    const [confirmSaving, setConfirmSaving] = useState(false);
    const [confirmError, setConfirmError] = useState('');

    const handleSimpanRegionalBenefit = async () => {
        if (!onConfirmRegionalBenefit) return;
        setConfirmSaving(true);
        setConfirmError('');
        try {
            await onConfirmRegionalBenefit();
            // Sukses → parent (SptTahunanBadan.js) yang mengubah
            // regionalBenefitLocked jadi true; komponen ini tidak menebak
            // sendiri (kontrak §B3: hanya lock SETELAH persistence sukses).
        } catch (err) {
            setConfirmError(err?.message || 'Gagal menyimpan IV.B Regional Benefit.');
        } finally {
            setConfirmSaving(false);
        }
    };

    const handleEditRegionalBenefit = () => {
        setConfirmError('');
        if (onEditRegionalBenefit) onEditRegionalBenefit();
    };

    // ── IV.B — regional benefit: field tetap + tabel nested fasilitas ─────────
    const setRegionalField = (key) => (val) => setRegionalBenefitData(prev => ({ ...prev, [key]: val }));
    const setRegionalCost  = (key) => (val) => setRegionalBenefitData(prev => ({ ...prev, costs: { ...prev.costs, [key]: val } }));
    const setRegionalFacilitiesRows = (updater) => setRegionalBenefitData(prev => ({
        ...prev,
        facilitiesRows: typeof updater === 'function' ? updater(prev.facilitiesRows) : updater,
    }));

    const jumlahBiayaRegional = useMemo(() => {
        const c = regionalBenefitData.costs || {};
        return ['housing','healthcare','education','worship','transport','sports']
            .reduce((s, k) => s + parse(c[k]), 0);
    }, [regionalBenefitData.costs]);

    return (
        <div className="p-6 space-y-6">
            {/* ── HEADER — identik L1D ─────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 11-A — Recapitulation of Certain Expenses
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tax Year</label>
                        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
                            {taxYear || <span className="text-gray-400">—</span>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Collector TIN</label>
                        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
                            {tin || <span className="text-gray-400">—</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── I. Nominatif Promosi & Natura/Kenikmatan ────────────────── */}
            <GenericSection
                title="I. Nomination List of Promotion Expenses and Benefit in Kind"
                fields={FIELDS_PROMOTION}
                rows={promotionRows}
                onRowsChange={setPromotionRows}
                idPrefix="promo"
            />

            {/* ── II. Nominatif Entertainment ──────────────────────────────── */}
            <GenericSection
                title="II. Nomination List of Entertainment Expenses"
                fields={FIELDS_ENTERTAINMENT}
                rows={entertainmentRows}
                onRowsChange={setEntertainmentRows}
                idPrefix="ent"
            />

            {/* ── III. Piutang Tidak Tertagih ──────────────────────────────── */}
            <GenericSection
                title="III. List of Uncollectible Debt"
                fields={FIELDS_BAD_DEBT}
                rows={badDebtRows}
                onRowsChange={setBadDebtRows}
                idPrefix="baddebt"
            />

            {/* ── IV. Recapitulation for Taxpayer Who Provides Benefit in Kinds ── */}
            <CollapsibleSection title="IV. Recapitulation for Taxpayer Who Provides Benefit in Kinds">
                <div className="space-y-4">
                    {/* IV.A — sub-section collapsible (nested) */}
                    <GenericSection
                        title="IV.A List of Facilities as Intended in Article 4 Verse (5) PMK No. 167/PMK.03/2018 and Its Depreciation"
                        fields={FIELDS_FACILITIES}
                        rows={facilitiesRows}
                        onRowsChange={setFacilitiesRows}
                        idPrefix="fac"
                        nested
                        computedColumns={[{
                            key: 'depreciationToDate',
                            label: 'Depreciation to Date',
                            compute: (r) => parse(r.depreciationPriorYear) + parse(r.depreciationCurrentYear),
                        }]}
                    />

                    {/* IV.B — sub-section collapsible (nested) */}
                    <CollapsibleSection
                        title="IV.B Recapitulation of Replacements or Rewards in the Form of Natura or Benefit in Kinds Given with Respect to the Execution of Work in Specific Areas"
                        nested
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <TextField label="Location Address" value={regionalBenefitData.locationAddress} onChange={setRegionalField('locationAddress')} disabled={regionalBenefitLocked} />
                                <TextField label="Number Of Decree Of Specific Areas Determination" value={regionalBenefitData.decreeNumber} onChange={setRegionalField('decreeNumber')} disabled={regionalBenefitLocked} />
                                <DateField label="Date Of Decree Of Specific Areas Determination" value={regionalBenefitData.decreeDate} onChange={setRegionalField('decreeDate')} disabled={regionalBenefitLocked} />
                                <TextField label="Number Of Decree Of Extensification" value={regionalBenefitData.extDecreeNumber} onChange={setRegionalField('extDecreeNumber')} disabled={regionalBenefitLocked} />
                                <DateField label="Date Of Decree Of Extensification" value={regionalBenefitData.extDecreeDate} onChange={setRegionalField('extDecreeDate')} disabled={regionalBenefitLocked} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <RpField label="a. Housing" value={regionalBenefitData.costs.housing} onChange={setRegionalCost('housing')} disabled={regionalBenefitLocked} />
                                <RpField label="b. Healthcare" value={regionalBenefitData.costs.healthcare} onChange={setRegionalCost('healthcare')} disabled={regionalBenefitLocked} />
                                <RpField label="c. Education" value={regionalBenefitData.costs.education} onChange={setRegionalCost('education')} disabled={regionalBenefitLocked} />
                                <RpField label="d. Worship" value={regionalBenefitData.costs.worship} onChange={setRegionalCost('worship')} disabled={regionalBenefitLocked} />
                                <RpField label="e. Transportation" value={regionalBenefitData.costs.transport} onChange={setRegionalCost('transport')} disabled={regionalBenefitLocked} />
                                <RpField label="f. Sports" value={regionalBenefitData.costs.sports} onChange={setRegionalCost('sports')} disabled={regionalBenefitLocked} />
                            </div>
                            {/* Tombol SIMPAN/EDIT — persis di antara "f. Sports" dan "Total Cost
                                (automatic)" sesuai kontrak posisi UI (§B10). */}
                            <div className="flex flex-col items-center gap-1">
                                {regionalBenefitLocked ? (
                                    <button
                                        type="button"
                                        onClick={handleEditRegionalBenefit}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        EDIT
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSimpanRegionalBenefit}
                                        disabled={confirmSaving}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        {confirmSaving ? 'Menyimpan…' : 'SIMPAN'}
                                    </button>
                                )}
                                {confirmError && <p className="text-xs text-red-500">{confirmError}</p>}
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm flex justify-between">
                                <span className="text-gray-600">Total Cost (automatic)</span>
                                <span className="font-mono font-semibold">Rp{fmt(jumlahBiayaRegional) || '0'}</span>
                            </div>
                            <GenericSection
                                title="IV.B Facilities (Specific Areas)"
                                fields={FIELDS_FACILITIES}
                                rows={regionalBenefitData.facilitiesRows}
                                onRowsChange={setRegionalFacilitiesRows}
                                idPrefix="facregional"
                                nested
                                computedColumns={[{
                                    key: 'depreciationToDate',
                                    label: 'Depreciation to Date',
                                    compute: (r) => parse(r.depreciationPriorYear) + parse(r.depreciationCurrentYear),
                                }]}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            </CollapsibleSection>

            {/* ── V. Non-Performing Loan Debtors ───────────────────────────── */}
            <GenericSection
                title="V. Non-Performing Loan Debtors List"
                fields={FIELDS_NPL}
                rows={nonPerformingLoanRows}
                onRowsChange={setNonPerformingLoanRows}
                idPrefix="npl"
            />
        </div>
    );
};

export default L11A;