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

const L13 = ({ showPartA, showPartB, showPartC, showPartD, taxYear, tin }) => {
    const hasAny = showPartA || showPartB || showPartC || showPartD;

    return (
        <div className="p-6 space-y-6">
            {/* ── HEADER ──────────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 13 — Tax Facility &amp; Deductions
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Year"  value={taxYear} />
                    <ReadonlyField label="TIN (NPWP)" value={tin} />
                </div>
            </div>

            {/* 13-A — Investment Facility (D-Q5 or H-Q21g) */}
            {showPartA && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">13-A</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Fasilitas penanaman modal berupa pengurangan penghasilan neto</p>
                    </div>
                    <div className="p-4">
                        <p className="text-sm text-gray-500 italic">Detail form Lampiran 13-A akan diimplementasikan di sini.</p>
                    </div>
                </div>
            )}

            {/* 13-B — Vocational (Part B) and/or R&D (Part D) */}
            {(showPartB || showPartD) && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">13-B</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Fasilitas pengurangan penghasilan bruto</p>
                    </div>
                    <div className="p-4 space-y-4">
                        {/* Part B — Vocational (D-Q6) */}
                        {showPartB && (
                            <div className="border border-gray-100 rounded-lg overflow-hidden">
                                <div className="bg-blue-50 px-4 py-2 border-b border-gray-100">
                                    <h4 className="font-medium text-gray-700">Part B</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Pengurangan penghasilan bruto untuk kegiatan vokasi</p>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-gray-500 italic">Detail form Lampiran 13-B Part B akan diimplementasikan di sini.</p>
                                </div>
                            </div>
                        )}

                        {/* Part D — R&D (D-Q10) */}
                        {showPartD && (
                            <div className="border border-gray-100 rounded-lg overflow-hidden">
                                <div className="bg-blue-50 px-4 py-2 border-b border-gray-100">
                                    <h4 className="font-medium text-gray-700">Part D</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Pengurangan penghasilan bruto untuk kegiatan penelitian dan pengembangan</p>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-gray-500 italic">Detail form Lampiran 13-B Part D akan diimplementasikan di sini.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 13-C — Income Tax Payable Deduction (E-Q16) */}
            {showPartC && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">13-C</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Fasilitas pengurangan PPh yang terutang</p>
                    </div>
                    <div className="p-4">
                        <p className="text-sm text-gray-500 italic">Detail form Lampiran 13-C akan diimplementasikan di sini.</p>
                    </div>
                </div>
            )}

            {!hasAny && (
                <p className="text-sm text-gray-400 italic text-center py-4">
                    Tidak ada bagian yang aktif. Pilih jawaban pada Section D atau E untuk menampilkan bagian yang relevan.
                </p>
            )}
        </div>
    );
};

export default L13;