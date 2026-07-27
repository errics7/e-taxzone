import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TAX_OBJECT_OPTIONS, TYPE_OF_INCOME_OPTIONS } from './L4MasterData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Catatan: helper di bawah ini adalah COPY dari L2.js (yang menyalinnya dari L1A).
// Tidak ada shared util module di project ini — setiap Lampiran berdiri sendiri
// secara sengaja. Menyalin pola yang identik adalah pendekatan paling konsisten
// dengan arsitektur yang sudah berjalan.

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};

// PENTING: parse() HANYA untuk nominal Rupiah (menghapus "." pemisah ribuan).
// JANGAN gunakan parse() untuk nilai Rate/persentase — gunakan parseFloat() biasa.
const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

// rpDisplay — HANYA untuk tampilan sel tabel (pola L13A: prefix "Rp" menempel tanpa
// spasi, selalu tampil termasuk untuk nilai 0). TIDAK dipakai oleh RpField (yang
// butuh string kosong saat nilai 0, untuk placeholder) — fmt/parse asli tidak disentuh.
const rpDisplay = (v) => `Rp${fmt(v) || '0'}`;

const ReadonlyField = ({ label, value, placeholder }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">{placeholder || '—'}</span>}
        </div>
    </div>
);

// RpField — identik dengan L2.js
const RpField = ({ label, value, onChange, placeholder = '0' }) => {
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
        const formatted  = digitsOnly === '' ? '' : Number(digitsOnly).toLocaleString('id-ID');
        const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, '').length;

        setDisplayValue(formatted);
        onChange(digitsOnly);

        requestAnimationFrame(() => {
            if (!inputRef.current) return;
            if (digitsBeforeCursor === 0) { inputRef.current.setSelectionRange(0, 0); return; }
            let digitCount = 0;
            let newPos     = formatted.length;
            for (let i = 0; i < formatted.length; i++) {
                if (/\d/.test(formatted[i])) {
                    digitCount++;
                    if (digitCount === digitsBeforeCursor) { newPos = i + 1; break; }
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
            <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
                <span className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 border-r border-gray-200 select-none whitespace-nowrap">Rp</span>
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2 text-sm text-left bg-white focus:outline-none min-w-0"
                />
            </div>
        </div>
    );
};

const SelectField = ({ label, value, onChange, options, required }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    </div>
);

// PercentField — identik dengan L2.js
// PENTING: jangan gunakan parse() untuk nilai ini — parse() merusak desimal persen.
const PercentField = ({ label, value, onChange, placeholder = '0', max = 100 }) => {
    const handleChange = (e) => {
        let raw = e.target.value.replace(/[^0-9.]/g, '');
        const parts = raw.split('.');
        if (parts.length > 2) raw = parts[0] + '.' + parts.slice(1).join('');
        onChange(raw);
    };
    const handleBlur = () => {
        const n = parseFloat(value) || 0;
        const clamped = Math.min(Math.max(n, 0), max);
        onChange(clamped === 0 ? '' : String(clamped));
    };
    return (
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
                <input
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2 text-sm text-right bg-white focus:outline-none min-w-0"
                />
                <span className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 border-l border-gray-200 select-none whitespace-nowrap">%</span>
            </div>
        </div>
    );
};

// TextField — identik dengan L2.js
const TextField = ({ label, value, onChange, placeholder = '', maxLength, required }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
    </div>
);

// TinField — digits-only text input untuk NPWP/TIN (Revisi L4 §1).
// Hanya menerima angka 0–9. Huruf dan karakter khusus difilter baik saat
// mengetik (onChange) maupun saat paste (onPaste). State internal tetap string
// digit murni — tidak ada format/mask tambahan (NPWP diformat oleh backend).
const TinField = ({ label, value, onChange, placeholder = '', required }) => {
    const handleChange = (e) => {
        // Filter: buang semua karakter non-digit
        const digitsOnly = e.target.value.replace(/\D/g, '');
        onChange(digitsOnly);
    };
    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text');
        const digitsOnly = pasted.replace(/\D/g, '');
        onChange(digitsOnly);
    };
    return (
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type="text"
                inputMode="numeric"
                value={value}
                onChange={handleChange}
                onPaste={handlePaste}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
        </div>
    );
};

// ─── Static Master Options ─────────────────────────────────────────────────────
// Dipindahkan ke src/constants/l4MasterData.js (TAX_OBJECT_OPTIONS, TYPE_OF_INCOME_OPTIONS).
// L4.js hanya meng-import — lihat import statement di atas.

// ─── Row Builders ─────────────────────────────────────────────────────────────

const buildEmptyPartARow = () => ({
    id:               crypto.randomUUID(),
    tin:              '',  // Income Tax Withholder TIN — raw input (digits only)
    withholdingName:  '',  // Income Tax Withholder Name — raw input (Revisi L4 §2: editable, wajib)
    taxObject:        '',  // raw input (dropdown)
    taxBase:          '',  // raw input (Rp)
    rate:             '',  // raw input (%) — TODO: confirm whether derived from taxObject
    // finalTaxPayable — NOT stored: derived = taxBase × rate / 100
});

const buildEmptyPartBRow = () => ({
    id:           crypto.randomUUID(),
    typeOfIncome: '',   // raw input (dropdown)
    incomeSource: '',   // raw input (free text)
    grossIncome:  '',   // raw input (Rp)
    // code — NOT stored: derived from TYPE_OF_INCOME_OPTIONS[typeOfIncome].code
});

// ─── Derived value helpers ─────────────────────────────────────────────────────

// TODO: Konfirmasi aturan pembulatan resmi DJP untuk Final Income Tax Payable.
// Saat ini menggunakan Math.round — mudah diganti ke Math.floor/ceil jika ada aturan resmi.
const calcFinalTaxPayable = (taxBase, rate) =>
    Math.round(parse(taxBase) * (parseFloat(rate) || 0) / 100);

const deriveCode = (typeOfIncomeValue) =>
    TYPE_OF_INCOME_OPTIONS.find(o => o.value === typeOfIncomeValue)?.code || '';

// ─── Generic row utilities (pola identik L2) ──────────────────────────────────
const updateRowById = (rows, id, patch) => rows.map(r => (r.id === id ? { ...r, ...patch } : r));
const removeRowById = (rows, id) => rows.filter(r => r.id !== id);

// ─── Modal Part A — Add / Edit ────────────────────────────────────────────────
const ModalPartA = ({ mode, row, onClose, onSave }) => {
    const initial = row || buildEmptyPartARow();
    const [form, setForm] = useState({
        tin:             initial.tin             || '',
        withholdingName: initial.withholdingName || '', // Revisi §2: raw input, editable, wajib
        taxObject:       initial.taxObject       || '',
        taxBase:         initial.taxBase         || '',
        rate:            initial.rate            || '',
    });
    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    // Derived — dihitung ulang real-time setiap form.taxBase / form.rate berubah.
    // Revisi §6: tidak perlu tombol apapun — dihitung ulang otomatis karena form
    // state adalah sumber render di dalam modal (React re-render on setState).
    // TIDAK disimpan ke form state maupun ke draft.
    // TODO: Konfirmasi aturan pembulatan resmi DJP — saat ini Math.round.
    const finalTaxPayable = calcFinalTaxPayable(form.taxBase, form.rate);

    // Validasi minimal
    const errors = {};
    if (!form.tin.trim())             errors.tin             = 'TIN wajib diisi.';
    if (!form.withholdingName.trim()) errors.withholdingName = 'Name wajib diisi.'; // Revisi §2
    if (!form.taxObject)              errors.taxObject        = 'Tax Object wajib dipilih.';
    const hasError = Object.keys(errors).length > 0;

    const handleSave = () => {
        if (hasError) return;
        // Simpan raw input saja — finalTaxPayable TIDAK dimasukkan (derived)
        // withholdingName kini raw input (Revisi §2) — DIPERSIST ke draft
        onSave({
            tin:             form.tin,
            withholdingName: form.withholdingName,
            taxObject:       form.taxObject,
            taxBase:         form.taxBase,
            rate:            form.rate,
        });
    };

    const title = mode === 'create'
        ? 'Add Income Subject to Final Income Tax'
        : 'Edit Income Subject to Final Income Tax';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
                </div>

                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* TIN — raw input digits-only (Revisi §1: TinField, bukan TextField) */}
                    <div>
                        <TinField
                            label="Income Tax Withholder TIN"
                            value={form.tin}
                            onChange={set('tin')}
                            placeholder="Masukkan NPWP/TIN pemotong (angka saja)"
                            required
                        />
                        {errors.tin && <p className="text-xs text-red-500 mt-1">{errors.tin}</p>}
                    </div>

                    {/* Name — raw input editable (Revisi §2: bukan lagi readonly/lookup) */}
                    <div>
                        <TextField
                            label="Income Tax Withholder Name"
                            value={form.withholdingName}
                            onChange={set('withholdingName')}
                            placeholder="Masukkan nama pemotong"
                            required
                        />
                        {errors.withholdingName && <p className="text-xs text-red-500 mt-1">{errors.withholdingName}</p>}
                    </div>

                    {/* Tax Object — raw input */}
                    <div>
                        <SelectField
                            label="Tax Object"
                            value={form.taxObject}
                            onChange={set('taxObject')}
                            options={TAX_OBJECT_OPTIONS}
                            required
                        />
                        {errors.taxObject && <p className="text-xs text-red-500 mt-1">{errors.taxObject}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Tax Base — raw input, alignment kiri (Revisi §5) */}
                        {/* TODO: Confirm whether Rate is user input or auto-mapped from Tax Object.
                            If derived: convert Rate to ReadonlyField and remove from raw input / Save Draft. */}
                        <RpField
                            label="Tax Base (Rupiah)"
                            value={form.taxBase}
                            onChange={set('taxBase')}
                        />
                        {/* Rate — raw input sementara (Revisi §5: alignment kiri di PercentField) */}
                        <PercentField
                            label="Rate (%)"
                            value={form.rate}
                            onChange={set('rate')}
                            max={100}
                        />
                    </div>

                    {/* Final Income Tax Payable — derived real-time (Revisi §6), readonly,
                        TIDAK disimpan. Dihitung ulang otomatis setiap form.taxBase atau
                        form.rate berubah — tidak perlu tombol atau trigger manual. */}
                    <ReadonlyField
                        label="Final Income Tax Payable (Rupiah)"
                        value={finalTaxPayable > 0 ? `Rp${fmt(finalTaxPayable)}` : null}
                        placeholder="Dihitung otomatis (Tax Base × Rate ÷ 100)"
                    />
                </div>

                <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-medium bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
                        Close
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={hasError}
                        className={`px-5 py-2 text-sm font-medium rounded-lg text-white transition-colors ${hasError ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'}`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Modal Part B — Add / Edit ────────────────────────────────────────────────
const ModalPartB = ({ mode, row, onClose, onSave }) => {
    const initial = row || buildEmptyPartBRow();
    const [form, setForm] = useState({
        typeOfIncome: initial.typeOfIncome || '',
        incomeSource: initial.incomeSource || '',
        grossIncome:  initial.grossIncome  || '',
    });
    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    // Code — derived dari typeOfIncome, dihitung ulang setiap render, TIDAK disimpan
    const code = deriveCode(form.typeOfIncome);

    // Validasi minimal
    const errors = {};
    if (!form.typeOfIncome) errors.typeOfIncome = 'Type Of Income wajib dipilih.';
    if (!form.incomeSource.trim()) errors.incomeSource = 'Income Source wajib diisi.';
    const hasError = Object.keys(errors).length > 0;

    const handleSave = () => {
        if (hasError) return;
        // Simpan hanya raw input — code TIDAK dimasukkan
        onSave({ typeOfIncome: form.typeOfIncome, incomeSource: form.incomeSource, grossIncome: form.grossIncome });
    };

    const title = mode === 'create'
        ? 'Add Income Excluded from Income Tax'
        : 'Edit Income Excluded from Income Tax';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
                </div>

                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Code — derived dari typeOfIncome, readonly, TIDAK disimpan.
                        Revisi §3: boleh kosong, tidak ada validasi error, master belum tersedia. */}
                    <ReadonlyField
                        label="Code"
                        value={code || null}
                        placeholder="Menunggu master data"
                    />

                    {/* Type Of Income — raw input */}
                    <div>
                        <SelectField
                            label="Type Of Income"
                            value={form.typeOfIncome}
                            onChange={set('typeOfIncome')}
                            options={TYPE_OF_INCOME_OPTIONS}
                            required
                        />
                        {errors.typeOfIncome && <p className="text-xs text-red-500 mt-1">{errors.typeOfIncome}</p>}
                    </div>

                    {/* Income Source — raw input */}
                    <div>
                        <TextField
                            label="Income Source"
                            value={form.incomeSource}
                            onChange={set('incomeSource')}
                            placeholder="Sumber penghasilan"
                            required
                        />
                        {errors.incomeSource && <p className="text-xs text-red-500 mt-1">{errors.incomeSource}</p>}
                    </div>

                    {/* Gross Income — raw input */}
                    <RpField
                        label="Gross Income (Rupiah)"
                        value={form.grossIncome}
                        onChange={set('grossIncome')}
                    />
                </div>

                <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-medium bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
                        Close
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={hasError}
                        className={`px-5 py-2 text-sm font-medium rounded-lg text-white transition-colors ${hasError ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'}`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Action Buttons (Edit + Delete) — pola identik L2 ────────────────────────
const EditBtn = ({ onClick }) => (
    <button onClick={onClick} title="Edit" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
    </button>
);
const DeleteBtn = ({ onClick }) => (
    <button onClick={onClick} title="Delete" className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 112 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
        </svg>
    </button>
);

// ─── Delete Confirmation Dialog — pola identik L13A.js / L2.js ────────────────
// BARU: sebelumnya Part A & Part B menghapus baris langsung tanpa konfirmasi.
// Dialog ini HANYA menambah langkah konfirmasi sebelum handleDeleteA/handleDeleteB
// dipanggil — payload, state, dan callback onRowsAChange/onRowsBChange yang
// dijalankan tetap identik, tidak ada perubahan business rule.
const DeleteConfirmDialog = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
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

// ─── Main Component ───────────────────────────────────────────────────────────
// Blueprint L4 Final + Revisi:
//   • rowsA / rowsB = array of full raw input object, keyed by id (pola identik L2/L3)
//   • Part A raw input: tin (digits-only), withholdingName (editable), taxObject, taxBase, rate
//   • Part B raw input: typeOfIncome, incomeSource, grossIncome
//   • Derived (TIDAK pernah disimpan): finalTaxPayable, code, NO, totalTaxBase, totalFinalTax, totalGrossIncome
//   • showPartA / showPartB: visibility flag dari parent — data TIDAK dihapus saat hidden
//   • Header Tax Year / TIN: prop langsung dari sptData mirror di SptTahunanBadan

const L4 = ({
    l4RowsA = [],
    l4RowsB = [],
    onRowsAChange,
    onRowsBChange,
    showPartA,
    showPartB,
    taxYear,
    tin,
}) => {
    const [rowsA, setRowsA] = useState(() => (Array.isArray(l4RowsA) ? l4RowsA : []));
    const [rowsB, setRowsB] = useState(() => (Array.isArray(l4RowsB) ? l4RowsB : []));

    const [modalA, setModalA] = useState(null); // { mode: 'create'|'edit', row?: object } | null
    const [modalB, setModalB] = useState(null); // { mode: 'create'|'edit', row?: object } | null

    // pendingDelete — { part: 'A' | 'B', id } yang menunggu konfirmasi delete (pola
    // L13A/L2). HANYA mengontrol tampilan dialog konfirmasi; logic delete aktual
    // tetap di handleDeleteA/handleDeleteB (tidak diubah).
    const [pendingDelete, setPendingDelete] = useState(null);

    // Anti-loop ref — pola identik L2/L3 (Blueprint §3)
    const skipRestoreA = useRef(false);
    const skipRestoreB = useRef(false);

    // Restore saat Load Draft — TANPA merge, langsung set rows (pola identik L2 §10)
    useEffect(() => {
        if (skipRestoreA.current) { skipRestoreA.current = false; return; }
        if (Array.isArray(l4RowsA) && l4RowsA.length > 0) {
            setRowsA(l4RowsA);
        }
    }, [l4RowsA]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (skipRestoreB.current) { skipRestoreB.current = false; return; }
        if (Array.isArray(l4RowsB) && l4RowsB.length > 0) {
            setRowsB(l4RowsB);
        }
    }, [l4RowsB]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Part A: Add / Edit / Delete ──────────────────────────────────────────
    const handleSaveA = (form) => {
        setRowsA(prev => {
            const next = modalA?.mode === 'create'
                ? [...prev, { id: crypto.randomUUID(), ...form }]
                : updateRowById(prev, modalA.row.id, form);
            if (onRowsAChange) { skipRestoreA.current = true; onRowsAChange(next); }
            return next;
        });
        setModalA(null);
    };

    const handleDeleteA = (id) => {
        setRowsA(prev => {
            const next = removeRowById(prev, id);
            if (onRowsAChange) { skipRestoreA.current = true; onRowsAChange(next); }
            return next;
        });
    };

    // ── Part B: Add / Edit / Delete ──────────────────────────────────────────
    const handleSaveB = (form) => {
        setRowsB(prev => {
            const next = modalB?.mode === 'create'
                ? [...prev, { id: crypto.randomUUID(), ...form }]
                : updateRowById(prev, modalB.row.id, form);
            if (onRowsBChange) { skipRestoreB.current = true; onRowsBChange(next); }
            return next;
        });
        setModalB(null);
    };

    const handleDeleteB = (id) => {
        setRowsB(prev => {
            const next = removeRowById(prev, id);
            if (onRowsBChange) { skipRestoreB.current = true; onRowsBChange(next); }
            return next;
        });
    };

    // ── Delete confirmation flow (pola L13A/L2) — hanya membungkus handleDeleteA/B
    // dengan langkah konfirmasi; tidak ada perubahan pada logic delete itu sendiri.
    const handleRequestDelete = (part, id) => setPendingDelete({ part, id });
    const handleCancelDelete  = () => setPendingDelete(null);
    const handleConfirmDelete = () => {
        if (pendingDelete) {
            if (pendingDelete.part === 'A') handleDeleteA(pendingDelete.id);
            else handleDeleteB(pendingDelete.id);
        }
        setPendingDelete(null);
    };

    // ── Derived totals — selalu dihitung ulang dari rows, TIDAK pernah disimpan ──
    // totalTaxBase dan totalFinalTax keduanya ditampilkan di baris TOTAL Part A (Revisi §4).
    const totalTaxBase = useMemo(() =>
        rowsA.reduce((acc, r) => acc + parse(r.taxBase), 0)
    , [rowsA]);

    const totalFinalTax = useMemo(() =>
        rowsA.reduce((acc, r) => acc + calcFinalTaxPayable(r.taxBase, r.rate), 0)
    , [rowsA]);

    const totalGrossIncome = useMemo(() =>
        rowsB.reduce((acc, r) => acc + parse(r.grossIncome), 0)
    , [rowsB]);

    // ── Style helpers — pola identik L2 (revisi grid/border L13A) ────────────
    const thCls = "px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase bg-yellow-400 border border-white border-b-gray-300 whitespace-nowrap";
    const tdCls = "px-3 py-2 text-xs text-gray-700 border border-gray-200";
    const tdNum = "px-3 py-2 text-xs text-right text-gray-700 border border-gray-200 font-mono";
    const thTop = { position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#facc15' };

    return (
        <div className="p-6 space-y-8">

            {/* ── HEADER ────────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 4 — Final Tax &amp; Excluded Income
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Year"   value={taxYear} />
                    <ReadonlyField label="TIN (NPWP)" value={tin} />
                </div>
            </div>

            {/* ── PART A — Income Subject to Final Income Tax ───────────────── */}
            {showPartA && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-5 py-3 bg-blue-700 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                                A. Income Subject to Final Income Tax
                            </h3>
                            <p className="text-blue-200 text-xs mt-0.5">
                                Income that is subject to Final Income Tax (PPh Final)
                            </p>
                        </div>
                        <button
                            onClick={() => setModalA({ mode: 'create' })}
                            className="px-4 py-2 text-sm font-medium bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                        >
                            + Add
                        </button>
                    </div>

                    <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '500px' }}>
                        <table className="w-full text-sm border-collapse min-w-[950px]">
                            <thead>
                                <tr>
                                    <th className={thCls} style={{ ...thTop, minWidth: 80 }}>Action</th>
                                    <th className={thCls} style={{ ...thTop, minWidth: 44 }}>No</th>
                                    <th className={thCls} style={thTop}>Income Tax Withholder TIN</th>
                                    <th className={thCls} style={thTop}>Income Tax Withholder Name</th>
                                    <th className={thCls} style={thTop}>Tax Object</th>
                                    <th className={`${thCls} text-right`} style={thTop}>Tax Base</th>
                                    <th className={`${thCls} text-right`} style={thTop}>Rate (%)</th>
                                    <th className={`${thCls} text-right`} style={thTop}>Final Income Tax Payable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsA.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-3 py-10 text-center border border-gray-200">
                                            <p className="text-sm text-gray-500">Belum ada data penghasilan yang dikenakan PPh Final.</p>
                                            <p className="text-xs text-gray-400 mt-1">Klik tombol + Add untuk menambahkan data.</p>
                                        </td>
                                    </tr>
                                )}
                                {rowsA.map((row, idx) => {
                                    // Derived — dihitung ulang setiap render, TIDAK pernah disimpan
                                    const finalTaxPayable = calcFinalTaxPayable(row.taxBase, row.rate);
                                    const taxObjectLabel  = TAX_OBJECT_OPTIONS.find(o => o.value === row.taxObject)?.label || row.taxObject;
                                    return (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                            <td className={tdCls}>
                                                <div className="flex gap-1">
                                                    <EditBtn onClick={() => setModalA({ mode: 'edit', row })} />
                                                    <DeleteBtn onClick={() => handleRequestDelete('A', row.id)} />
                                                </div>
                                            </td>
                                            <td className={tdCls}>{idx + 1}</td>
                                            <td className={tdCls}>{row.tin}</td>
                                            {/* withholdingName — raw input (Revisi §2: bukan lagi lookup) */}
                                            <td className={tdCls}>{row.withholdingName}</td>
                                            <td className={tdCls}>{taxObjectLabel}</td>
                                            <td className={tdNum}>{rpDisplay(row.taxBase)}</td>
                                            <td className={tdNum}>{row.rate || '0'}</td>
                                            <td className={tdNum}>{rpDisplay(finalTaxPayable)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            {rowsA.length > 0 && (
                                <tfoot>
                                    <tr className="bg-blue-700">
                                        {/* TOTAL Part A (Revisi §4): Tax Base + Final Income Tax Payable */}
                                        <td className="px-3 py-2 border border-white" colSpan={5}>
                                            <span className="text-xs font-bold text-white">TOTAL</span>
                                        </td>
                                        <td className="px-3 py-2 text-xs font-bold text-right font-mono text-white border border-white">
                                            {rpDisplay(totalTaxBase)}
                                        </td>
                                        <td className="px-3 py-2 border border-white" />
                                        <td className="px-3 py-2 text-xs font-bold text-right font-mono text-white border border-white">
                                            {rpDisplay(totalFinalTax)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            )}

            {/* ── PART B — Income Excluded from Income Tax ──────────────────── */}
            {showPartB && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-5 py-3 bg-blue-700 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                                B. Income Excluded from Income Tax
                            </h3>
                            <p className="text-blue-200 text-xs mt-0.5">
                                Income that is excluded from Income Tax (Penghasilan bukan objek pajak)
                            </p>
                        </div>
                        <button
                            onClick={() => setModalB({ mode: 'create' })}
                            className="px-4 py-2 text-sm font-medium bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                        >
                            + Add
                        </button>
                    </div>

                    <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '500px' }}>
                        <table className="w-full text-sm border-collapse min-w-[700px]">
                            <thead>
                                <tr>
                                    <th className={thCls} style={{ ...thTop, minWidth: 80 }}>Action</th>
                                    <th className={thCls} style={{ ...thTop, minWidth: 44 }}>No</th>
                                    <th className={thCls} style={thTop}>Code</th>
                                    <th className={thCls} style={thTop}>Type Of Income</th>
                                    <th className={thCls} style={thTop}>Income Source</th>
                                    <th className={`${thCls} text-right`} style={thTop}>Gross Income</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsB.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-6 text-center text-sm text-gray-400 italic border border-gray-200">
                                            No data to display.
                                        </td>
                                    </tr>
                                )}
                                {rowsB.map((row, index) => {
                                    // Derived — dihitung ulang setiap render, TIDAK pernah disimpan
                                    const code = deriveCode(row.typeOfIncome);
                                    const typeLabel = TYPE_OF_INCOME_OPTIONS.find(o => o.value === row.typeOfIncome)?.label || row.typeOfIncome;
                                    return (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                            <td className={tdCls}>
                                                <div className="flex gap-1">
                                                    <EditBtn onClick={() => setModalB({ mode: 'edit', row })} />
                                                    <DeleteBtn onClick={() => handleRequestDelete('B', row.id)} />
                                                </div>
                                            </td>
                                            {/* NO — derived (index + 1), TIDAK disimpan */}
                                            <td className={tdCls}>{index + 1}</td>
                                            {/* Code — derived dari typeOfIncome, TIDAK disimpan */}
                                            <td className={tdCls}>{code || <span className="text-gray-400 italic text-xs">—</span>}</td>
                                            <td className={tdCls}>{typeLabel}</td>
                                            <td className={tdCls}>{row.incomeSource}</td>
                                            <td className={tdNum}>{rpDisplay(row.grossIncome)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            {rowsB.length > 0 && (
                                <tfoot>
                                    <tr className="bg-blue-700">
                                        <td className="px-3 py-2 border border-white" colSpan={5}>
                                            <span className="text-xs font-bold text-white">TOTAL</span>
                                        </td>
                                        <td className="px-3 py-2 text-xs font-bold text-right font-mono text-white border border-white">
                                            {rpDisplay(totalGrossIncome)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            )}

            {/* ── Empty state — keduanya tidak aktif ───────────────────────── */}
            {!showPartA && !showPartB && (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-sm text-gray-400 italic">
                        Tidak ada bagian yang aktif.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Pilih jawaban pada Section C untuk menampilkan Part A dan/atau Part B.
                    </p>
                </div>
            )}

            {/* ── MODALS ───────────────────────────────────────────────────── */}
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
            <DeleteConfirmDialog
                open={!!pendingDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default L4;