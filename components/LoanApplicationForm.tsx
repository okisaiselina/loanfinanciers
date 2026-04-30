'use client';

import React, { useState, useEffect } from 'react';
import { useLoanForm, type LoanFormData } from '@/hooks/use-loan-form';
import LoanTypeStep from './steps/LoanTypeStep';
import LoanAmountStep from './steps/LoanAmountStep';
import CredentialsStep from './steps/CredentialsStep';
import TermsStep from './steps/TermsStep';
import PaymentModal from './PaymentModal';

interface LoanType {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  access_fee: number;
}

interface EmploymentType {
  id: string;
  name: string;
}

export default function LoanApplicationForm() {
  const {
    formData,
    currentStep,
    updateFormData,
    nextStep,
    previousStep,
    reset,
  } = useLoanForm();

  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<EmploymentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, employmentRes] = await Promise.all([
          fetch('/api/loan-types'),
          fetch('/api/employment-types'),
        ]);

        if (typesRes.ok) {
          const types = await typesRes.json();
          setLoanTypes(Array.isArray(types) ? types : []);
        }

        if (employmentRes.ok) {
          const employment = await employmentRes.json();
          setEmploymentTypes(Array.isArray(employment) ? employment : []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePaymentClick = () => {
    if (formData.acceptedTerms && formData.acceptedPrivacy) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    reset();
    // Show success message and reload
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 gap-1 sm:gap-2 overflow-x-auto px-1">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <button
              onClick={() => step <= currentStep}
              className={`min-w-10 sm:w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 text-xs sm:text-sm flex-shrink-0 ${
                currentStep >= step
                  ? 'bg-gold-500 text-black'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {step}
            </button>
            {step < 4 && (
              <div
                className={`flex-1 h-1 mx-0.5 sm:mx-2 min-w-4 sm:min-w-8 transition-all duration-300 ${
                  currentStep > step ? 'bg-gold-500' : 'bg-gray-700'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="animate-fadeIn">
        {currentStep === 1 && (
          <LoanTypeStep
            loanTypes={loanTypes}
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <LoanAmountStep
            loanTypes={loanTypes}
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        )}
        {currentStep === 3 && (
          <CredentialsStep
            employmentTypes={employmentTypes}
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        )}
        {currentStep === 4 && (
          <TermsStep
            formData={formData}
            onUpdate={updateFormData}
            onPrevious={previousStep}
            onPaymentClick={handlePaymentClick}
          />
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          formData={formData}
          loanTypes={loanTypes}
          onClose={handlePaymentClose}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
