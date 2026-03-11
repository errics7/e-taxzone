import { createSlice } from "@reduxjs/toolkit";

const initial = {
  status: "",
  data: null,
  // value: {}, // data config [info,linkdest,linkgs] admin dosen
};

const configSlice = createSlice({
  name: "config",
  initialState: initial,
  reducers: {
    setInfoData: (state, action) => {
      state.value.info = action.payload;
    },
    setRotationData: (state, action) => {
      state.data.current = action.payload;
    },
    setRotationArea: (state, action) => {
      state.status = "rotationArea";
      state.data = action.payload;
    },
    setItemInfoArea: (state, action) => {
      state.status = "itemInfoArea";
      state.data = action.payload;
    },
    setItemLinkArea: (state, action) => {
      state.status = "itemLinkArea";
      state.data = action.payload;
    },
    setItemLinkGS: (state, action) => {
      state.status = "itemLinkGS";
      state.data = action.payload;
    },
    clean: (state) => {
      return initial;
    },
  },
});

export const {
  clean,
  setInfoData,
  setRotationArea,
  setRotationData,
  setItemInfoArea,
  setItemLinkArea,
  setItemLinkGS,
} = configSlice.actions;

export default configSlice.reducer;
