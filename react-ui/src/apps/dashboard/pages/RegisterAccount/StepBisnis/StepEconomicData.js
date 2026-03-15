import React, { useState, useEffect } from "react";
import StyledInput from "../components/StyledInput";
import KluModal from "../components/KluModal";
import toast from "react-hot-toast";

const StepEconomicData = ({ formData, setFormData, onNext, onRegisterValidator }) => {
  const [economicData, setEconomicData] = useState({
    metodePembukuan: formData.companyEconomicData?.metodePembukuan || 'Pembukuan',
    mataUangPembukuan: formData.companyEconomicData?.mataUangPembukuan || 'Rupiah Indonesia',
    periodePembukuan: formData.companyEconomicData?.periodePembukuan || '01-12',
    kluUtama: formData.companyEconomicData?.kluUtama || [],
    kluTambahan: formData.companyEconomicData?.kluTambahan || []
  });

  const [showKluModal, setShowKluModal] = useState(false);
  const [currentKluType, setCurrentKluType] = useState('');
  const [currentKlu, setCurrentKlu] = useState({ kluCode: '', kluName: '', uraian: '' });

  const handleKluSelect = (klu) => {
    setCurrentKlu({ kluCode: klu.code, kluName: klu.name, uraian: '' });
    setShowKluModal(false);
  };

  const handleAddKlu = () => {
    if (!currentKlu.kluCode) {
      toast.error('Silakan pilih kode KLU terlebih dahulu', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
      return;
    }
    if (!currentKlu.uraian) {
      toast.error('Uraian wajib diisi', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
      return;
    }

    const newKlu = { ...currentKlu, id: Date.now() };
    if (currentKluType === 'utama') {
      setEconomicData({ ...economicData, kluUtama: [...economicData.kluUtama, newKlu] });
    } else {
      setEconomicData({ ...economicData, kluTambahan: [...economicData.kluTambahan, newKlu] });
    }

    setCurrentKlu({ kluCode: '', kluName: '', uraian: '' });
    setCurrentKluType('');
    toast.success('KLU berhasil ditambahkan', { style: { border: '1px solid #10B981', color: '#10B981' } });
  };

  const handleDeleteKlu = (type, id) => {
    if (type === 'utama') {
      setEconomicData({ ...economicData, kluUtama: economicData.kluUtama.filter(klu => klu.id !== id) });
    } else {
      setEconomicData({ ...economicData, kluTambahan: economicData.kluTambahan.filter(klu => klu.id !== id) });
    }
    toast.success('KLU berhasil dihapus', { style: { border: '1px solid #10B981', color: '#10B981' } });
  };

  const handleNext = () => {
    if (economicData.kluUtama.length === 0) {
      toast.error('Minimal satu KLU Utama harus ditambahkan', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
      return;
    }
    setFormData({ ...formData, companyEconomicData: economicData });
    onNext();
  };

  // Register validator so StepNavigation can call it
  useEffect(() => {
    if (onRegisterValidator) onRegisterValidator(handleNext);
  });

  const KluTable = ({ type, data }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">KLU {type === 'utama' ? 'Utama' : 'Tambahan'}</h4>
        <button
          onClick={() => setCurrentKluType(type)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          + Tambah KLU {type === 'utama' ? 'Utama' : 'Tambahan'}
        </button>
      </div>

      {currentKluType === type && (
        <div className="bg-gray-50 p-4 rounded mb-3 space-y-3">
          <StyledInput label="Kode KLU" required>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100"
                placeholder="Pilih Kode KLU"
                value={currentKlu.kluCode}
                readOnly
              />
              <button
                onClick={() => setShowKluModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Pilih
              </button>
            </div>
            {currentKlu.kluName && <p className="text-sm text-gray-600 mt-1">{currentKlu.kluName}</p>}
          </StyledInput>
          <StyledInput label="Uraian" required>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Masukkan uraian kegiatan usaha"
              value={currentKlu.uraian}
              onChange={(e) => setCurrentKlu({ ...currentKlu, uraian: e.target.value })}
            />
          </StyledInput>
          <div className="flex gap-2">
            <button
              onClick={handleAddKlu}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Simpan
            </button>
            <button
              onClick={() => { setCurrentKluType(''); setCurrentKlu({ kluCode: '', kluName: '', uraian: '' }); }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-yellow-400">
            <th className="border border-gray-300 px-4 py-2 text-left">Aksi</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Kode KLU</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Nama KLU</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Uraian</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" className="border border-gray-300 px-4 py-4 text-center text-gray-500">
                Belum ada KLU yang ditambahkan
              </td>
            </tr>
          ) : (
            data.map((klu) => (
              <tr key={klu.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDeleteKlu(type, klu.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2">{klu.kluCode}</td>
                <td className="border border-gray-300 px-4 py-2">{klu.kluName}</td>
                <td className="border border-gray-300 px-4 py-2">{klu.uraian}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Masukkan data ekonomi wajib pajak.
      </h2>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StyledInput label="Metode Pembukuan/Pencatatan" required>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              value={economicData.metodePembukuan}
              onChange={(e) => setEconomicData({ ...economicData, metodePembukuan: e.target.value })}
            >
              <option value="Pembukuan">Pembukuan</option>
              <option value="Pencatatan">Pencatatan</option>
            </select>
          </StyledInput>

          <StyledInput label="Mata Uang Pembukuan" required>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              value={economicData.mataUangPembukuan}
              onChange={(e) => setEconomicData({ ...economicData, mataUangPembukuan: e.target.value })}
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
              onChange={(e) => setEconomicData({ ...economicData, periodePembukuan: e.target.value })}
            >
              <option value="01-12">01-12</option>
              <option value="04-03">04-03</option>
            </select>
          </StyledInput>
        </div>

        <KluTable type="utama" data={economicData.kluUtama} />
        <KluTable type="tambahan" data={economicData.kluTambahan} />
      </div>

      <KluModal
        isOpen={showKluModal}
        onClose={() => setShowKluModal(false)}
        onSelect={handleKluSelect}
      />
    </div>
  );
};

export default StepEconomicData;
