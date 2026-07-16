import React, { useState, useMemo, useEffect, useRef } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Catatan: fmt/parse/ReadonlyField/RpField/SelectField/TextField di bawah ini
// adalah COPY dari L2.js (L2.js sendiri meng-copy dari L1A/L1C). Tidak ada
// shared util module di project ini secara sengaja — setiap Lampiran berdiri
// sendiri (lihat L2.js §catatan arsitektur). Helper ini TIDAK di-export oleh
// L2 sehingga tidak bisa di-import langsung; menyalin pola yang identik adalah
// opsi paling konsisten dengan arsitektur yang sudah berjalan.

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};

const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

// RpField: input nominal dengan prefix visual "Rp" + format angka Indonesia.
// Identik dengan RpField di L2.js (live formatting, cursor-preserving).
const RpField = ({ label, value, onChange, placeholder = '0', required = false }) => {
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
        const input     = e.target;
        const raw       = input.value;
        const cursorPos = input.selectionStart;

        const digitsOnly = raw.replace(/\D/g, '');
        const formatted = digitsOnly === '' ? '' : Number(digitsOnly).toLocaleString('id-ID');
        const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, '').length;

        setDisplayValue(formatted);
        onChange(digitsOnly);

        requestAnimationFrame(() => {
            if (!inputRef.current) return;
            if (digitsBeforeCursor === 0) {
                inputRef.current.setSelectionRange(0, 0);
                return;
            }
            let digitCount = 0;
            let newPos     = formatted.length;
            for (let i = 0; i < formatted.length; i++) {
                if (/\d/.test(formatted[i])) {
                    digitCount++;
                    if (digitCount === digitsBeforeCursor) {
                        newPos = i + 1;
                        break;
                    }
                }
            }
            inputRef.current.setSelectionRange(newPos, newPos);
        });
    };

    const handleBlur = () => {
        isFocused.current = false;
        const n = parse(value);
        setDisplayValue(n !== 0 ? fmt(n) : '');
    };

    return (
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
                <span className="px-2 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-r border-gray-200 select-none whitespace-nowrap">Rp</span>
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2 text-sm text-right bg-white focus:outline-none min-w-0"
                />
            </div>
        </div>
    );
};

const SelectField = ({ label, value, onChange, options, required = false }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    </div>
);

const TextField = ({ label, value, onChange, placeholder = '', maxLength, required = false }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
    </div>
);

// DateField — BARU, tidak ada presedan di L2 (L2 tidak punya kolom tanggal).
// Dibutuhkan untuk "Date of Transaction" (Part A) dan "Withholding Slip/SSP/SSPCP
// Date" (Part B) — keduanya field tanggal sederhana (Blueprint L3 Final).
const DateField = ({ label, value, onChange, required = false }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <input
            type="date"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
    </div>
);

// ─── Static Options ───────────────────────────────────────────────────────────
// PERLU KONFIRMASI (Blueprint L3 Final §4 — Master Data & beberapa perilaku
// field: ⚠️ Pending Confirmation). Daftar berikut placeholder sementara.
// Struktur {value, label} generic — mengganti isi array ini TIDAK memerlukan
// refactor apa pun di tempat lain.

// TODO: Replace with backend/master data
const COUNTRY_OPTIONS = [
    { value: '',   label: 'Please select' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'SG', label: 'Singapore' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'US', label: 'United States' },
    { value: 'JP', label: 'Japan' },
    { value: 'CN', label: 'China' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'HK', label: 'Hong Kong' },
];

// TODO: Replace with backend/master data
const INCOME_CODE_OPTIONS = [
    { value: '', label: 'Please select' },
    { value: '01', label: '01 — Dividend' },
    { value: '02', label: '02 — Interest' },
    { value: '03', label: '03 — Royalty' },
    { value: '04', label: '04 — Business Profit' },
    { value: '05', label: '05 — Service Fee' },
    { value: '99', label: '99 — Other' },
];

// TODO: Replace with backend/master data
const CURRENCY_OPTIONS = [
    { value: '',    label: 'Please select' },
    { value: 'USD', label: 'USD' },
    { value: 'SGD', label: 'SGD' },
    { value: 'JPY', label: 'JPY' },
    { value: 'EUR', label: 'EUR' },
    { value: 'CNY', label: 'CNY' },
    { value: 'MYR', label: 'MYR' },
];

