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

// fmtRp: wrapper fmt dengan prefix "Rp" — untuk tampilan nilai di sel tabel dan
// summary. RpField internal tetap pakai fmt sendiri; tidak ada duplikasi.
const fmtRp = (v) => { const s = fmt(v); return s ? 'Rp' + s : ''; };

// fmtDate: konversi nilai date input (YYYY-MM-DD) ke format tampilan dd-MMM-yyyy.
// BUG #4/#5: satu helper dipakai di seluruh L3 agar konsisten antara tabel dan modal.
// Format data tersimpan (YYYY-MM-DD dari <input type="date">) tidak diubah.
const fmtDate = (v) => {
    if (!v) return '';
    const d = new Date(v + 'T00:00:00');
    if (isNaN(d.getTime())) return v;
    const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${String(d.getDate()).padStart(2,'0')}-${M[d.getMonth()]}-${d.getFullYear()}`;
};

const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

const ReadonlyField = ({ label, value, helper }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
        {helper && (
            <p className="mt-1 text-xs text-gray-400 flex items-start gap-1 leading-relaxed">
                <span className="shrink-0">ⓘ</span>
                <span>{helper}</span>
            </p>
        )}
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
            <div className="flex items-stretch border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
                <span className="inline-flex items-center px-3 border-r border-gray-300 text-gray-500 text-sm bg-gray-100 select-none whitespace-nowrap rounded-l-lg">Rp</span>
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2 text-sm text-left bg-white focus:outline-none min-w-0 rounded-r-lg"
                />
            </div>
        </div>
    );
};

const SelectField = ({ label, value, onChange, options, required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
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

const TextField = ({ label, value, onChange, placeholder = '', maxLength, required = false, digitsOnly = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <input
            type="text"
            inputMode={digitsOnly ? 'numeric' : 'text'}
            value={value}
            onChange={e => {
                const v = digitsOnly ? e.target.value.replace(/\D/g, '') : e.target.value;
                onChange(v);
            }}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
    </div>
);

// DateField — BARU, tidak ada presedan di L2 (L2 tidak punya kolom tanggal).
// Dibutuhkan untuk "Date of Transaction" (Part A) dan "Withholding Slip/SSP/SSPCP
// Date" (Part B) — keduanya field tanggal sederhana (Blueprint L3 Final).
const DateField = ({ label, value, onChange, required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <input
            type="date"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
    { value: '',    label: 'Please select' },
    { value: '01',  label: 'Penghasilan dari Usaha Jasa Konstruksi' },
    { value: '02',  label: 'Penghasilan dari kegiatan usaha' },
    { value: '03',  label: 'Penghasilan dari Premi Asuransi Termasuk Premi Reasuransi' },
    { value: '04',  label: 'Penghasilan kena pajak sesudah dikurangi PPh suatu BUT' },
    { value: '05',  label: 'Penghasilan lain-lain dari usaha' },
    { value: '06',  label: 'Sewa tanah dan atau bangunan' },
    { value: '07',  label: 'Sewa harta selain tanah dan atau bangunan' },
    { value: '08',  label: 'Dividen' },
    { value: '09',  label: 'Bunga' },
    { value: '10',  label: 'Obligasi' },
    { value: '11',  label: 'Royalti' },
    { value: '12',  label: 'Keuntungan Penjualan Harta' },
    { value: '13',  label: 'Bunga Deposito' },
    { value: '14',  label: 'Bunga Tabungan' },
    { value: '15',  label: 'Surat Berharga/Sekuritas' },
    { value: '16',  label: 'Penjualan Saham di Bursa' },
    { value: '17',  label: 'Pengalihan atau Penjualan Tanah/Bangunan' },
    { value: '18',  label: 'Penghasilan dari Bangun Guna Serah' },
    { value: '19',  label: 'Penghasilan lain-lain dari Modal atau Aset/Harta' },
    { value: '20',  label: 'Pembebasan Utang' },
    { value: '21',  label: 'Hibah' },
    { value: '22',  label: 'Bantuan/Sumbangan' },
    { value: '23',  label: 'Klaim Asuransi' },
    { value: '24',  label: 'Hadiah/Undian' },
    { value: '25',  label: 'Penghasilan lain' },
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

// Verified against Coretax DJP — urutan dan isi sesuai tampilan Coretax.
const TAX_TYPE_OPTIONS = [
    { value: '',             label: 'Please select' },
    { value: 'lb_bukan_lb',  label: 'Nilai LB dalam SPT yang dianggap bukan merupakan lebih bayar' },
    { value: 'pph_dtg',      label: 'PPh Ditanggung Pemerintah' },
    { value: 'pph_dtg_pln',  label: 'PPh Ditanggung Pemerintah (Proyek Bantuan Luar Negeri)' },
    { value: 'PPh15',        label: 'PPh Pasal 15' },
    { value: 'PPh22',        label: 'PPh Pasal 22' },
    { value: 'PPh23',        label: 'PPh Pasal 23' },
    { value: 'PPh26',        label: 'PPh Pasal 26' },
];

// fmtRpZero: seperti fmtRp tapi menampilkan "Rp0" alih-alih string kosong.
// Dipakai pada summary Bagian B agar selalu menampilkan nilai walaupun nol
// (BUG #6 — Summary B harus selalu tampil dengan nilai default Rp0).
const fmtRpZero = (v) => fmtRp(v) || 'Rp0';

// getTaxTypeLabel: resolve value internal (key) ke display label sesuai TAX_TYPE_OPTIONS.
// BUG #3 — tabel menampilkan label yang user pilih, bukan value internal.
const getTaxTypeLabel = (value) => {
    const opt = TAX_TYPE_OPTIONS.find(o => o.value === value);
    return opt ? opt.label : (value || '');
};

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>

                <div className="px-6 py-5 space-y-4 overflow-y-auto">
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
                    <RpField label="Tax Payable/Paid in Overseas" value={form.taxPayableOverseasRp} onChange={set('taxPayableOverseasRp')} required />

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <SelectField label="Currency" value={form.currency} onChange={set('currency')} options={CURRENCY_OPTIONS} required />
                            {errors.currency && <p className="text-xs text-red-500 mt-1">{errors.currency}</p>}
                        </div>
                        <TextField label="Amount in Foreign Currency" value={form.foreignCurrencyAmount} onChange={set('foreignCurrencyAmount')} placeholder="Optional" />
                    </div>

                    <RpField label="Tax Credit That Can be Calculated" value={form.taxCreditCalculatedRp} onChange={set('taxCreditCalculatedRp')} required />
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>

                <div className="px-6 py-5 space-y-4 overflow-y-auto">
                    <div>
                        <TextField label="Name" value={form.name} onChange={set('name')} required />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <TextField label="TIN" value={form.tin} onChange={set('tin')} maxLength={50} required digitsOnly />
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

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
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

    // ── Style helpers — mengikuti standar visual L13A.js
    // Header: bg-yellow-400 text-gray-800, cell border border-white border-b-gray-300
    // Data: border border-gray-200, hover:bg-gray-50
    const thCls = "px-3 py-2 text-center text-xs font-semibold text-gray-800 bg-yellow-400 border border-white border-b-gray-300 whitespace-nowrap uppercase";
    const tdCls = "px-3 py-2 text-xs text-gray-700 border border-gray-200 whitespace-nowrap";
    const tdNum = "px-3 py-2 text-xs text-right text-gray-700 border border-gray-200 whitespace-nowrap font-mono";

    const COL_ACTION_W = 64;
    const COL_NAME_W   = 160;

    // thAction/thName: sticky top saja (untuk header row), tanpa left/zIndex kolom
    // tdAction/tdName: tidak ada sticky sama sekali — seluruh kolom scroll bersama
    // Sticky Header tetap aktif via thTop (top: 0). Sticky Column dinonaktifkan.
    const thAction = { position: 'sticky', top: 0, zIndex: 20, backgroundColor: '#fde047' };
    const thName   = { position: 'sticky', top: 0, zIndex: 20, backgroundColor: '#fde047' };
    const thTop    = { position: 'sticky', top: 0, zIndex: 20, backgroundColor: '#fde047' };

    const tdAction = {};
    const tdName   = {};

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
            {/* Blueprint: +Add di LUAR dan di ATAS panel, sebelah kiri */}
            <div className="space-y-2">
                <div>
                    <button
                        onClick={() => setModalA({ mode: 'create' })}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                    >
                        + Add
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    {/* Panel header — title only, tanpa button */}
                    <div className="px-5 py-3 bg-blue-900">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                            A. Income from Overseas
                        </h3>
                    </div>

                    <div className="border-b border-gray-200 overflow-x-auto overflow-y-auto max-h-[520px]">
                        <table className="w-full text-sm border-collapse min-w-[1400px]">
                            {/* ── 2-LEVEL THEAD ────────────────────────────────────────── */}
                            {/* Kolom: 1=Action, 2=Name, 3=Country, 4=Date, 5=IncomeCode,
                                 6=NetIncome, 7=TaxPayable, 8=Currency, 9=AmountForeign,
                                 10=TaxCredit — total 10 kolom */}
                            <thead>
                                {/* Row 1 — parent headers */}
                                <tr>
                                    {/* col 1 — Action: rowSpan=2, sticky kiri */}
                                    <th rowSpan={2} className={thCls}
                                        style={{ ...thAction, minWidth: COL_ACTION_W, verticalAlign: 'middle' }}>
                                        Action
                                    </th>
                                    {/* col 2-3 — Income Tax Withholder group */}
                                    <th colSpan={2} className={thCls}
                                        style={thTop}>
                                        Income Tax Withholder
                                    </th>
                                    {/* col 4 — Date of Transaction: rowSpan=2 */}
                                    <th rowSpan={2} className={thCls}
                                        style={{ ...thTop, verticalAlign: 'middle' }}>
                                        Date of Transaction
                                    </th>
                                    {/* col 5 — Income Code: rowSpan=2 */}
                                    <th rowSpan={2} className={thCls}
                                        style={{ ...thTop, verticalAlign: 'middle' }}>
                                        Income Code
                                    </th>
                                    {/* col 6 — Net Income: rowSpan=2 */}
                                    <th rowSpan={2} className={thCls}
                                        style={{ ...thTop, verticalAlign: 'middle' }}>
                                        Net Income
                                    </th>
                                    {/* col 7-9 — Tax Payable/Paid in Overseas group */}
                                    <th colSpan={3} className={thCls} style={thTop}>
                                        Tax Payable/Paid in Overseas
                                    </th>
                                    {/* col 10 — Tax Credit Calculated: rowSpan=2 */}
                                    <th rowSpan={2} className={thCls}
                                        style={{ ...thTop, verticalAlign: 'middle' }}>
                                        Tax Credit Calculated
                                    </th>
                                </tr>
                                {/* Row 2 — child headers (5 cells; cols 1,4,5,6,10 di-span oleh rowSpan=2) */}
                                <tr>
                                    {/* col 2 — Name: sticky kiri */}
                                    <th className={thCls}
                                        style={{ ...thTop, top: 36 }}>
                                        Name
                                    </th>
                                    {/* col 3 — Country Code */}
                                    <th className={thCls} style={{ ...thTop, top: 36 }}>Country Code</th>
                                    {/* col 7 — Tax Payable/Paid Overseas */}
                                    <th className={thCls} style={{ ...thTop, top: 36 }}>Tax Payable/Paid Overseas (Rp)</th>
                                    {/* col 8 — Currency */}
                                    <th className={thCls} style={{ ...thTop, top: 36 }}>Currency</th>
                                    {/* col 9 — Amount in Foreign Currency */}
                                    <th className={thCls} style={{ ...thTop, top: 36 }}>Foreign Amount</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rowsA.length === 0 && (
                                    <tr><td colSpan={10} className="px-3 py-8 text-center text-sm text-gray-400 border border-gray-200">No data to display.</td></tr>
                                )}
                                {rowsA.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className={tdCls} style={tdAction}>
                                            <div className="flex gap-1">
                                                <button onClick={() => setModalA({ mode: 'edit', row })} title="Edit" className="text-blue-600 hover:text-blue-800">
                                                    <EditIcon />
                                                </button>
                                                <button onClick={() => handleDeleteA(row.id)} title="Delete" className="text-red-500 hover:text-red-700">
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                        <td className={tdCls} style={tdName}>{row.name}</td>
                                        <td className={tdCls}>{row.countryCode}</td>
                                        <td className={tdCls}>{fmtDate(row.transactionDate)}</td>
                                        <td className={tdCls}>{row.incomeCode}</td>
                                        <td className={tdNum}>{fmtRp(row.netIncomeRp)}</td>
                                        <td className={tdNum}>{fmtRp(row.taxPayableOverseasRp)}</td>
                                        <td className={tdCls}>{row.currency}</td>
                                        <td className={tdNum}>{row.foreignCurrencyAmount}</td>
                                        <td className={tdNum}>{fmtRp(row.taxCreditCalculatedRp)}</td>
                                    </tr>
                                ))}
                            </tbody>

                            {/* ── TFOOT: TOTAL + 3 summary rows menyatu dalam tabel ────── */}
                            {/* Blueprint: summary bukan card baru, melainkan lanjutan tabel.
                                 Kolom: 6+3+1=10.
                                 - col 1-6 kosong (label mulai di posisi grup Tax Payable, col 7)
                                 - col 7-9: label summary (sejajar grup Tax Payable/Paid in Overseas)
                                 - col 10: nilai (kolom Tax Credit Calculated) */}
                            <tfoot>
                                {/* TOTAL row */}
                                <tr className="bg-gray-100">
                                    <td className="px-3 py-2 text-xs font-bold text-gray-700 border border-gray-200" colSpan={5}>
                                        TOTAL
                                    </td>
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-gray-800 border border-gray-200">
                                        {fmtRp(rowsA.reduce((s, r) => s + parse(r.netIncomeRp), 0))}
                                    </td>
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-gray-800 border border-gray-200">
                                        {fmtRp(rowsA.reduce((s, r) => s + parse(r.taxPayableOverseasRp), 0))}
                                    </td>
                                    <td colSpan={2} className="border border-gray-200" />
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-gray-800 border border-gray-200">
                                        {fmtRp(summary.partA.a)}
                                    </td>
                                </tr>

                                {/* Summary row a — Total Tax Credit That Can Be Calculated (READONLY, helper di luar tabel) */}
                                <tr className="bg-white">
                                    <td colSpan={6} className="border border-gray-200" />
                                    <td colSpan={3} className="px-3 py-1 text-xs font-medium text-gray-600 text-right border border-gray-200">
                                        a. Total Tax Credit That Can Be Calculated
                                    </td>
                                    <td className="px-3 py-1 border border-gray-200">
                                        <div className="w-full px-2 py-1 bg-gray-100 border border-gray-200 rounded text-sm text-right font-mono text-gray-700">
                                            {fmtRp(summary.partA.a) || <span className="text-gray-400">—</span>}
                                        </div>
                                    </td>
                                </tr>

                                {/* Summary row b — Prior Year Foreign Tax Credit Adjustment (EDITABLE, tanpa helper) */}
                                <tr className="bg-white">
                                    <td colSpan={6} className="border border-gray-200" />
                                    <td colSpan={3} className="px-3 py-1 text-xs font-medium text-gray-600 text-right border border-gray-200">
                                        b. Prior Year Foreign Tax Credit Adjustment (Article 24)
                                    </td>
                                    <td className="px-3 py-1 border border-gray-200">
                                        <div className="flex items-stretch border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
                                            <span className="inline-flex items-center px-3 border-r border-gray-300 text-gray-500 text-sm bg-gray-100 select-none whitespace-nowrap rounded-l-lg">Rp</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={creditRefund
                                                    ? Number(String(creditRefund).replace(/\D/g, '') || 0).toLocaleString('id-ID')
                                                    : ''}
                                                onChange={e => handleCreditRefundChange(e.target.value.replace(/\D/g, ''))}
                                                placeholder="0"
                                                className="flex-1 px-3 py-1 text-sm text-right bg-white focus:outline-none min-w-0 font-mono rounded-r-lg"
                                            />
                                        </div>
                                    </td>
                                </tr>

                                {/* Summary row c — Foreign Tax Credit Eligible for Current Year (READONLY, helper di luar tabel) */}
                                <tr className="bg-white">
                                    <td colSpan={6} className="border border-gray-200" />
                                    <td colSpan={3} className="px-3 py-1 text-xs font-medium text-gray-600 text-right border border-gray-200">
                                        c. Foreign Tax Credit Eligible for Current Year
                                    </td>
                                    <td className="px-3 py-1 border border-gray-200">
                                        <div className="w-full px-2 py-1 bg-gray-100 border border-gray-200 rounded text-sm text-right font-mono text-gray-700">
                                            {fmtRp(summary.partA.c) || <span className="text-gray-400">—</span>}
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Calculation Notes Part A — di luar tabel, di dalam panel */}
                    <div className="px-5 py-3 border-t border-gray-100 space-y-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1.5">Calculation Notes</p>
                        <p className="text-xs text-gray-400 flex items-start gap-1.5">
                            <span className="shrink-0 mt-px">ⓘ</span>
                            <span><span className="font-medium text-gray-500">Total Tax Credit That Can Be Calculated</span> = Sum of all &ldquo;Tax Credit That Can Be Calculated&rdquo; values.</span>
                        </p>
                        <p className="text-xs text-gray-400 flex items-start gap-1.5">
                            <span className="shrink-0 mt-px">ⓘ</span>
                            <span><span className="font-medium text-gray-500">Foreign Tax Credit Eligible for Current Year</span> = Total Tax Credit That Can Be Calculated − Prior Year Foreign Tax Credit Adjustment.</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ── PART B ──────────────────────────────────────────────────── */}
            {/* +Add di LUAR dan di ATAS panel, sebelah kiri — identik pola Part A */}
            <div className="space-y-2">
                <div>
                    <button
                        onClick={() => setModalB({ mode: 'create' })}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                    >
                        + Add
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    {/* Panel header — title only */}
                    <div className="px-5 py-3 bg-blue-900">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                            B. PPh Withheld/Collected by Other Party
                        </h3>
                    </div>

                    <div className="border-b border-gray-200 overflow-x-auto overflow-y-auto max-h-[520px]">
                        <table className="w-full text-sm border-collapse min-w-[1300px]">
                            {/* ── 2-LEVEL THEAD ────────────────────────────────────────── */}
                            {/* Kolom: 1=Action, 2=Name, 3=TIN, 4=TaxType, 5=TaxBase,
                                 6=IncomeWithheld, 7=SlipNumber, 8=SlipDate — total 8 kolom */}
                            <thead>
                                {/* Row 1 — parent headers */}
                                <tr>
                                    {/* col 1 — Action: rowSpan=2, sticky kiri */}
                                    <th rowSpan={2} className={thCls}
                                        style={{ ...thAction, minWidth: COL_ACTION_W, verticalAlign: 'middle' }}>
                                        Action
                                    </th>
                                    {/* col 2-3 — Income Tax Withholder group */}
                                    <th colSpan={2} className={thCls}
                                        style={thTop}>
                                        Income Tax Withholder
                                    </th>
                                    {/* col 4 — Tax Type: rowSpan=2 */}
                                    <th rowSpan={2} className={thCls}
                                        style={{ ...thTop, verticalAlign: 'middle' }}>
                                        Tax Type
                                    </th>
                                    {/* col 5 — Tax Base: rowSpan=2 */}
                                    <th rowSpan={2} className={thCls}
                                        style={{ ...thTop, verticalAlign: 'middle' }}>
                                        Tax Base
                                    </th>
                                    {/* col 6 — Income Tax Withheld: rowSpan=2 */}
                                    <th rowSpan={2} className={thCls}
                                        style={{ ...thTop, verticalAlign: 'middle' }}>
                                        Income Tax Withheld
                                    </th>
                                    {/* col 7-8 — Withholding Slip group */}
                                    <th colSpan={2} className={thCls} style={thTop}>
                                        Withholding Slip
                                    </th>
                                </tr>
                                {/* Row 2 — child headers (4 cells; cols 1,4,5,6 di-span rowSpan=2) */}
                                <tr>
                                    {/* col 2 — Name: sticky kiri */}
                                    <th className={thCls}
                                        style={{ ...thTop, top: 36 }}>
                                        Name
                                    </th>
                                    {/* col 3 — TIN */}
                                    <th className={thCls} style={{ ...thTop, top: 36 }}>TIN</th>
                                    {/* col 7 — Slip Number */}
                                    <th className={thCls} style={{ ...thTop, top: 36 }}>Number</th>
                                    {/* col 8 — Slip Date */}
                                    <th className={thCls} style={{ ...thTop, top: 36 }}>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rowsB.length === 0 && (
                                    <tr><td colSpan={8} className="px-3 py-8 text-center text-sm text-gray-400 border border-gray-200">No data found.</td></tr>
                                )}
                                {rowsB.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className={tdCls} style={tdAction}>
                                            <div className="flex gap-1">
                                                <button onClick={() => setModalB({ mode: 'edit', row })} title="Edit" className="text-blue-600 hover:text-blue-800">
                                                    <EditIcon />
                                                </button>
                                                <button onClick={() => handleDeleteB(row.id)} title="Delete" className="text-red-500 hover:text-red-700">
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                        <td className={tdCls} style={tdName}>{row.name}</td>
                                        <td className={tdCls}>{row.tin}</td>
                                        <td className={tdCls}>{getTaxTypeLabel(row.taxType)}</td>
                                        <td className={tdNum}>{fmtRp(row.taxBaseRp)}</td>
                                        <td className={tdNum}>{fmtRp(row.taxWithheldRp)}</td>
                                        <td className={tdCls}>{row.slipNumber}</td>
                                        <td className={tdCls}>{fmtDate(row.slipDate)}</td>
                                    </tr>
                                ))}
                            </tbody>

                            {/* ── TFOOT: TOTAL + 3 summary rows menyatu dalam tabel ────── */}
                            {/* Blueprint: summary lanjutan tabel bukan card terpisah.
                                 Kolom: 5+1+2=8.
                                 - col 1-5: label (right-aligned) — dimulai area Tax Type+Tax Base
                                 - col 6: nilai (sejajar Income Tax Withheld)
                                 - col 7-8: kosong */}
                            <tfoot>
                                {/* TOTAL row — Tax Base (col 5) + Income Tax Withheld (col 6) */}
                                <tr className="bg-gray-100">
                                    <td className="px-3 py-2 text-xs font-bold text-gray-700 border border-gray-200" colSpan={4}>
                                        TOTAL
                                    </td>
                                    {/* col 5 — Tax Base total */}
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-gray-800 border border-gray-200">
                                        {fmtRp(rowsB.reduce((s, r) => s + parse(r.taxBaseRp), 0))}
                                    </td>
                                    {/* col 6 — Income Tax Withheld total */}
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-gray-800 border border-gray-200">
                                        {fmtRp(summary.partB.a)}
                                    </td>
                                    <td colSpan={2} className="border border-gray-200" />
                                </tr>

                                {/* Summary row a — Total Income Tax Withheld (helper di luar tabel) */}
                                <tr className="bg-white">
                                    <td colSpan={5} className="px-3 py-1 text-xs font-medium text-gray-600 text-right border border-gray-200">
                                        a. Total Income Tax Withheld
                                    </td>
                                    <td className="px-3 py-1 border border-gray-200">
                                        <div className="w-full px-2 py-1 bg-gray-100 border border-gray-200 rounded text-sm text-right font-mono text-gray-700">
                                            {fmtRpZero(summary.partB.a)}
                                        </div>
                                    </td>
                                    <td colSpan={2} className="border border-gray-200" />
                                </tr>

                                {/* Summary row b — Foreign Tax Credit (helper di luar tabel) */}
                                <tr className="bg-white">
                                    <td colSpan={5} className="px-3 py-1 text-xs font-medium text-gray-600 text-right border border-gray-200">
                                        b. Foreign Tax Credit (From Part A – Foreign Tax Credit Eligible for Current Year)
                                    </td>
                                    <td className="px-3 py-1 border border-gray-200">
                                        <div className="w-full px-2 py-1 bg-gray-100 border border-gray-200 rounded text-sm text-right font-mono text-gray-700">
                                            {fmtRpZero(summary.partB.b)}
                                        </div>
                                    </td>
                                    <td colSpan={2} className="border border-gray-200" />
                                </tr>

                                {/* Summary row c — Total Income Tax Credit → Main Form E.13 (helper di luar tabel) */}
                                <tr className="bg-white">
                                    <td colSpan={5} className="px-3 py-1 text-xs font-medium text-gray-600 text-right border border-gray-200">
                                        c. Total Income Tax Credit
                                    </td>
                                    <td className="px-3 py-1 border border-gray-200">
                                        <div className="w-full px-2 py-1 bg-gray-100 border border-gray-200 rounded text-sm text-right font-mono text-gray-700">
                                            {fmtRpZero(summary.partB.c)}
                                        </div>
                                    </td>
                                    <td colSpan={2} className="border border-gray-200" />
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Calculation Notes Part B + Mapping Info — di luar tabel, di dalam panel */}
                    <div className="px-5 py-3 border-t border-gray-100 space-y-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1.5">Calculation Notes</p>
                        <p className="text-xs text-gray-400 flex items-start gap-1.5">
                            <span className="shrink-0 mt-px">ⓘ</span>
                            <span><span className="font-medium text-gray-500">Total Income Tax Withheld</span> = Sum of all &ldquo;Income Tax Withheld&rdquo; values.</span>
                        </p>
                        <p className="text-xs text-gray-400 flex items-start gap-1.5">
                            <span className="shrink-0 mt-px">ⓘ</span>
                            <span><span className="font-medium text-gray-500">Foreign Tax Credit</span> = Retrieved from Part A – Foreign Tax Credit Eligible for Current Year.</span>
                        </p>
                        <p className="text-xs text-gray-400 flex items-start gap-1.5">
                            <span className="shrink-0 mt-px">ⓘ</span>
                            <span><span className="font-medium text-gray-500">Total Income Tax Credit</span> = Total Income Tax Withheld − Foreign Tax Credit.</span>
                        </p>
                        <p className="mt-2 text-xs text-blue-500 flex items-center gap-1.5">
                            <span className="shrink-0">ⓘ</span>
                            <span>Automatically mapped to Main Form → Section E → Point 13.</span>
                        </p>
                    </div>
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