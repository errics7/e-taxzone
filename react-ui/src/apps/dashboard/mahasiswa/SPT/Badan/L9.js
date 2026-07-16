import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Add, Refresh, MoreHoriz, GridOn, PictureAsPdf } from '@mui/icons-material';

// ═══════════════════════════════════════════════════════════════════════════
// STATIC CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const TANGIBLE_ASSET_OPTIONS = [
    'Sepeda', 'Motor', 'Mobil Penumpang', 'Bus', 'Kendaraan Angkutan',
    'Kendaraan Khusus', 'Kereta', 'Pesawat Terbang', 'Kapal Laut', 'Mesin',
    'Cart', 'Kapal Pesiar', 'Peralatan', 'Aset Bergerak Lainnya',
    'Peralatan Olahraga Khusus', 'Peralatan Elektronik', 'Rumah Tangga/Furnitur',
    'Peralatan Lainnya', 'Jet Ski', 'Aset Lainnya',
];

const BUILDING_ASSET_OPTIONS = [
    'Bangunan untuk tempat tinggal',
    'Bangunan untuk usaha (toko, pabrik, kantor, gudang, dan sejenisnya)',
    'Bangunan yang disewakan',
    'Apartemen',
    'Aset Tidak Bergerak Lainnya',
];

const INTANGIBLE_ASSET_OPTIONS = [
    'Paten', 'Royalti', 'Merek Dagang', 'Hak Bangunan', 'Hak Budidaya',
    'Hak Penggunaan', 'Goodwill', 'Hak Pengusahaan Hutan',
    'Hak di Lapangan Minyak dan Gas',
    'Hak Eksploitasi Sumber Daya Alam dan Hasil Alam Lainnya',
    'Harta Tidak Berwujud Lainnya',
];

const COMMERCIAL_METHODS = [
    'Garis Lurus', 'Jumlah Angka Tahun', 'Saldo Menurun', 'Saldo Menurun Ganda',
    'Jumlah Jam Jasa', 'Jumlah Satuan Produksi', 'Metode Lainnya',
];

const FISCAL_METHODS = [
    'GL / Straight Line (Garis Lurus)',
    'JSP / Number of Production Unit (Jumlah Satuan Produksi)',
    'SM / Declining Method (Saldo Menurun)',
];

// Definisi kategori & subgroup — satu-satunya tempat struktur L9 didefinisikan.
// Menambah/mengubah subgroup di masa depan cukup mengubah array ini.
// Kalkulasi (§ CALCULATION) dan initial state (§ MAIN COMPONENT) di-generate
// dari array ini secara generic — tidak ada hardcode nama subgroup di logic.
const L9_CATEGORIES = [
    {
        key: 'tangible',
        label: 'Tangible Asset',
        assetOptions: TANGIBLE_ASSET_OPTIONS,
        subgroups: [
            { key: 'group1', title: 'Group 1' },
            { key: 'group2', title: 'Group 2' },
            { key: 'group3', title: 'Group 3' },
            { key: 'group4', title: 'Group 4' },
            { key: 'other',  title: 'Other Group' },
        ],
    },
    {
        key: 'building',
        label: 'Building(s)',
        assetOptions: BUILDING_ASSET_OPTIONS,
        subgroups: [
            { key: 'permanent',    title: 'Permanent' },
            { key: 'nonPermanent', title: 'Non Permanent' },
        ],
    },
    {
        key: 'intangible',
        label: 'Intangible Asset',
        assetOptions: INTANGIBLE_ASSET_OPTIONS,
        subgroups: [
            { key: 'group1', title: 'Group 1' },
            { key: 'group2', title: 'Group 2' },
            { key: 'group3', title: 'Group 3' },
            { key: 'group4', title: 'Group 4' },
            { key: 'other',  title: 'Other Group' },
        ],
    },
];

// Kategori mana yang masuk rekap Depreciation vs Amortization.
// Tetap config-driven (bukan hardcode key literal di dalam fungsi kalkulasi).
const DEPRECIATION_CATEGORY_KEYS = ['tangible', 'building'];
const AMORTIZATION_CATEGORY_KEYS = ['intangible'];