// TODO: Replace with backend/master data
const TAX_TYPE_OPTIONS = [
    { value: '',     label: 'Please select' },
    { value: 'PPh21', label: 'PPh Pasal 21' },
    { value: 'PPh22', label: 'PPh Pasal 22' },
    { value: 'PPh23', label: 'PPh Pasal 23' },
    { value: 'PPh26', label: 'PPh Pasal 26' },
    { value: 'PPh4_2', label: 'PPh Pasal 4 ayat (2)' },
];

// ─── Row helpers (generic, identik pola L2) ────────────────────────────────────

const updateRowById = (rows, id, patch) => rows.map(r => (r.id === id ? { ...r, ...patch } : r));
const removeRowById  = (rows, id) => rows.filter(r => r.id !== id);

const buildEmptyPartARow = () => ({
    id: crypto.randomUUID(),
    name: '',
    countryCode: '',
    transactionDate: '',
    incomeCode: '',
    netIncomeRp: '',
    taxPayableOverseasRp: '',
    currency: '',
    foreignCurrencyAmount: '',
    taxCreditCalculatedRp: '',
});

const buildEmptyPartBRow = () => ({
    id: crypto.randomUUID(),
    name: '',
    tin: '',
    taxType: '',
    taxBaseRp: '',
    taxWithheldRp: '',
    slipNumber: '',
    slipDate: '',
});

// ─── Helper Perhitungan — SATU-SATUNYA lokasi business rule L3 ────────────────
// Blueprint L3 Final §2/§5: hitungL3() HANYA ada di sini. SptTahunanBadan.js
// TIDAK punya salinan formula — parent hanya menerima hasil akhir (Part B.c)
// lewat callback onCreditAmountChange (pola identik onA10Change milik L1A/L1C/L1D).
//
// Sumber: L3.xlsx — AP28(a)=SUM(AP20:AP27), AP29(b)=input manual,
// AP30(c)=AP28-AP29; AE48(a)=SUM(AE39:AE47), AE49(b)=AP30, AE50(c)=AE48-AE49.
// D51: "Pindahkan JUMLAH KREDIT PAJAK kolom 6 field C ke Formulir Induk Bagian E.13"
// → Part B.c adalah nilai yang dikirim ke Main Form Section E Point 13.
const hitungL3 = (rowsA, rowsB, priorYearCreditRefund) => {
    const partA_a = (rowsA || []).reduce((sum, r) => sum + parse(r.taxCreditCalculatedRp), 0);
    const partA_b = parse(priorYearCreditRefund);
    const partA_c = partA_a - partA_b;

    const partB_a = (rowsB || []).reduce((sum, r) => sum + parse(r.taxWithheldRp), 0);
    const partB_b = partA_c; // diisi dari Bagian A.c — bukan input manual
    const partB_c = partB_a - partB_b;

    return {
        partA: { a: partA_a, b: partA_b, c: partA_c },
        partB: { a: partB_a, b: partB_b, c: partB_c },
    };
};

// ─── Modal Part A — mode create/edit (Blueprint L3 Final §11) ─────────────────
// Berbeda dari L2 Part A (edit-only): L3 Bagian A memang punya tombol +Add
// sendiri di Excel/screenshot Coretax (Gambar50/Image1, Gambar52/Image2), jadi
// Part A di sini full CRUD, sama seperti Part B.

