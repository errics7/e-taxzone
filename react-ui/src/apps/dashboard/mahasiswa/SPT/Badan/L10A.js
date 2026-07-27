import React, { useState, useMemo, useCallback } from 'react';
import { Add, Edit, Delete, Refresh, Upload, MoreHoriz, GridOn, PictureAsPdf } from '@mui/icons-material';

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE DATA — Blueprint Final Revisi 5 §2 (Reference Data Contract)
//
// PRINSIP: Reference Data BUKAN business logic. Business logic (state
// l10aRows) hanya menyimpan VALUE yang dipilih user (string), bukan array
// pilihan ini. Apabila daftar ini berubah di kemudian hari, tidak ada satupun
// baris business logic di bawah yang perlu diubah.
//
// CATATAN IMPLEMENTASI: file referensi terpusat milik project (mis. module
// shared "reference-data" yang dipakai dropdown Country di Lampiran lain)
// tidak tersedia di antara file yang diberikan pada tahap Blueprint. Daftar
// di bawah ini didefinisikan lokal agar L10A tetap dapat berjalan mandiri,
// namun dipisahkan secara eksplisit dari business logic supaya mudah
// digantikan dengan import dari module reference data project yang sebenarnya
// begitu tersedia (lihat catatan Self-Review — Risiko Implementasi §1).
// ─────────────────────────────────────────────────────────────────────────────
const COUNTRY_OPTIONS = [
    'Indonesia', 'Singapore', 'Malaysia', 'Japan', 'China', 'United States',
    'Hong Kong', 'South Korea', 'Australia', 'Netherlands', 'United Kingdom',
    'Germany', 'India', 'Thailand', 'Vietnam', 'Philippines', 'Taiwan',
    'British Virgin Islands', 'Cayman Islands', 'Switzerland',
];

const TYPE_OF_RELATIONSHIP_OPTIONS = [
    'Parent Company',
    'Subsidiary',
    'Sister Company',
    'Shareholder',
    'Management Control',
    'Technology Control',
];

// "Gunakan reference data aplikasi" — Blueprint tidak mem-fix daftar ini,
// disiapkan sebagai representative reference data list (bukan hardcode
// business rule), siap diganti dengan reference data module project.
const TYPE_OF_TRANSACTION_OPTIONS = [
    'Sale of Goods',
    'Purchase of Goods',
    'Provision of Services',
    'Receipt of Services',
    'Loan Given',
    'Loan Received',
    'Royalty',
    'Interest',
    'Guarantee',
    'Cost Sharing',
    'Other',
];

