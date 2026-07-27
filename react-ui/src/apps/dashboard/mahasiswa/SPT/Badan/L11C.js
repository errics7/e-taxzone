import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Add, Edit, Delete, CalendarToday, Close } from '@mui/icons-material';

// ═══════════════════════════════════════════════════════════════════════════
// LAMPIRAN 11-C — Foreign Private Debt Report
// Sumber: Blueprint & Contract L11C (FINAL, disetujui) + Screenshot Coretax
// (list "LAPORAN UTANG SWASTA LUAR NEGERI" + modal "ADD LAPORAN UTANG SWASTA
// LUAR NEGERI").
//
// STATUS: STANDALONE. Belum diintegrasikan ke MainFormBadan.js / SPTTahunanBadan.js
// (menunggu versi terbaru kedua file tersebut). Props initialData/onChange sudah
// disiapkan sesuai Parent–Child Contract (Blueprint §10) agar integrasi nanti
// tinggal wiring tanpa re-design, TAPI belum dipanggil oleh siapa pun.
//
// CATATAN L13A.js (DITERIMA): DateField di bawah kini mengikuti pola L13A.js
// PERSIS — <input type="date"> tetap dirender (bukan disembunyikan total),
// icon kalender bawaan browser disembunyikan via CSS scoped class, lalu
// tombol biru (CalendarToday) memicu showPicker() dan tombol merah (Close)
// mengosongkan tanggal. SATU perbedaan yang SENGAJA dipertahankan: prop
// `minDate` (Blueprint L11C §3.6 — Tanggal Jatuh Tempo Pinjaman tidak boleh
// sebelum Tanggal Mulai Pinjaman) diteruskan sebagai atribut native `min=`
// pada input — L13A.js sendiri tidak punya kebutuhan minDate ini, jadi field
// itu tidak ada di L13A, tapi ditambahkan di sini karena itu Business Rule
// L11C yang tidak boleh dihapus/diubah, bukan bagian dari "pola tampilan".
//
// KETIDAKCOCOKAN YANG PERLU DIKETAHUI: karena input date kini native (bukan
// tombol teks kustom), tampilan DI DALAM MODAL akan mengikuti format tanggal
// bawaan browser (biasanya yyyy-mm-dd atau format lokal browser), BUKAN
// dd-MMM-yyyy — sama seperti L13A.js sendiri (dicek: L13A.js juga tidak
// memformat ulang tampilan input menjadi dd-MMM-yyyy). Format dd-MMM-yyyy
// ("17-Jul-2026") HANYA diterapkan di TABEL (kolom Tanggal Mulai/Tanggal
// Jatuh Tempo, lihat formatDateDisplay) karena L13A.js juga tidak punya
// formatter tabel semacam itu untuk direuse — formatDateDisplay tetap
// dipertahankan sebagai satu-satunya formatter tampilan tanggal khusus tabel.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Helpers (pola identik L11B — tidak ada shared util module di project ini) ─

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};

const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

let _uid = 0;
const genId = (prefix) => `${prefix}-${Date.now()}-${_uid++}`;

// formatDateDisplay — SATU-SATUNYA formatter tampilan tanggal di file ini,
// dipakai baik oleh DateField (modal) maupun tabel. Label bulan diselaraskan
// dengan TABLE_DATE_MONTH_ABBR di L13A.js (BASE TABLE UI — "gunakan formatter
// yang sama, jangan buat formatter baru"). Input tetap string ISO
// 'yyyy-mm-dd' (Data Shape TIDAK berubah) — hanya representasi visualnya
// yang diubah menjadi dd-MMM-yyyy, mis. "2026-07-17" → "17-Jul-2026".
const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formatDateDisplay = (isoStr) => {
    if (!isoStr) return '';
    const parts = String(isoStr).split('-');
    if (parts.length !== 3) return '';
    const [y, m, d] = parts.map(Number);
    if (!y || !m || !d) return '';
    return `${String(d).padStart(2, '0')}-${MONTHS_ID[m - 1]}-${y}`;
};

