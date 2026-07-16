import React, { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// LAMPIRAN L8 — Fasilitas Pengurangan Tarif PPh Pasal 31E ayat (1) UU PPh
//
// Arsitektur (Blueprint_L8.md FINAL + Addendum Revisi 4):
// • L8 murni modul kalkulasi. Satu-satunya raw input adalah Gross Turnover.
// • Gross Turnover adalah CONTROLLED VALUE dari parent (SptTahunanBadan.js) —
//   tidak ada state lokal untuk nilainya sendiri (mencegah duplicate source
//   of truth), pola identik L1A/L6 (single scalar raw input, lifted ke parent).
// • Seluruh nilai turunan (Validation → Eligibility → Eligible Ratio →
//   Taxable Income Facility/Non-Facility → Income Tax Payable Facility/
//   Non-Facility → Total Income Tax) dihitung inline setiap render — TIDAK
//   PERNAH disimpan sebagai state terpisah.
// • Total Income Tax & Eligibility Status dikirim ke atas via useEffect,
//   pola identik onA10Change di L1A.js.
// ─────────────────────────────────────────────────────────────────────────────

// Ambang batas — Blueprint §5 (mengikuti Screenshot Coretax & Excel DJP resmi).
// Tidak ada helper/konstanta tarif terpusat di project ini (Audit §A.3) —
// nilai berikut didefinisikan lokal di L8.js karena memang belum ada yang
// bisa direuse.
const FACILITY_THRESHOLD     = 4_800_000_000;   // keterangan ** pada Excel
const MAX_ELIGIBLE_TURNOVER  = 50_000_000_000;  // keterangan *  pada Excel
// Tarif dasar khusus Lampiran 8 (Pasal 31E) — BUKAN sama dengan tarif umum
// Pasal 17 ayat (1) huruf b (22%, dipakai Main Form untuk cabang "Tarif
// Ketentuan Umum"). Nilai 25% ini mengikuti modul Coretax DJP yang dijadikan
// referensi project (contoh numerik resmi), sesuai koreksi business rule
// eksplisit: JANGAN disamakan dengan tarif Pasal 17 ayat (1) huruf b — dua
// nilai ini sengaja berbeda dan tidak boleh disatukan/direfactor jadi satu
// konstanta bersama tanpa instruksi eksplisit lebih lanjut.
const TARIF_DASAR_PASAL_31E  = 0.25;

// Formatter/parser lokal — mengikuti konvensi yang sama persis dengan L1A.js
// dan MainFormBadan.js (tidak ada modul bersama untuk diimpor, Audit §A.5).
const fmt = (v) => new Intl.NumberFormat('id-ID').format(v || 0);
const parse = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;

// ─── Validation Layer (Blueprint — Validation Matrix) ───────────────────────
// Menormalkan Gross Turnover SEBELUM dievaluasi Eligibility Rule.
// Kosong / negatif → diperlakukan sebagai 0 untuk kalkulasi (fail-safe),
// TIDAK memblokir tampilan atau membuang input mentah user.
const validateGrossTurnover = (raw) => {
    const n = parse(raw);
    if (!n || n < 0) return 0;
    return n;
};

// ─── Rounding Rule (Blueprint — Audit §C, aturan Coretax DJP) ───────────────
// "Untuk keperluan penerapan tarif pajak, jumlah Penghasilan Kena Pajak
// dibulatkan ke bawah dalam ribuan rupiah penuh." Diterapkan ke PKP Fasilitas
// & PKP Non Fasilitas SEBELUM dipakai menghitung PPh Terutang (3.a/3.b).
const floorToThousand = (n) => Math.floor(n / 1000) * 1000;

// ─── Sub-components ──────────────────────────────────────────────────────────

// ReadonlyField: tampilan field readonly, identik dengan pola L1D/L1C/L1A.
const ReadonlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 min-h-[36px]">
            {value || <span className="text-gray-400">—</span>}
        </div>
    </div>
);

const ReadonlyAmount = ({ value }) => (
    <div className="flex items-center">
        <span className="px-2 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg py-2">Rp</span>
        <input
            type="text"
            value={fmt(value)}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-100 text-gray-600 text-right"
        />
    </div>
);

// RpField — direplikasi PERSIS dari konvensi editable-Rupiah-field satu-satunya
// yang ada di project (L1a.js), karena fungsi tersebut tidak di-export sehingga
// tidak bisa diimpor langsung (Audit Formatter/Parser, lihat Blueprint_L8.md
// FINAL §A.5 dan catatan revisi terbaru). Live formatting per-keystroke +
// cursor position preservation — bukan re-implementasi ulang dari nol,
// melainkan penyalinan konvensi yang sudah stabil dipakai L1A untuk field
// Rupiah editable, demi konsistensi UX lintas lampiran.
const RpField = ({ value, onChange, placeholder = '0', hasWarning = false }) => {
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
        onChange(digitsOnly); // kirim digit-only STRING ke parent, persis pola L1A (bukan number)

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
        <div className={`flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden ${hasWarning ? 'border-red-400' : 'border-gray-300'}`}>
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
    );
};

