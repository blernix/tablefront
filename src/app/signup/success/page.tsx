'use client';
/* eslint-disable react/no-unescaped-entities */
export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

function SignupSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Auto-redirect to login after 10 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Success icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Paiement réussi !
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              Votre compte TableMaster a été créé avec succès et votre abonnement est maintenant actif.
            </p>

            {/* Session ID (for debugging) */}
            {sessionId && (
              <div className="mb-6 p-3 bg-gray-100 rounded-md">
                <p className="text-xs text-gray-500">Session ID</p>
                <p className="text-xs font-mono text-gray-700 break-all">
                  {sessionId}
                </p>
              </div>
            )}

            {/* What's next */}
            <div className="mb-6 text-left bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Prochaines étapes :
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Votre compte a été créé</li>
                <li>✓ Votre abonnement est actif</li>
                <li>→ Connectez-vous pour accéder à votre dashboard</li>
                <li>→ Configurez vos horaires d&apos;ouverture</li>
                <li>→ Récupérez votre widget de réservation</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/login" className="block">
                <Button className="w-full">
                  Se connecter maintenant
                </Button>
              </Link>

              <p className="text-sm text-gray-500">
                Redirection automatique dans {countdown} seconde{countdown > 1 ? 's' : ''}...
              </p>
            </div>

            {/* Email confirmation info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Un email de confirmation a été envoyé à votre adresse.
                Si vous ne le recevez pas, vérifiez vos spams.
              </p>
            </div>
          </div>
        </div>

        {/* Help section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
             Besoin d&apos;aide ?{' '}
            <a href="mailto:support@tablemaster.fr" className="font-medium text-blue-600 hover:text-blue-500">
              Contactez le support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>}>
      <SignupSuccessContent />
    </Suspense>
  );
}
