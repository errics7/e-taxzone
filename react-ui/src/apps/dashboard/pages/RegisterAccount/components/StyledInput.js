import React from "react";

const StyledInput = ({ label, required = false, children, error, helperText }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {helperText && <p className="text-gray-500 text-xs">{helperText}</p>}
    </div>
  );
};

export default StyledInput;
