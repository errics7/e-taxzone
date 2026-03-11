import React, { useState, useRef, useEffect } from 'react';
import { Check, Edit, KeyboardArrowRight, Close, KeyboardArrowDown } from '@mui/icons-material';

export const L3A2Form = ({ data, onDataChange, taxpayerData }) => {
    const expandedSectionsRef = useRef({
        header: true,
        profit_loss: true,
        financial_position: true
    });

    // Initialize data with default structure if not provided
    const getDefaultData = () => ({
        header: {
            fiscalYear: '2023',
            version: 'A2'
        },
        profitLoss: [
            // Income
            { id: 1, accountCode: '4001', accountName: 'Service Income', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Income' },
            { id: 2, accountCode: '5000', accountName: 'Cost of Service', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Income' },
            { id: 3, accountCode: '4500', accountName: 'Gross Income', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Income' },

            // Operating Expenses
            { id: 4, accountCode: '5111', accountName: 'Salaries, Wages, Bonuses, Gratification Expenses', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 5, accountCode: '5113', accountName: 'Transportation Expenses', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 6, accountCode: '5114', accountName: 'Depreciation and Amortization Expenses', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 7, accountCode: '5115', accountName: 'Rental Expenses', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 8, accountCode: '5116', accountName: 'Interest Expenses', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 9, accountCode: '5117', accountName: 'Expenses Related to Services', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 10, accountCode: '5118', accountName: 'Bad Debt Expenses', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 11, accountCode: '5120', accountName: 'Marketing/Promotion Expenses', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 12, accountCode: '5121', accountName: 'Entertainment Expenses', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 13, accountCode: '5122', accountName: 'General and Administration Expenses', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 14, accountCode: '5199', accountName: 'Other Operating Expenses', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 15, accountCode: '5600', accountName: 'Total Operating Expenses', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Operating Expenses' },
            { id: 16, accountCode: '4800', accountName: 'Profit (Loss) Before Tax', amount: '', nonTaxableObject: '', subjectToFinalTax: '', nonFinal: '', positiveFiscalCorrection: '', negativeFiscalCorrection: '', correctionCode: '', fiscalAmount: '', section: 'Total' }
        ],
        assets: [
            // Current Assets
            { id: 1, accountCode: '1101', accountName: 'Cash and Equivalent', amount: '', section: 'Current Assets' },
            { id: 2, accountCode: '1200', accountName: 'Investment', amount: '', section: 'Current Assets' },
            { id: 3, accountCode: '1312', accountName: 'Account Receivables - Third Parties', amount: '', section: 'Current Assets' },
            { id: 4, accountCode: '1313', accountName: 'Account Receivables - Related Parties', amount: '', section: 'Current Assets' },
            { id: 5, accountCode: '1314', accountName: 'Other Account Receivables - Third Parties', amount: '', section: 'Current Assets' },
            { id: 6, accountCode: '1315', accountName: 'Other Account Receivables - Related Parties', amount: '', section: 'Current Assets' },
            { id: 7, accountCode: '1316', accountName: 'Less: Allowance For Doubtful Account Receivables', amount: '', section: 'Current Assets' },
            { id: 8, accountCode: '1400', accountName: 'Inventories', amount: '', section: 'Current Assets' },
            { id: 9, accountCode: '1421', accountName: 'Prepaid Expenses', amount: '', section: 'Current Assets' },
            { id: 10, accountCode: '1422', accountName: 'Advances', amount: '', section: 'Current Assets' },
            { id: 11, accountCode: '1428', accountName: 'Deferred Taxes', amount: '', section: 'Current Assets' },
            { id: 12, accountCode: '1490', accountName: 'Other Current Assets', amount: '', section: 'Current Assets' },

            // Non-current Assets
            { id: 13, accountCode: '1521', accountName: 'Long - Term Receivables', amount: '', section: 'Non-current Assets' },
            { id: 14, accountCode: '1523', accountName: 'Land & Building', amount: '', section: 'Non-current Assets' },
            { id: 15, accountCode: '1524', accountName: 'Less: Accumulated Depreciation - Buildings', amount: '', section: 'Non-current Assets' },
            { id: 16, accountCode: '1526', accountName: 'Other Fixed Assets', amount: '', section: 'Non-current Assets' },
            { id: 17, accountCode: '1530', accountName: 'Less: Accumulated Depreciation - Other Fixed Assets', amount: '', section: 'Non-current Assets' },
            { id: 18, accountCode: '1541', accountName: 'Investment in Associates', amount: '', section: 'Non-current Assets' },
            { id: 19, accountCode: '1598', accountName: 'Other Long-Term Investment', amount: '', section: 'Non-current Assets' },
            { id: 20, accountCode: '1640', accountName: 'Intangible Assets - Net', amount: '', section: 'Non-current Assets' },
            { id: 21, accountCode: '1691', accountName: 'Deferred Tax Assets', amount: '', section: 'Non-current Assets' },
            { id: 22, accountCode: '1698', accountName: 'Other Non-Current Assets', amount: '', section: 'Non-current Assets' },

            { id: 23, accountCode: '1700', accountName: 'Total Assets', amount: '', section: 'Total' }
        ],
        liabilitiesAndEquity: [
            // Current Liabilities
            { id: 24, accountCode: '2102', accountName: 'Account Payable - Third Parties', amount: '', section: 'Current Liabilities' },
            { id: 25, accountCode: '2103', accountName: 'Accounts Payable-Related Parties', amount: '', section: 'Current Liabilities' },
            { id: 26, accountCode: '2111', accountName: 'Interest Payable', amount: '', section: 'Current Liabilities' },
            { id: 27, accountCode: '2141', accountName: 'Taxes Payable', amount: '', section: 'Current Liabilities' },
            { id: 28, accountCode: '2142', accountName: 'Dividends Payable', amount: '', section: 'Current Liabilities' },
            { id: 29, accountCode: '2149', accountName: 'Accrued Expenses', amount: '', section: 'Current Liabilities' },
            { id: 30, accountCode: '2201', accountName: 'Short-Term Bank Loans', amount: '', section: 'Current Liabilities' },
            { id: 31, accountCode: '2202', accountName: 'Long - Term Debts: Current Maturities', amount: '', section: 'Current Liabilities' },
            { id: 32, accountCode: '2203', accountName: 'Advances', amount: '', section: 'Current Liabilities' },
            { id: 33, accountCode: '2230', accountName: 'Other Current Liabilities', amount: '', section: 'Current Liabilities' },

            // Non-current Liabilities
            { id: 34, accountCode: '2301', accountName: 'Long-Term Debt:Bank Loans', amount: '', section: 'Non-current Liabilities' },
            { id: 35, accountCode: '2302', accountName: 'Long-term Debt: Third Parties', amount: '', section: 'Non-current Liabilities' },
            { id: 36, accountCode: '2304', accountName: 'Long-Term Debt:Related Parties', amount: '', section: 'Non-current Liabilities' },
            { id: 37, accountCode: '2321', accountName: 'Deferred Tax Liabilities', amount: '', section: 'Non-current Liabilities' },
            { id: 38, accountCode: '2390', accountName: 'Other Non-Current Liabilities', amount: '', section: 'Non-current Liabilities' },

            { id: 39, accountCode: '2900', accountName: 'Total Liabilities', amount: '', section: 'Total Liabilities' },

            // Equity
            { id: 40, accountCode: '3102', accountName: 'Capital Stock', amount: '', section: 'Equity' },
            { id: 41, accountCode: '3202', accountName: 'Additional Paid-in Capital', amount: '', section: 'Equity' },
            { id: 42, accountCode: '3200', accountName: 'Retained Earnings', amount: '', section: 'Equity' },
            { id: 43, accountCode: '3298', accountName: 'Other Equity', amount: '', section: 'Equity' },
            { id: 44, accountCode: '3299', accountName: 'Total Equity', amount: '', section: 'Equity' },

            { id: 45, accountCode: '3300', accountName: 'Total Liabilities and Equity', amount: '', section: 'Final Total' }
        ]
    });

    // Initialize state with proper data structure
    const [currentData, setCurrentData] = useState(() => {
        const defaultData = getDefaultData();
        return data ? { ...defaultData, ...data } : defaultData;
    });
    
    // Force re-render state
    const [, forceRender] = useState({});

    // Update currentData when props change
    useEffect(() => {
        if (data) {
            setCurrentData(prevData => ({ ...prevData, ...data }));
        }
    }, [data]);

    const toggleSection = (sectionKey) => {
        expandedSectionsRef.current[sectionKey] = !expandedSectionsRef.current[sectionKey];
        forceRender({});
    };

    // Simple update data function
    const updateData = (section, newData) => {
        let updatedData;
        if (section === 'header') {
            updatedData = { ...currentData, header: { ...currentData.header, ...newData } };
        } else {
            updatedData = { ...currentData, [section]: newData };
        }
        
        setCurrentData(updatedData);
        
        if (onDataChange) {
            onDataChange(updatedData);
        }
    };

    const MainView = () => (
        <div className="max-w-7xl mx-auto bg-white flex-col">
            <div>
                <div className='mb-4'>
                    <AccordionSection
                        title="Header"
                        sectionKey="header"
                        isExpanded={expandedSectionsRef.current.header}
                        onToggle={() => toggleSection('header')}
                    >
                        <div className="mb-6 p-4">
                            <div className="grid grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year</label>
                                    <input
                                        type="text"
                                        value={currentData.header?.fiscalYear || ''}
                                        onChange={(e) => updateData('header', { fiscalYear: e.target.value })}
                                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                                    />
                                </div>
                                <div></div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">VERSION</label>
                                    <input
                                        type="text"
                                        value={currentData.header?.version || ''}
                                        onChange={(e) => updateData('header', { version: e.target.value })}
                                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </AccordionSection>
                </div>
                <AccordionSection
                    title="A. NET INCOME FROM BUSINESS AND/OR PROFESSIONS BASED ON FINANCIAL STATEMENTS"
                    sectionKey="profit_loss"
                    isExpanded={expandedSectionsRef.current.profit_loss}
                    onToggle={() => toggleSection('profit_loss')}
                >
                    <ProfitLossSection />
                    <FinancialPositionSection />
                </AccordionSection>
            </div>
        </div>
    );

    const AccordionSection = ({ title, children, sectionKey, isExpanded, onToggle }) => (
        <div className="border border-gray-300 rounded-lg">
            <button
                onClick={onToggle}
                className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-t-lg border-b border-gray-300 flex items-center justify-between transition-colors"
            >
                <span className="text-sm font-medium text-gray-700">{title}</span>
                {isExpanded ? (
                    <KeyboardArrowDown className="h-5 w-5 text-gray-600" />
                ) : (
                    <KeyboardArrowRight className="h-5 w-5 text-gray-600" />
                )}
            </button>
            {isExpanded && (
                <div className="bg-white rounded-b-lg">
                    {children}
                </div>
            )}
        </div>
    );

    function ProfitLossSection() {
        const expandedSubSectionsRef = useRef({
            a1_profit_loss: false
        });

        const [editingItem, setEditingItem] = useState(null);
        const [editValues, setEditValues] = useState({});
        const [, forceRenderSub] = useState({});

        const toggleSubSection = (sectionKey) => {
            expandedSubSectionsRef.current[sectionKey] = !expandedSubSectionsRef.current[sectionKey];
            forceRenderSub({});
        };

        const handleEdit = (item) => {
            setEditingItem(item.id);
            setEditValues({
                amount: item.amount,
                nonTaxableObject: item.nonTaxableObject,
                subjectToFinalTax: item.subjectToFinalTax,
                nonFinal: item.nonFinal,
                positiveFiscalCorrection: item.positiveFiscalCorrection,
                negativeFiscalCorrection: item.negativeFiscalCorrection,
                correctionCode: item.correctionCode,
                fiscalAmount: item.fiscalAmount
            });
        };

        const handleSave = () => {
            const updatedProfitLoss = currentData.profitLoss.map(item =>
                item.id === editingItem
                    ? { ...item, ...editValues }
                    : item
            );
            updateData('profitLoss', updatedProfitLoss);
            setEditingItem(null);
            setEditValues({});
        };

        const handleCancel = () => {
            setEditingItem(null);
            setEditValues({});
        };

        const handleInputChange = (field, value) => {
            setEditValues(prev => ({
                ...prev,
                [field]: value
            }));
        };

        const renderTableRows = () => {
            let currentSection = '';
            return currentData.profitLoss.map((item) => {
                const showSectionHeader = item.section !== currentSection;
                if (showSectionHeader) {
                    currentSection = item.section;
                }

                const isEditing = editingItem === item.id;

                return (
                    <React.Fragment key={item.id}>
                        {showSectionHeader && item.section !== 'Total' && (
                            <tr>
                                <td colSpan={11} className="px-3 py-2 bg-gray-100 font-medium text-xs border-b border-gray-300">
                                    {item.section}
                                </td>
                            </tr>
                        )}
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-1 text-center w-12">
                                {isEditing ? (
                                    <div className="flex gap-1 justify-center">
                                        <button
                                            onClick={handleSave}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <Check className="h-3 w-3" />
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Close className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit className="h-3 w-3" />
                                    </button>
                                )}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 text-center text-xs w-16">
                                {item.accountCode}
                            </td>
                            <td className="border border-gray-300 px-3 py-1 text-xs">
                                {item.accountName}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 w-24">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editValues.amount}
                                        onChange={(e) => handleInputChange('amount', e.target.value)}
                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-xs text-right block">
                                        {item.amount}
                                    </span>
                                )}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 w-20">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editValues.nonTaxableObject}
                                        onChange={(e) => handleInputChange('nonTaxableObject', e.target.value)}
                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                    />
                                ) : (
                                    <span className="text-xs text-right block">{item.nonTaxableObject}</span>
                                )}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 w-20">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editValues.subjectToFinalTax}
                                        onChange={(e) => handleInputChange('subjectToFinalTax', e.target.value)}
                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                    />
                                ) : (
                                    <span className="text-xs text-right block">{item.subjectToFinalTax}</span>
                                )}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 w-16">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editValues.nonFinal}
                                        onChange={(e) => handleInputChange('nonFinal', e.target.value)}
                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                    />
                                ) : (
                                    <span className="text-xs text-right block">{item.nonFinal}</span>
                                )}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 w-20">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editValues.positiveFiscalCorrection}
                                        onChange={(e) => handleInputChange('positiveFiscalCorrection', e.target.value)}
                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                    />
                                ) : (
                                    <span className="text-xs text-right block">{item.positiveFiscalCorrection}</span>
                                )}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 w-20">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editValues.negativeFiscalCorrection}
                                        onChange={(e) => handleInputChange('negativeFiscalCorrection', e.target.value)}
                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                    />
                                ) : (
                                    <span className="text-xs text-right block">{item.negativeFiscalCorrection}</span>
                                )}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 w-16">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editValues.correctionCode}
                                        onChange={(e) => handleInputChange('correctionCode', e.target.value)}
                                        className="w-full px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                    />
                                ) : (
                                    <span className="text-xs text-center block">{item.correctionCode}</span>
                                )}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 w-24">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editValues.fiscalAmount}
                                        onChange={(e) => handleInputChange('fiscalAmount', e.target.value)}
                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                    />
                                ) : (
                                    <span className="text-xs text-right block">
                                        {item.fiscalAmount}
                                    </span>
                                )}
                            </td>
                        </tr>
                    </React.Fragment>
                );
            });
        };

        return (
            <div className="p-4">
                <div className="">
                    <button
                        onClick={() => toggleSubSection('a1_profit_loss')}
                        className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-2 border border-gray-300 flex items-center justify-between transition-colors text-sm"
                    >
                        <span className="font-medium text-gray-700">A.1 PROFIT AND LOSS</span>
                        {expandedSubSectionsRef.current.a1_profit_loss ? (
                            <KeyboardArrowDown className="h-4 w-4 text-gray-600" />
                        ) : (
                            <KeyboardArrowRight className="h-4 w-4 text-gray-600" />
                        )}
                    </button>

                    {expandedSubSectionsRef.current.a1_profit_loss && (
                        <div className="border border-t-0 border-gray-300 bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-yellow-400">
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ACTION</th>
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ACCOUNT CODE</th>
                                            <th className="border border-gray-400 px-3 py-2 text-xs font-semibold text-left">ACCOUNT NAME</th>
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">AMOUNT (COMMERCIAL)</th>
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">NON-TAXABLE OBJECT</th>
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">SUBJECT TO FINAL TAX</th>
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">NON FINAL</th>
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">POSITIVE FISCAL CORRECTION</th>
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">NEGATIVE FISCAL CORRECTION</th>
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">CORRECTION CODE</th>
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">FISCAL AMOUNT (before Tax Facilities)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableRows()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    function FinancialPositionSection() {
        const expandedSubSectionsRef = useRef({
            a2_financial_position: false
        });

        const [, forceRenderSub] = useState({});

        const toggleSubSection = (sectionKey) => {
            expandedSubSectionsRef.current[sectionKey] = !expandedSubSectionsRef.current[sectionKey];
            forceRenderSub({});
        };

        const handleAmountChange = (id, value, side) => {
            if (side === 'assets') {
                const updatedAssets = currentData.assets.map(item =>
                    item.id === id ? { ...item, amount: value } : item
                );
                updateData('assets', updatedAssets);
            } else {
                const updatedLiabilitiesAndEquity = currentData.liabilitiesAndEquity.map(item =>
                    item.id === id ? { ...item, amount: value } : item
                );
                updateData('liabilitiesAndEquity', updatedLiabilitiesAndEquity);
            }
        };

        const renderTableSide = (data, side) => {
            let currentSection = '';

            return data.map((item) => {
                const showSectionHeader = item.section !== currentSection;
                if (showSectionHeader) {
                    currentSection = item.section;
                }

                return (
                    <React.Fragment key={item.id}>
                        {showSectionHeader && item.section !== 'Total' && item.section !== 'Total Liabilities' && item.section !== 'Final Total' && (
                            <tr>
                                <td colSpan={3} className="px-3 py-1 bg-gray-100 font-medium text-xs border-b border-gray-300">
                                    {item.section}
                                </td>
                            </tr>
                        )}
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-1 text-center text-xs w-16">
                                {item.accountCode}
                            </td>
                            <td className="border border-gray-300 px-3 py-1 text-xs">
                                {item.accountName}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 w-24">
                                <input
                                    type="text"
                                    value={item.amount}
                                    onChange={(e) => handleAmountChange(item.id, e.target.value, side)}
                                    className="w-full px-1 py-1 text-xs text-right border-0 bg-transparent"
                                />
                            </td>
                        </tr>
                    </React.Fragment>
                );
            });
        };

        return (
            <div className="p-4">
                <div className="">
                    <button
                        onClick={() => toggleSubSection('a2_financial_position')}
                        className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-2 border border-gray-300 flex items-center justify-between transition-colors text-sm"
                    >
                        <span className="font-medium text-gray-700">A.2 STATEMENT OF FINANCIAL POSITION</span>
                        {expandedSubSectionsRef.current.a2_financial_position ? (
                            <KeyboardArrowDown className="h-4 w-4 text-gray-600" />
                        ) : (
                            <KeyboardArrowRight className="h-4 w-4 text-gray-600" />
                        )}
                    </button>

                    {expandedSubSectionsRef.current.a2_financial_position && (
                        <div className="grid grid-cols-2 gap-4">
                            {/* Left Side - Assets */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-400">
                                    <thead>
                                        <tr className="bg-yellow-400">
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">Account Code</th>
                                            <th className="border border-gray-400 px-3 py-2 text-xs font-semibold text-left">Account Name</th>
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableSide(currentData.assets, 'assets')}
                                    </tbody>
                                </table>
                            </div>

                            {/* Right Side - Liabilities & Equity */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-400">
                                    <thead>
                                        <tr className="bg-yellow-400">
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">Account Code</th>
                                            <th className="border border-gray-400 px-3 py-2 text-xs font-semibold text-left">Account Name</th>
                                            <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableSide(currentData.liabilitiesAndEquity, 'liabilitiesAndEquity')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return <MainView />;
};

export default L3A2Form;