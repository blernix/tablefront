'use client';
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { track } from '@/lib/umami';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SignupCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    restaurantEmail: searchParams.get('restaurantEmail') || '',
    ownerEmail: searchParams.get('ownerEmail') || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResumePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResumeSuccess(false);
    setCheckoutUrl(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/resume-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur lors de la reprise du paiement');
      }

      setResumeSuccess(true);
      setCheckoutUrl(data.checkout.url);
      track('signup-cancel-resume-success');
      toast.success('Session de paiement créée avec succès !');

      // Auto-redirect to Stripe after 2 seconds
      setTimeout(() => {
        if (data.checkout.url) {
          window.location.href = data.checkout.url;
        }
      }, 2000);
    } catch (error) {
      track('signup-cancel-resume-error');
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToStripe = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscription annulée</h2>

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
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Que pouvez-vous faire ?</h3>

              {!showResumeForm ? (
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>
                    <strong>Option 1 :</strong>{' '}
                    <button
                      onClick={() => setShowResumeForm(true)}
                      className="text-blue-700 font-medium underline hover:text-blue-800"
                      data-umami-event="signup-cancel-resume-payment-click"
                    >
                      Reprendre le paiement pour votre compte existant
                    </button>
                  </li>
                  <li>
                    <strong>Option 2 :</strong> Créer un nouveau compte avec une autre adresse email
                  </li>
                  <li>
                    <strong>Option 3 :</strong> Contacter le support si vous rencontrez des
                    difficultés
                  </li>
                </ul>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-3">
                      Reprendre le paiement
                    </h4>
                    <p className="text-xs text-blue-800 mb-3">
                      Entrez les emails utilisés lors de l&apos;inscription pour reprendre le
                      paiement.
                    </p>

                    <form onSubmit={handleResumePayment} className="space-y-3">
                      <div>
                        <Label htmlFor="restaurantEmail" className="text-xs">
                          Email du restaurant
                        </Label>
                        <Input
                          id="restaurantEmail"
                          name="restaurantEmail"
                          type="email"
                          value={formData.restaurantEmail}
                          onChange={handleInputChange}
                          required
                          className="mt-1 text-sm"
                          placeholder="restaurant@exemple.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="ownerEmail" className="text-xs">
                          Email du propriétaire (pour connexion)
                        </Label>
                        <Input
                          id="ownerEmail"
                          name="ownerEmail"
                          type="email"
                          value={formData.ownerEmail}
                          onChange={handleInputChange}
                          required
                          className="mt-1 text-sm"
                          placeholder="vous@exemple.com"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Création...
                            </>
                          ) : (
                            'Reprendre le paiement'
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowResumeForm(false)}
                          disabled={isLoading}
                        >
                          Annuler
                        </Button>
                      </div>
                    </form>
                  </div>

                  {resumeSuccess && checkoutUrl && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-sm font-medium text-green-800">
                          Session de paiement créée !
                        </p>
                      </div>
                      <p className="text-xs text-green-700 mb-3">
                        Redirection vers Stripe dans 2 secondes...
                      </p>
                      <Button
                        onClick={handleRedirectToStripe}
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700"
                        data-umami-event="signup-cancel-goto-stripe-click"
                      >
                        Aller directement vers le paiement
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Info note */}
            <div className="mb-6 p-3 bg-gray-100 rounded-md">
              <p className="text-xs text-gray-600">
                <strong>Note :</strong> Votre compte existe mais reste inactif. Vous devrez
                finaliser le paiement pour pouvoir l&apos;utiliser.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/signup" className="block">
                <Button className="w-full" data-umami-event="signup-cancel-back-signup-click">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retourner à l&apos;inscription
                </Button>
              </Link>

              <Link href="/login" className="block">
                <Button variant="outline" className="w-full" data-umami-event="signup-cancel-login-click">
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
                data-umami-event="signup-cancel-support-click"
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
              Les raisons courantes incluent : fermeture de la fenêtre de paiement, problème avec la
              carte bancaire, ou décision de ne pas continuer. Vous pouvez réessayer à tout moment
              sans frais.
            </p>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Tous les paiements sont sécurisés par Stripe. Vos informations bancaires ne sont jamais
            stockées par TableMaster.
          </p>
        </div>
      </div>
    </div>
  );
}
