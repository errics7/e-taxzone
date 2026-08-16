import React, { useState, useEffect, useMemo, useRef, useImperativeHandle } from 'react';
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

const SptTahunanBadanForm = React.forwardRef(({ onBusinessClassificationChange, businessClassification, onTabTrigger, sectionDDisabled, onResetSectionD, onSptDataChange, a10Value, l1aRowsA, l1aRowsB, setL1aRowsFromDraft, l1cRowsA, l1cRowsBAset, l1cRowsBLiabEkuitas, setL1cRowsFromDraft, l1dRowsA, l1dRowsBAset, l1dRowsBLiabEkuitas, setL1dRowsFromDraft, l2RowsA, l2RowsB, setL2RowsFromDraft, l3RowsA, l3RowsB, l3PriorYearCreditRefund, setL3RowsFromDraft, l3CreditAmount, l5TotalDifference, l4RowsA, l4RowsB, setL4RowsFromDraft, l5Rows, l5Places, setL5RowsFromDraft, setL5PlacesFromDraft,
    l7Rows, l7TotalCol8ForD8, l7TotalCol9ForL6, setL7RowsFromDraft, setL7TotalCol8FromDraft, setL7TotalCol9FromDraft,
    l6Installment,
    l6IncomeBase, l6PreviousYearTaxCredit, setL6IncomeBaseFromDraft, setL6PreviousYearTaxCreditFromDraft,
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
    onCompanyDataChange, onRegionalBenefitLockChange }, ref) => {
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
    // V3 headerId — reference terpisah dari sptId (V2). sptId TETAP dipakai untuk
    // seluruh flow V2 yang sudah ada (Main Form, dst — tidak diubah). v3HeaderId
    // HANYA dipakai untuk endpoint V3 (saveSection/updateSection L1). Resolve via
    // POST /api/v3/spt/drafts (createDraft) — bukan derivasi dari sptId.
    const [v3HeaderId, setV3HeaderId] = useState(null);
    // Main Form V3 — spt_main_form.id (cardinality "one" per header, BUKAN
    // banyak rows seperti L1). null = belum diketahui/belum ada row; terisi =
    // sudah ada row (PATCH). Diisi dari GET (loadMainFormFromV3) atau dari
    // response POST/PATCH pertama (saveMainFormToV3).
    const [mainFormV3Id, setMainFormV3Id] = useState(null);
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

    // Sync L5 totalDifference (e.15) → Section H 21j (q21j_excess_final_tax) —
    // readonly, pola identik sync l3CreditAmount → E.13 di atas. Section D FINAL
    // DECISION: 21j SELALU berasal dari e.15/totalDifference (BUKAN g.15), TIDAK
    // PERNAH diedit user, TIDAK PERNAH dikirim sebagai raw input ke V3 — hanya
    // ditampilkan readonly, dihitung ulang setiap L5 berubah.
    useEffect(() => {
        const val = parseFloat(l5TotalDifference) || 0;
        setSptData(prev => ({
            ...prev,
            transactions: { ...prev.transactions, q21j_excess_final_tax: val }
        }));
    }, [l5TotalDifference]); // eslint-disable-line react-hooks/exhaustive-deps

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
                // L9–L14 localStorage load DIHAPUS — V3 database (spt_l9..spt_l14)
                // adalah source of truth L9–L14 sekarang (lihat useEffect
                // resolveV3HeaderId → loadL9L14FromV3, bersanding dengan loadL1FromV3..
                // loadL8FromV3). localStorage L9–L14 tidak lagi dipakai sebagai sumber
                // Load Draft (Kontrak §20).
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
                // Return sptId (bukan sekadar `true`) — saveDraft() butuh nilai id
                // secara langsung karena setSptId() di atas belum ter-apply ke state
                // `sptId` pada invocation yang sama (React state update is async).
                // Tetap truthy sehingga caller lama (`if (!created) return false;`)
                // tidak perlu berubah — result.data.id adalah PK auto-increment,
                // tidak pernah 0/falsy.
                return result.data.id;
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

    // ══════════════════════════════════════════════════════════════════════
    // V3 PERSISTENCE — L1 (L1A / L1C / L1D) ONLY
    // ══════════════════════════════════════════════════════════════════════
    // Backend V3 sudah FINAL (tidak diubah). sptId (V2) TETAP dipakai untuk
    // Main Form dan section lain — TIDAK diganti. v3HeaderId adalah reference
    // terpisah, hanya untuk endpoint V3 (createDraft/saveSection/updateSection).

    // Resolve (atau buat baru) V3 draft header untuk SPT (sptId) tertentu.
    // Urutan (CASE 1/2/3 sesuai keputusan arsitektur READ/RESOLVE):
    // 1) state v3HeaderId (in-memory, sesi berjalan) — path tercepat.
    // 2) referensi per-sptId di localStorage (bertahan lintas remount/reload/
    //    login-ulang — key `v3HeaderId:<sptId>`, BUKAN satu key global, supaya
    //    headerId antar-SPT tidak tertukar) — cache lokal saja, BUKAN source
    //    of truth (raw input L1 tetap di database V3).
    // 3) GET /api/v3/spt/drafts/resolve?company_id&tax_year — otoritatif dari
    //    backend. 200 → draft sudah ada, reuse headerId (CASE 2). 404
    //    DRAFT_NOT_FOUND → draft belum ada (CASE 3), lanjut ke create.
    // 4) POST /api/v3/spt/drafts — HANYA dipanggil kalau resolve membuktikan
    //    belum ada draft (CASE 1). Tidak lagi mengandalkan catch(409).
    const resolveV3HeaderId = async (activeSptId) => {
        if (v3HeaderId) return v3HeaderId;

        const storageKey = activeSptId ? `v3HeaderId:${activeSptId}` : null;
        if (storageKey) {
            try {
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    setV3HeaderId(stored);
                    return stored;
                }
            } catch (e) {
                console.warn('Gagal membaca referensi v3HeaderId dari localStorage:', e);
            }
        }

        if (!companyData || !companyData.company_id) {
            throw new Error('company_id belum tersedia (companyData.company_id kosong). Tidak bisa resolve/membuat V3 draft header.');
        }
        if (!sptData?.header?.tax_year) {
            throw new Error('tax_year belum tersedia (sptData.header.tax_year kosong). Tidak bisa resolve/membuat V3 draft header.');
        }

        const persistHeaderId = (headerId) => {
            setV3HeaderId(headerId);
            if (storageKey) {
                try {
                    localStorage.setItem(storageKey, String(headerId));
                } catch (e) {
                    console.warn('Gagal menyimpan referensi v3HeaderId ke localStorage:', e);
                }
            }
        };

        // CASE 2/3 — cek dulu ke database via READ/RESOLVE resmi (bukan CREATE).
        const resolveParams = new URLSearchParams({
            company_id: companyData.company_id,
            tax_year: sptData.header.tax_year,
        });
        const resolveResponse = await fetch(`${API.HOST}/api/v3/spt/drafts/resolve?${resolveParams.toString()}`, {
            method: 'GET',
            headers: { ...getAuthHeaders() },
        });

        if (resolveResponse.ok) {
            // CASE 2 — draft sudah ada di database, reuse headerId-nya.
            const resolveResult = await resolveResponse.json();
            const headerId = resolveResult?.data?.headerId;
            if (!headerId) {
                throw new Error('Response resolve V3 tidak berisi headerId.');
            }
            persistHeaderId(headerId);
            return headerId;
        }

        const resolveResult = await resolveResponse.json().catch(() => null);
        const resolveCode = resolveResult?.error?.code;
        if (resolveResponse.status !== 404 || resolveCode !== 'DRAFT_NOT_FOUND') {
            // Error lain di luar "belum ada draft" — jangan lanjut ke create,
            // laporkan apa adanya.
            const message = resolveResult?.error?.message || 'Gagal resolve V3 draft header.';
            throw new Error(`[${resolveCode || resolveResponse.status}] ${message}`);
        }

        // CASE 3 — draft benar-benar belum ada. Lanjut CREATE (CASE 1).
        const createResponse = await fetch(`${API.HOST}/api/v3/spt/drafts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({
                header: {
                    company_id: companyData.company_id,
                    tax_year: sptData.header.tax_year,
                },
            }),
        });
        const createResult = await createResponse.json();
        if (!createResponse.ok) {
            const code = createResult?.error?.code;
            const message = createResult?.error?.message || 'Gagal membuat V3 draft header.';
            if (code === 'DUPLICATE_DRAFT') {
                // Race condition: draft dibuat oleh tab/request lain di antara
                // resolve (404) dan create ini. Tidak menebak headerId — laporkan
                // eksplisit, BUKAN dianggap sukses. User cukup klik Save Draft
                // lagi (resolve akan menemukannya pada percobaan berikutnya).
                throw new Error(
                    '[DUPLICATE_DRAFT] Draft V3 untuk SPT ini baru saja dibuat oleh proses lain ' +
                    'di antara pengecekan dan pembuatan. Klik Save Draft sekali lagi.'
                );
            }
            throw new Error(`[${code || createResponse.status}] ${message}`);
        }
        const headerId = createResult?.data?.headerId;
        if (!headerId) {
            throw new Error('Response createDraft V3 tidak berisi headerId.');
        }
        persistHeaderId(headerId);
        return headerId;
    };

    // ── L1 V3 Persistence — Load/Read (GET) ──────────────────────────────────
    // Baris DB (spt_l1) → row frontend. Field database → frontend (kebalikan
    // dari payload builder di bawah). Row Bagian A dibedakan dari Bagian B
    // lewat section_code ('A' vs 'B'/'B_ASET'/'B_LIAB_EKUITAS').
    const buildL1DraftRowFromDb = (dbRow, isSectionA) => {
        // BUG 1 FIX: Sequelize DECIMAL(20,2) mengembalikan string bergaya
        // JS/US ("1000000.00" — titik = desimal). String(v) polos meneruskan
        // ".00" itu apa adanya ke row.commercial/nonTaxable/dst. L1a/L1c/L1d
        // (parse()) dibuat untuk string tampilan format Indonesia (titik =
        // ribuan) dan men-strip SEMUA titik + koma, sehingga "1000000.00" →
        // "100000000" (×100). parseFloat() di sini membaca titik sebagai
        // desimal secara benar (standar JS), lalu String(number) hasil
        // parseFloat tidak lagi memiliki titik/koma — aman dikonsumsi oleh
        // parse()/fmt() di L1a/L1c/L1d apa adanya. Nilai di database TIDAK
        // diubah; ini murni normalisasi di titik transformasi READ → frontend.
        const toStr = (v) => {
            if (v === null || v === undefined) return '';
            const n = parseFloat(v);
            return Number.isFinite(n) ? String(n) : '';
        };
        const base = { code: dbRow.account_code, dbId: dbRow.id };
        if (isSectionA) {
            return {
                ...base,
                commercial: toStr(dbRow.commercial_amount),
                nonTaxable: toStr(dbRow.non_taxable_amount),
                finalTax:   toStr(dbRow.final_tax_amount),
                posCorr:    toStr(dbRow.positive_fiscal_correction),
                negCorr:    toStr(dbRow.negative_fiscal_correction),
                corrCode:   dbRow.correction_code || '',
            };
        }
        // Bagian B: commercial_amount adalah satu-satunya raw input asli (lihat
        // buildL1PayloadB) — 4 kolom fiscal correction lain murni persistence
        // normalization (selalu 0), tidak relevan untuk load balik ke UI.
        return { ...base, amount: toStr(dbRow.commercial_amount) };
    };

    // GET satu section (headerId + sectionKey tetap "l1" — L1A/L1C/L1D semua
    // disimpan di tabel spt_l1 yang sama, dibedakan section_type). Filter by
    // section_type dilakukan di sini karena GET section membaca SELURUH baris
    // header tersebut sekaligus (l1A + l1C + l1D bercampur dalam 1 response).
    const loadL1ToUiRows = async (headerId) => {
        const response = await fetch(`${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l1`, {
            method: 'GET',
            headers: { ...getAuthHeaders() },
        });
        const result = await response.json();
        if (!response.ok) {
            const code = result?.error?.code;
            const message = result?.error?.message || 'Gagal memuat data L1 dari V3.';
            throw new Error(`[${code || response.status}] ${message}`);
        }
        const rows = Array.isArray(result?.data?.rows) ? result.data.rows : [];

        const bySectionType = (sectionType) => rows.filter(r => r.section_type === sectionType);
        const byCode = (list, sectionCode, isSectionA) =>
            list.filter(r => r.section_code === sectionCode).map(r => buildL1DraftRowFromDb(r, isSectionA));

        return {
            L1A: {
                A: byCode(bySectionType('L1A'), 'A', true),
                B: byCode(bySectionType('L1A'), 'B', false),
            },
            L1C: {
                A: byCode(bySectionType('L1C'), 'A', true),
                B_ASET: byCode(bySectionType('L1C'), 'B_ASET', false),
                B_LIAB_EKUITAS: byCode(bySectionType('L1C'), 'B_LIAB_EKUITAS', false),
            },
            L1D: {
                A: byCode(bySectionType('L1D'), 'A', true),
                B_ASET: byCode(bySectionType('L1D'), 'B_ASET', false),
                B_LIAB_EKUITAS: byCode(bySectionType('L1D'), 'B_LIAB_EKUITAS', false),
            },
        };
    };

    // Orchestrator load L1 — dipanggil setelah headerId diketahui (createSpt
    // sukses ATAU SPT existing dibuka via URL param). Hydrate React state
    // lewat setter yang SAMA dengan yang dipakai untuk hydrate dbId sesudah
    // save (setL1aRowsFromDraft dkk) — komponen L1a/L1c/L1d men-treat ini
    // sebagai draft restore biasa (mergeRowsWithDraft/mergeRowsBWithDraft).
    const loadL1FromV3 = async (headerId) => {
        if (!headerId) return;
        try {
            const grouped = await loadL1ToUiRows(headerId);
            if (setL1aRowsFromDraft) {
                setL1aRowsFromDraft('A', grouped.L1A.A);
                setL1aRowsFromDraft('B', grouped.L1A.B);
            }
            if (setL1cRowsFromDraft) {
                setL1cRowsFromDraft('A', grouped.L1C.A);
                setL1cRowsFromDraft('B_ASET', grouped.L1C.B_ASET);
                setL1cRowsFromDraft('B_LIAB_EKUITAS', grouped.L1C.B_LIAB_EKUITAS);
            }
            if (setL1dRowsFromDraft) {
                setL1dRowsFromDraft('A', grouped.L1D.A);
                setL1dRowsFromDraft('B_ASET', grouped.L1D.B_ASET);
                setL1dRowsFromDraft('B_LIAB_EKUITAS', grouped.L1D.B_LIAB_EKUITAS);
            }
        } catch (err) {
            console.error('Gagal memuat L1 dari V3:', err);
            setError(prev => prev || `Gagal memuat data L1: ${err.message}`);
        }
    };

    // Trigger resolve + load L1 begitu sptId (SPT sudah diketahui — baik dari
    // URL param SPT existing, maupun setelah createSpt() sukses) DAN
    // companyData (butuh company_id untuk resolve) sama-sama tersedia.
    // Guard `if (v3HeaderId) return` mencegah resolve+load ganda kalau
    // headerId sudah didapat lewat jalur lain (mis. Save Draft pertama yang
    // sedang berjalan bersamaan). Ini yang menutup Test Scenario 4 (Reload):
    // refresh browser → sptId dari URL → effect ini jalan → header existing
    // ditemukan via resolveV3HeaderId → loadL1FromV3 hydrate L1A/L1C/L1D.
    useEffect(() => {
        if (!sptId || !companyData || !companyData.company_id) return;
        if (!sptData?.header?.tax_year) return;
        if (v3HeaderId) return;
        (async () => {
            try {
                const headerId = await resolveV3HeaderId(sptId);
                await loadL1FromV3(headerId);
                await loadMainFormFromV3(headerId);
                await loadL2FromV3(headerId);
                await loadL3FromV3(headerId);
                await loadL4FromV3(headerId);
                await loadL5FromV3(headerId);
                await loadL6FromV3(headerId);
                await loadL7FromV3(headerId);
                await loadL8FromV3(headerId);
                await loadL9L14FromV3(headerId);
                // Restore status confirmed IV.B Regional Benefit (§B6/B8) —
                // HARUS setelah hydration V3 selesai, bukan sebelum. Lihat
                // catatan lengkap di getRegionalBenefitConfirmedFlag di bawah
                // soal kenapa ini localStorage, bukan field DB baru.
                if (onRegionalBenefitLockChange) {
                    onRegionalBenefitLockChange(getRegionalBenefitConfirmedFlag(sptId));
                }
            } catch (err) {
                console.error('Gagal resolve/memuat L1 dari V3 saat SPT dibuka:', err);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sptId, companyData]);

    // ── L1 V3 Persistence — Payload builders ─────────────────────────────────

    const buildL1PayloadA = (row, sectionType) => ({
        section_type: sectionType,
        section_code: 'A',
        account_code: row.code,
        account_name: row.name,
        commercial_amount: Number(row.commercial) || 0,
        non_taxable_amount: Number(row.nonTaxable) || 0,
        final_tax_amount: Number(row.finalTax) || 0,
        positive_fiscal_correction: Number(row.posCorr) || 0,
        negative_fiscal_correction: Number(row.negCorr) || 0,
        correction_code: row.corrCode || null,
    });

    // Bagian B: hanya `amount` (→ commercial_amount) yang merupakan raw input asli.
    // 4 kolom fiscal correction diisi 0 murni sebagai persistence normalization
    // (kolom NOT NULL di DB) — BUKAN input user atau hasil calculation.
    const buildL1PayloadB = (row, sectionType, sectionCode) => ({
        section_type: sectionType,
        section_code: sectionCode,
        account_code: row.code,
        account_name: row.name,
        commercial_amount: Number(row.amount) || 0,
        non_taxable_amount: 0,
        final_tax_amount: 0,
        positive_fiscal_correction: 0,
        negative_fiscal_correction: 0,
        correction_code: null,
    });

    const isL1ARowTouched = (row) =>
        !!(row.commercial || row.nonTaxable || row.finalTax || row.posCorr || row.negCorr || row.corrCode);
    const isL1BRowTouched = (row) => !!row.amount;

    // POST (row.dbId kosong) atau PATCH (row.dbId terisi) satu baris L1.
    // Mengembalikan sectionId (PK spt_l1.id) dari response untuk disimpan sebagai dbId.
    const saveOneL1Row = async (headerId, payload, dbId) => {
        const url = dbId
            ? `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l1/${dbId}`
            : `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l1`;
        const response = await fetch(url, {
            method: dbId ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) {
            const code = result?.error?.code;
            const message = result?.error?.message || 'Gagal menyimpan baris L1.';
            throw new Error(`[${code || response.status}] ${message}`);
        }
        return result?.data?.sectionId ?? dbId ?? null;
    };

    // Simpan satu grup row (mis. l1aRowsA). Hanya row isInput=true DAN
    // (sudah tersentuh ATAU sudah pernah tersimpan) yang dikirim — row default
    // kosong yang belum pernah disave di-skip (tidak mengirim row kosong massal).
    // Kegagalan per-row TIDAK menghentikan row lain, dan row yang gagal
    // dikembalikan apa adanya (data user di state lokal tidak hilang).
    const saveL1RowGroup = async (headerId, rows, sectionType, sectionCode, isSectionA) => {
        if (!Array.isArray(rows) || rows.length === 0) return { rows: rows || [], errors: [] };
        const errors = [];
        const updatedRows = await Promise.all(rows.map(async (row) => {
            if (!row.isInput) return row;
            const touched = isSectionA ? isL1ARowTouched(row) : isL1BRowTouched(row);
            if (!touched && !row.dbId) return row;
            try {
                const payload = isSectionA
                    ? buildL1PayloadA(row, sectionType)
                    : buildL1PayloadB(row, sectionType, sectionCode);
                const sectionId = await saveOneL1Row(headerId, payload, row.dbId);
                return { ...row, dbId: sectionId };
            } catch (err) {
                console.error(`Gagal menyimpan L1 row (${sectionType}/${sectionCode}/${row.code}):`, err);
                errors.push(`${sectionType} ${sectionCode} ${row.code}: ${err.message}`);
                return row;
            }
        }));
        return { rows: updatedRows, errors };
    };

    // Orchestrator utama — dipanggil dari saveDraft(). Menggantikan localStorage
    // L1A/L1C/L1D. Database V3 (spt_l1) menjadi persistence source of truth L1.
    const saveL1ToV3 = async () => {
        const headerId = await resolveV3HeaderId();
        const allErrors = [];

        const [a, b] = await Promise.all([
            saveL1RowGroup(headerId, l1aRowsA, 'L1A', 'A', true),
            saveL1RowGroup(headerId, l1aRowsB, 'L1A', 'B', false),
        ]);
        if (setL1aRowsFromDraft) {
            setL1aRowsFromDraft('A', a.rows);
            setL1aRowsFromDraft('B', b.rows);
        }
        allErrors.push(...a.errors, ...b.errors);

        const [c1, c2, c3] = await Promise.all([
            saveL1RowGroup(headerId, l1cRowsA, 'L1C', 'A', true),
            saveL1RowGroup(headerId, l1cRowsBAset, 'L1C', 'B_ASET', false),
            saveL1RowGroup(headerId, l1cRowsBLiabEkuitas, 'L1C', 'B_LIAB_EKUITAS', false),
        ]);
        if (setL1cRowsFromDraft) {
            setL1cRowsFromDraft('A', c1.rows);
            setL1cRowsFromDraft('B_ASET', c2.rows);
            setL1cRowsFromDraft('B_LIAB_EKUITAS', c3.rows);
        }
        allErrors.push(...c1.errors, ...c2.errors, ...c3.errors);

        const [d1, d2, d3] = await Promise.all([
            saveL1RowGroup(headerId, l1dRowsA, 'L1D', 'A', true),
            saveL1RowGroup(headerId, l1dRowsBAset, 'L1D', 'B_ASET', false),
            saveL1RowGroup(headerId, l1dRowsBLiabEkuitas, 'L1D', 'B_LIAB_EKUITAS', false),
        ]);
        if (setL1dRowsFromDraft) {
            setL1dRowsFromDraft('A', d1.rows);
            setL1dRowsFromDraft('B_ASET', d2.rows);
            setL1dRowsFromDraft('B_LIAB_EKUITAS', d3.rows);
        }
        allErrors.push(...d1.errors, ...d2.errors, ...d3.errors);

        return allErrors;
    };

    // ══════════════════════════════════════════════════════════════════════
    // Main Form V3 Persistence (spt_main_form)
    // ══════════════════════════════════════════════════════════════════════
    // Main Form = SINGLE RECORD per header (cardinality "one"), BUKAN banyak
    // rows seperti L1. HANYA field yang MEMILIKI kolom tujuan di
    // spt_main_form.model.js yang dipetakan di sini (lihat audit + konfirmasi
    // final). Field tanpa kolom tujuan (company_identity.company_type/
    // establishment_date/pic_name/pic_nik/address/business_activity/
    // basic_capital, seluruh `attachments`, seluruh `transactions`/Section H,
    // tax_payable.q20_art25_obliged/q20_art25_amount, statement.declaration)
    // SENGAJA TIDAK disentuh di sini — field-field itu tetap dipersist lewat
    // `sectionsToSave` (V2) seperti sebelumnya, TIDAK dihapus dari sana.
    // Semua field derived/subtotal (total_*, net_*, gross_profit,
    // operating_profit, fiscal_profit, taxable_income, income_tax_payable,
    // tax_underpayment/overpayment, dst) TIDAK PERNAH dikirim — konsisten
    // dengan disiplin raw-input-only L1/L7/L8.

    const yesNoToBool = (v) => (v === 'Yes' ? true : v === 'No' ? false : null);
    const boolToYesNo = (v) => (v === true ? 'Yes' : v === false ? 'No' : '');
    const numOrZero = (v) => (v === null || v === undefined ? 0 : (Number(v) || 0));

    // ── Payload builder: sptData (frontend) → spt_main_form (flat, V3) ──────
    const buildMainFormV3Payload = (data) => {
        const ci = data.company_identity || {};
        const gi = data.general_info || {};
        const bs = data.balance_sheet || {};
        const bsAssetsCur = (bs.assets && bs.assets.current_assets) || {};
        const bsAssetsNonCur = (bs.assets && bs.assets.non_current_assets) || {};
        const bsLiabCur = (bs.liabilities && bs.liabilities.current_liabilities) || {};
        const bsLiabNonCur = (bs.liabilities && bs.liabilities.non_current_liabilities) || {};
        const bsEquity = bs.equity || {};
        const pl = data.profit_loss || {};
        const plRev = pl.revenue || {};
        const plCogs = pl.cost_of_goods_sold || {};
        const plOpex = pl.operating_expenses || {};
        const plOther = pl.other_income_expenses || {};
        const tc = data.tax_calculation || {};
        const tcFiscal = tc.fiscal_adjustments || {};
        const tcr = data.tax_credit || {};
        const st = data.statement || {};
        const tr = data.transactions || {};

        return {
            business_name: ci.company_name || null,
            taxpayer_npwp: ci.npwp || null,
            company_email: ci.email || null,
            company_phone: ci.phone || null,

            business_status: gi.business_status || null,
            business_classification: gi.business_classification || null,
            bookkeeping_standard: gi.bookkeeping_standard || null,
            reporting_currency: gi.reporting_currency || null,
            financial_year_start: gi.financial_year_start || null,
            financial_year_end: gi.financial_year_end || null,
            is_audited: yesNoToBool(gi.is_audited),
            audit_opinion: gi.audit_opinion || null,
            kap_npwp: gi.kap_npwp || null,
            kap_name: gi.kap_name || null,

            has_gr23_income: yesNoToBool(bs.q1_gr23),
            gr23_income_solely: yesNoToBool(bs.q1b_solely_gr23),
            has_final_tax_income: yesNoToBool(bs.q2_final_tax),
            has_excluded_income: yesNoToBool(bs.q3_excluded_tax),
            cash_and_cash_equivalents: numOrZero(bsAssetsCur.cash_and_cash_equivalents),
            trade_receivables: numOrZero(bsAssetsCur.trade_receivables),
            inventory: numOrZero(bsAssetsCur.inventory),
            prepaid_expenses: numOrZero(bsAssetsCur.prepaid_expenses),
            other_current_assets: numOrZero(bsAssetsCur.other_current_assets),
            fixed_assets: numOrZero(bsAssetsNonCur.fixed_assets),
            accumulated_depreciation: numOrZero(bsAssetsNonCur.accumulated_depreciation),
            intangible_assets: numOrZero(bsAssetsNonCur.intangible_assets),
            investment: numOrZero(bsAssetsNonCur.investment),
            other_non_current_assets: numOrZero(bsAssetsNonCur.other_non_current_assets),
            trade_payables: numOrZero(bsLiabCur.trade_payables),
            short_term_debt: numOrZero(bsLiabCur.short_term_debt),
            tax_payable: numOrZero(bsLiabCur.tax_payable),
            accrued_expenses: numOrZero(bsLiabCur.accrued_expenses),
            other_current_liabilities: numOrZero(bsLiabCur.other_current_liabilities),
            long_term_debt: numOrZero(bsLiabNonCur.long_term_debt),
            deferred_tax_liability: numOrZero(bsLiabNonCur.deferred_tax_liability),
            other_non_current_liabilities: numOrZero(bsLiabNonCur.other_non_current_liabilities),
            paid_up_capital: numOrZero(bsEquity.paid_up_capital),
            retained_earnings: numOrZero(bsEquity.retained_earnings),
            current_year_profit: numOrZero(bsEquity.current_year_profit),
            other_equity: numOrZero(bsEquity.other_equity),

            gross_revenue: numOrZero(plRev.gross_revenue),
            sales_returns: numOrZero(plRev.sales_returns),
            sales_discount: numOrZero(plRev.sales_discount),
            beginning_inventory: numOrZero(plCogs.beginning_inventory),
            purchases: numOrZero(plCogs.purchases),
            direct_labor: numOrZero(plCogs.direct_labor),
            factory_overhead: numOrZero(plCogs.factory_overhead),
            ending_inventory: numOrZero(plCogs.ending_inventory),
            selling_expenses: numOrZero(plOpex.selling_expenses),
            administrative_expenses: numOrZero(plOpex.administrative_expenses),
            general_expenses: numOrZero(plOpex.general_expenses),
            interest_income: numOrZero(plOther.interest_income),
            dividend_income: numOrZero(plOther.dividend_income),
            other_income: numOrZero(plOther.other_income),
            interest_expense: numOrZero(plOther.interest_expense),
            other_expenses: numOrZero(plOther.other_expenses),
            tax_expense: numOrZero(pl.tax_expense),
            investment_facility: yesNoToBool(pl.p5_investment_facility),
            p5_investment_facility_amount: numOrZero(pl.p5_investment_facility_amount),
            vocational_deduction_facility: yesNoToBool(pl.p6_vocational_deduction),
            p6_vocational_deduction_amount: numOrZero(pl.p6_vocational_deduction_amount),
            carried_forward_losses: yesNoToBool(pl.p8_carried_losses),
            p8_carried_losses: numOrZero(pl.p8_carried_forward_losses),
            rd_deduction_facility: yesNoToBool(pl.p10_rd_deduction),
            p10_rd_deduction_amount: numOrZero(pl.p10_rd_deduction_amount),
            // DISETUJUI: p11_tax_rate (string label kategori tarif) → tax_rate_type.
            // Kolom p11_tax_rate (DECIMAL) SENGAJA tidak diisi dari mapping ini.
            tax_rate_type: pl.p11_tax_rate || null,
            p11a_custom_tax_rate: (pl.p11a_custom_tax_rate !== '' && pl.p11a_custom_tax_rate !== null && pl.p11a_custom_tax_rate !== undefined)
                ? (Number(pl.p11a_custom_tax_rate) || 0)
                : null,

            commercial_profit: numOrZero(tc.commercial_profit),
            positive_fiscal_corrections: numOrZero(tcFiscal.positive_corrections),
            negative_fiscal_corrections: numOrZero(tcFiscal.negative_corrections),
            overseas_tax_credit_requested: yesNoToBool(tc.q13_overseas_credit),
            q13_overseas_credit: numOrZero(tc.q13_overseas_credit_amount),
            p14_installment_art25: numOrZero(tc.p14_installment_art25),
            p15_notice_art25: numOrZero(tc.p15_notice_art25),
            payable_deduction_requested: yesNoToBool(tc.q16_payable_deduction),
            q16_payable_deduction: numOrZero(tc.q16_payable_deduction_amount),

            withholding_tax_article_23: numOrZero(tcr.withholding_tax_article_23),
            withholding_tax_article_22: numOrZero(tcr.withholding_tax_article_22),
            withholding_tax_article_26: numOrZero(tcr.withholding_tax_article_26),
            installment_article_25: numOrZero(tcr.installment_article_25),
            overpayment_previous_year: numOrZero(tcr.overpayment_previous_year),
            foreign_tax_credit: numOrZero(tcr.foreign_tax_credit),
            p17b_has_postponement: yesNoToBool(tcr.p17b_has_postponement),
            p17b_postponement_amount: numOrZero(tcr.p17b_postponement_amount),
            p18a_previous_underpayment: numOrZero(tcr.p18a_previous_underpayment),
            p19a_refund_method: tcr.p19a_refund_method || null,
            p19b_bank_account: tcr.p19b_bank_account || null,
            p19b_account_no: tcr.p19b_account_no || null,
            p19b_bank_name: tcr.p19b_bank_name || null,
            p19b_account_holder: tcr.p19b_account_holder || null,

            // DISETUJUI: company_name/pic_name/pic_nik dari grup `statement`
            // (bukan `company_identity`) agar tidak dobel-mapping. `declaration`
            // (checkbox boolean) SENGAJA TIDAK dikirim — kolom bertipe TEXT.
            signature: st.signature || null,
            company_name: st.company_name || null,
            pic_name: st.pic_name || null,
            pic_nik: st.pic_nik || null,
            position: st.position || null,
            date: st.date || null,
            stamp: st.stamp || null,

            // Section H (21a-21i) — raw input, Yes/No/'' -> boolean/null. 21j
            // (q21j_excess_final_tax) SENGAJA TIDAK dikirim — derived dari L5
            // e.15/totalDifference, tidak pernah raw input (Section D FINAL
            // DECISION).
            has_related_party_transactions: yesNoToBool(tr.q21a_related_party),
            has_transfer_pricing_documentation: yesNoToBool(tr.q21b_tp_document),
            has_affiliated_capital_investment: yesNoToBool(tr.q21c_capital_investment),
            has_affiliated_debt_or_receivable: yesNoToBool(tr.q21d_debt_receivable),
            has_fiscal_depreciation_amortization: yesNoToBool(tr.q21e_fiscal_depreciation),
            has_entertainment_promotion_bad_debt_expense: yesNoToBool(tr.q21f_entertainment_expense),
            has_investment_tax_facility: yesNoToBool(tr.q21g_investment_facility),
            has_reinvestment: yesNoToBool(tr.q21h_reinvestment),
            has_overseas_dividend_income: yesNoToBool(tr.q21i_dividend_overseas),
        };
    };

    // ── Reverse mapping: spt_main_form (V3, flat) → sptData (frontend) ──────
    // Kebalikan PERSIS dari buildMainFormV3Payload di atas. Field tanpa
    // kolom V3 TIDAK disentuh di sini (tetap dari V2/state existing).
    const applyMainFormV3Record = (record) => {
        if (!record) return;
        setSptData(prev => ({
            ...prev,
            company_identity: {
                ...prev.company_identity,
                company_name: record.business_name ?? prev.company_identity.company_name,
                npwp: record.taxpayer_npwp ?? prev.company_identity.npwp,
                email: record.company_email ?? prev.company_identity.email,
                phone: record.company_phone ?? prev.company_identity.phone,
            },
            general_info: {
                ...prev.general_info,
                business_status: record.business_status ?? prev.general_info.business_status,
                business_classification: record.business_classification ?? prev.general_info.business_classification,
                bookkeeping_standard: record.bookkeeping_standard ?? prev.general_info.bookkeeping_standard,
                reporting_currency: record.reporting_currency ?? prev.general_info.reporting_currency,
                financial_year_start: record.financial_year_start ?? prev.general_info.financial_year_start,
                financial_year_end: record.financial_year_end ?? prev.general_info.financial_year_end,
                is_audited: (record.is_audited === null || record.is_audited === undefined)
                    ? prev.general_info.is_audited : boolToYesNo(record.is_audited),
                audit_opinion: record.audit_opinion ?? prev.general_info.audit_opinion,
                kap_npwp: record.kap_npwp ?? prev.general_info.kap_npwp,
                kap_name: record.kap_name ?? prev.general_info.kap_name,
            },
            balance_sheet: {
                ...prev.balance_sheet,
                q1_gr23: (record.has_gr23_income === null || record.has_gr23_income === undefined)
                    ? prev.balance_sheet.q1_gr23 : boolToYesNo(record.has_gr23_income),
                q1b_solely_gr23: (record.gr23_income_solely === null || record.gr23_income_solely === undefined)
                    ? prev.balance_sheet.q1b_solely_gr23 : boolToYesNo(record.gr23_income_solely),
                q2_final_tax: (record.has_final_tax_income === null || record.has_final_tax_income === undefined)
                    ? prev.balance_sheet.q2_final_tax : boolToYesNo(record.has_final_tax_income),
                q3_excluded_tax: (record.has_excluded_income === null || record.has_excluded_income === undefined)
                    ? prev.balance_sheet.q3_excluded_tax : boolToYesNo(record.has_excluded_income),
                assets: {
                    ...prev.balance_sheet.assets,
                    current_assets: {
                        ...prev.balance_sheet.assets.current_assets,
                        cash_and_cash_equivalents: numOrZero(record.cash_and_cash_equivalents),
                        trade_receivables: numOrZero(record.trade_receivables),
                        inventory: numOrZero(record.inventory),
                        prepaid_expenses: numOrZero(record.prepaid_expenses),
                        other_current_assets: numOrZero(record.other_current_assets),
                    },
                    non_current_assets: {
                        ...prev.balance_sheet.assets.non_current_assets,
                        fixed_assets: numOrZero(record.fixed_assets),
                        accumulated_depreciation: numOrZero(record.accumulated_depreciation),
                        intangible_assets: numOrZero(record.intangible_assets),
                        investment: numOrZero(record.investment),
                        other_non_current_assets: numOrZero(record.other_non_current_assets),
                    },
                },
                liabilities: {
                    ...prev.balance_sheet.liabilities,
                    current_liabilities: {
                        ...prev.balance_sheet.liabilities.current_liabilities,
                        trade_payables: numOrZero(record.trade_payables),
                        short_term_debt: numOrZero(record.short_term_debt),
                        accrued_expenses: numOrZero(record.accrued_expenses),
                        tax_payable: numOrZero(record.tax_payable),
                        other_current_liabilities: numOrZero(record.other_current_liabilities),
                    },
                    non_current_liabilities: {
                        ...prev.balance_sheet.liabilities.non_current_liabilities,
                        long_term_debt: numOrZero(record.long_term_debt),
                        deferred_tax_liability: numOrZero(record.deferred_tax_liability),
                        other_non_current_liabilities: numOrZero(record.other_non_current_liabilities),
                    },
                },
                equity: {
                    ...prev.balance_sheet.equity,
                    paid_up_capital: numOrZero(record.paid_up_capital),
                    retained_earnings: numOrZero(record.retained_earnings),
                    current_year_profit: numOrZero(record.current_year_profit),
                    other_equity: numOrZero(record.other_equity),
                },
            },
            profit_loss: {
                ...prev.profit_loss,
                revenue: {
                    ...prev.profit_loss.revenue,
                    gross_revenue: numOrZero(record.gross_revenue),
                    sales_returns: numOrZero(record.sales_returns),
                    sales_discount: numOrZero(record.sales_discount),
                },
                cost_of_goods_sold: {
                    ...prev.profit_loss.cost_of_goods_sold,
                    beginning_inventory: numOrZero(record.beginning_inventory),
                    purchases: numOrZero(record.purchases),
                    direct_labor: numOrZero(record.direct_labor),
                    factory_overhead: numOrZero(record.factory_overhead),
                    ending_inventory: numOrZero(record.ending_inventory),
                },
                operating_expenses: {
                    ...prev.profit_loss.operating_expenses,
                    selling_expenses: numOrZero(record.selling_expenses),
                    administrative_expenses: numOrZero(record.administrative_expenses),
                    general_expenses: numOrZero(record.general_expenses),
                },
                other_income_expenses: {
                    ...prev.profit_loss.other_income_expenses,
                    interest_income: numOrZero(record.interest_income),
                    dividend_income: numOrZero(record.dividend_income),
                    other_income: numOrZero(record.other_income),
                    interest_expense: numOrZero(record.interest_expense),
                    other_expenses: numOrZero(record.other_expenses),
                },
                tax_expense: numOrZero(record.tax_expense),
                p5_investment_facility: (record.investment_facility === null || record.investment_facility === undefined)
                    ? prev.profit_loss.p5_investment_facility : boolToYesNo(record.investment_facility),
                p5_investment_facility_amount: numOrZero(record.p5_investment_facility_amount),
                p6_vocational_deduction: (record.vocational_deduction_facility === null || record.vocational_deduction_facility === undefined)
                    ? prev.profit_loss.p6_vocational_deduction : boolToYesNo(record.vocational_deduction_facility),
                p6_vocational_deduction_amount: numOrZero(record.p6_vocational_deduction_amount),
                p8_carried_losses: (record.carried_forward_losses === null || record.carried_forward_losses === undefined)
                    ? prev.profit_loss.p8_carried_losses : boolToYesNo(record.carried_forward_losses),
                p8_carried_forward_losses: numOrZero(record.p8_carried_losses),
                p10_rd_deduction: (record.rd_deduction_facility === null || record.rd_deduction_facility === undefined)
                    ? prev.profit_loss.p10_rd_deduction : boolToYesNo(record.rd_deduction_facility),
                p10_rd_deduction_amount: numOrZero(record.p10_rd_deduction_amount),
                p11_tax_rate: record.tax_rate_type ?? prev.profit_loss.p11_tax_rate,
                p11a_custom_tax_rate: (record.p11a_custom_tax_rate === null || record.p11a_custom_tax_rate === undefined)
                    ? prev.profit_loss.p11a_custom_tax_rate : String(record.p11a_custom_tax_rate),
            },
            tax_calculation: {
                ...prev.tax_calculation,
                commercial_profit: numOrZero(record.commercial_profit),
                fiscal_adjustments: {
                    ...prev.tax_calculation.fiscal_adjustments,
                    positive_corrections: numOrZero(record.positive_fiscal_corrections),
                    negative_corrections: numOrZero(record.negative_fiscal_corrections),
                },
                q13_overseas_credit: (record.overseas_tax_credit_requested === null || record.overseas_tax_credit_requested === undefined)
                    ? prev.tax_calculation.q13_overseas_credit : boolToYesNo(record.overseas_tax_credit_requested),
                q13_overseas_credit_amount: numOrZero(record.q13_overseas_credit),
                p14_installment_art25: numOrZero(record.p14_installment_art25),
                p15_notice_art25: numOrZero(record.p15_notice_art25),
                q16_payable_deduction: (record.payable_deduction_requested === null || record.payable_deduction_requested === undefined)
                    ? prev.tax_calculation.q16_payable_deduction : boolToYesNo(record.payable_deduction_requested),
                q16_payable_deduction_amount: numOrZero(record.q16_payable_deduction),
            },
            tax_credit: {
                ...prev.tax_credit,
                withholding_tax_article_23: numOrZero(record.withholding_tax_article_23),
                withholding_tax_article_22: numOrZero(record.withholding_tax_article_22),
                withholding_tax_article_26: numOrZero(record.withholding_tax_article_26),
                installment_article_25: numOrZero(record.installment_article_25),
                overpayment_previous_year: numOrZero(record.overpayment_previous_year),
                foreign_tax_credit: numOrZero(record.foreign_tax_credit),
                p17b_has_postponement: (record.p17b_has_postponement === null || record.p17b_has_postponement === undefined)
                    ? prev.tax_credit.p17b_has_postponement : boolToYesNo(record.p17b_has_postponement),
                p17b_postponement_amount: numOrZero(record.p17b_postponement_amount),
                p18a_previous_underpayment: numOrZero(record.p18a_previous_underpayment),
                p19a_refund_method: record.p19a_refund_method ?? prev.tax_credit.p19a_refund_method,
                p19b_bank_account: record.p19b_bank_account ?? prev.tax_credit.p19b_bank_account,
                p19b_account_no: record.p19b_account_no ?? prev.tax_credit.p19b_account_no,
                p19b_bank_name: record.p19b_bank_name ?? prev.tax_credit.p19b_bank_name,
                p19b_account_holder: record.p19b_account_holder ?? prev.tax_credit.p19b_account_holder,
            },
            statement: {
                ...prev.statement,
                // declaration TIDAK direstore dari V3 (unmapped — lihat catatan
                // di buildMainFormV3Payload).
                signature: record.signature ?? prev.statement.signature,
                company_name: record.company_name ?? prev.statement.company_name,
                pic_name: record.pic_name ?? prev.statement.pic_name,
                pic_nik: record.pic_nik ?? prev.statement.pic_nik,
                position: record.position ?? prev.statement.position,
                date: record.date ?? prev.statement.date,
                stamp: record.stamp ?? prev.statement.stamp,
            },
            transactions: {
                ...prev.transactions,
                // 21j (q21j_excess_final_tax) SENGAJA TIDAK direstore dari sini
                // — selalu dihitung ulang dari L5 (live) via sync effect
                // l5TotalDifference, tidak pernah disimpan/dibaca sebagai raw
                // field (Section D FINAL DECISION).
                q21a_related_party: (record.has_related_party_transactions === null || record.has_related_party_transactions === undefined)
                    ? prev.transactions.q21a_related_party : boolToYesNo(record.has_related_party_transactions),
                q21b_tp_document: (record.has_transfer_pricing_documentation === null || record.has_transfer_pricing_documentation === undefined)
                    ? prev.transactions.q21b_tp_document : boolToYesNo(record.has_transfer_pricing_documentation),
                q21c_capital_investment: (record.has_affiliated_capital_investment === null || record.has_affiliated_capital_investment === undefined)
                    ? prev.transactions.q21c_capital_investment : boolToYesNo(record.has_affiliated_capital_investment),
                q21d_debt_receivable: (record.has_affiliated_debt_or_receivable === null || record.has_affiliated_debt_or_receivable === undefined)
                    ? prev.transactions.q21d_debt_receivable : boolToYesNo(record.has_affiliated_debt_or_receivable),
                q21e_fiscal_depreciation: (record.has_fiscal_depreciation_amortization === null || record.has_fiscal_depreciation_amortization === undefined)
                    ? prev.transactions.q21e_fiscal_depreciation : boolToYesNo(record.has_fiscal_depreciation_amortization),
                q21f_entertainment_expense: (record.has_entertainment_promotion_bad_debt_expense === null || record.has_entertainment_promotion_bad_debt_expense === undefined)
                    ? prev.transactions.q21f_entertainment_expense : boolToYesNo(record.has_entertainment_promotion_bad_debt_expense),
                q21g_investment_facility: (record.has_investment_tax_facility === null || record.has_investment_tax_facility === undefined)
                    ? prev.transactions.q21g_investment_facility : boolToYesNo(record.has_investment_tax_facility),
                q21h_reinvestment: (record.has_reinvestment === null || record.has_reinvestment === undefined)
                    ? prev.transactions.q21h_reinvestment : boolToYesNo(record.has_reinvestment),
                q21i_dividend_overseas: (record.has_overseas_dividend_income === null || record.has_overseas_dividend_income === undefined)
                    ? prev.transactions.q21i_dividend_overseas : boolToYesNo(record.has_overseas_dividend_income),
            },
        }));
    };

    // GET record Main Form dari V3 (cardinality "one" — 0 atau 1 baris).
    const getMainFormRecordFromV3 = async (headerId) => {
        const response = await fetch(`${API.HOST}/api/v3/spt/drafts/${headerId}/sections/mainForm`, {
            method: 'GET',
            headers: { ...getAuthHeaders() },
        });
        const result = await response.json();
        if (!response.ok) {
            const code = result?.error?.code;
            const message = result?.error?.message || 'Gagal memuat Main Form dari V3.';
            throw new Error(`[${code || response.status}] ${message}`);
        }
        const rows = Array.isArray(result?.data?.rows) ? result.data.rows : [];
        return rows.length > 0 ? rows[0] : null;
    };

    // Orchestrator load Main Form — dipanggil sejalan dengan loadL1FromV3
    // (headerId sudah diketahui, dari resolveV3HeaderId yang sama).
    const loadMainFormFromV3 = async (headerId) => {
        if (!headerId) return;
        try {
            const record = await getMainFormRecordFromV3(headerId);
            if (record) {
                setMainFormV3Id(record.id ?? null);
                applyMainFormV3Record(record);
            }
        } catch (err) {
            console.error('Gagal memuat Main Form dari V3:', err);
            setError(prev => prev || `Gagal memuat Main Form: ${err.message}`);
        }
    };

    // Orchestrator save Main Form — dipanggil dari saveDraft(), sejalan dengan
    // saveL1ToV3(). Main Form = SATU record per header (cardinality "one").
    // mainFormV3Id (state) dipakai sebagai penanda "sudah ada row" → PATCH;
    // kalau belum diketahui, GET dulu untuk memastikan (createDraft() di
    // Service V3 sudah membuat row mainForm kosong saat header dibuat, jadi
    // POST di sini murni fallback defensif bila record ternyata belum ada).
    const saveMainFormToV3 = async (headerId) => {
        const payload = buildMainFormV3Payload(sptData);
        let mainFormId = mainFormV3Id;
        if (!mainFormId) {
            try {
                const existing = await getMainFormRecordFromV3(headerId);
                if (existing) mainFormId = existing.id;
            } catch (err) {
                console.error('Gagal cek existing Main Form V3 sebelum save:', err);
            }
        }
        const url = mainFormId
            ? `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/mainForm/${mainFormId}`
            : `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/mainForm`;
        const response = await fetch(url, {
            method: mainFormId ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) {
            const code = result?.error?.code;
            const message = result?.error?.message || 'Gagal menyimpan Main Form ke V3.';
            throw new Error(`[${code || response.status}] ${message}`);
        }
        const savedId = result?.data?.sectionId ?? mainFormId ?? null;
        if (savedId) setMainFormV3Id(savedId);
        return [];
    };

    // ══════════════════════════════════════════════════════════════════════
    // L2–L8 V3 Persistence — shared helpers
    // ══════════════════════════════════════════════════════════════════════
    // toStrDec — identik dengan fix Bug 1 L1 (toStr): Sequelize DECIMAL
    // kembali sebagai string gaya JS ("1000000.00"). parseFloat membaca titik
    // sebagai desimal secara benar, lalu String(number) menghasilkan string
    // digit-only yang aman dikonsumsi RpField/parse() di komponen L2-L8 (pola
    // fmt/parse identik L1a.js).
    const toStrDec = (v) => {
        if (v === null || v === undefined) return '';
        const n = parseFloat(v);
        return Number.isFinite(n) ? String(n) : '';
    };
    // numOrNull — untuk field opsional (persentase, tahun) di mana '' (belum
    // diisi user) HARUS tetap NULL di database, BUKAN 0. Beda dari numOrZero
    // yang dipakai untuk field Rupiah (kosong = 0 secara bisnis).
    const numOrNull = (v) => (v === '' || v === null || v === undefined ? null : (Number(v) || 0));
    const intOrNull = (v) => (v === '' || v === null || v === undefined ? null : (parseInt(v, 10) || null));

    // ── L2 (spt_l2) — Part A (section_type PART_A) & Part B (PART_B) share table ──
    const buildL2PayloadA = (row) => ({
        section_type: 'PART_A',
        npwp_tin: row.npwp || null,
        name: row.name || null,
        position: row.position || null,
        country_code: row.countryCode || null,
        paid_capital_amount: numOrZero(row.paidCapitalRp),
        paid_capital_percentage: numOrNull(row.paidCapitalPercent),
        dividend_amount: numOrZero(row.dividendRp),
    });
    const buildL2PayloadB = (row) => ({
        section_type: 'PART_B',
        npwp_tin: row.npwp || null,
        name: row.name || null,
        country_code: row.countryCode || null,
        investment_amount: numOrZero(row.investmentRp),
        investment_percentage: numOrNull(row.investmentPercent),
        debt_amount: numOrZero(row.debtRp),
        debt_year: intOrNull(row.debtYear),
        debt_interest_percentage: numOrNull(row.debtInterestPercent),
        receivable_amount: numOrZero(row.receivableRp),
        receivable_year: intOrNull(row.receivableYear),
        receivable_interest_percentage: numOrNull(row.receivableInterestPercent),
    });
    const buildL2RowFromDb = (dbRow, isSectionA) => {
        const base = {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `l2_${dbRow.id}`,
            dbId: dbRow.id,
            npwp: dbRow.npwp_tin || '',
            name: dbRow.name || '',
            countryCode: dbRow.country_code || '',
        };
        if (isSectionA) {
            return {
                ...base,
                position: dbRow.position || '',
                paidCapitalRp: toStrDec(dbRow.paid_capital_amount),
                paidCapitalPercent: toStrDec(dbRow.paid_capital_percentage),
                dividendRp: toStrDec(dbRow.dividend_amount),
            };
        }
        return {
            ...base,
            investmentRp: toStrDec(dbRow.investment_amount),
            investmentPercent: toStrDec(dbRow.investment_percentage),
            debtRp: toStrDec(dbRow.debt_amount),
            debtYear: dbRow.debt_year != null ? String(dbRow.debt_year) : '',
            debtInterestPercent: toStrDec(dbRow.debt_interest_percentage),
            receivableRp: toStrDec(dbRow.receivable_amount),
            receivableYear: dbRow.receivable_year != null ? String(dbRow.receivable_year) : '',
            receivableInterestPercent: toStrDec(dbRow.receivable_interest_percentage),
        };
    };

    const saveManyRowsToV3 = async (headerId, sectionKey, rows, buildPayload) => {
        const errors = [];
        for (const row of rows) {
            try {
                const payload = buildPayload(row);
                const url = row.dbId
                    ? `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/${sectionKey}/${row.dbId}`
                    : `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/${sectionKey}`;
                const response = await fetch(url, {
                    method: row.dbId ? 'PATCH' : 'POST',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                    body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (!response.ok) {
                    const code = result?.error?.code;
                    errors.push(`${sectionKey}${row.dbId ? `/${row.dbId}` : ''}: [${code || response.status}] ${result?.error?.message || 'gagal disimpan'}`);
                    continue;
                }
                const newId = result?.data?.sectionId;
                if (newId && !row.dbId) row.dbId = newId; // mutate in place so caller's setXRowsFromDraft gets it
            } catch (err) {
                errors.push(`${sectionKey}: ${err.message}`);
            }
        }
        return errors;
    };

    // ── Parent-scoped rows (FIX — audit 2) ──────────────────────────────
    // saveManyRowsToV3 sendiri TIDAK tahu apa-apa soal parent FK — ia hanya
    // memanggil buildPayload(row) apa adanya. Untuk section yang child-nya
    // butuh parent FK (l9Asset→l9_id, l11aRegionalFacility→regional_benefit_id,
    // l11bDebtBalance/EquityBalance/BorrowingCost→l11b_id,
    // l13bAgreement/SectionB/Rd→l13b_id), FK HARUS datang dari parentDbId
    // hasil resolve/create parent — BUKAN dari row.id (row.id = frontend/UI
    // identity, row.dbId = DB primary key milik row itu sendiri, keduanya
    // bukan parent FK). Guard eksplisit: kalau parentDbId belum ada (parent
    // gagal disimpan), child DIBATALKAN dengan error jelas — bukan dikirim
    // tanpa FK (itulah sumber SECTION_NOT_FOUND sebelumnya).
    const saveParentScopedRowsToV3 = async (headerId, sectionKey, parentDbId, parentKey, rows, buildPayload) => {
        if (!parentDbId) {
            return [`${sectionKey}: parent (${parentKey}) belum tersimpan — parentDbId kosong, child dibatalkan untuk mencegah SECTION_NOT_FOUND.`];
        }
        const wrappedBuild = (row) => ({ [parentKey]: parentDbId, ...buildPayload(row) });
        return await saveManyRowsToV3(headerId, sectionKey, rows, wrappedBuild);
    };

    const getManyRowsFromV3 = async (headerId, sectionKey) => {
        const response = await fetch(`${API.HOST}/api/v3/spt/drafts/${headerId}/sections/${sectionKey}`, {
            method: 'GET',
            headers: { ...getAuthHeaders() },
        });
        const result = await response.json();
        if (!response.ok) {
            const code = result?.error?.code;
            throw new Error(`[${code || response.status}] ${result?.error?.message || `Gagal memuat ${sectionKey} dari V3.`}`);
        }
        return Array.isArray(result?.data?.rows) ? result.data.rows : [];
    };

    // ── Hard delete (Section G FINAL DECISION) ───────────────────────────
    // Baris yang di-Delete user di UI tidak lagi ada di currentRows saat
    // Save Draft dijalankan — GET dbRows terbaru, cari dbId yang ADA di DB
    // tapi TIDAK ADA lagi di currentRows, lalu DELETE fisik baris tersebut.
    // Bukan soft delete (deleted_at) — physical row removal sesuai keputusan
    // final. excludeDbIds opsional untuk baris yang sengaja dikelola terpisah
    // (mis. L3 PRIOR_YEAR_ADJUSTMENT, bukan bagian dari rows array biasa).
    const deleteRemovedRowsFromV3 = async (headerId, sectionKey, currentRows, excludeDbIds = []) => {
        const errors = [];
        try {
            const dbRows = await getManyRowsFromV3(headerId, sectionKey);
            const keepIds = new Set([
                ...currentRows.map(r => r.dbId).filter(Boolean),
                ...excludeDbIds.filter(Boolean),
            ]);
            const toDelete = dbRows.filter(r => !keepIds.has(r.id));
            for (const dbRow of toDelete) {
                try {
                    const response = await fetch(`${API.HOST}/api/v3/spt/drafts/${headerId}/sections/${sectionKey}/${dbRow.id}`, {
                        method: 'DELETE',
                        headers: { ...getAuthHeaders() },
                    });
                    if (!response.ok && response.status !== 204) {
                        let msg = 'gagal dihapus';
                        try { const result = await response.json(); msg = result?.error?.message || msg; } catch (_) { /* no JSON body */ }
                        errors.push(`${sectionKey}/${dbRow.id}: ${msg}`);
                    }
                } catch (err) {
                    errors.push(`${sectionKey}/${dbRow.id}: ${err.message}`);
                }
            }
        } catch (err) {
            errors.push(`${sectionKey} (cek baris terhapus): ${err.message}`);
        }
        return errors;
    };

    // ── L2 orchestrators ─────────────────────────────────────────────────
    const saveL2ToV3 = async (headerId) => {
        const errors = [];
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l2', [...l2RowsA, ...l2RowsB]));
        errors.push(...await saveManyRowsToV3(headerId, 'l2', l2RowsA, buildL2PayloadA));
        errors.push(...await saveManyRowsToV3(headerId, 'l2', l2RowsB, buildL2PayloadB));
        if (setL2RowsFromDraft) {
            setL2RowsFromDraft('A', [...l2RowsA]);
            setL2RowsFromDraft('B', [...l2RowsB]);
        }
        return errors;
    };
    const loadL2FromV3 = async (headerId) => {
        try {
            const dbRows = await getManyRowsFromV3(headerId, 'l2');
            const rowsA = dbRows.filter(r => r.section_type === 'PART_A').map(r => buildL2RowFromDb(r, true));
            const rowsB = dbRows.filter(r => r.section_type === 'PART_B').map(r => buildL2RowFromDb(r, false));
            if (setL2RowsFromDraft) {
                if (rowsA.length > 0) setL2RowsFromDraft('A', rowsA);
                if (rowsB.length > 0) setL2RowsFromDraft('B', rowsB);
            }
        } catch (err) {
            console.error('Gagal memuat L2 dari V3:', err);
            setError(prev => prev || `Gagal memuat L2: ${err.message}`);
        }
    };

    // ── L3 (spt_l3) — PART_A, PART_B, PRIOR_YEAR_ADJUSTMENT share one table ──
    const buildL3PayloadA = (row) => ({
        section_type: 'PART_A',
        name: row.name || null,
        country_code: row.countryCode || null,
        transaction_date: row.transactionDate || null,
        income_code: row.incomeCode || null,
        net_income_amount: numOrZero(row.netIncomeRp),
        tax_payable_overseas_amount: numOrZero(row.taxPayableOverseasRp),
        currency_code: row.currency || null,
        foreign_currency_amount: numOrNull(row.foreignCurrencyAmount),
        tax_credit_calculated_amount: numOrZero(row.taxCreditCalculatedRp),
    });
    const buildL3PayloadB = (row) => ({
        section_type: 'PART_B',
        name: row.name || null,
        tin: row.tin || null,
        tax_type: row.taxType || null,
        tax_base_amount: numOrZero(row.taxBaseRp),
        tax_withheld_amount: numOrZero(row.taxWithheldRp),
        withholding_slip_number: row.slipNumber || null,
        withholding_slip_date: row.slipDate || null,
    });
    const buildL3RowFromDb = (dbRow, part) => {
        if (part === 'A') {
            return {
                id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `l3a_${dbRow.id}`,
                dbId: dbRow.id,
                name: dbRow.name || '',
                countryCode: dbRow.country_code || '',
                transactionDate: dbRow.transaction_date || '',
                incomeCode: dbRow.income_code || '',
                netIncomeRp: toStrDec(dbRow.net_income_amount),
                taxPayableOverseasRp: toStrDec(dbRow.tax_payable_overseas_amount),
                currency: dbRow.currency_code || '',
                foreignCurrencyAmount: toStrDec(dbRow.foreign_currency_amount),
                taxCreditCalculatedRp: toStrDec(dbRow.tax_credit_calculated_amount),
            };
        }
        return {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `l3b_${dbRow.id}`,
            dbId: dbRow.id,
            name: dbRow.name || '',
            tin: dbRow.tin || '',
            taxType: dbRow.tax_type || '',
            taxBaseRp: toStrDec(dbRow.tax_base_amount),
            taxWithheldRp: toStrDec(dbRow.tax_withheld_amount),
            slipNumber: dbRow.withholding_slip_number || '',
            slipDate: dbRow.withholding_slip_date || '',
        };
    };
    // priorYearCreditRefund disimpan sebagai SATU row section_type =
    // PRIOR_YEAR_ADJUSTMENT (bukan row Part A/B palsu), pakai kolom
    // prior_year_credit_adjustment_amount saja — field lain di payload NULL.
    const l3PriorDbIdRef = useRef(null); // dbId row PRIOR_YEAR_ADJUSTMENT — HARUS useRef (bukan object literal) agar bertahan lintas render, bug asli penyebab duplicate PRIOR_YEAR_ADJUSTMENT

    const saveL3ToV3 = async (headerId) => {
        const errors = [];
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l3', [...l3RowsA, ...l3RowsB], [l3PriorDbIdRef.current]));
        errors.push(...await saveManyRowsToV3(headerId, 'l3', l3RowsA, buildL3PayloadA));
        errors.push(...await saveManyRowsToV3(headerId, 'l3', l3RowsB, buildL3PayloadB));
        // Prior year adjustment — single scalar row
        try {
            const priorPayload = {
                section_type: 'PRIOR_YEAR_ADJUSTMENT',
                prior_year_credit_adjustment_amount: numOrZero(l3PriorYearCreditRefund),
            };
            const priorDbId = l3PriorDbIdRef.current;
            const url = priorDbId
                ? `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l3/${priorDbId}`
                : `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l3`;
            const response = await fetch(url, {
                method: priorDbId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(priorPayload),
            });
            const result = await response.json();
            if (!response.ok) {
                errors.push(`l3 (prior year adjustment): [${result?.error?.code || response.status}] ${result?.error?.message || 'gagal disimpan'}`);
            } else if (result?.data?.sectionId && !priorDbId) {
                l3PriorDbIdRef.current = result.data.sectionId;
            }
        } catch (err) {
            errors.push(`l3 (prior year adjustment): ${err.message}`);
        }
        if (setL3RowsFromDraft) {
            setL3RowsFromDraft('A', [...l3RowsA]);
            setL3RowsFromDraft('B', [...l3RowsB]);
        }
        return errors;
    };
    const loadL3FromV3 = async (headerId) => {
        try {
            const dbRows = await getManyRowsFromV3(headerId, 'l3');
            const rowsA = dbRows.filter(r => r.section_type === 'PART_A').map(r => buildL3RowFromDb(r, 'A'));
            const rowsB = dbRows.filter(r => r.section_type === 'PART_B').map(r => buildL3RowFromDb(r, 'B'));
            const priorRow = dbRows.find(r => r.section_type === 'PRIOR_YEAR_ADJUSTMENT');
            if (priorRow) {
                l3PriorDbIdRef.current = priorRow.id;
                if (setL3RowsFromDraft) {
                    setL3RowsFromDraft('PRIOR_YEAR_CREDIT_REFUND', toStrDec(priorRow.prior_year_credit_adjustment_amount));
                }
            }
            if (setL3RowsFromDraft) {
                if (rowsA.length > 0) setL3RowsFromDraft('A', rowsA);
                if (rowsB.length > 0) setL3RowsFromDraft('B', rowsB);
            }
        } catch (err) {
            console.error('Gagal memuat L3 dari V3:', err);
            setError(prev => prev || `Gagal memuat L3: ${err.message}`);
        }
    };

    // ── L4 (spt_l4) — PART_A & PART_B share table; unused part's fields NULL ──
    const buildL4PayloadA = (row) => ({
        section_type: 'PART_A',
        withholding_tin: row.tin || null,
        withholding_name: row.withholdingName || null,
        tax_object: row.taxObject || null,
        tax_base_amount: numOrZero(row.taxBase),
        tax_rate: numOrNull(row.rate),
    });
    const buildL4PayloadB = (row) => ({
        section_type: 'PART_B',
        income_type: row.typeOfIncome || null,
        income_source: row.incomeSource || null,
        gross_income_amount: numOrZero(row.grossIncome),
    });
    const buildL4RowFromDb = (dbRow, part) => {
        if (part === 'A') {
            return {
                id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `l4a_${dbRow.id}`,
                dbId: dbRow.id,
                tin: dbRow.withholding_tin || '',
                withholdingName: dbRow.withholding_name || '',
                taxObject: dbRow.tax_object || '',
                taxBase: toStrDec(dbRow.tax_base_amount),
                rate: toStrDec(dbRow.tax_rate),
            };
        }
        return {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `l4b_${dbRow.id}`,
            dbId: dbRow.id,
            typeOfIncome: dbRow.income_type || '',
            incomeSource: dbRow.income_source || '',
            grossIncome: toStrDec(dbRow.gross_income_amount),
        };
    };
    const saveL4ToV3 = async (headerId) => {
        const errors = [];
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l4', [...l4RowsA, ...l4RowsB]));
        errors.push(...await saveManyRowsToV3(headerId, 'l4', l4RowsA, buildL4PayloadA));
        errors.push(...await saveManyRowsToV3(headerId, 'l4', l4RowsB, buildL4PayloadB));
        if (setL4RowsFromDraft) {
            setL4RowsFromDraft('A', [...l4RowsA]);
            setL4RowsFromDraft('B', [...l4RowsB]);
        }
        return errors;
    };
    const loadL4FromV3 = async (headerId) => {
        try {
            const dbRows = await getManyRowsFromV3(headerId, 'l4');
            const rowsA = dbRows.filter(r => r.section_type === 'PART_A').map(r => buildL4RowFromDb(r, 'A'));
            const rowsB = dbRows.filter(r => r.section_type === 'PART_B').map(r => buildL4RowFromDb(r, 'B'));
            if (setL4RowsFromDraft) {
                if (rowsA.length > 0) setL4RowsFromDraft('A', rowsA);
                if (rowsB.length > 0) setL4RowsFromDraft('B', rowsB);
            }
        } catch (err) {
            console.error('Gagal memuat L4 dari V3:', err);
            setError(prev => prev || `Gagal memuat L4: ${err.message}`);
        }
    };

    // ── L6 (spt_l6) — 1:1 dengan header, single scalar record ───────────────
    const l6DbIdRef = useRef(null); // HARUS useRef — object literal direset setiap render, menyebabkan duplicate POST di Save Draft kedua
    const buildL6Payload = () => ({
        income_base_amount: numOrZero(l6IncomeBase),
        previous_year_tax_credit_amount: numOrZero(l6PreviousYearTaxCredit),
    });
    const saveL6ToV3 = async (headerId) => {
        try {
            let dbId = l6DbIdRef.current;
            if (!dbId) {
                const rows = await getManyRowsFromV3(headerId, 'l6').catch(() => []);
                if (rows.length > 0) dbId = rows[0].id;
            }
            const url = dbId
                ? `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l6/${dbId}`
                : `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l6`;
            const response = await fetch(url, {
                method: dbId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(buildL6Payload()),
            });
            const result = await response.json();
            if (!response.ok) {
                return [`l6: [${result?.error?.code || response.status}] ${result?.error?.message || 'gagal disimpan'}`];
            }
            if (result?.data?.sectionId && !dbId) l6DbIdRef.current = result.data.sectionId;
            return [];
        } catch (err) {
            return [`l6: ${err.message}`];
        }
    };
    const loadL6FromV3 = async (headerId) => {
        try {
            const rows = await getManyRowsFromV3(headerId, 'l6');
            if (rows.length > 0) {
                const dbRow = rows[0];
                l6DbIdRef.current = dbRow.id;
                if (setL6IncomeBaseFromDraft) setL6IncomeBaseFromDraft(toStrDec(dbRow.income_base_amount));
                if (setL6PreviousYearTaxCreditFromDraft) setL6PreviousYearTaxCreditFromDraft(toStrDec(dbRow.previous_year_tax_credit_amount));
            }
        } catch (err) {
            console.error('Gagal memuat L6 dari V3:', err);
            setError(prev => prev || `Gagal memuat L6: ${err.message}`);
        }
    };

    // ── L7 (spt_l7) — business identity (header_id, tax_year); many rows ────
    const buildL7Payload = (row) => ({
        tax_year: intOrNull(row.taxYear),
        fiscal_net_profit_income: numOrZero(row.netFiscal),
        fiscal_loss_compensation_y_minus_4: numOrZero(row.compYMinus4),
        fiscal_loss_compensation_y_minus_3: numOrZero(row.compYMinus3),
        fiscal_loss_compensation_y_minus_2: numOrZero(row.compYMinus2),
        fiscal_loss_compensation_y_minus_1: numOrZero(row.compYMinus1),
        fiscal_loss_compensation_current_year: numOrZero(row.compThisYear),
        fiscal_loss_compensation_next_year: numOrZero(row.compYPlus1),
    });
    const buildL7RowFromDb = (dbRow) => ({
        taxYear: dbRow.tax_year,
        dbId: dbRow.id,
        netFiscal: toStrDec(dbRow.fiscal_net_profit_income),
        compYMinus4: toStrDec(dbRow.fiscal_loss_compensation_y_minus_4),
        compYMinus3: toStrDec(dbRow.fiscal_loss_compensation_y_minus_3),
        compYMinus2: toStrDec(dbRow.fiscal_loss_compensation_y_minus_2),
        compYMinus1: toStrDec(dbRow.fiscal_loss_compensation_y_minus_1),
        compThisYear: toStrDec(dbRow.fiscal_loss_compensation_current_year),
        compYPlus1: toStrDec(dbRow.fiscal_loss_compensation_next_year),
    });
    const saveL7ToV3 = async (headerId) => {
        const errors = await saveManyRowsToV3(headerId, 'l7', l7Rows, buildL7Payload);
        if (setL7RowsFromDraft) setL7RowsFromDraft([...l7Rows]);
        return errors;
    };
    const loadL7FromV3 = async (headerId) => {
        try {
            const dbRows = await getManyRowsFromV3(headerId, 'l7');
            if (dbRows.length > 0 && setL7RowsFromDraft) {
                // ROOT CAUSE (dikunci dari audit): sebelumnya di sini di-merge
                // terhadap `l7Rows` (prop saat ini), yang MASIH KOSONG pada saat
                // effect ini jalan (roster tahun di L7.js/SptTahunanBadan.js belum
                // ter-build) — hasil .map() atas array kosong selalu kosong, jadi
                // setL7RowsFromDraft tidak pernah menerima data.
                //
                // FIX: kirim dbRows (dipetakan via buildL7RowFromDb yang SUDAH ADA,
                // tidak dibuat mapper baru) apa adanya ke setL7RowsFromDraft. L7.js
                // SENDIRI yang memiliki roster tahun (l7TaxYears) dan sudah punya
                // useEffect yang menjalankan
                //   mergeRowsWithDraft(buildInitialRows(l7TaxYears), l7Rows)
                // setiap kali prop l7Rows berubah — jadi begitu setL7RowsFromDraft
                // dipanggil, L7.js otomatis me-merge dbRows ini ke roster miliknya
                // sendiri. Tidak ada mekanisme merge baru dibuat di sini, tanggung
                // jawab roster/merge TETAP di L7.js.
                setL7RowsFromDraft(dbRows.map(buildL7RowFromDb));
            }
        } catch (err) {
            console.error('Gagal memuat L7 dari V3:', err);
            setError(prev => prev || `Gagal memuat L7: ${err.message}`);
        }
    };

    // ── L8 (spt_l8) — 1:1 dengan header, single scalar record ───────────────
    const l8DbIdRef = useRef(null); // HARUS useRef — object literal direset setiap render, menyebabkan duplicate POST di Save Draft kedua
    const buildL8Payload = () => ({
        gross_turnover_amount: numOrZero(l8GrossTurnover),
    });
    const saveL8ToV3 = async (headerId) => {
        try {
            let dbId = l8DbIdRef.current;
            if (!dbId) {
                const rows = await getManyRowsFromV3(headerId, 'l8').catch(() => []);
                if (rows.length > 0) dbId = rows[0].id;
            }
            const url = dbId
                ? `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l8/${dbId}`
                : `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l8`;
            const response = await fetch(url, {
                method: dbId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(buildL8Payload()),
            });
            const result = await response.json();
            if (!response.ok) {
                return [`l8: [${result?.error?.code || response.status}] ${result?.error?.message || 'gagal disimpan'}`];
            }
            if (result?.data?.sectionId && !dbId) l8DbIdRef.current = result.data.sectionId;
            return [];
        } catch (err) {
            return [`l8: ${err.message}`];
        }
    };
    const loadL8FromV3 = async (headerId) => {
        try {
            const rows = await getManyRowsFromV3(headerId, 'l8');
            if (rows.length > 0) {
                const dbRow = rows[0];
                l8DbIdRef.current = dbRow.id;
                if (setL8GrossTurnoverFromDraft) setL8GrossTurnoverFromDraft(toStrDec(dbRow.gross_turnover_amount));
            }
        } catch (err) {
            console.error('Gagal memuat L8 dari V3:', err);
            setError(prev => prev || `Gagal memuat L8: ${err.message}`);
        }
    };

    // ── L5 Place (spt_l5_place) ──────────────────────────────────────────
    const L5_MONTHS = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'];
    const buildL5PlacePayload = (place) => ({
        tku_number: place.tkuNumber || null,
        tku_name: place.namaTku || null,
        address: place.alamat || null,
        village: place.kelurahan || null,
        district: place.kecamatan || null,
        city: place.kota || null,
        province: place.provinsi || null,
    });
    const buildL5PlaceFromDb = (dbRow) => ({
        id: dbRow.id != null ? String(dbRow.id) : ((typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `l5p_${Math.random()}`),
        dbId: dbRow.id,
        tkuNumber: dbRow.tku_number || '',
        namaTku: dbRow.tku_name || '',
        alamat: dbRow.address || '',
        kelurahan: dbRow.village || '',
        kecamatan: dbRow.district || '',
        kota: dbRow.city || '',
        provinsi: dbRow.province || '',
        transactions: Array.isArray(dbRow.transactions) ? dbRow.transactions : [],
    });

    // saveL5PlacesToV3 — WAJIB tkuNumber diisi (kolom NOT NULL). Place tanpa
    // tkuNumber DILEWATI (tidak dikirim) dan errornya dilaporkan secara
    // eksplisit (Section M) — bukan diam-diam dianggap sukses maupun ditolak
    // seluruh Save Draft-nya.
    const saveL5PlacesToV3 = async (headerId) => {
        const errors = [];
        for (const place of (Array.isArray(l5Places) ? l5Places : [])) {
            if (!place.tkuNumber || !place.tkuNumber.trim()) {
                errors.push(`l5Place "${place.namaTku || place.id}": Nomor TKU belum diisi — tidak disimpan ke database.`);
                continue;
            }
            try {
                const payload = buildL5PlacePayload(place);
                const url = place.dbId
                    ? `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l5Place/${place.dbId}`
                    : `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l5Place`;
                const response = await fetch(url, {
                    method: place.dbId ? 'PATCH' : 'POST',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                    body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (!response.ok) {
                    errors.push(`l5Place "${place.namaTku || place.id}": [${result?.error?.code || response.status}] ${result?.error?.message || 'gagal disimpan'}`);
                    continue;
                }
                if (result?.data?.sectionId && !place.dbId) place.dbId = result.data.sectionId; // mutate in place
            } catch (err) {
                errors.push(`l5Place "${place.namaTku || place.id}": ${err.message}`);
            }
        }
        if (setL5PlacesFromDraft) setL5PlacesFromDraft([...l5Places]);
        return errors;
    };

    // ── L5 Transaction (spt_l5_transaction) — 1 UI TKU -> maks 12 DB rows ──
    // NULL vs 0 (Section H3): field kosong ('') untuk SATU bulan = belum
    // diinput -> row TIDAK dibuat sama sekali (bukan dikirim sebagai 0).
    // Bila user benar-benar mengisi 0, row tetap dibuat dengan nilai 0.
    // dbId per (place, bulan) disimpan di transactions[] milik place (hasil
    // GET l5Place yang sudah dibundel transactions oleh backend).
    const saveL5TransactionsToV3 = async (headerId) => {
        const errors = [];
        for (const place of (Array.isArray(l5Places) ? l5Places : [])) {
            if (!place.dbId) continue; // place belum tersimpan (mis. tkuNumber kosong) -> transaction ikut dilewati
            const row = (Array.isArray(l5Rows) ? l5Rows : []).find(r => r.tkuId === place.id);
            if (!row) continue;
            const existingByMonth = {};
            (Array.isArray(place.transactions) ? place.transactions : []).forEach(t => { existingByMonth[t.tax_month] = t; });

            for (let m = 0; m < 12; m++) {
                const prefix = L5_MONTHS[m];
                const taxMonth = m + 1;
                const gross = row[`${prefix}_bruto`];
                const selfPaid = row[`${prefix}_disetor`];
                const withheld = row[`${prefix}_dipotong`];
                const allEmpty = (gross === '' || gross === null || gross === undefined)
                    && (selfPaid === '' || selfPaid === null || selfPaid === undefined)
                    && (withheld === '' || withheld === null || withheld === undefined);
                const existing = existingByMonth[taxMonth];
                if (allEmpty) {
                    // Section H3: bulan belum diinput sama sekali -> jangan buat row.
                    // Bila row SUDAH ADA di DB dan user mengosongkan semua input bulan
                    // ini, seharusnya soft delete — TIDAK diimplementasikan di sini
                    // karena V3 API saat ini tidak menyediakan endpoint DELETE per
                    // section/row (hanya DELETE seluruh draft). Dilaporkan sebagai
                    // gap, bukan ditambahkan endpoint baru secara sepihak.
                    if (existing) {
                        errors.push(`l5Transaction "${place.namaTku || place.id}" bulan ${taxMonth}: input dikosongkan tapi row database masih ada — soft delete BELUM didukung (tidak ada endpoint DELETE per-row di V3), row lama TIDAK diubah.`);
                    }
                    continue;
                }
                try {
                    const payload = {
                        place_id: place.dbId,
                        tax_month: taxMonth,
                        gross_turnover_amount: numOrZero(gross),
                        self_paid_tax_amount: numOrZero(selfPaid),
                        withheld_tax_amount: numOrZero(withheld),
                    };
                    const dbId = existing ? existing.id : null;
                    const url = dbId
                        ? `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l5Transaction/${dbId}`
                        : `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l5Transaction`;
                    const response = await fetch(url, {
                        method: dbId ? 'PATCH' : 'POST',
                        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                        body: JSON.stringify(payload),
                    });
                    const result = await response.json();
                    if (!response.ok) {
                        errors.push(`l5Transaction "${place.namaTku || place.id}" bulan ${taxMonth}: [${result?.error?.code || response.status}] ${result?.error?.message || 'gagal disimpan'}`);
                    } else if (!dbId && result?.data?.sectionId) {
                        // Rekam dbId baru ke place.transactions (in-memory) supaya
                        // Save Draft berikutnya di sesi yang sama (tanpa reload)
                        // melakukan PATCH, bukan duplicate POST, untuk bulan ini.
                        if (!Array.isArray(place.transactions)) place.transactions = [];
                        place.transactions.push({ id: result.data.sectionId, tax_month: taxMonth });
                    }
                } catch (err) {
                    errors.push(`l5Transaction "${place.namaTku || place.id}" bulan ${taxMonth}: ${err.message}`);
                }
            }
        }
        return errors;
    };

    const saveL5ToV3 = async (headerId) => {
        const placeErrors = await saveL5PlacesToV3(headerId);
        const txErrors = await saveL5TransactionsToV3(headerId);
        return [...placeErrors, ...txErrors];
    };

    // loadL5FromV3 — GET l5Place (backend sudah membundel transactions per
    // place, lihat sptDraftPreparationService.js getSection l5Place). Hydrate
    // l5Places (dbId, tkuNumber, dst DAN transactions[] mentah untuk dipakai
    // saveL5TransactionsToV3 sebagai referensi existing rows) dan l5Rows
    // (36 field UI, dikelompokkan per tkuId = place.id).
    const loadL5FromV3 = async (headerId) => {
        try {
            const dbPlaces = await getManyRowsFromV3(headerId, 'l5Place');
            if (dbPlaces.length === 0) return;
            const newPlaces = dbPlaces.map(buildL5PlaceFromDb);
            const newRows = newPlaces.map(place => {
                const row = { tkuId: place.id };
                (place.transactions || []).forEach(t => {
                    const prefix = L5_MONTHS[(t.tax_month || 1) - 1];
                    if (!prefix) return;
                    row[`${prefix}_bruto`] = toStrDec(t.gross_turnover_amount);
                    row[`${prefix}_disetor`] = toStrDec(t.self_paid_tax_amount);
                    row[`${prefix}_dipotong`] = toStrDec(t.withheld_tax_amount);
                });
                return row;
            });
            if (setL5PlacesFromDraft) setL5PlacesFromDraft(newPlaces);
            if (setL5RowsFromDraft) setL5RowsFromDraft(newRows);
        } catch (err) {
            console.error('Gagal memuat L5 dari V3:', err);
            setError(prev => prev || `Gagal memuat L5: ${err.message}`);
        }
    };


    // ══════════════════════════════════════════════════════════════════════
    // L9–L14 V3 Persistence — 25 section keys (l9, l9Asset, l10a, l10b, l10c,
    // l10d, l11aPromotion, l11aEntertainment, l11aBadDebt, l11aFacility,
    // l11aRegionalBenefit, l11aRegionalFacility, l11aNpl, l11b,
    // l11bDebtBalance, l11bEquityBalance, l11bBorrowingCost, l11c, l13a,
    // l13b, l13bAgreement, l13bSectionB, l13bRd, l13c, l14).
    //
    // Reuses saveManyRowsToV3 / getManyRowsFromV3 / deleteRemovedRowsFromV3 /
    // resolveV3HeaderId (L2–L8 shared helpers, di atas) — TIDAK membangun
    // persistence architecture kedua. Ditambahkan di sini (bukan sebelum L2)
    // agar berdekatan dengan orchestrator L9–L14 sendiri.
    // ══════════════════════════════════════════════════════════════════════

    // ── Generic camelCase <-> snake_case field mapper ──────────────────────
    // Dipakai untuk section tanpa mapping field-by-field eksplisit di
    // kontrak (L10A, L10C, L11A sub-bagian generik, L11C, L13A, L13B
    // sectionA, L13C) — "camelCase frontend fields → corresponding
    // snake_case DB columns" (Kontrak §11). id/dbId TIDAK ikut dikonversi
    // (id = React key lokal, dbId = penanda PK V3, ditangani terpisah oleh
    // saveManyRowsToV3/buildXRowFromDb).
    const camelToSnakeKey = (key) => key.replace(/([A-Z])/g, '_$1').toLowerCase();
    const snakeToCamelKey = (key) => key.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());

    const buildGenericPayload = (row, extraFields = {}) => {
        const payload = { ...extraFields };
        Object.keys(row || {}).forEach((key) => {
            if (key === 'id' || key === 'dbId') return;
            const val = row[key];
            payload[camelToSnakeKey(key)] = (val === '' || val === undefined) ? null : val;
        });
        return payload;
    };

    const buildGenericRowFromDb = (dbRow, extraCamel = {}) => {
        const row = {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `row_${dbRow.id}`,
            dbId: dbRow.id,
            ...extraCamel,
        };
        Object.keys(dbRow || {}).forEach((key) => {
            if (key === 'id') return;
            row[snakeToCamelKey(key)] = dbRow[key] ?? '';
        });
        return row;
    };

    // ── Generic singleton (cardinality "one") GET/SAVE ──────────────────────
    // Pola identik getMainFormRecordFromV3/saveMainFormToV3 di atas, dibuat
    // generic agar dipakai ulang oleh l9 (parent), l10b, l10d,
    // l11aRegionalBenefit, l11b (parent), l13b (parent/sectionD) — bukan
    // mengulang boilerplate GET/POST/PATCH lima-enam kali.
    const getSingletonRecordFromV3 = async (headerId, sectionKey) => {
        const response = await fetch(`${API.HOST}/api/v3/spt/drafts/${headerId}/sections/${sectionKey}`, {
            method: 'GET',
            headers: { ...getAuthHeaders() },
        });
        const result = await response.json();
        if (!response.ok) {
            const code = result?.error?.code;
            throw new Error(`[${code || response.status}] ${result?.error?.message || `Gagal memuat ${sectionKey} dari V3.`}`);
        }
        const rows = Array.isArray(result?.data?.rows) ? result.data.rows : [];
        return rows.length > 0 ? rows[0] : null;
    };

    const saveSingletonToV3 = async (headerId, sectionKey, payload, existingIdRef) => {
        let recId = existingIdRef.current;
        if (!recId) {
            try {
                const existing = await getSingletonRecordFromV3(headerId, sectionKey);
                if (existing) recId = existing.id;
            } catch (err) {
                console.error(`Gagal cek existing ${sectionKey} V3 sebelum save:`, err);
            }
        }
        const url = recId
            ? `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/${sectionKey}/${recId}`
            : `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/${sectionKey}`;
        const response = await fetch(url, {
            method: recId ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) {
            const code = result?.error?.code;
            throw new Error(`[${code || response.status}] ${result?.error?.message || `Gagal menyimpan ${sectionKey} ke V3.`}`);
        }
        const savedId = result?.data?.sectionId ?? recId ?? null;
        if (savedId) existingIdRef.current = savedId;
        return savedId;
    };

    // ── Generic "replace all" untuk repeatable rows yang TIDAK bisa
    // mengandalkan round-trip dbId (row.dbId dibuang oleh merge internal
    // komponennya sendiri — L14.js: mergeRowsWithDraft() selalu membangun
    // ulang row dari initialRows/buildInitialRows(), TIDAK spread `d` mentah;
    // L13B.js: mergeWithInitial() sectionC merekonstruksi field satu-satu
    // tanpa dbId). Karena file-file ini FROZEN (di luar scope perubahan),
    // strategi aman: DELETE seluruh baris DB existing untuk sectionKey lalu
    // POST ulang seluruh baris current — bukan soft delete, physical replace,
    // konsisten dengan Hard Delete Contract (§7).
    const replaceAllRowsInV3 = async (headerId, sectionKey, currentRows, buildPayload) => {
        const errors = [];
        try {
            const dbRows = await getManyRowsFromV3(headerId, sectionKey);
            for (const dbRow of dbRows) {
                try {
                    const response = await fetch(`${API.HOST}/api/v3/spt/drafts/${headerId}/sections/${sectionKey}/${dbRow.id}`, {
                        method: 'DELETE',
                        headers: { ...getAuthHeaders() },
                    });
                    if (!response.ok && response.status !== 204) {
                        let msg = 'gagal dihapus';
                        try { const result = await response.json(); msg = result?.error?.message || msg; } catch (_) { /* no JSON body */ }
                        errors.push(`${sectionKey}/${dbRow.id}: ${msg}`);
                    }
                } catch (err) {
                    errors.push(`${sectionKey}/${dbRow.id}: ${err.message}`);
                }
            }
        } catch (err) {
            errors.push(`${sectionKey} (replace-all cleanup): ${err.message}`);
        }
        for (const row of (currentRows || [])) {
            row.dbId = null; // paksa POST baru — dbId lama (jika ada) tidak valid lagi setelah delete-all
        }
        errors.push(...await saveManyRowsToV3(headerId, sectionKey, currentRows || [], buildPayload));
        return errors;
    };

    // ── Bool <-> Yes/No (khusus L10B — Kontrak §11: "Yes"→true,"No"→false,""→null) ─
    const yesNoToBoolOrNull = (v) => (v === 'Yes' ? true : (v === 'No' ? false : null));
    const boolOrNullToYesNo = (v) => (v === true ? 'Yes' : (v === false ? 'No' : ''));

    // ── Months (khusus L11B II.A/II.B — month_01..month_12 ↔ months[0..11]) ──
    const emptyMonths12 = () => Array(12).fill('');
    const monthsToPayload = (months) => {
        const out = {};
        const arr = Array.isArray(months) ? months : emptyMonths12();
        for (let i = 0; i < 12; i++) out[`month_${String(i + 1).padStart(2, '0')}`] = numOrZero(arr[i]);
        return out;
    };
    const monthsFromDb = (dbRow) => {
        const arr = [];
        for (let i = 1; i <= 12; i++) arr.push(toStrDec(dbRow[`month_${String(i).padStart(2, '0')}`]));
        return arr;
    };

    // Refs id singleton (pola identik l3PriorDbIdRef/l6DbIdRef/l8DbIdRef —
    // HARUS useRef, bukan object literal, agar bertahan lintas render/Save
    // Draft berulang tanpa duplicate POST).
    const l9V3IdRef = useRef(null);
    const l10bV3IdRef = useRef(null);
    const l10dV3IdRef = useRef(null);
    const l11aRegionalBenefitV3IdRef = useRef(null);
    const l11bV3IdRef = useRef(null);
    const l13bV3IdRef = useRef(null);

    // ─────────────────────────────────────────────────────────────────────
    // L9 — spt_l9 (singleton, cardinality "one") + spt_l9_asset (many, anak).
    // Kontrak §10 — l9Data dinested per category/subgroup (frontend struktur
    // asli), category+subgroup dipersist APA ADANYA (bukan display label).
    // ─────────────────────────────────────────────────────────────────────
    const buildL9SingletonPayload = () => ({
        total_commercial_depreciation: numOrZero(l9Data?.totalCommercialDepreciation),
        total_commercial_amortization: numOrZero(l9Data?.totalCommercialAmortization),
    });

    const buildL9AssetPayload = (row) => ({
        category: row.category || null,
        subgroup: row.subgroup || null,
        asset_type: row.assetType || null,
        month_year: row.monthYear || null,
        cost_of_acquisition: numOrZero(row.costOfAcquisition),
        fiscal_book_begin_year: numOrNull(row.fiscalBookBeginYear),
        method_commercial: row.methodCommercial || null,
        method_fiscal: row.methodFiscal || null,
        fiscal_depr_this_year: numOrZero(row.fiscalDeprThisYear),
        notes: row.notes || null,
    });

    // FIX (audit — row identity bug): L9.js memakai `_uid` sebagai UI identity
    // (React key, target Edit/Delete — lihat `row._uid`, `onDelete(row._uid)`,
    // `filter(r => r._uid !== uid)` di L9.js). Row hasil hydration dari DB
    // sebelumnya diberi field `id`, BUKAN `_uid` — L9.js tidak pernah membaca
    // `id` sama sekali, sehingga `row._uid` tetap `undefined` untuk SEMUA baris
    // hasil GET. Saat delete satu baris, `onDelete(undefined)` dikirim, lalu
    // `filter(r => r._uid !== undefined)` menghapus SEMUA baris (karena semua
    // baris DB punya `_uid === undefined` juga) — bug persis seperti dilaporkan.
    // Fix: keluarkan `_uid` (bukan `id`) — unik per baris, stabil selama baris
    // ada di frontend state, TIDAK dipakai sebagai DB identity (itu tugas dbId).
    const generateUiUid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const buildL9AssetRowFromDb = (dbRow) => ({
        _uid: generateUiUid('l9a'),
        dbId: dbRow.id,
        assetType: dbRow.asset_type || '',
        monthYear: dbRow.month_year || '',
        costOfAcquisition: toStrDec(dbRow.cost_of_acquisition),
        fiscalBookBeginYear: dbRow.fiscal_book_begin_year != null ? String(dbRow.fiscal_book_begin_year) : '',
        methodCommercial: dbRow.method_commercial || '',
        methodFiscal: dbRow.method_fiscal || '',
        fiscalDeprThisYear: toStrDec(dbRow.fiscal_depr_this_year),
        notes: dbRow.notes || '',
    });

    // Flatten l9Data (tangible/building/intangible × subgroup) → satu array
    // baris, TIAP baris MEMPERTAHANKAN referensi objek row asli (bukan copy)
    // — supaya dbId hasil POST (dimutasi in-place oleh saveManyRowsToV3)
    // langsung tercermin di l9Data nested tanpa transform balik manual.
    const flattenL9Assets = (data) => {
        const flat = [];
        if (!data) return flat;
        Object.keys(data).forEach((category) => {
            const cat = data[category];
            if (!cat || typeof cat !== 'object' || Array.isArray(cat)) return; // skip totalCommercial*
            Object.keys(cat).forEach((subgroup) => {
                const rows = cat[subgroup];
                if (!Array.isArray(rows)) return;
                rows.forEach((row) => {
                    row.category = category;
                    row.subgroup = subgroup;
                    flat.push(row);
                });
            });
        });
        return flat;
    };

    const saveL9ToV3 = async (headerId) => {
        const errors = [];
        let l9ParentDbId = null;
        try {
            // parentDbId diambil dari RETURN VALUE saveSingletonToV3, bukan
            // hanya dari side-effect l9V3IdRef (Kontrak audit §14) — supaya
            // child selalu pakai FK yang benar-benar baru saja resolve/create,
            // bukan ref lama yang mungkin belum terisi.
            l9ParentDbId = await saveSingletonToV3(headerId, 'l9', buildL9SingletonPayload(), l9V3IdRef);
        } catch (err) {
            errors.push(`l9: ${err.message}`);
        }
        const flatRows = flattenL9Assets(l9Data);
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l9Asset', flatRows));
        errors.push(...await saveParentScopedRowsToV3(headerId, 'l9Asset', l9ParentDbId, 'l9_id', flatRows, buildL9AssetPayload));
        if (setL9DataFromDraft) setL9DataFromDraft({ ...l9Data });
        return errors;
    };

    const loadL9FromV3 = async (headerId) => {
        try {
            const singleton = await getSingletonRecordFromV3(headerId, 'l9');
            const dbAssetRows = await getManyRowsFromV3(headerId, 'l9Asset');
            const rebuilt = {};
            dbAssetRows.forEach((dbRow) => {
                const cat = dbRow.category;
                const sub = dbRow.subgroup;
                if (!cat || !sub) return;
                if (!rebuilt[cat]) rebuilt[cat] = {};
                if (!rebuilt[cat][sub]) rebuilt[cat][sub] = [];
                rebuilt[cat][sub].push(buildL9AssetRowFromDb(dbRow));
            });
            if (singleton) {
                l9V3IdRef.current = singleton.id;
                rebuilt.totalCommercialDepreciation = toStrDec(singleton.total_commercial_depreciation);
                rebuilt.totalCommercialAmortization = toStrDec(singleton.total_commercial_amortization);
            }
            if (setL9DataFromDraft && (singleton || dbAssetRows.length > 0)) setL9DataFromDraft(rebuilt);
        } catch (err) {
            console.error('Gagal memuat L9 dari V3:', err);
            setError(prev => prev || `Gagal memuat L9: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // L10A — spt_l10a (header-scoped many). Generic camelCase→snake_case.
    // ─────────────────────────────────────────────────────────────────────
    const buildL10aPayload = (row) => buildGenericPayload(row);
    const buildL10aRowFromDb = (dbRow) => buildGenericRowFromDb(dbRow);

    const saveL10aToV3 = async (headerId) => {
        const errors = [];
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l10a', l10aRows));
        errors.push(...await saveManyRowsToV3(headerId, 'l10a', l10aRows, buildL10aPayload));
        if (setL10aRowsFromDraft) setL10aRowsFromDraft([...l10aRows]);
        return errors;
    };
    const loadL10aFromV3 = async (headerId) => {
        try {
            const dbRows = await getManyRowsFromV3(headerId, 'l10a');
            if (dbRows.length > 0 && setL10aRowsFromDraft) setL10aRowsFromDraft(dbRows.map(buildL10aRowFromDb));
        } catch (err) {
            console.error('Gagal memuat L10A dari V3:', err);
            setError(prev => prev || `Gagal memuat L10A: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // L10B — spt_l10b (singleton). group1..group4.qN — Yes→true/No→false/''→null.
    // Field flatten: group{N}_q{M} (mengikuti struktur frontend, Kontrak §10).
    // ─────────────────────────────────────────────────────────────────────
    const L10B_GROUP_QUESTION_COUNTS = { group1: 4, group2: 3, group3: 5, group4: 3 };

    const buildL10bPayload = () => {
        const payload = {};
        Object.keys(L10B_GROUP_QUESTION_COUNTS).forEach((groupKey) => {
            const count = L10B_GROUP_QUESTION_COUNTS[groupKey];
            for (let i = 1; i <= count; i++) {
                const qKey = `q${i}`;
                payload[`${groupKey}_${qKey}`] = yesNoToBoolOrNull(l10bData?.[groupKey]?.[qKey]);
            }
        });
        return payload;
    };

    const buildL10bDataFromDb = (dbRow) => {
        const data = {};
        Object.keys(L10B_GROUP_QUESTION_COUNTS).forEach((groupKey) => {
            const count = L10B_GROUP_QUESTION_COUNTS[groupKey];
            data[groupKey] = {};
            for (let i = 1; i <= count; i++) {
                const qKey = `q${i}`;
                data[groupKey][qKey] = boolOrNullToYesNo(dbRow[`${groupKey}_${qKey}`]);
            }
        });
        return data;
    };

    const saveL10bToV3 = async (headerId) => {
        const errors = [];
        try {
            await saveSingletonToV3(headerId, 'l10b', buildL10bPayload(), l10bV3IdRef);
        } catch (err) {
            errors.push(`l10b: ${err.message}`);
        }
        return errors;
    };
    const loadL10bFromV3 = async (headerId) => {
        try {
            const singleton = await getSingletonRecordFromV3(headerId, 'l10b');
            if (singleton) {
                l10bV3IdRef.current = singleton.id;
                if (setL10bDataFromDraft) setL10bDataFromDraft(buildL10bDataFromDb(singleton));
            }
        } catch (err) {
            console.error('Gagal memuat L10B dari V3:', err);
            setError(prev => prev || `Gagal memuat L10B: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // L10C — spt_l10c (header-scoped many). Generic camelCase→snake_case.
    // ─────────────────────────────────────────────────────────────────────
    const buildL10cPayload = (row) => buildGenericPayload(row);
    const buildL10cRowFromDb = (dbRow) => buildGenericRowFromDb(dbRow);

    const saveL10cToV3 = async (headerId) => {
        const errors = [];
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l10c', l10cRows));
        errors.push(...await saveManyRowsToV3(headerId, 'l10c', l10cRows, buildL10cPayload));
        if (setL10cRowsFromDraft) setL10cRowsFromDraft([...l10cRows]);
        return errors;
    };
    const loadL10cFromV3 = async (headerId) => {
        try {
            const dbRows = await getManyRowsFromV3(headerId, 'l10c');
            if (dbRows.length > 0 && setL10cRowsFromDraft) setL10cRowsFromDraft(dbRows.map(buildL10cRowFromDb));
        } catch (err) {
            console.error('Gagal memuat L10C dari V3:', err);
            setError(prev => prev || `Gagal memuat L10C: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // L10D — spt_l10d (singleton). Kontrak §11 — checklist booleans + 2 tanggal.
    // ─────────────────────────────────────────────────────────────────────
    const buildL10dPayload = () => {
        const payload = {};
        ['c1', 'c2', 'c3', 'c4', 'c5'].forEach((c) => {
            payload[`master_summary_${c}`] = !!l10dData?.masterSummary?.[c];
            payload[`local_summary_${c}`] = !!l10dData?.localSummary?.[c];
        });
        payload.master_doc_date = l10dData?.masterDocDate || null;
        payload.local_doc_date = l10dData?.localDocDate || null;
        return payload;
    };
    const buildL10dDataFromDb = (dbRow) => {
        const masterSummary = {};
        const localSummary = {};
        ['c1', 'c2', 'c3', 'c4', 'c5'].forEach((c) => {
            masterSummary[c] = !!dbRow[`master_summary_${c}`];
            localSummary[c] = !!dbRow[`local_summary_${c}`];
        });
        return {
            masterSummary,
            localSummary,
            masterDocDate: dbRow.master_doc_date || '',
            localDocDate: dbRow.local_doc_date || '',
        };
    };

    const saveL10dToV3 = async (headerId) => {
        const errors = [];
        try {
            await saveSingletonToV3(headerId, 'l10d', buildL10dPayload(), l10dV3IdRef);
        } catch (err) {
            errors.push(`l10d: ${err.message}`);
        }
        return errors;
    };
    const loadL10dFromV3 = async (headerId) => {
        try {
            const singleton = await getSingletonRecordFromV3(headerId, 'l10d');
            if (singleton) {
                l10dV3IdRef.current = singleton.id;
                if (setL10dDataFromDraft) setL10dDataFromDraft(buildL10dDataFromDb(singleton));
            }
        } catch (err) {
            console.error('Gagal memuat L10D dari V3:', err);
            setError(prev => prev || `Gagal memuat L10D: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // L11A — 7 backend section keys dari SATU l11aData (Kontrak §12).
    // promotionRows/entertainmentRows/badDebtRows/facilitiesRows(top-level)/
    // nonPerformingLoanRows → generic many. regionalBenefitData → singleton
    // (l11aRegionalBenefit) + child many (l11aRegionalFacility, PERSIST
    // SETELAH regionalBenefit — parent chain §9).
    // ─────────────────────────────────────────────────────────────────────
    // FIX (audit): kolom DB adalah FLAT (housing, healthcare, education,
    // worship, transport, sports) — BUKAN diprefix cost_. Payload sebelumnya
    // memakai cost_housing dkk sehingga backend menyimpan NULL (kolom tidak
    // dikenali). costs object di-flatten APA ADANYA ke kolom flat, bukan
    // disimpan sebagai JSON field.
    const buildL11aRegionalBenefitPayload = () => {
        const rb = l11aData?.regionalBenefitData || {};
        return {
            location_address: rb.locationAddress || null,
            decree_number: rb.decreeNumber || null,
            decree_date: rb.decreeDate || null,
            ext_decree_number: rb.extDecreeNumber || null,
            ext_decree_date: rb.extDecreeDate || null,
            housing: numOrZero(rb.costs?.housing),
            healthcare: numOrZero(rb.costs?.healthcare),
            education: numOrZero(rb.costs?.education),
            worship: numOrZero(rb.costs?.worship),
            transport: numOrZero(rb.costs?.transport),
            sports: numOrZero(rb.costs?.sports),
        };
    };
    const buildL11aRegionalBenefitFromDb = (dbRow) => ({
        locationAddress: dbRow.location_address || '',
        decreeNumber: dbRow.decree_number || '',
        decreeDate: dbRow.decree_date || '',
        extDecreeNumber: dbRow.ext_decree_number || '',
        extDecreeDate: dbRow.ext_decree_date || '',
        costs: {
            housing: toStrDec(dbRow.housing),
            healthcare: toStrDec(dbRow.healthcare),
            education: toStrDec(dbRow.education),
            worship: toStrDec(dbRow.worship),
            transport: toStrDec(dbRow.transport),
            sports: toStrDec(dbRow.sports),
        },
    });

    // ── IV.B Regional Benefit — Save→Lock→Edit confirmation flag ───────────
    // ARCHITECTURE GAP (Kontrak §B7 — dilaporkan, bukan disilently-invent):
    // tidak ada kolom/field backend yang merepresentasikan "section ini sudah
    // dikonfirmasi user" untuk spt_l11a_regional_benefit — kolom yang ada
    // hanya data bisnis (location_address..sports). Menyimpan status
    // confirmed sebagai flag terpisah butuh kolom baru (mis. is_confirmed)
    // yang TIDAK ada di contract manapun yang diberikan, dan instruksi task
    // ini eksplisit melarang menambah kolom/tabel baru secara diam-diam.
    //
    // Solusi interim yang dipakai: localStorage, di-namespace TERPISAH dari
    // key data L9-L14 lama (yang sudah dihapus) — key ini BUKAN sumber data
    // bisnis (tidak dipakai untuk save/load housing/healthcare/dst, semua
    // itu tetap 100% V3), ia HANYA menyimpan satu boolean UI "apakah user
    // sudah klik SIMPAN section ini". Konsekuensi jujur: flag ini scoped per
    // browser/device, BUKAN per akun di server — logout/login DI BROWSER
    // YANG SAMA akan mempertahankan locked state (memenuhi Test Case 3 versi
    // "same browser"), tapi login dari device/browser lain tidak akan
    // melihat locked state ini. Perbaikan permanen butuh kolom backend baru
    // (mis. spt_l11a_regional_benefit.is_confirmed) — di luar scope frontend
    // task ini, TIDAK ditambahkan di sini.
    const getRegionalBenefitConfirmedFlag = (activeSptId) => {
        if (!activeSptId) return false;
        try {
            return localStorage.getItem(`spt_l11a_rb_confirmed_${activeSptId}`) === 'true';
        } catch (e) {
            return false;
        }
    };
    const setRegionalBenefitConfirmedFlag = (activeSptId, val) => {
        if (!activeSptId) return;
        try {
            localStorage.setItem(`spt_l11a_rb_confirmed_${activeSptId}`, val ? 'true' : 'false');
        } catch (e) {
            console.warn('Gagal menyimpan status confirmed IV.B Regional Benefit:', e);
        }
    };

    // FIX (scope correction — Part 3/5/6): fungsi khusus untuk tombol IV.B
    // [SIMPAN] — HANYA menyimpan spt_l11a_regional_benefit (5 field tetap +
    // 6 biaya). TIDAK menyentuh l11aRegionalFacility (Specific Areas table —
    // tetap CRUD via mekanisme existing/global Save Draft), dan TIDAK
    // menyentuh l11aPromotion/Entertainment/BadDebt/Facility(IV.A)/Npl sama
    // sekali. Ini SENGAJA terpisah dari saveL11aToV3 (dipakai global Save
    // Draft, tetap menyimpan SEMUA 7 sub-bagian L11A seperti sebelumnya,
    // tidak diubah).
    const saveL11aRegionalBenefitOnlyToV3 = async (headerId) => {
        const errors = [];
        let regionalBenefitDbId = null;
        try {
            regionalBenefitDbId = await saveSingletonToV3(headerId, 'l11aRegionalBenefit', buildL11aRegionalBenefitPayload(), l11aRegionalBenefitV3IdRef);
        } catch (err) {
            errors.push(`l11aRegionalBenefit: ${err.message}`);
        }
        return { errors, regionalBenefitDbId };
    };

    const saveL11aToV3 = async (headerId) => {
        const errors = [];
        const simpleSections = [
            ['l11aPromotion', l11aData?.promotionRows || []],
            ['l11aEntertainment', l11aData?.entertainmentRows || []],
            ['l11aBadDebt', l11aData?.badDebtRows || []],
            ['l11aFacility', l11aData?.facilitiesRows || []],
            ['l11aNpl', l11aData?.nonPerformingLoanRows || []],
        ];
        for (const [sectionKey, rows] of simpleSections) {
            errors.push(...await deleteRemovedRowsFromV3(headerId, sectionKey, rows));
            errors.push(...await saveManyRowsToV3(headerId, sectionKey, rows, buildGenericPayload));
        }
        // Parent chain (§9): regionalBenefit SEBELUM regionalFacility.
        // parentDbId diambil dari return value, dipakai langsung untuk child
        // (FIX — audit §14, bukan mengandalkan ref semata).
        let regionalBenefitDbId = null;
        try {
            regionalBenefitDbId = await saveSingletonToV3(headerId, 'l11aRegionalBenefit', buildL11aRegionalBenefitPayload(), l11aRegionalBenefitV3IdRef);
        } catch (err) {
            errors.push(`l11aRegionalBenefit: ${err.message}`);
        }
        const regionalFacilityRows = l11aData?.regionalBenefitData?.facilitiesRows || [];
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l11aRegionalFacility', regionalFacilityRows));
        errors.push(...await saveParentScopedRowsToV3(headerId, 'l11aRegionalFacility', regionalBenefitDbId, 'regional_benefit_id', regionalFacilityRows, buildGenericPayload));
        if (setL11aDataFromDraft) setL11aDataFromDraft({ ...l11aData });
        return errors;
    };

    const loadL11aFromV3 = async (headerId) => {
        try {
            const [promotionRows, entertainmentRows, badDebtRows, facilitiesRows, nonPerformingLoanRows, regionalFacilityRows] = await Promise.all([
                getManyRowsFromV3(headerId, 'l11aPromotion'),
                getManyRowsFromV3(headerId, 'l11aEntertainment'),
                getManyRowsFromV3(headerId, 'l11aBadDebt'),
                getManyRowsFromV3(headerId, 'l11aFacility'),
                getManyRowsFromV3(headerId, 'l11aNpl'),
                getManyRowsFromV3(headerId, 'l11aRegionalFacility'),
            ]);
            const regionalBenefitDb = await getSingletonRecordFromV3(headerId, 'l11aRegionalBenefit');
            const rebuilt = {
                promotionRows: promotionRows.map(buildGenericRowFromDb),
                entertainmentRows: entertainmentRows.map(buildGenericRowFromDb),
                badDebtRows: badDebtRows.map(buildGenericRowFromDb),
                facilitiesRows: facilitiesRows.map(buildGenericRowFromDb),
                nonPerformingLoanRows: nonPerformingLoanRows.map(buildGenericRowFromDb),
                regionalBenefitData: {
                    ...(regionalBenefitDb ? buildL11aRegionalBenefitFromDb(regionalBenefitDb) : {}),
                    facilitiesRows: regionalFacilityRows.map(buildGenericRowFromDb),
                },
            };
            if (regionalBenefitDb) l11aRegionalBenefitV3IdRef.current = regionalBenefitDb.id;
            if (setL11aDataFromDraft) setL11aDataFromDraft(rebuilt);
        } catch (err) {
            console.error('Gagal memuat L11A dari V3:', err);
            setError(prev => prev || `Gagal memuat L11A: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // L11B — l11b (singleton parent) → l11bDebtBalance/l11bEquityBalance
    // (months) → l11bBorrowingCost. income_tax_expense SENGAJA TIDAK ditulis
    // (Kontrak §13 — tidak ada sumber otoritatif di frontend saat ini).
    // ─────────────────────────────────────────────────────────────────────
    const buildL11bParentPayload = () => ({
        has_foreign_debt: l11bData?.hasForeignDebt || null,
        // income_tax_expense: SENGAJA TIDAK ditulis — biarkan NULL di DB
        // (Kontrak §13). Jangan tambahkan key ini di payload manapun.
    });
    const buildL11bParentFromDb = (dbRow) => ({
        hasForeignDebt: dbRow.has_foreign_debt || '',
    });

    const buildL11bDebtBalancePayload = (row) => ({
        creditor_identity: row.creditorIdentity || null,
        creditor_name: row.creditorName || null,
        relationship: row.relationship || null,
        ...monthsToPayload(row.months),
    });
    const buildL11bDebtBalanceFromDb = (dbRow) => ({
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `derU_${dbRow.id}`,
        dbId: dbRow.id,
        creditorIdentity: dbRow.creditor_identity || '',
        creditorName: dbRow.creditor_name || '',
        relationship: dbRow.relationship || '',
        months: monthsFromDb(dbRow),
    });

    const buildL11bEquityBalancePayload = (row) => ({
        equity_description: row.equityDescription || null,
        ...monthsToPayload(row.months),
    });
    const buildL11bEquityBalanceFromDb = (dbRow) => ({
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `derM_${dbRow.id}`,
        dbId: dbRow.id,
        equityDescription: dbRow.equity_description || '',
        months: monthsFromDb(dbRow),
    });

    const buildL11bBorrowingCostPayload = (row) => buildGenericPayload(row);
    const buildL11bBorrowingCostFromDb = (dbRow) => buildGenericRowFromDb(dbRow);

    const saveL11bToV3 = async (headerId) => {
        const errors = [];
        let l11bParentDbId = null;
        try {
            l11bParentDbId = await saveSingletonToV3(headerId, 'l11b', buildL11bParentPayload(), l11bV3IdRef);
        } catch (err) {
            errors.push(`l11b: ${err.message}`);
        }
        const debtRows = l11bData?.derRowsUtang || [];
        const equityRows = l11bData?.derRowsModal || [];
        const borrowingRows = l11bData?.borrowingCostRows || [];
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l11bDebtBalance', debtRows));
        errors.push(...await saveParentScopedRowsToV3(headerId, 'l11bDebtBalance', l11bParentDbId, 'l11b_id', debtRows, buildL11bDebtBalancePayload));
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l11bEquityBalance', equityRows));
        errors.push(...await saveParentScopedRowsToV3(headerId, 'l11bEquityBalance', l11bParentDbId, 'l11b_id', equityRows, buildL11bEquityBalancePayload));
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l11bBorrowingCost', borrowingRows));
        errors.push(...await saveParentScopedRowsToV3(headerId, 'l11bBorrowingCost', l11bParentDbId, 'l11b_id', borrowingRows, buildL11bBorrowingCostPayload));
        if (setL11bDataFromDraft) setL11bDataFromDraft({ ...l11bData });
        return errors;
    };

    const loadL11bFromV3 = async (headerId) => {
        try {
            const parentDb = await getSingletonRecordFromV3(headerId, 'l11b');
            const [debtRows, equityRows, borrowingRows] = await Promise.all([
                getManyRowsFromV3(headerId, 'l11bDebtBalance'),
                getManyRowsFromV3(headerId, 'l11bEquityBalance'),
                getManyRowsFromV3(headerId, 'l11bBorrowingCost'),
            ]);
            const rebuilt = {
                ...(parentDb ? buildL11bParentFromDb(parentDb) : {}),
                derRowsUtang: debtRows.map(buildL11bDebtBalanceFromDb),
                derRowsModal: equityRows.map(buildL11bEquityBalanceFromDb),
                borrowingCostRows: borrowingRows.map(buildL11bBorrowingCostFromDb),
            };
            if (parentDb) l11bV3IdRef.current = parentDb.id;
            if (setL11bDataFromDraft) setL11bDataFromDraft(rebuilt);
        } catch (err) {
            console.error('Gagal memuat L11B dari V3:', err);
            setError(prev => prev || `Gagal memuat L11B: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // L11C — spt_l11c (header-scoped many). l11cData = { foreignDebtRows }.
    // Tidak menyimpan pokokUtangAkhirTahun derived (Kontrak §14).
    // ─────────────────────────────────────────────────────────────────────
    const buildL11cPayload = (row) => buildGenericPayload(row);
    const buildL11cRowFromDb = (dbRow) => buildGenericRowFromDb(dbRow);

    const saveL11cToV3 = async (headerId) => {
        const errors = [];
        const rows = l11cData?.foreignDebtRows || [];
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l11c', rows));
        errors.push(...await saveManyRowsToV3(headerId, 'l11c', rows, buildL11cPayload));
        if (setL11cDataFromDraft) setL11cDataFromDraft({ ...l11cData });
        return errors;
    };
    const loadL11cFromV3 = async (headerId) => {
        try {
            const dbRows = await getManyRowsFromV3(headerId, 'l11c');
            if (dbRows.length > 0 && setL11cDataFromDraft) {
                setL11cDataFromDraft({ foreignDebtRows: dbRows.map(buildL11cRowFromDb) });
            }
        } catch (err) {
            console.error('Gagal memuat L11C dari V3:', err);
            setError(prev => prev || `Gagal memuat L11C: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // L13A — spt_l13a (header-scoped many). Generic mapping. Field
    // approved_investment_currency_code TIDAK ditulis — tidak ada raw source
    // di frontend (Kontrak §15), otomatis tidak muncul di payload karena
    // buildGenericPayload hanya mengiterasi key yang benar-benar ada di row.
    // Total Approved Investment (derived) TIDAK tersimpan di row state L13A
    // sendiri (buildEmptyL13AForm tidak memilikinya) — otomatis aman.
    // ─────────────────────────────────────────────────────────────────────
    const buildL13aPayload = (row) => buildGenericPayload(row);
    const buildL13aRowFromDb = (dbRow) => buildGenericRowFromDb(dbRow);

    const saveL13aToV3 = async (headerId) => {
        const errors = [];
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l13a', l13aRows));
        errors.push(...await saveManyRowsToV3(headerId, 'l13a', l13aRows, buildL13aPayload));
        if (setL13aRowsFromDraft) setL13aRowsFromDraft([...l13aRows]);
        return errors;
    };
    const loadL13aFromV3 = async (headerId) => {
        try {
            const dbRows = await getManyRowsFromV3(headerId, 'l13a');
            if (dbRows.length > 0 && setL13aRowsFromDraft) setL13aRowsFromDraft(dbRows.map(buildL13aRowFromDb));
        } catch (err) {
            console.error('Gagal memuat L13A dari V3:', err);
            setError(prev => prev || `Gagal memuat L13A: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // L13B — l13bAgreement (sectionA, many, generic — dbId round-trip aman
    // karena L13B.js mergeWithInitial mempertahankan sectionA apa adanya) →
    // l13bSectionB (fixed roster sb-1..sb-5, key alami = category_code, TIDAK
    // butuh dbId round-trip) → l13bRd (sectionC, dbId DIBUANG oleh
    // mergeWithInitial L13B.js sendiri — pakai replaceAllRowsInV3, lihat
    // catatan di atas) → l13b parent (sectionD raw: row2/row4/row5).
    // ─────────────────────────────────────────────────────────────────────
    const buildL13bAgreementPayload = (row) => buildGenericPayload(row);
    const buildL13bAgreementFromDb = (dbRow) => buildGenericRowFromDb(dbRow);

    // FIX (audit): kolom DB adalah row2/row4/row5 TANPA underscore — payload
    // sebelumnya mengirim row_2/row_4/row_5 (hasil camelToSnakeKey standar)
    // sehingga backend tidak mengenali kolom dan nilai user hilang.
    const buildL13bSectionDPayload = () => ({
        row2: numOrZero(l13bData?.sectionD?.row2),
        row4: numOrZero(l13bData?.sectionD?.row4),
        row5: numOrZero(l13bData?.sectionD?.row5),
    });
    const buildL13bSectionDFromDb = (dbRow) => ({
        row2: Number(dbRow.row2) || 0,
        row4: Number(dbRow.row4) || 0,
        row5: Number(dbRow.row5) || 0,
    });

    const buildL13bSectionBPayload = (row) => ({
        category_code: row.id,
        category_description: row.description || null,
        amount: numOrZero(row.amount),
    });
    const buildL13bRdPayload = (row) => buildGenericPayload(row);

    const saveL13bToV3 = async (headerId) => {
        const errors = [];
        // FIX (audit): PARENT harus disimpan LEBIH DULU (urutan sesuai Kontrak
        // §9 "l13b → l13bAgreement → l13bSectionB → l13bRd" — sebelumnya
        // implementasi menyimpan children DULU baru parent di akhir, sehingga
        // l13b_id belum ada sama sekali saat children dikirim → SECTION_NOT_FOUND
        // di ketiganya). parentDbId dipakai langsung dari return value.
        let l13bParentDbId = null;
        try {
            l13bParentDbId = await saveSingletonToV3(headerId, 'l13b', buildL13bSectionDPayload(), l13bV3IdRef);
        } catch (err) {
            errors.push(`l13b: ${err.message}`);
        }

        const agreementRows = l13bData?.sectionA || [];
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l13bAgreement', agreementRows));
        errors.push(...await saveParentScopedRowsToV3(headerId, 'l13bAgreement', l13bParentDbId, 'l13b_id', agreementRows, buildL13bAgreementPayload));

        // Section B — fixed roster (5 kategori tetap): key alami category_code
        // (id sb-1..sb-5), bukan dbId — GET existing lalu map by category_code,
        // PATCH bila sudah ada, POST bila belum (tidak pernah bertambah/berkurang
        // dari 5 kategori — Kontrak §16 "Do NOT create a category master table").
        // FIX (audit): payload sekarang menyertakan l13b_id dari parentDbId.
        if (!l13bParentDbId) {
            errors.push('l13bSectionB: parent (l13b_id) belum tersimpan — parentDbId kosong, section B dibatalkan untuk mencegah SECTION_NOT_FOUND.');
        } else {
            try {
                const dbSectionB = await getManyRowsFromV3(headerId, 'l13bSectionB');
                const dbByCode = new Map(dbSectionB.map((r) => [r.category_code, r]));
                for (const row of (l13bData?.sectionB || [])) {
                    const existing = dbByCode.get(row.id);
                    const payload = { l13b_id: l13bParentDbId, ...buildL13bSectionBPayload(row) };
                    const url = existing
                        ? `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l13bSectionB/${existing.id}`
                        : `${API.HOST}/api/v3/spt/drafts/${headerId}/sections/l13bSectionB`;
                    const response = await fetch(url, {
                        method: existing ? 'PATCH' : 'POST',
                        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                        body: JSON.stringify(payload),
                    });
                    const result = await response.json();
                    if (!response.ok) {
                        errors.push(`l13bSectionB/${row.id}: [${result?.error?.code || response.status}] ${result?.error?.message || 'gagal disimpan'}`);
                    }
                }
            } catch (err) {
                errors.push(`l13bSectionB: ${err.message}`);
            }
        }

        // Section C (l13bRd) — replace-all (dbId tidak survive lintas Load Draft,
        // lihat catatan replaceAllRowsInV3 di atas). FIX (audit): l13b_id
        // sekarang di-inject via wrapper sebelum diteruskan ke replaceAllRowsInV3.
        if (!l13bParentDbId) {
            errors.push('l13bRd: parent (l13b_id) belum tersimpan — parentDbId kosong, section C dibatalkan untuk mencegah SECTION_NOT_FOUND.');
        } else {
            const buildL13bRdPayloadWithFk = (row) => ({ l13b_id: l13bParentDbId, ...buildL13bRdPayload(row) });
            errors.push(...await replaceAllRowsInV3(headerId, 'l13bRd', l13bData?.sectionC || [], buildL13bRdPayloadWithFk));
        }
        if (setL13bDataFromDraft) setL13bDataFromDraft({ ...l13bData });
        return errors;
    };

    const loadL13bFromV3 = async (headerId) => {
        try {
            const [agreementRows, sectionBRows, rdRows, parentDb] = await Promise.all([
                getManyRowsFromV3(headerId, 'l13bAgreement'),
                getManyRowsFromV3(headerId, 'l13bSectionB'),
                getManyRowsFromV3(headerId, 'l13bRd'),
                getSingletonRecordFromV3(headerId, 'l13b'),
            ]);
            const rebuilt = {
                sectionA: agreementRows.map(buildL13bAgreementFromDb),
                sectionB: sectionBRows.map((r) => ({ id: r.category_code, description: r.category_description || '', amount: Number(r.amount) || 0 })),
                sectionC: rdRows.map(buildGenericRowFromDb),
                sectionD: parentDb ? buildL13bSectionDFromDb(parentDb) : { row2: 0, row4: 0, row5: 0 },
            };
            if (parentDb) l13bV3IdRef.current = parentDb.id;
            if (setL13bDataFromDraft) setL13bDataFromDraft(rebuilt);
        } catch (err) {
            console.error('Gagal memuat L13B dari V3:', err);
            setError(prev => prev || `Gagal memuat L13B: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // L13C — spt_l13c (header-scoped many). Generic mapping. taxableIncome/
    // incomeTaxPayable/taxReductionFacility TIDAK pernah ada di row state
    // (computed di render L13C.js — lihat buildEmptyL13CForm), otomatis
    // tidak ikut payload. corporate_income_tax_rate TIDAK ditulis (Kontrak §17).
    // ─────────────────────────────────────────────────────────────────────
    const buildL13cPayload = (row) => buildGenericPayload(row);
    const buildL13cRowFromDb = (dbRow) => buildGenericRowFromDb(dbRow);

    const saveL13cToV3 = async (headerId) => {
        const errors = [];
        errors.push(...await deleteRemovedRowsFromV3(headerId, 'l13c', l13cRows));
        errors.push(...await saveManyRowsToV3(headerId, 'l13c', l13cRows, buildL13cPayload));
        if (setL13cRowsFromDraft) setL13cRowsFromDraft([...l13cRows]);
        return errors;
    };
    const loadL13cFromV3 = async (headerId) => {
        try {
            const dbRows = await getManyRowsFromV3(headerId, 'l13c');
            if (dbRows.length > 0 && setL13cRowsFromDraft) setL13cRowsFromDraft(dbRows.map(buildL13cRowFromDb));
        } catch (err) {
            console.error('Gagal memuat L13C dari V3:', err);
            setError(prev => prev || `Gagal memuat L13C: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // L14 — spt_l14 (header-scoped many, 5 baris historis tetap per year).
    // dbId TIDAK survive lintas Load Draft (L14.js mergeRowsWithDraft selalu
    // membangun ulang row dari buildInitialRows(taxYear), tidak spread draft
    // mentah) — pakai replaceAllRowsInV3 (pola identik l13bRd). Field
    // eksplisit sesuai Kontrak §18 — jumlahPenggunaan/sisaBelum/sisaMelewati
    // TIDAK dipersist (derived, tidak ada di row state L14 — buildInitialRows
    // hanya berisi year/bentukPenanaman/penyediaan/tahun1-4).
    // ─────────────────────────────────────────────────────────────────────
    const buildL14Payload = (row) => ({
        tax_year: intOrNull(row.year),
        bentuk_penanaman: row.bentukPenanaman || null,
        penyediaan: numOrZero(row.penyediaan),
        tahun1: numOrZero(row.tahun1),
        tahun2: numOrZero(row.tahun2),
        tahun3: numOrZero(row.tahun3),
        tahun4: numOrZero(row.tahun4),
    });
    const buildL14RowFromDb = (dbRow) => ({
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `l14_${dbRow.id}`,
        dbId: dbRow.id,
        year: dbRow.tax_year,
        bentukPenanaman: dbRow.bentuk_penanaman || '',
        penyediaan: toStrDec(dbRow.penyediaan),
        tahun1: toStrDec(dbRow.tahun1),
        tahun2: toStrDec(dbRow.tahun2),
        tahun3: toStrDec(dbRow.tahun3),
        tahun4: toStrDec(dbRow.tahun4),
    });

    const saveL14ToV3 = async (headerId) => {
        const errors = await replaceAllRowsInV3(headerId, 'l14', l14Rows || [], buildL14Payload);
        if (setL14RowsFromDraft) setL14RowsFromDraft([...(l14Rows || [])]);
        return errors;
    };
    const loadL14FromV3 = async (headerId) => {
        try {
            const dbRows = await getManyRowsFromV3(headerId, 'l14');
            if (dbRows.length > 0 && setL14RowsFromDraft) setL14RowsFromDraft(dbRows.map(buildL14RowFromDb));
        } catch (err) {
            console.error('Gagal memuat L14 dari V3:', err);
            setError(prev => prev || `Gagal memuat L14: ${err.message}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // Master orchestrators — dipanggil dari saveDraft() dan dari load
    // useEffect (bersanding dengan loadL1FromV3...loadL8FromV3, resolveV3HeaderId
    // yang sama). Urutan mengikuti parent chain (§9): l9 sebelum l9Asset (di
    // dalam saveL9ToV3 sendiri), l11aRegionalBenefit sebelum l11aRegionalFacility
    // (di dalam saveL11aToV3), l11b sebelum children (di dalam saveL11bToV3),
    // l13bAgreement/SectionB/Rd sebelum l13b parent (di dalam saveL13bToV3).
    // ─────────────────────────────────────────────────────────────────────
    const loadL9L14FromV3 = async (headerId) => {
        await loadL9FromV3(headerId);
        await loadL10aFromV3(headerId);
        await loadL10bFromV3(headerId);
        await loadL10cFromV3(headerId);
        await loadL10dFromV3(headerId);
        await loadL11aFromV3(headerId);
        await loadL11bFromV3(headerId);
        await loadL11cFromV3(headerId);
        await loadL13aFromV3(headerId);
        await loadL13bFromV3(headerId);
        await loadL13cFromV3(headerId);
        await loadL14FromV3(headerId);
    };


    const saveDraft = async () => {
        // Ambil id secara lokal dari return value createSpt() — sptId (state)
        // belum ter-update pada invocation yang sama (React state update async).
        // Save berikutnya (sptId sudah ada di state) tetap pakai sptId seperti biasa.
        let activeSptId = sptId;
        if (!sptId) {
            const createdSptId = await createSpt();
            if (!createdSptId) return false;
            activeSptId = createdSptId;
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
            // L1A/L1C/L1D — persist ke backend V3 (spt_l1). Database V3 adalah
            // source of truth L1 sekarang; localStorage TIDAK lagi dipakai untuk L1.
            // Guard pakai activeSptId (bukan sptId) — pada Save Draft PERTAMA, sptId
            // (state) belum ter-update meski createSpt() sudah sukses di atas.
            if (activeSptId) {
                try {
                    const l1Errors = await saveL1ToV3();
                    if (l1Errors.length > 0) {
                        console.error('Sebagian baris L1 gagal disimpan ke V3:', l1Errors);
                        errors.push(...l1Errors.map(e => `L1: ${e}`));
                    }
                } catch (err) {
                    console.error('Gagal menyimpan L1 ke V3:', err);
                    errors.push(`L1: ${err.message}`);
                }
            }
            // Main Form — persist ke backend V3 (spt_main_form), untuk field
            // yang memiliki kolom tujuan (lihat buildMainFormV3Payload). Field
            // V2 sectionsToSave di atas TETAP dijalankan apa adanya (TIDAK
            // dihapus) — masih menjadi persistence untuk field yang belum
            // memiliki kolom V3 (attachments, company_identity.address, dst).
            if (activeSptId) {
                try {
                    const mfHeaderId = await resolveV3HeaderId(activeSptId);
                    const mfErrors = await saveMainFormToV3(mfHeaderId);
                    if (mfErrors.length > 0) {
                        console.error('Sebagian field Main Form gagal disimpan ke V3:', mfErrors);
                        errors.push(...mfErrors.map(e => `MainForm: ${e}`));
                    }
                } catch (err) {
                    console.error('Gagal menyimpan Main Form ke V3:', err);
                    errors.push(`MainForm: ${err.message}`);
                }
            }
            // L2–L8 — persist ke backend V3. Legacy localStorage save block di
            // bawah ini SENGAJA TIDAK dihapus (Section O: "jangan menghapus
            // sembarangan" jika ada kebutuhan UI non-persistence lain yang
            // masih memakainya) — tapi V3 di sinilah yang sekarang jadi
            // source of truth untuk Save maupun Load (lihat load useEffect).
            if (activeSptId) {
                const l2l8HeaderId = await resolveV3HeaderId(activeSptId).catch(err => {
                    console.error('Gagal resolve headerId untuk L2-L8 V3:', err);
                    errors.push(`L2-L8: gagal resolve headerId (${err.message})`);
                    return null;
                });
                if (l2l8HeaderId) {
                    const sectionSavers = [
                        ['L2', saveL2ToV3], ['L3', saveL3ToV3], ['L4', saveL4ToV3],
                        ['L5', saveL5ToV3], ['L6', saveL6ToV3], ['L7', saveL7ToV3], ['L8', saveL8ToV3],
                        // L9–L14 V3 persistence — sama headerId (resolveV3HeaderId), sama
                        // pola error-collection dengan L2–L8 di atas.
                        ['L9', saveL9ToV3], ['L10A', saveL10aToV3], ['L10B', saveL10bToV3],
                        ['L10C', saveL10cToV3], ['L10D', saveL10dToV3],
                        ['L11A', saveL11aToV3], ['L11B', saveL11bToV3], ['L11C', saveL11cToV3],
                        ['L13A', saveL13aToV3], ['L13B', saveL13bToV3], ['L13C', saveL13cToV3],
                        ['L14', saveL14ToV3],
                    ];
                    for (const [label, saver] of sectionSavers) {
                        try {
                            const sErrors = await saver(l2l8HeaderId);
                            if (sErrors && sErrors.length > 0) {
                                console.error(`Sebagian ${label} gagal disimpan ke V3:`, sErrors);
                                errors.push(...sErrors.map(e => `${label}: ${e}`));
                            }
                        } catch (err) {
                            console.error(`Gagal menyimpan ${label} ke V3:`, err);
                            errors.push(`${label}: ${err.message}`);
                        }
                    }
                }
            }
            if (sptId) {
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
                // L9–L14 localStorage save DIHAPUS — V3 database adalah source
                // of truth (saveL9ToV3..saveL14ToV3 dipanggil di sectionSavers loop
                // L2-L8 V3 di atas). Kontrak §20.
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
            // L9–L14 localStorage save saat submit DIHAPUS — V3 database sudah
            // menjadi source of truth (dipersist via Save Draft sebelumnya), pola
            // identik L1–L8 yang juga tidak di-localStorage-save ulang di sini
            // (submitSpt() tidak memanggil V3 savers sama sekali, L1-L8 maupun
            // L9-L14 — konsisten, bukan penyimpangan baru). Kontrak §20.
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

    // ── Imperative handle — SptTahunanBadan.js merender <L11A> sebagai SIBLING
    // (bukan child) dari komponen ini; MainFormBadan.js TIDAK merender L11A
    // sama sekali (murni persistence/orchestration untuk semua section,
    // termasuk L9-L14). Untuk tombol "SIMPAN" section-level IV.B Regional
    // Benefit di L11A.js, SptTahunanBadan.js butuh cara memicu persistence V3
    // yang SAMA PERSIS dengan yang sudah dipakai Save Draft (resolveV3HeaderId)
    // tanpa membangun jalur persistence kedua — diekspos via ref, bukan
    // duplikasi logic. State locked/confirmed ITU SENDIRI sengaja TIDAK
    // disimpan di sini — dikelola oleh SptTahunanBadan.js (pemilik render
    // <L11A>), method ini hanya menjalankan network save dan melempar error
    // bila gagal (kontrak: "gagal save → jangan lock").
    //
    // FIX (React Hooks rule): sebelumnya hook ini diletakkan SETELAH
    // `if (isSubmitted && !waitingPayment) { return (...); }` — melanggar
    // Rules of Hooks (hook jadi conditional, tidak selalu dipanggil di
    // render yang sama). Dipindah ke SINI, sebelum return apapun, supaya
    // selalu dipanggil unconditional di setiap render.
    //
    // Catatan: fungsi ini TIDAK memakai dependency array (bentuk 2-argumen
    // useImperativeHandle(ref, createHandle)) — sengaja, supaya handle yang
    // dibuat SELALU menutup l11aData/sptId/regionalBenefit terbaru dari
    // render yang sedang berjalan, bukan closure basi dari render lama.
    // Karena tidak ada dependency array, TIDAK ADA aturan
    // react-hooks/exhaustive-deps yang relevan di sini — comment
    // eslint-disable sebelumnya tidak diperlukan dan sudah dihapus.
    useImperativeHandle(ref, () => ({
        // FIX (scope correction — Part 3/5/6/7): SEBELUMNYA memanggil
        // saveL11aToV3 (menyimpan SEMUA 7 sub-bagian L11A — Promotion,
        // Entertainment, BadDebt, Facility IV.A, Npl, RegionalBenefit,
        // RegionalFacility sekaligus). Diganti ke
        // saveL11aRegionalBenefitOnlyToV3 — HANYA spt_l11a_regional_benefit.
        // Specific Areas (l11aRegionalFacility) dan 5 sub-bagian L11A
        // lainnya TIDAK disentuh oleh tombol IV.B [SIMPAN] — tetap murni
        // tanggung jawab global Save Draft seperti sebelumnya.
        confirmL11aRegionalBenefit: async () => {
            const headerId = await resolveV3HeaderId(sptId);
            if (!headerId) {
                throw new Error('SPT belum tersimpan (headerId V3 belum tersedia) — lakukan Save Draft terlebih dahulu.');
            }
            const { errors: sectionErrors } = await saveL11aRegionalBenefitOnlyToV3(headerId);
            if (sectionErrors && sectionErrors.length > 0) {
                // Gagal → JANGAN set flag confirmed, JANGAN panggil callback lock
                // (Kontrak §B3/§B13/Part 10 — "gagal save → jangan lock").
                throw new Error(sectionErrors.join('; '));
            }
            setRegionalBenefitConfirmedFlag(sptId, true);
            if (onRegionalBenefitLockChange) onRegionalBenefitLockChange(true);
            return true;
        },
        // Unlock murni UI/local — tidak ada network call (klik EDIT tidak
        // mengubah data apapun, hanya membuka field untuk diedit lagi).
        unlockL11aRegionalBenefit: () => {
            setRegionalBenefitConfirmedFlag(sptId, false);
            if (onRegionalBenefitLockChange) onRegionalBenefitLockChange(false);
        },
    }));

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
});

export default SptTahunanBadanForm;