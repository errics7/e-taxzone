import React, { useState, useRef, useEffect, useMemo } from 'react';

// ─── Helpers (disalin dari pola L1a.js — Code Preservation Rule) ──────────────

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};

const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

// buildInitialRows BUKAN Source of Truth. Fungsi ini murni scaffolding —
// membentuk struktur baris kosong dari daftar tahun pajak yang diterima.
// Source of Truth sesungguhnya adalah state `rows` di komponen L7 (setelah
// di-merge dengan raw input draft, lihat mergeRowsWithDraft di bawah).
//
// l7TaxYears (prop) hanyalah DATA yang diterima L7 dari parent — L7 tidak
// mengetahui dan tidak perlu tahu bagaimana parent memperoleh data tersebut
// (apakah dari backend, dari tahun SPT berjalan, atau sumber lain). Ini murni
// implementation detail milik parent, di luar tanggung jawab L7.
const buildInitialRows = (taxYears) =>
    (Array.isArray(taxYears) ? taxYears : []).map((year) => ({
        taxYear:      year,
        netFiscal:    '',
        compYMinus4:  '',
        compYMinus3:  '',
        compYMinus2:  '',
        compYMinus1:  '',
        compThisYear: '',
        compYPlus1:   '',
    }));

// Merge raw input dari draft ke initial rows — key merge adalah taxYear
// (bukan code, karena baris L7 tidak memiliki kode akun statis).
// Hanya field raw input yang di-merge; derived value (total) tidak pernah disimpan.
const mergeRowsWithDraft = (initialRows, draftRows) => {
    if (!Array.isArray(draftRows) || draftRows.length === 0) return initialRows;
    const map = {};
    draftRows.forEach((d) => { if (d && d.taxYear !== undefined) map[d.taxYear] = d; });
    return initialRows.map((row) => {
        const d = map[row.taxYear];
        if (!d) return row;
        return {
            ...row,
            netFiscal:    d.netFiscal    ?? row.netFiscal,
            compYMinus4:  d.compYMinus4  ?? row.compYMinus4,
            compYMinus3:  d.compYMinus3  ?? row.compYMinus3,
            compYMinus2:  d.compYMinus2  ?? row.compYMinus2,
            compYMinus1:  d.compYMinus1  ?? row.compYMinus1,
            compThisYear: d.compThisYear ?? row.compThisYear,
            compYPlus1:   d.compYPlus1   ?? row.compYPlus1,
        };
    });
};

// ─── Sub-components (disalin dari pola L1a.js) ────────────────────────────────

const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

// RpField — identik dengan implementasi L1a.js (live formatting Rupiah, cursor-safe).
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
            <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
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

// ─── Modal Edit Baris L7 ───────────────────────────────────────────────────────
// 1 field readonly (Tax Year) + 7 field editable (kolom 3–9). Label field mengikuti
// teks literal pada modal Coretax (Gambar 2) — termasuk tidak adanya "(Loss)"
// pada field Nilai, dan tidak adanya sufiks tambahan pada field kolom (8)/(9).

