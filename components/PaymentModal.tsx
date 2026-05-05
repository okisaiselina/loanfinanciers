'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Check, AlertCircle, Clock } from 'lucide-react';
import type { LoanFormData } from '@/hooks/use-loan-form';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    IntaSend: new (config: IntaSendConfig) => IntaSendInstance;
  }
}

interface IntaSendConfig {
  publicAPIKey: string;
  live: boolean;
}

interface IntaSendInstance {
  on: (event: 'COMPLETE' | 'FAILED' | 'IN-PROGRESS', callback: (response?: IntaSendResponse) => void) => IntaSendInstance;
}

interface IntaSendResponse {
  status?: string;
  tracking_id?: string;
  signature?: string;
  checkout_id?: string;
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

type PaymentStatus = 'summary' | 'processing' | 'success' | 'failed' | 'timeout' | 'cancelled';

const PAYMENT_TIMEOUT_MS = 45000; // 45 seconds timeout

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
  const [timeRemaining, setTimeRemaining] = useState(PAYMENT_TIMEOUT_MS / 1000);
  const [intaSendReady, setIntaSendReady] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const isPaymentActiveRef = useRef(false);
  const intaSendInstanceRef = useRef<IntaSendInstance | null>(null);

  const selectedLoan = loanTypes.find((lt) => lt.id === formData.loanTypeId);
  // IMPORTANT: Only access fee is charged via IntaSend - not interest amount
  const totalPaymentAmount = formData.accessFee;

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Load IntaSend script and initialize
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/intasend-inlinejs-sdk@4.0.7/build/intasend-inline.js';
    script.async = true;
    script.onload = () => {
      // Initialize IntaSend after script loads
      const publicKey = process.env.NEXT_PUBLIC_INTASEND_PUBLIC_KEY;
      if (publicKey && window.IntaSend) {
        const instance = new window.IntaSend({
          publicAPIKey: publicKey,
          live: true, // Set to true for live environment
        });
        
        instance
          .on('COMPLETE', (response) => {
            handlePaymentSuccess(response?.tracking_id || requestId);
          })
          .on('FAILED', (response) => {
            handlePaymentFailed(response);
          })
          .on('IN-PROGRESS', () => {
            // Payment is in progress, keep the processing state
          });
        
        intaSendInstanceRef.current = instance;
        setIntaSendReady(true);
      }
    };
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [requestId]);

  const startPaymentTimeout = () => {
    setTimeRemaining(PAYMENT_TIMEOUT_MS / 1000);
    
    // Start countdown timer
    countdownRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set main timeout
    timeoutRef.current = setTimeout(() => {
      if (isPaymentActiveRef.current) {
        isPaymentActiveRef.current = false;
        setStatus('timeout');
        setErrorTitle('Payment Timeout');
        setErrorMessage('The payment session has expired after 45 seconds. Please try again.');
        toast({
          title: 'Payment Timeout',
          description: 'The payment window was open for too long. Please try again.',
          variant: 'destructive',
        });
      }
    }, PAYMENT_TIMEOUT_MS);
  };

  const clearPaymentTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const handlePaymentFailed = (response?: IntaSendResponse) => {
    clearPaymentTimeout();
    if (isPaymentActiveRef.current) {
      isPaymentActiveRef.current = false;
      setStatus('failed');
      setErrorTitle('Payment Failed');
      setErrorMessage(response?.status || 'Your payment could not be processed. Please try again.');
      toast({
        title: 'Payment Failed',
        description: 'Your payment could not be completed. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePaymentSuccess = async (reference: string) => {
    clearPaymentTimeout();
    isPaymentActiveRef.current = false;
    
    try {
      // Confirm payment on backend
      const confirmResponse = await fetch(`/api/loan-applications/${reference}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });

      if (confirmResponse.ok) {
        setStatus('success');
        toast({
          title: 'Payment Successful!',
          description: 'Your loan application has been submitted successfully. You will receive a response within 12-72 hours.',
        });
      } else {
        // Payment was made but confirmation failed - still show success
        setStatus('success');
        toast({
          title: 'Payment Received',
          description: 'Your payment was received. Your application is being processed.',
        });
      }
    } catch {
      // Even if confirmation API fails, payment was successful on IntaSend
      setStatus('success');
      toast({
        title: 'Payment Successful!',
        description: 'Your loan application has been submitted successfully.',
      });
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setStatus('processing');
      setErrorTitle('');
      setErrorMessage('');
      
      // Show initial toast
      toast({
        title: 'Payment Initiated',
        description: 'Opening IntaSend payment gateway. Complete payment within 45 seconds.',
      });

      // Step 1: Create loan application
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

      if (!applicationResponse.ok) {
        const errorMsg = applicationDataJson.error || 'Failed to create loan application';
        throw new Error(errorMsg);
      }

      const applicationData = applicationDataJson;
      
      if (!applicationData.id) {
        throw new Error('Invalid application response - no ID returned');
      }

      setRequestId(applicationData.id);

      // Check if IntaSend is ready
      if (!intaSendReady || !window.IntaSend) {
        throw new Error('Payment service not loaded. Please refresh the page and try again.');
      }

      // Get IntaSend public key
      const publicKey = process.env.NEXT_PUBLIC_INTASEND_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('Payment configuration error. Please contact support.');
      }

      // Start the payment timeout
      isPaymentActiveRef.current = true;
      startPaymentTimeout();

      // The IntaSend button will be triggered by clicking on the hidden button
      // We need to programmatically trigger the payment
      const payButton = document.getElementById('intasend-pay-button');
      if (payButton) {
        // Update button data attributes with current values
        payButton.setAttribute('data-amount', totalPaymentAmount.toString());
        payButton.setAttribute('data-email', `user-${applicationData.id}@loans.app`);
        payButton.setAttribute('data-phone_number', formData.phoneNumber);
        payButton.setAttribute('data-first_name', formData.fullName.split(' ')[0] || '');
        payButton.setAttribute('data-last_name', formData.fullName.split(' ').slice(1).join(' ') || '');
        payButton.setAttribute('data-api_ref', applicationData.id);
        payButton.click();
      } else {
        throw new Error('Payment button not found. Please refresh the page.');
      }

    } catch (err) {
      clearPaymentTimeout();
      isPaymentActiveRef.current = false;
      setStatus('failed');
      const errMsg = err instanceof Error ? err.message : 'Network error occurred';
      setErrorTitle('Payment failed');
      setErrorMessage(errMsg);
      
      toast({
        title: 'Payment Initiation Failed',
        description: errMsg + '. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRetry = () => {
    clearPaymentTimeout();
    setStatus('summary');
    setErrorTitle('');
    setErrorMessage('');
    setTimeRemaining(PAYMENT_TIMEOUT_MS / 1000);
    isPaymentActiveRef.current = false;
    
    toast({
      title: 'Ready to Retry',
      description: 'Please review the details and try the payment again.',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn pt-20 sm:pt-0">
      {/* Hidden IntaSend Payment Button */}
      <button
        id="intasend-pay-button"
        className="intaSendPayButton hidden"
        data-amount={totalPaymentAmount}
        data-currency="KES"
        data-email=""
        data-phone_number=""
        data-first_name=""
        data-last_name=""
        data-api_ref=""
        data-country="KE"
      >
        Pay
      </button>

      <div className="bg-gray-900 border border-gold-500/30 rounded-lg sm:rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 flex items-center justify-between p-4 sm:p-6 border-b border-gold-500/30">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {status === 'summary' && 'Confirm Payment'}
            {status === 'processing' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful'}
            {status === 'failed' && 'Payment Failed'}
            {status === 'timeout' && 'Payment Timeout'}
            {status === 'cancelled' && 'Payment Cancelled'}
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

              {!intaSendReady && (
                <div className="flex items-center gap-2 text-yellow-500 text-xs">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Loading payment gateway...</span>
                </div>
              )}
            </>
          )}

          {status === 'processing' && (
            <div className="space-y-4 sm:space-y-5 text-center py-4 sm:py-6">
              <div className="flex justify-center">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-gold-500 animate-spin" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="font-semibold text-base sm:text-lg text-white">Complete Payment</p>
                <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gold-100 leading-relaxed">Complete your payment in the IntaSend popup window.</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gold-500" />
                  <span className={`font-mono font-semibold ${timeRemaining <= 10 ? 'text-red-400' : 'text-gold-500'}`}>
                    {timeRemaining}s remaining
                  </span>
                </div>
                <p className="text-xs text-gray-500">Payment will timeout after 45 seconds</p>
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
                  <p className="text-xs sm:text-sm text-red-100 leading-relaxed">{errorMessage || errorTitle || 'Your payment could not be processed. Please try again.'}</p>
                </div>
              </div>
            </div>
          )}

          {status === 'timeout' && (
            <div className="space-y-4 sm:space-y-5 text-center py-4 sm:py-8">
              <div className="flex justify-center">
                <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="font-bold text-base sm:text-xl text-white">Payment Timeout</p>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 sm:p-5">
                  <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">The payment session has expired after 45 seconds. Please try again to complete your loan application.</p>
                </div>
              </div>
            </div>
          )}

          {status === 'cancelled' && (
            <div className="space-y-4 sm:space-y-5 text-center py-4 sm:py-8">
              <div className="flex justify-center">
                <X className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="font-bold text-base sm:text-xl text-white">Payment Cancelled</p>
                <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4 sm:p-5">
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">You closed the payment window before completing the transaction. Your loan application was not submitted.</p>
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
                disabled={!intaSendReady}
                className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm bg-gold-500 text-black font-semibold rounded-lg hover:bg-gold-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {intaSendReady ? 'Proceed to Pay' : 'Loading...'}
              </button>
            </>
          )}

          {(status === 'failed' || status === 'timeout' || status === 'cancelled') && (
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
                Try Again
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