// ─── Master data simulasi (Blueprint §2 — belum ada master Country/Currency
// resmi di project; gunakan daftar simulasi yang masuk akal untuk Coretax) ───

const COUNTRY_OPTIONS = [
    'Amerika Serikat', 'Singapura', 'Jepang', 'Tiongkok', 'Hong Kong',
    'Inggris Raya', 'Belanda', 'Jerman', 'Australia', 'Korea Selatan',
    'Malaysia', 'Swiss', 'Uni Emirat Arab', 'British Virgin Islands', 'Lainnya',
];

const CURRENCY_OPTIONS = [
    'USD', 'EUR', 'JPY', 'SGD', 'GBP', 'AUD', 'CNY', 'HKD', 'KRW', 'CHF',
];

// ─── Draft Compatibility Contract (Blueprint L11C §8/§9) ──────────────────────
// Object root memakai key `foreignDebtRows` (bukan `rows` generik) agar
// scalable untuk sibling key lain di kemudian hari (summary/validation/
// metadata/setting — BELUM diimplementasikan, hanya reserved oleh shape ini).

export const buildInitialL11CData = () => ({
    foreignDebtRows: [],
});

export const mergeWithInitial = (draft) => ({
    ...buildInitialL11CData(),
    foreignDebtRows: Array.isArray(draft?.foreignDebtRows) ? draft.foreignDebtRows : [],
});

// ─── CollapsibleSection — REUSE 100% dari pola L11B/L9 ────────────────────────

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

const TextField = ({ label, value, onChange, placeholder = '', required = false, error = '' }) => (
    <div>
        {label && (
            <label className="block text-xs font-medium text-gray-700 mb-1">
                {label}{required && <span className="text-red-500"> *</span>}
            </label>
        )}
        <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : 'border-gray-300'}`}
        />
        {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
);

const SelectField = ({ label, value, onChange, options, required = false, error = '' }) => (
    <div>
        {label && (
            <label className="block text-xs font-medium text-gray-700 mb-1">
                {label}{required && <span className="text-red-500"> *</span>}
            </label>
        )}
        <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : 'border-gray-300'}`}
        >
            <option value="">Silakan Pilih</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
);

const NumberField = ({ label, value, onChange, placeholder = '', suffix = '' }) => (
    <div>
        {label && <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>}
        <div className="flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
            <input
                type="text"
                inputMode="decimal"
                value={value || ''}
                onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ''))}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 text-sm text-left bg-white focus:outline-none min-w-0"
            />
            {suffix && <span className="px-2 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-l border-gray-200 select-none">{suffix}</span>}
        </div>
    </div>
);

// RpField — RATA KIRI (bukan rata kanan seperti L11B), sesuai instruksi khusus
// L11C: "Seluruh field Rupiah dibuat rata kiri, posisi angka lebih dekat
// dengan prefix Rp." Formatter (fmt/parse) tetap sama dengan L11B.
const RpField = ({ label, value, onChange, placeholder = '0', required = false, error = '' }) => {
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
            {label && (
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    {label}{required && <span className="text-red-500"> *</span>}
                </label>
            )}
            <div className={`flex items-center border rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden ${error ? 'border-red-400' : 'border-gray-300'}`}>
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
            {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
        </div>
    );
};

// Pokok Utang Akhir Tahun — readonly + derived, real-time (Blueprint §3.1).
// Rata kiri (mengikuti aturan Field Rupiah), boleh negatif, tanpa clamp.
const RpFieldReadonly = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center border border-gray-200 rounded bg-gray-100 overflow-hidden">
            <span className="px-2 py-2 text-xs font-medium text-gray-500 bg-gray-200 border-r border-gray-300 select-none whitespace-nowrap">Rp</span>
            <div className="flex-1 px-3 py-2 text-sm text-left text-gray-700 min-w-0">
                {value < 0 ? `-${fmt(Math.abs(value)) || '0'}` : (fmt(value) || '0')}
            </div>
        </div>
        <p className="mt-1 text-[11px] text-gray-400">
            * Pokok Utang Akhir Tahun = Pokok Utang Awal Tahun + Penambahan Pokok Utang − Pengurangan Pokok Utang
        </p>
    </div>
);

