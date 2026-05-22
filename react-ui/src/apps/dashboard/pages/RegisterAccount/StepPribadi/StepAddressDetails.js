import React, { useState, useEffect, useCallback } from "react";
import StyledInput from "../components/StyledInput";
import toast from "react-hot-toast";

const StepAddressDetails = ({ formData, setFormData, onNext, onRegisterValidator }) => {
  const [addresses, setAddresses] = useState(
    formData.addresses && formData.addresses.length > 0
      ? formData.addresses
      : [
        {
          type: 'Alamat Domisili (Alamat Utama)',
          address: '', rt: '', rw: '', province: '',
          city: '', district: '', village: '', postalCode: '', coordinates: ''
        },
        {
          type: 'Alamat sesuai di KTP',
          address: '', rt: '', rw: '', province: '',
          city: '', district: '', village: '', postalCode: '', coordinates: ''
        }
      ]
  );

  const [errors, setErrors] = useState({});

  
  const addressesRef = React.useRef(addresses);
  useEffect(() => {
    addressesRef.current = addresses;
  }, [addresses]);

  
  const handleAddressChange = (index, field, value) => {
    setAddresses(prev => {
      const newAddresses = [...prev];
      newAddresses[index] = { ...newAddresses[index], [field]: value };
      return newAddresses;
    });

    if (errors[`${index}_${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${index}_${field}`];
        return newErrors;
      });
    }
  };

  const copyFromDomicile = () => {
    setAddresses(prev => {
      const newAddresses = [...prev];
      newAddresses[1] = { ...newAddresses[0], type: 'Alamat sesuai di KTP' };
      return newAddresses;
    });
  };

  // Pure function — tidak ada closure dependency
  const validateAddresses = (addressList) => {
    const newErrors = {};
    addressList.forEach((address, index) => {
      if (!address.address) newErrors[`${index}_address`] = 'Detail alamat wajib diisi';
      if (!address.rt) newErrors[`${index}_rt`] = 'RT wajib diisi';
      if (!address.rw) newErrors[`${index}_rw`] = 'RW wajib diisi';
      if (!address.province) newErrors[`${index}_province`] = 'Provinsi wajib dipilih';
      if (!address.city) newErrors[`${index}_city`] = 'Kota/Wilayah wajib dipilih';
      if (!address.district) newErrors[`${index}_district`] = 'Kecamatan wajib dipilih';
      if (!address.village) newErrors[`${index}_village`] = 'Desa/Kelurahan wajib dipilih';
      if (!address.postalCode) newErrors[`${index}_postalCode`] = 'Kode pos wajib diisi';
    });
    return newErrors;
  };

  
  const handleNext = useCallback(() => {
    // Baca addresses TERBARU dari ref — tidak stale meski closure lama
    const currentAddresses = addressesRef.current;
    const validationErrors = validateAddresses(currentAddresses);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Mohon lengkapi semua field alamat yang wajib diisi', {
        style: { border: '1px solid #DC2626', color: '#DC2626' }
      });
      setTimeout(() => {
        const firstErrorField = document.querySelector('.border-red-500');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    // ✅ Functional update — tidak overwrite perubahan formData dari step lain
    setFormData(prev => ({ ...prev, addresses: currentAddresses }));
    setTimeout(() => {
      onNext();
    }, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNext, setFormData]);

  useEffect(() => {
    if (onRegisterValidator) onRegisterValidator(handleNext);
  }, [handleNext, onRegisterValidator]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Masukkan detail Alamat wajib pajak.
      </h2>

      <div className="max-w-6xl mx-auto space-y-8">
        {addresses.map((address, index) => (
          <div key={index} className="border rounded-lg p-6 bg-gray-50">
            <h3 className="font-semibold mb-4">{address.type}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <StyledInput label="Jenis Alamat" required>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={address.type}
                  disabled
                >
                  <option value={address.type}>{address.type}</option>
                </select>
              </StyledInput>

              <StyledInput label="Detail Alamat" required error={errors[`${index}_address`]}>
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_address`] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  placeholder="Enter Address details (street, number, building, ...)"
                  value={address.address}
                  onChange={(e) => handleAddressChange(index, 'address', e.target.value)}
                />
              </StyledInput>

              <StyledInput label="RT" required error={errors[`${index}_rt`]} helperText="RT/RW does not exist, enter 000">
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_rt`] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  placeholder="Enter RT"
                  value={address.rt}
                  onChange={(e) => handleAddressChange(index, 'rt', e.target.value)}
                />
              </StyledInput>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <StyledInput label="RW" required error={errors[`${index}_rw`]} helperText="RT/RW does not exist, enter 000">
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_rw`] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  placeholder="Enter RW"
                  value={address.rw}
                  onChange={(e) => handleAddressChange(index, 'rw', e.target.value)}
                />
              </StyledInput>

              <StyledInput label="Provinsi" required error={errors[`${index}_province`]}>
                <select
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_province`] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  value={address.province}
                  onChange={(e) => handleAddressChange(index, 'province', e.target.value)}
                >
                  <option value="">Select province</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                  <option value="Jawa Barat">Jawa Barat</option>
                  <option value="Jawa Tengah">Jawa Tengah</option>
                </select>
              </StyledInput>

              <StyledInput label="Kota/Wilayah" required error={errors[`${index}_city`]}>
                <select
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_city`] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  value={address.city}
                  onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                >
                  <option value="">Select city</option>
                  <option value="Malang">Malang</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Batu">Batu</option>
                </select>
              </StyledInput>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <StyledInput label="Kecamatan" required error={errors[`${index}_district`]}>
                <select
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_district`] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  value={address.district}
                  onChange={(e) => handleAddressChange(index, 'district', e.target.value)}
                >
                  <option value="">Select district</option>
                  <option value="Lowokwaru">Lowokwaru</option>
                  <option value="Klojen">Klojen</option>
                  <option value="Sukun">Sukun</option>
                </select>
              </StyledInput>

              <StyledInput label="Desa/Kelurahan" required error={errors[`${index}_village`]}>
                <select
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_village`] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  value={address.village}
                  onChange={(e) => handleAddressChange(index, 'village', e.target.value)}
                >
                  <option value="">Select sub-district</option>
                  <option value="Mojolangu">Mojolangu</option>
                  <option value="Tunggulwulung">Tunggulwulung</option>
                </select>
              </StyledInput>

              <StyledInput label="Kode Pos" required error={errors[`${index}_postalCode`]}>
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errors[`${index}_postalCode`] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  placeholder="Kode Pos"
                  value={address.postalCode}
                  onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                />
              </StyledInput>

              <StyledInput label="Data geometri">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Koordinat (opsional)"
                  value={address.coordinates}
                  onChange={(e) => handleAddressChange(index, 'coordinates', e.target.value)}
                />
              </StyledInput>
            </div>

            <div className="flex gap-2">
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                Mark Address
              </button>
              {index === 1 && (
                <button
                  onClick={copyFromDomicile}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  📋 Copy from Domicile
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="text-center">
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
            ➕ Add Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepAddressDetails;