// Status: 'active' | 'placeholder' | 'disabled'
// Dipertahankan sebagai kontrak status (dokumentasi behavior), sesuai
// UI Refinement Toolbar Consistency: rendering AssetToolbar kini mengikuti
// layout bespoke L10A (Add kiri, 4 ikon bulat kanan) — bukan lagi loop
// generik seragam — tapi status/label di sini tetap acuan makna tiap tombol.
const TOOLBAR_CONFIG = [
    { key: 'add',    label: 'Add',            status: 'active'      },
    { key: 'refresh',label: 'Refresh Table',  status: 'active'      }, // visual aktif, no business logic (no-op, pola L10A)
    { key: 'doc',    label: 'Reserved',       status: 'disabled'    },
    { key: 'xlsx',   label: 'Export Excel',   status: 'placeholder' },
    { key: 'pdf',    label: 'Export PDF',     status: 'placeholder' },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER
// Reuse identik dari Lampiran L1A (fmt / parse / RpField / ReadonlyField /
// SelectField). Tidak ada modifikasi logic.
// ═══════════════════════════════════════════════════════════════════════════

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};

const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

// ReadonlyField — mendukung `prefix` opsional (mis. "Rp") untuk field
// nominal readonly, mengikuti shell visual yang sama dengan RpField (kotak
// prefix di kiri) agar seluruh field nominal pada halaman ini konsisten.
// Tanpa `prefix` (default), tampilan tetap seperti semula — dipakai untuk
// field non-nominal (Tax Period Year, TIN/NIK).
const ReadonlyField = ({ label, value, prefix }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        {prefix ? (
            <div className="flex items-center border border-gray-200 rounded overflow-hidden bg-gray-100">
                <span className="px-2 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-r border-gray-200 select-none whitespace-nowrap">{prefix}</span>
                <span className="flex-1 px-3 py-2 text-sm text-left text-gray-700 min-w-0">
                    {value || <span className="text-gray-400">—</span>}
                </span>
            </div>
        ) : (
            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
                {value || <span className="text-gray-400">—</span>}
            </div>
        )}
    </div>
);

// Label bulan singkat (Indonesia) untuk grid picker — static, tidak
// memengaruhi calculation, murni tampilan.
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// MonthYearPicker — Business Rule terkonfirmasi: Month/Year Acquisition.
// User HANYA memilih Bulan + Tahun (bukan tanggal harian). Tidak memakai
// library eksternal (konsisten dengan arsitektur project — seluruh helper
// L9/L1A murni React + Tailwind). Tampilan menyerupai Coretax: input
// readonly "MM/YYYY" + calendar icon di kanan, klik membuka popover
// navigasi tahun + grid 12 bulan.
//
// Format nilai di state: string raw "MM/YYYY" (mis. "03/2023") — raw input,
// bukan computed value, mengikuti pola field string lain di form ini.
// Nilai internal sudah disimpan sebagai "MM/YYYY" (lihat state format di
// MonthYearPicker) — fungsi ini hanya passthrough eksplisit agar seluruh
// titik tampilan (modal, table) memakai satu sumber format yang sama,
// tanpa mengubah separator "/" menjadi spasi (agar tidak ambigu dengan
// format tanggal harian).
const formatMonthYearDisplay = (value) => (value || '');