const ModalEditL7Row = ({ row, onClose, onSave }) => {
    const [form, setForm] = useState({
        netFiscal:    row.netFiscal,
        compYMinus4:  row.compYMinus4,
        compYMinus3:  row.compYMinus3,
        compYMinus2:  row.compYMinus2,
        compYMinus1:  row.compYMinus1,
        compThisYear: row.compThisYear,
        compYPlus1:   row.compYPlus1,
    });

    const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

    const handleSave = () => {
        onSave({ ...form });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Modal Header */}
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-white font-semibold text-sm">Corporate Income Tax Return</p>
                        <p className="text-blue-200 text-xs mt-0.5">Tax Year {row.taxYear}</p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <ReadonlyField label="Tax Year" value={String(row.taxYear)} />

                    <RpField
                        label="Fiscal Net Profit Income"
                        value={form.netFiscal}
                        onChange={set('netFiscal')}
                    />

                    <RpField
                        label="Fiscal Loss Compensation Y-4"
                        value={form.compYMinus4}
                        onChange={set('compYMinus4')}
                    />

                    <RpField
                        label="Fiscal Loss Compensation Y-3"
                        value={form.compYMinus3}
                        onChange={set('compYMinus3')}
                    />

                    <RpField
                        label="Fiscal Loss Compensation Y-2"
                        value={form.compYMinus2}
                        onChange={set('compYMinus2')}
                    />

                    <RpField
                        label="Fiscal Loss Compensation Y-1"
                        value={form.compYMinus1}
                        onChange={set('compYMinus1')}
                    />

                    <RpField
                        label={`Fiscal Loss Compensation ${row.taxYear}`}
                        value={form.compThisYear}
                        onChange={set('compThisYear')}
                    />

                    <RpField
                        label="Fiscal Loss Compensation Y+1"
                        value={form.compYPlus1}
                        onChange={set('compYPlus1')}
                    />
                </div>

                {/* Modal Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── L7 — Kompensasi Kerugian Fiskal ────────────────────────────────────────────
// Komponen mandiri (self-contained). Props:
//
//   taxYear             : header — tahun SPT berjalan (mis. sptData.header.tax_year),
//                         pola identik props taxYear pada L2/L3/L4/L5/L6
//   tin                 : header — NPWP (mis. sptData.company_identity.npwp),
//                         pola identik props tin pada L2/L3/L4/L5/L6
//   l7Rows              : raw rows dari draft/parent (opsional, default [])
//   l7TaxYears          : number[] — daftar tahun pajak untuk baris tabel, DATA
//                         MURNI dari parent (opsional, default []). L7 tidak
//                         peduli bagaimana parent memperoleh array ini.
//   onRowsChange        : (rows) => void
//   onTotalCol8Change   : (total) => void
//   onTotalCol9Change   : (total) => void
//
// Ketiga callback di atas HANYA mengirim data ke parent (one-way emit).
// Callback ini TIDAK PERNAH digunakan untuk membaca nilai balik atau mengubah
// state internal L7 — state internal (`rows`) hanya diubah lewat setRows di
// dalam komponen ini sendiri (melalui handleSaveRow atau efek restore draft).
const L7 = ({
    taxYear,
    tin,
    l7Rows,
    l7TaxYears,
    onRowsChange,
    onTotalCol8Change,
    onTotalCol9Change,
}) => {
    const [rows, setRows] = useState(() =>
        mergeRowsWithDraft(buildInitialRows(l7TaxYears), l7Rows)
    );
    const [editingIdx, setEditingIdx] = useState(null);

    // Ref anti-loop: sama seperti pola L1A — tandai jika perubahan l7Rows
    // berasal dari child itu sendiri (via onRowsChange), agar useEffect restore
    // tidak memantul balik.
    const skipRestore = useRef(false);

    // Restore saat Load Draft: l7Rows berubah dari [] → data draft.
    useEffect(() => {
        if (skipRestore.current) { skipRestore.current = false; return; }
        if (Array.isArray(l7Rows) && l7Rows.length > 0) {
            setRows(mergeRowsWithDraft(buildInitialRows(l7TaxYears), l7Rows));
        }
    }, [l7Rows]); // eslint-disable-line react-hooks/exhaustive-deps

    // Rebuild baris saat daftar tahun pajak berubah — merge ulang agar data
    // yang sudah diisi tidak hilang. L7 tidak peduli mengapa l7TaxYears berubah.
    useEffect(() => {
        setRows((prev) => mergeRowsWithDraft(buildInitialRows(l7TaxYears), prev));
    }, [l7TaxYears]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Save handler ────────────────────────────────────────────────────────
    const handleSaveRow = (idx, form) => {
        setRows((prev) => {
            const next = prev.map((r, i) => (i !== idx ? r : { ...r, ...form }));
            // Emit ke parent — one-way. onRowsChange tidak pernah dipakai untuk
            // menerima nilai balik; parent hanya "menyimpan" apa yang dikirim.
            if (onRowsChange) {
                skipRestore.current = true;
                onRowsChange(next);
            }
            return next;
        });
        setEditingIdx(null);
    };

    // ── Derived: Total Kolom (8) dan (9) — SUM datar, tanpa cascading ──────────
    // Sesuai Excel row 27: hanya kolom (8) dan (9) yang memiliki formula SUM;
    // kolom (4)-(7) tidak memiliki total.
    const totalCol8 = useMemo(
        () => rows.reduce((sum, r) => sum + parse(r.compThisYear), 0),
        [rows]
    );
    const totalCol9 = useMemo(
        () => rows.reduce((sum, r) => sum + parse(r.compYPlus1), 0),
        [rows]
    );

    // Emit total ke parent — one-way, murni memberi tahu parent nilai terbaru.
    useEffect(() => {
        if (onTotalCol8Change) onTotalCol8Change(totalCol8);
    }, [totalCol8]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (onTotalCol9Change) onTotalCol9Change(totalCol9);
    }, [totalCol9]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Styling: sticky header 2-tingkat + freeze 2 kolom kiri (Action, No) ────
    // Catatan: kolom Tahun TIDAK di-freeze (berbeda dari draft sebelumnya).
    // Alasan: Screenshot Coretax menampilkan grup header "FISCAL NETT PROFIT
    // (LOSS) INCOME" yang membentang di atas kolom Tahun + Nilai. Jika kolom
    // Tahun tetap di-freeze, sel header grup (yang membentang 2 kolom, salah
    // satunya freeze dan satunya tidak) akan tidak sejajar saat tabel di-scroll
    // horizontal. Freeze dipersempit menjadi Action + No agar grouping header
    // sesuai Screenshot tanpa bug visual.
    const thCls = "px-3 py-2 text-center text-xs font-semibold text-gray-600 bg-gray-100 border-b border-gray-200 whitespace-nowrap";
    const tdCls = "px-3 py-2 text-xs text-gray-700 border-b border-gray-100";
    const tdNum = "px-3 py-2 text-xs text-right text-gray-700 border-b border-gray-100 font-mono";

    const COL_ACTION_W = 56;
    const COL_NO_W     = 48;

    const thAction = { position: 'sticky', left: 0,             top: 0, zIndex: 5, backgroundColor: '#f3f4f6' };
    const thNo     = { position: 'sticky', left: COL_ACTION_W,  top: 0, zIndex: 5, backgroundColor: '#f3f4f6' };
    const thTop    = { position: 'sticky', top: 0,                       zIndex: 3, backgroundColor: '#f3f4f6' };

    const tdAction = { position: 'sticky', left: 0,             zIndex: 1, backgroundColor: '#ffffff' };
    const tdNo     = { position: 'sticky', left: COL_ACTION_W,  zIndex: 1, backgroundColor: '#ffffff' };

    // Display wrapper murni UI — TIDAK mengubah formatter/parser yang sudah ada.
    // Sama seperti pola "Rp {formatRupiahDisplay(...)}" pada L10A.js: fmt() tetap
    // dipakai apa adanya, hanya ditambah prefix "Rp" dan fallback tampilan "0"
    // ketika fmt() mengembalikan string kosong (nilai 0).
    const rp = (v) => `Rp ${fmt(v) || '0'}`;

    return (
        <div className="p-6 space-y-6">
            {/* ── HEADER ─────────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 7 — Carried Forward of Losses
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Period Year" value={taxYear ? String(taxYear) : ''} />
                    <ReadonlyField label="TIN"              value={tin || ''} />
                </div>
            </div>

            {/* ── PART A — Carried Forward of Losses ────────────────────────────── */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Part A — Carried Forward of Losses</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Kompensasi kerugian tahun-tahun sebelumnya</p>
                </div>

                {rows.length === 0 ? (
                    <div className="p-4">
                        <p className="text-sm text-gray-500 italic">
                            Belum ada data tahun pajak tersedia.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '600px' }}>
                        <table className="w-full text-sm border-collapse min-w-[1100px]">
                            <thead>
                                <tr>
                                    <th className={thCls} style={{ ...thAction, minWidth: COL_ACTION_W }}>Action</th>
                                    <th className={thCls} style={{ ...thNo,     minWidth: COL_NO_W     }}>No</th>
                                    <th className={thCls} style={thTop}>Tax Year</th>
                                    <th className={thCls} style={thTop}>Fiscal Net Profit Income</th>
                                    <th className={thCls} style={thTop}>Y-4</th>
                                    <th className={thCls} style={thTop}>Y-3</th>
                                    <th className={thCls} style={thTop}>Y-2</th>
                                    <th className={thCls} style={thTop}>Y-1</th>
                                    <th className={thCls} style={thTop}>This Tax Year</th>
                                    <th className={thCls} style={thTop}>Following Tax Year (Y+1)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr key={row.taxYear} className="hover:bg-gray-50 transition-colors">
                                        <td className={tdCls} style={tdAction}>
                                            <button
                                                onClick={() => setEditingIdx(idx)}
                                                title="Edit"
                                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                        </td>
                                        <td className={tdCls} style={tdNo}>{idx + 1}</td>
                                        <td className={`${tdCls} text-center font-mono`}>{row.taxYear}</td>
                                        <td className={`${tdNum} ${parse(row.netFiscal) < 0 ? 'text-red-600' : ''}`}>
                                            {rp(row.netFiscal)}
                                        </td>
                                        <td className={tdNum}>{rp(row.compYMinus4)}</td>
                                        <td className={tdNum}>{rp(row.compYMinus3)}</td>
                                        <td className={tdNum}>{rp(row.compYMinus2)}</td>
                                        <td className={tdNum}>{rp(row.compYMinus1)}</td>
                                        <td className={tdNum}>{rp(row.compThisYear)}</td>
                                        <td className={tdNum}>{rp(row.compYPlus1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            {/* Baris JUMLAH — hanya SUM kolom (8) dan (9), sesuai Excel row 27 */}
                            <tfoot>
                                <tr className="bg-blue-700">
                                    <td className="px-3 py-2" style={{ ...tdAction, backgroundColor: '#1d4ed8' }} />
                                    <td className="px-3 py-2" style={{ ...tdNo, backgroundColor: '#1d4ed8' }} />
                                    <td className="px-3 py-2 text-xs font-bold text-white text-center" colSpan={2}>
                                        JUMLAH
                                    </td>
                                    <td className="px-3 py-2" colSpan={4} />
                                    <td className={`px-3 py-2 text-xs font-bold text-right font-mono ${totalCol8 < 0 ? 'text-red-300' : 'text-white'}`}>
                                        {rp(totalCol8)}
                                    </td>
                                    <td className={`px-3 py-2 text-xs font-bold text-right font-mono ${totalCol9 < 0 ? 'text-red-300' : 'text-white'}`}>
                                        {rp(totalCol9)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                    <p>Jumlah kolom "This Tax Year" digunakan sebagai pengurang penghasilan neto pada Formulir Induk Bagian D.8.</p>
                    <p>Jumlah kolom "Following Tax Year (Y+1)" digunakan sebagai pengurang penghasilan neto pada Formulir Lampiran 6 Angka 2.</p>
                </div>
            </div>

            {/* ── MODAL ──────────────────────────────────────────────────────── */}
            {editingIdx !== null && (
                <ModalEditL7Row
                    row={rows[editingIdx]}
                    onClose={() => setEditingIdx(null)}
                    onSave={(form) => handleSaveRow(editingIdx, form)}
                />
            )}
        </div>
    );
};

export default L7;