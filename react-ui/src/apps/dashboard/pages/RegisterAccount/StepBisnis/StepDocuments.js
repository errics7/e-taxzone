import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const StepDocuments = ({ formData, setFormData, onNext, onRegisterValidator }) => {
  const [documents, setDocuments] = useState({
    establishmentDocument: formData.documents?.establishmentDocument || null,
    authorizationLetter: formData.documents?.authorizationLetter || null
  });

  const [previews, setPreviews] = useState({
    establishmentDocument: null,
    authorizationLetter: null
  });

  const handleFileUpload = (documentType, event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format file harus PDF, JPG, JPEG, atau PNG', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
        return;
      }

      setDocuments({ ...documents, [documentType]: file });

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviews({ ...previews, [documentType]: e.target.result });
        reader.readAsDataURL(file);
      } else {
        setPreviews({ ...previews, [documentType]: null });
      }

      toast.success(
        `${documentType === 'establishmentDocument' ? 'Establishment Document' : 'Authorization Letter'} berhasil diupload`,
        { style: { border: '1px solid #10B981', color: '#10B981' } }
      );
    }
  };

  const removeDocument = (documentType) => {
    setDocuments({ ...documents, [documentType]: null });
    setPreviews({ ...previews, [documentType]: null });
    toast.success('Dokumen berhasil dihapus', { style: { border: '1px solid #10B981', color: '#10B981' } });
  };

  const handleNext = () => {
    if (!documents.establishmentDocument) {
      toast.error('Establishment Document wajib diupload', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
      return;
    }
    if (!documents.authorizationLetter) {
      toast.error('Authorization Letter wajib diupload', { style: { border: '1px solid #DC2626', color: '#DC2626' } });
      return;
    }
    setFormData({ ...formData, documents });
    onNext();
  };

  // Register validator so StepNavigation can call it
  useEffect(() => {
    if (onRegisterValidator) onRegisterValidator(handleNext);
  });

  const DocumentUploadBox = ({ documentType, label }) => (
    <div>
      <h3 className="text-lg font-medium mb-4 text-center">
        {label} <span className="text-red-500">*</span>
      </h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {documents[documentType] ? (
          <div className="space-y-4">
            {previews[documentType] ? (
              <img
                src={previews[documentType]}
                alt={`${label} Preview`}
                className="max-w-full max-h-32 mx-auto rounded"
              />
            ) : (
              <div className="text-4xl text-blue-500 mb-2">📄</div>
            )}
            <p className="text-sm text-gray-600">{documents[documentType].name}</p>
            <div className="space-y-2">
              <p className="text-green-600 font-medium">✓ Dokumen berhasil diupload</p>
              <button
                onClick={() => removeDocument(documentType)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Hapus Dokumen
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl text-gray-400 mb-2">📄</div>
            <p className="text-gray-600 mb-4">Seret dokumen Anda ke sini</p>
            <p className="text-gray-500 mb-4">Atau</p>
            <label className="bg-blue-600 text-white px-6 py-3 rounded cursor-pointer hover:bg-blue-700 inline-block transition-colors">
              Jelajahi di pengelolaan file Anda
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(documentType, e)}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Format: PDF, JPG, JPEG, PNG (Max 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Silakan unggah dokumen yang diperlukan
      </h2>

      <div className="max-w-4xl mx-auto">
        <p className="text-gray-600 mb-8 text-center">
          Silakan unggah dokumen berikut sebelum mengajukan aplikasi:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DocumentUploadBox documentType="establishmentDocument" label="Establishment Document" />
          <DocumentUploadBox documentType="authorizationLetter" label="Authorization letter" />
        </div>
      </div>
    </div>
  );
};

export default StepDocuments;
