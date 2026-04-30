import { useState, useCallback } from 'react';

export interface LoanFormData {
  loanTypeId: string;
  requestedAmount: number;
  eligibleAmount: number;
  loanDuration: number; // in months
  nationalId: string;
  fullName: string;
  phoneNumber: string;
  employmentType: string;
  interestAmount: number;
  accessFee: number;
  totalRepayable: number;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}

const initialFormData: LoanFormData = {
  loanTypeId: '',
  requestedAmount: 0,
  eligibleAmount: 0,
  loanDuration: 12, // default 12 months
  nationalId: '',
  fullName: '',
  phoneNumber: '',
  employmentType: '',
  interestAmount: 0,
  accessFee: 0,
  totalRepayable: 0,
  acceptedTerms: false,
  acceptedPrivacy: false,
};

export function useLoanForm() {
  const [formData, setFormData] = useState<LoanFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = useCallback((updates: Partial<LoanFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
  }, []);

  return {
    formData,
    currentStep,
    updateFormData,
    goToStep,
    nextStep,
    previousStep,
    reset,
  };
}
