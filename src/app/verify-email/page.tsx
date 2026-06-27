'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthNavbar from '@/components/auth/AuthNavbar';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Lien de vérification invalide.');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/verify-email/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error?.message || 'Erreur de vérification.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Impossible de vérifier votre email. Veuillez réessayer.');
      });
  }, [token]);

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 pt-24 md:pt-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-8 space-y-4">
            {status === 'loading' && (
              <>
                <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto animate-pulse">
                  <svg className="h-7 w-7 text-blue-400 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="text-[15px] text-[#666666]">Vérification de votre email...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
                  <svg className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Email vérifié !</h2>
                <p className="text-[15px] text-[#666666] leading-relaxed">{message}</p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-[#0066FF] text-white text-[15px] font-semibold hover:bg-[#0055DD] transition-colors"
                >
                  Se connecter
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
                  <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Échec de la vérification</h2>
                <p className="text-[15px] text-[#666666] leading-relaxed">{message}</p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-[#0066FF] text-white text-[15px] font-semibold hover:bg-[#0055DD] transition-colors"
                >
                  Retour à la connexion
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
