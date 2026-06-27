import React from 'react';
import { Check } from 'lucide-react';

const MultiStepForm = ({ steps, currentStep, children }) => {
  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500 -z-0"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              i < currentStep ? 'bg-primary text-white' :
              i === currentStep ? 'bg-primary text-white ring-4 ring-indigo-100' :
              'bg-white border-2 border-gray-300 text-gray-400'
            }`}>
              {i < currentStep ? <Check size={14} /> : i + 1}
            </div>
            <p className={`text-xs mt-2 font-medium hidden sm:block ${i === currentStep ? 'text-primary' : 'text-gray-400'}`}>
              {step}
            </p>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

export default MultiStepForm;
