import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

const initialStateValue = {
  _id: 0,
  nim: "",
  email: "",
  kelas: "",
  nama: "",
  img_url: "",
  authorize: "",
  exp: 0,
  iat: 0,
};

const decodeInitial = () => {
  const token = localStorage.getItem("xtoken");
  if (!token) return { isAuth: false, value: initialStateValue };

  try {
    const da = jwt_decode(token);
    
    // Cek apakah token sudah expired
    if (da.exp * 1000 < Date.now()) {
      localStorage.removeItem("xtoken");
      return { isAuth: false, value: initialStateValue };
    }
    
    return { isAuth: true, value: da };
  } catch (err) {
    console.error("Terjadi Kesalahan Decode", err);
    localStorage.removeItem("xtoken");
    return { isAuth: false, value: initialStateValue };
  }
};

// PERBAIKAN: Gunakan decodeInitial() untuk initialState
const initialState = decodeInitial();

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      try {
        const da = jwt_decode(action.payload);
        
        // Cek apakah token sudah expired
        if (da.exp * 1000 < Date.now()) {
          console.error("Token sudah expired");
          return;
        }

        // Valid decode, baru simpan token
        localStorage.clear();
        localStorage.setItem("xtoken", action.payload);

        state.isAuth = true;
        state.value = da;
      } catch (err) {
        console.error("Terjadi Kesalahan Decode saat login", err);
        state.isAuth = false;
        state.value = initialStateValue;
      }
    },
    logout: (state) => {
      state.isAuth = false;
      state.value = initialStateValue;
      localStorage.clear();
    },
    sett: (state, action) => {
      // Validasi data sebelum di-set
      if (action.payload && action.payload.exp) {
        // Cek apakah token masih valid
        if (action.payload.exp * 1000 > Date.now()) {
          state.isAuth = true;
          state.value = action.payload;
        } else {
          // Token expired, logout
          state.isAuth = false;
          state.value = initialStateValue;
          localStorage.removeItem("xtoken");
        }
      }
    },
  },
});

export const { login, logout, sett } = userSlice.actions;

export default userSlice.reducer;