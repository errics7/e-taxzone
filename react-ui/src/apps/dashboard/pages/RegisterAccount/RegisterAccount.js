import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import PortalLayout from "../../component/Layout";
import individual from "../../assets/perorangan.png";
import company from "../../assets/badan.png";
import nik from "../../assets/nik.png";
import registrationonly from "../../assets/registration-only.png";
import API from "../../../../utils/host.config";
import axios from "axios";
import toast from "react-hot-toast";
import LogoPolinema from "../../../../assets/logopolinema.png";

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

  const activeStepValidator = useRef(null);

  const initialFormData = {
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
  };

  const [formData, setFormData] = useState(initialFormData);
  const formDataRef = useRef(formData);

  // Sync formDataRef setiap kali formData berubah
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.taxpayerType, formData.registrationType]);

  // ── Submit registration ─────────────────────
  // ✅ submitRegistration membaca dari formDataRef.current (selalu terbaru)
  //    bukan dari formData di closure (bisa stale).
  //    useCallback dengan deps stabil agar referensi fungsi tidak berubah
  //    setiap render — tapi tetap baca data terbaru via ref.
  const submitRegistration = useCallback(async () => {
    // ✅ Baca dari ref, BUKAN dari formData di closure
    const fd = formDataRef.current;

    // Declaration safety check — membaca state TERBARU via ref
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting, history]);
  // ✅ NOTE: formData sengaja TIDAK dimasukkan ke deps array useCallback.
  //    Kita justru membaca dari formDataRef.current (selalu terbaru) agar
  //    fungsi ini tidak perlu di-recreate setiap formData berubah.
  //    Ini pola "ref for latest value" yang direkomendasikan React docs.

  // ─────────────────────────────────────────────
  // PREPARATION STEPS (not wizard steps)
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
          onClick={() => setFormData((prev) => ({ ...prev, taxpayerType: 'individual', companyTypeSelection: '' }))}
        />
        <SelectionCard
          icon={<img src={company} alt="badan" />}
          title="Company"
          isSelected={formData.taxpayerType === 'company'}
          onClick={() => setFormData((prev) => ({ ...prev, taxpayerType: 'company' }))}
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
          onClick={() => setFormData((prev) => ({ ...prev, hasNIK: true }))}
        >
          ✓ Yes, Taxpayers Have NIK
        </button>
        <button
          className={`px-8 py-3 rounded font-medium min-w-[200px] ${formData.hasNIK === false ? 'bg-red-600 text-white' : 'border border-red-600 text-red-600 hover:bg-red-50'}`}
          onClick={() => setFormData((prev) => ({ ...prev, hasNIK: false }))}
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
          onClick={() => setFormData((prev) => ({ ...prev, registrationType: 'nik-activation' }))}
        />
        <SelectionCard
          icon={<img src={registrationonly} alt="registration-only" />}
          title="Registration only"
          isSelected={formData.registrationType === 'registration-only'}
          onClick={() => setFormData((prev) => ({ ...prev, registrationType: 'registration-only' }))}
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
      setFormData((prev) => ({ ...prev, companyTypeSelection: selectedCompanyType }));
      setCurrentStep((prev) => prev + 1);
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
            Next
          </button>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────
  // NAVIGATION HELPERS
  // ─────────────────────────────────────────────

  const handleNext = useCallback(() => {
      setCurrentStep((prev) => {
        const taxpayerType = formDataRef.current.taxpayerType;
        const registrationType = formDataRef.current.registrationType;

        let totalWizardSteps = 0;

        if (taxpayerType === "company") {
          totalWizardSteps = 9;
        } else if (registrationType === "registration-only") {
          totalWizardSteps = 5;
        } else {
          totalWizardSteps = 7;
        }

        const preparationSteps = taxpayerType === "company" ? 2 : 3;

        const maxStep = preparationSteps + totalWizardSteps;

        console.log("HANDLE NEXT", {
          prev,
          maxStep,
          taxpayerType,
          registrationType
        });

      return prev < maxStep ? prev + 1 : prev;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrev = useCallback(() => {
    activeStepValidator.current = null;
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const handleValidatedNext = useCallback(() => {
    if (activeStepValidator.current) {
      activeStepValidator.current();
    } else {
      handleNext();
    }
  }, [handleNext]);

  // ✅ FIX: handleRegisterValidator distabilkan dengan useCallback + deps [].
  //
  // BUG SEBELUMNYA — onRegisterValidator adalah inline arrow function:
  //   onRegisterValidator: (fn) => { activeStepValidator.current = fn; }
  //
  // Inline arrow di dalam object literal berarti fungsi baru dibuat SETIAP
  // render RegisterAccount. Karena stepProps selalu di-rebuild setiap render,
  // onRegisterValidator selalu berubah referensinya.
  //
  // Di child steps (StepContactDetails, StepAddressDetails), ada useEffect:
  //   useEffect(() => {
  //     if (onRegisterValidator) onRegisterValidator(handleSubmit);
  //   }, [handleSubmit, onRegisterValidator]); // ← onRegisterValidator berubah tiap render!
  //
  // Akibatnya: setiap kali user mengetik di input (trigger re-render parent) →
  // onRegisterValidator baru → useEffect di child re-fire → validator baru
  // ditimpa ke activeStepValidator.current. Jika user klik Next tepat di
  // momen pergantian ini, validator yang terpanggil bisa stale atau sedang
  // dalam proses overwrite — step tidak maju.
  //
  // FIX: Ekstrak ke useCallback dengan deps [] → referensi STABIL selamanya.
  // useEffect di child tidak pernah re-fire hanya karena parent re-render.
  const handleRegisterValidator = useCallback((fn) => {
    activeStepValidator.current = fn;
  }, []);

  // Step props builder
  // ✅ onRegisterValidator sekarang menggunakan handleRegisterValidator yang stabil
  const stepProps = {
    formData,
    setFormData,
    onNext: handleNext,
    onPrevious: handlePrev,
    onRegisterValidator: handleRegisterValidator,
  };

  // ─────────────────────────────────────────────
  // WIZARD-STEP NAVIGATION BAR HELPERS
  // ─────────────────────────────────────────────

  const isOnPrepStep =
    (formData.taxpayerType === 'company' && currentStep <= 2) ||
    (formData.taxpayerType !== 'company' && currentStep <= 3);

  const prepOffset = formData.taxpayerType === 'company' ? 2 : 3;
  const wizardPosition = currentStep - prepOffset;

  const isFirstWizardStep = wizardPosition === 1;
  const isLastWizardStep  = wizardPosition === steps.length;
  const isDeclarationStep = isLastWizardStep;
  const showNavigation = !isOnPrepStep;

  // ─────────────────────────────────────────────
  // RENDER CURRENT STEP
  // ─────────────────────────────────────────────
  //
  // ✅ FIX: Setiap step yang memakai shared component (StepContactDetails,
  // StepAddressDetails) diberi prop `key` yang UNIK dan BERBEDA antar flow.
  //
  // MENGAPA key PENTING:
  // React menggunakan `key` untuk memutuskan apakah sebuah component instance
  // perlu di-remount atau bisa di-reuse. Tanpa key yang berbeda, ketika user
  // berpindah dari flow bisnis ke flow pribadi (atau sebaliknya), React melihat
  // component type yang sama di posisi render yang sama → instance di-reuse →
  // local state lama (addresses, contact, errors) tetap tersisa → validator
  // yang ter-register juga bisa berasal dari instance sebelumnya.
  //
  // Dengan key yang berbeda per flow:
  // - "bisnis-contact" vs "pribadi-contact-reg" / "pribadi-contact-nik"
  // - "bisnis-address" vs "pribadi-address-reg" / "pribadi-address-nik"
  // React SELALU membuat instance baru saat berpindah flow → state fresh →
  // validator fresh → tidak ada lifecycle reuse issue.
  //
  // KEY NAMING CONVENTION:
  // - flow-bisnis  : "bisnis-{stepname}"
  // - flow reg-only: "pribadi-reg-{stepname}"
  // - flow nik-act : "pribadi-nik-{stepname}"

  const renderCurrentStep = () => {
    // ── COMPANY FLOW ──────────────────────────────────────────────────────────
    if (formData.taxpayerType === 'company') {
      switch (currentStep) {
        case 1:  return <Step1TaxpayerType />;
        case 2:  return <Step4CompanyTypeSelection />;
        case 3:  return <StepKuasaWajibPajak key="bisnis-kuasa" {...stepProps} />;
        case 4:  return <StepCompanyIdentity key="bisnis-identity" {...stepProps} />;
        // ✅ key "bisnis-contact" — berbeda dari semua flow pribadi
        case 5:  return <StepContactDetailsBisnis key="bisnis-contact" {...stepProps} />;
        case 6:  return <StepOrangPribadi key="bisnis-orang-pribadi" {...stepProps} />;
        case 7:  return <StepWajibPajakTerkait key="bisnis-wp-terkait" {...stepProps} />;
        case 8:  return <StepEconomicDataBisnis key="bisnis-economic" {...stepProps} />;
        // ✅ key "bisnis-address" — berbeda dari semua flow pribadi
        case 9:  return <StepAddressBisnis key="bisnis-address" {...stepProps} />;
        case 10: return <StepDocuments key="bisnis-documents" {...stepProps} />;
        case 11: return (
          <TaxpayerDeclaration
            key="bisnis-declaration"
            formData={formData}
            setFormData={setFormData}
            onSubmit={submitRegistration}
            isSubmitting={isSubmitting}
          />
        );
        default: return <Step1TaxpayerType />;
      }
    }

    // ── INDIVIDUAL — REGISTRATION ONLY FLOW ──────────────────────────────────
    if (formData.registrationType === 'registration-only') {
      switch (currentStep) {
        case 1: return <Step1TaxpayerType />;
        case 2: return <Step2NIKStatus />;
        case 3: return <Step3RegistrationType />;
        case 4: return <StepTaxpayerIdentity key="pribadi-reg-identity" {...stepProps} />;
        // ✅ key "pribadi-reg-contact" — berbeda dari flow bisnis & flow nik-activation
        case 5: return <StepContactDetailsPribadi key="pribadi-reg-contact" {...stepProps} />;
        case 6: return <StepEconomicDataPribadi key="pribadi-reg-economic" {...stepProps} />;
        // ✅ key "pribadi-reg-address" — berbeda dari flow bisnis & flow nik-activation
        case 7: return <StepAddressDetails key="pribadi-reg-address" {...stepProps} />;
        case 8: return (
          <TaxpayerDeclaration
            key="pribadi-reg-declaration"
            formData={formData}
            setFormData={setFormData}
            onSubmit={submitRegistration}
            isSubmitting={isSubmitting}
          />
        );
        default: return <Step1TaxpayerType />;
      }
    }

    // ── INDIVIDUAL — NIK ACTIVATION FLOW (default) ───────────────────────────
    switch (currentStep) {
      case 1:  return <Step1TaxpayerType />;
      case 2:  return <Step2NIKStatus />;
      case 3:  return <Step3RegistrationType />;
      case 4:  return <StepTaxpayerIdentity key="pribadi-nik-identity" {...stepProps} />;
      // ✅ key "pribadi-nik-contact" — berbeda dari flow bisnis & flow reg-only
      case 5:  return <StepContactDetailsPribadi key="pribadi-nik-contact" {...stepProps} />;
      case 6:  return <StepRelatedPersons key="pribadi-nik-related" {...stepProps} />;
      case 7:  return <StepEconomicDataPribadi key="pribadi-nik-economic" {...stepProps} />;
      // ✅ key "pribadi-nik-address" — berbeda dari flow bisnis & flow reg-only
      case 8:  return <StepAddressDetails key="pribadi-nik-address" {...stepProps} />;
      case 9:  return <StepIdentityVerification key="pribadi-nik-verification" {...stepProps} />;
      case 10: return (
        <TaxpayerDeclaration
          key="pribadi-nik-declaration"
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
  // ─────────────────────────────────────────────

  const isInWizard =
    (formData.taxpayerType === 'company' && currentStep > 2) ||
    (formData.taxpayerType !== 'company' && currentStep > 3);

  const handleBackToPreparation = () => {
    if (window.confirm("Data yang sudah diisi akan hilang. Lanjutkan?")) {
      setCurrentStep(1);
      setFormData(initialFormData);
      activeStepValidator.current = null;
      setHasUnsavedChanges(false);
    }
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  // ✅ canSubmit membaca langsung dari formData (reactive state),
  //    sehingga tombol Ajukan Permohonan aktif/disable dengan benar.
  //    Sementara submitRegistration membaca dari formDataRef.current (latest value).
  const canSubmit = formData.declarationAccepted;

  return (
    <PortalLayout>
      <div className="flex-1 flex flex-col p-8">
        <div className="flex items-center justify-center gap-2 mb-6 mt-2">
          <img
            src={LogoPolinema}
            alt="Polinema Logo"
            className="w-24 h-auto"
          />
          <h1 className="text-2xl font-bold">
            <span className="text-blue-800">e-TAXZONE</span>{" "}
            <span className="text-yellow-500">POLINEMA</span>
          </h1>
        </div>

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

          {/* ── Wizard step navigation ── */}
          {showNavigation && (
            <StepNavigation
              onPrevious={handlePrev}
              onNext={handleValidatedNext}
              onSubmit={submitRegistration}
              isFirst={isFirstWizardStep}
              isLast={isDeclarationStep}
              canSubmit={canSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {/* ── Preparation-screen nav buttons ── */}
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