import React, { useState, useCallback, useMemo } from 'react';
import { Check, Edit, KeyboardArrowRight, Close, KeyboardArrowDown, Add, Delete, CalendarToday, FilterAlt } from '@mui/icons-material';

export const L3CForm = ({ data = {}, onDataChange, taxpayerData }) => {
    // Initialize data with proper structure
    const initializeData = () => ({
        header: {
            fiscalYear: '2023',
            version: 'L3C',
            ...data.header
        },
        tangibleAssets: data.tangibleAssets || [],
        buildings: data.buildings || [],
        intangibleAssets: data.intangibleAssets || []
    });

    const [formData, setFormData] = useState(initializeData());
    const [expandedSections, setExpandedSections] = useState({
        tangible_asset: true,
        building: false,
        intangible_asset: false
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

    // Header handlers
    const handleHeaderChange = useCallback((field, value) => {
        const updatedHeader = {
            ...formData.header,
            [field]: value
        };
        updateFormData('header', updatedHeader);
    }, [formData.header, updateFormData]);

    const toggleSection = useCallback((sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    }, []);

    const AccordionSection = ({ title, children, sectionKey, isExpanded, onToggle }) => (
        <div className="border border-gray-300">
            <button
                onClick={onToggle}
                className="w-full bg-white px-4 py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-50"
            >
                <span className="text-sm font-medium text-gray-900">{title}</span>
                {isExpanded ? (
                    <KeyboardArrowDown className="h-5 w-5 text-gray-600" />
                ) : (
                    <KeyboardArrowRight className="h-5 w-5 text-gray-600" />
                )}
            </button>
            {isExpanded && (
                <div className="bg-white">
                    {children}
                </div>
            )}
        </div>
    );

    const TangibleAssetSection = () => {
        const tangibleAssetData = formData.tangibleAssets;
        const [showAddForm, setShowAddForm] = useState(false);
        const [editingItem, setEditingItem] = useState(null);
        const [editValues, setEditValues] = useState({});
        const [newFormData, setNewFormData] = useState({});

        const assetTypeOptions = [
            'Sepeda', 'Motor', 'Mobil Penumpang', 'Bus', 'Kendaraan Angkutan',
            'Kendaraan Khusus', 'Kereta', 'Pesawat Terbang', 'Kapal Laut', 'Mesin',
            'Cart', 'Kapal Pesiar', 'Peralatan', 'Aset Bergerak Lainnya',
            'Peralatan Olahraga Khusus', 'Peralatan Elektronik', 'Rumah Tangga/Furnitur',
            'Peralatan Lainnya', 'Jet Ski', 'Aset Lainnya'
        ];

        const commercialDepreciationOptions = [
            'Garis Lurus', 'Jumlah Angka Tahun', 'Saldo Menurun',
            'Saldo Menurun Ganda', 'Jumlah Jam Jasa', 'Jumlah Satuan Produksi', 'Metode Lainnya'
        ];

        const fiscalDepreciationOptions = [
            'GL/Straight Line (Garis Lurus)',
            'JSP/ Number of Production Unit (Jumlah Satuan produksi)',
            'SM/ Declining Method (Saldo Menurun)'
        ];

        const handleAdd = useCallback(() => {
            setShowAddForm(true);
            setNewFormData({
                codeOfAsset: '', assetType: '', monthYearAcquisition: '',
                costOfAcquisition: '', fiscalBookAtBeginning: '',
                commercialDepreciation: '', fiscalDepreciation: '',
                fiscalDepreciationThisYear: '', notes: ''
            });
        }, []);

        const handleEdit = useCallback((item) => {
            setEditingItem(item.id);
            setEditValues({ ...item });
        }, []);

        const handleSave = useCallback(() => {
            const updatedData = tangibleAssetData.map(item =>
                item.id === editingItem ? { ...item, ...editValues } : item
            );
            updateFormData('tangibleAssets', updatedData);
            setEditingItem(null);
            setEditValues({});
        }, [editingItem, editValues, tangibleAssetData, updateFormData]);

        const handleCancel = useCallback(() => {
            setEditingItem(null);
            setEditValues({});
        }, []);

        const handleInputChange = useCallback((field, value) => {
            setEditValues(prev => ({ ...prev, [field]: value }));
        }, []);

        const handleFormInputChange = useCallback((field, value) => {
            setNewFormData(prev => ({ ...prev, [field]: value }));
        }, []);

        const handleSaveForm = useCallback(() => {
            if (!newFormData.assetType || !newFormData.costOfAcquisition) return;
            const newItem = { id: Date.now(), ...newFormData };
            updateFormData('tangibleAssets', [...tangibleAssetData, newItem]);
            setNewFormData({
                codeOfAsset: '', assetType: '', monthYearAcquisition: '',
                costOfAcquisition: '', fiscalBookAtBeginning: '',
                commercialDepreciation: '', fiscalDepreciation: '',
                fiscalDepreciationThisYear: '', notes: ''
            });
            setShowAddForm(false);
        }, [newFormData, tangibleAssetData, updateFormData]);

        const handleCloseForm = useCallback(() => {
            setNewFormData({
                codeOfAsset: '', assetType: '', monthYearAcquisition: '',
                costOfAcquisition: '', fiscalBookAtBeginning: '',
                commercialDepreciation: '', fiscalDepreciation: '',
                fiscalDepreciationThisYear: '', notes: ''
            });
            setShowAddForm(false);
        }, []);

        const handleDelete = useCallback((itemId) => {
            const updatedData = tangibleAssetData.filter(item => item.id !== itemId);
            updateFormData('tangibleAssets', updatedData);
        }, [tangibleAssetData, updateFormData]);

        if (showAddForm) {
            return (
                <div className="p-6">
                    <div className="bg-gray-100 p-3 mb-6">
                        <h3 className="text-sm font-medium text-gray-700">GROUP 1</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Code Of Asset</label>
                            <input
                                type="text"
                                value={newFormData.codeOfAsset}
                                onChange={(e) => handleFormInputChange('codeOfAsset', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Asset Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={newFormData.assetType}
                                onChange={(e) => handleFormInputChange('assetType', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            >
                                <option value="">Please Select</option>
                                {assetTypeOptions.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Month / Year Acquisition</label>
                            <input
                                type="text"
                                placeholder="mm yyyy"
                                value={newFormData.monthYearAcquisition}
                                onChange={(e) => handleFormInputChange('monthYearAcquisition', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Cost Of Acquisition <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newFormData.costOfAcquisition}
                                onChange={(e) => handleFormInputChange('costOfAcquisition', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Fiscal Book At The Beginning Of The Year</label>
                            <input
                                type="text"
                                value={newFormData.fiscalBookAtBeginning}
                                onChange={(e) => handleFormInputChange('fiscalBookAtBeginning', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Method Of Depreciation</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Commercial</label>
                                    <select
                                        value={newFormData.commercialDepreciation}
                                        onChange={(e) => handleFormInputChange('commercialDepreciation', e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Please Select</option>
                                        {commercialDepreciationOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Fiscal</label>
                                    <select
                                        value={newFormData.fiscalDepreciation}
                                        onChange={(e) => handleFormInputChange('fiscalDepreciation', e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Please Select</option>
                                        {fiscalDepreciationOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Fiscal Depreciation In This Year</label>
                            <input
                                type="text"
                                value={newFormData.fiscalDepreciationThisYear}
                                onChange={(e) => handleFormInputChange('fiscalDepreciationThisYear', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Notes</label>
                            <textarea
                                value={newFormData.notes}
                                onChange={(e) => handleFormInputChange('notes', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md h-24"
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
                                disabled={!newFormData.assetType || !newFormData.costOfAcquisition}
                            >
                                <Check className="h-4 w-4" />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-4">
                <div className="mb-4">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-900 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                    >
                        <Add className="h-4 w-4" />
                        Add
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-yellow-400">
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ACTION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">CODE OF ASSETS</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">GROUP/TYPE OF ASSET</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">MONTH/YEAR OF ACQUISITION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">COST OF ACQUISITION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">REMAINING FISCAL BOOK VALUE</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">DEPRECIATION METHOD</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">FISCAL DEPRECIATION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">NOTES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tangibleAssetData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="border border-gray-300 px-3 py-8 text-center text-gray-500 text-sm">
                                        No data to display
                                    </td>
                                </tr>
                            ) : (
                                tangibleAssetData.map((item, index) => {
                                    const isEditing = editingItem === item.id;
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-2 py-1 text-center">
                                                <div className="flex gap-1 justify-center">
                                                    {isEditing ? (
                                                        <>
                                                            <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                                                                <Check className="h-3 w-3" />
                                                            </button>
                                                            <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
                                                                <Close className="h-3 w-3" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => handleEdit(item)} className="bg-blue-900 text-white px-1 py-1 rounded text-xs">
                                                                <Edit className="h-3 w-3" />
                                                            </button>
                                                            <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-1 py-1 rounded text-xs">
                                                                <Delete className="h-3 w-3" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.codeOfAsset || ''}
                                                        onChange={(e) => handleInputChange('codeOfAsset', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">{item.codeOfAsset}</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <select
                                                        value={editValues.assetType || ''}
                                                        onChange={(e) => handleInputChange('assetType', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                    >
                                                        <option value="">Please Select</option>
                                                        {assetTypeOptions.map((option, index) => (
                                                            <option key={index} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="text-xs">{item.assetType}</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-center">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.monthYearAcquisition || ''}
                                                        onChange={(e) => handleInputChange('monthYearAcquisition', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">{item.monthYearAcquisition}</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.costOfAcquisition || ''}
                                                        onChange={(e) => handleInputChange('costOfAcquisition', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">
                                                        {parseFloat(item.costOfAcquisition || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.fiscalBookAtBeginning || ''}
                                                        onChange={(e) => handleInputChange('fiscalBookAtBeginning', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">
                                                        {parseFloat(item.fiscalBookAtBeginning || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <div className="grid grid-cols-1 gap-1">
                                                        <select
                                                            value={editValues.commercialDepreciation || ''}
                                                            onChange={(e) => handleInputChange('commercialDepreciation', e.target.value)}
                                                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                        >
                                                            <option value="">Select Commercial</option>
                                                            {commercialDepreciationOptions.map((option, index) => (
                                                                <option key={index} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={editValues.fiscalDepreciation || ''}
                                                            onChange={(e) => handleInputChange('fiscalDepreciation', e.target.value)}
                                                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                        >
                                                            <option value="">Select Fiscal</option>
                                                            {fiscalDepreciationOptions.map((option, index) => (
                                                                <option key={index} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs">
                                                        <div><strong>Commercial:</strong> {item.commercialDepreciation}</div>
                                                        <div><strong>Fiscal:</strong> {item.fiscalDepreciation}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.fiscalDepreciationThisYear || ''}
                                                        onChange={(e) => handleInputChange('fiscalDepreciationThisYear', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">
                                                        {parseFloat(item.fiscalDepreciationThisYear || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.notes || ''}
                                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">{item.notes}</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const BuildingSection = () => {
        const buildingData = formData.buildings;
        const [showAddForm, setShowAddForm] = useState(false);
        const [editingItem, setEditingItem] = useState(null);
        const [editValues, setEditValues] = useState({});
        const [newFormData, setNewFormData] = useState({});
        const [buildingCategory, setBuildingCategory] = useState('permanent');

        const buildingTypeOptions = [
            'Bangunan untuk tempat tinggal',
            'Bangunan untuk usaha (toko, pabrik, kantor, gudang, dan sejenisnya)',
            'Bangunan yang disewakan',
            'Apartemen',
            'Aset tidak Bergerak Lainnya'
        ];

        const commercialDepreciationOptions = [
            'Garis Lurus', 'Jumlah Angka Tahun', 'Saldo Menurun',
            'Saldo Menurun Ganda', 'Jumlah Jam Jasa', 'Jumlah Satuan Produksi', 'Metode Lainnya'
        ];

        const fiscalDepreciationOptions = [
            'GL/Straight Line (Garis Lurus)',
            'JSP/ Number of Production Unit (Jumlah Satuan produksi)',
            'SM/ Declining Method (Saldo Menurun)'
        ];

        const handleAdd = useCallback(() => {
            setShowAddForm(true);
            setBuildingCategory('permanent');
            setNewFormData({
                category: 'permanent', codeOfAsset: '', assetType: '', monthYearAcquisition: '',
                costOfAcquisition: '', fiscalBookAtBeginning: '', commercialDepreciation: '',
                fiscalDepreciation: '', fiscalDepreciationThisYear: '', notes: ''
            });
        }, []);

        const handleEdit = useCallback((item) => {
            setEditingItem(item.id);
            setEditValues({ ...item });
        }, []);

        const handleSave = useCallback(() => {
            const updatedData = buildingData.map(item =>
                item.id === editingItem ? { ...item, ...editValues } : item
            );
            updateFormData('buildings', updatedData);
            setEditingItem(null);
            setEditValues({});
        }, [editingItem, editValues, buildingData, updateFormData]);

        const handleCancel = useCallback(() => {
            setEditingItem(null);
            setEditValues({});
        }, []);

        const handleInputChange = useCallback((field, value) => {
            setEditValues(prev => ({ ...prev, [field]: value }));
        }, []);

        const handleFormInputChange = useCallback((field, value) => {
            setNewFormData(prev => ({ ...prev, [field]: value }));
        }, []);

        const handleSaveForm = useCallback(() => {
            if (!newFormData.assetType || !newFormData.costOfAcquisition) return;
            const newItem = { id: Date.now(), ...newFormData };
            updateFormData('buildings', [...buildingData, newItem]);
            setNewFormData({
                category: 'permanent', codeOfAsset: '', assetType: '', monthYearAcquisition: '',
                costOfAcquisition: '', fiscalBookAtBeginning: '', commercialDepreciation: '',
                fiscalDepreciation: '', fiscalDepreciationThisYear: '', notes: ''
            });
            setBuildingCategory('permanent');
            setShowAddForm(false);
        }, [newFormData, buildingData, updateFormData]);

        const handleCloseForm = useCallback(() => {
            setNewFormData({
                category: 'permanent', codeOfAsset: '', assetType: '', monthYearAcquisition: '',
                costOfAcquisition: '', fiscalBookAtBeginning: '', commercialDepreciation: '',
                fiscalDepreciation: '', fiscalDepreciationThisYear: '', notes: ''
            });
            setBuildingCategory('permanent');
            setShowAddForm(false);
        }, []);

        const handleDelete = useCallback((itemId) => {
            const updatedData = buildingData.filter(item => item.id !== itemId);
            updateFormData('buildings', updatedData);
        }, [buildingData, updateFormData]);

        if (showAddForm) {
            return (
                <div className="p-6">
                    <div className="mb-6 text-sm text-gray-700">
                        <p>Untuk Building (Bangunan), disediakan kategori Bangunan <strong>Permanent</strong> dan <strong>Non Permanent</strong>.</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm text-gray-700 mb-3">Select Building Category</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setBuildingCategory('permanent');
                                    handleFormInputChange('category', 'permanent');
                                }}
                                className={`px-4 py-2 rounded-md border text-sm font-medium ${buildingCategory === 'permanent'
                                    ? 'bg-blue-900 text-white border-blue-900'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                PERMANENT
                            </button>
                            <button
                                onClick={() => {
                                    setBuildingCategory('non_permanent');
                                    handleFormInputChange('category', 'non_permanent');
                                }}
                                className={`px-4 py-2 rounded-md border text-sm font-medium ${buildingCategory === 'non_permanent'
                                    ? 'bg-blue-900 text-white border-blue-900'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                NON PERMANENT
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-3 mb-6">
                        <h3 className="text-sm font-medium text-gray-700">
                            {buildingCategory === 'permanent' ? 'PERMANENT' : 'NON PERMANENT'}
                        </h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Code Of Asset</label>
                            <input
                                type="text"
                                value={newFormData.codeOfAsset}
                                onChange={(e) => handleFormInputChange('codeOfAsset', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Asset Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={newFormData.assetType}
                                onChange={(e) => handleFormInputChange('assetType', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            >
                                <option value="">Please Select</option>
                                {buildingTypeOptions.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Month / Year Acquisition</label>
                            <input
                                type="text"
                                placeholder="mm yyyy"
                                value={newFormData.monthYearAcquisition}
                                onChange={(e) => handleFormInputChange('monthYearAcquisition', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Cost Of Acquisition <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newFormData.costOfAcquisition}
                                onChange={(e) => handleFormInputChange('costOfAcquisition', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Fiscal Book At The Beginning Of The Year</label>
                            <input
                                type="text"
                                value={newFormData.fiscalBookAtBeginning}
                                onChange={(e) => handleFormInputChange('fiscalBookAtBeginning', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Method Of Depreciation</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Commercial</label>
                                    <select
                                        value={newFormData.commercialDepreciation}
                                        onChange={(e) => handleFormInputChange('commercialDepreciation', e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Please Select</option>
                                        {commercialDepreciationOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Fiscal</label>
                                    <select
                                        value={newFormData.fiscalDepreciation}
                                        onChange={(e) => handleFormInputChange('fiscalDepreciation', e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Please Select</option>
                                        {fiscalDepreciationOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Fiscal Depreciation In This Year</label>
                            <input
                                type="text"
                                value={newFormData.fiscalDepreciationThisYear}
                                onChange={(e) => handleFormInputChange('fiscalDepreciationThisYear', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Notes</label>
                            <textarea
                                value={newFormData.notes}
                                onChange={(e) => handleFormInputChange('notes', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md h-24"
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
                                disabled={!newFormData.assetType || !newFormData.costOfAcquisition}
                            >
                                <Check className="h-4 w-4" />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-4">
                <div className="mb-4">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-900 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                    >
                        <Add className="h-4 w-4" />
                        Add
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-yellow-400">
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ACTION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">CODE OF ASSETS</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">GROUP/TYPE OF ASSET</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">MONTH/YEAR OF ACQUISITION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">COST OF ACQUISITION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">REMAINING FISCAL BOOK VALUE</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">DEPRECIATION METHOD</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">FISCAL DEPRECIATION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">NOTES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buildingData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="border border-gray-300 px-3 py-8 text-center text-gray-500 text-sm">
                                        No data to display
                                    </td>
                                </tr>
                            ) : (
                                buildingData.map((item, index) => {
                                    const isEditing = editingItem === item.id;
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-2 py-1 text-center">
                                                <div className="flex gap-1 justify-center">
                                                    {isEditing ? (
                                                        <>
                                                            <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                                                                <Check className="h-3 w-3" />
                                                            </button>
                                                            <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
                                                                <Close className="h-3 w-3" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => handleEdit(item)} className="bg-blue-900 text-white px-1 py-1 rounded text-xs">
                                                                <Edit className="h-3 w-3" />
                                                            </button>
                                                            <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-1 py-1 rounded text-xs">
                                                                <Delete className="h-3 w-3" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.codeOfAsset || ''}
                                                        onChange={(e) => handleInputChange('codeOfAsset', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">{item.codeOfAsset}</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <select
                                                        value={editValues.assetType || ''}
                                                        onChange={(e) => handleInputChange('assetType', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                    >
                                                        <option value="">Please Select</option>
                                                        {buildingTypeOptions.map((option, index) => (
                                                            <option key={index} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className="text-xs">
                                                        <div className="font-medium text-blue-600 mb-1">
                                                            {item.category === 'permanent' ? 'PERMANENT' : 'NON PERMANENT'}
                                                        </div>
                                                        <div>{item.assetType}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-center">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.monthYearAcquisition || ''}
                                                        onChange={(e) => handleInputChange('monthYearAcquisition', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">{item.monthYearAcquisition}</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.costOfAcquisition || ''}
                                                        onChange={(e) => handleInputChange('costOfAcquisition', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">
                                                        {parseFloat(item.costOfAcquisition || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.fiscalBookAtBeginning || ''}
                                                        onChange={(e) => handleInputChange('fiscalBookAtBeginning', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">
                                                        {parseFloat(item.fiscalBookAtBeginning || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <div className="grid grid-cols-1 gap-1">
                                                        <select
                                                            value={editValues.commercialDepreciation || ''}
                                                            onChange={(e) => handleInputChange('commercialDepreciation', e.target.value)}
                                                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                        >
                                                            <option value="">Select Commercial</option>
                                                            {commercialDepreciationOptions.map((option, index) => (
                                                                <option key={index} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={editValues.fiscalDepreciation || ''}
                                                            onChange={(e) => handleInputChange('fiscalDepreciation', e.target.value)}
                                                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                        >
                                                            <option value="">Select Fiscal</option>
                                                            {fiscalDepreciationOptions.map((option, index) => (
                                                                <option key={index} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs">
                                                        <div><strong>Commercial:</strong> {item.commercialDepreciation}</div>
                                                        <div><strong>Fiscal:</strong> {item.fiscalDepreciation}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.fiscalDepreciationThisYear || ''}
                                                        onChange={(e) => handleInputChange('fiscalDepreciationThisYear', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">
                                                        {parseFloat(item.fiscalDepreciationThisYear || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.notes || ''}
                                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">{item.notes}</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const IntangibleAssetSection = () => {
        const intangibleAssetData = formData.intangibleAssets;
        const [showAddForm, setShowAddForm] = useState(false);
        const [editingItem, setEditingItem] = useState(null);
        const [editValues, setEditValues] = useState({});
        const [newFormData, setNewFormData] = useState({});

        const intangibleAssetTypeOptions = [
            'Paten', 'Royalti', 'Merek dagang', 'Merek Hak Bangunan', 'Merek Hak Budidaya',
            'Hak Penggunaan', 'Niat baik/Goodwill', 'Hak Pengusahaan Hutan',
            'Hak di Lapangan Minyak dan Gas', 'Hak Eksploitasi Sumber Daya Alam dan Hasil Alam Lainnya',
            'Harta Tidak Berwujud Lainnya'
        ];

        const commercialAmortizationOptions = [
            'Garis Lurus', 'Jumlah Angka Tahun', 'Saldo Menurun',
            'Saldo Menurun Ganda', 'Jumlah Jam Jasa', 'Jumlah Satuan Produksi', 'Metode Lainnya'
        ];

        const fiscalAmortizationOptions = [
            'GL/Straight Line (Garis Lurus)',
            'JSP/ Number of Production Unit (Jumlah Satuan produksi)',
            'SM/ Declining Method (Saldo Menurun)'
        ];

        const handleAdd = useCallback(() => {
            setShowAddForm(true);
            setNewFormData({
                codeOfAsset: '', assetType: '', monthYearAcquisition: '',
                costOfAcquisition: '', fiscalBookAtBeginning: '',
                commercialAmortization: '', fiscalAmortization: '',
                fiscalAmortizationThisYear: '', notes: ''
            });
        }, []);

        const handleEdit = useCallback((item) => {
            setEditingItem(item.id);
            setEditValues({ ...item });
        }, []);

        const handleSave = useCallback(() => {
            const updatedData = intangibleAssetData.map(item =>
                item.id === editingItem ? { ...item, ...editValues } : item
            );
            updateFormData('intangibleAssets', updatedData);
            setEditingItem(null);
            setEditValues({});
        }, [editingItem, editValues, intangibleAssetData, updateFormData]);

        const handleCancel = useCallback(() => {
            setEditingItem(null);
            setEditValues({});
        }, []);

        const handleInputChange = useCallback((field, value) => {
            setEditValues(prev => ({ ...prev, [field]: value }));
        }, []);

        const handleFormInputChange = useCallback((field, value) => {
            setNewFormData(prev => ({ ...prev, [field]: value }));
        }, []);

        const handleSaveForm = useCallback(() => {
            if (!newFormData.assetType || !newFormData.costOfAcquisition) return;
            const newItem = { id: Date.now(), ...newFormData };
            updateFormData('intangibleAssets', [...intangibleAssetData, newItem]);
            setNewFormData({
                codeOfAsset: '', assetType: '', monthYearAcquisition: '',
                costOfAcquisition: '', fiscalBookAtBeginning: '',
                commercialAmortization: '', fiscalAmortization: '',
                fiscalAmortizationThisYear: '', notes: ''
            });
            setShowAddForm(false);
        }, [newFormData, intangibleAssetData, updateFormData]);

        const handleCloseForm = useCallback(() => {
            setNewFormData({
                codeOfAsset: '', assetType: '', monthYearAcquisition: '',
                costOfAcquisition: '', fiscalBookAtBeginning: '',
                commercialAmortization: '', fiscalAmortization: '',
                fiscalAmortizationThisYear: '', notes: ''
            });
            setShowAddForm(false);
        }, []);

        const handleDelete = useCallback((itemId) => {
            const updatedData = intangibleAssetData.filter(item => item.id !== itemId);
            updateFormData('intangibleAssets', updatedData);
        }, [intangibleAssetData, updateFormData]);

        if (showAddForm) {
            return (
                <div className="p-6">
                    <div className="bg-gray-100 p-3 mb-6">
                        <h3 className="text-sm font-medium text-gray-700">GROUP 1</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Code Of Asset</label>
                            <input
                                type="text"
                                value={newFormData.codeOfAsset}
                                onChange={(e) => handleFormInputChange('codeOfAsset', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Asset Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={newFormData.assetType}
                                onChange={(e) => handleFormInputChange('assetType', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            >
                                <option value="">Please Select</option>
                                {intangibleAssetTypeOptions.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Month / Year Acquisition</label>
                            <input
                                type="text"
                                placeholder="mm yyyy"
                                value={newFormData.monthYearAcquisition}
                                onChange={(e) => handleFormInputChange('monthYearAcquisition', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Cost Of Acquisition <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newFormData.costOfAcquisition}
                                onChange={(e) => handleFormInputChange('costOfAcquisition', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Fiscal Book At The Beginning Of The Year</label>
                            <input
                                type="text"
                                value={newFormData.fiscalBookAtBeginning}
                                onChange={(e) => handleFormInputChange('fiscalBookAtBeginning', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Method Of Amortization</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Commercial</label>
                                    <select
                                        value={newFormData.commercialAmortization}
                                        onChange={(e) => handleFormInputChange('commercialAmortization', e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Please Select</option>
                                        {commercialAmortizationOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Fiscal</label>
                                    <select
                                        value={newFormData.fiscalAmortization}
                                        onChange={(e) => handleFormInputChange('fiscalAmortization', e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Please Select</option>
                                        {fiscalAmortizationOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Fiscal Amortization In This Year</label>
                            <input
                                type="text"
                                value={newFormData.fiscalAmortizationThisYear}
                                onChange={(e) => handleFormInputChange('fiscalAmortizationThisYear', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Notes</label>
                            <textarea
                                value={newFormData.notes}
                                onChange={(e) => handleFormInputChange('notes', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md h-24"
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
                                disabled={!newFormData.assetType || !newFormData.costOfAcquisition}
                            >
                                <Check className="h-4 w-4" />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-4">
                <div className="mb-4">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-900 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                    >
                        <Add className="h-4 w-4" />
                        Add
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-yellow-400">
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">ACTION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">CODE OF ASSETS</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">GROUP/TYPE OF ASSET</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">MONTH/YEAR OF ACQUISITION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">COST OF ACQUISITION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">REMAINING FISCAL BOOK VALUE</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">AMORTIZATION METHOD</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">FISCAL AMORTIZATION</th>
                                <th className="border border-gray-400 px-2 py-2 text-xs font-semibold">NOTES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {intangibleAssetData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="border border-gray-300 px-3 py-8 text-center text-gray-500 text-sm">
                                        No data to display
                                    </td>
                                </tr>
                            ) : (
                                intangibleAssetData.map((item, index) => {
                                    const isEditing = editingItem === item.id;
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-2 py-1 text-center">
                                                <div className="flex gap-1 justify-center">
                                                    {isEditing ? (
                                                        <>
                                                            <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                                                                <Check className="h-3 w-3" />
                                                            </button>
                                                            <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
                                                                <Close className="h-3 w-3" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => handleEdit(item)} className="bg-blue-900 text-white px-1 py-1 rounded text-xs">
                                                                <Edit className="h-3 w-3" />
                                                            </button>
                                                            <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-1 py-1 rounded text-xs">
                                                                <Delete className="h-3 w-3" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.codeOfAsset || ''}
                                                        onChange={(e) => handleInputChange('codeOfAsset', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">{item.codeOfAsset}</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <select
                                                        value={editValues.assetType || ''}
                                                        onChange={(e) => handleInputChange('assetType', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                    >
                                                        <option value="">Please Select</option>
                                                        {intangibleAssetTypeOptions.map((option, index) => (
                                                            <option key={index} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="text-xs">{item.assetType}</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-center">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.monthYearAcquisition || ''}
                                                        onChange={(e) => handleInputChange('monthYearAcquisition', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">{item.monthYearAcquisition}</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.costOfAcquisition || ''}
                                                        onChange={(e) => handleInputChange('costOfAcquisition', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">
                                                        {parseFloat(item.costOfAcquisition || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.fiscalBookAtBeginning || ''}
                                                        onChange={(e) => handleInputChange('fiscalBookAtBeginning', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">
                                                        {parseFloat(item.fiscalBookAtBeginning || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <div className="grid grid-cols-1 gap-1">
                                                        <select
                                                            value={editValues.commercialAmortization || ''}
                                                            onChange={(e) => handleInputChange('commercialAmortization', e.target.value)}
                                                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                        >
                                                            <option value="">Select Commercial</option>
                                                            {commercialAmortizationOptions.map((option, index) => (
                                                                <option key={index} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={editValues.fiscalAmortization || ''}
                                                            onChange={(e) => handleInputChange('fiscalAmortization', e.target.value)}
                                                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                        >
                                                            <option value="">Select Fiscal</option>
                                                            {fiscalAmortizationOptions.map((option, index) => (
                                                                <option key={index} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs">
                                                        <div><strong>Commercial:</strong> {item.commercialAmortization}</div>
                                                        <div><strong>Fiscal:</strong> {item.fiscalAmortization}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.fiscalAmortizationThisYear || ''}
                                                        onChange={(e) => handleInputChange('fiscalAmortizationThisYear', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs text-right border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">
                                                        {parseFloat(item.fiscalAmortizationThisYear || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.notes || ''}
                                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs">{item.notes}</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const MainView = () => (
        <div className="max-w-7xl mx-auto bg-white">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">List Of Fiscal Depreciation And Amortization</h1>
            </div>

            {/* Header Section */}
            <div className="bg-gray-50 p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">HEADER</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Fiscal Year</label>
                        <input
                            type="text"
                            value={formData.header.fiscalYear}
                            onChange={(e) => handleHeaderChange('fiscalYear', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Version</label>
                        <input
                            type="text"
                            value={formData.header.version}
                            onChange={(e) => handleHeaderChange('version', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <button className="bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium">
                        XML Upload +
                    </button>
                </div>
            </div>

            {/* Tangible Asset Section */}
            <div className='mb-6'>
                <AccordionSection
                    title="TANGIBLE ASSET"
                    sectionKey="tangible_asset"
                    isExpanded={expandedSections.tangible_asset}
                    onToggle={() => toggleSection('tangible_asset')}
                >
                    <TangibleAssetSection />
                </AccordionSection>
            </div>

            {/* Building Section */}
            <div className='mb-6'>
                <AccordionSection
                    title="BUILDING"
                    sectionKey="building"
                    isExpanded={expandedSections.building}
                    onToggle={() => toggleSection('building')}
                >
                    <BuildingSection />
                </AccordionSection>
            </div>

            {/* Intangible Asset Section */}
            <div className='mb-6'>
                <AccordionSection
                    title="INTANGIBLE ASSET"
                    sectionKey="intangible_asset"
                    isExpanded={expandedSections.intangible_asset}
                    onToggle={() => toggleSection('intangible_asset')}
                >
                    <IntangibleAssetSection />
                </AccordionSection>
            </div>
        </div>
    );

    return <MainView />;
};

export default L3CForm;