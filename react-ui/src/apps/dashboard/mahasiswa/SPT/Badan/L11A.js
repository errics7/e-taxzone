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
    { key: 'identityNumber', label: 'Nomor Identitas (NPWP/NIK/Lainnya)', type: 'text' },
    { key: 'recipientName',  label: 'Nama Penerima', type: 'text' },
    { key: 'address',        label: 'Alamat', type: 'text' },
    { key: 'date',            label: 'Tanggal', type: 'date' },
    { key: 'expenseType',    label: 'Bentuk dan Jenis Biaya', type: 'select', options: [
        'Biaya Promosi', 'Biaya Penjualan', 'Natura/Kenikmatan', 'Lainnya',
    ]},
    { key: 'amount',          label: 'Nilai', type: 'rp' },
    { key: 'description',    label: 'Keterangan', type: 'text' },
    { key: 'withholdingAmount', label: 'Jumlah PPh', type: 'rp' },
    { key: 'withholdingSlipNumber', label: 'Nomor Bukti Potong', type: 'text' },
];

const FIELDS_ENTERTAINMENT = [
    { key: 'date',    label: 'Tanggal', type: 'date' },
    { key: 'place',   label: 'Tempat', type: 'text' },
    { key: 'address', label: 'Alamat', type: 'text' },
    { key: 'type',    label: 'Jenis', type: 'select', options: ['Jamuan', 'Hiburan', 'Representasi', 'Lainnya'] },
    { key: 'amount',  label: 'Nilai', type: 'rp' },
    { key: 'partnerName',        label: 'Nama Relasi', type: 'text' },
    { key: 'partnerPosition',    label: 'Jabatan', type: 'text' },
    { key: 'partnerCompanyName', label: 'Nama Perusahaan Relasi', type: 'text' },
    { key: 'partnerBusinessType', label: 'Jenis Usaha Relasi', type: 'text' },
    { key: 'description', label: 'Keterangan', type: 'text' },
];

const FIELDS_BAD_DEBT = [
    { key: 'identityNumber', label: 'Nomor Identitas', type: 'text' },
    { key: 'debtorName',     label: 'Nama Debitur', type: 'text' },
    { key: 'address',         label: 'Alamat', type: 'text' },
    { key: 'creditCeiling',  label: 'Plafon Piutang', type: 'rp' },
    { key: 'uncollectibleDebt', label: 'Piutang Tidak Tertagih', type: 'rp' },
    { key: 'deductionMethod', label: 'Metode Pembebanan', type: 'select', options: ['Metode Langsung', 'Metode Tidak Langsung'] },
    { key: 'documentType', label: 'Jenis Dokumen Pembuktian', type: 'select', options: [
        'Daftar Piutang yang Nyata Tidak Dapat Ditagih', 'Bukti Penyerahan Perkara Pengadilan',
        'Perjanjian Penyelesaian Utang Piutang', 'Publikasi Media Massa', 'Lainnya',
    ]},
];

const FIELDS_FACILITIES = [
    { key: 'assetType',           label: 'Jenis Harta Berwujud', type: 'select', options: [
        'Bangunan', 'Kendaraan', 'Peralatan', 'Perabotan', 'Lainnya',
    ]},
    { key: 'acquisitionYear',     label: 'Tahun Perolehan', type: 'text' },
    { key: 'acquisitionValue',    label: 'Nilai Perolehan', type: 'rp' },
    // OPEN CLARIFICATION #4 (Blueprint L11 §1/§2) — MANUAL INPUT, belum computed,
    // belum ada link ke L9. Lihat Blueprint L11 §8 Cross Lampiran Contract.
    { key: 'depreciationPriorYear', label: 'Penyusutan s.d. Tahun Lalu (manual — OPEN CLARIFICATION #4)', type: 'rp' },
    { key: 'depreciationCurrentYear', label: 'Penyusutan Tahun Ini (manual — OPEN CLARIFICATION #4)', type: 'rp' },
];

const FIELDS_NPL = [
    { key: 'identityNumber', label: 'Nomor Identitas', type: 'text' },
    { key: 'debtorName',      label: 'Nama Debitur', type: 'text' },
    { key: 'address',          label: 'Alamat', type: 'text' },
    { key: 'creditBeginning', label: 'Nilai Kredit Kurang Lancar Awal Tahun', type: 'rp' },
    { key: 'creditEnding',    label: 'Nilai Kredit Kurang Lancar Akhir Tahun', type: 'rp' },
    { key: 'interestAmount', label: 'Jumlah Bunga pada Tahun Buku/Akrual', type: 'rp' },
    { key: 'category', label: 'Kategori', type: 'select', options: ['Kurang Lancar', 'Diragukan', 'Macet'] },
];

// ─── Generic field components ──────────────────────────────────────────────

const RpField = ({ label, value, onChange }) => {
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
            <div className="flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
                <span className="px-2 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-r border-gray-200 select-none">Rp</span>
                <input
                    ref={inputRef} type="text" inputMode="numeric" value={displayValue}
                    onFocus={handleFocus} onChange={handleChange} onBlur={handleBlur}
                    className="flex-1 px-3 py-2 text-sm text-right bg-white focus:outline-none min-w-0"
                />
            </div>
        </div>
    );
};

