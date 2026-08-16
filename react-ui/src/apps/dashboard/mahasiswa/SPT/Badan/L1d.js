import React, { useState, useMemo, useEffect, useRef } from 'react';

// ─── Static Data ──────────────────────────────────────────────────────────────
// Sumber: Blueprint Final L1D (L1D.xlsx — satu-satunya source of truth).
// Pola implementasi diwarisi dari L1C (lihat L1c.js) — hanya daftar akun,
// subtotal, dependency, dan formula yang berubah sesuai Blueprint L1D.
//
// type: 'input' | 'groupHeader' | 'subtotal'
//   (L1D TIDAK punya 'operatorMinus' — Blueprint catatan struktural #4:
//    tidak ada header "Dikurangi" sebelum 4013, berbeda dari L1C)
// isHeader: true  → groupHeader (styling baris)
// isSubtotal: true → subtotal (readonly, no edit button, no col9)
//
// disable45: true → col(4) & col(5) tidak editable, fixed 0
//   (Kelompok 2 — Blueprint §"Struktur Kolom per Akun", Perlu Konfirmasi #3,
//   diasumsikan sama seperti L1C: col6 = col3)
// onlyCol3: true  → Kelompok 3 (BARU, hanya ada di L1D, hanya akun 5020).
//   col(4),(5),(7),(8),(9) seluruhnya N/A — HANYA col(3) editable.
//   Blueprint Perlu Konfirmasi #2: pola shading penuh ini diasumsikan
//   disengaja (tidak ada rekonsiliasi fiskal apa pun untuk akun ini),
//   namun BELUM final tanpa konfirmasi — diimplementasikan apa adanya
//   sesuai instruksi Blueprint ("mengikuti shading apa adanya").

const SECTION_A_ACCOUNTS = [
    // ── Pendapatan ────────────────────────────────────────────────────────────
    // Catatan: berbeda dari L1C, tidak ada split Domestik/Ekspor, tidak ada
    // Retur/Potongan, tidak ada subtotal Penjualan Bruto/Bersih, tidak ada
    // breakdown HPP bertingkat — sektor JASA hanya 3 baris Input sebelum Laba Kotor.
    { code: '',     name: 'Pendapatan',                                         type: 'groupHeader' },
    { code: '4021', name: 'Pendapatan Jasa',                                    type: 'input' },
    { code: '4013', name: 'Penyesuaian Penjualan',                              type: 'input', disable45: true },
    { code: '5020', name: 'Biaya Pokok Jasa',                                   type: 'input', onlyCol3: true },
    { code: '4300', name: 'Laba Kotor',                                         type: 'subtotal' }, // FINAL: 4021 − 4013 − 5020
    { code: '4199', name: 'Pendapatan Usaha Lainnya',                           type: 'input' },
    // ── Beban Usaha (identik 1:1 dengan L1C — kode, nama, urutan tidak berubah) ─
    { code: '',     name: 'Beban Usaha',                                        type: 'groupHeader' },
    { code: '5311', name: 'Gaji, Tunjangan, Bonus, Honorarium, THR, dsb',       type: 'input', disable45: true },
    { code: '5312', name: 'Beban Imbalan Kerja Lainnya',                        type: 'input', disable45: true },
    { code: '5313', name: 'Beban Transportasi',                                 type: 'input', disable45: true },
    { code: '5314', name: 'Beban Sewa',                                         type: 'input', disable45: true },
    { code: '4315', name: 'Beban Penyusutan dan Amortisasi',                    type: 'input', disable45: true },
    { code: '4316', name: 'Beban Bunga',                                        type: 'input', disable45: true },
    { code: '4317', name: 'Beban sehubungan dengan Jasa',                       type: 'input', disable45: true },
    { code: '5318', name: 'Beban Penurunan Nilai',                              type: 'input', disable45: true },
    { code: '5319', name: 'Beban Royalti',                                      type: 'input', disable45: true },
    { code: '5320', name: 'Beban Pemasaran atau Promosi',                       type: 'input', disable45: true },
    { code: '5321', name: 'Beban Entertainment',                                type: 'input', disable45: true },
    { code: '5322', name: 'Beban Umum dan Administrasi',                        type: 'input', disable45: true },
    { code: '5399', name: 'Beban Usaha Lainnya',                                type: 'input', disable45: true },
    { code: '5400', name: 'Jumlah Beban Usaha',                                 type: 'subtotal' },
    { code: '4500', name: 'Laba (Rugi) Usaha',                                  type: 'subtotal' },
    // ── Pendapatan Non Usaha ─────────────────────────────────────────────────
    { code: '',     name: 'Pendapatan Non Usaha',                               type: 'groupHeader' },
    { code: '4501', name: 'Keuntungan Selisih Kurs',                            type: 'input' },
    { code: '4503', name: 'Keuntungan Penjualan Aset selain Persediaan',        type: 'input' },
    { code: '4511', name: 'Pendapatan Bunga',                                   type: 'input' },
    { code: '4599', name: 'Pendapatan Non Usaha Lainnya',                       type: 'input' },
    { code: '4600', name: 'Jumlah Pendapatan Non Usaha',                        type: 'subtotal' },
    // ── Beban Non Usaha & Penutup ────────────────────────────────────────────
    { code: '',     name: 'Beban Non Usaha',                                    type: 'groupHeader' },
    { code: '5405', name: 'Kerugian Penjualan Aset selain Persediaan',          type: 'input', disable45: true },
    { code: '5409', name: 'Sumbangan',                                          type: 'input', disable45: true },
    { code: '5421', name: 'Kerugian Selisih Kurs',                              type: 'input', disable45: true },
    { code: '5499', name: 'Beban Non Usaha Lainnya',                            type: 'input', disable45: true },
    { code: '5500', name: 'Jumlah Beban Non Usaha',                             type: 'subtotal' },
    { code: '4700', name: 'Laba (Rugi) Non Usaha',                              type: 'subtotal' },
    { code: '4800', name: 'Laba (Rugi) Sebelum Pajak (A.10)',                   type: 'subtotal' },
];

// ── Bagian B — DUA TABEL TERPISAH (Aset vs Liabilitas & Ekuitas) ──────────────
// Urutan mengikuti Excel persis (BUKAN urutan numerik kode) — Blueprint §"Sisi Kiri — Aset".
// TIDAK ADA subtotal antara (1500/1699) — berbeda dari L1C — langsung ke 1700.
// signMinus: true → user input positif, sistem kurangkan dalam subtotal parent.

