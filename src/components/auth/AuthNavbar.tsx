'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

interface AuthNavbarProps {
  activePage?: 'login' | 'signup' | 'home';
}

export default function AuthNavbar({ activePage = 'home' }: AuthNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isMenuOpen &&
        !target.closest('#auth-navbar-menu') &&
        !target.closest('#auth-navbar-toggle')
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMenuOpen]);

  const navigation = [
    { name: 'Fonctionnalités', href: '/#features', eventName: 'nav-features-click' },
    { name: 'Tarifs', href: '/#pricing', eventName: 'nav-pricing-click' },
    { name: 'Site sur mesure', href: '/site-sur-mesure', eventName: 'nav-custom-site-click' },
    { name: 'Connexion', href: '/login', eventName: 'nav-login-click' },
    { name: "S'inscrire", href: '/signup', eventName: 'nav-signup-click' },
  ];

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E5E5]">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-4" data-umami-event="header-logo-click">
                <Image
                  src="/logo_512.png"
                  alt="TableMaster Logo"
                  width={68}
                  height={68}
                  className="w-14 h-14 object-contain"
                />
                <span className="text-xl font-light text-[#2A2A2A]">TableMaster</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  data-umami-event={item.eventName}
                  className={`text-[#666666] hover:text-[#0066FF] font-light transition-colors ${
                    (item.name === 'Connexion' && activePage === 'login') ||
                    (item.name === "S'inscrire" && activePage === 'signup')
                      ? 'text-[#0066FF] font-normal'
                      : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              id="auth-navbar-toggle"
              type="button"
              className="md:hidden p-2 text-[#666666] hover:text-[#0066FF] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
              data-umami-event="mobile-menu-toggle"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>

        {/* Mobile menu overlay with side animation */}
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-out ${
            isMenuOpen
              ? 'opacity-100 pointer-events-auto bg-black/30'
              : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
          data-umami-event="mobile-menu-backdrop-close"
        />

        {/* Mobile menu sidebar - slides from right */}
        <div
          id="auth-navbar-menu"
          className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white border-l border-[#E5E5E5] z-50 md:hidden transition-transform duration-300 ease-out ${
            isMenuOpen
              ? 'translate-x-0 opacity-100 pointer-events-auto'
              : 'translate-x-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <Image
                  src="/logo_512.png"
                  alt="TableMaster Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-xl font-light text-[#2A2A2A]">TableMaster</span>
              </div>
              <button
                type="button"
                className="p-2 text-[#666666] hover:text-[#0066FF] transition-colors"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    data-umami-event={item.eventName}
                    className={`block text-lg font-light py-3 transition-colors ${
                      (item.name === 'Connexion' && activePage === 'login') ||
                      (item.name === "S'inscrire" && activePage === 'signup')
                        ? 'text-[#0066FF] font-normal'
                        : 'text-[#666666] hover:text-[#0066FF]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#E5E5E5]">
              <p className="text-sm text-[#666666] font-light">
                Simplifiez la gestion de votre restaurant
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}
