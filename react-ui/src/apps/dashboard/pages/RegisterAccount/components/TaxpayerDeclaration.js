import React, { useState } from "react";

const TaxpayerDeclaration = ({ formData, setFormData, onSubmit, isSubmitting }) => {
  const [isAgreed, setIsAgreed] = useState(formData.declarationAccepted || false);

  const handleSubmit = () => {
    if (!isAgreed) return;
    const updatedFormData = { ...formData, declarationAccepted: true };
    setFormData(updatedFormData);
    onSubmit(updatedFormData);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Mohon konfirmasi bahwa Wajib Pajak mematuhi pernyataan berikut ini.
      </h2>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => {
                setIsAgreed(e.target.checked);
                setFormData({ ...formData, declarationAccepted: e.target.checked });
              }}
              className="mt-1 w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              Dengan menyadari sepenuhnya akan segala akibatnya termasuk sanksi sesuai dengan ketentuan peraturan perundang-undangan yang berlaku, saya
              menyatakan bahwa apa yang saya sampaikan di atas adalah benar dan lengkap, dan saya menyetujui untuk menggunakan Akun Wajib Pajak saya sebagai
              sarana penerimaan surat dan dokumen perpajakan.
            </span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!isAgreed || isSubmitting}
            className={`px-6 py-2 rounded font-medium ${isAgreed && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Ajukan Permohonan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxpayerDeclaration;
