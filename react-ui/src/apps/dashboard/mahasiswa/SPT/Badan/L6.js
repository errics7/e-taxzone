import React, { useMemo, useEffect } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Catatan: fmt/parse/ReadonlyField/RpField di bawah ini adalah COPY dari L2.js
// (yang juga menyalinnya dari L1A.js). Tidak ada shared util module di project ini —
// setiap Lampiran berdiri sendiri secara sengaja. Helper ini TIDAK di-export oleh
// file lain sehingga tidak bisa di-import langsung; menyalin pola yang identik adalah
// opsi paling konsisten dengan arsitektur yang sudah berjalan, bukan "duplicate baru".

const fmt = (v) => {
    const n = parseFloat(String(v).replace(/,/g, '')) || 0;
    return n === 0 ? '' : n.toLocaleString('id-ID');
};

const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

// ReadonlyField: tampilan field readonly, identik dengan pola L1D/L1C/L1A.
const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

// RpField: input nominal dengan prefix visual "Rp" + format angka Indonesia.
// Identik dengan RpField di L2.js (live formatting, cursor-preserving).
// onChange menerima digitsOnly (string) — inilah source of truth yang disimpan.
const RpField = ({ label, value, onChange, placeholder = '0', disabled = false }) => {
    const inputRef  = React.useRef(null);
    const isFocused = React.useRef(false);

    const [displayValue, setDisplayValue] = React.useState(() => {
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
        <div className="flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden bg-white">
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
                disabled={disabled}
                className="flex-1 px-3 py-2 text-sm text-right bg-white focus:outline-none min-w-0"
            />
        </div>
    );
};

// ReadonlyRpField: display nominal read-only dengan prefix visual "Rp".
// Berbeda dari ReadonlyField di L2.js — ini khusus nominal dengan format angka Indonesia.
// fmt(v) || '0' dipakai agar tidak tampil kosong pada kondisi awal (nilai 0).
const ReadonlyRpField = ({ value }) => (
    <div className="flex items-center border border-gray-200 rounded overflow-hidden bg-gray-50">
        <span className="px-2 py-2 text-xs font-medium text-gray-400 bg-gray-100 border-r border-gray-200 select-none whitespace-nowrap">Rp</span>
        <span className="flex-1 px-3 py-2 text-sm text-right text-gray-700 font-medium">
            {fmt(value) || '0'}
        </span>
    </div>
);

// ─── Konstanta Tarif ──────────────────────────────────────────────────────────
// TODO: Tarif sementara — GANTI setelah business rule final tarif PPh Badan dikonfirmasi.
// Jangan hardcode 0.20 langsung di formula. Ganti konstanta ini saja saat tarif resmi tersedia.
const TEMP_CORPORATE_TAX_RATE = 0.20;

// ─── L6 Component ─────────────────────────────────────────────────────────────
/**
 * L6 — Following Fiscal Year Income Tax Installment (Angsuran PPh Pasal 25 Tahun Berjalan)
 *
 * Fully controlled component — tidak ada internal state.
 * Source of Truth: incomeBase + previousYearTaxCredit (di SptTahunanBadan.js).
 * Semua nilai lain adalah derived — dihitung ulang setiap render via useMemo.
 *
 * Props:
 *   taxYear                  — string, read-only header
 *   tin                      — string, read-only header (NPWP)
 *   incomeBase               — string digit, raw input Angka 1
 *   previousYearTaxCredit    — string digit, raw input Angka 5
 *   fiscalLossFromL7         — number, dari L7 (fallback 0 sampai L7 tersedia)
 *   onIncomeBaseChange       — callback(val: string) — emit raw digits Angka 1
 *   onPreviousYearTaxCreditChange — callback(val: string) — emit raw digits Angka 5
 *   onInstallmentChange      — callback(val: number) — emit Angka 7 ke Main Form
 */
const L6 = ({
    taxYear,
    tin,
    incomeBase                   = '',
    previousYearTaxCredit        = '',
    fiscalLossFromL7             = 0,
    onIncomeBaseChange,
    onPreviousYearTaxCreditChange,
    onInstallmentChange,
}) => {

    // ── Derived Values (useMemo) ───────────────────────────────────────────────
    // Satu useMemo untuk seluruh kalkulasi — semua O(1), tidak ada side effect.
    // Dependency: hanya tiga raw input + konstanta (konstanta tidak masuk dep array
    // karena module-level dan tidak pernah berubah selama runtime).
    //
    // TODO: NEED CONFIRMATION — apakah taxableIncome (Angka 3) boleh negatif?
    // TODO: NEED CONFIRMATION — apakah selfPaidTax (Angka 6) boleh negatif?
    // TODO: NEED CONFIRMATION — apakah installment (Angka 7) boleh negatif?
    // Saat ini ditampilkan apa adanya (tanpa clamp). Ganti saat business rule dikonfirmasi.
    const derived = useMemo(() => {
        const incomeBaseNum           = parse(incomeBase);
        const previousYearCreditNum   = parse(previousYearTaxCredit);

        // Angka 2 — Fiscal Loss Compensation (dari L7, fallback 0)
        const fiscalLossCompensation  = fiscalLossFromL7 || 0;

        // Angka 3 — Taxable Income
        const taxableIncome           = incomeBaseNum - fiscalLossCompensation;

        // Angka 4 — Income Tax Payable
        const incomeTaxPayable        = TEMP_CORPORATE_TAX_RATE * taxableIncome;

        // Angka 6 — Income Tax That Must Be Self Paid
        const selfPaidTax             = incomeTaxPayable - previousYearCreditNum;

        // Angka 7 — Following Fiscal Year Installment
        const installment             = (1 / 12) * selfPaidTax;

        return { fiscalLossCompensation, taxableIncome, incomeTaxPayable, selfPaidTax, installment };
    }, [incomeBase, previousYearTaxCredit, fiscalLossFromL7]);

    // ── Sync Angka 7 → Main Form (via onInstallmentChange) ───────────────────
    // Dipanggil setiap kali installment berubah.
    // Pola identik useEffect onA10Change di L1A dan onCreditAmountChange di L3.
    useEffect(() => {
        if (onInstallmentChange) {
            onInstallmentChange(derived.installment);
        }
    }, [derived.installment, onInstallmentChange]);

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="p-6 space-y-6">

            {/* ── HEADER ──────────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 6 — Following Fiscal Year Income Tax Installment
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Period Year" value={taxYear} />
                    <ReadonlyField label="TIN / NPWP"       value={tin} />
                </div>
            </div>

            {/* ── Calculation Table ── */}
            <div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white">
                                <th className="px-3 py-2 text-left w-12">NO.</th>
                                <th className="px-3 py-2 text-left">DESCRIPTION</th>
                                <th className="px-3 py-2 text-center w-56">AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">

                            {/* Angka 1 — Income Base (editable) */}
                            <tr className="bg-white hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-700 w-8 font-medium align-middle">1.</td>
                                <td className="px-2 py-3 text-sm text-gray-700 align-middle">
                                    Income that is the basis of installment calculation
                                    <span className="text-red-500 ml-1">*</span>
                                </td>
                                <td className="px-4 py-3 w-56 align-middle">
                                    <RpField
                                        value={incomeBase}
                                        onChange={onIncomeBaseChange || (() => {})}
                                    />
                                </td>
                            </tr>

                            {/* Angka 2 — Fiscal Loss Compensation (read-only, dari L7) */}
                            <tr className="bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-500 w-8 font-medium align-middle">2.</td>
                                <td className="px-2 py-3 text-sm text-gray-500 align-middle">
                                    Fiscal Loss Compensation
                                    <span className="ml-2 text-xs text-gray-400 italic">
                                        (Filled in Form Attachment-07 Total of Column 9)
                                    </span>
                                </td>
                                <td className="px-4 py-3 w-56 align-middle">
                                    <ReadonlyRpField value={derived.fiscalLossCompensation} />
                                </td>
                            </tr>

                            {/* Angka 3 — Taxable Income (read-only, derived) */}
                            <tr className="bg-white">
                                <td className="px-4 py-3 text-sm text-gray-700 w-8 font-medium align-middle">3.</td>
                                <td className="px-2 py-3 text-sm text-gray-700 align-middle">
                                    Taxable Income
                                </td>
                                <td className="px-4 py-3 w-56 align-middle">
                                    <ReadonlyRpField value={derived.taxableIncome} />
                                </td>
                            </tr>

                            {/* Angka 4 — Income Tax Payable (read-only, derived) */}
                            <tr className="bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-700 w-8 font-medium align-middle">4.</td>
                                <td className="px-2 py-3 text-sm text-gray-700 align-middle">
                                    <span>Income Tax Payable</span>
                                    {/* Indikator tarif sementara — wajib tampil sampai tarif resmi dikonfirmasi */}
                                    <span className="ml-2 text-xs text-red-500 font-medium">
                                        *Temporary tax rate 20%
                                    </span>
                                </td>
                                <td className="px-4 py-3 w-56 align-middle">
                                    <ReadonlyRpField value={derived.incomeTaxPayable} />
                                </td>
                            </tr>

                            {/* Angka 5 — Tax Credit Prev Year (editable) */}
                            <tr className="bg-white hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-700 w-8 font-medium align-middle">5.</td>
                                <td className="px-2 py-3 text-sm text-gray-700 align-middle">
                                    Tax Credit for Previous Year&apos;s Income Included in Number 1
                                    Which is Withheld by Other Parties
                                    <span className="text-red-500 ml-1">*</span>
                                </td>
                                <td className="px-4 py-3 w-56 align-middle">
                                    <RpField
                                        value={previousYearTaxCredit}
                                        onChange={onPreviousYearTaxCreditChange || (() => {})}
                                    />
                                </td>
                            </tr>

                            {/* Angka 6 — Self Paid Tax (read-only, derived) */}
                            <tr className="bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-700 w-8 font-medium align-middle">6.</td>
                                <td className="px-2 py-3 text-sm text-gray-700 align-middle">
                                    Income Tax That Must Be Self Paid
                                </td>
                                <td className="px-4 py-3 w-56 align-middle">
                                    <ReadonlyRpField value={derived.selfPaidTax} />
                                </td>
                            </tr>

                            {/* Angka 7 — Installment (read-only, derived, dikirim ke Main Form) */}
                            <tr className="bg-blue-50">
                                <td className="px-4 py-3 text-sm text-gray-800 w-8 font-semibold align-middle">7.</td>
                                <td className="px-2 py-3 text-sm font-semibold text-gray-800 align-middle">
                                    Following Fiscal Year Installment
                                </td>
                                <td className="px-4 py-3 w-56 align-middle">
                                    <ReadonlyRpField value={derived.installment} />
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                {/* Keterangan field wajib */}
                <p className="mt-2 text-xs text-gray-400">
                    <span className="text-red-500">*</span> Required field
                </p>
            </div>

            {/*
                Keterangan — SELALU tampil, di luar tabel, mengikuti pola L8
                (statis, bukan alert/info box).
            */}
            <div className="text-xs text-gray-600 space-y-1 pt-2">
                <p className="font-semibold text-gray-700">Keterangan</p>
                <p>
                    Value from Number 7 (Following Fiscal Year Installment) is automatically applied
                    to Main Form — Section G, Question 20.
                </p>
            </div>

        </div>
    );
};

export default L6;