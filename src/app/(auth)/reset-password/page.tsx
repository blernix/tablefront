import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Réinitialiser le mot de passe - TableMaster',
  description: 'Définissez un nouveau mot de passe pour votre compte TableMaster.',
  robots: 'noindex, nofollow',
};

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthNavbar from '@/components/auth/AuthNavbar';
import Footer from '@/components/layout/Footer';
import { track } from '@/lib/umami';

// Force dynamic rendering because this page uses search params
export const dynamic = 'force-dynamic';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const isSubmitting = useRef(false);

  useEffect(() => {
    if (!token && !success) {
      track('reset-password-invalid-token');
      setTokenError('Token manquant ou invalide. Veuillez utiliser le lien reçu par email.');
    }
  }, [token, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSubmitting.current) return;
    isSubmitting.current = true;

    if (!token) {
      setError('Token manquant');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.resetPassword(token, newPassword);
      track('reset-password-success');
      setSuccess(true);
      // Clear token from URL for security
      window.history.replaceState(null, '', '/reset-password');
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      track('reset-password-error');
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Réinitialiser le mot de passe
        </CardTitle>
        <CardDescription className="text-center">
          {success ? 'Mot de passe mis à jour' : tokenError ? 'Token invalide' : 'Entrez votre nouveau mot de passe'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
              <p className="font-medium">Mot de passe réinitialisé!</p>
              <p className="mt-1">Votre mot de passe a été mis à jour avec succès.</p>
              <p className="mt-2">
                Vous allez être redirigé vers la page de connexion dans 3 secondes...
              </p>
            </div>
            <Button className="w-full" onClick={() => router.push('/login')} data-umami-event="reset-password-success-login-click">
              Se connecter
            </Button>
          </div>
        ) : tokenError ? (
          <div className="space-y-4">
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              <p className="font-medium">{tokenError}</p>
              <p className="mt-2">
                Si vous avez cliqué sur un lien expiré, vous pouvez demander un nouveau lien depuis
                la page{' '}
                <Link href="/forgot-password" className="underline">
                  Mot de passe oublié
                </Link>
                .
              </p>
            </div>
            <Button className="w-full" onClick={() => router.push('/forgot-password')} data-umami-event="reset-password-new-link-click">
              Demander un nouveau lien
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="reset-password-form">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
              <p className="text-xs text-muted-foreground">Minimum 6 caractères</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading} data-umami-event="reset-password-submit">
              {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/login" data-umami-event="reset-password-back-login-click" className="text-primary hover:text-primary/80 hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <AuthNavbar />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 pt-24 md:pt-6">
        <Suspense
          fallback={
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  Réinitialiser le mot de passe
                </CardTitle>
                <CardDescription className="text-center">Chargement...</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Vérification du token...</p>
              </CardContent>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
