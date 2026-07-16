import React, { useState, useMemo, useEffect, useRef } from 'react';

// ─── Static Data ──────────────────────────────────────────────────────────────

// type: 'input' | 'groupHeader' | 'operatorMinus' | 'subtotal'
// isHeader: true  → groupHeader | operatorMinus (untuk styling baris)
// isSubtotal: true → subtotal (readonly, no edit button, no col9)
const SECTION_A_ACCOUNTS = [
    // ── Penjualan ──────────────────────────────────────────────────────────────
    { code: '',     name: 'Penjualan',                                                     type: 'groupHeader'   },
    { code: '4002', name: 'Penjualan Domestik',                                            type: 'input'         },
    { code: '4003', name: 'Penjualan Ekspor',                                              type: 'input'         },
    { code: '4004', name: 'Penjualan Bruto',                                               type: 'subtotal'      },
    { code: '',     name: 'Dikurangi',                                                     type: 'operatorMinus' },
    { code: '4011', name: 'Retur',                                                         type: 'input'         },
    { code: '4012', name: 'Potongan Penjualan',                                            type: 'input'         },
    { code: '4013', name: 'Penyesuaian Penjualan',                                        type: 'input'         },
    { code: '4020', name: 'Penjualan Bersih',                                              type: 'subtotal'      },
    // ── HPP ───────────────────────────────────────────────────────────────────
    { code: '',     name: 'Harga Pokok Penjualan (HPP)',                                   type: 'groupHeader'   },
    { code: '5001', name: 'Pembelian',                                                     type: 'input'         },
    { code: '5003', name: 'Beban Pengangkutan',                                            type: 'input'         },
    { code: '5007', name: 'Beban Lainnya',                                                 type: 'input'         },
    { code: '5008', name: 'Persediaan - Awal',                                             type: 'input'         },
    { code: '5009', name: 'Dikurangi Persediaan - Akhir',                                  type: 'input', signMinus: true },
    { code: '5020', name: 'Jumlah HPP',                                                    type: 'subtotal'      },
    // ── Laba Kotor & Pendapatan Usaha Lainnya ────────────────────────────────
    { code: '4300', name: 'Laba Kotor',                                                    type: 'subtotal'      },
    { code: '4199', name: 'Pendapatan Usaha Lainnya',                                      type: 'input'         },
    // ── Beban Usaha ──────────────────────────────────────────────────────────
    { code: '',     name: 'Beban Usaha',                                                   type: 'groupHeader'   },
    { code: '5311', name: 'Gaji, Tunjangan, Bonus, Honorarium, THR, dsb',                 type: 'input'         },
    { code: '5312', name: 'Beban Imbalan Kerja Lainnya',                                   type: 'input'         },
    { code: '5313', name: 'Beban Transportasi',                                            type: 'input'         },
    { code: '5314', name: 'Beban Sewa',                                                    type: 'input'         },
    { code: '4315', name: 'Beban Penyusutan dan Amortisasi',                               type: 'input'         },
    { code: '4316', name: 'Beban Bunga',                                                   type: 'input'         },
    { code: '4317', name: 'Beban sehubungan dengan Jasa',                                  type: 'input'         },
    { code: '5318', name: 'Beban Penurunan Nilai',                                         type: 'input'         },
    { code: '5319', name: 'Beban Royalti',                                                 type: 'input'         },
    { code: '5320', name: 'Beban Pemasaran atau Promosi',                                  type: 'input'         },
    { code: '5321', name: 'Beban Entertainment',                                           type: 'input'         },
    { code: '5322', name: 'Beban Umum dan Administrasi',                                   type: 'input'         },
    { code: '5399', name: 'Beban Usaha Lainnya',                                           type: 'input'         },
    { code: '5400', name: 'Jumlah Beban Usaha',                                            type: 'subtotal'      },
    // ── Laba Usaha ───────────────────────────────────────────────────────────
    { code: '4500', name: 'Laba (Rugi) Usaha',                                             type: 'subtotal'      },
    // ── Pendapatan Non Usaha ─────────────────────────────────────────────────
    { code: '',     name: 'Pendapatan Non Usaha',                                          type: 'groupHeader'   },
    { code: '4501', name: 'Keuntungan Selisih Kurs',                                       type: 'input'         },
    { code: '4503', name: 'Keuntungan Penjualan Aset selain Persediaan',                   type: 'input'         },
    { code: '4511', name: 'Pendapatan Bunga',                                              type: 'input'         },
    { code: '4599', name: 'Pendapatan Non Usaha Lainnya',                                  type: 'input'         },
    { code: '4600', name: 'Jumlah Pendapatan Non Usaha',                                   type: 'subtotal'      },
    // ── Beban Non Usaha ──────────────────────────────────────────────────────
    { code: '',     name: 'Beban Non Usaha',                                               type: 'groupHeader'   },
    { code: '5405', name: 'Kerugian Penjualan Aset selain Persediaan',                     type: 'input'         },
    { code: '5409', name: 'Sumbangan',                                                     type: 'input'         },
    { code: '5421', name: 'Kerugian Selisih Kurs',                                         type: 'input'         },
    { code: '5499', name: 'Beban Non Usaha Lainnya',                                       type: 'input'         },
    { code: '5500', name: 'Jumlah Beban Non Usaha',                                        type: 'subtotal'      },
    // ── Penutup ───────────────────────────────────────────────────────────────
    { code: '4700', name: 'Laba (Rugi) Non Usaha',                                         type: 'subtotal'      },
    { code: '4800', name: 'Laba (Rugi) Sebelum Pajak (A.10)',                              type: 'subtotal'      },
];

