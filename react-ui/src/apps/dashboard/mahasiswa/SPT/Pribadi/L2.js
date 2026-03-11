import React, { useState, useEffect } from 'react';
import {
    Check, Download, FileOpen, ArrowBack, ArrowForward,
    Save, Send, Warning, Info, Upload, Delete, ExpandMore, ExpandLess,
    Person, Assignment, Calculate, CreditCard, AccountBalance,
    Refresh, Business, AttachFile, CheckBox, Add, Edit, KeyboardArrowRight,
    Filter
} from '@mui/icons-material';

export const L2Form = ({ data, onDataChange, taxpayerData }) => {
    const [currentForm, setCurrentForm] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});


    const [l2FormData, setL2FormData] = useState(data || {
        income_subject_final: [], // A. INCOME-SUBJECT TO FINAL YEAR
        income_excluded: [],      // B. INCOME-EXCLUDED FROM TAX  
        foreign_income: []        // C. LIST OF FOREIGN INCOME
    });

    // useEffect(() => {
    //     onDataChange && onDataChange(l2FormData);
    // }, [l2FormData, onDataChange]);

    // Auto-generate code based on category and existing items
    const generateCode = (category) => {
        const codeMappings = {
            income_subject_final: 'A',
            income_excluded: 'B',
            foreign_income: 'C'
        };

        const baseCode = codeMappings[category] || 'A';
        const existingItems = l2FormData[category] || [];
        const nextNumber = (existingItems.length + 1).toString().padStart(3, '0');
        return `${baseCode}${nextNumber}`;
    };

    const addAssetItem = (category, formData) => {
        const newItem = {
            id: Date.now(),
            code: generateCode(category),
            ...formData
        };

        const updatedData = {
            ...l2FormData,
            [category]: [...l2FormData[category], newItem]
        };

        setL2FormData(updatedData);
        onDataChange && onDataChange(updatedData); // Direct call
        setCurrentForm(null);
        setEditingItem(null);
    };

    const updateAssetItem = (category, itemId, formData) => {
        const updatedData = {
            ...l2FormData,
            [category]: l2FormData[category].map(item =>
                item.id === itemId ? { ...item, ...formData } : item
            )
        };

        setL2FormData(updatedData);
        onDataChange && onDataChange(updatedData); // Direct call
        setCurrentForm(null);
        setEditingItem(null);
    };

    const removeAssetItem = (category, id) => {
        const updatedData = {
            ...l2FormData,
            [category]: l2FormData[category].filter(item => item.id !== id)
        };

        setL2FormData(updatedData);
        onDataChange && onDataChange(updatedData); // Direct call
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
            {/* Main Sections */}
            <div className="space-y-4">
                <AccordionSection
                    title="A. INCOME-SUBJECT TO FINAL YEAR"
                    sectionKey="income_subject"
                    isExpanded={expandedSections.income_subject}
                    onToggle={() => toggleSection('income_subject')}
                >
                    <TaxSection />
                </AccordionSection>
                <AccordionSection
                    title="B. INCOME-EXCLUDED FROM TAX"
                    sectionKey="income_excluded"
                    isExpanded={expandedSections.income_excluded}
                    onToggle={() => toggleSection('income_excluded')}
                >
                    <IncomeExcludedSection />
                </AccordionSection>

                <AccordionSection
                    title="C. LIST OF FOREIGN INCOME"
                    sectionKey="foreign_income"
                    isExpanded={expandedSections.foreign_income}
                    onToggle={() => toggleSection('foreign_income')}
                >
                    <ForeignIncomeList />
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


    const taxObjects = [
        'Upah Pegawai Tidak Tetap/Tenaga Kerja Lepas yang dibayarkan secara bulanan yang mendapat fasilitas di daerah tertentu',
        'Imbalan kepada Bukan Pegawai Lainnya yang mendapat fasilitas di daerah tertentu',
        'Upah Pegawai Tidak Tetap/Tenaga Kerja Lepas yang dibayarkan secara harian, mingguan, satuan atau borongan yang mendapat fasilitas di daerah tertentu sampai dengan Rp 2.500.000 per hari',
        'Upah Pegawai Tidak Tetap/Tenaga Kerja Lepas yang dibayarkan secara harian, mingguan, satuan dan borongan lebih dari Rp2.500.000 perhari yang mendapat fasilitas di daerah tertentu',
        'Penghasilan yang diterima oleh Pegawai tetap yang menerima fasilitas di daerah tertentu',
        'Uang Pesangon yang Dibayarkan Sekaligus',
        'Uang Manfaat Pensiun, Tunjangan Hari Tua atau Jaminan Hari Tua dan Pembayaran Sejenis yang Dibayarkan Sekaligus',
        'Honor atau Imbalan Lain yang Dibebankan kepada APBN atau APBD yang Diterima oleh PNS, Anggota TNI/POLRI, Pejabat Negara dan Pensiunannya (LAMA)',
        'Honor atau Imbalan Lain yang Dibebankan kepada APBN atau APBD yang Diterima oleh PNS Golongan III, Anggota TNI dan Anggota POLRI Golongan Pangkat Perwira Pertama, dan pensiunannya',
        'Honor atau Imbalan Lain yang Dibebankan kepada APBN atau APBD yang Diterima oleh Pejabat Negara, PNS Golongan IV, Anggota TNI dan Anggota POLRI Golongan Pangkat Perwira Menengah dan Perwira Tinggi, dan Pensiunannya',
        'Honor atau Imbalan Lain yang Dibebankan kepada APBN atau APBD yang Diterima oleh PNS Golongan I dan Golongan II, Anggota TNI dan Anggota POLRI Golongan Pangkat Tamtama dan Bintara, dan Pensiunannya',
        'Objek PPh Pasal 21 Final Lainnya',
        'Penghasilan Sehubungan dengan Transaksi Penjualan Barang, Penyerahan Jasa, dan/atau Persewaan serta Penghasilan Lain Sehubungan dengan Penggunaan Harta yang Dilakukan Melalui Pihak Lain dalam Sistem Informasi Pengadaan Pemerintah',
        'Penghasilan yang Diterima atau Diperoleh Pedagang Dalam Negeri Penjualan Barang, Penyerahan Jasa, dan/atau Persewaan serta Penghasilan Lain Sehubungan dengan Penggunaan Harta yang Dilakukan Melalui Perdagangan Melalui Sistem Elektronik',
        'Penjualan BBM oleh Pertamina atau Anak Perusahaan Pertamina Kepada SPBU (Final)',
        'Penjualan BBM oleh Badan Usaha Selain Pertamina atau Anak Perusahaan Pertamina Kepada SPBU/Agen/Penyalur (Final)',
        'Penjualan BBG oleh produsen/importir Kepada SPBU/Agen/Penyalur (Final)',
        'Penjualan BBM oleh Pertamina atau Anak Perusahaan Pertamina kepada Agen/Penyalur selain SPBU (Final)',
        'Penghasilan Sehubungan dengan Aset Kripto yang dipungut oleh Penyelenggara Perdagangan Melalui Sistem Elektronik yang Merupakan Pedagang Fisik Aset Kripto',
        'Penghasilan Sehubungan dengan Aset Kripto yang dipungut oleh Penyelenggara Perdagangan Melalui Sistem Elektronik yang Bukan Merupakan Pedagang Fisik Aset Kripto',
        'Penghasilan Sehubungan dengan Aset Kripto (Setor Sendiri)',
        'Bunga Obligasi, Surat Utang Negara, atau Obligasi Daerah yang Diterima Wajib Pajak Dalam Negeri dan Bentuk Usaha Tetap',
        'Bunga Obligasi yang Diterima Wajib Pajak Dalam Negeri dan Bentuk Usaha Tetap yang diadministrasikan oleh BI',
        'Diskonto Surat Perbendaharaan Negara yang Diterima Wajib Pajak Dalam Negeri dan Bentuk Usaha Tetap',
        'Diskonto Surat Perbendaharaan Negara yang Diterima Wajib Pajak Penduduk/Berkedudukan di Luar Negeri',
        'Bunga Obligasi yang Diterima Wajib Pajak Dalam Negeri dan Bentuk Usaha Tetap',
        'Pengalihan Hak atas Tanah dan/atau Bangunan',
        'Pengalihan Rumah Sederhana dan Rumah Susun Sederhana yang Dilakukan oleh WP yang Usaha Pokoknya Mengalihkan Hak atas Tanah dan/atau Bangunan',
        'Pengalihan Hak atas Tanah dan/atau Bangunan kepada Pemerintah, BUMN yang Mendapat Penugasan Khusus dari Pemerintah, atau BUMD yang Mendapat Penugasan Khusus dari Kepala Daerah, sesuai UU mengenai Pengadaan Tanah bagi Pembangunan untuk Kepentingan Umum',
        'Persewaan Tanah dan/atau Bangunan',
        'Bunga Tabungan dan Bunga Deposito yang Ditempatkan di Dalam Negeri yang Dananya Bersumber Selain dari Devisa Hasil Ekspor (DHE)',
        'Bunga Deposito yang Ditempatkan di Dalam Negeri (mata uang IDR bersumber dari DHE tenor 1 bulan)',
        'Bunga Deposito yang Ditempatkan di Dalam Negeri (mata uang IDR bersumber dari DHE tenor 3 bulan)',
        'Bunga Deposito yang Ditempatkan di Dalam Negeri (mata uang IDR bersumber dari DHE tenor 6 bulan atau lebih)',
        'Bunga Deposito yang Ditempatkan di Dalam Negeri (mata uang USD bersumber dari DHE tenor 1 bulan)',
        'Bunga Deposito yang Ditempatkan di Dalam Negeri (mata uang USD bersumber dari DHE tenor 3 bulan)',
        'Bunga Deposito yang Ditempatkan di Dalam Negeri (mata uang USD bersumber dari DHE tenor 6 bulan)',
        'Bunga Deposito yang Ditempatkan di Dalam Negeri (mata uang USD bersumber dari DHE tenor lebih 6 bulan)',
        'Bunga Deposito/Tabungan yang Ditempatkan di Luar Negeri Melalui Bank yang Didirikan atau Bertempat Kedudukan di Indonesia atau Cabang Bank Luar Negeri di Indonesia',
        'Diskonto Sertifikat Bank Indonesia',
        'Jasa Giro',
        'Hadiah Undian',
        'Transaksi Penjualan Saham di Bursa Efek (Bukan Saham Pendiri)',
        'Transaksi Penjualan Saham di Bursa Efek (Saham Pendiri)',
        'Transaksi Penjualan Saham Milik Perusahaan Modal Ventura Tidak di Bursa Efek',
        'Jasa Konstruksi Berupa Jasa Perencanaan Konstruksi (Dengan Kualifikasi Usaha) yang Disetor Sendiri',
        'Jasa Konstruksi Berupa Jasa Perencanaan Konstruksi (Tanpa Kualifikasi Usaha)',
        'Jasa Konstruksi Berupa Jasa Pelaksanaan Konstruksi (Kualifikasi Usaha Kecil)',
        'Jasa Konstruksi Berupa Jasa Pelaksanaan Konstruksi (Kualifikasi Usaha Menengah dan Besar)',
        'Jasa Konstruksi Berupa Jasa Pelaksanaan Konstruksi (Tanpa Kualifikasi Usaha)',
        'Jasa Konstruksi Berupa Jasa Pengawasan Konstruksi (Dengan Kualifikasi Usaha)',
        'Jasa Konstruksi Berupa Jasa Pengawasan Konstruksi (Tanpa Kualifikasi Usaha)',
        'Pekerjaan Konstruksi yang Dilakukan oleh Penyedia Jasa yang Memiliki Sertifikat Badan Usaha Kualifikasi Kecil atau Sertifikat Kompetensi Kerja untuk Usaha Orang Perseorangan',
        'Pekerjaan Konstruksi yang Dilakukan oleh Penyedia Jasa yang Tidak Memiliki Sertifikat Badan Usaha Atau Sertifikat Kompetensi Kerja untuk Usaha Orang Perseorangan',
        'Pekerjaan Konstruksi yang Dilakukan oleh Penyedia Jasa yang Memiliki Sertifikat Selain Sertifikat Badan Usaha Kualifikasi Kecil atau Sertifikat Kompetensi Kerja untuk Usaha Orang Perseorangan',
        'Pekerjaan Konstruksi Terintegrasi yang Dilakukan oleh Penyedia Jasa yang Memiliki Sertifikat Badan Usaha',
        'Pekerjaan Konstruksi Terintegrasi yang Dilakukan oleh Penyedia Jasa yang Tidak Memiliki Sertifikat Badan Usaha',
        'Jasa Konsultansi Konstruksi yang Dilakukan oleh Penyedia Jasa yang Memiliki Sertifikat Badan Usaha atau Sertifikat Kompetensi Kerja untuk Usaha Orang Perseorangan',
        'Jasa Konsultansi Konstruksi yang Dilakukan oleh Penyedia Jasa yang Tidak Memiliki Sertifikat Badan Usaha atau Sertifikat Kompetensi Kerja untuk Usaha Orang Perseorangan',
        'Imbalan yang Diterima/Diperoleh Sehubungan dengan Pengangkutan Orang dan/atau Barang Termasuk Penyewaan Kapal Laut Oleh Perusahaan Pelayaran Dalam Negeri',
        'Imbalan yang Dibayarkan/Terutang kepada Perusahaan Pelayaran Dalam Negeri',
        'Imbalan yang Dibayarkan/Terutang kepada Perusahaan Pelayaran dan/atau Penerbangan Luar Negeri Sehubungan dengan Pengangkutan Orang dan/atau Barang (Selain Berdasarkan Perjanjian Charter)',
        'Imbalan Charter Kapal Laut dan/atau Pesawat Udara yang Dibayarkan/Terutang kepada Perusahaan Pelayaran dan/atau Penerbangan Luar Negeri melalui BUT di Indonesia',
        'Penghasilan Wajib Pajak Luar Negeri yang Mempunyai Kantor Perwakilan Dagang di Indonesia',
        'Revaluasi atau penilaian kembali aset tetap Bunga Simpanan yang Dibayarkan oleh Koperasi kepada Anggota Wajib Pajak Orang Pribadi (bunga sampai dengan Rp240.000,00)',
        'Bunga Simpanan yang Dibayarkan oleh Koperasi kepada Anggota Wajib Pajak Orang Pribadi (bunga di atas Rp240.000,00)',
        'Dividen yang Diterima/Diperoleh Wajib Pajak Orang Pribadi Dalam Negeri',
        'Uplift Hulu Migas',
        'Participating Interest Eksplorasi Hulu Migas',
        'Participating Interest Eksploitasi Hulu Migas',
        'Transaksi dengan Wajib Pajak yang menggunakan tarif Peraturan Pemerintah Nomor 23 Tahun 2018',
        'Transaksi dengan Wajib Pajak yang menggunakan tarif Peraturan Pemerintah Nomor 55 Tahun 2022',
        'Penghasilan yang dikenakan pajak bersifat final sesuai Peraturan Pemerintah Nomor 23/55 (Disetor Sendiri)',
        'Perjanjian Pengikatan Jual Beli',
        'Penghasilan Wajib Pajak yang Melakukan Kegiatan Usaha Jasa Maklon (Contract Manufacturing) Internasional di Bidang Produksi Mainan Anak-Anak',
        'Penghasilan yang Diterima atau Diperoleh Sehubungan dengan Kerja Sama dengan Lembaga Pengelola Investasi (LPI)',
        'Penghasilan istri dari satu pemberi kerja',
        'Penghasilan Final Lainnya'
    ];

    function TaxSection() {
        // const [taxData, setTaxData] = useState([]);
        const [showForm, setShowForm] = useState(false);
        const [editingItem, setEditingItem] = useState(null);
        const taxData = l2FormData.income_subject_final || [];

        // useEffect(() => {
        //     setL2FormData(prev => ({
        //         ...prev,
        //         income_subject_final: taxData
        //     }));
        // }, [taxData]);

        const addTax = (data) => {
            let newTaxData;
            if (editingItem) {
                newTaxData = taxData.map((item) =>
                    item.id === editingItem.id ? { ...item, ...data } : item
                );
                setEditingItem(null);
            } else {
                newTaxData = [...taxData, { id: Date.now(), code: generateCode('income_subject_final'), ...data }];
            }

            // Update parent data directly
            const updatedL2Data = {
                ...l2FormData,
                income_subject_final: newTaxData
            };
            setL2FormData(updatedL2Data);
            onDataChange && onDataChange(updatedL2Data);

            setShowForm(false);
        };

        const deleteTax = (id) => {
            const newTaxData = taxData.filter((item) => item.id !== id);

            // Update parent data directly
            const updatedL2Data = {
                ...l2FormData,
                income_subject_final: newTaxData
            };
            setL2FormData(updatedL2Data);
            onDataChange && onDataChange(updatedL2Data);
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
                                    <th className="px-4 py-3 border-r border-gray-300">NPWP PEMOTONG PAJAK</th>
                                    <th className="px-4 py-3 border-r border-gray-300">NAMA PEMOTONG PAJAK</th>
                                    <th className="px-4 py-3 border-r border-gray-300">KODE OBJEK PAJAK</th>
                                    <th className="px-4 py-3 border-r border-gray-300">OBJEK PAJAK</th>
                                    <th className="px-4 py-3 border-r border-gray-300">DASAR PENGENAAN PAJAK</th>
                                    <th className="px-4 py-3">PAJAK DIPOTONG/DIBAYAR SENDIRI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {taxData.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center text-gray-500 py-8">
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
                                            <td className="px-4 py-3 border-r text-center">{item.withholder_tin}</td>
                                            <td className="px-4 py-3 border-r">{item.withholder_name}</td>
                                            <td className="px-4 py-3 border-r text-center">{item.tax_object_code}</td>
                                            <td className="px-4 py-3 border-r text-sm">{item.tax_object}</td>
                                            <td className="px-4 py-3 border-r text-right">{item.tax_base}</td>
                                            <td className="px-4 py-3 text-right">{item.withholding_tax}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    function TaxForm({ onSave, onCancel, editingItem }) {
        const [formData, setFormData] = useState(
            editingItem || {
                withholder_tin: '',
                withholder_name: '',
                tax_object_code: '',
                tax_object: '',
                tax_base: '',
                withholding_tax: '',
            }
        );

        const handleChange = (field) => (e) =>
            setFormData({ ...formData, [field]: e.target.value });

        const handleSubmit = () => {
            if (!formData.withholder_tin || !formData.withholder_name || !formData.tax_object) {
                alert('Please fill in all required fields');
                return;
            }
            onSave(formData);
        };

        return (
            <div className="max-w-4xl mx-auto bg-white p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">WITHHOLDING TAX FORM</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Income Tax Withholder TIN * <span className="text-gray-500">[1] NPWP Pemotong Pajak</span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.withholder_tin}
                            onChange={handleChange('withholder_tin')}
                            placeholder="Enter TIN/NPWP"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Income Tax Withholder Name * <span className="text-gray-500">[2] Nama Pemotong Pajak</span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.withholder_name}
                            onChange={handleChange('withholder_name')}
                            placeholder="Enter withholder name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax Object Code <span className="text-gray-500">[3] Kode Objek Pajak (Prefil)</span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.tax_object_code}
                            onChange={handleChange('tax_object_code')}
                            placeholder="Enter tax object code"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax Object * <span className="text-gray-500">[4] List Dropdown Objek Pajak</span>
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.tax_object}
                            onChange={handleChange('tax_object')}
                        >
                            <option value="">Select tax object</option>
                            {taxObjects.map((obj, index) => (
                                <option key={index} value={obj}>
                                    {obj}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax Base * <span className="text-gray-500">[5] Dasar Pengenaan Pajak</span>
                        </label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                            value={formData.tax_base}
                            onChange={handleChange('tax_base')}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Withholding Tax/Self Payment Tax * <span className="text-gray-500">[6] Pajak dipotong/Pajak Dibayar Sendiri</span>
                        </label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                            value={formData.withholding_tax}
                            onChange={handleChange('withholding_tax')}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-10">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Save
                    </button>
                </div>
            </div>
        );
    }

    function IncomeExcludedSection() {
        // const [data, setData] = useState([]);
        const [showForm, setShowForm] = useState(false);
        const [editingItem, setEditingItem] = useState(null);
        const data = l2FormData.income_excluded || [];
        // useEffect(() => {
        //     setL2FormData(prev => ({
        //         ...prev,
        //         income_excluded: data
        //     }));
        // }, [data]);
        const addEntry = (entry) => {
            let newData;
            if (editingItem) {
                newData = data.map((item) => (item.id === editingItem.id ? { ...item, ...entry } : item));
                setEditingItem(null);
            } else {
                newData = [...data, { id: Date.now(), code: generateCode('income_excluded'), ...entry }];
            }

            // Update parent data directly
            const updatedL2Data = {
                ...l2FormData,
                income_excluded: newData
            };
            setL2FormData(updatedL2Data);
            onDataChange && onDataChange(updatedL2Data);

            setShowForm(false);
        };

        const deleteEntry = (id) => {
            const newData = data.filter((item) => item.id !== id);

            // Update parent data directly
            const updatedL2Data = {
                ...l2FormData,
                income_excluded: newData
            };
            setL2FormData(updatedL2Data);
            onDataChange && onDataChange(updatedL2Data);
        };
        const startEdit = (item) => {
            setEditingItem(item);
            setShowForm(true);
        };

        if (showForm) {
            return (
                <IncomeExcludedForm
                    onSave={addEntry}
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
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium mb-4"
                >
                    <Add className="h-4 w-4" />
                    Add Income Excluded
                </button>

                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead>
                            <tr className="bg-yellow-400 text-gray-800 font-semibold text-sm">
                                <th className="px-4 py-3 border-r">ACTION</th>
                                <th className="px-4 py-3 border-r">CODE</th>
                                <th className="px-4 py-3 border-r">INCOME TYPE</th>
                                <th className="px-4 py-3 border-r">TIN (NPWP)</th>
                                <th className="px-4 py-3 border-r">NAME</th>
                                <th className="px-4 py-3">GROSS INCOME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-gray-500 py-8">
                                        No data found.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="text-center px-4 py-2 border-r">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => startEdit(item)} className="text-blue-600 hover:text-blue-800">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteEntry(item.id)} className="text-red-600 hover:text-red-800">
                                                    <Delete className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="text-center px-4 py-2 border-r">{item.code}</td>
                                        <td className="px-4 py-2 border-r">{item.income_type}</td>
                                        <td className="px-4 py-2 border-r text-center">{item.tin}</td>
                                        <td className="px-4 py-2 border-r">{item.name}</td>
                                        <td className="px-4 py-2 text-right">{item.gross_income}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    const incomeTypes = [
        "Dividen atau bagian laba",
        "Pembebasan utang",
        "Hibah",
        "Bantuan/Sumbangan",
        "Warisan",
        "Penerimaan Zakat",
        "Bagian Laba Anggota Perseroan Komanditer Tidak Atas Saham, Persekutuan, Perkumpulan, Firma, Kongsi",
        "Klaim asuransi kesehatan, kecelakaan, jiwa, dwiguna, beasiswa",
        "Beasiswa",
        "Hadiah langsung yang diberikan kepada semua pembeli/konsumen akhir tanpa diundi",
        "Objek PPh tertentu bagi TKA yang memiliki keahlian tertentu (expatriate regime)",
        "Natura dan kenikmatan yang dikecualikan dari objek pajak",
        "SHU dari koperasi",
        "Penghasilan lain yang tidak termasuk objek pajak"
    ];

    function IncomeExcludedForm({ onSave, onCancel, editingItem }) {
        const [formData, setFormData] = useState(
            editingItem || {
                code: '',
                income_type: '',
                tin: '',
                name: '',
                gross_income: '',
            }
        );

        const handleChange = (field) => (e) => {
            setFormData({ ...formData, [field]: e.target.value });

        }

        const handleSubmit = () => {
            if (!formData.income_type || !formData.tin || !formData.name || !formData.gross_income) {
                alert('Please fill all required fields');
                return;
            }

            // Generate prefilled code based on income type (just an example)
            formData.code = `INC-${incomeTypes.indexOf(formData.income_type) + 1}`;

            onSave(formData);
        };

        return (
            <div className="max-w-4xl mx-auto bg-white p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">INCOME EXCLUDED FORM</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code <span className="text-gray-500">[1] Prepopulated berdasarkan Income Type</span>
                        </label>
                        <input
                            type="text"
                            value={formData.code}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                            placeholder="Auto-generated"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Income Type * <span className="text-gray-500">[2] List Dropdown Jenis Penghasilan</span>
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            value={formData.income_type}
                            onChange={handleChange('income_type')}
                        >
                            <option value="">Select income type</option>
                            {incomeTypes.map((type, i) => (
                                <option key={i} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            TIN (NPWP) * <span className="text-gray-500">[3] NPWP</span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            value={formData.tin}
                            onChange={handleChange('tin')}
                            placeholder="Enter TIN"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name * <span className="text-gray-500">[4] Nama Penerima</span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            value={formData.name}
                            onChange={handleChange('name')}
                            placeholder="Enter name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gross Income * <span className="text-gray-500">[5] Penghasilan Bruto</span>
                        </label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right"
                            value={formData.gross_income}
                            onChange={handleChange('gross_income')}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-10">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Save
                    </button>
                </div>
            </div>
        );
    }

    const countryCodes = [
        { code: 'US', name: 'United States' },
        { code: 'SG', name: 'Singapore' },
        { code: 'MY', name: 'Malaysia' },
        { code: 'JP', name: 'Japan' },
        { code: 'AU', name: 'Australia' },
        { code: 'UK', name: 'United Kingdom' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
    ];



    const incomeCodes = [
        '21-100-01', '21-100-02', '21-100-03', '21-100-04', '21-100-05'
    ];

    const currencies = ['USD', 'SGD', 'MYR', 'JPY', 'AUD', 'GBP', 'EUR'];

    function ForeignIncomeForm({ onSave, onCancel, editingItem }) {
        const [formData, setFormData] = useState(
            editingItem || {
                name: '',
                countryCode: '',
                dateOfTransaction: '',
                incomeType: '',
                incomeCode: '',
                netIncome: '',
                amountInForeignCurrency: '',
                amountInRupiah: '',
                currency: '',
                taxCreditCalculated: ''
            }
        );

        const incomeTypes = [
            "Penghasilan dari Pekerjaan Bebas",
            "Penghasilan dari kegiatan usaha",
            "Pendapatan lain dari kegiatan usaha atau pekerjaan bebas",
            "Gaji, tunjangan, honorarium, bonus, bonus, jasa produksi",
            "Upah dan Honorarium yang diterima dari pegawai tidak tetap",
            "Uang pesangon diterima sekaligus",
            "Manfaat Pensiun, Tunjangan Hari Tua, atau Jaminan Hari Tua dibayarkan sekaligus",
            "Uang pensiun yang diterima secara berkala/bulanan oleh penerima pensiun",
            "Penghasilan lain yang berhubungan dengan pekerjaan",
            "Sewa tanah dan atau bangunan",
            "Sewa harta selain tanah dan atau bangunan",
            "Dividen",
            "Bunga",
            "Obligasi",
            "Royalti",
            "Keuntungan Penjualan Harta",
            "Bunga Deposito",
            "Bunga Tabungan",
            "Surat Berharga/Sekuritas",
            "Penjualan Saham di Bursa",
            "Pengalihan atau Penjualan Tanah Bangunan",
            "Keuntungan Kurs Valuta Asing",
            "Penghasilan lain-lain dari Modal atau Aset/Harta",
            "Pembebasan Utang",
            "Hibah",
            "Bantuan/Sumbangan",
            "Warisan",
            "Hadiah/Undian",
            "Penghasilan lain"
        ];

        const handleChange = (field) => (e) => {
            const value = e.target.value;
            setFormData({ ...formData, [field]: value });

            // Auto-generate income code based on income type
            if (field === 'incomeType' && value) {
                const index = incomeTypes.indexOf(value);
                if (index !== -1) {
                    setFormData(prev => ({ ...prev, [field]: value, incomeCode: `21-${String(index + 1).padStart(3, '0')}-01` }));
                }
            }
        };

        const handleSubmit = () => {
            if (!formData.name || !formData.countryCode || !formData.incomeType || !formData.netIncome) {
                alert('Please fill all required fields');
                return;
            }
            onSave(formData);
        };

        return (
            <div className="max-w-4xl mx-auto bg-white p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">Foreign Income</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.name}
                            onChange={handleChange('name')}
                            placeholder=""
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Country Code
                        </label>
                        <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={formData.countryCode}
                            onChange={handleChange('countryCode')}
                        >
                            <option value="">Please Select</option>
                            {countryCodes.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.code} - {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Date Of Transaction
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.dateOfTransaction}
                                onChange={handleChange('dateOfTransaction')}
                                placeholder="dd-mm-yyyy"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Income Type*
                        </label>
                        <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={formData.incomeType}
                            onChange={handleChange('incomeType')}
                        >
                            <option value="">Please Select</option>
                            {incomeTypes.map((type, i) => (
                                <option key={i} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Income Code
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.incomeCode}
                            readOnly
                            placeholder=""
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Net Income
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-100 px-2 py-1 rounded text-sm">
                                Rp
                            </span>
                            <input
                                type="number"
                                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.netIncome}
                                onChange={handleChange('netIncome')}
                                placeholder=""
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Amount In Foreign Currency
                        </label>
                        <input
                            type="number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.amountInForeignCurrency}
                            onChange={handleChange('amountInForeignCurrency')}
                            placeholder=""
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Amount In Rupiah
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-100 px-2 py-1 rounded text-sm">
                                Rp
                            </span>
                            <input
                                type="number"
                                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.amountInRupiah}
                                onChange={handleChange('amountInRupiah')}
                                placeholder=""
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Currency
                        </label>
                        <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={formData.currency}
                            onChange={handleChange('currency')}
                        >
                            <option value="">Please Select</option>
                            {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Tax Credit that Can Be Calculated
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-100 px-2 py-1 rounded text-sm">
                                Rp
                            </span>
                            <input
                                type="number"
                                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.taxCreditCalculated}
                                onChange={handleChange('taxCreditCalculated')}
                                placeholder=""
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-10">
                    <button
                        onClick={onCancel}
                        className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Close
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save
                    </button>
                </div>
            </div>
        );
    }

    function ForeignIncomeList() {
        // const [data, setData] = useState([]);
        const [showForm, setShowForm] = useState(false);
        const [editingItem, setEditingItem] = useState(null);
        const data = l2FormData.foreign_income || [];

        const addEntry = (entry) => {
            let newData;
            if (editingItem) {
                newData = data.map((item) => (item.id === editingItem.id ? { ...item, ...entry } : item));
                setEditingItem(null);
            } else {
                newData = [...data, { id: Date.now(), code: generateCode('foreign_income'), ...entry }];
            }

            // Update parent data directly
            const updatedL2Data = {
                ...l2FormData,
                foreign_income: newData
            };
            setL2FormData(updatedL2Data);
            onDataChange && onDataChange(updatedL2Data);

            setShowForm(false);
        };

        const deleteEntry = (id) => {
            const newData = data.filter((item) => item.id !== id);

            // Update parent data directly
            const updatedL2Data = {
                ...l2FormData,
                foreign_income: newData
            };
            setL2FormData(updatedL2Data);
            onDataChange && onDataChange(updatedL2Data);
        };

        const startEdit = (item) => {
            setEditingItem(item);
            setShowForm(true);
        };

        const calculateTotals = () => {
            return data.reduce((totals, item) => ({
                netIncome: totals.netIncome + (parseFloat(item.netIncome) || 0),
                taxPayable: totals.taxPayable + (parseFloat(item.amountInRupiah) || 0),
                taxCredit: totals.taxCredit + (parseFloat(item.taxCreditCalculated) || 0)
            }), { netIncome: 0, taxPayable: 0, taxCredit: 0 });
        };

        const totals = calculateTotals();

        if (showForm) {
            return (
                <ForeignIncomeForm
                    onSave={addEntry}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingItem(null);
                    }}
                    editingItem={editingItem}
                />
            );
        }

        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="mb-4">

                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                    >
                        <Add className="h-4 w-4" />
                        Add
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-yellow-400 text-gray-800 text-xs font-semibold">
                                    <th rowSpan={2} className="px-2 py-3 text-center border-r border-yellow-500 w-12">
                                        <div>AC</div>
                                        <div>TIO</div>
                                        <div>N</div>
                                    </th>
                                    <th rowSpan={2} className="px-2 py-3 text-center border-r border-yellow-500 w-8">
                                        <div>N</div>
                                        <div>O</div>
                                    </th>
                                    <th colSpan={2} className="px-2 py-2 text-center border-r border-yellow-500">
                                        SOURCE OF FOREIGN INCOME
                                    </th>
                                    <th rowSpan={2} className="px-2 py-3 text-center border-r border-yellow-500 w-20">
                                        <div className="text-xs leading-tight">
                                            <div>DATE</div>
                                            <div>OF TRA</div>
                                            <div>NSACTI</div>
                                            <div>ON / IN</div>
                                            <div>COME T</div>
                                            <div>AX PAY</div>
                                            <div>MENT</div>
                                            <div className="flex items-center justify-center gap-1 mt-1">
                                                {/* <ChevronDown className="h-3 w-3" /> */}
                                            </div>
                                        </div>
                                    </th>
                                    <th rowSpan={2} className="px-2 py-3 text-center border-r border-yellow-500 w-16">
                                        <div className="flex flex-col items-center">
                                            <div>INCOME CODE</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                {/* <ChevronDown className="h-3 w-3" /> */}
                                            </div>
                                        </div>
                                    </th>
                                    <th rowSpan={2} className="px-2 py-3 text-center border-r border-yellow-500 w-24">
                                        <div className="flex flex-col items-center">
                                            <div>NET INCOM</div>
                                            <div>E (Rupiah)</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                {/* <ChevronDown className="h-3 w-3" /> */}
                                            </div>
                                        </div>
                                    </th>
                                    <th colSpan={2} className="px-2 py-2 text-center border-r border-yellow-500">
                                        TAX PAYABLE/PAID IN OVERSEAS
                                    </th>
                                    <th rowSpan={2} className="px-2 py-3 text-center border-r border-yellow-500 w-16">
                                        <div className="flex flex-col items-center">
                                            <div>CURRENCY</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                {/* <ChevronDown className="h-3 w-3" /> */}
                                            </div>
                                        </div>
                                    </th>
                                    <th rowSpan={2} className="px-2 py-3 text-center w-24">
                                        <div className="flex flex-col items-center text-xs leading-tight">
                                            <div>TAX CREDIT</div>
                                            <div>THAT CAN B</div>
                                            <div>E CALCULAT</div>
                                            <div>ED (RUPIAH)</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                {/* <ChevronDown className="h-3 w-3" /> */}
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                                <tr className="bg-yellow-400 text-gray-800 text-xs font-semibold">
                                    <th className="px-2 py-2 text-center border-r border-yellow-500 w-24">
                                        <div className="flex items-center justify-center gap-1">
                                            NAME
                                            {/* <ChevronDown className="h-3 w-3" /> */}
                                        </div>
                                    </th>
                                    <th className="px-2 py-2 text-center border-r border-yellow-500 w-20">
                                        <div className="flex items-center justify-center gap-1">
                                            COUNTRY CODE
                                            {/* <ChevronDown className="h-3 w-3" /> */}
                                        </div>
                                    </th>
                                    <th className="px-2 py-2 text-center border-r border-yellow-500 w-24">
                                        <div className="flex flex-col items-center text-xs leading-tight">
                                            <div>AMOUNT IN FOREI</div>
                                            <div>GN CURRENCY</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                {/* <ChevronDown className="h-3 w-3" /> */}
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-2 py-2 text-center border-r border-yellow-500 w-24">
                                        <div className="flex flex-col items-center text-xs leading-tight">
                                            <div>AMOUNT IN RUPI</div>
                                            <div>AH</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                {/* <ChevronDown className="h-3 w-3" /> */}
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Filter Row */}
                                <tr className="bg-gray-50 border-b">
                                    <td className="px-2 py-2 text-center border-r">
                                        <Filter className="h-4 w-4 text-gray-400 mx-auto" />
                                    </td>
                                    <td className="px-2 py-2 border-r"></td>
                                    <td className="px-2 py-2 border-r">
                                        <select className="w-full text-xs border border-gray-300 rounded px-1 py-1">
                                            <option>Please Select</option>
                                        </select>
                                    </td>
                                    <td className="px-2 py-2 border-r">
                                        <select className="w-full text-xs border border-gray-300 rounded px-1 py-1">
                                            <option>Please Select</option>
                                        </select>
                                    </td>
                                    <td className="px-2 py-2 border-r">
                                        <input type="text" className="w-full text-xs border border-gray-300 rounded px-1 py-1" />
                                    </td>
                                    <td className="px-2 py-2 border-r">
                                        <select className="w-full text-xs border border-gray-300 rounded px-1 py-1">
                                            <option>Please Select</option>
                                        </select>
                                    </td>
                                    <td className="px-2 py-2 border-r">
                                        <input type="text" className="w-full text-xs border border-gray-300 rounded px-1 py-1" />
                                    </td>
                                    <td className="px-2 py-2 border-r">
                                        <input type="text" className="w-full text-xs border border-gray-300 rounded px-1 py-1" />
                                    </td>
                                    <td className="px-2 py-2 border-r">
                                        <input type="text" className="w-full text-xs border border-gray-300 rounded px-1 py-1" />
                                    </td>
                                    <td className="px-2 py-2 border-r">
                                        <select className="w-full text-xs border border-gray-300 rounded px-1 py-1">
                                            <option>Please Select</option>
                                        </select>
                                    </td>
                                    <td className="px-2 py-2">
                                        <input type="text" className="w-full text-xs border border-gray-300 rounded px-1 py-1" />
                                    </td>
                                </tr>

                                {/* Data Rows */}
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="text-center text-gray-500 py-8">
                                            No data to display.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item, index) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="px-2 py-2 text-center border-r">
                                                <div className="flex justify-center gap-1">
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteEntry(item.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Delete className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 text-center border-r text-xs">{index + 1}</td>
                                            <td className="px-2 py-2 border-r text-xs">{item.name}</td>
                                            <td className="px-2 py-2 text-center border-r text-xs">{item.countryCode}</td>
                                            <td className="px-2 py-2 text-center border-r text-xs">{item.dateOfTransaction}</td>
                                            <td className="px-2 py-2 text-center border-r text-xs">{item.incomeCode}</td>
                                            <td className="px-2 py-2 text-right border-r text-xs">
                                                {parseFloat(item.netIncome || 0).toLocaleString('id-ID', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                            <td className="px-2 py-2 text-right border-r text-xs">
                                                {parseFloat(item.amountInForeignCurrency || 0).toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                            <td className="px-2 py-2 text-right border-r text-xs">
                                                {parseFloat(item.amountInRupiah || 0).toLocaleString('id-ID', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                            <td className="px-2 py-2 text-center border-r text-xs">{item.currency}</td>
                                            <td className="px-2 py-2 text-right text-xs">
                                                {parseFloat(item.taxCreditCalculated || 0).toLocaleString('id-ID', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="bg-gray-50 px-6 py-4 border-t">
                        <div className="grid grid-cols-3 gap-8 text-sm">
                            <div className="text-right">
                                <span className="font-medium">TOTAL NET INCOME (Rupiah)</span>
                                <div className="text-lg font-semibold mt-1">
                                    {totals.netIncome.toLocaleString('id-ID', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-medium">TOTAL TAX PAYABLE/PAID IN OVERSEAS (Rupiah)</span>
                                <div className="text-lg font-semibold mt-1">
                                    {totals.taxPayable.toLocaleString('id-ID', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-medium">TOTAL TAX CREDIT THAT CAN BE CALCULATED (Rupiah)</span>
                                <div className="text-lg font-semibold mt-1">
                                    {totals.taxCredit.toLocaleString('id-ID', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t bg-white">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing 0 to 0 of 0 entries
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">««</button>
                                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">‹</button>
                                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">›</button>
                                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">»»</button>
                                <select className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

export default L2Form;