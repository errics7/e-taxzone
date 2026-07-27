import React, { useState, useEffect, useMemo, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// LAMPIRAN 11-B — Perhitungan Debt to Equity Ratio (DER)
// Sumber: Blueprint & Contract L11 (final, disepakati) + L11B.xlsx + Screenshot
// Coretax (Gambar75 dst).
//
// STRUKTUR:
//   Bagian I   — Calculation of EBITDA        → READ-ONLY, forward dari L1A/L1C/L1D
//   Bagian II  — Debt to Equity Ratio (DER)    → RAW INPUT (2 tabel + 1 kalkulasi)
//   Bagian III — Calculation of Borrowing Cost → RAW INPUT (1 tabel + 1 radio)
//
// OPEN CLARIFICATION (Blueprint L11 §1/§2 — TIDAK diasumsikan, placeholder aman):
//   OC-1 — Commercial Net Income: sumber = akun 4800 commercial (kandidat, BELUM final)
//   OC-2 — Income Tax Expense: BELUM ADA source of truth (selalu null dari L1)
//   OC-3 — Average of Debt Balance di Bagian III: MANUAL INPUT (belum auto-pull dari II.A)
//   OC-5 — EBITDA mengikuti Business Classification aktif: pola activeA10 dipakai,
//          TAPI ditandai open (lihat SptTahunanBadan.js ebitdaComponentsByLampiran)
// ═══════════════════════════════════════════════════════════════════════════

// ─── Helpers (pola identik L1D — tidak ada shared util module di project ini) ─

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};

const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;
// fmtRp — pembungkus tampilan tabel: tambah prefix "Rp" hanya saat ada nilai
// (sel kosong/nol tetap kosong). Tidak menyentuh fmt()/parse() asli.
const fmtRp = (v) => { const s = fmt(v); return s ? `Rp${s}` : ''; };

const MONTH_LABELS = ['Month 1','Month 2','Month 3','Month 4','Month 5','Month 6','Month 7','Month 8','Month 9','Month 10','Month 11','Month 12'];

const emptyMonths = () => Array(12).fill('');

const sumMonths = (months) => (Array.isArray(months) ? months : emptyMonths())
    .reduce((s, m) => s + parse(m), 0);

const avgMonths = (months) => sumMonths(months) / 12;

let _uid = 0;
const genId = (prefix) => `${prefix}-${Date.now()}-${_uid++}`;

// ─── Draft Compatibility Contract (Blueprint L11 §5) ──────────────────────────
// Export agar dapat dipakai SptTahunanBadan.js (pola identik buildInitialL9Data /
// mergeWithInitial L9.js — Pendekatan B, nested object, source of truth tunggal).

export const buildInitialL11BData = () => ({
    derRowsUtang: [],
    derRowsModal: [],
    borrowingCostRows: [],
    hasForeignDebt: '',
});

export const mergeWithInitial = (draft) => ({
    ...buildInitialL11BData(),
    derRowsUtang:      Array.isArray(draft?.derRowsUtang) ? draft.derRowsUtang : [],
    derRowsModal:      Array.isArray(draft?.derRowsModal) ? draft.derRowsModal : [],
    borrowingCostRows: Array.isArray(draft?.borrowingCostRows) ? draft.borrowingCostRows : [],
    hasForeignDebt:    draft?.hasForeignDebt || '',
});

// ─── CollapsibleSection — REUSE 100% dari pola AssetSection di L9.js ──────────
// (styling, icon ▾/▸, default collapsed) — tidak ada implementasi collapse
// baru, hanya disalin (tidak ada shared util module di project ini).

const CollapsibleSection = ({ title, defaultExpanded = false, children }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <button
                type="button"
                onClick={() => setExpanded(prev => !prev)}
                className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <span className="text-sm font-bold text-blue-800 uppercase tracking-wide">
                    {expanded ? '▾' : '▸'} {title}
                </span>
            </button>
            {expanded && <div className="p-5">{children}</div>}
        </div>
    );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

