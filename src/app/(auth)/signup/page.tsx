'use client';

import Link from 'next/link';
import SignupWizard from '@/components/auth/SignupWizard';
import { useState } from 'react';
import AuthNavbar from '@/components/auth/AuthNavbar';
import Footer from '@/components/layout/Footer';

export default function SignupPage() {
  const [error, setError] = useState('');

  return (
    <>
      <AuthNavbar activePage="signup" />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24 md:pt-12 pb-24 md:pb-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl px-4 sm:px-0">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-[#2A2A2A] mb-4">Rejoignez TableMaster</h1>
            <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
              Simplifiez la gestion de vos réservations en quelques minutes seulement.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
            <div className="text-center">
              <div className="text-3xl font-light text-[#0066FF]">100+</div>
              <div className="text-sm text-[#666666]">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#0066FF]">99%</div>
              <div className="text-sm text-[#666666]">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#0066FF]">0€</div>
              <div className="text-sm text-[#666666]">Frais d&apos;installation</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5EA] p-4 sm:p-8">
            <SignupWizard onError={setError} />
          </div>

          <div className="mt-10 text-center">
            <p className="text-[#666666]">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" data-umami-event="signup-goto-login-click" className="font-medium text-[#0066FF] hover:text-[#0052CC] transition-colors">Connectez-vous ici</Link>
            </p>
            <p className="text-xs text-[#999999] mt-4">
              En créant un compte, vous acceptez nos{' '}
              <a href="/cgv" target="_blank" rel="noopener noreferrer" data-umami-event="signup-cgv-click" className="text-[#0066FF] hover:underline">CGV</a>, nos{' '}
              <a href="/legal" target="_blank" rel="noopener noreferrer" data-umami-event="signup-cgu-click" className="text-[#0066FF] hover:underline">CGU</a> et notre{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" data-umami-event="signup-privacy-click" className="text-[#0066FF] hover:underline">politique de confidentialité</a>.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-[#666666]">
            <div className="flex items-center"><span className="mr-2">✅</span><span>Paiement 100% sécurisé</span></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
