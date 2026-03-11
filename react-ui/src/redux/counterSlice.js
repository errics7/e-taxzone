import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },

  reducers: {
    refresh: (state, action) => { 
      state.value = state.value + 1;
    },
    clean: (state) => {
      state.value = 0;
    },
  },
});

export const { clean, refresh } = counterSlice.actions;

export default counterSlice.reducer;
