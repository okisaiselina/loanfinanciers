'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Check, AlertCircle, Clock, Smartphone } from 'lucide-react';
import type { LoanFormData } from '@/hooks/use-loan-form';
import { useToast } from '@/hooks/use-toast';

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

type PaymentStatus = 'summary' | 'sending' | 'awaiting' | 'success' | 'failed' | 'timeout';

const PAYMENT_TIMEOUT_MS = 45000; // 45 seconds timeout
const STATUS_CHECK_INTERVAL_MS = 3000; // Check status every 3 seconds

export default function PaymentModal({
  formData,
  loanTypes,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<PaymentStatus>('summary');
  const [requestId, setRequestId] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(PAYMENT_TIMEOUT_MS / 1000);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const statusCheckRef = useRef<NodeJS.Timeout | null>(null);
  const isPaymentActiveRef = useRef(false);

  const selectedLoan = loanTypes.find((lt) => lt.id === formData.loanTypeId);
  // IMPORTANT: Only access fee is charged - not interest amount
  const totalPaymentAmount = formData.accessFee;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (statusCheckRef.current) clearInterval(statusCheckRef.current);
    };
  }, []);

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
        clearAllTimers();
        isPaymentActiveRef.current = false;
        setStatus('timeout');
        setErrorMessage('The payment session has expired. Please try again.');
        toast({
          title: 'Payment Timeout',
          description: 'You did not complete the M-Pesa payment in time. Please try again.',
          variant: 'destructive',
        });
      }
    }, PAYMENT_TIMEOUT_MS);
  };

  const clearAllTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (statusCheckRef.current) {
      clearInterval(statusCheckRef.current);
      statusCheckRef.current = null;
    }
  };

  const checkPaymentStatus = async (invId: string, appId: string) => {
    try {
      const response = await fetch('/api/intasend/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          invoiceId: invId,
          applicationId: appId 
        }),
      });

      const data = await response.json();

      if (data.state === 'COMPLETE') {
        clearAllTimers();
        isPaymentActiveRef.current = false;
        setStatus('success');
        toast({
          title: 'Payment Successful!',
          description: 'Your loan application has been submitted successfully.',
        });
        return true;
      } else if (data.state === 'FAILED' || data.state === 'CANCELED') {
        clearAllTimers();
        isPaymentActiveRef.current = false;
        setStatus('failed');
        setErrorMessage('Your M-Pesa payment was not completed. Please try again.');
        toast({
          title: 'Payment Failed',
          description: 'The M-Pesa transaction was not completed.',
          variant: 'destructive',
        });
        return true;
      }
      
      return false; // Still pending
    } catch {
      // Don't fail on status check errors, keep polling
      return false;
    }
  };

  const startStatusPolling = (invId: string, appId: string) => {
    statusCheckRef.current = setInterval(async () => {
      const isDone = await checkPaymentStatus(invId, appId);
      if (isDone && statusCheckRef.current) {
        clearInterval(statusCheckRef.current);
        statusCheckRef.current = null;
      }
    }, STATUS_CHECK_INTERVAL_MS);
  };

  const handleConfirmPayment = async () => {
    try {
      setStatus('sending');
      setErrorMessage('');
      
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

      const applicationData = await applicationResponse.json();

      if (!applicationResponse.ok) {
        throw new Error(applicationData.error || 'Failed to create loan application');
      }
      
      if (!applicationData.id) {
        throw new Error('Invalid application response - no ID returned');
      }

      setRequestId(applicationData.id);

      // Step 2: Send M-Pesa STK Push directly
      const stkResponse = await fetch('/api/intasend/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPaymentAmount,
          phoneNumber: formData.phoneNumber,
          applicationId: applicationData.id,
          fullName: formData.fullName,
        }),
      });

      const stkData = await stkResponse.json();

      if (!stkResponse.ok) {
        throw new Error(stkData.error || 'Failed to send M-Pesa payment request');
      }

      // STK push sent successfully
      setInvoiceId(stkData.invoice_id);
      setStatus('awaiting');
      isPaymentActiveRef.current = true;
      
      toast({
        title: 'M-Pesa Request Sent',
        description: 'Check your phone and enter your M-Pesa PIN to complete payment.',
      });

      // Start timeout and status polling
      startPaymentTimeout();
      startStatusPolling(stkData.invoice_id, applicationData.id);

    } catch (err) {
      clearAllTimers();
      isPaymentActiveRef.current = false;
      setStatus('failed');
      const errMsg = err instanceof Error ? err.message : 'Network error occurred';
      setErrorMessage(errMsg);
      
      toast({
        title: 'Payment Failed',
        description: errMsg,
        variant: 'destructive',
      });
    }
  };

  const handleRetry = () => {
    clearAllTimers();
    setStatus('summary');
    setErrorMessage('');
    setTimeRemaining(PAYMENT_TIMEOUT_MS / 1000);
    setRequestId('');
    setInvoiceId('');
    isPaymentActiveRef.current = false;
    
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
            {status === 'sending' && 'Sending Request...'}
            {status === 'awaiting' && 'Enter M-Pesa PIN'}
            {status === 'success' && 'Payment Successful'}
            {status === 'failed' && 'Payment Failed'}
            {status === 'timeout' && 'Payment Timeout'}
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
                  <span className="text-blue-300 font-semibold">Access Fee (Pay Now)</span>
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

              <div className="pt-2 sm:pt-3 border-t border-gold-500/20">
                <div className="bg-green-500/10 border border-green-500/30 rounded p-2 sm:p-3">
                  <p className="text-xs text-green-300 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    An M-Pesa prompt will be sent to <span className="font-semibold">{formData.phoneNumber}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === 'sending' && (
            <div className="space-y-4 sm:space-y-5 text-center py-4 sm:py-6">
              <div className="flex justify-center">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-gold-500 animate-spin" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="font-semibold text-base sm:text-lg text-white">Sending M-Pesa Request</p>
                <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gold-100 leading-relaxed">
                    Sending payment request to <span className="font-semibold">{formData.phoneNumber}</span>...
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === 'awaiting' && (
            <div className="space-y-4 sm:space-y-5 text-center py-4 sm:py-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Smartphone className="w-14 h-14 sm:w-16 sm:h-16 text-green-500" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping" />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="font-semibold text-base sm:text-lg text-white">Check Your Phone</p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-green-100 leading-relaxed">
                    An M-Pesa payment request of <span className="font-bold text-green-400">KES {totalPaymentAmount.toLocaleString()}</span> has been sent to <span className="font-semibold">{formData.phoneNumber}</span>.
                  </p>
                  <p className="text-xs sm:text-sm text-green-200 mt-2 font-semibold">
                    Enter your M-Pesa PIN to complete the payment.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gold-500" />
                  <span className={`font-mono font-semibold ${timeRemaining <= 10 ? 'text-red-400' : 'text-gold-500'}`}>
                    {timeRemaining}s remaining
                  </span>
                </div>
                <p className="text-xs text-gray-500">Payment will timeout if not completed within 45 seconds</p>
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
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    Your loan application has been received successfully and is being processed. You will get a response within 12-72 hours. It may take up to a week in some cases.
                  </p>
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
                  <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
                    {errorMessage || 'Your payment could not be processed. Please try again.'}
                  </p>
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
                  <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
                    The payment session has expired after 45 seconds. You did not enter your M-Pesa PIN in time. Please try again.
                  </p>
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

          {status === 'sending' && (
            <button
              disabled
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm bg-gray-700 text-gray-400 font-semibold rounded-lg cursor-not-allowed"
            >
              Processing...
            </button>
          )}

          {status === 'awaiting' && (
            <button
              disabled
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm bg-green-600 text-white font-semibold rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Waiting for M-Pesa...
            </button>
          )}

          {(status === 'failed' || status === 'timeout') && (
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
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all duration-300"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
