import React, { useState, useCallback } from 'react';
import { Add, Edit, Delete } from '@mui/icons-material';

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE DATA — Blueprint Final Revisi 5 §2 (Reference Data Contract)
// Sama seperti L10A: value ini BUKAN business logic, hanya daftar pilihan.
// Country Code berbeda representasi dari Country Name di L10A (satu master
// negara, dua bentuk tampil/simpan — lihat Blueprint §2).
// ─────────────────────────────────────────────────────────────────────────────
const COUNTRY_CODE_OPTIONS = [
    'ID', 'SG', 'MY', 'JP', 'CN', 'US', 'HK', 'KR', 'AU', 'NL',
    'GB', 'DE', 'IN', 'TH', 'VN', 'PH', 'TW', 'VG', 'KY', 'CH',
];

const TYPE_OF_TRANSACTION_CODE_OPTIONS = [
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

const formatRupiahDisplay = (value) => new Intl.NumberFormat('id-ID').format(value || 0);
const parseRupiahInput = (str) => parseFloat(String(str).replace(/[.,]/g, '')) || 0;

// fmtRp — DISPLAY-ONLY formatter untuk nominal pada tabel (pola identik
// L10A/L1A/L1C/L1D/L9). Tidak dipakai oleh input Transaction Value (yang
// tetap pakai formatRupiahDisplay/parseRupiahInput di atas), tidak mengubah
// state/value manapun. Prefix "Rp" tanpa spasi ("Rp1.000.000"); tanda minus
// (bila ada) diletakkan SEBELUM "Rp" ("-Rp35.000", bukan "Rp-35.000").
const fmtRp = (value) => {
    const n = Number(value) || 0;
    return (n < 0 ? '-Rp' : 'Rp') + new Intl.NumberFormat('id-ID').format(Math.abs(n));
};

// ─────────────────────────────────────────────────────────────────────────────
// INPUT SANITIZATION — Name of Transaction Partner (UI/UX refinement, bukan
// Business Rule baru). Pola identik L10A: field bertipe "Name" hanya menerima
// huruf, angka, spasi, titik (.), koma (,), apostrof ('), tanda hubung (-),
// ampersand (&), dan tanda kurung ( ).
// ─────────────────────────────────────────────────────────────────────────────
const sanitizeNameChars = (value) => value.replace(/[^a-zA-Z0-9 .,'&()-]/g, '');
const NAME_WARNING_MESSAGE = "Name hanya boleh berisi huruf, angka, spasi, dan karakter . , ' - & ( ).";

const generateRowId = () => `l10c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const buildEmptyL10CForm = () => ({
    nameOfTransactionPartner: '',
    typeOfTransactionCode: '',
    countryCode: '',
    transactionValue: 0,
});

// Blueprint Final Revisi 5 §13 — Validation Contract: 4 field mandatory.
const validateL10CForm = (form) => {
    const errors = {};
    if (!form.nameOfTransactionPartner || !form.nameOfTransactionPartner.trim()) errors.nameOfTransactionPartner = 'Name of Transaction Partner wajib diisi.';
    if (!form.typeOfTransactionCode) errors.typeOfTransactionCode = 'Type of Transaction Code wajib dipilih.';
    if (!form.countryCode) errors.countryCode = 'Country Code wajib dipilih.';
    if (!form.transactionValue || Number(form.transactionValue) <= 0) errors.transactionValue = 'Transaction Value wajib diisi.';
    return errors;
};

export const validateL10CRowsForSubmit = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) {
        return { valid: false, message: 'L10C: minimal 1 data transaksi tax haven wajib diisi.' };
    }
    const invalidRow = rows.find((row) => Object.keys(validateL10CForm(row)).length > 0);
    if (invalidRow) {
        return { valid: false, message: 'L10C: terdapat data transaksi yang belum lengkap.' };
    }
    return { valid: true, message: '' };
};

// ─────────────────────────────────────────────────────────────────────────────
// ReadonlyField — pola identik L1D.js (UI Reference/Source of Truth Header).
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
// MODAL — Add/Edit — dideklarasikan di luar komponen utama (pola identik L10A).
// ─────────────────────────────────────────────────────────────────────────────
const L10CModal = ({ mode, formData, errors, warnings, onFieldChange, onSave, onClose }) => {
    if (!mode) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Transaction Partner</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Name of Transaction Partner <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.nameOfTransactionPartner}
                            onChange={(e) => onFieldChange('nameOfTransactionPartner', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.nameOfTransactionPartner ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.nameOfTransactionPartner && <p className="text-xs text-red-500 mt-1">{errors.nameOfTransactionPartner}</p>}
                        {!errors.nameOfTransactionPartner && warnings.nameOfTransactionPartner && <p className="text-xs text-amber-600 mt-1">{warnings.nameOfTransactionPartner}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Type of Transaction Code <span className="text-red-500">*</span></label>
                        <select
                            value={formData.typeOfTransactionCode}
                            onChange={(e) => onFieldChange('typeOfTransactionCode', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.typeOfTransactionCode ? 'border-red-400' : 'border-gray-300'}`}
                        >
                            <option value="">Please Select</option>
                            {TYPE_OF_TRANSACTION_CODE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                        {errors.typeOfTransactionCode && <p className="text-xs text-red-500 mt-1">{errors.typeOfTransactionCode}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Country Code <span className="text-red-500">*</span></label>
                        <select
                            value={formData.countryCode}
                            onChange={(e) => onFieldChange('countryCode', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.countryCode ? 'border-red-400' : 'border-gray-300'}`}
                        >
                            <option value="">Please Select</option>
                            {COUNTRY_CODE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                        {errors.countryCode && <p className="text-xs text-red-500 mt-1">{errors.countryCode}</p>}
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
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                        Close
                    </button>
                    <button onClick={onSave} className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Dialog — pola identik L10A (Blueprint §12 — mutlak lewat konfirmasi).
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
// L10C — Statement of Transactions with Parties that are Resident of Tax Haven Country
// ─────────────────────────────────────────────────────────────────────────────
const L10C = ({ taxYear, tin, rows, onRowsChange }) => {
    const safeRows = rows || [];

    const [modalMode, setModalMode] = useState(null);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [formData, setFormData] = useState(buildEmptyL10CForm());
    const [formErrors, setFormErrors] = useState({});
    const [fieldWarnings, setFieldWarnings] = useState({});
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const resetForm = useCallback(() => {
        setFormData(buildEmptyL10CForm());
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
        setFormData({ ...buildEmptyL10CForm(), ...row });
        setFormErrors({});
        setFieldWarnings({});
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalMode(null);
        setSelectedRowId(null);
        resetForm();
    }, [resetForm]);

    const handleFieldChange = useCallback((field, value) => {
        if (field === 'nameOfTransactionPartner') {
            const sanitized = sanitizeNameChars(value);
            setFieldWarnings((prev) => ({ ...prev, nameOfTransactionPartner: sanitized !== value ? NAME_WARNING_MESSAGE : '' }));
            setFormData((prev) => ({ ...prev, nameOfTransactionPartner: sanitized }));
            return;
        }
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = useCallback(() => {
        const errors = validateL10CForm(formData);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

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

    const handleRequestDelete = useCallback((rowId) => setPendingDeleteId(rowId), []);
    const handleCancelDelete = useCallback(() => setPendingDeleteId(null), []);
    const handleConfirmDelete = useCallback(() => {
        onRowsChange(safeRows.filter((row) => row.id !== pendingDeleteId));
        setPendingDeleteId(null);
    }, [safeRows, pendingDeleteId, onRowsChange]);

    const rowCount = safeRows.length;

    return (
        <div className="bg-white">
            <div className="p-6 space-y-4">
                {/* ── HEADER (pola identik L1D.js) ───────────────────────────────── */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                        Lampiran 10C — Statement of Transactions with Tax Haven Country Resident
                    </h2>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <ReadonlyField label="Tax Year" value={taxYear} />
                        <ReadonlyField label="TIN (NPWP)" value={tin} />
                    </div>
                </div>

                <div className="text-sm font-semibold text-gray-700">I. IF THE TAXPAYERS IN THIS TAX YEAR HAVE TRANSACTIONS WITH TAX HAVEN COUNTRY RESIDENT</div>

                {/* Toolbar L10C — hanya + Add (Blueprint tidak mengubah toolbar L10C) */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                        <Add fontSize="small" /> Add
                    </button>
                </div>

                {/* Table — sticky header + freeze kolom Action & No — style mengikuti L13A */}
                <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-[520px] overflow-y-auto">
                    <table className="min-w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-yellow-400 text-xs font-bold text-gray-800 uppercase">
                                <th style={{ position: 'sticky', top: 0, left: 0, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-20">Action</th>
                                <th style={{ position: 'sticky', top: 0, left: 80, zIndex: 20, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 w-12">No</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Name of Transaction Partner</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Type of Transaction Code</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Country Code</th>
                                <th style={{ position: 'sticky', top: 0, height: 36 }} className="bg-yellow-400 px-3 py-2 text-center align-middle border border-white border-b-gray-300 whitespace-nowrap">Transaction Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowCount === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-3 py-8 text-center text-gray-400 text-sm border border-gray-200">No data to display.</td>
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
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.nameOfTransactionPartner}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.typeOfTransactionCode}</td>
                                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap border border-gray-200">{row.countryCode}</td>
                                    <td className="px-3 py-2 text-gray-700 text-right whitespace-nowrap border border-gray-200">{fmtRp(row.transactionValue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <L10CModal
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

export default L10C;