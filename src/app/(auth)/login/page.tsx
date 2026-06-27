'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TwoFactorVerificationModal from '@/components/modals/TwoFactorVerificationModal';
import { AuthResponse } from '@/types';
import AuthNavbar from '@/components/auth/AuthNavbar';
import Footer from '@/components/layout/Footer';
import { track } from '@/lib/umami';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, error, clearError, isLoading, initAuth, isInitialized, twoFactorLoginData, clearTwoFactorData } =
    useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [notVerifiedEmail, setNotVerifiedEmail] = useState('');
  const [resending, setResending] = useState(false);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isInitialized || hasRedirectedRef.current) return;
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : user.role === 'commercial' ? '/commercial' : '/dashboard';
      hasRedirectedRef.current = true;
      router.push(redirectPath);
    }
  }, [isInitialized, isAuthenticated, user, router]);

  useEffect(() => {
    if (twoFactorLoginData) {
      setShowTwoFactorModal(true);
    }
  }, [twoFactorLoginData]);

  const handleResendVerification = async () => {
    setResending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setNotVerifiedEmail('');
        setLocalError('');
        alert('Un nouveau lien de vérification a été envoyé à votre adresse email.');
      }
    } catch {}
    setResending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setNotVerifiedEmail('');
    clearError();
    clearTwoFactorData();
    hasRedirectedRef.current = true;

    if (!email || !password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    await login(email, password);

    const authState = useAuthStore.getState();
    if (authState.error === 'EMAIL_NOT_VERIFIED') {
      setNotVerifiedEmail(email);
      return;
    }

    // Check if 2FA is required (login sets twoFactorLoginData in the store)
    const twoFactorState = authState.twoFactorLoginData;
    if (twoFactorState) {
      track('login-2fa-required');
      return;
    }

    // Normal login success
    const currentUser = useAuthStore.getState().user;
    const currentToken = useAuthStore.getState().token;

    if (currentUser && currentToken) {
      track('login-success', { role: currentUser.role });
      localStorage.setItem('user', JSON.stringify(currentUser));
      localStorage.setItem('token', currentToken);

      const cookieString = `token=${currentToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      document.cookie = cookieString;

      const redirectPath = currentUser.role === 'admin' ? '/admin' : currentUser.role === 'commercial' ? '/commercial' : '/dashboard';
      hasRedirectedRef.current = true;
      router.push(redirectPath);
    } else {
      console.error('[Login] No user or token after login');
      setLocalError('Erreur lors de la connexion. Veuillez réessayer.');
    }
  };

  const handleTwoFactorSuccess = (response: AuthResponse) => {
    useAuthStore.getState().setUser(response.user, response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);

    const cookieString = `token=${response.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = cookieString;

    const redirectPath = response.user.role === 'admin' ? '/admin' : response.user.role === 'commercial' ? '/commercial' : '/dashboard';

    setShowTwoFactorModal(false);
    clearTwoFactorData();
    router.push(redirectPath);
  };

  const displayError = error || localError;

  if (notVerifiedEmail) {
    return (
      <>
        <AuthNavbar activePage="login" />
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 pt-24 md:pt-6">
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-8 space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
                <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">Vérifiez votre email</h2>
              <p className="text-[15px] text-[#666666] leading-relaxed">
                Un email de vérification a été envoyé à <strong>{notVerifiedEmail}</strong>.
                Cliquez sur le lien dans l&apos;email pour activer votre compte.
              </p>
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="text-[15px] text-[#0066FF] font-medium hover:underline disabled:opacity-50"
              >
                {resending ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification'}
              </button>
              <button
                onClick={() => { setNotVerifiedEmail(''); clearError(); }}
                className="block w-full text-[14px] text-[#8E8E93] mt-2 hover:text-[#666666]"
              >
                Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthNavbar activePage="login" />
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 pt-24 md:pt-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-12 md:hidden">
            <div className="inline-flex items-center gap-3 mb-8">
                <Image
                  src="/logo_512.png"
                  alt="TableMaster Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                  unoptimized
                />
              <span className="text-2xl font-light text-[#2A2A2A]">TableMaster</span>
            </div>
            <h1 className="text-4xl font-light text-[#2A2A2A] mb-3">Connexion</h1>
            <p className="text-[#666666] font-light">
              Accédez à votre espace d&apos;administration
            </p>
          </div>

          <div className="text-center mb-12 hidden md:block">
            <h1 className="text-4xl font-light text-[#2A2A2A] mb-3">Connexion</h1>
            <p className="text-[#666666] font-light">
              Accédez à votre espace d&apos;administration
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-light text-[#2A2A2A]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-[#E5E5E5] bg-white text-[#2A2A2A] font-light focus:outline-none focus:border-[#0066FF] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-light text-[#2A2A2A]">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-[#E5E5E5] bg-white text-[#2A2A2A] font-light focus:outline-none focus:border-[#0066FF] transition-colors"
                />
              </div>

              {displayError && (
                <div className="bg-red-50 border border-red-200 p-4 text-red-600 text-sm font-light">
                  {displayError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                data-umami-event="login-submit"
                className="w-full px-6 py-3 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/forgot-password"
                data-umami-event="login-forgot-password-click"
                className="text-sm text-[#666666] hover:text-[#0066FF] font-light transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              data-umami-event="login-back-home-click"
              className="text-sm text-[#666666] hover:text-[#0066FF] font-light transition-colors"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>

      {twoFactorLoginData && (
        <TwoFactorVerificationModal
          isOpen={showTwoFactorModal}
          onClose={() => {
            setShowTwoFactorModal(false);
            clearTwoFactorData();
          }}
          onSuccess={handleTwoFactorSuccess}
          tempToken={twoFactorLoginData.tempToken}
          userId={twoFactorLoginData.userId}
          email={twoFactorLoginData.email}
        />
      )}
      <Footer />
    </>
  );
}
