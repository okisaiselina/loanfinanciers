'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { LoanFormData } from '@/hooks/use-loan-form';

interface LoanType {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  access_fee: number;
}

interface LoanTypeStepProps {
  loanTypes: LoanType[];
  formData: LoanFormData;
  onUpdate: (data: Partial<LoanFormData>) => void;
  onNext: () => void;
}

export default function LoanTypeStep({
  loanTypes,
  formData,
  onUpdate,
  onNext,
}: LoanTypeStepProps) {
  const handleSelect = (loanTypeId: string) => {
    onUpdate({ loanTypeId });
  };

  const selectedLoan = loanTypes.find((lt) => lt.id === formData.loanTypeId);

  return (
    <div className="space-y-4 sm:space-y-6 animate-slideUp">
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Select Loan Type</h2>
        <p className="text-sm sm:text-base text-gray-400">Choose the type of loan that best suits your needs</p>
      </div>

      <div className="relative">
        <select
          value={formData.loanTypeId}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-900 border border-gold-500/30 rounded-lg text-sm sm:text-base text-white cursor-pointer appearance-none transition-all duration-300 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
        >
          <option value="">-- Select a loan type --</option>
          {loanTypes.map((loan) => (
            <option key={loan.id} value={loan.id}>
              {loan.name} (KES {loan.min_amount.toLocaleString()} – {loan.max_amount.toLocaleString()})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500 pointer-events-none" />
      </div>

      {selectedLoan && (
        <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 animate-fadeIn">
          <p className="text-xs sm:text-sm text-gray-400">
            <span className="text-gold-500 font-semibold">Amount Range:</span> KES {selectedLoan.min_amount.toLocaleString()} - {selectedLoan.max_amount.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            <span className="text-gold-500 font-semibold">Interest Rate:</span> {selectedLoan.interest_rate}%
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            <span className="text-gold-500 font-semibold">Access Fee:</span> KES {selectedLoan.access_fee}
          </p>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!formData.loanTypeId}
        className="w-full py-3 px-4 text-sm sm:text-base bg-gold-500 text-black font-semibold rounded-lg hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-6 sm:mt-8"
      >
        Continue to Loan Amount
      </button>
    </div>
  );
}
