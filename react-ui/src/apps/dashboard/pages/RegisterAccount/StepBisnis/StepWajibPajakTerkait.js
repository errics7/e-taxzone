import React, { useState, useEffect } from "react";
import StyledInput from "../components/StyledInput";
import toast from "react-hot-toast";

const StepWajibPajakTerkait = ({ formData, setFormData, onNext, onRegisterValidator }) => {
  const [wajibPajakTerkait, setWajibPajakTerkait] = useState(() => {
    if (formData.wajibPajakTerkait && formData.wajibPajakTerkait.length > 0) {
      return formData.wajibPajakTerkait;
    }
    return [{
      id: 'default-owner',
      jenisWajibPajak: 'Pemilik',
      nikTin: formData.companyIdentity?.notarySigningOfficeNik || '',
      namaWajibPajak: formData.companyIdentity?.nameOfNotarySigningOfficer || 'Pemilik Perusahaan',
      hubunganIstimewa: 'Ya',
      persentaseKepemilikan: '100',
      isDefault: true
    }];
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

  const resetCurrentWajibPajak = () => ({
    jenisWajibPajak: '',
    nikTin: '',
    namaWajibPajak: '',
    hubunganIstimewa: '',
    persentaseKepemilikan: ''
  });

  const handleAddWajibPajak = () => {
    const newErrors = {};

    if (!currentWajibPajak.jenisWajibPajak) newErrors.jenisWajibPajak = 'Jenis Wajib Pajak wajib dipilih';
    if (!currentWajibPajak.nikTin) newErrors.nikTin = 'NIK/TIN wajib diisi';
    if (!currentWajibPajak.namaWajibPajak) newErrors.namaWajibPajak = 'Nama Wajib Pajak wajib diisi';
    if (!currentWajibPajak.hubunganIstimewa) newErrors.hubunganIstimewa = 'Hubungan Istimewa wajib dipilih';
    if (!currentWajibPajak.persentaseKepemilikan) {
      newErrors.persentaseKepemilikan = 'Persentase Kepemilikan wajib diisi';
    } else if (
      isNaN(currentWajibPajak.persentaseKepemilikan) ||
      currentWajibPajak.persentaseKepemilikan < 0 ||
      currentWajibPajak.persentaseKepemilikan > 100
    ) {
      newErrors.persentaseKepemilikan = 'Persentase harus antara 0-100';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setWajibPajakTerkait([...wajibPajakTerkait, { ...currentWajibPajak, id: Date.now(), isDefault: false }]);
      setCurrentWajibPajak(resetCurrentWajibPajak());
      setShowAddDialog(false);
      setErrors({});
      toast.success('Wajib pajak terkait berhasil ditambahkan', { style: { border: '1px solid #10B981', color: '#10B981' } });
    }
  };

  const handleDeleteWajibPajak = (id) => {
    const itemToDelete = wajibPajakTerkait.find(item => item.id === id);
    if (itemToDelete?.isDefault) {
      toast.error('Data pemilik default tidak dapat dihapus', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
      return;
    }
    setWajibPajakTerkait(wajibPajakTerkait.filter(item => item.id !== id));
    toast.success('Wajib pajak terkait berhasil dihapus', { style: { border: '1px solid #10B981', color: '#10B981' } });
  };

  const handleNext = () => {
    setFormData({ ...formData, wajibPajakTerkait });
    onNext();
  };

  // Register validator so StepNavigation can call it
  useEffect(() => {
    if (onRegisterValidator) onRegisterValidator(handleNext);
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Masukkan wajib pajak terkait wajib pajak.
      </h2>

      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-medium mb-6 text-center">Tambahkan Wajib Pajak yang Mempunyai Hubungan Istimewa</h3>

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

        <div className="text-center my-8">
          <button
            onClick={() => setShowAddDialog(true)}
            className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition-colors"
          >
            <span className="text-2xl">⊕</span>
          </button>
        </div>
      </div>

      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tambah Wajib Pajak Terkait</h3>
              <button
                onClick={() => { setShowAddDialog(false); setErrors({}); setCurrentWajibPajak(resetCurrentWajibPajak()); }}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <StyledInput label="Jenis Wajib Pajak" required error={errors.jenisWajibPajak}>
                <select
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.jenisWajibPajak ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  value={currentWajibPajak.jenisWajibPajak}
                  onChange={(e) => setCurrentWajibPajak({ ...currentWajibPajak, jenisWajibPajak: e.target.value })}
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
                <StyledInput label="NIK/TIN" required error={errors.nikTin}>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nikTin ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    placeholder="NIK/NPWP"
                    value={currentWajibPajak.nikTin}
                    onChange={(e) => setCurrentWajibPajak({ ...currentWajibPajak, nikTin: e.target.value })}
                  />
                </StyledInput>

                <StyledInput label="Nama Wajib Pajak" required error={errors.namaWajibPajak}>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.namaWajibPajak ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    placeholder="Nama"
                    value={currentWajibPajak.namaWajibPajak}
                    onChange={(e) => setCurrentWajibPajak({ ...currentWajibPajak, namaWajibPajak: e.target.value })}
                  />
                </StyledInput>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StyledInput label="Hubungan Istimewa" required error={errors.hubunganIstimewa}>
                  <select
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.hubunganIstimewa ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    value={currentWajibPajak.hubunganIstimewa}
                    onChange={(e) => setCurrentWajibPajak({ ...currentWajibPajak, hubunganIstimewa: e.target.value })}
                  >
                    <option value="">Pilih Hubungan Istimewa</option>
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </StyledInput>

                <StyledInput label="Persentase Kepemilikan (%)" required error={errors.persentaseKepemilikan}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.persentaseKepemilikan ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    placeholder="0-100"
                    value={currentWajibPajak.persentaseKepemilikan}
                    onChange={(e) => setCurrentWajibPajak({ ...currentWajibPajak, persentaseKepemilikan: e.target.value })}
                  />
                </StyledInput>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => { setShowAddDialog(false); setErrors({}); setCurrentWajibPajak(resetCurrentWajibPajak()); }}
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

export default StepWajibPajakTerkait;
