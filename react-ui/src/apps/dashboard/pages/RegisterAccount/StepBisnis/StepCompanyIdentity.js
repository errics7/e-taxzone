import React, { useState, useEffect, useCallback } from "react";
import StyledInput from "../components/StyledInput";

const StepCompanyIdentity = ({ formData, setFormData, onNext, onRegisterValidator }) => {
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

    if (!identity.nomorKeputusanPengesahan) newErrors.nomorKeputusanPengesahan = 'Nomor Keputusan Pengesahan wajib diisi';
    if (!identity.namaWajibPajak) newErrors.namaWajibPajak = 'Nama Wajib Pajak wajib diisi';
    if (!identity.tanggalKeputusanPengesahan) newErrors.tanggalKeputusanPengesahan = 'Tanggal Keputusan Pengesahan wajib diisi';
    if (!identity.nomorAktaPendirian) newErrors.nomorAktaPendirian = 'Nomor Akta Pendirian wajib diisi';
    if (!identity.tempatPendirian) newErrors.tempatPendirian = 'Tempat Pendirian wajib diisi';
    if (!identity.tanggalPendirian) newErrors.tanggalPendirian = 'Tanggal Pendirian wajib diisi';
    if (!identity.notarySigningOfficeNik) newErrors.notarySigningOfficeNik = 'Notary/Signing Office NIK wajib diisi';
    if (!identity.nameOfNotarySigningOfficer) newErrors.nameOfNotarySigningOfficer = 'Name of Notary/Signing Officer wajib diisi';
    if (!identity.jenisPerusahaanModal) newErrors.jenisPerusahaanModal = 'Jenis Perusahaan/Modal wajib dipilih';
    if (!identity.modalDasar) newErrors.modalDasar = 'Modal Dasar wajib diisi';

    if (identity.tanggalPendirian) {
      const foundingDate = new Date(identity.tanggalPendirian);
      if (foundingDate > new Date()) newErrors.tanggalPendirian = 'Tanggal pendirian tidak boleh di masa depan';
    }
    if (identity.tanggalKeputusanPengesahan) {
      const decisionDate = new Date(identity.tanggalKeputusanPengesahan);
      if (decisionDate > new Date()) newErrors.tanggalKeputusanPengesahan = 'Tanggal keputusan pengesahan tidak boleh di masa depan';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setFormData(prev => ({ ...prev, companyIdentity: identity }));
      onNext();
    } else {
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Register validator so StepNavigation can call it
  // ✅ FIX: dependency array stabil — tidak loop re-register setiap render
  useEffect(() => {
    if (onRegisterValidator) onRegisterValidator(handleSubmit);
  }, [handleSubmit, onRegisterValidator]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center text-blue-800">
        Masukkan data identitas wajib pajak.
      </h2>

      <div className="space-y-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StyledInput label="Nomor Keputusan Pengesahan" required error={errors.nomorKeputusanPengesahan}>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nomorKeputusanPengesahan ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Masukkan nomor keputusan ratifikasi"
              value={identity.nomorKeputusanPengesahan}
              onChange={(e) => setIdentity({ ...identity, nomorKeputusanPengesahan: e.target.value })}
            />
          </StyledInput>

          <StyledInput label="Nama Wajib Pajak" required error={errors.namaWajibPajak}>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.namaWajibPajak ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Masukkan nama wajib pajak"
              value={identity.namaWajibPajak}
              onChange={(e) => setIdentity({ ...identity, namaWajibPajak: e.target.value })}
            />
          </StyledInput>

          <StyledInput label="Tanggal Keputusan Pengesahan" required error={errors.tanggalKeputusanPengesahan}>
            <input
              type="date"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.tanggalKeputusanPengesahan ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              value={identity.tanggalKeputusanPengesahan}
              onChange={(e) => setIdentity({ ...identity, tanggalKeputusanPengesahan: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
            />
          </StyledInput>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StyledInput label="Nomor Akta Pendirian" required error={errors.nomorAktaPendirian}>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nomorAktaPendirian ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Masukkan nomor dokumen akta pendirian"
              value={identity.nomorAktaPendirian}
              onChange={(e) => setIdentity({ ...identity, nomorAktaPendirian: e.target.value })}
            />
          </StyledInput>

          <StyledInput label="Tempat Pendirian" required error={errors.tempatPendirian}>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.tempatPendirian ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Masukkan tempat pendirian"
              value={identity.tempatPendirian}
              onChange={(e) => setIdentity({ ...identity, tempatPendirian: e.target.value })}
            />
          </StyledInput>

          <StyledInput label="Tanggal Pendirian" required error={errors.tanggalPendirian}>
            <input
              type="date"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.tanggalPendirian ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              value={identity.tanggalPendirian}
              onChange={(e) => setIdentity({ ...identity, tanggalPendirian: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
            />
          </StyledInput>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StyledInput label="Notary/Signing Office NIK" required error={errors.notarySigningOfficeNik}>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.notarySigningOfficeNik ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="NIK/NPWP"
              value={identity.notarySigningOfficeNik}
              onChange={(e) => setIdentity({ ...identity, notarySigningOfficeNik: e.target.value })}
            />
          </StyledInput>

          <StyledInput label="Name of Notary/Signing Officer" required error={errors.nameOfNotarySigningOfficer}>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nameOfNotarySigningOfficer ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Nama"
              value={identity.nameOfNotarySigningOfficer}
              onChange={(e) => setIdentity({ ...identity, nameOfNotarySigningOfficer: e.target.value })}
            />
          </StyledInput>

          <StyledInput label="Jenis Perusahaan/Modal" required error={errors.jenisPerusahaanModal}>
            <select
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.jenisPerusahaanModal ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
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

        <StyledInput label="Modal Dasar" required error={errors.modalDasar}>
          <input
            type="text"
            className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.modalDasar ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            placeholder="Masukkan modal dasar"
            value={identity.modalDasar}
            onChange={(e) => setIdentity({ ...identity, modalDasar: e.target.value })}
          />
        </StyledInput>
      </div>
    </div>
  );
};

export default StepCompanyIdentity;
