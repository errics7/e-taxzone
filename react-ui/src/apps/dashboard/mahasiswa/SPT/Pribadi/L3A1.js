import React, { useState, useCallback, useMemo } from 'react';
import { Check, Edit, KeyboardArrowRight, Close } from '@mui/icons-material';

export const L3A1Form = ({ data, onDataChange, taxpayerData }) => {
    const [expandedSections, setExpandedSections] = useState({});

    // Initialize assets directly from props, no useEffect needed
    const [assets, setAssets] = useState(() => data || {
        cash_and_cash_equivalents: [],
        account_receivable: [],
        investments_securities: [],
        movable_assets: [],
        non_movable_assets: [],
        other_assets: [],
        debt_at_end_of_year: [],
        profit_loss: []
    });

    // Helper function to update data and notify parent
    const updateDataAndNotify = useCallback((newData) => {
        setAssets(newData);
        onDataChange?.(newData);
    }, [onDataChange]);

    const toggleSection = useCallback((sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    }, []);

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

    const ProfitLossSection = () => {
        // Initialize data directly without useEffect
        const initialProfitLossData = useMemo(() => assets.profit_loss || [
            { id: 1, accountCode: '4002', accountName: 'Domestic', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 2, accountCode: '4003', accountName: 'Export', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 3, accountCode: '4014', accountName: 'Gross Sales', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: false },
            { id: 4, accountCode: '4011', accountName: 'Return', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 5, accountCode: '4012', accountName: 'Sales Discount', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 6, accountCode: '4020', accountName: 'Net Sales', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: false },
            { id: 7, accountCode: '5001', accountName: 'Purchase of Inventory', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 8, accountCode: '5004', accountName: 'Beginning Inventory', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 9, accountCode: '5009', accountName: 'Ending Inventory', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 10, accountCode: '5020', accountName: 'Total of COGS', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: false },
            { id: 11, accountCode: '4100', accountName: 'Gross Profit', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: false },
            { id: 12, accountCode: '5111', accountName: 'Salaries, Wages, Bonuses, Gratification expenses', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 13, accountCode: '5113', accountName: 'Transportation expenses', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 14, accountCode: '5114', accountName: 'Depreciation and Amortization expenses', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 15, accountCode: '5115', accountName: 'Rental expenses', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 16, accountCode: '5116', accountName: 'Interest expenses', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 17, accountCode: '5117', accountName: 'Expenses related to services', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 18, accountCode: '5118', accountName: 'Bad debt expenses', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 19, accountCode: '5120', accountName: 'Marketing promotion expenses', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 20, accountCode: '5121', accountName: 'Entertainment expenses', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 21, accountCode: '5122', accountName: 'General and Administration expenses', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 22, accountCode: '5199', accountName: 'Other operating expenses', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: true },
            { id: 23, accountCode: '5600', accountName: 'Total Operating Expenses', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: false },
            { id: 24, accountCode: '4800', accountName: 'Profit (Loss) Before Tax', amount: 0, nonTaxableFiscal: 0, subjectToFiscalTax: 0, bookFiscal: 0, positiveFiscalCorrection: 0, negativeFiscalCorrection: 0, fiscalAmount: 0, checked: false },
        ], [assets.profit_loss]);

        const [profitLossData, setProfitLossData] = useState(initialProfitLossData);
        const [editingItem, setEditingItem] = useState(null);
        const [editValues, setEditValues] = useState({});

        const handleEdit = useCallback((item) => {
            setEditingItem(item.id);
            setEditValues({
                amount: item.amount.toString(),
                nonTaxableFiscal: item.nonTaxableFiscal.toString(),
                subjectToFiscalTax: item.subjectToFiscalTax.toString(),
                bookFiscal: item.bookFiscal.toString(),
                positiveFiscalCorrection: item.positiveFiscalCorrection.toString(),
                negativeFiscalCorrection: item.negativeFiscalCorrection.toString(),
                fiscalAmount: item.fiscalAmount.toString()
            });
        }, []);

        const handleSave = useCallback(() => {
            const newProfitLossData = profitLossData.map(item =>
                item.id === editingItem
                    ? {
                        ...item,
                        amount: parseFloat(editValues.amount) || 0,
                        nonTaxableFiscal: parseFloat(editValues.nonTaxableFiscal) || 0,
                        subjectToFiscalTax: parseFloat(editValues.subjectToFiscalTax) || 0,
                        bookFiscal: parseFloat(editValues.bookFiscal) || 0,
                        positiveFiscalCorrection: parseFloat(editValues.positiveFiscalCorrection) || 0,
                        negativeFiscalCorrection: parseFloat(editValues.negativeFiscalCorrection) || 0,
                        fiscalAmount: parseFloat(editValues.fiscalAmount) || 0
                    }
                    : item
            );

            setProfitLossData(newProfitLossData);

            // Update parent data
            const newAssets = {
                ...assets,
                profit_loss: newProfitLossData
            };
            updateDataAndNotify(newAssets);

            setEditingItem(null);
            setEditValues({});
        }, [profitLossData, editingItem, editValues, assets, updateDataAndNotify]);

        const handleCancel = useCallback(() => {
            setEditingItem(null);
            setEditValues({});
        }, []);

        const handleInputChange = useCallback((field, value) => {
            setEditValues(prev => ({
                ...prev,
                [field]: value
            }));
        }, []);

        const toggleCheck = useCallback((id) => {
            const newProfitLossData = profitLossData.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            );

            setProfitLossData(newProfitLossData);

            // Update parent data
            const newAssets = {
                ...assets,
                profit_loss: newProfitLossData
            };
            updateDataAndNotify(newAssets);
        }, [profitLossData, assets, updateDataAndNotify]);

        const formatAmount = useCallback((amount) => {
            if (amount === 0) return '0.00';
            return new Intl.NumberFormat('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        }, []);

        const getSectionHeader = useCallback((index) => {
            if (index === 0) return 'Sales';
            if (index === 3) return 'Deducted';
            if (index === 6) return 'Cost of Good Sold (COGS)';
            if (index === 11) return 'Operating Expenses';
            return null;
        }, []);

        const isSubtotalRow = useCallback((accountCode) => {
            return ['4014', '4020', '5020', '4100', '5600', '4800'].includes(accountCode);
        }, []);

        return (
            <div className="p-4">
                <div className="bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-8"></th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">ACCOUNT CODE</th>
                                    <th className="border border-gray-400 px-3 py-2 text-xs font-semibold text-gray-800 text-left">ACCOUNT NAME</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-24">AMOUNT (RUPIAH)</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">NON-TAXABLE FISCAL</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">SUBJECT TO FISCAL TAX</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-16">BOOK FISCAL</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">POSITIVE FISCAL CORRECTION</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs text-gray-800 w-20 font-bold">NEGATIVE FISCAL CORRECTION</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs text-gray-800 w-24 font-bold">FISCAL AMOUNT (before Tax Facilities)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profitLossData.map((item, index) => {
                                    const sectionHeader = getSectionHeader(index);

                                    return (
                                        <React.Fragment key={item.id}>
                                            {sectionHeader && (
                                                <tr>
                                                    <td colSpan={10} className="border border-gray-400 px-3 py-1 bg-gray-100 font-medium text-xs">
                                                        {sectionHeader}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr className="hover:bg-gray-50">
                                                <td className="border border-gray-400 px-2 py-1 text-center">
                                                    {editingItem === item.id ? (
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
                                                <td className="border border-gray-400 px-2 py-1 text-center text-xs">
                                                    {item.accountCode}
                                                </td>
                                                <td className="border border-gray-400 px-3 py-1 text-xs">
                                                    {item.accountName}
                                                </td>
                                                <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                                    {editingItem === item.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.amount}
                                                            onChange={(e) => handleInputChange('amount', e.target.value)}
                                                            className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                            style={{ fontSize: '10px' }}
                                                        />
                                                    ) : (
                                                        formatAmount(item.amount)
                                                    )}
                                                </td>
                                                <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                                    {editingItem === item.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.nonTaxableFiscal}
                                                            onChange={(e) => handleInputChange('nonTaxableFiscal', e.target.value)}
                                                            className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                            style={{ fontSize: '10px' }}
                                                        />
                                                    ) : (
                                                        formatAmount(item.nonTaxableFiscal)
                                                    )}
                                                </td>
                                                <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                                    {editingItem === item.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.subjectToFiscalTax}
                                                            onChange={(e) => handleInputChange('subjectToFiscalTax', e.target.value)}
                                                            className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                            style={{ fontSize: '10px' }}
                                                        />
                                                    ) : (
                                                        formatAmount(item.subjectToFiscalTax)
                                                    )}
                                                </td>
                                                <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                                    {editingItem === item.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.bookFiscal}
                                                            onChange={(e) => handleInputChange('bookFiscal', e.target.value)}
                                                            className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                            style={{ fontSize: '10px' }}
                                                        />
                                                    ) : (
                                                        formatAmount(item.bookFiscal)
                                                    )}
                                                </td>
                                                <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                                    {editingItem === item.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.positiveFiscalCorrection}
                                                            onChange={(e) => handleInputChange('positiveFiscalCorrection', e.target.value)}
                                                            className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                            style={{ fontSize: '10px' }}
                                                        />
                                                    ) : (
                                                        formatAmount(item.positiveFiscalCorrection)
                                                    )}
                                                </td>
                                                <td className="border border-gray-400 px-2 py-1 text-right text-xs font-bold">
                                                    {editingItem === item.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.negativeFiscalCorrection}
                                                            onChange={(e) => handleInputChange('negativeFiscalCorrection', e.target.value)}
                                                            className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right font-bold"
                                                            style={{ fontSize: '10px' }}
                                                        />
                                                    ) : (
                                                        formatAmount(item.negativeFiscalCorrection)
                                                    )}
                                                </td>
                                                <td className="border border-gray-400 px-2 py-1 text-right text-xs font-bold">
                                                    {editingItem === item.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.fiscalAmount}
                                                            onChange={(e) => handleInputChange('fiscalAmount', e.target.value)}
                                                            className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right font-bold"
                                                            style={{ fontSize: '10px' }}
                                                        />
                                                    ) : (
                                                        formatAmount(item.fiscalAmount)
                                                    )}
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const FinancialPositionSection = () => {
        // Static default data - moved outside state to prevent recreating on every render
        const defaultLeftSideData = useMemo(() => [
            // Current Assets
            { id: 1, accountCode: '1101', accountName: 'Cash and Equivalent', amount: '', section: 'Current Assets' },
            { id: 2, accountCode: '1200', accountName: 'Inventories', amount: '', section: 'Current Assets' },
            { id: 3, accountCode: '1312', accountName: 'Account Receivables - Third Parties', amount: '', section: 'Current Assets' },
            { id: 4, accountCode: '1313', accountName: 'Account Receivables - Related Parties', amount: '', section: 'Current Assets' },
            { id: 5, accountCode: '1314', accountName: 'Other Account Receivables - Third Parties', amount: '', section: 'Current Assets' },
            { id: 6, accountCode: '1315', accountName: 'Other Account Receivables - Related Parties', amount: '', section: 'Current Assets' },
            { id: 7, accountCode: '1316', accountName: 'Less: Allowance for Doubtful Account Receivables', amount: '', section: 'Current Assets' },
            { id: 8, accountCode: '1400', accountName: 'Inventories', amount: '', section: 'Current Assets' },
            { id: 9, accountCode: '1421', accountName: 'Prepaid expenses', amount: '', section: 'Current Assets' },
            { id: 10, accountCode: '1422', accountName: 'Advances', amount: '', section: 'Current Assets' },
            { id: 11, accountCode: '1428', accountName: 'Deferred Taxes', amount: '', section: 'Current Assets' },
            { id: 12, accountCode: '1490', accountName: 'Other current assets', amount: '', section: 'Current Assets' },

            // Non-current Assets
            { id: 13, accountCode: '1521', accountName: 'Long - Term Receivables', amount: '', section: 'Non-current Assets' },
            { id: 14, accountCode: '1523', accountName: 'Land And Buildings', amount: '', section: 'Non-current Assets' },
            { id: 15, accountCode: '1524', accountName: 'Less: Accumulated Depreciation - Buildings', amount: '', section: 'Non-current Assets' },
            { id: 16, accountCode: '1526', accountName: 'Other Fixed Assets', amount: '', section: 'Non-current Assets' },
            { id: 17, accountCode: '1530', accountName: 'Less: Accumulated Depreciation - Other Fixed Assets', amount: '', section: 'Non-current Assets' },
            { id: 18, accountCode: '1541', accountName: 'Investment in associates', amount: '', section: 'Non-current Assets' },
            { id: 19, accountCode: '1598', accountName: 'Other Long - term Investments', amount: '', section: 'Non-current Assets' },
            { id: 20, accountCode: '1640', accountName: 'Intangible Assets', amount: '', section: 'Non-current Assets' },
            { id: 21, accountCode: '1691', accountName: 'Deferred Tax Assets', amount: '', section: 'Non-current Assets' },
            { id: 22, accountCode: '1698', accountName: 'Other Non-Current Assets', amount: '', section: 'Non-current Assets' },

            { id: 23, accountCode: '1700', accountName: 'Total Assets', amount: '0.00', section: 'Total', isTotal: true },
        ], []);

        const defaultRightSideData = useMemo(() => [
            // Current Liabilities
            { id: 24, accountCode: '2102', accountName: 'Account Payable - Third Parties', amount: '', section: 'Current Liabilities' },
            { id: 25, accountCode: '2103', accountName: 'Accounts Payable-Related Parties', amount: '', section: 'Current Liabilities' },
            { id: 26, accountCode: '2111', accountName: 'Interest Payable', amount: '', section: 'Current Liabilities' },
            { id: 27, accountCode: '2141', accountName: 'Taxes Payable', amount: '', section: 'Current Liabilities' },
            { id: 28, accountCode: '2142', accountName: 'Dividends Payable', amount: '', section: 'Current Liabilities' },
            { id: 29, accountCode: '2149', accountName: 'Accrued Expenses', amount: '', section: 'Current Liabilities' },
            { id: 30, accountCode: '2201', accountName: 'Short - term Bank Loans', amount: '', section: 'Current Liabilities' },
            { id: 31, accountCode: '2202', accountName: 'Long - Term Debts: Current Maturities', amount: '', section: 'Current Liabilities' },
            { id: 32, accountCode: '2203', accountName: 'Advances', amount: '', section: 'Current Liabilities' },
            { id: 33, accountCode: '2230', accountName: 'Other Current Liabilities', amount: '', section: 'Current Liabilities' },

            // Non-current Liabilities
            { id: 34, accountCode: '2301', accountName: 'Long-Term Debts:Bank Loans', amount: '', section: 'Non-current Liabilities' },
            { id: 35, accountCode: '2302', accountName: 'Long-term Lease - more than', amount: '', section: 'Non-current Liabilities' },
            { id: 36, accountCode: '2304', accountName: 'Long-Term Debt:Related Parties', amount: '', section: 'Non-current Liabilities' },
            { id: 37, accountCode: '2321', accountName: 'Deferred Tax Liabilities', amount: '', section: 'Non-current Liabilities' },
            { id: 38, accountCode: '2390', accountName: 'Other Non-Current Liabilities', amount: '', section: 'Non-current Liabilities' },

            { id: 39, accountCode: '2900', accountName: 'Total Liabilities', amount: '0.00', section: 'Total Liabilities', isTotal: true },

            // Equity
            { id: 40, accountCode: '3102', accountName: 'Capital Stock', amount: '', section: 'Equity' },
            { id: 41, accountCode: '3202', accountName: 'Additional Paid-in Capital', amount: '', section: 'Equity' },
            { id: 42, accountCode: '3300', accountName: 'Retained Earnings', amount: '', section: 'Equity' },
            { id: 43, accountCode: '3298', accountName: 'Other Equity', amount: '', section: 'Equity' },
            { id: 44, accountCode: '3299', accountName: 'Total Equity', amount: '0.00', section: 'Equity', isTotal: true },

            { id: 45, accountCode: '3300', accountName: 'Total Liabilities and Equity', amount: '0.00', section: 'Final Total', isTotal: true },
        ], []);

        const defaultFinancialData = useMemo(() => ({
            taxIdFirm: '',
            nameFirm: '',
            taxDetailAgent: '',
            nameAgent: '',
            selectedOption: '',
            finantialStatement: ''
        }), []);

        // State initialization - initialize with default data or from assets
        const [leftSideData, setLeftSideData] = useState(() => {
            return assets.financial_position?.leftSide || defaultLeftSideData;
        });

        const [rightSideData, setRightSideData] = useState(() => {
            return assets.financial_position?.rightSide || defaultRightSideData;
        });

        const [financialData, setFinancialData] = useState(() => {
            return assets.financial_position?.financialData || defaultFinancialData;
        });

        // Format amount function - memoized to prevent recreation
        const formatAmount = useCallback((amount) => {
            return new Intl.NumberFormat('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        }, []);

        // Calculate totals - optimized and memoized
        const calculateTotals = useCallback((leftData, rightData) => {
            // Calculate current assets total
            const currentAssetsTotal = leftData
                .filter(item => item.section === 'Current Assets' && !item.isTotal)
                .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

            // Calculate non-current assets total
            const nonCurrentAssetsTotal = leftData
                .filter(item => item.section === 'Non-current Assets' && !item.isTotal)
                .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

            // Calculate total assets
            const totalAssets = currentAssetsTotal + nonCurrentAssetsTotal;

            // Calculate current liabilities total
            const currentLiabilitiesTotal = rightData
                .filter(item => item.section === 'Current Liabilities' && !item.isTotal)
                .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

            // Calculate non-current liabilities total
            const nonCurrentLiabilitiesTotal = rightData
                .filter(item => item.section === 'Non-current Liabilities' && !item.isTotal)
                .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

            // Calculate total liabilities
            const totalLiabilities = currentLiabilitiesTotal + nonCurrentLiabilitiesTotal;

            // Calculate equity total
            const equityTotal = rightData
                .filter(item => item.section === 'Equity' && !item.isTotal)
                .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

            // Calculate total liabilities and equity
            const totalLiabilitiesAndEquity = totalLiabilities + equityTotal;

            return {
                totalAssets: formatAmount(totalAssets),
                totalLiabilities: formatAmount(totalLiabilities),
                totalEquity: formatAmount(equityTotal),
                totalLiabilitiesAndEquity: formatAmount(totalLiabilitiesAndEquity)
            };
        }, [formatAmount]);

        // FIXED: Stable reference untuk handler dengan useRef
        const stableUpdateParent = useCallback((newLeftData, newRightData, newFinancialData) => {
            const newAssets = {
                ...assets,
                financial_position: {
                    leftSide: newLeftData,
                    rightSide: newRightData,
                    financialData: newFinancialData
                }
            };
            updateDataAndNotify(newAssets);
        }, [updateDataAndNotify]);

        // FIXED: Handler yang tidak akan menyebabkan re-creation
        const handleAmountChange = useCallback((id, value, side) => {
            if (side === 'left') {
                setLeftSideData(prevLeftData => {
                    const newLeftData = prevLeftData.map(item =>
                        item.id === id ? { ...item, amount: value } : item
                    );

                    // Update parent dalam batch update berikutnya
                    requestAnimationFrame(() => {
                        setRightSideData(currentRightData => {
                            const totals = calculateTotals(newLeftData, currentRightData);
                            const updatedLeftData = newLeftData.map(item => {
                                if (item.accountCode === '1700') { // Total Assets
                                    return { ...item, amount: totals.totalAssets };
                                }
                                return item;
                            });

                            setLeftSideData(updatedLeftData);

                            setFinancialData(currentFinancialData => {
                                stableUpdateParent(updatedLeftData, currentRightData, currentFinancialData);
                                return currentFinancialData;
                            });

                            return currentRightData;
                        });
                    });

                    return newLeftData;
                });

            } else {
                setRightSideData(prevRightData => {
                    const newRightData = prevRightData.map(item =>
                        item.id === id ? { ...item, amount: value } : item
                    );

                    // Update parent dalam batch update berikutnya
                    requestAnimationFrame(() => {
                        setLeftSideData(currentLeftData => {
                            const totals = calculateTotals(currentLeftData, newRightData);
                            const updatedRightData = newRightData.map(item => {
                                if (item.accountCode === '2900') { // Total Liabilities
                                    return { ...item, amount: totals.totalLiabilities };
                                } else if (item.accountCode === '3299') { // Total Equity
                                    return { ...item, amount: totals.totalEquity };
                                } else if (item.accountCode === '3300' && item.section === 'Final Total') { // Total Liabilities and Equity
                                    return { ...item, amount: totals.totalLiabilitiesAndEquity };
                                }
                                return item;
                            });

                            setRightSideData(updatedRightData);

                            setFinancialData(currentFinancialData => {
                                stableUpdateParent(currentLeftData, updatedRightData, currentFinancialData);
                                return currentFinancialData;
                            });

                            return currentLeftData;
                        });
                    });

                    return newRightData;
                });
            }
        }, [calculateTotals, stableUpdateParent]);

        // FIXED: Handler untuk financial data
        const handleFinancialDataChange = useCallback((field, value) => {
            setFinancialData(prevData => {
                const newFinancialData = {
                    ...prevData,
                    [field]: value
                };

                // Update parent dalam batch update berikutnya
                requestAnimationFrame(() => {
                    setLeftSideData(currentLeftData => {
                        setRightSideData(currentRightData => {
                            stableUpdateParent(currentLeftData, currentRightData, newFinancialData);
                            return currentRightData;
                        });
                        return currentLeftData;
                    });
                });

                return newFinancialData;
            });
        }, [stableUpdateParent]);

        // FIXED: Stable TableRow yang tidak akan re-render
        const TableRow = React.memo(({ item, side }) => (
            <tr className={`hover:bg-gray-50 ${item.isTotal ? 'bg-gray-100' : ''}`}>
                <td className="border-r border-gray-300 px-2 py-1 text-center text-xs w-16">
                    {item.accountCode}
                </td>
                <td className="border-r border-gray-300 px-3 py-1 text-xs">
                    {item.accountName}
                </td>
                <td className="px-2 py-1 text-right text-xs w-24">
                    {item.isTotal ? (
                        <div className="bg-gray-200 px-2 py-1 text-right font-medium">
                            {item.amount}
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={item.amount}
                            onChange={(e) => handleAmountChange(item.id, e.target.value, side)}
                            className="w-full border border-gray-300 px-2 py-1 text-xs text-right"
                            placeholder=""
                        />
                    )}
                </td>
            </tr>
        ), (prevProps, nextProps) => {
            // Custom comparison function untuk mencegah re-render yang tidak perlu
            return (
                prevProps.item.id === nextProps.item.id &&
                prevProps.item.amount === nextProps.item.amount &&
                prevProps.side === nextProps.side
            );
        });

        // Memoized section header component
        const SectionHeader = React.memo(({ section }) => (
            <tr>
                <td colSpan={3} className="px-3 py-1 bg-gray-100 font-medium text-xs border-b border-gray-300">
                    {section}
                </td>
            </tr>
        ));

        // FIXED: Render function yang lebih stable
        const leftTableRows = useMemo(() => {
            let currentSection = '';
            return leftSideData.map((item, index) => {
                const showSectionHeader = item.section !== currentSection && !item.isTotal;
                if (showSectionHeader) {
                    currentSection = item.section;
                }

                return (
                    <React.Fragment key={item.id}>
                        {showSectionHeader && <SectionHeader section={item.section} />}
                        <TableRow item={item} side="left" />
                    </React.Fragment>
                );
            });
        }, [leftSideData]);

        const rightTableRows = useMemo(() => {
            let currentSection = '';
            return rightSideData.map((item, index) => {
                const showSectionHeader = item.section !== currentSection && !item.isTotal;
                if (showSectionHeader) {
                    currentSection = item.section;
                }

                return (
                    <React.Fragment key={item.id}>
                        {showSectionHeader && <SectionHeader section={item.section} />}
                        <TableRow item={item} side="right" />
                    </React.Fragment>
                );
            });
        }, [rightSideData]);

        return (
            <div className="p-4">
                <div className="bg-white">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Left Side - Assets */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-400">
                                <thead>
                                    <tr className="bg-yellow-400">
                                        <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800">Account Code</th>
                                        <th className="border border-gray-400 px-3 py-2 text-xs font-semibold text-gray-800 text-left">Account Name</th>
                                        <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leftTableRows}
                                </tbody>
                            </table>
                        </div>

                        {/* Right Side - Liabilities & Equity */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-400">
                                <thead>
                                    <tr className="bg-yellow-400">
                                        <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800">Account Code</th>
                                        <th className="border border-gray-400 px-3 py-2 text-xs font-semibold text-gray-800 text-left">Account Name</th>
                                        <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rightTableRows}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Section - Financial Statement */}
                    <div className="mt-6 space-y-3">
                        <div className="grid grid-cols-1 gap-3 text-xs">
                            <div className="flex items-center gap-2">
                                <label className="w-48">FINANCIAL STATEMENT</label>
                                <input
                                    type="text"
                                    value={financialData.finantialStatement}
                                    onChange={(e) => handleFinancialDataChange('finantialStatement', e.target.value)}
                                    className="flex-1 border border-gray-300 px-2 py-1 text-xs"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-48">Tax ID PUBLIC ACCOUNTANT FIRM</label>
                                <input
                                    type="text"
                                    value={financialData.taxIdFirm}
                                    onChange={(e) => handleFinancialDataChange('taxIdFirm', e.target.value)}
                                    className="flex-1 border border-gray-300 px-2 py-1 text-xs"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="w-48">NAME OF PUBLIC ACCOUNTANT FIRM</label>
                                <input
                                    type="text"
                                    value={financialData.nameFirm}
                                    onChange={(e) => handleFinancialDataChange('nameFirm', e.target.value)}
                                    className="flex-1 border border-gray-300 px-2 py-1 text-xs"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="w-48">TAX DETAIL AGENT</label>
                                <input
                                    type="text"
                                    value={financialData.taxDetailAgent}
                                    onChange={(e) => handleFinancialDataChange('taxDetailAgent', e.target.value)}
                                    className="flex-1 border border-gray-300 px-2 py-1 text-xs"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="w-48">NAME OF TAX AGENT</label>
                                <input
                                    type="text"
                                    value={financialData.nameAgent}
                                    onChange={(e) => handleFinancialDataChange('nameAgent', e.target.value)}
                                    className="flex-1 border border-gray-300 px-2 py-1 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const MainView = () => (
        <div className="max-w-6xl mx-auto bg-white">
            {/* Main Sections */}
            <div className="space-y-4">
                <AccordionSection
                    title="A.1 PROFIT AND LOSS"
                    sectionKey="profit_loss"
                    isExpanded={expandedSections.profit_loss}
                    onToggle={() => toggleSection('profit_loss')}
                >
                    <ProfitLossSection />
                </AccordionSection>
                <AccordionSection
                    title="A.2 STATEMENT OF FINANTIAL POSITION"
                    sectionKey="finantial_position"
                    isExpanded={expandedSections.finantial_position}
                    onToggle={() => toggleSection('finantial_position')}
                >
                    <FinancialPositionSection />
                </AccordionSection>
            </div>
        </div>
    );

    return <MainView />;
};

export default L3A1Form;