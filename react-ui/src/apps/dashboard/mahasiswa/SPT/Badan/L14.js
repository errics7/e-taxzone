import React from 'react';

// ReadonlyField: identik dengan pola pada L1D.js (Header Standard project ini).
const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

const L14 = ({ taxYear, tin }) => (
    <div className="p-6 space-y-6">
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                Lampiran 14 — Reinvestment of Remaining Excess
            </h2>
            <div className="grid grid-cols-2 gap-4 max-w-md">
                <ReadonlyField label="Tax Year"  value={taxYear} />
                <ReadonlyField label="TIN (NPWP)" value={tin} />
            </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 italic">Detail form Lampiran 14 akan diimplementasikan di sini.</p>
        </div>
    </div>
);
export default L14;