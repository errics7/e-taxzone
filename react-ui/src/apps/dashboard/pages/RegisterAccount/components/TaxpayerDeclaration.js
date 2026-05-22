import React from "react";

const TaxpayerDeclaration = ({ formData, setFormData }) => {
  // const [isAgreed, setIsAgreed] = useState(formData.declarationAccepted || false); // ← JANGAN pakai ini

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Mohon konfirmasi bahwa Wajib Pajak mematuhi pernyataan berikut ini.
      </h2>

      <div className="max-w-4xl mx-auto">
        <div
          className={`p-6 rounded-lg mb-6 border-2 transition-colors ${
            formData.declarationAccepted
              ? 'bg-blue-50 border-blue-300'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              // ✅ Controlled: nilai SELALU dari formData.declarationAccepted
              // Bukan dari local state yang bisa desync
              checked={!!formData.declarationAccepted}
              onChange={(e) => {
                const checked = e.target.checked;
                // ✅ Functional update — tidak akan stale
                setFormData((prev) => ({
                  ...prev,
                  declarationAccepted: checked,
                }));
              }}
              className="mt-1 w-4 h-4 text-blue-600 flex-shrink-0"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              Dengan menyadari sepenuhnya akan segala akibatnya termasuk sanksi
              sesuai dengan ketentuan peraturan perundang-undangan yang berlaku,
              saya menyatakan bahwa apa yang saya sampaikan di atas adalah benar
              dan lengkap, dan saya menyetujui untuk menggunakan Akun Wajib
              Pajak saya sebagai sarana penerimaan surat dan dokumen perpajakan.
            </span>
          </label>
        </div>

        {/* Visual feedback saat checkbox belum dicentang */}
        {!formData.declarationAccepted && (
          <p className="text-sm text-amber-600 text-center">
            ⚠️ Centang pernyataan di atas untuk mengaktifkan tombol "Ajukan Permohonan"
          </p>
        )}

        {/* Visual feedback saat checkbox sudah dicentang */}
        {formData.declarationAccepted && (
          <p className="text-sm text-green-600 text-center">
            ✅ Pernyataan telah disetujui. Anda dapat mengajukan permohonan.
          </p>
        )}
      </div>
    </div>
  );
};

export default TaxpayerDeclaration;
