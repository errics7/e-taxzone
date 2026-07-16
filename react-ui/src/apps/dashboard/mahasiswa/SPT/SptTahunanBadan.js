import React, { useState, useCallback } from 'react';
import MainFormBadan from './Badan/MainFormBadan';
import L1A  from './Badan/L1a.js';
import L1C  from './Badan/L1c.js';
import L1D  from './Badan/L1d.js';
import L2   from './Badan/L2.js';
import L3   from './Badan/L3.js';
import L4   from './Badan/L4.js';
import L5   from './Badan/L5.js';
import L6   from './Badan/L6.js';
import L7   from './Badan/L7.js';
import L8   from './Badan/L8.js';
import L9, { buildInitialL9Data, mergeWithInitial as mergeL9WithInitial } from './Badan/L9.js';
import L10A from './Badan/L10A.js';
import L10B, { buildInitialL10BData, mergeWithInitial as mergeL10BWithInitial } from './Badan/L10B.js';
import L10C from './Badan/L10C.js';
import L10D, { buildInitialL10DData, mergeWithInitial as mergeL10DWithInitial } from './Badan/L10D.js';
import L11A, { buildInitialL11AData, mergeWithInitial as mergeL11AWithInitial } from './Badan/L11A.js';
import L11B, { buildInitialL11BData, mergeWithInitial as mergeL11BWithInitial } from './Badan/L11B.js';
import L13  from './Badan/L13.js';
import L14  from './Badan/L14.js';

const L1_TAB_MAP = {
    'Umum':   { id: 'L1A', label: 'L-1A', component: L1A },
    'Dagang': { id: 'L1C', label: 'L-1C', component: L1C },
    'Jasa':   { id: 'L1D', label: 'L-1D', component: L1D },
};

