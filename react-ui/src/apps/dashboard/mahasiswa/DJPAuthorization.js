import { AlignVerticalCenter, Check, Download, Error, FileOpen, Refresh, Warning } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import API from "../../../utils/host.config";

const DJPAuthorizationForm = () => {
  const [currentView, setCurrentView] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requestData, setRequestData] = useState(null);
  
  const [formData, setFormData] = useState({
    requestChannel: 'daring',
    requestDate: new Date().toISOString().split('T')[0],
    nikNpwp: '',
    taxpayerName: '',
    address: '',
    email: '',
    handphone: '',
    certificateType: 'kode_otorisasi_djp',
    passphrase: '',
    confirmPassphrase: '',
    statement: false
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [userStatus, setUserStatus] = useState(null);

  // API Configuration
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('xtoken') || sessionStorage.getItem('xtoken');
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  // Check user's existing DJP status on component mount
  useEffect(() => {
    checkUserDJPStatus();
  }, []);

  const checkUserDJPStatus = async () => {
    try {
      const response = await fetch(`${API.HOST}/api/v2/djp/user-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUserStatus(result.data);
        if (result.data.status === 'approved') {
          setRequestData(result.data);
          setCurrentView('success');
        } else if (result.data.status === 'pending') {
          setCurrentView('pending');
        }
      }
    } catch (error) {
      console.log('No existing DJP request found');
    }
  };

  const getTaxpayerByNIK = async (nikNpwp) => {
    try {
      const response = await fetch(`${API.HOST}/api/v2/djp/taxpayer/${nikNpwp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error('Terjadi kesalahan saat mencari data taxpayer');
    }
  };

  const createDJPAuthorization = async (submitData) => {
    try {
      const response = await fetch(`${API.HOST}/api/v2/djp/authorization`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: submitData
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error('Terjadi kesalahan pada sistem');
    }
  };

  const downloadFile = async (endpoint, filename) => {
    try {
      const response = await fetch(`${API.HOST}/api/v2/djp/download/${endpoint}/${requestData.id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess(`File ${filename} berhasil diunduh`);
    } catch (error) {
      throw new Error('Gagal mengunduh file');
    }
  };

  // Event Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleNIKLookup = async (nikNpwp) => {
    if (nikNpwp.length >= 16) {
      setLoading(true);
      setError('');
      
      try {
        const response = await getTaxpayerByNIK(nikNpwp);
        
        if (response.success) {
          setFormData(prev => ({
            ...prev,
            taxpayerName: response.data.taxpayer_name,
            address: response.data.address,
            email: response.data.email,
            handphone: response.data.handphone
          }));
          setSuccess('Data mahasiswa ditemukan dan berhasil dimuat');
        } else {
          setError(response.message || 'Data mahasiswa tidak ditemukan');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setError('');
    
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setError('Ukuran file maksimal 2MB');
        e.target.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Format file harus JPG, JPEG, atau PNG');
        e.target.value = '';
        return;
      }

      setUploadedFile(file);
      setUploadStatus(`✓ File ${file.name} berhasil dipilih! (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  };

  const validateForm = () => {
    const requiredFields = ['nikNpwp', 'email', 'handphone', 'passphrase', 'confirmPassphrase'];
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Field ${field} wajib diisi`);
        return false;
      }
    }

    if (formData.passphrase !== formData.confirmPassphrase) {
      setError('Passphrase tidak cocok');
      return false;
    }

    if (formData.passphrase.length < 6) {
      setError('Passphrase minimal 6 karakter');
      return false;
    }

    if (!formData.statement) {
      setError('Anda harus menyetujui pernyataan');
      return false;
    }

    if (!uploadedFile) {
      setError('Foto identitas wajib diunggah');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      if (uploadedFile) {
        submitData.append('identity_photo', uploadedFile);
      }

      const response = await createDJPAuthorization(submitData);
      
      if (response.success) {
        setRequestData(response.data);
        setSuccess(response.message);
        
        if (response.data.status === 'approved') {
          setCurrentView('success');
        } else {
          setCurrentView('pending');
        }
      } else {
        setError(response.message || 'Terjadi kesalahan saat memproses permintaan');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    setLoading(true);
    setError('');
    try {
      await downloadFile('receipt', `Bukti_Tanda_Terima_${requestData.authorization_code}.pdf`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    setLoading(true);
    setError('');
    try {
      await downloadFile('certificate', `Surat_Penerbitan_Sertifikat_${requestData.authorization_code}.pdf`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      requestChannel: 'daring',
      requestDate: new Date().toISOString().split('T')[0],
      nikNpwp: '',
      taxpayerName: '',
      address: '',
      email: '',
      handphone: '',
      certificateType: 'kode_otorisasi_djp',
      passphrase: '',
      confirmPassphrase: '',
      statement: false
    });
    setUploadedFile(null);
    setUploadStatus('');
    setError('');
    setSuccess('');
    setRequestData(null);
    setUserStatus(null);
    setCurrentView('profile');
  };

  // Alert Component
  const Alert = ({ type, message, onClose }) => {
    const getAlertStyles = () => {
      switch (type) {
        case 'error':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'success':
          return 'bg-green-50 border-green-200 text-green-800';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        default:
          return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    };

    const getIcon = () => {
      switch (type) {
        case 'error':
          return <Error className="h-5 w-5 text-red-500" />;
        case 'success':
          return <Check className="h-5 w-5 text-green-500" />;
        default:
          return <Error className="h-5 w-5 text-blue-500" />;
      }
    };

    return (
      <div className={`border rounded-lg p-4 mb-4 ${getAlertStyles()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  };

  // Loading Overlay
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <div className="flex items-center gap-3">
          <Refresh className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-700">Memproses...</span>
        </div>
      </div>
    </div>
  );

  // Profile View
  if (currentView === 'profile') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">Profil Mahasiswa</h1>
        <p className="text-gray-600 mb-4">
          Klik tombol di bawah untuk memulai proses permintaan kode otorisasi DJP.
        </p>
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
        
        <button
          onClick={() => setCurrentView('form')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <FileOpen className="h-5 w-5" />
          Permintaan Kode Otorisasi Sertifikat Elektronik
        </button>
      </div>
    );
  }

  // Pending View
  if (currentView === 'pending') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">
          Status Permintaan Kode Otorisasi DJP
        </h1>
        
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          <div className="flex items-center gap-2">
            <Warning className="h-5 w-5" />
            <div>
              <div className="font-semibold">Permintaan Sedang Diproses</div>
              <div className="mt-1 text-sm">
                Kode Otorisasi: <span className="font-bold">{userStatus?.authorization_code}</span>
              </div>
              <div className="mt-1 text-sm">
                Tanggal Pengajuan: <span className="font-bold">
                  {new Date(userStatus?.created_date).toLocaleDateString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            Permintaan Anda sedang dalam proses verifikasi oleh tim DJP. 
            Anda akan menerima notifikasi melalui email setelah proses verifikasi selesai.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={checkUserDJPStatus}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Refresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
          <button
            onClick={resetForm}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Success View
  if (currentView === 'success') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">
          Kode Otorisasi Sertifikat Elektronik
        </h1>
        
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            <div>
              <div className="font-semibold">Sertifikat Digital Berhasil Dibuat!</div>
              <div className="mt-1">
                Kode Otorisasi: <span className="font-bold">{requestData?.authorization_code}</span>
              </div>
            </div>
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={handleDownloadReceipt}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {loading ? 'Mengunduh...' : 'Unduh Bukti Tanda Terima'}
          </button>
          <button
            onClick={handleDownloadCertificate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {loading ? 'Mengunduh...' : 'Unduh Surat Penerbitan Sertifikat'}
          </button>
        </div>

        <button
          onClick={resetForm}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Form View
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">
        Permintaan Kode Otorisasi atau Sertifikat Elektronik
      </h1>
      
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {loading && <LoadingOverlay />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Case Management Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">
            Manajemen Kasus
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saluran Permohonan *
              </label>
              <select
                name="requestChannel"
                value={formData.requestChannel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="daring">Daring (Portal Mahasiswa)</option>
                <option value="luring">Luring (Kantor Pajak)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Permohonan *
              </label>
              <input
                type="date"
                name="requestDate"
                value={formData.requestDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Taxpayer Identity Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">
            Identitas Mahasiswa
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIK *
              </label>
              <input
                type="text"
                name="nikNpwp"
                value={formData.nikNpwp}
                onChange={handleInputChange}
                onBlur={(e) => handleNIKLookup(e.target.value)}
                placeholder="Masukkan NIK"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength="16"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Masukkan NIK untuk mencari data mahasiswa</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Mahasiswa
              </label>
              <input
                type="text"
                name="taxpayerName"
                value={formData.taxpayerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Alamat akan otomatis terisi dari data mahasiswa"
              />
            </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">
            Detail Kontak
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Handphone *
              </label>
              <input
                type="tel"
                name="handphone"
                value={formData.handphone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength="15"
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
          </div>
        </div>

        {/* Electronic Certificate Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">
            Rincian Sertifikat Elektronik
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Sertifikat Elektronik
              </label>
              <select
                name="certificateType"
                value={formData.certificateType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="kode_otorisasi_djp">Kode Otorisasi DJP</option>
                <option value="brin">BRIN</option>
                <option value="bssn">BSSN</option>
                <option value="peruri">Peruri</option>
                <option value="privy_id">Privy ID</option>
              </select>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passphrase *
                </label>
                <input
                  type="password"
                  name="passphrase"
                  value={formData.passphrase}
                  onChange={handleInputChange}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ulangi Passphrase *
                </label>
                <input
                  type="password"
                  name="confirmPassphrase"
                  value={formData.confirmPassphrase}
                  onChange={handleInputChange}
                  placeholder="Ulangi passphrase"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formData.confirmPassphrase && formData.passphrase !== formData.confirmPassphrase
                      ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formData.confirmPassphrase && formData.passphrase !== formData.confirmPassphrase && (
                  <p className="text-red-500 text-xs mt-1">Passphrase tidak cocok</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Identity Verification Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">
            Verifikasi Identitas *
          </h3>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              uploadedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'
            }`}
            onClick={() => document.getElementById('photoUpload').click()}
          >
            {uploadedFile ? (
              <div>
                <Check className="h-12 w-12 mx-auto text-green-500 mb-2" />
                <p className="text-green-600 font-medium">File berhasil dipilih: {uploadedFile.name}</p>
                <p className="text-sm text-gray-500 mt-2">Klik untuk mengubah file</p>
              </div>
            ) : (
              <div>
                {/* <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" /> */}
                <p className="text-gray-600">Klik untuk upload foto identitas</p>
                <p className="text-sm text-gray-500 mt-2">Format: JPG, PNG (Max 2MB)</p>
              </div>
            )}
            
            <input
              type="file"
              id="photoUpload"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileUpload}
              className="hidden"
              required
            />
          </div>
          
          {uploadStatus && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mt-2">
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Statement Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">
            Pernyataan Mahasiswa
          </h3>
          
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="statement"
              name="statement"
              checked={formData.statement}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="statement" className="text-sm text-gray-700 leading-relaxed">
              Dengan menyadari sepenuhnya akan segala akibatnya termasuk sanksi sesuai dengan ketentuan peraturan perundang-undangan yang berlaku, saya menyatakan bahwa apa yang saya sampaikan di atas adalah benar dan lengkap, dan saya menyetujui untuk menggunakan Akun Mahasiswa saya sebagai sarana penerimaan surat dan dokumen perpajakan.
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => setCurrentView('profile')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <FileOpen className="h-4 w-4" />
            {loading ? 'Memproses...' : 'Ajukan Permohonan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DJPAuthorizationForm;