// DateField — pola PERSIS L13A.js (Source of Truth Date Picker, lihat catatan
// di atas). <input type="date"> tetap dirender (bukan disembunyikan total),
// icon kalender bawaan browser disembunyikan via CSS scoped class
// `l11c-date-input`, tombol biru (CalendarToday) memicu showPicker(), tombol
// merah (Close) mengosongkan tanggal. Satu-satunya penambahan di atas pola
// L13A: prop `minDate` → atribut native `min=` (Business Rule §3.6, TIDAK
// diubah). Internal Data Representation tetap ISO date string.
const DateField = ({ label, value, onChange, minDate }) => {
    const inputRef = useRef(null);
    const openPicker = () => {
        if (inputRef.current?.showPicker) {
            try { inputRef.current.showPicker(); } catch (e) { inputRef.current.focus(); }
        } else {
            inputRef.current?.focus();
        }
    };
    return (
        <div>
            {label && <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>}
            <div className="flex items-stretch gap-1.5">
                <input
                    ref={inputRef}
                    type="date"
                    value={value || ''}
                    min={minDate || undefined}
                    onChange={(e) => onChange(e.target.value)}
                    className="l11c-date-input flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={openPicker} title="Open Calendar"
                    className="w-9 flex items-center justify-center rounded-lg bg-blue-900 hover:bg-blue-800 text-white flex-shrink-0">
                    <CalendarToday style={{ fontSize: 16 }} />
                </button>
                <button type="button" onClick={() => onChange('')} title="Clear Date"
                    className="w-9 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white flex-shrink-0">
                    <Close style={{ fontSize: 16 }} />
                </button>
            </div>
        </div>
    );
};

// Style global untuk menyembunyikan icon kalender bawaan browser pada
// <input type="date"> — pola identik L13A.js (DATE_INPUT_HIDE_NATIVE_ICON_CSS),
// hanya scoped class-nya diganti agar tidak bentrok dengan L13A ("l13a-date-input").
const DATE_INPUT_HIDE_NATIVE_ICON_CSS = `
.l11c-date-input::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }
.l11c-date-input::-webkit-inner-spin-button { display: none; }
`;

// ─── Modal Add/Edit — Foreign Private Debt Report ────────────────────────

