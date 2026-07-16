import React, { useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// L10D — Summary of Master Document and Local Document
//
// Pola State: nested object (Pendekatan B, identik L9/L10B) —
// buildInitialL10DData() + mergeWithInitial() diekspor untuk inisialisasi &
// Draft Compatibility Contract (Blueprint Final Revisi 5 §9).
//
// Internal Data Representation Contract (Blueprint §5): format tanggal
// internal mengikuti konvensi date native project — MainFormBadan.js Section
// J (Declaration) sudah memakai <input type="date"> dengan value ISO string
// (YYYY-MM-DD). L10D mewarisi pola yang sama (bukan membuat pola date-picker
// baru) — bukan dd-mm-yyyy custom widget. Tampilan dd-mm-yyyy pada mockup
// Coretax adalah representasi visual native browser, BUKAN source of truth.
// ─────────────────────────────────────────────────────────────────────────────

export const buildInitialL10DData = () => ({
    masterSummary: { c1: false, c2: false, c3: false, c4: false, c5: false },
    localSummary: { c1: false, c2: false, c3: false, c4: false, c5: false },
    masterDocDate: '',
    localDocDate: '',
});

// Draft Compatibility Contract — draft lama tanpa key/field tertentu tetap
// menghasilkan struktur penuh, tanpa menimpa jawaban yang sudah ada.
export const mergeWithInitial = (draftData) => {
    const initial = buildInitialL10DData();
    if (!draftData || typeof draftData !== 'object') return initial;
    return {
        masterSummary: { ...initial.masterSummary, ...(draftData.masterSummary || {}) },
        localSummary: { ...initial.localSummary, ...(draftData.localSummary || {}) },
        masterDocDate: draftData.masterDocDate || '',
        localDocDate: draftData.localDocDate || '',
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// KONTEN CHECKLIST — teks regulasi tetap (bukan reference data yang berubah).
// ─────────────────────────────────────────────────────────────────────────────
const MASTER_SUMMARY_ITEMS = [
    { key: 'c1', label: 'Structure and Chart of Business Group Ownership and Country or Jurisdiction of Each Business Group Member' },
    { key: 'c2', label: 'Business Activities Conducted by Business Group' },
    { key: 'c3', label: 'Intangible Assets Owned by Business Group' },
    { key: 'c4', label: 'Financing and Financial Activities in Business Groups' },
    { key: 'c5', label: "Parent Entity's Consolidated Financial Statements and Taxation Information related to Affiliated Transactions" },
];

const LOCAL_SUMMARY_ITEMS = [
    { key: 'c1', label: 'Taxpayer Identity and Business Activities' },
    { key: 'c2', label: 'Information on Affiliated Transactions and Independent Transactions conducted by Taxpayer' },
    { key: 'c3', label: 'Application of the Fairness and Common Business Principles' },
    { key: 'c4', label: 'Taxpayer Financial Information' },
    { key: 'c5', label: 'Non-Financial Events / Events / Facts that Affect Pricing or Profit Levels' },
];

// Blueprint Final Revisi 5 §13 — Validation Contract: 10 checkbox + 2 tanggal
// wajib terisi sebelum Pay And Submit (bukan Save Draft).
export const validateL10DForSubmit = (data) => {
    const safe = mergeWithInitial(data);
    const allMasterChecked = MASTER_SUMMARY_ITEMS.every((item) => safe.masterSummary[item.key] === true);
    const allLocalChecked = LOCAL_SUMMARY_ITEMS.every((item) => safe.localSummary[item.key] === true);
    if (!allMasterChecked || !allLocalChecked) {
        return { valid: false, message: 'L10D: seluruh checklist Master & Local Documentary Summary wajib dicentang.' };
    }
    if (!safe.masterDocDate || !safe.localDocDate) {
        return { valid: false, message: 'L10D: Master/Local Document Available Date wajib diisi.' };
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
// CheckboxRow — dideklarasikan di luar komponen utama (pola identik RadioRow L10B).
// ─────────────────────────────────────────────────────────────────────────────
const CheckboxRow = ({ label, checked, onChange }) => (
    <label className="flex items-start gap-2.5 py-1.5 cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-0.5 accent-blue-600"
        />
        <span className="text-sm text-gray-700">{label} <span className="text-red-500">*</span></span>
    </label>
);

// ─────────────────────────────────────────────────────────────────────────────
// L10D — Main Component
// ─────────────────────────────────────────────────────────────────────────────
const L10D = ({ taxYear, tin, data, onDataChange }) => {
    const safeData = mergeWithInitial(data);

    const handleMasterCheck = useCallback((key, checked) => {
        onDataChange({ ...safeData, masterSummary: { ...safeData.masterSummary, [key]: checked } });
    }, [safeData, onDataChange]);

    const handleLocalCheck = useCallback((key, checked) => {
        onDataChange({ ...safeData, localSummary: { ...safeData.localSummary, [key]: checked } });
    }, [safeData, onDataChange]);

    const handleMasterDateChange = useCallback((value) => {
        onDataChange({ ...safeData, masterDocDate: value });
    }, [safeData, onDataChange]);

    const handleLocalDateChange = useCallback((value) => {
        onDataChange({ ...safeData, localDocDate: value });
    }, [safeData, onDataChange]);

    return (
        <div className="bg-white">
            <div className="p-6 space-y-4">
                {/* ── HEADER (pola identik L1D.js) ───────────────────────────────── */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                        Lampiran 10D — Summary of Master Document and Local Document
                    </h2>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <ReadonlyField label="Tax Year" value={taxYear} />
                        <ReadonlyField label="TIN (NPWP)" value={tin} />
                    </div>
                </div>

                {/* Bagian I — Master Documentary Summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">I. MASTER DOCUMENTARY SUMMARY <span className="text-red-500">*</span></h3>
                    <p className="text-sm text-gray-600 mb-2">
                        That we have prepared a master document which is the basis for the application of the Fairness and Common Business Principles (arm's length principle), which contains information about the business group as follows :
                    </p>
                    <div>
                        {MASTER_SUMMARY_ITEMS.map((item) => (
                            <CheckboxRow
                                key={item.key}
                                label={item.label}
                                checked={safeData.masterSummary[item.key]}
                                onChange={(checked) => handleMasterCheck(item.key, checked)}
                            />
                        ))}
                    </div>
                </div>

                {/* Bagian II — Local Documentary Summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">II. LOCAL DOCUMENTARY SUMMARY <span className="text-red-500">*</span></h3>
                    <p className="text-sm text-gray-600 mb-2">
                        That we have prepared a local document which is the basis for the application of the Fairness and Common Business Principles (arm's length principle), which contains information about the business group as follows :
                    </p>
                    <div>
                        {LOCAL_SUMMARY_ITEMS.map((item) => (
                            <CheckboxRow
                                key={item.key}
                                label={item.label}
                                checked={safeData.localSummary[item.key]}
                                onChange={(checked) => handleLocalCheck(item.key, checked)}
                            />
                        ))}
                    </div>
                </div>

                {/* Bagian III — Statement of Organization and Provision of Master and Local Documents */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">III. STATEMENT OF ORGANIZATION AND PROVISION OF MASTER AND LOCAL DOCUMENTS</h3>
                    <p className="text-sm text-gray-600 mb-3">
                        That we have held master document and local documents based on data and information available at time of carrying out the Affiliated Transaction, and :
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-700 w-96">1. The Master Documents were Available on the date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={safeData.masterDocDate}
                                onChange={(e) => handleMasterDateChange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => handleMasterDateChange('')}
                                title="Clear date"
                                className="w-8 h-8 flex items-center justify-center rounded bg-red-600 hover:bg-red-700 text-white text-sm">
                                ×
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-700 w-96">2. The Local Documents were Available on the date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={safeData.localDocDate}
                                onChange={(e) => handleLocalDateChange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => handleLocalDateChange('')}
                                title="Clear date"
                                className="w-8 h-8 flex items-center justify-center rounded bg-red-600 hover:bg-red-700 text-white text-sm">
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default L10D;