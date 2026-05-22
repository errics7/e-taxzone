import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowForward, ArrowBack, CheckCircle, Person, Assignment,
    CalendarToday, Add, Edit, Delete, Visibility, GetApp,
    Business, AccountBalance, FilterList, Refresh, Warning,
    Check, Info, PictureAsPdf, Close,
    PictureAsPdfRounded
} from '@mui/icons-material';

import {
    Button,
    CircularProgress,
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Rating,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Tooltip,
    Alert
} from "@mui/material";
import API from "../../../../utils/host.config";
import { selectCurrentSptType } from '../../../../redux/sptSlice';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import generateCompleteSPTPDF from '../../component/generateSPTPDF';

const SptCreationWizard = () => {
    const [currentView, setCurrentView] = useState('list'); // 'list', 'step1', 'step2', 'step3', 'submitted', 'rejected', 'cancelled', 'pending-payment'
    const [selectedTaxType, setSelectedTaxType] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedSpt, setSelectedSpt] = useState(null);
    const [detailDialog, setDetailDialog] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false);



    const currentSptType = useSelector(selectCurrentSptType);

    // isBadan: satu flag tunggal untuk semua keputusan portal
    // Nilai currentSptType dari sptSlice adalah 'company' (BUKAN 'badan')
    // Inilah root cause bug sebelumnya: cek `=== 'badan'` tidak pernah true
    const isBadan = currentSptType === 'company';

    // Dynamic data from API
    const [sptList, setSptList] = useState([]);
    const [submittedSptList, setSubmittedSptList] = useState([]);
    const [rejectedSptList, setRejectedSptList] = useState([]);
    const [cancelledSptList, setCancelledSptList] = useState([]);
    const [pendingPaymentSptList, setPendingPaymentSptList] = useState([]);
    const [taxpayerData, setTaxpayerData] = useState(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    // const isMountedRef = useRef(true);


    // Generate BPE PDF using jsPDF
    const generateBpePdf = (spt) => {
        try {
            const doc = new jsPDF();

            // Set font
            doc.setFont('helvetica');

            // Header - Government Logo and Title
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('KEMENTERIAN KEUANGAN REPUBLIK INDONESIA', 105, 20, { align: 'center' });
            doc.text('DIREKTORAT JENDERAL PAJAK', 105, 27, { align: 'center' });
            doc.text('KANTOR WILAYAH DJP JAKARTA SELATAN II', 105, 34, { align: 'center' });
            doc.text('KANTOR PELAYANAN PAJAK PRATAMA JAKARTA JAGAKARSA', 105, 41, { align: 'center' });

            // Contact info
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text('JALAN T.B. SIMATUPANG NO.39, JAKARTA SELATAN, 12540', 105, 48, { align: 'center' });
            doc.text('TELEPON (021) 27870602; FAKSIMILE (021) 27870606; SITUS www.pajak.go.id', 105, 53, { align: 'center' });
            doc.text('LAYANAN INFORMASI DAN PENGADUAN KRING PAJAK (021) 1500200 SUREL pengaduan@pajak.go.id; informasi@pajak.go.id', 105, 58, { align: 'center' });

            // Line separator
            doc.line(20, 65, 190, 65);

            // Yellow box - BUKTI PENERIMAAN ELEKTRONIK
            doc.setFillColor(255, 255, 0); // Yellow background
            doc.rect(20, 75, 170, 12, 'F');
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('BUKTI PENERIMAAN ELEKTRONIK', 105, 83, { align: 'center' });

            // Document number and date
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            const currentYear = spt.tax_year || new Date().getFullYear();
            const docNumber = `BPE-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}/KPP.3009/${currentYear}`;
            doc.text(`Nomor: ${docNumber}`, 105, 100, { align: 'center' });
            doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`, 105, 110, { align: 'center' });

            // Table with proper borders
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            // Table coordinates
            const tableTop = 130;
            const tableLeft = 20;
            const tableWidth = 170;
            const tableHeight = 60;
            const middleX = tableLeft + (tableWidth / 2);
            const rowHeight = 15;

            // Draw main table border
            doc.rect(tableLeft, tableTop, tableWidth, tableHeight);

            // Draw vertical line in the middle
            doc.line(middleX, tableTop, middleX, tableTop + tableHeight);

            // Draw horizontal lines for each row
            for (let i = 1; i < 4; i++) {
                const y = tableTop + (i * rowHeight);
                doc.line(tableLeft, y, tableLeft + tableWidth, y);
            }

            // Row positions
            const row1Y = tableTop + 10;
            const row2Y = tableTop + 25;
            const row3Y = tableTop + 40;
            const row4Y = tableTop + 55;

            // Left column text positions
            const leftTextX = tableLeft + 5;
            const leftColonX = tableLeft + 38;
            const leftValueX = tableLeft + 50;

            // Right column text positions  
            const rightTextX = middleX + 5;
            const rightColonX = middleX + 40;
            const rightValueX = middleX + 55;

            // Left column data
            doc.text('NPWP', leftTextX, row1Y);
            doc.text(`: ${taxpayerData?.nik}`, leftColonX, row1Y);

            doc.text('Nama Wajib Pajak', leftTextX, row2Y);
            // doc.text(':', leftColonX, row2Y);
            doc.text(`: ${taxpayerData?.full_name}`, leftColonX, row2Y);

            doc.text('Jenis SPT', leftTextX, row3Y);
            // doc.text(':', leftColonX, row3Y);
            doc.text(': Personal Income Tax Return', leftColonX, row3Y);

            doc.text('Status SPT', leftTextX, row4Y);
            // doc.text(':', leftColonX, row4Y);
            doc.text(': Normal', leftColonX, row4Y);

            // Right column data
            doc.text('Tanggal Terima SPT', rightTextX, row1Y);
            // doc.text(':', rightColonX, row1Y);
            doc.text(`: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`, rightColonX, row1Y);

            doc.text('Tahun Pajak', rightTextX, row2Y);
            // doc.text(':', rightColonX, row2Y);
            doc.text(": " + currentYear.toString(), rightColonX, row2Y);

            doc.text('Masa Pajak', rightTextX, row3Y);
            // doc.text(':', rightColonX, row3Y);
            doc.text(`: ${currentYear} Januari - Desember`, rightColonX, row3Y);

            doc.text('Saluran', rightTextX, row4Y);
            // doc.text(':', rightColonX, row4Y);
            doc.text(': Portal Wajib Pajak', rightColonX, row4Y);

            // Save the PDF
            doc.save(`BPE_SPT_${currentYear}_${spt.id}.pdf`);
            setSuccess('BPE berhasil didownload');

        } catch (error) {
            console.error('Error generating BPE PDF:', error);
            setError('Gagal generate BPE PDF');
        }
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('xtoken') || sessionStorage.getItem('xtoken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const fetchSptList = async (page = 1, status = null) => {
        try {
            setLoading(true);
            // FIX: endpoint sesuai portal aktif
            // isBadan=true  → /api/v2/spt-tahunan-badan/my-list
            // isBadan=false → /api/v2/spt-tahunan/my-list
            const baseEndpoint = isBadan
                ? `${API.HOST}/api/v2/spt-tahunan-badan/my-list`
                : `${API.HOST}/api/v2/spt-tahunan/my-list`;
            let url = `${baseEndpoint}?page=${page}&limit=${pagination.limit}`;
            if (status) {
                url += `&status=${status}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const result = await response.json();
            if (result.success) {
                const sptData = result.data.spt_list || [];

                // Categorize SPTs based on status
                const draftSpts = sptData.filter(spt =>
                    spt.status?.toLowerCase() === 'draft' ||
                    spt.status?.toLowerCase() === 'dibuat' ||
                    !spt.status
                );

                // PERBAIKAN: Exclude pending_payment dari submitted list
                const submittedSpts = sptData.filter(spt => {
                    const status = spt.status?.toLowerCase();
                    return status &&
                        status !== 'draft' &&
                        status !== 'dibuat' &&
                        status !== 'pending_payment' &&
                        status !== 'pending-payment' &&
                        status !== 'menunggu-pembayaran';
                });

                const rejectedSpts = sptData.filter(spt =>
                    spt.status?.toLowerCase() === 'rejected' ||
                    spt.status?.toLowerCase() === 'ditolak'
                );

                const cancelledSpts = sptData.filter(spt =>
                    spt.status?.toLowerCase() === 'cancelled' ||
                    spt.status?.toLowerCase() === 'dibatalkan'
                );

                const pendingPaymentSpts = sptData.filter(spt =>
                    spt.status?.toLowerCase() === 'pending_payment' ||
                    spt.status?.toLowerCase() === 'pending-payment' ||
                    spt.status?.toLowerCase() === 'menunggu-pembayaran'
                );

                // Set data based on current view
                if (currentView === 'list' || !status) {
                    setSptList(draftSpts);
                }
                setSubmittedSptList(submittedSpts);
                setRejectedSptList(rejectedSpts);
                setCancelledSptList(cancelledSpts);
                setPendingPaymentSptList(pendingPaymentSpts);

                setPagination(result.data.pagination || pagination);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error fetching SPT list:', error);
            setError('Gagal mengambil data SPT');
        } finally {
            setLoading(false);
        }
    };

    // Fetch taxpayer profile
    const fetchTaxpayerProfile = async () => {
        try {
            const response = await fetch(`${API.HOST}/api/v2/taxpayer/profile`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const result = await response.json();
            if (result.success) {
                setTaxpayerData(result.data);
            }
        } catch (error) {
            console.error('Error fetching taxpayer profile:', error);
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'submitted': return 'Menunggu Penilaian';
            case 'approved': return 'Siap Dinilai'; // Added approved status
            case 'graded': return 'Sudah Dinilai';
            case 'needs_revision': return 'Perlu Revisi';
            case 'draft': return 'Draft';
            default: return status;
        }
    };

    const getGridTemplate = (viewType) => {
        if (viewType === 'list' || viewType === 'submitted') {
            return '120px 1fr 1fr 1fr 1fr 1fr 1fr 1fr'; // Aksi (120px) + 7 kolom data (1fr each)
        }
        return '1fr 1fr 1fr 1fr 1fr 1fr 1fr'; // 7 kolom data tanpa aksi
    };

    // Create SPT
    const createSpt = async () => {
        try {
            setLoading(true);

            // Check if this is a correction/amendment (pembetulan)
            if (selectedModel === 'AMENDMENT') {
                // For amendments, redirect directly to form without creating new SPT
                setSuccess('Redirecting ke form pembetulan SPT...');

                const existingSpt = sptList.find(spt =>
                    spt.tax_year === parseInt(selectedPeriod)
                );

                // Reset wizard
                setSelectedTaxType('');
                setSelectedPeriod('');
                setSelectedModel('');
                setCurrentView('list');

                // FIX: redirect berdasarkan isBadan — bukan currentSptType === 'badan' (tidak pernah true)
                setTimeout(() => {
                    if (isBadan) {
                        window.location.href = `/home/spt-tahunan-badan?sptId=${existingSpt?.id}`;
                    } else {
                        window.location.href = `/home/spt-tahunan-orang-pribadi?sptId=${existingSpt?.id}`;
                    }
                }, 1500);
                return;
            }

            // FIX: endpoint create sesuai portal aktif
            const createEndpoint = isBadan
                ? `${API.HOST}/api/v2/spt-tahunan-badan`
                : `${API.HOST}/api/v2/spt-tahunan`;

            // FIX: payload sesuai portal aktif
            // - Badan: tidak ada source_of_income; backend menetapkan tax_type permanen
            // - Pribadi: source_of_income dari selectedTaxType wizard step 1
            const payload = isBadan
                ? {
                    tax_year: parseInt(selectedPeriod),
                    tax_period: `${selectedPeriod} January - December`,
                    tax_return_model: selectedModel,
                    bookkeeping_type: 'Full Bookkeeping'
                }
                : {
                    tax_year: parseInt(selectedPeriod),
                    tax_period: `${selectedPeriod} January - December`,
                    tax_return_model: selectedModel,
                    bookkeeping_type: 'Simple Bookkeeping',
                    source_of_income: selectedTaxType
                };

            const response = await fetch(createEndpoint, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                setSuccess('SPT berhasil dibuat! Redirecting ke form...');

                // Reset wizard
                setSelectedTaxType('');
                setSelectedPeriod('');
                setSelectedModel('');
                setCurrentView('list');

                // Refresh list
                fetchSptList();

                // FIX: redirect ke form yang sesuai portal aktif
                setTimeout(() => {
                    if (isBadan) {
                        window.location.href = `/home/spt-tahunan-badan?sptId=${result.data.id}`;
                    } else {
                        window.location.href = `/home/spt-tahunan-orang-pribadi?sptId=${result.data.id}`;
                    }
                }, 1500);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error creating SPT:', error);
            setError('Gagal membuat SPT');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (sptId) => {
        setLoading(true);
        try {
            // API endpoint untuk mahasiswa view detail SPT
            const response = await fetch(`${API.HOST}/api/v2/mahasiswa/spt-tahunan/${sptId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const result = await response.json();
            if (result.success) {
                setSelectedSpt(result.data);
                setDetailDialog(true);
            } else {
                setError(result.message || 'Gagal memuat detail SPT');
            }
        } catch (error) {
            console.error('Error loading SPT detail:', error);
            setError('Gagal memuat detail SPT');
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const doc = generateCompleteSPTPDF(selectedSpt);
            const pdfBlob = doc.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // const handleCloseDetailDialog = () => {
    //     // safeSetState(setDetailDialog, false);
    //     if (pdfUrl) {
    //         URL.revokeObjectURL(pdfUrl);
    //         // safeSetState(setPdfUrl, null);
    //     }
    //     // safeSetState(setSelectedSpt, null);
    //     // safeSetState(setIsGenerating, false);
    // };




    // Download SPT PDF
    const downloadSptPdf = async (sptId) => {
        try {
            setLoading(true);
            const response = await fetch(`${API.HOST}/api/v2/spt-tahunan/${sptId}/download`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `SPT_Tahunan_${sptId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                setSuccess('SPT berhasil didownload');
            } else {
                setError('Gagal mendownload SPT');
            }
        } catch (error) {
            console.error('Error downloading SPT:', error);
            setError('Gagal mendownload SPT');
        } finally {
            setLoading(false);
        }
    };

    // Delete SPT function
    const deleteSpt = async (sptId) => {
        try {
            setLoading(true);
            // FIX: endpoint delete sesuai portal aktif
            const deleteEndpoint = isBadan
                ? `${API.HOST}/api/v2/spt-tahunan-badan/${sptId}`
                : `${API.HOST}/api/v2/spt-tahunan/${sptId}`;
            const response = await fetch(deleteEndpoint, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            const result = await response.json();
            if (result.success) {
                setSuccess('SPT berhasil dihapus');
                fetchSptList(); // Refresh the list
            } else {
                setError(result.message || 'Gagal menghapus SPT');
            }
        } catch (error) {
            console.error('Error deleting SPT:', error);
            setError('Gagal menghapus SPT');
        } finally {
            setLoading(false);
        }
    };

    // Submit SPT function (for future use)
    const submitSpt = async (sptId) => {
        try {
            setLoading(true);
            // FIX: endpoint submit sesuai portal aktif
            const submitEndpoint = isBadan
                ? `${API.HOST}/api/v2/spt-tahunan-badan/${sptId}/submit`
                : `${API.HOST}/api/v2/spt-tahunan/${sptId}/submit`;
            const response = await fetch(submitEndpoint, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            const result = await response.json();
            if (result.success) {
                setSuccess('SPT berhasil disubmit');
                fetchSptList(); // Refresh the list
            } else {
                setError(result.message || 'Gagal submit SPT');
            }
        } catch (error) {
            console.error('Error submitting SPT:', error);
            setError('Gagal submit SPT');
        } finally {
            setLoading(false);
        }
    };

    // Handle sidebar navigation
    const handleSidebarNavigation = (view) => {
        setCurrentView(view);
        // Fetch appropriate data based on view
        switch (view) {
            case 'list':
                // Draft SPTs are already loaded
                break;
            case 'submitted':
                // Submitted SPTs are already loaded
                break;
            case 'rejected':
                // Rejected SPTs are already loaded
                break;
            case 'cancelled':
                // Cancelled SPTs are already loaded
                break;
            case 'pending-payment':
                // Pending payment SPTs are already loaded
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        fetchSptList();
        fetchTaxpayerProfile();
    }, []);

    // FIX: reset wizard + refetch saat user ganti portal (isBadan berubah)
    // AMAN: tidak ada fetch loop — dependency tunggal [isBadan] hanya berubah
    // ketika user klik portal switch di Navbar, bukan saat render biasa
    useEffect(() => {
        setSelectedTaxType('');
        setSelectedPeriod('');
        setSelectedModel('');
        setCurrentView('list');
        fetchSptList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBadan]);

    useEffect(() => {
        if (detailDialog && selectedSpt) {
            generatePDF();
        }
    }, [detailDialog, selectedSpt]);

    // useEffect(() => {
    //     return () => {
    //         isMountedRef.current = false;
    //         // Clean up any existing PDF URLs
    //         if (pdfUrl) {
    //             URL.revokeObjectURL(pdfUrl);
    //         }
    //     };
    // }, [pdfUrl]);

    // const safeSetState = (setState, value) => {
    //     if (isMountedRef.current) {
    //         setState(value);
    //     }
    // };


    const canProceed = () => {
        switch (currentView) {
            case 'step1': return selectedTaxType !== '';
            case 'step2': return selectedPeriod !== '';
            case 'step3': return selectedModel !== '';
            default: return false;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'draft': case 'dibuat': return 'bg-yellow-100 text-yellow-800';
            case 'submitted': case 'disubmit': return 'bg-blue-100 text-blue-800';
            case 'approved': case 'disetujui': return 'bg-green-100 text-green-800';
            case 'rejected': case 'ditolak': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Get current list based on view
    const getCurrentSptList = () => {
        switch (currentView) {
            case 'list': return sptList;
            case 'submitted': return submittedSptList;
            case 'rejected': return rejectedSptList;
            case 'cancelled': return cancelledSptList;
            case 'pending-payment': return pendingPaymentSptList;
            default: return [];
        }
    };

    // Get current view title
    const getCurrentViewTitle = () => {
        switch (currentView) {
            case 'list': return 'SPT Belum Disampaikan (Konsep)';
            case 'submitted': return 'SPT Dilaporkan';
            case 'rejected': return 'SPT Ditolak';
            case 'cancelled': return 'SPT Dibatalkan';
            case 'pending-payment': return 'SPT Menunggu Pembayaran';
            default: return 'SPT Belum Disampaikan';
        }
    };

    // Tambahkan fungsi untuk download PDF langsung tanpa view dialog
    const downloadSptPdfDirect = async (spt) => {
        try {
            setLoading(true);

            // Fetch SPT detail data first
            const response = await fetch(`${API.HOST}/api/v2/mahasiswa/spt-tahunan/${spt.id}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const result = await response.json();
            if (result.success) {
                // Generate PDF using the same function as in view dialog
                const doc = generateCompleteSPTPDF(result.data);

                // Download PDF directly
                doc.save(`SPT_Tahunan_${result.data.tax_year}_${spt.id}.pdf`);
                setSuccess('PDF SPT berhasil didownload');
            } else {
                setError(result.message || 'Gagal memuat data SPT');
            }
        } catch (error) {
            console.error('Error downloading SPT PDF:', error);
            setError('Gagal download PDF SPT');
        } finally {
            setLoading(false);
        }
    };
    // Sidebar Component
    const Sidebar = () => (
        <div className="w-64 bg-white min-h-screen border-r border-gray-200">
            <div className="p-4">
                {/* User Info Card */}
                <div className="bg-blue-900 text-white p-4 rounded-lg mb-4">
                    <div className="text-sm font-medium">
                        {taxpayerData?.nik ? `${taxpayerData.nik.substring(0, 4)}xxxxxxxxxxxxx` : '35xxxxxxxxxxxxxxx'}
                    </div>
                    <div className="text-sm mt-1">
                        {taxpayerData?.full_name || 'Eva Monika Septiana'}
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="space-y-1">
                    <div className="text-sm font-medium mb-3 text-gray-800">Surat Pemberitahuan (SPT)</div>

                    <div
                        className={`text-sm px-3 py-2 rounded cursor-pointer transition-colors ${currentView === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                        onClick={() => handleSidebarNavigation('list')}
                    >
                        <div className="flex items-center justify-between">
                            <span>Konsep SPT</span>
                        </div>
                    </div>

                    <div
                        className={`text-sm px-3 py-2 rounded cursor-pointer transition-colors ${currentView === 'pending-payment' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                        onClick={() => handleSidebarNavigation('pending-payment')}
                    >
                        <div className="flex items-center justify-between">
                            <span>SPT Menunggu Pembayaran</span>
                        </div>
                    </div>

                    <div
                        className={`text-sm px-3 py-2 rounded cursor-pointer transition-colors ${currentView === 'submitted' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                        onClick={() => handleSidebarNavigation('submitted')}
                    >
                        <div className="flex items-center justify-between">
                            <span>SPT Dilaporkan</span>
                        </div>
                    </div>

                    <Dialog
                        open={detailDialog}
                        onClose={() => {
                            setDetailDialog(false);
                            if (pdfUrl) {
                                URL.revokeObjectURL(pdfUrl);
                                setPdfUrl(null);
                            }
                        }}
                        // onClose={handleCloseDetailDialog}
                        maxWidth="lg"
                        fullWidth
                        PaperProps={{
                            sx: {
                                maxHeight: '95vh',
                                height: '95vh'
                            }
                        }}
                    >
                        <DialogTitle sx={{ pb: 1 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">
                                    SPT Tahunan PPh - {selectedSpt?.tax_year}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <IconButton
                                        onClick={() => {
                                            setDetailDialog(false);
                                            if (pdfUrl) {
                                                URL.revokeObjectURL(pdfUrl);
                                                setPdfUrl(null);
                                            }
                                        }}
                                        size="small"
                                    >
                                        <Close />
                                    </IconButton>
                                </Box>
                            </Box>
                        </DialogTitle>

                        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                            {selectedSpt && (
                                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {/* PDF Viewer */}
                                    <Box sx={{ flex: 1, position: 'relative' }}>
                                        {isGenerating ? (
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%',
                                                flexDirection: 'column',
                                                gap: 2
                                            }}>
                                                <CircularProgress />
                                                <Typography variant="body2" color="textSecondary">
                                                    Generating PDF...
                                                </Typography>
                                            </Box>
                                        ) : pdfUrl ? (
                                            <iframe
                                                src={pdfUrl}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    border: 'none',
                                                    display: 'block'
                                                }}
                                                title={`SPT Tahunan ${selectedSpt.tax_year}`}
                                            />
                                        ) : (
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%'
                                            }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Failed to generate PDF
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </DialogContent>
                    </Dialog>

                    <div
                        className={`text-sm px-3 py-2 rounded cursor-pointer transition-colors ${currentView === 'rejected' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                        onClick={() => handleSidebarNavigation('rejected')}
                    >
                        <div className="flex items-center justify-between">
                            <span>SPT Ditolak</span>
                        </div>
                    </div>

                    <div
                        className={`text-sm px-3 py-2 rounded cursor-pointer transition-colors ${currentView === 'cancelled' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                        onClick={() => handleSidebarNavigation('cancelled')}
                    >
                        <div className="flex items-center justify-between">
                            <span>SPT Dibatalkan</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Step Navigation Component
    const StepNavigation = ({ currentStep }) => (
        <div className="w-full mb-12">
            {/* Step Circles Row */}
            <div className="flex items-center justify-center mb-4">
                {/* Step 1 */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${currentStep >= 1 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                    1
                </div>

                {/* Line 1-2 */}
                <div className={`h-1 w-32 mx-4 ${currentStep > 1 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>

                {/* Step 2 */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${currentStep >= 2 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                    2
                </div>

                {/* Line 2-3 */}
                <div className={`h-1 w-32 mx-4 ${currentStep > 2 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>

                {/* Step 3 */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${currentStep >= 3 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                    3
                </div>
            </div>

            {/* Step Labels Row */}
            <div className="flex items-center justify-center">
                <div className={`text-center w-40 text-sm ${currentStep >= 1 ? 'text-gray-900 font-medium' : 'text-gray-400'
                    }`}>
                    Pilih Jenis Pajak
                </div>

                <div className="w-32"></div>

                <div className={`text-center w-40 text-sm ${currentStep >= 2 ? 'text-gray-900 font-medium' : 'text-gray-400'
                    }`}>
                    Pilih periode pelaporan SPT
                </div>

                <div className="w-32"></div>

                <div className={`text-center w-40 text-sm ${currentStep >= 3 ? 'text-gray-900 font-medium' : 'text-gray-400'
                    }`}>
                    Pilih Jenis SPT
                </div>
            </div>
        </div>
    );

    // Step 1 View
    const Step1View = () => (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">Buat Konsep SPT</h1>
                    <StepNavigation currentStep={1} />

                    <div className="text-left mb-8">
                        <h2 className="text-lg font-medium text-gray-800">Langkah 1. Pilih jenis SPT yang akan dilaporkan</h2>
                    </div>

                    <div className="bg-white rounded-lg p-8 mb-8">
                        <div className="flex justify-center">
                            <div className="w-80">
                                <div className="border-2 border-yellow-400 rounded-lg p-6 bg-yellow-50">
                                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">{isBadan ? "PPh Badan" : "PPh Orang Pribadi"}</h3>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="taxType"
                                            value={isBadan ? 'Business Activities' : 'Pekerjaan'}
                                            checked={selectedTaxType === (isBadan ? 'Business Activities' : 'Pekerjaan')}
                                            onChange={(e) => setSelectedTaxType(e.target.value)}
                                            className="mr-3 h-4 w-4 text-yellow-400 focus:ring-yellow-300"
                                        />
                                        <span className="text-gray-700">{isBadan ? "PPh Badan" : "PPh Orang Pribadi"}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => setCurrentView('step2')}
                            disabled={!canProceed()}
                            className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Lanjut
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Step 2 View
    const Step2View = () => (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">Buat Konsep SPT</h1>
                    <StepNavigation currentStep={2} />

                    <div className="text-left mb-8">
                        <h2 className="text-lg font-medium text-gray-800">Langkah 2. Pilih periode pelaporan SPT</h2>
                    </div>

                    <div className="bg-white rounded-lg p-8 mb-8">
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="text-sm text-gray-600 mb-6">
                                <div className="flex items-center">
                                    <span className="font-medium w-64">Jenis Surat Pemberitahuan Pajak</span>
                                    <span className="mx-4">:</span>
                                    <span className="font-bold">{isBadan ? 'SPT Tahunan PPh Wajib Pajak Badan' : 'SPT Tahunan PPh Wajib Pajak Orang Pribadi'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">Jenis Periode SPT *</label>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="periodType"
                                                value="SPT Bagian Tahun Pajak"
                                                className="mr-3 h-4 w-4"
                                            />
                                            <span className="text-sm">SPT Bagian Tahun Pajak</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="periodType"
                                                value="SPT Tahunan"
                                                defaultChecked
                                                className="mr-3 h-4 w-4"
                                            />
                                            <span className="text-sm">SPT Tahunan</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">Periode dan Tahun Pajak *</label>
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) => setSelectedPeriod(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Pilih Periode dan Tahun Pajak</option>
                                        <option value="2025">Januari-Desember 2025</option>
                                        <option value="2024">Januari-Desember 2024</option>
                                        <option value="2023">Januari-Desember 2023</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setCurrentView('step1')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Kembali
                        </button>
                        <button
                            onClick={() => setCurrentView('step3')}
                            disabled={!canProceed()}
                            className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Lanjut
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Step 3 View
    const Step3View = () => (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">Buat Konsep SPT</h1>
                    <StepNavigation currentStep={3} />

                    <div className="text-left mb-8">
                        <h2 className="text-lg font-medium text-gray-800">Langkah 3. Pilih jenis SPT</h2>
                    </div>

                    <div className="bg-white rounded-lg p-8 mb-8">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {/* Info Display */}
                            <div className="grid grid-cols-1 gap-4 text-sm">
                                <div className="flex items-center">
                                    <span className="font-medium w-64">Jenis Surat Pemberitahuan Pajak</span>
                                    <span className="mx-4">:</span>
                                    <span>{isBadan ? 'SPT Tahunan PPh Wajib Pajak Badan' : 'SPT Tahunan PPh Wajib Pajak Orang Pribadi'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium w-64">Periode dan Tahun Pajak</span>
                                    <span className="mx-4">:</span>
                                    <span className="font-bold">{selectedPeriod ? `Januari-Desember ${selectedPeriod}` : 'Januari-Desember 2025'}</span>
                                </div>
                            </div>

                            {/* Model SPT Selection */}
                            <div className="pt-8">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Model SPT *</label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Pilih Model SPT</option>
                                    <option value="NORMAL">Normal</option>
                                    <option value="AMENDMENT">Pembetulan</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setCurrentView('step2')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Kembali
                        </button>
                        <button
                            onClick={createSpt}
                            disabled={!canProceed() || loading}
                            className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            {loading ? 'Creating...' : 'Buat Konsep SPT'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Enhanced Generic SPT List View
    // ========================================================
    // COPY PASTE KOMPONEN EnhancedSptListView YANG SUDAH FIX
    // ========================================================
    // Ganti SELURUH komponen EnhancedSptListView dengan kode di bawah ini

    const EnhancedSptListView = ({ title, sptData, showCreateButton = false, emptyMessage, emptySubtitle, viewType }) => {
        // Helper function untuk grid template - HARUS DI DALAM KOMPONEN!
        const getGridTemplate = () => {
            if (viewType === 'list' || viewType === 'submitted') {
                return '120px 1fr 1fr 1fr 1fr 1fr 1fr 1fr';
            }
            return '1fr 1fr 1fr 1fr 1fr 1fr 1fr';
        };

        return (
            <div className="min-h-screen bg-gray-50 flex">
                <Sidebar />

                <div className="flex-1">
                    {/* Header */}
                    <div className="bg-yellow-400 text-blue-900 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <Assignment className="w-6 h-6 text-blue-900" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">{title}</h1>
                                    <p className="text-sm opacity-90">Total: {sptData.length} SPT</p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="hidden md:flex gap-4">
                                <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                                    <div className="text-lg font-bold">{sptData.length}</div>
                                    <div className="text-xs">Total SPT</div>
                                </div>
                                {viewType === 'list' && (
                                    <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                                        <div className="text-lg font-bold">
                                            {sptData.filter(spt => spt.tax_year === new Date().getFullYear()).length}
                                        </div>
                                        <div className="text-xs">Tahun Ini</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Action Buttons */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-3">
                                {showCreateButton && (
                                    <button
                                        onClick={() => setCurrentView('step1')}
                                        className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Add className="w-4 h-4" />
                                        Buat Konsep SPT
                                    </button>
                                )}

                                {/* Bulk Actions for draft SPTs */}
                                {viewType === 'list' && sptData.length > 0 && (
                                    <div className="flex gap-2">
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                            Submit Semua
                                        </button>
                                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                            Hapus Terpilih
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Filter and Search */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Cari SPT..."
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Semua Tahun</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchSptList()}
                                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                    title="Refresh Data"
                                >
                                    <Refresh className="w-4 h-4" />
                                </button>
                                <button
                                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 bg-gray-100 transition-colors"
                                    title="Export Excel"
                                >
                                    <GetApp className="w-4 h-4" />
                                </button>
                                <button
                                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 bg-green-100 transition-colors"
                                    title="Export PDF"
                                >
                                    <PictureAsPdf className="w-4 h-4 text-green-600" />
                                </button>
                                <button
                                    className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                                    title="Filter"
                                >
                                    <FilterList className="w-4 h-4" />
                                </button>
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Tampilan:</span>
                                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                    <button className="px-3 py-1 text-sm bg-blue-600 text-white">Table</button>
                                    <button className="px-3 py-1 text-sm hover:bg-gray-100">Card</button>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            {/* Table Header */}
                            <div className="bg-yellow-400">
                                <div
                                    className="grid gap-4 p-4 text-sm font-medium text-gray-800"
                                    style={{ gridTemplateColumns: getGridTemplate() }}
                                >
                                    {(viewType === 'list' || viewType === 'submitted') && (
                                        <div className='flex items-center'>Aksi</div>
                                    )}
                                    <div className="flex items-center">
                                        {viewType === 'list' && (
                                            <input type="checkbox" className="mr-2" />
                                        )}
                                        <span className="flex items-center gap-1">
                                            Jenis Pajak
                                            <span className="text-xs cursor-pointer">↑↓</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        Jenis SPT
                                        <span className="text-xs cursor-pointer">↑↓</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        Masa Pajak
                                        <span className="text-xs cursor-pointer">↑↓</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        Status
                                        <span className="text-xs cursor-pointer">↑↓</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        Tanggal Dibuat
                                        <span className="text-xs cursor-pointer">↑↓</span>
                                    </div>
                                    <div>Model SPT</div>
                                    <div>Progress</div>
                                </div>
                            </div>

                            {/* Advanced Filters Row */}
                            <div className="border-b bg-gray-50">
                                <div
                                    className="grid gap-4 p-3"
                                    style={{ gridTemplateColumns: getGridTemplate() }}
                                >
                                    {(viewType === 'list' || viewType === 'submitted') && (
                                        <div className="flex justify-center items-center">
                                            <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                                                <FilterList className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500">
                                        <option>Semua Jenis Pajak</option>
                                        <option>PPh Orang Pribadi</option>
                                        <option>PPh Badan</option>
                                    </select>
                                    <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500">
                                        <option>Semua Jenis SPT</option>
                                        <option>SPT Tahunan</option>
                                        <option>SPT Masa</option>
                                    </select>
                                    <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500">
                                        <option>Semua Masa Pajak</option>
                                        <option>2025</option>
                                        <option>2024</option>
                                        <option>2023</option>
                                    </select>
                                    <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500">
                                        <option>Semua Status</option>
                                        <option>Draft</option>
                                        <option>Submitted</option>
                                        <option>Approved</option>
                                        <option>Rejected</option>
                                    </select>
                                    <input
                                        type="date"
                                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500">
                                        <option>Semua Model</option>
                                        <option>Normal</option>
                                        <option>Pembetulan</option>
                                    </select>
                                    <div></div>
                                </div>
                            </div>

                            {/* Table Content */}
                            <div className="divide-y divide-gray-200">
                                {loading ? (
                                    <div className="p-12 text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-500 text-lg">Loading SPT data...</p>
                                    </div>
                                ) : sptData.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Assignment className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">{emptyMessage}</h3>
                                        <p className="text-gray-500 mb-6 max-w-md mx-auto">{emptySubtitle}</p>
                                        {showCreateButton && (
                                            <button
                                                onClick={() => setCurrentView('step1')}
                                                className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                                            >
                                                <Add className="w-5 h-5" />
                                                Buat SPT Pertama
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    sptData.map((spt, index) => (
                                        <div
                                            key={spt.id}
                                            className="grid gap-4 p-4 hover:bg-gray-50 transition-colors"
                                            style={{ gridTemplateColumns: getGridTemplate() }}
                                        >
                                            {viewType === 'list' && (
                                                <div className='flex items-center gap-2'>
                                                    <button
                                                        onClick={() => window.location.href = isBadan
                                                            ? `/home/spt-tahunan-badan?sptId=${spt.id}`
                                                            : `/home/spt-tahunan-orang-pribadi?sptId=${spt.id}`
                                                        }
                                                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                        title="Edit SPT"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Apakah Anda yakin ingin menghapus SPT ini?')) {
                                                                deleteSpt(spt.id);
                                                            }
                                                        }}
                                                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                        title="Hapus SPT"
                                                    >
                                                        <Delete className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}

                                            {viewType === 'submitted' && (
                                                <div className='flex items-center gap-2'>
                                                    <button
                                                        onClick={() => handleViewDetail(spt.id)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                        title="Lihat Detail SPT"
                                                    >
                                                        <Visibility className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => generateBpePdf(spt)}
                                                        className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                                                        title="Download BPE"
                                                    >
                                                        <GetApp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => downloadSptPdfDirect(spt)}
                                                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                        title="Download SPT"
                                                    >
                                                        <PictureAsPdf className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}

                                            <div className="flex items-center">
                                                {viewType === 'list' && (
                                                    <input type="checkbox" className="mr-2" />
                                                )}
                                                <span className="text-sm font-medium">
                                                    {currentSptType === 'company' ? 'PPh Badan' : 'PPh Orang Pribadi'}
                                                </span>
                                            </div>
                                            <div className="text-sm">SPT Tahunan</div>
                                            <div className="text-sm font-medium">{spt.tax_period || `Januari-Desember ${spt.tax_year}`}</div>
                                            <div className="text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(spt.status)}`}>
                                                    {spt.status || 'Draft'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">{formatDate(spt.created_at)}</div>
                                            <div className="text-sm">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                    {spt.tax_return_model || 'Normal'}
                                                </span>
                                            </div>
                                            <div className="text-sm">
                                                {viewType === 'list' ? (
                                                    <span className="text-xs text-gray-500">In progress</span>
                                                ) : (
                                                    <span className="text-xs text-gray-500">Selesai</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Enhanced Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-700">
                                            <span>
                                                Menampilkan {((pagination.page - 1) * pagination.limit) + 1} hingga{' '}
                                                {Math.min(pagination.page * pagination.limit, pagination.total)} dari{' '}
                                                {pagination.total} data
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => fetchSptList(1)}
                                                disabled={pagination.page <= 1}
                                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                            >
                                                ‹‹
                                            </button>
                                            <button
                                                onClick={() => fetchSptList(pagination.page - 1)}
                                                disabled={pagination.page <= 1}
                                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                            >
                                                ‹
                                            </button>

                                            {/* Page Numbers */}
                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                const pageNum = pagination.page - 2 + i;
                                                if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => fetchSptList(pageNum)}
                                                        className={`px-3 py-1 rounded text-sm transition-colors ${pageNum === pagination.page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'border border-gray-300 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => fetchSptList(pagination.page + 1)}
                                                disabled={pagination.page >= pagination.totalPages}
                                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                            >
                                                ›
                                            </button>
                                            <button
                                                onClick={() => fetchSptList(pagination.totalPages)}
                                                disabled={pagination.page >= pagination.totalPages}
                                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                            >
                                                ››
                                            </button>

                                            <select
                                                value={pagination.limit}
                                                onChange={(e) => {
                                                    setPagination(prev => ({ ...prev, limit: parseInt(e.target.value) }));
                                                    fetchSptList(1);
                                                }}
                                                className="text-sm border border-gray-300 rounded px-2 py-1 ml-4 focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value={10}>10 per halaman</option>
                                                <option value={25}>25 per halaman</option>
                                                <option value={50}>50 per halaman</option>
                                                <option value={100}>100 per halaman</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Update all view components to use the enhanced version
    const ListView = () => (
        <EnhancedSptListView
            title="SPT Belum Disampaikan (Konsep)"
            sptData={getCurrentSptList()}
            showCreateButton={true}
            emptyMessage="Belum Ada SPT"
            emptySubtitle="Anda belum memiliki SPT yang dibuat. Mulai buat SPT pertama Anda untuk memenuhi kewajiban perpajakan."
            viewType="list"
        />
    );

    const SubmittedView = () => (
        <EnhancedSptListView
            title="SPT Dilaporkan"
            sptData={getCurrentSptList()}
            showCreateButton={false}
            emptyMessage="Belum Ada SPT Dilaporkan"
            emptySubtitle="Belum ada SPT yang telah dilaporkan. SPT yang sudah disubmit akan muncul di sini."
            viewType="submitted"
        />
    );

    const RejectedView = () => (
        <EnhancedSptListView
            title="SPT Ditolak"
            sptData={getCurrentSptList()}
            showCreateButton={false}
            emptyMessage="Belum Ada SPT Ditolak"
            emptySubtitle="Belum ada SPT yang ditolak. SPT yang ditolak oleh sistem akan muncul di sini."
            viewType="rejected"
        />
    );

    const CancelledView = () => (
        <EnhancedSptListView
            title="SPT Dibatalkan"
            sptData={getCurrentSptList()}
            showCreateButton={false}
            emptyMessage="Belum Ada SPT Dibatalkan"
            emptySubtitle="Belum ada SPT yang dibatalkan. SPT yang dibatalkan akan muncul di sini."
            viewType="cancelled"
        />
    );

    const PendingPaymentView = () => (
        <EnhancedSptListView
            title="SPT Menunggu Pembayaran"
            sptData={getCurrentSptList()}
            showCreateButton={false}
            emptyMessage="Belum Ada SPT Menunggu Pembayaran"
            emptySubtitle="Belum ada SPT yang menunggu pembayaran. SPT dengan status menunggu pembayaran akan muncul di sini."
            viewType="pending-payment"
        />
    );

    // Alerts Component
    const Alert = ({ type, message, onClose }) => {
        if (!message) return null;

        const getAlertStyles = () => {
            switch (type) {
                case 'error': return 'bg-red-50 border-red-200 text-red-800';
                case 'success': return 'bg-green-50 border-green-200 text-green-800';
                case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
                default: return 'bg-blue-50 border-blue-200 text-blue-800';
            }
        };

        const getIcon = () => {
            switch (type) {
                case 'error': return <Warning className="h-5 w-5 text-red-500" />;
                case 'success': return <Check className="h-5 w-5 text-green-500" />;
                default: return <Info className="h-5 w-5 text-blue-500" />;
            }
        };

        return (
            <div className={`fixed top-4 right-4 z-50 border rounded-lg p-4 max-w-md ${getAlertStyles()}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">{getIcon()}</div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600">
                            ×
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // Main Render Logic
    const renderCurrentView = () => {
        switch (currentView) {
            case 'step1': return <Step1View />;
            case 'step2': return <Step2View />;
            case 'step3': return <Step3View />;
            case 'submitted': return <SubmittedView />;
            case 'rejected': return <RejectedView />;
            case 'cancelled': return <CancelledView />;
            case 'pending-payment': return <PendingPaymentView />;
            default: return <ListView />;
        }
    };

    return (
        <div className="relative -mt-[80px]">
            {renderCurrentView()}

            <Alert type="error" message={error} onClose={() => setError('')} />
            <Alert type="success" message={success} onClose={() => setSuccess('')} />
        </div>
    );
};

export default SptCreationWizard;