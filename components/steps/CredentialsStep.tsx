'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { LoanFormData } from '@/hooks/use-loan-form';

interface EmploymentType {
  id: string;
  name: string;
}

interface CredentialsStepProps {
  employmentTypes: EmploymentType[];
  formData: LoanFormData;
  onUpdate: (data: Partial<LoanFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function CredentialsStep({
  employmentTypes,
  formData,
  onUpdate,
  onNext,
  onPrevious,
}: CredentialsStepProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value } as Partial<LoanFormData>);
  };

  const isComplete =
    formData.nationalId &&
    formData.fullName &&
    formData.phoneNumber &&
    formData.employmentType;

  return (
    <div className="space-y-4 sm:space-y-6 animate-slideUp">
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Your Credentials</h2>
        <p className="text-sm sm:text-base text-gray-400">Provide your personal information for loan verification</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* National ID */}
        <div className="space-y-2 sm:space-y-3 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <label className="text-xs sm:text-sm font-semibold text-gray-300">National ID Number</label>
          <input
            type="text"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleInputChange}
            placeholder="e.g. 12345678"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900 border border-gold-500/30 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 transition-all duration-300 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
          />
        </div>

        {/* Full Name */}
        <div className="space-y-2 sm:space-y-3 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <label className="text-xs sm:text-sm font-semibold text-gray-300">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="As on your ID"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900 border border-gold-500/30 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 transition-all duration-300 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2 sm:space-y-3 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <label className="text-xs sm:text-sm font-semibold text-gray-300">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="07XX XXX XXX"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900 border border-gold-500/30 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 transition-all duration-300 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
          />
        </div>

        {/* Employment Type */}
        <div className="space-y-2 sm:space-y-3 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <label className="text-xs sm:text-sm font-semibold text-gray-300">Type of Employment</label>
          <div className="relative">
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900 border border-gold-500/30 rounded-lg text-sm sm:text-base text-white cursor-pointer appearance-none transition-all duration-300 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            >
              <option value="">-- Select employment type --</option>
              {employmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
        <button
          onClick={onPrevious}
          className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base border border-gold-500 text-gold-500 font-semibold rounded-lg hover:bg-gold-500/10 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base bg-gold-500 text-black font-semibold rounded-lg hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Continue to Terms
        </button>
      </div>
    </div>
  );
}