const SECTION_B_ASET = [
    { code: '',     name: 'Aset Lancar',                                                     type: 'groupHeader' },
    { code: '1101', name: 'Kas dan Setara Kas',                                              type: 'input' },
    { code: '1122', name: 'Piutang Usaha - Pihak Ketiga',                                    type: 'input' },
    { code: '1123', name: 'Piutang Usaha - Pihak yang mempunyai Hubungan Istimewa',          type: 'input' },
    { code: '1124', name: 'Piutang Lainnya - Pihak Ketiga',                                  type: 'input' },
    { code: '1125', name: 'Piutang Lainnya - Pihak yang Mempunyai Hubungan Istimewa',        type: 'input' },
    { code: '1131', name: 'Cadangan Kerugian Penurunan Nilai - Aset Lancar',                 type: 'input', signMinus: true },
    { code: '1181', name: 'Aset Kontrak',                                                    type: 'input' },
    { code: '1200', name: 'Investasi',                                                       type: 'input' },
    { code: '1401', name: 'Persediaan',                                                      type: 'input' },
    { code: '1421', name: 'Beban Dibayar Di Muka',                                           type: 'input' },
    { code: '1422', name: 'Uang Muka',                                                       type: 'input' },
    { code: '1423', name: 'Pajak Dibayar Di Muka',                                           type: 'input' },
    { code: '1499', name: 'Aset Lancar Lainnya',                                             type: 'input' },

    { code: '',     name: 'Aset Tidak Lancar',                                               type: 'groupHeader' },
    { code: '1501', name: 'Piutang Jangka Panjang',                                          type: 'input' },
    { code: '1521', name: 'Aset Tetap dan Inventaris',                                       type: 'input' },
    { code: '1522', name: 'Dikurangi: Akumulasi Penyusutan - Aset Tetap dan Inventaris',     type: 'input', signMinus: true },
    { code: '1551', name: 'Investasi pada Perusahaan Asosiasi, Ventura Bersama dan Anak Perusahaan', type: 'input' },
    { code: '1599', name: 'Investasi Jangka Panjang Lainnya',                                type: 'input' },
    { code: '1600', name: 'Aset Tak Berwujud',                                               type: 'input' },
    { code: '1601', name: 'Dikurangi: Akumulasi Penyusutan - Aset Tak Berwujud',             type: 'input', signMinus: true },
    { code: '1611', name: 'Aset Pajak Tangguhan',                                            type: 'input' },
    { code: '1651', name: 'Klaim atas Pengembalian Pajak',                                   type: 'input' },
    { code: '1658', name: 'Cadangan Kerugian Penurunan Nilai - Aset Tidak Lancar',           type: 'input', signMinus: true },
    { code: '1698', name: 'Aset Tidak Lancar Lainnya',                                       type: 'input' },

    { code: '1700', name: 'Jumlah Aset',                                                     type: 'subtotal' },
];

// Catatan: berbeda dari L1C, SELURUH kode akun pada sisi Liabilitas & Ekuitas L1D
// bersifat UNIK (Blueprint Perlu Konfirmasi #4 — TERSELESAIKAN: 2204 menggantikan
// duplikat 2203, 2323 menggantikan duplikat 2322). Tidak ada lagi kebutuhan internalId
// manual ber-suffix a/b seperti L1C — internalId default (`${prefix}-${code}`) sudah aman.
const SECTION_B_LIAB_EKUITAS = [
    { code: '',     name: 'Liabilitas Jangka Pendek',                                   type: 'groupHeader' },
    { code: '2102', name: 'Utang Usaha - Pihak Ketiga',                                  type: 'input' },
    { code: '2103', name: 'Utang Usaha - Pihak yang Memiliki Hubungan Istimewa',         type: 'input' },
    { code: '2111', name: 'Utang Bunga',                                                 type: 'input' },
    { code: '2191', name: 'Utang Pajak',                                                 type: 'input' },
    { code: '2186', name: 'Liabilitas Kontrak',                                          type: 'input' },
    { code: '2187', name: 'Liabilitas Sewa Jangka Pendek',                               type: 'input' },
    { code: '2195', name: 'Utang Dividen',                                               type: 'input' },
    { code: '2201', name: 'Beban Yang Masih Harus Dibayar',                              type: 'input' },
    { code: '2202', name: 'Utang Bank Jangka Pendek',                                    type: 'input' },
    { code: '2203', name: 'Utang Jangka Panjang yang Jatuh Tempo dalam Satu Tahun',       type: 'input' },
    { code: '2204', name: 'Pendapatan Diterima di Muka',                                  type: 'input' },
    { code: '2228', name: 'Liabilitas Jangka Pendek Lainnya',                             type: 'input' },

    { code: '',     name: 'Liabilitas Jangka Panjang',                                    type: 'groupHeader' },
    { code: '2301', name: 'Utang Bank Jangka Panjang',                                    type: 'input' },
    { code: '2304', name: 'Utang Jangka Panjang - Pihak Ketiga',                          type: 'input' },
    { code: '2312', name: 'Utang Jangka Panjang - Pihak yang Mempunyai Hubungan Istimewa', type: 'input' },
    { code: '2322', name: 'Liabilitas Sewa Jangka Panjang',                               type: 'input' },
    { code: '2323', name: 'Liabilitas Imbalan Kerja',                                      type: 'input' },
    { code: '2321', name: 'Liabilitas Pajak Tangguhan',                                    type: 'input' },
    { code: '2998', name: 'Liabilitas Jangka Panjang Lainnya',                             type: 'input' },
    { code: '2999', name: 'Jumlah Liabilitas',                                             type: 'subtotal' },

    { code: '',     name: 'Ekuitas',                                                      type: 'groupHeader' },
    { code: '3102', name: 'Modal Saham',                                                  type: 'input' },
    { code: '3120', name: 'Tambahan Modal Disetor',                                       type: 'input' },
    { code: '3200', name: 'Laba Ditahan',                                                 type: 'input' },
    { code: '3297', name: 'Pendapatan Komprehensif Lainnya',                             type: 'input' },
    { code: '3298', name: 'Ekuitas Lainnya',                                              type: 'input' },
    { code: '3299', name: 'Jumlah Ekuitas',                                               type: 'subtotal' },
    { code: '3300', name: 'Jumlah Liabilitas dan Ekuitas',                                type: 'subtotal' },
];

const CORRECTION_CODES = [
    { value: '',    label: '— Pilih —' },
    { value: 'P1',  label: 'P1 - Biaya yang tidak dapat dikurangkan' },
    { value: 'P2',  label: 'P2 - Penyusutan fiskal lebih besar' },
    { value: 'P3',  label: 'P3 - Penyusutan fiskal lebih kecil' },
    { value: 'P4',  label: 'P4 - Kompensasi kerugian' },
    { value: 'P5',  label: 'P5 - Penghasilan dikenai pajak final' },
    { value: 'P6',  label: 'P6 - Bukan objek pajak' },
    { value: 'N1',  label: 'N1 - Koreksi negatif lainnya' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
// (identik dengan L1C/L1A — reusable, tidak diubah)

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};

const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

// fmtRp — DISPLAY-ONLY formatter untuk nominal pada tabel (tidak dipakai oleh
// RpField/input, tidak mengubah fmt/parse di atas maupun state/value manapun).
// Prefix "Rp" ditambahkan di tampilan tabel; tanda minus (bila ada) diletakkan
// SEBELUM "Rp" — cth. "-Rp10.000", bukan "Rp-10.000".
const fmtRp = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    if (n === 0) return '';
    return (n < 0 ? '-Rp' : 'Rp') + Math.abs(n).toLocaleString('id-ID');
};