const SptTahunanBadan = () => {
    const [activeTab, setActiveTab] = useState('main');

    // ── sptData mirror ────────────────────────────────────────────────────────
    // Received from MainFormBadan via onSptDataChange callback.
    // Used ONLY to derive tab/section visibility — NOT for editing.
    const [sptData, setSptData] = useState({
        general_info:   { business_classification: '' },
        balance_sheet:  { q1_gr23: '', q1b_solely_gr23: '', q2_final_tax: '', q3_excluded_tax: '' },
        profit_loss:    {
            p5_investment_facility: '', p6_vocational_deduction: '',
            p8_carried_losses: '', p10_rd_deduction: '', p11_tax_rate: ''
        },
        tax_calculation: { q13_overseas_credit: '', q16_payable_deduction: '' },
        tax_payable:     { q20_art25_obliged: '' },
        transactions:    {
            q21a_related_party: '', q21b_tp_document: '',
            q21c_capital_investment: '', q21d_debt_receivable: '',
            q21e_fiscal_depreciation: '', q21f_entertainment_expense: '',
            q21g_investment_facility: '', q21h_reinvestment: ''
        }
    });

    // ── A.10 per-Lampiran ──────────────────────────────────────────────────────
    // Masing-masing Lampiran L1 menyimpan A.10-nya sendiri.
    // Hal ini memastikan data tidak hilang saat Business Classification berubah.
    // MainForm D.4 hanya mengambil nilai dari Lampiran yang sedang aktif (activeA10).
    const [a10ByLampiran, setA10ByLampiran] = useState({ L1A: 0, L1C: 0, L1D: 0 });

    // ── EBITDA Components per-Lampiran (Blueprint L11 §4 EBITDA Contract) ──────
    // Pola identik a10ByLampiran di atas — masing-masing L1A/L1C/L1D menyimpan
    // komponen EBITDA-nya sendiri agar data tidak hilang saat Business
    // Classification berubah. L11B Bagian I hanya mengambil dari Lampiran yang
    // sedang aktif (activeEbitdaComponents). OPEN CLARIFICATION #5 (Blueprint
    // L11 §1 poin 5) — belum dipastikan apakah EBITDA memang harus mengikuti
    // Business Classification aktif; pola ini dipakai sementara mengikuti
    // activeA10 tanpa mengunci business rule.
    const EBITDA_COMPONENTS_DEFAULT = {
        commercialNetIncome: 0,
        depreciationAmortization: 0,
        borrowingCostExpense: 0,
        incomeTaxExpense: null, // OPEN CLARIFICATION #2 — belum ada source of truth
    };
    const [ebitdaComponentsByLampiran, setEbitdaComponentsByLampiran] = useState({
        L1A: EBITDA_COMPONENTS_DEFAULT,
        L1C: EBITDA_COMPONENTS_DEFAULT,
        L1D: EBITDA_COMPONENTS_DEFAULT,
    });

    const [l1aRowsA,  setL1aRowsA]  = useState([]);
    const [l1aRowsB,  setL1aRowsB]  = useState([]);

    // L1C — rows di-lift ke parent dengan pola yang sama dengan L1A, agar data tidak
    // hilang saat Business Classification berganti (L1C di-unmount/remount via
    // conditional render `l1Tab?.id === 'L1C'`, sama seperti L1A).
    const [l1cRowsA,         setL1cRowsA]         = useState([]);
    const [l1cRowsBAset,     setL1cRowsBAset]     = useState([]);
    const [l1cRowsBLiabEkuitas, setL1cRowsBLiabEkuitas] = useState([]);

    // L1D — rows di-lift ke parent dengan pola yang identik dengan L1C, agar data
    // tidak hilang saat Business Classification berganti (L1D di-unmount/remount via
    // conditional render `l1Tab?.id === 'L1D'`, sama seperti L1A/L1C).
    const [l1dRowsA,         setL1dRowsA]         = useState([]);
    const [l1dRowsBAset,     setL1dRowsBAset]     = useState([]);
    const [l1dRowsBLiabEkuitas, setL1dRowsBLiabEkuitas] = useState([]);

    // L2 — rows di-lift ke parent dengan pola yang sama (Blueprint L2 Final §3/§14).
    // rowsA/rowsB adalah array of full object — TIDAK ada merge dengan reference/roster
    // data (berbeda dari L1A/L1C/L1D yang merge terhadap daftar akun statis).
    const [l2RowsA, setL2RowsA] = useState([]);
    const [l2RowsB, setL2RowsB] = useState([]);

    // L3 — rows di-lift ke parent dengan pola yang sama dengan L2 (Blueprint L3
    // Final §2/§7 — Source of Truth). rowsA/rowsB = array of full object, TANPA
    // merge dengan reference data, sama seperti L2. l3PriorYearCreditRefund adalah
    // SATU nilai (bukan array) — raw input manual untuk "Pengembalian Pengurangan
    // Kredit Pajak LN (PPh Pasal 24) Tahun Lalu" (Bagian A.b di L3.xlsx).
    //
    // l3CreditAmount BUKAN source of truth, BUKAN field editable, BUKAN disimpan
    // ke Save Draft — ia adalah mirror read-only dari hasil hitungL3().partB.c
    // yang dihitung sepenuhnya di dalam L3.js, diterima di sini lewat callback
    // onCreditAmountChange (pola identik onA10Change). SptTahunanBadan.js TIDAK
    // punya salinan formula hitungL3() (Blueprint L3 Final §1/§2/§6).
    const [l3RowsA, setL3RowsA] = useState([]);
    const [l3RowsB, setL3RowsB] = useState([]);
    const [l3PriorYearCreditRefund, setL3PriorYearCreditRefund] = useState('');
    const [l3CreditAmount, setL3CreditAmount] = useState(0);

    // Stable callback wrappers agar referensi tidak berubah setiap render
    // (mencegah loop di useEffect L1A yang memiliki onA10Change / onRowsXChange sebagai dep)
    const handleA10ChangeL1A = useCallback((val) => setA10ByLampiran(prev => ({ ...prev, L1A: val })), []);
    const handleA10ChangeL1C = useCallback((val) => setA10ByLampiran(prev => ({ ...prev, L1C: val })), []);
    const handleA10ChangeL1D = useCallback((val) => setA10ByLampiran(prev => ({ ...prev, L1D: val })), []);
    const handleRowsAChange  = useCallback((rows) => setL1aRowsA(rows), []);
    const handleRowsBChange  = useCallback((rows) => setL1aRowsB(rows), []);
    const handleRowsAChangeL1C         = useCallback((rows) => setL1cRowsA(rows), []);
    const handleRowsBAsetChangeL1C     = useCallback((rows) => setL1cRowsBAset(rows), []);
    const handleRowsBLiabEkuitasChangeL1C = useCallback((rows) => setL1cRowsBLiabEkuitas(rows), []);
    const handleRowsAChangeL1D         = useCallback((rows) => setL1dRowsA(rows), []);
    const handleRowsBAsetChangeL1D     = useCallback((rows) => setL1dRowsBAset(rows), []);
    const handleRowsBLiabEkuitasChangeL1D = useCallback((rows) => setL1dRowsBLiabEkuitas(rows), []);
    const handleRowsAChangeL2 = useCallback((rows) => setL2RowsA(rows), []);
    const handleRowsBChangeL2 = useCallback((rows) => setL2RowsB(rows), []);

    // L3 — pola identik L2 untuk rowsA/rowsB. handlePriorYearCreditRefundChangeL3
    // hanya menyimpan SATU nilai (bukan array). handleCreditAmountChangeL3 HANYA
    // dipanggil dari callback onCreditAmountChange milik L3.js — tidak ada path
    // lain yang menulis ke l3CreditAmount (Blueprint L3 Final §1).
    const handleRowsAChangeL3 = useCallback((rows) => setL3RowsA(rows), []);
    const handleRowsBChangeL3 = useCallback((rows) => setL3RowsB(rows), []);
    const handlePriorYearCreditRefundChangeL3 = useCallback((val) => setL3PriorYearCreditRefund(val), []);
    const handleCreditAmountChangeL3 = useCallback((val) => setL3CreditAmount(val), []);

    // Dipanggil oleh MainFormBadan saat draft di-load untuk restore data L1A
    const handleSetL1aRowsFromDraft = useCallback((section, rows) => {
        if (section === 'A') setL1aRowsA(rows);
        if (section === 'B') setL1aRowsB(rows);
    }, []); // tidak ada dependency — hanya memanggil setter

    // Dipanggil oleh MainFormBadan saat draft di-load untuk restore data L1C.
    // Pola identik dengan handleSetL1aRowsFromDraft di atas, dengan tiga section
    // (Bagian A, Bagian B-Aset, Bagian B-Liabilitas&Ekuitas) karena struktur L1C
    // memiliki dua tabel terpisah pada Bagian B.
    const handleSetL1cRowsFromDraft = useCallback((section, rows) => {
        if (section === 'A') setL1cRowsA(rows);
        if (section === 'B_ASET') setL1cRowsBAset(rows);
        if (section === 'B_LIAB_EKUITAS') setL1cRowsBLiabEkuitas(rows);
    }, []); // tidak ada dependency — hanya memanggil setter

    // Dipanggil oleh MainFormBadan saat draft di-load untuk restore data L1D.
    // Pola identik dengan handleSetL1cRowsFromDraft di atas.
    const handleSetL1dRowsFromDraft = useCallback((section, rows) => {
        if (section === 'A') setL1dRowsA(rows);
        if (section === 'B_ASET') setL1dRowsBAset(rows);
        if (section === 'B_LIAB_EKUITAS') setL1dRowsBLiabEkuitas(rows);
    }, []); // tidak ada dependency — hanya memanggil setter

    // Dipanggil oleh MainFormBadan saat draft di-load untuk restore data L2.
    // Hanya dua section (A, B) — TIDAK ada merge, langsung set rows apa adanya
    // (Blueprint L2 Final §10 — berbeda dari L1A/L1C/L1D yang merge-by-code).
    const handleSetL2RowsFromDraft = useCallback((section, rows) => {
        if (section === 'A') setL2RowsA(rows);
        if (section === 'B') setL2RowsB(rows);
    }, []); // tidak ada dependency — hanya memanggil setter

    // Dipanggil oleh MainFormBadan saat draft di-load untuk restore data L3.
    // HANYA restore raw input (rowsA, rowsB, priorYearCreditRefund) — Blueprint
    // L3 Final §7/§8: TIDAK PERNAH membaca kembali summary/derived value lama.
    // Setelah restore, L3.js menjalankan hitungL3() ulang secara otomatis (reaktif
    // lewat useMemo) dan mengirim hasil barunya via onCreditAmountChange — nilai
    // lama q13_overseas_credit_amount yang mungkin ikut tersimpan di draft selalu
    // ditimpa oleh hasil perhitungan terbaru ini.
    const handleSetL3RowsFromDraft = useCallback((section, rows) => {
        if (section === 'A') setL3RowsA(rows);
        if (section === 'B') setL3RowsB(rows);
        if (section === 'PRIOR_YEAR_CREDIT_REFUND') setL3PriorYearCreditRefund(rows);
    }, []); // tidak ada dependency — hanya memanggil setter

    // L4 — rows di-lift ke parent dengan pola yang identik dengan L2/L3 (Blueprint
    // L4 Final). rowsA/rowsB = array of full raw input object, TANPA merge dengan
    // reference data (sama seperti L2/L3). Tidak ada scalar tambahan seperti
    // l3PriorYearCreditRefund — L4 hanya memiliki dua array.
    const [l4RowsA, setL4RowsA] = useState([]);
    const [l4RowsB, setL4RowsB] = useState([]);

    // ── L5 state ────────────────────────────────────────────────────────────
    // l5Places : master data TKU readonly (Bagian A). Dibentuk oleh parent dari
    //            taxpayer.addresses (type 'Alamat sesuai di KTP') via companyData.
    //            Ikut Save Draft agar Load Draft tidak perlu regenerasi dari API.
    // l5Rows   : data transaksi per TKU, 36 field bulanan (Bagian B). Raw input.
    // L5.js hanya menerima props — tidak mengetahui sumber data.
    // Ketika General Information TKU selesai, ganti buildInitialL5Places();
    // L5.js, Save Draft, Load Draft, dan business rule tidak perlu diubah.
    const [l5Places, setL5Places] = useState([]);
    const [l5Rows,   setL5Rows]   = useState([]);

    // ── L5 callbacks ────────────────────────────────────────────────────────
    const handleRowsChangeL5       = useCallback((rows) => setL5Rows(rows), []);
    const handleSetL5RowsFromDraft = useCallback((rows) => setL5Rows(rows), []);

    // handleSetL5PlacesFromDraft — restore l5Places dari Load Draft.
    // Dipanggil oleh MainFormBadan sebelum handleSetL5RowsFromDraft.
    const handleSetL5PlacesFromDraft = useCallback(
        (places) => setL5Places(places || []), []);

    // companyData — diterima dari MainFormBadan via onCompanyDataChange.
    // Berisi full taxpayer profile termasuk addresses[] dari proses registrasi.
    // SptTahunanBadan tidak melakukan fetch baru — data sudah ada di MFB.
    const [companyData, setCompanyData] = useState(null);
    const handleCompanyDataChange = useCallback((data) => setCompanyData(data), []);

    /**
     * buildInitialL5Places
     * Membentuk l5Places dari taxpayer.addresses (type 'Alamat sesuai di KTP').
     * Dipanggil HANYA jika l5Places masih kosong (belum ada data / bukan Load Draft).
     *
     * TODO: Saat modul General Information (TKU) selesai dikembangkan,
     *       source l5Places dipindahkan dari taxpayer.addresses ke daftar TKU
     *       General Information. L5.js tidak perlu diubah.
     */
    const buildInitialL5Places = useCallback((addresses, companyName) => {
        if (!Array.isArray(addresses) || addresses.length === 0) return;
        const ktp = addresses.find(a => a.type === 'Alamat sesuai di KTP');
        if (!ktp) return;
        const newPlaces = [{
            id:        ktp.id ?? ktp.address_id ?? '1',
            namaTku:   ktp.place_name ?? ktp.name ?? companyName ?? '',
            alamat:    ktp.address   ?? '',
            kelurahan: ktp.village   ?? '',
            kecamatan: ktp.district  ?? '',
            kota:      ktp.city      ?? '',
            provinsi:  ktp.province  ?? '',
        }];
        setL5Places(newPlaces);
        // Inisialisasi l5Rows kosong hanya jika belum ada data (bukan Load Draft).
        setL5Rows(prev => prev.length > 0 ? prev : newPlaces.map(p => ({
            tkuId:   p.id,
            namaTku: p.namaTku,
            jan_bruto: '',
            feb_bruto: '',
            mar_bruto: '',
            apr_bruto: '',
            mei_bruto: '',
            jun_bruto: '',
            jul_bruto: '',
            agu_bruto: '',
            sep_bruto: '',
            okt_bruto: '',
            nov_bruto: '',
            des_bruto: '',
            jan_disetor: '',
            feb_disetor: '',
            mar_disetor: '',
            apr_disetor: '',
            mei_disetor: '',
            jun_disetor: '',
            jul_disetor: '',
            agu_disetor: '',
            sep_disetor: '',
            okt_disetor: '',
            nov_disetor: '',
            des_disetor: '',
            jan_dipotong: '',
            feb_dipotong: '',
            mar_dipotong: '',
            apr_dipotong: '',
            mei_dipotong: '',
            jun_dipotong: '',
            jul_dipotong: '',
            agu_dipotong: '',
            sep_dipotong: '',
            okt_dipotong: '',
            nov_dipotong: '',
            des_dipotong: ''
        })));
    }, []);

    // Panggil buildInitialL5Places saat companyData tersedia dan l5Places masih kosong.
    // Guard l5Places.length > 0 memastikan Load Draft tidak ditimpa.
    React.useEffect(() => {
        if (!companyData || l5Places.length > 0) return;
        const addresses = companyData.address_data
            ?? companyData.addresses
            ?? companyData.company_data?.addresses
            ?? companyData.taxpayer?.addresses
            ?? [];
        // companies.address_data saat ini dikembalikan backend sebagai JSON string
        // (bukan Array), sehingga perlu dinormalisasi terlebih dahulu menjadi Array
        // di titik ini sebelum diteruskan ke buildInitialL5Places(). Dengan begitu
        // buildInitialL5Places() selalu menerima kontrak Array yang konsisten dan
        // tidak perlu mengetahui bentuk asli data dari backend.
        let normalizedAddresses = addresses;
        if (typeof normalizedAddresses === 'string') {
            try {
                normalizedAddresses = JSON.parse(normalizedAddresses);
            } catch (e) {
                console.warn('Gagal mem-parse address_data dari company profile, menggunakan array kosong sebagai fallback:', e);
                normalizedAddresses = [];
            }
        }
        if (!Array.isArray(normalizedAddresses)) {
            console.warn('Format address_data dari company profile tidak valid (bukan Array), menggunakan array kosong sebagai fallback:', normalizedAddresses);
            normalizedAddresses = [];
        }
        const companyName = companyData.company_name
            ?? companyData.company_data?.company_name
            ?? sptData.company_identity?.company_name
            ?? '';
        buildInitialL5Places(normalizedAddresses, companyName);
    }, [companyData, l5Places.length, buildInitialL5Places,
        sptData.company_identity?.company_name]);

    const handleRowsAChangeL4 = useCallback((rows) => setL4RowsA(rows), []);
    const handleRowsBChangeL4 = useCallback((rows) => setL4RowsB(rows), []);

    // Dipanggil oleh MainFormBadan saat draft di-load untuk restore data L4.
    // Pola identik dengan handleSetL2RowsFromDraft — hanya dua section (A, B),
    // TIDAK ada merge, langsung set rows apa adanya (Blueprint L4 Final).
    const handleSetL4RowsFromDraft = useCallback((section, rows) => {
        if (section === 'A') setL4RowsA(rows);
        if (section === 'B') setL4RowsB(rows);
    }, []); // tidak ada dependency — hanya memanggil setter


    // L6 — Source of Truth: dua scalar raw input (Blueprint L6 Final §Source of Truth).
    // incomeBase = Angka 1, previousYearTaxCredit = Angka 5 — keduanya string digit mentah
    // (diterima dari RpField.onChange yang mengirim digitsOnly).
    //
    // l6Installment BUKAN source of truth, BUKAN field editable, BUKAN disimpan ke Save Draft —
    // ia adalah communication state (mirror read-only) dari Angka 7 yang dihitung di L6.js
    // dan dikirim ke MainFormBadan.js via onInstallmentChange. Pola identik l3CreditAmount
    // (Blueprint L6 Final §Revisi 4 — Penegasan Source of Truth).
    const [l6IncomeBase,            setL6IncomeBase]            = useState('');
    const [l6PreviousYearTaxCredit, setL6PreviousYearTaxCredit] = useState('');
    const [l6Installment,           setL6Installment]           = useState(0);

    // Callback eksplisit (Blueprint L6 Final v3 §Final Review 1 — callback eksplisit
    // lebih aman dari string-section dispatcher karena typo tertangkap langsung).
    const handleIncomeBaseChangeL6 = useCallback(
        (val) => setL6IncomeBase(val), []
    );
    const handlePreviousYearTaxCreditChangeL6 = useCallback(
        (val) => setL6PreviousYearTaxCredit(val), []
    );
    const handleInstallmentChangeL6 = useCallback(
        (val) => setL6Installment(val), []
    );

    // Dipanggil oleh MainFormBadan saat draft di-load untuk restore raw input L6.
    // HANYA restore incomeBase + previousYearTaxCredit (source of truth).
    // Derived values (Angka 2–4, 6–7) TIDAK pernah di-restore — selalu dihitung ulang
    // secara reaktif oleh L6.js via useMemo setelah state ini di-set (Blueprint L6 Final §Load Draft).
    const handleSetL6IncomeBaseFromDraft = useCallback(
        (val) => setL6IncomeBase(val), []
    );
    const handleSetL6PreviousYearTaxCreditFromDraft = useCallback(
        (val) => setL6PreviousYearTaxCredit(val), []
    );

    // L7 — Source of Truth: l7Rows (raw input per tahun pajak, lihat Blueprint L7
    // Final Revision §4 Data Contract). l7TotalCol8ForD8/l7TotalCol9ForL6 BUKAN
    // Source of Truth — keduanya adalah CACHED DERIVED VALUE (Blueprint Revisi
    // "Cached Derived Values"): tetap dihitung ulang oleh L7.js setiap kali l7Rows
    // berubah akibat edit user (via useMemo + onTotalCol8Change/onTotalCol9Change,
    // tidak ada perubahan pada L7.js), NAMUN sekarang juga ikut dipersist bersama
    // l7Rows agar saat Load Draft/GET API nanti, nilai ini bisa langsung direstore
    // tanpa menunggu L7.js mount dan menghitung ulang (menghindari ketergantungan
    // pada timing mount komponen). MainForm dan L6 tetap murni Consumer — tidak
    // pernah menghitung ulang, tidak pernah mengubah nilai L7.
    const [l7Rows,             setL7Rows]             = useState([]);
    const [l7TotalCol8ForD8,   setL7TotalCol8ForD8]   = useState(0);
    const [l7TotalCol9ForL6,   setL7TotalCol9ForL6]   = useState(0);

    // l7TaxYears BUKAN business rule buatan — ini murni placeholder sementara
    // (ASSUMPTION-1, Blueprint L7 Final Revision §2) selama backend riwayat tahun
    // pajak belum tersedia: parent hanya mengirim tahun pajak berjalan (satu baris).
    // Ketika backend riwayat tahun pajak tersedia, parent akan mengirim seluruh
    // daftar tahun sesungguhnya — L7.js TIDAK PERLU diubah, karena L7 hanya
    // menerima array ini sebagai data tanpa mengetahui asalnya.
    const l7TaxYears = sptData.header?.tax_year ? [sptData.header.tax_year] : [];

    // Stable callback wrappers — direuse untuk live edit (onRowsChange) MAUPUN
    // Load Draft (setL7RowsFromDraft), karena L7 hanya punya satu array rows
    // (tidak bersection seperti L1A). Ini sesuai Minimum Change Principle
    // (Implementation Contract §7 — pilih solusi dengan callback paling sedikit).
    const handleL7RowsChange       = useCallback((rows) => setL7Rows(rows), []);
    const handleTotalCol8ChangeL7  = useCallback((val)  => setL7TotalCol8ForD8(val), []);
    const handleTotalCol9ChangeL7  = useCallback((val)  => setL7TotalCol9ForL6(val), []);

    // L8 — Source of Truth: l8GrossTurnover (raw input tunggal, scalar — pola
    // identik l6IncomeBase/l3PriorYearCreditRefund, Blueprint_L8.md FINAL §6.3).
    // l8TotalIncomeTax dan l8Eligible BUKAN Source of Truth — keduanya adalah
    // CACHED DERIVED VALUE (pola identik l7TotalCol8ForD8/l7TotalCol9ForL6):
    // selalu dihitung ulang oleh L8.js setiap kali l8GrossTurnover berubah,
    // dikirim ke sini via onTotalIncomeTaxChange/onEligibleChange, dan ikut
    // dipersist bersama l8GrossTurnover semata untuk restore cepat (Blueprint
    // Addendum §A.6). MainForm dan SptTahunanBadan tidak pernah menghitung
    // ulang nilai ini — murni Consumer.
    const [l8GrossTurnover, setL8GrossTurnover] = useState('');
    const [l8TotalIncomeTax, setL8TotalIncomeTax] = useState(0);
    const [l8Eligible, setL8Eligible] = useState(true);

    const handleGrossTurnoverChangeL8 = useCallback((val) => setL8GrossTurnover(val), []);
    const handleTotalIncomeTaxChangeL8 = useCallback((val) => setL8TotalIncomeTax(val), []);
    const handleEligibleChangeL8 = useCallback((val) => setL8Eligible(val), []);

    // Dipanggil oleh MainFormBadan saat draft di-load untuk restore raw input L8.
    // HANYA me-restore l8GrossTurnover (source of truth). l8TotalIncomeTax dan
    // l8Eligible di-restore terpisah sebagai cache (lihat handleSetL8CacheFromDraft)
    // namun akan segera dihitung ulang secara reaktif oleh L8.js begitu mount.
    const handleSetL8GrossTurnoverFromDraft = useCallback((val) => setL8GrossTurnover(val), []);
    const handleSetL8CacheFromDraft = useCallback((totalIncomeTax, eligible) => {
        setL8TotalIncomeTax(totalIncomeTax);
        setL8Eligible(eligible);
    }, []);

    // L9 — Source of Truth: l9Data (Pendekatan B, nested object per
    // category/subgroup — Blueprint L9). Berbeda dari L1A/L2 (array of rows)
    // maupun L8 (scalar tunggal), tapi mengikuti prinsip yang sama: SATU
    // Source of Truth di parent, Lampiran hanya Consumer + emitter.
    //
    // Initial state SELALU memakai buildInitialL9Data() (bukan null/{}),
    // sehingga l9Data punya struktur tangible/building/intangible yang valid
    // sejak render pertama — tidak pernah dalam kondisi "belum terbentuk".
    const [l9Data, setL9Data] = useState(() => buildInitialL9Data());

    // handleL9DataChange — dipanggil oleh L9.js setiap CRUD (Add/Edit/Delete),
    // pola identik onRowsAChange L1A. L9.js sudah mengirim objek immutable
    // (hasil spread baru), sehingga di sini cukup di-assign langsung.
    const handleL9DataChange = useCallback((data) => setL9Data(data), []);

    // Dipanggil oleh MainFormBadan saat draft di-load untuk restore data L9.
    // Selalu di-merge dengan struktur Blueprint (mergeL9WithInitial) agar
    // draft yang tidak lengkap (mis. draft lama sebelum ada subgroup baru)
    // tetap menghasilkan l9Data dengan struktur penuh — pola identik
    // mergeRowsWithDraft L1A, diterapkan pada objek nested alih-alih array.
    const handleSetL9DataFromDraft = useCallback(
        (data) => setL9Data(mergeL9WithInitial(data)), []);

    // ── L10A — Declaration of Transaction with Related Parties ────────────────
    // Source of Truth: l10aRows (array of rows), pola identik l1aRowsA/l2RowsA —
    // TIDAK ADA formula/computed value (Blueprint Final Revisi 5 — Business Rule
    // L10A: "Tidak ada formula. Tidak ada kalkulasi.").
    const [l10aRows, setL10aRows] = useState([]);
    const handleL10aRowsChange = useCallback((rows) => setL10aRows(rows), []);
    // Draft Compatibility Contract: draft lama tanpa key l10aRows → fallback [].
    const handleSetL10aRowsFromDraft = useCallback(
        (rows) => setL10aRows(Array.isArray(rows) ? rows : []), []);

    // ── L10B — Statement of Transaction with Related Parties (deklaratif) ─────
    // Source of Truth: l10bData (nested object per group — Pendekatan B, pola
    // identik l9Data). Initial state SELALU buildInitialL10BData() sehingga
    // seluruh 15 pertanyaan bernilai '' (Blueprint Final Revisi 5 §17 — Default
    // Radio State: TIDAK ADA default 'Yes'/'No').
    const [l10bData, setL10bData] = useState(() => buildInitialL10BData());
    const handleL10bDataChange = useCallback((data) => setL10bData(data), []);
    // Draft Compatibility Contract: draft lama tanpa key l10bData, atau draft
    // dengan struktur tidak lengkap (group/pertanyaan baru) → selalu di-merge
    // dengan buildInitialL10BData() agar struktur penuh terjamin.
    const handleSetL10bDataFromDraft = useCallback(
        (data) => setL10bData(mergeL10BWithInitial(data)), []);

    // ── L10C — Statement of Transactions with Tax Haven Country Resident ──────
    // Source of Truth: l10cRows (array of rows), pola identik l10aRows di atas.
    const [l10cRows, setL10cRows] = useState([]);
    const handleL10cRowsChange = useCallback((rows) => setL10cRows(rows), []);
    // Draft Compatibility Contract: draft lama tanpa key l10cRows → fallback [].
    const handleSetL10cRowsFromDraft = useCallback(
        (rows) => setL10cRows(Array.isArray(rows) ? rows : []), []);

    // ── L10D — Summary of Master Document and Local Document ──────────────────
    // Source of Truth: l10dData (nested object — checklist + date, pola identik
    // l9Data/l10bData). Initial state SELALU buildInitialL10DData().
    const [l10dData, setL10dData] = useState(() => buildInitialL10DData());
    const handleL10dDataChange = useCallback((data) => setL10dData(data), []);
    // Draft Compatibility Contract: draft lama tanpa key l10dData, atau struktur
    // tidak lengkap → selalu di-merge dengan buildInitialL10DData().
    const handleSetL10dDataFromDraft = useCallback(
        (data) => setL10dData(mergeL10DWithInitial(data)), []);

    // ── L11A — Rekapitulasi Biaya-Biaya Tertentu (Blueprint L11 §2/§4/§5) ──────
    // Source of Truth: l11aData (nested object — 6 sub-bagian, pola identik
    // l9Data/l10bData/l10dData). Initial state SELALU buildInitialL11AData()
    // sehingga struktur promotionRows/entertainmentRows/badDebtRows/
    // facilitiesRows/regionalBenefitData/nonPerformingLoanRows selalu valid.
    const [l11aData, setL11aData] = useState(() => buildInitialL11AData());
    // 1 callback (Blueprint L11 §3 Penyederhanaan Callback) — L11A.js mengirim
    // seluruh object sekaligus, pola identik handleL9DataChange.
    const handleL11ADataChange = useCallback((data) => setL11aData(data), []);
    // Draft Compatibility Contract: draft lama tanpa key l11a, atau struktur
    // tidak lengkap (field baru ditambahkan nanti) → selalu di-merge dengan
    // buildInitialL11AData().
    const handleSetL11aDataFromDraft = useCallback(
        (data) => setL11aData(mergeL11AWithInitial(data)), []);

    // ── L11B — Perhitungan Debt to Equity Ratio (Blueprint L11 §2/§4/§5) ───────
    // Source of Truth: l11bData (nested object — Bagian II/III raw input saja;
    // Bagian I EBITDA TIDAK ada di sini, murni derived dari ebitdaComponents).
    const [l11bData, setL11bData] = useState(() => buildInitialL11BData());
    const handleL11BDataChange = useCallback((data) => setL11bData(data), []);
    const handleSetL11bDataFromDraft = useCallback(
        (data) => setL11bData(mergeL11BWithInitial(data)), []);

    // ── EBITDA Components handlers (Blueprint L11 §4 EBITDA Contract) ──────────
    // Pola identik handleA10ChangeL1A/C/D — 1 callback per Lampiran L1, stabil
    // via useCallback agar tidak memicu loop pada useEffect emit di L1A/L1C/L1D.
    const handleEbitdaComponentsChangeL1A = useCallback(
        (vals) => setEbitdaComponentsByLampiran(prev => ({ ...prev, L1A: vals })), []);
    const handleEbitdaComponentsChangeL1C = useCallback(
        (vals) => setEbitdaComponentsByLampiran(prev => ({ ...prev, L1C: vals })), []);
    const handleEbitdaComponentsChangeL1D = useCallback(
        (vals) => setEbitdaComponentsByLampiran(prev => ({ ...prev, L1D: vals })), []);

    const handleSptDataChange = useCallback((data) => {
        setSptData(data);
    }, []); // tidak ada dependency — hanya memanggil setter

    // ── DERIVED visibility — all computed from sptData ────────────────────────

    // Business classification → L1 tab
    const businessClassification = sptData.general_info?.business_classification || '';
    const l1Tab = L1_TAB_MAP[businessClassification] || null;

    // Nilai A.10 yang aktif — dipilih berdasarkan Lampiran yang sedang aktif.
    // Jika Business Classification berubah, nilai Lampiran lain tetap tersimpan
    // di a10ByLampiran; hanya activeA10 yang berganti sumber.
    const activeA10 = a10ByLampiran[l1Tab?.id] ?? 0;

    // Komponen EBITDA yang aktif — dipilih berdasarkan Lampiran yang sedang
    // aktif, pola identik activeA10. OPEN CLARIFICATION #5 (Blueprint L11 §1
    // poin 5) — belum final apakah EBITDA memang harus mengikuti Business
    // Classification aktif seperti A.10.
    const activeEbitdaComponents = ebitdaComponentsByLampiran[l1Tab?.id] ?? EBITDA_COMPONENTS_DEFAULT;

    // Section C
    const showL5    = sptData.balance_sheet?.q1_gr23 === 'Yes';
    const showPartA = sptData.balance_sheet?.q2_final_tax === 'Yes';
    const showPartB = sptData.balance_sheet?.q3_excluded_tax === 'Yes';
    const showL4    = showPartA || showPartB;

    // Section D enable/disable
    const sectionDDisabled = sptData.balance_sheet?.q1b_solely_gr23 !== 'No';

    // Section D tabs (only meaningful when section D is enabled)
    const showL7       = !sectionDDisabled && sptData.profit_loss?.p8_carried_losses === 'Yes';
    const showL8       = !sectionDDisabled && sptData.profit_loss?.p11_tax_rate === 'Tarif Fasilitas Pasal 31E ayat (1)';
    const showL13PartA = !sectionDDisabled && sptData.profit_loss?.p5_investment_facility === 'Yes';
    const showL13PartB = !sectionDDisabled && sptData.profit_loss?.p6_vocational_deduction === 'Yes';
    const showL13PartD = !sectionDDisabled && sptData.profit_loss?.p10_rd_deduction === 'Yes';

    // Section E
    const showL3       = sptData.tax_calculation?.q13_overseas_credit === 'Yes';
    const showL13PartC = sptData.tax_calculation?.q16_payable_deduction === 'Yes';

    // Section G
    const showL6 = sptData.tax_payable?.q20_art25_obliged === 'No';

    // Section H
    const q21a = sptData.transactions?.q21a_related_party === 'Yes';
    const q21b = sptData.transactions?.q21b_tp_document === 'Yes';
    const showL10PartA = q21a;
    const showL10PartB = q21a;
    const showL10PartC = q21a;
    const showL10PartD = q21b;

    const showL2PartB  = sptData.transactions?.q21c_capital_investment === 'Yes'
                      || sptData.transactions?.q21d_debt_receivable     === 'Yes';
    // Tab L-2 SELALU tampil sejak SPT baru dibuat (Bagian A bersifat umum, tidak
    // tergantung 21c/21d). showL2PartB di atas HANYA dipakai untuk mengontrol
    // visibilitas Bagian B di dalam L2.js (diteruskan sebagai prop showPartB),
    // bukan lagi untuk gating tab.
    const showL2       = true;

    const showL9    = sptData.transactions?.q21e_fiscal_depreciation  === 'Yes';
    const showL11A  = sptData.transactions?.q21f_entertainment_expense === 'Yes';

    // H Q21g → L13 Part A (investment) — merged with D Q5
    const showL13PartG = sptData.transactions?.q21g_investment_facility === 'Yes';

    const showL14 = sptData.transactions?.q21h_reinvestment === 'Yes';

    // L13 — show if any part active
    const showL13 = showL13PartA || showL13PartB || showL13PartC || showL13PartD || showL13PartG;

    // ── L5 source data mapping ───────────────────────────────────────────────
    // Prioritas sumber data (Blueprint L5 Final §Bagian A):
    //   1. General Information TKU — belum tersedia, dikembangkan fase berikutnya.
    //   2. Alamat Domisili (Alamat Utama) dari sptData.addresses (proses registrasi).
    //   3. Jika keduanya tidak tersedia → l5Places = [] → L5.js tampil kondisi kosong.
    // Seluruh mapping dilakukan di parent — L5.js tidak mengetahui asal data.
    // Ketika General Information selesai dikembangkan, hanya fungsi-fungsi ini
    // yang perlu diubah — implementasi L5.js tidak perlu disentuh.

    // ── Section D full reset callback (called from FinalTaxIncomeSection when Q1b → YES) ─
    // No state to reset anymore — derived from sptData automatically.
    // We still need to navigate away from D-only tabs if section D was disabled.
    const handleResetSectionD = useCallback(() => {
        // derived state handles visibility; just nav away from now-hidden tabs
        if (['L7', 'L8'].includes(activeTab)) setActiveTab('main');
        if (activeTab === 'L13' && !showL13PartC && !showL13PartG) setActiveTab('main');
    }, [activeTab, showL13PartC, showL13PartG]);

    // ── Tabs ──────────────────────────────────────────────────────────────────
    const tabs = [
        { id: 'main',  label: 'Main Form', show: true },
        { id: 'L1A',   label: 'L-1A',      show: l1Tab?.id === 'L1A' },
        { id: 'L1C',   label: 'L-1C',      show: l1Tab?.id === 'L1C' },
        { id: 'L1D',   label: 'L-1D',      show: l1Tab?.id === 'L1D' },
        { id: 'L2',    label: 'L-2',       show: showL2   },
        { id: 'L3',    label: 'L-3',       show: showL3   },
        { id: 'L4',    label: 'L-4',       show: showL4   },
        { id: 'L5',    label: 'L-5',       show: showL5   },
        { id: 'L6',    label: 'L-6',       show: showL6   },
        { id: 'L7',    label: 'L-7',       show: showL7   },
        { id: 'L8',    label: 'L-8',       show: showL8   },
        { id: 'L9',    label: 'L-9',       show: showL9   },
        { id: 'L10A',  label: 'L-10A',     show: showL10PartA },
        { id: 'L10B',  label: 'L-10B',     show: showL10PartB },
        { id: 'L10C',  label: 'L-10C',     show: showL10PartC },
        { id: 'L10D',  label: 'L-10D',     show: showL10PartD },
        { id: 'L11A',  label: 'L-11A',     show: showL11A },
        { id: 'L11B',  label: 'L-11B',     show: true },
        { id: 'L13',   label: 'L-13',      show: showL13  },
        { id: 'L14',   label: 'L-14',      show: showL14  },
    ].filter(t => t.show);

    // If activeTab is no longer in the visible tabs list, reset to main
    React.useEffect(() => {
        if (activeTab !== 'main' && !tabs.find(t => t.id === activeTab)) {
            setActiveTab('main');
        }
    }, [tabs, activeTab]);

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 px-6 pt-4">
                CORPORATE INCOME TAX RETURN (SPT TAHUNAN BADAN)
            </h1>

            {/* Tab Navigation */}
            <div className="flex flex-wrap border-b border-gray-200 bg-white px-6">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2 text-sm font-medium border-b-2 transition-colors mr-1 ${
                            activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content — ALL mounted, visibility via CSS only */}
            <div>
                <div style={{ display: activeTab === 'main' ? 'block' : 'none' }}>
                    <MainFormBadan
                        onBusinessClassificationChange={() => {}} // handled via onSptDataChange
                        businessClassification={businessClassification}
                        onTabTrigger={() => {}}                   // no longer needed — derived state
                        sectionDDisabled={sectionDDisabled}
                        onResetSectionD={handleResetSectionD}
                        onSptDataChange={handleSptDataChange}
                        a10Value={activeA10}
                        l1aRowsA={l1aRowsA}
                        l1aRowsB={l1aRowsB}
                        setL1aRowsFromDraft={handleSetL1aRowsFromDraft}
                        l1cRowsA={l1cRowsA}
                        l1cRowsBAset={l1cRowsBAset}
                        l1cRowsBLiabEkuitas={l1cRowsBLiabEkuitas}
                        setL1cRowsFromDraft={handleSetL1cRowsFromDraft}
                        l1dRowsA={l1dRowsA}
                        l1dRowsBAset={l1dRowsBAset}
                        l1dRowsBLiabEkuitas={l1dRowsBLiabEkuitas}
                        setL1dRowsFromDraft={handleSetL1dRowsFromDraft}
                        l2RowsA={l2RowsA}
                        l2RowsB={l2RowsB}
                        setL2RowsFromDraft={handleSetL2RowsFromDraft}
                        l3RowsA={l3RowsA}
                        l3RowsB={l3RowsB}
                        l3PriorYearCreditRefund={l3PriorYearCreditRefund}
                        setL3RowsFromDraft={handleSetL3RowsFromDraft}
                        l3CreditAmount={l3CreditAmount}
                        l4RowsA={l4RowsA}
                        l4RowsB={l4RowsB}
                        setL4RowsFromDraft={handleSetL4RowsFromDraft}
                        l5Rows={l5Rows}
                        l5Places={l5Places}
                        setL5RowsFromDraft={handleSetL5RowsFromDraft}
                        setL5PlacesFromDraft={handleSetL5PlacesFromDraft}
                        onCompanyDataChange={handleCompanyDataChange}
                        l6IncomeBase={l6IncomeBase}
                        l6PreviousYearTaxCredit={l6PreviousYearTaxCredit}
                        l6Installment={l6Installment}
                        setL6IncomeBaseFromDraft={handleSetL6IncomeBaseFromDraft}
                        setL6PreviousYearTaxCreditFromDraft={handleSetL6PreviousYearTaxCreditFromDraft}
                        l7Rows={l7Rows}
                        l7TotalCol8ForD8={l7TotalCol8ForD8}
                        l7TotalCol9ForL6={l7TotalCol9ForL6}
                        setL7RowsFromDraft={handleL7RowsChange}
                        setL7TotalCol8FromDraft={handleTotalCol8ChangeL7}
                        setL7TotalCol9FromDraft={handleTotalCol9ChangeL7}
                        l8GrossTurnover={l8GrossTurnover}
                        l8TotalIncomeTax={l8TotalIncomeTax}
                        l8Eligible={l8Eligible}
                        setL8GrossTurnoverFromDraft={handleSetL8GrossTurnoverFromDraft}
                        setL8CacheFromDraft={handleSetL8CacheFromDraft}
                        l9Data={l9Data}
                        setL9DataFromDraft={handleSetL9DataFromDraft}
                        l10aRows={l10aRows}
                        setL10aRowsFromDraft={handleSetL10aRowsFromDraft}
                        l10bData={l10bData}
                        setL10bDataFromDraft={handleSetL10bDataFromDraft}
                        l10cRows={l10cRows}
                        setL10cRowsFromDraft={handleSetL10cRowsFromDraft}
                        l10dData={l10dData}
                        setL10dDataFromDraft={handleSetL10dDataFromDraft}
                        l11aData={l11aData}
                        setL11aDataFromDraft={handleSetL11aDataFromDraft}
                        l11bData={l11bData}
                        setL11bDataFromDraft={handleSetL11bDataFromDraft}
                    />
                </div>
                {l1Tab?.id === 'L1A' && (
                    <div style={{ display: activeTab === 'L1A' ? 'block' : 'none' }}>
                        <L1A
                            onA10Change={handleA10ChangeL1A}
                            onEbitdaComponentsChange={handleEbitdaComponentsChangeL1A}
                            onRowsAChange={handleRowsAChange}
                            onRowsBChange={handleRowsBChange}
                            l1aRowsA={l1aRowsA}
                            l1aRowsB={l1aRowsB}
                            taxYear={sptData.header?.tax_year}
                            tin={sptData.company_identity?.npwp}
                        />
                    </div>
                )}
{l1Tab?.id === 'L1C' && <div style={{ display: activeTab === 'L1C' ? 'block' : 'none' }}>
                    <L1C
                        onA10Change={handleA10ChangeL1C}
                        onEbitdaComponentsChange={handleEbitdaComponentsChangeL1C}
                        l1cRowsA={l1cRowsA}
                        l1cRowsBAset={l1cRowsBAset}
                        l1cRowsBLiabEkuitas={l1cRowsBLiabEkuitas}
                        onRowsAChange={handleRowsAChangeL1C}
                        onRowsBAsetChange={handleRowsBAsetChangeL1C}
                        onRowsBLiabEkuitasChange={handleRowsBLiabEkuitasChangeL1C}
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                    />
                </div>}
{l1Tab?.id === 'L1D' && <div style={{ display: activeTab === 'L1D' ? 'block' : 'none' }}>
                    <L1D
                        onA10Change={handleA10ChangeL1D}
                        onEbitdaComponentsChange={handleEbitdaComponentsChangeL1D}
                        l1dRowsA={l1dRowsA}
                        l1dRowsBAset={l1dRowsBAset}
                        l1dRowsBLiabEkuitas={l1dRowsBLiabEkuitas}
                        onRowsAChange={handleRowsAChangeL1D}
                        onRowsBAsetChange={handleRowsBAsetChangeL1D}
                        onRowsBLiabEkuitasChange={handleRowsBLiabEkuitasChangeL1D}
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                    />
                </div>}
                {showL2   && <div style={{ display: activeTab === 'L2'   ? 'block' : 'none' }}>
                    <L2
                        l2RowsA={l2RowsA}
                        l2RowsB={l2RowsB}
                        onRowsAChange={handleRowsAChangeL2}
                        onRowsBChange={handleRowsBChangeL2}
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                        showPartB={showL2PartB}
                    />
                </div>}
                {showL3   && <div style={{ display: activeTab === 'L3'   ? 'block' : 'none' }}>
                    <L3
                        l3RowsA={l3RowsA}
                        l3RowsB={l3RowsB}
                        priorYearCreditRefund={l3PriorYearCreditRefund}
                        onRowsAChange={handleRowsAChangeL3}
                        onRowsBChange={handleRowsBChangeL3}
                        onPriorYearCreditRefundChange={handlePriorYearCreditRefundChangeL3}
                        onCreditAmountChange={handleCreditAmountChangeL3}
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                    />
                </div>}
                {showL4   && <div style={{ display: activeTab === 'L4'   ? 'block' : 'none' }}><L4 showPartA={showPartA} showPartB={showPartB} l4RowsA={l4RowsA} l4RowsB={l4RowsB} onRowsAChange={handleRowsAChangeL4} onRowsBChange={handleRowsBChangeL4} taxYear={sptData.header?.tax_year} tin={sptData.company_identity?.npwp} /></div>}
                {showL5   && (
                    <div style={{ display: activeTab === 'L5' ? 'block' : 'none' }}>
                        <L5
                            l5Places={l5Places}
                            l5Rows={l5Rows}
                            onRowsChange={handleRowsChangeL5}
                            taxYear={sptData.header?.tax_year}
                            tin={sptData.company_identity?.npwp}
                        />
                    </div>
                )}
                {showL6   && <div style={{ display: activeTab === 'L6'   ? 'block' : 'none' }}>
                    <L6
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                        incomeBase={l6IncomeBase}
                        previousYearTaxCredit={l6PreviousYearTaxCredit}
                        fiscalLossFromL7={showL7 ? l7TotalCol9ForL6 : 0}
                        onIncomeBaseChange={handleIncomeBaseChangeL6}
                        onPreviousYearTaxCreditChange={handlePreviousYearTaxCreditChangeL6}
                        onInstallmentChange={handleInstallmentChangeL6}
                    />
                </div>}
                {showL7   && <div style={{ display: activeTab === 'L7'   ? 'block' : 'none' }}>
                    <L7
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                        l7Rows={l7Rows}
                        l7TaxYears={l7TaxYears}
                        onRowsChange={handleL7RowsChange}
                        onTotalCol8Change={handleTotalCol8ChangeL7}
                        onTotalCol9Change={handleTotalCol9ChangeL7}
                    />
                </div>}
                {showL8   && <div style={{ display: activeTab === 'L8'   ? 'block' : 'none' }}>
                    <L8
                        grossTurnover={l8GrossTurnover}
                        onGrossTurnoverChange={handleGrossTurnoverChangeL8}
                        taxableIncome={sptData.profit_loss?.p9_taxable_income}
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                        onTotalIncomeTaxChange={handleTotalIncomeTaxChangeL8}
                        onEligibleChange={handleEligibleChangeL8}
                    />
                </div>}
                {showL9   && <div style={{ display: activeTab === 'L9'   ? 'block' : 'none' }}>
                    <L9
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                        l9Data={l9Data}
                        onL9DataChange={handleL9DataChange}
                    />
                </div>}
                {showL10PartA && <div style={{ display: activeTab === 'L10A' ? 'block' : 'none' }}>
                    <L10A
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                        rows={l10aRows}
                        onRowsChange={handleL10aRowsChange}
                    />
                </div>}
                {showL10PartB && <div style={{ display: activeTab === 'L10B' ? 'block' : 'none' }}>
                    <L10B
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                        data={l10bData}
                        onDataChange={handleL10bDataChange}
                    />
                </div>}
                {showL10PartC && <div style={{ display: activeTab === 'L10C' ? 'block' : 'none' }}>
                    <L10C
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                        rows={l10cRows}
                        onRowsChange={handleL10cRowsChange}
                    />
                </div>}
                {showL10PartD && <div style={{ display: activeTab === 'L10D' ? 'block' : 'none' }}>
                    <L10D
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                        data={l10dData}
                        onDataChange={handleL10dDataChange}
                    />
                </div>}
                {showL11A && <div style={{ display: activeTab === 'L11A' ? 'block' : 'none' }}>
                    <L11A
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                        l11aData={l11aData}
                        onL11ADataChange={handleL11ADataChange}
                    />
                </div>}
                <div style={{ display: activeTab === 'L11B' ? 'block' : 'none' }}>
                    <L11B
                        taxYear={sptData.header?.tax_year}
                        tin={sptData.company_identity?.npwp}
                        ebitdaComponents={activeEbitdaComponents}
                        l11bData={l11bData}
                        onL11BDataChange={handleL11BDataChange}
                    />
                </div>
                {showL13  && (
                    <div style={{ display: activeTab === 'L13' ? 'block' : 'none' }}>
                        <L13
                            showPartA={showL13PartA || showL13PartG}
                            showPartB={showL13PartB}
                            showPartC={showL13PartC}
                            showPartD={showL13PartD}
                            taxYear={sptData.header?.tax_year}
                            tin={sptData.company_identity?.npwp}
                        />
                    </div>
                )}
                {showL14  && (
                    <div style={{ display: activeTab === 'L14' ? 'block' : 'none' }}>
                        <L14
                            taxYear={sptData.header?.tax_year}
                            tin={sptData.company_identity?.npwp}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SptTahunanBadan;