// Part B — satu kolom nilai, tanpa rekonsiliasi fiskal, tanpa col(9)
// signMinus: true → user input positif, sistem kurangkan dalam subtotal parent
const SECTION_B_ACCOUNTS = [
    // ── Aset Lancar ───────────────────────────────────────────────────────────
    { code: '',     name: 'Aset Lancar',                                                                          type: 'groupHeader' },
    { code: '1101', name: 'Kas dan Setara Kas',                                                                   type: 'input'       },
    { code: '1122', name: 'Piutang Usaha - Pihak Ketiga',                                                        type: 'input'       },
    { code: '1123', name: 'Piutang Usaha - Pihak yang mempunyai Hubungan Istimewa',                              type: 'input'       },
    { code: '1124', name: 'Piutang Lainnya - Pihak Ketiga',                                                      type: 'input'       },
    { code: '1125', name: 'Piutang Lainnya - Pihak yang Mempunyai Hubungan Istimewa',                            type: 'input'       },
    { code: '1131', name: 'Cadangan Kerugian Penurunan Nilai - Aset Lancar',                                     type: 'input', signMinus: true },
    { code: '1181', name: 'Aset Kontrak',                                                                         type: 'input'       },
    { code: '1200', name: 'Investasi',                                                                            type: 'input'       },
    { code: '1401', name: 'Persediaan',                                                                           type: 'input'       },
    { code: '1421', name: 'Beban Dibayar Di Muka',                                                               type: 'input'       },
    { code: '1423', name: 'Pajak Dibayar Di Muka',                                                               type: 'input'       },
    { code: '1405', name: 'Aset yang Dimiliki untuk Dijual',                                                     type: 'input'       },
    { code: '1422', name: 'Uang Muka',                                                                           type: 'input'       },
    { code: '1499', name: 'Aset Lancar Lainnya',                                                                  type: 'input'       },
    // ── Aset Tidak Lancar ─────────────────────────────────────────────────────
    { code: '',     name: 'Aset Tidak Lancar',                                                                    type: 'groupHeader' },
    { code: '1501', name: 'Piutang Jangka Panjang',                                                              type: 'input'       },
    { code: '1520', name: 'Properti Investasi',                                                                   type: 'input'       },
    { code: '1523', name: 'Tanah dan Bangunan',                                                                   type: 'input'       },
    { code: '1524', name: 'Dikurangi: Akumulasi Penyusutan - Tanah dan Bangunan',                                type: 'input', signMinus: true },
    { code: '1529', name: 'Aset Tetap Lainnya',                                                                   type: 'input'       },
    { code: '1530', name: 'Dikurangi: Akumulasi Penyusutan - Aset Tetap Lainnya',                               type: 'input', signMinus: true },
    { code: '1531', name: 'Aset Biologis',                                                                        type: 'input'       },
    { code: '1533', name: 'Aset Hak Guna',                                                                       type: 'input'       },
    { code: '1534', name: 'Dikurangi: Akumulasi Penyusutan - Aset Hak Guna',                                    type: 'input', signMinus: true },
    { code: '1551', name: 'Investasi pada Perusahaan Asosiasi, Ventura Bersama dan Anak Perusahaan',             type: 'input'       },
    { code: '1599', name: 'Investasi Jangka Panjang Lainnya',                                                    type: 'input'       },
    { code: '1600', name: 'Aset Tak Berwujud',                                                                    type: 'input'       },
    { code: '1601', name: 'Dikurangi: Akumulasi Penyusutan - Aset Tak Berwujud',                                type: 'input', signMinus: true },
    { code: '1611', name: 'Aset Pajak Tangguhan',                                                                 type: 'input'       },
    { code: '1651', name: 'Klaim atas Pengembalian Pajak',                                                       type: 'input'       },
    { code: '1658', name: 'Cadangan Kerugian Penurunan Nilai - Aset Tidak Lancar',                              type: 'input', signMinus: true },
    { code: '1698', name: 'Aset Tidak Lancar Lainnya',                                                           type: 'input'       },
    { code: '1700', name: 'Jumlah Aset',                                                                          type: 'subtotal'    },
    // ── Liabilitas Jangka Pendek ──────────────────────────────────────────────
    { code: '',     name: 'Liabilitas Jangka Pendek',                                                             type: 'groupHeader' },
    { code: '2102', name: 'Utang Usaha - Pihak Ketiga',                                                         type: 'input'       },
    { code: '2103', name: 'Utang Usaha - Pihak yang Memiliki Hubungan Istimewa',                                 type: 'input'       },
    { code: '2111', name: 'Utang Bunga',                                                                          type: 'input'       },
    { code: '2186', name: 'Liabilitas Kontrak',                                                                   type: 'input'       },
    { code: '2187', name: 'Liabilitas Sewa Jangka Pendek',                                                       type: 'input'       },
    { code: '2191', name: 'Utang Pajak',                                                                          type: 'input'       },
    { code: '2192', name: 'Utang Dividen',                                                                        type: 'input'       },
    { code: '2195', name: 'Beban Yang Masih Harus Dibayar',                                                      type: 'input'       },
    { code: '2201', name: 'Utang Bank Jangka Pendek',                                                            type: 'input'       },
    { code: '2202', name: 'Utang Jangka Panjang yang Jatuh Tempo dalam Satu Tahun',                             type: 'input'       },
    { code: '2203', name: 'Pendapatan Diterima di Muka',                                                         type: 'input'       },
    { code: '2228', name: 'Liabilitas Jangka Pendek Lainnya',                                                    type: 'input'       },
    // ── Liabilitas Jangka Panjang ─────────────────────────────────────────────
    { code: '',     name: 'Liabilitas Jangka Panjang',                                                           type: 'groupHeader' },
    { code: '2301', name: 'Utang bank Jangka Panjang',                                                           type: 'input'       },
    { code: '2303', name: 'Utang Jangka Panjang - Pihak Ketiga',                                                 type: 'input'       },
    { code: '2304', name: 'Utang Jangka Panjang - Pihak yang Mempunyai Hubungan Istimewa',                      type: 'input'       },
    { code: '2312', name: 'Liabilitas Sewa Jangka Panjang',                                                      type: 'input'       },
    { code: '2322', name: 'Liabilitas Imbalan Kerja',                                                            type: 'input'       },
    { code: '2321', name: 'Liabilitas Pajak Tanguhan',                                                           type: 'input'       },
    { code: '2998', name: 'Liabilitas Jangka Panjang Lainnya',                                                   type: 'input'       },
    { code: '2999', name: 'Jumlah Liabilitas',                                                                    type: 'subtotal'    },
    // ── Ekuitas ───────────────────────────────────────────────────────────────
    { code: '',     name: 'Ekuitas',                                                                              type: 'groupHeader' },
    { code: '3102', name: 'Modal Saham',                                                                          type: 'input'       },
    { code: '3120', name: 'Tambahan Modal Disetor',                                                               type: 'input'       },
    { code: '3200', name: 'Laba Ditahan',                                                                         type: 'input'       },
    { code: '3297', name: 'Pendapatan Komprehensif Lainnya',                                                      type: 'input'       },
    { code: '3298', name: 'Ekuitas Lainnya',                                                                      type: 'input'       },
    { code: '3299', name: 'Jumlah Ekuitas',                                                                       type: 'subtotal'    },
    { code: '3300', name: 'Jumlah Liabilitas dan Ekuitas',                                                        type: 'subtotal'    },
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

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};

