import React, { useState, useEffect } from "react";
import kluCodes from "./kluCodes";

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
                {filteredCodes.map((code) => (
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

export default KluModal;
