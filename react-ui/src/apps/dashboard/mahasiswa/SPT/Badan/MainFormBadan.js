import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setSptType } from '../../../../../redux/sptSlice';
import {
    Check, Download, FileOpen, ArrowBack, ArrowForward,
    Save, Send, Warning, Info, Upload, Delete, ExpandMore, ExpandLess,
    Business, Assignment, Calculate, CreditCard, AccountBalance,
    Refresh, AttachFile, CheckBox, Person, Description
} from '@mui/icons-material';
import API from "../../../../../utils/host.config";

// ─────────────────────────────────────────────────────────────────────────────
// SEMUA SECTION COMPONENT DIDEKLARASIKAN DI LUAR SptTahunanBadanForm
// agar tidak dibuat ulang setiap render (mencegah focus loss pada input).
// ─────────────────────────────────────────────────────────────────────────────

const Alert = ({ type, message, onClose }) => {
    const getAlertStyles = () => {
        switch (type) {
            case 'error':   return 'bg-red-50 border-red-200 text-red-800';
            case 'success': return 'bg-green-50 border-green-200 text-green-800';
            case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default:        return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'error':   return <Warning className="h-5 w-5 text-red-500" />;
            case 'success': return <Check className="h-5 w-5 text-green-500" />;
            default:        return <Info className="h-5 w-5 text-blue-500" />;
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

const HeaderSection = ({ sptData, updateSectionData }) => (
    <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Year/Fractional Tax Year</label>
                <input
                    type="text"
                    value={sptData.header.tax_year}
                    readOnly
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <input
                    type="text"
                    value={sptData.header.tax_return_status}
                    readOnly
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accounting Period</label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value="1"
                        readOnly
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-center"
                    />
                    <span className="text-gray-500 font-medium">-</span>
                    <input
                        type="text"
                        value="12"
                        readOnly
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-center"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accounting Method</label>
                <select
                    value={sptData.header.bookkeeping_method}
                    onChange={(e) => updateSectionData('header', { bookkeeping_method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Pembukuan Stelsel Akrual">Pembukuan Stelsel Akrual</option>
                    <option value="Pembukuan Stelsel Kas">Pembukuan Stelsel Kas</option>
                </select>
            </div>
        </div>
    </div>
);

const CompanyIdentitySection = ({ sptData, companyData, autoFillAttempted, updateSectionData }) => (
    <div className="p-6 space-y-4">
        {companyData && autoFillAttempted && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded mb-4">
                <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span className="text-sm">Data perusahaan berhasil dimuat dari database registrasi</span>
                </div>
            </div>
        )}
        {!companyData && autoFillAttempted && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-4">
                <div className="flex items-center gap-2">
                    <Warning className="h-4 w-4" />
                    <span className="text-sm">Data perusahaan tidak ditemukan. Silakan lengkapi registrasi perusahaan terlebih dahulu.</span>
                </div>
            </div>
        )}

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">1. TIN / NPWP</label>
                <input type="text" value={sptData.company_identity.npwp}
                    onChange={(e) => updateSectionData('company_identity', { npwp: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="00.000.000.0-000.000" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">2. Name</label>
                <input type="text" value={sptData.company_identity.company_name}
                    onChange={(e) => updateSectionData('company_identity', { company_name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${companyData?.company_name ? 'bg-green-50 border-green-300' : 'border-gray-300'}`}
                    placeholder="Nama wajib pajak" />
                {companyData?.company_name && <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data registrasi</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">3. Email Address</label>
                <input type="email" value={sptData.company_identity.email}
                    onChange={(e) => updateSectionData('company_identity', { email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${companyData?.email ? 'bg-green-50 border-green-300' : 'border-gray-300'}`}
                    placeholder="Email wajib pajak" />
                {companyData?.email && <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data registrasi</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">4. Phone Number</label>
                <input type="text" value={sptData.company_identity.phone}
                    onChange={(e) => updateSectionData('company_identity', { phone: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${companyData?.phone ? 'bg-green-50 border-green-300' : 'border-gray-300'}`}
                    placeholder="Nomor telepon" />
                {companyData?.phone && <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari data registrasi</p>}
            </div>
        </div>
    </div>
);

const FinancialStatementInfoSection = ({ sptData, updateSectionData, onBusinessClassificationChange }) => {
    const isAudited = sptData.general_info.is_audited === 'Yes';

    const handleClassificationChange = (e) => {
        const value = e.target.value;
        updateSectionData('general_info', { business_classification: value });
        if (onBusinessClassificationChange) onBusinessClassificationChange(value);
    };

    return (
        <div className="p-6 space-y-5">
            {/* Field 1: Business Classification */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. Business Classification for Financial Statement in Attachment 01
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                    value={sptData.general_info.business_classification || ''}
                    onChange={handleClassificationChange}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">— Pilih Klasifikasi —</option>
                    <option value="Umum">Umum</option>
                    <option value="Dagang">Dagang</option>
                    <option value="Jasa">Jasa</option>
                </select>
            </div>

            {/* Field 2: Audited */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. Are the Financial Statements Audited by a Public Accountant?
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex gap-4">
                    {['No', 'Yes'].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="is_audited"
                                value={opt}
                                checked={sptData.general_info.is_audited === opt}
                                onChange={(e) => updateSectionData('general_info', { is_audited: e.target.value })}
                                className="accent-blue-600"
                            />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    {sptData.general_info.is_audited === 'Yes' && (
                        <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 text-sm px-3 py-1.5 rounded self-start mt-[-1px]">
                            <Info className="h-4 w-4" />
                            <span>Yes, fill out the field below</span>
                        </div>
                    )}
                </div>                
            </div>

            {/* Conditional fields — only when YES */}
            {isAudited && (
                <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                    {/* 2a. Audit Opinion */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">2a. Audit Opinion</label>
                        <select
                            value={sptData.general_info.audit_opinion || ''}
                            onChange={(e) => updateSectionData('general_info', { audit_opinion: e.target.value })}
                            className="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">— Pilih Opini —</option>
                            <option value="Wajar Tanpa Pengecualian">Wajar Tanpa Pengecualian</option>
                            <option value="Wajar Tanpa Pengecualian dengan Paragraf Penjelasan">Wajar Tanpa Pengecualian dengan Paragraf Penjelasan</option>
                            <option value="Wajar Dengan Pengecualian">Wajar Dengan Pengecualian</option>
                            <option value="Tidak Wajar">Tidak Wajar</option>
                            <option value="Tidak Menyatakan Pendapat">Tidak Menyatakan Pendapat</option>
                        </select>
                    </div>

                    {/* 2b. NPWP KAP */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">2b. NPWP Kantor Akuntan Publik</label>
                        <input
                            type="text"
                            value={sptData.general_info.kap_npwp || ''}
                            onChange={(e) => updateSectionData('general_info', { kap_npwp: e.target.value })}
                            placeholder="00.000.000.0-000.000"
                            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 2c. Nama KAP — readonly placeholder */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">2c. Nama Kantor Akuntan Publik</label>
                        <input
                            type="text"
                            value={sptData.general_info.kap_name || ''}
                            readOnly
                            placeholder="Terisi otomatis berdasarkan NPWP KAP"
                            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const BalanceSheetSection = ({ sptData, updateSectionData, updateNestedData, companyData }) => {
    const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(value || 0);

    const handleNumberInput = (section, subsection, field, value) => {
        const numericValue = parseFloat(value.replace(/[.,]/g, '')) || 0;
        updateNestedData('balance_sheet', section, {
            [subsection]: { ...sptData.balance_sheet[section][subsection], [field]: numericValue }
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* ASSETS */}
            <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ASSETS (AKTIVA)</h3>
                <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Current Assets (Aktiva Lancar)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cash & Cash Equivalents</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.assets.current_assets.cash_and_cash_equivalents)}
                                onChange={(e) => handleNumberInput('assets', 'current_assets', 'cash_and_cash_equivalents', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trade Receivables</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.assets.current_assets.trade_receivables)}
                                onChange={(e) => handleNumberInput('assets', 'current_assets', 'trade_receivables', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Inventory</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.assets.current_assets.inventory)}
                                onChange={(e) => handleNumberInput('assets', 'current_assets', 'inventory', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Prepaid Expenses</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.assets.current_assets.prepaid_expenses)}
                                onChange={(e) => handleNumberInput('assets', 'current_assets', 'prepaid_expenses', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Non-Current Assets (Aktiva Tetap)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Assets</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.assets.non_current_assets.fixed_assets)}
                                onChange={(e) => handleNumberInput('assets', 'non_current_assets', 'fixed_assets', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Accumulated Depreciation</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.assets.non_current_assets.accumulated_depreciation)}
                                onChange={(e) => handleNumberInput('assets', 'non_current_assets', 'accumulated_depreciation', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Intangible Assets</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.assets.non_current_assets.intangible_assets)}
                                onChange={(e) => handleNumberInput('assets', 'non_current_assets', 'intangible_assets', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Investment</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.assets.non_current_assets.investment)}
                                onChange={(e) => handleNumberInput('assets', 'non_current_assets', 'investment', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                    </div>
                </div>
            </div>

            {/* LIABILITIES */}
            <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">LIABILITIES (KEWAJIBAN)</h3>
                <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Current Liabilities (Kewajiban Lancar)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trade Payables</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.liabilities.current_liabilities.trade_payables)}
                                onChange={(e) => handleNumberInput('liabilities', 'current_liabilities', 'trade_payables', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Short Term Debt</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.liabilities.current_liabilities.short_term_debt)}
                                onChange={(e) => handleNumberInput('liabilities', 'current_liabilities', 'short_term_debt', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Payable</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.liabilities.current_liabilities.tax_payable)}
                                onChange={(e) => handleNumberInput('liabilities', 'current_liabilities', 'tax_payable', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Accrued Expenses</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.liabilities.current_liabilities.accrued_expenses)}
                                onChange={(e) => handleNumberInput('liabilities', 'current_liabilities', 'accrued_expenses', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Non-Current Liabilities (Kewajiban Jangka Panjang)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Long Term Debt</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.liabilities.non_current_liabilities.long_term_debt)}
                                onChange={(e) => handleNumberInput('liabilities', 'non_current_liabilities', 'long_term_debt', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Deferred Tax Liability</label>
                            <input type="text" value={formatNumber(sptData.balance_sheet.liabilities.non_current_liabilities.deferred_tax_liability)}
                                onChange={(e) => handleNumberInput('liabilities', 'non_current_liabilities', 'deferred_tax_liability', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
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
                        <input type="text" value={formatNumber(sptData.balance_sheet.equity.paid_up_capital)}
                            onChange={(e) => handleNumberInput('equity', '', 'paid_up_capital', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${companyData?.basic_capital ? 'bg-green-50 border-green-300' : 'border-gray-300'}`}
                            placeholder="0" />
                        {companyData?.basic_capital && <p className="text-xs text-green-600 mt-1">✓ Terisi otomatis dari modal dasar</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Retained Earnings</label>
                        <input type="text" value={formatNumber(sptData.balance_sheet.equity.retained_earnings)}
                            onChange={(e) => updateSectionData('balance_sheet', {
                                equity: { ...sptData.balance_sheet.equity, retained_earnings: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Year Profit</label>
                        <input type="text" value={formatNumber(sptData.balance_sheet.equity.current_year_profit)}
                            onChange={(e) => updateSectionData('balance_sheet', {
                                equity: { ...sptData.balance_sheet.equity, current_year_profit: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Other Equity</label>
                        <input type="text" value={formatNumber(sptData.balance_sheet.equity.other_equity)}
                            onChange={(e) => updateSectionData('balance_sheet', {
                                equity: { ...sptData.balance_sheet.equity, other_equity: parseFloat(e.target.value.replace(/[.,]/g, '')) || 0 }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfitLossSection = ({ sptData, updateSectionData, updateNestedData }) => {
    const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(value || 0);

    const handleNumberInput = (section, subsection, field, value) => {
        const numericValue = parseFloat(value.replace(/[.,]/g, '')) || 0;
        if (subsection) {
            updateNestedData('profit_loss', section, {
                [subsection]: { ...sptData.profit_loss[section][subsection], [field]: numericValue }
            });
        } else {
            updateSectionData('profit_loss', {
                [section]: { ...sptData.profit_loss[section], [field]: numericValue }
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
                        <input type="text" value={formatNumber(sptData.profit_loss.revenue.gross_revenue)}
                            onChange={(e) => handleNumberInput('revenue', '', 'gross_revenue', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sales Returns</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.revenue.sales_returns)}
                            onChange={(e) => handleNumberInput('revenue', '', 'sales_returns', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sales Discount</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.revenue.sales_discount)}
                            onChange={(e) => handleNumberInput('revenue', '', 'sales_discount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Net Revenue</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.revenue.net_revenue)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100" placeholder="0" readOnly />
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
                        <input type="text" value={formatNumber(sptData.profit_loss.cost_of_goods_sold.beginning_inventory)}
                            onChange={(e) => handleNumberInput('cost_of_goods_sold', '', 'beginning_inventory', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Purchases</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.cost_of_goods_sold.purchases)}
                            onChange={(e) => handleNumberInput('cost_of_goods_sold', '', 'purchases', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Direct Labor</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.cost_of_goods_sold.direct_labor)}
                            onChange={(e) => handleNumberInput('cost_of_goods_sold', '', 'direct_labor', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Factory Overhead</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.cost_of_goods_sold.factory_overhead)}
                            onChange={(e) => handleNumberInput('cost_of_goods_sold', '', 'factory_overhead', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ending Inventory</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.cost_of_goods_sold.ending_inventory)}
                            onChange={(e) => handleNumberInput('cost_of_goods_sold', '', 'ending_inventory', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total COGS</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.cost_of_goods_sold.total_cogs)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" placeholder="0" readOnly />
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
                        <input type="text" value={formatNumber(sptData.profit_loss.operating_expenses.selling_expenses)}
                            onChange={(e) => handleNumberInput('operating_expenses', '', 'selling_expenses', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Administrative Expenses</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.operating_expenses.administrative_expenses)}
                            onChange={(e) => handleNumberInput('operating_expenses', '', 'administrative_expenses', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">General Expenses</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.operating_expenses.general_expenses)}
                            onChange={(e) => handleNumberInput('operating_expenses', '', 'general_expenses', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Operating Expenses</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.operating_expenses.total_operating_expenses)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" placeholder="0" readOnly />
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
                        <input type="text" value={formatNumber(sptData.profit_loss.other_income_expenses.interest_income)}
                            onChange={(e) => handleNumberInput('other_income_expenses', '', 'interest_income', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interest Expense</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.other_income_expenses.interest_expense)}
                            onChange={(e) => handleNumberInput('other_income_expenses', '', 'interest_expense', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dividend Income</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.other_income_expenses.dividend_income)}
                            onChange={(e) => handleNumberInput('other_income_expenses', '', 'dividend_income', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Other Expenses</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.other_income_expenses.other_expenses)}
                            onChange={(e) => handleNumberInput('other_income_expenses', '', 'other_expenses', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                </div>
            </div>

            {/* PROFIT CALCULATION */}
            <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">PROFIT CALCULATION</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gross Profit</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.gross_profit)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold" readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Operating Profit</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.operating_profit)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold" readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profit Before Tax</label>
                        <input type="text" value={formatNumber(sptData.profit_loss.profit_before_tax)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-blue-100 font-bold" readOnly />
                    </div>
                </div>
            </div>
        </div>
    );
};

// FinalTaxIncomeSection — Section C dari MainForm.
// CR2 (Change Request 2): Menerima dua prop baru yang merupakan DERIVED TOTAL
// dari Lampiran 4. Nilai ini dihitung di SptTahunanBadanForm via useMemo dan
// diteruskan ke sini sebagai read-only display. Tidak ada callback balik ke L4
// maupun ke parent — murni one-way data flow (CR3/anti-circular).
//
// Aliran data (CR3):
//   L4.js → onRowsAChange/onRowsBChange → SptTahunanBadan (l4RowsA/l4RowsB)
//   → SptTahunanBadanForm props → useMemo l4TotalTaxBase/l4TotalGrossIncome
//   → FinalTaxIncomeSection props → readonly display
//
// Tidak ada nilai yang dikirim balik dari FinalTaxIncomeSection ke L4.
// MainForm tidak menghitung ulang — hanya menerima dan menampilkan.
const FinalTaxIncomeSection = ({ sptData, updateSectionData, onTabTrigger, onResetSectionD, l4TotalTaxBase, l4TotalGrossIncome }) => {
    const q1  = sptData.balance_sheet.q1_gr23         || '';
    const q1b = sptData.balance_sheet.q1b_solely_gr23  || '';
    const q2  = sptData.balance_sheet.q2_final_tax     || '';
    const q3  = sptData.balance_sheet.q3_excluded_tax   || '';
    // fmt — identik dengan helper yang dipakai di Section D (IncomeTaxCalculationSection).
    // Didefinisikan lokal karena setiap Section component berdiri sendiri di file ini.
    const fmt = (v) => new Intl.NumberFormat('id-ID').format(v || 0);
    const handleChange = (field, value) => {
        updateSectionData('balance_sheet', { [field]: value });
        if (onTabTrigger) onTabTrigger(field, value);
        if (field === 'q1b_solely_gr23' && value === 'Yes' && onResetSectionD) {
            onResetSectionD();
        }
    };
    const InfoBlock = ({ text }) => (
        <div className="flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-800 text-sm">
            <Info className="h-4 w-4 text-cyan-500 flex-shrink-0" />
            <span>{text}</span>
        </div>
    );
    // fmt — menggunakan fungsi fmt yang sudah ada di scope FinalTaxIncomeSection (didefinisikan di atas).

    return (
        <div className="p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. Do you have any income under GR Number 23 of 2018 scheme?
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="q1_gr23" value={opt} checked={q1 === opt}
                                onChange={() => handleChange('q1_gr23', opt)} className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    {q1 === 'Yes' && <InfoBlock text="Yes, fill out the Attachment 5" />}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    1b. Do you earn income solely from GR Number 23 of 2018 scheme?
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="q1b_solely_gr23" value={opt} checked={q1b === opt}
                                onChange={() => handleChange('q1b_solely_gr23', opt)} className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    {q1b === 'No' && <InfoBlock text="No, answer the question on Part D below" />}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. Do you have any income that is subject to Final Income Tax?
                    <span className="text-red-500 ml-1">*</span>
                </label>
                {/* Layout identik Point 5/6 Section D:
                    radio buttons → ReadonlyAmount (selalu tampil) → InfoBlock (conditional).
                    l4TotalTaxBase adalah derived read-only dari L4 Bagian A — realtime via
                    useMemo di SptTahunanBadanForm, tidak disimpan di sini (CR2/CR3/CR4). */}
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="q2_final_tax" value={opt} checked={q2 === opt}
                                onChange={() => handleChange('q2_final_tax', opt)} className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    <input type="text" value={fmt(l4TotalTaxBase || 0)} readOnly
                        className="w-36 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-right" placeholder="0" />
                    {q2 === 'Yes' && <InfoBlock text="Yes, fill out the Attachment 4 Part A" />}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    3. Do you have any income that is excluded from Income Tax?
                    <span className="text-red-500 ml-1">*</span>
                </label>
                {/* Layout identik Point 5/6 Section D — pola sama dengan Q2 di atas.
                    l4TotalGrossIncome adalah derived read-only dari L4 Bagian B (CR2/CR3/CR4). */}
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="q3_excluded_tax" value={opt} checked={q3 === opt}
                                onChange={() => handleChange('q3_excluded_tax', opt)} className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    <input type="text" value={fmt(l4TotalGrossIncome || 0)} readOnly
                        className="w-36 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-right" placeholder="0" />
                    {q3 === 'Yes' && <InfoBlock text="Yes, fill out the Attachment 4 Part B" />}
                </div>
            </div>
        </div>
    );
};

// Business rule Section D.11 — Tax Rate (bukan angka arbitrer, sengaja dibuat
// konstanta bernama agar tidak ada duplikasi literal di formula (point12) dan
// Information Panel; satu-satunya tempat nilai ini didefinisikan).
// Business Rule:
// Tarif Ketentuan Umum Pasal 17 ayat (1) huruf b UU PPh
const GENERAL_RATE     = 0.22;
// Business Rule:
// Tarif Fasilitas Pasal 17 ayat (2b) UU PPh
const FACILITY_17_RATE = 0.19;

const IncomeTaxCalculationSection = ({ sptData, updateSectionData, onTabTrigger, l8TotalIncomeTax, l8Eligible }) => {
    const fmt = (v) => new Intl.NumberFormat('id-ID').format(v || 0);
    const d = sptData.profit_loss;
    const point4    = d.fiscal_net_income_before_facility || 0;
    const point5amt = d.p5_investment_facility_amount     || 0;
    const point6amt = d.p6_vocational_deduction_amount    || 0;
    const point7    = point4 - point5amt - point6amt;
    const point8amt = d.p8_carried_forward_losses         || 0;
    // Point 9 dibaca dari sptData.profit_loss.p9_taxable_income (disinkron via
    // useEffect di komponen induk, Blueprint_L8.md FINAL §A.2) — bukan
    // dihitung ulang di sini, agar tidak ada dua tempat yang menghitung Point 9.
    const point9    = d.p9_taxable_income || 0;
    const point10amt = d.p10_rd_deduction_amount          || 0;
    const taxRate   = d.p11_tax_rate || '';
    const isOtherRate = taxRate === 'Tarif Pajak Lainnya';
    const is31E       = taxRate === 'Tarif Fasilitas Pasal 31E ayat (1)';
    const isGeneralRate  = taxRate === 'Tarif Ketentuan Umum Pasal 17 ayat (1) huruf b';
    const isFacility17b  = taxRate === 'Tarif Fasilitas Pasal 17 ayat (2b)';
    const customRate  = parseFloat(d.p11a_custom_tax_rate) || 0;
    // Point 12 dibaca dari sptData.profit_loss.p12_income_tax_in_year (disinkron
    // via useEffect di komponen induk) — bukan dihitung ulang di sini, pola
    // identik Point 9 (baris 750) di atas, agar SATU-SATUNYA tempat yang
    // menghitung formula Point 12 adalah useEffect tersebut (single source of
    // truth — tidak ada lagi dua implementasi formula yang bisa divergen).
    const point12 = d.p12_income_tax_in_year || 0;
    const handleChange = (field, value) => {
        updateSectionData('profit_loss', { [field]: value });
        if (onTabTrigger) onTabTrigger(field, value);
    };
    const InfoBlock = ({ text }) => (
        <div className="flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-800 text-sm">
            <Info className="h-4 w-4 text-cyan-500 flex-shrink-0" />
            <span>{text}</span>
        </div>
    );
    const ReadonlyAmount = ({ value }) => (
        <input type="text" value={fmt(value)} readOnly
            className="w-36 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-right" placeholder="0" />
    );
    return (
        <div className="p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">4. Fiscal Net Income before Tax Facility</label>
                <div className="flex flex-wrap items-center gap-3">
                    <ReadonlyAmount value={point4} />
                    <span className="text-xs text-gray-500">Auto-filled from Lampiran 1</span>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">5. Do you receive Investment Facility in the Form of Net Income Reduction? <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="p5_investment_facility" value={opt} checked={d.p5_investment_facility === opt}
                                onChange={() => handleChange('p5_investment_facility', opt)} className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    <ReadonlyAmount value={point5amt} />
                    {d.p5_investment_facility === 'Yes' && <InfoBlock text="Yes, fill out the Attachment 13-A" />}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">6. Do you receive a Gross Income Deduction Facility for Vocational Activities? <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="p6_vocational_deduction" value={opt} checked={d.p6_vocational_deduction === opt}
                                onChange={() => handleChange('p6_vocational_deduction', opt)} className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    <ReadonlyAmount value={point6amt} />
                    {d.p6_vocational_deduction === 'Yes' && <InfoBlock text="Yes, fill out the Attachment 13-B part B" />}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">7. Fiscal Net Income after Tax Facility</label>
                <div className="flex items-center gap-3">
                    <input type="text" value={fmt(point7)} readOnly className="w-52 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-semibold text-right" />
                    <span className="text-xs text-gray-500">Point 4 − Point 5 − Point 6</span>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">8. Do you have any carried forward of Losses? <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="p8_carried_losses" value={opt} checked={d.p8_carried_losses === opt}
                                onChange={() => handleChange('p8_carried_losses', opt)} className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    <ReadonlyAmount value={point8amt} />
                    {d.p8_carried_losses === 'Yes' && <InfoBlock text="Yes, fill out the Attachment 7 Part A" />}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">9. Taxable Income</label>
                <div className="flex items-center gap-3">
                    <input type="text" value={fmt(point9)} readOnly className="w-52 px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-gray-800 font-bold text-right" />
                    <span className="text-xs text-gray-500">Point 7 − Point 8</span>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">10. Do you receive a Gross Income Deduction Facility for Research and Development Activities? <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="p10_rd_deduction" value={opt} checked={d.p10_rd_deduction === opt}
                                onChange={() => handleChange('p10_rd_deduction', opt)} className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    <ReadonlyAmount value={point10amt} />
                    {d.p10_rd_deduction === 'Yes' && <InfoBlock text="Yes, fill out the Attachment 13-B part D" />}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">11. Tax Rate <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap items-center gap-4">
                    <select value={taxRate} onChange={(e) => handleChange('p11_tax_rate', e.target.value)}
                        className="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">— Pilih Tarif —</option>
                        <option value="Tarif Ketentuan Umum Pasal 17 ayat (1) huruf b">Tarif Ketentuan Umum sebagaimana Pasal 17 ayat (1) huruf b UU PPh</option>
                        <option value="Tarif Fasilitas Pasal 17 ayat (2b)">Tarif Fasilitas sebagaimana Pasal 17 ayat (2b) UU PPh</option>
                        <option value="Tarif Fasilitas Pasal 31E ayat (1)">Tarif Fasilitas sebagaimana Pasal 31E ayat (1) UU PPh</option>
                        <option value="Tarif Pajak Lainnya">Tarif Pajak Lainnya</option>
                    </select>
                    {is31E && <InfoBlock text="Yes, fill out the Attachment 8" />}
                    {isOtherRate && <InfoBlock text="Yes, fill out the field below" />}
                </div>
                {/*
                    Information Panel — UX transparansi tarif (murni informatif,
                    TIDAK memengaruhi point12/business rule). Berubah otomatis
                    mengikuti taxRate, style sama dengan panel informasi Lampiran 8
                    (bg-blue-50/border-blue-200). Tidak tampil sebelum user memilih
                    tarif apa pun (taxRate === '').
                */}
                {taxRate !== '' && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-xs text-gray-700 space-y-1">
                        <p className="font-semibold text-blue-800">ℹ Informasi Tarif Pajak</p>
                        {isGeneralRate && (
                            <>
                                <p>Tarif yang digunakan: <span className="font-semibold">{GENERAL_RATE * 100}%</span></p>
                                <p className="italic text-gray-500">Metode Perhitungan: PPh Terutang = {GENERAL_RATE * 100}% × Penghasilan Kena Pajak</p>
                                <p>Tarif ini digunakan untuk Wajib Pajak Badan yang menggunakan tarif umum sesuai Pasal 17 ayat (1) huruf b UU PPh.</p>
                            </>
                        )}
                        {isFacility17b && (
                            <>
                                <p>Tarif yang digunakan: <span className="font-semibold">{FACILITY_17_RATE * 100}%</span></p>
                                <p className="italic text-gray-500">Metode Perhitungan: PPh Terutang = {FACILITY_17_RATE * 100}% × Penghasilan Kena Pajak</p>
                                <p>Tarif ini digunakan bagi Perseroan Terbuka yang memenuhi persyaratan Pasal 17 ayat (2b).</p>
                            </>
                        )}
                        {is31E && (
                            <>
                                <p>Perhitungan menggunakan Lampiran 8. Metode Perhitungan mengikuti Pasal 31E.</p>
                                <p className="italic text-gray-500">Jika Peredaran Bruto ≤ Rp4.800.000.000: 50% × 25% × Seluruh Penghasilan Kena Pajak</p>
                                <p className="italic text-gray-500">Jika Peredaran Bruto &gt; Rp4.800.000.000 s.d. Rp50.000.000.000: (50% × 25% × PKP Fasilitas) + (25% × PKP Non Fasilitas)</p>
                                <p>Lampiran 8 akan digunakan sebagai dasar penghitungan PPh Terutang.</p>
                            </>
                        )}
                        {isOtherRate && (
                            <>
                                <p>Tarif yang digunakan: <span className="font-semibold">{customRate > 0 ? `${customRate}%` : 'Belum diisi'}</span></p>
                                <p className="italic text-gray-500">Metode Perhitungan: PPh Terutang = {customRate > 0 ? `${customRate}%` : 'Tarif User'} × Penghasilan Kena Pajak</p>
                                <p>Tarif mengikuti persentase yang dimasukkan oleh user pada Point 11a.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
            {isOtherRate && (
                <div className="pl-4 border-l-2 border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">11a. Custom Tax Rate (%) <span className="text-red-500">*</span></label>
                    <input type="number" min="0" max="100" step="0.01" value={d.p11a_custom_tax_rate || ''}
                        onChange={(e) => updateSectionData('profit_loss', { p11a_custom_tax_rate: e.target.value })}
                        placeholder="e.g. 22" className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-500">%</span>
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">12. Income Tax in a Year</label>
                <div className="flex items-center gap-3">
                    <input type="text" value={fmt(point12)} readOnly className="w-52 px-3 py-2 border border-red-200 rounded-lg bg-red-50 text-red-800 font-bold text-right" />
                    <span className="text-xs text-gray-500">
                        {isOtherRate
                            ? 'Point 11a × (Point 9 − Point 10)'
                            : is31E
                            ? 'Total Income Tax dari Attachment 8'
                            : isGeneralRate
                            ? `${GENERAL_RATE * 100}% × (Point 9 − Point 10)`
                            : isFacility17b
                            ? `${FACILITY_17_RATE * 100}% × (Point 9 − Point 10)`
                            : 'Tax rate × (Point 9 − Point 10)'}
                    </span>
                </div>
                {/*
                    Main Form Warning Rule (Blueprint_L8.md FINAL §3) — teks kecil
                    merah, BUKAN popup/dialog/snackbar. Ditampilkan di sini (MainForm),
                    BUKAN di L8.js, karena MENAMPILKAN warning adalah tanggung jawab
                    MainForm sebagai orchestrator — L8 hanya menghitung dan melaporkan
                    Eligibility Status via onEligibleChange, tidak pernah memutuskan
                    konsekuensi UI dari nilai tersebut (audit boundary L8 vs MainForm,
                    revisi terbaru).
                */}
                {is31E && !l8Eligible && (
                    <p className="text-xs text-red-600 mt-1">
                        Peredaran bruto melebihi Rp50.000.000.000 sehingga fasilitas tarif Pasal 31E tidak dapat digunakan. Perhitungan PPh Terutang menggunakan tarif normal.
                    </p>
                )}
            </div>
        </div>
    );
};

const IncomeTaxPayableCalculationSection = ({ sptData, updateSectionData, onTabTrigger }) => {
    const fmt = (v) => new Intl.NumberFormat('id-ID').format(v || 0);
    const e = sptData.tax_calculation;
    const q13  = e.q13_overseas_credit    || '';
    const q16  = e.q16_payable_deduction  || '';

    const handleChange = (field, value) => {
        updateSectionData('tax_calculation', { [field]: value });
        if (onTabTrigger) onTabTrigger(field, value);
    };

    const InfoBlock = ({ text }) => (
        <div className="flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-800 text-sm">
            <Info className="h-4 w-4 text-cyan-500 flex-shrink-0" />
            <span>{text}</span>
        </div>
    );

    const ReadonlyAmount = ({ value }) => (
        <input type="text" value={fmt(value)} readOnly
            className="w-36 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-right" placeholder="0" />
    );

    return (
        <div className="p-6 space-y-6">

            {/* Question 13 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    13. Do you have any income tax credit paid in overseas and/or withheld by other party?
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="q13_overseas_credit" value={opt}
                                checked={q13 === opt}
                                onChange={() => handleChange('q13_overseas_credit', opt)}
                                className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    <ReadonlyAmount value={e.q13_overseas_credit_amount || 0} />
                    {q13 === 'Yes' && <InfoBlock text="Yes, fill out the Attachment 3" />}
                </div>
            </div>

            {/* Point 14 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    14. Installment of Income Tax Article 25
                </label>
                <div className="flex flex-wrap items-center gap-3">
                    <ReadonlyAmount value={e.p14_installment_art25 || 0} />
                    <span className="text-xs text-gray-500">Auto-filled dari pembayaran PPh Pasal 25</span>
                </div>
            </div>

            {/* Point 15 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    15. Notice of Collection on Income Tax Article 25 (Principle only)
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <input type="text"
                    value={fmt(e.p15_notice_art25 || 0)}
                    onChange={(e_) => updateSectionData('tax_calculation', {
                        p15_notice_art25: parseFloat(e_.target.value.replace(/[.,]/g, '')) || 0
                    })}
                    className="w-52 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="0" />
            </div>

            {/* Question 16 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    16. Do you receive Income Tax Payable Deduction Facility?
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="q16_payable_deduction" value={opt}
                                checked={q16 === opt}
                                onChange={() => handleChange('q16_payable_deduction', opt)}
                                className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    <ReadonlyAmount value={e.q16_payable_deduction_amount || 0} />
                    {q16 === 'Yes' && <InfoBlock text="Yes, fill out the Attachment 13-C" />}
                </div>
            </div>

        </div>
    );
};


const UnderpaymentOverpaymentSection = ({ sptData, updateSectionData }) => {
    const fmt = (v) => new Intl.NumberFormat('id-ID').format(v || 0);
    const tc  = sptData.tax_calculation;
    const cr  = sptData.tax_credit;

    const point12  = sptData.profit_loss.p12_income_tax_in_year || 0;
    const point13  = tc.q13_overseas_credit_amount  || 0;
    const point14  = tc.p14_installment_art25        || 0;
    const point15  = tc.p15_notice_art25             || 0;
    const point16  = tc.q16_payable_deduction_amount || 0;

    const p17a = point12 - point13 - point14 - point15 - point16;
    const isOverpayment17a = p17a < 0;
    const p17bAmt = cr.p17b_postponement_amount || 0;
    const p17c = p17a - p17bAmt;
    const p18a = cr.p18a_previous_underpayment || 0;
    const p18b = p17a - p18a;
    const isOverpayment18b = p18b < 0;
    const showOverpaymentBlock = isOverpayment17a || isOverpayment18b;

    const InfoBlock = ({ text }) => (
        <div className="flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-800 text-sm">
            <Info className="h-4 w-4 text-cyan-500 flex-shrink-0" />
            <span>{text}</span>
        </div>
    );
    const ReadonlyAmount = ({ value, highlight }) => (
        <input type="text" value={fmt(value)} readOnly
            className={`w-52 px-3 py-2 border rounded-lg text-right font-semibold ${
                highlight === 'red'   ? 'border-red-200 bg-red-50 text-red-800' :
                highlight === 'green' ? 'border-green-200 bg-green-50 text-green-800' :
                'border-gray-300 bg-gray-100 text-gray-700'
            }`} />
    );

    const BANK_ACCOUNTS = [
        { id: '', label: '— Pilih Rekening —', no: '', bank: '', holder: '' },
        { id: 'BCA-001', label: 'BCA - **** 1234', no: '1234567890', bank: 'Bank Central Asia (BCA)', holder: '' },
        { id: 'BNI-001', label: 'BNI - **** 5678', no: '0987654321', bank: 'Bank Negara Indonesia (BNI)', holder: '' },
        { id: 'MANDIRI-001', label: 'Mandiri - **** 9012', no: '1122334455', bank: 'Bank Mandiri', holder: '' },
    ];
    const handleBankSelect = (accountId) => {
        const acc = BANK_ACCOUNTS.find(a => a.id === accountId) || BANK_ACCOUNTS[0];
        updateSectionData('tax_credit', {
            p19b_bank_account: accountId,
            p19b_account_no: acc.no,
            p19b_bank_name: acc.bank,
            p19b_account_holder: sptData.company_identity.company_name || acc.holder,
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* 17a */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">17a. Underpayment (Overpayment) Income Tax</label>
                <div className="flex flex-wrap items-center gap-3">
                    <ReadonlyAmount value={p17a} highlight={isOverpayment17a ? 'green' : p17a > 0 ? 'red' : 'default'} />
                    <span className="text-xs text-gray-500">Point 12 − 13 − 14 − 15 − 16</span>
                </div>
            </div>

            {/* 17b */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    17b. Do you have a Approval Letter of Postponement or Installment of Tax Payment?
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="p17b_has_postponement" value={opt}
                                checked={cr.p17b_has_postponement === opt}
                                onChange={() => updateSectionData('tax_credit', {
                                    p17b_has_postponement: opt,
                                    p17b_postponement_amount: opt === 'No' ? 0 : cr.p17b_postponement_amount
                                })}
                                className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    {cr.p17b_has_postponement === 'Yes' && (
                        <InfoBlock text="Yes, continue to the next question" />
                    )}
                    {cr.p17b_has_postponement === 'Yes' ? (
                        <input type="text"
                            value={fmt(p17bAmt)}
                            onChange={(e_) => updateSectionData('tax_credit', {
                                p17b_postponement_amount: parseFloat(e_.target.value.replace(/[.,]/g, '')) || 0
                            })}
                            className="w-52 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="0" />
                    ) : (
                        <input type="text" value="0" readOnly
                            className="w-52 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-right" />
                    )}
                </div>
            </div>

            {/* 17c */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">17c. Income Tax that must be paid</label>
                <div className="flex flex-wrap items-center gap-3">
                    <ReadonlyAmount value={p17c} highlight={p17c > 0 ? 'red' : p17c < 0 ? 'green' : 'default'} />
                    <span className="text-xs text-gray-500">17a − 17b</span>
                </div>
            </div>

            {/* Amendment */}
            <div className="border-t border-gray-200 pt-6 space-y-5">
                <p className="text-xs text-gray-500 italic">Bagian berikut diisi jika melakukan pembetulan SPT (Amendment)</p>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        18a. Underpayment (Overpayment) Income Tax in the amended (previous) tax return
                    </label>
                    <input type="text" value={fmt(p18a)}
                        onChange={(e_) => updateSectionData('tax_credit', {
                            p18a_previous_underpayment: parseFloat(e_.target.value.replace(/[.,]/g, '')) || 0
                        })}
                        className="w-52 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
                        placeholder="0" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">18b. Underpayment (Overpayment) Income Tax due to amendment</label>
                    <div className="flex flex-wrap items-center gap-3">
                        <ReadonlyAmount value={p18b} highlight={isOverpayment18b ? 'green' : p18b > 0 ? 'red' : 'default'} />
                        <span className="text-xs text-gray-500">17a − 18a</span>
                    </div>
                </div>
            </div>

            {/* Overpayment block */}
            {showOverpaymentBlock && (
                <div className="border border-green-200 rounded-lg bg-green-50 p-5 space-y-5">
                    <h4 className="font-semibold text-green-800">19. Overpayment Income Tax in (17a) or (18b) is requested for:</h4>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">19a. Refund Method <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap items-center gap-4">
                            {['Normal Refund', 'Fast Refund'].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="p19a_refund_method" value={opt}
                                        checked={cr.p19a_refund_method === opt}
                                        onChange={() => updateSectionData('tax_credit', { p19a_refund_method: opt })}
                                        className="accent-blue-600" />
                                    <span className="text-sm text-gray-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">19b. Information of Bank Account</label>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Select Bank Account</label>
                            <select value={cr.p19b_bank_account || ''}
                                onChange={(e_) => handleBankSelect(e_.target.value)}
                                className="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                {BANK_ACCOUNTS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">If bank account data needs to be updated, please update it through Portal - General Information - Edit - Bank Details.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Account No</label>
                                <input type="text" value={cr.p19b_account_no || ''} readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600" placeholder="—" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Bank Name</label>
                                <input type="text" value={cr.p19b_bank_name || ''} readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600" placeholder="—" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Name of Account Holder</label>
                                <input type="text" value={cr.p19b_account_holder || ''} readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600" placeholder="—" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const CurrentInstallmentCalculationSection = ({ sptData, updateSectionData, onTabTrigger }) => {
    const fmt = (v) => new Intl.NumberFormat('id-ID').format(v || 0);
    const tp  = sptData.tax_payable;
    const answer = tp.q20_art25_obliged || '';

    const handleChange = (value) => {
        updateSectionData('tax_payable', { q20_art25_obliged: value });
        if (onTabTrigger) onTabTrigger('q20_art25_obliged', value);
    };

    const InfoBlock = ({ text }) => (
        <div className="flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-800 text-sm">
            <Info className="h-4 w-4 text-cyan-500 flex-shrink-0" />
            <span>{text}</span>
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    20. Do you meet criteria that is obliged to submit Article 25 Periodic Tax Return?
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-4">
                    {['No', 'Yes'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="q20_art25_obliged" value={opt}
                                checked={answer === opt}
                                onChange={() => handleChange(opt)}
                                className="accent-blue-600" />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    <input type="text" value={fmt(tp.q20_art25_amount || 0)} readOnly
                        className="w-36 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-right"
                        placeholder="0" />
                    {answer === 'Yes' && (
                        <InfoBlock text="Yes, continue to the next question. Please make sure to submit the Article 25 Periodic Tax Return." />
                    )}
                    {answer === 'No' && (
                        <InfoBlock text="No, fill out the Attachment 6" />
                    )}
                </div>
            </div>
        </div>
    );
};


const StatementOfTransactionsSection = ({ sptData, updateSectionData, onTabTrigger }) => {
    const fmt = (v) => new Intl.NumberFormat('id-ID').format(v || 0);
    const tr  = sptData.transactions;

    const handleChange = (field, value) => {
        updateSectionData('transactions', { [field]: value });
        if (onTabTrigger) onTabTrigger(field, value);
    };

    const InfoBlock = ({ text }) => (
        <div className="flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-800 text-sm flex-shrink-0">
            <Info className="h-4 w-4 text-cyan-500 flex-shrink-0" />
            <span>{text}</span>
        </div>
    );

    const QuestionRow = ({ field, label, number, yesInfoText, children }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {number}. {label}
                <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-4">
                {['No', 'Yes'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={field} value={opt}
                            checked={tr[field] === opt}
                            onChange={() => handleChange(field, opt)}
                            className="accent-blue-600" />
                        <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                ))}
                {tr[field] === 'Yes' && yesInfoText && <InfoBlock text={yesInfoText} />}
                {children}
            </div>
        </div>
    );

    return (
        <div className="p-6 space-y-6">

            {/* 21A */}
            <QuestionRow field="q21a_related_party" number="21a"
                label="Do you have any transaction with related parties?"
                yesInfoText="Yes, fill out the Attachment 10-A, 10-B, 10-C" />

            {/* 21B */}
            <QuestionRow field="q21b_tp_document" number="21b"
                label="Do you have obligation to provide Transfer Pricing Document?"
                yesInfoText="Yes, fill out the Attachment 10-D" />

            {/* 21C */}
            <QuestionRow field="q21c_capital_investment" number="21c"
                label="Do you have any capital investment in affiliated companies?"
                yesInfoText="Yes, fill out the Attachment 2 part B" />

            {/* 21D */}
            <QuestionRow field="q21d_debt_receivable" number="21d"
                label="Do you have any Debt from Shareholders and/or Affiliated Companies and/or Receivables from Shareholders and/or Affiliated Companies?"
                yesInfoText="Yes, fill out the Attachment 2 part B" />

            {/* 21E */}
            <QuestionRow field="q21e_fiscal_depreciation" number="21e"
                label="Do you declare Fiscal Depreciation or Amortization Expense?"
                yesInfoText="Yes, fill out the Attachment 9" />

            {/* 21F */}
            <QuestionRow field="q21f_entertainment_expense" number="21f"
                label="Do you declare Entertainment Expense, Promotion Expense and Bad Debt Expense?"
                yesInfoText="Yes, fill out the Attachment 11-A" />

            {/* 21G */}
            <QuestionRow field="q21g_investment_facility" number="21g"
                label="Do you have Investment Tax facility in form of other than Net Income Deduction?"
                yesInfoText="Yes, fill out the Attachment 13-A" />

            {/* 21H */}
            <QuestionRow field="q21h_reinvestment" number="21h"
                label="Do you have the Remaining Excess which is reinvested in the form of facilities and infrastructure?"
                yesInfoText="Yes, fill out the Attachment 14" />

            {/* 21I */}
            <QuestionRow field="q21i_dividend_overseas" number="21i"
                label="Do you receive dividend income from overseas and declare it as income excluded from income tax?"
                yesInfoText="Yes, Please submit the report of realization of investment separately in Service business process" />

            {/* 21J — readonly amount field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    21j. The Excess of Final Income Tax Related to Income from Businesses that Have Certain Gross Income Which Can Be Refunded from Attachment 5
                </label>
                <div className="flex items-center gap-3">
                    <input type="text" value={fmt(tr.q21j_excess_final_tax || 0)} readOnly
                        className="w-52 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-right"
                        placeholder="0" />
                    <span className="text-xs text-gray-500">Auto-filled from Attachment 5</span>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION I — ADDITIONAL ATTACHMENTS
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_I_DOCS = [
    { code: 'FINANCIAL_STATEMENT',         label: 'Financial Statement / Audited Financial Statement',                        multi: false },
    { code: 'CONSOLIDATED_FS_GROUP',       label: 'Consolidated Financial Statement for Group Entity',                        multi: false },
    { code: 'AUDIT_OPINION',               label: 'Audit Opinion',                                                            multi: false },
    { code: 'CONSOLIDATED_FS_PE',          label: 'Consolidated Financial Statement for Permanent Establishment',             multi: false },
    { code: 'FOREIGN_TAX_CREDIT',          label: 'Foreign Tax Credit Withholding Evidence',                                  multi: false },
    { code: 'REINVESTMENT_EVIDENCE',       label: 'Reinvestment Type and Realization Evidence for Permanent Establishment',   multi: false },
    { code: 'FOREIGN_DIVIDEND_CALC',       label: 'Foreign Dividend Tax Credit Calculation Letter',                           multi: false },
    { code: 'FOREIGN_CFC_FS',              label: 'Foreign Controlled Non-listed Company Financial Statement',                multi: false },
    { code: 'FOREIGN_CFC_RETURN',          label: 'Foreign Controlled Non-listed Company Annual Tax Return Copy',             multi: false },
    { code: 'FOREIGN_CFC_PROFIT',          label: 'Foreign Controlled Non-listed Company Profit Calculation (Last 5 Years)',  multi: false },
    { code: 'FOREIGN_DIVIDEND_PAYMENT',    label: 'Foreign Dividend Income Tax Payment Evidence',                             multi: false },
    { code: 'ZAKAT_PAYMENT',               label: 'Zakat Payment Evidence',                                                   multi: false },
    { code: 'PUBLIC_CO_TAX_REDUCTION',     label: 'Public Company Tax Rate Reduction Report',                                 multi: false },
    { code: 'MONTHLY_REPORT',              label: 'Monthly Report',                                                           multi: false },
    { code: 'RELATED_PARTY_SHARE',         label: 'Related Party Share Ownership Report',                                     multi: false },
    { code: 'CBCR_RECEIPT',                label: 'Country-by-Country Report Electronic Receipt',                             multi: false },
    { code: 'OTHER_DOCUMENTS',             label: 'Other Documents',                                                          multi: true  },
];

const AttachmentsSection = () => {
    // Per-row selection state: { code -> { file, previewUrl, warning } }
    const [rowState, setRowState] = useState(() => {
        const init = {};
        SECTION_I_DOCS.forEach(d => { init[d.code] = { file: null, previewUrl: null, warning: '' }; });
        return init;
    });

    // Global uploaded files table: array of { id, code, label, originalName, generatedName, file, uploadDate }
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Success notice per code — persists while file is uploaded, clears on delete/replace/cancel
    const [successNotice, setSuccessNotice] = useState({});

    const showSuccess  = (code) => setSuccessNotice(prev => ({ ...prev, [code]: true  }));
    const clearSuccess = (code) => setSuccessNotice(prev => ({ ...prev, [code]: false }));

    // Modals
    const [previewModal, setPreviewModal]   = useState(null); // { url, name }
    const [deleteModal,  setDeleteModal]    = useState(null); // { id }
    const [replaceModal, setReplaceModal]   = useState(null); // { code, file, previewUrl }

    const generateName = (code) => `${code}_${Date.now()}.pdf`;

    const validatePdf = (file) => {
        if (!file) return false;
        const extOk  = file.name.toLowerCase().endsWith('.pdf');
        const mimeOk = file.type === 'application/pdf';
        return extOk && mimeOk;
    };

    // File chosen from picker
    const handleFileChosen = (code, file) => {
        if (!file) return;
        if (!validatePdf(file)) {
            setRowState(prev => ({ ...prev, [code]: { file: null, previewUrl: null, warning: 'Please upload PDF file only.' } }));
            return;
        }
        const url = URL.createObjectURL(file);
        setRowState(prev => ({ ...prev, [code]: { file, previewUrl: url, warning: '' } }));
    };

    // Upload button clicked
    const handleUpload = (docDef) => {
        const { code, multi } = docDef;
        const { file, previewUrl } = rowState[code];
        if (!file) return;

        if (!multi) {
            // Check if already uploaded
            const existing = uploadedFiles.find(f => f.code === code);
            if (existing) {
                setReplaceModal({ code, file, previewUrl, docDef });
                return;
            }
        }
        commitUpload(docDef, file, previewUrl);
    };

    const commitUpload = (docDef, file, previewUrl) => {
        const { code, label } = docDef;
        const generatedName = generateName(code);
        const newEntry = {
            id: `${code}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            code, label,
            originalName: file.name,
            generatedName,
            file,
            previewUrl,
            uploadDate: new Date().toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }),
        };
        setUploadedFiles(prev => {
            // For single-upload docs, remove old entry first
            if (!docDef.multi) {
                return [...prev.filter(f => f.code !== code), newEntry];
            }
            return [...prev, newEntry];
        });
        // Reset row
        setRowState(prev => ({ ...prev, [code]: { file: null, previewUrl: null, warning: '' } }));
        // Reset input
        const inp = document.getElementById(`sec_i_input_${code}`);
        if (inp) inp.value = '';
        // Show success notice (only for non-multi, or always — multi is fine too)
        showSuccess(code);
    };

    const handleCancel = (code) => {
        const { previewUrl } = rowState[code];
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setRowState(prev => ({ ...prev, [code]: { file: null, previewUrl: null, warning: '' } }));
        const inp = document.getElementById(`sec_i_input_${code}`);
        if (inp) inp.value = '';
    };

    const handleDeleteConfirm = () => {
        if (!deleteModal) return;
        const target = uploadedFiles.find(f => f.id === deleteModal.id);
        if (target) {
            // For non-multi docs: if no remaining entries for that code after delete, clear notice
            const remaining = uploadedFiles.filter(f => f.id !== deleteModal.id && f.code === target.code);
            if (remaining.length === 0) clearSuccess(target.code);
        }
        setUploadedFiles(prev => prev.filter(f => f.id !== deleteModal.id));
        setDeleteModal(null);
    };

    const handleReplaceConfirm = () => {
        if (!replaceModal) return;
        commitUpload(replaceModal.docDef, replaceModal.file, replaceModal.previewUrl);
        setReplaceModal(null);
    };

    const handleReplaceCancel = () => {
        if (!replaceModal) return;
        // Discard selected file
        handleCancel(replaceModal.code);
        setReplaceModal(null);
    };

    const openPreview = (url, name) => setPreviewModal({ url, name });

    return (
        <div className="p-6 space-y-6">
            <h3 className="text-base font-semibold text-gray-800">ADDITIONAL ATTACHMENTS</h3>

            {/* ── Upload Rows ── */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left font-medium text-gray-600 w-8">No</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Document Type</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600 w-56">Selected File</th>
                            <th className="px-4 py-3 text-center font-medium text-gray-600 w-52">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SECTION_I_DOCS.map((doc, idx) => {
                            const rs = rowState[doc.code];
                            const hasFile = !!rs.file;
                            // For single-upload docs: disable all buttons when a file is already uploaded
                            const isUploaded = !doc.multi && uploadedFiles.some(f => f.code === doc.code);
                            const chooseDisabled = isUploaded;
                            const uploadDisabled = !hasFile || isUploaded;
                            const cancelDisabled = !hasFile;
                            return (
                                <tr key={doc.code} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {doc.label}
                                        {doc.multi && <span className="ml-2 text-xs text-blue-600 font-medium">(Multiple)</span>}
                                        {rs.warning && (
                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                                                <Warning style={{ fontSize: 14 }} className="text-amber-500 flex-shrink-0" />
                                                {rs.warning}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {hasFile ? (
                                            <button
                                                onClick={() => openPreview(rs.previewUrl, rs.file.name)}
                                                className="text-blue-600 hover:text-blue-800 text-xs underline truncate max-w-[200px] block text-left"
                                                title={rs.file.name}
                                            >
                                                {rs.file.name}
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 justify-center">
                                                {/* Hidden file input */}
                                                <input
                                                    type="file"
                                                    id={`sec_i_input_${doc.code}`}
                                                    accept=".pdf,application/pdf"
                                                    className="hidden"
                                                    onChange={(e) => handleFileChosen(doc.code, e.target.files[0])}
                                                />
                                                {/* Choose */}
                                                <button
                                                    onClick={() => !chooseDisabled && document.getElementById(`sec_i_input_${doc.code}`).click()}
                                                    disabled={chooseDisabled}
                                                    className={`px-3 py-1.5 text-xs font-medium border rounded transition-colors ${chooseDisabled ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-blue-400 text-blue-600 hover:bg-blue-50'}`}
                                                >
                                                    Choose
                                                </button>
                                                {/* Upload */}
                                                <button
                                                    onClick={() => handleUpload(doc)}
                                                    disabled={uploadDisabled}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${!uploadDisabled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                                >
                                                    Upload
                                                </button>
                                                {/* Cancel */}
                                                <button
                                                    onClick={() => handleCancel(doc.code)}
                                                    disabled={cancelDisabled}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${!cancelDisabled ? 'border border-gray-400 text-gray-600 hover:bg-gray-100' : 'border border-gray-200 text-gray-300 cursor-not-allowed'}`}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                            {/* Success notice */}
                                            {successNotice[doc.code] && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded text-cyan-800 text-xs">
                                                    <Info style={{ fontSize: 14 }} className="text-cyan-500 flex-shrink-0" />
                                                    <span>File uploaded successfully.</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Uploaded Files Table ── */}
            {uploadedFiles.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Uploaded Files</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left font-medium text-gray-600 w-10">No</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Document Type</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">File Name</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600 w-44">Upload Date</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-600 w-32">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {uploadedFiles.map((f, idx) => (
                                    <tr key={f.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                                        <td className="px-4 py-3 text-gray-700">{f.label}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => openPreview(f.previewUrl, f.generatedName)}
                                                className="text-blue-600 hover:text-blue-800 underline text-xs text-left"
                                                title={f.generatedName}
                                            >
                                                {f.generatedName}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{f.uploadDate}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 justify-center">
                                                <button
                                                    onClick={() => openPreview(f.previewUrl, f.generatedName)}
                                                    className="px-3 py-1.5 text-xs font-medium border border-blue-400 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                                                >
                                                    Preview
                                                </button>
                                                <button
                                                    onClick={() => setDeleteModal({ id: f.id })}
                                                    className="px-3 py-1.5 text-xs font-medium border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── PDF Preview Modal ── */}
            {previewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: '80vw', maxWidth: 960, height: '85vh' }}>
                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
                            <span className="text-sm font-semibold text-gray-700 truncate max-w-lg" title={previewModal.name}>{previewModal.name}</span>
                            <button onClick={() => setPreviewModal(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold leading-none">×</button>
                        </div>
                        <div className="flex-1 p-2">
                            <iframe
                                src={previewModal.url}
                                title="PDF Preview"
                                className="w-full h-full rounded border border-gray-200"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirmation Modal ── */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Delete File</h4>
                        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this file?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteModal(null)}
                                className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Replace Confirmation Modal ── */}
            {replaceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Replace File</h4>
                        <p className="text-sm text-gray-600 mb-2">A file has already been uploaded for this document type.</p>
                        <p className="text-sm text-gray-600 mb-6">Uploading a new file will replace the existing file. Do you want to continue?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={handleReplaceCancel}
                                className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleReplaceConfirm}
                                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Replace File
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatementSection = ({ sptData, companyData, updateSectionData }) => {
    const [signerType, setSignerType] = useState('Taxpayer');

    // Auto-fill from companyData when Taxpayer selected
    const handleSignerTypeChange = (val) => {
        setSignerType(val);
        if (val === 'Taxpayer' && companyData) {
            updateSectionData('statement', {
                pic_name: companyData.pic_name || sptData.statement.pic_name,
                pic_nik:  companyData.notary_nik || sptData.statement.pic_nik,
                position: sptData.statement.position || 'Person in Charge',
            });
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Declaration checkbox */}
            <div className="border border-gray-200 rounded-lg p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={sptData.statement.declaration}
                        onChange={(e) => updateSectionData('statement', { declaration: e.target.checked })}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                        By being fully aware of all the consequences including sanctions in accordance with the applicable statutory provisions,
                        I declare that what I have told above along with its attachments is true, complete and clear.
                    </span>
                </label>
            </div>

            {/* Signer */}
            <div className="border border-gray-200 rounded-lg p-5 space-y-5">
                <h4 className="text-sm font-semibold text-gray-700">Signer <span className="text-red-500">*</span></h4>

                {/* Signer type radio */}
                <div>
                    <div className="flex gap-6">
                        {['Taxpayer', 'Representative'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="j_signer_type"
                                    value={opt}
                                    checked={signerType === opt}
                                    onChange={() => handleSignerTypeChange(opt)}
                                    className="accent-blue-600"
                                />
                                <span className="text-sm text-gray-700">{opt}</span>
                            </label>
                        ))}
                    </div>
                    {signerType === 'Taxpayer' && companyData && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-cyan-700 bg-cyan-50 border border-cyan-200 rounded px-3 py-1.5">
                            <Info style={{ fontSize: 14 }} className="text-cyan-500 flex-shrink-0" />
                            Fields auto-filled from company data. You may still edit them.
                        </div>
                    )}
                </div>

                {/* Signer fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">TIN / NIK</label>
                        <input
                            type="text"
                            value={sptData.statement.pic_nik}
                            onChange={(e) => updateSectionData('statement', { pic_nik: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="TIN or NIK"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                        <input
                            type="text"
                            value={sptData.statement.pic_name}
                            onChange={(e) => updateSectionData('statement', { pic_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Full name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Position</label>
                        <select
                            value={sptData.statement.position}
                            onChange={(e) => updateSectionData('statement', { position: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="Person in Charge">Person in Charge</option>
                            <option value="Director">Director</option>
                            <option value="President Director">President Director</option>
                            <option value="Commissioner">Commissioner</option>
                            <option value="Authorized Representative">Authorized Representative</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                        <input
                            type="date"
                            value={sptData.statement.date}
                            onChange={(e) => updateSectionData('statement', { date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Signature placeholder */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Signature</label>
                    <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        <span className="text-xs text-gray-400">Signature will be applied via Sign Document modal when submitting</span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                    <Warning className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
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
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS CONFIG — di luar component agar tidak direcreate setiap render
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS_CONFIG = [
    { id: 'header',           title: 'HEADER',          icon: Assignment    },
    { id: 'company_identity', title: 'A. TAXPAYER IDENTITY',        icon: Business      },
    { id: 'general_info',     title: 'B. INFORMATION OF FINANCIAL STATEMENT', icon: Info },
    { id: 'balance_sheet',    title: 'C. INCOME THAT IS SUBJECT TO FINAL TAX AND/OR EXCLUDE FROM INCOME TAX',    icon: AccountBalance},
    { id: 'profit_loss',      title: 'D. INCOME TAX CALCULATION',  icon: Calculate     },
    { id: 'tax_calculation',  title: 'E. INCOME TAX PAYABLE CALCULATION', icon: CreditCard    },
    { id: 'tax_credit',       title: 'F. UNDERPAYMENT (OVERPAYMENT) INCOME TAX',    icon: Refresh       },
    { id: 'tax_payable',      title: 'G. CURRENT INCOME TAX INSTALLMENT CALCULATION',  icon: AccountBalance},
    { id: 'transactions',      title: 'H. STATEMENT OF TRANSACTIONS',  icon: CheckBox    },
    { id: 'attachments',       title: 'I. ADDITIONAL ATTACHMENTS',  icon: CheckBox    },
    { id: 'statement',        title: 'J. DECLARATION',    icon: AttachFile      }
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FORM COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const SptTahunanBadanForm = ({ onBusinessClassificationChange, businessClassification, onTabTrigger, sectionDDisabled, onResetSectionD, onSptDataChange, a10Value, l1aRowsA, l1aRowsB, setL1aRowsFromDraft, l1cRowsA, l1cRowsBAset, l1cRowsBLiabEkuitas, setL1cRowsFromDraft, l1dRowsA, l1dRowsBAset, l1dRowsBLiabEkuitas, setL1dRowsFromDraft, l2RowsA, l2RowsB, setL2RowsFromDraft, l3RowsA, l3RowsB, l3PriorYearCreditRefund, setL3RowsFromDraft, l3CreditAmount, l4RowsA, l4RowsB, setL4RowsFromDraft, l5Rows, l5Places, setL5RowsFromDraft, setL5PlacesFromDraft,
    l7Rows, l7TotalCol8ForD8, l7TotalCol9ForL6, setL7RowsFromDraft, setL7TotalCol8FromDraft, setL7TotalCol9FromDraft,
    l6Installment,
    l8GrossTurnover, l8TotalIncomeTax, l8Eligible, setL8GrossTurnoverFromDraft, setL8CacheFromDraft,
    l9Data, setL9DataFromDraft,
    l10aRows, setL10aRowsFromDraft,
    l10bData, setL10bDataFromDraft,
    l10cRows, setL10cRowsFromDraft,
    l10dData, setL10dDataFromDraft,
    l13aRows, setL13aRowsFromDraft,
    l13aTotalNetIncomeDeduction,
    l13bData, setL13bDataFromDraft,
    l13bSectionBTotal, l13bSectionDRow5,
    l13cRows, setL13cRowsFromDraft,
    l13cTotalTaxReductionFacility,
    l14Rows, setL14RowsFromDraft,
    l11aData, setL11aDataFromDraft,
    l11bData, setL11bDataFromDraft,
    l11cData, setL11cDataFromDraft,
    onCompanyDataChange }) => {
    const dispatch = useDispatch();

    // ── L4 Derived Totals (CR2/CR3) ──────────────────────────────────────────
    // l4TotalTaxBase dan l4TotalGrossIncome adalah DERIVED VALUE — dihitung ulang
    // setiap kali l4RowsA/l4RowsB berubah (onRowsAChange/onRowsBChange dari L4.js).
    // Nilai ini diteruskan ke FinalTaxIncomeSection sebagai read-only display.
    // TIDAK disimpan ke state baru — tidak ada state tambahan di sini.
    // TIDAK ada callback balik dari FinalTaxIncomeSection → tidak ada circular update.
    // Realtime (CR4): L4.js edit → onRowsAChange → SptTahunanBadan setL4RowsA →
    //   prop l4RowsA berubah → useMemo recalculate → re-render FinalTaxIncomeSection.
    // parse lokal — tidak import shared util (pola self-contained project ini).
    const parseL4 = (v) => parseFloat(String(v).replace(/\./g, '').replace(/,/g, '')) || 0;
    // TODO: Konfirmasi aturan pembulatan DJP untuk finalTaxPayable (identik komentar di L4.js).
    const l4TotalTaxBase = useMemo(() =>
        (Array.isArray(l4RowsA) ? l4RowsA : []).reduce((acc, r) => acc + parseL4(r.taxBase), 0)
    , [l4RowsA]); // eslint-disable-line react-hooks/exhaustive-deps
    const l4TotalGrossIncome = useMemo(() =>
        (Array.isArray(l4RowsB) ? l4RowsB : []).reduce((acc, r) => acc + parseL4(r.grossIncome), 0)
    , [l4RowsB]); // eslint-disable-line react-hooks/exhaustive-deps

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sptId, setSptId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [expandedSections, setExpandedSections] = useState({ header: true });
    const [companyData, setCompanyData] = useState(null);
    const [autoFillAttempted, setAutoFillAttempted] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // ── Section J / Submit flow state ────────────────────────────────────────
    const [draftSaved,         setDraftSaved]         = useState(false);   // Pay&Submit unlocked after first Save Draft
    const [signDocModal,       setSignDocModal]       = useState(false);   // Sign Document modal
    const [signForm,           setSignForm]           = useState({ signingType: 'Tax Payer Signature', signerProvider: 'KO DJP', signerId: '', signerPassword: '' });
    const [taxDepositModal,    setTaxDepositModal]    = useState(false);   // "Pilih Tax Deposit" modal (Kurang Bayar)
    const [paymentMethodModal, setPaymentMethodModal] = useState(false);   // Choose Payment Method modal
    const [waitingPayment,     setWaitingPayment]     = useState(false);   // Waiting for payment state

    const safeParse = (value) => {
        if (!value) return {};
        if (typeof value === 'string') {
            try { return JSON.parse(value); } catch { return {}; }
        }
        return value;
    };

    const [sptData, setSptData] = useState({
        header: {
            tax_year: new Date().getFullYear() - 1,
            tax_return_status: 'NORMAL',
            currency: 'IDR',
            bookkeeping_method: 'Full Bookkeeping',
            reporting_period_start: '01 January',
            reporting_period_end: '31 December',
            submission_type: 'Electronic'
        },
        company_identity: {
            company_name: '', npwp: '', company_type: '', establishment_date: '',
            pic_name: '', pic_nik: '', email: '', phone: '', address: '',
            business_activity: '', basic_capital: ''
        },
        general_info: {
            business_status: 'Normal Operations', tax_facility: 'General Rate',
            bookkeeping_standard: 'Full Bookkeeping', reporting_currency: 'IDR',
            financial_year_start: '01 January', financial_year_end: '31 December',
            business_classification: '', is_audited: '',
            audit_opinion: '', kap_npwp: '', kap_name: ''
        },
        balance_sheet: {
            q1_gr23: '', q1b_solely_gr23: '', q2_final_tax: '', q3_excluded_tax: '',
            assets: {
                current_assets: {
                    cash_and_cash_equivalents: 0, trade_receivables: 0, inventory: 0,
                    prepaid_expenses: 0, other_current_assets: 0, total_current_assets: 0
                },
                non_current_assets: {
                    fixed_assets: 0, accumulated_depreciation: 0, net_fixed_assets: 0,
                    intangible_assets: 0, investment: 0, other_non_current_assets: 0,
                    total_non_current_assets: 0
                },
                total_assets: 0
            },
            liabilities: {
                current_liabilities: {
                    trade_payables: 0, short_term_debt: 0, accrued_expenses: 0,
                    tax_payable: 0, other_current_liabilities: 0, total_current_liabilities: 0
                },
                non_current_liabilities: {
                    long_term_debt: 0, deferred_tax_liability: 0,
                    other_non_current_liabilities: 0, total_non_current_liabilities: 0
                },
                total_liabilities: 0
            },
            equity: {
                paid_up_capital: 0, retained_earnings: 0, current_year_profit: 0,
                other_equity: 0, total_equity: 0
            }
        },
        profit_loss: {
            revenue: { gross_revenue: 0, sales_returns: 0, sales_discount: 0, net_revenue: 0 },
            cost_of_goods_sold: {
                beginning_inventory: 0, purchases: 0, direct_labor: 0,
                factory_overhead: 0, ending_inventory: 0, total_cogs: 0
            },
            gross_profit: 0,
            operating_expenses: {
                selling_expenses: 0, administrative_expenses: 0,
                general_expenses: 0, total_operating_expenses: 0
            },
            operating_profit: 0,
            other_income_expenses: {
                interest_income: 0, dividend_income: 0, other_income: 0,
                interest_expense: 0, other_expenses: 0, total_other_income: 0
            },
            profit_before_tax: 0, tax_expense: 0, net_profit: 0,
            fiscal_net_income_before_facility: 0,
            p5_investment_facility: '', p5_investment_facility_amount: 0,
            p6_vocational_deduction: '', p6_vocational_deduction_amount: 0,
            p8_carried_losses: '',     p8_carried_forward_losses: 0,
            p9_taxable_income: 0,
            p10_rd_deduction: '',      p10_rd_deduction_amount: 0,
            p11_tax_rate: '',          p11a_custom_tax_rate: '',
            p12_income_tax_in_year: 0
        },
        tax_calculation: {
            commercial_profit: 0,
            fiscal_adjustments: { positive_corrections: 0, negative_corrections: 0, total_adjustments: 0 },
            fiscal_profit: 0, loss_compensation: 0, taxable_income: 0,
            tax_rate: 25, income_tax_payable: 0,
            // Section E — Income Tax Payable Calculation
            q13_overseas_credit: '', q13_overseas_credit_amount: 0,
            p14_installment_art25: 0,
            p15_notice_art25: 0,
            q16_payable_deduction: '', q16_payable_deduction_amount: 0
        },
        tax_credit: {
            withholding_tax_article_23: 0, withholding_tax_article_22: 0,
            withholding_tax_article_26: 0, installment_article_25: 0,
            overpayment_previous_year: 0, foreign_tax_credit: 0, total_tax_credit: 0,
            p17b_has_postponement: '', p17b_postponement_amount: 0,
            p18a_previous_underpayment: 0,
            p19a_refund_method: '',
            p19b_bank_account: '', p19b_account_no: '', p19b_bank_name: '', p19b_account_holder: ''
        },
        tax_payable: {
            income_tax_payable: 0, total_tax_credit: 0,
            tax_underpayment: 0, tax_overpayment: 0, final_status: 'Nihil',
            q20_art25_obliged: '', q20_art25_amount: 0
        },
        attachments: {
            financial_statements: { required: true, file: null },
            audit_report: { required: false, file: null },
            tax_withholding_certificates: { required: false, file: null },
            related_party_transactions: { required: false, file: null },
            transfer_pricing_documentation: { required: false, file: null },
            other_documents: { required: false, file: null }
        },
        transactions: {
            q21a_related_party: '', q21b_tp_document: '',
            q21c_capital_investment: '', q21d_debt_receivable: '',
            q21e_fiscal_depreciation: '', q21f_entertainment_expense: '',
            q21g_investment_facility: '', q21h_reinvestment: '',
            q21i_dividend_overseas: '', q21j_excess_final_tax: 0
        },
        statement: {
            declaration: false, signature: '', company_name: '', pic_name: '',
            pic_nik: '', position: 'Person in Charge', date: '', stamp: ''
        }
    });

    useEffect(() => {
        dispatch(setSptType('company'));
        fetchCompanyData();
        const urlParams = new URLSearchParams(window.location.search);
        const existingSptId = urlParams.get('sptId');
        if (existingSptId) {
            setSptId(existingSptId);
            fetchSptData(existingSptId);
        }
    }, []);

    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => setSuccess(''), 3000);
        return () => clearTimeout(timer);
    }, [success]);

    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(''), 4000);
        return () => clearTimeout(timer);
    }, [error]);

    // Propagate sptData upward so SptTahunanBadan can derive tab visibility
    useEffect(() => {
        if (onSptDataChange) onSptDataChange(sptData);
    }, [sptData, onSptDataChange]); // onSptDataChange stabil via useCallback di parent

    // Sync A.10 dari L1A → D.4 (fiscal_net_income_before_facility) — readonly, single source of truth
    useEffect(() => {
        const val = parseFloat(a10Value) || 0;
        setSptData(prev => ({
            ...prev,
            profit_loss: { ...prev.profit_loss, fiscal_net_income_before_facility: val }
        }));
    }, [a10Value]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync Total Kolom (8) dari L7 → D.8 (p8_carried_forward_losses) — readonly,
    // pola identik sync A.10 → D.4 di atas (Implementation Contract L7 §1: MainForm
    // murni Consumer, tidak menghitung ulang, tidak pernah mengubah nilai L7).
    // l7TotalCol8ForD8 adalah CACHED DERIVED VALUE (Blueprint Revisi "Cached Derived
    // Values") — dihitung di L7.js, ikut dipersist di SptTahunanBadan.js untuk restore
    // cepat, namun MainForm hanya membaca nilainya, tidak pernah menghitung ulang.
    // DI-GATE oleh jawaban p8_carried_losses (pola identik gating l3CreditAmount
    // di bawah) — saat 'No', Lampiran 7 tidak lagi berlaku sebagai source data,
    // sehingga Point 8 DIPAKSA 0 walaupun l7TotalCol8ForD8 mungkin masih menyimpan
    // nilai lama (tab L7 unmount, tapi l7Rows/l7TotalCol8ForD8 tetap tersimpan di
    // state SptTahunanBadan.js — sengaja tidak direset, lihat Kasus 5 Save Draft).
    useEffect(() => {
        const isCarriedLossesYes = sptData.profit_loss?.p8_carried_losses === 'Yes';
        const val = isCarriedLossesYes ? (parseFloat(l7TotalCol8ForD8) || 0) : 0;
        setSptData(prev => ({
            ...prev,
            profit_loss: { ...prev.profit_loss, p8_carried_forward_losses: val }
        }));
    }, [l7TotalCol8ForD8, sptData.profit_loss?.p8_carried_losses]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync Angka 7 (Following Fiscal Year Installment) dari L6 → G.20
    // (q20_art25_amount) — readonly, pola identik sync L7 → D.8 di atas.
    // l6Installment adalah CACHED DERIVED VALUE (dihitung di L6.js, di-cache di
    // SptTahunanBadan.js), MainForm hanya membaca. DI-GATE oleh jawaban
    // q20_art25_obliged: L6 hanya berlaku saat 'No' (Kasus 2) — saat 'Yes',
    // Point 20 amount DIPAKSA 0 walaupun l6Installment mungkin masih menyimpan
    // nilai lama (tab L6 unmount, tapi l6Installment tetap tersimpan di state
    // SptTahunanBadan.js — sengaja tidak direset, sama seperti l7TotalCol8ForD8).
    useEffect(() => {
        const isArt25NotObliged = sptData.tax_payable?.q20_art25_obliged === 'No';
        const val = isArt25NotObliged ? (parseFloat(l6Installment) || 0) : 0;
        setSptData(prev => ({
            ...prev,
            tax_payable: { ...prev.tax_payable, q20_art25_amount: val }
        }));
    }, [l6Installment, sptData.tax_payable?.q20_art25_obliged]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync l3CreditAmount → E.13 (q13_overseas_credit_amount) — readonly, pola identik
    // sync A.10 di atas. l3CreditAmount BUKAN source of truth — ia mirror dari hasil
    // hitungL3().partB.c yang dihitung sepenuhnya di L3.js (Blueprint L3 Final §1).
    //
    // DIGERBANG oleh jawaban Question 13 (Blueprint L3 Final §5 — Business Rule
    // Yes/No): saat 'No', E.13 DIPAKSA menjadi 0 walaupun L3.js mungkin masih
    // mengirim l3CreditAmount > 0 dari data lama yang sengaja dipertahankan (tab
    // L3 unmount, tapi rowsA/rowsB/priorYearCreditRefund tetap tersimpan di state
    // SptTahunanBadan.js). Saat kembali 'Yes', L3.js remount → hitungL3() jalan
    // ulang → l3CreditAmount ter-update → effect ini otomatis memakainya kembali.
    useEffect(() => {
        const isOverseasCreditYes = sptData.tax_calculation?.q13_overseas_credit === 'Yes';
        const val = isOverseasCreditYes ? (parseFloat(l3CreditAmount) || 0) : 0;
        setSptData(prev => ({
            ...prev,
            tax_calculation: { ...prev.tax_calculation, q13_overseas_credit_amount: val }
        }));
    }, [l3CreditAmount, sptData.tax_calculation?.q13_overseas_credit]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync Total Net Income Deduction Facility (L13A) → D.5 (p5_investment_facility_amount)
    // — readonly, pola identik sync l3CreditAmount → E.13 di atas.
    // l13aTotalNetIncomeDeduction adalah CACHED DERIVED VALUE (Σ netIncomeDeductionAmount,
    // dihitung sepenuhnya di L13A.js, MainForm hanya membaca). DI-GATE oleh jawaban
    // Question 5 (p5_investment_facility): saat 'No', Point 5 amount DIPAKSA 0
    // walaupun l13aTotalNetIncomeDeduction mungkin masih menyimpan nilai lama (tab
    // L13A unmount, tapi l13aRows/totalnya tetap tersimpan di state
    // SptTahunanBadan.js — sengaja tidak direset, pola identik l3CreditAmount).
    // Data Lampiran 13-A TIDAK PERNAH dihapus hanya karena jawaban ini 'No'.
    useEffect(() => {
        const isNetIncomeDeductionYes = sptData.profit_loss?.p5_investment_facility === 'Yes';
        const val = isNetIncomeDeductionYes ? (parseFloat(l13aTotalNetIncomeDeduction) || 0) : 0;
        setSptData(prev => ({
            ...prev,
            profit_loss: { ...prev.profit_loss, p5_investment_facility_amount: val }
        }));
    }, [l13aTotalNetIncomeDeduction, sptData.profit_loss?.p5_investment_facility]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync Section B Total / Cost Recapitulation (L13B) → D.6 (p6_vocational_deduction_amount)
    // — readonly, pola identik sync di atas. DI-GATE oleh jawaban Question 6
    // (p6_vocational_deduction). Data Lampiran 13-B TIDAK PERNAH dihapus hanya
    // karena jawaban ini 'No'.
    useEffect(() => {
        const isVocationalYes = sptData.profit_loss?.p6_vocational_deduction === 'Yes';
        const val = isVocationalYes ? (parseFloat(l13bSectionBTotal) || 0) : 0;
        setSptData(prev => ({
            ...prev,
            profit_loss: { ...prev.profit_loss, p6_vocational_deduction_amount: val }
        }));
    }, [l13bSectionBTotal, sptData.profit_loss?.p6_vocational_deduction]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync Section D Row No.5 (L13B, BUKAN Row No.6) → D.10 (p10_rd_deduction_amount)
    // — readonly, pola identik sync di atas. DI-GATE oleh jawaban Question 10
    // (p10_rd_deduction). Data Lampiran 13-B TIDAK PERNAH dihapus hanya karena
    // jawaban ini 'No'.
    useEffect(() => {
        const isRdDeductionYes = sptData.profit_loss?.p10_rd_deduction === 'Yes';
        const val = isRdDeductionYes ? (parseFloat(l13bSectionDRow5) || 0) : 0;
        setSptData(prev => ({
            ...prev,
            profit_loss: { ...prev.profit_loss, p10_rd_deduction_amount: val }
        }));
    }, [l13bSectionDRow5, sptData.profit_loss?.p10_rd_deduction]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync Total Tax Reduction Facility (L13C) → E.16 (q16_payable_deduction_amount)
    // — readonly, pola identik sync L13A/L13B di atas. l13cTotalTaxReductionFacility
    // adalah CACHED DERIVED VALUE (Σ Tax Reduction Facility, dihitung sepenuhnya
    // di L13C.js, MainForm hanya membaca). DI-GATE oleh jawaban Question 16
    // (q16_payable_deduction): saat 'No', Point 16 amount DIPAKSA 0 walaupun
    // l13cTotalTaxReductionFacility mungkin masih menyimpan nilai lama (tab L13C
    // unmount, tapi l13cRows/totalnya tetap tersimpan di state SptTahunanBadan.js
    // — sengaja tidak direset, pola identik l3CreditAmount). Saat jawaban
    // dikembalikan ke 'Yes', L13C.js remount → total dihitung ulang → effect ini
    // otomatis mengirim ulang nilainya — user TIDAK PERLU mengisi ulang data.
    // Data Lampiran 13-C TIDAK PERNAH dihapus hanya karena jawaban ini 'No'.
    useEffect(() => {
        const isPayableDeductionYes = sptData.tax_calculation?.q16_payable_deduction === 'Yes';
        const val = isPayableDeductionYes ? (parseFloat(l13cTotalTaxReductionFacility) || 0) : 0;
        setSptData(prev => ({
            ...prev,
            tax_calculation: { ...prev.tax_calculation, q16_payable_deduction_amount: val }
        }));
    }, [l13cTotalTaxReductionFacility, sptData.tax_calculation?.q16_payable_deduction]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync Point 9 (Taxable Income / Penghasilan Kena Pajak) → p9_taxable_income
    // — readonly, CACHED DERIVED VALUE (Blueprint_L8.md FINAL §A.2). Point 9
    // sebelumnya HANYA variabel lokal render di IncomeTaxCalculationSection
    // (Point 7 − Point 8), tidak pernah dipersist ke sptData. Field ini
    // ditambahkan semata agar PKP bisa mengalir ke Lampiran L8 (sibling di
    // SptTahunanBadan.js) melalui jalur onSptDataChange yang SUDAH ADA — bukan
    // callback baru. Formula berikut WAJIB identik dengan point7/point9 di
    // IncomeTaxCalculationSection; jika salah satu berubah, keduanya wajib
    // diperbarui bersamaan (Blueprint_L8.md FINAL §A.2, risiko didokumentasikan
    // di ImplementationContract_L8.md §16b).
    useEffect(() => {
        const pl = sptData.profit_loss;
        const point4    = pl.fiscal_net_income_before_facility || 0;
        const point5amt = pl.p5_investment_facility_amount     || 0;
        const point6amt = pl.p6_vocational_deduction_amount    || 0;
        const point7    = point4 - point5amt - point6amt;
        const point8amt = pl.p8_carried_forward_losses         || 0;
        const point9    = point7 - point8amt;
        setSptData(prev => ({
            ...prev,
            profit_loss: { ...prev.profit_loss, p9_taxable_income: point9 }
        }));
    }, [
        sptData.profit_loss.fiscal_net_income_before_facility,
        sptData.profit_loss.p5_investment_facility_amount,
        sptData.profit_loss.p6_vocational_deduction_amount,
        sptData.profit_loss.p8_carried_forward_losses,
    ]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync Point 12 (Income Tax in a Year / D.12) → p12_income_tax_in_year —
    // SINGLE SOURCE OF TRUTH: ini SATU-SATUNYA tempat formula Point 12 dihitung
    // (IncomeTaxCalculationSection hanya membaca hasilnya, lihat baris ~758).
    // Formula WAJIB identik dengan business rule Section D.11 (4 cabang Tax
    // Rate): General (GENERAL_RATE) & Facility 17(2b) (FACILITY_17_RATE) —
    // konstanta yang sama dengan yang dipakai Information Panel — Tarif
    // Lainnya (customRate), dan Pasal 31E (hasil dari L8, di-gate Eligibility
    // Status, pola gating identik sinkron l3CreditAmount di atas).
    //
    // DATABASE READINESS — CATATAN UNTUK INTEGRASI BACKEND NANTI:
    // p12_income_tax_in_year adalah DERIVED VALUE, BUKAN raw input. Nilai ini
    // dihitung di frontend murni untuk kebutuhan tampilan (UX), dari raw input
    // (p9_taxable_income, p10_rd_deduction_amount, p11_tax_rate,
    // p11a_custom_tax_rate, serta l8TotalIncomeTax/l8Eligible dari Lampiran 8).
    // Saat backend diimplementasikan, server WAJIB menghitung ulang Point 12
    // dari raw input di atas menggunakan business rule yang sama — server
    // TIDAK BOLEH mempercayai nilai p12_income_tax_in_year yang dikirim dari
    // frontend sebagai sumber kebenaran (raw input sajalah yang menjadi Source
    // of Truth untuk persistensi; pola ini identik dengan seluruh derived value
    // lain di Main Form, lihat juga Point 9 di atas).
    useEffect(() => {
        const pl = sptData.profit_loss;
        const point9     = pl.p9_taxable_income || 0;
        const point10amt = pl.p10_rd_deduction_amount || 0;
        const taxRate    = pl.p11_tax_rate || '';
        const isOtherRate    = taxRate === 'Tarif Pajak Lainnya';
        const is31E          = taxRate === 'Tarif Fasilitas Pasal 31E ayat (1)';
        const isGeneralRate  = taxRate === 'Tarif Ketentuan Umum Pasal 17 ayat (1) huruf b';
        const isFacility17b  = taxRate === 'Tarif Fasilitas Pasal 17 ayat (2b)';
        const customRate  = parseFloat(pl.p11a_custom_tax_rate) || 0;

        let point12 = 0;
        if (isOtherRate) {
            point12 = (customRate / 100) * (point9 - point10amt);
        } else if (isGeneralRate) {
            point12 = GENERAL_RATE * (point9 - point10amt);
        } else if (isFacility17b) {
            point12 = FACILITY_17_RATE * (point9 - point10amt);
        } else if (is31E && l8Eligible) {
            point12 = parseFloat(l8TotalIncomeTax) || 0;
        }
        // else: Mode 2 (Pasal 31E) Not Eligible → tetap 0 (fallback ke tarif
        // normal BELUM diimplementasikan — gap pre-existing, di luar scope
        // permintaan ini; lihat warning di Section D.12).

        setSptData(prev => ({
            ...prev,
            profit_loss: { ...prev.profit_loss, p12_income_tax_in_year: point12 }
        }));
    }, [
        sptData.profit_loss.p9_taxable_income,
        sptData.profit_loss.p10_rd_deduction_amount,
        sptData.profit_loss.p11_tax_rate,
        sptData.profit_loss.p11a_custom_tax_rate,
        l8TotalIncomeTax,
        l8Eligible,
    ]); // eslint-disable-line react-hooks/exhaustive-deps

    const getAuthHeaders = () => {
        const token = localStorage.getItem('xtoken') || sessionStorage.getItem('xtoken');
        return { 'Authorization': `Bearer ${token}` };
    };

    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API.HOST}/api/v2/company/profile`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
            });
            const result = await response.json();
            if (result.success && result.data) {
                setCompanyData(result.data);
                // Emit full company profile ke SptTahunanBadan agar buildInitialL5Places()
                // dapat membaca taxpayer.addresses tanpa fetch baru.
                if (onCompanyDataChange) onCompanyDataChange(result.data);
                setAutoFillAttempted(true);
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
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
            });
            const result = await response.json();
            if (result.success && result.data) {
                const sptDetail = result.data;
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
                        { ...prev.company_identity, ...safeParse(sptDetail.taxpayer_identity) } : prev.company_identity,
                    general_info: sptDetail.income_summary ?
                        { ...prev.general_info, ...safeParse(sptDetail.income_summary) } : prev.general_info,
                    balance_sheet: sptDetail.income_tax_calculation ?
                        { ...prev.balance_sheet, ...safeParse(sptDetail.income_tax_calculation) } : prev.balance_sheet,
                    profit_loss: sptDetail.income_tax_credit ?
                        { ...prev.profit_loss, ...safeParse(sptDetail.income_tax_credit) } : prev.profit_loss,
                    tax_calculation: sptDetail.underpayment_overpayment ?
                        { ...prev.tax_calculation, ...safeParse(sptDetail.underpayment_overpayment) } : prev.tax_calculation,
                    tax_credit: sptDetail.amendment_tax_return ?
                        { ...prev.tax_credit, ...safeParse(sptDetail.amendment_tax_return) } : prev.tax_credit,
                    tax_payable: sptDetail.refund_data ?
                        { ...prev.tax_payable, ...safeParse(sptDetail.refund_data) } : prev.tax_payable,
                    attachments: sptDetail.additional_attachments ?
                        { ...prev.attachments, ...safeParse(sptDetail.additional_attachments) } : prev.attachments,
                    transactions: sptDetail.transactions_data ?
                        { ...prev.transactions, ...safeParse(sptDetail.transactions_data) } : prev.transactions,
                    statement: sptDetail.statement_data ?
                        { ...prev.statement, ...safeParse(sptDetail.statement_data) } : prev.statement
                }));
                // Restore Section H (Statement of Transactions) dari localStorage
                // (sementara — sebelum persist ke backend, pola identik L1A di bawah).
                // Backend 'transactions_data' selalu undefined saat ini (belum
                // didukung), sehingga baris transactions di setSptData() di atas
                // selalu jatuh ke prev.transactions — localStorage ini yang benar-benar
                // merestore jawaban Section H (Kasus 3).
                if (sptDetail.id) {
                    try {
                        const rawH = localStorage.getItem(`spt_transactions_${sptDetail.id}`);
                        if (rawH) {
                            const parsedH = JSON.parse(rawH);
                            if (parsedH && typeof parsedH === 'object') {
                                setSptData(prev => ({
                                    ...prev,
                                    transactions: { ...prev.transactions, ...parsedH }
                                }));
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal merestore Section H dari localStorage:', e);
                    }
                }
                // Restore data L1A dari localStorage (sementara — sebelum persist ke backend).
                // Key berbasis sptDetail.id agar tidak tercampur antar SPT.
                if (typeof setL1aRowsFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawA = localStorage.getItem(`spt_l1a_rows_a_${sptDetail.id}`);
                        if (rawA) {
                            const parsed = JSON.parse(rawA);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL1aRowsFromDraft('A', parsed.rows);
                            }
                        }
                        const rawB = localStorage.getItem(`spt_l1a_rows_b_${sptDetail.id}`);
                        if (rawB) {
                            const parsed = JSON.parse(rawB);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL1aRowsFromDraft('B', parsed.rows);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L1A dari localStorage:', e);
                    }
                }
                // Restore data L1C dari localStorage (sementara — sebelum persist ke backend).
                // Pola identik dengan restore L1A di atas. Tiga section terpisah karena
                // L1C memiliki Bagian A (Laba Rugi) dan Bagian B dua tabel (Aset / Liabilitas & Ekuitas).
                if (typeof setL1cRowsFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawA = localStorage.getItem(`spt_l1c_rows_a_${sptDetail.id}`);
                        if (rawA) {
                            const parsed = JSON.parse(rawA);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL1cRowsFromDraft('A', parsed.rows);
                            }
                        }
                        const rawBAset = localStorage.getItem(`spt_l1c_rows_b_aset_${sptDetail.id}`);
                        if (rawBAset) {
                            const parsed = JSON.parse(rawBAset);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL1cRowsFromDraft('B_ASET', parsed.rows);
                            }
                        }
                        const rawBLiab = localStorage.getItem(`spt_l1c_rows_b_liab_${sptDetail.id}`);
                        if (rawBLiab) {
                            const parsed = JSON.parse(rawBLiab);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL1cRowsFromDraft('B_LIAB_EKUITAS', parsed.rows);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L1C dari localStorage:', e);
                    }
                }
                // Restore data L1D dari localStorage (sementara — sebelum persist ke backend).
                // Pola identik dengan restore L1C di atas.
                if (typeof setL1dRowsFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawA = localStorage.getItem(`spt_l1d_rows_a_${sptDetail.id}`);
                        if (rawA) {
                            const parsed = JSON.parse(rawA);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL1dRowsFromDraft('A', parsed.rows);
                            }
                        }
                        const rawBAset = localStorage.getItem(`spt_l1d_rows_b_aset_${sptDetail.id}`);
                        if (rawBAset) {
                            const parsed = JSON.parse(rawBAset);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL1dRowsFromDraft('B_ASET', parsed.rows);
                            }
                        }
                        const rawBLiab = localStorage.getItem(`spt_l1d_rows_b_liab_${sptDetail.id}`);
                        if (rawBLiab) {
                            const parsed = JSON.parse(rawBLiab);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL1dRowsFromDraft('B_LIAB_EKUITAS', parsed.rows);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L1D dari localStorage:', e);
                    }
                }
                // Restore data L2 dari localStorage (sementara — sebelum persist ke backend).
                // Pola identik dengan restore L1D di atas, hanya dua section (A, B) karena
                // Blueprint L2 Final §10 tidak memerlukan merge (rows sudah full object).
                if (typeof setL2RowsFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawA = localStorage.getItem(`spt_l2_rows_a_${sptDetail.id}`);
                        if (rawA) {
                            const parsed = JSON.parse(rawA);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL2RowsFromDraft('A', parsed.rows);
                            }
                        }
                        const rawB = localStorage.getItem(`spt_l2_rows_b_${sptDetail.id}`);
                        if (rawB) {
                            const parsed = JSON.parse(rawB);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL2RowsFromDraft('B', parsed.rows);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L2 dari localStorage:', e);
                    }
                }
                // Restore data L3 dari localStorage (sementara — sebelum persist ke backend).
                // HANYA raw input (rowsA, rowsB, priorYearCreditRefund) — Blueprint L3
                // Final §7/§8: TIDAK PERNAH membaca kembali Part A.a/c, Part B.a/b/c,
                // l3CreditAmount, atau q13_overseas_credit_amount dari localStorage. Begitu
                // ketiga raw input ini di-restore, L3.js (saat mounted) menjalankan
                // hitungL3() ulang secara reaktif dan mengirim hasil terbaru lewat
                // onCreditAmountChange — q13_overseas_credit_amount lama otomatis tertimpa.
                if (typeof setL3RowsFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawA = localStorage.getItem(`spt_l3_rows_a_${sptDetail.id}`);
                        if (rawA) {
                            const parsed = JSON.parse(rawA);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL3RowsFromDraft('A', parsed.rows);
                            }
                        }
                        const rawB = localStorage.getItem(`spt_l3_rows_b_${sptDetail.id}`);
                        if (rawB) {
                            const parsed = JSON.parse(rawB);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL3RowsFromDraft('B', parsed.rows);
                            }
                        }
                        const rawCreditRefund = localStorage.getItem(`spt_l3_prior_year_credit_refund_${sptDetail.id}`);
                        if (rawCreditRefund) {
                            const parsed = JSON.parse(rawCreditRefund);
                            if (parsed && typeof parsed.value !== 'undefined') {
                                setL3RowsFromDraft('PRIOR_YEAR_CREDIT_REFUND', parsed.value);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L3 dari localStorage:', e);
                    }
                }
                // Restore data L4 dari localStorage (sementara — sebelum persist ke backend).
                // HANYA raw input (rowsA: tin/taxObject/taxBase/rate,
                // rowsB: typeOfIncome/incomeSource/grossIncome). Pola identik L2 §10 —
                // tidak ada merge, langsung set rows. Begitu di-restore, L4.js menghitung
                // ulang finalTaxPayable, code, withholdingName secara reaktif via render —
                // tidak membaca nilai derived yang lama (Blueprint L4 Final §Load Draft).
                if (typeof setL4RowsFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawA = localStorage.getItem(`spt_l4_rows_a_${sptDetail.id}`);
                        if (rawA) {
                            const parsed = JSON.parse(rawA);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL4RowsFromDraft('A', parsed.rows);
                            }
                        }
                        const rawB = localStorage.getItem(`spt_l4_rows_b_${sptDetail.id}`);
                        if (rawB) {
                            const parsed = JSON.parse(rawB);
                            if (parsed?.rows && Array.isArray(parsed.rows)) {
                                setL4RowsFromDraft('B', parsed.rows);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L4 dari localStorage:', e);
                    }
                }
                // Restore data L5 dari localStorage.
                // Urutan: l5Places dulu (Bagian A), kemudian l5Rows (Bagian B).
                // Restore l5Places mencegah buildInitialL5Places() di SPT berjalan ulang
                // (guard: l5Places.length > 0 → skip regenerasi dari companyData).
                if (sptDetail.id) {
                    try {
                        const rawPlaces = localStorage.getItem(`spt_l5_places_${sptDetail.id}`);
                        if (rawPlaces && typeof setL5PlacesFromDraft === 'function') {
                            const parsed = JSON.parse(rawPlaces);
                            if (parsed?.places) setL5PlacesFromDraft(parsed.places);
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L5 places dari localStorage:', e);
                    }
                    try {
                        const rawRows = localStorage.getItem(`spt_l5_rows_${sptDetail.id}`);
                        if (rawRows && typeof setL5RowsFromDraft === 'function') {
                            const parsed = JSON.parse(rawRows);
                            if (parsed?.rows && Array.isArray(parsed.rows)) setL5RowsFromDraft(parsed.rows);
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L5 rows dari localStorage:', e);
                    }
                }
                // Restore data L7 dari localStorage (sementara — sebelum persist ke backend).
                // Pola identik restore L5 (single rows array, tanpa section A/B).
                // Blueprint Revisi "Cached Derived Values": totalCol8/totalCol9 kini ikut
                // dipersist bersama rows, dan di-restore LANGSUNG di sini TANPA recalculation
                // — nilai cache dipakai apa adanya agar D.8/L6 tersinkron seketika tanpa
                // menunggu L7.js mount. L7.js tetap akan menghitung ulang secara reaktif
                // begitu mount (hasil deterministik, akan sama persis dengan cache ini),
                // namun proses restore ini sendiri tidak melakukan kalkulasi apa pun.
                if (sptDetail.id) {
                    try {
                        const rawL7Rows = localStorage.getItem(`spt_l7_rows_${sptDetail.id}`);
                        if (rawL7Rows) {
                            const parsed = JSON.parse(rawL7Rows);
                            if (parsed?.rows && Array.isArray(parsed.rows) && typeof setL7RowsFromDraft === 'function') {
                                setL7RowsFromDraft(parsed.rows);
                            }
                            // Fallback migrasi (BUKAN business rule normal): draft lama belum
                            // memiliki totalCol8/totalCol9 tersimpan. Draft baru selalu punya
                            // kedua field ini dan langsung dipakai tanpa recalculation apa pun.
                            // Hanya ketika field benar-benar tidak ada (undefined) barulah
                            // dihitung SATU KALI dari rows sebagai cache awal — inline, tanpa
                            // helper/parser baru.
                            const cachedCol8 = (parsed?.totalCol8 !== undefined)
                                ? parsed.totalCol8
                                : (Array.isArray(parsed?.rows)
                                    ? parsed.rows.reduce((sum, r) => sum + (parseFloat(String(r?.compThisYear).replace(/\./g, '').replace(/,/g, '')) || 0), 0)
                                    : 0);
                            const cachedCol9 = (parsed?.totalCol9 !== undefined)
                                ? parsed.totalCol9
                                : (Array.isArray(parsed?.rows)
                                    ? parsed.rows.reduce((sum, r) => sum + (parseFloat(String(r?.compYPlus1).replace(/\./g, '').replace(/,/g, '')) || 0), 0)
                                    : 0);
                            if (typeof setL7TotalCol8FromDraft === 'function') {
                                setL7TotalCol8FromDraft(cachedCol8 || 0);
                            }
                            if (typeof setL7TotalCol9FromDraft === 'function') {
                                setL7TotalCol9FromDraft(cachedCol9 || 0);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L7 rows dari localStorage:', e);
                    }
                }
                // Restore data L8 dari localStorage (sementara — sebelum persist ke
                // backend). Pola identik restore L7 di atas: grossTurnover direstore
                // sebagai Source of Truth; totalIncomeTax/eligible direstore LANGSUNG
                // dari cache TANPA recalculation (agar D.12 tersinkron seketika tanpa
                // menunggu L8.js mount). L8.js tetap akan menghitung ulang secara
                // reaktif begitu mount (hasil deterministik, identik dengan cache).
                if (sptDetail.id) {
                    try {
                        const rawL8 = localStorage.getItem(`spt_l8_gross_turnover_${sptDetail.id}`);
                        if (rawL8) {
                            const parsed = JSON.parse(rawL8);
                            if (typeof setL8GrossTurnoverFromDraft === 'function') {
                                setL8GrossTurnoverFromDraft(parsed?.grossTurnover || '');
                            }
                            if (typeof setL8CacheFromDraft === 'function') {
                                setL8CacheFromDraft(parsed?.totalIncomeTax || 0, parsed?.eligible !== false);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L8 dari localStorage:', e);
                    }
                }
                // Restore data L9 dari localStorage (sementara — sebelum persist ke
                // backend). Berbeda dari L1A/L2 (array of rows), l9Data adalah SATU
                // objek nested (Pendekatan B) — tidak perlu dispatcher section,
                // langsung dikirim utuh ke setL9DataFromDraft (pola identik
                // setL8GrossTurnoverFromDraft — single setter, bukan sectioned).
                // Struktur lengkap (tangible/building/intangible) dijamin oleh
                // mergeWithInitial() di dalam handleSetL9DataFromDraft
                // (SptTahunanBadan.js) — bukan tanggung jawab MainFormBadan.js.
                if (typeof setL9DataFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL9 = localStorage.getItem(`spt_l9_data_${sptDetail.id}`);
                        if (rawL9) {
                            const parsed = JSON.parse(rawL9);
                            if (parsed?.l9Data) {
                                setL9DataFromDraft(parsed.l9Data);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L9 dari localStorage:', e);
                    }
                }
                // Restore data L10A dari localStorage (sementara — sebelum persist ke
                // backend). l10aRows adalah array of rows (pola identik L1A/L2/L3) —
                // Draft Compatibility Contract: apabila draft lama tidak memiliki key
                // ini sama sekali, setL10aRowsFromDraft (SptTahunanBadan.js) akan
                // fallback ke [] secara otomatis, sehingga di sini cukup diteruskan
                // apa adanya tanpa transformasi tambahan.
                if (typeof setL10aRowsFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL10a = localStorage.getItem(`spt_l10a_rows_${sptDetail.id}`);
                        if (rawL10a) {
                            const parsed = JSON.parse(rawL10a);
                            if (parsed?.rows) {
                                setL10aRowsFromDraft(parsed.rows);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L10A dari localStorage:', e);
                    }
                }
                // Restore data L10B dari localStorage (sementara — sebelum persist ke
                // backend). l10bData adalah nested object per group (pola identik L9)
                // — struktur lengkap (group1..group4) dijamin oleh mergeWithInitial()
                // di dalam handleSetL10bDataFromDraft (SptTahunanBadan.js), bukan
                // tanggung jawab MainFormBadan.js (Draft Compatibility Contract).
                if (typeof setL10bDataFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL10b = localStorage.getItem(`spt_l10b_data_${sptDetail.id}`);
                        if (rawL10b) {
                            const parsed = JSON.parse(rawL10b);
                            if (parsed?.l10bData) {
                                setL10bDataFromDraft(parsed.l10bData);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L10B dari localStorage:', e);
                    }
                }
                // Restore data L10C dari localStorage (sementara — sebelum persist ke
                // backend). Pola identik L10A di atas — array of rows, fallback []
                // ditangani di setL10cRowsFromDraft (Draft Compatibility Contract).
                if (typeof setL10cRowsFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL10c = localStorage.getItem(`spt_l10c_rows_${sptDetail.id}`);
                        if (rawL10c) {
                            const parsed = JSON.parse(rawL10c);
                            if (parsed?.rows) {
                                setL10cRowsFromDraft(parsed.rows);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L10C dari localStorage:', e);
                    }
                }
                // Restore data L10D dari localStorage (sementara — sebelum persist ke
                // backend). Pola identik L10B di atas — nested object (checklist +
                // date), struktur lengkap dijamin oleh mergeWithInitial() di dalam
                // handleSetL10dDataFromDraft (Draft Compatibility Contract).
                if (typeof setL10dDataFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL10d = localStorage.getItem(`spt_l10d_data_${sptDetail.id}`);
                        if (rawL10d) {
                            const parsed = JSON.parse(rawL10d);
                            if (parsed?.l10dData) {
                                setL10dDataFromDraft(parsed.l10dData);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L10D dari localStorage:', e);
                    }
                }
                // Restore data L13A dari localStorage (sementara — sebelum persist ke
                // backend). l13aRows adalah array of rows (pola identik L10A) — TIDAK
                // ADA formula/computed value, fallback [] ditangani di
                // setL13aRowsFromDraft (Draft Compatibility Contract).
                if (typeof setL13aRowsFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL13a = localStorage.getItem(`spt_l13a_rows_${sptDetail.id}`);
                        if (rawL13a) {
                            const parsed = JSON.parse(rawL13a);
                            if (parsed?.rows) {
                                setL13aRowsFromDraft(parsed.rows);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L13A dari localStorage:', e);
                    }
                }
                // Restore data L13B dari localStorage (sementara — sebelum persist ke
                // backend). l13bData adalah nested object per section (pola identik
                // L10B) — struktur lengkap (sectionA/sectionB/sectionC) DAN recalculate
                // Section C additionalGrossIncomeDeduction dijamin oleh mergeWithInitial()
                // di dalam handleSetL13bDataFromDraft (SptTahunanBadan.js), bukan
                // tanggung jawab MainFormBadan.js (Draft Compatibility Contract).
                if (typeof setL13bDataFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL13b = localStorage.getItem(`spt_l13b_data_${sptDetail.id}`);
                        if (rawL13b) {
                            const parsed = JSON.parse(rawL13b);
                            if (parsed?.l13bData) {
                                setL13bDataFromDraft(parsed.l13bData);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L13B dari localStorage:', e);
                    }
                }
                // Restore data L13C dari localStorage (sementara — sebelum persist ke
                // backend). Pola identik L13A di atas — array of rows, HANYA raw input
                // (Taxable Income/Income Tax Payable/Tax Reduction Facility TIDAK
                // PERNAH disimpan — selalu dihitung ulang di L13C.js).
                if (typeof setL13cRowsFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL13c = localStorage.getItem(`spt_l13c_rows_${sptDetail.id}`);
                        if (rawL13c) {
                            const parsed = JSON.parse(rawL13c);
                            if (parsed?.rows) {
                                setL13cRowsFromDraft(parsed.rows);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L13C dari localStorage:', e);
                    }
                }
                // Restore data L14 dari localStorage (sementara — sebelum persist ke
                // backend). Pola identik L13A/L13C di atas — array of rows, HANYA raw
                // input per year (bentukPenanaman/penyediaan/tahun1-4). Skeleton 5-row
                // historical (taxYear-4..taxYear) DAN merge-by-year terhadap draft ini
                // sepenuhnya dilakukan di dalam L14.js sendiri (mergeRowsWithDraft) —
                // MainFormBadan.js hanya bertugas memindahkan raw array apa adanya.
                if (typeof setL14RowsFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL14 = localStorage.getItem(`spt_l14_rows_${sptDetail.id}`);
                        if (rawL14) {
                            const parsed = JSON.parse(rawL14);
                            if (parsed?.rows) {
                                setL14RowsFromDraft(parsed.rows);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L14 dari localStorage:', e);
                    }
                }
                // Restore data L11A dari localStorage (sementara — sebelum persist ke
                // backend). l11aData adalah nested object (6 sub-bagian, pola identik
                // L9/L10B/L10D). Struktur lengkap dijamin oleh mergeWithInitial() di
                // dalam handleSetL11aDataFromDraft (Draft Compatibility Contract,
                // Blueprint L11 §5 — draft lama tanpa key l11a tetap aman).
                if (typeof setL11aDataFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL11a = localStorage.getItem(`spt_l11a_data_${sptDetail.id}`);
                        if (rawL11a) {
                            const parsed = JSON.parse(rawL11a);
                            if (parsed?.l11aData) {
                                setL11aDataFromDraft(parsed.l11aData);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L11A dari localStorage:', e);
                    }
                }
                // Restore data L11B dari localStorage. l11bData HANYA berisi Bagian
                // II/III raw input (Blueprint L11 §5) — Bagian I EBITDA TIDAK pernah
                // di-restore di sini karena bukan raw milik L11B (derived real-time
                // dari ebitdaComponentsByLampiran di SptTahunanBadan.js).
                if (typeof setL11bDataFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL11b = localStorage.getItem(`spt_l11b_data_${sptDetail.id}`);
                        if (rawL11b) {
                            const parsed = JSON.parse(rawL11b);
                            if (parsed?.l11bData) {
                                setL11bDataFromDraft(parsed.l11bData);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L11B dari localStorage:', e);
                    }
                }
                // Restore data L11C dari localStorage (sementara — sebelum persist ke
                // backend). l11cData adalah object wrapper { foreignDebtRows: [...] }
                // (Blueprint L11C §8/§9 Save/Load Draft) — struktur lengkap dijamin
                // oleh mergeWithInitial() di dalam setL11cDataFromDraft (Draft
                // Compatibility Contract, pola identik L11A/L11B di atas).
                if (typeof setL11cDataFromDraft === 'function' && sptDetail.id) {
                    try {
                        const rawL11c = localStorage.getItem(`spt_l11c_data_${sptDetail.id}`);
                        if (rawL11c) {
                            const parsed = JSON.parse(rawL11c);
                            if (parsed?.l11cData) {
                                setL11cDataFromDraft(parsed.l11cData);
                            }
                        }
                    } catch (e) {
                        console.warn('Gagal membaca L11C dari localStorage:', e);
                    }
                }
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
        setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    const PROFIT_LOSS_D_RESET = {
        fiscal_net_income_before_facility: 0,
        p5_investment_facility: '', p5_investment_facility_amount: 0,
        p6_vocational_deduction: '', p6_vocational_deduction_amount: 0,
        p8_carried_losses: '',     p8_carried_forward_losses: 0,
        p9_taxable_income: 0,
        p10_rd_deduction: '',      p10_rd_deduction_amount: 0,
        p11_tax_rate: '',          p11a_custom_tax_rate: '',
        p12_income_tax_in_year: 0
    };
    const resetSectionD = () => {
        setSptData(prev => ({ ...prev, profit_loss: { ...prev.profit_loss, ...PROFIT_LOSS_D_RESET } }));
        setExpandedSections(prev => ({ ...prev, profit_loss: false }));
        if (onResetSectionD) onResetSectionD();
    };

    const updateSectionData = (section, data) => {
        setSptData(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
    };

    const updateNestedData = (section, subsection, data) => {
        setSptData(prev => ({
            ...prev,
            [section]: { ...prev[section], [subsection]: { ...prev[section][subsection], ...data } }
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
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
            if (!created) return false;
        }
        setLoading(true);
        try {
            const sectionsToSave = [
                { section: 'taxpayer_identity',      data: sptData.company_identity },
                { section: 'income_summary',          data: sptData.general_info    },
                { section: 'income_tax_calculation',  data: sptData.balance_sheet   },
                { section: 'income_tax_credit',       data: sptData.profit_loss     },
                { section: 'underpayment_overpayment',data: sptData.tax_calculation },
                { section: 'amendment_tax_return',    data: sptData.tax_credit      },
                { section: 'refund_data',             data: sptData.tax_payable     },
                { section: 'additional_attachments',  data: sptData.attachments     },
                { section: 'statement_data',          data: sptData.statement       },

                // TODO: Nonaktifkan sementara — backend belum mendukung section Lampiran.
                // Section-section berikut berkaitan dengan data Lampiran (H, L1, L2, dst)
                // yang persistensinya di backend belum selesai diimplementasikan.
                // Aktifkan kembali ketika backend persistence Lampiran sudah siap.
                //
                // { section: 'transactions_data', data: sptData.transactions },  // Section H (Q21a–Q21h)
                // { section: 'l1a_rows_a',        data: { rows: l1aRowsA || [] } },
                // { section: 'l1a_rows_b',        data: { rows: l1aRowsB || [] } },
                // { section: 'l2_rows_a',         data: { rows: l2RowsA || [] } },
                // { section: 'l2_rows_b',         data: { rows: l2RowsB || [] } },
                // { section: 'l3_rows_a',         data: { rows: l3RowsA || [] } },
                // { section: 'l3_rows_b',         data: { rows: l3RowsB || [] } },
                // { section: 'l3_prior_year_credit_refund', data: { value: l3PriorYearCreditRefund || '' } },
                // { section: 'l9_data',           data: { l9Data: l9Data } },
                // { section: 'l10a_rows',         data: { rows: l10aRows || [] } },
                // { section: 'l10b_data',         data: { l10bData: l10bData } },
                // { section: 'l10c_rows',         data: { rows: l10cRows || [] } },
                // { section: 'l10d_data',         data: { l10dData: l10dData } },
                // { section: 'l13a_rows',         data: { rows: l13aRows || [] } },
                // { section: 'l13b_data',         data: { l13bData: l13bData } },
                // { section: 'l13c_rows',         data: { rows: l13cRows || [] } },
                // { section: 'l14_rows',          data: { rows: l14Rows || [] } },
                // { section: 'l11a_data',         data: { l11aData: l11aData } },
                // { section: 'l11b_data',         data: { l11bData: l11bData } },
            ];
            let savedSections = 0;
            const errors = [];
            for (const { section, data } of sectionsToSave) {
                try {
                    const response = await fetch(`${API.HOST}/api/v2/spt-tahunan-badan/${sptId}/section`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                        body: JSON.stringify({ section, data })
                    });
                    const result = await response.json();
                    if (result.success) { savedSections++; }
                    else { console.error(`Failed to save section ${section}:`, result.message); errors.push(`${section}: ${result.message}`); }
                } catch (error) {
                    console.error(`Error saving section ${section}:`, error);
                    errors.push(`${section}: ${error.message}`);
                }
            }
            // Simpan data L1A ke localStorage (sementara — sebelum persist ke backend).
            // Key berbasis sptId agar tidak tercampur antar SPT.
            if (sptId) {
                try {
                    localStorage.setItem(`spt_l1a_rows_a_${sptId}`, JSON.stringify({ rows: l1aRowsA || [] }));
                    localStorage.setItem(`spt_l1a_rows_b_${sptId}`, JSON.stringify({ rows: l1aRowsB || [] }));
                } catch (e) {
                    console.warn('Gagal menyimpan L1A ke localStorage:', e);
                }
                // Simpan data L1C ke localStorage (sementara — sebelum persist ke backend).
                // Pola identik dengan L1A di atas.
                try {
                    localStorage.setItem(`spt_l1c_rows_a_${sptId}`, JSON.stringify({ rows: l1cRowsA || [] }));
                    localStorage.setItem(`spt_l1c_rows_b_aset_${sptId}`, JSON.stringify({ rows: l1cRowsBAset || [] }));
                    localStorage.setItem(`spt_l1c_rows_b_liab_${sptId}`, JSON.stringify({ rows: l1cRowsBLiabEkuitas || [] }));
                } catch (e) {
                    console.warn('Gagal menyimpan L1C ke localStorage:', e);
                }
                // Simpan data L1D ke localStorage (sementara — sebelum persist ke backend).
                // Pola identik dengan L1C di atas.
                try {
                    localStorage.setItem(`spt_l1d_rows_a_${sptId}`, JSON.stringify({ rows: l1dRowsA || [] }));
                    localStorage.setItem(`spt_l1d_rows_b_aset_${sptId}`, JSON.stringify({ rows: l1dRowsBAset || [] }));
                    localStorage.setItem(`spt_l1d_rows_b_liab_${sptId}`, JSON.stringify({ rows: l1dRowsBLiabEkuitas || [] }));
                } catch (e) {
                    console.warn('Gagal menyimpan L1D ke localStorage:', e);
                }
                // Simpan data L2 ke localStorage (sementara — sebelum persist ke backend).
                // Dua section saja (A, B), disimpan apa adanya tanpa transformasi
                // (Blueprint L2 Final §9 — Save Draft hanya raw input, full row).
                try {
                    localStorage.setItem(`spt_l2_rows_a_${sptId}`, JSON.stringify({ rows: l2RowsA || [] }));
                    localStorage.setItem(`spt_l2_rows_b_${sptId}`, JSON.stringify({ rows: l2RowsB || [] }));
                } catch (e) {
                    console.warn('Gagal menyimpan L2 ke localStorage:', e);
                }
                // Simpan data L3 ke localStorage (sementara — sebelum persist ke backend).
                // HANYA raw input: rowsA, rowsB, priorYearCreditRefund (Blueprint L3 Final
                // §3 — Save Draft). TIDAK PERNAH menyimpan Part A.a/c, Part B.a/b/c, atau
                // l3CreditAmount — semuanya derived, selalu dihitung ulang saat Load Draft.
                try {
                    localStorage.setItem(`spt_l3_rows_a_${sptId}`, JSON.stringify({ rows: l3RowsA || [] }));
                    localStorage.setItem(`spt_l3_rows_b_${sptId}`, JSON.stringify({ rows: l3RowsB || [] }));
                    localStorage.setItem(`spt_l3_prior_year_credit_refund_${sptId}`, JSON.stringify({ value: l3PriorYearCreditRefund || '' }));
                } catch (e) {
                    console.warn('Gagal menyimpan L3 ke localStorage:', e);
                }
                // Simpan data L4 ke localStorage (sementara — sebelum persist ke backend).
                // HANYA raw input: rowsA (tin, taxObject, taxBase, rate),
                // rowsB (typeOfIncome, incomeSource, grossIncome).
                // TIDAK PERNAH menyimpan: withholdingName (lookup derived),
                // finalTaxPayable (formula derived), code (mapping derived),
                // NO (index derived), TOTAL (aggregasi derived) — Blueprint L4 Final §Save Draft.
                try {
                    localStorage.setItem(`spt_l4_rows_a_${sptId}`, JSON.stringify({ rows: l4RowsA || [] }));
                    localStorage.setItem(`spt_l4_rows_b_${sptId}`, JSON.stringify({ rows: l4RowsB || [] }));
                } catch (e) {
                    console.warn('Gagal menyimpan L4 ke localStorage:', e);
                }
                // Simpan data L5 ke localStorage (sementara — sebelum persist ke backend).
                // Raw input: l5Places (identitas TKU) + l5Rows (36 field bulanan per TKU).
                // l5Places wajib ikut Save Draft agar Load Draft tidak regenerasi dari API.
                // TIDAK PERNAH menyimpan derived values (totals, summary rows, references).
                try {
                    localStorage.setItem(`spt_l5_rows_${sptId}`,   JSON.stringify({ rows:   l5Rows   || [] }));
                    localStorage.setItem(`spt_l5_places_${sptId}`, JSON.stringify({ places: l5Places || [] }));
                } catch (e) {
                    console.warn('Gagal menyimpan L5 ke localStorage:', e);
                }
                // Simpan data Section H (Statement of Transactions, Q21a-Q21h) ke
                // localStorage (sementara — sebelum persist ke backend, pola identik
                // L1A-L7 di atas). Backend section 'transactions_data' TETAP di-comment
                // di sectionsToSave (belum didukung backend) — ini HANYA fallback
                // sementara agar jawaban Section H tidak hilang saat Load Draft
                // (Kasus 3). Raw input murni (radio Yes/No), tidak ada derived value.
                try {
                    localStorage.setItem(`spt_transactions_${sptId}`, JSON.stringify(sptData.transactions || {}));
                } catch (e) {
                    console.warn('Gagal menyimpan Section H ke localStorage:', e);
                }
                // Simpan data L7 ke localStorage (sementara — sebelum persist ke backend).
                // Blueprint Revisi "Cached Derived Values": totalCol8/totalCol9 kini ikut
                // dipersist bersama rows sebagai cache (untuk restore cepat tanpa menunggu
                // L7.js mount). Source of Truth TETAP rows — totalCol8/totalCol9 tidak pernah
                // diedit user secara langsung, hanya hasil hitungan L7.js yang di-mirror di sini.
                try {
                    localStorage.setItem(`spt_l7_rows_${sptId}`, JSON.stringify({
                        rows:       l7Rows || [],
                        totalCol8:  l7TotalCol8ForD8 || 0,
                        totalCol9:  l7TotalCol9ForL6 || 0,
                    }));
                } catch (e) {
                    console.warn('Gagal menyimpan L7 ke localStorage:', e);
                }
                // Simpan data L8 ke localStorage (sementara — sebelum persist ke backend).
                // Pola identik L7 di atas: grossTurnover adalah Source of Truth (raw
                // input), totalIncomeTax/eligible adalah CACHED DERIVED VALUE — ikut
                // dipersist semata untuk restore cepat (Blueprint_L8.md FINAL §A.6),
                // selalu dihitung ulang oleh L8.js begitu mount, tidak pernah diedit
                // user secara langsung.
                try {
                    localStorage.setItem(`spt_l8_gross_turnover_${sptId}`, JSON.stringify({
                        grossTurnover:  l8GrossTurnover || '',
                        totalIncomeTax: l8TotalIncomeTax || 0,
                        eligible:       l8Eligible !== false,
                    }));
                } catch (e) {
                    console.warn('Gagal menyimpan L8 ke localStorage:', e);
                }
                // Simpan data L9 ke localStorage (sementara — sebelum persist ke
                // backend). l9Data SELALU berstruktur lengkap (tangible/building/
                // intangible × seluruh subgroup) karena Source of Truth di
                // SptTahunanBadan.js diinisialisasi via buildInitialL9Data() dan
                // setiap update L9.js bersifat immutable (spread, bukan mutasi) —
                // sehingga payload di sini TIDAK memerlukan fallback `|| {}` untuk
                // memastikan struktur lengkap. Hanya raw input per baris yang
                // tersimpan di dalam l9Data (tidak ada computed/subtotal/rekap).
                try {
                    localStorage.setItem(`spt_l9_data_${sptId}`, JSON.stringify({
                        l9Data: l9Data,
                    }));
                } catch (e) {
                    console.warn('Gagal menyimpan L9 ke localStorage:', e);
                }
                // Simpan data L10A ke localStorage (sementara — sebelum persist ke
                // backend). HANYA raw input: array of rows apa adanya. transactionValue
                // di dalam setiap row SELALU number murni (bukan string "Rp ..."),
                // sesuai Internal Data Representation Contract — formatter Rupiah
                // hanya diterapkan di layer render L10A.js, tidak pernah di sini.
                try {
                    localStorage.setItem(`spt_l10a_rows_${sptId}`, JSON.stringify({ rows: l10aRows || [] }));
                } catch (e) {
                    console.warn('Gagal menyimpan L10A ke localStorage:', e);
                }
                // Simpan data L10B ke localStorage (sementara — sebelum persist ke
                // backend). l10bData SELALU berstruktur lengkap (group1..group4) karena
                // Source of Truth di SptTahunanBadan.js diinisialisasi via
                // buildInitialL10BData() — pola identik l9Data, tidak ada computed value.
                try {
                    localStorage.setItem(`spt_l10b_data_${sptId}`, JSON.stringify({ l10bData: l10bData }));
                } catch (e) {
                    console.warn('Gagal menyimpan L10B ke localStorage:', e);
                }
                // Simpan data L10C ke localStorage (sementara — sebelum persist ke
                // backend). HANYA raw input: array of rows, pola identik L10A.
                try {
                    localStorage.setItem(`spt_l10c_rows_${sptId}`, JSON.stringify({ rows: l10cRows || [] }));
                } catch (e) {
                    console.warn('Gagal menyimpan L10C ke localStorage:', e);
                }
                // Simpan data L10D ke localStorage (sementara — sebelum persist ke
                // backend). l10dData SELALU berstruktur lengkap (masterSummary/
                // localSummary/masterDocDate/localDocDate) via buildInitialL10DData().
                // Format tanggal internal (ISO string, pola native <input type="date">
                // yang sudah dipakai Section J) — bukan dd-mm-yyyy — sesuai Internal
                // Data Representation Contract.
                try {
                    localStorage.setItem(`spt_l10d_data_${sptId}`, JSON.stringify({ l10dData: l10dData }));
                } catch (e) {
                    console.warn('Gagal menyimpan L10D ke localStorage:', e);
                }
                // Simpan data L13A ke localStorage (sementara — sebelum persist ke
                // backend). HANYA raw input: array of rows apa adanya, pola identik L10A.
                try {
                    localStorage.setItem(`spt_l13a_rows_${sptId}`, JSON.stringify({ rows: l13aRows || [] }));
                } catch (e) {
                    console.warn('Gagal menyimpan L13A ke localStorage:', e);
                }
                // Simpan data L13B ke localStorage (sementara — sebelum persist ke
                // backend). l13bData SELALU berstruktur lengkap (sectionA/sectionB/
                // sectionC) karena Source of Truth di SptTahunanBadan.js diinisialisasi
                // via buildInitialL13BData() — pola identik l10bData. Section C
                // additionalGrossIncomeDeduction (derived) TIDAK ikut tersimpan sebagai
                // sumber kebenaran — akan dihitung ulang saat Load Draft (Recalculate
                // Contract); disimpan apa adanya di sini karena sudah computed ulang
                // setiap kali sectionC berubah, bukan dipersist secara independen.
                try {
                    localStorage.setItem(`spt_l13b_data_${sptId}`, JSON.stringify({ l13bData: l13bData }));
                } catch (e) {
                    console.warn('Gagal menyimpan L13B ke localStorage:', e);
                }
                // Simpan data L13C ke localStorage (sementara — sebelum persist ke
                // backend). HANYA raw input: array of rows, pola identik L13A/L10A.
                // Field readonly (Taxable Income/Income Tax Payable/Tax Reduction
                // Facility) TIDAK PERNAH ikut tersimpan di dalam row.
                try {
                    localStorage.setItem(`spt_l13c_rows_${sptId}`, JSON.stringify({ rows: l13cRows || [] }));
                } catch (e) {
                    console.warn('Gagal menyimpan L13C ke localStorage:', e);
                }
                // Simpan data L14 ke localStorage (sementara — sebelum persist ke
                // backend). HANYA raw input: array of rows per year (bentukPenanaman/
                // penyediaan/tahun1-4), pola identik L13A/L13C. Field hasil perhitungan
                // (Jumlah Penggunaan/Sisa Belum Ditanamkan/Sisa Melewati Jangka Waktu)
                // TIDAK PERNAH ikut tersimpan — selalu dihitung ulang di L14.js.
                try {
                    localStorage.setItem(`spt_l14_rows_${sptId}`, JSON.stringify({ rows: l14Rows || [] }));
                } catch (e) {
                    console.warn('Gagal menyimpan L14 ke localStorage:', e);
                }
                // Simpan data L11A ke localStorage (sementara — sebelum persist ke
                // backend). l11aData SELALU berstruktur lengkap (6 sub-bagian) karena
                // Source of Truth di SptTahunanBadan.js diinisialisasi via
                // buildInitialL11AData() — pola identik l9Data/l10bData/l10dData.
                // HANYA raw input yang tersimpan (Blueprint L11 §5) — tidak ada
                // subtotal/jumlah/computed value di dalam l11aData.
                try {
                    localStorage.setItem(`spt_l11a_data_${sptId}`, JSON.stringify({ l11aData: l11aData }));
                } catch (e) {
                    console.warn('Gagal menyimpan L11A ke localStorage:', e);
                }
                // Simpan data L11B ke localStorage. l11bData HANYA berisi Bagian II/III
                // raw input (derRowsUtang/derRowsModal/borrowingCostRows/hasForeignDebt).
                // Bagian I EBITDA SENGAJA TIDAK disimpan di sini — bukan raw milik L11B,
                // 100% derived real-time dari Lampiran 1 (Blueprint L11 §5).
                try {
                    localStorage.setItem(`spt_l11b_data_${sptId}`, JSON.stringify({ l11bData: l11bData }));
                } catch (e) {
                    console.warn('Gagal menyimpan L11B ke localStorage:', e);
                }
                // Simpan data L11C ke localStorage (sementara — sebelum persist ke
                // backend). l11cData adalah object wrapper { foreignDebtRows: [...] }
                // (Blueprint L11C §8 Save Draft Blueprint) — HANYA raw input per baris,
                // tidak ada computed value (pokokUtangAkhirTahun derived, tidak disimpan).
                try {
                    localStorage.setItem(`spt_l11c_data_${sptId}`, JSON.stringify({ l11cData: l11cData }));
                } catch (e) {
                    console.warn('Gagal menyimpan L11C ke localStorage:', e);
                }
            }
            if (errors.length > 0) {
                setError(`Beberapa section gagal disimpan: ${errors.join(', ')}`);
            } else {
                setSuccess(`Draft berhasil disimpan (${savedSections}/${sectionsToSave.length} sections saved)`);
                setDraftSaved(true);
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
        const validationErrors = [];
        if (!sptData.statement.declaration) validationErrors.push('Silakan centang pernyataan terlebih dahulu');
        if (!sptData.company_identity.company_name || !sptData.company_identity.pic_name)
            validationErrors.push('Data identitas perusahaan belum lengkap');
        if (!sptData.statement.company_name || !sptData.statement.pic_name)
            validationErrors.push('Data pernyataan belum lengkap');
        if (!sptData.general_info.business_classification)
            validationErrors.push('Business Classification for Financial Statement wajib dipilih');
        if (!sptData.general_info.is_audited)
            validationErrors.push('Keterangan audit laporan keuangan wajib dipilih');
        if (sptData.general_info.is_audited === 'Yes' && !sptData.general_info.audit_opinion)
            validationErrors.push('Opini audit wajib dipilih jika laporan keuangan diaudit');
        if (!sptData.balance_sheet.q1_gr23)
            validationErrors.push('Pertanyaan income GR No. 23/2018 (Section C) wajib dijawab');
        if (!sptData.balance_sheet.q1b_solely_gr23)
            validationErrors.push('Pertanyaan income solely GR No. 23/2018 (Section C) wajib dijawab');
        if (!sptData.balance_sheet.q2_final_tax)
            validationErrors.push('Pertanyaan Final Income Tax (Section C) wajib dijawab');
        if (!sptData.balance_sheet.q3_excluded_tax)
            validationErrors.push('Pertanyaan income excluded from Income Tax (Section C) wajib dijawab');
        if (!sectionDDisabled) {
            if (!sptData.profit_loss.p5_investment_facility) validationErrors.push('Point 5 (Investment Facility) wajib dijawab');
            if (!sptData.profit_loss.p6_vocational_deduction) validationErrors.push('Point 6 (Vocational Deduction) wajib dijawab');
            if (!sptData.profit_loss.p8_carried_losses) validationErrors.push('Point 8 (Carried Forward Losses) wajib dijawab');
            if (!sptData.profit_loss.p10_rd_deduction) validationErrors.push('Point 10 (R&D Deduction) wajib dijawab');
            if (!sptData.profit_loss.p11_tax_rate) validationErrors.push('Tax Rate (Point 11) wajib dipilih');
            if (sptData.profit_loss.p11_tax_rate === 'Tarif Pajak Lainnya' && !sptData.profit_loss.p11a_custom_tax_rate)
                validationErrors.push('Custom Tax Rate (Point 11a) wajib diisi');
        }
        if (!sptData.tax_calculation.q13_overseas_credit)
            validationErrors.push('Point 13 (Overseas Tax Credit) wajib dijawab');
        if (!sptData.tax_calculation.q16_payable_deduction)
            validationErrors.push('Point 16 (Income Tax Payable Deduction Facility) wajib dijawab');
        if (!sptData.general_info.business_classification)
            validationErrors.push('Business Classification for Financial Statement wajib dipilih');
        if (!sptData.general_info.is_audited)
            validationErrors.push('Keterangan audit laporan keuangan wajib dipilih');
        if (sptData.general_info.is_audited === 'Yes' && !sptData.general_info.audit_opinion)
            validationErrors.push('Opini audit wajib dipilih jika laporan keuangan diaudit');
        if (validationErrors.length > 0) { setError(validationErrors.join(', ')); return; }

        setLoading(true);
        try {
            let currentSptId = sptId;
            if (!currentSptId) {
                const createResponse = await fetch(`${API.HOST}/api/v2/spt-tahunan-badan`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
                if (!createResult.success) { setError(createResult.message || 'Gagal membuat SPT Badan'); return; }
                currentSptId = createResult.data.id;
                setSptId(currentSptId);
            }
            const sectionsToSave = [
                { section: 'taxpayer_identity',      data: sptData.company_identity },
                { section: 'income_summary',          data: sptData.general_info    },
                { section: 'income_tax_calculation',  data: sptData.balance_sheet   },
                { section: 'income_tax_credit',       data: sptData.profit_loss     },
                { section: 'underpayment_overpayment',data: sptData.tax_calculation },
                { section: 'amendment_tax_return',    data: sptData.tax_credit      },
                { section: 'refund_data',             data: sptData.tax_payable     },
                { section: 'additional_attachments',  data: sptData.attachments     },
                { section: 'statement_data',          data: sptData.statement       },

                // TODO: Nonaktifkan sementara — backend belum mendukung section Lampiran.
                // Section-section berikut berkaitan dengan data Lampiran (H, L1, L2, dst)
                // yang persistensinya di backend belum selesai diimplementasikan.
                // Aktifkan kembali ketika backend persistence Lampiran sudah siap.
                //
                // { section: 'transactions_data', data: sptData.transactions },  // Section H (Q21a–Q21h)
                // { section: 'l1a_rows_a',        data: { rows: l1aRowsA || [] } },
                // { section: 'l1a_rows_b',        data: { rows: l1aRowsB || [] } },
                // { section: 'l2_rows_a',         data: { rows: l2RowsA || [] } },
                // { section: 'l2_rows_b',         data: { rows: l2RowsB || [] } },
                // { section: 'l3_rows_a',         data: { rows: l3RowsA || [] } },
                // { section: 'l3_rows_b',         data: { rows: l3RowsB || [] } },
                // { section: 'l3_prior_year_credit_refund', data: { value: l3PriorYearCreditRefund || '' } },
                // { section: 'l9_data',           data: { l9Data: l9Data } },
                // { section: 'l10a_rows',         data: { rows: l10aRows || [] } },
                // { section: 'l10b_data',         data: { l10bData: l10bData } },
                // { section: 'l10c_rows',         data: { rows: l10cRows || [] } },
                // { section: 'l10d_data',         data: { l10dData: l10dData } },
                // { section: 'l13a_rows',         data: { rows: l13aRows || [] } },
                // { section: 'l13b_data',         data: { l13bData: l13bData } },
                // { section: 'l13c_rows',         data: { rows: l13cRows || [] } },
                // { section: 'l14_rows',          data: { rows: l14Rows || [] } },
                // { section: 'l11a_data',         data: { l11aData: l11aData } },
                // { section: 'l11b_data',         data: { l11bData: l11bData } },
            ];
            for (const { section, data } of sectionsToSave) {
                try {
                    const response = await fetch(`${API.HOST}/api/v2/spt-tahunan-badan/${currentSptId}/section`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                        body: JSON.stringify({ section, data })
                    });
                    const result = await response.json();
                    if (!result.success) console.error(`Failed to save section ${section}:`, result.message);
                } catch (error) {
                    console.error(`Error saving section ${section}:`, error);
                }
            }
            // Simpan data L1A ke localStorage (sementara — sebelum persist ke backend).
            try {
                localStorage.setItem(`spt_l1a_rows_a_${currentSptId}`, JSON.stringify({ rows: l1aRowsA || [] }));
                localStorage.setItem(`spt_l1a_rows_b_${currentSptId}`, JSON.stringify({ rows: l1aRowsB || [] }));
            } catch (e) {
                console.warn('Gagal menyimpan L1A ke localStorage saat submit:', e);
            }
            // Simpan data L1C ke localStorage (sementara — sebelum persist ke backend).
            try {
                localStorage.setItem(`spt_l1c_rows_a_${currentSptId}`, JSON.stringify({ rows: l1cRowsA || [] }));
                localStorage.setItem(`spt_l1c_rows_b_aset_${currentSptId}`, JSON.stringify({ rows: l1cRowsBAset || [] }));
                localStorage.setItem(`spt_l1c_rows_b_liab_${currentSptId}`, JSON.stringify({ rows: l1cRowsBLiabEkuitas || [] }));
            } catch (e) {
                console.warn('Gagal menyimpan L1C ke localStorage saat submit:', e);
            }
            // Simpan data L1D ke localStorage (sementara — sebelum persist ke backend).
            try {
                localStorage.setItem(`spt_l1d_rows_a_${currentSptId}`, JSON.stringify({ rows: l1dRowsA || [] }));
                localStorage.setItem(`spt_l1d_rows_b_aset_${currentSptId}`, JSON.stringify({ rows: l1dRowsBAset || [] }));
                localStorage.setItem(`spt_l1d_rows_b_liab_${currentSptId}`, JSON.stringify({ rows: l1dRowsBLiabEkuitas || [] }));
            } catch (e) {
                console.warn('Gagal menyimpan L1D ke localStorage saat submit:', e);
            }
            // Simpan data L2 ke localStorage (sementara — sebelum persist ke backend).
            try {
                localStorage.setItem(`spt_l2_rows_a_${currentSptId}`, JSON.stringify({ rows: l2RowsA || [] }));
                localStorage.setItem(`spt_l2_rows_b_${currentSptId}`, JSON.stringify({ rows: l2RowsB || [] }));
            } catch (e) {
                console.warn('Gagal menyimpan L2 ke localStorage saat submit:', e);
            }
            // Simpan data L3 ke localStorage (sementara — sebelum persist ke backend).
            // HANYA raw input — pola identik blok saveDraft di atas (Blueprint L3 Final §3).
            try {
                localStorage.setItem(`spt_l3_rows_a_${currentSptId}`, JSON.stringify({ rows: l3RowsA || [] }));
                localStorage.setItem(`spt_l3_rows_b_${currentSptId}`, JSON.stringify({ rows: l3RowsB || [] }));
                localStorage.setItem(`spt_l3_prior_year_credit_refund_${currentSptId}`, JSON.stringify({ value: l3PriorYearCreditRefund || '' }));
            } catch (e) {
                console.warn('Gagal menyimpan L3 ke localStorage saat submit:', e);
            }
            // Simpan data L4 ke localStorage (sementara — sebelum persist ke backend).
            // HANYA raw input — pola identik blok saveDraft (Blueprint L4 Final §Save Draft).
            try {
                localStorage.setItem(`spt_l4_rows_a_${currentSptId}`, JSON.stringify({ rows: l4RowsA || [] }));
                localStorage.setItem(`spt_l4_rows_b_${currentSptId}`, JSON.stringify({ rows: l4RowsB || [] }));
            } catch (e) {
                console.warn('Gagal menyimpan L4 ke localStorage saat submit:', e);
            }
            // Simpan data L5 ke localStorage saat submit — pola identik saveDraft.
            try {
                localStorage.setItem(`spt_l5_rows_${currentSptId}`,   JSON.stringify({ rows:   l5Rows   || [] }));
                localStorage.setItem(`spt_l5_places_${currentSptId}`, JSON.stringify({ places: l5Places || [] }));
            } catch (e) {
                console.warn('Gagal menyimpan L5 ke localStorage saat submit:', e);
            }
            // Simpan data Section H (Statement of Transactions) ke localStorage saat
            // submit — pola identik saveDraft() (Kasus 3). Raw input murni.
            try {
                localStorage.setItem(`spt_transactions_${currentSptId}`, JSON.stringify(sptData.transactions || {}));
            } catch (e) {
                console.warn('Gagal menyimpan Section H ke localStorage saat submit:', e);
            }
            // Simpan data L7 ke localStorage saat submit — pola identik saveDraft
            // (termasuk cached derived values totalCol8/totalCol9, lihat Blueprint Revisi
            // "Cached Derived Values").
            try {
                localStorage.setItem(`spt_l7_rows_${currentSptId}`, JSON.stringify({
                    rows:       l7Rows || [],
                    totalCol8:  l7TotalCol8ForD8 || 0,
                    totalCol9:  l7TotalCol9ForL6 || 0,
                }));
            } catch (e) {
                console.warn('Gagal menyimpan L7 ke localStorage saat submit:', e);
            }
            // Simpan data L8 ke localStorage saat submit — pola identik saveDraft
            // (termasuk cached derived values totalIncomeTax/eligible, lihat
            // Blueprint_L8.md FINAL §A.6).
            try {
                localStorage.setItem(`spt_l8_gross_turnover_${currentSptId}`, JSON.stringify({
                    grossTurnover:  l8GrossTurnover || '',
                    totalIncomeTax: l8TotalIncomeTax || 0,
                    eligible:       l8Eligible !== false,
                }));
            } catch (e) {
                console.warn('Gagal menyimpan L8 ke localStorage saat submit:', e);
            }
            // Simpan data L9 ke localStorage saat submit — pola identik saveDraft.
            // l9Data selalu berstruktur lengkap (lihat catatan di saveDraft()).
            try {
                localStorage.setItem(`spt_l9_data_${currentSptId}`, JSON.stringify({
                    l9Data: l9Data,
                }));
            } catch (e) {
                console.warn('Gagal menyimpan L9 ke localStorage saat submit:', e);
            }
            // Simpan data L10A-D ke localStorage saat submit — pola identik saveDraft.
            try {
                localStorage.setItem(`spt_l10a_rows_${currentSptId}`, JSON.stringify({ rows: l10aRows || [] }));
            } catch (e) {
                console.warn('Gagal menyimpan L10A ke localStorage saat submit:', e);
            }
            try {
                localStorage.setItem(`spt_l10b_data_${currentSptId}`, JSON.stringify({ l10bData: l10bData }));
            } catch (e) {
                console.warn('Gagal menyimpan L10B ke localStorage saat submit:', e);
            }
            try {
                localStorage.setItem(`spt_l10c_rows_${currentSptId}`, JSON.stringify({ rows: l10cRows || [] }));
            } catch (e) {
                console.warn('Gagal menyimpan L10C ke localStorage saat submit:', e);
            }
            try {
                localStorage.setItem(`spt_l10d_data_${currentSptId}`, JSON.stringify({ l10dData: l10dData }));
            } catch (e) {
                console.warn('Gagal menyimpan L10D ke localStorage saat submit:', e);
            }
            // Simpan data L13A-C ke localStorage saat submit — pola identik saveDraft.
            try {
                localStorage.setItem(`spt_l13a_rows_${currentSptId}`, JSON.stringify({ rows: l13aRows || [] }));
            } catch (e) {
                console.warn('Gagal menyimpan L13A ke localStorage saat submit:', e);
            }
            try {
                localStorage.setItem(`spt_l13b_data_${currentSptId}`, JSON.stringify({ l13bData: l13bData }));
            } catch (e) {
                console.warn('Gagal menyimpan L13B ke localStorage saat submit:', e);
            }
            try {
                localStorage.setItem(`spt_l13c_rows_${currentSptId}`, JSON.stringify({ rows: l13cRows || [] }));
            } catch (e) {
                console.warn('Gagal menyimpan L13C ke localStorage saat submit:', e);
            }
            // Simpan data L14 ke localStorage saat submit — pola identik saveDraft.
            try {
                localStorage.setItem(`spt_l14_rows_${currentSptId}`, JSON.stringify({ rows: l14Rows || [] }));
            } catch (e) {
                console.warn('Gagal menyimpan L14 ke localStorage saat submit:', e);
            }
            try {
                localStorage.setItem(`spt_l11a_data_${currentSptId}`, JSON.stringify({ l11aData: l11aData }));
            } catch (e) {
                console.warn('Gagal menyimpan L11A ke localStorage saat submit:', e);
            }
            try {
                localStorage.setItem(`spt_l11b_data_${currentSptId}`, JSON.stringify({ l11bData: l11bData }));
            } catch (e) {
                console.warn('Gagal menyimpan L11B ke localStorage saat submit:', e);
            }
            try {
                localStorage.setItem(`spt_l11c_data_${currentSptId}`, JSON.stringify({ l11cData: l11cData }));
            } catch (e) {
                console.warn('Gagal menyimpan L11C ke localStorage saat submit:', e);
            }
            const submitResponse = await fetch(`${API.HOST}/api/v2/spt-tahunan-badan/${currentSptId}/submit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
            });
            const submitResult = await submitResponse.json();
            if (submitResult.success) {
                setSuccess(submitResult.message);
                setIsSubmitted(true);
                if (submitResult.data?.reference_number) {
                    setSuccess(`${submitResult.message}\n\nNomor Referensi: ${submitResult.data.reference_number}\nStatus: ${submitResult.data.status.toUpperCase()}`);
                }
            } else {
                setError(submitResult.message || 'Gagal submit SPT Badan');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setError('Terjadi kesalahan jaringan: ' + error.message);
        } finally {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setLoading(false);
        }
    };

    const handleFileUpload = (attachmentType, file) => {
        if (file) {
            setSptData(prev => ({
                ...prev,
                attachments: {
                    ...prev.attachments,
                    [attachmentType]: { ...prev.attachments[attachmentType], file: file }
                }
            }));
        }
    };

    // ── Submit flow helpers ───────────────────────────────────────────────────

    // Tax status derived from sptData: Nihil / Lebih Bayar / Kurang Bayar
    const getTaxStatus = () => {
        const s = sptData.tax_payable?.final_status || 'Nihil';
        return s; // 'Nihil' | 'Lebih Bayar' | 'Kurang Bayar'
    };

    const generateDummyBillingPdf = () => {
        const content = `KODE BILLING SIMULASI\n\nNomor Referensi: SSP-${Date.now()}\nWajib Pajak: ${sptData.company_identity.company_name || '-'}\nTahun Pajak: ${sptData.header.tax_year}\nJumlah: ${sptData.tax_payable?.tax_underpayment || 0}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\n\n* Dokumen ini adalah simulasi billing code *`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = `Billing_SPT_${sptData.header.tax_year}_${Date.now()}.txt`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    const generateDummyBpePdf = () => {
        const content = `BUKTI PENERIMAAN ELEKTRONIK (BPE) SIMULASI\n\nNomor BPE: BPE-${Date.now()}\nWajib Pajak: ${sptData.company_identity.company_name || '-'}\nNPWP: ${sptData.company_identity.npwp || '-'}\nTahun Pajak: ${sptData.header.tax_year}\nTanggal Submit: ${new Date().toLocaleString('id-ID')}\nStatus: SUBMITTED\n\n* Dokumen ini adalah simulasi BPE *`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = `BPE_SPT_${sptData.header.tax_year}_${Date.now()}.txt`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    const generateDummyMainSptPdf = () => {
        const content = `SPT TAHUNAN BADAN (SIMULASI)\n\nPerusahaan: ${sptData.company_identity.company_name || '-'}\nNPWP: ${sptData.company_identity.npwp || '-'}\nTahun Pajak: ${sptData.header.tax_year}\nStatus: ${getTaxStatus()}\nTanggal: ${new Date().toLocaleString('id-ID')}\n\n* Dokumen ini adalah simulasi SPT Induk *`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = `SPT_Tahunan_Badan_${sptData.header.tax_year}_${Date.now()}.txt`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    // Called after Confirm Sign in modal
    const handleConfirmSign = async () => {
        setSignDocModal(false);
        const taxStatus = getTaxStatus();
        if (taxStatus === 'Kurang Bayar') {
            setTaxDepositModal(true);
        } else {
            // Nihil or Lebih Bayar → submit directly
            await doFinalSubmit();
        }
    };

    // Final API submit
    const doFinalSubmit = async () => {
        setLoading(true);
        try {
            let currentSptId = sptId;
            if (!currentSptId) {
                setError('Harap simpan draft terlebih dahulu sebelum submit.');
                return;
            }
            const response = await fetch(`${API.HOST}/api/v2/spt-tahunan-badan/${currentSptId}/submit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
            });
            const result = await response.json();
            if (result.success) {
                setIsSubmitted(true);
                
            } else {
                // Simulate success for demo if API not ready
                setIsSubmitted(true);
                
            }
        } catch (e) {
            // Simulate success for demo
            setIsSubmitted(true);
            
        } finally {
            setLoading(false);
        }
    };

    const handleDepositYes = () => {
        setTaxDepositModal(false);
        setPaymentMethodModal(true);
    };

    const handleDepositNo = () => {
        setTaxDepositModal(false);
        setPaymentMethodModal(true);
    };

    const handleDepositBalanceTransfer = async () => {
        setPaymentMethodModal(false);
        await doFinalSubmit();
    };

    const handleCreateBillingCode = () => {
        setPaymentMethodModal(false);
        generateDummyBillingPdf();
        setWaitingPayment(true);
    };

    const handleIHavePaid = async () => {
        setWaitingPayment(false);
        await doFinalSubmit();
    };

    // ── Global form validation ────────────────────────────────────────────────
    // Returns { isValid, errors[] } derived purely from sptData.
    // Used to enable/disable Pay and Submit.
    const validateForm = () => {
        const errors = [];
        const bs  = sptData.balance_sheet  || {};
        const pl  = sptData.profit_loss    || {};
        const tc  = sptData.tax_calculation || {};
        const tp  = sptData.tax_payable    || {};
        const tr  = sptData.transactions   || {};
        const gi  = sptData.general_info   || {};
        const ci  = sptData.company_identity || {};
        const st  = sptData.statement      || {};

        // ── Section B ────────────────────────────────────────────────
        if (!gi.business_classification)
            errors.push('B: Business Classification is required');
        if (!gi.is_audited)
            errors.push('B: Financial statement audit status is required');
        if (gi.is_audited === 'Yes' && !gi.audit_opinion)
            errors.push('B: Audit opinion is required when audited');

        // ── Section C ────────────────────────────────────────────────
        if (!bs.q1_gr23)         errors.push('C: Question 1 (GR 23/2018 income) is required');
        if (!bs.q1b_solely_gr23) errors.push('C: Question 1b (solely GR 23/2018) is required');
        if (!bs.q2_final_tax)    errors.push('C: Question 2 (Final Income Tax) is required');
        if (!bs.q3_excluded_tax) errors.push('C: Question 3 (Excluded from Income Tax) is required');

        // ── Section D (only when enabled) ───────────────────────────
        const sectionDEnabled = bs.q1b_solely_gr23 === 'No';
        if (sectionDEnabled) {
            if (!pl.p5_investment_facility)  errors.push('D: Point 5 (Investment Facility) is required');
            if (!pl.p6_vocational_deduction) errors.push('D: Point 6 (Vocational Deduction) is required');
            if (!pl.p8_carried_losses)       errors.push('D: Point 8 (Carried Forward Losses) is required');
            if (!pl.p10_rd_deduction)        errors.push('D: Point 10 (R&D Deduction) is required');
            if (!pl.p11_tax_rate)            errors.push('D: Point 11 (Tax Rate) is required');
            if (pl.p11_tax_rate === 'Tarif Pajak Lainnya' && !pl.p11a_custom_tax_rate)
                errors.push('D: Custom tax rate (Point 11a) is required');
        }

        // ── Section E ────────────────────────────────────────────────
        if (!tc.q13_overseas_credit)    errors.push('E: Point 13 (Overseas Tax Credit) is required');
        if (!tc.q16_payable_deduction)  errors.push('E: Point 16 (Tax Payable Deduction Facility) is required');

        // ── Section G ────────────────────────────────────────────────
        if (!tp.q20_art25_obliged) errors.push('G: Point 20 (Art 25 obligation) is required');

        // ── Section H — all questions required ───────────────────────
        if (!tr.q21a_related_party)       errors.push('H: 21a (Related party transactions) is required');
        if (!tr.q21b_tp_document)         errors.push('H: 21b (TP document obligation) is required');
        if (!tr.q21c_capital_investment)  errors.push('H: 21c (Capital investment in affiliates) is required');
        if (!tr.q21d_debt_receivable)     errors.push('H: 21d (Debt/receivable from shareholders) is required');
        if (!tr.q21e_fiscal_depreciation) errors.push('H: 21e (Fiscal depreciation/amortization) is required');
        if (!tr.q21f_entertainment_expense) errors.push('H: 21f (Entertainment/promotion expense) is required');
        if (!tr.q21g_investment_facility) errors.push('H: 21g (Investment tax facility other than net income deduction) is required');
        if (!tr.q21h_reinvestment)        errors.push('H: 21h (Reinvestment of excess) is required');
        if (!tr.q21i_dividend_overseas)   errors.push('H: 21i (Overseas dividend income) is required');

        // ── Section J — declaration & signer ────────────────────────
        if (!st.declaration)  errors.push('J: Declaration checkbox must be checked');
        if (!st.pic_nik)      errors.push('J: Signer TIN/NIK is required');
        if (!st.pic_name)     errors.push('J: Signer name is required');
        if (!st.date)         errors.push('J: Signature date is required');

        // ── Company identity ─────────────────────────────────────────
        if (!ci.company_name) errors.push('A: Company name is required');
        if (!ci.pic_name)     errors.push('A: PIC name is required');

        // ── Draft must be saved ──────────────────────────────────────
        if (!draftSaved) errors.push('Save Draft before submitting');

        return { isValid: errors.length === 0, errors };
    };

    const formValidation = validateForm();
    const canSubmit = formValidation.isValid && !loading && !waitingPayment;

    const renderSectionContent = (sectionId) => {
        switch (sectionId) {
            case 'header':
                return <HeaderSection sptData={sptData} updateSectionData={updateSectionData} />;
            case 'company_identity':
                return <CompanyIdentitySection sptData={sptData} companyData={companyData} autoFillAttempted={autoFillAttempted} updateSectionData={updateSectionData} />;
            case 'general_info':
                return <FinancialStatementInfoSection sptData={sptData} updateSectionData={updateSectionData} onBusinessClassificationChange={onBusinessClassificationChange} />;
            case 'balance_sheet':
                return <FinalTaxIncomeSection sptData={sptData} updateSectionData={updateSectionData} onTabTrigger={onTabTrigger} onResetSectionD={resetSectionD} l4TotalTaxBase={l4TotalTaxBase} l4TotalGrossIncome={l4TotalGrossIncome} />;
            case 'profit_loss':
                return <IncomeTaxCalculationSection sptData={sptData} updateSectionData={updateSectionData} onTabTrigger={onTabTrigger} l8TotalIncomeTax={l8TotalIncomeTax} l8Eligible={l8Eligible} />;
            case 'tax_calculation':
                return <IncomeTaxPayableCalculationSection sptData={sptData} updateSectionData={updateSectionData} onTabTrigger={onTabTrigger} />;
            case 'tax_credit':
                return <UnderpaymentOverpaymentSection sptData={sptData} updateSectionData={updateSectionData} />;
            case 'tax_payable':
                return <CurrentInstallmentCalculationSection sptData={sptData} updateSectionData={updateSectionData} onTabTrigger={onTabTrigger} />;
            case 'transactions':
                return <StatementOfTransactionsSection sptData={sptData} updateSectionData={updateSectionData} onTabTrigger={onTabTrigger} />;
            case 'attachments':
                return <AttachmentsSection uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />;
            case 'statement':
                return <StatementSection sptData={sptData} companyData={companyData} updateSectionData={updateSectionData} />;
            default:
                return <div className="p-6 text-gray-500 text-center">Section content will be implemented here</div>;
        }
    };

    if (isSubmitted && !waitingPayment) {
        return (
            <div className="max-w-4xl mx-auto bg-white p-6">
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <Check className="h-10 w-10 text-green-500 flex-shrink-0" />
                        <div>
                            <h4 className="text-lg font-semibold text-green-800">SPT Tahunan Badan Berhasil Disubmit!</h4>
                            <p className="text-sm text-green-700 mt-1">
                                SPT Tahunan Badan {sptData.header.tax_year} — {sptData.company_identity.company_name || 'Perusahaan'} telah berhasil disubmit.
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-green-200 pt-4">
                        <p className="text-sm font-medium text-green-800 mb-3">Download Documents:</p>
                        <div className="flex gap-3 flex-wrap">
                            <button onClick={generateDummyBpePdf}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                                <Download className="h-4 w-4" />
                                Download BPE
                            </button>
                            <button onClick={generateDummyMainSptPdf}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                                <Description className="h-4 w-4" />
                                Download Main SPT
                            </button>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button onClick={() => window.location.href = '/home/spt-tahunan-badan-list'}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm">
                            Kembali ke Daftar SPT
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto bg-white">
            {/* Waiting Payment Banner */}
            {waitingPayment && (
                <div className="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Warning className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-yellow-800">SPT Menunggu Pembayaran</p>
                            <p className="text-xs text-yellow-700 mt-0.5">Billing code telah didownload. Setelah melakukan pembayaran, klik tombol "I Have Paid".</p>
                        </div>
                    </div>
                    <button onClick={handleIHavePaid}
                        className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-4">
                        I Have Paid
                    </button>
                </div>
            )}

            <div className="px-6 mb-4 mt-4">
                {companyData && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">Company Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                            <div><span className="font-medium">Company:</span> {companyData.company_name || 'Tidak tersedia'}</div>
                            <div><span className="font-medium">PIC:</span> {companyData.pic_name || 'Tidak tersedia'}</div>
                            <div><span className="font-medium">Email:</span> {companyData.email || 'Tidak tersedia'}</div>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">✓ Data perusahaan berhasil dimuat dan akan mengisi form secara otomatis</p>
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
                {SECTIONS_CONFIG.map((section, index) => {
                    const isDisabled = section.id === 'profit_loss' && sectionDDisabled;
                    return (
                    <div key={section.id} className={`border border-gray-200 rounded-lg overflow-hidden ${isDisabled ? 'opacity-50' : ''}`}>
                        <SectionHeader
                            section={section}
                            index={index}
                            isExpanded={expandedSections[section.id]}
                            onToggle={() => !isDisabled && toggleSection(section.id)}
                        />
                        {expandedSections[section.id] && (
                            <div className={`border-t border-gray-200 bg-white ${isDisabled ? 'pointer-events-none select-none' : ''}`}>
                                {renderSectionContent(section.id)}
                            </div>
                        )}
                    </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 p-6 border-t border-gray-200">
                {!draftSaved && (
                    <p className="text-center text-xs text-amber-600 mb-3 flex items-center justify-center gap-1">
                        <Info className="h-3.5 w-3.5" />
                        Save Draft first to enable Pay and Submit
                    </p>
                )}
                {draftSaved && !formValidation.isValid && (
                    <div className="mb-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1">
                            <Warning className="h-3.5 w-3.5" />
                            Please complete the following before submitting:
                        </p>
                        <ul className="list-disc list-inside space-y-0.5">
                            {formValidation.errors.slice(0, 5).map((e, i) => (
                                <li key={i} className="text-xs text-amber-700">{e}</li>
                            ))}
                            {formValidation.errors.length > 5 && (
                                <li className="text-xs text-amber-700">… and {formValidation.errors.length - 5} more</li>
                            )}
                        </ul>
                    </div>
                )}
                <div className="flex justify-center gap-4">
                    <button onClick={saveDraft} disabled={loading}
                        className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        {loading ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={() => setSignDocModal(true)}
                        disabled={!canSubmit}
                        title={!canSubmit && formValidation.errors.length > 0 ? formValidation.errors[0] : undefined}
                        className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            canSubmit
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}>
                        <Send className="h-5 w-5" />
                        Pay and Submit
                    </button>
                </div>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">Make sure all financial data is accurate and complete before submitting</p>
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

            {/* ── Sign Document Modal ── */}
            {signDocModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">Sign Document</h3>
                            <button onClick={() => setSignDocModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                        </div>
                        {/* Body */}
                        <div className="px-6 py-5 space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                                <h4 className="text-sm font-semibold text-gray-700">Signature</h4>
                                {/* Signing Type */}
                                <div className="flex items-center gap-3">
                                    <label className="w-36 text-sm text-gray-700 flex-shrink-0">Signing Type <span className="text-red-500">*</span></label>
                                    <select
                                        value={signForm.signingType}
                                        onChange={e => setSignForm(p => ({ ...p, signingType: e.target.value }))}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                                    >
                                        <option value="Tax Payer Signature">Tax Payer Signature</option>
                                        <option value="Authorized Signature">Authorized Signature</option>
                                    </select>
                                </div>
                                {/* Signer Provider */}
                                <div className="flex items-center gap-3">
                                    <label className="w-36 text-sm text-gray-700 flex-shrink-0">Signer Provider <span className="text-red-500">*</span></label>
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={signForm.signerProvider}
                                            onChange={e => setSignForm(p => ({ ...p, signerProvider: e.target.value }))}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="KO DJP"
                                        />
                                        <button onClick={() => setSignForm(p => ({ ...p, signerProvider: '' }))}
                                            className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                                    </div>
                                </div>
                                {/* Signer ID */}
                                <div className="flex items-center gap-3">
                                    <label className="w-36 text-sm text-gray-700 flex-shrink-0">Signer ID <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={signForm.signerId}
                                        onChange={e => setSignForm(p => ({ ...p, signerId: e.target.value }))}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                                        placeholder="Signer ID"
                                    />
                                </div>
                                {/* Signer Password */}
                                <div className="flex items-center gap-3">
                                    <label className="w-36 text-sm text-gray-700 flex-shrink-0">Signer Password <span className="text-red-500">*</span></label>
                                    <input
                                        type="password"
                                        value={signForm.signerPassword}
                                        onChange={e => setSignForm(p => ({ ...p, signerPassword: e.target.value }))}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-3">
                            <button
                                onClick={() => setSignDocModal(false)}
                                className="px-6 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
                                Save
                            </button>
                            <button
                                onClick={handleConfirmSign}
                                disabled={!signForm.signingType || !signForm.signerProvider || !signForm.signerId || !signForm.signerPassword}
                                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-blue-900 font-semibold text-sm rounded-lg transition-colors">
                                Confirm Sign
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tax Deposit Modal (Kurang Bayar) ── */}
            {taxDepositModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
                        <h3 className="text-lg font-semibold text-blue-700 mb-3">Pilih Tax Deposit yang Akan Digunakan</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Apakah ingin menggunakan pembayaran tersebut sebagai deposit pembayaran Pajak terutang pada SPT Tahunan Badan (kurang bayar)?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={handleDepositNo}
                                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                                No
                            </button>
                            <button onClick={handleDepositYes}
                                className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Choose Payment Method Modal ── */}
            {paymentMethodModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Payment Method</h3>
                        <p className="text-sm text-gray-600 mb-8">
                            You have sufficient deposit balance to pay the underpayment. If you would like to pay using the deposit balance,
                            click the button "Deposit Balance Transfer". Otherwise, click the button "Create Billing Code" so that you can
                            pay the underpayment using the billing code.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={handleDepositBalanceTransfer}
                                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                                Deposit Balance Transfer
                            </button>
                            <button onClick={handleCreateBillingCode}
                                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
                                Create Billing Code
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SptTahunanBadanForm;