const ModalEditForeignDebt = ({ row, onClose, onSave }) => {
    const [form, setForm] = useState({
        namaPemberiPinjaman:       row?.namaPemberiPinjaman       || '',
        alamatPemberiPinjaman:     row?.alamatPemberiPinjaman     || '',
        negaraYurisdiksi:          row?.negaraYurisdiksi          || '',
        mataUang:                  row?.mataUang                  || '',
        kursAkhirTahun:            row?.kursAkhirTahun            || '',
        pokokUtangAwalTahun:       row?.pokokUtangAwalTahun       || '',
        penambahanPokokUtang:      row?.penambahanPokokUtang      || '',
        penguranganPokokUtang:     row?.penguranganPokokUtang     || '',
        tanggalMulaiPinjaman:      row?.tanggalMulaiPinjaman      || '',
        tanggalJatuhTempoPinjaman: row?.tanggalJatuhTempoPinjaman || '',
        tingkatSukuBunga:          row?.tingkatSukuBunga          || '',
        jumlahBunga:               row?.jumlahBunga               || '',
        biayaTerkaitPerolehan:     row?.biayaTerkaitPerolehan     || '',
        peruntukanPinjaman:        row?.peruntukanPinjaman        || '',
    });
    const [errors, setErrors] = useState({});

    const setField = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    // Blueprint §3.3 — ganti Mata Uang mereset Kurs Akhir Tahun.
    const handleMataUangChange = (val) => {
        setForm(prev => ({ ...prev, mataUang: val, kursAkhirTahun: '' }));
    };

    // Blueprint §3.1 — real-time recalculation, derived expression langsung
    // dari state form (bukan state terpisah, bukan onBlur/submit).
    const akhirTahun = useMemo(
        () => parse(form.pokokUtangAwalTahun) + parse(form.penambahanPokokUtang) - parse(form.penguranganPokokUtang),
        [form.pokokUtangAwalTahun, form.penambahanPokokUtang, form.penguranganPokokUtang]
    );

    const validate = () => {
        const next = {};
        if (!form.namaPemberiPinjaman.trim()) next.namaPemberiPinjaman = 'Required';
        if (!form.mataUang) next.mataUang = 'Please select';
        if (!String(form.pokokUtangAwalTahun).trim()) next.pokokUtangAwalTahun = 'Required';
        if (!String(form.penambahanPokokUtang).trim()) next.penambahanPokokUtang = 'Required';
        if (!String(form.penguranganPokokUtang).trim()) next.penguranganPokokUtang = 'Required';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onSave(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <style>{DATE_INPUT_HIDE_NATIVE_ICON_CSS}</style>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">
                        {row ? 'Edit' : 'Add'} Foreign Private Debt Report
                    </p>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
                </div>
                <div className="p-5 space-y-4 overflow-y-auto">
                    <TextField
                        label="Lender Name" required
                        value={form.namaPemberiPinjaman} onChange={setField('namaPemberiPinjaman')}
                        error={errors.namaPemberiPinjaman}
                    />
                    <TextField
                        label="Lender Address"
                        value={form.alamatPemberiPinjaman} onChange={setField('alamatPemberiPinjaman')}
                    />
                    <SelectField
                        label="Lender Country/Jurisdiction"
                        value={form.negaraYurisdiksi} onChange={setField('negaraYurisdiksi')}
                        options={COUNTRY_OPTIONS}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <SelectField
                            label="Currency" required
                            value={form.mataUang} onChange={handleMataUangChange}
                            options={CURRENCY_OPTIONS}
                            error={errors.mataUang}
                        />
                        <NumberField
                            label="Year-End Exchange Rate"
                            value={form.kursAkhirTahun} onChange={setField('kursAkhirTahun')}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <RpField
                            label="Principal Debt (Rp.) at Beginning of Year" required
                            value={form.pokokUtangAwalTahun} onChange={setField('pokokUtangAwalTahun')}
                            error={errors.pokokUtangAwalTahun}
                        />
                        <div />
                        <RpField
                            label="Addition to Principal Debt (Rp.)" required
                            value={form.penambahanPokokUtang} onChange={setField('penambahanPokokUtang')}
                            error={errors.penambahanPokokUtang}
                        />
                        <RpField
                            label="Reduction of Principal Debt (Rp.)" required
                            value={form.penguranganPokokUtang} onChange={setField('penguranganPokokUtang')}
                            error={errors.penguranganPokokUtang}
                        />
                    </div>

                    <RpFieldReadonly label="Principal Debt (Rp.) at End of Year" value={akhirTahun} />

                    <div className="grid grid-cols-2 gap-3">
                        <DateField
                            label="Loan Start Date"
                            value={form.tanggalMulaiPinjaman} onChange={setField('tanggalMulaiPinjaman')}
                        />
                        <DateField
                            label="Loan Due Date"
                            value={form.tanggalJatuhTempoPinjaman} onChange={setField('tanggalJatuhTempoPinjaman')}
                            minDate={form.tanggalMulaiPinjaman}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <NumberField
                            label="Interest Rate (%)"
                            value={form.tingkatSukuBunga} onChange={setField('tingkatSukuBunga')}
                            suffix="%"
                        />
                        <RpField
                            label="Interest Amount (Rp.)"
                            value={form.jumlahBunga} onChange={setField('jumlahBunga')}
                        />
                    </div>

                    <RpField
                        label="Cost Related to Loan Acquisition Other than Interest (Rp)"
                        value={form.biayaTerkaitPerolehan} onChange={setField('biayaTerkaitPerolehan')}
                    />

                    <TextField
                        label="Purpose of Loan"
                        value={form.peruntukanPinjaman} onChange={setField('peruntukanPinjaman')}
                    />
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Close</button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
//
// STANDALONE — belum diwiring ke MainFormBadan.js / SPTTahunanBadan.js.
// Props initialData/onChange sudah mengikuti bentuk Parent–Child Contract
// (Blueprint §10) supaya integrasi nanti tinggal pasang, tapi keduanya
// OPSIONAL saat ini — komponen tetap berfungsi penuh berdiri sendiri.
//
//   taxYear, tin      — header (opsional, pola identik L1D/L11B, forward dari parent kelak)
//   initialData        — { foreignDebtRows: [...] } — opsional, default buildInitialL11CData()
//   onChange            — (nextL11CData: { foreignDebtRows: [...] }) => void — opsional

const L11C = ({
    taxYear,
    tin,
    initialData,
    onChange,
}) => {
    const initial = useMemo(() => mergeWithInitial(initialData), []); // eslint-disable-line react-hooks/exhaustive-deps

    const [foreignDebtRows, setForeignDebtRows] = useState(initial.foreignDebtRows);
    const [editingRow, setEditingRow] = useState(null); // null | 'new' | index

    // Anti-loop guard — pola identik L11B (skipRestore), berjaga-jaga untuk
    // integrasi nanti meski belum dipakai aktif sekarang.
    const skipRestore = useRef(false);

    useEffect(() => {
        if (skipRestore.current) { skipRestore.current = false; return; }
        if (initialData) {
            const merged = mergeWithInitial(initialData);
            setForeignDebtRows(merged.foreignDebtRows);
        }
    }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps

    // Emit object wrapper { foreignDebtRows } — BUKAN array telanjang
    // (Parent–Child Contract Blueprint §10).
    const combinedData = useMemo(() => ({ foreignDebtRows }), [foreignDebtRows]);

    useEffect(() => {
        if (onChange) {
            skipRestore.current = true;
            onChange(combinedData);
        }
    }, [combinedData, onChange]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Baris + derived Pokok Utang Akhir Tahun (real-time, Blueprint §3.1) ──
    const rowsComputed = useMemo(() => foreignDebtRows.map(r => ({
        ...r,
        pokokUtangAkhirTahun: parse(r.pokokUtangAwalTahun) + parse(r.penambahanPokokUtang) - parse(r.penguranganPokokUtang),
    })), [foreignDebtRows]);

    const totals = useMemo(() => rowsComputed.reduce((acc, r) => ({
        awalTahun:  acc.awalTahun  + parse(r.pokokUtangAwalTahun),
        penambahan: acc.penambahan + parse(r.penambahanPokokUtang),
        pengurangan: acc.pengurangan + parse(r.penguranganPokokUtang),
        akhirTahun: acc.akhirTahun + r.pokokUtangAkhirTahun,
        jumlahBunga: acc.jumlahBunga + parse(r.jumlahBunga),
        biaya: acc.biaya + parse(r.biayaTerkaitPerolehan),
    }), { awalTahun: 0, penambahan: 0, pengurangan: 0, akhirTahun: 0, jumlahBunga: 0, biaya: 0 }), [rowsComputed]);

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleSave = (form) => {
        setForeignDebtRows(prev => {
            if (editingRow === 'new') return [...prev, { id: genId('l11c'), ...form }];
            return prev.map((r, i) => i === editingRow ? { ...r, ...form } : r);
        });
        setEditingRow(null);
    };
    const handleDelete = (idx) => setForeignDebtRows(prev => prev.filter((_, i) => i !== idx));

    const fmtTotal = (n) => {
        const rounded = Math.round(n);
        if (rounded === 0) return '0';
        return rounded < 0 ? `-${fmt(Math.abs(rounded))}` : fmt(rounded);
    };
    const fmtCell = (n) => {
        if (n === 0 || n === '' || n == null) return '';
        const num = typeof n === 'number' ? n : parse(n);
        return num < 0 ? `-${fmt(Math.abs(num))}` : fmt(num);
    };
    // Revisi UI 2 — simbol "Rp" dipindah dari header ke sel data. Murni
    // pembungkus tampilan di atas fmtCell/fmtTotal yang SUDAH ADA — nilai dan
    // rumus di baliknya (fmtCell/fmtTotal) tidak diubah sedikit pun.
    const fmtRpCell  = (n) => { const s = fmtCell(n);  return s ? `Rp${s}` : ''; };
    const fmtRpTotal = (n) => `Rp${fmtTotal(n)}`;

    // ── Styles — BASE TABLE UI mengikuti L13A.js persis (yellow sticky header,
    // border per-sel, freeze kolom Action/No). Struktur colSpan/rowSpan/jumlah
    // kolom Blueprint L11C TIDAK berubah — murni styling & pola markup diambil
    // dari L13A. thGroupCls = header baris-1 (rowSpan2 / colSpan group,
    // top:0, height:36). thSubCls = header baris-2 (top:36, sub-kolom).
    const HEADER_ROW_H = 36;
    const thGroupCls = "bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap";
    const thSubCls = "bg-yellow-400 px-3 py-2 text-center border border-white border-b-gray-300 whitespace-nowrap";
    const tdCls = "px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200";

    return (
        <div className="p-6 space-y-6">
            {/* ── HEADER — pola identik L13A ──────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 11-C — Foreign Private Debt Report
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Year" value={taxYear} />
                    <ReadonlyField label="TIN (NPWP)" value={tin} />
                </div>
            </div>

            {/* Toolbar — pola tombol identik L13A (Add: bg-blue-900 + icon) */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setEditingRow('new')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                    <Add fontSize="small" /> Add
                </button>
                <div className="flex-1" />
            </div>

            {/* Table — BASE TABLE UI L13A: sticky header 2 baris (top:0 utk baris
                grup rowSpan2, top:36 utk baris sub-kolom — tinggi header 36px),
                freeze kolom Action & No. (pola identik L10A/L13A), border putih
                antar header agar grup terlihat terpisah, border abu-abu di body.
                Struktur kolom (colSpan/rowSpan, urutan, jumlah) TETAP mengikuti
                Blueprint L11C — hanya markup/styling yang mengikuti L13A. */}
            <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-[520px] overflow-y-auto">
                <table className="min-w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-yellow-400 text-xs font-bold text-gray-800 uppercase">
                            <th rowSpan={2} style={{ position: 'sticky', top: 0, left: 0, zIndex: 21, height: HEADER_ROW_H }}
                                className={`${thGroupCls} w-20`}>Action</th>
                            <th rowSpan={2} style={{ position: 'sticky', top: 0, left: 80, zIndex: 21, height: HEADER_ROW_H }}
                                className={`${thGroupCls} w-12`}>No.</th>
                            <th colSpan={3} style={{ position: 'sticky', top: 0, zIndex: 20, height: HEADER_ROW_H }}
                                className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Lender</th>
                            <th colSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: HEADER_ROW_H }}
                                className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Currency</th>
                            <th colSpan={4} style={{ position: 'sticky', top: 0, zIndex: 20, height: HEADER_ROW_H }}
                                className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Principal Debt</th>
                            <th colSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: HEADER_ROW_H }}
                                className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Loan Term</th>
                            <th colSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: HEADER_ROW_H }}
                                className="bg-yellow-400 px-3 py-2 text-center border border-white whitespace-nowrap">Interest</th>
                            <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: HEADER_ROW_H }}
                                className={thGroupCls}>Cost Related to Loan Acquisition Other than Interest</th>
                            <th rowSpan={2} style={{ position: 'sticky', top: 0, zIndex: 20, height: HEADER_ROW_H }}
                                className={thGroupCls}>Purpose of Loan</th>
                        </tr>
                        <tr className="bg-yellow-400 text-xs font-semibold text-gray-800 uppercase">
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Name</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Address</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Country/Jurisdiction</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Code</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Year-End Rate</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Beginning of Year</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Addition</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Reduction</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>End of Year</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Start Date</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Due Date</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Rate (%)</th>
                            <th style={{ position: 'sticky', top: HEADER_ROW_H, zIndex: 20 }} className={thSubCls}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowsComputed.length === 0 && (
                            <tr>
                                <td colSpan={17} className="px-3 py-8 text-center text-gray-400 text-sm border border-gray-200">
                                    No data available.
                                </td>
                            </tr>
                        )}
                        {rowsComputed.map((r, idx) => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td style={{ position: 'sticky', left: 0, zIndex: 10 }} className="bg-white px-3 py-2 whitespace-nowrap border border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setEditingRow(idx)} className="text-blue-600 hover:text-blue-800" title="Edit">
                                            <Edit fontSize="small" />
                                        </button>
                                        <button onClick={() => handleDelete(idx)} className="text-red-500 hover:text-red-700" title="Delete">
                                            <Delete fontSize="small" />
                                        </button>
                                    </div>
                                </td>
                                <td style={{ position: 'sticky', left: 80, zIndex: 10 }} className="bg-white px-3 py-2 text-gray-700 border border-gray-200">{idx + 1}</td>
                                <td className={tdCls}>{r.namaPemberiPinjaman}</td>
                                <td className={tdCls}>{r.alamatPemberiPinjaman}</td>
                                <td className={tdCls}>{r.negaraYurisdiksi}</td>
                                <td className={tdCls}>{r.mataUang}</td>
                                <td className={`${tdCls} text-right`}>{fmtCell(r.kursAkhirTahun)}</td>
                                <td className={`${tdCls} text-right`}>{fmtRpCell(r.pokokUtangAwalTahun)}</td>
                                <td className={`${tdCls} text-right`}>{fmtRpCell(r.penambahanPokokUtang)}</td>
                                <td className={`${tdCls} text-right`}>{fmtRpCell(r.penguranganPokokUtang)}</td>
                                <td className={`${tdCls} text-right font-medium bg-gray-50`}>{fmtRpCell(r.pokokUtangAkhirTahun)}</td>
                                <td className={tdCls}>{r.tanggalMulaiPinjaman ? formatDateDisplay(r.tanggalMulaiPinjaman) : '—'}</td>
                                <td className={tdCls}>{r.tanggalJatuhTempoPinjaman ? formatDateDisplay(r.tanggalJatuhTempoPinjaman) : '—'}</td>
                                <td className={`${tdCls} text-right`}>{r.tingkatSukuBunga ? `${r.tingkatSukuBunga}%` : ''}</td>
                                <td className={`${tdCls} text-right`}>{fmtRpCell(r.jumlahBunga)}</td>
                                <td className={`${tdCls} text-right`}>{fmtRpCell(r.biayaTerkaitPerolehan)}</td>
                                <td className={tdCls}>{r.peruntukanPinjaman}</td>
                            </tr>
                        ))}
                        <tr className="bg-gray-50 font-semibold">
                            <td style={{ position: 'sticky', left: 0, zIndex: 10 }} className="bg-gray-50 px-3 py-2 border border-gray-200" colSpan={2}></td>
                            <td className="px-3 py-2 text-gray-700 border border-gray-200" colSpan={5}>TOTAL</td>
                            <td className="px-3 py-2 text-right text-gray-700 border border-gray-200">{fmtRpTotal(totals.awalTahun)}</td>
                            <td className="px-3 py-2 text-right text-gray-700 border border-gray-200">{fmtRpTotal(totals.penambahan)}</td>
                            <td className="px-3 py-2 text-right text-gray-700 border border-gray-200">{fmtRpTotal(totals.pengurangan)}</td>
                            <td className="px-3 py-2 text-right text-gray-700 border border-gray-200">{fmtRpTotal(totals.akhirTahun)}</td>
                            <td className="px-3 py-2 border border-gray-200" colSpan={2}></td>
                            <td className="px-3 py-2 border border-gray-200"></td>
                            <td className="px-3 py-2 text-right text-gray-700 border border-gray-200">{fmtRpTotal(totals.jumlahBunga)}</td>
                            <td className="px-3 py-2 text-right text-gray-700 border border-gray-200">{fmtRpTotal(totals.biaya)}</td>
                            <td className="px-3 py-2 border border-gray-200"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ── MODAL ────────────────────────────────────────────────────── */}
            {editingRow !== null && (
                <ModalEditForeignDebt
                    row={editingRow === 'new' ? null : foreignDebtRows[editingRow]}
                    onClose={() => setEditingRow(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default L11C;