import React, { useState, useEffect, useCallback } from "react";
import StyledInput from "../components/StyledInput";

const StepKuasaWajibPajak = ({ formData, setFormData,  onNext, onRegisterValidator }) => {


  const [kuasaData, setKuasaData] = useState({
    apakahPermohonanDiajukanOleh: formData.kuasaWajibPajak?.apakahPermohonanDiajukanOleh || '',
    nikPerwakilan: formData.kuasaWajibPajak?.nikPerwakilan || '',
    namaWakilKuasa: formData.kuasaWajibPajak?.namaWakilKuasa || ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};

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
      setFormData(prev => ({ ...prev, kuasaWajibPajak: kuasaData }));
      onNext();
    }
  };

  // ✅ FIX: dependency array stabil — tidak loop re-register setiap render
  useEffect(() => {
    if (onRegisterValidator) onRegisterValidator(handleSubmit);
  }, [handleSubmit, onRegisterValidator]);

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
                onChange={(e) => setKuasaData({ ...kuasaData, apakahPermohonanDiajukanOleh: e.target.value })}
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
                  nikPerwakilan: '',
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
            <StyledInput label="NIK Perwakilan *" required error={errors.nikPerwakilan}>
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nikPerwakilan ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                placeholder="NIK/NPWP"
                value={kuasaData.nikPerwakilan}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 16) setKuasaData({ ...kuasaData, nikPerwakilan: value });
                }}
                maxLength={16}
              />
            </StyledInput>

            <StyledInput label="Nama Wakil/Kuasa" required error={errors.namaWakilKuasa}>
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.namaWakilKuasa ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                placeholder="Nama"
                value={kuasaData.namaWakilKuasa}
                onChange={(e) => setKuasaData({ ...kuasaData, namaWakilKuasa: e.target.value })}
              />
            </StyledInput>
          </>
        )}
      </div>
    </div>
  );
};

export default StepKuasaWajibPajak;