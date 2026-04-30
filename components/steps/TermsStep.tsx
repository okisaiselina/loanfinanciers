'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { LoanFormData } from '@/hooks/use-loan-form';

interface TermsStepProps {
  formData: LoanFormData;
  onUpdate: (data: Partial<LoanFormData>) => void;
  onPrevious: () => void;
  onPaymentClick: () => void;
}

export default function TermsStep({
  formData,
  onUpdate,
  onPrevious,
  onPaymentClick,
}: TermsStepProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onUpdate({ [name]: checked } as Partial<LoanFormData>);
  };

  const canProceedToPayment = formData.acceptedTerms && formData.acceptedPrivacy;

  return (
    <div className="space-y-4 sm:space-y-6 animate-slideUp">
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Terms & Conditions</h2>
        <p className="text-sm sm:text-base text-gray-400">Please review and accept our terms before proceeding</p>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-3 sm:space-y-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <div className="bg-gray-900 border border-gold-500/30 rounded-lg p-3 sm:p-4 space-y-3">
          <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={formData.acceptedTerms}
              onChange={handleCheckboxChange}
              className="w-4 h-4 sm:w-5 sm:h-5 mt-1 rounded border-gold-500 bg-gray-800 text-gold-500 cursor-pointer accent-gold-500 transition-all duration-300 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm text-gray-300 flex-1">
              I agree to the{' '}
              <button className="text-gold-500 underline hover:text-gold-600 transition-colors">
                Terms & Conditions
              </button>{' '}
              of LoanFinanciers, including the loan repayment schedule, applicable interest rates, and consequences of
              default. I confirm all information provided is truthful and complete.
            </span>
          </label>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="space-y-3 sm:space-y-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <div className="bg-gray-900 border border-gold-500/30 rounded-lg p-3 sm:p-4 space-y-3">
          <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="acceptedPrivacy"
              checked={formData.acceptedPrivacy}
              onChange={handleCheckboxChange}
              className="w-4 h-4 sm:w-5 sm:h-5 mt-1 rounded border-gold-500 bg-gray-800 text-gold-500 cursor-pointer accent-gold-500 transition-all duration-300 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm text-gray-300 flex-1">
              I have read and accept the{' '}
              <button className="text-gold-500 underline hover:text-gold-600 transition-colors">
                Privacy Policy
              </button>
              . I consent to LoanFinanciers collecting, storing, and processing my personal data solely for evaluating
              and processing my loan application.
            </span>
          </label>
        </div>
      </div>

      {/* Warning if not accepted */}
      {!canProceedToPayment && (
        <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg animate-fadeIn">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-amber-300">
            You must accept both terms and privacy policy to proceed with your loan application.
          </p>
        </div>
      )}

      {/* Loan Summary */}
      <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-3 sm:p-4 space-y-3 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <h3 className="font-semibold text-gold-500 text-sm sm:text-base">Loan Summary</h3>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Eligible Amount:</span>
            <span className="text-white font-semibold">KES {formData.eligibleAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Interest Fee:</span>
            <span className="text-white font-semibold">KES {formData.interestAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Access Fee:</span>
            <span className="text-white font-semibold">KES {formData.accessFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gold-500/20 text-white font-semibold">
            <span>Total to Pay:</span>
            <span className="text-gold-500">KES {(formData.accessFee + formData.interestAmount).toLocaleString()}</span>
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
          onClick={onPaymentClick}
          disabled={!canProceedToPayment}
          className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base bg-gold-500 text-black font-semibold rounded-lg hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Pay Access Fee & Submit Application
        </button>
      </div>
    </div>
  );
}
