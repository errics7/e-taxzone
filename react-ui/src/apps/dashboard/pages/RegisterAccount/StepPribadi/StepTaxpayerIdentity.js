import React, { useState, useEffect } from "react";
import StyledInput from "../components/StyledInput";

const StepTaxpayerIdentity = ({ formData, setFormData, onNext, onRegisterValidator }) => {
  const [identity, setIdentity] = useState({
    nik: formData.taxpayerIdentity?.nik || '',
    fullName: formData.taxpayerIdentity?.fullName || '',
    placeOfBirth: formData.taxpayerIdentity?.placeOfBirth || '',
    taxpayerType: formData.taxpayerIdentity?.taxpayerType || '',
    dateOfBirth: formData.taxpayerIdentity?.dateOfBirth || '',
    countryOfOrigin: formData.taxpayerIdentity?.countryOfOrigin || '',
    religion: formData.taxpayerIdentity?.religion || '',
    gender: formData.taxpayerIdentity?.gender || '',
    maritalStatus: formData.taxpayerIdentity?.maritalStatus || '',
    typeOfWork: formData.taxpayerIdentity?.typeOfWork || '',
    motherName: formData.taxpayerIdentity?.motherName || '',
    familyCardNumber: formData.taxpayerIdentity?.familyCardNumber || '',
    familyRelationshipStatus: formData.taxpayerIdentity?.familyRelationshipStatus || ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};

    if (!identity.nik) newErrors.nik = 'NIK is required';
    else if (identity.nik.length !== 16) newErrors.nik = 'NIK must be 16 digits';
    
    if (!identity.fullName) newErrors.fullName = 'Full name is required';
    else if (identity.fullName.length < 3) newErrors.fullName = 'Full name must be at least 3 characters';
    
    if (!identity.taxpayerType) newErrors.taxpayerType = 'Taxpayer Type is required';
    if (!identity.countryOfOrigin) newErrors.countryOfOrigin = 'Country of Origin is required';
    if (!identity.placeOfBirth) newErrors.placeOfBirth = 'Place of birth is required';
    if (!identity.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!identity.religion) newErrors.religion = 'Religion is required';
    if (!identity.gender) newErrors.gender = 'Gender is required';
    if (!identity.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
    if (!identity.typeOfWork) newErrors.typeOfWork = 'Type of work is required';
    if (!identity.motherName) newErrors.motherName = 'Mother name is required';
    if (!identity.familyCardNumber) newErrors.familyCardNumber = 'Family card number is required';
    if (!identity.familyRelationshipStatus) newErrors.familyRelationshipStatus = 'Family relationship status is required';

    if (identity.dateOfBirth) {
      const birthDate = new Date(identity.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setFormData({ ...formData, taxpayerIdentity: identity });
      onNext();
    } else {
      const firstErrorField = document.querySelector('.text-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Register this step's validator so StepNavigation can call it
  useEffect(() => {
    if (onRegisterValidator) onRegisterValidator(handleSubmit);
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center text-blue-800">
        Masukkan data identitas wajib pajak.
      </h2>

      <div className="space-y-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StyledInput label="Nomor Induk Kependudukan (NIK)" required error={errors.nik}>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.nik ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Enter your NIK"
              value={identity.nik}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 16) setIdentity({ ...identity, nik: value });
              }}
              maxLength={16}
            />
          </StyledInput>

          <StyledInput label="Full name" required error={errors.fullName}>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Enter your full name"
              value={identity.fullName}
              onChange={(e) => setIdentity({ ...identity, fullName: e.target.value })}
            />
          </StyledInput>

          <StyledInput label="Taxpayer Type" required error={errors.taxpayerType} >
            <select
              className= {`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" ${
                errors.taxpayerType
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
              }`}
              value={identity.taxpayerType}
              onChange={(e) => setIdentity({ ...identity, taxpayerType: e.target.value })}
            >
              <option value="" disabled>Select taxpayer type</option>
              <option value="Individual or Undivided Inheritance">Individual or Undivided Inheritance</option>
              <option value="Company">Company</option>
            </select>
          </StyledInput>

          <StyledInput label="Place of birth" required error={errors.placeOfBirth}>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.placeOfBirth ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Enter your place of birth"
              value={identity.placeOfBirth}
              onChange={(e) => setIdentity({ ...identity, placeOfBirth: e.target.value })}
            />
          </StyledInput>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StyledInput label="Country of origin" required error={errors.countryOfOrigin} >
            <select
              className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${
                errors.countryOfOrigin
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500'
              }`}
              value={identity.countryOfOrigin}
              onChange={(e) => setIdentity({ ...identity, countryOfOrigin: e.target.value })}
            >
              <option value="" disabled>Select country of origin</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Other">Other</option>
            </select>
          </StyledInput>

          <StyledInput label="Date of birth" required error={errors.dateOfBirth}>
            <input
              type="date"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.dateOfBirth ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              value={identity.dateOfBirth}
              onChange={(e) => setIdentity({ ...identity, dateOfBirth: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
            />
          </StyledInput>

          <StyledInput label="Gender" required error={errors.gender}>
            <select
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.gender ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              value={identity.gender}
              onChange={(e) => setIdentity({ ...identity, gender: e.target.value })}
            >
              <option value="" disabled>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </StyledInput>

          <StyledInput label="Marital status" required error={errors.maritalStatus}>
            <select
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.maritalStatus ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              value={identity.maritalStatus}
              onChange={(e) => setIdentity({ ...identity, maritalStatus: e.target.value })}
            >
              <option value="" disabled>Select marital status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </StyledInput>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StyledInput label="Religion" required error={errors.religion}>
            <select
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.religion ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              value={identity.religion}
              onChange={(e) => setIdentity({ ...identity, religion: e.target.value })}
            >
              <option value="" disabled>Select religion</option>
              <option value="Islam">Islam</option>
              <option value="Christianity">Christianity</option>
              <option value="Catholicism">Catholicism</option>
              <option value="Hinduism">Hinduism</option>
              <option value="Buddhism">Buddhism</option>
              <option value="Confucianism">Confucianism</option>
            </select>
          </StyledInput>

          <StyledInput label="Type of work" required error={errors.typeOfWork}>
            <select
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.typeOfWork ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              value={identity.typeOfWork}
              onChange={(e) => setIdentity({ ...identity, typeOfWork: e.target.value })}
            >
              <option value="" disabled>Select job type</option>
              <option value="Employee">Employee</option>
              <option value="Entrepreneur">Entrepreneur</option>
              <option value="Professional">Professional</option>
              <option value="Other">Other</option>
            </select>
          </StyledInput>

          <StyledInput label="Mother's Name" required error={errors.motherName}>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.motherName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Enter Mother's Name"
              value={identity.motherName}
              onChange={(e) => setIdentity({ ...identity, motherName: e.target.value })}
            />
          </StyledInput>

          <StyledInput label="Family Card Number" required error={errors.familyCardNumber}>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.familyCardNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Enter Family Card Number"
              value={identity.familyCardNumber}
              onChange={(e) => setIdentity({ ...identity, familyCardNumber: e.target.value })}
            />
          </StyledInput>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StyledInput label="Family Relationship Status" required error={errors.familyRelationshipStatus}>
            <select
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.familyRelationshipStatus ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              value={identity.familyRelationshipStatus}
              onChange={(e) => setIdentity({ ...identity, familyRelationshipStatus: e.target.value })}
            >
              <option value="" disabled>Select Family Relationship Status</option>
              <option value="Head of Family">Head of Family</option>
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Other">Other</option>
            </select>
          </StyledInput>

          <StyledInput label="Individual Category">
            <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
              <option value="">Select Individual Category</option>
              <option value="General">General</option>
              <option value="Special">Special</option>
            </select>
          </StyledInput>
        </div>
      </div>
    </div>
  );
};

export default StepTaxpayerIdentity;
