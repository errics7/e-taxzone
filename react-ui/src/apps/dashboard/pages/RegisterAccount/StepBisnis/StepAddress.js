// StepBisnis/StepAddress.js
//
// ✅ FIX: Proper wrapper instead of bare re-export.
//
// WHY NOT BARE RE-EXPORT:
// export { default } from "../StepPribadi/StepAddressDetails"
// makes React see the SAME component type at two different tree positions
// (business flow step 9, individual flow step 8). When switching flows or
// navigating Previous/Next across these steps, React may reuse the existing
// component instance without remounting — leaving stale local state
// (addresses, errors) from a previous render.
//
// The wrapper approach gives this step its own stable display name and,
// crucially, allows a `key` prop to be passed from the parent
// (RegisterAccount renders <StepAddressBisnis key="bisnis-address" {...stepProps} />)
// which guarantees a clean remount when the business flow reaches this step.

import React from "react";
import StepAddressDetails from "../StepPribadi/StepAddressDetails";

const StepAddressBisnis = (props) => {
  return <StepAddressDetails {...props} />;
};

// Display name helps React DevTools and error boundaries identify this step
StepAddressBisnis.displayName = "StepAddressBisnis";

export default StepAddressBisnis;