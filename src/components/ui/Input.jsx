import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`px-4 py-3 rounded-xl border ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'} bg-gray-50/50 focus:bg-white outline-none transition-all duration-200`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};
