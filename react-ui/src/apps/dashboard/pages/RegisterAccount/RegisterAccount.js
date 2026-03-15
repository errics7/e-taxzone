import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import PortalLayout from "../../component/Layout";
import individual from "../../assets/perorangan.png";
import company from "../../assets/badan.png";
import nik from "../../assets/nik.png";
import registrationonly from "../../assets/registration-only.png";
import API from "../../../../utils/host.config";
import axios from "axios";
import toast from "react-hot-toast";

// Components
import StepIndicator from "./components/StepIndicator";
import StepNavigation from "./components/StepNavigation";
import { SelectionCard, SelectionPajakCard } from "./components/SelectionCard";
import TaxpayerDeclaration from "./components/TaxpayerDeclaration";

// StepPribadi
import StepTaxpayerIdentity from "./StepPribadi/StepTaxpayerIdentity";
import StepContactDetailsPribadi from "./StepPribadi/StepContactDetails";
import StepRelatedPersons from "./StepPribadi/StepRelatedPersons";
import StepEconomicDataPribadi from "./StepPribadi/StepEconomicData";
import StepAddressDetails from "./StepPribadi/StepAddressDetails";
import StepIdentityVerification from "./StepPribadi/StepIdentityVerification";

// StepBisnis
import StepKuasaWajibPajak from "./StepBisnis/StepKuasaWajibPajak";
import StepCompanyIdentity from "./StepBisnis/StepCompanyIdentity";
import StepContactDetailsBisnis from "./StepBisnis/StepContactDetails";
import StepOrangPribadi from "./StepBisnis/StepOrangPribadi";
import StepWajibPajakTerkait from "./StepBisnis/StepWajibPajakTerkait";
import StepEconomicDataBisnis from "./StepBisnis/StepEconomicData";
import StepAddressBisnis from "./StepBisnis/StepAddress";
import StepDocuments from "./StepBisnis/StepDocuments";

