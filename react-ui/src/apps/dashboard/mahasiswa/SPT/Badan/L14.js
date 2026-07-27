import React, { useState, useMemo, useEffect, useRef } from 'react';

// ─── Static Data ────────────────────────────────────────────────────────────

// BR: "Form of Reinvestment of Remaining Excess" — enum tetap (bukan free text).
const BENTUK_PENANAMAN_KEMBALI = [
    { value: '',  label: '-Please select-' },
    { value: '1', label: '1. Invested in the development and procurement of facilities and infrastructure for public facilities' },
    { value: '2', label: '2. Invested in the development and procurement of facilities and infrastructure provided to other social and/or religious bodies or institutions' },
    { value: '3', label: '3. Invested in the development and procurement of facilities and infrastructure for own use' },
    { value: '4', label: '4. Invested in an endowment fund' },
];

const bentukLabel = (value) => {
    const opt = BENTUK_PENANAMAN_KEMBALI.find(o => o.value === value);
    return opt && opt.value !== '' ? opt.label : '';
};

// ─── Helpers (identik pola L1A) ──────────────────────────────────────────────

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};

const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

// fmtRp: HANYA untuk display tabel (readonly text), BUKAN untuk RpField input
// (RpField sudah punya "Rp" sebagai elemen visual terpisah — lihat komponen
// RpField di bawah). Reuse logika angka id-ID yang sama dengan `fmt`/`parse` di
// atas (dan dipakai di seluruh Lampiran lain seperti L1A) — hanya menambahkan
// prefix "Rp" dan menampilkan 0 sebagai "Rp0" (bukan string kosong), sesuai
// permintaan revisi tampilan tabel. TIDAK mengubah nilai yang disimpan di
// state/Save Draft — murni format tampilan.
// Tanda minus (jika nilai negatif) diletakkan SEBELUM "Rp" (mis. "-Rp35.000"),
// bukan di antara "Rp" dan angka (BUKAN "Rp-35.000").
const fmtRp = (v) => {
    const n = parse(v);
    const sign = n < 0 ? '-' : '';
    return `${sign}Rp${Math.abs(n).toLocaleString('id-ID')}`;
};

// BR — Historical Year: 5 row selalu ada (taxYear-4 ... taxYear). Tidak ada
// Add Row / Remove Row. Default seluruh nilai = 0.
const buildInitialRows = (taxYear) => {
    const ty = parseInt(taxYear, 10) || new Date().getFullYear();
    const years = [ty - 4, ty - 3, ty - 2, ty - 1, ty];
    return years.map(year => ({
        year,
        bentukPenanaman: '',
        penyediaan: '',
        tahun1: '',
        tahun2: '',
        tahun3: '',
        tahun4: '',
    }));
};

// Merge RAW INPUT draft (sesuai BR Save Draft) ke initial rows berdasarkan `year`.
// Field hasil perhitungan (jumlahPenggunaan, sisaBelum, sisaMelewati) TIDAK di-merge
// — selalu dihitung ulang saat Load Draft (pola identik L1A).
//
// BR — Historical Year (ditegaskan ulang): fungsi ini SELALU mulai dari `initialRows`
// (5 row historis hasil buildInitialRows(taxYear)), lalu meng-overlay draft HANYA pada
// row yang year-nya cocok. Array TIDAK PERNAH diganti oleh draftRows secara langsung —
// jika draft cuma berisi 1 row (mis. 2022), 4 row lainnya (2021, 2023, 2024, 2025) tetap
// dipertahankan sebagai default dari initialRows karena `initialRows.map(...)` selalu
// mengiterasi seluruh 5 row, bukan draftRows.
const mergeRowsWithDraft = (initialRows, draftRows) => {
    if (!Array.isArray(draftRows) || draftRows.length === 0) return initialRows;
    const map = {};
    draftRows.forEach(d => { if (d && d.year !== undefined) map[d.year] = d; });
    return initialRows.map(row => {           // ← iterasi initialRows (5 row tetap), BUKAN draftRows
        const d = map[row.year];
        if (!d) return row;                   // tidak ada draft untuk year ini → tetap default
        return {
            ...row,
            bentukPenanaman: d.bentukPenanaman ?? row.bentukPenanaman,
            penyediaan:      d.penyediaan      ?? row.penyediaan,
            tahun1:          d.tahun1          ?? row.tahun1,
            tahun2:          d.tahun2          ?? row.tahun2,
            tahun3:          d.tahun3          ?? row.tahun3,
            tahun4:          d.tahun4          ?? row.tahun4,
        };
    });
};

