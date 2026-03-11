import React, { useState, useEffect } from 'react';
import {
    Check, Download, FileOpen, ArrowBack, ArrowForward,
    Save, Send, Warning, Info, Upload, Delete, ExpandMore, ExpandLess,
    Business, Assignment, Calculate, CreditCard, AccountBalance,
    Refresh, AttachFile, CheckBox, Person, Description
} from '@mui/icons-material';
import API from "../../../../utils/host.config";

const SptTahunanBadanForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sptId, setSptId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [expandedSections, setExpandedSections] = useState({ header: true });
    const [companyData, setCompanyData] = useState(null);
    const [autoFillAttempted, setAutoFillAttempted] = useState(false);

    // Form data state untuk SPT Badan
    const [sptData, setSptData] = useState({
        // Header data
        header: {
            tax_year: new Date().getFullYear() - 1,
            tax_return_status: 'NORMAL',
            currency: 'IDR',
            bookkeeping_method: 'Full Bookkeeping',
            reporting_period_start: '01 January',
            reporting_period_end: '31 December',
            submission_type: 'Electronic'
        },

        // A. Company Identity
        company_identity: {
            company_name: '',
            npwp: '',
            company_type: '',
            establishment_date: '',
            pic_name: '',
            pic_nik: '',
            email: '',
            phone: '',
            address: '',
            business_activity: '',
            basic_capital: ''
        },

        // B. General Information
        general_info: {
            business_status: 'Normal Operations',
            tax_facility: 'General Rate',
            bookkeeping_standard: 'Full Bookkeeping',
            reporting_currency: 'IDR',
            financial_year_start: '01 January',
            financial_year_end: '31 December'
        },

        // C. Balance Sheet (Neraca)
        balance_sheet: {
            assets: {
                current_assets: {
                    cash_and_cash_equivalents: 0,
                    trade_receivables: 0,
                    inventory: 0,
                    prepaid_expenses: 0,
                    other_current_assets: 0,
                    total_current_assets: 0
                },
                non_current_assets: {
                    fixed_assets: 0,
                    accumulated_depreciation: 0,
                    net_fixed_assets: 0,
                    intangible_assets: 0,
                    investment: 0,
                    other_non_current_assets: 0,
                    total_non_current_assets: 0
                },
                total_assets: 0
            },
            liabilities: {
                current_liabilities: {
                    trade_payables: 0,
                    short_term_debt: 0,
                    accrued_expenses: 0,
                    tax_payable: 0,
                    other_current_liabilities: 0,
                    total_current_liabilities: 0
                },
                non_current_liabilities: {
                    long_term_debt: 0,
                    deferred_tax_liability: 0,
                    other_non_current_liabilities: 0,
                    total_non_current_liabilities: 0
                },
                total_liabilities: 0
            },
            equity: {
                paid_up_capital: 0,
                retained_earnings: 0,
                current_year_profit: 0,
                other_equity: 0,
                total_equity: 0
            }
        },

        // D. Profit & Loss Statement (Laporan Laba Rugi)
        profit_loss: {
            revenue: {
                gross_revenue: 0,
                sales_returns: 0,
                sales_discount: 0,
                net_revenue: 0
            },
            cost_of_goods_sold: {
                beginning_inventory: 0,
                purchases: 0,
                direct_labor: 0,
                factory_overhead: 0,
                ending_inventory: 0,
                total_cogs: 0
            },
            gross_profit: 0,
            operating_expenses: {
                selling_expenses: 0,
                administrative_expenses: 0,
                general_expenses: 0,
                total_operating_expenses: 0
            },
            operating_profit: 0,
            other_income_expenses: {
                interest_income: 0,
                dividend_income: 0,
                other_income: 0,
                interest_expense: 0,
                other_expenses: 0,
                total_other_income: 0
            },
            profit_before_tax: 0,
            tax_expense: 0,
            net_profit: 0
        },

        // E. Tax Calculation (Perhitungan Pajak)
        tax_calculation: {
            commercial_profit: 0,
            fiscal_adjustments: {
                positive_corrections: 0,
                negative_corrections: 0,
                total_adjustments: 0
            },
            fiscal_profit: 0,
            loss_compensation: 0,
            taxable_income: 0,
            tax_rate: 25,
            income_tax_payable: 0
        },

        // F. Tax Credit & Payments (Kredit Pajak)
        tax_credit: {
            withholding_tax_article_23: 0,
            withholding_tax_article_22: 0,
            withholding_tax_article_26: 0,
            installment_article_25: 0,
            overpayment_previous_year: 0,
            foreign_tax_credit: 0,
            total_tax_credit: 0
        },

        // G. Tax Payable/Overpayment (Kurang/Lebih Bayar)
        tax_payable: {
            income_tax_payable: 0,
            total_tax_credit: 0,
            tax_underpayment: 0,
            tax_overpayment: 0,
            final_status: 'Nihil'
        },

        // H. Attachments & Supporting Documents
        attachments: {
            financial_statements: { required: true, file: null },
            audit_report: { required: false, file: null },
            tax_withholding_certificates: { required: false, file: null },
            related_party_transactions: { required: false, file: null },
            transfer_pricing_documentation: { required: false, file: null },
            other_documents: { required: false, file: null }
        },

        // I. Statement & Signature
        statement: {
            declaration: false,
            signature: '',
            company_name: '',
            pic_name: '',
            pic_nik: '',
            position: 'Person in Charge',
            date: '',
            stamp: ''
        }
    });

    const sections = [
        { id: 'header', title: 'HEADER INFORMATION', icon: Assignment },
        { id: 'company_identity', title: 'A. COMPANY IDENTITY', icon: Business },
        { id: 'general_info', title: 'B. GENERAL INFORMATION', icon: Info },
        { id: 'balance_sheet', title: 'C. BALANCE SHEET (NERACA)', icon: AccountBalance },
        { id: 'profit_loss', title: 'D. PROFIT & LOSS STATEMENT', icon: Calculate },
        { id: 'tax_calculation', title: 'E. TAX CALCULATION', icon: CreditCard },
        { id: 'tax_credit', title: 'F. TAX CREDIT & PAYMENTS', icon: Refresh },
        { id: 'tax_payable', title: 'G. TAX PAYABLE/OVERPAYMENT', icon: AccountBalance },
        { id: 'attachments', title: 'H. ATTACHMENTS & DOCUMENTS', icon: AttachFile },
        { id: 'statement', title: 'I. STATEMENT & SIGNATURE', icon: CheckBox }
    ];

    // Fetch company data on component mount
    useEffect(() => {
        fetchCompanyData();
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

    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API.HOST}/api/v2/company/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }
            });

            const result = await response.json();
            if (result.success && result.data) {
                setCompanyData(result.data);
                setAutoFillAttempted(true);
                
                // Auto-fill jika form benar-benar kosong
                setSptData(prev => {
                    const isInitialLoad = !prev.company_identity.company_name && 
                                        !prev.company_identity.pic_name && 
                                        !prev.statement.company_name;
                    
                    if (isInitialLoad) {
                        return {
                            ...prev,
                            company_identity: {
                                ...prev.company_identity,
                                company_name: result.data.company_name || '',
                                company_type: result.data.company_type || '',
                                pic_name: result.data.pic_name || '',
                                pic_nik: result.data.notary_nik || '',
                                email: result.data.email || '',
                                phone: result.data.phone || '',
                                basic_capital: result.data.basic_capital || '',
                                establishment_date: result.data.establishment_date || ''
                            },
                            statement: {
                                ...prev.statement,
                                company_name: result.data.company_name || '',
                                pic_name: result.data.pic_name || '',
                                pic_nik: result.data.notary_nik || ''
                            },
                            balance_sheet: {
                                ...prev.balance_sheet,
                                equity: {
                                    ...prev.balance_sheet.equity,
                                    paid_up_capital: parseFloat(result.data.basic_capital || 0)
                                }
                            }
                        };
                    }
                    return prev;
                });
            } else {
                setAutoFillAttempted(true);
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            setAutoFillAttempted(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchSptData = async (sptId) => {
        try {
            setLoading(true);
            const response = await fetch(`${API.HOST}/api/v2/spt-tahunan-badan/${sptId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }
            });

            const result = await response.json();
            if (result.success && result.data) {
                const sptDetail = result.data;

                // Parse JSON fields dan populate form
                setSptData(prev => ({
                    ...prev,
                    header: {
                        tax_year: sptDetail.tax_year || prev.header.tax_year,
                        tax_return_status: sptDetail.tax_return_model || prev.header.tax_return_status,
                        bookkeeping_method: sptDetail.bookkeeping_type || prev.header.bookkeeping_method,
                        currency: prev.header.currency,
                        reporting_period_start: prev.header.reporting_period_start,
                        reporting_period_end: prev.header.reporting_period_end,
                        submission_type: prev.header.submission_type
                    },
                    company_identity: sptDetail.taxpayer_identity ?
                        { ...prev.company_identity, ...JSON.parse(sptDetail.taxpayer_identity) } : prev.company_identity,
                    general_info: sptDetail.income_summary ?
                        { ...prev.general_info, ...JSON.parse(sptDetail.income_summary) } : prev.general_info,
                    balance_sheet: sptDetail.income_tax_calculation ?
                        { ...prev.balance_sheet, ...JSON.parse(sptDetail.income_tax_calculation) } : prev.balance_sheet,
                    profit_loss: sptDetail.income_tax_credit ?
                        { ...prev.profit_loss, ...JSON.parse(sptDetail.income_tax_credit) } : prev.profit_loss,
                    tax_calculation: sptDetail.underpayment_overpayment ?
                        { ...prev.tax_calculation, ...JSON.parse(sptDetail.underpayment_overpayment) } : prev.tax_calculation,
                    tax_credit: sptDetail.amendment_tax_return ?
                        { ...prev.tax_credit, ...JSON.parse(sptDetail.amendment_tax_return) } : prev.tax_credit,
                    tax_payable: sptDetail.refund_data ?
                        { ...prev.tax_payable, ...JSON.parse(sptDetail.refund_data) } : prev.tax_payable,
                    attachments: sptDetail.additional_attachments ?
                        { ...prev.attachments, ...JSON.parse(sptDetail.additional_attachments) } : prev.attachments,
                    statement: sptDetail.statement_data ?
                        { ...prev.statement, ...JSON.parse(sptDetail.statement_data) } : prev.statement
                }));

                setSuccess('Data SPT Badan berhasil dimuat');
            }
        } catch (error) {
            console.error('Error fetching SPT Badan data:', error);
            setError('Gagal mengambil data SPT Badan');
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

    const updateNestedData = (section, subsection, data) => {
        setSptData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subsection]: { ...prev[section][subsection], ...data }
            }
        }));
    };

    const createSpt = async () => {
        setLoading(true);
        try {
            if (!companyData) {
                setError('Data perusahaan tidak ditemukan. Silakan lengkapi registrasi perusahaan terlebih dahulu.');
                return false;
            }

            const response = await fetch(`${API.HOST}/api/v2/spt-tahunan-badan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({
                    tax_year: sptData.header.tax_year,
                    tax_period: `${sptData.header.tax_year} January - December`,
                    tax_return_model: sptData.header.tax_return_status,
                    bookkeeping_type: sptData.header.bookkeeping_method,
                    reporting_currency: sptData.header.currency
                })
            });

            const result = await response.json();
            if (result.success) {
                setSptId(result.data.id);
                setSuccess('SPT Tahunan Badan berhasil dibuat dengan data perusahaan yang sudah terisi otomatis');
                
                // Auto-fill form dengan data yang dikembalikan dari backend
                if (result.data.company_data) {
                    setSptData(prev => ({
                        ...prev,
                        company_identity: {
                            ...prev.company_identity,
                            company_name: result.data.company_data.company_name || prev.company_identity.company_name,
                            pic_name: result.data.company_data.pic_name || prev.company_identity.pic_name,
                            email: result.data.company_data.email || prev.company_identity.email,
                            phone: result.data.company_data.phone || prev.company_identity.phone,
                        },
                        statement: {
                            ...prev.statement,
                            company_name: result.data.company_data.company_name || prev.statement.company_name,
                            pic_name: result.data.company_data.pic_name || prev.statement.pic_name,
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

    const saveDraft = async () => {
        if (!sptId) {
            const created = await createSpt();
            if (!created) {
                return false;
            }
        }

        setLoading(true);
        try {
            const sectionsToSave = [
                { section: 'taxpayer_identity', data: sptData.company_identity },
                { section: 'income_summary', data: sptData.general_info },
                { section: 'income_tax_calculation', data: sptData.balance_sheet },
                { section: 'income_tax_credit', data: sptData.profit_loss },
                { section: 'underpayment_overpayment', data: sptData.tax_calculation },
                { section: 'amendment_tax_return', data: sptData.tax_credit },
                { section: 'refund_data', data: sptData.tax_payable },
                { section: 'additional_attachments', data: sptData.attachments },
                { section: 'statement_data', data: sptData.statement }
            ];

            let savedSections = 0;
            const errors = [];
            
            for (const { section, data } of sectionsToSave) {
                try {
                    const response = await fetch(`${API.HOST}/api/v2/spt-tahunan-badan/${sptId}/section`, {
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

    const submitSpt = async () => {
        // Validation before submit
        const validationErrors = [];
        
        if (!sptData.statement.declaration) {
            validationErrors.push('Silakan centang pernyataan terlebih dahulu');
        }
        
        if (!sptData.company_identity.company_name || !sptData.company_identity.pic_name) {
            validationErrors.push('Data identitas perusahaan belum lengkap');
        }
        
        if (!sptData.statement.company_name || !sptData.statement.pic_name) {
            validationErrors.push('Data pernyataan belum lengkap');
        }

        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '));
            return;
        }

        setLoading(true);
        try {
            let currentSptId = sptId;

            // Step 1: Create SPT if it doesn't exist yet
            if (!currentSptId) {
                const createResponse = await fetch(`${API.HOST}/api/v2/spt-tahunan-badan`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeaders()
                    },
                    body: JSON.stringify({
                        digital_signature: sptData.statement.signature,
                        tax_year: sptData.header.tax_year,
                        tax_period: `${sptData.header.tax_year} January - December`,
                        tax_return_model: sptData.header.tax_return_status,
                        bookkeeping_type: sptData.header.bookkeeping_method,
                        reporting_currency: sptData.header.currency
                    })
                });

                const createResult = await createResponse.json();
                if (!createResult.success) {
                    setError(createResult.message || 'Gagal membuat SPT Badan');
                    return;
                }

                currentSptId = createResult.data.id;
                setSptId(currentSptId);
            }

            // Step 2: Save all sections data
            const sectionsToSave = [
                { section: 'taxpayer_identity', data: sptData.company_identity },
                { section: 'income_summary', data: sptData.general_info },
                { section: 'income_tax_calculation', data: sptData.balance_sheet },
                { section: 'income_tax_credit', data: sptData.profit_loss },
                { section: 'underpayment_overpayment', data: sptData.tax_calculation },
                { section: 'amendment_tax_return', data: sptData.tax_credit },
                { section: 'refund_data', data: sptData.tax_payable },
                { section: 'additional_attachments', data: sptData.attachments },
                { section: 'statement_data', data: sptData.statement }
            ];

            // Save all sections
            for (const { section, data } of sectionsToSave) {
                try {
                    const response = await fetch(`${API.HOST}/api/v2/spt-tahunan-badan/${currentSptId}/section`, {
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

            // Step 3: Submit SPT
            const submitResponse = await fetch(`${API.HOST}/api/v2/spt-tahunan-badan/${currentSptId}/submit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }
            });

            const submitResult = await submitResponse.json();
            
            if (submitResult.success) {
                setSuccess(submitResult.message);
                setIsSubmitted(true);
                
                if (submitResult.data?.reference_number) {
                    setSuccess(
                        `${submitResult.message}\n\nNomor Referensi: ${submitResult.data.reference_number}\nStatus: ${submitResult.data.status.toUpperCase()}`
                    );
                }
            } else {
                setError(submitResult.message || 'Gagal submit SPT Badan');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setError('Terjadi kesalahan jaringan: ' + error.message);
        } finally {
                window.scrollTo({ top: 0, behavior: 'smooth'})
            setLoading(false);
        }
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
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Year</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Return Status</label>
                    <select
                        value={sptData.header.tax_return_status}
                        onChange={(e) => updateSectionData('header', { tax_return_status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="NORMAL">NORMAL</option>
                        <option value="Amendment">AMENDMENT</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                        value={sptData.header.currency}
                        onChange={(e) => updateSectionData('header', { currency: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="IDR">Indonesian Rupiah (IDR)</option>
                        <option value="USD">US Dollar (USD)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bookkeeping Method</label>
                    <select
                        value={sptData.header.bookkeeping_method}
                        onChange={(e) => updateSectionData('header', { bookkeeping_method: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Full Bookkeeping">Full Bookkeeping</option>
                        <option value="Simple Bookkeeping">Simple Bookkeeping</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Period Start</label>
                    <input
                        type="text"
                        value={sptData.header.reporting_period_start}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Period End</label>
                    <input
                        type="text"
                        value={sptData.header.reporting_period_end}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                </div>
            </div>
        </div>
    );

    // Company Identity Section
    const CompanyIdentitySection = () => (
        <div className="p-6 space-y-4">
            {/* Info jika data auto-filled */}
            {companyData && autoFillAttempted && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded mb-4">
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">Data perusahaan berhasil dimuat dari database registrasi</span>
                    </div>
                </div>
            )}

            {/* Warning jika belum ada data perusahaan */}
            {!companyData && autoFillAttempted && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-4">
                    <div className="flex items-center gap-2">
                        <Warning className="h-4 w-4" />
                        <span className="text-sm">Data perusahaan tidak ditemukan. Silakan lengkapi registrasi perusahaan terlebih dahulu.</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                    <input
                        type="text"
                        value={sptData.company_identity.company_name}
                        onChange={(e) => updateSectionData('company_identity', { company_name: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            companyData?.company_name ? 'bg-green-50 border-green-300' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan nama perusahaan"
                    />
                    {companyData?.company_name && (
                        <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data registrasi</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Type</label>
                    <input
                        type="text"
                        value={sptData.company_identity.company_type}
                        onChange={(e) => updateSectionData('company_identity', { company_type: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            companyData?.company_type ? 'bg-green-50 border-green-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., PT, CV, Yayasan"
                    />
                    {companyData?.company_type && (
                        <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data registrasi</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NPWP</label>
                    <input
                        type="text"
                        value={sptData.company_identity.npwp}
                        onChange={(e) => updateSectionData('company_identity', { npwp: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="00.000.000.0-000.000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Establishment Date</label>
                    <input
                        type="date"
                        value={sptData.company_identity.establishment_date}
                        onChange={(e) => updateSectionData('company_identity', { establishment_date: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            companyData?.establishment_date ? 'bg-green-50 border-green-300' : 'border-gray-300'
                        }`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Person in Charge (PIC) Name *</label>
                    <input
                        type="text"
                        value={sptData.company_identity.pic_name}
                        onChange={(e) => updateSectionData('company_identity', { pic_name: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            companyData?.pic_name ? 'bg-green-50 border-green-300' : 'border-gray-300'
                        }`}
                        placeholder="Nama penanggung jawab"
                    />
                    {companyData?.pic_name && (
                        <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data registrasi</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIC NIK</label>
                    <input
                        type="text"
                        value={sptData.company_identity.pic_nik}
                        onChange={(e) => updateSectionData('company_identity', { pic_nik: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            companyData?.notary_nik ? 'bg-green-50 border-green-300' : 'border-gray-300'
                        }`}
                        placeholder="NIK penanggung jawab"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                        type="email"
                        value={sptData.company_identity.email}
                        onChange={(e) => updateSectionData('company_identity', { email: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            companyData?.email ? 'bg-green-50 border-green-300' : 'border-gray-300'
                        }`}
                        placeholder="Email perusahaan"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                        type="text"
                        value={sptData.company_identity.phone}
                        onChange={(e) => updateSectionData('company_identity', { phone: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            companyData?.phone ? 'bg-green-50 border-green-300' : 'border-gray-300'
                        }`}
                        placeholder="Nomor telepon"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Activity</label>
                <textarea
                    value={sptData.company_identity.business_activity}
                    onChange={(e) => updateSectionData('company_identity', { business_activity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="Deskripsi kegiatan usaha"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic Capital (IDR)</label>
                <input
                    type="text"
                    value={sptData.company_identity.basic_capital}
                    onChange={(e) => updateSectionData('company_identity', { basic_capital: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        companyData?.basic_capital ? 'bg-green-50 border-green-300' : 'border-gray-300'
                    }`}
                    placeholder="Modal dasar perusahaan"
                />
            </div>
        </div>
    );

    // General Information Section
    const GeneralInfoSection = () => (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Status</label>
                    <select
                        value={sptData.general_info.business_status}
                        onChange={(e) => updateSectionData('general_info', { business_status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Normal Operations">Normal Operations</option>
                        <option value="New Establishment">New Establishment</option>
                        <option value="Cessation">Cessation</option>
                        <option value="Liquidation">Liquidation</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Facility</label>
                    <select
                        value={sptData.general_info.tax_facility}
                        onChange={(e) => updateSectionData('general_info', { tax_facility: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="General Rate">General Rate (25%)</option>
                        <option value="Article 31E">Article 31E (SME Rate)</option>
                        <option value="Investment Facility">Investment Facility</option>
                        <option value="Other Facility">Other Facility</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bookkeeping Standard</label>
                    <select
                        value={sptData.general_info.bookkeeping_standard}
                        onChange={(e) => updateSectionData('general_info', { bookkeeping_standard: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Full Bookkeeping">Full Bookkeeping</option>
                        <option value="Simple Bookkeeping">Simple Bookkeeping</option>
                        <option value="Cash Basis">Cash Basis</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Currency</label>
                    <select
                        value={sptData.general_info.reporting_currency}
                        onChange={(e) => updateSectionData('general_info', { reporting_currency: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="IDR">Indonesian Rupiah (IDR)</option>
                        <option value="USD">US Dollar (USD)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year Start</label>
                    <input
                        type="text"
                        value={sptData.general_info.financial_year_start}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year End</label>
                    <input
                        type="text"
                        value={sptData.general_info.financial_year_end}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                </div>
            </div>
        </div>
    );

    // Balance Sheet Section
    const BalanceSheetSection = () => {
        const formatNumber = (value) => {
            return new Intl.NumberFormat('id-ID').format(value || 0);
        };

        const handleNumberInput = (section, subsection, field, value) => {
            const numericValue = parseFloat(value.replace(/[.,]/g, '')) || 0;
            updateNestedData('balance_sheet', section, {
                [subsection]: {
                    ...sptData.balance_sheet[section][subsection],
                    [field]: numericValue
                }
            });
        };

        return (
            <div className="p-6 space-y-6">
                {/* ASSETS */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">ASSETS (AKTIVA)</h3>
                    
                    {/* Current Assets */}
                    <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Current Assets (Aktiva Lancar)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cash & Cash Equivalents</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.assets.current_assets.cash_and_cash_equivalents)}
                                    onChange={(e) => handleNumberInput('assets', 'current_assets', 'cash_and_cash_equivalents', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trade Receivables</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.assets.current_assets.trade_receivables)}
                                    onChange={(e) => handleNumberInput('assets', 'current_assets', 'trade_receivables', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Inventory</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.assets.current_assets.inventory)}
                                    onChange={(e) => handleNumberInput('assets', 'current_assets', 'inventory', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Prepaid Expenses</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.assets.current_assets.prepaid_expenses)}
                                    onChange={(e) => handleNumberInput('assets', 'current_assets', 'prepaid_expenses', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Non-Current Assets */}
                    <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Non-Current Assets (Aktiva Tetap)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Assets</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.assets.non_current_assets.fixed_assets)}
                                    onChange={(e) => handleNumberInput('assets', 'non_current_assets', 'fixed_assets', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Accumulated Depreciation</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.assets.non_current_assets.accumulated_depreciation)}
                                    onChange={(e) => handleNumberInput('assets', 'non_current_assets', 'accumulated_depreciation', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Intangible Assets</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.assets.non_current_assets.intangible_assets)}
                                    onChange={(e) => handleNumberInput('assets', 'non_current_assets', 'intangible_assets', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Investment</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.assets.non_current_assets.investment)}
                                    onChange={(e) => handleNumberInput('assets', 'non_current_assets', 'investment', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* LIABILITIES */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">LIABILITIES (KEWAJIBAN)</h3>
                    
                    {/* Current Liabilities */}
                    <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Current Liabilities (Kewajiban Lancar)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trade Payables</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.liabilities.current_liabilities.trade_payables)}
                                    onChange={(e) => handleNumberInput('liabilities', 'current_liabilities', 'trade_payables', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Short Term Debt</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.liabilities.current_liabilities.short_term_debt)}
                                    onChange={(e) => handleNumberInput('liabilities', 'current_liabilities', 'short_term_debt', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Payable</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.liabilities.current_liabilities.tax_payable)}
                                    onChange={(e) => handleNumberInput('liabilities', 'current_liabilities', 'tax_payable', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Accrued Expenses</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.liabilities.current_liabilities.accrued_expenses)}
                                    onChange={(e) => handleNumberInput('liabilities', 'current_liabilities', 'accrued_expenses', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Non-Current Liabilities */}
                    <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Non-Current Liabilities (Kewajiban Jangka Panjang)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Long Term Debt</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.liabilities.non_current_liabilities.long_term_debt)}
                                    onChange={(e) => handleNumberInput('liabilities', 'non_current_liabilities', 'long_term_debt', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Deferred Tax Liability</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.balance_sheet.liabilities.non_current_liabilities.deferred_tax_liability)}
                                    onChange={(e) => handleNumberInput('liabilities', 'non_current_liabilities', 'deferred_tax_liability', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* EQUITY */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">EQUITY (MODAL)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Paid-up Capital</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.balance_sheet.equity.paid_up_capital)}
                                onChange={(e) => handleNumberInput('equity', '', 'paid_up_capital', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                    companyData?.basic_capital ? 'bg-green-50 border-green-300' : 'border-gray-300'
                                }`}
                                placeholder="0"
                            />
                            {companyData?.basic_capital && (
                                <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari modal dasar</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Retained Earnings</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.balance_sheet.equity.retained_earnings)}
                                onChange={(e) => updateSectionData('balance_sheet', { 
                                    equity: { ...sptData.balance_sheet.equity, retained_earnings: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Year Profit</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.balance_sheet.equity.current_year_profit)}
                                onChange={(e) => updateSectionData('balance_sheet', { 
                                    equity: { ...sptData.balance_sheet.equity, current_year_profit: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Other Equity</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.balance_sheet.equity.other_equity)}
                                onChange={(e) => updateSectionData('balance_sheet', { 
                                    equity: { ...sptData.balance_sheet.equity, other_equity: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Profit & Loss Section
    const ProfitLossSection = () => {
        const formatNumber = (value) => {
            return new Intl.NumberFormat('id-ID').format(value || 0);
        };

        const handleNumberInput = (section, subsection, field, value) => {
            const numericValue = parseFloat(value.replace(/[.,]/g, '')) || 0;
            if (subsection) {
                updateNestedData('profit_loss', section, {
                    [subsection]: {
                        ...sptData.profit_loss[section][subsection],
                        [field]: numericValue
                    }
                });
            } else {
                updateSectionData('profit_loss', {
                    [section]: {
                        ...sptData.profit_loss[section],
                        [field]: numericValue
                    }
                });
            }
        };

        return (
            <div className="p-6 space-y-6">
                {/* REVENUE */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">REVENUE (PENDAPATAN)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gross Revenue</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.revenue.gross_revenue)}
                                onChange={(e) => handleNumberInput('revenue', '', 'gross_revenue', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sales Returns</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.revenue.sales_returns)}
                                onChange={(e) => handleNumberInput('revenue', '', 'sales_returns', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sales Discount</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.revenue.sales_discount)}
                                onChange={(e) => handleNumberInput('revenue', '', 'sales_discount', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Net Revenue</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.revenue.net_revenue)}
                                onChange={(e) => handleNumberInput('revenue', '', 'net_revenue', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                placeholder="0"
                                readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">Auto-calculated: Gross Revenue - Returns - Discount</p>
                        </div>
                    </div>
                </div>

                {/* COST OF GOODS SOLD */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">COST OF GOODS SOLD (HARGA POKOK PENJUALAN)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Beginning Inventory</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.cost_of_goods_sold.beginning_inventory)}
                                onChange={(e) => handleNumberInput('cost_of_goods_sold', '', 'beginning_inventory', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Purchases</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.cost_of_goods_sold.purchases)}
                                onChange={(e) => handleNumberInput('cost_of_goods_sold', '', 'purchases', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Direct Labor</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.cost_of_goods_sold.direct_labor)}
                                onChange={(e) => handleNumberInput('cost_of_goods_sold', '', 'direct_labor', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Factory Overhead</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.cost_of_goods_sold.factory_overhead)}
                                onChange={(e) => handleNumberInput('cost_of_goods_sold', '', 'factory_overhead', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ending Inventory</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.cost_of_goods_sold.ending_inventory)}
                                onChange={(e) => handleNumberInput('cost_of_goods_sold', '', 'ending_inventory', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total COGS</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.cost_of_goods_sold.total_cogs)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                placeholder="0"
                                readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">Auto-calculated</p>
                        </div>
                    </div>
                </div>

                {/* OPERATING EXPENSES */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">OPERATING EXPENSES (BIAYA OPERASIONAL)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Selling Expenses</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.operating_expenses.selling_expenses)}
                                onChange={(e) => handleNumberInput('operating_expenses', '', 'selling_expenses', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Administrative Expenses</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.operating_expenses.administrative_expenses)}
                                onChange={(e) => handleNumberInput('operating_expenses', '', 'administrative_expenses', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">General Expenses</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.operating_expenses.general_expenses)}
                                onChange={(e) => handleNumberInput('operating_expenses', '', 'general_expenses', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Operating Expenses</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.operating_expenses.total_operating_expenses)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                placeholder="0"
                                readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">Auto-calculated</p>
                        </div>
                    </div>
                </div>

                {/* OTHER INCOME & EXPENSES */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">OTHER INCOME & EXPENSES</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Interest Income</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.other_income_expenses.interest_income)}
                                onChange={(e) => handleNumberInput('other_income_expenses', '', 'interest_income', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Interest Expense</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.other_income_expenses.interest_expense)}
                                onChange={(e) => handleNumberInput('other_income_expenses', '', 'interest_expense', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Dividend Income</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.other_income_expenses.dividend_income)}
                                onChange={(e) => handleNumberInput('other_income_expenses', '', 'dividend_income', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Other Expenses</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.other_income_expenses.other_expenses)}
                                onChange={(e) => handleNumberInput('other_income_expenses', '', 'other_expenses', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* PROFIT CALCULATION */}
                <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">PROFIT CALCULATION</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gross Profit</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.gross_profit)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Operating Profit</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.operating_profit)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profit Before Tax</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.profit_loss.profit_before_tax)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-blue-100 font-bold"
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Tax Calculation Section
    const TaxCalculationSection = () => {
        const formatNumber = (value) => {
            return new Intl.NumberFormat('id-ID').format(value || 0);
        };

        return (
            <div className="p-6 space-y-6">
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">TAX CALCULATION (PERHITUNGAN PAJAK)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Commercial Profit (Laba Komersial)</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.tax_calculation.commercial_profit)}
                                onChange={(e) => updateSectionData('tax_calculation', { 
                                    commercial_profit: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                            <select
                                value={sptData.tax_calculation.tax_rate}
                                onChange={(e) => updateSectionData('tax_calculation', { tax_rate: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={25}>25% (General Rate)</option>
                                <option value={22}>22% (Article 31E - Revenue ≤ 50M)</option>
                                <option value={12.5}>12.5% (Article 31E - Revenue ≤ 4.8M)</option>
                                <option value={0.5}>0.5% (PP 23 - UMKM)</option>
                            </select>
                        </div>
                    </div>

                    {/* Fiscal Adjustments */}
                    <div className="border rounded-lg p-4 mb-4">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Fiscal Adjustments (Koreksi Fiskal)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Positive Corrections</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.tax_calculation.fiscal_adjustments.positive_corrections)}
                                    onChange={(e) => updateNestedData('tax_calculation', 'fiscal_adjustments', {
                                        positive_corrections: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">Biaya yang tidak boleh dikurangkan</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Negative Corrections</label>
                                <input
                                    type="text"
                                    value={formatNumber(sptData.tax_calculation.fiscal_adjustments.negative_corrections)}
                                    onChange={(e) => updateNestedData('tax_calculation', 'fiscal_adjustments', {
                                        negative_corrections: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">Penghasilan yang tidak kena pajak</p>
                            </div>
                        </div>
                    </div>

                    {/* Tax Calculation Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Profit (Laba Fiskal)</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.tax_calculation.fiscal_profit)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold"
                                readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">Commercial Profit + Positive - Negative</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Loss Compensation</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.tax_calculation.loss_compensation)}
                                onChange={(e) => updateSectionData('tax_calculation', { 
                                    loss_compensation: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Taxable Income (PKP)</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.tax_calculation.taxable_income)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-blue-100 font-bold"
                                readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">Fiscal Profit - Loss Compensation</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Income Tax Payable (PPh Terutang)</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.tax_calculation.income_tax_payable)}
                                className="w-full px-3 py-2 border border-red-300 rounded-lg bg-red-50 font-bold text-red-700"
                                readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">Taxable Income × Tax Rate</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Tax Credit Section
    const TaxCreditSection = () => {
        const formatNumber = (value) => {
            return new Intl.NumberFormat('id-ID').format(value || 0);
        };

        return (
            <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">TAX CREDIT & PAYMENTS (KREDIT PAJAK)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PPh Article 23 (Withheld)</label>
                        <input
                            type="text"
                            value={formatNumber(sptData.tax_credit.withholding_tax_article_23)}
                            onChange={(e) => updateSectionData('tax_credit', { 
                                withholding_tax_article_23: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PPh Article 22 (Import/Purchase)</label>
                        <input
                            type="text"
                            value={formatNumber(sptData.tax_credit.withholding_tax_article_22)}
                            onChange={(e) => updateSectionData('tax_credit', { 
                                withholding_tax_article_22: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PPh Article 26 (Foreign)</label>
                        <input
                            type="text"
                            value={formatNumber(sptData.tax_credit.withholding_tax_article_26)}
                            onChange={(e) => updateSectionData('tax_credit', { 
                                withholding_tax_article_26: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PPh Article 25 (Installments)</label>
                        <input
                            type="text"
                            value={formatNumber(sptData.tax_credit.installment_article_25)}
                            onChange={(e) => updateSectionData('tax_credit', { 
                                installment_article_25: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Overpayment Previous Year</label>
                        <input
                            type="text"
                            value={formatNumber(sptData.tax_credit.overpayment_previous_year)}
                            onChange={(e) => updateSectionData('tax_credit', { 
                                overpayment_previous_year: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foreign Tax Credit</label>
                        <input
                            type="text"
                            value={formatNumber(sptData.tax_credit.foreign_tax_credit)}
                            onChange={(e) => updateSectionData('tax_credit', { 
                                foreign_tax_credit: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="border-t pt-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Tax Credit</label>
                        <input
                            type="text"
                            value={formatNumber(sptData.tax_credit.total_tax_credit)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-green-100 font-bold text-green-700"
                            readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">Sum of all tax credits above</p>
                    </div>
                </div>
            </div>
        );
    };

    // Tax Payable Section
    const TaxPayableSection = () => {
        const formatNumber = (value) => {
            return new Intl.NumberFormat('id-ID').format(value || 0);
        };

        return (
            <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">TAX PAYABLE/OVERPAYMENT (KURANG/LEBIH BAYAR)</h3>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Income Tax Payable (PPh Terutang)</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.tax_payable.income_tax_payable)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold"
                                readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">From tax calculation section</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Tax Credit</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.tax_payable.total_tax_credit)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold"
                                readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">From tax credit section</p>
                        </div>
                    </div>
                </div>

                <div className="border rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Final Tax Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Underpayment (Kurang Bayar)</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.tax_payable.tax_underpayment)}
                                className="w-full px-3 py-2 border border-red-300 rounded-lg bg-red-50 font-bold text-red-700"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Overpayment (Lebih Bayar)</label>
                            <input
                                type="text"
                                value={formatNumber(sptData.tax_payable.tax_overpayment)}
                                className="w-full px-3 py-2 border border-green-300 rounded-lg bg-green-50 font-bold text-green-700"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Final Status</label>
                            <select
                                value={sptData.tax_payable.final_status}
                                onChange={(e) => updateSectionData('tax_payable', { final_status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold"
                            >
                                <option value="Nihil">Nihil (No Tax Due)</option>
                                <option value="Kurang Bayar">Kurang Bayar (Underpayment)</option>
                                <option value="Lebih Bayar">Lebih Bayar (Overpayment)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {sptData.tax_payable.final_status === 'Lebih Bayar' && (
                    <div className="border rounded-lg p-4 bg-green-50">
                        <h4 className="text-md font-semibold text-green-800 mb-3">Overpayment Options</h4>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input type="radio" name="overpayment_option" className="mr-2" />
                                <span className="text-sm">Request refund (Dikembalikan)</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="overpayment_option" className="mr-2" />
                                <span className="text-sm">Credit to next year (Diperhitungkan tahun berikutnya)</span>
                            </label>
                        </div>
                    </div>
                )}

                {sptData.tax_payable.final_status === 'Kurang Bayar' && (
                    <div className="border rounded-lg p-4 bg-red-50">
                        <h4 className="text-md font-semibold text-red-800 mb-3">Payment Required</h4>
                        <p className="text-sm text-red-700">
                            You need to pay the underpayment amount before submitting this SPT.
                            Please use the e-Billing system to generate payment code.
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // Attachments Section
    const AttachmentsSection = () => (
        <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ATTACHMENTS & SUPPORTING DOCUMENTS</h3>
            
            {Object.entries(sptData.attachments).map(([key, attachment], index) => {
                const attachmentLabels = {
                    financial_statements: 'Financial Statements (Laporan Keuangan)',
                    audit_report: 'Independent Auditor Report (Laporan Auditor)',
                    tax_withholding_certificates: 'Tax Withholding Certificates (Bukti Potong Pajak)',
                    related_party_transactions: 'Related Party Transaction Report',
                    transfer_pricing_documentation: 'Transfer Pricing Documentation',
                    other_documents: 'Other Supporting Documents'
                };

                return (
                    <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
                                    Required
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
                                    Not Required
                                </label>
                            </div>
                        </div>

                        {attachment.required ? (
                            <div className="mt-3">
                                <div
                                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                                        attachment.file ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'
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
                                            <p className="text-sm text-gray-500 mt-1">Format: PDF, JPG, PNG (Max 10MB)</p>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        id={`file_${key}`}
                                        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                                        onChange={(e) => handleFileUpload(key, e.target.files[0])}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 text-center p-3 bg-blue-50 rounded text-blue-600 text-sm">
                                No file required for this document
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    // Statement Section
    const StatementSection = () => (
        <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">STATEMENT & SIGNATURE</h3>
            
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
                            we declare that what is conveyed in this Corporate Income Tax Return and its attachments is true, complete, and clear.
                            We understand that any false statement may result in legal consequences as stipulated in tax laws.
                        </span>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                            type="text"
                            value={sptData.statement.company_name}
                            onChange={(e) => updateSectionData('statement', { company_name: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                companyData?.company_name ? 'bg-green-50 border-green-300' : 'border-gray-300'
                            }`}
                            placeholder="Nama perusahaan"
                        />
                        {companyData?.company_name && (
                            <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data perusahaan</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Person in Charge Name</label>
                        <input
                            type="text"
                            value={sptData.statement.pic_name}
                            onChange={(e) => updateSectionData('statement', { pic_name: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                companyData?.pic_name ? 'bg-green-50 border-green-300' : 'border-gray-300'
                            }`}
                            placeholder="Nama penanggung jawab"
                        />
                        {companyData?.pic_name && (
                            <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data perusahaan</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PIC NIK</label>
                        <input
                            type="text"
                            value={sptData.statement.pic_nik}
                            onChange={(e) => updateSectionData('statement', { pic_nik: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                companyData?.notary_nik ? 'bg-green-50 border-green-300' : 'border-gray-300'
                            }`}
                            placeholder="NIK penanggung jawab"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                        <select
                            value={sptData.statement.position}
                            onChange={(e) => updateSectionData('statement', { position: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Person in Charge">Person in Charge</option>
                            <option value="Director">Director</option>
                            <option value="President Director">President Director</option>
                            <option value="Commissioner">Commissioner</option>
                            <option value="Authorized Representative">Authorized Representative</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Digital Signature</label>
                        <input
                            type="text"
                            value={sptData.statement.signature}
                            onChange={(e) => updateSectionData('statement', { signature: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Digital signature"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={sptData.statement.date}
                            onChange={(e) => updateSectionData('statement', { date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <Warning className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-yellow-800">Important Notice</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                Make sure all financial data and calculations are correct before submitting. 
                                Any errors in the tax return may result in penalties or additional tax assessments.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSectionContent = (sectionId) => {
        switch (sectionId) {
            case 'header': return <HeaderSection />;
            case 'company_identity': return <CompanyIdentitySection />;
            case 'general_info': return <GeneralInfoSection />;
            case 'balance_sheet': return <BalanceSheetSection />;
            case 'profit_loss': return <ProfitLossSection />;
            case 'tax_calculation': return <TaxCalculationSection />;
            case 'tax_credit': return <TaxCreditSection />;
            case 'tax_payable': return <TaxPayableSection />;
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
                    <h4 className="text-lg font-semibold text-green-800 mb-2">SPT Tahunan Badan Berhasil Disubmit!</h4>
                    <p className="text-green-700 mb-4">
                        SPT Tahunan Badan {sptData.header.tax_year} perusahaan {sptData.company_identity.company_name} telah berhasil disubmit dan sedang diproses.
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
        <div className="max-w-6xl mx-auto bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4 mb-6 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    CORPORATE INCOME TAX RETURN (SPT TAHUNAN BADAN)
                </h1>
                <div className="flex gap-4 text-sm">
                    <span className="text-blue-600 font-medium">Form 1771</span>
                    <span className="text-gray-500">Corporate Tax Return</span>
                </div>
            </div>

            <div className="px-6 mb-4">
                {companyData && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">Company Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                            <div>
                                <span className="font-medium">Company:</span> {companyData.company_name || 'Tidak tersedia'}
                            </div>
                            <div>
                                <span className="font-medium">PIC:</span> {companyData.pic_name || 'Tidak tersedia'}
                            </div>
                            <div>
                                <span className="font-medium">Email:</span> {companyData.email || 'Tidak tersedia'}
                            </div>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                            ✓ Data perusahaan berhasil dimuat dan akan mengisi form secara otomatis
                        </p>
                    </div>
                )}

                {!companyData && autoFillAttempted && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Warning className="h-5 w-5 text-yellow-600" />
                            <div>
                                <h3 className="text-sm font-semibold text-yellow-800">Data Perusahaan Tidak Ditemukan</h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    Untuk membuat SPT Tahunan Badan, Anda perlu melengkapi registrasi perusahaan terlebih dahulu.
                                    Silakan kunjungi halaman registrasi perusahaan untuk melengkapi data Anda.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
                        Make sure all financial data is accurate and complete before submitting
                    </p>
                </div>
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
        </div>
    );
};

export default SptTahunanBadanForm;