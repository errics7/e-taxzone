import React, { useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// L10B — Statement of Transaction with Related Parties (deklaratif)
//
// Pola State: nested object per group (Pendekatan B), identik L9 —
// buildInitialL10BData() + mergeWithInitial() diekspor agar dipakai
// SptTahunanBadan.js untuk inisialisasi & Draft Compatibility Contract.
//
// Blueprint Final Revisi 5 §17 — Default Radio State: seluruh 15 pertanyaan
// diinisialisasi '' (BUKAN 'Yes'/'No'). User wajib memilih secara eksplisit.
// ─────────────────────────────────────────────────────────────────────────────

export const buildInitialL10BData = () => ({
    group1: { q1: '', q2: '', q3: '', q4: '' },
    group2: { q1: '', q2: '', q3: '' },
    group3: { q1: '', q2: '', q3: '', q4: '', q5: '' },
    group4: { q1: '', q2: '', q3: '' },
});

// Draft Compatibility Contract — draft lama tanpa group/pertanyaan tertentu
// tetap menghasilkan struktur penuh, tanpa menimpa jawaban yang sudah ada.
export const mergeWithInitial = (draftData) => {
    const initial = buildInitialL10BData();
    if (!draftData || typeof draftData !== 'object') return initial;
    const merged = {};
    Object.keys(initial).forEach((groupKey) => {
        merged[groupKey] = { ...initial[groupKey], ...(draftData[groupKey] || {}) };
    });
    return merged;
};

// ─────────────────────────────────────────────────────────────────────────────
// KONTEN PERTANYAAN — teks regulasi tetap (BUKAN reference data yang berubah-
// ubah, sehingga didefinisikan statis di sini, berbeda dari dropdown L10A/L10C).
// ─────────────────────────────────────────────────────────────────────────────
const GROUPS_CONFIG = [
    {
        key: 'group1',
        title: '1. Regarding a Detailed Company Description',
        subtitle: 'That we have made notes on :',
        questions: [
            { key: 'q1', label: "Ownership structure that shows the relationship between all companies in one group." },
            { key: 'q2', label: "Organization structure of Taxpayer's company" },
            { key: 'q3', label: "The operational aspects of the Taxpayer's business activities include details of the functions carried out by the units within the Taxpayer's company organization" },
            { key: 'q4', label: 'Detailed Description of Business Environment' },
        ],
    },
    {
        key: 'group2',
        title: '2. Regarding the transaction',
        subtitle: 'That we have made notes on :',
        questions: [
            { key: 'q1', label: 'Taxpayer transaction related parties.' },
            { key: 'q2', label: 'Taxpayer transaction with companies that are not related parties and information about comparable transaction.' },
            {
                key: 'q3',
                label: 'In the event that the Taxpayer act as a party that sells, delivers or lends ind the transactions as mentioned above, we have maintained the following records:\n- Pricing policies and price list for the last 5 (five) years\n- Details of manufacturing costs or costs of preparing services',
            },
        ],
    },
    {
        key: 'group3',
        title: '3. Regarding the Notes of Comparability Analysis Result',
        subtitle: 'That we have made notes on :',
        questions: [
            { key: 'q1', label: 'The characteristics of the products (goods, services, loans, financial instruments, etc.) are transacted' },
            { key: 'q2', label: 'The functional analysis which becomes the consideration for the transaction between the taxpayer and a company that has related relationship, all risks are assumed and the assets are used in the transaction.' },
            { key: 'q3', label: 'Economic conditions at the time of the transaction.' },
            { key: 'q4', label: "Terms of transactions, including contractual agreements between taxpayer and related parties aboard." },
            { key: 'q5', label: "Taxpayer's business strategy at the time of making affiliate transactions." },
        ],
    },
    {
        key: 'group4',
        title: '4. Regarding the Notes of Fair Price Determination',
        subtitle: 'That we have made notes on :',
        questions: [
            { key: 'q1', label: 'The pricing methodology applied by the Taxpayer, which shows how a fair price is obtained, and the reason for the method being chosen compared to other methods' },
            { key: 'q2', label: 'Comparative data used by taxpayers to determine transfer prices.' },
            { key: 'q3', label: 'Application of transfer pricing methodology and use of comparable data in transfer pricing.' },
        ],
    },
];

// Blueprint Final Revisi 5 §13 — Validation Contract: seluruh 15 pertanyaan
// wajib terisi 'Yes' atau 'No' sebelum Pay And Submit (bukan Save Draft).
export const validateL10BForSubmit = (data) => {
    const safe = mergeWithInitial(data);
    for (const group of GROUPS_CONFIG) {
        for (const q of group.questions) {
            if (safe[group.key][q.key] !== 'Yes' && safe[group.key][q.key] !== 'No') {
                return { valid: false, message: 'L10B: seluruh pertanyaan wajib dijawab (Yes/No).' };
            }
        }
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
// RadioRow — dideklarasikan di luar komponen utama agar tidak dibuat ulang
// setiap render (pola identik komponen section di MainFormBadan.js).
// ─────────────────────────────────────────────────────────────────────────────
const RadioRow = ({ label, value, onChange }) => (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-b-0">
        <p className="text-sm text-gray-700 whitespace-pre-line flex-1">{label}</p>
        <div className="flex items-center gap-6 flex-shrink-0 pt-0.5">
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                <input type="radio" checked={value === 'No'} onChange={() => onChange('No')} className="accent-blue-600" />
                No
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                <input type="radio" checked={value === 'Yes'} onChange={() => onChange('Yes')} className="accent-blue-600" />
                Yes
            </label>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// L10B — Main Component
// ─────────────────────────────────────────────────────────────────────────────
const L10B = ({ taxYear, tin, data, onDataChange }) => {
    const safeData = mergeWithInitial(data);

    const handleAnswerChange = useCallback((groupKey, questionKey, value) => {
        const updated = {
            ...safeData,
            [groupKey]: { ...safeData[groupKey], [questionKey]: value },
        };
        onDataChange(updated);
    }, [safeData, onDataChange]);

    return (
        <div className="bg-white">
            <div className="p-6 space-y-4">
                {/* ── HEADER (pola identik L1D.js) ───────────────────────────────── */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                        Lampiran 10B — Declaration of Transaction with Related Parties
                    </h2>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <ReadonlyField label="Tax Year" value={taxYear} />
                        <ReadonlyField label="TIN (NPWP)" value={tin} />
                    </div>
                </div>

                {GROUPS_CONFIG.map((group) => (
                    <div key={group.key} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-800">{group.title}</h3>
                        <p className="text-sm font-semibold text-gray-800 mb-2">{group.subtitle}</p>
                        <div>
                            {group.questions.map((q) => (
                                <RadioRow
                                    key={q.key}
                                    label={q.label}
                                    value={safeData[group.key][q.key]}
                                    onChange={(val) => handleAnswerChange(group.key, q.key, val)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default L10B;