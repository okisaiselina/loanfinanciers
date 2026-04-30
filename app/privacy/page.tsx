'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Privacy Policy</h1>
          <p className="text-lg text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-300 animate-slideUp">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
            <p>
              LoanFinanciers ("we," "us," "our," or "Company") respects the privacy of our users ("user" or "you"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Personal Data:</strong> Name, email address, phone number, national ID, employment information</li>
              <li><strong>Financial Information:</strong> Bank account details, income information, credit history</li>
              <li><strong>Technical Data:</strong> IP address, browser type, pages visited, time and date stamps</li>
              <li><strong>Device Information:</strong> Device type, operating system, device identifiers</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Process your loan application and verify your eligibility</li>
              <li>Manage your account and process payments</li>
              <li>Email you regarding your account or order</li>
              <li>Fulfill and send out orders, and send related information</li>
              <li>Generate a personal profile about you to make future visits to the Site more personalized</li>
              <li>Increase our Site's functionality and user-friendliness</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Disclosure of Your Information</h2>
            <p>
              We may share information we have collected about you in certain situations:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>By Law or to Protect Rights:</strong> If required by law or if we believe in good faith that disclosure is necessary</li>
              <li><strong>Third-Party Service Providers:</strong> We may share your information with vendors, consultants, and service providers who assist us</li>
              <li><strong>Credit Reference Bureaus:</strong> For loan verification and credit scoring purposes</li>
              <li><strong>Payment Processors:</strong> To process loan payments and transactions</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to protect your personal information. However, perfect security does not exist online. We encourage you to use caution when sharing personal information online.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Contact Us if You Have Privacy Questions</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-900/50 border border-gold-500/30 rounded-lg p-4 space-y-2">
              <p><strong>Email:</strong> privacy@loanfinanciers.com</p>
              <p><strong>Phone:</strong> +254 700 123 456</p>
              <p><strong>Address:</strong> Nairobi, Kenya</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Changes to This Privacy Policy</h2>
            <p>
              We reserve the right to modify this Privacy Policy at any time. If we make material changes to how we treat your personal information, we will notify you by email or by posting the new Privacy Policy on this Site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. The length of time we keep your information will depend on the nature of the information and our legal obligations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">9. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Lodge a complaint with data protection authorities</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">10. Cookies and Tracking Technologies</h2>
            <p>
              Our Site may use cookies and similar tracking technologies to enhance your experience. These technologies help us understand how you use our Site and allow us to improve functionality. You can control cookies through your browser settings.
            </p>
          </section>

          <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-6 my-8">
            <p className="text-sm text-gray-300">
              By using LoanFinanciers, you consent to our Privacy Policy. We take your privacy seriously and are committed to protecting your personal information.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
