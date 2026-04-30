'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Users, TrendingUp, Award } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: 'Customer-Centric',
      description: 'We put our customers first in every decision we make.',
    },
    {
      icon: TrendingUp,
      title: 'Transparency',
      description: 'Clear terms, no hidden fees, and straightforward processes.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every interaction.',
    },
    {
      icon: CheckCircle,
      title: 'Reliability',
      description: 'You can count on us to be there when you need us.',
    },
  ];

  const achievements = [
    { number: '50K+', label: 'Happy Customers' },
    { number: 'KES 2B+', label: 'Disbursed Loans' },
    { number: '98%', label: 'Approval Rate' },
    { number: '12hrs', label: 'Average Disbursement' },
  ];

  return (
    <main className="w-full bg-black text-white min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="relative min-h-96 flex items-center py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-600 transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="space-y-6 animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
              About <span className="text-gold-500">LoanFinanciers</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Empowering Kenyans with fast, transparent, and accessible financial solutions since 2020.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full space-y-20">
        {/* Our Story */}
        <section className="space-y-8 animate-slideUp">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Our Story</h2>
            <div className="w-12 h-1 bg-gold-500"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-gray-300">
              <p>
                LoanFinanciers was founded with a simple mission: to make financial services accessible to every Kenyan. We recognized that traditional lending institutions often fail those who need help the most, creating barriers through complex processes and unrealistic requirements.
              </p>
              <p>
                In 2020, we launched LoanFinanciers with a vision to democratize lending. Today, we&apos;ve grown to serve over 50,000 satisfied customers, disbursing billions in loans across Kenya.
              </p>
              <p>
                We believe that everyone deserves access to fair, transparent, and affordable lending services. Our innovative technology platform combines speed with safety, ensuring that qualified borrowers get the funds they need in as little as 12 hours.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gold-500/10 to-gold-500/5 border border-gold-500/30 rounded-lg p-8 space-y-4">
              <h3 className="text-2xl font-bold text-gold-500">Quick Facts</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <span>Licensed and regulated by the Central Bank of Kenya</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <span>Member of Kenya Bankers Association</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <span>ISO 27001 Certified for information security</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <span>Customer data protected under PDPA 2019</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Our Achievements</h2>
            <div className="w-12 h-1 bg-gold-500"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gold-500/30 rounded-lg p-6 text-center hover:border-gold-500 transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-gold-500 mb-2">
                  {achievement.number}
                </div>
                <div className="text-sm md:text-base text-gray-400">{achievement.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Our Core Values</h2>
            <div className="w-12 h-1 bg-gold-500"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-900/50 border border-gold-500/20 rounded-lg p-6 hover:border-gold-500/50 transition-all duration-300 space-y-3 animate-slideUp"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <Icon className="w-8 h-8 text-gold-500" />
                  <h3 className="text-xl font-semibold text-white">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Why Choose LoanFinanciers?</h2>
            <div className="w-12 h-1 bg-gold-500"></div>
          </div>
          <div className="space-y-4 text-gray-300">
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Lightning-Fast Processing</h3>
                <p>Get approved and funded within 12 hours, not days or weeks.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Transparent Pricing</h3>
                <p>No hidden fees. Know exactly what you&apos;re paying before you apply.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Multiple Loan Types</h3>
                <p>From emergency loans to business loans, we have options for everyone.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Secure & Protected</h3>
                <p>Your data is encrypted and protected by industry-leading security standards.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">24/7 Customer Support</h3>
                <p>Our support team is always ready to help you with any questions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-gold-500/10 to-gold-500/5 border border-gold-500/30 rounded-lg p-8 md:p-12 text-center space-y-6 animate-slideUp">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found financial freedom with LoanFinanciers.
          </p>
          <Link href="/#loan-form">
            <button className="px-8 py-3 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-600 transition-all duration-300 inline-block">
              Apply Now
            </button>
          </Link>
        </section>
      </div>

      <Footer />
    </main>
  );
}
