import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import PortalLayout from "../component/Layout";
import individual from "../assets/perorangan.png"
import company from "../assets/badan.png"
import nik from "../assets/nik.png"
import registrationonly from "../assets/registration-only.png"
import API from "../../../utils/host.config";
import axios from "axios";
import toast from "react-hot-toast";

// Mock data for KLU codes
const kluCodes = [
  { code: "Z3000", name: "PRAJURIT TNI DAN ANGGOTA POLRI", description: "PRAJURIT" },
  { code: "Z4000", name: "PEGAWAI BADAN USAHA MILIK NEGARA/ BADAN USAHA MILIK DAERAH", description: "PEGAWAI" },
  { code: "Z5000", name: "PEGAWAI SWASTA", description: "PEGAWAI" },
  { code: "Z6000", name: "PEGAWAI BADAN USAHA ASING", description: "PEGAWAI" },
  { code: "A0111", name: "USAHA TANAMAN PADI", description: "PERTANIAN" },
  { code: "A0112", name: "USAHA TANAMAN JAGUNG", description: "PERTANIAN" }
];

// Reusable Step Component
const StepIndicator = ({ currentStep, totalSteps, steps, onStepClick }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all ${index + 1 <= currentStep
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                  }`}
                onClick={() => onStepClick && onStepClick(index + 1)}
              >
                {index + 1}
              </div>
              <span className={`text-xs mt-1 text-center max-w-20 ${index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 ${index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Reusable Card Component
const SelectionCard = ({ icon, title, subtitle, isSelected, onClick, className = "" }) => {
  return (
    <div
      className={`cursor-pointer border-2 rounded-lg p-6 text-center transition-all ${isSelected
        ? 'border-blue-600 bg-blue-50'
        : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
      onClick={onClick}
    >
      <div className="mb-4 flex justify-center">
        {typeof icon === 'string' ? (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-2xl">
            {icon}
          </div>
        ) : (
          <div className="w-16 h-16 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
};

const SelectionPajakCard = ({ icon, title, subtitle, isSelected, onClick, className = "" }) => {
  return (
    <div
      className={`cursor-pointer border-2 rounded-lg p-6 text-center border-t-8 border-t-yellow-400 transition-all ${isSelected
        ? 'border-blue-600 bg-blue-50'
        : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
};


// Styled Input Component
const StyledInput = ({ label, required = false, children, error, helperText }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {helperText && <p className="text-gray-500 text-xs">{helperText}</p>}
    </div>
  );
};

// Modal Component for KLU Selection
const KluModal = ({ isOpen = false, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCodes, setFilteredCodes] = useState(kluCodes);

  useEffect(() => {
    setFilteredCodes(
      kluCodes.filter(code =>
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="bg-yellow-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pencarian Ekonomi</h2>
          <button onClick={onClose} className="text-xl font-bold">×</button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-4">
            <button className="px-4 py-2 bg-gray-100 rounded">🔄</button>
            <button className="px-4 py-2 bg-gray-100 rounded">📄</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded">📄</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded">📄</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">🔍</button>
          </div>

          <div className="overflow-auto max-h-96">
            <table className="w-full border-collapse">
              <thead className="bg-yellow-400">
                <tr>
                  <th className="border p-2 text-left">Kode ↕</th>
                  <th className="border p-2 text-left">Nama Kode ↕</th>
                  <th className="border p-2 text-left">Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="mt-1 text-blue-500">🔽</button>
                  </td>
                  <td className="border p-2">
                    <input type="text" className="w-full border rounded px-2 py-1" />
                    <button className="mt-1 text-blue-500">🔽</button>
                  </td>
                  <td className="border p-2"></td>
                </tr>
                {filteredCodes.map((code, index) => (
                  <tr key={code.code} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
                        onClick={() => onSelect(code)}
                      >
                        Pilih
                      </button>
                      {code.code}
                    </td>
                    <td className="border p-2 text-sm">{code.name}</td>
                    <td className="border p-2 text-sm">{code.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>Menampilkan 11 sampai 18 dari 18 entri</span>
            <div className="flex gap-2">
              <button className="px-2 py-1 border rounded">««</button>
              <button className="px-2 py-1 border rounded">‹</button>
              <button className="px-2 py-1 border rounded bg-blue-500 text-white">1</button>
              <button className="px-2 py-1 border rounded bg-gray-200">2</button>
              <button className="px-2 py-1 border rounded">›</button>
              <button className="px-2 py-1 border rounded">»</button>
              <select className="border rounded px-2 py-1">
                <option>10</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Register Component
function Registration() {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    taxpayerType: '',
    hasNIK: null,
    registrationType: '',
    taxpayerIdentity: {},
    contactDetails: {},
    relatedPersons: [],
    economicData: [],
    addresses: [],
    uploadedPhoto: null,

    // Company specific fields
    companyTypeSelection: '',
    kuasaWajibPajak: {},
    companyIdentity: {},
    orangPribadi: [],
    wajibPajakTerkait: [], // TAMBAH INI
    companyEconomicData: {}, // TAMBAH INI
    documents: {} // TAMBAH INI
  });

  // Add beforeunload event listener to warn about refresh
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges && currentStep > 1) {
        const message = 'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?';
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, currentStep]);

  // Track form changes
  useEffect(() => {
    const hasData = formData.taxpayerType ||
      formData.hasNIK !== null ||
      formData.registrationType ||
      Object.keys(formData.taxpayerIdentity).length > 0 ||
      Object.keys(formData.contactDetails).length > 0 ||
      formData.relatedPersons.length > 0 ||
      formData.economicData.length > 0 ||
      formData.addresses.length > 0 ||
      formData.uploadedPhoto ||
      // Company fields
      formData.companyTypeSelection ||
      Object.keys(formData.kuasaWajibPajak || {}).length > 0 ||
      Object.keys(formData.companyIdentity || {}).length > 0 ||
      formData.orangPribadi.length > 0 ||
      formData.wajibPajakTerkait.length > 0 ||
      Object.keys(formData.companyEconomicData || {}).length > 0 ||
      Object.keys(formData.documents || {}).length > 0;

    setHasUnsavedChanges(hasData);
  }, [formData]);

  const getSteps = () => {
    if (formData.taxpayerType === 'company') {
      return [
        'Kuasa Wajib Pajak',
        'Identitas Wajib Pajak',
        'Detail Kontak',
        'Orang Pribadi',
        'Wajib Pajak Terkait',
        'Data Ekonomi',
        'Alamat',
        'Dokumen',
        'Pernyataan Wajib Pajak'
      ];
    }

    if (formData.registrationType === 'registration-only') {
      return [
        'Taxpayer Identity',
        'Contact Details',
        'Economic Data',
        'Address',
        'Taxpayer Declaration'
      ];
    }

    return [
      'Taxpayer Identity',
      'Contact Details',
      'Related Persons',
      'Economic Data',
      'Address',
      'Identity Verification',
      'Taxpayer Declaration'
    ];
  };

  const steps = getSteps();

  const submitRegistration = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      // Validate required data before submission
      const validationErrors = [];

      if (!formData.taxpayerType) validationErrors.push('Taxpayer type is required');

      // COMPANY VALIDATION
      if (formData.taxpayerType === 'company') {
        if (!formData.companyTypeSelection) validationErrors.push('Company type selection is required');
        if (!formData.kuasaWajibPajak || Object.keys(formData.kuasaWajibPajak).length === 0) {
          validationErrors.push('Kuasa Wajib Pajak data is required');
        }
        if (!formData.companyIdentity || Object.keys(formData.companyIdentity).length === 0) {
          validationErrors.push('Company identity data is required');
        }
        if (!formData.contactDetails || Object.keys(formData.contactDetails).length === 0) {
          validationErrors.push('Contact details are required');
        }
        if (!formData.companyEconomicData || Object.keys(formData.companyEconomicData).length === 0) {
          validationErrors.push('Company economic data is required');
        }
        if (!formData.addresses || formData.addresses.length === 0) {
          validationErrors.push('At least one address is required');
        }
      }
      // INDIVIDUAL VALIDATION (existing)
      else {
        if (formData.hasNIK === null) validationErrors.push('NIK status is required');
        if (!formData.registrationType) validationErrors.push('Registration type is required');
        if (!formData.taxpayerIdentity || Object.keys(formData.taxpayerIdentity).length === 0) {
          validationErrors.push('Taxpayer identity data is required');
        }
        if (!formData.contactDetails || Object.keys(formData.contactDetails).length === 0) {
          validationErrors.push('Contact details are required');
        }
        if (!formData.economicData || formData.economicData.length === 0) {
          validationErrors.push('At least one economic data entry is required');
        }
        if (!formData.addresses || formData.addresses.length === 0) {
          validationErrors.push('At least one address is required');
        }

        // For NIK activation, photo is required
        if (formData.registrationType === 'nik-activation' && !formData.uploadedPhoto) {
          validationErrors.push('Photo upload is required for NIK activation');
        }
      }

      if (validationErrors.length > 0) {
        setIsSubmitting(false);
        toast.error(validationErrors.join(', '), {
          style: {
            minWidth: "250px",
            border: "1px solid #DC2626",
            padding: "16px",
            color: "#DC2626",
          }
        });
        return;
      }

      try {
        // Create FormData for file upload support
        const submissionData = new FormData();

        // Add taxpayer type (required for routing)
        submissionData.append('taxpayerType', formData.taxpayerType);

        // COMPANY DATA SUBMISSION
        if (formData.taxpayerType === 'company') {
          submissionData.append('companyTypeSelection', formData.companyTypeSelection);
          submissionData.append('kuasaWajibPajak', JSON.stringify(formData.kuasaWajibPajak));
          submissionData.append('companyIdentity', JSON.stringify(formData.companyIdentity));
          submissionData.append('contactDetails', JSON.stringify(formData.contactDetails));
          submissionData.append('orangPribadi', JSON.stringify(formData.orangPribadi || []));
          submissionData.append('wajibPajakTerkait', JSON.stringify(formData.wajibPajakTerkait || []));
          submissionData.append('companyEconomicData', JSON.stringify(formData.companyEconomicData));
          submissionData.append('addresses', JSON.stringify(formData.addresses));

          // Add company documents if uploaded
          if (formData.documents?.establishmentDocument) {
            submissionData.append('establishmentDocument', formData.documents.establishmentDocument);
          }
          if (formData.documents?.authorizationLetter) {
            submissionData.append('authorizationLetter', formData.documents.authorizationLetter);
          }
        }
        // INDIVIDUAL DATA SUBMISSION (existing)
        else {
          submissionData.append('hasNIK', formData.hasNIK);
          submissionData.append('registrationType', formData.registrationType);
          submissionData.append('taxpayerIdentity', JSON.stringify(formData.taxpayerIdentity));
          submissionData.append('contactDetails', JSON.stringify(formData.contactDetails));
          submissionData.append('relatedPersons', JSON.stringify(formData.relatedPersons));
          submissionData.append('economicData', JSON.stringify(formData.economicData));
          submissionData.append('addresses', JSON.stringify(formData.addresses));

          // Add photo if uploaded (for NIK activation flow)
          if (formData.uploadedPhoto) {
            submissionData.append('profile_image', formData.uploadedPhoto);
          }
        }

        const callreg = axios.post(
          `${API.HOST}/api/v2/auth/signup`,
          submissionData,
          {
            timeout: 1000 * 60, // Increase timeout to 60 seconds for file upload
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        toast.promise(
          callreg,
          {
            loading: "Mendaftarkan akun Anda...",
            success: (data) => {
              setIsSubmitting(false);

              if (data && data.data.success) {
                // Reset form
                setFormData({
                  taxpayerType: '',
                  hasNIK: null,
                  registrationType: '',
                  taxpayerIdentity: {},
                  contactDetails: {},
                  relatedPersons: [],
                  economicData: [],
                  addresses: [],
                  uploadedPhoto: null,
                  // Company specific fields
                  companyTypeSelection: '',
                  kuasaWajibPajak: {},
                  companyIdentity: {},
                  orangPribadi: [],
                  wajibPajakTerkait: [],
                  companyEconomicData: {},
                  documents: {}
                });
                setCurrentStep(1);
                setHasUnsavedChanges(false);

                // Redirect to login after successful registration
                setTimeout(() => {
                  history.push('/login');
                }, 3000);
              }

              return data.data.success ? (
                <div className="relative">
                  <span className="absolute inset-y-0 -left-5 flex items-center">
                    ✅
                  </span>
                  <p className="pl-3">{data.data.message}</p>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute inset-y-0 -left-5 flex items-center">
                    ❌
                  </span>
                  <p className="pl-3">{data.data.message}</p>
                </div>
              );
            },
            error: (error) => {
              setIsSubmitting(false);
              console.error('Registration error:', error);

              if (error.code === "ECONNABORTED") {
                return <b>Periksa koneksi anda dan ulangi beberapa saat lagi.</b>;
              } else if (error.response?.data?.message) {
                return <b>{error.response.data.message}</b>;
              } else {
                return <b>Terjadi kesalahan pada server, silakan coba lagi nanti</b>;
              }
            },
          },
          {
            style: {
              minWidth: "300px",
              border: "1px solid #1E40AF",
              padding: "16px",
              color: "#1E40AF",
              marginBottom: "25px",
            },
            success: {
              duration: 6000,
              icon: "",
            },
            error: {
              duration: 5000,
              icon: "❌",
            },
          }
        );
      } catch (error) {
        setIsSubmitting(false);
        console.error('Submission error:', error);
        toast.error('Terjadi kesalahan saat mengirim data', {
          style: {
            minWidth: "250px",
            border: "1px solid #DC2626",
            padding: "16px",
            color: "#DC2626",
          }
        });
      }
    }
  };

  // Step 1: Taxpayer Type Selection
  const Step1TaxpayerType = () => (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Taxpayer Registration Preparation</h2>
      <p className="text-gray-600 mb-8">
        Please select the type of taxpayer you wish to register according to the category that is most relevant to your tax status.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <SelectionCard
          icon={<img src={individual} alt="individual" />}
          title="Individual"
          isSelected={formData.taxpayerType === 'individual'}
          onClick={() => setFormData({ ...formData, taxpayerType: 'individual' })}
        />
        <SelectionCard
          icon={<img src={company} alt="badan" />}
          title="Company"
          isSelected={formData.taxpayerType === 'company'}
          onClick={() => setFormData({ ...formData, taxpayerType: 'company' })}
        />
      </div>
    </div>
  );

  // Step 2: NIK Status
  const Step2NIKStatus = () => (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Taxpayer Registration Preparation</h2>
      <p className="text-gray-600 mb-8">
        Have taxpayers registered with a Population Identification Number (NIK)?
      </p>

      <div className="flex justify-center gap-4">
        <button
          className={`px-8 py-3 rounded font-medium min-w-[200px] ${formData.hasNIK === true
            ? 'bg-green-600 text-white'
            : 'border border-green-600 text-green-600 hover:bg-green-50'
            }`}
          onClick={() => setFormData({ ...formData, hasNIK: true })}
        >
          ✓ Yes, Taxpayers Have NIK
        </button>
        <button
          className={`px-8 py-3 rounded font-medium min-w-[200px] ${formData.hasNIK === false
            ? 'bg-red-600 text-white'
            : 'border border-red-600 text-red-600 hover:bg-red-50'
            }`}
          onClick={() => setFormData({ ...formData, hasNIK: false })}
        >
          ✗ Do Not Have NIK
        </button>
      </div>
    </div>
  );

  // Step 3: Registration Type
  const Step3RegistrationType = () => (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Taxpayer Registration Preparation</h2>
      <p className="text-gray-600 mb-8">
        Please select the appropriate registration type for your Population Identification Number (NIK).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <SelectionCard
          icon={<img src={nik} alt="nik" />}
          title="Registration with NIK Activation / NIK Activation"
          isSelected={formData.registrationType === 'nik-activation'}
          onClick={() => setFormData({ ...formData, registrationType: 'nik-activation' })}
        />
        <SelectionCard
          icon={<img src={registrationonly} alt="registration-only" />}
          title="Registration only"
          isSelected={formData.registrationType === 'registration-only'}
          onClick={() => setFormData({ ...formData, registrationType: 'registration-only' })}
        />
      </div>
    </div>
  );

  // Step 4: Taxpayer Identity Form
  const Step4TaxpayerIdentity = () => {
    // Initialize with existing formData if available
    const [identity, setIdentity] = useState({
      nik: formData.taxpayerIdentity?.nik || '',
      fullName: formData.taxpayerIdentity?.fullName || '',
      placeOfBirth: formData.taxpayerIdentity?.placeOfBirth || '',
      taxpayerType: formData.taxpayerIdentity?.taxpayerType || 'Individual or Undivided Inheritance',
      dateOfBirth: formData.taxpayerIdentity?.dateOfBirth || '',
      countryOfOrigin: formData.taxpayerIdentity?.countryOfOrigin || 'Indonesia',
      religion: formData.taxpayerIdentity?.religion || '',
      gender: formData.taxpayerIdentity?.gender || '',
      maritalStatus: formData.taxpayerIdentity?.maritalStatus || '',
      typeOfWork: formData.taxpayerIdentity?.typeOfWork || '',
      motherName: formData.taxpayerIdentity?.motherName || '',
      familyCardNumber: formData.taxpayerIdentity?.familyCardNumber || '',
      familyRelationshipStatus: formData.taxpayerIdentity?.familyRelationshipStatus || ''
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = () => {
      const newErrors = {};

      // Required field validations
      if (!identity.nik) newErrors.nik = 'NIK is required';
      else if (identity.nik.length !== 16) newErrors.nik = 'NIK must be 16 digits';

      if (!identity.fullName) newErrors.fullName = 'Full name is required';
      else if (identity.fullName.length < 3) newErrors.fullName = 'Full name must be at least 3 characters';

      if (!identity.placeOfBirth) newErrors.placeOfBirth = 'Place of birth is required';
      if (!identity.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!identity.religion) newErrors.religion = 'Religion is required';
      if (!identity.gender) newErrors.gender = 'Gender is required';
      if (!identity.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
      if (!identity.typeOfWork) newErrors.typeOfWork = 'Type of work is required';
      if (!identity.motherName) newErrors.motherName = 'Mother name is required';
      if (!identity.familyCardNumber) newErrors.familyCardNumber = 'Family card number is required';
      if (!identity.familyRelationshipStatus) newErrors.familyRelationshipStatus = 'Family relationship status is required';

      // Validate date of birth is not in future
      if (identity.dateOfBirth) {
        const birthDate = new Date(identity.dateOfBirth);
        const today = new Date();
        if (birthDate > today) {
          newErrors.dateOfBirth = 'Date of birth cannot be in the future';
        }
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        setFormData({ ...formData, taxpayerIdentity: identity });
        setCurrentStep(currentStep + 1);
      } else {
        // Scroll to first error
        const firstErrorField = document.querySelector('.text-red-500');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    return (
      <div>
        <h2 className="text-xl font-semibold mb-6 text-center text-blue-800">
          Masukkan data identitas wajib pajak.
        </h2>

        <div className="space-y-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StyledInput label="Nomor Induk Kependudukan (NIK)" required error={errors.nik}>
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nik ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="Enter your NIK"
                value={identity.nik}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  if (value.length <= 16) {
                    setIdentity({ ...identity, nik: value });
                  }
                }}
                maxLength={16}
              />
            </StyledInput>

            <StyledInput label="Full name" required error={errors.fullName}>
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="Enter your full name"
                value={identity.fullName}
                onChange={(e) => setIdentity({ ...identity, fullName: e.target.value })}
              />
            </StyledInput>

            <StyledInput label="Taxpayer Type" required>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={identity.taxpayerType}
                onChange={(e) => setIdentity({ ...identity, taxpayerType: e.target.value })}
              >
                <option value="Individual or Undivided Inheritance">Individual or Undivided Inheritance</option>
                <option value="Company">Company</option>
              </select>
            </StyledInput>

            <StyledInput label="Place of birth" required error={errors.placeOfBirth}>
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.placeOfBirth ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="Enter your place of birth"
                value={identity.placeOfBirth}
                onChange={(e) => setIdentity({ ...identity, placeOfBirth: e.target.value })}
              />
            </StyledInput>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StyledInput label="Country of origin" required>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={identity.countryOfOrigin}
                onChange={(e) => setIdentity({ ...identity, countryOfOrigin: e.target.value })}
              >
                <option value="Indonesia">Indonesia</option>
                <option value="Other">Other</option>
              </select>
            </StyledInput>

            <StyledInput label="Date of birth" required error={errors.dateOfBirth}>
              <input
                type="date"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.dateOfBirth ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                value={identity.dateOfBirth}
                onChange={(e) => setIdentity({ ...identity, dateOfBirth: e.target.value })}
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
              />
            </StyledInput>

            <StyledInput label="Gender" required error={errors.gender}>
              <select
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.gender ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                value={identity.gender}
                onChange={(e) => setIdentity({ ...identity, gender: e.target.value })}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </StyledInput>

            <StyledInput label="Marital status" required error={errors.maritalStatus}>
              <select
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.maritalStatus ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                value={identity.maritalStatus}
                onChange={(e) => setIdentity({ ...identity, maritalStatus: e.target.value })}
              >
                <option value="">Select marital status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </StyledInput>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StyledInput label="Religion" required error={errors.religion}>
              <select
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.religion ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                value={identity.religion}
                onChange={(e) => setIdentity({ ...identity, religion: e.target.value })}
              >
                <option value="">Select religion</option>
                <option value="Islam">Islam</option>
                <option value="Christianity">Christianity</option>
                <option value="Catholicism">Catholicism</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Confucianism">Confucianism</option>
              </select>
            </StyledInput>

            <StyledInput label="Type of work" required error={errors.typeOfWork}>
              <select
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.typeOfWork ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                value={identity.typeOfWork}
                onChange={(e) => setIdentity({ ...identity, typeOfWork: e.target.value })}
              >
                <option value="">Select job type</option>
                <option value="Employee">Employee</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>
            </StyledInput>

            <StyledInput label="Mother's Name" required error={errors.motherName}>
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.motherName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="Enter Mother's Name"
                value={identity.motherName}
                onChange={(e) => setIdentity({ ...identity, motherName: e.target.value })}
              />
            </StyledInput>

            <StyledInput label="Family Card Number" required error={errors.familyCardNumber}>
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.familyCardNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="Enter Family Card Number"
                value={identity.familyCardNumber}
                onChange={(e) => setIdentity({ ...identity, familyCardNumber: e.target.value })}
              />
            </StyledInput>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StyledInput label="Family Relationship Status" required error={errors.familyRelationshipStatus}>
              <select
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.familyRelationshipStatus ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                value={identity.familyRelationshipStatus}
                onChange={(e) => setIdentity({ ...identity, familyRelationshipStatus: e.target.value })}
              >
                <option value="">Select Family Relationship Status</option>
                <option value="Head of Family">Head of Family</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Other">Other</option>
              </select>
            </StyledInput>

            <StyledInput label="Individual Category">
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Individual Category</option>
                <option value="General">General</option>
                <option value="Special">Special</option>
              </select>
            </StyledInput>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step 5: Contact Details
  // Step 5: Contact Details
  const Step5ContactDetails = () => {
    // Initialize with existing formData if available
    const [contact, setContact] = useState({
      email: formData.contactDetails?.email || '',
      handphone: formData.contactDetails?.handphone || '',
      telephone: formData.contactDetails?.telephone || '',
      fax: formData.contactDetails?.fax || ''
    });

    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
      const phoneRegex = /^0\d{7,14}$/; // Starts with 0, min 8 chars, max 15 chars, digits only
      return phoneRegex.test(phone);
    };

    const handleSubmit = () => {
      const newErrors = {};

      // Email validation
      if (!contact.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(contact.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Handphone validation
      if (!contact.handphone) {
        newErrors.handphone = 'Handphone number is required';
      } else if (!validatePhone(contact.handphone)) {
        newErrors.handphone = 'Phone number must start with 0, min 8 characters, max 15 characters, and digits only';
      }

      // Optional telephone validation
      if (contact.telephone && !validatePhone(contact.telephone)) {
        newErrors.telephone = 'Phone number must start with 0, min 8 characters, max 15 characters, and digits only';
      }

      // Optional fax validation
      if (contact.fax && !validatePhone(contact.fax)) {
        newErrors.fax = 'Fax number must start with 0, min 8 characters, max 15 characters, and digits only';
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        setFormData({ ...formData, contactDetails: contact });
        setCurrentStep(currentStep + 1);
      } else {
        // Scroll to first error
        const firstErrorField = document.querySelector('.text-red-500');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Mohon verifikasi detail kontak wajib pajak.
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StyledInput label="E-mail" required error={errors.email}>
              <div className="flex gap-2">
                <input
                  type="email"
                  className={`flex-1 border rounded px-3 py-2 focus:outline-none ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                  placeholder="Masukkan alamat email Anda"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value.toLowerCase() })}
                />
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    if (contact.email && validateEmail(contact.email)) {
                      toast.success('Email format is valid', {
                        duration: 2000,
                        style: { border: '1px solid #10B981', color: '#10B981' }
                      });
                    } else {
                      toast.error('Please enter a valid email', {
                        duration: 2000,
                        style: { border: '1px solid #DC2626', color: '#DC2626' }
                      });
                    }
                  }}
                >
                  Verify
                </button>
              </div>
            </StyledInput>

            <StyledInput
              label="Nomor Handphone"
              required
              error={errors.handphone}
              helperText="Phone number start with 0, min 8 characters, max 15 characters, and digits only"
            >
              <div className="flex gap-2">
                <input
                  type="tel"
                  className={`flex-1 border rounded px-3 py-2 focus:outline-none ${errors.handphone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                  placeholder="Enter Phone Number"
                  value={contact.handphone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                    if (value.length <= 15) {
                      setContact({ ...contact, handphone: value });
                    }
                  }}
                  maxLength={15}
                />
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    if (contact.handphone && validatePhone(contact.handphone)) {
                      toast.success('Phone number format is valid', {
                        duration: 2000,
                        style: { border: '1px solid #10B981', color: '#10B981' }
                      });
                    } else {
                      toast.error('Please enter a valid phone number', {
                        duration: 2000,
                        style: { border: '1px solid #DC2626', color: '#DC2626' }
                      });
                    }
                  }}
                >
                  Verify
                </button>
              </div>
            </StyledInput>

            <StyledInput
              label="Nomor Telepon"
              error={errors.telephone}
              helperText="Phone number start with 0, min 8 characters, max 15 characters, and digits only"
            >
              <input
                type="tel"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.telephone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="Masukkan Nomor Telepon"
                value={contact.telephone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  if (value.length <= 15) {
                    setContact({ ...contact, telephone: value });
                  }
                }}
                maxLength={15}
              />
            </StyledInput>
          </div>

          <StyledInput
            label="Nomor Faksimile"
            error={errors.fax}
            helperText="Phone number start with 0, min 8 characters, max 15 characters, and digits only"
          >
            <input
              type="tel"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.fax ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              placeholder="Masukkan Nomor Fax"
              value={contact.fax}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                if (value.length <= 15) {
                  setContact({ ...contact, fax: value });
                }
              }}
              maxLength={15}
            />
          </StyledInput>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    );
  };
  // Step 6: Related Persons (only for nik-activation)
  const Step6RelatedPersons = () => {
    const [relatedPersons, setRelatedPersons] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [currentPerson, setCurrentPerson] = useState({
      type: '',
      nikTin: '',
      name: ''
    });

    const handleAddPerson = () => {
      if (currentPerson.type && currentPerson.nikTin && currentPerson.name) {
        setRelatedPersons([...relatedPersons, { ...currentPerson, id: Date.now() }]);
        setCurrentPerson({ type: '', nikTin: '', name: '' });
        setShowAddDialog(false);
      }
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Masukkan orang terkait wajib pajak.
        </h2>

        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-medium mb-4">Tambahkan Orang yang Mempunyai Hubungan Istimewa</h3>

          <div className="text-center mb-6">
            <button
              onClick={() => setShowAddDialog(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-3xl hover:bg-blue-700"
            >
              ⊕
            </button>
          </div>

          {relatedPersons.length > 0 && (
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-yellow-400">
                    <th className="border border-gray-300 px-4 py-2 text-left">Aksi</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Jenis Orang Terkait</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">NIK/TIN</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Nama</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedPersons.map((person) => (
                    <tr key={person.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2">Edit</button>
                        <button
                          onClick={() => setRelatedPersons(relatedPersons.filter(p => p.id !== person.id))}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Hapus
                        </button>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{person.type}</td>
                      <td className="border border-gray-300 px-4 py-2">{person.nikTin}</td>
                      <td className="border border-gray-300 px-4 py-2">{person.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => {
                setFormData({ ...formData, relatedPersons });
                setCurrentStep(currentStep + 1);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Lanjut
            </button>
          </div>
        </div>

        {/* Add Person Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Buat Orang</h3>
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="text-xl font-bold text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <StyledInput label="Jenis Orang yang Mempunyai Hubungan Istimewa" required>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={currentPerson.type}
                    onChange={(e) => setCurrentPerson({ ...currentPerson, type: e.target.value })}
                  >
                    <option value="">Pilih Jenis Orang Terkait</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Bisnis Partner">Bisnis Partner</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </StyledInput>

                <StyledInput label="Person NIK/TIN" required>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="NIK/NPWP"
                    value={currentPerson.nikTin}
                    onChange={(e) => setCurrentPerson({ ...currentPerson, nikTin: e.target.value })}
                  />
                </StyledInput>

                <StyledInput label="Person Name" required>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Nama"
                    value={currentPerson.name}
                    onChange={(e) => setCurrentPerson({ ...currentPerson, name: e.target.value })}
                  />
                </StyledInput>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddPerson}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Step 7: Economic Data with KLU Modal
  // Step 7: Economic Data with KLU Modal
  const StepEconomicData = () => {
    // Initialize with existing formData if available
    const [economicData, setEconomicData] = useState(formData.economicData || []);
    const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
    const [showKluModal, setShowKluModal] = useState(false);
    const [currentIncome, setCurrentIncome] = useState({
      source: '',
      kluCode: '',
      kluName: '',
      workplace: '',
      incomePerMonth: ''
    });

    const handleAddIncome = () => {
      // Validate required fields
      if (!currentIncome.source) {
        toast.error('Please select income source', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });
        return;
      }
      if (!currentIncome.kluCode) {
        toast.error('Please select KLU code', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });
        return;
      }
      if (!currentIncome.workplace) {
        toast.error('Please enter workplace', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });
        return;
      }
      if (!currentIncome.incomePerMonth) {
        toast.error('Please select income per month', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });
        return;
      }

      setEconomicData([...economicData, { ...currentIncome, id: Date.now() }]);
      setCurrentIncome({ source: '', kluCode: '', kluName: '', workplace: '', incomePerMonth: '' });
      setOpenIncomeDialog(false);

      toast.success('Income source added successfully', {
        style: { border: '1px solid #10B981', color: '#10B981' }
      });
    };

    const handleKluSelect = (klu) => {
      setCurrentIncome({
        ...currentIncome,
        kluCode: klu.code,
        kluName: klu.name
      });
      setShowKluModal(false);
    };

    const handleNext = () => {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    };

    const handlePrev = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };




    const handleDeleteIncome = (id) => {
      setEconomicData(economicData.filter(d => d.id !== id));
      toast.success('Income source deleted', {
        style: { border: '1px solid #10B981', color: '#10B981' }
      });
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Masukkan data ekonomi wajib pajak.
        </h2>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StyledInput label="Metode Pembukuan/Pencatatan" required>
              <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
                <option value="Pencatatan">Pencatatan</option>
                <option value="Pembukuan">Pembukuan</option>
              </select>
            </StyledInput>

            <StyledInput label="Mata Uang Pembukuan" required>
              <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
                <option value="Rupiah Indonesia">Rupiah Indonesia</option>
                <option value="USD">USD</option>
              </select>
            </StyledInput>

            <StyledInput label="Periode Pembukuan" required>
              <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
                <option value="01-12">01-12</option>
                <option value="04-03">04-03</option>
              </select>
            </StyledInput>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Sumber Penghasilan</h3>
              <button
                onClick={() => setOpenIncomeDialog(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Tambah Sumber Penghasilan
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-yellow-400">
                    <th className="border border-gray-300 px-4 py-2 text-left">Aksi</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Sumber Penghasilan</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Kode KLU</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Tempat Kerja</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Penghasilan per Bulan</th>
                  </tr>
                </thead>
                <tbody>
                  {economicData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="text-4xl">📊</div>
                          <p>Belum ada data ekonomi yang ditambahkan.</p>
                          <p className="text-sm">Klik "Tambah Sumber Penghasilan" untuk menambah data.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    economicData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() => handleDeleteIncome(item.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Hapus
                          </button>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{item.source}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div>
                            <div className="font-medium">{item.kluCode}</div>
                            <div className="text-sm text-gray-600">{item.kluName}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{item.workplace}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.incomePerMonth}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {economicData.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Total: {economicData.length} sumber penghasilan
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Lanjut
            </button>
          </div>
        </div>

        {/* Add Income Dialog */}
        {openIncomeDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Tambah Sumber Penghasilan</h3>
                <button
                  onClick={() => {
                    setOpenIncomeDialog(false);
                    setCurrentIncome({ source: '', kluCode: '', kluName: '', workplace: '', incomePerMonth: '' });
                  }}
                  className="text-xl font-bold text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <StyledInput label="Sumber Penghasilan" required>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={currentIncome.source}
                    onChange={(e) => setCurrentIncome({ ...currentIncome, source: e.target.value })}
                  >
                    <option value="">Pilih sumber pendapatan</option>
                    <option value="Pekerjaan">Pekerjaan</option>
                    <option value="Usaha">Usaha</option>
                    <option value="Investasi">Investasi</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Pensiun">Pensiun</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </StyledInput>

                <StyledInput label="Kode KLU" required>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-50"
                      placeholder="Pilih Kode KLU"
                      value={currentIncome.kluCode}
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => setShowKluModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Pilih
                    </button>
                  </div>
                  {currentIncome.kluName && (
                    <p className="text-sm text-gray-600 mt-1">{currentIncome.kluName}</p>
                  )}
                </StyledInput>

                <StyledInput label="Tempat Kerja" required>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Silakan masukkan nama tempat kerja Anda"
                    value={currentIncome.workplace}
                    onChange={(e) => setCurrentIncome({ ...currentIncome, workplace: e.target.value })}
                  />
                </StyledInput>

                <StyledInput label="Penghasilan per bulan" required>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={currentIncome.incomePerMonth}
                    onChange={(e) => setCurrentIncome({ ...currentIncome, incomePerMonth: e.target.value })}
                  >
                    <option value="">Pilih Pendapatan per Bulan</option>
                    <option value="Kurang dari Rp. 4.500.000">Kurang dari Rp. 4.500.000</option>
                    <option value="Rp. 4.500.000 - Rp. 10.000.000">Rp. 4.500.000 - Rp. 10.000.000</option>
                    <option value="Lebih dari Rp. 10.000.000">Lebih dari Rp. 10.000.000</option>
                  </select>
                </StyledInput>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setOpenIncomeDialog(false);
                    setCurrentIncome({ source: '', kluCode: '', kluName: '', workplace: '', incomePerMonth: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddIncome}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        <KluModal
          isOpen={showKluModal}
          onClose={() => setShowKluModal(false)}
          onSelect={handleKluSelect}
        />
      </div>
    );
  };

  // Step: Address Details
  // Step: Address Details dengan validasi
  const StepAddressDetails = () => {
    // Initialize with existing formData if available
    const [addresses, setAddresses] = useState(
      formData.addresses && formData.addresses.length > 0
        ? formData.addresses
        : [
          {
            type: 'Alamat Domisili (Alamat Utama)',
            address: '',
            rt: '',
            rw: '',
            province: '',
            city: '',
            district: '',
            village: '',
            postalCode: '',
            coordinates: ''
          },
          {
            type: 'Alamat sesuai di KTP',
            address: '',
            rt: '',
            rw: '',
            province: '',
            city: '',
            district: '',
            village: '',
            postalCode: '',
            coordinates: ''
          }
        ]
    );

    const [errors, setErrors] = useState({});

    const handleAddressChange = (index, field, value) => {
      const newAddresses = [...addresses];
      newAddresses[index][field] = value;
      setAddresses(newAddresses);

      // Clear error when user starts typing
      if (errors[`${index}_${field}`]) {
        const newErrors = { ...errors };
        delete newErrors[`${index}_${field}`];
        setErrors(newErrors);
      }
    };

    const copyFromDomicile = () => {
      const newAddresses = [...addresses];
      newAddresses[1] = { ...newAddresses[0], type: 'Alamat sesuai di KTP' };
      setAddresses(newAddresses);
    };

    const validateAddresses = () => {
      const newErrors = {};

      addresses.forEach((address, index) => {
        // Required field validations
        if (!address.address) {
          newErrors[`${index}_address`] = 'Detail alamat wajib diisi';
        }
        if (!address.rt) {
          newErrors[`${index}_rt`] = 'RT wajib diisi';
        }
        if (!address.rw) {
          newErrors[`${index}_rw`] = 'RW wajib diisi';
        }
        if (!address.province) {
          newErrors[`${index}_province`] = 'Provinsi wajib dipilih';
        }
        if (!address.city) {
          newErrors[`${index}_city`] = 'Kota/Wilayah wajib dipilih';
        }
        if (!address.district) {
          newErrors[`${index}_district`] = 'Kecamatan wajib dipilih';
        }
        if (!address.village) {
          newErrors[`${index}_village`] = 'Desa/Kelurahan wajib dipilih';
        }
        if (!address.postalCode) {
          newErrors[`${index}_postalCode`] = 'Kode pos wajib diisi';
        }
      });

      return newErrors;
    };

    const handleNext = () => {
      const validationErrors = validateAddresses();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error('Mohon lengkapi semua field alamat yang wajib diisi', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });

        // Scroll to first error
        setTimeout(() => {
          const firstErrorField = document.querySelector('.border-red-500');
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);

        return;
      }

      // Validation passed
      setFormData({ ...formData, addresses });
      setCurrentStep(currentStep + 1);
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Masukkan detail Alamat wajib pajak.
        </h2>

        <div className="max-w-6xl mx-auto space-y-8">
          {addresses.map((address, index) => (
            <div key={index} className="border rounded-lg p-6 bg-gray-50">
              <h3 className="font-semibold mb-4">{address.type}</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <StyledInput label="Jenis Alamat" required>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    value={address.type}
                    disabled
                  >
                    <option value={address.type}>{address.type}</option>
                  </select>
                </StyledInput>

                <StyledInput label="Detail Alamat" required error={errors[`${index}_address`]}>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_address`]
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter Address details (street, number, building, ...)"
                    value={address.address}
                    onChange={(e) => handleAddressChange(index, 'address', e.target.value)}
                  />
                </StyledInput>

                <StyledInput label="RT" required error={errors[`${index}_rt`]} helperText="RT/RW does not exist, enter 000">
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_rt`]
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter RT"
                    value={address.rt}
                    onChange={(e) => handleAddressChange(index, 'rt', e.target.value)}
                  />
                </StyledInput>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <StyledInput label="RW" required error={errors[`${index}_rw`]} helperText="RT/RW does not exist, enter 000">
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_rw`]
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter RW"
                    value={address.rw}
                    onChange={(e) => handleAddressChange(index, 'rw', e.target.value)}
                  />
                </StyledInput>

                <StyledInput label="Provinsi" required error={errors[`${index}_province`]}>
                  <select
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_province`]
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    value={address.province}
                    onChange={(e) => handleAddressChange(index, 'province', e.target.value)}
                  >
                    <option value="">Select province</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                  </select>
                </StyledInput>

                <StyledInput label="Kota/Wilayah" required error={errors[`${index}_city`]}>
                  <select
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_city`]
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    value={address.city}
                    onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                  >
                    <option value="">Select city</option>
                    <option value="Malang">Malang</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Batu">Batu</option>
                  </select>
                </StyledInput>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <StyledInput label="Kecamatan" required error={errors[`${index}_district`]}>
                  <select
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_district`]
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    value={address.district}
                    onChange={(e) => handleAddressChange(index, 'district', e.target.value)}
                  >
                    <option value="">Select district</option>
                    <option value="Lowokwaru">Lowokwaru</option>
                    <option value="Klojen">Klojen</option>
                    <option value="Sukun">Sukun</option>
                  </select>
                </StyledInput>

                <StyledInput label="Desa/Kelurahan" required error={errors[`${index}_village`]}>
                  <select
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_village`]
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    value={address.village}
                    onChange={(e) => handleAddressChange(index, 'village', e.target.value)}
                  >
                    <option value="">Select sub-district</option>
                    <option value="Mojolangu">Mojolangu</option>
                    <option value="Tunggulwulung">Tunggulwulung</option>
                  </select>
                </StyledInput>

                <StyledInput label="Kode Pos" required error={errors[`${index}_postalCode`]}>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_postalCode`]
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    placeholder="Kode Pos"
                    value={address.postalCode}
                    onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                  />
                </StyledInput>

                <StyledInput label="Data geometri">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Koordinat (opsional)"
                    value={address.coordinates}
                    onChange={(e) => handleAddressChange(index, 'coordinates', e.target.value)}
                  />
                </StyledInput>
              </div>

              <div className="flex gap-2">
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                  Mark Address
                </button>
                {index === 1 && (
                  <button
                    onClick={copyFromDomicile}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    📋 Copy from Domicile
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="text-center">
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
              ➕ Add Address
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step: Identity Verification with Photo Upload (only for nik-activation)
  const StepIdentityVerification = () => {
    const [uploadedPhoto, setUploadedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        setUploadedPhoto(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const removePhoto = () => {
      setUploadedPhoto(null);
      setPhotoPreview(null);
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Silakan ambil foto atau unggah dari komputer Anda
        </h2>

        <div className="max-w-2xl mx-auto">
          {!photoPreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl text-gray-400">📷</div>
                <p className="text-gray-600">Take a photo</p>
                <p className="text-gray-600">Atau</p>

                <label className="bg-blue-600 text-white px-6 py-3 rounded cursor-pointer hover:bg-blue-700 inline-block">
                  Upload photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-6">
              <div className="text-center mb-4">
                <img
                  src={photoPreview}
                  alt="Uploaded identity document"
                  className="max-w-full max-h-64 mx-auto rounded"
                />
              </div>
              <div className="text-center space-x-4">
                <span className="text-green-600 font-medium">✓ Photo uploaded successfully</span>
                <button
                  onClick={removePhoto}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove Photo
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-8">
            <button
              onClick={() => {
                setFormData({ ...formData, uploadedPhoto });
                setCurrentStep(currentStep + 1);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step: Declaration
  const StepDeclaration = () => {
    const [isAgreed, setIsAgreed] = useState(false);

    const handleSubmit = () => {
      if (isAgreed) {
        submitRegistration()
        // Reset form and redirect to step 1
        // setCurrentStep(1);
        // setHasUnsavedChanges(false);
        // setFormData({
        //   taxpayerType: '',
        //   hasNIK: null,
        //   registrationType: '',
        //   taxpayerIdentity: {},
        //   contactDetails: {},
        //   relatedPersons: [],
        //   economicData: [],
        //   addresses: [],
        //   uploadedPhoto: null
        // });
      }
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Mohon konfirmasi bahwa Wajib Pajak mematuhi pernyataan berikut ini.
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                Dengan menyadari sepenuhnya akan segala akibatnya termasuk sanksi sesuai dengan ketentuan peraturan perundang-undangan yang berlaku, saya
                menyatakan bahwa apa yang saya sampaikan di atas adalah benar dan lengkap, dan saya menyetujui untuk menggunakan Akun Wajib Pajak saya sebagai
                sarana penerimaan surat dan dokumen perpajakan.
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!isAgreed}
              className={`px-6 py-2 rounded font-medium ${isAgreed
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Ajukan Permohonan
            </button>
          </div>
        </div>
      </div>
    );
  };


  // COMPANY
  const Step4CompanyTypeSelection = () => {
    const [selectedCompanyType, setSelectedCompanyType] = useState(
      formData.companyTypeSelection || ''
    );

    const companyTypes = [
      { id: 'badan-internasional', name: 'Badan Internasional' },
      { id: 'badan-usaha-milik-desa', name: 'Badan Usaha Milik Desa' },
      { id: 'bentuk-usaha-tetap', name: 'Bentuk Usaha Tetap (BUT)' },
      { id: 'dana-pensiun', name: 'Dana Pensiun' },
      { id: 'firma', name: 'Firma' },
      { id: 'kantor-perwakilan-perusahaan-asing', name: 'Kantor Perwakilan Perusahaan Asing (KPPA)' },
      { id: 'kerja-sama-operasi', name: 'Kerja Sama Operasi (KSO/JO)' },
      { id: 'kongsi', name: 'Kongsi' },
      { id: 'kontrak-investasi-kolektif', name: 'Kontrak Investasi Kolektif' },
      { id: 'koperasi', name: 'Koperasi' },
      { id: 'lembaga-bukan-lainnya', name: 'Lembaga Bukan Lainnya' },
      { id: 'organisasi-lainnya', name: 'Organisasi Lainnya' },
      { id: 'organisasi-massa', name: 'Organisasi Massa' },
      { id: 'organisasi-politik', name: 'Organisasi Politik' },
      { id: 'pt-perorangan', name: 'PT Perorangan' },
      { id: 'penyelenggara-kegiatan', name: 'Penyelenggara Kegiatan' },
      { id: 'perkumpulan', name: 'Perkumpulan' },
      { id: 'persekutuan-perdata', name: 'Persekutuan Perdata' },
      { id: 'perseroan-komanditer', name: 'Perseroan Komanditer (CV)' },
      { id: 'perseroan-lainnya', name: 'Perseroan Lainnya' },
      { id: 'perseroan-terbatas', name: 'Perseroan Terbatas (PT)' },
      { id: 'perusahaan-umum', name: 'Perusahaan Umum' },
      { id: 'perwalian-negara-asing', name: 'Perwalian Negara Asing' },
      { id: 'yayasan', name: 'Yayasan' }
    ];

    const handleNext = () => {
      if (!selectedCompanyType) {
        toast.error('Silakan pilih jenis badan usaha', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });
        return;
      }

      setFormData({
        ...formData,
        companyTypeSelection: selectedCompanyType
      });
      setCurrentStep(currentStep + 1);
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Persiapan Registrasi Wajib Pajak
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Silakan pilih jenis wajib pajak badan yang sesuai dengan jenis badan usaha atau organisasi yang Anda kelola, masing-masing memiliki kewajiban perpajakan yang berbeda sesuai dengan peraturan perundang-undangan yang berlaku. Pastikan Anda memilih kategori yang sesuai dengan status badan usaha atau organisasi yang Anda kelola untuk menghindari proses administrasi perpajakan.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {companyTypes.map((type) => (
            <SelectionPajakCard
              key={type.id}
              // icon="🏢"
              title={type.name}
              isSelected={selectedCompanyType === type.id}
              onClick={() => setSelectedCompanyType(type.id)}
              className="min-h-[120px] flex flex-col justify-center"
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleNext}
            disabled={!selectedCompanyType}
            className={`px-6 py-2 rounded font-medium ${selectedCompanyType
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Lanjut
          </button>
        </div>
      </div>
    );
  };

  // Step 5: Kuasa Wajib Pajak Form (hanya untuk company)
  const Step5KuasaWajibPajak = () => {
    const [kuasaData, setKuasaData] = useState({
      apakahPermohonanDiajukanOleh: formData.kuasaWajibPajak?.apakahPermohonanDiajukanOleh || '',
      nikPerwakilan: formData.kuasaWajibPajak?.nikPerwakilan || '',
      namaWakilKuasa: formData.kuasaWajibPajak?.namaWakilKuasa || ''
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = () => {
      const newErrors = {};

      // Validation
      if (!kuasaData.apakahPermohonanDiajukanOleh) {
        newErrors.apakahPermohonanDiajukanOleh = 'Field ini wajib diisi';
      }

      if (kuasaData.apakahPermohonanDiajukanOleh === 'Ya' && !kuasaData.nikPerwakilan) {
        newErrors.nikPerwakilan = 'NIK Perwakilan wajib diisi';
      } else if (kuasaData.nikPerwakilan && kuasaData.nikPerwakilan.length !== 16) {
        newErrors.nikPerwakilan = 'NIK harus 16 digit';
      }

      if (kuasaData.apakahPermohonanDiajukanOleh === 'Ya' && !kuasaData.namaWakilKuasa) {
        newErrors.namaWakilKuasa = 'Nama Wakil/Kuasa wajib diisi';
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        setFormData({
          ...formData,
          kuasaWajibPajak: kuasaData
        });
        setCurrentStep(currentStep + 1);
      }
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Kuasa Wajib Pajak
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">
          <StyledInput
            label="Apakah permohonan diajukan oleh Perwakilan Wajib Pajak ?"
            required
            error={errors.apakahPermohonanDiajukanOleh}
          >
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="permohonanDiajukan"
                  value="Ya"
                  checked={kuasaData.apakahPermohonanDiajukanOleh === 'Ya'}
                  onChange={(e) => setKuasaData({
                    ...kuasaData,
                    apakahPermohonanDiajukanOleh: e.target.value
                  })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Ya</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="permohonanDiajukan"
                  value="Tidak"
                  checked={kuasaData.apakahPermohonanDiajukanOleh === 'Tidak'}
                  onChange={(e) => setKuasaData({
                    ...kuasaData,
                    apakahPermohonanDiajukanOleh: e.target.value,
                    nikPerwakilan: '', // Clear when selecting "Tidak"
                    namaWakilKuasa: ''
                  })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Tidak</span>
              </label>
            </div>
          </StyledInput>

          {kuasaData.apakahPermohonanDiajukanOleh === 'Ya' && (
            <>
              <StyledInput
                label="NIK Perwakilan *"
                required
                error={errors.nikPerwakilan}
              >
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nikPerwakilan
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                    }`}
                  placeholder="NIK/NPWP"
                  value={kuasaData.nikPerwakilan}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                    if (value.length <= 16) {
                      setKuasaData({ ...kuasaData, nikPerwakilan: value });
                    }
                  }}
                  maxLength={16}
                />
              </StyledInput>

              <StyledInput
                label="Nama Wakil/Kuasa"
                required
                error={errors.namaWakilKuasa}
              >
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.namaWakilKuasa
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                    }`}
                  placeholder="Nama"
                  value={kuasaData.namaWakilKuasa}
                  onChange={(e) => setKuasaData({
                    ...kuasaData,
                    namaWakilKuasa: e.target.value
                  })}
                />
              </StyledInput>
            </>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    );
  };

  //Step 6 - Company Identity Form (Step 2 stepper)
  const Step6CompanyIdentity = () => {
    const [identity, setIdentity] = useState({
      nomorKeputusanPengesahan: formData.companyIdentity?.nomorKeputusanPengesahan || '',
      namaWajibPajak: formData.companyIdentity?.namaWajibPajak || '',
      tanggalKeputusanPengesahan: formData.companyIdentity?.tanggalKeputusanPengesahan || '',
      nomorAktaPendirian: formData.companyIdentity?.nomorAktaPendirian || '',
      tempatPendirian: formData.companyIdentity?.tempatPendirian || '',
      tanggalPendirian: formData.companyIdentity?.tanggalPendirian || '',
      notarySigningOfficeNik: formData.companyIdentity?.notarySigningOfficeNik || '',
      nameOfNotarySigningOfficer: formData.companyIdentity?.nameOfNotarySigningOfficer || '',
      jenisPerusahaanModal: formData.companyIdentity?.jenisPerusahaanModal || '',
      modalDasar: formData.companyIdentity?.modalDasar || ''
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = () => {
      const newErrors = {};

      // Required field validations
      if (!identity.nomorKeputusanPengesahan) {
        newErrors.nomorKeputusanPengesahan = 'Nomor Keputusan Pengesahan wajib diisi';
      }
      if (!identity.namaWajibPajak) {
        newErrors.namaWajibPajak = 'Nama Wajib Pajak wajib diisi';
      }
      if (!identity.tanggalKeputusanPengesahan) {
        newErrors.tanggalKeputusanPengesahan = 'Tanggal Keputusan Pengesahan wajib diisi';
      }
      if (!identity.nomorAktaPendirian) {
        newErrors.nomorAktaPendirian = 'Nomor Akta Pendirian wajib diisi';
      }
      if (!identity.tempatPendirian) {
        newErrors.tempatPendirian = 'Tempat Pendirian wajib diisi';
      }
      if (!identity.tanggalPendirian) {
        newErrors.tanggalPendirian = 'Tanggal Pendirian wajib diisi';
      }
      if (!identity.notarySigningOfficeNik) {
        newErrors.notarySigningOfficeNik = 'Notary/Signing Office NIK wajib diisi';
      }
      if (!identity.nameOfNotarySigningOfficer) {
        newErrors.nameOfNotarySigningOfficer = 'Name of Notary/Signing Officer wajib diisi';
      }
      if (!identity.jenisPerusahaanModal) {
        newErrors.jenisPerusahaanModal = 'Jenis Perusahaan/Modal wajib dipilih';
      }
      if (!identity.modalDasar) {
        newErrors.modalDasar = 'Modal Dasar wajib diisi';
      }

      // Validate tanggal pendirian is not in future
      if (identity.tanggalPendirian) {
        const foundingDate = new Date(identity.tanggalPendirian);
        const today = new Date();
        if (foundingDate > today) {
          newErrors.tanggalPendirian = 'Tanggal pendirian tidak boleh di masa depan';
        }
      }

      // Validate tanggal keputusan pengesahan is not in future
      if (identity.tanggalKeputusanPengesahan) {
        const decisionDate = new Date(identity.tanggalKeputusanPengesahan);
        const today = new Date();
        if (decisionDate > today) {
          newErrors.tanggalKeputusanPengesahan = 'Tanggal keputusan pengesahan tidak boleh di masa depan';
        }
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        setFormData({ ...formData, companyIdentity: identity });
        setCurrentStep(currentStep + 1);
      } else {
        // Scroll to first error
        const firstErrorField = document.querySelector('.border-red-500');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    return (
      <div>
        <h2 className="text-xl font-semibold mb-6 text-center text-blue-800">
          Masukkan data identitas wajib pajak.
        </h2>

        <div className="space-y-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StyledInput
              label="Nomor Keputusan Pengesahan"
              required
              error={errors.nomorKeputusanPengesahan}
            >
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nomorKeputusanPengesahan
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="Masukkan nomor keputusan ratifikasi"
                value={identity.nomorKeputusanPengesahan}
                onChange={(e) => setIdentity({ ...identity, nomorKeputusanPengesahan: e.target.value })}
              />
            </StyledInput>

            <StyledInput
              label="Nama Wajib Pajak"
              required
              error={errors.namaWajibPajak}
            >
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.namaWajibPajak
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="Masukkan nama wajib pajak"
                value={identity.namaWajibPajak}
                onChange={(e) => setIdentity({ ...identity, namaWajibPajak: e.target.value })}
              />
            </StyledInput>

            <StyledInput
              label="Tanggal Keputusan Pengesahan"
              required
              error={errors.tanggalKeputusanPengesahan}
            >
              <input
                type="date"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.tanggalKeputusanPengesahan
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
                  }`}
                value={identity.tanggalKeputusanPengesahan}
                onChange={(e) => setIdentity({ ...identity, tanggalKeputusanPengesahan: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
              />
            </StyledInput>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StyledInput
              label="Nomor Akta Pendirian"
              required
              error={errors.nomorAktaPendirian}
            >
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nomorAktaPendirian
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="Masukkan nomor dokumen akta pendirian"
                value={identity.nomorAktaPendirian}
                onChange={(e) => setIdentity({ ...identity, nomorAktaPendirian: e.target.value })}
              />
            </StyledInput>

            <StyledInput
              label="Tempat Pendirian"
              required
              error={errors.tempatPendirian}
            >
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.tempatPendirian
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="Masukkan tempat pendirian"
                value={identity.tempatPendirian}
                onChange={(e) => setIdentity({ ...identity, tempatPendirian: e.target.value })}
              />
            </StyledInput>

            <StyledInput
              label="Tanggal Pendirian"
              required
              error={errors.tanggalPendirian}
            >
              <input
                type="date"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.tanggalPendirian
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
                  }`}
                value={identity.tanggalPendirian}
                onChange={(e) => setIdentity({ ...identity, tanggalPendirian: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
              />
            </StyledInput>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StyledInput
              label="Notary/Signing Office NIK"
              required
              error={errors.notarySigningOfficeNik}
            >
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.notarySigningOfficeNik
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="NIK/NPWP"
                value={identity.notarySigningOfficeNik}
                onChange={(e) => setIdentity({ ...identity, notarySigningOfficeNik: e.target.value })}
              />
            </StyledInput>

            <StyledInput
              label="Name of Notary/Signing Officer"
              required
              error={errors.nameOfNotarySigningOfficer}
            >
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nameOfNotarySigningOfficer
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
                  }`}
                placeholder="Nama"
                value={identity.nameOfNotarySigningOfficer}
                onChange={(e) => setIdentity({ ...identity, nameOfNotarySigningOfficer: e.target.value })}
              />
            </StyledInput>

            <StyledInput
              label="Jenis Perusahaan/Modal"
              required
              error={errors.jenisPerusahaanModal}
            >
              <select
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.jenisPerusahaanModal
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
                  }`}
                value={identity.jenisPerusahaanModal}
                onChange={(e) => setIdentity({ ...identity, jenisPerusahaanModal: e.target.value })}
              >
                <option value="">Pilih Jenis Perusahaan</option>
                <option value="PT - Perseroan Terbatas">PT - Perseroan Terbatas</option>
                <option value="CV - Commanditaire Vennootschap">CV - Commanditaire Vennootschap</option>
                <option value="Firma">Firma</option>
                <option value="Koperasi">Koperasi</option>
                <option value="Yayasan">Yayasan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </StyledInput>
          </div>

          <StyledInput
            label="Modal Dasar"
            required
            error={errors.modalDasar}
          >
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.modalDasar
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500'
                }`}
              placeholder="Masukkan modal dasar"
              value={identity.modalDasar}
              onChange={(e) => setIdentity({ ...identity, modalDasar: e.target.value })}
            />
          </StyledInput>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Step7OrangPribadi = () => {
    const [orangPribadi, setOrangPribadi] = useState(formData.orangPribadi || []);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [currentPerson, setCurrentPerson] = useState({
      apakahPIC: false,
      jenisOrangTerkait: '',
      personNikTin: '',
      personName: '',
      kewarganegaraan: '',
      negaraAsal: '',
      email: '',
      mobilePhoneNumber: '',
      tanggalMulai: '',
      tanggalBerakhir: ''
    });

    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
      const phoneRegex = /^0\d{7,14}$/; // Starts with 0, min 8 chars, max 15 chars, digits only
      return phoneRegex.test(phone);
    };

    const handleAddPerson = () => {
      const newErrors = {};

      // Validation
      if (!currentPerson.jenisOrangTerkait) {
        newErrors.jenisOrangTerkait = 'Jenis Orang Terkait wajib dipilih';
      }
      if (!currentPerson.personNikTin) {
        newErrors.personNikTin = 'Person NIK/TIN wajib diisi';
      }
      if (!currentPerson.personName) {
        newErrors.personName = 'Person Name wajib diisi';
      }
      if (!currentPerson.kewarganegaraan) {
        newErrors.kewarganegaraan = 'Kewarganegaraan wajib dipilih';
      }
      if (!currentPerson.negaraAsal) {
        newErrors.negaraAsal = 'Negara Asal wajib dipilih';
      }
      if (!currentPerson.email) {
        newErrors.email = 'E-mail wajib diisi';
      } else if (!validateEmail(currentPerson.email)) {
        newErrors.email = 'Format email tidak valid';
      }
      if (!currentPerson.mobilePhoneNumber) {
        newErrors.mobilePhoneNumber = 'Mobile Phone Number wajib diisi';
      } else if (!validatePhone(currentPerson.mobilePhoneNumber)) {
        newErrors.mobilePhoneNumber = 'Nomor telepon harus dimulai dengan 0, min 8 karakter, maks 15 karakter, dan hanya digit';
      }
      if (!currentPerson.tanggalMulai) {
        newErrors.tanggalMulai = 'Tanggal Mulai wajib diisi';
      }
      if (!currentPerson.tanggalBerakhir) {
        newErrors.tanggalBerakhir = 'Tanggal Berakhir wajib diisi';
      }

      // Validate tanggal berakhir > tanggal mulai
      if (currentPerson.tanggalMulai && currentPerson.tanggalBerakhir) {
        const startDate = new Date(currentPerson.tanggalMulai);
        const endDate = new Date(currentPerson.tanggalBerakhir);
        if (endDate <= startDate) {
          newErrors.tanggalBerakhir = 'Tanggal berakhir harus setelah tanggal mulai';
        }
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        setOrangPribadi([...orangPribadi, { ...currentPerson, id: Date.now() }]);
        setCurrentPerson({
          apakahPIC: false,
          jenisOrangTerkait: '',
          personNikTin: '',
          personName: '',
          kewarganegaraan: '',
          negaraAsal: '',
          email: '',
          mobilePhoneNumber: '',
          tanggalMulai: '',
          tanggalBerakhir: ''
        });
        setShowAddDialog(false);
        setErrors({});

        toast.success('Orang pribadi berhasil ditambahkan', {
          style: { border: '1px solid #10B981', color: '#10B981' }
        });
      }
    };

    const handleDeletePerson = (id) => {
      setOrangPribadi(orangPribadi.filter(p => p.id !== id));
      toast.success('Orang pribadi berhasil dihapus', {
        style: { border: '1px solid #10B981', color: '#10B981' }
      });
    };

    const handleNext = () => {
      // Tidak wajib ada orang pribadi, bisa kosong
      setFormData({ ...formData, orangPribadi });
      setCurrentStep(currentStep + 1);
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Masukkan orang pribadi wajib pajak.
        </h2>

        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-medium mb-6 text-center">Masukkan wajib pajak terkait (jika ada)</h3>

          {/* List of Added Persons */}
          <div className="space-y-3 mb-6">
            {orangPribadi.map((person) => (
              <div key={person.id} className="bg-yellow-400 rounded p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-white text-sm">✎</span>
                  </div>
                  <span className="text-sm">
                    Pemilik Manfaat - {person.personNikTin} - {person.jenisOrangTerkait}****
                  </span>
                </div>
                <button
                  onClick={() => handleDeletePerson(person.id)}
                  className="text-gray-600 hover:text-red-600 text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Add Button */}
          <div className="text-center my-8">
            <button
              onClick={() => setShowAddDialog(true)}
              className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition-colors"
            >
              <span className="text-2xl">⊕</span>
            </button>
          </div>

          {orangPribadi.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Total: {orangPribadi.length} orang pribadi
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Lanjut
            </button>
          </div>
        </div>

        {/* Modal Add Person */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Buat Orang</h3>
                <button
                  onClick={() => {
                    setShowAddDialog(false);
                    setErrors({});
                    setCurrentPerson({
                      apakahPIC: false,
                      jenisOrangTerkait: '',
                      personNikTin: '',
                      personName: '',
                      kewarganegaraan: '',
                      negaraAsal: '',
                      email: '',
                      mobilePhoneNumber: '',
                      tanggalMulai: '',
                      tanggalBerakhir: ''
                    });
                  }}
                  className="text-xl font-bold text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Apakah PIC? */}
                <div className="col-span-2">
                  <StyledInput label="Apakah PIC?">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={currentPerson.apakahPIC}
                        onChange={(e) => setCurrentPerson({
                          ...currentPerson,
                          apakahPIC: e.target.checked
                        })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Ya</span>
                    </label>
                  </StyledInput>
                </div>

                {/* Jenis Orang Terkait */}
                <StyledInput label="Jenis Orang Terkait" required error={errors.jenisOrangTerkait}>
                  <select
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.jenisOrangTerkait
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    value={currentPerson.jenisOrangTerkait}
                    onChange={(e) => setCurrentPerson({
                      ...currentPerson,
                      jenisOrangTerkait: e.target.value
                    })}
                  >
                    <option value="">Select Related Person Type</option>
                    <option value="Direktur">Direktur</option>
                    <option value="Komisaris">Komisaris</option>
                    <option value="Pemegang Saham">Pemegang Saham</option>
                    <option value="Pengurus">Pengurus</option>
                    <option value="Pengawas">Pengawas</option>
                    <option value="Kuasa">Kuasa</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </StyledInput>

                {/* Person NIK/TIN */}
                <StyledInput label="Person NIK/TIN" required error={errors.personNikTin}>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.personNikTin
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    placeholder="NIK/NPWP"
                    value={currentPerson.personNikTin}
                    onChange={(e) => setCurrentPerson({
                      ...currentPerson,
                      personNikTin: e.target.value
                    })}
                  />
                </StyledInput>

                {/* Person Name */}
                <StyledInput label="Person Name" required error={errors.personName}>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.personName
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    placeholder="Nama"
                    value={currentPerson.personName}
                    onChange={(e) => setCurrentPerson({
                      ...currentPerson,
                      personName: e.target.value
                    })}
                  />
                </StyledInput>

                {/* Kewarganegaraan */}
                <StyledInput label="Kewarganegaraan" required error={errors.kewarganegaraan}>
                  <select
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.kewarganegaraan
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    value={currentPerson.kewarganegaraan}
                    onChange={(e) => setCurrentPerson({
                      ...currentPerson,
                      kewarganegaraan: e.target.value
                    })}
                  >
                    <option value="">Select Nationality</option>
                    <option value="WNI">WNI (Warga Negara Indonesia)</option>
                    <option value="WNA">WNA (Warga Negara Asing)</option>
                  </select>
                </StyledInput>

                {/* Negara Asal */}
                <StyledInput label="Negara Asal" required error={errors.negaraAsal}>
                  <select
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.negaraAsal
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    value={currentPerson.negaraAsal}
                    onChange={(e) => setCurrentPerson({
                      ...currentPerson,
                      negaraAsal: e.target.value
                    })}
                  >
                    <option value="">Select Country of origin</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Singapura">Singapura</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Amerika Serikat">Amerika Serikat</option>
                    <option value="Jepang">Jepang</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </StyledInput>

                {/* E-mail */}
                <StyledInput label="E-mail" required error={errors.email}>
                  <input
                    type="email"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter your e-mail Address"
                    value={currentPerson.email}
                    onChange={(e) => setCurrentPerson({
                      ...currentPerson,
                      email: e.target.value.toLowerCase()
                    })}
                  />
                </StyledInput>

                {/* Mobile Phone Number */}
                <StyledInput
                  label="Mobile Phone Number"
                  required
                  error={errors.mobilePhoneNumber}
                  helperText="Nomor telepon dimulai dengan 0, min 8 karakter, maks 15 karakter, dan hanya digit"
                >
                  <input
                    type="tel"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.mobilePhoneNumber
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter your phone number"
                    value={currentPerson.mobilePhoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                      if (value.length <= 15) {
                        setCurrentPerson({
                          ...currentPerson,
                          mobilePhoneNumber: value
                        });
                      }
                    }}
                    maxLength={15}
                  />
                </StyledInput>

                {/* Tanggal Mulai */}
                <StyledInput label="Tanggal Mulai" required error={errors.tanggalMulai}>
                  <input
                    type="date"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.tanggalMulai
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    value={currentPerson.tanggalMulai}
                    onChange={(e) => setCurrentPerson({
                      ...currentPerson,
                      tanggalMulai: e.target.value
                    })}
                  />
                </StyledInput>

                {/* Tanggal Berakhir */}
                <StyledInput label="Tanggal Berakhir" required error={errors.tanggalBerakhir}>
                  <input
                    type="date"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.tanggalBerakhir
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    value={currentPerson.tanggalBerakhir}
                    onChange={(e) => setCurrentPerson({
                      ...currentPerson,
                      tanggalBerakhir: e.target.value
                    })}
                    min={currentPerson.tanggalMulai}
                  />
                </StyledInput>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowAddDialog(false);
                    setErrors({});
                    setCurrentPerson({
                      apakahPIC: false,
                      jenisOrangTerkait: '',
                      personNikTin: '',
                      personName: '',
                      kewarganegaraan: '',
                      negaraAsal: '',
                      email: '',
                      mobilePhoneNumber: '',
                      tanggalMulai: '',
                      tanggalBerakhir: ''
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPerson}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Step8WajibPajakTerkait = () => {
    const [wajibPajakTerkait, setWajibPajakTerkait] = useState(() => {
      // Initialize with existing data or add default owner if empty
      if (formData.wajibPajakTerkait && formData.wajibPajakTerkait.length > 0) {
        return formData.wajibPajakTerkait;
      } else {
        // Add default owner data from company identity
        return [{
          id: 'default-owner',
          jenisWajibPajak: 'Pemilik',
          nikTin: formData.companyIdentity?.notarySigningOfficeNik || '',
          namaWajibPajak: formData.companyIdentity?.nameOfNotarySigningOfficer || 'Pemilik Perusahaan',
          hubunganIstimewa: 'Ya',
          persentaseKepemilikan: '100',
          isDefault: true
        }];
      }
    });

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [currentWajibPajak, setCurrentWajibPajak] = useState({
      jenisWajibPajak: '',
      nikTin: '',
      namaWajibPajak: '',
      hubunganIstimewa: '',
      persentaseKepemilikan: ''
    });

    const [errors, setErrors] = useState({});

    const handleAddWajibPajak = () => {
      const newErrors = {};

      // Validation
      if (!currentWajibPajak.jenisWajibPajak) {
        newErrors.jenisWajibPajak = 'Jenis Wajib Pajak wajib dipilih';
      }
      if (!currentWajibPajak.nikTin) {
        newErrors.nikTin = 'NIK/TIN wajib diisi';
      }
      if (!currentWajibPajak.namaWajibPajak) {
        newErrors.namaWajibPajak = 'Nama Wajib Pajak wajib diisi';
      }
      if (!currentWajibPajak.hubunganIstimewa) {
        newErrors.hubunganIstimewa = 'Hubungan Istimewa wajib dipilih';
      }
      if (!currentWajibPajak.persentaseKepemilikan) {
        newErrors.persentaseKepemilikan = 'Persentase Kepemilikan wajib diisi';
      } else if (isNaN(currentWajibPajak.persentaseKepemilikan) ||
        currentWajibPajak.persentaseKepemilikan < 0 ||
        currentWajibPajak.persentaseKepemilikan > 100) {
        newErrors.persentaseKepemilikan = 'Persentase harus antara 0-100';
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        setWajibPajakTerkait([...wajibPajakTerkait, {
          ...currentWajibPajak,
          id: Date.now(),
          isDefault: false
        }]);
        setCurrentWajibPajak({
          jenisWajibPajak: '',
          nikTin: '',
          namaWajibPajak: '',
          hubunganIstimewa: '',
          persentaseKepemilikan: ''
        });
        setShowAddDialog(false);
        setErrors({});

        toast.success('Wajib pajak terkait berhasil ditambahkan', {
          style: { border: '1px solid #10B981', color: '#10B981' }
        });
      }
    };

    const handleDeleteWajibPajak = (id) => {
      // Don't allow deletion of default owner
      const itemToDelete = wajibPajakTerkait.find(item => item.id === id);
      if (itemToDelete?.isDefault) {
        toast.error('Data pemilik default tidak dapat dihapus', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });
        return;
      }

      setWajibPajakTerkait(wajibPajakTerkait.filter(item => item.id !== id));
      toast.success('Wajib pajak terkait berhasil dihapus', {
        style: { border: '1px solid #10B981', color: '#10B981' }
      });
    };

    const handleNext = () => {
      setFormData({ ...formData, wajibPajakTerkait });
      setCurrentStep(currentStep + 1);
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Masukkan wajib pajak terkait wajib pajak.
        </h2>

        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-medium mb-6 text-center">Tambahkan Wajib Pajak yang Mempunyai Hubungan Istimewa</h3>

          {/* List of Wajib Pajak Terkait */}
          <div className="space-y-3 mb-6">
            {wajibPajakTerkait.map((wajibPajak) => (
              <div key={wajibPajak.id} className="bg-yellow-400 rounded p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-white text-sm">✎</span>
                  </div>
                  <span className="text-sm">
                    {wajibPajak.jenisWajibPajak} - {wajibPajak.nikTin} - {wajibPajak.namaWajibPajak}
                    {wajibPajak.isDefault && <span className="text-xs"> (Default)</span>}
                  </span>
                </div>
                {!wajibPajak.isDefault && (
                  <button
                    onClick={() => handleDeleteWajibPajak(wajibPajak.id)}
                    className="text-gray-600 hover:text-red-600 text-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Button */}
          <div className="text-center my-8">
            <button
              onClick={() => setShowAddDialog(true)}
              className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition-colors"
            >
              <span className="text-2xl">⊕</span>
            </button>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Lanjut
            </button>
          </div>
        </div>

        {/* Modal Add Wajib Pajak */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Tambah Wajib Pajak Terkait</h3>
                <button
                  onClick={() => {
                    setShowAddDialog(false);
                    setErrors({});
                    setCurrentWajibPajak({
                      jenisWajibPajak: '',
                      nikTin: '',
                      namaWajibPajak: '',
                      hubunganIstimewa: '',
                      persentaseKepemilikan: ''
                    });
                  }}
                  className="text-xl font-bold text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Jenis Wajib Pajak */}
                <StyledInput label="Jenis Wajib Pajak" required error={errors.jenisWajibPajak}>
                  <select
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.jenisWajibPajak
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                      }`}
                    value={currentWajibPajak.jenisWajibPajak}
                    onChange={(e) => setCurrentWajibPajak({
                      ...currentWajibPajak,
                      jenisWajibPajak: e.target.value
                    })}
                  >
                    <option value="">Pilih Jenis Wajib Pajak</option>
                    <option value="Pemegang Saham">Pemegang Saham</option>
                    <option value="Komisaris">Komisaris</option>
                    <option value="Direktur">Direktur</option>
                    <option value="Pengurus">Pengurus</option>
                    <option value="Anak Perusahaan">Anak Perusahaan</option>
                    <option value="Induk Perusahaan">Induk Perusahaan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </StyledInput>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* NIK/TIN */}
                  <StyledInput label="NIK/TIN" required error={errors.nikTin}>
                    <input
                      type="text"
                      className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nikTin
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-blue-500'
                        }`}
                      placeholder="NIK/NPWP"
                      value={currentWajibPajak.nikTin}
                      onChange={(e) => setCurrentWajibPajak({
                        ...currentWajibPajak,
                        nikTin: e.target.value
                      })}
                    />
                  </StyledInput>

                  {/* Nama Wajib Pajak */}
                  <StyledInput label="Nama Wajib Pajak" required error={errors.namaWajibPajak}>
                    <input
                      type="text"
                      className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.namaWajibPajak
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-blue-500'
                        }`}
                      placeholder="Nama"
                      value={currentWajibPajak.namaWajibPajak}
                      onChange={(e) => setCurrentWajibPajak({
                        ...currentWajibPajak,
                        namaWajibPajak: e.target.value
                      })}
                    />
                  </StyledInput>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hubungan Istimewa */}
                  <StyledInput label="Hubungan Istimewa" required error={errors.hubunganIstimewa}>
                    <select
                      className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.hubunganIstimewa
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-blue-500'
                        }`}
                      value={currentWajibPajak.hubunganIstimewa}
                      onChange={(e) => setCurrentWajibPajak({
                        ...currentWajibPajak,
                        hubunganIstimewa: e.target.value
                      })}
                    >
                      <option value="">Pilih Hubungan Istimewa</option>
                      <option value="Ya">Ya</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                  </StyledInput>

                  {/* Persentase Kepemilikan */}
                  <StyledInput label="Persentase Kepemilikan (%)" required error={errors.persentaseKepemilikan}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.persentaseKepemilikan
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-blue-500'
                        }`}
                      placeholder="0-100"
                      value={currentWajibPajak.persentaseKepemilikan}
                      onChange={(e) => setCurrentWajibPajak({
                        ...currentWajibPajak,
                        persentaseKepemilikan: e.target.value
                      })}
                    />
                  </StyledInput>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowAddDialog(false);
                    setErrors({});
                    setCurrentWajibPajak({
                      jenisWajibPajak: '',
                      nikTin: '',
                      namaWajibPajak: '',
                      hubunganIstimewa: '',
                      persentaseKepemilikan: ''
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddWajibPajak}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Step9CompanyDocument = () => {
    const [documents, setDocuments] = useState({
      establishmentDocument: formData.documents?.establishmentDocument || null,
      authorizationLetter: formData.documents?.authorizationLetter || null
    });

    const [previews, setPreviews] = useState({
      establishmentDocument: null,
      authorizationLetter: null
    });

    const handleFileUpload = (documentType, event) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('Format file harus PDF, JPG, JPEG, atau PNG', {
            style: { border: '1px solid #DC2626', color: '#DC2626' }
          });
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Ukuran file maksimal 5MB', {
            style: { border: '1px solid #DC2626', color: '#DC2626' }
          });
          return;
        }

        setDocuments({
          ...documents,
          [documentType]: file
        });

        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviews({
              ...previews,
              [documentType]: e.target.result
            });
          };
          reader.readAsDataURL(file);
        } else {
          setPreviews({
            ...previews,
            [documentType]: null
          });
        }

        toast.success(`${documentType === 'establishmentDocument' ? 'Establishment Document' : 'Authorization Letter'} berhasil diupload`, {
          style: { border: '1px solid #10B981', color: '#10B981' }
        });
      }
    };

    const removeDocument = (documentType) => {
      setDocuments({
        ...documents,
        [documentType]: null
      });
      setPreviews({
        ...previews,
        [documentType]: null
      });

      toast.success('Dokumen berhasil dihapus', {
        style: { border: '1px solid #10B981', color: '#10B981' }
      });
    };

    const handleNext = () => {
      // Validate required documents
      if (!documents.establishmentDocument) {
        toast.error('Establishment Document wajib diupload', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });
        return;
      }

      if (!documents.authorizationLetter) {
        toast.error('Authorization Letter wajib diupload', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });
        return;
      }

      setFormData({ ...formData, documents });
      setCurrentStep(currentStep + 1);
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Silakan unggah dokumen yang diperlukan
        </h2>

        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 mb-8 text-center">
            Silakan unggah dokumen berikut sebelum mengajukan aplikasi:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Establishment Document */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-center">
                Establishment Document <span className="text-red-500">*</span>
              </h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {documents.establishmentDocument ? (
                  <div className="space-y-4">
                    {previews.establishmentDocument ? (
                      <img
                        src={previews.establishmentDocument}
                        alt="Establishment Document Preview"
                        className="max-w-full max-h-32 mx-auto rounded"
                      />
                    ) : (
                      <div className="text-4xl text-blue-500 mb-2">📄</div>
                    )}
                    <p className="text-sm text-gray-600">{documents.establishmentDocument.name}</p>
                    <div className="space-y-2">
                      <p className="text-green-600 font-medium">✓ Dokumen berhasil diupload</p>
                      <button
                        onClick={() => removeDocument('establishmentDocument')}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                      >
                        Hapus Dokumen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-4xl text-gray-400 mb-2">📄</div>
                    <p className="text-gray-600 mb-4">Seret dokumen Anda ke sini</p>
                    <p className="text-gray-500 mb-4">Atau</p>
                    <label className="bg-blue-600 text-white px-6 py-3 rounded cursor-pointer hover:bg-blue-700 inline-block transition-colors">
                      Jelajahi di pengelolaan file Anda
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('establishmentDocument', e)}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Format: PDF, JPG, JPEG, PNG (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Authorization Letter */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-center">
                Authorization letter <span className="text-red-500">*</span>
              </h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {documents.authorizationLetter ? (
                  <div className="space-y-4">
                    {previews.authorizationLetter ? (
                      <img
                        src={previews.authorizationLetter}
                        alt="Authorization Letter Preview"
                        className="max-w-full max-h-32 mx-auto rounded"
                      />
                    ) : (
                      <div className="text-4xl text-blue-500 mb-2">📄</div>
                    )}
                    <p className="text-sm text-gray-600">{documents.authorizationLetter.name}</p>
                    <div className="space-y-2">
                      <p className="text-green-600 font-medium">✓ Dokumen berhasil diupload</p>
                      <button
                        onClick={() => removeDocument('authorizationLetter')}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                      >
                        Hapus Dokumen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-4xl text-gray-400 mb-2">📄</div>
                    <p className="text-gray-600 mb-4">Seret dokumen Anda ke sini</p>
                    <p className="text-gray-500 mb-4">Atau</p>
                    <label className="bg-blue-600 text-white px-6 py-3 rounded cursor-pointer hover:bg-blue-700 inline-block transition-colors">
                      Jelajahi di pengelolaan file Anda
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('authorizationLetter', e)}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Format: PDF, JPG, JPEG, PNG (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Step9CompanyDataEkonomi = () => {
    const [economicData, setEconomicData] = useState({
      metodePembukuan: formData.companyEconomicData?.metodePembukuan || 'Pembukuan',
      mataUangPembukuan: formData.companyEconomicData?.mataUangPembukuan || 'Rupiah Indonesia',
      periodePembukuan: formData.companyEconomicData?.periodePembukuan || '01-12',
      kluUtama: formData.companyEconomicData?.kluUtama || [],
      kluTambahan: formData.companyEconomicData?.kluTambahan || []
    });

    const [showKluModal, setShowKluModal] = useState(false);
    const [currentKluType, setCurrentKluType] = useState(''); // 'utama' or 'tambahan'
    const [currentKlu, setCurrentKlu] = useState({
      kluCode: '',
      kluName: '',
      uraian: ''
    });

    const handleKluSelect = (klu) => {
      setCurrentKlu({
        kluCode: klu.code,
        kluName: klu.name,
        uraian: ''
      });
      setShowKluModal(false);
    };

    const handleAddKlu = () => {
      if (!currentKlu.kluCode) {
        toast.error('Silakan pilih kode KLU terlebih dahulu', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });
        return;
      }

      if (!currentKlu.uraian) {
        toast.error('Uraian wajib diisi', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });
        return;
      }

      const newKlu = { ...currentKlu, id: Date.now() };

      if (currentKluType === 'utama') {
        setEconomicData({
          ...economicData,
          kluUtama: [...economicData.kluUtama, newKlu]
        });
      } else {
        setEconomicData({
          ...economicData,
          kluTambahan: [...economicData.kluTambahan, newKlu]
        });
      }

      setCurrentKlu({ kluCode: '', kluName: '', uraian: '' });
      setCurrentKluType('');

      toast.success('KLU berhasil ditambahkan', {
        style: { border: '1px solid #10B981', color: '#10B981' }
      });
    };

    const handleDeleteKlu = (type, id) => {
      if (type === 'utama') {
        setEconomicData({
          ...economicData,
          kluUtama: economicData.kluUtama.filter(klu => klu.id !== id)
        });
      } else {
        setEconomicData({
          ...economicData,
          kluTambahan: economicData.kluTambahan.filter(klu => klu.id !== id)
        });
      }

      toast.success('KLU berhasil dihapus', {
        style: { border: '1px solid #10B981', color: '#10B981' }
      });
    };

    const handleNext = () => {
      if (economicData.kluUtama.length === 0) {
        toast.error('Minimal satu KLU Utama harus ditambahkan', {
          style: { border: '1px solid #DC2626', color: '#DC2626' }
        });
        return;
      }

      setFormData({ ...formData, companyEconomicData: economicData });
      setCurrentStep(currentStep + 1);
    };

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Masukkan data ekonomi wajib pajak.
        </h2>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Basic Economic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StyledInput label="Metode Pembukuan/Pencatatan" required>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={economicData.metodePembukuan}
                onChange={(e) => setEconomicData({
                  ...economicData,
                  metodePembukuan: e.target.value
                })}
              >
                <option value="Pembukuan">Pembukuan</option>
                <option value="Pencatatan">Pencatatan</option>
              </select>
            </StyledInput>

            <StyledInput label="Mata Uang Pembukuan" required>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={economicData.mataUangPembukuan}
                onChange={(e) => setEconomicData({
                  ...economicData,
                  mataUangPembukuan: e.target.value
                })}
              >
                <option value="Rupiah Indonesia">Rupiah Indonesia</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </StyledInput>

            <StyledInput label="Periode Pembukuan" required>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={economicData.periodePembukuan}
                onChange={(e) => setEconomicData({
                  ...economicData,
                  periodePembukuan: e.target.value
                })}
              >
                <option value="01-12">01-12</option>
                <option value="04-03">04-03</option>
              </select>
            </StyledInput>
          </div>

          {/* KLU Utama dan KLU Tambahan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* KLU Utama */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-center">KLU Utama</h3>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-100"
                    placeholder="keterangan_sosial_(*sosial*"
                    value={currentKluType === 'utama' ? currentKlu.kluCode : ''}
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentKluType('utama');
                      setShowKluModal(true);
                    }}
                    className="bg-blue-800 text-white px-4 py-2 rounded"
                  >
                    Cari
                  </button>
                </div>

                <StyledInput label="Uraian *">
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={currentKluType === 'utama' ? currentKlu.uraian : ''}
                    onChange={(e) => currentKluType === 'utama' && setCurrentKlu({
                      ...currentKlu,
                      uraian: e.target.value
                    })}
                  >
                    <option value="">["sosial"]["Lembaga formal dan nonformal","Parti Asuhan, Parti"</option>
                    <option value="sosial">*sosial*["Lembaga formal dan nonformal","Parti Asuhan, Parti Sosial"]</option>
                    <option value="komunikasi">*komunikasi*["Memberi bantuan kepada korban bencana"]</option>
                    <option value="keagamaan">*keagamaan*["Mendirikan sarana ibadah"]</option>
                  </select>
                </StyledInput>

                {/* List KLU Utama yang sudah ditambahkan */}
                {economicData.kluUtama.map((klu) => (
                  <div key={klu.id} className="bg-gray-100 rounded p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{klu.kluCode}</div>
                      <div className="text-sm text-gray-600">{klu.uraian}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteKlu('utama', klu.id)}
                      className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* KLU Tambahan */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-center">KLU Tambahan</h3>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-100"
                    placeholder="keterangan_kemanusiaan"
                    value={currentKluType === 'tambahan' ? currentKlu.kluCode : ''}
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentKluType('tambahan');
                      setShowKluModal(true);
                    }}
                    className="bg-blue-800 text-white px-4 py-2 rounded"
                  >
                    Cari
                  </button>
                </div>

                <StyledInput label="Uraian *">
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={currentKluType === 'tambahan' ? currentKlu.uraian : ''}
                    onChange={(e) => currentKluType === 'tambahan' && setCurrentKlu({
                      ...currentKlu,
                      uraian: e.target.value
                    })}
                  >
                    <option value="">["kemanusiaan"]["Memberi bantuan kepada korban bencana</option>
                    <option value="komunikasi">*komunikasi*["Memberi bantuan kepada korban bencana"]</option>
                    <option value="keagamaan">*keagamaan*["Mendirikan sarana ibadah"]</option>
                    <option value="sosial">*sosial*["Lembaga formal dan nonformal"]</option>
                  </select>
                </StyledInput>

                {/* List KLU Tambahan yang sudah ditambahkan */}
                {economicData.kluTambahan.map((klu) => (
                  <div key={klu.id} className="bg-gray-100 rounded p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{klu.kluCode}</div>
                      <div className="text-sm text-gray-600">{klu.uraian}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteKlu('tambahan', klu.id)}
                      className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Second KLU Tambahan Entry */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-100"
                      placeholder="keterangan_keagamaan_("
                      readOnly
                    />
                    <button
                      type="button"
                      className="bg-blue-800 text-white px-4 py-2 rounded"
                    >
                      Cari
                    </button>
                  </div>

                  <StyledInput label="Uraian *">
                    <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
                      <option value="">["keagamaan"]["Mendirikan sarana</option>
                      <option value="keagamaan">*keagamaan*["Mendirikan sarana ibadah"]</option>
                    </select>
                  </StyledInput>
                </div>
              </div>
            </div>
          </div>

          {/* Tambahkan Kode Ekonomi Button */}
          <div className="text-center">
            <button
              onClick={handleAddKlu}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              disabled={!currentKlu.kluCode || !currentKlu.uraian}
            >
              Tambahkan Kode Ekonomi
            </button>
          </div>

          {/* Additional Company Fields */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-8 border-t">
            <StyledInput label="Merek Dagang/Usaha">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={economicData.merekDagang || ''}
                onChange={(e) => setEconomicData({
                  ...economicData,
                  merekDagang: e.target.value
                })}
              />
            </StyledInput>

            <StyledInput label="Memiliki Karyawan *" required>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={economicData.memilikiKaryawan || ''}
                onChange={(e) => setEconomicData({
                  ...economicData,
                  memilikiKaryawan: e.target.value
                })}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </StyledInput>

            <StyledInput label="Omset per tahun *" required>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={economicData.omsetPerTahun || ''}
                onChange={(e) => setEconomicData({
                  ...economicData,
                  omsetPerTahun: e.target.value
                })}
              >
                <option value="">Pilih Omset Tahunan</option>
                <option value="< 300 juta">{`< 300 juta`}</option>
                <option value="300 juta - 2.5 milyar">300 juta - 2.5 milyar</option>c1
                <option value="2.5 milyar - 50 milyar">2.5 milyar - 50 milyar</option>
                <option value="> 50 milyar">{`> 50 milyar`}</option>
              </select>
            </StyledInput>

            <StyledInput label="Metode Pembukuan/Pencatatan *" required>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={economicData.metodePembukuan}
                onChange={(e) => setEconomicData({
                  ...economicData,
                  metodePembukuan: e.target.value
                })}
              >
                <option value="">Pilih Metode Pembukuan</option>
                <option value="Pembukuan">Pembukuan</option>
                <option value="Pencatatan">Pencatatan</option>
              </select>
            </StyledInput>

            <StyledInput label="Mata Uang Pembukuan *" required>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={economicData.mataUangPembukuan}
                onChange={(e) => setEconomicData({
                  ...economicData,
                  mataUangPembukuan: e.target.value
                })}
              >
                <option value="">Rupiah Indonesia</option>
                <option value="Rupiah Indonesia">Rupiah Indonesia</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </StyledInput>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <StyledInput label="Periode Pembukuan *" required>
              <select
                className="w-full md:w-1/5 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={economicData.periodePembukuan}
                onChange={(e) => setEconomicData({
                  ...economicData,
                  periodePembukuan: e.target.value
                })}
              >
                <option value="">Pilih Periode Pembukuan</option>
                <option value="01-12">01-12</option>
                <option value="04-03">04-03</option>
              </select>
            </StyledInput>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Lanjut
            </button>
          </div>
        </div>

        {/* KLU Modal */}
        <KluModal
          isOpen={showKluModal}
          onClose={() => setShowKluModal(false)}
          onSelect={handleKluSelect}
        />
      </div>
    );
  };


  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    if (formData.taxpayerType === 'company') {
      switch (currentStep) {
        case 1: return <Step1TaxpayerType />;
        case 2: return <Step4CompanyTypeSelection />;
        case 3: return <Step5KuasaWajibPajak />; // Step 1 stepper
        case 4: return <Step6CompanyIdentity />; // Step 2 stepper  
        case 5: return <Step5ContactDetails />; // Step 3 stepper (reuse existing)
        case 6: return <Step7OrangPribadi />;
        case 7: return <Step8WajibPajakTerkait />;
        case 8: return <Step9CompanyDataEkonomi />;
        case 9: return <StepAddressDetails />;
        case 10: return <Step9CompanyDocument />;
        case 11: return <StepDeclaration />;
        // ... steps selanjutnya
        default: return <Step1TaxpayerType />;
      }
    }


    // For registration-only flow (5 steps)
    if (formData.registrationType === 'registration-only') {
      switch (currentStep) {
        case 1: return <Step1TaxpayerType />;
        case 2: return <Step2NIKStatus />;
        case 3: return <Step3RegistrationType />;
        case 4: return <Step4TaxpayerIdentity />;
        case 2: return <Step5ContactDetails />;
        case 3: return <StepEconomicData />;
        case 4: return <StepAddressDetails />;
        case 5: return <StepDeclaration />;
        default: return <Step1TaxpayerType />;
      }
    }

    // For nik-activation flow (7 steps)
    switch (currentStep) {
      case 1: return <Step1TaxpayerType />;
      case 2: return <Step2NIKStatus />;
      case 3: return <Step3RegistrationType />;
      case 4: return <Step4TaxpayerIdentity />;
      case 5: return <Step5ContactDetails />;
      case 6: return <Step6RelatedPersons />;
      case 7: return <StepEconomicData />;
      case 8: return <StepAddressDetails />;
      case 9: return <StepIdentityVerification />;
      case 10: return <StepDeclaration />;
      default: return <Step1TaxpayerType />;
    }
  };

  const getDisplayStep = () => {
    if (formData.taxpayerType === 'company') {
      if (currentStep <= 2) return currentStep;
      // For company: steps 3-11 become steps 1-9
      return currentStep - 2;
    }

    if (currentStep <= 3) return currentStep;

    if (formData.registrationType === 'registration-only') {
      // For registration-only: steps 4-8 become steps 1-5
      return currentStep - 3;
    } else {
      // For nik-activation: steps 4-10 become steps 1-7  
      return currentStep - 3;
    }
  };

  const lengthRegisterShowSteps = formData.taxpayerType === 'company' ? (currentStep > 2) : (currentStep > 3);

  const handleStepClick = (stepNumber) => {
    // Calculate actual step based on flow type
    let actualStep;

    if (formData.taxpayerType === 'company') {
      if (currentStep <= 2) {
        // Can't click steps when in initial selection
        return;
      }
      // For company: displayed steps 1-9 map to actual steps 3-11
      actualStep = stepNumber + 2;
    } else {
      if (currentStep <= 3) {
        // Can't click steps when in initial selection
        return;
      }

      if (formData.registrationType === 'registration-only') {
        // For registration-only: displayed steps 1-5 map to actual steps 4-8
        actualStep = stepNumber + 3;
      } else {
        // For nik-activation: displayed steps 1-7 map to actual steps 4-10
        actualStep = stepNumber + 3;
      }
    }

    // Only allow clicking on completed or current steps
    if (actualStep <= currentStep) {
      setCurrentStep(actualStep);
    }
  }
  return (
    <PortalLayout>
      <div className="flex-1 flex flex-col p-8">
        <h1 className="text-2xl font-bold text-blue-800 mb-8 text-center">
          e-<span className="text-blue-800">TAXZONE</span> <span className="text-yellow-500">POLINEMA</span>
        </h1>

        <div className="flex-1 bg-white rounded-lg shadow-xl p-8">
          {/* Only show step indicator after step 3 */}
          {lengthRegisterShowSteps && (
            <StepIndicator
              currentStep={getDisplayStep()}
              totalSteps={steps.length}
              steps={steps}
              onStepClick={handleStepClick}  // ADD THIS PROP
            />
          )}

          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation Buttons for first 3 steps */}
          {((formData.taxpayerType === 'company' && currentStep <= 2) ||
            (formData.taxpayerType !== 'company' && currentStep <= 3)) && (
              <div className="flex justify-center gap-4 mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                  >
                    Previous
                  </button>
                )}
                {/* Show next button for company */}
                {formData.taxpayerType === 'company' && (
                  (currentStep === 1 && formData.taxpayerType) ||
                  (currentStep === 2 && formData.companyTypeSelection)
                ) && (
                    <button
                      onClick={handleNext}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Next
                    </button>
                  )}
                {/* Show next button for individual */}
                {formData.taxpayerType !== 'company' && (
                  (currentStep === 1 && formData.taxpayerType) ||
                  (currentStep === 2 && formData.hasNIK !== null) ||
                  (currentStep === 3 && formData.registrationType)
                ) && (
                    <button
                      onClick={handleNext}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Next
                    </button>
                  )}
              </div>
            )}
          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Already have an account? Login here
            </a>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

export default Registration;