'use client';

import React, { useState, useMemo } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import type { LoanFormData } from '@/hooks/use-loan-form';
import { calculateLoanRepayment } from '@/lib/interest-calculator';

interface LoanType {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  access_fee: number;
}

interface LoanAmountStepProps {
  loanTypes: LoanType[];
  formData: LoanFormData;
  onUpdate: (data: Partial<LoanFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function LoanAmountStep({
  loanTypes,
  formData,
  onUpdate,
  onNext,
  onPrevious,
}: LoanAmountStepProps) {
  const [amountInput, setAmountInput] = useState(formData.requestedAmount || '');
  const [loanDuration, setLoanDuration] = useState(formData.loanDuration || 12);
  const [hasConfirmedEligibility, setHasConfirmedEligibility] = useState(false);

  const selectedLoan = useMemo(
    () => loanTypes.find((lt) => lt.id === formData.loanTypeId),
    [loanTypes, formData.loanTypeId]
  );

  const eligibilityData = useMemo(() => {
    if (!selectedLoan || !amountInput) return null;

    const requested = parseFloat(amountInput as unknown as string);
    if (isNaN(requested) || requested <= 0) return null;

    // Calculate eligible amount (60-90% of requested)
    const eligibilityPercentage = Math.random() * 0.3 + 0.6; // 60-90%
    const eligible = Math.round(requested * eligibilityPercentage);
    
    // Use the interest calculator with loan type name
    const repaymentDetails = calculateLoanRepayment(selectedLoan.name, eligible, loanDuration);

    return {
      requested,
      eligible,
      interestAmount: repaymentDetails.interestAmount,
      match: Math.round(eligibilityPercentage * 100),
      accessFee: selectedLoan.access_fee || 0,
      totalRepayable: repaymentDetails.totalRepayable,
      annualRate: repaymentDetails.annualRate,
      monthlyRate: repaymentDetails.monthlyRate,
      compoundFactor: repaymentDetails.compoundFactor,
    };
  }, [selectedLoan, amountInput, loanDuration]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountInput(value);
    setHasConfirmedEligibility(false);
  };

  const handleConfirmEligibility = () => {
    if (eligibilityData) {
      onUpdate({
        requestedAmount: eligibilityData.requested,
        eligibleAmount: eligibilityData.eligible,
        interestAmount: eligibilityData.interestAmount,
        accessFee: eligibilityData.accessFee,
        totalRepayable: eligibilityData.totalRepayable,
        loanDuration: loanDuration,
      });
      setHasConfirmedEligibility(true);
    }
  };

  const canProceed = hasConfirmedEligibility && eligibilityData;
  const isValidAmount =
    eligibilityData &&
    eligibilityData.requested >= selectedLoan!.min_amount &&
    eligibilityData.requested <= selectedLoan!.max_amount;

  return (
    <div className="space-y-6 animate-slideUp">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white">Enter Loan Amount</h2>
        <p className="text-gray-400">
          {selectedLoan?.name} (KES {selectedLoan?.min_amount.toLocaleString()} – {selectedLoan?.max_amount.toLocaleString()})
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-300">Loan Amount (KES)</label>
        <input
          type="number"
          value={amountInput}
          onChange={handleAmountChange}
          min={selectedLoan?.min_amount}
          max={selectedLoan?.max_amount}
          placeholder="Enter your desired loan amount"
          className="w-full px-4 py-3 bg-gray-900 border border-gold-500/30 rounded-lg text-white placeholder-gray-500 transition-all duration-300 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-300">Loan Duration</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Duration (Months)</label>
            <select
              value={loanDuration}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value <= 24) {
                  setLoanDuration(value);
                  setHasConfirmedEligibility(false);
                }
              }}
              className="w-full px-4 py-3 bg-gray-900 border border-gold-500/30 rounded-lg text-white transition-all duration-300 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            >
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months (1 Year)</option>
              <option value={18}>18 Months</option>
              <option value={24}>24 Months (2 Years)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Duration Display</label>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-gold-500/20 rounded-lg">
              <span className="text-white font-semibold">{Math.floor(loanDuration / 12)} Year{Math.floor(loanDuration / 12) !== 1 ? 's' : ''}</span>
              <span className="text-gray-400">{loanDuration % 12} Month{(loanDuration % 12) !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {eligibilityData && !isValidAmount && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-300">
            Amount must be between KES {selectedLoan?.min_amount.toLocaleString()} and KES {selectedLoan?.max_amount.toLocaleString()}
          </p>
        </div>
      )}

      {eligibilityData && isValidAmount && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Amount Requested</span>
              <span className="text-gold-500 font-semibold">KES {eligibilityData.requested.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(eligibilityData.match, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Eligible Amount</span>
              <span className="text-emerald-500 font-semibold">KES {eligibilityData.eligible.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gold-500/20">
              <span className="text-gray-400">Eligibility Score</span>
              <span className="text-gold-500 font-semibold">{eligibilityData.match}% match</span>
            </div>
          </div>

          {!hasConfirmedEligibility && (
            <button
              onClick={handleConfirmEligibility}
              className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Confirm – I Accept KES {eligibilityData.eligible.toLocaleString()}
            </button>
          )}
        </div>
      )}

      {hasConfirmedEligibility && eligibilityData && (
        <div className="bg-gray-900 border border-gold-500/30 rounded-lg p-4 space-y-3 animate-fadeIn">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Principal (Eligible Amount)</span>
            <span className="text-gold-500 font-semibold">KES {eligibilityData.eligible.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Annual Interest Rate</span>
            <span className="text-gold-500 font-semibold">{eligibilityData.annualRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Monthly Rate</span>
            <span className="text-gold-500 font-semibold">{eligibilityData.monthlyRate.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Loan Duration</span>
            <span className="text-gold-500 font-semibold">{Math.floor(loanDuration / 12)} Year{Math.floor(loanDuration / 12) !== 1 ? 's' : ''} {loanDuration % 12} Month{(loanDuration % 12) !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Compound Factor</span>
            <span className="text-gold-500 font-semibold">{eligibilityData.compoundFactor.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gold-500/20">
            <span className="text-gray-400">Interest Amount ({loanDuration} months)</span>
            <span className="text-gold-500 font-semibold">KES {eligibilityData.interestAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gold-500/20 bg-gold-500/10 -mx-4 -mb-3 px-4 py-3 rounded-b-md">
            <span className="text-white font-bold text-lg">Total Amount Repayable</span>
            <span className="text-gold-500 font-bold text-lg">KES {(eligibilityData.eligible + eligibilityData.interestAmount).toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-8">
        <button
          onClick={onPrevious}
          className="flex-1 py-3 px-4 border border-gold-500 text-gold-500 font-semibold rounded-lg hover:bg-gold-500/10 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 py-3 px-4 bg-gold-500 text-black font-semibold rounded-lg hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Continue to Credentials
        </button>
      </div>
    </div>
  );
}
