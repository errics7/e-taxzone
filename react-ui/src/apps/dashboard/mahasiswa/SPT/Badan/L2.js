import React, { useState, useMemo, useEffect, useRef } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Catatan: fmt/parse/ReadonlyField/RpField/SelectField di bawah ini adalah COPY
// dari L1A.js (L1C.js juga melakukan hal yang sama relatif terhadap L1A). Tidak
// ada shared util module di project ini — setiap Lampiran berdiri sendiri secara
// sengaja (lihat ROLE prompt: "Setiap Lampiran dipisahkan menjadi file tersendiri
// agar maintainable"). Helper ini TIDAK di-export oleh L1A/L1C sehingga tidak bisa
// di-import langsung; menyalin pola yang identik adalah opsi paling konsisten
// dengan arsitektur yang sudah berjalan, bukan "duplicate helper baru".

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
// Identik dengan RpField di L1A.js (live formatting, cursor-preserving).
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

// PercentField — BARU, tidak ada presedan di L1A/L1C (keduanya tidak punya kolom
// persentase). Visual mengikuti RpField (label di atas, kotak ber-border), tapi
// suffix "%" di kanan, tanpa thousand-separator (persentase tidak pernah sebesar itu).
// PENTING: jangan pernah memakai parse() untuk nilai PercentField — parse() menghapus
// karakter "." sebagai pemisah ribuan Rupiah, yang akan merusak nilai desimal persen
// (mis. "12.5" → "125"). Gunakan parseFloat() biasa.
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
            <div className="flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
                <input
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2 text-sm text-right bg-white focus:outline-none min-w-0"
                />
                <span className="px-2 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-l border-gray-200 select-none whitespace-nowrap">%</span>
            </div>
        </div>
    );
};

