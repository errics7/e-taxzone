import React from "react";

export const SelectionCard = ({ icon, title, subtitle, isSelected, onClick, className = "" }) => {
  return (
    <div
      className={`cursor-pointer border-2 rounded-lg p-6 text-center transition-all ${isSelected
        ? 'border-blue-600 bg-blue-50'
        : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
      onClick={onClick}
    >
      <div className="mb-4 flex justify-center">
        {typeof icon === 'string' ? (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-2xl">
            {icon}
          </div>
        ) : (
          <div className="w-16 h-16 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
};

export const SelectionPajakCard = ({ icon, title, subtitle, isSelected, onClick, className = "" }) => {
  return (
    <div
      className={`cursor-pointer border-2 rounded-lg p-6 text-center border-t-8 border-t-yellow-400 transition-all ${isSelected
        ? 'border-blue-600 bg-blue-50'
        : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default SelectionCard;