// EbitdaRow — baris readonly untuk Bagian I. `openClarification` menampilkan
// badge kecil agar developer/reviewer sadar nilai ini belum final. `bold`
// dipakai untuk baris subtotal (EBITDA / EBITDA 25%) — penekanan visual
// murni via typography (font-weight), TANPA background khusus, mengikuti
// tampilan Coretax DJP (readonly row biasa, bukan highlight card).
const EbitdaRow = ({ no, label, value, isNull, openClarification, bold }) => (
    <div className="grid grid-cols-12 items-center gap-2 px-4 py-2 border-b border-gray-100 last:border-b-0">
        <div className={`col-span-1 text-xs ${bold ? 'font-semibold text-gray-700' : 'text-gray-500'}`}>{no}</div>
        <div className={`col-span-7 text-sm flex items-center gap-2 ${bold ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
            {label}
            {openClarification && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                    OPEN CLARIFICATION
                </span>
            )}
        </div>
        <div className={`col-span-4 text-sm text-right font-mono ${bold ? 'font-bold text-gray-900' : 'text-gray-800'}`}>
            {isNull ? <span className="text-gray-400 italic">— no data yet</span> : `Rp${fmt(value) || '0'}`}
        </div>
    </div>
);

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
        const input = e.target;
        const raw = input.value;
        const cursorPos = input.selectionStart;
        const digitsOnly = raw.replace(/\D/g, '');
        const formatted = digitsOnly === '' ? '' : Number(digitsOnly).toLocaleString('id-ID');
        const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, '').length;

        setDisplayValue(formatted);
        onChange(digitsOnly);

        requestAnimationFrame(() => {
            if (!inputRef.current) return;
            if (digitsBeforeCursor === 0) { inputRef.current.setSelectionRange(0, 0); return; }
            let digitCount = 0, newPos = formatted.length;
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
            {label && <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>}
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
                    className="flex-1 px-3 py-2 text-sm text-left bg-white focus:outline-none min-w-0"
                />
            </div>
        </div>
    );
};

const TextField = ({ label, value, onChange, placeholder = '' }) => (
    <div>
        {label && <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>}
        <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

// ─── Modal: Edit/Add Kreditor Utang (Bagian II.A) ─────────────────────────────

const ModalEditUtang = ({ row, onClose, onSave }) => {
    const [form, setForm] = useState({
        creditorIdentity: row?.creditorIdentity || '',
        creditorName:     row?.creditorName     || '',
        relationship:     row?.relationship     || '',
        months:           row?.months ? [...row.months] : emptyMonths(),
    });
    const setMonth = (idx) => (val) => setForm(prev => {
        const months = [...prev.months];
        months[idx] = val;
        return { ...prev, months };
    });
    const average = avgMonths(form.months);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">Edit Creditor — Average Debt Balance</p>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
                </div>
                <div className="p-5 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-3">
                        <TextField label="Identity Number (NPWP/NIK/Other)" value={form.creditorIdentity} onChange={(v) => setForm(p => ({ ...p, creditorIdentity: v }))} />
                        <TextField label="Lender Name" value={form.creditorName} onChange={(v) => setForm(p => ({ ...p, creditorName: v }))} />
                        <TextField label="Special Relationship" value={form.relationship} onChange={(v) => setForm(p => ({ ...p, relationship: v }))} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">Saldo Utang Tiap Akhir Bulan (Rp)</p>
                        <div className="grid grid-cols-3 gap-3">
                            {MONTH_LABELS.map((label, idx) => (
                                <RpField key={idx} label={label} value={form.months[idx]} onChange={setMonth(idx)} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded px-3 py-2 text-sm flex justify-between">
                        <span className="text-gray-600">Average (automatic)</span>
                        <span className="font-mono font-semibold">Rp{fmt(average) || '0'}</span>
                    </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                    <button onClick={() => onSave(form)} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

// ─── Modal: Edit/Add Rincian Modal (Bagian II.B) ──────────────────────────────

const ModalEditModal_ = ({ row, onClose, onSave }) => {
    const [form, setForm] = useState({
        equityDescription: row?.equityDescription || '',
        months: row?.months ? [...row.months] : emptyMonths(),
    });
    const setMonth = (idx) => (val) => setForm(prev => {
        const months = [...prev.months];
        months[idx] = val;
        return { ...prev, months };
    });
    const average = avgMonths(form.months);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">Edit Equity Detail</p>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
                </div>
                <div className="p-5 space-y-4 overflow-y-auto">
                    <TextField label="Equity Detail" value={form.equityDescription} onChange={(v) => setForm(p => ({ ...p, equityDescription: v }))} placeholder="e.g. Share Capital" />
                    <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">Saldo Modal Tiap Akhir Bulan (Rp)</p>
                        <div className="grid grid-cols-3 gap-3">
                            {MONTH_LABELS.map((label, idx) => (
                                <RpField key={idx} label={label} value={form.months[idx]} onChange={setMonth(idx)} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded px-3 py-2 text-sm flex justify-between">
                        <span className="text-gray-600">Average (automatic)</span>
                        <span className="font-mono font-semibold">Rp{fmt(average) || '0'}</span>
                    </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                    <button onClick={() => onSave(form)} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

// ─── Modal: Edit/Add Biaya Pinjaman (Bagian III) ──────────────────────────────

const ModalEditBorrowingCost = ({ row, onClose, onSave }) => {
    const [form, setForm] = useState({
        creditor:           row?.creditor           || '',
        avgDebtBalance:     row?.avgDebtBalance      || '',
        borrowingCost:      row?.borrowingCost       || '',
        deductibleCost:     row?.deductibleCost      || '',
        nonDeductibleCost:  row?.nonDeductibleCost   || '',
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">Edit Borrowing Cost</p>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
                </div>
                <div className="p-5 space-y-4">
                    <TextField label="Creditor" value={form.creditor} onChange={(v) => setForm(p => ({ ...p, creditor: v }))} />
                    {/* OPEN CLARIFICATION #3 (Blueprint L11 §1/§2) — Average of Debt Balance
                        saat ini MANUAL INPUT. Belum dipastikan apakah harus auto-pull dari
                        rata-rata per kreditor yang sama di Bagian II.A. */}
                    <RpField label="Average Debt Balance (manual — OPEN CLARIFICATION #3)" value={form.avgDebtBalance} onChange={(v) => setForm(p => ({ ...p, avgDebtBalance: v }))} />
                    <RpField label="Borrowing Cost (Interest)" value={form.borrowingCost} onChange={(v) => setForm(p => ({ ...p, borrowingCost: v }))} />
                    <RpField label="Deductible Borrowing Cost" value={form.deductibleCost} onChange={(v) => setForm(p => ({ ...p, deductibleCost: v }))} />
                    <RpField label="Non-Deductible Borrowing Cost" value={form.nonDeductibleCost} onChange={(v) => setForm(p => ({ ...p, nonDeductibleCost: v }))} />
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                    <button onClick={() => onSave(form)} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
//
// Props:
//   taxYear, tin                — header (pola identik L1D)
//   ebitdaComponents             — { commercialNetIncome, depreciationAmortization,
//                                    borrowingCostExpense, incomeTaxExpense } — READ-ONLY,
//                                    dikirim SptTahunanBadan dari L1A/L1C/L1D aktif.
//                                    (Blueprint L11 §4 EBITDA Contract)
//   l11bData                     — { derRowsUtang, derRowsModal, borrowingCostRows,
//                                    hasForeignDebt } — restore draft (Draft Compatibility
//                                    Contract §5 — SELALU objek lengkap via mergeWithInitial)
//   onL11BDataChange              — emit gabungan raw input ke parent (1 callback,
//                                    Blueprint L11 §3 Penyederhanaan Callback)

const L11B = ({
    taxYear,
    tin,
    ebitdaComponents = {},
    l11bData,
    onL11BDataChange,
}) => {
    const initial = useMemo(() => mergeWithInitial(l11bData), []); // eslint-disable-line react-hooks/exhaustive-deps

    const [rowsUtang, setRowsUtang]         = useState(initial.derRowsUtang);
    const [rowsModal, setRowsModal]         = useState(initial.derRowsModal);
    const [borrowingRows, setBorrowingRows] = useState(initial.borrowingCostRows);
    const [hasForeignDebt, setHasForeignDebt] = useState(initial.hasForeignDebt);

    const [editingUtang, setEditingUtang]         = useState(null); // null | 'new' | index
    const [editingModal, setEditingModal]         = useState(null);
    const [editingBorrowing, setEditingBorrowing] = useState(null);

    // Anti-loop guard: tandai perubahan l11bData yang berasal dari emit kita
    // sendiri (pola identik skipRestoreA di L1A/L1D), agar tidak memantul balik.
    const skipRestore = useRef(false);

    useEffect(() => {
        if (skipRestore.current) { skipRestore.current = false; return; }
        if (l11bData) {
            const merged = mergeWithInitial(l11bData);
            setRowsUtang(merged.derRowsUtang);
            setRowsModal(merged.derRowsModal);
            setBorrowingRows(merged.borrowingCostRows);
            setHasForeignDebt(merged.hasForeignDebt);
        }
    }, [l11bData]); // eslint-disable-line react-hooks/exhaustive-deps

    // Emit gabungan ke parent setiap kali salah satu piece berubah — pola
    // identik l9Data (1 objek besar, 1 setter di parent).
    const combinedData = useMemo(() => ({
        derRowsUtang: rowsUtang,
        derRowsModal: rowsModal,
        borrowingCostRows: borrowingRows,
        hasForeignDebt,
    }), [rowsUtang, rowsModal, borrowingRows, hasForeignDebt]);

    useEffect(() => {
        if (onL11BDataChange) {
            skipRestore.current = true;
            onL11BDataChange(combinedData);
        }
    }, [combinedData, onL11BDataChange]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Bagian I — EBITDA (100% derived dari props, TIDAK ADA state lokal) ────
    const {
        commercialNetIncome = 0,
        depreciationAmortization = 0,
        borrowingCostExpense = 0,
        incomeTaxExpense = null,
    } = ebitdaComponents || {};

    const ebitda = useMemo(() => {
        // incomeTaxExpense null (OC-2 belum terjawab) diperlakukan sebagai 0
        // HANYA untuk keperluan total EBITDA — tampilan baris tetap menunjukkan "—".
        const itExpenseForCalc = incomeTaxExpense ?? 0;
        return commercialNetIncome + depreciationAmortization + itExpenseForCalc + borrowingCostExpense;
    }, [commercialNetIncome, depreciationAmortization, incomeTaxExpense, borrowingCostExpense]);

    const ebitda25 = ebitda * 0.25;

    // ── Bagian II — DER ────────────────────────────────────────────────────────
    const rowsUtangComputed = useMemo(() => rowsUtang.map(r => ({ ...r, average: avgMonths(r.months) })), [rowsUtang]);
    const rowsModalComputed = useMemo(() => rowsModal.map(r => ({ ...r, average: avgMonths(r.months) })), [rowsModal]);

    const totalUtangPerBulan = useMemo(() => {
        const totals = Array(12).fill(0);
        rowsUtang.forEach(r => (r.months || emptyMonths()).forEach((m, i) => { totals[i] += parse(m); }));
        return totals;
    }, [rowsUtang]);
    const totalModalPerBulan = useMemo(() => {
        const totals = Array(12).fill(0);
        rowsModal.forEach(r => (r.months || emptyMonths()).forEach((m, i) => { totals[i] += parse(m); }));
        return totals;
    }, [rowsModal]);

    const totalAvgUtang = useMemo(() => rowsUtangComputed.reduce((s, r) => s + r.average, 0), [rowsUtangComputed]);
    const totalAvgModal = useMemo(() => rowsModalComputed.reduce((s, r) => s + r.average, 0), [rowsModalComputed]);

    const der = totalAvgModal > 0 ? (totalAvgUtang / totalAvgModal) : null; // null → tampil "N/A" (pola screenshot)

    // ── Bagian III — Borrowing Cost ────────────────────────────────────────────
    const totalBorrowing = useMemo(() => borrowingRows.reduce((acc, r) => ({
        avgDebtBalance:    acc.avgDebtBalance    + parse(r.avgDebtBalance),
        borrowingCost:     acc.borrowingCost     + parse(r.borrowingCost),
        deductibleCost:    acc.deductibleCost    + parse(r.deductibleCost),
        nonDeductibleCost: acc.nonDeductibleCost + parse(r.nonDeductibleCost),
    }), { avgDebtBalance: 0, borrowingCost: 0, deductibleCost: 0, nonDeductibleCost: 0 }), [borrowingRows]);

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleSaveUtang = (form) => {
        setRowsUtang(prev => {
            if (editingUtang === 'new') return [...prev, { id: genId('utang'), ...form }];
            return prev.map((r, i) => i === editingUtang ? { ...r, ...form } : r);
        });
        setEditingUtang(null);
    };
    const handleDeleteUtang = (idx) => setRowsUtang(prev => prev.filter((_, i) => i !== idx));

    const handleSaveModal_ = (form) => {
        setRowsModal(prev => {
            if (editingModal === 'new') return [...prev, { id: genId('modal'), ...form }];
            return prev.map((r, i) => i === editingModal ? { ...r, ...form } : r);
        });
        setEditingModal(null);
    };
    const handleDeleteModal_ = (idx) => setRowsModal(prev => prev.filter((_, i) => i !== idx));

    const handleSaveBorrowing = (form) => {
        setBorrowingRows(prev => {
            if (editingBorrowing === 'new') return [...prev, { id: genId('borrow'), ...form }];
            return prev.map((r, i) => i === editingBorrowing ? { ...r, ...form } : r);
        });
        setEditingBorrowing(null);
    };
    const handleDeleteBorrowing = (idx) => setBorrowingRows(prev => prev.filter((_, i) => i !== idx));

    // ── Styles — UI mengikuti referensi tabel L13A.js (header kuning, border
    // putih antar-header, border penuh pada body cell, sticky header + sticky
    // kolom Action). HANYA style/className — tidak ada logic yang berubah. ──
    const thCls = "px-3 py-2 text-center align-middle text-xs font-bold text-gray-800 uppercase bg-yellow-400 border border-white border-b-gray-300 whitespace-nowrap";
    const tdCls = "px-3 py-2 text-xs text-gray-700 border border-gray-200 whitespace-nowrap";

    // Sticky header (top) & sticky kolom Action (left) — pola identik L13A.
    const thStickyTop    = { position: 'sticky', top: 0, zIndex: 20, backgroundColor: '#facc15' };
    const thStickyAction = { position: 'sticky', top: 0, left: 0, zIndex: 21, backgroundColor: '#facc15' };
    const tdStickyAction = { position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#ffffff' };
    // Baris di dalam tbody yang berlatar abu-abu (mis. "JUMLAH") perlu sticky
    // Action-nya sendiri agar warnanya tidak tertimpa putih dari tdStickyAction.
    const tdStickyActionMuted = { ...tdStickyAction, backgroundColor: '#f9fafb' };

    return (
        <div className="p-6 space-y-6">
            {/* ── HEADER — identik L1D ─────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 11-B — Calculation of Debt to Equity Ratio (DER)
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Year" value={taxYear} />
                    <ReadonlyField label="TIN (NPWP)" value={tin} />
                </div>
            </div>

            {/* ── BAGIAN I — EBITDA ────────────────────────────────────────── */}
            <CollapsibleSection title="I. Calculation of EBITDA">
                <div className="divide-y divide-gray-100 border border-gray-100 rounded overflow-hidden">
                    <EbitdaRow no="1" label="Commercial Net Income" value={commercialNetIncome} openClarification />
                    <EbitdaRow no="2" label="Depreciation and Amortization Expenses" value={depreciationAmortization} />
                    <EbitdaRow no="3" label="Income Tax Expense" value={incomeTaxExpense} isNull={incomeTaxExpense === null} openClarification />
                    <EbitdaRow no="4" label="Borrowing Cost Expense" value={borrowingCostExpense} />
                    <EbitdaRow no="5" label="EBITDA" value={ebitda} bold />
                    <EbitdaRow no="6" label="EBITDA (25%)" value={ebitda25} bold />
                </div>
                <div className="mt-3 px-4 py-2 bg-amber-50 border border-amber-100 rounded text-[11px] text-amber-700">
                    Nilai pada Bagian I bersifat read-only — mengikuti Lampiran 1 (L1A/L1C/L1D)
                    sesuai Business Classification yang aktif saat ini (OPEN CLARIFICATION #5,
                    lihat Blueprint L11 §1 poin 5). Beberapa komponen masih menunggu konfirmasi
                    business rule dari client (OPEN CLARIFICATION #1 &amp; #2).
                </div>
            </CollapsibleSection>

            {/* ── BAGIAN II — Debt to Equity Ratio (DER): II.A + II.B + II.C ──── */}
            <CollapsibleSection title="II. Debt to Equity Ratio (DER)">
                <div className="space-y-6">
                    {/* II.A — Saldo Rata-rata Utang */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">A. Calculation of Debt Balance Average</p>
                            <button onClick={() => setEditingUtang('new')} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700">+ Add</button>
                        </div>
                        <div className="border border-gray-200 rounded-lg overflow-x-auto overflow-y-auto" style={{ maxHeight: 420 }}>
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr>
                                        <th className={thCls} style={thStickyAction}>Action</th>
                                        <th className={thCls} style={thStickyTop}>Identity Number</th>
                                        <th className={thCls} style={thStickyTop}>Name</th>
                                        <th className={thCls} style={thStickyTop}>Special Rel.</th>
                                        {MONTH_LABELS.map(l => <th key={l} className={thCls} style={thStickyTop}>{l}</th>)}
                                        <th className={thCls} style={thStickyTop}>Average</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rowsUtangComputed.length === 0 && (
                                        <tr><td colSpan={16} className="px-3 py-6 text-center text-gray-400 text-xs border border-gray-200">No data found.</td></tr>
                                    )}
                                    {rowsUtangComputed.map((r, idx) => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <td className={tdCls} style={tdStickyAction}>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setEditingUtang(idx)} title="Edit" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDeleteUtang(idx)} title="Delete" className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className={tdCls}>{r.creditorIdentity}</td>
                                            <td className={tdCls}>{r.creditorName}</td>
                                            <td className={tdCls}>{r.relationship}</td>
                                            {(r.months || emptyMonths()).map((m, i) => <td key={i} className={`${tdCls} text-right font-mono`}>{fmtRp(m)}</td>)}
                                            <td className={`${tdCls} text-right font-mono font-semibold`}>{fmtRp(r.average)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 font-semibold">
                                        <td className={tdCls} style={tdStickyActionMuted} colSpan={4}>TOTAL</td>
                                        {totalUtangPerBulan.map((t, i) => <td key={i} className={`${tdCls} text-right font-mono`}>{fmtRp(t)}</td>)}
                                        <td className={`${tdCls} text-right font-mono`}>{fmtRp(totalAvgUtang)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* II.B — Saldo Rata-rata Modal */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">B. Calculation of Equity Balance Average</p>
                            <button onClick={() => setEditingModal('new')} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700">+ Add</button>
                        </div>
                        <div className="border border-gray-200 rounded-lg overflow-x-auto overflow-y-auto" style={{ maxHeight: 420 }}>
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr>
                                        <th className={thCls} style={thStickyAction}>Action</th>
                                        <th className={thCls} style={thStickyTop}>Equity Detail</th>
                                        {MONTH_LABELS.map(l => <th key={l} className={thCls} style={thStickyTop}>{l}</th>)}
                                        <th className={thCls} style={thStickyTop}>Average</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rowsModalComputed.length === 0 && (
                                        <tr><td colSpan={14} className="px-3 py-6 text-center text-gray-400 text-xs border border-gray-200">No data found.</td></tr>
                                    )}
                                    {rowsModalComputed.map((r, idx) => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <td className={tdCls} style={tdStickyAction}>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setEditingModal(idx)} title="Edit" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDeleteModal_(idx)} title="Delete" className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className={tdCls}>{r.equityDescription}</td>
                                            {(r.months || emptyMonths()).map((m, i) => <td key={i} className={`${tdCls} text-right font-mono`}>{fmtRp(m)}</td>)}
                                            <td className={`${tdCls} text-right font-mono font-semibold`}>{fmtRp(r.average)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 font-semibold">
                                        <td className={tdCls} style={tdStickyActionMuted} colSpan={2}>TOTAL</td>
                                        {totalModalPerBulan.map((t, i) => <td key={i} className={`${tdCls} text-right font-mono`}>{fmtRp(t)}</td>)}
                                        <td className={`${tdCls} text-right font-mono`}>{fmtRp(totalAvgModal)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* II.C — DER */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">C. Calculation of Debt to Equity Ratio (DER)</p>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 text-sm font-mono">
                                <span>DER =</span>
                                <div className="flex flex-col items-center">
                                    <span className="border-b border-gray-400 px-2">Rp{fmt(totalAvgUtang) || '0'}</span>
                                    <span className="px-2">Rp{fmt(totalAvgModal) || '0'}</span>
                                </div>
                                <span>= <span className="font-bold">{der === null ? 'N/A' : der.toFixed(2)}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            {/* ── BAGIAN III — Borrowing Cost ─────────────────────────────── */}
            <CollapsibleSection title="III. Calculation of Borrowing Cost">
                <div className="flex justify-end mb-3">
                    <button onClick={() => setEditingBorrowing('new')} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700">+ Add</button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-x-auto overflow-y-auto" style={{ maxHeight: 360 }}>
                    <table className="w-full text-xs border-collapse">
                        <thead>
                            <tr>
                                <th className={thCls} style={thStickyAction}>Action</th>
                                <th className={thCls} style={thStickyTop}>Creditor</th>
                                <th className={thCls} style={thStickyTop}>Average Debt Balance</th>
                                <th className={thCls} style={thStickyTop}>Borrowing Cost (Interest)</th>
                                <th className={thCls} style={thStickyTop}>Deductible</th>
                                <th className={thCls} style={thStickyTop}>Non-Deductible</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowingRows.length === 0 && (
                                <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-400 text-xs border border-gray-200">No data found.</td></tr>
                            )}
                            {borrowingRows.map((r, idx) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className={tdCls} style={tdStickyAction}>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setEditingBorrowing(idx)} title="Edit" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDeleteBorrowing(idx)} title="Delete" className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className={tdCls}>{r.creditor}</td>
                                    <td className={`${tdCls} text-right font-mono`}>{fmtRp(r.avgDebtBalance)}</td>
                                    <td className={`${tdCls} text-right font-mono`}>{fmtRp(r.borrowingCost)}</td>
                                    <td className={`${tdCls} text-right font-mono`}>{fmtRp(r.deductibleCost)}</td>
                                    <td className={`${tdCls} text-right font-mono`}>{fmtRp(r.nonDeductibleCost)}</td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 font-semibold">
                                <td className={tdCls} style={tdStickyActionMuted} colSpan={2}>TOTAL</td>
                                <td className={`${tdCls} text-right font-mono`}>{fmtRp(totalBorrowing.avgDebtBalance)}</td>
                                <td className={`${tdCls} text-right font-mono`}>{fmtRp(totalBorrowing.borrowingCost)}</td>
                                <td className={`${tdCls} text-right font-mono`}>{fmtRp(totalBorrowing.deductibleCost)}</td>
                                <td className={`${tdCls} text-right font-mono`}>{fmtRp(totalBorrowing.nonDeductibleCost)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-700 mb-2">Do you have foreign private debt? If "Yes", complete Lampiran 11-C.</p>
                    <div className="flex gap-4 text-sm">
                        <label className="flex items-center gap-1.5">
                            <input type="radio" name="hasForeignDebt" checked={hasForeignDebt === 'Ya'} onChange={() => setHasForeignDebt('Ya')} /> Yes
                        </label>
                        <label className="flex items-center gap-1.5">
                            <input type="radio" name="hasForeignDebt" checked={hasForeignDebt === 'Tidak'} onChange={() => setHasForeignDebt('Tidak')} /> No
                        </label>
                    </div>
                </div>
            </CollapsibleSection>

            {/* ── MODALS ───────────────────────────────────────────────────── */}
            {editingUtang !== null && (
                <ModalEditUtang
                    row={editingUtang === 'new' ? null : rowsUtang[editingUtang]}
                    onClose={() => setEditingUtang(null)}
                    onSave={handleSaveUtang}
                />
            )}
            {editingModal !== null && (
                <ModalEditModal_
                    row={editingModal === 'new' ? null : rowsModal[editingModal]}
                    onClose={() => setEditingModal(null)}
                    onSave={handleSaveModal_}
                />
            )}
            {editingBorrowing !== null && (
                <ModalEditBorrowingCost
                    row={editingBorrowing === 'new' ? null : borrowingRows[editingBorrowing]}
                    onClose={() => setEditingBorrowing(null)}
                    onSave={handleSaveBorrowing}
                />
            )}
        </div>
    );
};

export default L11B;