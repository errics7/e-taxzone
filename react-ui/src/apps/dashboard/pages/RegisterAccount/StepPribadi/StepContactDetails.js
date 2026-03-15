import React, { useState, useEffect } from "react";
import StyledInput from "../components/StyledInput";
import toast from "react-hot-toast";

const StepContactDetails = ({ formData, setFormData, onNext, onRegisterValidator }) => {
  const [contact, setContact] = useState({
    email: formData.contactDetails?.email || '',
    handphone: formData.contactDetails?.handphone || '',
    telephone: formData.contactDetails?.telephone || '',
    fax: formData.contactDetails?.fax || ''
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^0\d{7,14}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!contact.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(contact.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!contact.handphone) {
      newErrors.handphone = 'Handphone number is required';
    } else if (!validatePhone(contact.handphone)) {
      newErrors.handphone = 'Phone number must start with 0, min 8 characters, max 15 characters, and digits only';
    }

    if (contact.telephone && !validatePhone(contact.telephone)) {
      newErrors.telephone = 'Phone number must start with 0, min 8 characters, max 15 characters, and digits only';
    }

    if (contact.fax && !validatePhone(contact.fax)) {
      newErrors.fax = 'Fax number must start with 0, min 8 characters, max 15 characters, and digits only';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setFormData({ ...formData, contactDetails: contact });
      onNext();
    } else {
      const firstErrorField = document.querySelector('.text-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Register validator so StepNavigation can call it
  useEffect(() => {
    if (onRegisterValidator) onRegisterValidator(handleSubmit);
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Mohon verifikasi detail kontak wajib pajak.
      </h2>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StyledInput label="E-mail" required error={errors.email}>
            <div className="flex gap-2">
              <input
                type="email"
                className={`flex-1 border rounded px-3 py-2 focus:outline-none ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                placeholder="Masukkan alamat email Anda"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value.toLowerCase() })}
              />
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                onClick={() => {
                  if (contact.email && validateEmail(contact.email)) {
                    toast.success('Email format is valid', {
                      duration: 2000,
                      style: { border: '1px solid #10B981', color: '#10B981' }
                    });
                  } else {
                    toast.error('Please enter a valid email', {
                      duration: 2000,
                      style: { border: '1px solid #DC2626', color: '#DC2626' }
                    });
                  }
                }}
              >
                Verify
              </button>
            </div>
          </StyledInput>

          <StyledInput
            label="Nomor Handphone"
            required
            error={errors.handphone}
            helperText="Phone number start with 0, min 8 characters, max 15 characters, and digits only"
          >
            <div className="flex gap-2">
              <input
                type="tel"
                className={`flex-1 border rounded px-3 py-2 focus:outline-none ${errors.handphone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                placeholder="Enter Phone Number"
                value={contact.handphone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 15) setContact({ ...contact, handphone: value });
                }}
                maxLength={15}
              />
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                onClick={() => {
                  if (contact.handphone && validatePhone(contact.handphone)) {
                    toast.success('Phone number format is valid', {
                      duration: 2000,
                      style: { border: '1px solid #10B981', color: '#10B981' }
                    });
                  } else {
                    toast.error('Please enter a valid phone number', {
                      duration: 2000,
                      style: { border: '1px solid #DC2626', color: '#DC2626' }
                    });
                  }
                }}
              >
                Verify
              </button>
            </div>
          </StyledInput>

          <StyledInput
            label="Nomor Telepon"
            error={errors.telephone}
            helperText="Phone number start with 0, min 8 characters, max 15 characters, and digits only"
          >
            <input
              type="tel"
              className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.telephone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Masukkan Nomor Telepon"
              value={contact.telephone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 15) setContact({ ...contact, telephone: value });
              }}
              maxLength={15}
            />
          </StyledInput>
        </div>

        <StyledInput
          label="Nomor Faksimile"
          error={errors.fax}
          helperText="Phone number start with 0, min 8 characters, max 15 characters, and digits only"
        >
          <input
            type="tel"
            className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.fax ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            placeholder="Masukkan Nomor Fax"
            value={contact.fax}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 15) setContact({ ...contact, fax: value });
            }}
            maxLength={15}
          />
        </StyledInput>

      </div>
    </div>
  );
};

export default StepContactDetails;