const TextField = ({ label, value, onChange, type = 'text' }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type} value={value || ''} onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
const DateField = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-2">
            <input
                type="date"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="button"
                onClick={() => onChange('')}
                title="Clear date"
                className="w-8 h-8 flex items-center justify-center rounded bg-red-600 hover:bg-red-700 text-white text-sm shrink-0"
            >
                &times;
            </button>
        </div>
    </div>
);

const renderField = (field, value, onChange) => {
    switch (field.type) {
        case 'rp':     return <RpField key={field.key} label={field.label} value={value} onChange={onChange} />;
        case 'date':   return <DateField key={field.key} label={field.label} value={value} onChange={onChange} />;
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
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Batal</button>
                    <button onClick={() => onSave(form)} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded">Simpan</button>
                </div>
            </div>
        </div>
    );
};

// ─── Generic Section: header + Add button + table + modal wiring ─────────────

const thCls = "px-3 py-2 text-left text-xs font-semibold text-gray-600 bg-gray-100 border-b border-gray-200 whitespace-nowrap";
const tdCls = "px-3 py-2 text-xs text-gray-700 border-b border-gray-100 whitespace-nowrap";

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
            <div className="overflow-x-auto" style={{ maxHeight: 420 }}>
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr>
                            <th className={thCls}>Action</th>
                            {fullFields.map(f => <th key={f.key} className={`${thCls} ${f.type === 'rp' ? 'text-right' : ''}`}>{f.label.split('(')[0].trim()}</th>)}
                            {computedColumns.map(c => <th key={c.key} className={`${thCls} text-right`}>{c.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr><td colSpan={fullFields.length + 1 + computedColumns.length} className="px-3 py-6 text-center text-gray-400 text-xs">No data found.</td></tr>
                        )}
                        {rows.map((r, idx) => (
                            <tr key={r.id || idx} className="hover:bg-gray-50">
                                <td className={tdCls}>
                                    <button onClick={() => setEditing(idx)} className="text-blue-600 hover:underline mr-2">Edit</button>
                                    <button onClick={() => handleDelete(idx)} className="text-red-600 hover:underline">Del</button>
                                </td>
                                {fullFields.map(f => (
                                    <td key={f.key} className={`${tdCls} ${f.type === 'rp' ? 'text-right font-mono' : ''}`}>
                                        {f.type === 'rp' ? fmt(r[f.key]) : (r[f.key] || '')}
                                    </td>
                                ))}
                                {computedColumns.map(c => (
                                    <td key={c.key} className={`${tdCls} text-right font-mono font-semibold`}>{fmt(c.compute(r))}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editing !== null && (
                <GenericRowModal
                    title={editing === 'new' ? `Tambah — ${title}` : `Edit — ${title}`}
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

const L11A = ({ taxYear, tin, l11aData, onL11ADataChange }) => {
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
                    Lampiran 11-A — Rekapitulasi Biaya-Biaya Tertentu
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
                            label: 'Penyusutan s.d. Tahun Ini',
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
                                <TextField label="Location Address" value={regionalBenefitData.locationAddress} onChange={setRegionalField('locationAddress')} />
                                <TextField label="Number Of Decree Of Specific Areas Determination" value={regionalBenefitData.decreeNumber} onChange={setRegionalField('decreeNumber')} />
                                <DateField label="Date Of Decree Of Specific Areas Determination" value={regionalBenefitData.decreeDate} onChange={setRegionalField('decreeDate')} />
                                <TextField label="Number Of Decree Of Extensification" value={regionalBenefitData.extDecreeNumber} onChange={setRegionalField('extDecreeNumber')} />
                                <DateField label="Date Of Decree Of Extensification" value={regionalBenefitData.extDecreeDate} onChange={setRegionalField('extDecreeDate')} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <RpField label="a. Tempat Tinggal" value={regionalBenefitData.costs.housing} onChange={setRegionalCost('housing')} />
                                <RpField label="b. Kesehatan" value={regionalBenefitData.costs.healthcare} onChange={setRegionalCost('healthcare')} />
                                <RpField label="c. Pendidikan" value={regionalBenefitData.costs.education} onChange={setRegionalCost('education')} />
                                <RpField label="d. Peribadatan" value={regionalBenefitData.costs.worship} onChange={setRegionalCost('worship')} />
                                <RpField label="e. Pengangkutan" value={regionalBenefitData.costs.transport} onChange={setRegionalCost('transport')} />
                                <RpField label="f. Olahraga" value={regionalBenefitData.costs.sports} onChange={setRegionalCost('sports')} />
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm flex justify-between">
                                <span className="text-gray-600">Jumlah Biaya (otomatis)</span>
                                <span className="font-mono font-semibold">Rp{fmt(jumlahBiayaRegional) || '0'}</span>
                            </div>
                            <GenericSection
                                title="IV.B Sarana &amp; Fasilitas (Daerah Tertentu)"
                                fields={FIELDS_FACILITIES}
                                rows={regionalBenefitData.facilitiesRows}
                                onRowsChange={setRegionalFacilitiesRows}
                                idPrefix="facregional"
                                nested
                                computedColumns={[{
                                    key: 'depreciationToDate',
                                    label: 'Penyusutan s.d. Tahun Ini',
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