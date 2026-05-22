import React, { useState, useEffect, useCallback } from "react";

const StepIdentityVerification = ({ formData, setFormData, onNext, onRegisterValidator }) => {
  const [uploadedPhoto, setUploadedPhoto] = useState(formData.uploadedPhoto || null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setUploadedPhoto(null);
    setPhotoPreview(null);
  };

  const handleNext = () => {
    setFormData(prev => ({ ...prev, uploadedPhoto }));
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
        Silakan ambil foto atau unggah dari komputer Anda
      </h2>

      <div className="max-w-2xl mx-auto">
        {!photoPreview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl text-gray-400">📷</div>
              <p className="text-gray-600">Take a photo</p>
              <p className="text-gray-600">Atau</p>
              <label className="bg-blue-600 text-white px-6 py-3 rounded cursor-pointer hover:bg-blue-700 inline-block">
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-6">
            <div className="text-center mb-4">
              <img
                src={photoPreview}
                alt="Uploaded identity document"
                className="max-w-full max-h-64 mx-auto rounded"
              />
            </div>
            <div className="text-center space-x-4">
              <span className="text-green-600 font-medium">✓ Photo uploaded successfully</span>
              <button
                onClick={removePhoto}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepIdentityVerification;