// ─── Sub-components (identik pola L1A) ───────────────────────────────────────

const ReadonlyField = ({ label, value, helper }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
        {helper && (
            <p className="mt-1 text-xs text-gray-400 flex items-start gap-1">
                <span>ⓘ</span><span>{helper}</span>
            </p>
        )}
    </div>
);

// RpField: identik pola L1A (input nominal + prefix "Rp" + live formatting id-ID).
// Versi ini tidak butuh varian isContraAccount (L14 tidak memiliki signMinus).
const RpField = ({ label, value, onChange, placeholder = '0', disabled = false }) => {
    const [displayValue, setDisplayValue] = useState(value ? fmt(value) : '');
    const inputRef = useRef(null);
    const isFocused = useRef(false);

    useEffect(() => {
        if (!isFocused.current) setDisplayValue(value ? fmt(value) : '');
    }, [value]);

    const handleFocus = () => { isFocused.current = true; };

    const handleChange = (e) => {
        const raw = e.target.value;
        const cursorPos = e.target.selectionStart;
        const digitsOnly = raw.replace(/\D/g, '');
        const formatted = digitsOnly === '' ? '' : Number(digitsOnly).toLocaleString('id-ID');

        setDisplayValue(formatted);
        onChange(digitsOnly);

        const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, '').length;
        requestAnimationFrame(() => {
            if (!inputRef.current) return;
            if (digitsBeforeCursor === 0) { inputRef.current.setSelectionRange(0, 0); return; }
            let digitCount = 0;
            let newPos = formatted.length;
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
            <div className={`flex items-center border rounded-lg overflow-hidden ${disabled ? 'bg-gray-100 border-gray-200' : 'border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'}`}>
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
                    disabled={disabled}
                    className="flex-1 px-3 py-2 text-sm text-left bg-transparent focus:outline-none min-w-0 disabled:text-gray-400"
                />
            </div>
        </div>
    );
};

const SelectField = ({ label, value, onChange, options, disabled = false, error }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400 ${error ? 'border-red-400' : 'border-gray-300'}`}
        >
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

// ─── Modal (Tambah & Edit berbagi 1 komponen — beda hanya mode) ──────────────
//
// mode 'add'  → Tahun Pajak masih harus dipilih user dari `historicalYears`
//               (tahun berjalan TIDAK muncul di dropdown, sesuai BR). Field
//               lain readonly/disabled sampai Tahun Pajak dipilih. Setelah
//               dipilih, form di-load dari row existing (row SUDAH ada sejak
//               awal — default 0 — bukan row baru).
// mode 'edit' → Tahun Pajak mengikuti row yang dipilih & tidak dapat diubah.
//               Field lain langsung editable.
const ModalL14 = ({ mode, row, rows, historicalYears, onClose, onSave }) => {
    const [selectedYear, setSelectedYear] = useState(mode === 'edit' ? row.year : '');
    const [form, setForm] = useState(() => {
        const source = mode === 'edit' ? row : null;
        return {
            bentukPenanaman: source?.bentukPenanaman ?? '',
            penyediaan:      source?.penyediaan ?? '',
            tahun1: source?.tahun1 ?? '',
            tahun2: source?.tahun2 ?? '',
            tahun3: source?.tahun3 ?? '',
            tahun4: source?.tahun4 ?? '',
        };
    });
    const [bentukError, setBentukError] = useState(false);

    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    const fieldsDisabled = mode === 'add' && selectedYear === '';

    // Saat Tahun Pajak dipilih pada mode Tambah → load data row existing tsb.
    const handleYearSelect = (val) => {
        setSelectedYear(val);
        const found = rows.find(r => String(r.year) === String(val));
        setForm({
            bentukPenanaman: found?.bentukPenanaman ?? '',
            penyediaan:      found?.penyediaan ?? '',
            tahun1: found?.tahun1 ?? '',
            tahun2: found?.tahun2 ?? '',
            tahun3: found?.tahun3 ?? '',
            tahun4: found?.tahun4 ?? '',
        });
    };

    const t1 = parse(form.tahun1), t2 = parse(form.tahun2), t3 = parse(form.tahun3), t4 = parse(form.tahun4);
    const jumlahPenggunaan = t1 + t2 + t3 + t4;
    const sisaBelum = parse(form.penyediaan) - jumlahPenggunaan;
    // TODO / Need Clarification — belum ada business rule resmi Coretax DJP untuk field ini.
    // Untuk sementara: readonly, default 0. Jangan membuat asumsi formula.
    const sisaMelewati = 0;

    const handleSave = () => {
        if (mode === 'add' && !selectedYear) return;
        if (!form.bentukPenanaman) { setBentukError(true); return; }
        onSave(mode === 'edit' ? row.year : selectedYear, { ...form });
    };

    const yearOptions = mode === 'edit'
        ? [{ value: String(row.year), label: String(row.year) }]
        : [{ value: '', label: 'Please Select' }, ...historicalYears.map(y => ({ value: String(y), label: String(y) }))];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-white font-semibold text-sm">
                            {mode === 'edit' ? 'Edit' : 'Add'} Use of Remaining Excess for Development and Procurement of Facilities and Infrastructure
                        </p>
                        {mode === 'edit' && <p className="text-blue-200 text-xs mt-0.5">{row.year}</p>}
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
                </div>

                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <SelectField
                        label="Tax Year/Fractional Tax Year"
                        value={String(selectedYear)}
                        onChange={handleYearSelect}
                        disabled={mode === 'edit'}
                        options={yearOptions}
                    />

                    <RpField
                        label="Provision of Remaining Excess for Reinvestment within 4 Years"
                        value={form.penyediaan}
                        onChange={set('penyediaan')}
                        disabled={fieldsDisabled}
                    />

                    {/*
                        BR — Perubahan Bentuk Penanaman Kembali hanyalah perubahan kategori,
                        BUKAN input data baru. `set('bentukPenanaman')` (lihat definisi `set`
                        di atas: setForm(prev => ({ ...prev, [key]: val }))) HANYA meng-update
                        key `bentukPenanaman` pada form — penyediaan/tahun1-4 tidak disentuh
                        sama sekali, sehingga nilai yang sudah diinput user tetap dipertahankan.
                        Field readonly (Jumlah Penggunaan, Sisa Belum Ditanamkan) otomatis
                        re-render dari nilai form yang sama (bukan reset ke 0) karena dihitung
                        langsung dari form.tahun1-4 & form.penyediaan pada setiap render.
                    */}
                    <SelectField
                        label="Form of Reinvestment of Remaining Excess"
                        value={form.bentukPenanaman}
                        onChange={(v) => { set('bentukPenanaman')(v); setBentukError(false); }}
                        options={BENTUK_PENANAMAN_KEMBALI}
                        disabled={fieldsDisabled}
                        error={bentukError ? 'This field is required!' : null}
                    />

                    <RpField
                        label="Use of Remaining Excess for Development and Procurement of Facilities and Infrastructure - Year 1"
                        value={form.tahun1} onChange={set('tahun1')} disabled={fieldsDisabled}
                    />
                    <RpField
                        label="Use of Remaining Excess for Development and Procurement of Facilities and Infrastructure - Year 2"
                        value={form.tahun2} onChange={set('tahun2')} disabled={fieldsDisabled}
                    />
                    <RpField
                        label="Use of Remaining Excess for Development and Procurement of Facilities and Infrastructure - Year 3"
                        value={form.tahun3} onChange={set('tahun3')} disabled={fieldsDisabled}
                    />
                    <RpField
                        label="Use of Remaining Excess for Development and Procurement of Facilities and Infrastructure - Year 4"
                        value={form.tahun4} onChange={set('tahun4')} disabled={fieldsDisabled}
                    />

                    <ReadonlyField
                        label="Total Amount Reinvested"
                        value={jumlahPenggunaan !== 0 ? jumlahPenggunaan.toLocaleString('id-ID') : ''}
                        helper="Calculation: Year 1 + Year 2 + Year 3 + Year 4"
                    />
                    <ReadonlyField
                        label="Remaining Amount Not Yet Reinvested"
                        value={sisaBelum !== 0 ? sisaBelum.toLocaleString('id-ID') : ''}
                        helper="Calculation: Provision of Remaining Excess − Total Amount Reinvested"
                    />
                    <ReadonlyField
                        label="Remaining Amount Exceeding the 4-Year Reinvestment Period"
                        value={sisaMelewati !== 0 ? sisaMelewati.toLocaleString('id-ID') : ''}
                        helper="TODO / Need Clarification — official Coretax DJP business rule not yet available for this field."
                    />
                </div>

                <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-medium bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
                        Close
                    </button>
                    <button onClick={handleSave} className="px-5 py-2 text-sm font-medium bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
// Props:
//   taxYear, tin      — header (Header Standard, identik seluruh Lampiran / L1D)
//   l14Rows           — data mentah RAW INPUT dari SptTahunanBadan (restore draft)
//   onRowsChange      — emit RAW INPUT ke parent SETELAH Simpan (bukan saat mengetik),
//                        mengikuti pola onRowsAChange/onRowsBChange di L1A.
//
// ── TODO / INTEGRATION REQUIRED ────────────────────────────────────────────────
// MainFormBadan.js & SptTahunanBadan.js BELUM dikirim saat implementasi ini dibuat,
// sehingga integrasi berikut BELUM dilakukan dan TIDAK diasumsikan di sini:
//
// 1. SptTahunanBadan.js perlu menambahkan state `l14Rows` (raw array of
//    { year, bentukPenanaman, penyediaan, tahun1, tahun2, tahun3, tahun4 }),
//    mengikuti pola persis `l1aRowsA` di L1A.
// 2. Tambahkan handler `handleL14RowsChange` (dibungkus useCallback, stabil)
//    yang di-pass sebagai prop `onRowsChange` ke <L14 />, mengikuti pola
//    `onRowsAChange` di L1A.
// 3. Save Draft / Load Draft: ikuti pola L13A/L13C (bukan L1A) — localStorage key
//    `spt_l14_rows_{sptId}`, HANYA raw rows apa adanya (`{ rows: l14Rows || [] }`),
//    tanpa merge di level parent (merge dengan 5-row skeleton dilakukan sepenuhnya
//    di dalam L14.js — lihat mergeRowsWithDraft/buildInitialRows di atas).
// 4. MainFormBadan.js: tab visibility L14 SUDAH ADA dan diketahui —
//    `showL14 = sptData.transactions?.q21h_reinvestment === 'Yes'` di
//    SptTahunanBadan.js. Tidak perlu Need Clarification lagi untuk poin ini.
// 5. Pola `style={{ display }}` (bukan conditional render) tetap dipertahankan
//    untuk tab L14 agar state tidak unmount saat berpindah tab, sesuai pola
//    project ini secara keseluruhan. Placeholder render <L14 /> ini SUDAH ADA
//    di SptTahunanBadan.js — hanya perlu ditambahkan prop l14Rows/onRowsChange.

const L14 = ({ taxYear, tin, l14Rows, onRowsChange }) => {
    const [rows, setRows] = useState(() => mergeRowsWithDraft(buildInitialRows(taxYear), l14Rows));
    const [modal, setModal] = useState(null); // { mode: 'add' } | { mode: 'edit', row }

    // Ref anti-loop: tandai jika perubahan l14Rows berasal dari child itu sendiri
    // (via onRowsChange), sehingga useEffect restore tidak memantul balik. Pola identik L1A.
    const skipRestore = useRef(false);

    useEffect(() => {
        if (skipRestore.current) { skipRestore.current = false; return; }
        if (Array.isArray(l14Rows) && l14Rows.length > 0) {
            setRows(mergeRowsWithDraft(buildInitialRows(taxYear), l14Rows));
        }
    }, [l14Rows]); // eslint-disable-line react-hooks/exhaustive-deps

    // BR — apabila `taxYear` berubah (mis. SPT Tahun Pajak diedit), 5 historical
    // row HARUS diregenerasi ulang untuk taxYear yang baru, namun data yang sudah
    // ada TIDAK BOLEH hilang: alurnya tetap generate → merge (berdasarkan year yang
    // overlap) → render. TIDAK PERNAH mengganti `rows` langsung dengan initial rows
    // kosong. `rows` (bukan `l14Rows` prop) dipakai sebagai sumber merge di sini
    // karena `rows` merepresentasikan data ter-update terakhir (termasuk hasil Simpan
    // yang belum tentu sudah "memantul" balik ke prop `l14Rows` milik parent).
    const prevTaxYearRef = useRef(taxYear);
    useEffect(() => {
        if (prevTaxYearRef.current === taxYear) return;
        prevTaxYearRef.current = taxYear;
        setRows(prevRows => mergeRowsWithDraft(buildInitialRows(taxYear), prevRows));
        // Catatan: TIDAK memanggil onRowsChange di sini — perubahan taxYear bukan
        // aksi "Simpan" oleh user (lihat BR poin 2: callback hanya dipanggil saat
        // user menekan Simpan pada modal).
    }, [taxYear]);

    const currentTaxYear = parseInt(taxYear, 10) || new Date().getFullYear();
    // BR — Tombol Tambah: dropdown hanya berisi tahun historis, tahun berjalan tidak muncul.
    const historicalYears = rows.map(r => r.year).filter(y => y !== currentTaxYear);

    const handleSave = (year, form) => {
        setRows(prev => {
            const next = prev.map(r => r.year === Number(year) ? { ...r, ...form } : r);
            if (onRowsChange) {
                skipRestore.current = true; // cegah loop: perubahan ini dari child sendiri
                onRowsChange(next);
            }
            return next;
        });
        setModal(null);
    };

    // ── Derived: jumlahPenggunaan, sisaBelum, sisaMelewati per row ─────────────
    const rowsComputed = useMemo(() => rows.map(r => {
        const t1 = parse(r.tahun1), t2 = parse(r.tahun2), t3 = parse(r.tahun3), t4 = parse(r.tahun4);
        const jumlahPenggunaan = t1 + t2 + t3 + t4;
        const sisaBelum = parse(r.penyediaan) - jumlahPenggunaan;
        // TODO / Need Clarification — lihat catatan formula di ModalL14
        const sisaMelewati = 0;
        return { ...r, _jumlahPenggunaan: jumlahPenggunaan, _sisaBelum: sisaBelum, _sisaMelewati: sisaMelewati };
    }), [rows]);

    // Footer "TOTAL" — penjumlahan sederhana antar row (formula tidak ambigu, sesuai screenshot).
    const footerTotals = useMemo(() => rowsComputed.reduce((acc, r) => ({
        jumlahPenggunaan: acc.jumlahPenggunaan + r._jumlahPenggunaan,
        sisaBelum:        acc.sisaBelum + r._sisaBelum,
        sisaMelewati:     acc.sisaMelewati + r._sisaMelewati,
    }), { jumlahPenggunaan: 0, sisaBelum: 0, sisaMelewati: 0 }), [rowsComputed]);

    // ── Footer Row 2: "Remaining Amount Eligible for Reinvestment" ─────────────
    // TODO / Need Clarification — Need official Coretax business rule.
    // Belum ada business rule resmi dari Coretax DJP untuk formula nilai ini
    // (blueprint hanya menyebutkan label baris, tanpa formula). Struktur
    // perhitungan disiapkan di sini (useMemo, dependency ke footerTotals/
    // rowsComputed) agar SIAP DIISI begitu business rule resmi tersedia —
    // TIDAK membuat asumsi formula apa pun untuk saat ini. Placeholder: 0.
    const remainingAmountEligibleForReinvestment = useMemo(() => {
        // TODO: Need official Coretax business rule.
        return 0;
    }, [footerTotals]);

    // ── Table style helpers — diselaraskan dengan L13A/L2 (bukan lagi baseline
    // gray-100/L1A). Header center (horizontal+vertical, sudah ada sebelumnya)
    // dipertahankan; yang berubah HANYA warna & border sesuai L13A:
    //   • thCls / thClsWrap — untuk cell header yang rowSpan=2 (Action, Tax Year,
    //     Provision, Form, Total/Remaining) ATAU baris kedua (Year 1-4) — semua
    //     LANGSUNG bersentuhan dengan body, jadi border bawah abu-abu (gray-300),
    //     sisi lainnya putih (memisahkan antar kolom, pola persis L13A).
    //   • thGroupCls — KHUSUS header Group row1 ("Use of Remaining Excess...")
    //     yang colSpan (bukan rowSpan): border bawah TETAP PUTIH karena di
    //     bawahnya masih ada Sub Header (Year 1-4), bukan body.
    const thCls     = "px-3 py-2 text-center align-middle text-xs font-bold text-gray-800 uppercase bg-yellow-400 border border-white border-b-gray-300 whitespace-nowrap";
    const thClsWrap = "px-3 py-2 text-center align-middle text-xs font-bold text-gray-800 uppercase bg-yellow-400 border border-white border-b-gray-300 whitespace-normal";
    const thGroupCls = "px-3 py-2 text-center align-middle text-xs font-bold text-gray-800 uppercase bg-yellow-400 border border-white whitespace-normal";
    const tdCls = "px-3 py-2 text-xs text-gray-700 border border-gray-200";
    const tdNum = "px-3 py-2 text-xs text-right text-gray-700 border border-gray-200 font-mono";

    const COL_ACTION_W = 48;
    const COL_YEAR_W   = 130;
    const HEADER_ROW1_H = 36; // tinggi baris header pertama (px) — dipakai top offset baris kedua, pola identik L2

    const thAction = { position: 'sticky', left: 0,             top: 0,  zIndex: 4, backgroundColor: '#facc15', height: HEADER_ROW1_H };
    const thYear   = { position: 'sticky', left: COL_ACTION_W,   top: 0,  zIndex: 4, backgroundColor: '#facc15', height: HEADER_ROW1_H };
    const thTop    = { position: 'sticky', top: 0,  zIndex: 2, backgroundColor: '#facc15', height: HEADER_ROW1_H };
    const thTop2   = { position: 'sticky', top: HEADER_ROW1_H, zIndex: 2, backgroundColor: '#facc15' }; // baris ke-2 thead (Tahun Ke-1..4)

    const tdAction = { position: 'sticky', left: 0,           zIndex: 1, backgroundColor: '#ffffff' };
    const tdYear   = { position: 'sticky', left: COL_ACTION_W, zIndex: 1, backgroundColor: '#ffffff' };

    return (
        <div className="p-6 space-y-6">
            {/* ── HEADER (Header Standard — identik L1D) ─────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 14 — Use of Remaining Excess for Development and Procurement of Facilities and Infrastructure
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Year"   value={taxYear} />
                    <ReadonlyField label="TIN (NPWP)" value={tin} />
                </div>
            </div>

            {/* ── TABLE ───────────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-blue-700">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                        Use of Remaining Excess for Development and Procurement of Facilities and Infrastructure
                    </h3>
                </div>

                <div className="px-5 py-3 border-b border-gray-100">
                    <button
                        onClick={() => setModal({ mode: 'add' })}
                        className="px-4 py-2 text-sm font-medium bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center gap-1.5"
                    >
                        + Add
                    </button>
                </div>

                <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '600px' }}>
                    <table className="w-full text-sm border-collapse min-w-[1400px]">
                        <thead>
                            <tr>
                                <th rowSpan={2} className={thCls} style={{ ...thAction, minWidth: COL_ACTION_W }}>Action</th>
                                <th rowSpan={2} className={thCls} style={{ ...thYear, minWidth: COL_YEAR_W }}>Tax Year/Fractional Tax Year</th>
                                <th rowSpan={2} className={thClsWrap} style={{ ...thTop, minWidth: 170 }}>
                                    Provision of Remaining Excess for Reinvestment within 4 Years
                                </th>
                                <th rowSpan={2} className={thClsWrap} style={{ ...thTop, minWidth: 220 }}>
                                    Form of Reinvestment of Remaining Excess
                                </th>
                                <th colSpan={4} className={thGroupCls} style={thTop}>
                                    Use of Remaining Excess for Development and Procurement of Facilities and Infrastructure
                                </th>
                                <th rowSpan={2} className={thClsWrap} style={{ ...thTop, minWidth: 150 }}>
                                    Total Amount Reinvested
                                </th>
                                <th rowSpan={2} className={thClsWrap} style={{ ...thTop, minWidth: 160 }}>
                                    Remaining Amount Not Yet Reinvested
                                </th>
                                <th rowSpan={2} className={thClsWrap} style={{ ...thTop, minWidth: 180 }}>
                                    Remaining Amount Exceeding the 4-Year Reinvestment Period
                                </th>
                            </tr>
                            <tr>
                                <th className={thCls} style={thTop2}>Year 1</th>
                                <th className={thCls} style={thTop2}>Year 2</th>
                                <th className={thCls} style={thTop2}>Year 3</th>
                                <th className={thCls} style={thTop2}>Year 4</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsComputed.map((row) => {
                                const isCurrentYear = row.year === currentTaxYear;
                                return (
                                    <tr key={row.year} className="hover:bg-gray-50 transition-colors">
                                        <td className={tdCls} style={tdAction}>
                                            {!isCurrentYear && (
                                                <button
                                                    onClick={() => setModal({ mode: 'edit', row })}
                                                    title="Edit"
                                                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                        <td className={`${tdCls} font-mono`} style={tdYear}>{row.year}</td>
                                        <td className={tdNum}>{fmtRp(row.penyediaan)}</td>
                                        <td className={tdCls}>{bentukLabel(row.bentukPenanaman) || <span className="text-gray-400">—</span>}</td>
                                        <td className={tdNum}>{fmtRp(row.tahun1)}</td>
                                        <td className={tdNum}>{fmtRp(row.tahun2)}</td>
                                        <td className={tdNum}>{fmtRp(row.tahun3)}</td>
                                        <td className={tdNum}>{fmtRp(row.tahun4)}</td>
                                        <td className={tdNum}>{fmtRp(row._jumlahPenggunaan)}</td>
                                        <td className={tdNum}>{fmtRp(row._sisaBelum)}</td>
                                        <td className={tdNum}>{fmtRp(row._sisaMelewati)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-blue-700">
                                <td colSpan={8} className="px-3 py-2 text-xs font-bold text-white text-right border border-white">TOTAL</td>
                                <td className="px-3 py-2 text-xs font-bold text-white text-right font-mono border border-white">
                                    {fmtRp(footerTotals.jumlahPenggunaan)}
                                </td>
                                <td className="px-3 py-2 text-xs font-bold text-white text-right font-mono border border-white">
                                    {fmtRp(footerTotals.sisaBelum)}
                                </td>
                                <td className="px-3 py-2 text-xs font-bold text-white text-right font-mono border border-white">
                                    {fmtRp(footerTotals.sisaMelewati)}
                                </td>
                            </tr>
                            {/*
                                TODO / Need Clarification:
                                Formula resmi untuk "Remaining Amount Eligible for Reinvestment" belum tersedia
                                dari Coretax DJP (blueprint hanya menyebutkan label baris ini, tanpa formula).
                                Struktur perhitungan (remainingAmountEligibleForReinvestment, lihat useMemo di
                                atas) sudah disiapkan agar siap diisi begitu business rule resmi tersedia.
                                TIDAK membuat asumsi formula — placeholder nilai saat ini: 0.
                            */}
                            <tr className="bg-blue-800">
                                <td colSpan={10} className="px-3 py-2 text-xs font-bold text-white text-right border border-white">
                                    Remaining Amount Eligible for Reinvestment
                                </td>
                                <td className="px-3 py-2 text-xs font-bold text-white text-right font-mono border border-white">
                                    {fmtRp(remainingAmountEligibleForReinvestment)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {modal && (
                <ModalL14
                    mode={modal.mode}
                    row={modal.row}
                    rows={rows}
                    historicalYears={historicalYears}
                    onClose={() => setModal(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default L14;