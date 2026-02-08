'use client';
/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function SignupCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Cancel icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
              <XCircle className="h-10 w-10 text-orange-600" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Inscription annulée
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-6">
               Vous avez annulé le processus de paiement. Aucune charge n&apos;a été effectuée.
            </p>

            {/* What happened */}
            <div className="mb-6 text-left bg-orange-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-orange-900 mb-2">
                 Que s&apos;est-il passé ?
              </h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>✓ Votre compte restaurant a été créé</li>
                 <li>✗ Le paiement n&apos;a pas été finalisé</li>
                 <li>✗ Votre abonnement n&apos;est pas actif</li>
              </ul>
            </div>

            {/* What you can do */}
            <div className="mb-6 text-left bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Que pouvez-vous faire ?
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>
                   <strong>Option 1 :</strong> Réessayer l&apos;inscription avec le même compte
                </li>
                <li>
                  <strong>Option 2 :</strong> Créer un nouveau compte avec une autre adresse email
                </li>
                <li>
                  <strong>Option 3 :</strong> Contacter le support si vous rencontrez des difficultés
                </li>
              </ul>
            </div>

            {/* Info note */}
            <div className="mb-6 p-3 bg-gray-100 rounded-md">
              <p className="text-xs text-gray-600">
                <strong>Note :</strong> Votre compte existe mais reste inactif.
                 Vous devrez finaliser le paiement pour pouvoir l&apos;utiliser.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/signup" className="block">
                <Button className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                   Retourner à l&apos;inscription
                </Button>
              </Link>

              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  Se connecter avec un compte existant
                </Button>
              </Link>
            </div>

            {/* Help section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                 Des questions sur le processus d&apos;inscription ?
              </p>
              <a
                href="mailto:support@tablemaster.fr"
                className="text-xs font-medium text-blue-600 hover:text-blue-500"
              >
                Contactez notre support
              </a>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 text-center">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
               Pourquoi l&apos;inscription a-t-elle été annulée ?
            </h3>
            <p className="text-xs text-gray-600">
              Les raisons courantes incluent : fermeture de la fenêtre de paiement,
              problème avec la carte bancaire, ou décision de ne pas continuer.
              Vous pouvez réessayer à tout moment sans frais.
            </p>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Tous les paiements sont sécurisés par Stripe.
            Vos informations bancaires ne sont jamais stockées par TableMaster.
          </p>
        </div>
      </div>
    </div>
  );
}
