'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="w-full bg-black text-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-600 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Terms & Conditions</h1>
          <p className="text-lg text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-300 animate-slideUp">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the LoanFinanciers website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Loan Application</h2>
            <p>
              All loan applications must be completed accurately and truthfully. Applicants must be at least 18 years old and a citizen of Kenya. LoanFinanciers reserves the right to verify all information provided and reject any application that contains false or misleading information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Eligibility Requirements</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Must be 18 years or older</li>
              <li>Must have a valid national ID</li>
              <li>Must have an active mobile phone number</li>
              <li>Must have a valid employment status</li>
              <li>Must comply with all eligibility criteria set by LoanFinanciers</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Loan Disbursement</h2>
            <p>
              Upon approval, loan proceeds will be disbursed to the bank account or mobile money account provided by the borrower within 12 hours. LoanFinanciers is not responsible for delays caused by banking systems, network failures, or other third-party service providers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Interest Rates and Fees</h2>
            <p>
              Interest rates, processing fees, and access fees are clearly stated at the time of application and in the loan agreement. The interest rate is calculated on the approved loan amount and varies depending on the loan type. All fees must be paid in full before loan disbursement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Repayment Terms</h2>
            <p>
              Borrowers agree to repay the loan in full, including interest and any applicable fees, according to the repayment schedule provided. Failure to make timely payments may result in penalties, additional charges, and legal action.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Default and Consequences</h2>
            <p>
              If a borrower defaults on their loan, LoanFinanciers reserves the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Charge late payment fees as specified in the loan agreement</li>
              <li>Report the default to credit reference bureaus</li>
              <li>Take legal action to recover the outstanding amount</li>
              <li>Engage debt collection agencies</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">8. Data Protection</h2>
            <p>
              LoanFinanciers commits to protecting your personal information in accordance with the Data Protection Act. Your information will be used solely for loan processing, verification, and as required by law. We will never share your information with third parties without your consent, except where required by law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">9. Limitation of Liability</h2>
            <p>
              LoanFinanciers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our services, including but not limited to loss of profits, data, or business opportunities.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">10. Modification of Terms</h2>
            <p>
              LoanFinanciers reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting to the website. Continued use of the service following changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">11. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the Republic of Kenya, and you irrevocably submit to the exclusive jurisdiction of the courts located in Kenya.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">12. Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <div className="bg-gray-900/50 border border-gold-500/30 rounded-lg p-4 space-y-2">
              <p><strong>Email:</strong> support@loanfinanciers.com</p>
              <p><strong>Phone:</strong> +254 700 123 456</p>
              <p><strong>Address:</strong> Nairobi, Kenya</p>
            </div>
          </section>

          <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-6 my-8">
            <p className="text-sm text-gray-300">
              By clicking "Accept" during the loan application process, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
