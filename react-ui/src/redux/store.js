import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import ScenarioReducer from "./scenarioSlice";
import userReducer from "./userSlice";
import configReducer from "./configSlice";
import sptReducer from "./sptSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    scen: ScenarioReducer,
    counter: counterReducer,
    config: configReducer,
    spt: sptReducer
  },
});

export default store;
