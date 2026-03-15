import React from "react";

const StepIndicator = ({ currentStep, totalSteps, steps, onStepClick }) => {
  return (
    <div className="w-full mb-8 px-2">
      {/* Outer row: bubble-column → flex-1 connector → bubble-column → … */}
      <div className="flex items-start w-full">
        {steps.map((step, index) => {
          const isActive    = index + 1 <= currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <React.Fragment key={index}>
              {/* Bubble + label — fixed width so all columns are equal */}
              <div className="flex flex-col items-center flex-shrink-0 w-16">
                <button
                  onClick={() => onStepClick && onStepClick(index + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all focus:outline-none ${
                    isActive
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                      : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                  }`}
                >
                  {index + 1}
                </button>
                <span
                  className={`text-xs mt-1 text-center w-full leading-tight break-words ${
                    isActive ? 'text-blue-600 font-medium' : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Connector — flex-1 stretches evenly; mt-5 aligns it with bubble centre (half of h-10 = 1.25rem ≈ mt-5) */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mt-5 mx-1 transition-colors ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
