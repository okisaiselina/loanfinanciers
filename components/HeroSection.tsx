'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Paycode } from '@/components/paycode-config';

export default function HeroSection() {
  const stats = [
    { value: '12hr', label: 'Average Disbursement' },
    { value: '98%', label: 'Approval Rate' },
    { value: '50K+', label: 'Happy Borrowers' },
    { value: '0%', label: 'Hidden Fees' },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cash%20person-N1OZGbVaX9Rcp1MAhHTNJGkEQuurZN.jpg)',
          filter: 'brightness(0.4)',
        }}
      ></div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/*<Paycode />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeIn">
            {/* Badge */}
            <div className="flex items-center gap-2 w-fit">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gold-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-gold-500 uppercase tracking-wider">
                  Trusted & Fast Approvals
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                Jitoe kwa Mawe <span className="text-gold-500">With Our Fast Loans</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl">
                Get the funds you need — quickly, securely, and on your terms. Apply in minutes.
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <button
                onClick={() => document.getElementById('loan-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-600 transition-all duration-300 shadow-lg hover:shadow-gold-500/50 inline-block"
              >
                Start Your Loan Application
              </button>
            </div>
          </div>

          {/* Right Side - Stats */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-slideIn" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-6 hover:border-gold-500 transition-all duration-300 hover:bg-gold-500/20"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-gold-500 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="lg:hidden grid grid-cols-2 gap-2 sm:gap-3 mt-8 sm:mt-12 animate-slideIn">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-3 sm:p-4 text-center"
            >
              <div className="text-xl sm:text-2xl font-bold text-gold-500">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-400">Scroll to Apply</span>
          <div className="w-6 h-10 border border-gold-500 rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-gold-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
