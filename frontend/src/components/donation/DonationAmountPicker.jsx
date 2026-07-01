import React from 'react';

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

const DonationAmountPicker = ({ amount, onChange }) => {
  const [isCustom, setIsCustom] = React.useState(!PRESET_AMOUNTS.includes(Number(amount)));

  const handlePreset = (val) => {
    setIsCustom(false);
    onChange(val);
  };

  const handleCustom = (e) => {
    setIsCustom(true);
    onChange(Number(e.target.value) || '');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRESET_AMOUNTS.map(preset => (
          <button
            key={preset}
            type="button"
            onClick={() => handlePreset(preset)}
            className={`py-3 px-2 rounded-xl font-semibold text-sm border-2 transition-all ${
              !isCustom && Number(amount) === preset
                ? 'border-primary bg-indigo-50 text-primary shadow-sm'
                : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
            }`}
          >
            ₹{preset.toLocaleString('en-IN')}
          </button>
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">₹</span>
        <input
          type="number"
          placeholder="Enter custom amount"
          value={isCustom ? amount : ''}
          onChange={handleCustom}
          min={1}
          onClick={() => setIsCustom(true)}
          className={`w-full pl-9 pr-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all ${
            isCustom ? 'border-primary bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300'
          }`}
        />
      </div>
      {amount > 0 && (
        <p className="text-sm text-gray-500 text-center">
          You are donating <span className="font-bold text-primary">₹{Number(amount).toLocaleString('en-IN')}</span>
        </p>
      )}
    </div>
  );
};

export default DonationAmountPicker;
