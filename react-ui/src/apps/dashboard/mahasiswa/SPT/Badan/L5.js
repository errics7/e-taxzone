import React, { useState, useMemo, useEffect, useRef } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Catatan: fmt/parse/ReadonlyField/RpField di bawah ini adalah COPY dari pola
// yang sudah stabil di L1A/L2/L3/L4. Tidak ada shared util module di project ini
// — setiap Lampiran berdiri sendiri secara sengaja. Helper ini TIDAK di-export
// oleh Lampiran lain sehingga tidak bisa di-import langsung; menyalin pola yang
// identik adalah opsi paling konsisten dengan arsitektur yang sudah berjalan.

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};

const fmtOrZero = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n.toLocaleString('id-ID');
};

const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

// ReadonlyField: tampilan field readonly, identik dengan pola L2.
const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

// RpField: input nominal dengan prefix visual "Rp" + format angka Indonesia.
// Identik dengan RpField di L1A/L2/L3/L4 (live formatting, cursor-preserving).
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
        const input      = e.target;
        const raw        = input.value;
        const cursorPos  = input.selectionStart;
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

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'];

const MONTH_LABELS = {
    jan: 'Januari',   feb: 'Februari',  mar: 'Maret',
    apr: 'April',     mei: 'Mei',       jun: 'Juni',
    jul: 'Juli',      agu: 'Agustus',   sep: 'September',
    okt: 'Oktober',   nov: 'November',  des: 'Desember',
};

// Buat objek raw input kosong untuk satu baris TKU (36 field).
const emptyMonthFields = () => {
    const fields = {};
    MONTHS.forEach(m => {
        fields[`${m}_bruto`]    = '';
        fields[`${m}_disetor`]  = '';
        fields[`${m}_dipotong`] = '';
    });
    return fields;
};

// ─── Modal Edit ───────────────────────────────────────────────────────────────
// Pola identik dengan ModalEditA/ModalEditB di L1A dan modal di L2/L3/L4.
// Props: row (baris TKU yang sedang diedit), onClose, onSave.