const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

// Derive isHeader / isSubtotal booleans dari type untuk backward-compat styling
const withDerived = (acc) => ({
    ...acc,
    isHeader:   acc.type === 'groupHeader' || acc.type === 'operatorMinus',
    isSubtotal: acc.type === 'subtotal',
    isInput:    acc.type === 'input',
});

const buildInitialA = () =>
    SECTION_A_ACCOUNTS.map(a => ({
        ...withDerived(a),
        commercial: '',
        nonTaxable: '',
        finalTax:   '',
        posCorr:    '',
        negCorr:    '',
        corrCode:   '',
    }));

const buildInitialB = () =>
    SECTION_B_ACCOUNTS.map(a => ({ ...withDerived(a), amount: '' }));

// Merge field input mentah dari data draft ke initial rows.
// Hanya commercial/nonTaxable/finalTax/posCorr/negCorr/corrCode yang di-merge.
// Derived values (nonFinal, fiscalAmt, subtotal, a10) TIDAK disimpan — dihitung ulang.
// Row subtotal / groupHeader / operatorMinus tidak memiliki input → skip merge.
const mergeRowsWithDraft = (initialRows, draftRows) => {
    if (!Array.isArray(draftRows) || draftRows.length === 0) return initialRows;
    const map = {};
    draftRows.forEach(d => { if (d?.code) map[d.code] = d; });
    return initialRows.map(row => {
        if (!row.isInput) return row; // hanya input row yang bisa di-merge
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
        };
    });
};

