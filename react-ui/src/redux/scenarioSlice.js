import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./userSlice";

const initialStateValue = {
  _id: 0,
  selectedcode: "-",
  nama: "",
  worksheet_id: 0,
  virtualtour_id: 0,
};

const decodeInitial = () => {
  return localStorage.getItem("scen")
    ? JSON.parse(localStorage.getItem("scen"))
    : initialStateValue;
};

const scenarioSlice = createSlice({
  name: "scenario",
  initialState: decodeInitial(),

  reducers: {
    setScen: (state, action) => {
      const neww = {
        _id: action.payload.scen_id,
        selectedcode: action.payload.code,
        nama: action.payload.nama,
        worksheet_id: action.payload.worksheet_id,
        virtualtour_id: action.payload.virtualtour_id,
      };
      localStorage.setItem("scen", JSON.stringify(neww));
      return neww;
    },
    clearScen: (state) => {
      state = initialStateValue;
    },
  },
  extraReducers: {
    [logout]: (state, action) => { 
      return initialStateValue;
    },
  },
});

export const { clearScen, setScen } = scenarioSlice.actions;

export default scenarioSlice.reducer;