const ModalEditTurnover = ({ row, onClose, onSave }) => {
    const [form, setForm] = useState({ ...emptyMonthFields(), ...row });

    // Total kolom per kategori — dihitung lokal dari form, bukan dari computed parent.
    // Ini memastikan angka total modal selalu mencerminkan input terkini sebelum Save.
    const modalBrutoTotal    = MONTHS.reduce((s, m) => s + parse(form[`${m}_bruto`]),    0);
    const modalDisetorTotal  = MONTHS.reduce((s, m) => s + parse(form[`${m}_disetor`]),  0);
    const modalDipotongTotal = MONTHS.reduce((s, m) => s + parse(form[`${m}_dipotong`]), 0);

    const handleSave = () => {
        // Hanya emit 36 raw field — tidak pernah menyertakan derived value.
        const rawFields = {};
        MONTHS.forEach(m => {
            rawFields[`${m}_bruto`]    = form[`${m}_bruto`]    || '';
            rawFields[`${m}_disetor`]  = form[`${m}_disetor`]  || '';
            rawFields[`${m}_dipotong`] = form[`${m}_dipotong`] || '';
        });
        onSave(rawFields);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h3 className="text-base font-bold text-gray-800">EDIT GROSS TURNOVER</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{row.namaTku || '—'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Body — scrollable */}
                <div className="overflow-y-auto flex-1 px-6 py-4">
                    {/* Sub-header kolom */}
                    <div className="grid grid-cols-4 gap-3 mb-2">
                        <div className="text-xs font-semibold text-gray-500 pt-6">Masa Pajak</div>
                        <div className="text-xs font-semibold text-gray-600 text-center pt-6">Peredaran Bruto</div>
                        <div className="text-xs font-semibold text-gray-600 text-center pt-6">PPh Disetor Sendiri</div>
                        <div className="text-xs font-semibold text-gray-600 text-center pt-6">PPh Dipotong Pihak Lain</div>
                    </div>

                    {/* 12 baris bulan */}
                    {MONTHS.map(m => (
                        <div key={m} className="grid grid-cols-4 gap-3 mb-3 items-end">
                            <div className="text-sm font-medium text-gray-700 pb-2">
                                {MONTH_LABELS[m]} <span className="text-red-500">*</span>
                            </div>
                            <RpField
                                value={form[`${m}_bruto`]}
                                onChange={v => setForm(prev => ({ ...prev, [`${m}_bruto`]: v }))}
                            />
                            <RpField
                                value={form[`${m}_disetor`]}
                                onChange={v => setForm(prev => ({ ...prev, [`${m}_disetor`]: v }))}
                            />
                            <RpField
                                value={form[`${m}_dipotong`]}
                                onChange={v => setForm(prev => ({ ...prev, [`${m}_dipotong`]: v }))}
                            />
                        </div>
                    ))}

                    {/* Baris total modal — readonly, derived dari form lokal */}
                    <div className="grid grid-cols-4 gap-3 mt-2 pt-3 border-t border-gray-200">
                        <div className="text-xs font-bold text-gray-700 pb-2">Total</div>
                        <div className="flex items-center border border-gray-200 rounded bg-gray-50 overflow-hidden">
                            <span className="px-2 py-2 text-xs font-medium text-gray-400 bg-gray-100 border-r border-gray-200 select-none">Rp</span>
                            <span className="flex-1 px-3 py-2 text-sm text-left text-gray-700 font-mono">
                                {fmtOrZero(modalBrutoTotal)}
                            </span>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded bg-gray-50 overflow-hidden">
                            <span className="px-2 py-2 text-xs font-medium text-gray-400 bg-gray-100 border-r border-gray-200 select-none">Rp</span>
                            <span className="flex-1 px-3 py-2 text-sm text-left text-gray-700 font-mono">
                                {fmtOrZero(modalDisetorTotal)}
                            </span>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded bg-gray-50 overflow-hidden">
                            <span className="px-2 py-2 text-xs font-medium text-gray-400 bg-gray-100 border-r border-gray-200 select-none">Rp</span>
                            <span className="flex-1 px-3 py-2 text-sm text-left text-gray-700 font-mono">
                                {fmtOrZero(modalDipotongTotal)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                        × Close
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
// Props:
//   l5Places          — Bagian A: array TKU readonly [{ id, namaTku, alamat,
//                        kelurahan, kecamatan, kota, provinsi }]
//                        Sumber: Alamat Domisili dari data registrasi perusahaan
//                        (sptData.addresses — jika tersedia), fallback ke kosong.
//                        Ketika modul General Information selesai dikembangkan,
//                        hanya source mapping di SptTahunanBadan yang perlu diubah.
//
//   l5Rows            — Bagian B: array raw input transaksi per TKU (36 field).
//                        Dikirim dari parent (SptTahunanBadan) sebagai prop;
//                        hanya diperbarui via onRowsChange saat Save modal.
//
//   onRowsChange      — Callback emit rows baru ke parent (identik onRowsAChange L1A).
//                        Dipanggil HANYA saat Save modal, BUKAN saat mengetik.
//
//   taxYear, tin      — Header display (readonly), pola identik L2/L3/L4.

const L5 = ({ l5Places = [], l5Rows = [], onRowsChange, taxYear, tin }) => {
    const [editingTkuId, setEditingTkuId] = useState(null); // null = modal tutup

    // skipRestore guard — mencegah loop child→parent→child.
    // Pola identik dengan skipRestoreA/skipRestoreB di L1A.
    const skipRestore = useRef(false);

    // Local rows state — diinisialisasi dari l5Rows prop (pola identik rowsA di L1A).
    // L5.js TIDAK bertanggung jawab menginisialisasi baris kosong dari l5Places.
    // Inisialisasi baris baru (Places → Rows) adalah tanggung jawab parent
    // (SptTahunanBadan). Separation of responsibility: L5.js tidak tahu dari mana
    // data berasal — ia hanya menerima dan menampilkan apa yang diberikan via props.
    const [rows, setRows] = useState(() => l5Rows);

    // Restore saat Load Draft: l5Rows berubah dari [] → data dari localStorage.
    // Guard: skip jika perubahan berasal dari onRowsChange sendiri (anti-loop).
    // Pola identik useEffect restore di L1A.
    useEffect(() => {
        if (skipRestore.current) { skipRestore.current = false; return; }
        if (Array.isArray(l5Rows) && l5Rows.length > 0) {
            setRows(l5Rows);
        }
    }, [l5Rows]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Save handler (pola identik handleSaveA di L1A) ───────────────────────
    const handleSave = (rawFields) => {
        setRows(prev => {
            const next = prev.map(r =>
                r.tkuId !== editingTkuId ? r : { ...r, ...rawFields }
            );
            if (onRowsChange) {
                skipRestore.current = true; // cegah loop
                onRowsChange(next);
            }
            return next;
        });
        setEditingTkuId(null);
    };

    // ── Computed Object ───────────────────────────────────────────────────────
    // Filosofi: Raw Input → Derived Values → Business Variables → DJP Reference Mapping.
    // TIDAK ADA derived value yang disimpan ke state atau localStorage.
    // Seluruh perhitungan di-reset dan dijalankan ulang dari raw input setiap render.
    const computed = useMemo(() => {
        // ── Per-row total bruto (untuk kolom JUMLAH di Bagian B) ─────────────
        const rowGrossTotals = rows.map(row =>
            MONTHS.reduce((s, m) => s + parse(row[`${m}_bruto`]), 0)
        );

        // ── Per-bulan summary (5 baris di bawah tabel data) ──────────────────
        // Setiap key adalah kode bulan ('jan', 'feb', ..., 'des').
        const monthlyGrossTurnover = {}; // JUMLAH PEREDARAN BRUTO per bulan
        const monthlyFinalTaxDue   = {}; // JUMLAH PPh BERSIFAT FINAL TERUTANG per bulan
        const monthlySelfPaidTax   = {}; // JUMLAH PPh FINAL YANG DISETOR SENDIRI per bulan
        const monthlyWithheldTax   = {}; // JUMLAH PPh FINAL YANG DIPOTONG/DIPUNGUT PIHAK LAIN per bulan
        const monthlyDifference    = {}; // SELISIH per bulan

        MONTHS.forEach(m => {
            monthlyGrossTurnover[m] = rows.reduce((s, r) => s + parse(r[`${m}_bruto`]),    0);
            // Formula dikonfirmasi dari Blueprint Excel L5: bruto × 0.5 / 100
            monthlyFinalTaxDue[m]   = monthlyGrossTurnover[m] * 0.005;
            monthlySelfPaidTax[m]   = rows.reduce((s, r) => s + parse(r[`${m}_disetor`]),  0);
            monthlyWithheldTax[m]   = rows.reduce((s, r) => s + parse(r[`${m}_dipotong`]), 0);
            // Formula: =J38-J41 (Blueprint Excel L5 row 45)
            monthlyDifference[m]    = monthlySelfPaidTax[m] - monthlyWithheldTax[m];
        });

        // ── Business Variables (grand totals) ────────────────────────────────
        // Nama variabel menggunakan business naming — BUKAN nama cell Excel.
        const grandGrossTurnover    = MONTHS.reduce((s, m) => s + monthlyGrossTurnover[m], 0);
        const totalFinalTaxDue      = MONTHS.reduce((s, m) => s + monthlyFinalTaxDue[m],   0);
        const totalSelfPaidFinalTax = MONTHS.reduce((s, m) => s + monthlySelfPaidTax[m],   0);
        const totalWithheldFinalTax = MONTHS.reduce((s, m) => s + monthlyWithheldTax[m],   0);
        const totalDifference       = MONTHS.reduce((s, m) => s + monthlyDifference[m],    0);

        // amendmentDifference (g.15): hanya berlaku untuk SPT Pembetulan.
        // Nilai null menandakan "belum diimplementasi" — berbeda dari 0 yang bermakna
        // "tidak ada selisih pembetulan". Implementasi pada fase SPT Pembetulan.
        const amendmentDifference = null; // TODO: implementasi fase SPT Pembetulan

        // ── DJP Reference Mapping (metadata layer — BUKAN variabel fungsional) ─
        // Referensi ini tersedia untuk audit/debug dan persiapan integrasi masa depan.
        // Gunakan business variable (grandGrossTurnover, totalDifference, dll.) untuk
        // seluruh business logic — BUKAN kunci referensi ini.
        // Ketika dependency ke Main Form terkonfirmasi, emit menggunakan business
        // variable: onGrandGrossTurnoverChange(computed.grandGrossTurnover) — bukan
        // computed.references['a.15'].
        const references = {
            'a.15': grandGrossTurnover,    // Grand total seluruh peredaran bruto
            'b.15': totalFinalTaxDue,      // Grand total PPh Final terutang
            'c.15': totalSelfPaidFinalTax, // Grand total PPh Final disetor sendiri
            'd.15': totalWithheldFinalTax, // Grand total PPh Final dipotong pihak lain
            'e.15': totalDifference,       // Grand total selisih
            'g.15': amendmentDifference,   // Selisih karena pembetulan (belum diimplementasi)
        };

        return {
            rowGrossTotals,
            // Per-month (untuk render 5 summary rows di tabel)
            monthlyGrossTurnover,
            monthlyFinalTaxDue,
            monthlySelfPaidTax,
            monthlyWithheldTax,
            monthlyDifference,
            // Business variables
            grandGrossTurnover,
            totalFinalTaxDue,
            totalSelfPaidFinalTax,
            totalWithheldFinalTax,
            totalDifference,
            amendmentDifference,
            // DJP reference layer
            references,
        };
    }, [rows]);

    // ── Style helpers — UI mengikuti referensi tabel L13A.js (header kuning,
    // border putih antar-header, border penuh pada body cell, hover abu-abu).
    // HANYA style/className yang diselaraskan — tidak ada logic yang berubah.
    const thCls    = "px-3 py-2 text-center align-middle text-xs font-bold text-gray-800 uppercase bg-yellow-400 border border-white border-b-gray-300 whitespace-nowrap";
    const thClsNum = "px-3 py-2 text-center align-middle text-xs font-bold text-gray-800 uppercase bg-yellow-400 border border-white border-b-gray-300 whitespace-nowrap";
    const tdCls    = "px-3 py-2 text-xs text-gray-700 border border-gray-200";
    const tdNum    = "px-3 py-2 text-xs text-right text-gray-700 border border-gray-200 font-mono";
    const tdSummary= "px-3 py-2 text-xs text-right text-gray-800 border border-gray-200 font-mono font-medium bg-gray-50";
    const tdLabel  = "px-3 py-2 text-xs font-semibold text-gray-700 border border-gray-200 bg-gray-50 whitespace-nowrap";

    const COL_ACTION_W = 48;
    const COL_NAME_W   = 200;

    // Sticky header/kolom — logic posisi TIDAK berubah, hanya warna latar
    // disesuaikan ke kuning (#facc15 = tailwind yellow-400) agar konsisten
    // dengan header non-sticky di atas.
    const thAction = { position: 'sticky', left: 0,            top: 0, zIndex: 4, backgroundColor: '#facc15' };
    const thName   = { position: 'sticky', left: COL_ACTION_W, top: 0, zIndex: 4, backgroundColor: '#facc15', minWidth: COL_NAME_W };
    const thTop    = { position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#facc15' };
    const tdAction = { position: 'sticky', left: 0,            zIndex: 1, backgroundColor: '#ffffff' };
    const tdName   = { position: 'sticky', left: COL_ACTION_W, zIndex: 1, backgroundColor: '#ffffff', minWidth: COL_NAME_W };
    const tdNameSummary = { position: 'sticky', left: COL_ACTION_W, zIndex: 1, backgroundColor: '#f9fafb', minWidth: COL_NAME_W };

    // Baris yang sedang diedit
    const editingRow = editingTkuId ? rows.find(r => r.tkuId === editingTkuId) : null;

    // ── Summary row definitions — 5 baris readonly sesuai Blueprint Excel L5 ─
    const summaryRows = [
        {
            key: 'bruto',
            label: 'JUMLAH PEREDARAN BRUTO',
            monthly: computed.monthlyGrossTurnover,
            total: computed.grandGrossTurnover,
            style: 'font-bold',
        },
        {
            key: 'terutang',
            label: 'JUMLAH PPh BERSIFAT FINAL TERUTANG',
            monthly: computed.monthlyFinalTaxDue,
            total: computed.totalFinalTaxDue,
            style: '',
        },
        {
            key: 'disetor',
            label: 'JUMLAH PPh BERSIFAT FINAL YANG DISETOR SENDIRI',
            monthly: computed.monthlySelfPaidTax,
            total: computed.totalSelfPaidFinalTax,
            style: '',
        },
        {
            key: 'dipotong',
            label: 'JUMLAH PPh BERSIFAT FINAL YANG DIPOTONG/DIPUNGUT PIHAK LAIN',
            monthly: computed.monthlyWithheldTax,
            total: computed.totalWithheldFinalTax,
            style: '',
        },
        {
            key: 'selisih',
            label: 'SELISIH',
            monthly: computed.monthlyDifference,
            total: computed.totalDifference,
            style: 'font-bold',
        },
    ];

    return (
        <div className="p-6 space-y-8">

            {/* ── HEADER ──────────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 5 — Rekapitulasi Peredaran Bruto
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Year"   value={taxYear} />
                    <ReadonlyField label="TIN (NPWP)" value={tin} />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                    SPT Tahunan PPh Wajib Pajak Badan — Dalam Mata Uang Rupiah
                </p>
                <p className="text-xs text-gray-400 mt-3 italic">
                    Formulir ini digunakan untuk Wajib Pajak yang menerima atau memperoleh penghasilan dari usaha
                    dengan peredaran bruto tertentu yang dikenakan PPh yang bersifat final (PP 55 Tahun 2022).
                </p>
            </div>

            {/* ── BAGIAN A — ALAMAT TEMPAT KEGIATAN USAHA ─────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        A. Alamat Tempat Kegiatan Usaha
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Data readonly — dikelola melalui menu General Information.
                        {l5Places.length === 0 && (
                            <span className="ml-1 text-amber-600">
                                Data TKU belum tersedia. Lengkapi alamat domisili melalui proses registrasi perusahaan.
                            </span>
                        )}
                    </p>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-sm border-collapse" style={{ minWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th className={thCls} style={{ minWidth: 100 }}>(1) Nomor Identitas TKU</th>
                                <th className={thCls} style={{ minWidth: 200 }}>(2) Nama TKU</th>
                                <th className={thCls} style={{ minWidth: 200 }}>(3) Alamat</th>
                                <th className={thCls} style={{ minWidth: 140 }}>(4) Kelurahan/Desa</th>
                                <th className={thCls} style={{ minWidth: 140 }}>(5) Kecamatan</th>
                                <th className={thCls} style={{ minWidth: 140 }}>(6) Kota/Kabupaten</th>
                                <th className={thCls} style={{ minWidth: 140 }}>(7) Provinsi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {l5Places.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-3 py-6 text-center text-xs text-gray-400 italic">
                                        Belum ada data Tempat Kegiatan Usaha.
                                    </td>
                                </tr>
                            ) : (
                                l5Places.map((place) => (
                                    <tr key={place.id} className="hover:bg-gray-50">
                                        <td className={tdCls}>{place.id || '—'}</td>
                                        <td className={tdCls}>{place.namaTku || '—'}</td>
                                        <td className={tdCls}>{place.alamat || '—'}</td>
                                        <td className={tdCls}>{place.kelurahan || '—'}</td>
                                        <td className={tdCls}>{place.kecamatan || '—'}</td>
                                        <td className={tdCls}>{place.kota || '—'}</td>
                                        <td className={tdCls}>{place.provinsi || '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── BAGIAN B — REKAPITULASI PEREDARAN BRUTO ─────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        B. Rekapitulasi Peredaran Bruto dan PPh yang Telah Dibayar
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Klik ikon pensil untuk mengedit data bulanan per Tempat Kegiatan Usaha.
                    </p>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-x-auto overflow-y-auto" style={{ maxHeight: '500px' }}>
                    <table className="w-full text-sm border-collapse" style={{ minWidth: '1400px' }}>
                        <thead>
                            <tr>
                                <th className={thCls} style={{ ...thAction, width: COL_ACTION_W }}>
                                    {/* Action */}
                                </th>
                                <th className={thCls} style={{ ...thName }}>
                                    (1) Nama TKU
                                </th>
                                {MONTHS.map(m => (
                                    <th key={m} className={thClsNum} style={{ ...thTop, minWidth: 100 }}>
                                        {MONTH_LABELS[m].toUpperCase()}
                                    </th>
                                ))}
                                <th className={thClsNum} style={{ ...thTop, minWidth: 120 }}>
                                    JUMLAH
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Baris data per TKU */}
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={15} className="px-3 py-6 text-center text-xs text-gray-400 italic">
                                        Belum ada data TKU. Data akan muncul setelah Bagian A tersedia.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, idx) => (
                                    <tr key={row.tkuId} className="hover:bg-gray-50 transition-colors">
                                        <td className={tdCls} style={tdAction}>
                                            <button
                                                onClick={() => setEditingTkuId(row.tkuId)}
                                                title="Edit data bulanan"
                                                className="w-7 h-7 flex items-center justify-center text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                            >
                                                ✏️
                                            </button>
                                        </td>
                                        <td className={tdCls} style={tdName}>
                                            {row.namaTku || `TKU ${idx + 1}`}
                                        </td>
                                        {MONTHS.map(m => (
                                            <td key={m} className={tdNum}>
                                                {fmt(parse(row[`${m}_bruto`])) || '—'}
                                            </td>
                                        ))}
                                        <td className={`${tdNum} font-semibold text-blue-700`}>
                                            {fmtOrZero(computed.rowGrossTotals[idx])}
                                        </td>
                                    </tr>
                                ))
                            )}

                            {/* ── 5 Summary rows (readonly, derived) ─────── */}
                            {summaryRows.map((sr, srIdx) => (
                                <tr key={sr.key} className={srIdx === 0 || srIdx === 4 ? 'bg-blue-50' : 'bg-gray-50'}>
                                    {/* Sel action kosong untuk summary rows */}
                                    <td style={{ ...tdAction, backgroundColor: srIdx === 0 || srIdx === 4 ? '#eff6ff' : '#f9fafb' }} />
                                    <td
                                        className={`${tdLabel} ${sr.style}`}
                                        style={{ ...tdNameSummary, backgroundColor: srIdx === 0 || srIdx === 4 ? '#eff6ff' : '#f9fafb' }}
                                    >
                                        {sr.label}
                                    </td>
                                    {MONTHS.map(m => (
                                        <td key={m} className={`${tdSummary} ${sr.style}`}
                                            style={{ backgroundColor: srIdx === 0 || srIdx === 4 ? '#eff6ff' : '#f9fafb' }}>
                                            {fmtOrZero(sr.monthly[m])}
                                        </td>
                                    ))}
                                    <td
                                        className={`${tdSummary} ${sr.style} text-blue-800`}
                                        style={{ backgroundColor: srIdx === 0 || srIdx === 4 ? '#dbeafe' : '#f3f4f6' }}
                                    >
                                        {fmtOrZero(sr.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Grand total info bar */}
                <div className="px-5 py-3 border-t border-gray-200 bg-blue-800 rounded-b-lg">
                    <div className="flex items-center justify-between text-white">
                        <span className="text-xs font-semibold uppercase tracking-wide">
                            Grand Total Peredaran Bruto
                        </span>
                        <span className="text-sm font-bold font-mono">
                            Rp {fmtOrZero(computed.grandGrossTurnover)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Modal Edit ──────────────────────────────────────────────── */}
            {editingRow && (
                <ModalEditTurnover
                    row={editingRow}
                    onClose={() => setEditingTkuId(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default L5;