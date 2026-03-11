import React, { useState, useCallback } from 'react';
import { Check, Edit, KeyboardArrowRight, Close, KeyboardArrowDown, Add } from '@mui/icons-material';

export const L3BForm = ({ data, onDataChange, taxpayerData }) => {
    const [expandedSections, setExpandedSections] = useState({
        certain_gross_turnover: true
    });

    const [headerData, setHeaderData] = useState({
        fiscalYear: '2023',
        version: 'A4'
    });

    const [certainGrossTurnoverData, setCertainGrossTurnoverData] = useState([
        {
            id: 1,
            businessName: 'KP WALAHIR DUSUN III JL RAYA NAMBO 0 NO.0',
            taxId: 'A027621317024000000 - NPM A027621317026002',
            monthlyData: {
                january: 0.00,
                february: 0.00,
                march: 0.00,
                april: 0.00,
                may: 0.00,
                june: 0.00,
                july: 0.00,
                august: 0.00,
                september: 0.00,
                october: 0.00,
                november: 0.00,
                december: 0.00
            },
            totalGrossTurnover: {
                january: 0.00,
                february: 0.00,
                march: 0.00,
                april: 0.00,
                may: 0.00,
                june: 0.00,
                july: 0.00,
                august: 0.00,
                september: 0.00,
                october: 0.00,
                november: 0.00,
                december: 0.00,
                total: 0.00
            },
            accGrossTurnover: {
                january: 0.00,
                february: 0.00,
                march: 0.00,
                april: 0.00,
                may: 0.00,
                june: 0.00,
                july: 0.00,
                august: 0.00,
                september: 0.00,
                october: 0.00,
                november: 0.00,
                december: 0.00,
                total: 0.00
            },
            exemptionGrossTurnover: {
                january: 0.00,
                february: 0.00,
                march: 0.00,
                april: 0.00,
                may: 0.00,
                june: 500000000.00,
                july: 0.00,
                august: 0.00,
                september: 0.00,
                october: 0.00,
                november: 0.00,
                december: 0.00,
                total: 500000000.00
            },
            taxableGrossTurnover: {
                january: 0.00,
                february: 0.00,
                march: 0.00,
                april: 0.00,
                may: 0.00,
                june: 0.00,
                july: 0.00,
                august: 0.00,
                september: 0.00,
                october: 0.00,
                november: 0.00,
                december: 0.00,
                total: 0.00
            },
            totalFinalIncomeTax: {
                january: 0.00,
                february: 0.00,
                march: 0.00,
                april: 0.00,
                may: 0.00,
                june: 0.00,
                july: 0.00,
                august: 0.00,
                september: 0.00,
                october: 0.00,
                november: 0.00,
                december: 0.00,
                total: 0.00
            },
            finalIncomeTaxPaid: {
                january: 0.00,
                february: 0.00,
                march: 0.00,
                april: 0.00,
                may: 0.00,
                june: 0.00,
                july: 0.00,
                august: 0.00,
                september: 0.00,
                october: 0.00,
                november: 0.00,
                december: 0.00,
                total: 0.00
            },
            finalIncomeTaxThirdParty: {
                january: 0.00,
                february: 0.00,
                march: 0.00,
                april: 0.00,
                may: 0.00,
                june: 0.00,
                july: 0.00,
                august: 0.00,
                september: 0.00,
                october: 0.00,
                november: 0.00,
                december: 0.00,
                total: 0.00
            },
            differences: {
                january: 0.00,
                february: 0.00,
                march: 0.00,
                april: 0.00,
                may: 0.00,
                june: 0.00,
                july: 0.00,
                august: 0.00,
                september: 0.00,
                october: 0.00,
                november: 0.00,
                december: 0.00,
                total: 0.00
            },
            emergencyTaxReturn: {
                total: 0.00
            },
            amendmentDifferences: {
                total: 0.00
            }
        }
    ]);

    const [editingItemId, setEditingItemId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const toggleSection = useCallback((sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    }, []);

    const handleEdit = useCallback((itemId) => {
        setEditingItemId(itemId);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingItemId(null);
    }, []);

    const handleSaveEdit = useCallback(() => {
        setEditingItemId(null);
    }, []);

    const handleFieldChange = useCallback((itemId, fieldType, month, value) => {
        setCertainGrossTurnoverData(prev => 
            prev.map(item => {
                if (item.id === itemId) {
                    const updatedItem = { ...item };
                    if (month === 'total') {
                        updatedItem[fieldType] = { ...updatedItem[fieldType], total: parseFloat(value) || 0 };
                    } else {
                        updatedItem[fieldType] = { ...updatedItem[fieldType], [month]: parseFloat(value) || 0 };
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    }, []);

    const handleAdd = useCallback(() => {
        setShowAddForm(true);
    }, []);

    const MainView = () => (
        <div className="max-w-full mx-auto bg-white flex-col">
            {/* Header Section */}
            <div className='mb-4'>
                <AccordionSection
                    title="Header"
                    sectionKey="header"
                    isExpanded={expandedSections.header}
                    onToggle={() => toggleSection('header')}
                >
                    <div className="mb-6 p-4">
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year</label>
                                <input
                                    type="text"
                                    value={headerData.fiscalYear}
                                    onChange={(e) => setHeaderData(prev => ({ ...prev, fiscalYear: e.target.value }))}
                                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">VERSION</label>
                                <input
                                    type="text"
                                    value={headerData.version}
                                    onChange={(e) => setHeaderData(prev => ({ ...prev, version: e.target.value }))}
                                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>
                </AccordionSection>
            </div>

            {/* Certain Gross Turnover Section */}
            <div className='mb-4'>
                <AccordionSection
                    title="A. CERTAIN GROSS TURNOVER (PP NO.23)"
                    sectionKey="certain_gross_turnover"
                    isExpanded={expandedSections.certain_gross_turnover}
                    onToggle={() => toggleSection('certain_gross_turnover')}
                >
                    <CertainGrossTurnoverSection />
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

    function CertainGrossTurnoverSection() {
        // If editing an item, show the detailed edit form
        if (editingItemId) {
            const editingItem = certainGrossTurnoverData.find(item => item.id === editingItemId);
            
            return (
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">EDIT CERTAIN GROSS TURNOVER</h2>
                    
                    <div className="mb-6 p-4 bg-gray-50 rounded">
                        <h3 className="text-lg font-medium mb-2">{editingItem.businessName}</h3>
                        <p className="text-sm text-gray-600">{editingItem.taxId}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">January</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.january}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'january', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">February</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.february}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'february', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">March</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.march}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'march', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">April</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.april}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'april', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">May</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.may}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'may', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">June</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.june}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'june', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">July</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.july}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'july', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">August</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.august}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'august', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">September</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.september}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'september', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">October</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.october}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'october', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">November</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.november}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'november', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">December</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.monthlyData.december}
                                    onChange={(e) => handleFieldChange(editingItemId, 'monthlyData', 'december', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6">
                            <button
                                onClick={handleCancelEdit}
                                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                            >
                                <Close className="h-4 w-4" />
                                Close
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center gap-2 font-medium"
                            >
                                <Check className="h-4 w-4" />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

        return (
            <div className="p-4">
                <div className="mb-4">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center gap-2 text-sm font-medium"
                    >
                        <Add className="h-4 w-4" />
                        Add
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr className="bg-yellow-400">
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-16">ACTION</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-48">NAME OF BUSINESS PLACE</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">JANUARY</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">FEBRUARY</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">MARCH</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">APRIL</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">MAY</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">JUNE</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">JULY</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">AUGUST</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">SEPTEMBER</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">OCTOBER</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">NOVEMBER</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">DECEMBER</th>
                                <th className="border border-gray-400 px-2 py-2 font-semibold w-20">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certainGrossTurnoverData.map((item) => (
                                <React.Fragment key={item.id}>
                                    {/* First row with business name and edit icon */}
                                    <tr className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-2 py-2 text-center">
                                        </td>
                                        <td className="border border-gray-300 px-2 py-2">
                                            <div className="font-medium">{item.businessName}</div>
                                            <div className="text-gray-600 text-xs">{item.taxId}</div>
                                        </td>
                                        {months.map(month => (
                                            <td key={month} className="border border-gray-300 px-1 py-1">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.monthlyData[month]}
                                                    onChange={(e) => handleFieldChange(item.id, 'monthlyData', month, e.target.value)}
                                                    className="w-full text-xs text-right border-0 bg-transparent"
                                                />
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 px-1 py-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.monthlyData.total || 0}
                                                onChange={(e) => handleFieldChange(item.id, 'monthlyData', 'total', e.target.value)}
                                                className="w-full text-xs text-right border-0 bg-transparent"
                                            />
                                        </td>
                                    </tr>

                                    {/* TOTAL GROSS TURNOVER row */}
                                    <tr>
                                        <td className="border border-gray-300 px-2 py-1"></td>
                                        <td className="border border-gray-300 px-2 py-1 text-xs text-gray-600">TOTAL GROSS TURNOVER</td>
                                        {months.map(month => (
                                            <td key={month} className="border border-gray-300 px-1 py-1">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.totalGrossTurnover[month]}
                                                    onChange={(e) => handleFieldChange(item.id, 'totalGrossTurnover', month, e.target.value)}
                                                    className="w-full text-xs text-right border-0 bg-transparent"
                                                />
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 px-1 py-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.totalGrossTurnover.total}
                                                onChange={(e) => handleFieldChange(item.id, 'totalGrossTurnover', 'total', e.target.value)}
                                                className="w-full text-xs text-right border-0 bg-transparent"
                                            />
                                        </td>
                                    </tr>

                                    {/* ACC OF GROSS TURNOVER row */}
                                    <tr>
                                        <td className="border border-gray-300 px-2 py-1"></td>
                                        <td className="border border-gray-300 px-2 py-1 text-xs text-gray-600">ACC OF GROSS TURNOVER</td>
                                        {months.map(month => (
                                            <td key={month} className="border border-gray-300 px-1 py-1">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.accGrossTurnover[month]}
                                                    onChange={(e) => handleFieldChange(item.id, 'accGrossTurnover', month, e.target.value)}
                                                    className="w-full text-xs text-right border-0 bg-transparent"
                                                />
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 px-1 py-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.accGrossTurnover.total}
                                                onChange={(e) => handleFieldChange(item.id, 'accGrossTurnover', 'total', e.target.value)}
                                                className="w-full text-xs text-right border-0 bg-transparent"
                                            />
                                        </td>
                                    </tr>

                                    {/* EXEMPTION OF GROSS TURNOVER row */}
                                    <tr>
                                        <td className="border border-gray-300 px-2 py-1"></td>
                                        <td className="border border-gray-300 px-2 py-1 text-xs text-gray-600">EXEMPTION OF GROSS TURNOVER</td>
                                        {months.map(month => (
                                            <td key={month} className="border border-gray-300 px-1 py-1">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.exemptionGrossTurnover[month]}
                                                    onChange={(e) => handleFieldChange(item.id, 'exemptionGrossTurnover', month, e.target.value)}
                                                    className="w-full text-xs text-right border-0 bg-transparent"
                                                />
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 px-1 py-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.exemptionGrossTurnover.total}
                                                onChange={(e) => handleFieldChange(item.id, 'exemptionGrossTurnover', 'total', e.target.value)}
                                                className="w-full text-xs text-right border-0 bg-transparent"
                                            />
                                        </td>
                                    </tr>

                                    {/* TAXABLE GROSS TURNOVER row */}
                                    <tr>
                                        <td className="border border-gray-300 px-2 py-1"></td>
                                        <td className="border border-gray-300 px-2 py-1 text-xs text-gray-600">TAXABLE GROSS TURNOVER</td>
                                        {months.map(month => (
                                            <td key={month} className="border border-gray-300 px-1 py-1">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.taxableGrossTurnover[month]}
                                                    onChange={(e) => handleFieldChange(item.id, 'taxableGrossTurnover', month, e.target.value)}
                                                    className="w-full text-xs text-right border-0 bg-transparent"
                                                />
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 px-1 py-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.taxableGrossTurnover.total}
                                                onChange={(e) => handleFieldChange(item.id, 'taxableGrossTurnover', 'total', e.target.value)}
                                                className="w-full text-xs text-right border-0 bg-transparent"
                                            />
                                        </td>
                                    </tr>

                                    {/* TOTAL FINAL INCOME TAX row */}
                                    <tr>
                                        <td className="border border-gray-300 px-2 py-1"></td>
                                        <td className="border border-gray-300 px-2 py-1 text-xs text-gray-600">TOTAL FINAL INCOME TAX</td>
                                        {months.map(month => (
                                            <td key={month} className="border border-gray-300 px-1 py-1">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.totalFinalIncomeTax[month]}
                                                    onChange={(e) => handleFieldChange(item.id, 'totalFinalIncomeTax', month, e.target.value)}
                                                    className="w-full text-xs text-right border-0 bg-transparent"
                                                />
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 px-1 py-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.totalFinalIncomeTax.total}
                                                onChange={(e) => handleFieldChange(item.id, 'totalFinalIncomeTax', 'total', e.target.value)}
                                                className="w-full text-xs text-right border-0 bg-transparent"
                                            />
                                        </td>
                                    </tr>

                                    {/* FINAL INCOME TAX WHICH IS SELF PAID row */}
                                    <tr>
                                        <td className="border border-gray-300 px-2 py-1"></td>
                                        <td className="border border-gray-300 px-2 py-1 text-xs text-gray-600">FINAL INCOME TAX WHICH IS SELF PAID</td>
                                        {months.map(month => (
                                            <td key={month} className="border border-gray-300 px-1 py-1">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.finalIncomeTaxPaid[month]}
                                                    onChange={(e) => handleFieldChange(item.id, 'finalIncomeTaxPaid', month, e.target.value)}
                                                    className="w-full text-xs text-right border-0 bg-transparent"
                                                />
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 px-1 py-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.finalIncomeTaxPaid.total}
                                                onChange={(e) => handleFieldChange(item.id, 'finalIncomeTaxPaid', 'total', e.target.value)}
                                                className="w-full text-xs text-right border-0 bg-transparent"
                                            />
                                        </td>
                                    </tr>

                                    {/* FINAL INCOME TAX WHICH IS WITHHELD BY THIRD PARTY row */}
                                    <tr>
                                        <td className="border border-gray-300 px-2 py-1"></td>
                                        <td className="border border-gray-300 px-2 py-1 text-xs text-gray-600">FINAL INCOME TAX WHICH IS WITHHELD BY THIRD PARTY</td>
                                        {months.map(month => (
                                            <td key={month} className="border border-gray-300 px-1 py-1">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.finalIncomeTaxThirdParty[month]}
                                                    onChange={(e) => handleFieldChange(item.id, 'finalIncomeTaxThirdParty', month, e.target.value)}
                                                    className="w-full text-xs text-right border-0 bg-transparent"
                                                />
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 px-1 py-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.finalIncomeTaxThirdParty.total}
                                                onChange={(e) => handleFieldChange(item.id, 'finalIncomeTaxThirdParty', 'total', e.target.value)}
                                                className="w-full text-xs text-right border-0 bg-transparent"
                                            />
                                        </td>
                                    </tr>

                                    {/* DIFFERENCES row */}
                                    <tr>
                                        <td className="border border-gray-300 px-2 py-1"></td>
                                        <td className="border border-gray-300 px-2 py-1 text-xs text-gray-600">DIFFERENCES</td>
                                        {months.map(month => (
                                            <td key={month} className="border border-gray-300 px-1 py-1">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.differences[month]}
                                                    onChange={(e) => handleFieldChange(item.id, 'differences', month, e.target.value)}
                                                    className="w-full text-xs text-right border-0 bg-transparent"
                                                />
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 px-1 py-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.differences.total}
                                                onChange={(e) => handleFieldChange(item.id, 'differences', 'total', e.target.value)}
                                                className="w-full text-xs text-right border-0 bg-transparent"
                                            />
                                        </td>
                                    </tr>

                                    {/* EMERGENCY OF PREVIOUS TAX RETURN row */}
                                    <tr>
                                        <td className="border border-gray-300 px-2 py-1"></td>
                                        <td className="border border-gray-300 px-2 py-1 text-xs text-gray-600">EMERGENCY OF PREVIOUS TAX RETURN</td>
                                        <td colSpan="12" className="border border-gray-300 px-1 py-1"></td>
                                        <td className="border border-gray-300 px-1 py-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.emergencyTaxReturn.total}
                                                onChange={(e) => handleFieldChange(item.id, 'emergencyTaxReturn', 'total', e.target.value)}
                                                className="w-full text-xs text-right border-0 bg-transparent"
                                            />
                                        </td>
                                    </tr>

                                    {/* DIFFERENCES DUE TO AMENDMENT row */}
                                    <tr>
                                        <td className="border border-gray-300 px-2 py-1"></td>
                                        <td className="border border-gray-300 px-2 py-1 text-xs text-gray-600">DIFFERENCES DUE TO AMENDMENT</td>
                                        <td colSpan="12" className="border border-gray-300 px-1 py-1"></td>
                                        <td className="border border-gray-300 px-1 py-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.amendmentDifferences.total}
                                                onChange={(e) => handleFieldChange(item.id, 'amendmentDifferences', 'total', e.target.value)}
                                                className="w-full text-xs text-right border-0 bg-transparent"
                                            />
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Showing 1 to 1 of 1 entries</span>
                        <div className="flex gap-1">
                            <button className="p-1 border border-gray-300 rounded text-gray-400">«</button>
                            <button className="p-1 border border-gray-300 rounded text-gray-400">‹</button>
                            <button className="p-1 border border-gray-300 rounded text-blue-600 bg-blue-50">1</button>
                            <button className="p-1 border border-gray-300 rounded text-gray-400">›</button>
                            <button className="p-1 border border-gray-300 rounded text-gray-400">»</button>
                        </div>
                        <select className="text-xs border border-gray-300 rounded px-1">
                            <option>10</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    return <MainView />;
};

export default L3BForm;