// Derive isHeader / isSubtotal / isInput dari type + tambahkan internalId.
// Perluasan dari pola L1C: disable45 sekarang juga true untuk onlyCol3 (Kelompok 3
// otomatis mewarisi pembatasan Kelompok 2), plus flag baru disable78 (col7/8/9 N/A —
// HANYA untuk Kelompok 3 / akun 5020, tidak pernah dipakai di L1C).
const withDerived = (acc, idx, prefix) => ({
    ...acc,
    internalId: acc.internalId || (acc.code ? `${prefix}-${acc.code}` : `${prefix}-row-${idx}`),
    isHeader:   acc.type === 'groupHeader',
    isSubtotal: acc.type === 'subtotal',
    isInput:    acc.type === 'input',
    disable45:  !!acc.disable45 || !!acc.onlyCol3,
    disable78:  !!acc.onlyCol3,
});

const buildInitialA = () =>
    SECTION_A_ACCOUNTS.map((a, idx) => ({
        ...withDerived(a, idx, 'a'),
        commercial: '',
        nonTaxable: '',
        finalTax:   '',
        posCorr:    '',
        negCorr:    '',
        corrCode:   '',
        dbId:       null, // V3 persistence — PK spt_l1.id. null = belum tersimpan (POST); terisi = PATCH.
    }));

const buildInitialBAset = () =>
    SECTION_B_ASET.map((a, idx) => ({ ...withDerived(a, idx, 'baset'), amount: '', dbId: null }));

const buildInitialBLiabEkuitas = () =>
    SECTION_B_LIAB_EKUITAS.map((a, idx) => ({ ...withDerived(a, idx, 'bliab'), amount: '', dbId: null }));

// Merge field input mentah dari data draft ke initial rows berdasarkan code.
// CATATAN PERUBAHAN (READ dari V3/spt_l1): sebelumnya merge key adalah
// internalId. Diubah ke code karena baris dari database (spt_l1, hasil
// GET section) TIDAK memiliki kolom internalId (murni konstruksi
// frontend) — hanya account_code. L1D tidak punya duplicate account_code
// (sudah diverifikasi di audit sebelumnya), jadi aman dipakai sebagai
// merge key. internalId tetap dipertahankan apa adanya sebagai identity
// frontend (tidak dihapus/diganti), hanya bukan lagi kunci pencarian merge.
// dbId (PK spt_l1.id, V3 persistence) ikut di-merge agar Save berikutnya PATCH.
// Derived values (nonFinal, fiscalAmt, subtotal, a10) TIDAK disimpan — dihitung ulang.
const mergeRowsWithDraft = (initialRows, draftRows) => {
    if (!Array.isArray(draftRows) || draftRows.length === 0) return initialRows;
    const map = {};
    draftRows.forEach(d => { if (d?.code) map[d.code] = d; });
    return initialRows.map(row => {
        if (!row.isInput) return row;
        const d = map[row.code];
        if (!d) return row;
        return {
            ...row,
            commercial: d.commercial ?? row.commercial,
            nonTaxable: d.nonTaxable ?? row.nonTaxable,
            finalTax:   d.finalTax   ?? row.finalTax,
            posCorr:    d.posCorr    ?? row.posCorr,
            negCorr:    d.negCorr    ?? row.negCorr,
            corrCode:   d.corrCode   ?? row.corrCode,
            dbId:       d.dbId       ?? row.dbId,
        };
    });
};

const mergeRowsBWithDraft = (initialRows, draftRows) => {
    if (!Array.isArray(draftRows) || draftRows.length === 0) return initialRows;
    const map = {};
    draftRows.forEach(d => { if (d?.code) map[d.code] = d; });
    return initialRows.map(row => {
        if (!row.isInput) return row;
        const d = map[row.code];
        return d ? { ...row, amount: d.amount ?? row.amount, dbId: d.dbId ?? row.dbId } : row;
    });
};

// ─── Sub-components ───────────────────────────────────────────────────────────
// (identik dengan L1C/L1A — reusable, tidak diubah)

const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

