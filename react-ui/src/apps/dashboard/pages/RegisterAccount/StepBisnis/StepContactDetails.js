// StepBisnis/StepContactDetails.js
//
// ✅ FIX: Proper wrapper instead of bare re-export.
// Same reasoning as StepBisnis/StepAddress.js — see that file for full explanation.
//
// The wrapper gives this component its own identity in the React tree,
// preventing instance reuse between business and individual contact steps.

import React from "react";
import StepContactDetailsShared from "../StepPribadi/StepContactDetails";

const StepContactDetailsBisnis = (props) => {
  return <StepContactDetailsShared {...props} />;
};

StepContactDetailsBisnis.displayName = "StepContactDetailsBisnis";

export default StepContactDetailsBisnis;