const mergeRowsBWithDraft = (initialRows, draftRows) => {
    if (!Array.isArray(draftRows) || draftRows.length === 0) return initialRows;
    const map = {};
    draftRows.forEach(d => { if (d?.code) map[d.code] = d; });
    return initialRows.map(row => {
        if (!row.isInput) return row; // hanya input row yang bisa di-merge
        const d = map[row.code];
        return d ? { ...row, amount: d.amount ?? row.amount } : row;
    });
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

// RpField: input nominal dengan prefix visual "Rp" + format angka Indonesia.
// • State tetap string mentah (sesuai pola lama: set(key) menerima string dari onChange).
// • "Rp" adalah elemen visual saja — tidak masuk ke value/state/backend.
// • Live formatting saat mengetik: "1000" → "1.000" secara real-time.
// • Cursor dipertahankan agar tidak melompat setelah format.
// • Saat blur: format final dari value prop (digit-only yang sudah tersimpan ke parent).
const RpField = ({ label, value, onChange, placeholder = '0' }) => {
    const inputRef  = useRef(null);
    const isFocused = useRef(false);

    // displayValue hanya untuk tampilan — sinkron dengan value saat tidak focused
    const [displayValue, setDisplayValue] = useState(() => {
        const n = parse(value);
        return n !== 0 ? fmt(n) : (value || '');
    });

    // Sync ulang tampilan jika value berubah dari luar (restore draft) dan tidak sedang focus
    useEffect(() => {
        if (!isFocused.current) {
            const n = parse(value);
            setDisplayValue(n !== 0 ? fmt(n) : (value || ''));
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFocus = () => {
        isFocused.current = true;
        // Saat focus: tampilkan angka tanpa separator agar mudah diedit
        const n = parse(value);
        setDisplayValue(n !== 0 ? String(n) : (value || ''));
    };

    const handleChange = (e) => {
        const input     = e.target;
        const raw       = input.value;
        const cursorPos = input.selectionStart;

        // Strip semua karakter non-digit
        const digitsOnly = raw.replace(/\D/g, '');

        // Format live dengan titik ribuan (id-ID)
        const formatted = digitsOnly === '' ? '' : Number(digitsOnly).toLocaleString('id-ID');

        // Hitung berapa digit ada di sebelah kiri cursor sebelum format
        const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, '').length;

        setDisplayValue(formatted);
        onChange(digitsOnly); // kirim digit-only ke state parent (tidak ada "Rp", tidak ada titik)

        // Restore posisi cursor setelah React update DOM
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
        // Gunakan value prop (digit-only yang sudah tersimpan) sebagai sumber format akhir
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

    const nonFinal = parse(form.commercial) - parse(form.nonTaxable) - parse(form.finalTax);
    const fiscalAmt = nonFinal + parse(form.posCorr) - parse(form.negCorr);

    const handleSave = () => {
        onSave({ ...form });
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
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <RpField
                            label="Non Taxable Object"
                            value={form.nonTaxable}
                            onChange={set('nonTaxable')}
                        />
                        <RpField
                            label="Subject to Final Tax"
                            value={form.finalTax}
                            onChange={set('finalTax')}
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
                        />
                        <RpField
                            label="Negative Fiscal Correction"
                            value={form.negCorr}
                            onChange={set('negCorr')}
                        />
                    </div>

                    <SelectField
                        label="Correction Code"
                        value={form.corrCode}
                        onChange={set('corrCode')}
                        options={CORRECTION_CODES}
                    />

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
//   l1aRowsA / l1aRowsB      — data mentah dari SptTahunanBadan (restore draft)
//   onRowsAChange / onRowsBChange — emit ke parent HANYA saat Save modal (bukan saat mengetik)
//   onA10Change              — emit A.10 ke SptTahunanBadan → MainFormBadan D.4
//   onEbitdaComponentsChange — [Blueprint L11 §4 EBITDA Contract] emit komponen
//     EBITDA (commercialNetIncome/4800, depreciationAmortization/4315,
//     borrowingCostExpense/4316) ke SptTahunanBadan → L11B Bagian I. Read-only
//     forward dari akun yang SUDAH ADA — tidak menambah business logic baru,
//     tidak mengubah kalkulasi A.10/rowsAComputed yang sudah ada.

const L1A = ({ taxYear, tin, l1aRowsA, l1aRowsB, onRowsAChange, onRowsBChange, onA10Change, onEbitdaComponentsChange }) => {
    const [rowsA, setRowsA] = useState(() => mergeRowsWithDraft(buildInitialA(), l1aRowsA));
    const [rowsB, setRowsB] = useState(() => mergeRowsBWithDraft(buildInitialB(), l1aRowsB));
    const [editingA, setEditingA] = useState(null);
    const [editingB, setEditingB] = useState(null);

    // Ref anti-loop: tandai jika perubahan l1aRowsA berasal dari child itu sendiri
    // (via onRowsAChange), sehingga useEffect restore tidak memantul balik.
    const skipRestoreA = useRef(false);
    const skipRestoreB = useRef(false);

    // Restore saat Load Draft: l1aRowsA berubah dari [] → data dari backend.
    // Guard: skip jika perubahan berasal dari onRowsAChange (child→parent→child loop).
    useEffect(() => {
        if (skipRestoreA.current) { skipRestoreA.current = false; return; }
        if (Array.isArray(l1aRowsA) && l1aRowsA.length > 0) {
            setRowsA(mergeRowsWithDraft(buildInitialA(), l1aRowsA));
        }
    }, [l1aRowsA]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (skipRestoreB.current) { skipRestoreB.current = false; return; }
        if (Array.isArray(l1aRowsB) && l1aRowsB.length > 0) {
            setRowsB(mergeRowsBWithDraft(buildInitialB(), l1aRowsB));
        }
    }, [l1aRowsB]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Save handlers — emit ke parent SETELAH row selesai diperbarui ──────────

    const handleSaveA = (idx, form) => {
        setRowsA(prev => {
            const next = prev.map((r, i) => i !== idx ? r : { ...r, ...form });
            if (onRowsAChange) {
                skipRestoreA.current = true; // cegah loop: perubahan ini dari child sendiri
                onRowsAChange(next);
            }
            return next;
        });
        setEditingA(null);
    };

    const handleSaveB = (idx, amount) => {
        setRowsB(prev => {
            const next = prev.map((r, i) => i !== idx ? r : { ...r, amount });
            if (onRowsBChange) {
                skipRestoreB.current = true;
                onRowsBChange(next);
            }
            return next;
        });
        setEditingB(null);
    };

    // ── Derived: nonFinal, fiscalAmt per row, subtotal chained (BR-3) ──────────
    // Pipeline:
    //   1. Hitung formula universal per row input.
    //   2. Hitung subtotal berdasarkan dependency graph blueprint.
    //   3. Subtotal juga mengikuti formula universal (col6 = col3−col4−col5, col10 = col6+col7−col8).
    //   4. Semua value kosong = 0 (tidak pernah NaN).

    const rowsAComputed = useMemo(() => {
        // Buat lookup input values (col3..col8) dari rowsA berdasarkan kode akun
        const v = {}; // v[code][col] → number
        rowsA.forEach(r => {
            if (!r.isInput || !r.code) return;
            const col3 = parse(r.commercial);
            const col4 = parse(r.nonTaxable);
            const col5 = parse(r.finalTax);
            const col6 = col3 - col4 - col5;
            const col7 = parse(r.posCorr);
            const col8 = parse(r.negCorr);
            const col10 = col6 + col7 - col8;
            v[r.code] = { col3, col4, col5, col6, col7, col8, col10 };
        });

        // Helper: get col value, default 0
        const g = (code, col) => v[code]?.[col] ?? 0;

        // Hitung subtotal per kolom (col = 'col3'|'col4'|'col5'|'col6'|'col7'|'col8'|'col10')
        // Formula berlaku identik untuk semua kolom
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
        // get from either input or subtotal
        const get = (code, col) => v[code]?.[col] ?? gs(code, col);

        // col(x)[4004] = col(x)[4002] + col(x)[4003]
        calcSubtotal('4004',
            () => g('4002','col3') + g('4003','col3'),
            () => g('4002','col4') + g('4003','col4'),
            () => g('4002','col5') + g('4003','col5'),
            () => g('4002','col7') + g('4003','col7'),
            () => g('4002','col8') + g('4003','col8'),
        );
        // col(x)[4020] = col(x)[4004] − col(x)[4011] − col(x)[4012] − col(x)[4013]
        calcSubtotal('4020',
            () => gs('4004','col3') - g('4011','col3') - g('4012','col3') - g('4013','col3'),
            () => gs('4004','col4') - g('4011','col4') - g('4012','col4') - g('4013','col4'),
            () => gs('4004','col5') - g('4011','col5') - g('4012','col5') - g('4013','col5'),
            () => gs('4004','col7') - g('4011','col7') - g('4012','col7') - g('4013','col7'),
            () => gs('4004','col8') - g('4011','col8') - g('4012','col8') - g('4013','col8'),
        );
        // col(x)[5020] = col(x)[5001]+col(x)[5003]+col(x)[5007]+col(x)[5008] − col(x)[5009]
        calcSubtotal('5020',
            () => g('5001','col3') + g('5003','col3') + g('5007','col3') + g('5008','col3') - g('5009','col3'),
            () => g('5001','col4') + g('5003','col4') + g('5007','col4') + g('5008','col4') - g('5009','col4'),
            () => g('5001','col5') + g('5003','col5') + g('5007','col5') + g('5008','col5') - g('5009','col5'),
            () => g('5001','col7') + g('5003','col7') + g('5007','col7') + g('5008','col7') - g('5009','col7'),
            () => g('5001','col8') + g('5003','col8') + g('5007','col8') + g('5008','col8') - g('5009','col8'),
        );
        // col(x)[4300] = col(x)[4020] − col(x)[5020]
        calcSubtotal('4300',
            () => gs('4020','col3') - gs('5020','col3'),
            () => gs('4020','col4') - gs('5020','col4'),
            () => gs('4020','col5') - gs('5020','col5'),
            () => gs('4020','col7') - gs('5020','col7'),
            () => gs('4020','col8') - gs('5020','col8'),
        );
        // col(x)[5400] = Σ 5311..5399
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
                    // Pertahankan field display untuk modal (tidak berubah)
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

    // ── A.10 = col(10)[4800] (BR-3) ──────────────────────────────────────────

    const a10 = useMemo(() => {
        const row4800 = rowsAComputed.find(r => r.code === '4800');
        return row4800?._fiscalAmt ?? 0;
    }, [rowsAComputed]);

    // ── Derived Part B: subtotal 1700, 2999, 3299, 3300 ──────────────────────

    const rowsBComputed = useMemo(() => {
        const vb = {};
        rowsB.forEach(r => {
            if (r.isInput && r.code) {
                const val = parse(r.amount);
                vb[r.code] = r.signMinus ? -val : val;
            }
        });
        const gb = (code) => vb[code] ?? 0;

        const ASET_CODES = [
            '1101','1122','1123','1124','1125','1131',
            '1181','1200','1401','1421','1423','1405','1422','1499',
            '1501','1520','1523','1524','1529','1530',
            '1531','1533','1534','1551','1599','1600','1601',
            '1611','1651','1658','1698',
        ];
        const LIAB_CODES = [
            '2102','2103','2111','2186','2187','2191','2192','2195',
            '2201','2202','2203','2228',
            '2301','2303','2304','2312','2322','2321','2998',
        ];
        const EKUITAS_CODES = ['3102','3120','3200','3297','3298'];

        const total1700 = ASET_CODES.reduce((s, c) => s + gb(c), 0);
        const total2999 = LIAB_CODES.reduce((s, c) => s + gb(c), 0);
        const total3299 = EKUITAS_CODES.reduce((s, c) => s + gb(c), 0);
        const total3300 = total2999 + total3299;

        const subtotalsB = { '1700': total1700, '2999': total2999, '3299': total3299, '3300': total3300 };

        return rowsB.map(r => {
            if (r.isSubtotal && r.code && subtotalsB[r.code] !== undefined) {
                return { ...r, amount: subtotalsB[r.code] };
            }
            return r;
        });
    }, [rowsB]);

    // Emit A.10 ke parent → SptTahunanBadan.a10Value → MainFormBadan D.4
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
            // untuk Income Tax Expense di L1A. Sengaja null (bukan 0) agar L11B bisa
            // membedakan "belum ada data" vs "nilai memang nol".
            incomeTaxExpense: null,
        };
    }, [rowsAComputed]);

    // Emit ke parent → SptTahunanBadan.ebitdaComponentsByLampiran.L1A → L11B Bagian I
    useEffect(() => {
        if (onEbitdaComponentsChange) onEbitdaComponentsChange(ebitdaComponents);
    }, [ebitdaComponents, onEbitdaComponentsChange]); // stabil via useCallback di parent

    // ── Table style helpers ───────────────────────────────────────────────────
    // thCls / tdCls / tdNum — kelas dasar (kolom biasa, dapat di-scroll)
    // thSticky* / tdSticky* — kelas + style untuk 3 kolom frozen kiri:
    //   Action (col 0), Account Code (col 1), Account Name (col 2).
    // Pola ini reusable untuk L1C dan L1D — cukup salin blok konstanta ini.

    const thCls = "px-3 py-2 text-left text-xs font-semibold text-gray-600 bg-gray-100 border-b border-gray-200 whitespace-nowrap";
    const tdCls = "px-3 py-2 text-xs text-gray-700 border-b border-gray-100";
    const tdNum = "px-3 py-2 text-xs text-right text-gray-700 border-b border-gray-100 font-mono";

    // Lebar kolom frozen — harus konsisten antara th dan td agar offset tepat.
    // Jika lebar diubah, sesuaikan nilai left pada kolom berikutnya.
    const COL_ACTION_W    = 48;   // px — kolom Action (hanya ikon)
    const COL_CODE_W      = 100;  // px — kolom Account Code
    // Account Name tidak perlu left offset sendiri karena dia yang terakhir.

    // Sticky th — header frozen (sticky top + sticky left)
    const thAction   = { position: 'sticky', left: 0,                            top: 0, zIndex: 4, backgroundColor: '#f3f4f6' };
    const thCode     = { position: 'sticky', left: COL_ACTION_W,                 top: 0, zIndex: 4, backgroundColor: '#f3f4f6' };
    const thName     = { position: 'sticky', left: COL_ACTION_W + COL_CODE_W,    top: 0, zIndex: 4, backgroundColor: '#f3f4f6' };
    // Sticky th — header biasa (hanya sticky top)
    const thTop      = { position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#f3f4f6' };

    // Sticky td — cell frozen (sticky left, background solid putih agar tidak tembus)
    const tdAction   = { position: 'sticky', left: 0,                            zIndex: 1, backgroundColor: '#ffffff' };
    const tdCode     = { position: 'sticky', left: COL_ACTION_W,                 zIndex: 1, backgroundColor: '#ffffff' };
    const tdName     = { position: 'sticky', left: COL_ACTION_W + COL_CODE_W,    zIndex: 1, backgroundColor: '#ffffff' };
    // Background untuk row header biru (isHeader) — frozen cell
    const tdActionHdr = { ...tdAction, backgroundColor: '#eff6ff' };
    const tdCodeHdr   = { ...tdCode,   backgroundColor: '#eff6ff' };
    const tdNameHdr   = { ...tdName,   backgroundColor: '#eff6ff' };
    // Background untuk row hover — diatur via CSS class; frozen cell perlu solid
    // (hover bg dilakukan via group-hover di tr, sticky td tetap solid agar tidak bocor)

    return (
        <div className="p-6 space-y-8">
            {/* ── HEADER ──────────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 1A — Financial statements (Umum)
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
                                    key={row.code}
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
                                                {/* pencil icon */}
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
                                    <td className={tdNum}>{row.isHeader ? '' : fmt(row.commercial)}</td>
                                    <td className={tdNum}>{row.isHeader ? '' : fmt(row.nonTaxable)}</td>
                                    <td className={tdNum}>{row.isHeader ? '' : fmt(row.finalTax)}</td>
                                    <td className={`${tdNum} ${row._nonFinal < 0 ? 'text-red-600' : ''}`}>
                                        {row.isHeader ? '' : fmt(row._nonFinal)}
                                    </td>
                                    <td className={tdNum}>{row.isHeader ? '' : fmt(row.posCorr)}</td>
                                    <td className={tdNum}>{row.isHeader ? '' : fmt(row.negCorr)}</td>
                                    <td className={tdCls}>
                                        {row.isHeader ? '' : (
                                            <span className="text-xs text-gray-500">{row.corrCode || '—'}</span>
                                        )}
                                    </td>
                                    <td className={`${tdNum} ${row._fiscalAmt < 0 ? 'text-red-600' : ''}`}>
                                        {row.isHeader ? '' : fmt(row._fiscalAmt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {/* A.10 — Σ Fiscal Amount seluruh row non-header, dihitung otomatis */}
                        <tfoot>
                            <tr className="bg-blue-700">
                                <td className="px-3 py-2" />
                                <td className="px-3 py-2 text-xs font-bold text-white font-mono">A.10</td>
                                <td className="px-3 py-2 text-xs font-bold text-white" colSpan={8}>
                                    Fiscal Net Income Before Tax Facility (Laba / Rugi Sebelum Pajak — Fiskal)
                                </td>
                                <td className={`px-3 py-2 text-xs font-bold text-right font-mono ${a10 < 0 ? 'text-red-300' : 'text-white'}`}>
                                    {a10 !== 0 ? fmt(a10) : '0'}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* ── SECTION B ───────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-blue-700">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                        Section B — Statement of Financial Position
                    </h3>
                </div>

                <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '500px' }}>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                {/* Section B — 4 kolom: sticky header saja, freeze 3 kolom kiri */}
                                <th className={thCls} style={{ ...thAction, minWidth: COL_ACTION_W }}>Action</th>
                                <th className={thCls} style={{ ...thCode,   minWidth: COL_CODE_W  }}>Account Code</th>
                                <th className={`${thCls} w-96`} style={thName}>Account Name</th>
                                <th className={`${thCls} text-right`} style={thTop}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsB.map((row, idx) => (
                                <tr
                                    key={row.code}
                                    className={
                                        row.isHeader
                                            ? 'bg-blue-50'
                                            : 'hover:bg-gray-50 transition-colors'
                                    }
                                >
                                    <td className={tdCls} style={row.isHeader ? tdActionHdr : tdAction}>
                                        {!row.isHeader && (
                                            <button
                                                onClick={() => setEditingB(idx)}
                                                title="Edit"
                                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                    <td className={`${tdCls} font-mono ${row.isHeader ? 'font-semibold text-blue-800' : ''}`} style={row.isHeader ? tdCodeHdr : tdCode}>
                                        {row.code}
                                    </td>
                                    <td className={`${tdCls} ${row.isHeader ? 'font-semibold text-blue-800' : ''}`} style={row.isHeader ? tdNameHdr : tdName}>
                                        {row.name}
                                    </td>
                                    <td className={tdNum}>{row.isHeader ? '' : fmt(row.amount)}</td>
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
            {editingB !== null && (
                <ModalEditB
                    row={rowsB[editingB]}
                    onClose={() => setEditingB(null)}
                    onSave={(amount) => handleSaveB(editingB, amount)}
                />
            )}
        </div>
    );
};

export default L1A;