const MonthYearPicker = ({ label, value, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewYear, setViewYear] = useState(() => {
        if (value) {
            const [, y] = value.split('/');
            const parsedYear = parseInt(y, 10);
            if (!isNaN(parsedYear)) return parsedYear;
        }
        return new Date().getFullYear();
    });

    const selectedMonth = value ? parseInt(value.split('/')[0], 10) : null;
    const selectedYear  = value ? parseInt(value.split('/')[1], 10) : null;

    const handlePickMonth = (monthIndex) => {
        const mm = String(monthIndex + 1).padStart(2, '0');
        onChange(`${mm}/${viewYear}`);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className={`w-full flex items-center justify-between px-3 py-2 border rounded text-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : 'border-gray-300'}`}
            >
                <span className={value ? 'text-gray-700' : 'text-gray-400'}>
                    {value ? formatMonthYearDisplay(value) : 'MM/YYYY'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 011 1v1h6V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm10 6H4v8h12V8z" clipRule="evenodd" />
                </svg>
            </button>
            {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}

            {isOpen && (
                <>
                    {/* Backdrop transparan — klik di luar popover menutup picker */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                type="button"
                                onClick={() => setViewYear(y => y - 1)}
                                className="p-1 rounded hover:bg-gray-100 text-gray-600"
                                title="Tahun sebelumnya"
                            >
                                &#8249;
                            </button>
                            <span className="text-sm font-semibold text-gray-700">{viewYear}</span>
                            <button
                                type="button"
                                onClick={() => setViewYear(y => y + 1)}
                                className="p-1 rounded hover:bg-gray-100 text-gray-600"
                                title="Tahun berikutnya"
                            >
                                &#8250;
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            {MONTH_LABELS.map((m, idx) => {
                                const isSelected = selectedMonth === idx + 1 && selectedYear === viewYear;
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => handlePickMonth(idx)}
                                        className={`px-2 py-1.5 text-xs rounded transition-colors ${
                                            isSelected
                                                ? 'bg-blue-700 text-white font-semibold'
                                                : 'text-gray-700 hover:bg-blue-50'
                                        }`}
                                    >
                                        {m}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// RpField — identik dengan L1A: raw digit string di state, format tampilan
// id-ID, prefix visual "Rp" (tidak masuk value), cursor-preserving live format.
const RpField = ({ label, value, onChange, placeholder = '0', error }) => {
    const inputRef  = useRef(null);
    const isFocused = useRef(false);

    const [displayValue, setDisplayValue] = useState(() => {
        const n = parse(value);
        return n !== 0 ? fmt(n) : '';
    });

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
            {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
        </div>
    );
};

const SelectField = ({ label, value, onChange, options, error }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${error ? 'border-red-400' : 'border-gray-300'}`}
        >
            <option value="">Please Select</option>
            {options.map(o => (
                <option key={o} value={o}>{o}</option>
            ))}
        </select>
        {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
);

// Sticky / freeze column style — pola identik L1A.
// Freeze 3 kolom kiri: Action, Code of Assets, Group/Type of Asset(s).
const thCls  = "px-3 py-2 text-left text-xs font-semibold text-gray-600 bg-gray-100 border-b border-gray-200 whitespace-nowrap";
const tdCls  = "px-3 py-2 text-xs text-gray-700 border-b border-gray-100";
const tdNum  = "px-3 py-2 text-xs text-right text-gray-700 border-b border-gray-100 font-mono";

const COL_ACTION_W = 72;
const COL_CODE_W   = 120;
const COL_TYPE_W   = 220;

const thAction = { position: 'sticky', left: 0,                                    top: 0, zIndex: 4, backgroundColor: '#f3f4f6' };
const thCode   = { position: 'sticky', left: COL_ACTION_W,                         top: 0, zIndex: 4, backgroundColor: '#f3f4f6' };
const thType   = { position: 'sticky', left: COL_ACTION_W + COL_CODE_W,            top: 0, zIndex: 4, backgroundColor: '#f3f4f6' };
const thTop    = { position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#f3f4f6' };

const tdAction = { position: 'sticky', left: 0,                                    zIndex: 1, backgroundColor: '#ffffff' };
const tdCode   = { position: 'sticky', left: COL_ACTION_W,                         zIndex: 1, backgroundColor: '#ffffff' };
const tdType   = { position: 'sticky', left: COL_ACTION_W + COL_CODE_W,            zIndex: 1, backgroundColor: '#ffffff' };

// ═══════════════════════════════════════════════════════════════════════════
// ASSET TOOLBAR
// Reusable, satu untuk seluruh L9. Merupakan bagian dari AssetSection
// (bukan AssetTable) — AssetTable tetap murni presentational + CRUD display.
//
// UI Refinement — Toolbar Consistency (referensi: L10A.js):
// Layout kini mengikuti pola L10A — Add (kiri, persegi biru tua dengan
// label) + 4 tombol ikon bulat di kanan (Refresh/Reserved/Export Excel/
// Export PDF), memakai icon set & warna yang identik. TIDAK membawa tombol
// "XML Upload" — tombol tersebut khusus milik Lampiran L10, bukan L9.
// Hanya "Add" yang memiliki business logic sungguhan; sisanya placeholder
// murni (Reserved/Export Excel/Export PDF) atau no-op visual (Refresh Table
// — read-only terhadap l9Data, tidak ada request API/reset/mutasi, pola
// identik komentar L10A).
// ═══════════════════════════════════════════════════════════════════════════

const AssetToolbar = ({ onAdd }) => {
    // Refresh Table — no-op yang disengaja (lihat catatan di atas). Tabel
    // sudah reaktif terhadap l9Data melalui render normal React; tombol
    // tetap tersedia agar toolbar identik dengan tampilan Coretax.
    const handleRefreshTable = () => {
        // No-op secara sengaja — tidak ada business logic di sini.
    };

    return (
        <div className="flex items-center gap-2 mb-2">
            <button
                type="button"
                onClick={onAdd}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
                <Add fontSize="small" /> Add
            </button>

            <div className="flex-1" />

            {/* Yellow — Refresh Table (visual aktif, no business logic) */}
            <button
                type="button"
                onClick={handleRefreshTable}
                title="Refresh Table"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 text-white transition-colors"
            >
                <Refresh fontSize="small" />
            </button>
            {/* Grey — Reserved, placeholder murni */}
            <button
                type="button"
                title="Reserved"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-300 text-white cursor-default"
            >
                <MoreHoriz fontSize="small" />
            </button>
            {/* Green — Export Excel, placeholder murni */}
            <button
                type="button"
                title="Export Excel (belum tersedia)"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-green-600 text-white cursor-default opacity-90"
            >
                <GridOn fontSize="small" />
            </button>
            {/* Red — Export PDF, placeholder murni */}
            <button
                type="button"
                title="Export PDF (belum tersedia)"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-red-600 text-white cursor-default opacity-90"
            >
                <PictureAsPdf fontSize="small" />
            </button>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// ASSET MODAL
// SATU modal generic untuk seluruh kategori/subgroup, dipakai untuk Add
// maupun Edit (mode ditentukan oleh ada/tidaknya `initialData`).
//
// Validasi:
// - Required: assetType, monthYear, costOfAcquisition, fiscalBookBeginYear,
//   methodCommercial, methodFiscal, fiscalDeprThisYear (sesuai tanda "*"
//   pada screenshot Gambar66/67).
// - Numeric: costOfAcquisition harus > 0; fiscalBookBeginYear dan
//   fiscalDeprThisYear harus berupa angka >= 0 (boleh 0 — dibiarkan valid
//   karena tidak ada business rule yang melarang, mis. aset dengan sisa
//   buku fiskal nol).
// - Notes: opsional, tidak divalidasi (tidak ada tanda "*" di screenshot).
// - Month/Year Acquisition: raw input string "MM/YYYY", dipilih via
//   MonthYearPicker (bukan free text), required — Business Rule terkonfirmasi.
// ═══════════════════════════════════════════════════════════════════════════

const EMPTY_FORM = {
    assetType:            '',
    monthYear:            '',
    costOfAcquisition:    '',
    fiscalBookBeginYear:  '',
    methodCommercial:     '',
    methodFiscal:         '',
    fiscalDeprThisYear:   '',
    notes:                '',
};

const validateAssetForm = (form) => {
    const errors = {};
    if (!form.assetType) errors.assetType = 'This field is required.';
    if (!form.monthYear) errors.monthYear = 'This field is required.';
    if (!form.methodCommercial) errors.methodCommercial = 'This field is required.';
    if (!form.methodFiscal) errors.methodFiscal = 'This field is required.';

    if (!form.costOfAcquisition || parse(form.costOfAcquisition) <= 0) {
        errors.costOfAcquisition = 'This field is required and must be greater than 0.';
    }
    if (form.fiscalBookBeginYear === '' || form.fiscalBookBeginYear === null || form.fiscalBookBeginYear === undefined) {
        errors.fiscalBookBeginYear = 'This field is required.';
    }
    if (form.fiscalDeprThisYear === '' || form.fiscalDeprThisYear === null || form.fiscalDeprThisYear === undefined) {
        errors.fiscalDeprThisYear = 'This field is required.';
    }
    return errors;
};

const AssetModal = ({ category, subgroup, assetOptions, title, initialData, onClose, onSave }) => {
    const isEdit = !!initialData;
    const [form, setForm] = useState(() => (initialData ? { ...EMPTY_FORM, ...initialData } : { ...EMPTY_FORM }));
    const [errors, setErrors] = useState({});

    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleSave = () => {
        const foundErrors = validateAssetForm(form);
        if (Object.keys(foundErrors).length > 0) {
            setErrors(foundErrors);
            return;
        }
        onSave(form);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Modal Header */}
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-white font-semibold text-sm uppercase">
                            {isEdit ? 'Edit Asset' : 'Add Asset'} — {title}
                        </p>
                        <p className="text-blue-200 text-xs mt-0.5">{category} · {subgroup}</p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <ReadonlyField label="Code Of Asset" value={initialData?.code || ''} />

                    <SelectField
                        label="Asset Type *"
                        value={form.assetType}
                        onChange={set('assetType')}
                        options={assetOptions}
                        error={errors.assetType}
                    />

                    <MonthYearPicker
                        label="Month / Year Acquisition *"
                        value={form.monthYear}
                        onChange={set('monthYear')}
                        error={errors.monthYear}
                    />

                    <RpField
                        label="Cost Of Acquisition *"
                        value={form.costOfAcquisition}
                        onChange={set('costOfAcquisition')}
                        error={errors.costOfAcquisition}
                    />

                    <RpField
                        label="Fiscal Book At The Beginning Of The Year *"
                        value={form.fiscalBookBeginYear}
                        onChange={set('fiscalBookBeginYear')}
                        error={errors.fiscalBookBeginYear}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <SelectField
                            label="Method Of Depreciation — Commercial *"
                            value={form.methodCommercial}
                            onChange={set('methodCommercial')}
                            options={COMMERCIAL_METHODS}
                            error={errors.methodCommercial}
                        />
                        <SelectField
                            label="Method Of Depreciation — Fiscal *"
                            value={form.methodFiscal}
                            onChange={set('methodFiscal')}
                            options={FISCAL_METHODS}
                            error={errors.methodFiscal}
                        />
                    </div>

                    <RpField
                        label="Fiscal Depreciation In This Year *"
                        value={form.fiscalDeprThisYear}
                        onChange={set('fiscalDeprThisYear')}
                        error={errors.fiscalDeprThisYear}
                    />

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                        <input
                            type="text"
                            value={form.notes}
                            onChange={e => set('notes')(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded hover:bg-blue-800 transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// ASSET TABLE
// SATU table generic untuk seluruh subgroup di seluruh kategori.
// Menampilkan rows dari internal state (via props), menyediakan Edit/Delete
// per baris. Tidak memiliki toolbar/modal-trigger di dalamnya (tetap di
// AssetSection, sesuai Architecture Refinement Phase 1).
// ═══════════════════════════════════════════════════════════════════════════

const AssetTable = ({ rows, onEdit, onDelete }) => {
    // Subtotal per-tabel (per subgroup) — murni tampilan lokal tabel ini,
    // terpisah dari Rekap kategori (Total Fiscal Depreciation/Amortization)
    // yang dihitung di level MAIN COMPONENT.
    const subtotal = useMemo(
        () => rows.reduce((sum, r) => sum + parse(r.fiscalDeprThisYear), 0),
        [rows]
    );

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '360px' }}>
                <table className="w-full text-sm border-collapse min-w-[1100px]">
                    <thead>
                        <tr>
                            <th className={thCls} style={{ ...thAction, minWidth: COL_ACTION_W }}>Action</th>
                            <th className={thCls} style={{ ...thCode,   minWidth: COL_CODE_W  }}>Code Of Assets</th>
                            <th className={thCls} style={{ ...thType,   minWidth: COL_TYPE_W  }}>Group/Type Of Asset(s)</th>
                            <th className={`${thCls} text-right`} style={thTop}>Month/Year of Acquisition</th>
                            <th className={`${thCls} text-right`} style={thTop}>Acquisition Price</th>
                            <th className={`${thCls} text-right`} style={thTop}>Remaining Book Value in the Beginning of Year</th>
                            <th className={`${thCls} text-center`} style={thTop} colSpan={2}>Depreciation/Amortization Method<br />Commercial / Fiscal</th>
                            <th className={`${thCls} text-right`} style={thTop}>Fiscal Depreciation/Amortization in This Year</th>
                            <th className={thCls} style={thTop}>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td className={tdCls} style={tdAction} />
                                <td className={tdCls} style={tdCode} />
                                <td className={tdCls} style={tdType} />
                                <td className={tdCls} colSpan={6}>
                                    <span className="text-gray-400 italic">No data found.</span>
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row._uid} className="hover:bg-gray-50 transition-colors">
                                    <td className={tdCls} style={tdAction}>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => onEdit(row)}
                                                title="Edit"
                                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => onDelete(row._uid)}
                                                title="Delete"
                                                className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className={`${tdCls} font-mono`} style={tdCode}>
                                        {row.code || <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className={tdCls} style={tdType}>{row.assetType}</td>
                                    <td className={tdCls}>
                                        {row.monthYear
                                            ? formatMonthYearDisplay(row.monthYear)
                                            : <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className={tdNum}>Rp {fmt(row.costOfAcquisition)}</td>
                                    <td className={tdNum}>Rp {fmt(row.fiscalBookBeginYear)}</td>
                                    <td className={tdCls}>{row.methodCommercial}</td>
                                    <td className={tdCls}>{row.methodFiscal}</td>
                                    <td className={tdNum}>Rp {fmt(row.fiscalDeprThisYear)}</td>
                                    <td className={tdCls}>{row.notes || <span className="text-gray-400">—</span>}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-50">
                            <td className={tdCls} colSpan={8} />
                            <td className={`${tdNum} font-semibold`}>TOTAL&nbsp;&nbsp;Rp {subtotal !== 0 ? fmt(subtotal) : '0,00'}</td>
                            <td className={tdCls} />
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// ASSET SECTION
// Accordion generic per kategori. Loop subgroups dari config.
// Struktur: AssetSection → AssetToolbar → AssetTable (per subgroup).
// CRUD di-passthrough dari MAIN COMPONENT — AssetSection tidak menyimpan
// data sendiri (tidak ada duplicate state), hanya meneruskan rows & handler.
// ═══════════════════════════════════════════════════════════════════════════

const AssetSection = ({ categoryKey, categoryLabel, subgroups, assetOptions, categoryData, onAddRow, onUpdateRow, onDeleteRow }) => {
    const [expanded, setExpanded]         = useState(false);
    const [modalState, setModalState]     = useState(null); // { subgroupKey, editingRow | null } | null

    const activeSubgroup = modalState ? subgroups.find(sg => sg.key === modalState.subgroupKey) : null;

    const handleAdd = (subgroupKey) => setModalState({ subgroupKey, editingRow: null });
    const handleEdit = (subgroupKey, row) => setModalState({ subgroupKey, editingRow: row });
    const handleCloseModal = () => setModalState(null);

    const handleSaveModal = (formData) => {
        if (!modalState) return;
        if (modalState.editingRow) {
            onUpdateRow(categoryKey, modalState.subgroupKey, modalState.editingRow._uid, formData);
        } else {
            onAddRow(categoryKey, modalState.subgroupKey, formData);
        }
    };

    const handleDelete = (subgroupKey, uid) => {
        if (window.confirm('Delete this asset row? This action cannot be undone.')) {
            onDeleteRow(categoryKey, subgroupKey, uid);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
            <button
                type="button"
                onClick={() => setExpanded(prev => !prev)}
                className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <span className="text-sm font-bold text-blue-800 uppercase tracking-wide">
                    {expanded ? '▾' : '▸'} {categoryLabel}
                </span>
            </button>

            {expanded && (
                <div className="p-5">
                    {subgroups.map((sg) => {
                        const rows = categoryData[sg.key] || [];
                        return (
                            <div key={sg.key} className="mb-6">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                                    {sg.title}
                                </p>

                                <AssetToolbar
                                    onAdd={() => handleAdd(sg.key)}
                                />

                                <AssetTable
                                    rows={rows}
                                    onEdit={(row) => handleEdit(sg.key, row)}
                                    onDelete={(uid) => handleDelete(sg.key, uid)}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {activeSubgroup && (
                <AssetModal
                    category={categoryKey}
                    subgroup={activeSubgroup.key}
                    assetOptions={assetOptions}
                    title={activeSubgroup.title}
                    initialData={modalState.editingRow}
                    onClose={handleCloseModal}
                    onSave={handleSaveModal}
                />
            )}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// Phase 3: Integration — L9 menjadi CONTROLLED COMPONENT.
//
// Source of Truth `l9Data` berada di SptTahunanBadan.js (pola identik
// l1aRowsA/l2RowsA/l7Rows/l8GrossTurnover). L9 menerima `l9Data` sebagai
// prop (restore/Load Draft) dan mengirim setiap perubahan CRUD ke parent
// via `onL9DataChange` (pola identik onRowsAChange L1A).
//
// Header menerima props { taxYear, tin } (Header Preparation Phase 1),
// kini benar-benar dihubungkan ke sptData.header/company_identity di
// SptTahunanBadan.js.
// ═══════════════════════════════════════════════════════════════════════════

// Initial state Pendekatan B — di-generate dari L9_CATEGORIES (generic,
// tidak hardcode nama subgroup di luar config). Selalu menghasilkan objek
// BARU (bukan mutasi referensi lain) sehingga aman dipakai sebagai initial
// state maupun sebagai basis merge.
export const buildInitialL9Data = () => {
    const data = {};
    L9_CATEGORIES.forEach(cat => {
        data[cat.key] = {};
        cat.subgroups.forEach(sg => {
            data[cat.key][sg.key] = [];
        });
    });
    // Rekap — raw input di level l9Data (bukan computed), sesuai Business
    // Rule Update: Total Of Commercial Depreciation & Total Commercial
    // Amortization diisi langsung oleh user. Disimpan sebagai digit string
    // (format sama seperti field RpField lain di dalam form aset).
    data.totalCommercialDepreciation = '';
    data.totalCommercialAmortization = '';
    return data;
};

// mergeWithInitial — dipakai untuk Load Draft: menggabungkan raw data dari
// draft/backend dengan struktur lengkap Blueprint (tangible/building/
// intangible × seluruh subgroup, + rekap raw input), sehingga l9Data SELALU
// punya struktur valid meskipun draft yang di-restore tidak lengkap (mis.
// draft lama sebelum ada subgroup/field baru). Immutable — membangun objek
// nested baru, tidak pernah menulis ke `draft` maupun ke initial state
// sebelumnya.
export const mergeWithInitial = (draft) => {
    const initial = buildInitialL9Data();
    if (!draft) return initial;
    const merged = {};
    L9_CATEGORIES.forEach(cat => {
        merged[cat.key] = {};
        cat.subgroups.forEach(sg => {
            const draftRows = draft?.[cat.key]?.[sg.key];
            merged[cat.key][sg.key] = Array.isArray(draftRows)
                ? draftRows
                : initial[cat.key][sg.key];
        });
    });
    merged.totalCommercialDepreciation = draft.totalCommercialDepreciation ?? initial.totalCommercialDepreciation;
    merged.totalCommercialAmortization = draft.totalCommercialAmortization ?? initial.totalCommercialAmortization;
    return merged;
};

let uidCounter = 0;
// Internal row id — HANYA untuk keperluan React key & target CRUD.
// Ini BUKAN "Code of Asset" (field bisnis yang tetap kosong/out-of-scope
// sesuai kontrak sebelumnya).
const generateUid = () => {
    uidCounter += 1;
    return `row_${Date.now()}_${uidCounter}`;
};

// Props:
//   taxYear, tin         — readonly header, dari sptData di SptTahunanBadan.js
//   l9Data                — raw data dari SptTahunanBadan.js (restore draft)
//   onL9DataChange         — emit ke parent SETIAP CRUD (Add/Edit/Delete),
//                            pola identik onRowsAChange L1A
const L9 = ({ taxYear = '', tin = '', l9Data: l9DataProp, onL9DataChange } = {}) => {
    const [l9Data, setL9Data] = useState(() =>
        l9DataProp ? mergeWithInitial(l9DataProp) : buildInitialL9Data()
    );

    // Ref anti-loop: tandai jika perubahan l9Data berasal dari child itu
    // sendiri (via onL9DataChange), sehingga useEffect restore di bawah
    // tidak memantul balik. Pola identik skipRestoreA/skipRestoreB L1A.
    const skipRestoreL9 = useRef(false);

    // Restore saat Load Draft: l9DataProp berubah dari parent (mis. hasil
    // parse localStorage/backend). Guard: skip jika perubahan berasal dari
    // onL9DataChange (child→parent→child loop).
    useEffect(() => {
        if (skipRestoreL9.current) { skipRestoreL9.current = false; return; }
        if (l9DataProp) {
            setL9Data(mergeWithInitial(l9DataProp));
        }
    }, [l9DataProp]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── CRUD handlers — immutable update, emit ke parent di titik mutasi
    // (pola identik handleSaveA L1A: set guard TRUE tepat sebelum
    // memanggil onL9DataChange). Tidak ada duplicate state — l9Data lokal
    // ini SATU-SATUNYA representasi, hanya di-mirror ke parent.

    const handleAddRow = (categoryKey, subgroupKey, formData) => {
        setL9Data(prev => {
            const newRow = { _uid: generateUid(), code: '', ...formData };
            const next = {
                ...prev,
                [categoryKey]: {
                    ...prev[categoryKey],
                    [subgroupKey]: [...prev[categoryKey][subgroupKey], newRow],
                },
            };
            if (onL9DataChange) {
                skipRestoreL9.current = true; // cegah loop: perubahan ini dari child sendiri
                onL9DataChange(next);
            }
            return next;
        });
    };

    const handleUpdateRow = (categoryKey, subgroupKey, uid, formData) => {
        setL9Data(prev => {
            const next = {
                ...prev,
                [categoryKey]: {
                    ...prev[categoryKey],
                    [subgroupKey]: prev[categoryKey][subgroupKey].map(r =>
                        r._uid === uid ? { ...r, ...formData } : r
                    ),
                },
            };
            if (onL9DataChange) {
                skipRestoreL9.current = true;
                onL9DataChange(next);
            }
            return next;
        });
    };

    const handleDeleteRow = (categoryKey, subgroupKey, uid) => {
        setL9Data(prev => {
            const next = {
                ...prev,
                [categoryKey]: {
                    ...prev[categoryKey],
                    [subgroupKey]: prev[categoryKey][subgroupKey].filter(r => r._uid !== uid),
                },
            };
            if (onL9DataChange) {
                skipRestoreL9.current = true;
                onL9DataChange(next);
            }
            return next;
        });
    };

    // ── Calculation (useMemo) — recalculate otomatis setiap l9Data berubah ──

    const sumCategoryFiscal = (categoryKeys) => {
        let total = 0;
        L9_CATEGORIES.forEach(cat => {
            if (!categoryKeys.includes(cat.key)) return;
            cat.subgroups.forEach(sg => {
                const rows = l9Data[cat.key]?.[sg.key] || [];
                rows.forEach(r => { total += parse(r.fiscalDeprThisYear); });
            });
        });
        return total;
    };

    const totalFiscalDepreciation = useMemo(
        () => sumCategoryFiscal(DEPRECIATION_CATEGORY_KEYS),
        [l9Data]
    ); // eslint-disable-line react-hooks/exhaustive-deps

    const totalFiscalAmortization = useMemo(
        () => sumCategoryFiscal(AMORTIZATION_CATEGORY_KEYS),
        [l9Data]
    ); // eslint-disable-line react-hooks/exhaustive-deps

    // Difference — Business Rule Update: Total Commercial Depreciation/
    // Amortization sekarang Raw Input (bukan lagi Pending), sehingga
    // Difference dapat dihitung penuh. Computed, readonly, TIDAK disimpan
    // ke l9Data — selalu dihitung ulang dari totalFiscal & totalCommercial
    // (otomatis re-run setelah Load Draft karena bergantung pada l9Data).
    const differenceDepreciation = useMemo(
        () => totalFiscalDepreciation - parse(l9Data.totalCommercialDepreciation),
        [totalFiscalDepreciation, l9Data.totalCommercialDepreciation]
    );

    const differenceAmortization = useMemo(
        () => totalFiscalAmortization - parse(l9Data.totalCommercialAmortization),
        [totalFiscalAmortization, l9Data.totalCommercialAmortization]
    );

    // Handler untuk rekap raw input (Total Commercial Depreciation/
    // Amortization) — immutable update + emit ke parent di titik mutasi,
    // pola identik CRUD handler di atas (skipRestoreL9 guard).
    const handleTotalCommercialChange = (field, value) => {
        setL9Data(prev => {
            const next = { ...prev, [field]: value };
            if (onL9DataChange) {
                skipRestoreL9.current = true;
                onL9DataChange(next);
            }
            return next;
        });
    };

    // Kategori diambil eksplisit by key (bukan index array) agar urutan
    // render tidak rapuh terhadap perubahan urutan L9_CATEGORIES — posisi
    // Rekapitulasi Penyusutan (antara Building dan Intangible) adalah
    // Business Rule, bukan detail teknis.
    const tangibleCategory   = L9_CATEGORIES.find(c => c.key === 'tangible');
    const buildingCategory   = L9_CATEGORIES.find(c => c.key === 'building');
    const intangibleCategory = L9_CATEGORIES.find(c => c.key === 'intangible');

    const renderAssetSection = (cat) => (
        <AssetSection
            key={cat.key}
            categoryKey={cat.key}
            categoryLabel={cat.label}
            subgroups={cat.subgroups}
            assetOptions={cat.assetOptions}
            categoryData={l9Data[cat.key]}
            onAddRow={handleAddRow}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
        />
    );

    return (
        <div className="p-6 space-y-6">
            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 9 — Daftar Penyusutan dan Amortisasi Fiskal
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Period Year" value={taxYear} />
                    <ReadonlyField label="TIN/NIK" value={tin} />
                </div>
            </div>

            {/* ── TANGIBLE ASSET ──────────────────────────────────────────── */}
            {renderAssetSection(tangibleCategory)}

            {/* ── BUILDING(S) ─────────────────────────────────────────────── */}
            {renderAssetSection(buildingCategory)}

            {/* ── REKAP PENYUSUTAN — posisi: setelah Building(s), sebelum
                Intangible Asset (Business Rule Update) ───────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Rekapitulasi Penyusutan
                </p>
                <ReadonlyField label="Total Of Fiscal Depreciation" value={totalFiscalDepreciation !== 0 ? fmt(totalFiscalDepreciation) : '0,00'} prefix="Rp" />
                <RpField
                    label="Total Of Commercial Depreciation"
                    value={l9Data.totalCommercialDepreciation}
                    onChange={(val) => handleTotalCommercialChange('totalCommercialDepreciation', val)}
                />
                <ReadonlyField label="Differences Of Depreciation" value={fmt(differenceDepreciation) || '0,00'} prefix="Rp" />
            </div>

            {/* ── INTANGIBLE ASSET ────────────────────────────────────────── */}
            {renderAssetSection(intangibleCategory)}

            {/* ── REKAP AMORTISASI — tetap setelah Intangible Asset ───────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Rekapitulasi Amortisasi
                </p>
                <ReadonlyField label="Total Fiscal Amortization" value={totalFiscalAmortization !== 0 ? fmt(totalFiscalAmortization) : '0,00'} prefix="Rp" />
                <RpField
                    label="Total Commercial Amortization"
                    value={l9Data.totalCommercialAmortization}
                    onChange={(val) => handleTotalCommercialChange('totalCommercialAmortization', val)}
                />
                <ReadonlyField label="Differences Of Amortization" value={fmt(differenceAmortization) || '0,00'} prefix="Rp" />
            </div>
        </div>
    );
};

export default L9;