// TextField — BARU, tidak ada presedan di L1A/L1C (Account Name/Code di sana selalu
// ReadonlyField, tidak pernah text input bebas). Dibutuhkan untuk Name/NPWP Part B
// (manual input penuh, bukan dari data registrasi — Blueprint L2 Final §5).
const TextField = ({ label, value, onChange, placeholder = '', maxLength }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
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

// ─── Static Options ───────────────────────────────────────────────────────────
// PERLU KONFIRMASI (Blueprint L2 Final §17 poin 7) — daftar berikut placeholder.
// Struktur {value, label} mengikuti pola CORRECTION_CODES di L1A; SelectField
// generic sehingga mengganti isi array ini TIDAK memerlukan refactor apa pun.

// TODO: Replace with master position data when backend is available.
const POSITION_OPTIONS = [
    { value: '',                  label: 'Please select' },
    { value: 'Direktur Utama',    label: 'Direktur Utama' },
    { value: 'Direktur',          label: 'Direktur' },
    { value: 'Komisaris Utama',   label: 'Komisaris Utama' },
    { value: 'Komisaris',         label: 'Komisaris' },
    { value: 'Pemegang Saham',    label: 'Pemegang Saham' },
];

// TODO: Replace with master country list / backend API when available.
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

// ─── Row helpers (generic — Blueprint L2 Final §8) ─────────────────────────────
// Generic terhadap bentuk row apa pun (Part A maupun Part B), karena keduanya
// kini array of full object keyed by id (tidak ada lagi pembagian reference/draft).

const updateRowById = (rows, id, patch) => rows.map(r => (r.id === id ? { ...r, ...patch } : r));
const removeRowById  = (rows, id) => rows.filter(r => r.id !== id);

const buildEmptyPartBRow = () => ({
    id: crypto.randomUUID(), // Blueprint L2 Final §8 — id stabil, dipersist sebagai bagian row
    npwp: '',
    name: '',
    countryCode: '',
    investmentRp: '',
    investmentPercent: '',
    debtRp: '',
    debtYear: '',
    debtInterestPercent: '',
    receivableRp: '',
    receivableYear: '',
    receivableInterestPercent: '',
});

// ─── Modal Part A — selalu mode edit, tidak ada operasi create (Blueprint §7) ──

const ModalPartA = ({ row, onClose, onSave }) => {
    const [form, setForm] = useState({
        countryCode:         row.countryCode || '',
        position:            row.position || '',
        paidCapitalRp:       row.paidCapitalRp || '',
        paidCapitalPercent:  row.paidCapitalPercent || '',
        dividendRp:          row.dividendRp || '',
    });
    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    // Validasi — Blueprint L2 Final §15 (Part A)
    const errors = {};
    if (!form.position) errors.position = 'Position wajib diisi.';
    const pct = parseFloat(form.paidCapitalPercent) || 0;
    if (pct < 0 || pct > 100) errors.paidCapitalPercent = 'Harus di antara 0–100.';
    const hasError = Object.keys(errors).length > 0;

    const handleSave = () => {
        if (hasError) return;
        onSave({ ...form });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-white font-semibold text-sm">Edit Shareholders / Capital Owners and Management</p>
                        <p className="text-blue-200 text-xs mt-0.5">{row.name}</p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
                </div>

                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Data identitas — readonly murni di level UI (Blueprint §4) */}
                    <div className="grid grid-cols-2 gap-3">
                        <ReadonlyField label="Name"    value={row.name} />
                        <ReadonlyField label="Address" value={row.address} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Country Code editable — bisa berbeda dari data registrasi (poin 2) */}
                        <SelectField
                            label="Country Code"
                            value={form.countryCode}
                            onChange={set('countryCode')}
                            options={COUNTRY_OPTIONS}
                        />
                        <ReadonlyField label="NPWP/TIN Number" value={row.npwp} />
                    </div>

                    <div>
                        <SelectField
                            label="Position"
                            value={form.position}
                            onChange={set('position')}
                            options={POSITION_OPTIONS}
                        />
                        {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <RpField
                            label="Paid in Capital"
                            value={form.paidCapitalRp}
                            onChange={set('paidCapitalRp')}
                        />
                        <div>
                            <PercentField
                                label="Paid in Capital"
                                value={form.paidCapitalPercent}
                                onChange={set('paidCapitalPercent')}
                            />
                            {errors.paidCapitalPercent && <p className="text-xs text-red-500 mt-1">{errors.paidCapitalPercent}</p>}
                        </div>
                    </div>

                    <RpField
                        label="Dividend"
                        value={form.dividendRp}
                        onChange={set('dividendRp')}
                    />
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

// ─── Modal Part B — satu komponen, mode create/edit (Blueprint §7) ────────────

const ModalPartB = ({ mode, row, onClose, onSave }) => {
    const initial = row || buildEmptyPartBRow();
    const [form, setForm] = useState({
        npwp:                       initial.npwp || '',
        name:                       initial.name || '',
        countryCode:                initial.countryCode || '',
        investmentRp:               initial.investmentRp || '',
        investmentPercent:          initial.investmentPercent || '',
        debtRp:                     initial.debtRp || '',
        debtYear:                   initial.debtYear || '',
        debtInterestPercent:        initial.debtInterestPercent || '',
        receivableRp:               initial.receivableRp || '',
        receivableYear:              initial.receivableYear || '',
        receivableInterestPercent:  initial.receivableInterestPercent || '',
    });
    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    // Validasi — Blueprint L2 Final §15 (Part B).
    // NPWP/TIN: boleh kosong (belum diisi), boleh diisi TIN luar negeri (format berbeda
    // tiap negara). Validasi final diserahkan ke backend. Di sini hanya cek panjang
    // maksimum sebagai guardrail ringan — tidak memblokir submit hanya karena format.
    const errors = {};
    if (form.npwp && form.npwp.length > 50) errors.npwp = 'NPWP/TIN terlalu panjang (maks. 50 karakter).';
    if (!form.name.trim()) errors.name = 'Name wajib diisi.';
    if (!form.countryCode) errors.countryCode = 'Country Code wajib dipilih.';
    if (form.debtYear && !/^\d{4}$/.test(form.debtYear)) errors.debtYear = 'Tahun harus 4 digit.';
    if (form.receivableYear && !/^\d{4}$/.test(form.receivableYear)) errors.receivableYear = 'Tahun harus 4 digit.';
    const hasError = Object.keys(errors).length > 0;

    const handleSave = () => {
        if (hasError) return;
        onSave({ ...form });
    };

    const title = mode === 'create'
        ? 'Add Investment List, Debt List, List of Receivables in Affiliated Companies'
        : 'Edit Investment List, Debt List, List of Receivables in Affiliated Companies';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
                </div>

                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <TextField label="NPWP/TIN Number" value={form.npwp} onChange={set('npwp')} maxLength={50} placeholder="Opsional" />
                            {errors.npwp && <p className="text-xs text-red-500 mt-1">{errors.npwp}</p>}
                        </div>
                        <div>
                            <TextField label="Name" value={form.name} onChange={set('name')} />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                    </div>

                    <div>
                        <SelectField label="Country Code" value={form.countryCode} onChange={set('countryCode')} options={COUNTRY_OPTIONS} />
                        {errors.countryCode && <p className="text-xs text-red-500 mt-1">{errors.countryCode}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <RpField label="Investment" value={form.investmentRp} onChange={set('investmentRp')} />
                        <PercentField label="Investment" value={form.investmentPercent} onChange={set('investmentPercent')} />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <RpField label="Debt" value={form.debtRp} onChange={set('debtRp')} />
                        <div>
                            <TextField label="Year of Debt" value={form.debtYear} onChange={set('debtYear')} maxLength={4} placeholder="YYYY" />
                            {errors.debtYear && <p className="text-xs text-red-500 mt-1">{errors.debtYear}</p>}
                        </div>
                        <PercentField label="Debt Interest/Year" value={form.debtInterestPercent} onChange={set('debtInterestPercent')} max={1000} />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <RpField label="Receivable" value={form.receivableRp} onChange={set('receivableRp')} />
                        <div>
                            <TextField label="Year of Receivable" value={form.receivableYear} onChange={set('receivableYear')} maxLength={4} placeholder="YYYY" />
                            {errors.receivableYear && <p className="text-xs text-red-500 mt-1">{errors.receivableYear}</p>}
                        </div>
                        <PercentField label="Receivable Interest/Year" value={form.receivableInterestPercent} onChange={set('receivableInterestPercent')} max={1000} />
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
// Blueprint L2 Final (pasca-review):
//   • rowsA/rowsB = array of full object, TANPA merge dengan roster/reference data
//     (§3, §4). Part A tidak punya Add — rowsA hanya terisi dari draft/backend.
//   • rowsB mendukung Add/Edit/Delete dengan id stabil, crypto.randomUUID() (§8).
//   • Header Tax Year/TIN: prop sederhana langsung dari sptData mirror di
//     SptTahunanBadan (§3/§14) — tidak ada object wrapper baru.
//   • Total dihitung via useMemo, TIDAK pernah disimpan ke state (§3, filosofi L1).

const L2 = ({
    l2RowsA = [],
    l2RowsB = [],
    onRowsAChange,
    onRowsBChange,
    taxYear,
    tin,
    // showPartB — kontrol visibilitas Bagian B dari parent (SptTahunanBadan.js),
    // berdasarkan Section H (21c/21d = Yes). Default true agar backward-compatible
    // apabila ada caller lain yang belum meneruskan prop ini. PENTING: prop ini
    // HANYA mengontrol tampilan (conditional render) — rowsB (source of truth)
    // tetap dipertahankan apa adanya, TIDAK di-reset/dihapus saat showPartB false,
    // sehingga Save Draft/Load Draft tidak terpengaruh sama sekali.
    showPartB = true,
}) => {
    const [rowsA, setRowsA] = useState(() => (Array.isArray(l2RowsA) ? l2RowsA : []));
    const [rowsB, setRowsB] = useState(() => (Array.isArray(l2RowsB) ? l2RowsB : []));

    const [editingA, setEditingA] = useState(null); // id row Part A yang sedang diedit, atau null
    const [modalB, setModalB]     = useState(null); // { mode: 'create' | 'edit', row?: object } | null

    // Ref anti-loop — pola identik L1A/L1C (Blueprint §3).
    const skipRestoreA = useRef(false);
    const skipRestoreB = useRef(false);

    // Restore saat Load Draft — TANPA merge (Blueprint §10), berbeda dari L1A/L1C
    // yang memanggil mergeRowsWithDraft(buildInitialX(), ...) karena L2 tidak punya
    // daftar akun statis untuk di-merge.
    useEffect(() => {
        if (skipRestoreA.current) { skipRestoreA.current = false; return; }
        if (Array.isArray(l2RowsA) && l2RowsA.length > 0) {
            setRowsA(l2RowsA);
        }
    }, [l2RowsA]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (skipRestoreB.current) { skipRestoreB.current = false; return; }
        if (Array.isArray(l2RowsB) && l2RowsB.length > 0) {
            setRowsB(l2RowsB);
        }
    }, [l2RowsB]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Part A: Edit only (Blueprint §4) ────────────────────────────────────
    const handleSaveA = (id, form) => {
        setRowsA(prev => {
            const next = updateRowById(prev, id, form);
            if (onRowsAChange) {
                skipRestoreA.current = true;
                onRowsAChange(next);
            }
            return next;
        });
        setEditingA(null);
    };

    // ── Part B: Add / Edit / Delete (Blueprint §8) ──────────────────────────
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

    // ── Derived totals — selalu dihitung ulang dari rows, TIDAK pernah disimpan
    // ke state (filosofi L1 — Blueprint §3, §9). parseFloat dipakai untuk kolom
    // persentase (BUKAN parse(), karena parse() menghapus "." sebagai pemisah
    // ribuan dan akan merusak nilai desimal persen).
    const totalA = useMemo(() => rowsA.reduce((acc, r) => ({
        paidCapitalRp:      acc.paidCapitalRp      + parse(r.paidCapitalRp),
        paidCapitalPercent: acc.paidCapitalPercent + (parseFloat(r.paidCapitalPercent) || 0),
        dividendRp:         acc.dividendRp         + parse(r.dividendRp),
    }), { paidCapitalRp: 0, paidCapitalPercent: 0, dividendRp: 0 }), [rowsA]);

    const totalB = useMemo(() => rowsB.reduce((acc, r) => ({
        investmentRp: acc.investmentRp + parse(r.investmentRp),
        debtRp:       acc.debtRp       + parse(r.debtRp),
        receivableRp: acc.receivableRp + parse(r.receivableRp),
    }), { investmentRp: 0, debtRp: 0, receivableRp: 0 }), [rowsB]);

    // ── Style helpers — disalin dari pola sticky-column L1A/L1C, diadaptasi
    // (Action + Name frozen — L2 tidak punya kolom "Code" seperti L1A/L1C).
    const thCls = "px-3 py-2 text-left text-xs font-semibold text-gray-600 bg-gray-100 border-b border-gray-200 whitespace-nowrap";
    const tdCls = "px-3 py-2 text-xs text-gray-700 border-b border-gray-100";
    const tdNum = "px-3 py-2 text-xs text-right text-gray-700 border-b border-gray-100 font-mono";

    const COL_ACTION_W = 48;
    const COL_NAME_W   = 160;

    const thAction = { position: 'sticky', left: 0,            top: 0, zIndex: 4, backgroundColor: '#f3f4f6' };
    const thName   = { position: 'sticky', left: COL_ACTION_W, top: 0, zIndex: 4, backgroundColor: '#f3f4f6' };
    const thTop    = { position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#f3f4f6' };

    const tdAction = { position: 'sticky', left: 0,            zIndex: 1, backgroundColor: '#ffffff' };
    const tdName   = { position: 'sticky', left: COL_ACTION_W, zIndex: 1, backgroundColor: '#ffffff' };

    const editRowA = editingA !== null ? rowsA.find(r => r.id === editingA) : null;

    return (
        <div className="p-6 space-y-8">
            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 2 — List of Ownership
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Year"   value={taxYear} />
                    <ReadonlyField label="TIN (NPWP)" value={tin} />
                </div>
            </div>

            {/* ── PART A ──────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-blue-700">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                        A. List of Shareholders / Capital Owners and Number of Dividends to be Shared and List of Management and Commissioners
                    </h3>
                </div>

                <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '500px' }}>
                    <table className="w-full text-sm border-collapse min-w-[1100px]">
                        <thead>
                            <tr>
                                <th className={thCls} style={{ ...thAction, minWidth: COL_ACTION_W }}>Action</th>
                                <th className={thCls} style={{ ...thName, minWidth: COL_NAME_W }}>Name</th>
                                <th className={`${thCls} w-56`} style={thTop}>Address</th>
                                <th className={thCls} style={thTop}>Country Code</th>
                                <th className={thCls} style={thTop}>NPWP/TIN</th>
                                <th className={thCls} style={thTop}>Position</th>
                                <th className={`${thCls} text-right`} style={thTop}>Paid in Capital (Rp)</th>
                                <th className={`${thCls} text-right`} style={thTop}>Paid in Capital (%)</th>
                                <th className={`${thCls} text-right`} style={thTop}>Dividend (Rp)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsA.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-3 py-10 text-center">
                                        <p className="text-sm text-gray-500">Belum ada data pemegang saham/pemilik modal yang tersedia.</p>
                                        <p className="text-xs text-gray-400 mt-1">Data akan muncul setelah diisi atau dimuat dari draft.</p>
                                    </td>
                                </tr>
                            )}
                            {rowsA.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    <td className={tdCls} style={tdAction}>
                                        <button onClick={() => setEditingA(row.id)} title="Edit" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className={tdCls} style={tdName}>{row.name}</td>
                                    <td className={tdCls}>{row.address}</td>
                                    <td className={tdCls}>{row.countryCode}</td>
                                    <td className={tdCls}>{row.npwp}</td>
                                    <td className={tdCls}>{row.position}</td>
                                    <td className={tdNum}>{fmt(row.paidCapitalRp)}</td>
                                    <td className={tdNum}>{row.paidCapitalPercent || '0'}</td>
                                    <td className={tdNum}>{fmt(row.dividendRp)}</td>
                                </tr>
                            ))}
                        </tbody>
                        {rowsA.length > 0 && (
                            <tfoot>
                                <tr className="bg-blue-700">
                                    <td className="px-3 py-2" colSpan={6} style={{ position: 'sticky', left: 0 }}>
                                        <span className="text-xs font-bold text-white">TOTAL</span>
                                    </td>
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-white">{fmt(totalA.paidCapitalRp)}</td>
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-white">{totalA.paidCapitalPercent || '0'}</td>
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-white">{fmt(totalA.dividendRp)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* ── PART B ──────────────────────────────────────────────────── */}
            {/* Bagian B hanya ditampilkan apabila 21c dan/atau 21d = Yes (Section H,
                dikontrol lewat prop showPartB dari SptTahunanBadan.js). Ini HANYA
                conditional render — rowsB (state, Save Draft, Load Draft) tidak
                disentuh sama sekali sehingga data tidak pernah hilang saat
                disembunyikan (pola identik showPartA/showPartB milik L4). */}
            {showPartB && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-blue-700 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                        B. Investment List, Debt List, List of Receivables in Affiliated Companies
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
                                <th className={thCls} style={thTop}>Country Code</th>
                                <th className={thCls} style={thTop}>NPWP/TIN</th>
                                <th className={`${thCls} text-right`} style={thTop}>Investment (Rp)</th>
                                <th className={`${thCls} text-right`} style={thTop}>Investment (%)</th>
                                <th className={`${thCls} text-right`} style={thTop}>Debt (Rp)</th>
                                <th className={`${thCls} text-right`} style={thTop}>Year</th>
                                <th className={`${thCls} text-right`} style={thTop}>Interest/Year (%)</th>
                                <th className={`${thCls} text-right`} style={thTop}>Receivable (Rp)</th>
                                <th className={`${thCls} text-right`} style={thTop}>Year</th>
                                <th className={`${thCls} text-right`} style={thTop}>Interest/Year (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsB.length === 0 && (
                                <tr><td colSpan={12} className="px-3 py-6 text-center text-sm text-gray-400 italic">No data to display.</td></tr>
                            )}
                            {rowsB.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    <td className={tdCls} style={tdAction}>
                                        <div className="flex gap-1">
                                            <button onClick={() => setModalB({ mode: 'edit', row })} title="Edit" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDeleteB(row.id)} title="Delete" className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 112 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className={tdCls} style={tdName}>{row.name}</td>
                                    <td className={tdCls}>{row.countryCode}</td>
                                    <td className={tdCls}>{row.npwp}</td>
                                    <td className={tdNum}>{fmt(row.investmentRp)}</td>
                                    <td className={tdNum}>{row.investmentPercent || '0'}</td>
                                    <td className={tdNum}>{fmt(row.debtRp)}</td>
                                    <td className={tdNum}>{row.debtYear}</td>
                                    <td className={tdNum}>{row.debtInterestPercent || '0'}</td>
                                    <td className={tdNum}>{fmt(row.receivableRp)}</td>
                                    <td className={tdNum}>{row.receivableYear}</td>
                                    <td className={tdNum}>{row.receivableInterestPercent || '0'}</td>
                                </tr>
                            ))}
                        </tbody>
                        {rowsB.length > 0 && (
                            <tfoot>
                                <tr className="bg-blue-700">
                                    <td className="px-3 py-2" colSpan={4} style={{ position: 'sticky', left: 0 }}>
                                        <span className="text-xs font-bold text-white">TOTAL</span>
                                    </td>
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-white">{fmt(totalB.investmentRp)}</td>
                                    <td className="px-3 py-2" />
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-white">{fmt(totalB.debtRp)}</td>
                                    <td className="px-3 py-2" colSpan={2} />
                                    <td className="px-3 py-2 text-xs font-bold text-right font-mono text-white">{fmt(totalB.receivableRp)}</td>
                                    <td className="px-3 py-2" colSpan={2} />
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
            )}

            {/* ── MODALS ──────────────────────────────────────────────────── */}
            {editRowA && (
                <ModalPartA
                    row={editRowA}
                    onClose={() => setEditingA(null)}
                    onSave={(form) => handleSaveA(editRowA.id, form)}
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

export default L2;