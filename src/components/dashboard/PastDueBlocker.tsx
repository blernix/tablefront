'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';

interface PastDueBlockerProps {
  children: React.ReactNode;
  subscriptionStatus?: string;
}

export default function PastDueBlocker({ children, subscriptionStatus }: PastDueBlockerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (subscriptionStatus !== 'past_due') {
    return <>{children}</>;
  }

  const handlePayment = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { url } = await apiClient.billing.createPortalSession();
      window.location.href = url;
    } catch {
      setError('Impossible d\'ouvrir le portail de paiement. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Blurred overlay */}
      <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
              Paiement requis
            </h2>
            <p className="text-[15px] text-[#666666] leading-relaxed mb-2">
              Votre période d&apos;essai est terminée et votre moyen de paiement n&apos;a pas pu être débité.
            </p>
            <p className="text-[15px] text-[#666666] leading-relaxed mb-8">
              Ajoutez une carte bancaire pour continuer à utiliser TableMaster sans interruption.
            </p>

            {error && (
              <p className="text-[13px] text-red-600 mb-4">{error}</p>
            )}

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[#0066FF] text-white text-[15px] font-semibold hover:bg-[#0055DD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Redirection vers Stripe...
                </span>
              ) : (
                'Ajouter un moyen de paiement'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dimmed content behind */}
      <div className="pointer-events-none select-none opacity-20">
        {children}
      </div>
    </>
  );
}
