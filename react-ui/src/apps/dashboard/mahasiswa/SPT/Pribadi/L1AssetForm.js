import React, { useState, useEffect } from 'react';
import {
    Check, Download, FileOpen, ArrowBack, ArrowForward,
    Save, Send, Warning, Info, Upload, Delete, ExpandMore, ExpandLess,
    Person, Assignment, Calculate, CreditCard, AccountBalance,
    Refresh, Business, AttachFile, CheckBox, Add, Edit, KeyboardArrowRight
} from '@mui/icons-material';

// L-1 Component - Assets at the End of Tax Year
export const L1AssetsForm = ({ data, onDataChange, taxpayerData }) => {
    const [currentSection, setCurrentSection] = useState('main');
    const [currentForm, setCurrentForm] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});
    const [assets, setAssets] = useState(data || {
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


    console.log('assets ', assets)
    useEffect(() => {
        onDataChange && onDataChange(assets);
    }, [assets, onDataChange]);

    // Auto-generate code based on category and existing items
    const generateCode = (category) => {
        const codeMappings = {
            cash_and_cash_equivalents: '01',
            account_receivable: '02',
            investments_securities: '03',
            movable_assets: '04',
            non_movable_assets: '05',
            other_assets: '06',
            debt_at_end_of_year: '07'
        };

        const baseCode = codeMappings[category] || '01';
        const existingItems = assets[category] || [];
        const nextNumber = (existingItems.length + 1).toString().padStart(2, '0');
        return `${baseCode}${nextNumber}`;
    };

    const addAssetItem = (category, formData) => {
        const newItem = {
            id: Date.now(),
            code: generateCode(category),
            ...formData
        };

        setAssets(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), newItem]
        }));
        setCurrentForm(null);
        setEditingItem(null);
    };

    const updateAssetItem = (category, itemId, formData) => {
        setAssets(prev => ({
            ...prev,
            [category]: prev[category].map(item =>
                item.id === itemId ? { ...item, ...formData } : item
            )
        }));
        setCurrentForm(null);
        setEditingItem(null);
    };

    const removeAssetItem = (category, id) => {
        setAssets(prev => ({
            ...prev,
            [category]: prev[category].filter(item => item.id !== id)
        }));
    };

    const deleteAssetItem = (section, itemId) => {
        setAssets(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== itemId)
        }));
    };

    // Get list for specific section
    const getAssetList = (section) => {
        return assets[section] || [];
    };


    const toggleSection = (sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    };

    const startEdit = (category, item) => {
        setEditingItem(item);
        setCurrentForm(category);
    };


    const MainView = () => (
        <div className="max-w-6xl mx-auto bg-white">
            {/* Header Section */}
            <div className="border-2 rounded-lg mb-4">
                <div className="bg-gray-100 px-6 py-3 rounded-t-lg border-b border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-700">HEADER</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Period Year</label>
                            <input
                                type="text"
                                value="2023"
                                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">TIN/NIK</label>
                            <input
                                type="text"
                                value={taxpayerData?.nik || "320102151064002"}
                                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Sections */}
            <div className="space-y-4">
                <AccordionSection
                    title="A. ASSETS AT THE END OF TAX YEAR"
                    sectionKey="assets"
                    isExpanded={expandedSections.assets}
                    onToggle={() => toggleSection('assets')}
                >
                    <AssetsSection />
                </AccordionSection>

                <AccordionSection
                    title="B. DEBT AT THE END OF TAX YEAR"
                    sectionKey="debt"
                    isExpanded={expandedSections.debt}
                    onToggle={() => toggleSection('debt')}
                >
                    <DebtSection />
                </AccordionSection>

                <AccordionSection
                    title="C. LIST OF DEPENDANTS FAMILY MEMBERS"
                    sectionKey="dependants"
                    isExpanded={expandedSections.dependants}
                    onToggle={() => toggleSection('dependants')}
                >
                    <DependantsSection />
                </AccordionSection>

                <AccordionSection
                    title="D. NET INCOME FROM EMPLOYMENT"
                    sectionKey="employment"
                    isExpanded={expandedSections.employment}
                    onToggle={() => toggleSection('employment')}
                >
                    <EmploymentSection />
                </AccordionSection>

                <AccordionSection
                    title="E. WITHHOLDING TAX SLIP"
                    sectionKey="withholding"
                    isExpanded={expandedSections.withholding}
                    onToggle={() => toggleSection('withholding')}
                >
                    <TaxSection />
                </AccordionSection>
            </div>
        </div>
    );

    const AccordionSection = ({ title, children, sectionKey, isExpanded, onToggle }) => (
        <div className="border-2 rounded-lg">
            <button
                onClick={onToggle}
                className="w-full bg-gray-100 hover:bg-gray-200 px-6 py-4 rounded-t-lg border-b border-gray-300 flex items-center justify-between transition-colors"
            >
                <span className="text-lg font-semibold text-gray-700">{title}</span>
                <KeyboardArrowRight
                    className={`h-6 w-6 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''
                        }`}
                />
            </button>
            {isExpanded && (
                <div className="bg-white rounded-b-lg">
                    {children}
                </div>
            )}
        </div>
    );

    const AssetsSection = () => (
        <div className="p-6 space-y-6">
            <CashAndCashEquivalentsSection />
            <AccountReceivableSection />
            <InvestmentsSecuritiesSection />
            <MovableAssetsSection />
            <NonMovableAssetsSection />
            <OtherAssetsSection />


            {/* Summary */}
            <div className="mt-8 border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">7. Summary of Assets</h4>
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead>
                            <tr className="bg-yellow-400">
                                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-r border-gray-300">DESCRIPTION</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">COST OF ACQUISITION</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-800">CURRENT/FAIR MARKET VALUE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white">
                                <td className="px-4 py-3 font-medium border-r border-gray-300">TOTAL OF ASSETS</td>
                                <td className="px-4 py-3 text-center border-r border-gray-300">IDR {calculateSummaryTotal().toLocaleString('id-ID')}</td>
                                <td className="px-4 py-3 text-center">IDR {calculateSummaryTotal().toLocaleString('id-ID')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );


    const CashAndCashEquivalentsSection = () => (
        <div className="space-y-4">
            <div className="border border-gray-300 rounded-lg bg-white">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-700">1. CASH AND CASH EQUIVALENTS</h3>
                </div>

                <div className="p-4">
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setCurrentForm('cash_and_cash_equivalents');
                            }}
                            className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
                        >
                            <Add className="h-4 w-4" />
                            Add
                        </button>
                        <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium">
                            <Upload className="h-4 w-4" />
                            XML Upload
                            <ExpandMore className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Action Icons */}
                    <div className="flex gap-2 mb-4">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Refresh className="h-5 w-5 text-gray-700" />
                        </div>
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                            <FileOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckBox className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <Delete className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="px-4 py-3 text-left font-semibold text-gray-800 border-r border-gray-300">ACTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">CODE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">DESCRIPTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">ACCOUNT NUMBER</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">BANK/INSTITUTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">BALANCE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800">REMARK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Existing data rows */}
                                {assets.cash_and_cash_equivalents.map((item, index) => (
                                    <tr key={item.id} className="border-t border-gray-200">
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit('cash_and_cash_equivalents', item)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeAssetItem('cash_and_cash_equivalents', item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
                                                    <Delete className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.code}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.description || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.account_number || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.bank_institution_name || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {item.balance ? `IDR ${parseFloat(item.balance).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.remark || '-'}
                                        </td>
                                    </tr>
                                ))}
                                {assets.cash_and_cash_equivalents.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                            No cash and cash equivalents data. Click "Add" to create new entry.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary for Cash section */}
                    {assets.cash_and_cash_equivalents.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Total Cash and Cash Equivalents:</span>
                                <span className="font-bold text-green-600">
                                    IDR {calculateCashTotal().toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const DebtSection = () => (
        <div className="p-6">
            <div className="p-4">
                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setCurrentForm('debt_at_end_of_year');
                        }}
                        className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
                    >
                        <Add className="h-4 w-4" />
                        Add
                    </button>
                    <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium">
                        <Upload className="h-4 w-4" />
                        XML Upload
                        <ExpandMore className="h-4 w-4" />
                    </button>
                    {/* Red circle with number */}
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{assets.debt_at_end_of_year.length}</span>
                    </div>
                </div>

                {/* Action Icons */}
                <div className="flex gap-2 mb-4">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Refresh className="h-5 w-5 text-gray-700" />
                    </div>
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                        <FileOpen className="h-5 w-5 text-white" />
                    </div>
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckBox className="h-5 w-5 text-white" />
                    </div>
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <Delete className="h-5 w-5 text-white" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead>
                            <tr className="bg-yellow-400">
                                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-r border-gray-300">ACTION</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">NO</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">CODE</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">DESCRIPTION</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">CREDITOR</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">COUNTRY OF CREDITOR</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">YEAR OF ACQUISITION</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">BALANCE OF DEBT</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-800">REMARK</th>
                            </tr>
                            <tr className="bg-yellow-400">
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300">TIN</th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800"></th>
                            </tr>
                            <tr className="bg-yellow-400">
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300">Name</th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800 border-r border-gray-300"></th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-800"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Filter row */}
                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-3 border-r border-gray-300">
                                    <div className="flex justify-center">
                                        <button className="text-gray-400">
                                            <Info className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-3 border-r border-gray-300 text-center">
                                    <div className="flex justify-center">
                                        <button className="text-gray-400">
                                            <Info className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-3 border-r border-gray-300 text-center">
                                    <div className="flex justify-center">
                                        <button className="text-gray-400">
                                            <Info className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-3 border-r border-gray-300">
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                        <option value="">Please Select</option>
                                        <option value="Utang Bank /Lembaga Keuangan Bukan Bank (KPR, Leasing Kendaraan Bermotor, dan sejenisnya)">Utang Bank /Lembaga Keuangan Bukan Bank (KPR, Leasing Kendaraan Bermotor, dan sejenisnya)</option>
                                        <option value="Kartu Kredit">Kartu Kredit</option>
                                        <option value="Utang Afiliasi (Pinjaman dari pihak yang memiliki hubungan istimewa sebagaimana dimaksud dalam Pasal 18 ayat (4) Undang-Undang PPh)">Utang Afiliasi (Pinjaman dari pihak yang memiliki hubungan istimewa sebagaimana dimaksud dalam Pasal 18 ayat (4) Undang-Undang PPh)</option>
                                        <option value="Utang Lainnya">Utang Lainnya</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 border-r border-gray-300">
                                    <div className="flex justify-center">
                                        <button className="text-gray-400">
                                            <Info className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-3 border-r border-gray-300">
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                        <option value="">Please Select</option>
                                        <option value="Indonesia">Indonesia</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 border-r border-gray-300">
                                    <div className="flex justify-center">
                                        <button className="text-gray-400">
                                            <Info className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-3 border-r border-gray-300">
                                    <div className="flex justify-center">
                                        <button className="text-gray-400">
                                            <Info className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                        <option value="">Please Select</option>
                                        <option value="Harta PPS">Harta PPS</option>
                                        <option value="Harta Investasi PPS">Harta Investasi PPS</option>
                                    </select>
                                </td>
                            </tr>

                            {/* Existing data rows */}
                            {assets.debt_at_end_of_year.map((item, index) => (
                                <tr key={item.id} className="border-t border-gray-200">
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit('debt_at_end_of_year', item)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => removeAssetItem('debt_at_end_of_year', item.id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Delete"
                                            >
                                                <Delete className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">
                                        {item.code}
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        {item.description || '-'}
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div>
                                            <div className="text-sm">{item.creditor_tin || '-'}</div>
                                            <div className="text-sm font-medium">{item.creditor_name || '-'}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        {item.country_of_creditor || '-'}
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">
                                        {item.year_of_acquisition || '-'}
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-right">
                                        {item.balance_of_debt ? `${parseFloat(item.balance_of_debt).toLocaleString('id-ID')}` : '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.remark || '-'}
                                    </td>
                                </tr>
                            ))}
                            {assets.debt_at_end_of_year.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                        No data found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Showing 1 to {assets.debt_at_end_of_year.length} of {assets.debt_at_end_of_year.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-600">TOTAL OF PART B</div>
                        <div className="font-bold text-red-600">
                            {assets.debt_at_end_of_year.reduce((sum, item) => sum + (parseFloat(item.balance_of_debt) || 0), 0).toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-center items-center gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm">«</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm">‹</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm">›</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm">»</button>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm ml-2">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>

        </div>
    );

    const DebtAtEndOfYearForm = () => {
        const [formData, setFormData] = useState(editingItem || {
            code: generateCode('debt_at_end_of_year'),
            description: '',
            creditor_tin: '',
            creditor_name: '',
            country_of_creditor: '',
            year_of_acquisition: '',
            balance_of_debt: '',
            remark: ''
        });

        const descriptions = [
            'Utang Bank /Lembaga Keuangan Bukan Bank (KPR, Leasing Kendaraan Bermotor, dan sejenisnya)',
            'Kartu Kredit',
            'Utang Afiliasi (Pinjaman dari pihak yang memiliki hubungan istimewa sebagaimana dimaksud dalam Pasal 18 ayat (4) Undang-Undang PPh)',
            'Utang Lainnya'
        ];

        const remarks = [
            'Harta PPS',
            'Harta Investasi PPS'
        ];

        const handleSubmit = () => {
            if (!formData.description || !formData.balance_of_debt) {
                alert('Please fill in required fields: Description and Balance of Debt');
                return;
            }

            if (editingItem) {
                updateAssetItem('debt_at_end_of_year', editingItem.id, formData);
            } else {
                addAssetItem('debt_at_end_of_year', formData);
            }
        };

        return (
            <div className="max-w-6xl mx-auto bg-white">
                <div className="flex items-center gap-4 mb-6 p-4 border-b">
                    <button
                        onClick={() => setCurrentForm(null)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowBack className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingItem ? 'Edit' : 'Add'} Debt At The End Of Tax Year
                    </h2>
                </div>

                <div className="border border-gray-300 rounded-lg bg-white mx-4 mb-4">
                    <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-700">DEBT AT THE END OF TAX YEAR</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <select
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Please Select</option>
                                    {descriptions.map((desc, index) => (
                                        <option key={index} value={desc}>{desc}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Creditor TIN *</label>
                                <input
                                    type="text"
                                    value={formData.creditor_tin}
                                    onChange={(e) => setFormData({ ...formData, creditor_tin: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter creditor TIN"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Creditor Name *</label>
                                <input
                                    type="text"
                                    value={formData.creditor_name}
                                    onChange={(e) => setFormData({ ...formData, creditor_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter creditor name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country Of Creditor *</label>
                                <select
                                    value={formData.country_of_creditor}
                                    onChange={(e) => setFormData({ ...formData, country_of_creditor: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    <option value="Indonesia">Indonesia</option>
                                    <option value="Malaysia">Malaysia</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="United States">United States</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year Of Acquisition *</label>
                                <input
                                    type="number"
                                    value={formData.year_of_acquisition}
                                    onChange={(e) => setFormData({ ...formData, year_of_acquisition: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 2023"
                                    min="1900"
                                    max="2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Balance Of Debt *</label>
                                <input
                                    type="number"
                                    value={formData.balance_of_debt}
                                    onChange={(e) => setFormData({ ...formData, balance_of_debt: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                                <select
                                    value={formData.remark}
                                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {remarks.map((remark, index) => (
                                        <option key={index} value={remark}>{remark}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setCurrentForm(null)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                type="button"
                            >
                                <span>✕</span>
                                Close
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center gap-2"
                                type="button"
                            >
                                <Save className="h-4 w-4" />
                                {editingItem ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const DependantsSection = () => {
        const [assets] = useState({
            dependants_family_members: []
        });

        return (
            <div className="p-6">
                <div className="p-4">
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                        <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium">
                            <Add className="h-4 w-4" />
                            Add
                        </button>
                        <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium">
                            <Upload className="h-4 w-4" />
                            XML Upload
                            <ExpandMore className="h-4 w-4" />
                        </button>
                        {/* Red circle with number */}
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{assets.dependants_family_members.length}</span>
                        </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex gap-2 mb-4">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Refresh className="h-5 w-5 text-gray-700" />
                        </div>
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                            <FileOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckBox className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <Delete className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">NO</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">NAME</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">NATIONAL IDENTITY NUMBER (NIK)</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">DATE OF BIRTH</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">RELATIONSHIP WITH TAXPAYER</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800">JOB</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Filter row */}
                                <tr className="bg-white border-b border-gray-300">
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                                        />
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <input
                                            type="text"
                                            placeholder="NIK"
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                                        />
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                                        />
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select Relationship</option>
                                            <option value="Wife">Wife</option>
                                            <option value="Husband">Husband</option>
                                            <option value="Child">Child</option>
                                            <option value="Parent">Parent</option>
                                            <option value="Sibling">Sibling</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select Job</option>
                                            <option value="Housewives">Housewives</option>
                                            <option value="Student">Student</option>
                                            <option value="Employee">Employee</option>
                                            <option value="Entrepreneur">Entrepreneur</option>
                                            <option value="Retired">Retired</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </td>
                                </tr>

                                {/* Data row - sample data sesuai screenshot */}
                                <tr className="border-t border-gray-200">
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">1</td>
                                    <td className="px-4 py-3 border-r border-gray-300">NAMA</td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">320</td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">14-10-1969</td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">Wife</td>
                                    <td className="px-4 py-3 text-center">HOUSEWIVES</td>
                                </tr>

                                {/* Dynamic data rows */}
                                {assets.dependants_family_members.map((item, index) => (
                                    <tr key={item.id} className="border-t border-gray-200">
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {index + 2}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.name || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.nik || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.date_of_birth || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.relationship || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {item.job || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing 1 to 1 of 1 entries
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">«</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">‹</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-blue-600 text-white">1</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">›</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">»</button>
                        <select className="px-3 py-1 border border-gray-300 rounded text-sm ml-2">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    };

    const EmploymentSection = () => {
        const [showForm, setShowForm] = useState(false);
        const [editingItem, setEditingItem] = useState(null);

        // Get employment data from root state
        const employmentData = getAssetList('employment_income');

        const addEmployment = (data) => {
            if (editingItem) {
                updateAssetItem('employment_income', editingItem.id, data);
                setEditingItem(null);
            } else {
                addAssetItem('employment_income', data);
            }
            setShowForm(false);
        };

        const deleteEmployment = (id) => {
            deleteAssetItem('employment_income', id);
        };

        const startEdit = (item) => {
            setEditingItem(item);
            setShowForm(true);
        };

        const calculateTotal = () => {
            return employmentData.reduce((sum, item) => sum + (parseFloat(item.net_income) || 0), 0);
        };

        if (showForm) {
            return <EmploymentForm
                onSave={addEmployment}
                onCancel={() => {
                    setShowForm(false);
                    setEditingItem(null);
                }}
                editingItem={editingItem}
            />;
        }

        return (
            <div className="p-6">
                <div className="p-4">
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
                        >
                            <Add className="h-4 w-4" />
                            Add
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">ACTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">NAME OF EMPLOYER</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">TIN OF EMPLOYER</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">GROSS INCOME</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">DEDUCTION OF GROSS INCOME</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800">NET INCOME</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Data rows */}
                                {employmentData.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-200">
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() => startEdit(item)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteEmployment(item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Delete className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">{item.employer_name}</td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">{item.tin_of_employer}</td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {parseFloat(item.gross_income || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {parseFloat(item.deduction_of_gross_income || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {parseFloat(item.net_income || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}

                                {employmentData.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                            No data found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing {employmentData.length > 0 ? 1 : 0} to {employmentData.length} of {employmentData.length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-600">TOTAL OF PART D</div>
                            <div className="font-bold text-green-600">
                                {calculateTotal().toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const EmploymentForm = ({ onSave, onCancel, editingItem }) => {
        const [formData, setFormData] = useState(editingItem || {
            tin_of_employer: '',
            employer_name: '',
            gross_income: '0',
            deduction_of_gross_income: '0',
            net_income: '0'
        });

        useEffect(() => {
            // Auto calculate net income
            const gross = parseFloat(formData.gross_income) || 0;
            const deduction = parseFloat(formData.deduction_of_gross_income) || 0;
            const net = gross - deduction;
            setFormData(prev => ({ ...prev, net_income: net.toString() }));
        }, [formData.gross_income, formData.deduction_of_gross_income]);

        const handleSubmit = () => {
            if (!formData.tin_of_employer || !formData.employer_name) {
                alert('Please fill in required fields');
                return;
            }
            onSave(formData);
        };

        return (
            <div className="max-w-2xl mx-auto bg-white p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">NET INCOME FROM EMPLOYMENT</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">TIN Of Employer *</label>
                        <input
                            type="text"
                            value={formData.tin_of_employer}
                            onChange={(e) => setFormData({ ...formData, tin_of_employer: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter TIN"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Employer Name *</label>
                        <input
                            type="text"
                            value={formData.employer_name}
                            onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
                            placeholder="Enter employer name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gross Income *</label>
                        <input
                            type="number"
                            value={formData.gross_income}
                            onChange={(e) => setFormData({ ...formData, gross_income: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="0"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deduction Of Gross Income *</label>
                        <input
                            type="number"
                            value={formData.deduction_of_gross_income}
                            onChange={(e) => setFormData({ ...formData, deduction_of_gross_income: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="0"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Net Income *</label>
                        <input
                            type="number"
                            value={formData.net_income}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-right"
                            disabled
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-10">
                    <button
                        onClick={onCancel}
                        className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <span>✕</span>
                        Close
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center gap-2"
                    >
                        <Save className="h-5 w-5" />
                        Save
                    </button>
                </div>
            </div>
        );
    };


    const taxTypes = [
        'PPh Pasal 15',
        'PPh Pasal 21',
        'PPh Pasal 22',
        'PPh Pasal 23',
        'PPh Pasal 26',
        'PPh Ditanggung Pemerintah',
        'PPh Ditanggung Pemerintah (Proyek Bantuan Luar Negeri)',
        'Sisa LB yang tidak dikembalikan pada SKPPKP',
    ];

    const TaxSection = () => {
        const [showForm, setShowForm] = useState(false);
        const [editingItem, setEditingItem] = useState(null);

        // Get tax data from root state
        const taxData = getAssetList('withholding_tax');

        const addTax = (data) => {
            if (editingItem) {
                updateAssetItem('withholding_tax', editingItem.id, data);
                setEditingItem(null);
            } else {
                addAssetItem('withholding_tax', data);
            }
            setShowForm(false);
        };

        const deleteTax = (id) => {
            deleteAssetItem('withholding_tax', id);
        };

        const startEdit = (item) => {
            setEditingItem(item);
            setShowForm(true);
        };

        if (showForm) {
            return (
                <TaxForm
                    onSave={addTax}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingItem(null);
                    }}
                    editingItem={editingItem}
                />
            );
        }

        return (
            <div className="p-6">
                <div className="p-4">
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium mb-4"
                    >
                        <Add className="h-4 w-4" />
                        Add
                    </button>

                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-yellow-400 text-gray-800 font-semibold text-sm">
                                    <th className="px-4 py-3 border-r border-gray-300">ACTION</th>
                                    <th className="px-4 py-3 border-r border-gray-300">TAX WITHHOLDER NAME</th>
                                    <th className="px-4 py-3 border-r border-gray-300">TIN</th>
                                    <th className="px-4 py-3 border-r border-gray-300">SLIP NUMBER</th>
                                    <th className="px-4 py-3 border-r border-gray-300">SLIP DATE</th>
                                    <th className="px-4 py-3 border-r border-gray-300">TAX TYPE</th>
                                    <th className="px-4 py-3 border-r border-gray-300">TAX BASE</th>
                                    <th className="px-4 py-3">AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {taxData.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center text-gray-500 py-8">
                                            No data found.
                                        </td>
                                    </tr>
                                ) : (
                                    taxData.map((item) => (
                                        <tr key={item.id} className="border-t border-gray-200">
                                            <td className="px-4 py-3 border-r border-gray-300 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTax(item.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Delete className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 border-r">{item.name}</td>
                                            <td className="px-4 py-3 border-r text-center">{item.tin}</td>
                                            <td className="px-4 py-3 border-r">{item.slipNumber}</td>
                                            <td className="px-4 py-3 border-r text-center">{item.slipDate}</td>
                                            <td className="px-4 py-3 border-r">{item.taxType}</td>
                                            <td className="px-4 py-3 border-r text-right">
                                                {parseFloat(item.taxBase || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {parseFloat(item.taxAmount || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const TaxForm = ({ onSave, onCancel, editingItem }) => {
        const [formData, setFormData] = useState(
            editingItem || {
                name: '',
                tin: '',
                slipNumber: '',
                slipDate: '',
                taxType: '',
                taxBase: '',
                taxAmount: '',
            }
        );

        const taxTypes = [
            'PPh Pasal 15',
            'PPh Pasal 21',
            'PPh Pasal 22',
            'PPh Pasal 23',
            'PPh Pasal 26',
            'PPh Ditanggung Pemerintah',
            'PPh Ditanggung Pemerintah (Proyek Bantuan Luar Negeri)',
            'Sisa LB yang tidak dikembalikan pada SKPPKP',
        ];

        const handleChange = (field) => (e) =>
            setFormData({ ...formData, [field]: e.target.value });

        const handleSubmit = () => {
            if (!formData.name || !formData.tin || !formData.taxType) {
                alert('Please fill in all required fields');
                return;
            }
            onSave(formData);
        };

        return (
            <div className="max-w-3xl mx-auto bg-white p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">WITHHOLDING TAX FORM</h2>
                <div className="flex flex-col space-y-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tax Withholder Name *</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded"
                            value={formData.name}
                            onChange={handleChange('name')}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tax Withholder TIN *</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded"
                            value={formData.tin}
                            onChange={handleChange('tin')}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Withholding Tax Slip Number *</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded"
                            value={formData.slipNumber}
                            onChange={handleChange('slipNumber')}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Withholding Tax Slip Date *</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border rounded"
                            value={formData.slipDate}
                            onChange={handleChange('slipDate')}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Tax Type *</label>
                        <select
                            className="w-full px-4 py-2 border rounded"
                            value={formData.taxType}
                            onChange={handleChange('taxType')}
                        >
                            <option value="">Select tax type</option>
                            {taxTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tax Base *</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border rounded text-right"
                            value={formData.taxBase}
                            onChange={handleChange('taxBase')}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount Of Withholding Tax *</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border rounded text-right"
                            value={formData.taxAmount}
                            onChange={handleChange('taxAmount')}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-10">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border text-gray-700 rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 flex items-center gap-2"
                    >
                        <Save className="h-5 w-5" />
                        Save
                    </button>
                </div>
            </div>
        );
    };


    const calculateCashTotal = () => {
        return assets.cash_and_cash_equivalents.reduce((sum, item) => sum + (parseFloat(item.balance) || 0), 0);
    };

    const AccountReceivableSection = () => (
        <div className="space-y-4">
            <div className="border border-gray-300 rounded-lg bg-white">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-700">2. ACCOUNT RECEIVABLE</h3>
                </div>

                <div className="p-4">
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setCurrentForm('account_receivable');
                            }}
                            className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
                        >
                            <Add className="h-4 w-4" />
                            Add
                        </button>
                        <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium">
                            <Upload className="h-4 w-4" />
                            XML Upload
                            <ExpandMore className="h-4 w-4" />
                        </button>
                        {/* Red circle with number */}
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{assets.account_receivable.length}</span>
                        </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex gap-2 mb-4">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Refresh className="h-5 w-5 text-gray-700" />
                        </div>
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                            <FileOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckBox className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <Delete className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="px-4 py-3 text-left font-semibold text-gray-800 border-r border-gray-300">ACTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">CODE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">DESCRIPTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">COUNTRY OF RECIPIENT</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">RECIPIENT - TIN</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">RECIPIENT - NAME</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">RECEIVABLE VALUE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">YEAR OF RECEIVABLE COMMENCEMENT</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">CURRENT BALANCE OF RECEIVABLE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800">REMARK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Filter row */}
                                <tr className="bg-white border-b border-gray-300">
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select DESCRIPTION</option>
                                            <option value="Piutang Usaha">Piutang Usaha</option>
                                            <option value="Afiliasi Piutang">Afiliasi Piutang</option>
                                            <option value="Piutang lainnya">Piutang lainnya</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select COUNTRY OF RECIPIENT</option>
                                            <option value="Indonesia">Indonesia</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select REMARK</option>
                                            <option value="Harta PPS">Harta PPS</option>
                                            <option value="Harta Investasi PPS">Harta Investasi PPS</option>
                                        </select>
                                    </td>
                                </tr>

                                {/* Existing data rows */}
                                {assets.account_receivable.map((item, index) => (
                                    <tr key={item.id} className="border-t border-gray-200">
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit('account_receivable', item)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeAssetItem('account_receivable', item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
                                                    <Delete className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.code}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.description || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.country_of_recipient || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.tin_of_recipient || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.name_of_recipient || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {item.receivable_value ? `IDR ${parseFloat(item.receivable_value).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.year_of_receivable_commencement || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {item.current_balance ? `IDR ${parseFloat(item.current_balance).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.remark || '-'}
                                        </td>
                                    </tr>
                                ))}
                                {assets.account_receivable.length === 0 && (
                                    <tr>
                                        <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                                            No data found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing 0 to {assets.account_receivable.length} of {assets.account_receivable.length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-600">TOTAL OF PART 2</div>
                            <div className="font-bold text-green-600">
                                {assets.account_receivable.reduce((sum, item) => sum + (parseFloat(item.current_balance) || 0), 0).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">«</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">‹</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">›</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">»</button>
                        <select className="px-3 py-1 border border-gray-300 rounded text-sm ml-2">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const InvestmentsSecuritiesSection = () => (
        <div className="space-y-4">
            <div className="border border-gray-300 rounded-lg bg-white">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-700">3. INVESTMENTS/SECURITIES</h3>
                </div>

                <div className="p-4">
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setCurrentForm('investments_securities');
                            }}
                            className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
                        >
                            <Add className="h-4 w-4" />
                            Add
                        </button>
                        <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium">
                            <Upload className="h-4 w-4" />
                            XML Upload
                            <ExpandMore className="h-4 w-4" />
                        </button>
                        {/* Red circle with number */}
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{assets.investments_securities.length}</span>
                        </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex gap-2 mb-4">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Refresh className="h-5 w-5 text-gray-700" />
                        </div>
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                            <FileOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckBox className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <Delete className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="px-4 py-3 text-left font-semibold text-gray-800 border-r border-gray-300">ACTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">CODE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">DESCRIPTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">COUNTRY WHERE THE ASSET IS LOCATED</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">TIN OF RECIPIENT</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">NAME OF RECIPIENT</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">ACCOUNT NUMBER</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">COST OF ACQUISITION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">YEAR OF ACQUISITION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">CURRENT BALANCE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800">REMARK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Filter row */}
                                <tr className="bg-white border-b border-gray-300">
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select DESCRIPTION</option>
                                            <option value="Saham yang dibeli untuk dijual kembali">Saham yang dibeli untuk dijual kembali</option>
                                            <option value="Saham non bursa">Saham non bursa</option>
                                            <option value="Saham bursa">Saham bursa</option>
                                            <option value="Kewajiban perusahaan">Kewajiban perusahaan</option>
                                            <option value="Obligasi pemerintah Indonesia">Obligasi pemerintah Indonesia</option>
                                            <option value="Surat hutang lainnya">Surat hutang lainnya</option>
                                            <option value="Kontrak Investasi Kolektif">Kontrak Investasi Kolektif</option>
                                            <option value="Instrumen derivatif">Instrumen derivatif</option>
                                            <option value="Penyertaan modal dalam perusahaan lain">Penyertaan modal dalam perusahaan lain</option>
                                            <option value="Asuransi">Asuransi</option>
                                            <option value="Unit Link di Asuransi">Unit Link di Asuransi</option>
                                            <option value="Investasi lainnya">Investasi lainnya</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select COUNTRY</option>
                                            <option value="Indonesia">Indonesia</option>
                                            <option value="Malaysia">Malaysia</option>
                                            <option value="Singapore">Singapore</option>
                                            <option value="United States">United States</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select REMARK</option>
                                            <option value="Harta PPS">Harta PPS</option>
                                            <option value="Harta Investasi PPS">Harta Investasi PPS</option>
                                        </select>
                                    </td>
                                </tr>

                                {/* Existing data rows */}
                                {assets.investments_securities.map((item, index) => (
                                    <tr key={item.id} className="border-t border-gray-200">
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit('investments_securities', item)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeAssetItem('investments_securities', item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
                                                    <Delete className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.code}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.description || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.country_where_asset_located || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.tin_of_recipient || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.name_of_recipient || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.account_number || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {item.cost_of_acquisition ? `IDR ${parseFloat(item.cost_of_acquisition).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.year_of_acquisition || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {item.current_balance ? `IDR ${parseFloat(item.current_balance).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.remark || '-'}
                                        </td>
                                    </tr>
                                ))}
                                {assets.investments_securities.length === 0 && (
                                    <tr>
                                        <td colSpan="11" className="px-4 py-8 text-center text-gray-500">
                                            No data found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing 0 to {assets.investments_securities.length} of {assets.investments_securities.length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-600">TOTAL OF PART 3</div>
                            <div className="font-bold text-green-600">
                                {assets.investments_securities.reduce((sum, item) => sum + (parseFloat(item.current_balance) || 0), 0).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">«</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">‹</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">›</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">»</button>
                        <select className="px-3 py-1 border border-gray-300 rounded text-sm ml-2">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const MovableAssetsSection = () => (
        <div className="space-y-4">
            <div className="border border-gray-300 rounded-lg bg-white">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-700">4. MOVABLE ASSETS</h3>
                </div>

                <div className="p-4">
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setCurrentForm('movable_assets');
                            }}
                            className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
                        >
                            <Add className="h-4 w-4" />
                            Add
                        </button>
                        <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium">
                            <Upload className="h-4 w-4" />
                            XML Upload
                            <ExpandMore className="h-4 w-4" />
                        </button>
                        {/* Red circle with number */}
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{assets.movable_assets.length}</span>
                        </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex gap-2 mb-4">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Refresh className="h-5 w-5 text-gray-700" />
                        </div>
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                            <FileOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckBox className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <Delete className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="px-4 py-3 text-left font-semibold text-gray-800 border-r border-gray-300">ACTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">CODE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">DESCRIPTION TYPE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">DESCRIPTION MERK MODEL</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">POLICE/REGISTRATION NUMBER</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">OWNERSHIP</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">TIN</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">NAME</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">YEAR OF ACQUISITION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">COST OF ACQUISITION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">FAIR/MARKET VALUE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800">REMARK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Filter row */}
                                <tr className="bg-white border-b border-gray-300">
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select DESCRIPTION TYPE</option>
                                            <option value="Sepeda">Sepeda</option>
                                            <option value="Sepeda Motor">Sepeda Motor</option>
                                            <option value="Mobil Penumpang">Mobil Penumpang</option>
                                            <option value="Bis">Bis</option>
                                            <option value="Kendaraan Angkutan Jalan">Kendaraan Angkutan Jalan</option>
                                            <option value="Kendaraan Tujuan Khusus">Kendaraan Tujuan Khusus</option>
                                            <option value="Kereta">Kereta</option>
                                            <option value="Pesawat Terbang">Pesawat Terbang</option>
                                            <option value="Kapal">Kapal</option>
                                            <option value="Mesin">Mesin</option>
                                            <option value="Gerobak">Gerobak</option>
                                            <option value="Kapal Pesiar">Kapal Pesiar</option>
                                            <option value="Harta bergerak lainnya">Harta bergerak lainnya</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select OWNERSHIP</option>
                                            <option value="Pribadi">Pribadi</option>
                                            <option value="Bersama">Bersama</option>
                                            <option value="Atas Nama Orang Lain">Atas Nama Orang Lain</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select REMARK</option>
                                            <option value="Harta PPS">Harta PPS</option>
                                            <option value="Harta Investasi PPS">Harta Investasi PPS</option>
                                        </select>
                                    </td>
                                </tr>

                                {/* Existing data rows */}
                                {assets.movable_assets.map((item, index) => (
                                    <tr key={item.id} className="border-t border-gray-200">
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit('movable_assets', item)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeAssetItem('movable_assets', item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
                                                    <Delete className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.code}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.description_type || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.description_merk_model || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.police_registration_number || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.ownership || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.tin || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.name || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.year_of_acquisition || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {item.cost_of_acquisition ? `IDR ${parseFloat(item.cost_of_acquisition).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {item.fair_market_value ? `IDR ${parseFloat(item.fair_market_value).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.remark || '-'}
                                        </td>
                                    </tr>
                                ))}
                                {assets.movable_assets.length === 0 && (
                                    <tr>
                                        <td colSpan="12" className="px-4 py-8 text-center text-gray-500">
                                            No data found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing 0 to {assets.movable_assets.length} of {assets.movable_assets.length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-600">TOTAL OF PART 4</div>
                            <div className="font-bold text-green-600">
                                {assets.movable_assets.reduce((sum, item) => sum + (parseFloat(item.fair_market_value) || 0), 0).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">«</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">‹</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">›</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">»</button>
                        <select className="px-3 py-1 border border-gray-300 rounded text-sm ml-2">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const NonMovableAssetsSection = () => (
        <div className="space-y-4">
            <div className="border border-gray-300 rounded-lg bg-white">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-700">5. NON-MOVABLE ASSETS (LAND AND BUILDING)</h3>
                </div>

                <div className="p-4">
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setCurrentForm('non_movable_assets');
                            }}
                            className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
                        >
                            <Add className="h-4 w-4" />
                            Add
                        </button>
                        <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium">
                            <Upload className="h-4 w-4" />
                            XML Upload
                            <ExpandMore className="h-4 w-4" />
                        </button>
                        {/* Red circle with number */}
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{assets.non_movable_assets.length}</span>
                        </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex gap-2 mb-4">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Refresh className="h-5 w-5 text-gray-700" />
                        </div>
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                            <FileOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckBox className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <Delete className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="px-4 py-3 text-left font-semibold text-gray-800 border-r border-gray-300">ACTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">CODE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">DESCRIPTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">LOCATION OF ASSET</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">PROPERTY SIZE - LAND</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">PROPERTY SIZE - BUILDING</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">SOURCE OF OWNERSHIP</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">CERTIFICATE NUMBER</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">YEAR OF ACQUISITION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">COST OF ACQUISITION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">FAIR/MARKET VALUE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800">REMARK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Filter row */}
                                <tr className="bg-white border-b border-gray-300">
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select DESCRIPTION</option>
                                            <option value="Tanah Kosong">Tanah Kosong</option>
                                            <option value="Tanah dan/atau Bangunan untuk Tempat Tinggal">Tanah dan/atau Bangunan untuk Tempat Tinggal</option>
                                            <option value="Apartemen">Apartemen</option>
                                            <option value="Kapal">Kapal</option>
                                            <option value="Tanah atau Lahan untuk Usaha">Tanah atau Lahan untuk Usaha (seperti lahan pertanian, perkebunan, perikanan darat, dan sejenisnya)</option>
                                            <option value="Tanah dan/atau Bangunan untuk Usaha">Tanah dan/atau Bangunan untuk Usaha (toko, pabrik, gudang, dan sejenisnya)</option>
                                            <option value="Tanah dan/atau Bangunan yang Disewakan">Tanah dan/atau Bangunan yang Disewakan</option>
                                            <option value="Harta Tidak Bergerak Lainnya">Harta Tidak Bergerak Lainnya</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select SOURCE OF OWNERSHIP</option>
                                            <option value="Utang">Utang</option>
                                            <option value="Hadiah">Hadiah</option>
                                            <option value="Hibah">Hibah</option>
                                            <option value="Warisan">Warisan</option>
                                            <option value="Sumber lainnya">Sumber lainnya</option>
                                            <option value="Hasil Sendiri">Hasil Sendiri</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select REMARK</option>
                                            <option value="Harta PPS">Harta PPS</option>
                                            <option value="Harta Investasi PPS">Harta Investasi PPS</option>
                                        </select>
                                    </td>
                                </tr>

                                {/* Existing data rows */}
                                {assets.non_movable_assets.map((item, index) => (
                                    <tr key={item.id} className="border-t border-gray-200">
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit('non_movable_assets', item)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeAssetItem('non_movable_assets', item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
                                                    <Delete className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.code}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.description || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.location_of_asset || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.property_size_land ? `${item.property_size_land} m²` : '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.property_size_building ? `${item.property_size_building} m²` : '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.source_of_ownership || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.certificate_number || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.year_of_acquisition || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {item.cost_of_acquisition ? `IDR ${parseFloat(item.cost_of_acquisition).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {item.fair_market_value ? `IDR ${parseFloat(item.fair_market_value).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.remark || '-'}
                                        </td>
                                    </tr>
                                ))}
                                {assets.non_movable_assets.length === 0 && (
                                    <tr>
                                        <td colSpan="12" className="px-4 py-8 text-center text-gray-500">
                                            No data found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing 0 to {assets.non_movable_assets.length} of {assets.non_movable_assets.length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-600">TOTAL OF PART 5</div>
                            <div className="font-bold text-green-600">
                                {assets.non_movable_assets.reduce((sum, item) => sum + (parseFloat(item.fair_market_value) || 0), 0).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">«</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">‹</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">›</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">»</button>
                        <select className="px-3 py-1 border border-gray-300 rounded text-sm ml-2">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const OtherAssetsSection = () => (
        <div className="space-y-4">
            <div className="border border-gray-300 rounded-lg bg-white">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-700">6. OTHER ASSETS</h3>
                </div>

                <div className="p-4">
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setCurrentForm('other_assets');
                            }}
                            className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
                        >
                            <Add className="h-4 w-4" />
                            Add
                        </button>
                        <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium">
                            <Upload className="h-4 w-4" />
                            XML Upload
                            <ExpandMore className="h-4 w-4" />
                        </button>
                        {/* Red circle with number */}
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{assets.other_assets.length}</span>
                        </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex gap-2 mb-4">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Refresh className="h-5 w-5 text-gray-700" />
                        </div>
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                            <FileOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckBox className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <Delete className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="px-4 py-3 text-left font-semibold text-gray-800 border-r border-gray-300">ACTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">CODE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">DESCRIPTION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">YEAR OF ACQUISITION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">COST OF ACQUISITION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">FAIR/MARKET VALUE</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">ACCOUNT NUMBER</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-300">ADDITIONAL INFORMATION</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-800">REMARK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Filter row */}
                                <tr className="bg-white border-b border-gray-300">
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 text-center">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select DESCRIPTION</option>
                                            <option value="Paten">Paten</option>
                                            <option value="Royalti">Royalti</option>
                                            <option value="Merek dagang">Merek dagang</option>
                                            <option value="Harta Tidak Berwujud Lainnya">Harta Tidak Berwujud Lainnya</option>
                                            <option value="Emas Batangan">Emas Batangan</option>
                                            <option value="Emas Perhiasan">Emas Perhiasan</option>
                                            <option value="Batangan Non-Emas">Batangan Non-Emas</option>
                                            <option value="Perhiasan Non-Emas">Perhiasan Non-Emas</option>
                                            <option value="Permata (intan,berlian,batu mulia lainnya)">Permata (intan,berlian,batu mulia lainnya)</option>
                                            <option value="Barang-barang seni dan antik">Barang-barang seni dan antik (barang-barang seni, barang-barang antik)</option>
                                            <option value="Peralatan olahraga khusus">Peralatan olahraga khusus</option>
                                            <option value="Peralatan elektronik">Peralatan elektronik</option>
                                            <option value="Perabot Rumah Tangga">Perabot Rumah Tangga</option>
                                            <option value="Peralatan Kantor">Peralatan Kantor</option>
                                            <option value="Jet Ski">Jet Ski</option>
                                            <option value="Persediaan usaha">Persediaan usaha</option>
                                            <option value="Harta lainnya">Harta lainnya</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300">
                                        <div className="flex justify-center">
                                            <button className="text-gray-400">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm">
                                            <option value="">Select REMARK</option>
                                            <option value="Harta PPS">Harta PPS</option>
                                            <option value="Harta Investasi PPS">Harta Investasi PPS</option>
                                        </select>
                                    </td>
                                </tr>

                                {/* Existing data rows */}
                                {assets.other_assets.map((item, index) => (
                                    <tr key={item.id} className="border-t border-gray-200">
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit('other_assets', item)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeAssetItem('other_assets', item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
                                                    <Delete className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.code}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.description || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-center">
                                            {item.year_of_acquisition || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {item.cost_of_acquisition ? `IDR ${parseFloat(item.cost_of_acquisition).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 text-right">
                                            {item.fair_market_value ? `IDR ${parseFloat(item.fair_market_value).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.account_number || '-'}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {item.additional_information || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.remark || '-'}
                                        </td>
                                    </tr>
                                ))}
                                {assets.other_assets.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                            No data found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing 0 to {assets.other_assets.length} of {assets.other_assets.length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-600">TOTAL OF PART 6</div>
                            <div className="font-bold text-green-600">
                                {assets.other_assets.reduce((sum, item) => sum + (parseFloat(item.fair_market_value) || 0), 0).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">«</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">‹</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">›</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">»</button>
                        <select className="px-3 py-1 border border-gray-300 rounded text-sm ml-2">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const calculateSummaryTotal = () => {
        let total = 0;

        // Cash and Cash Equivalents
        total += assets.cash_and_cash_equivalents.reduce((sum, item) =>
            sum + (parseFloat(item.balance) || 0), 0);

        // Account Receivable
        total += assets.account_receivable.reduce((sum, item) =>
            sum + (parseFloat(item.current_balance) || 0), 0);

        // Investments Securities
        total += assets.investments_securities.reduce((sum, item) =>
            sum + (parseFloat(item.current_balance) || 0), 0);

        // Movable Assets
        total += assets.movable_assets.reduce((sum, item) =>
            sum + (parseFloat(item.fair_market_value) || 0), 0);

        // Non-Movable Assets
        total += assets.non_movable_assets.reduce((sum, item) =>
            sum + (parseFloat(item.fair_market_value) || 0), 0);

        // Other Assets
        total += assets.other_assets.reduce((sum, item) =>
            sum + (parseFloat(item.fair_market_value) || 0), 0);

        return total;
    };

    // Form Components
    const CashAndCashEquivalentsForm = () => {
        const [formData, setFormData] = useState(editingItem || {
            code: generateCode('cash_and_cash_equivalents'),
            description: '',
            account_number: '',
            on_behalf_of: '',
            bank_institution_name: '',
            country_where_asset_located: '',
            year_of_acquisition: '',
            balance: '',
            remark: ''
        });

        const descriptions = [
            'Uang Tunai/Bank Note/Koin',
            'Tabungan (Bank/Lembaga Keuangan)',
            'Giro',
            'Deposito',
            'Uang elektronik',
            'Cek',
            'Wessel',
            'Kertas komersial',
            'Setara Kas Lainnya'
        ];

        const remarks = [
            'Harta PPS',
            'Harta Investasi PPS'
        ];

        const handleSubmit = () => {
            if (!formData.description || !formData.balance) {
                alert('Please fill in required fields: Description and Balance');
                return;
            }

            if (editingItem) {
                updateAssetItem('cash_and_cash_equivalents', editingItem.id, formData);
            } else {
                addAssetItem('cash_and_cash_equivalents', formData);
            }
        };

        return (
            <div className="max-w-6xl mx-auto bg-white">
                <div className="flex items-center gap-4 mb-6 p-4 border-b">
                    <button
                        onClick={() => setCurrentForm(null)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowBack className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingItem ? 'Edit' : 'Add'} Cash and Cash Equivalents
                    </h2>
                </div>

                <div className="border border-gray-300 rounded-lg bg-white mx-4 mb-4">
                    <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-700">CASH AND CASH EQUIVALENTS</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <select
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Please Select</option>
                                    {descriptions.map((desc, index) => (
                                        <option key={index} value={desc}>{desc}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                                <input
                                    type="text"
                                    value={formData.account_number}
                                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter account number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">On Behalf Of *</label>
                                <input
                                    type="text"
                                    value={formData.on_behalf_of}
                                    onChange={(e) => setFormData({ ...formData, on_behalf_of: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter account holder name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bank/Institution Name *</label>
                                <input
                                    type="text"
                                    value={formData.bank_institution_name}
                                    onChange={(e) => setFormData({ ...formData, bank_institution_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter bank/institution name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country Where The Asset Is Located *</label>
                                <select
                                    value={formData.country_where_asset_located}
                                    onChange={(e) => setFormData({ ...formData, country_where_asset_located: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    <option value="Indonesia">Indonesia</option>
                                    <option value="Malaysia">Malaysia</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="United States">United States</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year Of Acquisition *</label>
                                <input
                                    type="number"
                                    value={formData.year_of_acquisition}
                                    onChange={(e) => setFormData({ ...formData, year_of_acquisition: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 2023"
                                    min="1900"
                                    max="2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Balance *</label>
                                <input
                                    type="number"
                                    value={formData.balance}
                                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                                <select
                                    value={formData.remark}
                                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {remarks.map((remark, index) => (
                                        <option key={index} value={remark}>{remark}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setCurrentForm(null)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                type="button"
                            >
                                <span>✕</span>
                                Close
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center gap-2"
                                type="button"
                            >
                                <Save className="h-4 w-4" />
                                {editingItem ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const AccountReceivableForm = () => {
        const [formData, setFormData] = useState(editingItem || {
            code: generateCode('account_receivable'),
            description: '',
            country_of_recipient: '',
            tin_of_recipient: '',
            name_of_recipient: '',
            receivable_value: '',
            year_of_receivable_commencement: '',
            current_balance: '',
            remark: ''
        });

        const descriptions = [
            'Piutang Usaha',
            'Afiliasi Piutang',
            'Piutang lainnya'
        ];

        const remarks = [
            'Harta PPS',
            'Harta Investasi PPS'
        ];

        const handleSubmit = () => {
            if (!formData.description || !formData.current_balance) {
                alert('Please fill in required fields: Description and Current Balance');
                return;
            }

            if (editingItem) {
                updateAssetItem('account_receivable', editingItem.id, formData);
            } else {
                addAssetItem('account_receivable', formData);
            }
        };

        return (
            <div className="max-w-6xl mx-auto bg-white">
                <div className="flex items-center gap-4 mb-6 p-4 border-b">
                    <button
                        onClick={() => setCurrentForm(null)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowBack className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingItem ? 'Edit' : 'Add'} Account Receivable
                    </h2>
                </div>

                <div className="border border-gray-300 rounded-lg bg-white mx-4 mb-4">
                    <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-700">ACCOUNT RECEIVABLE</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <select
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Please Select</option>
                                    {descriptions.map((desc, index) => (
                                        <option key={index} value={desc}>{desc}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country Of Recipient *</label>
                                <select
                                    value={formData.country_of_recipient}
                                    onChange={(e) => setFormData({ ...formData, country_of_recipient: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    <option value="Indonesia">Indonesia</option>
                                    <option value="Malaysia">Malaysia</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="United States">United States</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">TIN Of Recipient *</label>
                                <input
                                    type="text"
                                    value={formData.tin_of_recipient}
                                    onChange={(e) => setFormData({ ...formData, tin_of_recipient: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter TIN"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name Of Recipient Of Receivable *</label>
                                <input
                                    type="text"
                                    value={formData.name_of_recipient}
                                    onChange={(e) => setFormData({ ...formData, name_of_recipient: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter recipient name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Receivable Value *</label>
                                <input
                                    type="number"
                                    value={formData.receivable_value}
                                    onChange={(e) => setFormData({ ...formData, receivable_value: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year Of Receivable Commencement *</label>
                                <input
                                    type="number"
                                    value={formData.year_of_receivable_commencement}
                                    onChange={(e) => setFormData({ ...formData, year_of_receivable_commencement: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 2023"
                                    min="1900"
                                    max="2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Balance Of Receivable *</label>
                                <input
                                    type="number"
                                    value={formData.current_balance}
                                    onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                                <select
                                    value={formData.remark}
                                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {remarks.map((remark, index) => (
                                        <option key={index} value={remark}>{remark}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setCurrentForm(null)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                type="button"
                            >
                                <span>✕</span>
                                Close
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center gap-2"
                                type="button"
                            >
                                <Save className="h-4 w-4" />
                                {editingItem ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Additional Forms for other asset types
    const InvestmentsSecuritiesForm = () => {
        const [formData, setFormData] = useState(editingItem || {
            code: generateCode('investments_securities'),
            description: '',
            country_where_asset_located: '',
            tin_of_recipient: '',
            name_of_recipient: '',
            account_number: '',
            cost_of_acquisition: '',
            year_of_acquisition: '',
            current_balance: '',
            remark: ''
        });

        const descriptions = [
            'Saham yang dibeli untuk dijual kembali',
            'Saham non bursa',
            'Saham bursa',
            'Kewajiban perusahaan',
            'Obligasi pemerintah Indonesia (Obligasi Ritel Indonesia, Surat Berharga Syariah Negara, dll)',
            'Surat hutang lainnya',
            'Kontrak Investasi Kolektif (KIK) termasuk Reksadana, dan investasi yang dikonversikan ke unit penyertaan',
            'Instrumen derivatif (right, warran, kontrak berjangka, opsi, dll)',
            'Penyertaan modal dalam perusahaan lain yang bukan atas saham meliputi penyertaan modal pada CV, Firma, dan sejenisnya',
            'Asuransi',
            'Unit Link di Asuransi',
            'Investasi lainnya (termasuk Cryptocurrency, Trust Fund dan Investasi lainnya)'
        ];

        const remarks = [
            'Harta PPS',
            'Harta Investasi PPS'
        ];

        const handleSubmit = () => {
            if (!formData.description || !formData.current_balance) {
                alert('Please fill in required fields: Description and Current Balance');
                return;
            }

            if (editingItem) {
                updateAssetItem('investments_securities', editingItem.id, formData);
            } else {
                addAssetItem('investments_securities', formData);
            }
        };

        return (
            <div className="max-w-6xl mx-auto bg-white">
                <div className="flex items-center gap-4 mb-6 p-4 border-b">
                    <button
                        onClick={() => setCurrentForm(null)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowBack className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingItem ? 'Edit' : 'Add'} Investments/Securities
                    </h2>
                </div>

                <div className="border border-gray-300 rounded-lg bg-white mx-4 mb-4">
                    <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-700">INVESTMENTS/SECURITIES</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <select
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Please Select</option>
                                    {descriptions.map((desc, index) => (
                                        <option key={index} value={desc}>{desc}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country Where The Asset Is Located *</label>
                                <select
                                    value={formData.country_where_asset_located}
                                    onChange={(e) => setFormData({ ...formData, country_where_asset_located: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    <option value="Indonesia">Indonesia</option>
                                    <option value="Malaysia">Malaysia</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="United States">United States</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">TIN Of Recipient *</label>
                                <input
                                    type="text"
                                    value={formData.tin_of_recipient}
                                    onChange={(e) => setFormData({ ...formData, tin_of_recipient: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter TIN"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name Of Recipient *</label>
                                <input
                                    type="text"
                                    value={formData.name_of_recipient}
                                    onChange={(e) => setFormData({ ...formData, name_of_recipient: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter recipient name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                                <input
                                    type="text"
                                    value={formData.account_number}
                                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter account number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Of Acquisition *</label>
                                <input
                                    type="number"
                                    value={formData.cost_of_acquisition}
                                    onChange={(e) => setFormData({ ...formData, cost_of_acquisition: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year Of Acquisition *</label>
                                <input
                                    type="number"
                                    value={formData.year_of_acquisition}
                                    onChange={(e) => setFormData({ ...formData, year_of_acquisition: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 2023"
                                    min="1900"
                                    max="2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Balance *</label>
                                <input
                                    type="number"
                                    value={formData.current_balance}
                                    onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                                <select
                                    value={formData.remark}
                                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {remarks.map((remark, index) => (
                                        <option key={index} value={remark}>{remark}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setCurrentForm(null)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                type="button"
                            >
                                <span>✕</span>
                                Close
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center gap-2"
                                type="button"
                            >
                                <Save className="h-4 w-4" />
                                {editingItem ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const MovableAssetsForm = () => {
        const [formData, setFormData] = useState(editingItem || {
            code: generateCode('movable_assets'),
            description_type: '',
            description_merk_model: '',
            police_registration_number: '',
            ownership: '',
            tin: '',
            name: '',
            year_of_acquisition: '',
            cost_of_acquisition: '',
            fair_market_value: '',
            remark: ''
        });

        const descriptionTypes = [
            'Sepeda',
            'Sepeda Motor',
            'Mobil Penumpang',
            'Bis',
            'Kendaraan Angkutan Jalan',
            'Kendaraan Tujuan Khusus',
            'Kereta',
            'Pesawat Terbang',
            'Kapal',
            'Mesin',
            'Gerobak',
            'Kapal Pesiar',
            'Harta bergerak lainnya'
        ];

        const ownershipOptions = [
            'Pribadi',
            'Bersama',
            'Atas Nama Orang Lain'
        ];

        const remarks = [
            'Harta PPS',
            'Harta Investasi PPS'
        ];

        const handleSubmit = () => {
            if (!formData.description_type || !formData.fair_market_value) {
                alert('Please fill in required fields: Description Type and Fair/Market Value');
                return;
            }

            if (editingItem) {
                updateAssetItem('movable_assets', editingItem.id, formData);
            } else {
                addAssetItem('movable_assets', formData);
            }
        };

        return (
            <div className="max-w-6xl mx-auto bg-white">
                <div className="flex items-center gap-4 mb-6 p-4 border-b">
                    <button
                        onClick={() => setCurrentForm(null)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowBack className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingItem ? 'Edit' : 'Add'} Movable Assets
                    </h2>
                </div>

                <div className="border border-gray-300 rounded-lg bg-white mx-4 mb-4">
                    <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-700">MOVABLE ASSETS</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description Type *</label>
                                <select
                                    value={formData.description_type}
                                    onChange={(e) => setFormData({ ...formData, description_type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Please Select</option>
                                    {descriptionTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description Merk Model *</label>
                                <input
                                    type="text"
                                    value={formData.description_merk_model}
                                    onChange={(e) => setFormData({ ...formData, description_merk_model: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter brand/model description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Police/Registration Number *</label>
                                <input
                                    type="text"
                                    value={formData.police_registration_number}
                                    onChange={(e) => setFormData({ ...formData, police_registration_number: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter police/registration number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ownership *</label>
                                <select
                                    value={formData.ownership}
                                    onChange={(e) => setFormData({ ...formData, ownership: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {ownershipOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">TIN *</label>
                                <input
                                    type="text"
                                    value={formData.tin}
                                    onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter TIN"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter owner name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year Of Acquisition *</label>
                                <input
                                    type="number"
                                    value={formData.year_of_acquisition}
                                    onChange={(e) => setFormData({ ...formData, year_of_acquisition: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 2023"
                                    min="1900"
                                    max="2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Of Acquisition *</label>
                                <input
                                    type="number"
                                    value={formData.cost_of_acquisition}
                                    onChange={(e) => setFormData({ ...formData, cost_of_acquisition: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fair/Market Value *</label>
                                <input
                                    type="number"
                                    value={formData.fair_market_value}
                                    onChange={(e) => setFormData({ ...formData, fair_market_value: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                                <select
                                    value={formData.remark}
                                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {remarks.map((remark, index) => (
                                        <option key={index} value={remark}>{remark}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setCurrentForm(null)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                type="button"
                            >
                                <span>✕</span>
                                Close
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center gap-2"
                                type="button"
                            >
                                <Save className="h-4 w-4" />
                                {editingItem ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const NonMovableAssetsForm = () => {
        const [formData, setFormData] = useState(editingItem || {
            code: generateCode('non_movable_assets'),
            description: '',
            location_of_asset: '',
            property_size_land: '',
            property_size_building: '',
            source_of_ownership: '',
            certificate_number: '',
            year_of_acquisition: '',
            cost_of_acquisition: '',
            fair_market_value: '',
            remark: ''
        });

        const descriptions = [
            'Tanah Kosong',
            'Tanah dan/atau Bangunan untuk Tempat Tinggal',
            'Apartemen',
            'Kapal',
            'Tanah atau Lahan untuk Usaha (seperti lahan pertanian, perkebunan, perikanan darat, dan sejenisnya)',
            'Tanah dan/atau Bangunan untuk Usaha (toko, pabrik, gudang, dan sejenisnya)',
            'Tanah dan/atau Bangunan yang Disewakan',
            'Harta Tidak Bergerak Lainnya'
        ];

        const sourceOfOwnership = [
            'Utang',
            'Hadiah',
            'Hibah',
            'Warisan',
            'Sumber lainnya',
            'Hasil Sendiri'
        ];

        const remarks = [
            'Harta PPS',
            'Harta Investasi PPS'
        ];

        const handleSubmit = () => {
            if (!formData.description || !formData.fair_market_value) {
                alert('Please fill in required fields: Description and Fair/Market Value');
                return;
            }

            if (editingItem) {
                updateAssetItem('non_movable_assets', editingItem.id, formData);
            } else {
                addAssetItem('non_movable_assets', formData);
            }
        };

        return (
            <div className="max-w-6xl mx-auto bg-white">
                <div className="flex items-center gap-4 mb-6 p-4 border-b">
                    <button
                        onClick={() => setCurrentForm(null)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowBack className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingItem ? 'Edit' : 'Add'} Non-Movable Assets (Land and Building)
                    </h2>
                </div>

                <div className="border border-gray-300 rounded-lg bg-white mx-4 mb-4">
                    <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-700">NON-MOVABLE ASSETS (LAND AND BUILDING)</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <select
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Please Select</option>
                                    {descriptions.map((desc, index) => (
                                        <option key={index} value={desc}>{desc}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location Of Asset *</label>
                                <input
                                    type="text"
                                    value={formData.location_of_asset}
                                    onChange={(e) => setFormData({ ...formData, location_of_asset: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter location of asset"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Property Size - Land *</label>
                                <input
                                    type="number"
                                    value={formData.property_size_land}
                                    onChange={(e) => setFormData({ ...formData, property_size_land: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Size in m²"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Property Size - Building *</label>
                                <input
                                    type="number"
                                    value={formData.property_size_building}
                                    onChange={(e) => setFormData({ ...formData, property_size_building: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Size in m²"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Source Of Ownership *</label>
                                <select
                                    value={formData.source_of_ownership}
                                    onChange={(e) => setFormData({ ...formData, source_of_ownership: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {sourceOfOwnership.map((source, index) => (
                                        <option key={index} value={source}>{source}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Number *</label>
                                <input
                                    type="text"
                                    value={formData.certificate_number}
                                    onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter certificate number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year Of Acquisition *</label>
                                <input
                                    type="number"
                                    value={formData.year_of_acquisition}
                                    onChange={(e) => setFormData({ ...formData, year_of_acquisition: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 2023"
                                    min="1900"
                                    max="2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Of Acquisition *</label>
                                <input
                                    type="number"
                                    value={formData.cost_of_acquisition}
                                    onChange={(e) => setFormData({ ...formData, cost_of_acquisition: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fair/Market Value *</label>
                                <input
                                    type="number"
                                    value={formData.fair_market_value}
                                    onChange={(e) => setFormData({ ...formData, fair_market_value: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                                <select
                                    value={formData.remark}
                                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {remarks.map((remark, index) => (
                                        <option key={index} value={remark}>{remark}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setCurrentForm(null)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                type="button"
                            >
                                <span>✕</span>
                                Close
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center gap-2"
                                type="button"
                            >
                                <Save className="h-4 w-4" />
                                {editingItem ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const OtherAssetsForm = () => {
        const [formData, setFormData] = useState(editingItem || {
            code: generateCode('other_assets'),
            description: '',
            year_of_acquisition: '',
            cost_of_acquisition: '',
            fair_market_value: '',
            account_number: '',
            additional_information: '',
            remark: ''
        });

        const descriptions = [
            'Paten',
            'Royalti',
            'Merek dagang',
            'Harta Tidak Berwujud Lainnya',
            'Emas Batangan',
            'Emas Perhiasan',
            'Batangan Non-Emas',
            'Perhiasan Non-Emas',
            'Permata (intan,berlian,batu mulia lainnya)',
            'Barang-barang seni dan antik (barang-barang seni, barang-barang antik)',
            'Peralatan olahraga khusus',
            'Peralatan elektronik',
            'Perabot Rumah Tangga',
            'Peralatan Kantor',
            'Jet Ski',
            'Persediaan usaha',
            'Harta lainnya'
        ];

        const remarks = [
            'Harta PPS',
            'Harta Investasi PPS'
        ];

        const handleSubmit = () => {
            if (!formData.description || !formData.fair_market_value) {
                alert('Please fill in required fields: Description and Fair/Market Value');
                return;
            }

            if (editingItem) {
                updateAssetItem('other_assets', editingItem.id, formData);
            } else {
                addAssetItem('other_assets', formData);
            }
        };

        return (
            <div className="max-w-6xl mx-auto bg-white">
                <div className="flex items-center gap-4 mb-6 p-4 border-b">
                    <button
                        onClick={() => setCurrentForm(null)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowBack className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingItem ? 'Edit' : 'Add'} Other Assets
                    </h2>
                </div>

                <div className="border border-gray-300 rounded-lg bg-white mx-4 mb-4">
                    <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-700">OTHER ASSETS</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <select
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Please Select</option>
                                    {descriptions.map((desc, index) => (
                                        <option key={index} value={desc}>{desc}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year Of Acquisition *</label>
                                <input
                                    type="number"
                                    value={formData.year_of_acquisition}
                                    onChange={(e) => setFormData({ ...formData, year_of_acquisition: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 2023"
                                    min="1900"
                                    max="2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Of Acquisition *</label>
                                <input
                                    type="number"
                                    value={formData.cost_of_acquisition}
                                    onChange={(e) => setFormData({ ...formData, cost_of_acquisition: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fair/Market Value *</label>
                                <input
                                    type="number"
                                    value={formData.fair_market_value}
                                    onChange={(e) => setFormData({ ...formData, fair_market_value: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                                <input
                                    type="text"
                                    value={formData.account_number}
                                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter account number"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information *</label>
                                <textarea
                                    value={formData.additional_information}
                                    onChange={(e) => setFormData({ ...formData, additional_information: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter additional information"
                                    rows="3"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                                <select
                                    value={formData.remark}
                                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {remarks.map((remark, index) => (
                                        <option key={index} value={remark}>{remark}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setCurrentForm(null)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                type="button"
                            >
                                <span>✕</span>
                                Close
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center gap-2"
                                type="button"
                            >
                                <Save className="h-4 w-4" />
                                {editingItem ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render logic
    if (currentForm === 'cash_and_cash_equivalents') {
        return <CashAndCashEquivalentsForm />;
    }

    // A
    if (currentForm === 'account_receivable') {
        return <AccountReceivableForm />;
    }

    if (currentForm === 'investments_securities') {
        return <InvestmentsSecuritiesForm />;
    }

    if (currentForm === 'movable_assets') {
        return <MovableAssetsForm />
    }

    if (currentForm === 'non_movable_assets') {
        return <NonMovableAssetsForm />
    }

    if (currentForm === 'other_assets') {
        return <OtherAssetsForm />
    }

    //B
    if (currentForm === 'debt_at_end_of_year') {
        return <DebtAtEndOfYearForm />
    }

    return <MainView />;
};

export default L1AssetsForm;