const PRICING_METHOD_OPTIONS = [
    'Comparable Uncontrolled Price (CUP)',
    'Resale Price Method (RPM)',
    'Cost Plus Method',
    'Transactional Net Margin Method (TNMM)',
    'Profit Split Method',
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — Formatter & Parser Rupiah
// Pola identik formatNumber yang sudah dipakai Lampiran/Section lain
// (MainFormBadan.js): new Intl.NumberFormat('id-ID').format(...), plus
// parseFloat(value.replace(/[.,]/g, '')) untuk parsing balik ke number.
// Internal Data Representation Contract: Raw State transactionValue SELALU
// number murni — formatter HANYA dipakai di titik render (Blueprint Final
// Revisi 5 §5 — Internal Data Representation).
// ─────────────────────────────────────────────────────────────────────────────
const formatRupiahDisplay = (value) => new Intl.NumberFormat('id-ID').format(value || 0);
const parseRupiahInput = (str) => parseFloat(String(str).replace(/[.,]/g, '')) || 0;

// fmtRp — DISPLAY-ONLY formatter untuk nominal pada tabel (pola identik
// L1A/L1C/L1D/L9). Tidak dipakai oleh input Transaction Value (yang tetap
// pakai formatRupiahDisplay/parseRupiahInput di atas), tidak mengubah
// state/value manapun. Prefix "Rp" tanpa spasi ("Rp1.000.000"); tanda minus
// (bila ada) diletakkan SEBELUM "Rp" ("-Rp35.000", bukan "Rp-35.000").
const fmtRp = (value) => {
    const n = Number(value) || 0;
    return (n < 0 ? '-Rp' : 'Rp') + new Intl.NumberFormat('id-ID').format(Math.abs(n));
};

// ─────────────────────────────────────────────────────────────────────────────
// INPUT SANITIZATION — TIN & Name (UI/UX refinement, bukan Business Rule baru)
//
// Tidak ditemukan helper validasi huruf/angka existing di file yang tersedia
// (MainFormBadan.js/SptTahunanBadan.js), sehingga helper berikut dibuat lokal
// per-file, mengikuti konvensi yang sudah ada (formatRupiahDisplay/parseRupiahInput
// di atas juga didefinisikan lokal per file, bukan diimpor dari module bersama).
//
// TIN  : hanya menerima digit 0-9 — karakter lain langsung ditolak saat diketik.
// Name : menerima huruf, angka, spasi, titik (.), koma (,), apostrof ('),
//        tanda hubung (-), ampersand (&), dan tanda kurung ( ) — sesuai daftar
//        karakter yang diizinkan pada instruksi revisi UI/UX.
// ─────────────────────────────────────────────────────────────────────────────
const sanitizeTinChars = (value) => value.replace(/[^0-9]/g, '');
const sanitizeNameChars = (value) => value.replace(/[^a-zA-Z0-9 .,'&()-]/g, '');
const TIN_WARNING_MESSAGE = 'TIN hanya boleh berisi angka.';
const NAME_WARNING_MESSAGE = "Name hanya boleh berisi huruf, angka, spasi, dan karakter . , ' - & ( ).";

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — Row identifier (frontend-only, BUKAN primary key database —
// Blueprint Final Revisi 5 §7/§14 — Row Identifier).
// ─────────────────────────────────────────────────────────────────────────────
const generateRowId = () => `l10a-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const buildEmptyL10AForm = () => ({
    tin: '',
    name: '',
    country: '',
    typeOfRelationship: '',
    businessActivity: '',
    typeOfTransaction: '',
    transactionValue: 0,
    pricingMethodApplied: '',
    reasonOfPricingMethod: '',
});

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION — Blueprint Final Revisi 5 §13 (Validation Contract)
// Seluruh 9 field L10A bersifat mandatory. Digunakan pada Validasi Modal
// (sebelum Save) — TIDAK dipakai untuk memblokir Save Draft (permisif).
// ─────────────────────────────────────────────────────────────────────────────
const validateL10AForm = (form) => {
    const errors = {};
    if (!form.tin || !form.tin.trim()) errors.tin = 'TIN wajib diisi.';
    if (!form.name || !form.name.trim()) errors.name = 'Name wajib diisi.';
    if (!form.country) errors.country = 'Country wajib dipilih.';
    if (!form.typeOfRelationship) errors.typeOfRelationship = 'Type of Relationship wajib dipilih.';
    if (!form.businessActivity || !form.businessActivity.trim()) errors.businessActivity = 'Business Activity wajib diisi.';
    if (!form.typeOfTransaction) errors.typeOfTransaction = 'Type of Transaction wajib dipilih.';
    if (!form.transactionValue || Number(form.transactionValue) <= 0) errors.transactionValue = 'Transaction Value wajib diisi.';
    if (!form.pricingMethodApplied) errors.pricingMethodApplied = 'Pricing Method Applied wajib dipilih.';
    if (!form.reasonOfPricingMethod || !form.reasonOfPricingMethod.trim()) errors.reasonOfPricingMethod = 'Reason of Pricing Method Application wajib diisi.';
    return errors;
};

// Dipakai oleh Pay And Submit (bukan Save Draft) — Validation Contract:
// tabel tidak boleh kosong ketika lampiran ini ditampilkan, DAN setiap row
// yang ada harus lolos validateL10AForm (tidak ada row setengah-jadi).
export const validateL10ARowsForSubmit = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) {
        return { valid: false, message: 'L10A: minimal 1 data pihak terkait wajib diisi.' };
    }
    const invalidRow = rows.find((row) => Object.keys(validateL10AForm(row)).length > 0);
    if (invalidRow) {
        return { valid: false, message: 'L10A: terdapat data pihak terkait yang belum lengkap.' };
    }
    return { valid: true, message: '' };
};

// ─────────────────────────────────────────────────────────────────────────────
// ReadonlyField — pola identik L1D.js (UI Reference/Source of Truth untuk
// Header Lampiran). Menggunakan <div>, bukan <input readOnly>, sehingga tidak
// ada isu cursor sama sekali dan tampilan konsisten dengan Lampiran lain.
// ─────────────────────────────────────────────────────────────────────────────
const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MODAL — Add/Edit — dideklarasikan DI LUAR komponen utama agar tidak dibuat
// ulang setiap render (mencegah focus loss pada input), pola identik
// SectionHeader/Alert di MainFormBadan.js.
// ─────────────────────────────────────────────────────────────────────────────
const L10AModal = ({ mode, formData, errors, warnings, onFieldChange, onSave, onClose }) => {
    if (!mode) return null;
    const isEdit = mode === 'edit';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800">List of Related Parties</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">TIN <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.tin}
                            placeholder="TIN of Transaction Partner"
                            onChange={(e) => onFieldChange('tin', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.tin ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.tin && <p className="text-xs text-red-500 mt-1">{errors.tin}</p>}
                        {!errors.tin && warnings.tin && <p className="text-xs text-amber-600 mt-1">{warnings.tin}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => onFieldChange('name', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        {!errors.name && warnings.name && <p className="text-xs text-amber-600 mt-1">{warnings.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Country <span className="text-red-500">*</span></label>
                        <select
                            value={formData.country}
                            onChange={(e) => onFieldChange('country', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.country ? 'border-red-400' : 'border-gray-300'}`}
                        >
                            <option value="">Please Select</option>
                            {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Type Of Relationship <span className="text-red-500">*</span></label>
                        <select
                            value={formData.typeOfRelationship}
                            onChange={(e) => onFieldChange('typeOfRelationship', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.typeOfRelationship ? 'border-red-400' : 'border-gray-300'}`}
                        >
                            <option value="">Please Select</option>
                            {TYPE_OF_RELATIONSHIP_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                        {errors.typeOfRelationship && <p className="text-xs text-red-500 mt-1">{errors.typeOfRelationship}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Activity <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.businessActivity}
                            onChange={(e) => onFieldChange('businessActivity', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.businessActivity ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.businessActivity && <p className="text-xs text-red-500 mt-1">{errors.businessActivity}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Type of Transaction <span className="text-red-500">*</span></label>
                        <select
                            value={formData.typeOfTransaction}
                            onChange={(e) => onFieldChange('typeOfTransaction', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.typeOfTransaction ? 'border-red-400' : 'border-gray-300'}`}
                        >
                            <option value="">Please Select</option>
                            {TYPE_OF_TRANSACTION_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                        {errors.typeOfTransaction && <p className="text-xs text-red-500 mt-1">{errors.typeOfTransaction}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Transaction Value <span className="text-red-500">*</span></label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-100 text-gray-500 text-sm">Rp.</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={formData.transactionValue ? formatRupiahDisplay(formData.transactionValue) : ''}
                                onChange={(e) => onFieldChange('transactionValue', parseRupiahInput(e.target.value))}
                                className={`w-full px-3 py-2 border rounded-r-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.transactionValue ? 'border-red-400' : 'border-gray-300'}`}
                            />
                        </div>
                        {errors.transactionValue && <p className="text-xs text-red-500 mt-1">{errors.transactionValue}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Pricing Method Applied <span className="text-red-500">*</span></label>
                        <select
                            value={formData.pricingMethodApplied}
                            onChange={(e) => onFieldChange('pricingMethodApplied', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.pricingMethodApplied ? 'border-red-400' : 'border-gray-300'}`}
                        >
                            <option value="">Please Select</option>
                            {PRICING_METHOD_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                        {errors.pricingMethodApplied && <p className="text-xs text-red-500 mt-1">{errors.pricingMethodApplied}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason of Pricing Method Application <span className="text-red-500">*</span></label>
                        <textarea
                            rows={3}
                            value={formData.reasonOfPricingMethod}
                            onChange={(e) => onFieldChange('reasonOfPricingMethod', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.reasonOfPricingMethod ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.reasonOfPricingMethod && <p className="text-xs text-red-500 mt-1">{errors.reasonOfPricingMethod}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                        Close
                    </button>
                    <button
                        onClick={onSave}
                        className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRMATION DIALOG — Blueprint Final Revisi 5 §12 (Delete Contract)
// Prinsip mutlak: delete TIDAK PERNAH terjadi langsung, selalu lewat dialog ini.
// ─────────────────────────────────────────────────────────────────────────────
const DeleteConfirmDialog = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-2">Delete Confirmation</h3>
                <p className="text-sm text-gray-600 mb-6">Apakah Anda yakin ingin menghapus data ini?</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// L10A — Declaration of Transaction with Related Parties
// ─────────────────────────────────────────────────────────────────────────────
const L10A = ({ taxYear, tin, rows, onRowsChange }) => {
    const safeRows = rows || [];

    // ── Modal state (Blueprint Final Revisi 5 §11 — Modal Contract) ───────────
    const [modalMode, setModalMode] = useState(null); // null | 'create' | 'edit'
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [formData, setFormData] = useState(buildEmptyL10AForm());
    const [formErrors, setFormErrors] = useState({});
    const [fieldWarnings, setFieldWarnings] = useState({});

    // ── Delete confirmation state (Blueprint Final Revisi 5 §12) ──────────────
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const resetForm = useCallback(() => {
        setFormData(buildEmptyL10AForm());
        setFormErrors({});
        setFieldWarnings({});
    }, []);

    const handleOpenAdd = useCallback(() => {
        setModalMode('create');
        setSelectedRowId(null);
        resetForm();
    }, [resetForm]);

    const handleOpenEdit = useCallback((row) => {
        setModalMode('edit');
        setSelectedRowId(row.id);
        // Deep copy — mencegah mutasi tidak sengaja pada row asli sebelum Save.
        setFormData({ ...buildEmptyL10AForm(), ...row });
        setFormErrors({});
        setFieldWarnings({});
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalMode(null);
        setSelectedRowId(null);
        resetForm();
    }, [resetForm]);

    const handleFieldChange = useCallback((field, value) => {
        if (field === 'tin') {
            const sanitized = sanitizeTinChars(value);
            setFieldWarnings((prev) => ({ ...prev, tin: sanitized !== value ? TIN_WARNING_MESSAGE : '' }));
            setFormData((prev) => ({ ...prev, tin: sanitized }));
            return;
        }
        if (field === 'name') {
            const sanitized = sanitizeNameChars(value);
            setFieldWarnings((prev) => ({ ...prev, name: sanitized !== value ? NAME_WARNING_MESSAGE : '' }));
            setFormData((prev) => ({ ...prev, name: sanitized }));
            return;
        }
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = useCallback(() => {
        const errors = validateL10AForm(formData);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return; // Validation gagal → modal tetap terbuka

        if (modalMode === 'create') {
            const newRow = { id: generateRowId(), ...formData };
            onRowsChange([...safeRows, newRow]);
        } else if (modalMode === 'edit') {
            const updatedRows = safeRows.map((row) => (row.id === selectedRowId ? { ...formData, id: selectedRowId } : row));
            onRowsChange(updatedRows);
        }
        setModalMode(null);
        setSelectedRowId(null);
        resetForm();
    }, [formData, modalMode, selectedRowId, safeRows, onRowsChange, resetForm]);

    // ── Delete Flow — selalu lewat Confirmation Dialog ─────────────────────────
    const handleRequestDelete = useCallback((rowId) => setPendingDeleteId(rowId), []);
    const handleCancelDelete = useCallback(() => setPendingDeleteId(null), []);
    const handleConfirmDelete = useCallback(() => {
        onRowsChange(safeRows.filter((row) => row.id !== pendingDeleteId));
        setPendingDeleteId(null);
    }, [safeRows, pendingDeleteId, onRowsChange]);

    // ── Toolbar — Refresh Table (Yellow Button) ────────────────────────────────
    // Blueprint Final Revisi 5 — Toolbar Contract L10A: read-only terhadap
    // state, TIDAK ADA request API/reset/mutasi. Tidak menggunakan forceUpdate
    // atau hack render lain — di sini benar-benar no-op karena tabel sudah
    // reaktif terhadap `rows` melalui render normal React; tombol tetap
    // tersedia agar toolbar identik dengan tampilan Coretax.
    const handleRefreshTable = useCallback(() => {
        // No-op secara sengaja — lihat catatan di atas.
    }, []);

    const rowCount = safeRows.length;

    return (
        <div className="bg-white">
            <div className="p-6 space-y-4">
                {/* ── HEADER (pola identik L1D.js) ───────────────────────────────── */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                        Lampiran 10A — Declaration of Transaction with Related Parties
                    </h2>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <ReadonlyField label="Tax Year" value={taxYear} />
                        <ReadonlyField label="TIN (NPWP)" value={tin} />
                    </div>
                </div>

                <div className="text-sm font-semibold text-gray-700">List of Related Parties</div>

                {/* Toolbar — Blueprint Final Revisi 5: Add & Refresh aktif, sisanya placeholder */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                        <Add fontSize="small" /> Add
                    </button>
                    {/* XML Upload — Placeholder murni (Blueprint §16): no callback, no handler */}
                    <button
                        type="button"
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-default">
                        <Upload fontSize="small" /> XML Upload
                    </button>
                    <div className="flex-1" />
                    {/* Yellow — Refresh Table (Aktif, read-only) */}
                    <button
                        type="button"
                        onClick={handleRefreshTable}
                        title="Refresh Table"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 text-white transition-colors">
                        <Refresh fontSize="small" />
                    </button>
                    {/* Grey — Placeholder murni */}
                    <button
                        type="button"
                        title="Reserved"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-300 text-white cursor-default">
                        <MoreHoriz fontSize="small" />
                    </button>
                    {/* Green — Placeholder murni (Export Excel — out of scope fase ini) */}
                    <button
                        type="button"
                        title="Export Excel (belum tersedia)"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-green-600 text-white cursor-default opacity-90">
                        <GridOn fontSize="small" />
                    </button>
                    {/* Red — Placeholder murni (Export PDF — out of scope fase ini) */}
                    <button
                        type="button"
                        title="Export PDF (belum tersedia)"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-red-600 text-white cursor-default opacity-90">
                        <PictureAsPdf fontSize="small" />
                    </button>
                </div>

                {/* Table — sticky header + freeze kolom Action & No — style mengikuti L13A */}
                <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-[520px] overflow-y-auto">
                    <table className="min-w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-yellow-400 text-xs font-bold text-gray-800 uppercase">
                                <th style={{ position: 'sticky', top: 0, left: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-20">Action</th>
                                <th style={{ position: 'sticky', top: 0, left: 80, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-12">No</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Name</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">NPWP/TIN</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Country</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Type of Relationship</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Business Activity</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Type of Transaction</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Transaction Value</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Pricing Method Applied</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Reason of Pricing Method Application</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowCount === 0 && (
                                <tr>
                                    <td colSpan={11} className="px-3 py-8 text-center text-gray-400 text-sm border border-gray-200">No data found.</td>
                                </tr>
                            )}
                            {safeRows.map((row, idx) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td style={{ position: 'sticky', left: 0, zIndex: 10 }} className="bg-white px-3 py-2 whitespace-nowrap border border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpenEdit(row)} className="text-blue-600 hover:text-blue-800" title="Edit">
                                                <Edit fontSize="small" />
                                            </button>
                                            <button onClick={() => handleRequestDelete(row.id)} className="text-red-500 hover:text-red-700" title="Delete">
                                                <Delete fontSize="small" />
                                            </button>
                                        </div>
                                    </td>
                                    <td style={{ position: 'sticky', left: 80, zIndex: 10 }} className="bg-white px-3 py-2 text-gray-700 border border-gray-200">{idx + 1}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.name}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.tin}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.country}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.typeOfRelationship}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.businessActivity}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.typeOfTransaction}</td>
                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{fmtRp(row.transactionValue)}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.pricingMethodApplied}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap max-w-xs truncate border border-gray-200" title={row.reasonOfPricingMethod}>{row.reasonOfPricingMethod}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <L10AModal
                mode={modalMode}
                formData={formData}
                errors={formErrors}
                warnings={fieldWarnings}
                onFieldChange={handleFieldChange}
                onSave={handleSave}
                onClose={handleCloseModal}
            />
            <DeleteConfirmDialog
                open={!!pendingDeleteId}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default L10A;