'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import Error from 'next/error';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Capture the error with Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Une erreur est survenue
              </h1>
              <p className="text-gray-600 mb-6">
                Désolé, une erreur inattendue s&apos;est produite. L&apos;erreur a été enregistrée et notre équipe en a été informée.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <h2 className="font-medium text-red-800 mb-2">Détails de l&apos;erreur :</h2>
                 <code className="text-sm text-red-600 break-all">
                   {error.toString()}
                 </code>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    Référence : {error.digest}
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={reset}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Réessayer
                </button>
                
                <a
                  href="/"
                  className="inline-block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  Retour à l&apos;accueil
                </a>
                
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Si le problème persiste, contactez-nous à{' '}
                    <a href="mailto:support@tablemaster.fr" className="text-blue-600 hover:underline">
                      support@tablemaster.fr
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}