// ─────────────────────────────────────────────
// MAIN WIZARD CONTROLLER
// ─────────────────────────────────────────────
function Registration() {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Holds the active step's validate-and-advance function.
  // Each wizard step calls onRegisterValidator(fn) on mount to register it.
  // StepNavigation's Next button calls activeStepValidator.current() instead of
  // the bare handleNext, so validation always runs before the step advances.
  const activeStepValidator = useRef(null);

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
    declarationAccepted: false,

    // Company specific fields
    companyTypeSelection: '',
    kuasaWajibPajak: {},
    companyIdentity: {},
    orangPribadi: [],
    wajibPajakTerkait: [],
    companyEconomicData: {},
    documents: {}
  });

  // ── Beforeunload guard ──────────────────────
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
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, currentStep]);

  // ── Track form changes ──────────────────────
  useEffect(() => {
    const hasData =
      formData.taxpayerType ||
      formData.hasNIK !== null ||
      formData.registrationType ||
      Object.keys(formData.taxpayerIdentity).length > 0 ||
      Object.keys(formData.contactDetails).length > 0 ||
      formData.relatedPersons.length > 0 ||
      formData.economicData.length > 0 ||
      formData.addresses.length > 0 ||
      formData.uploadedPhoto ||
      formData.companyTypeSelection ||
      Object.keys(formData.kuasaWajibPajak || {}).length > 0 ||
      Object.keys(formData.companyIdentity || {}).length > 0 ||
      formData.orangPribadi.length > 0 ||
      formData.wajibPajakTerkait.length > 0 ||
      Object.keys(formData.companyEconomicData || {}).length > 0 ||
      Object.keys(formData.documents || {}).length > 0;

    setHasUnsavedChanges(hasData);
  }, [formData]);

  // ── Step labels ─────────────────────────────
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

  // ── Bug prevention: clamp step if flow changes ──
  useEffect(() => {
    const totalSteps = getSteps().length;
    const preparationSteps = formData.taxpayerType === 'company' ? 2 : 3;
    const maxActualStep = preparationSteps + totalSteps;
    if (currentStep > maxActualStep) {
      setCurrentStep(1);
    }
  }, [formData.taxpayerType, formData.registrationType]);

  // ── Submit registration ─────────────────────
  const submitRegistration = async (latestFormData) => {
    const fd = latestFormData || formData;

    // Declaration safety check
    if (!fd.declarationAccepted) {
      toast.error('Anda harus menyetujui pernyataan wajib pajak sebelum mengajukan permohonan.', {
        style: { minWidth: '250px', border: '1px solid #DC2626', padding: '16px', color: '#DC2626' }
      });
      return;
    }

    if (!isSubmitting) {
      setIsSubmitting(true);

      const validationErrors = [];

      if (!fd.taxpayerType) validationErrors.push('Taxpayer type is required');

      if (fd.taxpayerType === 'company') {
        if (!fd.companyTypeSelection) validationErrors.push('Company type selection is required');
        if (!fd.kuasaWajibPajak || Object.keys(fd.kuasaWajibPajak).length === 0) validationErrors.push('Kuasa Wajib Pajak data is required');
        if (!fd.companyIdentity || Object.keys(fd.companyIdentity).length === 0) validationErrors.push('Company identity data is required');
        if (!fd.contactDetails || Object.keys(fd.contactDetails).length === 0) validationErrors.push('Contact details are required');
        if (!fd.companyEconomicData || Object.keys(fd.companyEconomicData).length === 0) validationErrors.push('Company economic data is required');
        if (!fd.addresses || fd.addresses.length === 0) validationErrors.push('At least one address is required');
      } else {
        if (fd.hasNIK === null) validationErrors.push('NIK status is required');
        if (!fd.registrationType) validationErrors.push('Registration type is required');
        if (!fd.taxpayerIdentity || Object.keys(fd.taxpayerIdentity).length === 0) validationErrors.push('Taxpayer identity data is required');
        if (!fd.contactDetails || Object.keys(fd.contactDetails).length === 0) validationErrors.push('Contact details are required');
        if (!fd.economicData || fd.economicData.length === 0) validationErrors.push('At least one economic data entry is required');
        if (!fd.addresses || fd.addresses.length === 0) validationErrors.push('At least one address is required');
        if (fd.registrationType === 'nik-activation' && !fd.uploadedPhoto) validationErrors.push('Photo upload is required for NIK activation');
      }

      if (validationErrors.length > 0) {
        setIsSubmitting(false);
        toast.error(validationErrors.join(', '), {
          style: { minWidth: '250px', border: '1px solid #DC2626', padding: '16px', color: '#DC2626' }
        });
        return;
      }

      try {
        const submissionData = new FormData();
        submissionData.append('taxpayerType', fd.taxpayerType);

        if (fd.taxpayerType === 'company') {
          submissionData.append('companyTypeSelection', fd.companyTypeSelection);
          submissionData.append('kuasaWajibPajak', JSON.stringify(fd.kuasaWajibPajak));
          submissionData.append('companyIdentity', JSON.stringify(fd.companyIdentity));
          submissionData.append('contactDetails', JSON.stringify(fd.contactDetails));
          submissionData.append('orangPribadi', JSON.stringify(fd.orangPribadi || []));
          submissionData.append('wajibPajakTerkait', JSON.stringify(fd.wajibPajakTerkait || []));
          submissionData.append('companyEconomicData', JSON.stringify(fd.companyEconomicData));
          submissionData.append('addresses', JSON.stringify(fd.addresses));
          if (fd.documents?.establishmentDocument) submissionData.append('establishmentDocument', fd.documents.establishmentDocument);
          if (fd.documents?.authorizationLetter) submissionData.append('authorizationLetter', fd.documents.authorizationLetter);
        } else {
          submissionData.append('hasNIK', fd.hasNIK);
          submissionData.append('registrationType', fd.registrationType);
          submissionData.append('taxpayerIdentity', JSON.stringify(fd.taxpayerIdentity));
          submissionData.append('contactDetails', JSON.stringify(fd.contactDetails));
          submissionData.append('relatedPersons', JSON.stringify(fd.relatedPersons));
          submissionData.append('economicData', JSON.stringify(fd.economicData));
          submissionData.append('addresses', JSON.stringify(fd.addresses));
          if (fd.uploadedPhoto) submissionData.append('profile_image', fd.uploadedPhoto);
        }

        const callreg = axios.post(
          `${API.HOST}/api/v2/auth/signup`,
          submissionData,
          {
            timeout: 1000 * 60,
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );

        toast.promise(
          callreg,
          {
            loading: "Mendaftarkan akun Anda...",
            success: (data) => {
              setIsSubmitting(false);
              if (data && data.data.success) {
                setFormData({
                  taxpayerType: '', hasNIK: null, registrationType: '',
                  taxpayerIdentity: {}, contactDetails: {}, relatedPersons: [],
                  economicData: [], addresses: [], uploadedPhoto: null,
                  declarationAccepted: false, companyTypeSelection: '',
                  kuasaWajibPajak: {}, companyIdentity: {}, orangPribadi: [],
                  wajibPajakTerkait: [], companyEconomicData: {}, documents: {}
                });
                setCurrentStep(1);
                setHasUnsavedChanges(false);
                setTimeout(() => history.push('/login'), 3000);
              }
              return data.data.success ? (
                <div className="relative">
                  <span className="absolute inset-y-0 -left-5 flex items-center">✅</span>
                  <p className="pl-3">{data.data.message}</p>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute inset-y-0 -left-5 flex items-center">❌</span>
                  <p className="pl-3">{data.data.message}</p>
                </div>
              );
            },
            error: (error) => {
              setIsSubmitting(false);
              console.error('Registration error:', error);
              if (error.code === "ECONNABORTED") return <b>Periksa koneksi anda dan ulangi beberapa saat lagi.</b>;
              if (error.response?.data?.message) return <b>{error.response.data.message}</b>;
              return <b>Terjadi kesalahan pada server, silakan coba lagi nanti</b>;
            },
          },
          {
            style: { minWidth: "300px", border: "1px solid #1E40AF", padding: "16px", color: "#1E40AF", marginBottom: "25px" },
            success: { duration: 6000, icon: "" },
            error: { duration: 5000, icon: "❌" },
          }
        );
      } catch (error) {
        setIsSubmitting(false);
        console.error('Submission error:', error);
        toast.error('Terjadi kesalahan saat mengirim data', {
          style: { minWidth: "250px", border: "1px solid #DC2626", padding: "16px", color: "#DC2626" }
        });
      }
    }
  };

  // ─────────────────────────────────────────────
  // PREPARATION STEPS (not wizard steps)
  // These determine the flow; they stay in this file.
  // ─────────────────────────────────────────────

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
          onClick={() => setFormData({ ...formData, taxpayerType: 'individual', companyTypeSelection: '' })}
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

  const Step2NIKStatus = () => (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Taxpayer Registration Preparation</h2>
      <p className="text-gray-600 mb-8">
        Have taxpayers registered with a Population Identification Number (NIK)?
      </p>
      <div className="flex justify-center gap-4">
        <button
          className={`px-8 py-3 rounded font-medium min-w-[200px] ${formData.hasNIK === true ? 'bg-green-600 text-white' : 'border border-green-600 text-green-600 hover:bg-green-50'}`}
          onClick={() => setFormData({ ...formData, hasNIK: true })}
        >
          ✓ Yes, Taxpayers Have NIK
        </button>
        <button
          className={`px-8 py-3 rounded font-medium min-w-[200px] ${formData.hasNIK === false ? 'bg-red-600 text-white' : 'border border-red-600 text-red-600 hover:bg-red-50'}`}
          onClick={() => setFormData({ ...formData, hasNIK: false })}
        >
          ✗ Do Not Have NIK
        </button>
      </div>
    </div>
  );

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

  // Company type selection (preparation for company flow)
  const Step4CompanyTypeSelection = () => {
    const [selectedCompanyType, setSelectedCompanyType] = useState(formData.companyTypeSelection || '');

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
        toast.error('Silakan pilih jenis badan usaha', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
        return;
      }
      setFormData({ ...formData, companyTypeSelection: selectedCompanyType });
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
            className={`px-6 py-2 rounded font-medium ${selectedCompanyType ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Lanjut
          </button>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────
  // NAVIGATION HELPERS
  // ─────────────────────────────────────────────

  const handleNext = () => {
    if (currentStep < (formData.taxpayerType === 'company' ? 2 : 3) + steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Called by StepNavigation's Next button.
  // If the active step has registered a validator, run it (it handles advancing
  // the step itself after validation passes).  Otherwise fall back to bare advance.
  const handleValidatedNext = () => {
    if (activeStepValidator.current) {
      activeStepValidator.current();
    } else {
      handleNext();
    }
  };

  // Step props builder.
  // onRegisterValidator lets each step register its internal handleSubmit so that
  // StepNavigation can trigger it.
  const stepProps = {
    formData,
    setFormData,
    onNext: handleNext,
    onPrevious: handlePrev,
    onRegisterValidator: (fn) => { activeStepValidator.current = fn; },
  };

  // ─────────────────────────────────────────────
  // WIZARD-STEP NAVIGATION BAR HELPERS
  // ─────────────────────────────────────────────

  // True while the user is on the preparation screens (not yet in the wizard).
  const isOnPrepStep =
    (formData.taxpayerType === 'company' && currentStep <= 2) ||
    (formData.taxpayerType !== 'company' && currentStep <= 3);

  // Within the wizard portion, what is the 1-based position?
  const prepOffset = formData.taxpayerType === 'company' ? 2 : 3;
  const wizardPosition = currentStep - prepOffset; // 1 = first wizard step

  const isFirstWizardStep = wizardPosition === 1;
  const isLastWizardStep  = wizardPosition === steps.length;

  // TaxpayerDeclaration manages its own Submit button, so we hide StepNavigation
  // on the declaration step to avoid a duplicate Submit.
  const isDeclarationStep = isLastWizardStep;

  // ─────────────────────────────────────────────
  // RENDER CURRENT STEP
  // ─────────────────────────────────────────────

  const renderCurrentStep = () => {
    if (formData.taxpayerType === 'company') {
      switch (currentStep) {
        case 1: return <Step1TaxpayerType />;
        case 2: return <Step4CompanyTypeSelection />;
        case 3: return <StepKuasaWajibPajak {...stepProps} />;
        case 4: return <StepCompanyIdentity {...stepProps} />;
        case 5: return <StepContactDetailsBisnis {...stepProps} />;
        case 6: return <StepOrangPribadi {...stepProps} />;
        case 7: return <StepWajibPajakTerkait {...stepProps} />;
        case 8: return <StepEconomicDataBisnis {...stepProps} />;
        case 9: return <StepAddressBisnis {...stepProps} />;
        case 10: return <StepDocuments {...stepProps} />;
        case 11: return (
          <TaxpayerDeclaration
            formData={formData}
            setFormData={setFormData}
            onSubmit={submitRegistration}
            isSubmitting={isSubmitting}
          />
        );
        default: return <Step1TaxpayerType />;
      }
    }

    if (formData.registrationType === 'registration-only') {
      switch (currentStep) {
        case 1: return <Step1TaxpayerType />;
        case 2: return <Step2NIKStatus />;
        case 3: return <Step3RegistrationType />;
        case 4: return <StepTaxpayerIdentity {...stepProps} />;
        case 5: return <StepContactDetailsPribadi {...stepProps} />;
        case 6: return <StepEconomicDataPribadi {...stepProps} />;
        case 7: return <StepAddressDetails {...stepProps} />;
        case 8: return (
          <TaxpayerDeclaration
            formData={formData}
            setFormData={setFormData}
            onSubmit={submitRegistration}
            isSubmitting={isSubmitting}
          />
        );
        default: return <Step1TaxpayerType />;
      }
    }

    // NIK activation (default individual flow)
    switch (currentStep) {
      case 1: return <Step1TaxpayerType />;
      case 2: return <Step2NIKStatus />;
      case 3: return <Step3RegistrationType />;
      case 4: return <StepTaxpayerIdentity {...stepProps} />;
      case 5: return <StepContactDetailsPribadi {...stepProps} />;
      case 6: return <StepRelatedPersons {...stepProps} />;
      case 7: return <StepEconomicDataPribadi {...stepProps} />;
      case 8: return <StepAddressDetails {...stepProps} />;
      case 9: return <StepIdentityVerification {...stepProps} />;
      case 10: return (
        <TaxpayerDeclaration
          formData={formData}
          setFormData={setFormData}
          onSubmit={submitRegistration}
          isSubmitting={isSubmitting}
        />
      );
      default: return <Step1TaxpayerType />;
    }
  };

  // ─────────────────────────────────────────────
  // STEP INDICATOR HELPERS
  // ─────────────────────────────────────────────

  const getDisplayStep = () => {
    if (formData.taxpayerType === 'company') {
      if (currentStep <= 2) return currentStep;
      return currentStep - 2;
    }
    if (currentStep <= 3) return currentStep;
    return currentStep - 3;
  };

  const lengthRegisterShowSteps =
    formData.taxpayerType === 'company' ? currentStep > 2 : currentStep > 3;

  const handleStepClick = (stepNumber) => {
    let actualStep;
    if (formData.taxpayerType === 'company') {
      if (currentStep <= 2) return;
      actualStep = stepNumber + 2;
    } else {
      if (currentStep <= 3) return;
      actualStep = stepNumber + 3;
    }
    if (actualStep <= currentStep) setCurrentStep(actualStep);
  };

  // ─────────────────────────────────────────────
  // BACK TO PREPARATION
  // Does NOT clear formData. Resets form if taxpayerType changes (handled in Step1).
  // ─────────────────────────────────────────────

  const isInWizard =
    (formData.taxpayerType === 'company' && currentStep > 2) ||
    (formData.taxpayerType !== 'company' && currentStep > 3);

  const handleBackToPreparation = () => setCurrentStep(1);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <PortalLayout>
      <div className="flex-1 flex flex-col p-8">
        <h1 className="text-2xl font-bold text-blue-800 mb-8 text-center">
          e-<span className="text-blue-800">TAXZONE</span> <span className="text-yellow-500">POLINEMA</span>
        </h1>

        <div className="flex-1 bg-white rounded-lg shadow-xl p-8">
          {/* Back to Preparation link — shown only while in wizard steps */}
          {isInWizard && (
            <div className="mb-4">
              <button
                onClick={handleBackToPreparation}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                ← Back to Preparation
              </button>
            </div>
          )}

          {/* Step indicator — shown only after preparation steps */}
          {lengthRegisterShowSteps && (
            <StepIndicator
              currentStep={getDisplayStep()}
              totalSteps={steps.length}
              steps={steps}
              onStepClick={handleStepClick}
            />
          )}

          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          {/* ── Wizard step navigation (shown only inside the wizard, not on declaration step) ── */}
          {!isOnPrepStep && !isDeclarationStep && (
            <StepNavigation
              onPrevious={handlePrev}
              onNext={handleValidatedNext}
              onSubmit={() => {}}   /* submit is handled by TaxpayerDeclaration */
              isFirst={isFirstWizardStep}
              isLast={false}        /* never show Submit here; declaration step owns it */
              canSubmit={false}
              isSubmitting={isSubmitting}
            />
          )}

          {/* ── Preparation-screen nav buttons (steps 1-3 / 1-2 for company) ── */}
          {isOnPrepStep && (
              <div className="flex justify-center gap-4 mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                  >
                    Previous
                  </button>
                )}
                {/* Company prep next button */}
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
                {/* Individual prep next button */}
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

          {/* Back to Login */}
          <div className="text-center mt-6">
            <a href="/login" className="text-blue-600 hover:text-blue-800 text-sm">
              Already have an account? Login here
            </a>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

export default Registration;
