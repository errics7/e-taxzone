import React, { useState, useCallback } from 'react';
import { Check, Edit, KeyboardArrowRight, Close, KeyboardArrowDown, Add, CalendarToday } from '@mui/icons-material';

export const L3DForm = ({ data = {}, onDataChange, taxpayerData }) => {
    // Initialize data with proper structure
    const initializeData = () => ({
        header: {
            periodYear: '2023',
            tinNik: '1',
            ...data.header
        },
        entertainment_costs: data.entertainment_costs || [],
        promotion_costs: data.promotion_costs || [],
        bad_debts: data.bad_debts || []
    });

    const [formData, setFormData] = useState(initializeData());
    const [expandedSections, setExpandedSections] = useState({
        header: true,
        entertainment_costs: true,
        promotion_costs: false,
        bad_debts: false
    });

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

    // AccordionSection component
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

    // EntertainmentCostsSection component
    const EntertainmentCostsSection = () => {
        const entertainmentData = formData.entertainment_costs;
        const [editingItem, setEditingItem] = useState(null);
        const [editValues, setEditValues] = useState({});
        const [showAddForm, setShowAddForm] = useState(false);
        const [newFormData, setNewFormData] = useState({
            entertainmentDate: '',
            entertainmentLocation: '',
            address: '',
            entertainmentType: '',
            entertainmentAmount: '',
            relatedPartyName: '',
            position: '',
            companyName: '',
            businessType: '',
            notes: ''
        });

        const handleAdd = useCallback(() => {
            setShowAddForm(true);
            setNewFormData({
                entertainmentDate: '',
                entertainmentLocation: '',
                address: '',
                entertainmentType: '',
                entertainmentAmount: '',
                relatedPartyName: '',
                position: '',
                companyName: '',
                businessType: '',
                notes: ''
            });
        }, []);

        const handleEdit = useCallback((item) => {
            setEditingItem(item.id);
            setEditValues({ ...item });
        }, []);

        const handleSave = useCallback(() => {
            const updatedData = entertainmentData.map(item =>
                item.id === editingItem
                    ? { ...item, ...editValues }
                    : item
            );
            updateFormData('entertainment_costs', updatedData);
            setEditingItem(null);
            setEditValues({});
        }, [editingItem, editValues, entertainmentData, updateFormData]);

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
            setNewFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }, []);

        const handleSaveForm = useCallback(() => {
            if (!newFormData.entertainmentDate || !newFormData.entertainmentAmount) return;
            
            const newItem = {
                id: Date.now(),
                ...newFormData
            };
            updateFormData('entertainment_costs', [...entertainmentData, newItem]);
            setNewFormData({
                entertainmentDate: '',
                entertainmentLocation: '',
                address: '',
                entertainmentType: '',
                entertainmentAmount: '',
                relatedPartyName: '',
                position: '',
                companyName: '',
                businessType: '',
                notes: ''
            });
            setShowAddForm(false);
        }, [newFormData, entertainmentData, updateFormData]);

        const handleCloseForm = useCallback(() => {
            setNewFormData({
                entertainmentDate: '',
                entertainmentLocation: '',
                address: '',
                entertainmentType: '',
                entertainmentAmount: '',
                relatedPartyName: '',
                position: '',
                companyName: '',
                businessType: '',
                notes: ''
            });
            setShowAddForm(false);
        }, []);

        // Form view
        if (showAddForm) {
            return (
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Nominative List Of Entertainment Costs</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Entertainment Submission Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={newFormData.entertainmentDate}
                                    onChange={(e) => handleFormInputChange('entertainmentDate', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Entertainment Submission Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newFormData.entertainmentLocation}
                                onChange={(e) => handleFormInputChange('entertainmentLocation', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newFormData.address}
                                onChange={(e) => handleFormInputChange('address', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Entertainment Submission Type <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newFormData.entertainmentType}
                                onChange={(e) => handleFormInputChange('entertainmentType', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Entertainment Cost Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium rounded-l-md">
                                    Rp.
                                </span>
                                <input
                                    type="text"
                                    value={newFormData.entertainmentAmount}
                                    onChange={(e) => handleFormInputChange('entertainmentAmount', e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name Of Related Party <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newFormData.relatedPartyName}
                                onChange={(e) => handleFormInputChange('relatedPartyName', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Position <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newFormData.position}
                                onChange={(e) => handleFormInputChange('position', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newFormData.companyName}
                                onChange={(e) => handleFormInputChange('companyName', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Type <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newFormData.businessType}
                                onChange={(e) => handleFormInputChange('businessType', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Input Notes"
                                value={newFormData.notes}
                                onChange={(e) => handleFormInputChange('notes', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md h-32 resize-none"
                            />
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
                                disabled={!newFormData.entertainmentDate || !newFormData.entertainmentAmount}
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
            return entertainmentData.map((item, index) => {
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
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.entertainmentDate}
                                    onChange={(e) => handleInputChange('entertainmentDate', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.entertainmentDate
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.entertainmentLocation}
                                    onChange={(e) => handleInputChange('entertainmentLocation', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.entertainmentLocation
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.address
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.entertainmentType}
                                    onChange={(e) => handleInputChange('entertainmentType', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.entertainmentType
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.entertainmentAmount}
                                    onChange={(e) => handleInputChange('entertainmentAmount', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                parseFloat(item.entertainmentAmount || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.relatedPartyName}
                                    onChange={(e) => handleInputChange('relatedPartyName', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.relatedPartyName
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.position}
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.position
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.companyName}
                                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.companyName
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.businessType}
                                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.businessType
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.notes
                            )}
                        </td>
                    </tr>
                );
            });
        };

        return (
            <div className="p-4">
                <div className="mb-4 flex gap-2">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center gap-2 text-sm font-medium"
                    >
                        <Add className="h-4 w-4" />
                        Add
                    </button>
                    <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center gap-2 text-sm font-medium">
                        XML Upload
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-yellow-400">
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ACTION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">NO</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ENTERTAINMENT - DATE</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ENTERTAINMENT - LOCATION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ENTERTAINMENT - ADDRESS</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ENTERTAINMENT - TYPE</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ENTERTAINMENT - AMOUNT</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">RELATED PARTY - NAME</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">RELATED PARTY - POSITION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">RELATED PARTY - COMPANY N</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">RELATED PARTY - BUSINESS TY</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">NOTES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entertainmentData.length === 0 ? (
                                <tr>
                                    <td colSpan={12} className="border border-gray-300 px-3 py-8 text-center text-gray-500 text-sm">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                renderTableRows()
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Showing {entertainmentData.length} to {entertainmentData.length} of {entertainmentData.length} entries</span>
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
    };

    // PromotionCostsSection component
    const PromotionCostsSection = () => {
        const promotionData = formData.promotion_costs;
        const [editingItem, setEditingItem] = useState(null);
        const [editValues, setEditValues] = useState({});
        const [showAddForm, setShowAddForm] = useState(false);
        const [newFormData, setNewFormData] = useState({
            tinNumber: '',
            name: '',
            address: '',
            date: '',
            typeOfCost: '',
            amount: '',
            notes: '',
            incomeTaxWithholdingAmount: '',
            withholdingSlipNumber: ''
        });

        const costTypeOptions = [
            'Biaya periklanan di media elektronik, media cetak, dan/atau media lainnya',
            'Penggantian atau imbalan yang diberikan dalam bentuk natura atau kenikmatan',
            'Biaya pameran produk',
            'Biaya pengenalan produk baru',
            'Biaya sponsorship yang berkaitan dengan promosi produk'
        ];

        const handleAdd = useCallback(() => {
            setShowAddForm(true);
            setNewFormData({
                tinNumber: '',
                name: '',
                address: '',
                date: '',
                typeOfCost: '',
                amount: '',
                notes: '',
                incomeTaxWithholdingAmount: '',
                withholdingSlipNumber: ''
            });
        }, []);

        const handleEdit = useCallback((item) => {
            setEditingItem(item.id);
            setEditValues({ ...item });
        }, []);

        const handleSave = useCallback(() => {
            const updatedData = promotionData.map(item =>
                item.id === editingItem
                    ? { ...item, ...editValues }
                    : item
            );
            updateFormData('promotion_costs', updatedData);
            setEditingItem(null);
            setEditValues({});
        }, [editingItem, editValues, promotionData, updateFormData]);

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
            setNewFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }, []);

        const handleSaveForm = useCallback(() => {
            if (!newFormData.tinNumber || !newFormData.name || !newFormData.date) return;
            
            const newItem = {
                id: Date.now(),
                ...newFormData
            };
            updateFormData('promotion_costs', [...promotionData, newItem]);
            setNewFormData({
                tinNumber: '',
                name: '',
                address: '',
                date: '',
                typeOfCost: '',
                amount: '',
                notes: '',
                incomeTaxWithholdingAmount: '',
                withholdingSlipNumber: ''
            });
            setShowAddForm(false);
        }, [newFormData, promotionData, updateFormData]);

        const handleCloseForm = useCallback(() => {
            setNewFormData({
                tinNumber: '',
                name: '',
                address: '',
                date: '',
                typeOfCost: '',
                amount: '',
                notes: '',
                incomeTaxWithholdingAmount: '',
                withholdingSlipNumber: ''
            });
            setShowAddForm(false);
        }, []);

        // Form view
        if (showAddForm) {
            return (
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Nominative List Of Promotions Costs</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                TIN Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Input TIN"
                                value={newFormData.tinNumber}
                                onChange={(e) => handleFormInputChange('tinNumber', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Input Name"
                                value={newFormData.name}
                                onChange={(e) => handleFormInputChange('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Input Address"
                                value={newFormData.address}
                                onChange={(e) => handleFormInputChange('address', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md h-24 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={newFormData.date}
                                onChange={(e) => handleFormInputChange('date', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type Of Cost <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={newFormData.typeOfCost}
                                    onChange={(e) => handleFormInputChange('typeOfCost', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md appearance-none bg-white pr-10"
                                >
                                    <option value="">Please Select</option>
                                    {costTypeOptions.map((option, index) => (
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
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium rounded-l-md">
                                    Rp.
                                </span>
                                <input
                                    type="text"
                                    value={newFormData.amount}
                                    onChange={(e) => handleFormInputChange('amount', e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Input Notes"
                                value={newFormData.notes}
                                onChange={(e) => handleFormInputChange('notes', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md h-32 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Income Tax With Holding Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium rounded-l-md">
                                    Rp.
                                </span>
                                <input
                                    type="text"
                                    value={newFormData.incomeTaxWithholdingAmount}
                                    onChange={(e) => handleFormInputChange('incomeTaxWithholdingAmount', e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Withholding Slip Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Input Withholding Number"
                                value={newFormData.withholdingSlipNumber}
                                onChange={(e) => handleFormInputChange('withholdingSlipNumber', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
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
                                disabled={!newFormData.tinNumber || !newFormData.name || !newFormData.date}
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
            return promotionData.map((item, index) => {
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
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.tinNumber}
                                    onChange={(e) => handleInputChange('tinNumber', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.tinNumber
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.name
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.address
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editValues.date}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.date
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <select
                                    value={editValues.typeOfCost}
                                    onChange={(e) => handleInputChange('typeOfCost', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                >
                                    <option value="">Please Select</option>
                                    {costTypeOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                item.typeOfCost
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.amount}
                                    onChange={(e) => handleInputChange('amount', e.target.value)}
                                    className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                />
                            ) : (
                                parseFloat(item.amount || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.notes
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.incomeTaxWithholdingAmount}
                                    onChange={(e) => handleInputChange('incomeTaxWithholdingAmount', e.target.value)}
                                    className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                />
                            ) : (
                                parseFloat(item.incomeTaxWithholdingAmount || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.withholdingSlipNumber}
                                    onChange={(e) => handleInputChange('withholdingSlipNumber', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.withholdingSlipNumber
                            )}
                        </td>
                    </tr>
                );
            });
        };

        return (
            <div className="p-4">
                <div className="mb-4 flex gap-2">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center gap-2 text-sm font-medium"
                    >
                        <Add className="h-4 w-4" />
                        Add
                    </button>
                    <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center gap-2 text-sm font-medium">
                        XML Upload
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-yellow-400">
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ACTION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">NO</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">RECIPIENT - TIN</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">RECIPIENT - NAME</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">RECIPIENT - ADDRESS</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">RECIPIENT - DATE</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">RECIPIENT - TYPE OF COST</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">RECIPIENT - AMOUNT</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">RECIPIENT - NOTES</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">WITHHOLDING AMOUNT</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">WITHHOLDING SLIP NUMBER</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotionData.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="border border-gray-300 px-3 py-8 text-center text-gray-500 text-sm">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                renderTableRows()
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Showing {promotionData.length} to {promotionData.length} of {promotionData.length} entries</span>
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
    };

    // BadDebtsSection component
    const BadDebtsSection = () => {
        const badDebtsData = formData.bad_debts;
        const [editingItem, setEditingItem] = useState(null);
        const [editValues, setEditValues] = useState({});
        const [showAddForm, setShowAddForm] = useState(false);
        const [newFormData, setNewFormData] = useState({
            tinNumber: '',
            debtorName: '',
            debtorAddress: '',
            amountOfDebt: '',
            badDebt: '',
            deductionMethod: '',
            typeOfFulfillmentProving: ''
        });

        const deductionMethodOptions = [
            'Beban Langsung',
            'Beban Cadangan'
        ];

        const typeOfFulfillmentOptions = [
            'Penyerahan Berkala',
            'Perjanjian Tertulis',
            'Publikasi Penerbitan',
            'Pengakuan Debitur'
        ];

        const handleAdd = useCallback(() => {
            setShowAddForm(true);
            setNewFormData({
                tinNumber: '',
                debtorName: '',
                debtorAddress: '',
                amountOfDebt: '',
                badDebt: '',
                deductionMethod: '',
                typeOfFulfillmentProving: ''
            });
        }, []);

        const handleEdit = useCallback((item) => {
            setEditingItem(item.id);
            setEditValues({ ...item });
        }, []);

        const handleSave = useCallback(() => {
            const updatedData = badDebtsData.map(item =>
                item.id === editingItem
                    ? { ...item, ...editValues }
                    : item
            );
            updateFormData('bad_debts', updatedData);
            setEditingItem(null);
            setEditValues({});
        }, [editingItem, editValues, badDebtsData, updateFormData]);

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
            setNewFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }, []);

        const handleSaveForm = useCallback(() => {
            if (!newFormData.tinNumber || !newFormData.debtorName || !newFormData.amountOfDebt) return;
            
            const newItem = {
                id: Date.now(),
                ...newFormData
            };
            updateFormData('bad_debts', [...badDebtsData, newItem]);
            setNewFormData({
                tinNumber: '',
                debtorName: '',
                debtorAddress: '',
                amountOfDebt: '',
                badDebt: '',
                deductionMethod: '',
                typeOfFulfillmentProving: ''
            });
            setShowAddForm(false);
        }, [newFormData, badDebtsData, updateFormData]);

        const handleCloseForm = useCallback(() => {
            setNewFormData({
                tinNumber: '',
                debtorName: '',
                debtorAddress: '',
                amountOfDebt: '',
                badDebt: '',
                deductionMethod: '',
                typeOfFulfillmentProving: ''
            });
            setShowAddForm(false);
        }, []);

        // Form view
        if (showAddForm) {
            return (
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">List of Bad Debts</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                TIN Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Input TIN"
                                value={newFormData.tinNumber}
                                onChange={(e) => handleFormInputChange('tinNumber', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Debtors Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Input Name"
                                value={newFormData.debtorName}
                                onChange={(e) => handleFormInputChange('debtorName', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Debtors Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Input Address"
                                value={newFormData.debtorAddress}
                                onChange={(e) => handleFormInputChange('debtorAddress', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount of Debt <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium rounded-l-md">
                                    Rp.
                                </span>
                                <input
                                    type="text"
                                    value={newFormData.amountOfDebt}
                                    onChange={(e) => handleFormInputChange('amountOfDebt', e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bad Debt <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium rounded-l-md">
                                    Rp.
                                </span>
                                <input
                                    type="text"
                                    value={newFormData.badDebt}
                                    onChange={(e) => handleFormInputChange('badDebt', e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deduction Method <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={newFormData.deductionMethod}
                                    onChange={(e) => handleFormInputChange('deductionMethod', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {deductionMethodOptions.map((option, index) => (
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
                                Type Of Fulfillment Proving Document Of Requirements <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={newFormData.typeOfFulfillmentProving}
                                    onChange={(e) => handleFormInputChange('typeOfFulfillmentProving', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {typeOfFulfillmentOptions.map((option, index) => (
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

                        <div className="flex justify-end gap-4 pt-6">
                            <button
                                onClick={handleCloseForm}
                                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium transition-colors"
                            >
                                <Close className="h-4 w-4" />
                                Close
                            </button>
                            <button
                                onClick={handleSaveForm}
                                className="px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center gap-2 font-medium transition-colors"
                                disabled={!newFormData.tinNumber || !newFormData.debtorName || !newFormData.amountOfDebt}
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
            return badDebtsData.map((item, index) => {
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
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.tinNumber}
                                    onChange={(e) => handleInputChange('tinNumber', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.tinNumber
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.debtorName}
                                    onChange={(e) => handleInputChange('debtorName', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.debtorName
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.debtorAddress}
                                    onChange={(e) => handleInputChange('debtorAddress', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                />
                            ) : (
                                item.debtorAddress
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.amountOfDebt}
                                    onChange={(e) => handleInputChange('amountOfDebt', e.target.value)}
                                    className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                />
                            ) : (
                                parseFloat(item.amountOfDebt || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValues.badDebt}
                                    onChange={(e) => handleInputChange('badDebt', e.target.value)}
                                    className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                />
                            ) : (
                                parseFloat(item.badDebt || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <select
                                    value={editValues.deductionMethod}
                                    onChange={(e) => handleInputChange('deductionMethod', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                >
                                    <option value="">Please Select</option>
                                    {deductionMethodOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                item.deductionMethod
                            )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                            {isEditing ? (
                                <select
                                    value={editValues.typeOfFulfillmentProving}
                                    onChange={(e) => handleInputChange('typeOfFulfillmentProving', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                >
                                    <option value="">Please Select</option>
                                    {typeOfFulfillmentOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                item.typeOfFulfillmentProving
                            )}
                        </td>
                    </tr>
                );
            });
        };

        return (
            <div className="p-4">
                <div className="mb-4 flex gap-2">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center gap-2 text-sm font-medium"
                    >
                        <Add className="h-4 w-4" />
                        Add
                    </button>
                    <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center gap-2 text-sm font-medium">
                        XML Upload
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-yellow-400">
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ACTION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">NO</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">TIN</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">DEBTORS NAME</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">DEBTORS ADDRESS</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">AMOUNT OF DEBT</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">BAD DEBT</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">DEDUCTION METHOD</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">TYPE OF FULFILLMENT PROVING DOCUMENT OF REQUIREMENTS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {badDebtsData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="border border-gray-300 px-3 py-8 text-center text-gray-500 text-sm">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                renderTableRows()
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Showing {badDebtsData.length} to {badDebtsData.length} of {badDebtsData.length} entries</span>
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
    };

    // Header update handler
    const handleHeaderChange = useCallback((field, value) => {
        const updatedHeader = {
            ...formData.header,
            [field]: value
        };
        updateFormData('header', updatedHeader);
    }, [formData.header, updateFormData]);

    // Main View component
    const MainView = () => (
        <div className="max-w-7xl mx-auto bg-white flex-col">
            {/* Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">PERSONAL INCOME TAX RETURN</h1>
            </div>

            {/* Header Section */}
            <div className='mb-4'>
                <AccordionSection
                    title="HEADER"
                    sectionKey="header"
                    isExpanded={expandedSections.header}
                    onToggle={() => toggleSection('header')}
                >
                    <div className="p-6 space-y-4">
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
                </AccordionSection>
            </div>

            {/* Entertainment Costs Section */}
            <div className='mb-4'>
                <AccordionSection
                    title="A. NOMINATIVE LIST OF ENTERTAINMENT COSTS"
                    sectionKey="entertainment_costs"
                    isExpanded={expandedSections.entertainment_costs}
                    onToggle={() => toggleSection('entertainment_costs')}
                >
                    <EntertainmentCostsSection />
                </AccordionSection>
            </div>

            {/* Promotion Costs Section */}
            <div className='mb-4'>
                <AccordionSection
                    title="B. NOMINATIVE LIST OF PROMOTION COSTS"
                    sectionKey="promotion_costs"
                    isExpanded={expandedSections.promotion_costs}
                    onToggle={() => toggleSection('promotion_costs')}
                >
                    <PromotionCostsSection />
                </AccordionSection>
            </div>

            {/* Bad Debts Section */}
            <div className='mb-4'>
                <AccordionSection
                    title="C. LIST OF BAD DEBTS"
                    sectionKey="bad_debts"
                    isExpanded={expandedSections.bad_debts}
                    onToggle={() => toggleSection('bad_debts')}
                >
                    <BadDebtsSection />
                </AccordionSection>
            </div>
        </div>
    );

    return <MainView />;
};

export default L3DForm;