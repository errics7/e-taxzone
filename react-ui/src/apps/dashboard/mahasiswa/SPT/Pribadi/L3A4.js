import React, { useState, useCallback } from 'react';
import { Check, Edit, KeyboardArrowRight, Close, KeyboardArrowDown, Add } from '@mui/icons-material';

export const L3A4Form = ({ data = {}, onDataChange, taxpayerData }) => {
    const [expandedSections, setExpandedSections] = useState({
        header: false,
        business_income: true,
        other_domestic_income: true
    });

    // Initialize form data from props or default values
    const [formData, setFormData] = useState({
        header: {
            fiscalYear: '2023',
            version: 'A4',
            ...data.header
        },
        businessIncome: {
            entries: [],
            totalGrossIncome: 0,
            totalNetIncome: 0,
            ...data.businessIncome
        },
        otherDomesticIncome: {
            entries: [],
            totalNetIncome: 0,
            ...data.otherDomesticIncome
        }
    });

    const updateFormData = useCallback((section, updates) => {
        const newFormData = {
            ...formData,
            [section]: {
                ...formData[section],
                ...updates
            }
        };
        setFormData(newFormData);
        
        // Call onDataChange immediately with new data
        if (onDataChange) {
            onDataChange(newFormData);
        }
    }, [formData, onDataChange]);

    const toggleSection = useCallback((sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    }, []);

    const MainView = () => (
        <div className="max-w-7xl mx-auto bg-white flex-col">
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
                                    value={formData.header.fiscalYear}
                                    onChange={(e) => updateFormData('header', { fiscalYear: e.target.value })}
                                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">VERSION</label>
                                <input
                                    type="text"
                                    value={formData.header.version}
                                    onChange={(e) => updateFormData('header', { version: e.target.value })}
                                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>
                </AccordionSection>
            </div>

            {/* Business Income Section */}
            <div className='mb-4'>
                <AccordionSection
                    title="A. NET INCOME FROM BUSINESS AND/OR PROFESSION BASED ON SIMPLE RECORD OF BOOKKEEPING"
                    sectionKey="business_income"
                    isExpanded={expandedSections.business_income}
                    onToggle={() => toggleSection('business_income')}
                >
                    <BusinessIncomeSection />
                </AccordionSection>
            </div>

            {/* Other Domestic Income Section */}
            <div className='mb-4'>
                <AccordionSection
                    title="B. OTHER DOMESTIC INCOME"
                    sectionKey="other_domestic_income"
                    isExpanded={expandedSections.other_domestic_income}
                    onToggle={() => toggleSection('other_domestic_income')}
                >
                    <OtherDomesticIncomeSection />
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

    function BusinessIncomeSection() {
        return (
            <div className="p-4">
                <div className="bg-gray-50 p-4 text-center text-gray-600 text-sm mb-4">
                    <p>Taxpayer proposes simple bookkeeping are obliged to submit details of gross income by filling out the Form Attachment 3B</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-yellow-400">
                                <th className="border border-gray-400 px-3 py-2 text-xs font-semibold">NO</th>
                                <th className="border border-gray-400 px-3 py-2 text-xs font-semibold">NAME OF BUSINESS PLACE</th>
                                <th className="border border-gray-400 px-3 py-2 text-xs font-semibold">BUSINESS/PROFESSION TYPE</th>
                                <th className="border border-gray-400 px-3 py-2 text-xs font-semibold">GROSS INCOME (RUPIAH)</th>
                                <th className="border border-gray-400 px-3 py-2 text-xs font-semibold">NORMS (%)</th>
                                <th className="border border-gray-400 px-3 py-2 text-xs font-semibold">NET INCOME (RUPIAH)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.businessIncome.entries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="border border-gray-300 px-3 py-8 text-center text-gray-500 text-sm">
                                        No data to display
                                    </td>
                                </tr>
                            ) : (
                                formData.businessIncome.entries.map((entry, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-3 py-2 text-center text-xs">{index + 1}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-xs">{entry.businessName}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-center text-xs">{entry.businessType}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-xs text-right">
                                            {parseFloat(entry.grossIncome || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-xs text-center">{entry.norms}%</td>
                                        <td className="border border-gray-300 px-3 py-2 text-xs text-right">
                                            {parseFloat(entry.netIncome || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4 p-4 bg-gray-100">
                    <span className="font-medium text-sm">TOTAL GROSS INCOME (Rp.)</span>
                    <span className="font-medium text-sm">
                        {formData.businessIncome.totalGrossIncome.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="font-medium text-sm">TOTAL NET INCOME (Rp.)</span>
                    <span className="font-medium text-sm">
                        {formData.businessIncome.totalNetIncome.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Showing 0 to 0 of 0 entries</span>
                        <div className="flex gap-1">
                            <button className="p-1 border border-gray-300 rounded text-gray-400">«</button>
                            <button className="p-1 border border-gray-300 rounded text-gray-400">‹</button>
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

    function OtherDomesticIncomeSection() {
        const [editingItem, setEditingItem] = useState(null);
        const [editValues, setEditValues] = useState({});
        const [showAddForm, setShowAddForm] = useState(false);
        const [newItemData, setNewItemData] = useState({
            code: '',
            incomeType: '',
            amount: ''
        });

        const incomeTypeOptions = [
            'Wages and honorariums received by non-permanent employees (Upah dan honorarium diterima oleh Pegawai Tidak Tetap)',
            'Compensation or remuneration in connection with benefit in kind (Kompensasi dan remunerasi sehubungan dengan natura dan kenikmatan)',
            'Other income related to employment (Penghasilan lain terkait pekerjaan)',
            'Rent income other than land and or buildings (Penghasilan sewa selain tanah dan bangunan)',
            'Dividend (Dividen)',
            'Interest (Bunga)',
            'Royalties (Royalti)',
            'Profits from Selling Assets (Keuntungan atas penjualan harta)',
            'Interest Reward (Bunga Bank)',
            'Advantages of Foreign Exchange Rates (Keuntungan atas perbedaan kurs)',
            'Other Income from Capital or Assets (Penghasilan lain dari harta dan modal)',
            'Debt Relief (Penghapusan Utang)',
            'Grant (Hibah)',
            'Aid/Donations (Sumbangan dan donasi)',
            'Inheritance (Warisan)',
            'Insurance Claim (Klaim Asuransi)',
            'Scholarship (Beasiswa)',
            'Awards or rewards (Penghargaan)',
            'Other Domestic Income (Penghasilan dalam negeri lainnya)'
        ];

        const calculateTotalNetIncome = useCallback((entries) => {
            return entries.reduce((total, item) => {
                return total + (parseFloat(item.amount) || 0);
            }, 0);
        }, []);

        const updateOtherDomesticIncomeData = useCallback((newEntries) => {
            const totalNetIncome = calculateTotalNetIncome(newEntries);
            updateFormData('otherDomesticIncome', { 
                entries: newEntries, 
                totalNetIncome: totalNetIncome 
            });
        }, [calculateTotalNetIncome, updateFormData]);

        const handleAdd = useCallback(() => {
            setShowAddForm(true);
            setNewItemData({
                code: '',
                incomeType: '',
                amount: ''
            });
        }, []);

        const handleEdit = useCallback((item) => {
            setEditingItem(item.id);
            setEditValues({
                code: item.code,
                incomeType: item.incomeType,
                amount: item.amount
            });
        }, []);

        const handleSave = useCallback(() => {
            const updatedEntries = formData.otherDomesticIncome.entries.map(item =>
                item.id === editingItem
                    ? { ...item, ...editValues }
                    : item
            );
            updateOtherDomesticIncomeData(updatedEntries);
            setEditingItem(null);
            setEditValues({});
        }, [editingItem, editValues, formData.otherDomesticIncome.entries, updateOtherDomesticIncomeData]);

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

        const handleFormInputChange = useCallback((field, value) => {
            setNewItemData(prev => ({
                ...prev,
                [field]: value
            }));
        }, []);

        const handleSaveForm = useCallback(() => {
            if (!newItemData.incomeType || !newItemData.amount) return;
            
            const newItem = {
                id: Date.now(),
                ...newItemData
            };
            
            const updatedEntries = [...formData.otherDomesticIncome.entries, newItem];
            updateOtherDomesticIncomeData(updatedEntries);
            
            setNewItemData({ code: '', incomeType: '', amount: '' });
            setShowAddForm(false);
        }, [newItemData, formData.otherDomesticIncome.entries, updateOtherDomesticIncomeData]);

        const handleCloseForm = useCallback(() => {
            setNewItemData({ code: '', incomeType: '', amount: '' });
            setShowAddForm(false);
        }, []);

        // Jika showAddForm true, tampilkan form
        if (showAddForm) {
            return (
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">ADD OTHER DOMESTIC INCOME</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
                            <input
                                type="text"
                                value={newItemData.code}
                                onChange={(e) => handleFormInputChange('code', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Income Type <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={newItemData.incomeType}
                                    onChange={(e) => handleFormInputChange('incomeType', e.target.value)}
                                    className="w-full px-4 py-3 border-2 rounded-md appearance-none bg-white pr-10"
                                    style={{ borderColor: newItemData.incomeType ? '#d1d5db' : '#ef4444' }}
                                >
                                    <option value="">Please Select</option>
                                    {incomeTypeOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                    <KeyboardArrowDown className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount of Net Income <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium rounded-l-md">
                                    Rp.
                                </span>
                                <input
                                    type="text"
                                    value={newItemData.amount}
                                    onChange={(e) => handleFormInputChange('amount', e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-md"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6">
                            <button
                                onClick={handleCloseForm}
                                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                            >
                                <Close className="h-4 w-4" />
                                Close
                            </button>
                            <button
                                onClick={handleSaveForm}
                                className="px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center gap-2 font-medium"
                                disabled={!newItemData.incomeType || !newItemData.amount}
                            >
                                <Check className="h-4 w-4" />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        const renderTableRows = () => {
            return formData.otherDomesticIncome.entries.map((item, index) => {
                const isEditing = editingItem === item.id;

                return (
                    <tr key={item.id} className="hover:bg-gray-50">
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
                            {index + 1}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 w-20">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.code}
                                    onChange={(e) => handleInputChange('code', e.target.value)}
                                    className="w-full px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                />
                            ) : (
                                <span className="text-xs text-center block">{item.code}</span>
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                            {isEditing ? (
                                <select
                                    value={editValues.incomeType}
                                    onChange={(e) => handleInputChange('incomeType', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                >
                                    <option value="">Please Select</option>
                                    {incomeTypeOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span className="text-xs block">{item.incomeType}</span>
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 w-24">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.amount}
                                    onChange={(e) => handleInputChange('amount', e.target.value)}
                                    className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                />
                            ) : (
                                <span className="text-xs text-right block">
                                    {parseFloat(item.amount || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                </span>
                            )}
                        </td>
                    </tr>
                );
            });
        };

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
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-yellow-400">
                                <th className="border border-gray-400 px-3 py-2 text-xs font-semibold">ACTION</th>
                                <th className="border border-gray-400 px-3 py-2 text-xs font-semibold">NO</th>
                                <th className="border border-gray-400 px-3 py-2 text-xs font-semibold">CODE</th>
                                <th className="border border-gray-400 px-3 py-2 text-xs font-semibold">INCOME TYPE</th>
                                <th className="border border-gray-400 px-3 py-2 text-xs font-semibold">NET INCOME (RUPIAH)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.otherDomesticIncome.entries.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="border border-gray-300 px-3 py-8 text-center text-gray-500 text-sm">
                                        No data to display
                                    </td>
                                </tr>
                            ) : (
                                renderTableRows()
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4 p-4 bg-gray-100">
                    <span className="font-medium text-sm">TOTAL AMOUNT OF NET INCOME (Rp.)</span>
                    <span className="font-medium text-sm">
                        {formData.otherDomesticIncome.totalNetIncome.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Showing {formData.otherDomesticIncome.entries.length} entries</span>
                        <div className="flex gap-1">
                            <button className="p-1 border border-gray-300 rounded text-gray-400">«</button>
                            <button className="p-1 border border-gray-300 rounded text-gray-400">‹</button>
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

export default L3A4Form;