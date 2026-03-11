import React, { useState, useCallback, useMemo } from 'react';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';

export const L4Form = ({ data = {}, onDataChange, taxpayerData }) => {
    // Initialize data with proper structure
    const initializeData = () => ({
        header: {
            periodYear: '2023',
            tinNik: '12',
            ...data.header
        },
        calculation: {
            regularNetIncome: '',
            fiscalLossCompensation: '',
            compulsoryZakat: '',
            taxExemption: 'Please Select',
            incomeTaxDeduction: '',
            taxCreditFromWithholding: '',
            taxInstallmentsNextYear: '',
            ...data.calculation
        }
    });

    const [formData, setFormData] = useState(initializeData());
    const [expandedSections, setExpandedSections] = useState({
        header: true,
        calculation: true
    });

    // Update form data and trigger callback
    const updateFormData = useCallback((section, newData) => {
        const updatedData = {
            ...formData,
            [section]: newData
        };
        setFormData(updatedData);
        if (onDataChange) {
            onDataChange(updatedData);
        }
    }, [formData, onDataChange]);

    // Tax exemption options
    const taxExemptionOptions = [
        { label: 'Please Select', value: 'Please Select', amount: 0 },
        { label: 'TK/0 - Rp 54,000,000', value: 'TK/0', amount: 54000000 },
        { label: 'TK/1 - Rp 58,500,000', value: 'TK/1', amount: 58500000 },
        { label: 'TK/2 - Rp 63,000,000', value: 'TK/2', amount: 63000000 },
        { label: 'TK/3 - Rp 67,500,000', value: 'TK/3', amount: 67500000 },
        { label: 'K/0 - Rp 58,500,000', value: 'K/0', amount: 58500000 },
        { label: 'K/1 - Rp 63,000,000', value: 'K/1', amount: 63000000 },
        { label: 'K/2 - Rp 67,500,000', value: 'K/2', amount: 67500000 },
        { label: 'K/3 - Rp 72,000,000', value: 'K/3', amount: 72000000 }
    ];

    // Calculate income tax
    const calculateIncomeTax = useCallback((taxableIncome) => {
        const income = parseFloat(taxableIncome) || 0;
        let tax = 0;

        if (income <= 60000000) {
            tax = income * 0.05;
        } else if (income <= 250000000) {
            tax = 60000000 * 0.05 + (income - 60000000) * 0.15;
        } else if (income <= 500000000) {
            tax = 60000000 * 0.05 + 190000000 * 0.15 + (income - 250000000) * 0.25;
        } else {
            tax = 60000000 * 0.05 + 190000000 * 0.15 + 250000000 * 0.25 + (income - 500000000) * 0.30;
        }

        return tax;
    }, []);

    // Calculate all derived fields
    const calculatedFields = useMemo(() => {
        const calc = formData.calculation;
        const regularNetIncome = parseFloat(calc.regularNetIncome) || 0;
        const fiscalLossCompensation = parseFloat(calc.fiscalLossCompensation) || 0;
        const compulsoryZakat = parseFloat(calc.compulsoryZakat) || 0;
        
        const totalNetIncome = regularNetIncome - fiscalLossCompensation - compulsoryZakat;
        
        const selectedExemption = taxExemptionOptions.find(opt => opt.value === calc.taxExemption);
        const exemptionAmount = selectedExemption ? selectedExemption.amount : 0;
        
        const taxableIncome = Math.max(0, totalNetIncome - exemptionAmount);
        const incomeTaxPayable = calculateIncomeTax(taxableIncome);
        
        const incomeTaxDeduction = parseFloat(calc.incomeTaxDeduction) || 0;
        const taxCreditFromWithholding = parseFloat(calc.taxCreditFromWithholding) || 0;
        const incomeTaxToBePaid = Math.max(0, incomeTaxPayable - incomeTaxDeduction - taxCreditFromWithholding);

        return {
            totalNetIncome,
            taxableIncome,
            incomeTaxPayable,
            incomeTaxToBePaid
        };
    }, [
        formData.calculation.regularNetIncome,
        formData.calculation.fiscalLossCompensation,
        formData.calculation.compulsoryZakat,
        formData.calculation.taxExemption,
        formData.calculation.incomeTaxDeduction,
        formData.calculation.taxCreditFromWithholding,
        calculateIncomeTax,
        taxExemptionOptions
    ]);

    const toggleSection = useCallback((sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    }, []);

    // Header handlers
    const handleHeaderChange = useCallback((field, value) => {
        const updatedHeader = {
            ...formData.header,
            [field]: value
        };
        updateFormData('header', updatedHeader);
    }, [formData.header, updateFormData]);

    // Calculation handlers
    const handleCalculationChange = useCallback((field, value) => {
        const numericFields = [
            'regularNetIncome', 'fiscalLossCompensation', 'compulsoryZakat',
            'incomeTaxDeduction', 'taxCreditFromWithholding', 'taxInstallmentsNextYear'
        ];
        
        let processedValue = value;
        if (numericFields.includes(field)) {
            const cleanValue = value.replace(/[^0-9.]/g, '');
            const parts = cleanValue.split('.');
            processedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleanValue;
        }
        
        const updatedCalculation = {
            ...formData.calculation,
            [field]: processedValue
        };
        updateFormData('calculation', updatedCalculation);
    }, [formData.calculation, updateFormData]);

    const formatNumber = useCallback((value) => {
        const num = parseFloat(value) || 0;
        return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, []);

    return (
        <div className="max-w-7xl mx-auto bg-white flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Personal Income Tax Return</h1>
            </div>

            {/* Header Section */}
            <div className='mb-4'>
                <div className="border border-gray-300 rounded-lg">
                    <button
                        onClick={() => toggleSection('header')}
                        className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-t-lg border-b border-gray-300 flex items-center justify-between transition-colors"
                        type="button"
                    >
                        <span className="text-sm font-medium text-gray-700">HEADER</span>
                        {expandedSections.header ? (
                            <KeyboardArrowDown className="h-5 w-5 text-gray-600" />
                        ) : (
                            <KeyboardArrowRight className="h-5 w-5 text-gray-600" />
                        )}
                    </button>
                    {expandedSections.header && (
                        <div className="bg-white rounded-b-lg p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Period Year</label>
                                    <input
                                        type="text"
                                        value={formData.header.periodYear}
                                        onChange={(e) => handleHeaderChange('periodYear', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">TIN/NIK</label>
                                    <input
                                        type="text"
                                        value={formData.header.tinNik}
                                        onChange={(e) => handleHeaderChange('tinNik', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Calculation Section */}
            <div className='mb-4'>
                <div className="border border-gray-300 rounded-lg">
                    <button
                        onClick={() => toggleSection('calculation')}
                        className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-t-lg border-b border-gray-300 flex items-center justify-between transition-colors"
                        type="button"
                    >
                        <span className="text-sm font-medium text-gray-700">A. CALCULATION OF INCOME TAX INSTALLMENTS FOR THE NEXT YEAR</span>
                        {expandedSections.calculation ? (
                            <KeyboardArrowDown className="h-5 w-5 text-gray-600" />
                        ) : (
                            <KeyboardArrowRight className="h-5 w-5 text-gray-600" />
                        )}
                    </button>
                    {expandedSections.calculation && (
                        <div className="bg-white rounded-b-lg p-6 space-y-6">
                            
                            {/* Regular Net Income */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7">
                                    <span className="text-sm text-gray-700">Regular Net Income *</span>
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        value={formData.calculation.regularNetIncome}
                                        onChange={(e) => handleCalculationChange('regularNetIncome', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Fiscal Loss Compensation */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7">
                                    <span className="text-sm text-gray-700">Fiscal Loss Compensation that are deductible in the next year</span>
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        value={formData.calculation.fiscalLossCompensation}
                                        onChange={(e) => handleCalculationChange('fiscalLossCompensation', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right bg-gray-50"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Compulsory Zakat */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7">
                                    <span className="text-sm text-gray-700">Compulsory zakat or religious donations</span>
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        value={formData.calculation.compulsoryZakat}
                                        onChange={(e) => handleCalculationChange('compulsoryZakat', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right bg-gray-50"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Total Net Income */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7">
                                    <span className="text-sm text-gray-700 font-medium">Total Net Income</span>
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        value={formatNumber(calculatedFields.totalNetIncome)}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right bg-gray-100 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Tax Exemption */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7">
                                    <span className="text-sm text-gray-700">Tax Exemption (PTKP)</span>
                                </div>
                                <div className="col-span-4">
                                    <div className="relative">
                                        <select
                                            value={formData.calculation.taxExemption}
                                            onChange={(e) => handleCalculationChange('taxExemption', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none bg-white pr-10"
                                        >
                                            {taxExemptionOptions.map((option, index) => (
                                                <option key={index} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <KeyboardArrowDown className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Taxable Income */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7">
                                    <span className="text-sm text-gray-700">Taxable Income</span>
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        value={formatNumber(calculatedFields.taxableIncome)}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right bg-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Income Tax Payable */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7">
                                    <span className="text-sm text-gray-700">Income Tax Payable</span>
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        value={formatNumber(calculatedFields.incomeTaxPayable)}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right bg-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Income Tax Deduction */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7">
                                    <span className="text-sm text-gray-700">Income Tax Deduction</span>
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        value={formData.calculation.incomeTaxDeduction}
                                        onChange={(e) => handleCalculationChange('incomeTaxDeduction', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right bg-gray-50"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Tax Credit from Withholding Tax */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7">
                                    <span className="text-sm text-gray-700">Tax Credit from Withholding Tax</span>
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        value={formData.calculation.taxCreditFromWithholding}
                                        onChange={(e) => handleCalculationChange('taxCreditFromWithholding', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right bg-gray-50"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Income Tax that must be paid */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7">
                                    <span className="text-sm text-gray-700 font-medium">Income Tax that must be paid</span>
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        value={formatNumber(calculatedFields.incomeTaxToBePaid)}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right bg-gray-100 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Tax Installments for the Next Tax Year */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7">
                                    <span className="text-sm text-gray-700">Tax Installments for the Next Tax Year</span>
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        value={formData.calculation.taxInstallmentsNextYear}
                                        onChange={(e) => handleCalculationChange('taxInstallmentsNextYear', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right bg-gray-50"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default L4Form;