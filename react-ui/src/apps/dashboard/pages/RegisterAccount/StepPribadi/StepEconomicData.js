import React, { useState, useEffect, useCallback } from "react";
import StyledInput from "../components/StyledInput";
import KluModal from "../components/KluModal";
import toast from "react-hot-toast";

const StepEconomicData = ({ formData, setFormData, onNext, onRegisterValidator }) => {
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
    if (!currentIncome.source) {
      toast.error('Please select income source', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
      return;
    }
    if (!currentIncome.kluCode) {
      toast.error('Please select KLU code', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
      return;
    }
    if (!currentIncome.workplace) {
      toast.error('Please enter workplace', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
      return;
    }
    if (!currentIncome.incomePerMonth) {
      toast.error('Please select income per month', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
      return;
    }

    setEconomicData([...economicData, { ...currentIncome, id: Date.now() }]);
    setCurrentIncome({ source: '', kluCode: '', kluName: '', workplace: '', incomePerMonth: '' });
    setOpenIncomeDialog(false);

    toast.success('Income source added successfully', { style: { border: '1px solid #10B981', color: '#10B981' } });
  };

  const handleKluSelect = (klu) => {
    setCurrentIncome({ ...currentIncome, kluCode: klu.code, kluName: klu.name });
    setShowKluModal(false);
  };

  const handleDeleteIncome = (id) => {
    setEconomicData(economicData.filter(d => d.id !== id));
    toast.success('Income source deleted', { style: { border: '1px solid #10B981', color: '#10B981' } });
  };

  const handleNext = () => {
    setFormData(prev => ({ ...prev, economicData }));
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
      </div>

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

export default StepEconomicData;