const ModalPartA = ({ mode, row, onClose, onSave }) => {
    const initial = row || buildEmptyPartARow();
    const [form, setForm] = useState({
        name:                   initial.name || '',
        countryCode:            initial.countryCode || '',
        transactionDate:        initial.transactionDate || '',
        incomeCode:             initial.incomeCode || '',
        netIncomeRp:            initial.netIncomeRp || '',
        taxPayableOverseasRp:   initial.taxPayableOverseasRp || '',
        currency:               initial.currency || '',
        foreignCurrencyAmount:  initial.foreignCurrencyAmount || '',
        taxCreditCalculatedRp:  initial.taxCreditCalculatedRp || '',
    });
    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    // Validasi — mengikuti tanda (*) pada Image2/Gambar52. "Amount in Foreign
    // Currency" sengaja TIDAK wajib (tidak bertanda * pada screenshot Coretax).
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name wajib diisi.';
    if (!form.countryCode) errors.countryCode = 'Country Code wajib dipilih.';
    if (!form.transactionDate) errors.transactionDate = 'Date of Transaction wajib diisi.';
    if (!form.incomeCode) errors.incomeCode = 'Income Code wajib dipilih.';
    if (!form.currency) errors.currency = 'Currency wajib dipilih.';
    const hasError = Object.keys(errors).length > 0;

    const handleSave = () => {
        if (hasError) return;
        onSave({ ...form });
    };

    const title = mode === 'create' ? 'Add Income from Overseas' : 'Edit Income from Overseas';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
                </div>

                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <TextField label="Name" value={form.name} onChange={set('name')} required />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <SelectField label="Country Code" value={form.countryCode} onChange={set('countryCode')} options={COUNTRY_OPTIONS} required />
                            {errors.countryCode && <p className="text-xs text-red-500 mt-1">{errors.countryCode}</p>}
                        </div>
                        <div>
                            <DateField label="Date of Transaction" value={form.transactionDate} onChange={set('transactionDate')} required />
                            {errors.transactionDate && <p className="text-xs text-red-500 mt-1">{errors.transactionDate}</p>}
                        </div>
                    </div>

                    <div>
                        <SelectField label="Income Code" value={form.incomeCode} onChange={set('incomeCode')} options={INCOME_CODE_OPTIONS} required />
                        {errors.incomeCode && <p className="text-xs text-red-500 mt-1">{errors.incomeCode}</p>}
                    </div>

                    <RpField label="Net Income" value={form.netIncomeRp} onChange={set('netIncomeRp')} required />

                    {/* Tax Payable/Paid in Overseas — PERLU KONFIRMASI (Blueprint L3 Final §4):
                        diperlakukan sebagai input manual karena Excel tidak menunjukkan formula
                        konversi apa pun dari Amount in Foreign Currency × kurs. */}
                    <RpField label="Tax Payable/Paid in Overseas" value={form.taxPayableOverseasRp} onChange={set('taxPayableOverseasRp')} required />

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <SelectField label="Currency" value={form.currency} onChange={set('currency')} options={CURRENCY_OPTIONS} required />
                            {errors.currency && <p className="text-xs text-red-500 mt-1">{errors.currency}</p>}
                        </div>
                        <TextField label="Amount in Foreign Currency" value={form.foreignCurrencyAmount} onChange={set('foreignCurrencyAmount')} placeholder="Opsional" />
                    </div>

                    <RpField label="Tax Credit That Can be Calculated" value={form.taxCreditCalculatedRp} onChange={set('taxCreditCalculatedRp')} required />
                </div>

                <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors">
                        Close
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={hasError}
                        className={`px-4 py-2 text-sm rounded text-white transition-colors ${hasError ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Modal Part B — mode create/edit (identik pola ModalPartB L2) ─────────────

const ModalPartB = ({ mode, row, onClose, onSave }) => {
    const initial = row || buildEmptyPartBRow();
    const [form, setForm] = useState({
        name:        initial.name || '',
        tin:         initial.tin || '',
        taxType:     initial.taxType || '',
        taxBaseRp:   initial.taxBaseRp || '',
        taxWithheldRp: initial.taxWithheldRp || '',
        slipNumber:  initial.slipNumber || '',
        slipDate:    initial.slipDate || '',
    });
    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    // Validasi — mengikuti tanda (*) pada Image3/Gambar53. Tax Base & Income Tax
    // Withheld TIDAK bertanda * pada screenshot Coretax, jadi tidak wajib di sini.
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name wajib diisi.';
    if (!form.tin.trim()) errors.tin = 'TIN wajib diisi.';
    if (!form.taxType) errors.taxType = 'Tax Type wajib dipilih.';
    if (!form.slipNumber.trim()) errors.slipNumber = 'Withholding Slip/SSP/SSPCP Number wajib diisi.';
    if (!form.slipDate) errors.slipDate = 'Withholding Slip/SSP/SSPCP Date wajib diisi.';
    const hasError = Object.keys(errors).length > 0;

    const handleSave = () => {
        if (hasError) return;
        onSave({ ...form });
    };

    const title = mode === 'create'
        ? 'Income Tax Withheld by Other Parties'
        : 'Edit Income Tax Withheld by Other Parties';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
                </div>

                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <TextField label="Name" value={form.name} onChange={set('name')} required />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <TextField label="TIN" value={form.tin} onChange={set('tin')} maxLength={50} required />
                        {errors.tin && <p className="text-xs text-red-500 mt-1">{errors.tin}</p>}
                    </div>
                    <div>
                        <SelectField label="Tax Type" value={form.taxType} onChange={set('taxType')} options={TAX_TYPE_OPTIONS} required />
                        {errors.taxType && <p className="text-xs text-red-500 mt-1">{errors.taxType}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <RpField label="Tax Base" value={form.taxBaseRp} onChange={set('taxBaseRp')} />
                        <RpField label="Income Tax Withheld" value={form.taxWithheldRp} onChange={set('taxWithheldRp')} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <TextField label="Withholding Slip/SSP/SSPCP Number" value={form.slipNumber} onChange={set('slipNumber')} required />
                            {errors.slipNumber && <p className="text-xs text-red-500 mt-1">{errors.slipNumber}</p>}
                        </div>
                        <div>
                            <DateField label="Withholding Slip/SSP/SSPCP Date" value={form.slipDate} onChange={set('slipDate')} required />
                            {errors.slipDate && <p className="text-xs text-red-500 mt-1">{errors.slipDate}</p>}
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors">
                        Close
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={hasError}
                        className={`px-4 py-2 text-sm rounded text-white transition-colors ${hasError ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
// Blueprint L3 Final:
//   • rowsA/rowsB = array of full object, id stabil via crypto.randomUUID() — TIDAK
//     ada merge dengan reference/roster data (sama seperti L2, berbeda dari L1A/L1C/L1D).
//   • Part A & Part B sama-sama full CRUD (Add/Edit/Delete) — beda dari L2 yang Part
//     A-nya edit-only (L3 Bagian A memang punya tombol +Add sendiri di Coretax).
//   • priorYearCreditRefund = SATU nilai (bukan array) — raw input manual untuk
//     "PENGEMBALIAN PENGURANGAN KREDIT PAJAK LUAR NEGERI (PPh PASAL 24) YANG TELAH
//     DIPERHITUNGKAN TAHUN LALU" (Bagian A.b di Excel).
//   • Source of truth = rowsA, rowsB, priorYearCreditRefund SAJA. Part A.a/c, Part
//     B.a/b/c adalah derived value (useMemo, hitungL3()) — TIDAK PERNAH disimpan
//     ke state terpisah (Blueprint L3 Final §2 — "Source of Truth").
//   • Hasil akhir (Part B.c) dikirim ke parent lewat onCreditAmountChange — pola
//     identik onA10Change milik L1A/L1C/L1D. Parent (SptTahunanBadan.js) TIDAK
//     punya salinan hitungL3() — nol duplikasi formula bisnis (Blueprint L3 Final §6).

const L3 = ({
    l3RowsA = [],
    l3RowsB = [],
    priorYearCreditRefund = '',
    onRowsAChange,
    onRowsBChange,
    onPriorYearCreditRefundChange,
    onCreditAmountChange,
    taxYear,
    tin,
}) => {
    const [rowsA, setRowsA]               = useState(() => (Array.isArray(l3RowsA) ? l3RowsA : []));
    const [rowsB, setRowsB]               = useState(() => (Array.isArray(l3RowsB) ? l3RowsB : []));
    const [creditRefund, setCreditRefund] = useState(() => priorYearCreditRefund || '');

    const [modalA, setModalA] = useState(null); // { mode: 'create' | 'edit', row?: object } | null
    const [modalB, setModalB] = useState(null); // { mode: 'create' | 'edit', row?: object } | null

    // Ref anti-loop — pola identik L2 (Blueprint L3 Final §2/§4).
    const skipRestoreA = useRef(false);
    const skipRestoreB = useRef(false);
    const skipRestoreCreditRefund = useRef(false);

    // Restore saat Load Draft — TANPA merge, pola identik L2 (Blueprint L3 Final §7).
    useEffect(() => {
        if (skipRestoreA.current) { skipRestoreA.current = false; return; }
        if (Array.isArray(l3RowsA) && l3RowsA.length > 0) {
            setRowsA(l3RowsA);
        }
    }, [l3RowsA]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (skipRestoreB.current) { skipRestoreB.current = false; return; }
        if (Array.isArray(l3RowsB) && l3RowsB.length > 0) {
            setRowsB(l3RowsB);
        }
    }, [l3RowsB]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (skipRestoreCreditRefund.current) { skipRestoreCreditRefund.current = false; return; }
        if (priorYearCreditRefund) {
            setCreditRefund(priorYearCreditRefund);
        }
    }, [priorYearCreditRefund]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Part A: Add / Edit / Delete ─────────────────────────────────────────
    const handleSaveA = (form) => {
        setRowsA(prev => {
            const next = modalA?.mode === 'create'
                ? [...prev, { id: crypto.randomUUID(), ...form }]
                : updateRowById(prev, modalA.row.id, form);
            if (onRowsAChange) {
                skipRestoreA.current = true;
                onRowsAChange(next);
            }
            return next;
        });
        setModalA(null);
    };

    const handleDeleteA = (id) => {
        setRowsA(prev => {
            const next = removeRowById(prev, id);
            if (onRowsAChange) {
                skipRestoreA.current = true;
                onRowsAChange(next);
            }
            return next;
        });
    };

    // ── Part B: Add / Edit / Delete ─────────────────────────────────────────
    const handleSaveB = (form) => {
        setRowsB(prev => {
            const next = modalB?.mode === 'create'
                ? [...prev, { id: crypto.randomUUID(), ...form }]
                : updateRowById(prev, modalB.row.id, form);
            if (onRowsBChange) {
                skipRestoreB.current = true;
                onRowsBChange(next);
            }
            return next;
        });
        setModalB(null);
    };

    const handleDeleteB = (id) => {
        setRowsB(prev => {
            const next = removeRowById(prev, id);
            if (onRowsBChange) {
                skipRestoreB.current = true;
                onRowsBChange(next);
            }
            return next;
        });
    };

    // ── Prior Year Credit Refund: single-value raw input ────────────────────
    const handleCreditRefundChange = (val) => {
        setCreditRefund(val);
        if (onPriorYearCreditRefundChange) {
            skipRestoreCreditRefund.current = true;
            onPriorYearCreditRefundChange(val);
        }
    };

    // ── Derived summary — SATU-SATUNYA tempat hitungL3() dipanggil untuk render.
    // TIDAK PERNAH disimpan ke state (Blueprint L3 Final §2/§4 — filosofi L1/L2
    // "total tidak pernah disimpan ke state", diperluas mencakup summary lintas-bagian).
    const summary = useMemo(
        () => hitungL3(rowsA, rowsB, creditRefund),
        [rowsA, rowsB, creditRefund]
    );

    // ── Kirim hasil akhir (Part B.c) ke parent — pola identik onA10Change.
    // Parent (SptTahunanBadan.js) TIDAK punya salinan hitungL3(); hanya menerima
    // dan menyimpan hasil akhirnya sebagai mirror read-only (Blueprint L3 Final §1).
    useEffect(() => {
        if (onCreditAmountChange) onCreditAmountChange(summary.partB.c);
    }, [summary.partB.c]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Style helpers — disalin dari pola sticky-column L2.
    const thCls = "px-3 py-2 text-left text-xs font-semibold text-gray-600 bg-gray-100 border-b border-gray-200 whitespace-nowrap";
    const tdCls = "px-3 py-2 text-xs text-gray-700 border-b border-gray-100";
    const tdNum = "px-3 py-2 text-xs text-right text-gray-700 border-b border-gray-100 font-mono";

    const COL_ACTION_W = 64;
    const COL_NAME_W   = 160;

    const thAction = { position: 'sticky', left: 0,            top: 0, zIndex: 4, backgroundColor: '#f3f4f6' };
    const thName   = { position: 'sticky', left: COL_ACTION_W, top: 0, zIndex: 4, backgroundColor: '#f3f4f6' };
    const thTop    = { position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#f3f4f6' };

    const tdAction = { position: 'sticky', left: 0,            zIndex: 1, backgroundColor: '#ffffff' };
    const tdName   = { position: 'sticky', left: COL_ACTION_W, zIndex: 1, backgroundColor: '#ffffff' };

    const EditIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
    );
    const DeleteIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 112 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div className="p-6 space-y-8">
            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 3 — List of Income Tax Withheld by Other Party
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Period Year" value={taxYear} />
                    <ReadonlyField label="TIN (NPWP)" value={tin} />
                </div>
            </div>

            {/* ── PART A ──────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-blue-700 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                        A. Income from Overseas
                    </h3>
                    <button
                        onClick={() => setModalA({ mode: 'create' })}
                        className="px-3 py-1.5 text-xs font-semibold bg-white text-blue-700 rounded hover:bg-blue-50 transition-colors"
                    >
                        + Add
                    </button>
                </div>

                <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '500px' }}>
                    <table className="w-full text-sm border-collapse min-w-[1400px]">
                        <thead>
                            <tr>
                                <th className={thCls} style={{ ...thAction, minWidth: COL_ACTION_W }}>Action</th>
                                <th className={thCls} style={{ ...thName, minWidth: COL_NAME_W }}>Name</th>
                                <th className={thCls} style={thTop}>Country Code</th>
                                <th className={thCls} style={thTop}>Date of Transaction</th>
                                <th className={thCls} style={thTop}>Income Code</th>
                                <th className={`${thCls} text-right`} style={thTop}>Net Income (Rp)</th>
                                <th className={`${thCls} text-right`} style={thTop}>Tax Payable/Paid Overseas (Rp)</th>
                                <th className={thCls} style={thTop}>Currency</th>
                                <th className={`${thCls} text-right`} style={thTop}>Amount in Foreign Currency</th>
                                <th className={`${thCls} text-right`} style={thTop}>Tax Credit Calculated (Rp)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsA.length === 0 && (
                                <tr><td colSpan={10} className="px-3 py-6 text-center text-sm text-gray-400 italic">No data to display.</td></tr>
                            )}
                            {rowsA.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    <td className={tdCls} style={tdAction}>
                                        <div className="flex gap-1">
                                            <button onClick={() => setModalA({ mode: 'edit', row })} title="Edit" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDeleteA(row.id)} title="Delete" className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors">
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                    <td className={tdCls} style={tdName}>{row.name}</td>
                                    <td className={tdCls}>{row.countryCode}</td>
                                    <td className={tdCls}>{row.transactionDate}</td>
                                    <td className={tdCls}>{row.incomeCode}</td>
                                    <td className={tdNum}>{fmt(row.netIncomeRp)}</td>
                                    <td className={tdNum}>{fmt(row.taxPayableOverseasRp)}</td>
                                    <td className={tdCls}>{row.currency}</td>
                                    <td className={tdNum}>{row.foreignCurrencyAmount}</td>
                                    <td className={tdNum}>{fmt(row.taxCreditCalculatedRp)}</td>
                                </tr>
                            ))}
                        </tbody>
                        {rowsA.length > 0 && (
                            <tfoot>
                                <tr className="bg-blue-700">
                                    <td className="px-3 py-2" colSpan={9} style={{ position: 'sticky', left: 0 }}>
                                        <span className="text-xs font-bold text-white">TOTAL</span>
                                    </td>
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-white">{fmt(summary.partA.a)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

                {/* ── Summary Bagian A (a/b/c) — Blueprint L3 Final §2: derived,
                     b = priorYearCreditRefund (SATU-SATUNYA field editable di sini) ── */}
                <div className="p-5 bg-gray-50 border-t border-gray-200 space-y-3">
                    <div className="grid grid-cols-3 gap-4 items-end max-w-3xl">
                        <ReadonlyField label="a. Jumlah Tax Credit That Can be Calculated" value={fmt(summary.partA.a)} />
                        <RpField
                            label="b. Pengembalian Pengurangan Kredit Pajak LN (PPh Psl 24) Tahun Lalu"
                            value={creditRefund}
                            onChange={handleCreditRefundChange}
                        />
                        <ReadonlyField label="c. Jumlah Kredit Pajak LN yang Dapat Diperhitungkan Tahun Berjalan (a − b)" value={fmt(summary.partA.c)} />
                    </div>
                </div>
            </div>

            {/* ── PART B ──────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-blue-700 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                        B. PPh Withheld/Collected by Other Party
                    </h3>
                    <button
                        onClick={() => setModalB({ mode: 'create' })}
                        className="px-3 py-1.5 text-xs font-semibold bg-white text-blue-700 rounded hover:bg-blue-50 transition-colors"
                    >
                        + Add
                    </button>
                </div>

                <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '500px' }}>
                    <table className="w-full text-sm border-collapse min-w-[1300px]">
                        <thead>
                            <tr>
                                <th className={thCls} style={{ ...thAction, minWidth: COL_ACTION_W }}>Action</th>
                                <th className={thCls} style={{ ...thName, minWidth: COL_NAME_W }}>Name</th>
                                <th className={thCls} style={thTop}>TIN</th>
                                <th className={thCls} style={thTop}>Tax Type</th>
                                <th className={`${thCls} text-right`} style={thTop}>Tax Base (Rp)</th>
                                <th className={`${thCls} text-right`} style={thTop}>Income Tax Withheld (Rp)</th>
                                <th className={thCls} style={thTop}>Withholding Slip Number</th>
                                <th className={thCls} style={thTop}>Withholding Slip Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsB.length === 0 && (
                                <tr><td colSpan={8} className="px-3 py-6 text-center text-sm text-gray-400 italic">No data found.</td></tr>
                            )}
                            {rowsB.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    <td className={tdCls} style={tdAction}>
                                        <div className="flex gap-1">
                                            <button onClick={() => setModalB({ mode: 'edit', row })} title="Edit" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDeleteB(row.id)} title="Delete" className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors">
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                    <td className={tdCls} style={tdName}>{row.name}</td>
                                    <td className={tdCls}>{row.tin}</td>
                                    <td className={tdCls}>{row.taxType}</td>
                                    <td className={tdNum}>{fmt(row.taxBaseRp)}</td>
                                    <td className={tdNum}>{fmt(row.taxWithheldRp)}</td>
                                    <td className={tdCls}>{row.slipNumber}</td>
                                    <td className={tdCls}>{row.slipDate}</td>
                                </tr>
                            ))}
                        </tbody>
                        {rowsB.length > 0 && (
                            <tfoot>
                                <tr className="bg-blue-700">
                                    <td className="px-3 py-2" colSpan={4} style={{ position: 'sticky', left: 0 }}>
                                        <span className="text-xs font-bold text-white">TOTAL</span>
                                    </td>
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-white">{fmt(summary.partB.a)}</td>
                                    <td className="px-3 py-2" colSpan={3} />
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

                {/* ── Summary Bagian B (a/b/c) — semua derived, TIDAK ada field
                     editable di sini. b = Part A.c (readonly, otomatis). ── */}
                <div className="p-5 bg-gray-50 border-t border-gray-200 space-y-3">
                    <div className="grid grid-cols-3 gap-4 items-end max-w-3xl">
                        <ReadonlyField label="a. Jumlah PPh yang Dipotong/Dipungut" value={fmt(summary.partB.a)} />
                        <ReadonlyField label="b. Kredit Pajak Luar Negeri (dari Bagian A.c)" value={fmt(summary.partB.b)} />
                        <ReadonlyField label="c. Jumlah Kredit Pajak (a − b) → Section E.13" value={fmt(summary.partB.c)} />
                    </div>
                    <p className="text-xs text-gray-500 italic">
                        Nilai c di atas otomatis dikirim ke Main Form Section E Point 13 — tidak perlu input manual.
                    </p>
                </div>
            </div>

            {/* ── MODALS ──────────────────────────────────────────────────── */}
            {modalA && (
                <ModalPartA
                    mode={modalA.mode}
                    row={modalA.row}
                    onClose={() => setModalA(null)}
                    onSave={handleSaveA}
                />
            )}
            {modalB && (
                <ModalPartB
                    mode={modalB.mode}
                    row={modalB.row}
                    onClose={() => setModalB(null)}
                    onSave={handleSaveB}
                />
            )}
        </div>
    );
};

export default L3;