// Catatan boundary (audit revisi terbaru): L8 TIDAK merender warning-nya
// sendiri. L8 hanya menghitung Eligibility Status dan mengirimkannya via
// onEligibleChange — keputusan untuk MENAMPILKAN warning (dan bentuk teksnya,
// Blueprint §3) adalah tanggung jawab MainForm sebagai orchestrator, bukan
// tanggung jawab modul kalkulasi L8. Lihat MainFormBadan.js
// (IncomeTaxCalculationSection) untuk tampilan warning tersebut.

const L8 = ({
    grossTurnover,
    onGrossTurnoverChange,
    taxableIncome,          // Penghasilan Kena Pajak — dependency eksternal dari Main Form (Point 9)
    taxYear,
    tin,
    onTotalIncomeTaxChange,
    onEligibleChange,
}) => {
    // ── Validation Layer ────────────────────────────────────────────────────
    const validGrossTurnover = validateGrossTurnover(grossTurnover);
    const pkp = parse(taxableIncome) || 0;

    // ── Eligibility Rule (Blueprint §2) ─────────────────────────────────────
    const isEligible = validGrossTurnover <= MAX_ELIGIBLE_TURNOVER;
    // Derived murni untuk kebutuhan panel informasi metode perhitungan (UX) —
    // TIDAK memengaruhi formula/eligibility, hanya label deskriptif. Memakai
    // ulang FACILITY_THRESHOLD yang sudah ada (sama persis kondisi yang dipakai
    // untuk menghitung taxableIncomeFacility di bawah).
    const isFullFacility = validGrossTurnover > 0 && validGrossTurnover <= FACILITY_THRESHOLD;

    // ── Formula (Blueprint §5) ───────────────────────────────────────────────
    // Guard pembagian oleh nol: jika Gross Turnover 0, seluruh derived value 0.
    let taxableIncomeFacilityRaw = 0;
    if (validGrossTurnover > 0) {
        taxableIncomeFacilityRaw = validGrossTurnover <= FACILITY_THRESHOLD
            ? pkp
            : (FACILITY_THRESHOLD / validGrossTurnover) * pkp;
    }
    // Audit §C — Coretax: PKP Fasilitas & PKP Non Fasilitas dibulatkan ke bawah
    // (floor) ke ribuan rupiah penuh SEBELUM dipakai menghitung PPh Terutang.
    const taxableIncomeFacility    = floorToThousand(taxableIncomeFacilityRaw);
    const taxableIncomeNonFacility = floorToThousand(pkp - taxableIncomeFacility);

    const incomeTaxPayableFacility    = 0.5 * TARIF_DASAR_PASAL_31E * taxableIncomeFacility;
    const incomeTaxPayableNonFacility = TARIF_DASAR_PASAL_31E * taxableIncomeNonFacility;

    const totalIncomeTax = incomeTaxPayableFacility + incomeTaxPayableNonFacility;

    // ── Callback ke atas (pola identik onA10Change di L1A.js) ───────────────
    // Dikirim SETIAP KALI berubah — Main Form yang menggerbang (gate) apakah
    // nilai ini boleh dipakai untuk D.12 (hanya saat Mode 2 & Eligible).
    useEffect(() => {
        if (onTotalIncomeTaxChange) onTotalIncomeTaxChange(totalIncomeTax);
    }, [totalIncomeTax, onTotalIncomeTaxChange]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (onEligibleChange) onEligibleChange(isEligible);
    }, [isEligible, onEligibleChange]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleGrossTurnoverChange = (val) => {
        if (onGrossTurnoverChange) onGrossTurnoverChange(val);
    };

    return (
        <div className="p-6 space-y-4">

            {/* ── HEADER ──────────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-base font-bold text-blue-800 mb-4 uppercase tracking-wide">
                    Lampiran 8 — Tax Facility (Pasal 31E)
                </h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <ReadonlyField label="Tax Period Year" value={taxYear} />
                    <ReadonlyField label="TIN (NPWP)"      value={tin} />
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white">
                            <th className="px-3 py-2 text-left w-12">NO.</th>
                            <th className="px-3 py-2 text-left">DESCRIPTION</th>
                            <th className="px-3 py-2 text-right w-56">AMOUNT (Rupiah)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="px-3 py-2 align-top font-medium">1.</td>
                            <td className="px-3 py-2 align-top font-medium">Gross Turnover</td>
                            <td className="px-3 py-2">
                                <RpField value={grossTurnover} onChange={handleGrossTurnoverChange} placeholder="0" hasWarning={!isEligible} />
                            </td>
                        </tr>
                        {/*
                            Warning dinamis Lampiran L8 (berbeda dari warning Main Form
                            D.12) — hanya bertujuan memberi tahu user saat mengisi Gross
                            Turnover. Memakai ulang `isEligible` yang sudah ada (Eligibility
                            Rule, Blueprint §2) — TIDAK ada validasi baru. Tampil hanya saat
                            Gross Turnover > Rp50.000.000.000; kosong/≤50M tidak menampilkan
                            apa pun karena isEligible bernilai true pada kedua kondisi itu.
                        */}
                        {!isEligible && (
                            <tr>
                                <td className="px-3 py-2"></td>
                                <td colSpan={2} className="px-3 pb-2 -mt-2">
                                    <p className="text-xs text-red-600">
                                        ⚠ Peredaran bruto melebihi Rp50.000.000.000 sehingga Wajib Pajak tidak memenuhi syarat menggunakan fasilitas tarif PPh Pasal 31E.
                                        Perhitungan pada Lampiran 8 tetap ditampilkan sebagai simulasi, namun hasilnya tidak akan digunakan dalam perhitungan PPh Terutang di Main Form.
                                    </p>
                                </td>
                            </tr>
                        )}

                        {/*
                            Panel Metode Perhitungan — UX transparansi (murni informatif,
                            TIDAK memengaruhi formula/business rule). Hanya tampil saat
                            isEligible (≤50M) DAN Gross Turnover sudah diisi (>0), sehingga
                            tidak pernah tumpang tindih dengan warning >50M di atas maupun
                            tampil kosong sebelum user mengisi apa pun.
                        */}
                        {isEligible && validGrossTurnover > 0 && (
                            <tr>
                                <td className="px-3 py-2"></td>
                                <td colSpan={2} className="px-3 pb-3 -mt-1">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-xs text-gray-700 space-y-1">
                                        <p className="font-semibold text-blue-800">
                                            Metode Perhitungan: {isFullFacility ? 'Full Facility' : 'Partial Facility'}
                                        </p>
                                        {isFullFacility ? (
                                            <>
                                                <p>Seluruh Penghasilan Kena Pajak memperoleh fasilitas tarif Pasal 31E.</p>
                                                <p className="italic text-gray-500">Rumus: PPh Terutang = 50% × 25% × Seluruh Penghasilan Kena Pajak</p>
                                            </>
                                        ) : (
                                            <>
                                                <p>Penghasilan Kena Pajak dibagi menjadi dua bagian: PKP yang memperoleh fasilitas dan PKP yang tidak memperoleh fasilitas.</p>
                                                <p className="italic text-gray-500">Rumus: (50% × 25% × PKP Fasilitas) + (25% × PKP Non Fasilitas)</p>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}

                        <tr>
                            <td className="px-3 py-2 align-top font-medium">2.</td>
                            <td className="px-3 py-2 align-top font-medium" colSpan={2}>Taxable Income</td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2 text-gray-600">a. Taxable income from the share of gross turnover that is granted the facility</td>
                            <td className="px-3 py-2"><ReadonlyAmount value={taxableIncomeFacility} /></td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2 text-gray-600">b. Taxable income from the share of gross turnover that is not granted the facility</td>
                            <td className="px-3 py-2"><ReadonlyAmount value={taxableIncomeNonFacility} /></td>
                        </tr>

                        <tr>
                            <td className="px-3 py-2 align-top font-medium">3.</td>
                            <td className="px-3 py-2 align-top font-medium" colSpan={2}>Income Tax Payable</td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2 text-gray-600">a. Income Tax Payable from Taxable Income from the gross turnover that is granted the facility</td>
                            <td className="px-3 py-2"><ReadonlyAmount value={incomeTaxPayableFacility} /></td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2 text-gray-600">b. Income Tax Payable from Taxable Income from the gross turnover that is not granted the facility</td>
                            <td className="px-3 py-2"><ReadonlyAmount value={incomeTaxPayableNonFacility} /></td>
                        </tr>
                        <tr className="bg-blue-50">
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2 font-semibold text-gray-800">Total Income Tax</td>
                            <td className="px-3 py-2"><ReadonlyAmount value={totalIncomeTax} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/*
                Keterangan — SELALU tampil, di luar tabel, redaksi mengikuti Excel
                DJP resmi. Bukan warning dinamis, murni petunjuk pengisian statis.
            */}
            <div className="text-xs text-gray-600 space-y-1 pt-2">
                <p className="font-semibold text-gray-700">Keterangan</p>
                <p>
                    *) Perhitungan ini hanya dibuat oleh Wajib Pajak Badan Dalam Negeri dengan peredaran bruto sampai dengan Rp50.000.000.000,00 (Lima Puluh Miliar Rupiah).
                </p>
                <p>
                    **) Dalam hal peredaran bruto sampai dengan Rp4.800.000.000,00 (Empat Miliar Delapan Ratus Juta Rupiah), seluruh Penghasilan Kena Pajak merupakan Penghasilan Kena Pajak dari bagian peredaran bruto yang memperoleh fasilitas.
                </p>
            </div>
        </div>
    );
};

export default L8;