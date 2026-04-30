'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/95 border-b border-gold-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="text-xl sm:text-2xl font-bold">
            <span className="text-gold-500">Loan</span>
            <span className="text-white">Financiers</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link href="/" className="text-sm lg:text-base text-gray-300 hover:text-gold-500 transition-colors">Home</Link>
          <Link href="/about" className="text-sm lg:text-base text-gray-300 hover:text-gold-500 transition-colors">About</Link>
          <Link href="/" className="text-sm lg:text-base text-gray-300 hover:text-gold-500 transition-colors">Contact</Link>
          <button
            onClick={() => handleNavClick('loan-form')}
            className="px-4 lg:px-6 py-2 bg-gold-500 text-black font-semibold text-sm lg:text-base rounded-lg hover:bg-gold-600 transition-all duration-300"
          >
            Apply Now
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 hover:bg-gray-900 rounded-lg transition-colors z-10 text-white"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-black/98 border-t border-gold-500/20 animate-slideUp">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-300 hover:text-gold-500 hover:bg-gray-900/50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-300 hover:text-gold-500 hover:bg-gray-900/50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-gray-300 hover:text-gold-500 hover:bg-gray-900/50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <button
              onClick={() => handleNavClick('loan-form')}
              className="w-full px-4 py-3 mt-2 bg-gold-500 text-black font-semibold rounded-lg hover:bg-gold-600 transition-all duration-300"
            >
              Apply Now
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
