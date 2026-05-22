import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAuthHeaders, HOST } from '../utils/host.config';


// Baca pilihan portal dari localStorage saat Redux store pertama kali dibuat.
// Ini memastikan state sudah benar SEBELUM fetchTaxpayerData() selesai,
// sehingga tidak ada flicker navbar saat halaman pertama load.
const getSavedSptType = () => {
  try {
    const saved = localStorage.getItem('spt_portal_preference');
    if (saved === 'individual' || saved === 'company') return saved;
  } catch (_) {}
  return 'individual'; // default fallback
};

// Initial state
const initialState = {
  currentSptType: getSavedSptType(), // baca dari localStorage, bukan hardcode 'individual'
  availableSptTypes: [],
  taxpayerData: null,
  loading: false,
  error: null,
  lastUpdated: null
};

// SPT Slice
const sptSlice = createSlice({
  name: 'spt',
  initialState,
  reducers: {
    // Set current SPT type
    setSptType: (state, action) => {
      state.currentSptType = action.payload;
      state.lastUpdated = new Date().toISOString();
      // PERSISTENCE: simpan pilihan user ke localStorage
      // agar tidak hilang saat refresh/navigation
      try {
        localStorage.setItem('spt_portal_preference', action.payload);
      } catch (_) {}
    },

    // Set available SPT types based on taxpayer data
    setAvailableSptTypes: (state, action) => {
      state.availableSptTypes = action.payload;
    },

    // Set taxpayer data
    setTaxpayerData: (state, action) => {
      state.taxpayerData = action.payload;
      
      // Auto-determine available SPT types based on taxpayer data
      const availableTypes = [
        {
          value: 'individual',
          label: 'SPT Orang Pribadi',
          description: 'Untuk Wajib Pajak Orang Pribadi'
        }
      ];

      // Add company SPT if taxpayer is a company
      if (action.payload?.taxpayer_type === 'company') {
        availableTypes.push({
          value: 'company',
          label: 'SPT Badan',
          description: 'Untuk Wajib Pajak Badan'
        });
      }

      state.availableSptTypes = availableTypes;

      // ROOT CAUSE FIX:
      // Sebelumnya: selalu overwrite currentSptType ke default account type.
      // Ini menyebabkan pilihan user hilang setiap Navbar mount (fetchTaxpayerData dipanggil).
      //
      // Fix: cek localStorage terlebih dahulu.
      // - Jika user sudah pernah memilih portal → gunakan pilihan itu (jangan overwrite)
      // - Jika belum ada pilihan tersimpan → gunakan default dari account type
      // - Jika pilihan tersimpan tidak valid untuk account ini → fallback ke default
      try {
        const savedPreference = localStorage.getItem('spt_portal_preference');
        const isValidSavedType = savedPreference &&
          availableTypes.some(t => t.value === savedPreference);

        if (isValidSavedType) {
          // Hormati pilihan user — jangan overwrite
          state.currentSptType = savedPreference;
        } else {
          // Tidak ada pilihan tersimpan atau tidak valid → set default dari account
          const defaultType = action.payload?.taxpayer_type === 'company' ? 'company' : 'individual';
          state.currentSptType = defaultType;
          try {
            localStorage.setItem('spt_portal_preference', defaultType);
          } catch (_) {}
        }
      } catch (_) {
        // localStorage tidak tersedia (misal: private mode yang ketat)
        state.currentSptType = action.payload?.taxpayer_type === 'company' ? 'company' : 'individual';
      }

      state.lastUpdated = new Date().toISOString();
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset SPT state
    resetSptState: (state) => {
      return { ...initialState };
    },

    // Update SPT type from account switch
    updateSptFromAccount: (state, action) => {
      const { taxpayer_type } = action.payload;
      const newType = taxpayer_type === 'company' ? 'company' : 'individual';
      state.currentSptType = newType;
      state.lastUpdated = new Date().toISOString();
      // Saat ganti akun, reset localStorage ke default akun baru
      try {
        localStorage.setItem('spt_portal_preference', newType);
      } catch (_) {}
    }
  }
});

// Export actions
export const {
  setSptType,
  setAvailableSptTypes,
  setTaxpayerData,
  setLoading,
  setError,
  clearError,
  resetSptState,
  updateSptFromAccount
} = sptSlice.actions;

// Selectors
export const selectCurrentSptType = (state) => state.spt.currentSptType;
export const selectAvailableSptTypes = (state) => state.spt.availableSptTypes;
export const selectTaxpayerData = (state) => state.spt.taxpayerData;
export const selectSptLoading = (state) => state.spt.loading;
export const selectSptError = (state) => state.spt.error;
export const selectLastUpdated = (state) => state.spt.lastUpdated;

// Computed selectors
export const selectCurrentSptLabel = (state) => {
  const currentType = selectCurrentSptType(state);
  return currentType === 'company' ? 'SPT Badan' : 'SPT Orang Pribadi';
};

export const selectHasMultipleSptTypes = (state) => {
  const availableTypes = selectAvailableSptTypes(state);
  return availableTypes.length > 1;
};

export const selectCurrentSptTypeData = (state) => {
  const currentType = selectCurrentSptType(state);
  const availableTypes = selectAvailableSptTypes(state);
  return availableTypes.find(type => type.value === currentType);
};

// Fetch taxpayer data and set SPT types
export const fetchTaxpayerData = createAsyncThunk(
  'spt/fetchTaxpayerData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const response = await fetch(`${HOST}/api/v2/taxpayer/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        dispatch(setTaxpayerData(result.data));
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch taxpayer data');
      }
    } catch (error) {
      const errorMessage = error.message || 'Error fetching taxpayer data';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Switch SPT type with validation
export const switchSptType = createAsyncThunk(
  'spt/switchSptType',
  async (newType, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const availableTypes = selectAvailableSptTypes(state);
      
      // Validate if the new type is available
      const isValidType = availableTypes.some(type => type.value === newType);
      
      if (!isValidType) {
        throw new Error(`SPT type "${newType}" is not available for this taxpayer`);
      }

      dispatch(setSptType(newType));
      
      // You can add additional logic here like:
      // - Save to localStorage
      // - Send to analytics
      // - Update user preferences in API
      
      return newType;
    } catch (error) {
      const errorMessage = error.message || 'Error switching SPT type';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export default sptSlice.reducer;