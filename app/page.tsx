'use client';

import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LoanApplicationForm from '@/components/LoanApplicationForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="w-full bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-16">
        <HeroSection />
      </section>
      <section id="loan-form" className="relative min-h-screen flex items-center py-12 sm:py-16 lg:py-24 mt-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className="space-y-8 sm:space-y-12 animate-slideUp">
            {/* Section Header */}
            <div className="space-y-3 sm:space-y-4 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight">
                Start Your Loan <span className="text-gold-500">Application</span>
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-xl mx-auto">
                Complete our simple 4-step process and get access to the funds you need in as little as 12 hours.
              </p>
            </div>

            {/* Form */}
            <div className="bg-gray-900 border border-gold-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8">
              <LoanApplicationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