// RpField: input nominal dengan prefix visual "Rp" + format angka Indonesia.
// Pola identik dengan L1C — lihat komentar L1c.js untuk detail perilaku cursor/format.
// • isContraAccount: true → field contra account (signMinus). User tetap hanya boleh
//   menginput nilai positif; tanda minus diabaikan di titik input (perilaku sama seperti
//   sebelum dukungan nilai negatif ditambahkan) — mencegah negasi ganda pada subtotal.
const RpField = ({ label, value, onChange, placeholder = '0', disabled = false, isContraAccount = false }) => {
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

        // Leading minus hanya dihormati untuk field non-contra-account. Minus di posisi
        // lain (tengah/akhir) tidak dianggap valid — dicegah lewat strip \D di bawah,
        // sehingga tidak mungkin terjadi "Rp --1.000" atau minus ganda.
        const isNegative = !isContraAccount && raw.trim().startsWith('-');

        const digitsOnly = raw.replace(/\D/g, '');
        const formatted = digitsOnly === ''
            ? (isNegative ? '-' : '')
            : (isNegative ? '-' : '') + Number(digitsOnly).toLocaleString('id-ID');
        const rawValue = digitsOnly === ''
            ? (isNegative ? '-' : '')
            : (isNegative ? '-' : '') + digitsOnly;
        const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, '').length;

        setDisplayValue(formatted);
        onChange(rawValue);

        requestAnimationFrame(() => {
            if (!inputRef.current) return;
            if (digitsBeforeCursor === 0) {
                const pos = (isNegative && cursorPos > 0) ? 1 : 0;
                inputRef.current.setSelectionRange(pos, pos);
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

    if (disabled) {
        return (
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                <div className="flex items-center border border-gray-200 rounded overflow-hidden bg-gray-100">
                    <span className="px-2 py-2 text-xs font-medium text-gray-400 bg-gray-100 border-r border-gray-200 select-none whitespace-nowrap">Rp</span>
                    <div className="flex-1 px-3 py-2 text-sm text-left text-gray-400">0</div>
                </div>
            </div>
        );
    }

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
                    className="flex-1 px-3 py-2 text-sm text-left bg-white focus:outline-none min-w-0"
                />
            </div>
        </div>
    );
};

const SelectField = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
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

// ─── Modal Section A ──────────────────────────────────────────────────────────
// Identik dengan L1C, DITAMBAH penanganan disable78 (Kelompok 3 — BARU di L1D):
// jika row.disable78 → col(7)/col(8)/col(9) (Positive/Negative Fiscal Correction,
// Correction Code) juga dirender disabled/readonly, fixed 0/'', selain col(4)/col(5)
// yang sudah ditangani disable45. Hasilnya untuk akun 5020: HANYA Amount (Commercial)
// yang editable, sesuai Blueprint Kelompok 3.

const ModalEditA = ({ row, onClose, onSave }) => {
    const [form, setForm] = useState({
        commercial: row.commercial,
        nonTaxable: row.nonTaxable,
        finalTax:   row.finalTax,
        posCorr:    row.posCorr,
        negCorr:    row.negCorr,
        corrCode:   row.corrCode,
    });

    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    const effNonTaxable = row.disable45 ? 0 : parse(form.nonTaxable);
    const effFinalTax   = row.disable45 ? 0 : parse(form.finalTax);
    const effPosCorr    = row.disable78 ? 0 : parse(form.posCorr);
    const effNegCorr    = row.disable78 ? 0 : parse(form.negCorr);

    const nonFinal  = parse(form.commercial) - effNonTaxable - effFinalTax;
    const fiscalAmt = nonFinal + effPosCorr - effNegCorr;

    const handleSave = () => {
        onSave({
            ...form,
            nonTaxable: row.disable45 ? '' : form.nonTaxable,
            finalTax:   row.disable45 ? '' : form.finalTax,
            posCorr:    row.disable78 ? '' : form.posCorr,
            negCorr:    row.disable78 ? '' : form.negCorr,
            corrCode:   row.disable78 ? '' : form.corrCode,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Modal Header */}
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-white font-semibold text-sm">Edit Akun — Section A</p>
                        <p className="text-blue-200 text-xs mt-0.5">{row.code} · {row.name}</p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3">
                        <ReadonlyField label="Account Code"        value={row.code} />
                        <ReadonlyField label="Description"         value={row.name} />
                    </div>

                    <RpField
                        label="Amount (Commercial)"
                        value={form.commercial}
                        onChange={set('commercial')}
                        isContraAccount={row.signMinus}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <RpField
                            label="Non Taxable Object"
                            value={form.nonTaxable}
                            onChange={set('nonTaxable')}
                            disabled={row.disable45}
                            isContraAccount={row.signMinus}
                        />
                        <RpField
                            label="Subject to Final Tax"
                            value={form.finalTax}
                            onChange={set('finalTax')}
                            disabled={row.disable45}
                            isContraAccount={row.signMinus}
                        />
                    </div>

                    <ReadonlyField
                        label="Non Final  =  Commercial − Non Taxable − Final Tax"
                        value={nonFinal !== 0 ? nonFinal.toLocaleString('id-ID') : ''}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <RpField
                            label="Positive Fiscal Correction"
                            value={form.posCorr}
                            onChange={set('posCorr')}
                            disabled={row.disable78}
                            isContraAccount={row.signMinus}
                        />
                        <RpField
                            label="Negative Fiscal Correction"
                            value={form.negCorr}
                            onChange={set('negCorr')}
                            disabled={row.disable78}
                            isContraAccount={row.signMinus}
                        />
                    </div>

                    {row.disable78 ? (
                        <ReadonlyField label="Correction Code" value="—" />
                    ) : (
                        <SelectField
                            label="Correction Code"
                            value={form.corrCode}
                            onChange={set('corrCode')}
                            options={CORRECTION_CODES}
                        />
                    )}

                    <ReadonlyField
                        label="Fiscal Amount (Before Tax Facilities)  =  Non Final + Pos − Neg"
                        value={fiscalAmt !== 0 ? fiscalAmt.toLocaleString('id-ID') : ''}
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

// ─── Modal Section B ──────────────────────────────────────────────────────────
// Identik dengan L1C/L1A — tidak diubah.

const ModalEditB = ({ row, onClose, onSave }) => {
    const [amount, setAmount] = useState(row.amount);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-white font-semibold text-sm">Edit Akun — Section B</p>
                        <p className="text-blue-200 text-xs mt-0.5">{row.code} · {row.name}</p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <ReadonlyField label="Account Code" value={row.code} />
                        <ReadonlyField label="Description"  value={row.name} />
                    </div>
                    <RpField
                        label="Amount"
                        value={amount}
                        onChange={setAmount}
                        isContraAccount={row.signMinus}
                    />
                </div>

                <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onSave(amount)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
//   l1dRowsA / l1dRowsBAset / l1dRowsBLiabEkuitas — data mentah dari SptTahunanBadan (restore draft)
//   onRowsAChange / onRowsBAsetChange / onRowsBLiabEkuitasChange — emit ke parent HANYA saat Save modal
//   onA10Change — emit A.10 ke SptTahunanBadan → MainFormBadan D.4
//
// Pola props identik dengan L1C (lihat L1c.js) — hanya prefix nama prop yang berbeda
// (l1d* vs l1c*), agar SptTahunanBadan dapat menyimpan state L1D secara independen
// dari L1A/L1C (Business Classification switch tidak menghapus data Lampiran lain).

const L1D = ({
    taxYear,
    tin,
    l1dRowsA = [],
    l1dRowsBAset = [],
    l1dRowsBLiabEkuitas = [],
    onRowsAChange,
    onRowsBAsetChange,
    onRowsBLiabEkuitasChange,
    onA10Change,
    // onEbitdaComponentsChange — [Blueprint L11 §4 EBITDA Contract] emit komponen
    // EBITDA (commercialNetIncome/4800, depreciationAmortization/4315,
    // borrowingCostExpense/4316) ke SptTahunanBadan → L11B Bagian I. Read-only
    // forward dari akun yang SUDAH ADA — tidak menambah business logic baru.
    onEbitdaComponentsChange,
}) => {
    const [rowsA, setRowsA] = useState(() => mergeRowsWithDraft(buildInitialA(), l1dRowsA));
    const [rowsBAset, setRowsBAset] = useState(() => mergeRowsBWithDraft(buildInitialBAset(), l1dRowsBAset));
    const [rowsBLiab, setRowsBLiab] = useState(() => mergeRowsBWithDraft(buildInitialBLiabEkuitas(), l1dRowsBLiabEkuitas));

    const [editingA, setEditingA] = useState(null);
    const [editingBAset, setEditingBAset] = useState(null);
    const [editingBLiab, setEditingBLiab] = useState(null);

    // Ref anti-loop: tandai jika perubahan l1dRowsX berasal dari child itu sendiri
    // (via onRowsXChange), sehingga useEffect restore tidak memantul balik.
    const skipRestoreA  = useRef(false);
    const skipRestoreBA = useRef(false);
    const skipRestoreBL = useRef(false);

    useEffect(() => {
        if (skipRestoreA.current) { skipRestoreA.current = false; return; }
        if (Array.isArray(l1dRowsA) && l1dRowsA.length > 0) {
            setRowsA(mergeRowsWithDraft(buildInitialA(), l1dRowsA));
        }
    }, [l1dRowsA]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (skipRestoreBA.current) { skipRestoreBA.current = false; return; }
        if (Array.isArray(l1dRowsBAset) && l1dRowsBAset.length > 0) {
            setRowsBAset(mergeRowsBWithDraft(buildInitialBAset(), l1dRowsBAset));
        }
    }, [l1dRowsBAset]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (skipRestoreBL.current) { skipRestoreBL.current = false; return; }
        if (Array.isArray(l1dRowsBLiabEkuitas) && l1dRowsBLiabEkuitas.length > 0) {
            setRowsBLiab(mergeRowsBWithDraft(buildInitialBLiabEkuitas(), l1dRowsBLiabEkuitas));
        }
    }, [l1dRowsBLiabEkuitas]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Save handlers — emit ke parent SETELAH row selesai diperbarui ──────────

    const handleSaveA = (idx, form) => {
        setRowsA(prev => {
            const next = prev.map((r, i) => i !== idx ? r : { ...r, ...form });
            if (onRowsAChange) {
                skipRestoreA.current = true;
                onRowsAChange(next);
            }
            return next;
        });
        setEditingA(null);
    };

    const handleSaveBAset = (idx, amount) => {
        setRowsBAset(prev => {
            const next = prev.map((r, i) => i !== idx ? r : { ...r, amount });
            if (onRowsBAsetChange) {
                skipRestoreBA.current = true;
                onRowsBAsetChange(next);
            }
            return next;
        });
        setEditingBAset(null);
    };

    const handleSaveBLiab = (idx, amount) => {
        setRowsBLiab(prev => {
            const next = prev.map((r, i) => i !== idx ? r : { ...r, amount });
            if (onRowsBLiabEkuitasChange) {
                skipRestoreBL.current = true;
                onRowsBLiabEkuitasChange(next);
            }
            return next;
        });
        setEditingBLiab(null);
    };

    // ── Derived: nonFinal, fiscalAmt per row, subtotal chained (Blueprint L1D §6) ──
    // Pipeline:
    //   1. Hitung formula universal per row input. Untuk row disable45, col4/col5
    //      dipaksa 0. Untuk row disable78 (Kelompok 3 — 5020), col7/col8 JUGA
    //      dipaksa 0 → col6 = col3 dan col10 = col6 (Blueprint Kelompok 3, Perlu
    //      Konfirmasi #2 — diimplementasikan apa adanya sesuai instruksi Blueprint).
    //   2. Hitung subtotal berdasarkan dependency graph Blueprint §4 & §6.
    //      4300 = 4021 − 4013 − 5020 (FINAL — keputusan desain dikonfirmasi).
    //      TIDAK ada lapisan subtotal 4004/4020/5020-sebagai-subtotal seperti L1C,
    //      karena Bagian A L1D hanya 3 baris Input sebelum Laba Kotor.
    //   3. Subtotal juga mengikuti formula universal (col6 = col3−col4−col5, col10 = col6+col7−col8).
    //   4. Semua value kosong = 0 (tidak pernah NaN).

    const rowsAComputed = useMemo(() => {
        const v = {}; // v[code][col] → number
        rowsA.forEach(r => {
            if (!r.isInput || !r.code) return;
            const col3 = parse(r.commercial);
            const col4 = r.disable45 ? 0 : parse(r.nonTaxable);
            const col5 = r.disable45 ? 0 : parse(r.finalTax);
            const col6 = col3 - col4 - col5;
            const col7 = r.disable78 ? 0 : parse(r.posCorr);
            const col8 = r.disable78 ? 0 : parse(r.negCorr);
            const col10 = col6 + col7 - col8;
            v[r.code] = { col3, col4, col5, col6, col7, col8, col10 };
        });

        const g = (code, col) => v[code]?.[col] ?? 0;

        const subtotals = {};
        const calcSubtotal = (code, col3fn, col4fn, col5fn, col7fn, col8fn) => {
            const c3 = col3fn();
            const c4 = col4fn();
            const c5 = col5fn();
            const c6 = c3 - c4 - c5;
            const c7 = col7fn();
            const c8 = col8fn();
            const c10 = c6 + c7 - c8;
            subtotals[code] = { col3: c3, col4: c4, col5: c5, col6: c6, col7: c7, col8: c8, col10: c10 };
        };

        const gs = (code, col) => subtotals[code]?.[col] ?? 0;

        // col(x)[4300] = col(x)[4021] − col(x)[4013] − col(x)[5020]   ← FINAL
        calcSubtotal('4300',
            () => g('4021','col3') - g('4013','col3') - g('5020','col3'),
            () => g('4021','col4') - g('4013','col4') - g('5020','col4'),
            () => g('4021','col5') - g('4013','col5') - g('5020','col5'),
            () => g('4021','col7') - g('4013','col7') - g('5020','col7'),
            () => g('4021','col8') - g('4013','col8') - g('5020','col8'),
        );
        // col(x)[5400] = Σ 5311..5399 (13 akun — identik dengan L1C)
        const BEBAN_USAHA = ['5311','5312','5313','5314','4315','4316','4317','5318','5319','5320','5321','5322','5399'];
        calcSubtotal('5400',
            () => BEBAN_USAHA.reduce((s, c) => s + g(c,'col3'), 0),
            () => BEBAN_USAHA.reduce((s, c) => s + g(c,'col4'), 0),
            () => BEBAN_USAHA.reduce((s, c) => s + g(c,'col5'), 0),
            () => BEBAN_USAHA.reduce((s, c) => s + g(c,'col7'), 0),
            () => BEBAN_USAHA.reduce((s, c) => s + g(c,'col8'), 0),
        );
        // col(x)[4500] = col(x)[4300] + col(x)[4199] − col(x)[5400]
        calcSubtotal('4500',
            () => gs('4300','col3') + g('4199','col3') - gs('5400','col3'),
            () => gs('4300','col4') + g('4199','col4') - gs('5400','col4'),
            () => gs('4300','col5') + g('4199','col5') - gs('5400','col5'),
            () => gs('4300','col7') + g('4199','col7') - gs('5400','col7'),
            () => gs('4300','col8') + g('4199','col8') - gs('5400','col8'),
        );
        // col(x)[4600] = 4501+4503+4511+4599
        calcSubtotal('4600',
            () => g('4501','col3') + g('4503','col3') + g('4511','col3') + g('4599','col3'),
            () => g('4501','col4') + g('4503','col4') + g('4511','col4') + g('4599','col4'),
            () => g('4501','col5') + g('4503','col5') + g('4511','col5') + g('4599','col5'),
            () => g('4501','col7') + g('4503','col7') + g('4511','col7') + g('4599','col7'),
            () => g('4501','col8') + g('4503','col8') + g('4511','col8') + g('4599','col8'),
        );
        // col(x)[5500] = 5405+5409+5421+5499
        calcSubtotal('5500',
            () => g('5405','col3') + g('5409','col3') + g('5421','col3') + g('5499','col3'),
            () => g('5405','col4') + g('5409','col4') + g('5421','col4') + g('5499','col4'),
            () => g('5405','col5') + g('5409','col5') + g('5421','col5') + g('5499','col5'),
            () => g('5405','col7') + g('5409','col7') + g('5421','col7') + g('5499','col7'),
            () => g('5405','col8') + g('5409','col8') + g('5421','col8') + g('5499','col8'),
        );
        // col(x)[4700] = col(x)[4600] − col(x)[5500]
        calcSubtotal('4700',
            () => gs('4600','col3') - gs('5500','col3'),
            () => gs('4600','col4') - gs('5500','col4'),
            () => gs('4600','col5') - gs('5500','col5'),
            () => gs('4600','col7') - gs('5500','col7'),
            () => gs('4600','col8') - gs('5500','col8'),
        );
        // col(x)[4800] = col(x)[4500] + col(x)[4700]   ← A.10 = col(10)[4800]
        calcSubtotal('4800',
            () => gs('4500','col3') + gs('4700','col3'),
            () => gs('4500','col4') + gs('4700','col4'),
            () => gs('4500','col5') + gs('4700','col5'),
            () => gs('4500','col7') + gs('4700','col7'),
            () => gs('4500','col8') + gs('4700','col8'),
        );

        // Gabungkan kembali ke rows untuk render
        return rowsA.map(r => {
            if (r.isInput && r.code) {
                const vals = v[r.code] || { col3:0, col4:0, col5:0, col6:0, col7:0, col8:0, col10:0 };
                return {
                    ...r,
                    _nonFinal:  vals.col6,
                    _fiscalAmt: vals.col10,
                };
            }
            if (r.isSubtotal && r.code && subtotals[r.code]) {
                const s = subtotals[r.code];
                return {
                    ...r,
                    commercial: s.col3,
                    nonTaxable: s.col4,
                    finalTax:   s.col5,
                    posCorr:    s.col7,
                    negCorr:    s.col8,
                    _nonFinal:  s.col6,
                    _fiscalAmt: s.col10,
                };
            }
            return r;
        });
    }, [rowsA]);

    // ── A.10 = col(10)[4800] (Blueprint §6) ──────────────────────────────────

    const a10 = useMemo(() => {
        const row4800 = rowsAComputed.find(r => r.code === '4800');
        return row4800?._fiscalAmt ?? 0;
    }, [rowsAComputed]);

    // ── Derived Bagian B — Sisi Aset: 1700 (Blueprint §5, §7) ──────────────────
    // CATATAN: berbeda dari L1C, TIDAK ADA subtotal antara (1500/1699) di L1D —
    // 1700 = Σ langsung seluruh 24 akun Input Aset (Lancar + Tidak Lancar),
    // dengan akun pengurang (1131, 1522, 1601, 1658) bersign −1.
    // Agregasi berbasis KODE AKUN langsung (bukan daftar internalId seperti L1C) —
    // aman dilakukan karena seluruh kode akun Bagian B L1D sudah unik.

    const ASET_CODES = [
        '1101','1122','1123','1124','1125','1131','1181','1200',
        '1401','1421','1422','1423','1499',
        '1501','1521','1522','1551','1599','1600','1601','1611','1651','1658','1698',
    ];

    const rowsBAsetComputed = useMemo(() => {
        const vb = {}; // by code
        rowsBAset.forEach(r => {
            if (r.isInput && r.code) {
                const val = parse(r.amount);
                vb[r.code] = r.signMinus ? -val : val;
            }
        });
        const gb = (code) => vb[code] ?? 0;

        const total1700 = ASET_CODES.reduce((s, c) => s + gb(c), 0);
        const subtotalsB = { '1700': total1700 };

        return {
            rows: rowsBAset.map(r => {
                if (r.isSubtotal && r.code && subtotalsB[r.code] !== undefined) {
                    return { ...r, amount: subtotalsB[r.code] };
                }
                return r;
            }),
            total1700,
        };
    }, [rowsBAset]);

    // ── Derived Bagian B — Sisi Liabilitas & Ekuitas: 2999, 3299, 3300 ─────────
    // CATATAN: berbeda dari L1C, TIDAK ADA subtotal antara (2229) di L1D —
    // 2999 = Σ langsung seluruh 19 akun Liabilitas (Jangka Pendek + Jangka Panjang),
    // sehingga TIDAK ADA risiko double-counting yang menjadi catatan "Perlu
    // Konfirmasi" di L1C. Agregasi berbasis kode akun langsung (lihat catatan
    // ASET_CODES di atas — aman karena kode 2204/2323 di L1D sudah unik, bukan
    // duplikat 2203/2322 seperti di L1C).

    const LIAB_JK_PENDEK_CODES  = ['2102','2103','2111','2191','2186','2187','2195','2201','2202','2203','2204','2228'];
    const LIAB_JK_PANJANG_CODES = ['2301','2304','2312','2322','2323','2321','2998'];
    const EKUITAS_CODES         = ['3102','3120','3200','3297','3298'];

    const rowsBLiabComputed = useMemo(() => {
        const vb = {}; // by code
        rowsBLiab.forEach(r => {
            if (r.isInput && r.code) {
                vb[r.code] = parse(r.amount);
            }
        });
        const gb = (code) => vb[code] ?? 0;

        const total2999 = [...LIAB_JK_PENDEK_CODES, ...LIAB_JK_PANJANG_CODES].reduce((s, c) => s + gb(c), 0);
        const total3299 = EKUITAS_CODES.reduce((s, c) => s + gb(c), 0);
        const total3300 = total2999 + total3299;

        const subtotalsB = { '2999': total2999, '3299': total3299, '3300': total3300 };

        return {
            rows: rowsBLiab.map(r => {
                if (r.isSubtotal && r.code && subtotalsB[r.code] !== undefined) {
                    return { ...r, amount: subtotalsB[r.code] };
                }
                return r;
            }),
            total3300,
        };
    }, [rowsBLiab]);

    // Emit A.10 ke parent → SptTahunanBadan.a10ByLampiran.L1D → MainFormBadan D.4
    useEffect(() => {
        if (onA10Change) onA10Change(a10);
    }, [a10, onA10Change]); // onA10Change stabil via useCallback di parent

    // ── EBITDA Components (Blueprint L11 §4 EBITDA Contract) ──────────────────
    // Forward read-only 3 nilai commercial yang SUDAH ADA di rowsAComputed:
    // 4800 (subtotal, commercial = col3), 4315 & 4316 (input, commercial = raw).
    // TIDAK ada kalkulasi baru, TIDAK mengubah rowsAComputed/a10 di atas.
    const ebitdaComponents = useMemo(() => {
        const row4800 = rowsAComputed.find(r => r.code === '4800');
        const row4315 = rowsAComputed.find(r => r.code === '4315');
        const row4316 = rowsAComputed.find(r => r.code === '4316');
        return {
            // OPEN CLARIFICATION #1 (Blueprint L11 §1) — commercialNetIncome saat ini
            // = akun 4800 commercial subtotal. BELUM final, menunggu konfirmasi client.
            commercialNetIncome: parse(row4800?.commercial),
            depreciationAmortization: parse(row4315?.commercial),
            borrowingCostExpense: parse(row4316?.commercial),
            // OPEN CLARIFICATION #2 (Blueprint L11 §1) — belum ada source of truth
            // untuk Income Tax Expense di L1D. Sengaja null (bukan 0) agar L11B bisa
            // membedakan "belum ada data" vs "nilai memang nol".
            incomeTaxExpense: null,
        };
    }, [rowsAComputed]);

    // Emit ke parent → SptTahunanBadan.ebitdaComponentsByLampiran.L1D → L11B Bagian I
    useEffect(() => {
        if (onEbitdaComponentsChange) onEbitdaComponentsChange(ebitdaComponents);
    }, [ebitdaComponents, onEbitdaComponentsChange]); // stabil via useCallback di parent

    // ── Table style helpers ───────────────────────────────────────────────────
    // (identik dengan L1C/L1A — reusable, tidak diubah)

    // Warna header (kuning), border grid penuh — mengikuti referensi visual L13A.
    // Alignment, freeze kolom, dan scroll behavior TETAP mengikuti implementasi
    // L1D yang sudah berjalan (tidak diubah).
    const thCls = "px-3 py-2 text-left text-xs font-semibold text-gray-800 bg-yellow-400 border border-white whitespace-nowrap";
    const tdCls = "px-3 py-2 text-xs text-gray-700 border border-gray-200";
    const tdNum = "px-3 py-2 text-xs text-right text-gray-700 border border-gray-200 font-mono";

    const COL_ACTION_W = 48;
    const COL_CODE_W   = 100;

    const thAction = { position: 'sticky', left: 0,                          top: 0, zIndex: 4, backgroundColor: '#facc15' };
    const thCode   = { position: 'sticky', left: COL_ACTION_W,               top: 0, zIndex: 4, backgroundColor: '#facc15' };
    const thName   = { position: 'sticky', left: COL_ACTION_W + COL_CODE_W,  top: 0, zIndex: 4, backgroundColor: '#facc15' };
    const thTop    = { position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#facc15' };

    const tdAction = { position: 'sticky', left: 0,                          zIndex: 1, backgroundColor: '#ffffff' };
    const tdCode   = { position: 'sticky', left: COL_ACTION_W,               zIndex: 1, backgroundColor: '#ffffff' };
    const tdName   = { position: 'sticky', left: COL_ACTION_W + COL_CODE_W,  zIndex: 1, backgroundColor: '#ffffff' };
    const tdActionHdr = { ...tdAction, backgroundColor: '#eff6ff' };
    const tdCodeHdr   = { ...tdCode,   backgroundColor: '#eff6ff' };
    const tdNameHdr   = { ...tdName,   backgroundColor: '#eff6ff' };

    const rowsBAsetRender = rowsBAsetComputed.rows;
    const rowsBLiabRender = rowsBLiabComputed.rows;

    return (
        <div className="p-6 space-y-8">
            {/* ── HEADER ──────────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 1D — Financial statements (Jasa)
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Year"  value={taxYear} />
                    <ReadonlyField label="TIN (NPWP)" value={tin} />
                </div>
            </div>

            {/* ── SECTION A ───────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-blue-700">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                        Section A — Income Statement
                    </h3>
                </div>

                <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '600px' }}>
                    <table className="w-full text-sm border-collapse min-w-[1100px]">
                        <thead>
                            <tr>
                                <th className={thCls} style={{ ...thAction, minWidth: COL_ACTION_W }}>Action</th>
                                <th className={thCls} style={{ ...thCode,   minWidth: COL_CODE_W  }}>Account Code</th>
                                <th className={`${thCls} w-64`} style={thName}>Account Name</th>
                                <th className={`${thCls} text-right`} style={thTop}>Amount (Commercial)</th>
                                <th className={`${thCls} text-right`} style={thTop}>Non Taxable Object</th>
                                <th className={`${thCls} text-right`} style={thTop}>Subject to Final Tax</th>
                                <th className={`${thCls} text-right`} style={thTop}>Non Final</th>
                                <th className={`${thCls} text-right`} style={thTop}>Positive Fiscal Correction</th>
                                <th className={`${thCls} text-right`} style={thTop}>Negative Fiscal Correction</th>
                                <th className={thCls} style={thTop}>Correction Code</th>
                                <th className={`${thCls} text-right`} style={thTop}>Fiscal Amount (Before Tax Facilities)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsAComputed.map((row, idx) => (
                                <tr
                                    key={row.internalId}
                                    className={
                                        row.isHeader
                                            ? 'bg-blue-50'
                                            : 'hover:bg-gray-50 transition-colors'
                                    }
                                >
                                    {/* Action — frozen col 0 */}
                                    <td className={tdCls} style={row.isHeader ? tdActionHdr : tdAction}>
                                        {!row.isHeader && (
                                            <button
                                                onClick={() => setEditingA(idx)}
                                                title="Edit"
                                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                    {/* Account Code — frozen col 1 */}
                                    <td className={`${tdCls} font-mono ${row.isHeader ? 'font-semibold text-blue-800' : ''}`} style={row.isHeader ? tdCodeHdr : tdCode}>
                                        {row.code}
                                    </td>
                                    {/* Account Name — frozen col 2 */}
                                    <td className={`${tdCls} ${row.isHeader ? 'font-semibold text-blue-800' : ''}`} style={row.isHeader ? tdNameHdr : tdName}>
                                        {row.name}
                                    </td>
                                    <td className={tdNum}>{row.isHeader ? '' : fmtRp(row.commercial)}</td>
                                    <td className={tdNum}>
                                        {row.isHeader ? '' : (row.disable45 && row.isInput ? <span className="text-gray-300">—</span> : fmtRp(row.nonTaxable))}
                                    </td>
                                    <td className={tdNum}>
                                        {row.isHeader ? '' : (row.disable45 && row.isInput ? <span className="text-gray-300">—</span> : fmtRp(row.finalTax))}
                                    </td>
                                    <td className={`${tdNum} ${row._nonFinal < 0 ? 'text-red-600' : ''}`}>
                                        {row.isHeader ? '' : fmtRp(row._nonFinal)}
                                    </td>
                                    <td className={tdNum}>
                                        {row.isHeader ? '' : (row.disable78 && row.isInput ? <span className="text-gray-300">—</span> : fmtRp(row.posCorr))}
                                    </td>
                                    <td className={tdNum}>
                                        {row.isHeader ? '' : (row.disable78 && row.isInput ? <span className="text-gray-300">—</span> : fmtRp(row.negCorr))}
                                    </td>
                                    <td className={tdCls}>
                                        {row.isHeader || row.isSubtotal ? '' : (
                                            row.disable78
                                                ? <span className="text-xs text-gray-300">—</span>
                                                : <span className="text-xs text-gray-500">{row.corrCode || '—'}</span>
                                        )}
                                    </td>
                                    <td className={`${tdNum} ${row._fiscalAmt < 0 ? 'text-red-600' : ''}`}>
                                        {row.isHeader ? '' : fmtRp(row._fiscalAmt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {/* A.10 — col(10)[4800], dihitung otomatis */}
                        <tfoot>
                            <tr className="bg-blue-700">
                                <td className="px-3 py-2" />
                                <td className="px-3 py-2 text-xs font-bold text-white font-mono">A.10</td>
                                <td className="px-3 py-2 text-xs font-bold text-white" colSpan={8}>
                                    Fiscal Net Income Before Tax Facility (Laba / Rugi Sebelum Pajak — Fiskal)
                                </td>
                                <td className={`px-3 py-2 text-xs font-bold text-right font-mono ${a10 < 0 ? 'text-red-300' : 'text-white'}`}>
                                    {a10 !== 0 ? fmtRp(a10) : 'Rp0'}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* ── SECTION B — Sisi Aset ───────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-blue-700">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                        Section B — Statement of Financial Position (Aset)
                    </h3>
                </div>

                <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '500px' }}>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                <th className={thCls} style={{ ...thAction, minWidth: COL_ACTION_W }}>Action</th>
                                <th className={thCls} style={{ ...thCode,   minWidth: COL_CODE_W  }}>Account Code</th>
                                <th className={`${thCls} w-96`} style={thName}>Account Name</th>
                                <th className={`${thCls} text-right`} style={thTop}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsBAsetRender.map((row, idx) => (
                                <tr
                                    key={row.internalId}
                                    className={
                                        row.isHeader
                                            ? 'bg-blue-50'
                                            : 'hover:bg-gray-50 transition-colors'
                                    }
                                >
                                    <td className={tdCls} style={row.isHeader ? tdActionHdr : tdAction}>
                                        {!row.isHeader && !row.isSubtotal && (
                                            <button
                                                onClick={() => setEditingBAset(idx)}
                                                title="Edit"
                                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                    <td className={`${tdCls} font-mono ${row.isHeader ? 'font-semibold text-blue-800' : ''} ${row.isSubtotal ? 'font-semibold' : ''}`} style={row.isHeader ? tdCodeHdr : tdCode}>
                                        {row.code}
                                    </td>
                                    <td className={`${tdCls} ${row.isHeader ? 'font-semibold text-blue-800' : ''} ${row.isSubtotal ? 'font-semibold' : ''}`} style={row.isHeader ? tdNameHdr : tdName}>
                                        {row.name}
                                    </td>
                                    <td className={`${tdNum} ${row.isSubtotal ? 'font-semibold' : ''} ${parse(row.amount) < 0 ? 'text-red-600' : ''}`}>
                                        {row.isHeader ? '' : fmtRp(row.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── SECTION B — Sisi Liabilitas & Ekuitas ───────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-blue-700">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                        Section B — Statement of Financial Position (Liabilitas &amp; Ekuitas)
                    </h3>
                </div>

                <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '500px' }}>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                <th className={thCls} style={{ ...thAction, minWidth: COL_ACTION_W }}>Action</th>
                                <th className={thCls} style={{ ...thCode,   minWidth: COL_CODE_W  }}>Account Code</th>
                                <th className={`${thCls} w-96`} style={thName}>Account Name</th>
                                <th className={`${thCls} text-right`} style={thTop}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsBLiabRender.map((row, idx) => (
                                <tr
                                    key={row.internalId}
                                    className={
                                        row.isHeader
                                            ? 'bg-blue-50'
                                            : 'hover:bg-gray-50 transition-colors'
                                    }
                                >
                                    <td className={tdCls} style={row.isHeader ? tdActionHdr : tdAction}>
                                        {!row.isHeader && !row.isSubtotal && (
                                            <button
                                                onClick={() => setEditingBLiab(idx)}
                                                title="Edit"
                                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                    <td className={`${tdCls} font-mono ${row.isHeader ? 'font-semibold text-blue-800' : ''} ${row.isSubtotal ? 'font-semibold' : ''}`} style={row.isHeader ? tdCodeHdr : tdCode}>
                                        {row.code}
                                    </td>
                                    <td className={`${tdCls} ${row.isHeader ? 'font-semibold text-blue-800' : ''} ${row.isSubtotal ? 'font-semibold' : ''}`} style={row.isHeader ? tdNameHdr : tdName}>
                                        {row.name}
                                    </td>
                                    <td className={`${tdNum} ${row.isSubtotal ? 'font-semibold' : ''} ${parse(row.amount) < 0 ? 'text-red-600' : ''}`}>
                                        {row.isHeader ? '' : fmtRp(row.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODALS ──────────────────────────────────────────────────────── */}
            {editingA !== null && (
                <ModalEditA
                    row={rowsA[editingA]}
                    onClose={() => setEditingA(null)}
                    onSave={(form) => handleSaveA(editingA, form)}
                />
            )}
            {editingBAset !== null && (
                <ModalEditB
                    row={rowsBAset[editingBAset]}
                    onClose={() => setEditingBAset(null)}
                    onSave={(amount) => handleSaveBAset(editingBAset, amount)}
                />
            )}
            {editingBLiab !== null && (
                <ModalEditB
                    row={rowsBLiab[editingBLiab]}
                    onClose={() => setEditingBLiab(null)}
                    onSave={(amount) => handleSaveBLiab(editingBLiab, amount)}
                />
            )}
        </div>
    );
};

export default L1D;