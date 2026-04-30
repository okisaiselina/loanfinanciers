'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronDown } from 'lucide-react';

export default function CookiePolicyPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <main className="min-h-screen bg-black text-white pt-20 pb-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gold-500">Cookie Policy</h1>
        <p className="text-gray-400">How LoanFinanciers Uses Cookies and Similar Technologies</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Introduction */}
        <section className="space-y-4 animate-slideUp">
          <p className="text-gray-300 leading-relaxed">
            LoanFinanciers uses cookies and similar tracking technologies to enhance your experience on our website. This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use.
          </p>
        </section>

        {/* What Are Cookies */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => toggleSection('what')}
            className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 p-4 rounded-lg transition-colors"
          >
            <h2 className="text-xl font-bold text-gold-500">What Are Cookies?</h2>
            <ChevronDown className={`w-5 h-5 text-gold-500 transition-transform ${expandedSections['what'] ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections['what'] && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3">
              <p className="text-gray-300 leading-relaxed">
                Cookies are small files that are stored on your device when you visit a website. They are widely used by website operators to make their websites work more efficiently and to provide analytics information. There are two main types of cookies: session cookies, which are temporary and deleted when you close your browser, and persistent cookies, which remain on your device for a longer period.
              </p>
            </div>
          )}
        </section>

        {/* Types of Cookies We Use */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => toggleSection('types')}
            className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 p-4 rounded-lg transition-colors"
          >
            <h2 className="text-xl font-bold text-gold-500">Types of Cookies We Use</h2>
            <ChevronDown className={`w-5 h-5 text-gold-500 transition-transform ${expandedSections['types'] ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections['types'] && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-4">
              <div>
                <h3 className="text-gold-500 font-semibold mb-2">Essential Cookies</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. Without these cookies, basic website functions may not work.
                </p>
              </div>
              <div>
                <h3 className="text-gold-500 font-semibold mb-2">Analytics Cookies</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We use analytics cookies to understand how visitors use our website. These cookies help us analyze traffic patterns, identify popular content, and improve site performance. Information collected is aggregated and anonymous.
                </p>
              </div>
              <div>
                <h3 className="text-gold-500 font-semibold mb-2">Performance Cookies</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Performance cookies help us deliver a better user experience by measuring how our website is performing. They help us identify errors and optimize loading times and page responsiveness.
                </p>
              </div>
              <div>
                <h3 className="text-gold-500 font-semibold mb-2">Functionality Cookies</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  These cookies remember your preferences and choices to provide a personalized experience. They may store language preferences, location information, or other settings you have chosen.
                </p>
              </div>
              <div>
                <h3 className="text-gold-500 font-semibold mb-2">Marketing Cookies</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Marketing cookies are used to track your visits and interactions for targeted advertising purposes. They help us deliver relevant content and offers based on your interests and browsing behavior.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Third-Party Cookies */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => toggleSection('thirdparty')}
            className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 p-4 rounded-lg transition-colors"
          >
            <h2 className="text-xl font-bold text-gold-500">Third-Party Cookies</h2>
            <ChevronDown className={`w-5 h-5 text-gold-500 transition-transform ${expandedSections['thirdparty'] ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections['thirdparty'] && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3">
              <p className="text-gray-300 text-sm leading-relaxed">
                Third-party cookies are set by domains other than the one you are visiting. These may include analytics providers, advertising partners, and social media platforms. We use Google Analytics, social media pixels, and other third-party services that may set their own cookies.
              </p>
            </div>
          )}
        </section>

        {/* How We Use Cookies */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => toggleSection('how')}
            className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 p-4 rounded-lg transition-colors"
          >
            <h2 className="text-xl font-bold text-gold-500">How We Use Cookies</h2>
            <ChevronDown className={`w-5 h-5 text-gold-500 transition-transform ${expandedSections['how'] ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections['how'] && (
            <div className="bg-gray-900 p-4 rounded-lg">
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex gap-2"><span className="text-gold-500">•</span> To maintain your session and keep you logged in</li>
                <li className="flex gap-2"><span className="text-gold-500">•</span> To remember your preferences and settings</li>
                <li className="flex gap-2"><span className="text-gold-500">•</span> To analyze site traffic and user behavior</li>
                <li className="flex gap-2"><span className="text-gold-500">•</span> To improve website performance and security</li>
                <li className="flex gap-2"><span className="text-gold-500">•</span> To deliver personalized content and recommendations</li>
                <li className="flex gap-2"><span className="text-gold-500">•</span> To detect and prevent fraud</li>
                <li className="flex gap-2"><span className="text-gold-500">•</span> To serve targeted advertisements</li>
              </ul>
            </div>
          )}
        </section>

        {/* Your Cookie Choices */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={() => toggleSection('choices')}
            className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 p-4 rounded-lg transition-colors"
          >
            <h2 className="text-xl font-bold text-gold-500">Your Cookie Choices</h2>
            <ChevronDown className={`w-5 h-5 text-gold-500 transition-transform ${expandedSections['choices'] ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections['choices'] && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3">
              <p className="text-gray-300 text-sm leading-relaxed">
                Most web browsers allow you to control cookies through their settings. You can choose to:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm ml-4">
                <li>• Accept all cookies</li>
                <li>• Accept only essential cookies</li>
                <li>• Block specific types of cookies</li>
                <li>• Delete cookies after each session</li>
              </ul>
              <p className="text-gray-300 text-sm leading-relaxed mt-3">
                Please note that disabling certain cookies may affect the functionality and user experience of our website. Some features may not work properly without cookies.
              </p>
            </div>
          )}
        </section>

        {/* Data Retention */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => toggleSection('retention')}
            className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 p-4 rounded-lg transition-colors"
          >
            <h2 className="text-xl font-bold text-gold-500">Cookie Retention</h2>
            <ChevronDown className={`w-5 h-5 text-gold-500 transition-transform ${expandedSections['retention'] ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections['retention'] && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3">
              <p className="text-gray-300 text-sm leading-relaxed">
                The retention period for cookies varies depending on their type and purpose. Session cookies are automatically deleted when you close your browser. Persistent cookies may remain for several months or years. Analytics cookies are typically retained for up to 26 months.
              </p>
            </div>
          )}
        </section>

        {/* Contact Information */}
        <section className="space-y-4 animate-slideUp" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-xl font-bold text-gold-500">Contact Us</h2>
          <div className="bg-gray-900 p-6 rounded-lg space-y-3">
            <p className="text-gray-300">
              If you have questions about our use of cookies, please contact us at:
            </p>
            <p className="text-gray-300">
              <span className="text-gold-500 font-semibold">Email:</span> privacy@loanfinanciers.com
              <br />
              <span className="text-gold-500 font-semibold">Address:</span> Nairobi, Kenya
              <br />
              <span className="text-gold-500 font-semibold">Phone:</span> +254 700 123 456
            </p>
          </div>
        </section>

        {/* Last Updated */}
        <div className="border-t border-gold-500/30 pt-8 mt-12">
          <p className="text-sm text-gray-500">
            Last Updated: April 2026
            <br />
            This Cookie Policy is subject to change at any time without notice.
          </p>
        </div>
      </div>
    </main>
  );
}
