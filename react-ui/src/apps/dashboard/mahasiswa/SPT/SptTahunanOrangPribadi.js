import React, { useState, useEffect } from 'react';
import {
    Check, Download, FileOpen, ArrowBack, ArrowForward,
    Save, Send, Warning, Info, Upload, Delete, ExpandMore, ExpandLess,
    Person, Assignment, Calculate, CreditCard, AccountBalance,
    Refresh, Business, AttachFile, CheckBox,
} from '@mui/icons-material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material'
import API from "../../../../utils/host.config";
import L1AssetsForm from './Pribadi/L1AssetForm';
import L2Form from './Pribadi/L2';
import L3A1Form from './Pribadi/L3A1';
import L3A2Form from './Pribadi/L3A2';
import L3A3Form from './Pribadi/L3A3';
import L3A4Form from './Pribadi/L3A4';
import L3BForm from './Pribadi/L3B';
import L3CForm from './Pribadi/L3C';
import L3DForm from './Pribadi/L3D';
import L4Form from './Pribadi/L4';
import { L5Form } from './Pribadi/L5';

const SptTahunanForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sptId, setSptId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [expandedSections, setExpandedSections] = useState({ header: true });
    const [taxpayerData, setTaxpayerData] = useState(null);
    const [autoFillAttempted, setAutoFillAttempted] = useState(false);
    const [activeTab, setActiveTab] = useState('main');
    const [l1Data, setL1Data] = useState({
        cash_and_cash_equivalents: [],
        account_receivable: [],
        investments_securities: [],
        movable_assets: [],
        non_movable_assets: [],
        other_assets: [],
        debt_at_end_of_year: [],
        employment_income: [],
        withholding_tax: []
    });
    const [l2Data, setL2Data] = useState({})
    const [l3A1Data, setL3A1Data] = useState({})
    const [l3A2Data, setL3A2Data] = useState({})
    const [l3A3Data, setL3A3Data] = useState({})
    const [l3A4Data, setL3A4Data] = useState({})
    const [l3BData, setL3BData] = useState({})
    const [l3CData, setL3CData] = useState({})
    const [l3DData, setL3DData] = useState({})
    const [l4Data, setL4Data] = useState({})
    const [l5Data, setL5Data] = useState({})

    // Tambahkan state baru setelah state paymentAmount (sekitar baris 50)
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [useDepositBalance, setUseDepositBalance] = useState(false);

    console.log('test ', l1Data)

    // Form data state
    const [sptData, setSptData] = useState({
        // Header data
        header: {
            tax_year: new Date().getFullYear() - 1,
            status: 'NORMAL',
            bookkeeping_type: 'Simple Bookkeeping',
            accounting_period_start: '01 January',
            accounting_period_end: '31 December',
            source_of_income: ''
        },

        // A. Identity of Taxpayers
        identity: {
            nik: '',
            name: '',
            identity_type: 'KTP',
            id_number: '',
            mobile_phone: '',
            email: '',
            tax_obligation_status: '',
            spouse_nik: ''
        },

        // B. Summary of Income
        income_summary: {
            employment_income: false,
            business_income: false,
            other_domestic_income: false,
            foreign_income: false,
            employment_income_amount: 0,
        },

        // C. Income Tax Payable Calculation
        tax_calculation: {
            net_income_deduction: false,
            net_income_year: 0, // BARU - Question 2
            additional_deduction: false,
            additional_deduction_amount: 0, // BARU - Question 3 input
            net_income_after_deduction: 0, // BARU - Question 4
            tax_exemptions: '',
            tax_exemptions_amount: 0, // BARU - Question 5 input
            taxable_income: 0, // BARU - Question 6
            income_tax_payable: 0, // BARU - Question 7
            income_tax_deduction: false,
            income_tax_deduction_amount: 0, // BARU - Question 8 input
            income_tax_after_deduction: 0, // BARU - Question 9
        },

        // D. Income Tax Credit
        tax_credit: {
            withheld_income_tax: false,
            withheld_income_tax_amount: 0, // BARU
            installment_article_25: false,
            installment_article_25_amount: 0, // BARU
            notice_tax_collection: false,
            notice_tax_collection_amount: 0, // BARU
            foreign_tax_credit: false,
            foreign_tax_credit_amount: 0, // BARU
        },

        // E. Underpayment/Overpayment
        underpayment: {
            underpayment_amount: 0, // 11.a Underpayment/Overpayment
            approval_letter: false, // 11.b radio button
            approval_letter_amount: 0, // 11.b input amount
            final_payment_amount: 0, // 11.c Income Tax Still to be Paid
        },

        // F. Amendment (conditional)
        amendment: {
            previous_underpayment: '',
            amendment_underpayment: ''
        },

        // G. Refund (conditional)
        refund: {
            refund_method: '',
            bank_account: ''
        },

        // H. Income Tax Installment
        installment: {
            article_25_obligation: false,
            specific_entrepreneur: false
        },

        // I. Statement of Other Transactions
        other_transactions: {
            assets_end_year: false,
            debt_end_year: false,
            final_income_tax: false,
            excluded_income: false,
            depreciation_amortization: false,
            entertainment_expense: false,
            dividend_income: false
        },

        // J. Additional Attachments
        attachments: {
            financial_statement: { required: false, file: null },
            payment_proof: { required: false, file: null },
            withholding_relation: { required: false, file: null },
            attorney_letter: { required: false, file: null },
            other_documents: { required: false, file: null }
        },

        // K. Statement
        statement: {
            declaration: false,
            signature: '',
            tin_nik: '',
            full_name: '',
            representative: ''
        }
    });

    const sections = [
        { id: 'header', title: 'HEADER', icon: Assignment },
        { id: 'identity', title: 'A. IDENTITY OF TAXPAYERS', icon: Person },
        { id: 'income', title: 'B. SUMMARY OF INCOME', icon: AccountBalance },
        { id: 'calculation', title: 'C. INCOME TAX PAYABLE CALCULATION', icon: Calculate },
        { id: 'credit', title: 'D. INCOME TAX CREDIT', icon: CreditCard },
        { id: 'underpayment', title: 'E. UNDERPAYMENT/OVERPAYMENT INCOME TAX', icon: Refresh },
        { id: 'amendment', title: 'F. AMENDMENT TAX RETURN (Only if the status of Tax Return is Amendment)', icon: FileOpen },
        { id: 'refund', title: 'G. REFUND (Only if the status of Tax Return is Overpayment)', icon: AccountBalance },
        { id: 'installment', title: 'H. INCOME TAX INSTALLMENT', icon: Business },
        { id: 'transactions', title: 'I. STATEMENT OF OTHER TRANSACTIONS', icon: Assignment },
        { id: 'attachments', title: 'J. ADDITIONAL ATTACHMENTS', icon: AttachFile },
        { id: 'statement', title: 'K. STATEMENT', icon: CheckBox }
    ];


    // Tambahkan useEffect ini setelah useEffect yang sudah ada (sekitar baris 260)

    // Auto-calculate final payment amount
    useEffect(() => {
        const calculateFinalPayment = () => {
            // 11.a: Underpayment/Overpayment (bisa positif atau negatif)
            const underpaymentAmount = parseFloat(sptData.underpayment.underpayment_amount) || 0;

            // 11.b: Approval letter amount (pengurang)
            const approvalAmount = sptData.underpayment.approval_letter
                ? (parseFloat(sptData.underpayment.approval_letter_amount) || 0)
                : 0;

            // 11.c: Final payment = 11.a - 11.b (hanya jika positif)
            const finalAmount = Math.max(0, underpaymentAmount - approvalAmount);

            // Update final_payment_amount
            if (sptData.underpayment.final_payment_amount !== finalAmount) {
                updateSectionData('underpayment', { final_payment_amount: finalAmount });
            }
        };

        calculateFinalPayment();
    }, [
        sptData.underpayment.underpayment_amount,
        sptData.underpayment.approval_letter,
        sptData.underpayment.approval_letter_amount
    ]);

    // Auto-calculate underpayment amount (11.a)
    useEffect(() => {
        const calculateUnderpayment = () => {
            // 9: Income tax after deduction
            const taxAfterDeduction = parseFloat(sptData.tax_calculation.income_tax_after_deduction) || 0;

            // 10.a: Withheld income tax
            const withheldTax = sptData.tax_credit.withheld_income_tax
                ? (parseFloat(sptData.tax_credit.withheld_income_tax_amount) || 0)
                : 0;

            // 10.b: Installment article 25
            const installmentTax = parseFloat(sptData.tax_credit.installment_article_25_amount) || 0;

            // 10.c: Notice of tax collection
            const noticeTax = parseFloat(sptData.tax_credit.notice_tax_collection_amount) || 0;

            // 10.d: Foreign tax credit (ditambahkan karena refund)
            const foreignCredit = sptData.tax_credit.foreign_tax_credit
                ? (parseFloat(sptData.tax_credit.foreign_tax_credit_amount) || 0)
                : 0;

            // Formula: 9 - 10a - 10b - 10c + 10d
            const underpayment = taxAfterDeduction - withheldTax - installmentTax - noticeTax + foreignCredit;

            // Update underpayment_amount
            if (sptData.underpayment.underpayment_amount !== underpayment) {
                updateSectionData('underpayment', { underpayment_amount: underpayment });
            }
        };

        calculateUnderpayment();
    }, [
        sptData.tax_calculation.income_tax_after_deduction,
        sptData.tax_credit.withheld_income_tax,
        sptData.tax_credit.withheld_income_tax_amount,
        sptData.tax_credit.installment_article_25_amount,
        sptData.tax_credit.notice_tax_collection_amount,
        sptData.tax_credit.foreign_tax_credit,
        sptData.tax_credit.foreign_tax_credit_amount
    ]);

    // Fetch taxpayer data on component mount
    useEffect(() => {
        fetchTaxpayerData();
        // Jika ada sptId dari props/params, load existing data
        const urlParams = new URLSearchParams(window.location.search);
        const existingSptId = urlParams.get('sptId');
        if (existingSptId) {
            setSptId(existingSptId);
            fetchSptData(existingSptId);
        }
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('xtoken') || sessionStorage.getItem('xtoken');
        return {
            'Authorization': `Bearer ${token}`
        };
    };

    const handleL1DataChange = (newL1Data) => {
        setL1Data(newL1Data);
    };

    const handleL2DataChange = (newL2Data) => {
        setL2Data(newL2Data);
    };

    const handleL3A1DataChange = (newL3A1Data) => {
        setL3A1Data(newL3A1Data);
    };

    const handleL3A2DataChange = (newL3A2Data) => {
        setL3A2Data(newL3A2Data);
    };

    const handleL3A3DataChange = (newL3A3Data) => {
        setL3A3Data(newL3A3Data);
    };

    const handleL3A4DataChange = (newL3A4Data) => {
        setL3A4Data(newL3A4Data);
    };

    const handleL3BDataChange = (newL3BData) => {
        setL3BData(newL3BData);
    };

    const handleL3CDataChange = (newL3CData) => {
        setL3CData(newL3CData);
    };

    const handleL3DDataChange = (newL3DData) => {
        setL3DData(newL3DData);
    };

    const handleL4DataChange = (newL4Data) => {
        setL4Data(newL4Data);
    };

    const handleL5DataChange = (newL5Data) => {
        setL5Data(newL5Data);
    };


    const fetchTaxpayerData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API.HOST}/api/v2/taxpayer/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }
            });

            const result = await response.json();
            if (result.success && result.data) {
                setTaxpayerData(result.data);
                setAutoFillAttempted(true);

                // HANYA auto-fill jika form benar-benar kosong (initial load)
                setSptData(prev => {
                    // Cek apakah ini initial load (semua field kosong)
                    const isInitialLoad = !prev.identity.nik && !prev.identity.name &&
                        !prev.identity.email && !prev.statement.tin_nik;

                    if (isInitialLoad) {
                        return {
                            ...prev,
                            identity: {
                                ...prev.identity,
                                nik: result.data.nik || '',
                                name: result.data.full_name || '',
                                id_number: result.data.nik || '',
                                mobile_phone: result.data.handphone || '',
                                email: result.data.email || '',
                                tax_obligation_status: result.data.marital_status === 'Married' ? 'Married' :
                                    result.data.marital_status === 'Single' ? 'Single' : ''
                            },
                            statement: {
                                ...prev.statement,
                                tin_nik: result.data.nik || '',
                                full_name: result.data.full_name || ''
                            }
                        };
                    }

                    // Jika sudah ada data, jangan timpa
                    return prev;
                });
            } else {
                setAutoFillAttempted(true);
            }
        } catch (error) {
            console.error('Error fetching taxpayer data:', error);
            setAutoFillAttempted(true);
        } finally {
            setLoading(false);
        }
    };


    // Tambah function untuk fetch existing SPT data
    const fetchSptData = async (sptId) => {
        try {
            setLoading(true);
            const response = await fetch(`${API.HOST}/api/v2/spt-tahunan/${sptId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }
            });

            const result = await response.json();
            if (result.success && result.data) {
                const sptDetail = result.data;

                // Parse JSON fields and populate main form
                setSptData(prev => ({
                    ...prev,
                    header: {
                        tax_year: sptDetail.tax_year || prev.header.tax_year,
                        status: sptDetail.tax_return_model || prev.header.status,
                        bookkeeping_type: sptDetail.bookkeeping_type || prev.header.bookkeeping_type,
                        source_of_income: sptDetail.source_of_income || prev.header.source_of_income,
                        accounting_period_start: prev.header.accounting_period_start,
                        accounting_period_end: prev.header.accounting_period_end
                    },
                    identity: sptDetail.taxpayer_identity ?
                        { ...prev.identity, ...JSON.parse(sptDetail.taxpayer_identity) } : prev.identity,
                    income_summary: sptDetail.income_summary ?
                        { ...prev.income_summary, ...JSON.parse(sptDetail.income_summary) } : prev.income_summary,
                    tax_calculation: sptDetail.income_tax_calculation ?
                        { ...prev.tax_calculation, ...JSON.parse(sptDetail.income_tax_calculation) } : prev.tax_calculation,
                    tax_credit: sptDetail.income_tax_credit ?
                        { ...prev.tax_credit, ...JSON.parse(sptDetail.income_tax_credit) } : prev.tax_credit,
                    underpayment: sptDetail.underpayment_overpayment ?
                        { ...prev.underpayment, ...JSON.parse(sptDetail.underpayment_overpayment) } : prev.underpayment,
                    amendment: sptDetail.amendment_tax_return ?
                        { ...prev.amendment, ...JSON.parse(sptDetail.amendment_tax_return) } : prev.amendment,
                    refund: sptDetail.refund_data ?
                        { ...prev.refund, ...JSON.parse(sptDetail.refund_data) } : prev.refund,
                    installment: sptDetail.income_tax_installment ?
                        { ...prev.installment, ...JSON.parse(sptDetail.income_tax_installment) } : prev.installment,
                    other_transactions: sptDetail.other_transactions ?
                        { ...prev.other_transactions, ...JSON.parse(sptDetail.other_transactions) } : prev.other_transactions,
                    attachments: sptDetail.additional_attachments ?
                        { ...prev.attachments, ...JSON.parse(sptDetail.additional_attachments) } : prev.attachments,
                    statement: sptDetail.statement_data ?
                        { ...prev.statement, ...JSON.parse(sptDetail.statement_data) } : prev.statement
                }));

                // Parse and set detail data with proper default values
                if (sptDetail.detail) {
                    try {
                        const detailData = JSON.parse(sptDetail.detail);

                        // Set L1 data with default structure
                        if (detailData.l1_assets) {
                            setL1Data({
                                cash_and_cash_equivalents: detailData.l1_assets.cash_and_cash_equivalents || [],
                                account_receivable: detailData.l1_assets.account_receivable || [],
                                investments_securities: detailData.l1_assets.investments_securities || [],
                                movable_assets: detailData.l1_assets.movable_assets || [],
                                non_movable_assets: detailData.l1_assets.non_movable_assets || [],
                                other_assets: detailData.l1_assets.other_assets || [],
                                debt_at_end_of_year: detailData.l1_assets.debt_at_end_of_year || [],
                                employment_income: detailData.l1_assets.employment_income || [],
                                withholding_tax: detailData.l1_assets.withholding_tax || []
                            });
                        }

                        // Set L2 data with default structure
                        if (detailData.l2_data) {
                            setL2Data(detailData.l2_data);
                        }

                        // Set L3A1 data with default structure
                        if (detailData.l3a1_data) {
                            setL3A1Data(detailData.l3a1_data);
                        }

                        // Set L3A2 data with default structure
                        if (detailData.l3a2_data) {
                            setL3A2Data(detailData.l3a2_data);
                        }

                        // Set L3A3 data with default structure
                        if (detailData.l3a3_data) {
                            setL3A3Data(detailData.l3a3_data);
                        }

                        // Set L3A4 data with default structure
                        if (detailData.l3a4_data) {
                            setL3A4Data(detailData.l3a4_data);
                        }

                        // Set L3B data with default structure
                        if (detailData.l3b_data) {
                            setL3BData(detailData.l3b_data);
                        }

                        // Set L3C data with default structure
                        if (detailData.l3c_data) {
                            setL3CData(detailData.l3c_data);
                        }

                        // Set L3D data with default structure
                        if (detailData.l3d_data) {
                            setL3DData(detailData.l3d_data);
                        }

                        // Set L4 data with default structure
                        if (detailData.l4_data) {
                            setL4Data(detailData.l4_data);
                        }

                        // Set L5 data with default structure
                        if (detailData.l5_data) {
                            setL5Data(detailData.l5_data);
                        }

                    } catch (parseError) {
                        console.error('Error parsing detail data:', parseError);
                        // Keep default values if parsing fails
                    }
                }

                setSuccess('Data SPT berhasil dimuat');
            }
        } catch (error) {
            console.error('Error fetching SPT data:', error);
            setError('Gagal mengambil data SPT');
        } finally {
            setLoading(false);
        }
    };
    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };
    const updateSectionData = (section, data) => {
        setSptData(prev => ({
            ...prev,
            [section]: { ...prev[section], ...data }
        }));
    };

    const createSpt = async () => {
        setLoading(true);
        try {
            // Validasi data taxpayer terlebih dahulu
            if (!taxpayerData) {
                setError('Data taxpayer tidak ditemukan. Silakan lengkapi registrasi taxpayer terlebih dahulu.');
                return false;
            }

            // Validasi required fields
            if (!sptData.header.source_of_income) {
                setError('Source of Income wajib diisi');
                return false;
            }

            const response = await fetch(`${API.HOST}/api/v2/spt-tahunan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({
                    tax_year: sptData.header.tax_year,
                    tax_period: `${sptData.header.tax_year} January - December`,
                    tax_return_model: sptData.header.status,
                    bookkeeping_type: sptData.header.bookkeeping_type,
                    source_of_income: sptData.header.source_of_income
                })
            });

            const result = await response.json();
            if (result.success) {
                setSptId(result.data.id);
                setSuccess('SPT Tahunan berhasil dibuat dengan data taxpayer yang sudah terisi otomatis');

                // Auto-fill form dengan data yang dikembalikan dari backend
                if (result.data.taxpayer_data) {
                    setSptData(prev => ({
                        ...prev,
                        identity: {
                            ...prev.identity,
                            nik: result.data.taxpayer_data.nik || prev.identity.nik,
                            name: result.data.taxpayer_data.full_name || prev.identity.name,
                            id_number: result.data.taxpayer_data.nik || prev.identity.id_number,
                            mobile_phone: result.data.taxpayer_data.handphone || prev.identity.mobile_phone,
                            email: result.data.taxpayer_data.email || prev.identity.email,
                        },
                        statement: {
                            ...prev.statement,
                            tin_nik: result.data.taxpayer_data.nik || prev.statement.tin_nik,
                            full_name: result.data.taxpayer_data.full_name || prev.statement.full_name,
                        }
                    }));
                }

                return true;
            } else {
                setError(result.message);
                return false;
            }
        } catch (error) {
            setError('Terjadi kesalahan: ' + error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Updated saveDraft function - handle case when no SPT exists yet
    const saveDraft = async () => {
        // Jika belum ada sptId, buat SPT baru terlebih dahulu
        if (!sptId) {
            const created = await createSpt();
            if (!created) {
                return false;
            }
            // createSpt sudah set sptId, jadi bisa lanjut save draft
        }

        setLoading(true);
        try {
            const detailData = {
                l1_assets: l1Data,
                l2_data: l2Data,
                l3a1_data: l3A1Data,
                l3a2_data: l3A2Data,
                l3a3_data: l3A3Data,
                l3a4_data: l3A4Data,
                l3b_data: l3BData,
                l3c_data: l3CData,
                l3d_data: l3DData,
                l4_data: l4Data,
                l5_data: l5Data
            };

            // Save all sections dengan error handling yang lebih baik
            const sectionsToSave = [
                { section: 'taxpayer_identity', data: sptData.identity },
                { section: 'income_summary', data: sptData.income_summary },
                { section: 'income_tax_calculation', data: sptData.tax_calculation },
                { section: 'income_tax_credit', data: sptData.tax_credit },
                { section: 'underpayment_overpayment', data: sptData.underpayment },
                { section: 'amendment_tax_return', data: sptData.amendment },
                { section: 'refund_data', data: sptData.refund },
                { section: 'income_tax_installment', data: sptData.installment },
                { section: 'other_transactions', data: sptData.other_transactions },
                { section: 'additional_attachments', data: sptData.attachments },
                { section: 'statement_data', data: sptData.statement },
                { section: 'detail', data: detailData }
            ];


            let savedSections = 0;
            const errors = [];

            for (const { section, data } of sectionsToSave) {
                try {
                    const response = await fetch(`${API.HOST}/api/v2/spt-tahunan/${sptId}/section`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...getAuthHeaders()
                        },
                        body: JSON.stringify({ section, data })
                    });

                    const result = await response.json();
                    if (result.success) {
                        savedSections++;
                    } else {
                        console.error(`Failed to save section ${section}:`, result.message);
                        errors.push(`${section}: ${result.message}`);
                    }
                } catch (error) {
                    console.error(`Error saving section ${section}:`, error);
                    errors.push(`${section}: ${error.message}`);
                }
            }

            if (errors.length > 0) {
                setError(`Beberapa section gagal disimpan: ${errors.join(', ')}`);
            } else {
                setSuccess(`Draft berhasil disimpan (${savedSections}/${sectionsToSave.length} sections saved)`);
            }

            return errors.length === 0;
        } catch (error) {
            setError('Gagal menyimpan draft: ' + error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Updated submitSpt function - ensure SPT exists before submit
    const submitSpt = async () => {
        // Validation before submit
        const validationErrors = [];

        if (!sptData.statement.declaration) {
            validationErrors.push('Silakan centang pernyataan terlebih dahulu');
        }

        if (!sptData.header.source_of_income) {
            validationErrors.push('Source of Income wajib diisi');
        }

        if (!sptData.identity.nik || !sptData.identity.name) {
            validationErrors.push('Data identitas taxpayer belum lengkap');
        }

        if (!sptData.statement.tin_nik || !sptData.statement.full_name) {
            validationErrors.push('Data pernyataan belum lengkap');
        }

        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '));
            return;
        }

        // Calculate payment amount
        const calculatedPayment = Math.max(0, sptData.underpayment.final_payment_amount || 0);
        setPaymentAmount(calculatedPayment);

        // Show first dialog - Tax Deposit confirmation
        setShowPaymentDialog(true);
    };
    const processPaymentAndSubmit = async (paymentMethod, isDepositTransfer) => {
        setLoading(true);

        try {
            let currentSptId = sptId;

            // Step 1: Create SPT if it doesn't exist yet
            if (!currentSptId) {
                const createResponse = await fetch(`${API.HOST}/api/v2/spt-tahunan`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeaders()
                    },
                    body: JSON.stringify({
                        tax_year: sptData.header.tax_year,
                        tax_period: `${sptData.header.tax_year} January - December`,
                        tax_return_model: sptData.header.status,
                        bookkeeping_type: sptData.header.bookkeeping_type,
                        source_of_income: sptData.header.source_of_income
                    })
                });

                const createResult = await createResponse.json();
                if (!createResult.success) {
                    setError(createResult.message || 'Gagal membuat SPT');
                    return;
                }

                currentSptId = createResult.data.id;
                setSptId(currentSptId);
            }

            const detailData = {
                l1_assets: l1Data,
                l2_data: l2Data,
                l3a1_data: l3A1Data,
                l3a2_data: l3A2Data,
                l3a3_data: l3A3Data,
                l3a4_data: l3A4Data,
                l3b_data: l3BData,
                l3c_data: l3CData,
                l3d_data: l3DData,
                l4_data: l4Data,
                l5_data: l5Data
            };

            // Step 2: Save all sections data
            const sectionsToSave = [
                { section: 'taxpayer_identity', data: sptData.identity },
                { section: 'income_summary', data: sptData.income_summary },
                { section: 'income_tax_calculation', data: sptData.tax_calculation },
                { section: 'income_tax_credit', data: sptData.tax_credit },
                { section: 'underpayment_overpayment', data: sptData.underpayment },
                { section: 'amendment_tax_return', data: sptData.amendment },
                { section: 'refund_data', data: sptData.refund },
                { section: 'income_tax_installment', data: sptData.installment },
                { section: 'other_transactions', data: sptData.other_transactions },
                { section: 'additional_attachments', data: sptData.attachments },
                { section: 'statement_data', data: sptData.statement },
                { section: 'detail', data: detailData }
            ];

            for (const { section, data } of sectionsToSave) {
                try {
                    const response = await fetch(`${API.HOST}/api/v2/spt-tahunan/${currentSptId}/section`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...getAuthHeaders()
                        },
                        body: JSON.stringify({ section, data })
                    });

                    const result = await response.json();
                    if (!result.success) {
                        console.error(`Failed to save section ${section}:`, result.message);
                    }
                } catch (error) {
                    console.error(`Error saving section ${section}:`, error);
                }
            }

            // Step 3: Submit SPT with payment info
            const submitResponse = await fetch(`${API.HOST}/api/v2/spt-tahunan/${currentSptId}/submit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({
                    payment_amount: paymentAmount,
                    payment_method: paymentMethod,
                    use_deposit_balance: isDepositTransfer,
                    use_tax_deposit: useDepositBalance
                })
            });

            const submitResult = await submitResponse.json();

            if (submitResult.success) {
                // Set success message based on payment method
                let successMsg = submitResult.message;

                if (paymentMethod === 'billing_code') {
                    successMsg += '\n\n📄 Kode Billing telah di-generate dan akan di-download.';
                    successMsg += '\nSPT berpindah ke status "Menunggu Pembayaran".';
                    successMsg += '\nSilakan lakukan pembayaran menggunakan kode billing.';
                } else if (isDepositTransfer) {
                    successMsg += '\n\n✅ Pembayaran menggunakan Saldo Deposit berhasil.';
                    successMsg += '\nSPT langsung tersampaikan.';
                }

                if (submitResult.data?.reference_number) {
                    successMsg += `\n\nNomor Referensi: ${submitResult.data.reference_number}`;
                    successMsg += `\nStatus: ${submitResult.data.status.toUpperCase()}`;
                    if (submitResult.data.billing_code) {
                        successMsg += `\nKode Billing: ${submitResult.data.billing_code}`;
                    }
                }

                setSuccess(successMsg);
                setIsSubmitted(true);
            } else {
                setError(submitResult.message || 'Gagal submit SPT');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setError('Terjadi kesalahan jaringan: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk handle pilihan dari dialog pertama
    const handleTaxDepositChoice = (useTaxDeposit) => {
        setShowPaymentDialog(false);
        setUseDepositBalance(useTaxDeposit);

        if (paymentAmount > 0) {
            // Jika ada pembayaran, lanjut ke dialog payment method
            setShowPaymentMethodDialog(true);
        } else {
            // Jika tidak ada pembayaran, langsung submit
            processPaymentAndSubmit(null, false);
        }
    };

    // Fungsi untuk handle pilihan payment method
    const handlePaymentMethodChoice = (method) => {
        setSelectedPaymentMethod(method);
        setShowPaymentMethodDialog(false);

        // Process payment dengan method yang dipilih
        processPaymentAndSubmit(method, useDepositBalance);
    };

    const handleFileUpload = (attachmentType, file) => {
        if (file) {
            setSptData(prev => ({
                ...prev,
                attachments: {
                    ...prev.attachments,
                    [attachmentType]: {
                        ...prev.attachments[attachmentType],
                        file: file
                    }
                }
            }));
        }
    };

    // Alert Component
    const Alert = ({ type, message, onClose }) => {
        const getAlertStyles = () => {
            switch (type) {
                case 'error':
                    return 'bg-red-50 border-red-200 text-red-800';
                case 'success':
                    return 'bg-green-50 border-green-200 text-green-800';
                case 'warning':
                    return 'bg-yellow-50 border-yellow-200 text-yellow-800';
                default:
                    return 'bg-blue-50 border-blue-200 text-blue-800';
            }
        };

        const getIcon = () => {
            switch (type) {
                case 'error':
                    return <Warning className="h-5 w-5 text-red-500" />;
                case 'success':
                    return <Check className="h-5 w-5 text-green-500" />;
                default:
                    return <Info className="h-5 w-5 text-blue-500" />;
            }
        };

        return (
            <div className={`border rounded-lg p-4 mb-4 ${getAlertStyles()}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">{getIcon()}</div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600">
                            ×
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // Section Header Component
    const SectionHeader = ({ section, index, isExpanded, onToggle }) => {
        const IconComponent = section.icon;
        return (
            <div
                className="flex items-center justify-between p-4 bg-gray-50 border cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                    </div>
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-800">{section.title}</span>
                </div>
                {isExpanded ? <ExpandLess className="h-5 w-5 text-gray-500" /> : <ExpandMore className="h-5 w-5 text-gray-500" />}
            </div>
        );
    };

    // Header Section
    const HeaderSection = () => (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Year/Period/Tax Year</label>
                    <select
                        value={sptData.header.tax_year}
                        onChange={(e) => updateSectionData('header', { tax_year: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                        <option value={2023}>2023</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                        value={sptData.header.status}
                        onChange={(e) => updateSectionData('header', { status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="NORMAL">NORMAL</option>
                        <option value="Amendment">AMENDMENT</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type Of Bookkeeping</label>
                    <select
                        value={sptData.header.bookkeeping_type}
                        onChange={(e) => updateSectionData('header', { bookkeeping_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Simple Bookkeeping">Simple Bookkeeping</option>
                        <option value="Full Bookkeeping">Full Bookkeeping</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accounting Period</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            value={sptData.header.accounting_period_start}
                            readOnly
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                        <input
                            type="text"
                            value={sptData.header.accounting_period_end}
                            readOnly
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source Of Income *</label>
                <select
                    value={sptData.header.source_of_income}
                    onChange={(e) => updateSectionData('header', { source_of_income: e.target.value })}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Please Select</option>
                    <option value="Pekerjaan">Pekerjaan</option>
                    <option value="Pekerjaan Bebas">Pekerjaan Bebas</option>
                    <option value="Kegiatan Usaha">Kegiatan Usaha</option>
                    <option value="Lainnya">Lainnya</option>
                </select>
            </div>
        </div>
    );

    // Other Transactions Section
    const OtherTransactionsSection = () => (
        <div className="p-6 space-y-4">
            {/* 14.a - Assets at end of year dengan input */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">14.a Asset at the end of tax year PPh out the Attachment I Part B</label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="assets_end_year"
                                checked={sptData.other_transactions.assets_end_year}
                                onChange={() => updateSectionData('other_transactions', { assets_end_year: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="assets_end_year"
                                checked={!sptData.other_transactions.assets_end_year}
                                onChange={() => updateSectionData('other_transactions', {
                                    assets_end_year: false,
                                    assets_end_year_amount: 0
                                })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.other_transactions.assets_end_year ? (
                    <div className="mt-3">
                        <div className="text-blue-600 text-sm mb-2">→ Yes, fill out the Attachment I Part B</div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assets Amount at End of Year
                        </label>
                        <input
                            type="number"
                            value={sptData.other_transactions.assets_end_year_amount || 0}
                            onChange={(e) => updateSectionData('other_transactions', { assets_end_year_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter assets amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="mt-3 text-blue-600 text-sm">→ No assets to declare</div>
                )}
            </div>

            {/* 14.b - Debt at end of year dengan input */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">14.b Do you have any debt at the end of tax year?</label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="debt_end_year"
                                checked={sptData.other_transactions.debt_end_year}
                                onChange={() => updateSectionData('other_transactions', { debt_end_year: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="debt_end_year"
                                checked={!sptData.other_transactions.debt_end_year}
                                onChange={() => updateSectionData('other_transactions', {
                                    debt_end_year: false,
                                    debt_end_year_amount: 0
                                })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.other_transactions.debt_end_year ? (
                    <div className="mt-3">
                        <div className="text-blue-600 text-sm mb-2">→ Yes, fill out the Attachment I Part A</div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Debt Amount at End of Year
                        </label>
                        <input
                            type="number"
                            value={sptData.other_transactions.debt_end_year_amount || 0}
                            onChange={(e) => updateSectionData('other_transactions', { debt_end_year_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter debt amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="mt-3 text-blue-600 text-sm">→ No debt to declare</div>
                )}
            </div>

            {/* 14.c - Final income tax dengan input */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">14.c Do you have any income that is subject to final income tax?</label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="final_income_tax"
                                checked={sptData.other_transactions.final_income_tax}
                                onChange={() => updateSectionData('other_transactions', { final_income_tax: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="final_income_tax"
                                checked={!sptData.other_transactions.final_income_tax}
                                onChange={() => updateSectionData('other_transactions', {
                                    final_income_tax: false,
                                    final_income_tax_amount: 0
                                })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.other_transactions.final_income_tax ? (
                    <div className="mt-3">
                        <div className="text-blue-600 text-sm mb-2">→ Yes, fill out the Attachment 2 Part A</div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Final Income Tax Amount
                        </label>
                        <input
                            type="number"
                            value={sptData.other_transactions.final_income_tax_amount || 0}
                            onChange={(e) => updateSectionData('other_transactions', { final_income_tax_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter final income tax amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="mt-3 text-blue-600 text-sm">→ No final income tax</div>
                )}
            </div>

            {/* 14.d - Excluded income dengan input */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">14.d Do you have any income that is excluded from income tax?</label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="excluded_income"
                                checked={sptData.other_transactions.excluded_income}
                                onChange={() => updateSectionData('other_transactions', { excluded_income: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="excluded_income"
                                checked={!sptData.other_transactions.excluded_income}
                                onChange={() => updateSectionData('other_transactions', {
                                    excluded_income: false,
                                    excluded_income_amount: 0
                                })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.other_transactions.excluded_income ? (
                    <div className="mt-3">
                        <div className="text-blue-600 text-sm mb-2">→ Yes, fill out the Attachment 2 Part B</div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Excluded Income Amount
                        </label>
                        <input
                            type="number"
                            value={sptData.other_transactions.excluded_income_amount || 0}
                            onChange={(e) => updateSectionData('other_transactions', { excluded_income_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter excluded income amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="mt-3 text-blue-600 text-sm">→ No excluded income</div>
                )}
            </div>

            {/* 14.e - Depreciation (no input) */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">14.e Do you declare fixed depreciation or amortization expense?</label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="depreciation_amortization"
                                checked={sptData.other_transactions.depreciation_amortization}
                                onChange={() => updateSectionData('other_transactions', { depreciation_amortization: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="depreciation_amortization"
                                checked={!sptData.other_transactions.depreciation_amortization}
                                onChange={() => updateSectionData('other_transactions', { depreciation_amortization: false })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.other_transactions.depreciation_amortization && (
                    <div className="mt-3 text-blue-600 text-sm">→ Yes, fill out the Attachment 3C</div>
                )}
            </div>

            {/* 14.f - Entertainment expense (no input) */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">14.f Do you declare entertainment expense, promotion expense and bad debt expense?</label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="entertainment_expense"
                                checked={sptData.other_transactions.entertainment_expense}
                                onChange={() => updateSectionData('other_transactions', { entertainment_expense: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="entertainment_expense"
                                checked={!sptData.other_transactions.entertainment_expense}
                                onChange={() => updateSectionData('other_transactions', { entertainment_expense: false })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.other_transactions.entertainment_expense && (
                    <div className="mt-3 text-blue-600 text-sm">→ Yes, fill out the Attachment 3D</div>
                )}
            </div>

            {/* 14.g - Dividend income (no input) */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">14.g Do you receive dividend income and declare it as income excluded from tax?</label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="dividend_income"
                                checked={sptData.other_transactions.dividend_income}
                                onChange={() => updateSectionData('other_transactions', { dividend_income: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="dividend_income"
                                checked={!sptData.other_transactions.dividend_income}
                                onChange={() => updateSectionData('other_transactions', { dividend_income: false })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.other_transactions.dividend_income && (
                    <div className="mt-3 text-blue-600 text-sm">→ Yes, make sure you submit The Realization of Investment separately</div>
                )}
            </div>

            {/* 14.h - Final Tax Overpayment dengan input */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">
                            14.h Excess Final Tax on Income from Business with Certain Gross Circulation that can be Refunded
                            (Please submit a separate application for refund of tax that should not be due)
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="final_tax_overpayment"
                                checked={sptData.other_transactions.final_tax_overpayment}
                                onChange={() => updateSectionData('other_transactions', { final_tax_overpayment: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="final_tax_overpayment"
                                checked={!sptData.other_transactions.final_tax_overpayment}
                                onChange={() => updateSectionData('other_transactions', {
                                    final_tax_overpayment: false,
                                    final_tax_overpayment_amount: 0
                                })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.other_transactions.final_tax_overpayment ? (
                    <div className="mt-3">
                        <div className="text-blue-600 text-sm mb-2">→ Yes, submit separate refund application</div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Excess Final Tax Amount
                        </label>
                        <input
                            type="number"
                            value={sptData.other_transactions.final_tax_overpayment_amount || 0}
                            onChange={(e) => updateSectionData('other_transactions', { final_tax_overpayment_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter excess final tax amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="mt-3 text-blue-600 text-sm">→ No excess final tax to refund</div>
                )}
            </div>
        </div>
    );

    // Attachments Section
    const AttachmentsSection = () => (
        <div className="p-6 space-y-4">
            {Object.entries(sptData.attachments).map(([key, attachment], index) => {
                const attachmentLabels = {
                    financial_statement: 'a. Financial Statement/Audited Financial Statement',
                    payment_proof: 'b. Proof of Zakat Payment and Religious Donation',
                    withholding_relation: 'c. Withholding slip in relation to Foreign Tax Credit',
                    attorney_letter: 'd. Letter of Attorney (Only For Paper Tax Return)',
                    other_documents: 'e. Other documents'
                };

                return (
                    <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>
                                <label className="text-sm font-medium text-gray-700">
                                    {attachmentLabels[key]}
                                </label>
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name={`${key}_required`}
                                        checked={attachment.required}
                                        onChange={() => updateSectionData('attachments', {
                                            [key]: { ...attachment, required: true }
                                        })}
                                        className="mr-2"
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name={`${key}_required`}
                                        checked={!attachment.required}
                                        onChange={() => updateSectionData('attachments', {
                                            [key]: { ...attachment, required: false, file: null }
                                        })}
                                        className="mr-2"
                                    />
                                    No
                                </label>
                            </div>
                        </div>

                        {attachment.required ? (
                            <div className="mt-3">
                                <div
                                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${attachment.file ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'
                                        }`}
                                    onClick={() => document.getElementById(`file_${key}`).click()}
                                >
                                    {attachment.file ? (
                                        <div>
                                            <Check className="h-8 w-8 mx-auto text-green-500 mb-2" />
                                            <p className="text-green-600 font-medium">File: {attachment.file.name}</p>
                                            <p className="text-sm text-gray-500 mt-1">Click to change file</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600">Click to upload file</p>
                                            <p className="text-sm text-gray-500 mt-1">Format: PDF, JPG, PNG (Max 5MB)</p>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        id={`file_${key}`}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(key, e.target.files[0])}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 text-center p-3 bg-blue-50 rounded text-blue-600 text-sm">
                                No file should be attached
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );


    // Tax Calculation Section
    const TaxCalculationSection = () => (
        <div className="p-6 space-y-0">
            {/* Question 1 */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        1. Do you have any net income deduction such as zakat or fiscal loss compensation?
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-4 bg-white p-2 rounded border">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="net_income_deduction"
                                checked={sptData.tax_calculation.net_income_deduction}
                                onChange={() => updateSectionData('tax_calculation', { net_income_deduction: true })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="net_income_deduction"
                                checked={!sptData.tax_calculation.net_income_deduction}
                                onChange={() => updateSectionData('tax_calculation', { net_income_deduction: false })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                        {sptData.tax_calculation.net_income_deduction ?
                            'Yes, fill out Attachment 5 (L-5) Part A and/or Part B' :
                            'No, continue to the next question'}
                    </div>
                </div>
            </div>

            {/* Question 2 - Net income for the year dengan input */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        2. Net income for the year (1a+1b+1c+1d)
                    </span>
                </div>
                <div className="bg-white p-2 rounded border">
                    <input
                        type="number"
                        value={sptData.tax_calculation.net_income_year || 0}
                        onChange={(e) => updateSectionData('tax_calculation', { net_income_year: parseFloat(e.target.value) || 0 })}
                        className="w-40 px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Auto calculated"
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            {/* Question 3 - dengan input ketika Yes */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        3. Are there any net income deductions such as loss compensation or zakat paid other than those calculated in Form BPA1 and/or BPA2?
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-4 bg-white p-2 rounded border">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="additional_deduction"
                                checked={sptData.tax_calculation.additional_deduction}
                                onChange={() => updateSectionData('tax_calculation', { additional_deduction: true })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="additional_deduction"
                                checked={!sptData.tax_calculation.additional_deduction}
                                onChange={() => updateSectionData('tax_calculation', {
                                    additional_deduction: false,
                                    additional_deduction_amount: 0
                                })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                        {sptData.tax_calculation.additional_deduction ?
                            'Yes: Fill Attachment 5 (L-5) Part A and/or Part B' :
                            'No: Continue to the next question'}
                    </div>
                </div>
            </div>

            {/* Input untuk additional deduction amount ketika Yes */}
            {sptData.tax_calculation.additional_deduction && (
                <div className="bg-white p-4 border-b border-gray-300 pl-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Deduction Amount
                    </label>
                    <input
                        type="number"
                        value={sptData.tax_calculation.additional_deduction_amount || 0}
                        onChange={(e) => updateSectionData('tax_calculation', { additional_deduction_amount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter additional deduction amount"
                        min="0"
                        step="0.01"
                    />
                </div>
            )}

            {/* Question 4 - Net income after deduction dengan input */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        4. Net income after net income deduction (2-3)
                    </span>
                </div>
                <div className="bg-white p-2 rounded border">
                    <input
                        type="number"
                        value={sptData.tax_calculation.net_income_after_deduction || 0}
                        onChange={(e) => updateSectionData('tax_calculation', { net_income_after_deduction: parseFloat(e.target.value) || 0 })}
                        className="w-40 px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Auto calculated"
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            {/* Question 5 - Tax Exemptions dengan input amount */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        5. Tax Exemptions
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded border">
                        <select
                            value={sptData.tax_calculation.tax_exemptions}
                            onChange={(e) => updateSectionData('tax_calculation', { tax_exemptions: e.target.value })}
                            className="px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Select</option>
                            <option value="TK/0">TK/0</option>
                            <option value="TK/1">TK/1</option>
                            <option value="TK/2">TK/2</option>
                            <option value="K/0">K/0</option>
                            <option value="K/1">K/1</option>
                            <option value="K/2">K/2</option>
                            <option value="K/3">K/3</option>
                        </select>
                    </div>
                    <div className="bg-white p-2 rounded border">
                        <input
                            type="number"
                            value={sptData.tax_calculation.tax_exemptions_amount || 0}
                            onChange={(e) => updateSectionData('tax_calculation', { tax_exemptions_amount: parseFloat(e.target.value) || 0 })}
                            className="w-40 px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Exemption amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                        Select your tax exemption status
                    </div>
                </div>
            </div>

            {/* Question 6 - Taxable income dengan input */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        6. Taxable income (4-5)
                    </span>
                </div>
                <div className="bg-white p-2 rounded border">
                    <input
                        type="number"
                        value={sptData.tax_calculation.taxable_income || 0}
                        onChange={(e) => updateSectionData('tax_calculation', { taxable_income: parseFloat(e.target.value) || 0 })}
                        className="w-40 px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Auto calculated"
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            {/* Question 7 - Income tax payable dengan input */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        7. Income tax payable
                    </span>
                </div>
                <div className="bg-white p-2 rounded border">
                    <input
                        type="number"
                        value={sptData.tax_calculation.income_tax_payable || 0}
                        onChange={(e) => updateSectionData('tax_calculation', { income_tax_payable: parseFloat(e.target.value) || 0 })}
                        className="w-40 px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Auto calculated"
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            {/* Question 8 - dengan input ketika Yes */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        8. Do you have income tax deduction?
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-4 bg-white p-2 rounded border">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="income_tax_deduction"
                                checked={sptData.tax_calculation.income_tax_deduction}
                                onChange={() => updateSectionData('tax_calculation', { income_tax_deduction: true })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="income_tax_deduction"
                                checked={!sptData.tax_calculation.income_tax_deduction}
                                onChange={() => updateSectionData('tax_calculation', {
                                    income_tax_deduction: false,
                                    income_tax_deduction_amount: 0
                                })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                        {sptData.tax_calculation.income_tax_deduction ?
                            'Yes, you have tax deductions' :
                            'No, continue to the next question'}
                    </div>
                </div>
            </div>

            {/* Input untuk income tax deduction amount ketika Yes */}
            {sptData.tax_calculation.income_tax_deduction && (
                <div className="bg-white p-4 border-b border-gray-300 pl-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Income Tax Deduction Amount
                    </label>
                    <input
                        type="number"
                        value={sptData.tax_calculation.income_tax_deduction_amount || 0}
                        onChange={(e) => updateSectionData('tax_calculation', { income_tax_deduction_amount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter income tax deduction amount"
                        min="0"
                        step="0.01"
                    />
                </div>
            )}

            {/* Question 9 - Income tax payable after deduction dengan input */}
            <div className="bg-gray-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        9. Income tax payable after income tax deduction (7-8)
                    </span>
                </div>
                <div className="bg-white p-2 rounded border">
                    <input
                        type="number"
                        value={sptData.tax_calculation.income_tax_after_deduction || 0}
                        onChange={(e) => updateSectionData('tax_calculation', { income_tax_after_deduction: parseFloat(e.target.value) || 0 })}
                        className="w-40 px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Auto calculated"
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>
        </div>
    );

    // Tax Credit Section
    const TaxCreditSection = () => (
        <div className="p-6 space-y-4">
            {/* 10.a - Income tax withheld by other party */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                        10.a Do you have any income tax which is withheld by other party?
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="withheld_income_tax"
                                checked={sptData.tax_credit.withheld_income_tax}
                                onChange={() => updateSectionData('tax_credit', { withheld_income_tax: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="withheld_income_tax"
                                checked={!sptData.tax_credit.withheld_income_tax}
                                onChange={() => updateSectionData('tax_credit', {
                                    withheld_income_tax: false,
                                    withheld_income_tax_amount: 0
                                })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.tax_credit.withheld_income_tax ? (
                    <div className="mt-3">
                        <div className="text-blue-600 text-sm mb-2">→ Yes, fill out the Attachment I Part E</div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Withheld Income Tax Amount
                        </label>
                        <input
                            type="number"
                            value={sptData.tax_credit.withheld_income_tax_amount || 0}
                            onChange={(e) => updateSectionData('tax_credit', { withheld_income_tax_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter withheld income tax amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="mt-3 text-blue-600 text-sm">→ No, continue to next question</div>
                )}
            </div>

            {/* 10.b - Installments of Income Tax Article 25 */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                        10.b Installments of Income Tax Article 25
                    </label>
                    <span className="text-gray-600 text-sm">Enter amount</span>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Income Tax Article 25 Installments Amount
                </label>
                <input
                    type="number"
                    value={sptData.tax_credit.installment_article_25_amount || 0}
                    onChange={(e) => updateSectionData('tax_credit', { installment_article_25_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter installment amount"
                    min="0"
                    step="0.01"
                />
            </div>

            {/* 10.c - Notice of Tax Collection */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                        10.c Notice of Tax Collection on Income Tax Article 25 (Principal only)
                    </label>
                    <span className="text-gray-600 text-sm">Enter amount</span>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notice of Tax Collection Amount
                </label>
                <input
                    type="number"
                    value={sptData.tax_credit.notice_tax_collection_amount || 0}
                    onChange={(e) => updateSectionData('tax_credit', { notice_tax_collection_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter notice tax collection amount"
                    min="0"
                    step="0.01"
                />
            </div>

            {/* 10.d - Foreign income tax credit */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                        10.d Do you receive refund / deduction of foreign income tax credit that had been credited prior the tax year?
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="foreign_tax_credit"
                                checked={sptData.tax_credit.foreign_tax_credit}
                                onChange={() => updateSectionData('tax_credit', { foreign_tax_credit: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="foreign_tax_credit"
                                checked={!sptData.tax_credit.foreign_tax_credit}
                                onChange={() => updateSectionData('tax_credit', {
                                    foreign_tax_credit: false,
                                    foreign_tax_credit_amount: 0
                                })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.tax_credit.foreign_tax_credit ? (
                    <div className="mt-3">
                        <div className="text-blue-600 text-sm mb-2">→ Yes, enter the amount received</div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Foreign Tax Credit Amount
                        </label>
                        <input
                            type="number"
                            value={sptData.tax_credit.foreign_tax_credit_amount || 0}
                            onChange={(e) => updateSectionData('tax_credit', { foreign_tax_credit_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter foreign tax credit amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="mt-3 text-blue-600 text-sm">→ No, continue to next question</div>
                )}
            </div>
        </div>
    );

    // Underpayment Section
    const UnderpaymentSection = () => (
        <div className="p-6 space-y-4">
            {/* 11.a - Underpayment/Overpayment */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                        11.a Underpayment/Overpayment Income Tax (9 - 10a - 10b - 10c + 10d)
                    </label>
                    <span className="text-gray-600 text-sm">Auto calculated</span>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Underpayment/Overpayment Amount
                </label>
                <input
                    type="number"
                    value={sptData.underpayment.underpayment_amount || 0}
                    onChange={(e) => updateSectionData('underpayment', { underpayment_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter underpayment/overpayment amount"
                    step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Use negative value (-) for overpayment
                </p>
            </div>

            {/* 11.b - Approval Letter */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                        11.b Do you have an Approval Letter of Postponement or Installment of Tax Payment?
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="approval_letter"
                                checked={sptData.underpayment.approval_letter}
                                onChange={() => updateSectionData('underpayment', { approval_letter: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="approval_letter"
                                checked={!sptData.underpayment.approval_letter}
                                onChange={() => updateSectionData('underpayment', {
                                    approval_letter: false,
                                    approval_letter_amount: 0
                                })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.underpayment.approval_letter ? (
                    <div className="mt-3">
                        <div className="text-blue-600 text-sm mb-2">→ Yes, enter the approved amount</div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Approved Amount for Postponement/Installment
                        </label>
                        <input
                            type="number"
                            value={sptData.underpayment.approval_letter_amount || 0}
                            onChange={(e) => updateSectionData('underpayment', { approval_letter_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter approved amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="mt-3 text-blue-600 text-sm">→ No, I do not have</div>
                )}
            </div>

            {/* 11.c - Final Payment Amount */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                        11.c Income Tax Still to be Paid (11a - 11b)
                    </label>
                    <span className="text-gray-600 text-sm">Auto calculated</span>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Income Tax Still to be Paid
                </label>
                <input
                    type="number"
                    value={sptData.underpayment.final_payment_amount || 0}
                    onChange={(e) => updateSectionData('underpayment', { final_payment_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter final payment amount"
                    min="0"
                    step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Final amount that still needs to be paid
                </p>
            </div>
        </div>
    );

    // Amendment Section
    const AmendmentSection = () => (
        <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-4">
                    This section is only shown if the Tax Return status is Amendment.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            12.a Underpayment or (Overpayment) Income Tax of previous tax return
                        </label>
                        <input
                            type="number"
                            value={sptData.amendment.previous_underpayment || 0}
                            onChange={(e) => updateSectionData('amendment', { previous_underpayment: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter previous underpayment/overpayment amount"
                            step="0.01"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Use negative value (-) for overpayment
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            12.b Underpayment or (Overpayment) Income Tax due to Amendment (11a - 12a)
                        </label>
                        <input
                            type="number"
                            value={sptData.amendment.amendment_underpayment || 0}
                            onChange={(e) => updateSectionData('amendment', { amendment_underpayment: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter amendment underpayment/overpayment amount"
                            step="0.01"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Use negative value (-) for overpayment due to amendment
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Refund Section
    const RefundSection = () => (
        <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-4">
                    This section is only shown if the Tax Return status is Overpayment.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Overpayment Income Tax in the 11a or 12b is requested for:
                        </label>
                        <select
                            value={sptData.refund.refund_method}
                            onChange={(e) => updateSectionData('refund', { refund_method: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Please Select</option>
                            <option value="Dikembalikan melalui pemindahbukuan">Dikembalikan melalui pemindahbukuan</option>
                            <option value="Dikembalikan melalui permohonan pendahuluan">Dikembalikan melalui permohonan pendahuluan</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Bank Account
                        </label>
                        <select
                            value={sptData.refund.bank_account}
                            onChange={(e) => updateSectionData('refund', { bank_account: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Please Select</option>
                            <option value="BCA">BCA</option>
                            <option value="BNI">BNI</option>
                            <option value="BRI">BRI</option>
                            <option value="Mandiri">Mandiri</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const InstallmentSection = () => (
        <div className="p-6 space-y-4">
            {/* 13.a - Article 25 Obligation */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            1
                        </div>
                        <label className="text-sm font-medium text-gray-700">
                            13.a Do you oblige to pay Article 25 Income Tax Installments for regular income (following tax year)?
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="article_25_obligation"
                                checked={sptData.installment.article_25_obligation}
                                onChange={() => updateSectionData('installment', { article_25_obligation: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="article_25_obligation"
                                checked={!sptData.installment.article_25_obligation}
                                onChange={() => updateSectionData('installment', {
                                    article_25_obligation: false,
                                    article_25_amount: 0
                                })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.installment.article_25_obligation ? (
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Article 25 Installment Amount
                        </label>
                        <input
                            type="number"
                            value={sptData.installment.article_25_amount || 0}
                            onChange={(e) => updateSectionData('installment', { article_25_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Article 25 installment amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="mt-3 text-blue-600 text-sm">→ No, continue to the next question</div>
                )}
            </div>

            {/* 13.b - Specific Entrepreneur */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            2
                        </div>
                        <label className="text-sm font-medium text-gray-700">
                            13.b Do you oblige to pay Article 25 Income Tax Installments for irregular income (following tax year)?
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="specific_entrepreneur"
                                checked={sptData.installment.specific_entrepreneur}
                                onChange={() => updateSectionData('installment', { specific_entrepreneur: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="specific_entrepreneur"
                                checked={!sptData.installment.specific_entrepreneur}
                                onChange={() => updateSectionData('installment', {
                                    specific_entrepreneur: false,
                                    specific_entrepreneur_amount: 0
                                })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.installment.specific_entrepreneur ? (
                    <div className="mt-3">
                        <div className="text-blue-600 text-sm mb-2">→ Yes, fill out the Attachment 4 Part A</div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Irregular Income Installment Amount
                        </label>
                        <input
                            type="number"
                            value={sptData.installment.specific_entrepreneur_amount || 0}
                            onChange={(e) => updateSectionData('installment', { specific_entrepreneur_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter irregular income installment amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="mt-3 text-blue-600 text-sm">→ No, continue to the next question</div>
                )}
            </div>

            {/* 13.c - OPPT Installment */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            3
                        </div>
                        <label className="text-sm font-medium text-gray-700">
                            13.c Do you pay Article 25 Income Tax Installments for OPPT (Specific Individual Entrepreneur)?
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="oppt_installment"
                                checked={sptData.installment.oppt_installment}
                                onChange={() => updateSectionData('installment', { oppt_installment: true })}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="oppt_installment"
                                checked={!sptData.installment.oppt_installment}
                                onChange={() => updateSectionData('installment', {
                                    oppt_installment: false,
                                    oppt_installment_amount: 0
                                })}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>
                {sptData.installment.oppt_installment ? (
                    <div className="mt-3">
                        <div className="text-blue-600 text-sm mb-2">→ Yes, typically 0.75% of gross income every month from each business location</div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            OPPT Installment Amount
                        </label>
                        <input
                            type="number"
                            value={sptData.installment.oppt_installment_amount || 0}
                            onChange={(e) => updateSectionData('installment', { oppt_installment_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter OPPT installment amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="mt-3 text-blue-600 text-sm">→ No, I do not have the obligation to pay Article 25 installments</div>
                )}
            </div>
        </div>
    );

    // Identity Section
    // STEP 2: Perbaiki Identity Section dengan indikator auto-fill

    const IdentitySection = () => (
        <div className="p-6 space-y-4">
            {/* Info jika data auto-filled */}
            {taxpayerData && autoFillAttempted && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded mb-4">
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">Data taxpayer berhasil dimuat dari database registrasi</span>
                    </div>
                </div>
            )}

            {/* Warning jika belum ada data taxpayer */}
            {!taxpayerData && autoFillAttempted && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-4">
                    <div className="flex items-center gap-2">
                        <Warning className="h-4 w-4" />
                        <span className="text-sm">Data taxpayer tidak ditemukan. Silakan lengkapi registrasi taxpayer terlebih dahulu.</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">1. TIN/NIK</label>
                    <input
                        type="text"
                        value={sptData.identity.nik}
                        onChange={(e) => updateSectionData('identity', { nik: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${taxpayerData?.nik ? 'bg-green-50 border-green-300' : 'border-gray-300'
                            }`}
                        placeholder="Masukkan NIK"
                    />
                    {taxpayerData?.nik && (
                        <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data registrasi</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">2. NAME</label>
                    <input
                        type="text"
                        value={sptData.identity.name}
                        onChange={(e) => updateSectionData('identity', { name: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${taxpayerData?.full_name ? 'bg-green-50 border-green-300' : 'border-gray-300'
                            }`}
                        placeholder="Masukkan nama lengkap"
                    />
                    {taxpayerData?.full_name && (
                        <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data registrasi</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">3. IDENTITY(D) *</label>
                    <input
                        type="text"
                        value="KTP"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">4. ID NUMBER</label>
                    <input
                        type="text"
                        value={sptData.identity.id_number}
                        onChange={(e) => updateSectionData('identity', { id_number: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${taxpayerData?.nik ? 'bg-green-50 border-green-300' : 'border-gray-300'
                            }`}
                        placeholder="Masukkan nomor identitas"
                    />
                    {taxpayerData?.nik && (
                        <p className="text-xs text-green-600 mt-1">✓ Menggunakan NIK sebagai ID Number</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">5. MOBILE PHONE</label>
                    <input
                        type="text"
                        value={sptData.identity.mobile_phone}
                        onChange={(e) => updateSectionData('identity', { mobile_phone: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${taxpayerData?.handphone ? 'bg-green-50 border-green-300' : 'border-gray-300'
                            }`}
                        placeholder="Masukkan nomor handphone"
                    />
                    {taxpayerData?.handphone && (
                        <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data registrasi</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">6. EMAIL</label>
                    <input
                        type="email"
                        value={sptData.identity.email}
                        onChange={(e) => updateSectionData('identity', { email: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${taxpayerData?.email ? 'bg-green-50 border-green-300' : 'border-gray-300'
                            }`}
                        placeholder="Masukkan email"
                    />
                    {taxpayerData?.email && (
                        <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data registrasi</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">7. STATUS OF TAX OBLIGATION (HUSBAND & WIFE)</label>
                    <select
                        value={sptData.identity.tax_obligation_status}
                        onChange={(e) => updateSectionData('identity', { tax_obligation_status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Please Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                    </select>
                    {taxpayerData?.marital_status && (
                        <p className="text-xs text-green-600 mt-1">✓ Otomatis disesuaikan dengan status pernikahan: {taxpayerData.marital_status}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">8. SPOUSE HUSBAND/WIFE NIK or TIN</label>
                    <input
                        type="text"
                        value={sptData.identity.spouse_nik}
                        onChange={(e) => updateSectionData('identity', { spouse_nik: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder={sptData.identity.tax_obligation_status === 'Married' ? 'Masukkan NIK pasangan' : 'Tidak diperlukan untuk status single'}
                        disabled={sptData.identity.tax_obligation_status !== 'Married'}
                    />
                </div>
            </div>
        </div>
    );

    const StatementSection = () => (
        <div className="p-6">
            <div className="border rounded-lg p-6">
                <div className="mb-4">
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={sptData.statement.declaration}
                            onChange={(e) => updateSectionData('statement', { declaration: e.target.checked })}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            required
                        />
                        <span className="text-sm text-gray-700 leading-relaxed">
                            By realizing all the consequences in accordance with the provisions of tax laws and regulations,
                            I declare that what is conveyed in the Income Tax Return and its attachments is true, complete, and clear.
                        </span>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
                        <input
                            type="text"
                            value={sptData.statement.signature}
                            onChange={(e) => updateSectionData('statement', { signature: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Digital signature"
                        />
                    </div>

                    <div>
                        <label className="block text-sm fon
                    nt-medium text-gray-700 mb-2">TIN/NIK</label>
                        <input
                            type="text"
                            value={sptData.statement.tin_nik}
                            onChange={(e) => updateSectionData('statement', { tin_nik: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${taxpayerData?.nik ? 'bg-green-50 border-green-300' : 'border-gray-300'
                                }`}
                            placeholder="Masukkan TIN/NIK"
                        />
                        {taxpayerData?.nik && (
                            <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data taxpayer</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={sptData.statement.full_name}
                            onChange={(e) => updateSectionData('statement', { full_name: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${taxpayerData?.full_name ? 'bg-green-50 border-green-300' : 'border-gray-300'
                                }`}
                            placeholder="Masukkan nama lengkap"
                        />
                        {taxpayerData?.full_name && (
                            <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data taxpayer</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const IncomeSummarySection = () => (
        <div className="p-6 space-y-0">
            {/* Question 1.a */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        1. a. Do you have domestic net income from employment?
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-4 bg-white p-2 rounded border">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="employment_income"
                                checked={sptData.income_summary.employment_income}
                                onChange={() => updateSectionData('income_summary', { employment_income: true })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="employment_income"
                                checked={!sptData.income_summary.employment_income}
                                onChange={() => updateSectionData('income_summary', { employment_income: false })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                        {sptData.income_summary.employment_income ?
                            'Yes, fill out the Attachment I Part D' :
                            'No, continue to the next question'}
                    </div>
                </div>
            </div>

            {/* Input untuk 1.a ketika Yes dipilih */}
            {sptData.income_summary.employment_income && (
                <div className="bg-white p-4 border-b border-gray-300 pl-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Net Income from Employment Amount
                    </label>
                    <input
                        type="number"
                        value={sptData.income_summary.employment_income_amount || ''}
                        onChange={(e) => updateSectionData('income_summary', { employment_income_amount: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter employment income amount"
                    />
                </div>
            )}

            {/* Question 1.b.1 */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        1. b. 1 Do you have any income from business or profession?
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-4 bg-white p-2 rounded border">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="business_income"
                                checked={sptData.income_summary.business_income}
                                onChange={() => updateSectionData('income_summary', { business_income: true })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="business_income"
                                checked={!sptData.income_summary.business_income}
                                onChange={() => updateSectionData('income_summary', { business_income: false })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                        {sptData.income_summary.business_income ?
                            'Yes: Continue to the next question (questions 1.b.2 and 1.b.3 appear)' :
                            'No: continue to questions 1c'}
                    </div>
                </div>
            </div>

            {/* Nested questions when Yes is selected for 1.b.1 */}
            {sptData.income_summary.business_income && (
                <>
                    {/* Question 1.b.2 */}
                    <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">
                                1. b. 2 Are you a Personal Taxpayer who has certain gross circulation or a Certain Individual Entrepreneur (OPPT)?
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-4 bg-white p-2 rounded border">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="is_oppt"
                                        checked={sptData.income_summary.is_oppt}
                                        onChange={() => updateSectionData('income_summary', { is_oppt: true })}
                                        className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                                    />
                                    <span className="text-sm">Yes</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="is_oppt"
                                        checked={!sptData.income_summary.is_oppt}
                                        onChange={() => updateSectionData('income_summary', { is_oppt: false })}
                                        className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                                    />
                                    <span className="text-sm">No</span>
                                </label>
                            </div>
                            <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                                <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                                Continue to the next question
                            </div>
                        </div>
                    </div>

                    {/* OPPT Select dropdown when Yes is selected */}
                    {sptData.income_summary.is_oppt && (
                        <div className="bg-white p-4 border-b border-gray-300 pl-12">
                            <select
                                value={sptData.income_summary.oppt_type || ''}
                                onChange={(e) => updateSectionData('income_summary', { oppt_type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Please Select</option>
                                <option value="no_continue">No, Continue to the next question</option>
                                <option value="yes_final_tax">Yes, I am a personal taxpayer who has certain gross circulation subject to final income tax</option>
                                <option value="yes_oppt">Yes, I am a certain individual entrepreneur</option>
                            </select>
                        </div>
                    )}

                    {/* Question 1.b.3 */}
                    <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">
                                1. b. 3 Do you use Norms in calculating net income?
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-4 bg-white p-2 rounded border">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="use_norms"
                                        checked={sptData.income_summary.use_norms}
                                        onChange={() => updateSectionData('income_summary', { use_norms: true })}
                                        className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                                    />
                                    <span className="text-sm">Yes</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="use_norms"
                                        checked={!sptData.income_summary.use_norms}
                                        onChange={() => updateSectionData('income_summary', { use_norms: false })}
                                        className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                                    />
                                    <span className="text-sm">No</span>
                                </label>
                            </div>
                            <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                                <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                                {sptData.income_summary.use_norms ?
                                    'Yes: Only for OPPT who have submitted Notification' :
                                    'No: Continue to the next question (question 1.b.4 appears)'}
                            </div>
                        </div>
                    </div>

                    {/* Norms Select dropdown when Yes is selected */}
                    {sptData.income_summary.use_norms && (
                        <div className="bg-white p-4 border-b border-gray-300 pl-12">
                            <p className="text-sm text-gray-600 mb-2">
                                Only for Certain Individual Entrepreneurs (OPPT) who have submitted a Notification using Net Income Calculation Norms in that tax year.
                            </p>
                            <select
                                value={sptData.income_summary.norms_type || ''}
                                onChange={(e) => updateSectionData('income_summary', { norms_type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Please Select</option>
                                <option value="no_financial_statement">No, I prepare financial statements/cash-based financial statements</option>
                                <option value="no_pp23_only">No, I only receive income subject to PP 23 Final</option>
                                <option value="yes_qualified">Yes, I am a qualified user to use net income calculation norms</option>
                            </select>
                        </div>
                    )}

                    {/* Question 1.b.4 - Only show if use_norms is false */}
                    {!sptData.income_summary.use_norms && (
                        <>
                            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700">
                                        1. b. 4 You maintain bookkeeping. Mention the business sector you do?
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                                        <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                                        Select business sector according to attachment
                                    </div>
                                </div>
                            </div>

                            {/* Business Sector Select dropdown */}
                            <div className="bg-white p-4 border-b border-gray-300 pl-12">
                                <select
                                    value={sptData.income_summary.business_sector || ''}
                                    onChange={(e) => updateSectionData('income_summary', { business_sector: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    <option value="trading">Trading: Fill Attachment 3A-1 (L-3A-1)</option>
                                    <option value="services">Services: Fill Attachment 3A-2 (L-3A-2)</option>
                                    <option value="industry">Industry: Fill Attachment 3A-3 (L-3A-3)</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Question 1.b.5 - ACCORDION BARU */}
                    <div className="bg-gray-100 p-4 border-b border-gray-300">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => updateSectionData('income_summary', {
                                show_business_net_income: !sptData.income_summary.show_business_net_income
                            })}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">
                                    1. b. 5 Net Income from Business and/or Professional Services
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                                    <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                                    Click to enter amount
                                </div>
                                {sptData.income_summary.show_business_net_income ? (
                                    <ExpandLess className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <ExpandMore className="h-5 w-5 text-gray-500" />
                                )}
                            </div>
                        </div>

                        {/* Input accordion content */}
                        {sptData.income_summary.show_business_net_income && (
                            <div className="mt-4 bg-white p-4 rounded border">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Penghasilan Neto dari Usaha dan/atau Pekerjaan Bebas
                                </label>
                                <input
                                    type="number"
                                    value={sptData.income_summary.business_net_income_amount || ''}
                                    onChange={(e) => updateSectionData('income_summary', { business_net_income_amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter business net income amount"
                                />
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Question 1.c */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        1. c. Do you have any other domestic income?
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-4 bg-white p-2 rounded border">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="other_domestic_income"
                                checked={sptData.income_summary.other_domestic_income}
                                onChange={() => updateSectionData('income_summary', { other_domestic_income: true })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="other_domestic_income"
                                checked={!sptData.income_summary.other_domestic_income}
                                onChange={() => updateSectionData('income_summary', { other_domestic_income: false })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                        {sptData.income_summary.other_domestic_income ?
                            'Yes, fill out the Attachment 3A-4 Part B' :
                            'No, continue to the next question'}
                    </div>
                </div>
            </div>

            {/* Input untuk 1.c ketika Yes dipilih */}
            {sptData.income_summary.other_domestic_income && (
                <div className="bg-white p-4 border-b border-gray-300 pl-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Other Domestic Income Amount
                    </label>
                    <input
                        type="number"
                        value={sptData.income_summary.other_domestic_income_amount || ''}
                        onChange={(e) => updateSectionData('income_summary', { other_domestic_income_amount: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter other domestic income amount"
                    />
                </div>
            )}

            {/* Question 1.d */}
            <div className="bg-gray-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        1. d. Do you have any other foreign income?
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-4 bg-white p-2 rounded border">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="foreign_income"
                                checked={sptData.income_summary.foreign_income}
                                onChange={() => updateSectionData('income_summary', { foreign_income: true })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="foreign_income"
                                checked={!sptData.income_summary.foreign_income}
                                onChange={() => updateSectionData('income_summary', { foreign_income: false })}
                                className="mr-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded text-sm text-blue-700 border border-blue-300 flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</div>
                        {!sptData.income_summary.foreign_income ?
                            'No, continue to the next question' :
                            'Yes, continue to the next question'}
                    </div>
                </div>
            </div>

            {/* Input untuk 1.d ketika Yes dipilih */}
            {sptData.income_summary.foreign_income && (
                <div className="bg-white p-4 pl-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foreign Income Amount
                    </label>
                    <input
                        type="number"
                        value={sptData.income_summary.foreign_income_amount || ''}
                        onChange={(e) => updateSectionData('income_summary', { foreign_income_amount: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter foreign income amount"
                    />
                </div>
            )}
        </div>
    );


    // Dialog 1: Tax Deposit Confirmation
    const TaxDepositDialog = () => (
        <Dialog
            open={showPaymentDialog}
            onClose={() => setShowPaymentDialog(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Pilih Tax Deposit yang Akan Digunakan</span>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="space-y-4 py-4">
                    <div className="text-gray-700">
                        Apabila SPT Tahunan yang sedang Anda sampaikan mendapatkan ijin Perpanjangan Jangka Waktu
                        Penyampaian SPT Tahunan, apakah Anda akan menggunakan saldo pembayaran yang belum digunakan
                        pada akun untuk pembayaran kurang bayar pada Surat Pemberitahuan ini?
                    </div>

                    {paymentAmount > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="text-sm text-gray-600 mb-2">Jumlah Kurang Bayar:</div>
                            <div className="text-2xl font-bold text-blue-600">
                                IDR {paymentAmount.toLocaleString('id-ID')}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions className="p-4 gap-3">
                <button
                    onClick={() => handleTaxDepositChoice(true)}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                    Yes
                </button>
                <button
                    onClick={() => handleTaxDepositChoice(false)}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
                >
                    No
                </button>
            </DialogActions>
        </Dialog>
    );

    // Dialog 2: Payment Method Selection
    const PaymentMethodDialog = () => (
        <Dialog
            open={showPaymentMethodDialog}
            onClose={() => setShowPaymentMethodDialog(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <div className="font-bold text-2xl text-gray-900">Choose Payment Method</div>
            </DialogTitle>
            <DialogContent>
                <div className="space-y-6 py-4">
                    <div className="text-gray-600 text-base leading-relaxed">
                        You have sufficient deposit balance to pay the underpayment. If you would like to pay using the
                        deposit balance, click the button "Deposit Balance Transfer". Otherwise, click the button
                        "Create Billing Code" so that you can pay the underpayment using the billing code
                    </div>

                    <div className="flex gap-6 justify-end mt-8">
                        <button
                            onClick={() => handlePaymentMethodChoice('deposit_transfer')}
                            className="px-10 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-md font-medium text-base transition-colors shadow-sm"
                        >
                            Deposit Balance Transfer
                        </button>
                        <button
                            onClick={() => handlePaymentMethodChoice('billing_code')}
                            className="px-10 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-md font-medium text-base transition-colors shadow-sm"
                        >
                            Create Billing Code
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
    const renderSectionContent = (sectionId) => {
        switch (sectionId) {
            case 'header': return <HeaderSection />;
            case 'identity': return <IdentitySection />;
            case 'income': return <IncomeSummarySection />;
            case 'calculation': return <TaxCalculationSection />;
            case 'credit': return <TaxCreditSection />;
            case 'underpayment': return <UnderpaymentSection />;
            case 'amendment': return <AmendmentSection />;
            case 'refund': return <RefundSection />;
            case 'installment': return <InstallmentSection />;
            case 'transactions': return <OtherTransactionsSection />;
            case 'attachments': return <AttachmentsSection />;
            case 'statement': return <StatementSection />;
            default:
                return (
                    <div className="p-6 text-gray-500 text-center">
                        Section content will be implemented here
                    </div>
                );
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto bg-white p-6">
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
                    <Check className="h-12 w-12 mx-auto text-green-500 mb-3" />
                    <h4 className="text-lg font-semibold text-green-800 mb-2">SPT Berhasil Disubmit!</h4>
                    <p className="text-green-700 mb-4">
                        SPT Tahunan {sptData.header.tax_year} Anda telah berhasil disubmit dan sedang diproses.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4 mb-6 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    PERSONAL INCOME TAX RETURN
                </h1>
                <div className="flex gap-4 text-sm">
                    <button
                        onClick={() => setActiveTab('main')}
                        className={`px-4 py-2 rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'main'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Main Form
                    </button>
                    <button
                        onClick={() => setActiveTab('l1')}
                        className={`rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'l1'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        L-1
                    </button>
                    <button
                        onClick={() => setActiveTab('l2')}
                        className={`px-4 py-2 rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'l2'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        L-2
                    </button>
                    <button
                        onClick={() => setActiveTab('l-3a-1')}
                        className={`py-2 rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'l-3a-1'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        L-3A-1
                    </button>
                    <button
                        onClick={() => setActiveTab('l-3a-2')}
                        className={`py-2 rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'l-3a-2'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        L-3A-2
                    </button>
                    <button
                        onClick={() => setActiveTab('l-3a-3')}
                        className={`py-2 rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'l-3a-3'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        L-3A-3
                    </button>
                    <button
                        onClick={() => setActiveTab('l-3a-4')}
                        className={`py-2 rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'l-3a-4'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        L-3A-4
                    </button>
                    <button
                        onClick={() => setActiveTab('l-3b')}
                        className={`py-2 rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'l-3b'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        L-3B
                    </button>
                    <button
                        onClick={() => setActiveTab('l-3c')}
                        className={`py-2 rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'l-3c'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        L-3C
                    </button>
                    <button
                        onClick={() => setActiveTab('l-3d')}
                        className={`py-2 rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'l-3d'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        L-3D
                    </button>
                    <button
                        onClick={() => setActiveTab('l-4')}
                        className={`py-2 rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'l-4'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        L-4
                    </button>
                    <button
                        onClick={() => setActiveTab('l-5')}
                        className={`py-2 rounded-lg bg-transparent font-medium transition-colors ${activeTab === 'l-5'
                            ? 'bg-blue-600 text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        L-5
                    </button>
                </div>
            </div>
            <div className="px-6 mb-4">
                {activeTab === 'main' && (
                    <>
                        {/* {taxpayerData && (
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-blue-800 mb-2">Informasi Data Taxpayer</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                                    <div>
                                        <span className="font-medium">NIK:</span> {taxpayerData.nik || 'Tidak tersedia'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Nama:</span> {taxpayerData.full_name || 'Tidak tersedia'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Email:</span> {taxpayerData.email || 'Tidak tersedia'}
                                    </div>
                                </div>
                                <p className="text-xs text-blue-600 mt-2">
                                    ✓ Data taxpayer berhasil dimuat dan akan mengisi form secara otomatis
                                </p>
                            </div>
                        )} */}

                        {!taxpayerData && autoFillAttempted && (
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Warning className="h-5 w-5 text-yellow-600" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-yellow-800">Data Taxpayer Tidak Ditemukan</h3>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Untuk membuat SPT Tahunan, Anda perlu melengkapi registrasi taxpayer terlebih dahulu.
                                            Silakan kunjungi halaman registrasi taxpayer untuk melengkapi data Anda.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Alerts */}
                        <div className="px-6">
                            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                        </div>

                        {/* Form Sections */}
                        <div className="px-6 space-y-3">
                            {sections.map((section, index) => (
                                <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <SectionHeader
                                        section={section}
                                        index={index}
                                        isExpanded={expandedSections[section.id]}
                                        onToggle={() => toggleSection(section.id)}
                                    />

                                    {expandedSections[section.id] && (
                                        <div className="border-t border-gray-200 bg-white">
                                            {renderSectionContent(section.id)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={submitSpt}
                                    disabled={loading || !sptData.statement.declaration}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Send className="h-5 w-5" />
                                    {loading ? 'Processing...' : 'Pay and Submit'}
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-500">
                                    Make sure all required fields are filled before submitting
                                </p>
                            </div>
                        </div>
                    </>)
                }
                {activeTab === 'l1' && (
                    <div className="px-6">
                        {/* Alerts untuk L1 tab */}
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                        <L1AssetsForm
                            data={l1Data}
                            onDataChange={handleL1DataChange}
                            taxpayerData={taxpayerData}
                        />

                        {/* Action Buttons untuk L1 */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Main Form
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'l2' && (
                    <div className="px-6">
                        {/* Alerts untuk L1 tab */}
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                        <L2Form
                            data={l2Data}
                            onDataChange={handleL2DataChange}
                            taxpayerData={taxpayerData}
                        />

                        {/* Action Buttons untuk L1 */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Main Form
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'l-3a-1' && (
                    <div className="px-6">
                        {/* Alerts untuk L1 tab */}
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                        <L3A1Form
                            data={l3A1Data}
                            onDataChange={handleL3A1DataChange}
                            taxpayerData={taxpayerData}
                        />

                        {/* Action Buttons untuk L1 */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Main Form
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'l-3a-2' && (
                    <div className="px-6">
                        {/* Alerts untuk L1 tab */}
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                        <L3A2Form
                            data={l3A2Data}
                            onDataChange={handleL3A2DataChange}
                            taxpayerData={taxpayerData}
                        />

                        {/* Action Buttons untuk L1 */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Main Form
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'l-3a-3' && (
                    <div className="px-6">
                        {/* Alerts untuk L1 tab */}
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                        <L3A3Form
                            data={l3A3Data}
                            onDataChange={handleL3A3DataChange}
                            taxpayerData={taxpayerData}
                        />

                        {/* Action Buttons untuk L1 */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Main Form
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'l-3a-4' && (
                    <div className="px-6">
                        {/* Alerts untuk L1 tab */}
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                        <L3A4Form
                            data={l3A3Data}
                            onDataChange={handleL3A4DataChange}
                            taxpayerData={taxpayerData}
                        />

                        {/* Action Buttons untuk L1 */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Main Form
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'l-3b' && (
                    <div className="px-6">
                        {/* Alerts untuk L1 tab */}
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                        <L3BForm
                            data={l3BData}
                            onDataChange={handleL3BDataChange}
                            taxpayerData={taxpayerData}
                        />

                        {/* Action Buttons untuk L1 */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Main Form
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'l-3c' && (
                    <div className="px-6">
                        {/* Alerts untuk L1 tab */}
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                        <L3CForm
                            data={l3CData}
                            onDataChange={handleL3CDataChange}
                            taxpayerData={taxpayerData}
                        />

                        {/* Action Buttons untuk L1 */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Main Form
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'l-3d' && (
                    <div className="px-6">
                        {/* Alerts untuk L1 tab */}
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                        <L3DForm
                            data={l3DData}
                            onDataChange={handleL3DDataChange}
                            taxpayerData={taxpayerData}
                        />

                        {/* Action Buttons untuk L1 */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Main Form
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'l-4' && (
                    <div className="px-6">
                        {/* Alerts untuk L1 tab */}
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                        <L4Form
                            data={l4Data}
                            onDataChange={handleL4DataChange}
                            taxpayerData={taxpayerData}
                        />

                        {/* Action Buttons untuk L1 */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Main Form
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'l-5' && (
                    <div className="px-6">
                        {/* Alerts untuk L1 tab */}
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                        <L5Form
                            data={l5Data}
                            onDataChange={handleL5DataChange}
                            taxpayerData={taxpayerData}
                        />

                        {/* Action Buttons untuk L1 */}
                        <div className="mt-8 p-6 border-t border-gray-200">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={loading}
                                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>

                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Main Form
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-gray-700">Processing...</span>
                        </div>
                    </div>
                </div>
            )}
            {/* Payment Dialogs */}
            <TaxDepositDialog />
            <PaymentMethodDialog />
        </div>
    );
};

export default SptTahunanForm;