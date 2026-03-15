import React, { useState, useEffect } from "react";
import StyledInput from "../components/StyledInput";

const StepRelatedPersons = ({ formData, setFormData, onNext, onRegisterValidator }) => {
  const [relatedPersons, setRelatedPersons] = useState(formData.relatedPersons || []);
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

  const handleNext = () => {
    setFormData({ ...formData, relatedPersons });
    onNext();
  };

  // Register validator so StepNavigation can call it
  useEffect(() => {
    if (onRegisterValidator) onRegisterValidator(handleNext);
  });

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
      </div>

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

export default StepRelatedPersons;
