'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Check, AlertCircle } from 'lucide-react';
import type { LoanFormData } from '@/hooks/use-loan-form';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface LoanType {
  id: string;
  name: string;
  interest_rate: number;
  access_fee: number;
}

interface PaymentModalProps {
  formData: LoanFormData;
  loanTypes: LoanType[];
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentStatus = 'summary' | 'processing' | 'success' | 'failed';

export default function PaymentModal({
  formData,
  loanTypes,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<PaymentStatus>('summary');
  const [requestId, setRequestId] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const selectedLoan = loanTypes.find((lt) => lt.id === formData.loanTypeId);
  // IMPORTANT: Only access fee is charged via Paystack - not interest amount
  const totalPaymentAmount = formData.accessFee;

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleConfirmPayment = async () => {
    try {
      console.log('%c[PAYSTACK] ===== PAYMENT FLOW STARTED =====', 'color: #00ff00; font-weight: bold; font-size: 14px');
      console.log('%c[PAYSTACK] Form Data:', 'color: #00ffff', {
        loanTypeId: formData.loanTypeId,
        phoneNumber: formData.phoneNumber,
        requestedAmount: formData.requestedAmount,
        accessFee: formData.accessFee,
        interestAmount: formData.interestAmount,
        totalPaymentAmount,
      });

      setStatus('processing');
      setErrorTitle('');
      setErrorMessage('');
      
      // Show initial toast
      toast({
        title: 'Payment Initiated',
        description: 'Opening Paystack payment gateway. You will be redirected to complete your payment.',
      });

      // Step 1: Create loan application
      console.log('%c[PAYSTACK] Step 1: Creating Loan Application', 'color: #ffaa00; font-weight: bold');
      
      const applicationResponse = await fetch('/api/loan-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanTypeId: formData.loanTypeId,
          requestedAmount: formData.requestedAmount,
          eligibleAmount: formData.eligibleAmount,
          nationalId: formData.nationalId,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          employmentType: formData.employmentType,
          interestAmount: formData.interestAmount,
          accessFee: formData.accessFee,
        }),
      });

      const applicationDataJson = await applicationResponse.json();
      console.log('%c[PAYSTACK] Application Response:', 'color: #00ffff', {
        status: applicationResponse.status,
        ok: applicationResponse.ok,
        data: applicationDataJson,
      });

      if (!applicationResponse.ok) {
        const errorMsg = applicationDataJson.error || 'Failed to create loan application';
        console.error('%c[PAYSTACK] ERROR - Application creation failed:', 'color: #ff0000; font-weight: bold', errorMsg);
        throw new Error(errorMsg);
      }

      const applicationData = applicationDataJson;
      
      if (!applicationData.id) {
        console.error('%c[PAYSTACK] ERROR - No application ID returned', 'color: #ff0000; font-weight: bold');
        throw new Error('Invalid application response - no ID returned');
      }

      console.log('%c[PAYSTACK] Application Created Successfully:', 'color: #00ff00', { id: applicationData.id });
      setRequestId(applicationData.id);

      // Step 2: Initialize Paystack payment
      console.log('%c[PAYSTACK] Step 2: Initializing Paystack Payment', 'color: #ffaa00; font-weight: bold');
      console.log('%c[PAYSTACK] ⚠ IMPORTANT: ONLY ACCESS FEE IS CHARGED', 'color: #ff6600; font-weight: bold; font-size: 12px');
      console.log('%c[PAYSTACK] Payment Breakdown:', 'color: #00ffff', {
        accessFeeOnly: formData.accessFee,
        interestNotChargedNow: formData.interestAmount,
        paystackAmount: totalPaymentAmount * 100, // Paystack uses kobo
        note: 'Interest will be deducted from loan disbursement, NOT from payment',
      });

      // Initialize Paystack payment
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPaymentAmount,
          email: `user-${applicationData.id}@loans.app`,
          reference: applicationData.id,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        }),
      });

      const paymentDataJson = await response.json();
      console.log('%c[PAYSTACK] Initialize Response:', 'color: #00ffff', paymentDataJson);

      if (!response.ok) {
        const errorMsg = paymentDataJson.error || 'Failed to initialize payment';
        console.error('%c[PAYSTACK] ERROR - Initialization Failed:', 'color: #ff0000; font-weight: bold', errorMsg);
        throw new Error(errorMsg);
      }

      const { authorization_url } = paymentDataJson;
      if (!authorization_url) {
        throw new Error('Failed to get payment authorization URL');
      }

      console.log('%c[PAYSTACK] ===== PAYSTACK INITIALIZED SUCCESSFULLY =====', 'color: #00ff00; font-weight: bold; font-size: 14px');
      console.log('%c[PAYSTACK] Reference:', 'color: #00ff00', applicationData.id);

      // Redirect to Paystack payment page
      window.location.href = authorization_url;

    } catch (err) {
      console.error('%c[PAYSTACK] ===== PAYMENT INITIATION FAILED =====', 'color: #ff0000; font-weight: bold; font-size: 14px');
      console.error('%c[PAYSTACK] Error Details:', 'color: #ff0000', err);
      
      setStatus('failed');
      const errMsg = err instanceof Error ? err.message : 'Network error occurred';
      setErrorTitle('Payment failed');
      setErrorMessage('');
      
      toast({
        title: 'Payment Initiation Failed',
        description: errMsg + '. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRetry = () => {
    setStatus('summary');
    setErrorTitle('');
    setErrorMessage('');
    
    toast({
      title: 'Ready to Retry',
      description: 'Please review the details and try the payment again.',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn pt-20 sm:pt-0">
      <div className="bg-gray-900 border border-gold-500/30 rounded-lg sm:rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 flex items-center justify-between p-4 sm:p-6 border-b border-gold-500/30">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {status === 'summary' && 'Confirm Payment'}
            {status === 'processing' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful'}
            {status === 'failed' && 'Payment Failed'}
          </h2>
          {status === 'summary' && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {status === 'summary' && (
            <>
              <div className="space-y-2 sm:space-y-3 bg-gray-800 rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-gray-400">Loan Type</div>
                <div className="font-semibold text-sm sm:text-base text-white">{selectedLoan?.name}</div>

                <div className="pt-2 sm:pt-3 border-t border-gold-500/20">
                  <div className="flex justify-between text-xs sm:text-sm mb-2 sm:mb-4">
                    <span className="text-gray-400">Eligible Amount</span>
                    <span className="text-gold-500 font-semibold">KES {(formData.eligibleAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm mb-2 sm:mb-4">
                    <span className="text-gray-400">Interest ({selectedLoan?.interest_rate}%)</span>
                    <span className="text-gold-500 font-semibold">KES {(formData.interestAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm mb-2 sm:mb-4 bg-blue-500/10 border border-blue-500/30 rounded p-2">
                    <span className="text-blue-300 font-semibold">Access Fee (Payment Now)</span>
                    <span className="text-blue-400 font-bold">KES {(formData.accessFee || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold pt-2 sm:pt-3 border-t border-gold-500/20">
                    <span className="text-white">Total Amount Repayable</span>
                    <span className="text-gold-500">KES {(formData.eligibleAmount + formData.interestAmount || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-3 border-t border-gold-500/20 text-xs sm:text-sm text-gray-400">
                  <div className="mb-1 sm:mb-2">
                    <span className="font-semibold text-white">Phone:</span> {formData.phoneNumber}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Name:</span> {formData.fullName}
                  </div>
                </div>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div className="space-y-4 sm:space-y-5 text-center py-4 sm:py-6">
              <div className="flex justify-center">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-gold-500 animate-spin" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="font-semibold text-base sm:text-lg text-white">Opening Paystack</p>
                <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gold-100 leading-relaxed">You will be redirected to Paystack to complete your payment securely.</p>
                </div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4 sm:space-y-5 text-center py-4 sm:py-8">
              <div className="flex justify-center">
                <Check className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="font-bold text-base sm:text-xl text-white">Application Submitted Successfully</p>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 sm:p-5">
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">Your loan application has been received successfully and is being processed. You will get a response within 12-72 hours. It may take up to a week in some cases.</p>
                </div>
                <p className="text-xs text-gray-500 break-all">Ref: {requestId}</p>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="space-y-4 sm:space-y-5 text-center py-4 sm:py-8">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="font-bold text-base sm:text-xl text-white">Payment Failed</p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 sm:p-5">
                  <p className="text-xs sm:text-sm text-red-100 leading-relaxed">{errorTitle || 'Your payment could not be processed. Please try again.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 bg-gray-800 border-t border-gold-500/30">
          {status === 'summary' && (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm border border-gold-500 text-gold-500 font-semibold rounded-lg hover:bg-gold-500/10 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm bg-gold-500 text-black font-semibold rounded-lg hover:bg-gold-600 transition-all duration-300"
              >
                Proceed to Pay
              </button>
            </>
          )}

          {status === 'failed' && (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm border border-gold-500 text-gold-500 font-semibold rounded-lg hover:bg-gold-500/10 transition-all duration-300"
              >
                Close
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm bg-gold-500 text-black font-semibold rounded-lg hover:bg-gold-600 transition-all duration-300"
              >
                Retry
              </button>
            </>
          )}

          {status === 'success' && (
            <button
              onClick={onSuccess}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm bg-gold-500 text-black font-semibold rounded-lg hover:bg-gold-600 transition-all duration-300"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
