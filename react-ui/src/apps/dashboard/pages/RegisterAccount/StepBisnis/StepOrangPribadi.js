import React, { useState, useEffect, useCallback } from "react";
import StyledInput from "../components/StyledInput";
import toast from "react-hot-toast";

const StepOrangPribadi = ({ formData, setFormData, onNext, onRegisterValidator }) => {
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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^0\d{7,14}$/.test(phone);

  const resetCurrentPerson = () => ({
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

  const handleAddPerson = () => {
    const newErrors = {};

    if (!currentPerson.jenisOrangTerkait) newErrors.jenisOrangTerkait = 'Jenis Orang Terkait wajib dipilih';
    if (!currentPerson.personNikTin) newErrors.personNikTin = 'Person NIK/TIN wajib diisi';
    if (!currentPerson.personName) newErrors.personName = 'Person Name wajib diisi';
    if (!currentPerson.kewarganegaraan) newErrors.kewarganegaraan = 'Kewarganegaraan wajib dipilih';
    if (!currentPerson.negaraAsal) newErrors.negaraAsal = 'Negara Asal wajib dipilih';
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
    if (!currentPerson.tanggalMulai) newErrors.tanggalMulai = 'Tanggal Mulai wajib diisi';
    if (!currentPerson.tanggalBerakhir) newErrors.tanggalBerakhir = 'Tanggal Berakhir wajib diisi';

    if (currentPerson.tanggalMulai && currentPerson.tanggalBerakhir) {
      const startDate = new Date(currentPerson.tanggalMulai);
      const endDate = new Date(currentPerson.tanggalBerakhir);
      if (endDate <= startDate) newErrors.tanggalBerakhir = 'Tanggal berakhir harus setelah tanggal mulai';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setOrangPribadi([...orangPribadi, { ...currentPerson, id: Date.now() }]);
      setCurrentPerson(resetCurrentPerson());
      setShowAddDialog(false);
      setErrors({});
      toast.success('Orang pribadi berhasil ditambahkan', { style: { border: '1px solid #10B981', color: '#10B981' } });
    }
  };

  const handleDeletePerson = (id) => {
    setOrangPribadi(orangPribadi.filter(p => p.id !== id));
    toast.success('Orang pribadi berhasil dihapus', { style: { border: '1px solid #10B981', color: '#10B981' } });
  };

  const handleNext = () => {
    setFormData(prev => ({ ...prev, orangPribadi }));
    onNext();
  };

  // Register validator so StepNavigation can call it
  // ✅ FIX: dependency array stabil — tidak loop re-register setiap render
  useEffect(() => {
    if (onRegisterValidator) onRegisterValidator(handleNext);
  }, [handleNext, onRegisterValidator]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Masukkan orang pribadi wajib pajak.
      </h2>

      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-medium mb-6 text-center">Masukkan wajib pajak terkait (jika ada)</h3>

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
      </div>

      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Buat Orang</h3>
              <button
                onClick={() => { setShowAddDialog(false); setErrors({}); setCurrentPerson(resetCurrentPerson()); }}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <StyledInput label="Apakah PIC?">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={currentPerson.apakahPIC}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, apakahPIC: e.target.checked })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Ya</span>
                  </label>
                </StyledInput>
              </div>

              <StyledInput label="Jenis Orang Terkait" required error={errors.jenisOrangTerkait}>
                <select
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.jenisOrangTerkait ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  value={currentPerson.jenisOrangTerkait}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, jenisOrangTerkait: e.target.value })}
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

              <StyledInput label="Person NIK/TIN" required error={errors.personNikTin}>
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.personNikTin ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  placeholder="NIK/NPWP"
                  value={currentPerson.personNikTin}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, personNikTin: e.target.value })}
                />
              </StyledInput>

              <StyledInput label="Person Name" required error={errors.personName}>
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.personName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  placeholder="Nama"
                  value={currentPerson.personName}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, personName: e.target.value })}
                />
              </StyledInput>

              <StyledInput label="Kewarganegaraan" required error={errors.kewarganegaraan}>
                <select
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.kewarganegaraan ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  value={currentPerson.kewarganegaraan}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, kewarganegaraan: e.target.value })}
                >
                  <option value="">Select Nationality</option>
                  <option value="WNI">WNI (Warga Negara Indonesia)</option>
                  <option value="WNA">WNA (Warga Negara Asing)</option>
                </select>
              </StyledInput>

              <StyledInput label="Negara Asal" required error={errors.negaraAsal}>
                <select
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.negaraAsal ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  value={currentPerson.negaraAsal}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, negaraAsal: e.target.value })}
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

              <StyledInput label="E-mail" required error={errors.email}>
                <input
                  type="email"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  placeholder="Enter your e-mail Address"
                  value={currentPerson.email}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, email: e.target.value.toLowerCase() })}
                />
              </StyledInput>

              <StyledInput
                label="Mobile Phone Number"
                required
                error={errors.mobilePhoneNumber}
                helperText="Nomor telepon dimulai dengan 0, min 8 karakter, maks 15 karakter, dan hanya digit"
              >
                <input
                  type="tel"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.mobilePhoneNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  placeholder="Enter your phone number"
                  value={currentPerson.mobilePhoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 15) setCurrentPerson({ ...currentPerson, mobilePhoneNumber: value });
                  }}
                  maxLength={15}
                />
              </StyledInput>

              <StyledInput label="Tanggal Mulai" required error={errors.tanggalMulai}>
                <input
                  type="date"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.tanggalMulai ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  value={currentPerson.tanggalMulai}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, tanggalMulai: e.target.value })}
                />
              </StyledInput>

              <StyledInput label="Tanggal Berakhir" required error={errors.tanggalBerakhir}>
                <input
                  type="date"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.tanggalBerakhir ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  value={currentPerson.tanggalBerakhir}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, tanggalBerakhir: e.target.value })}
                  min={currentPerson.tanggalMulai}
                />
              </StyledInput>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => { setShowAddDialog(false); setErrors({}); setCurrentPerson(resetCurrentPerson()); }}
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

export default StepOrangPribadi;
