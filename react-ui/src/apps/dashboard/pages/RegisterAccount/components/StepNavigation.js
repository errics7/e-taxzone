import React from "react";

const StepNavigation = ({ onPrevious, onNext, onSubmit, isFirst, isLast, canSubmit, isSubmitting }) => {
  return (
    <div className="flex justify-between mt-8">
      {/* Left side — Previous button (hidden on first step via invisible placeholder to keep layout) */}
      <div>
        {!isFirst ? (
          <button
            onClick={onPrevious}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Previous
          </button>
        ) : (
          /* Invisible placeholder keeps right-side button right-aligned on step 1 */
          <div />
        )}
      </div>

      {/* Right side — Next (non-last steps) or Submit (last step) */}
      <div>
        {isLast ? (
          <button
            onClick={onSubmit}
            disabled={!canSubmit || isSubmitting}
            className={`px-6 py-2 rounded font-medium transition-colors ${
              canSubmit && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Memproses...' : 'Ajukan Permohonan'}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
