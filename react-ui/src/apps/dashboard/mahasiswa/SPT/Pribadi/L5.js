import React, { useState, useCallback, useMemo } from 'react';
import { Check, Edit, KeyboardArrowRight, Close, Add } from '@mui/icons-material';

export const L5Form = ({ data = {}, onDataChange, taxpayerData }) => {
    // Initialize data with proper structure
    const initializeData = () => ({
        fiscal_loss_compensation: data.fiscal_loss_compensation || [
            { id: 1, no: 1, taxYear: '2013', amountRupiah: 0, year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0, checked: true },
            { id: 2, no: 2, taxYear: '2014', amountRupiah: 0, year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0, checked: true },
            { id: 3, no: 3, taxYear: '2015', amountRupiah: 0, year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0, checked: true },
            { id: 4, no: 4, taxYear: '2016', amountRupiah: 0, year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0, checked: true },
            { id: 5, no: 5, taxYear: '2017', amountRupiah: 0, year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0, checked: true },
            { id: 6, no: 6, taxYear: '2018', amountRupiah: 0, year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0, checked: true },
            { id: 7, no: 7, taxYear: '2019', amountRupiah: 0, year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0, checked: true },
            { id: 8, no: 8, taxYear: '2020', amountRupiah: 0, year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0, checked: true },
            { id: 9, no: 9, taxYear: '2021', amountRupiah: 0, year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0, checked: true },
            { id: 10, no: 10, taxYear: '2022', amountRupiah: 0, year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0, checked: true },
            { id: 11, no: 11, taxYear: '2023', amountRupiah: 0, year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0, checked: true }
        ],
        net_income_deduction: data.net_income_deduction || [],
        income_tax_deduction: data.income_tax_deduction || []
    });

    const [formData, setFormData] = useState(initializeData());
    const [expandedSections, setExpandedSections] = useState({
        fiscal_loss: true,
        net_income: false,
        income_tax: false
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

    const toggleSection = useCallback((sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    }, []);

    const formatAmount = useCallback((amount) => {
        if (amount === 0) return '0.00';
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }, []);

    const AccordionSection = ({ title, children, sectionKey, isExpanded, onToggle }) => (
        <div className="border-2 rounded-lg">
            <button
                onClick={onToggle}
                className="w-full bg-gray-100 hover:bg-gray-200 px-6 py-4 rounded-t-lg border-b border-gray-300 flex items-center justify-between transition-colors"
            >
                <span className="text-lg font-semibold text-gray-700">{title}</span>
                <KeyboardArrowRight
                    className={`h-6 w-6 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
            </button>
            {isExpanded && (
                <div className="bg-white rounded-b-lg">
                    {children}
                </div>
            )}
        </div>
    );

    const FiscalLossSection = () => {
        const fiscalLossData = formData.fiscal_loss_compensation;
        const [editingItem, setEditingItem] = useState(null);
        const [editValues, setEditValues] = useState({});

        const handleEdit = useCallback((item) => {
            setEditingItem(item.id);
            setEditValues({
                amountRupiah: item.amountRupiah.toString(),
                year2018: item.year2018.toString(),
                year2019: item.year2019.toString(),
                year2020: item.year2020.toString(),
                year2021: item.year2021.toString(),
                year2022: item.year2022.toString(),
                currentYear: item.currentYear.toString(),
                followingYear: item.followingYear.toString()
            });
        }, []);

        const handleSave = useCallback(() => {
            const updatedData = fiscalLossData.map(item =>
                item.id === editingItem
                    ? {
                        ...item,
                        amountRupiah: parseFloat(editValues.amountRupiah) || 0,
                        year2018: parseFloat(editValues.year2018) || 0,
                        year2019: parseFloat(editValues.year2019) || 0,
                        year2020: parseFloat(editValues.year2020) || 0,
                        year2021: parseFloat(editValues.year2021) || 0,
                        year2022: parseFloat(editValues.year2022) || 0,
                        currentYear: parseFloat(editValues.currentYear) || 0,
                        followingYear: parseFloat(editValues.followingYear) || 0
                    }
                    : item
            );
            updateFormData('fiscal_loss_compensation', updatedData);
            setEditingItem(null);
            setEditValues({});
        }, [editingItem, editValues, fiscalLossData, updateFormData]);

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
            const updatedData = fiscalLossData.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            );
            updateFormData('fiscal_loss_compensation', updatedData);
        }, [fiscalLossData, updateFormData]);

        // Calculate totals
        const totals = useMemo(() => {
            return fiscalLossData.reduce((acc, item) => ({
                year2018: acc.year2018 + (item.year2018 || 0),
                year2019: acc.year2019 + (item.year2019 || 0),
                year2020: acc.year2020 + (item.year2020 || 0),
                year2021: acc.year2021 + (item.year2021 || 0),
                year2022: acc.year2022 + (item.year2022 || 0),
                currentYear: acc.currentYear + (item.currentYear || 0),
                followingYear: acc.followingYear + (item.followingYear || 0)
            }), {
                year2018: 0, year2019: 0, year2020: 0, year2021: 0, year2022: 0, currentYear: 0, followingYear: 0
            });
        }, [fiscalLossData]);

        return (
            <div className="p-4">
                <div className="bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-8">ACTION</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-8">NO</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-16">TAX YEAR</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-24">AMOUNT (RUPIAH)</th>
                                    <th colSpan={8} className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800">FISCAL LOSS COMPENSATION</th>
                                </tr>
                                <tr className="bg-yellow-400">
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800"></th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800"></th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800"></th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800"></th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">YEAR 2018</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">YEAR 2019</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">YEAR 2020</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">YEAR 2021</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">YEAR 2022</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">YEAR 2023</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">CURRENT TAX YEAR</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">FOLLOWING TAX YEAR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fiscalLossData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
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
                                            {item.no}
                                        </td>
                                        <td className="border border-gray-400 px-2 py-1 text-center text-xs">
                                            {item.taxYear}
                                        </td>
                                        <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                            {editingItem === item.id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.amountRupiah}
                                                    onChange={(e) => handleInputChange('amountRupiah', e.target.value)}
                                                    className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                />
                                            ) : (
                                                formatAmount(item.amountRupiah)
                                            )}
                                        </td>
                                        <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                            {editingItem === item.id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.year2018}
                                                    onChange={(e) => handleInputChange('year2018', e.target.value)}
                                                    className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                />
                                            ) : (
                                                formatAmount(item.year2018)
                                            )}
                                        </td>
                                        <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                            {editingItem === item.id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.year2019}
                                                    onChange={(e) => handleInputChange('year2019', e.target.value)}
                                                    className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                />
                                            ) : (
                                                formatAmount(item.year2019)
                                            )}
                                        </td>
                                        <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                            {editingItem === item.id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.year2020}
                                                    onChange={(e) => handleInputChange('year2020', e.target.value)}
                                                    className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                />
                                            ) : (
                                                formatAmount(item.year2020)
                                            )}
                                        </td>
                                        <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                            {editingItem === item.id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.year2021}
                                                    onChange={(e) => handleInputChange('year2021', e.target.value)}
                                                    className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                />
                                            ) : (
                                                formatAmount(item.year2021)
                                            )}
                                        </td>
                                        <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                            {editingItem === item.id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.year2022}
                                                    onChange={(e) => handleInputChange('year2022', e.target.value)}
                                                    className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                />
                                            ) : (
                                                formatAmount(item.year2022)
                                            )}
                                        </td>
                                        <td className="border border-gray-400 px-2 py-1 text-right text-xs">0.00</td>
                                        <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                            {editingItem === item.id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.currentYear}
                                                    onChange={(e) => handleInputChange('currentYear', e.target.value)}
                                                    className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                />
                                            ) : (
                                                formatAmount(item.currentYear)
                                            )}
                                        </td>
                                        <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                            {editingItem === item.id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.followingYear}
                                                    onChange={(e) => handleInputChange('followingYear', e.target.value)}
                                                    className="w-full px-1 py-0 border border-gray-300 rounded text-xs text-right"
                                                />
                                            ) : (
                                                formatAmount(item.followingYear)
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-100">
                                    <td colSpan={4} className="border border-gray-400 px-3 py-1 font-medium text-xs">
                                        TOTAL OF PART A
                                    </td>
                                    <td className="border border-gray-400 px-2 py-1 text-right text-xs font-medium">{formatAmount(totals.year2018)}</td>
                                    <td className="border border-gray-400 px-2 py-1 text-right text-xs font-medium">{formatAmount(totals.year2019)}</td>
                                    <td className="border border-gray-400 px-2 py-1 text-right text-xs font-medium">{formatAmount(totals.year2020)}</td>
                                    <td className="border border-gray-400 px-2 py-1 text-right text-xs font-medium">{formatAmount(totals.year2021)}</td>
                                    <td className="border border-gray-400 px-2 py-1 text-right text-xs font-medium">{formatAmount(totals.year2022)}</td>
                                    <td className="border border-gray-400 px-2 py-1 text-right text-xs font-medium">0.00</td>
                                    <td className="border border-gray-400 px-2 py-1 text-right text-xs font-medium">{formatAmount(totals.currentYear)}</td>
                                    <td className="border border-gray-400 px-2 py-1 text-right text-xs font-medium">{formatAmount(totals.followingYear)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const NetIncomeDeductionSection = () => {
        const netIncomeItems = formData.net_income_deduction;
        const [showAddForm, setShowAddForm] = useState(false);
        const [newItem, setNewItem] = useState({
            code: '',
            typeOfDeduction: '',
            amountOfDeduction: ''
        });

        const addNewItem = useCallback(() => {
            if (newItem.code && newItem.typeOfDeduction && newItem.amountOfDeduction) {
                const updatedData = [...netIncomeItems, {
                    id: Date.now(),
                    ...newItem,
                    amountOfDeduction: parseFloat(newItem.amountOfDeduction) || 0
                }];
                updateFormData('net_income_deduction', updatedData);
                setNewItem({ code: '', typeOfDeduction: '', amountOfDeduction: '' });
                setShowAddForm(false);
            }
        }, [newItem, netIncomeItems, updateFormData]);

        const removeItem = useCallback((id) => {
            const updatedData = netIncomeItems.filter(item => item.id !== id);
            updateFormData('net_income_deduction', updatedData);
        }, [netIncomeItems, updateFormData]);

        const calculateTotal = useMemo(() => {
            return netIncomeItems.reduce((total, item) => total + (item.amountOfDeduction || 0), 0);
        }, [netIncomeItems]);

        return (
            <div className="p-4">
                <div className="bg-white">
                    <div className="mb-4">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700"
                        >
                            <Add className="h-4 w-4" />
                            Add
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="mb-4 bg-gray-50 p-4 rounded-lg border">
                            <div className="grid grid-cols-1 gap-3 text-xs">
                                <div className="flex items-center gap-2">
                                    <label className="w-32">Code *</label>
                                    <input
                                        type="text"
                                        value={newItem.code}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, code: e.target.value }))}
                                        className="flex-1 border border-gray-300 px-2 py-1 text-xs rounded"
                                        placeholder="Enter code"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="w-32">Type Of Income Tax Deduction *</label>
                                    <select
                                        value={newItem.typeOfDeduction}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, typeOfDeduction: e.target.value }))}
                                        className="flex-1 border border-gray-300 px-2 py-1 text-xs rounded"
                                    >
                                        <option value="">Please Select</option>
                                        <option value="Zakat">Zakat</option>
                                        <option value="Sumbangan keagamaan">Sumbangan keagamaan</option>
                                        <option value="Fasilitas pengurang penghasilan kena pajak (Tax allowance)">Fasilitas pengurang penghasilan kena pajak (Tax allowance)</option>
                                        <option value="Fasilitas keringan pajak lainnya (Tax reliefs)">Fasilitas keringan pajak lainnya (Tax reliefs)</option>
                                        <option value="Pengurang penghasilan neto lainnya">Pengurang penghasilan neto lainnya</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="w-32">Amount Of Deduction *</label>
                                    <input
                                        type="number"
                                        value={newItem.amountOfDeduction}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, amountOfDeduction: e.target.value }))}
                                        className="flex-1 border border-gray-300 px-2 py-1 text-xs rounded"
                                        placeholder="Rp"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="bg-gray-500 text-white px-4 py-1 rounded text-xs hover:bg-gray-600"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={addNewItem}
                                        className="bg-blue-600 text-white px-4 py-1 rounded text-xs hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-8">ACTION</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-16">NO</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">CODE</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800">TYPES OF INCOME TAX DEDUCTION</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-24">AMOUNT OF DEDUCTION (Rupiah)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {netIncomeItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="border border-gray-400 px-3 py-8 text-center text-gray-500 text-sm">
                                            No data to display
                                        </td>
                                    </tr>
                                ) : (
                                    netIncomeItems.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-400 px-2 py-1 text-center">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Close className="h-3 w-3" />
                                                </button>
                                            </td>
                                            <td className="border border-gray-400 px-2 py-1 text-center text-xs">
                                                {index + 1}
                                            </td>
                                            <td className="border border-gray-400 px-2 py-1 text-center text-xs">
                                                {item.code}
                                            </td>
                                            <td className="border border-gray-400 px-3 py-1 text-xs">
                                                {item.typeOfDeduction}
                                            </td>
                                            <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                                {formatAmount(item.amountOfDeduction)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                                <tr className="bg-gray-100">
                                    <td colSpan={4} className="border border-gray-400 px-3 py-1 font-medium text-xs">
                                        TOTAL
                                    </td>
                                    <td className="border border-gray-400 px-2 py-1 text-right text-xs font-medium">
                                        {formatAmount(calculateTotal)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="w-48">FISCAL LOSS COMPENSATION</label>
                                    <input
                                        type="text"
                                        className="flex-1 border border-gray-300 px-2 py-1 text-xs"
                                        placeholder="Rp"
                                        defaultValue="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="w-48">TOTAL OF NET INCOME DEDUCTION</label>
                                    <input
                                        type="text"
                                        className="flex-1 border border-gray-300 px-2 py-1 text-xs"
                                        placeholder="Rp"
                                        value={formatAmount(calculateTotal)}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const IncomeTaxDeductionSection = () => {
        const incomeTaxItems = formData.income_tax_deduction;
        const [showAddForm, setShowAddForm] = useState(false);
        const [newItem, setNewItem] = useState({
            code: '',
            typeOfPPh: '',
            amountOfPPh: ''
        });

        const addNewItem = useCallback(() => {
            if (newItem.code && newItem.typeOfPPh && newItem.amountOfPPh) {
                const updatedData = [...incomeTaxItems, {
                    id: Date.now(),
                    ...newItem,
                    amountOfPPh: parseFloat(newItem.amountOfPPh) || 0
                }];
                updateFormData('income_tax_deduction', updatedData);
                setNewItem({ code: '', typeOfPPh: '', amountOfPPh: '' });
                setShowAddForm(false);
            }
        }, [newItem, incomeTaxItems, updateFormData]);

        const removeItem = useCallback((id) => {
            const updatedData = incomeTaxItems.filter(item => item.id !== id);
            updateFormData('income_tax_deduction', updatedData);
        }, [incomeTaxItems, updateFormData]);

        const calculateTotal = useMemo(() => {
            return incomeTaxItems.reduce((total, item) => total + (item.amountOfPPh || 0), 0);
        }, [incomeTaxItems]);

        return (
            <div className="p-4">
                <div className="bg-white">
                    <div className="mb-4">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700"
                        >
                            <Add className="h-4 w-4" />
                            Add
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="mb-4 bg-gray-50 p-4 rounded-lg border">
                            <div className="grid grid-cols-1 gap-3 text-xs">
                                <div className="flex items-center gap-2">
                                    <label className="w-32">Code *</label>
                                    <input
                                        type="text"
                                        value={newItem.code}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, code: e.target.value }))}
                                        className="flex-1 border border-gray-300 px-2 py-1 text-xs rounded"
                                        placeholder="Enter code"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="w-32">Type Of PPh *</label>
                                    <select
                                        value={newItem.typeOfPPh}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, typeOfPPh: e.target.value }))}
                                        className="flex-1 border border-gray-300 px-2 py-1 text-xs rounded"
                                    >
                                        <option value="">Please Select</option>
                                        <option value="PPh Pasal 22">PPh Pasal 22</option>
                                        <option value="PPh Pasal 23">PPh Pasal 23</option>
                                        <option value="PPh Pasal 25">PPh Pasal 25</option>
                                        <option value="PPh Final">PPh Final</option>
                                        <option value="PPh Lainnya">PPh Lainnya</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="w-32">Amount Of PPh *</label>
                                    <input
                                        type="number"
                                        value={newItem.amountOfPPh}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, amountOfPPh: e.target.value }))}
                                        className="flex-1 border border-gray-300 px-2 py-1 text-xs rounded"
                                        placeholder="Rp"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="bg-gray-500 text-white px-4 py-1 rounded text-xs hover:bg-gray-600"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={addNewItem}
                                        className="bg-blue-600 text-white px-4 py-1 rounded text-xs hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-8">ACTION</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-16">NO</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-20">CODE</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800">TYPES OF PPh</th>
                                    <th className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-800 w-24">AMOUNT OF PPh (Rupiah)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomeTaxItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="border border-gray-400 px-3 py-8 text-center text-gray-500 text-sm">
                                            No data to display
                                        </td>
                                    </tr>
                                ) : (
                                    incomeTaxItems.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-400 px-2 py-1 text-center">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Close className="h-3 w-3" />
                                                </button>
                                            </td>
                                            <td className="border border-gray-400 px-2 py-1 text-center text-xs">
                                                {index + 1}
                                            </td>
                                            <td className="border border-gray-400 px-2 py-1 text-center text-xs">
                                                {item.code}
                                            </td>
                                            <td className="border border-gray-400 px-3 py-1 text-xs">
                                                {item.typeOfPPh}
                                            </td>
                                            <td className="border border-gray-400 px-2 py-1 text-right text-xs">
                                                {formatAmount(item.amountOfPPh)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                                <tr className="bg-gray-100">
                                    <td colSpan={4} className="border border-gray-400 px-3 py-1 font-medium text-xs">
                                        TOTAL
                                    </td>
                                    <td className="border border-gray-400 px-2 py-1 text-right text-xs font-medium">
                                        {formatAmount(calculateTotal)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const MainView = () => (
        <div className="max-w-6xl mx-auto bg-white">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Personal Income Tax Return</h1>
            </div>
            <div className="space-y-4">
                <AccordionSection
                    title="A. CALCULATION OF FISCAL LOSS COMPENSATION"
                    sectionKey="fiscal_loss"
                    isExpanded={expandedSections.fiscal_loss}
                    onToggle={() => toggleSection('fiscal_loss')}
                >
                    <FiscalLossSection />
                </AccordionSection>

                <AccordionSection
                    title="B. NET INCOME DEDUCTION"
                    sectionKey="net_income"
                    isExpanded={expandedSections.net_income}
                    onToggle={() => toggleSection('net_income')}
                >
                    <NetIncomeDeductionSection />
                </AccordionSection>

                <AccordionSection
                    title="C. INCOME TAX DEDUCTION"
                    sectionKey="income_tax"
                    isExpanded={expandedSections.income_tax}
                    onToggle={() => toggleSection('income_tax')}
                >
                    <IncomeTaxDeductionSection />
                </AccordionSection>
            </div>
        </div>
    );

    return <MainView />;
};

export default L5Form;