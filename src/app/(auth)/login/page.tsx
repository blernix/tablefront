'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TwoFactorVerificationModal from '@/components/modals/TwoFactorVerificationModal';
import { TwoFactorRequiredError } from '@/lib/api/auth';
import { AuthResponse } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, error, clearError, isLoading, initAuth, isInitialized } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<{
    tempToken: string;
    userId: string;
    email: string;
  } | null>(null);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    // Wait for auth initialization before checking authentication
    if (!isInitialized || hasRedirectedRef.current) return;

    // Redirect if already authenticated (only on initial mount, not after login)
    if (isAuthenticated && user) {
      console.log('[Login] Already authenticated, redirecting...', user);
      const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
      hasRedirectedRef.current = true;
      router.push(redirectPath);
    }
  }, [isInitialized, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    hasRedirectedRef.current = true; // Prevent useEffect from redirecting while we handle login

    if (!email || !password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    console.log('[Login] Attempting login...');

    try {
      await login(email, password);

      // Get updated state after login
      const currentUser = useAuthStore.getState().user;
      const currentToken = useAuthStore.getState().token;

      console.log('[Login] Login successful:', { user: currentUser, hasToken: !!currentToken });

      if (currentUser && currentToken) {
        // Store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('token', currentToken);

        // Store token in cookie for middleware
        const cookieString = `token=${currentToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // 7 days
        document.cookie = cookieString;
        console.log('[Login] Cookie set:', cookieString);
        console.log('[Login] Document cookie after set:', document.cookie);

        console.log('[Login] Stored credentials, redirecting...');

        // Redirect based on role
        const redirectPath = currentUser.role === 'admin' ? '/admin' : '/dashboard';
        console.log('[Login] Redirect path:', redirectPath);

        // Mark that we're redirecting to prevent useEffect from also redirecting
        hasRedirectedRef.current = true;

        // Navigate to the appropriate page
        router.push(redirectPath);
      } else {
        console.error('[Login] No user or token after login');
        setLocalError('Erreur lors de la connexion. Veuillez réessayer.');
      }
    } catch (err) {
      console.error('[Login] Login failed:', err);

      // Check if it's a 2FA required error
      if (err instanceof TwoFactorRequiredError) {
        console.log('[Login] 2FA required, showing verification modal');
        setTwoFactorData({
          tempToken: err.tempToken,
          userId: err.userId,
          email: err.email,
        });
        setShowTwoFactorModal(true);
        clearError();
        return;
      }

      // For other errors, show the error message
      if (!error) {
        setLocalError('Erreur lors de la connexion. Vérifiez vos identifiants.');
      }
    }
  };

  const handleTwoFactorSuccess = (response: AuthResponse) => {
    console.log('[Login] 2FA verification successful:', { user: response.user, tokenPreview: response.token?.substring(0, 20) + '...' });

    // Update auth store with the response
    useAuthStore.getState().setUser(response.user, response.token);

    // Store user in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);

    // Store token in cookie for middleware
    const cookieString = `token=${response.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // 7 days
    document.cookie = cookieString;
    console.log('[Login] Cookie set after 2FA verification');

    // Redirect based on role
    const redirectPath = response.user.role === 'admin' ? '/admin' : '/dashboard';
    console.log('[Login] Redirect path after 2FA:', redirectPath);

    // Close modal and navigate
    setShowTwoFactorModal(false);
    router.push(redirectPath);
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#0066FF]" />
            <span className="text-2xl font-light text-[#2A2A2A]">TableMaster</span>
          </div>
          <h1 className="text-4xl font-light text-[#2A2A2A] mb-3">Connexion</h1>
          <p className="text-[#666666] font-light">Accédez à votre espace d&apos;administration</p>
        </div>

        {/* Form */}
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
              className="w-full px-6 py-3 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-[#666666] hover:text-[#0066FF] font-light transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[#666666] hover:text-[#0066FF] font-light transition-colors">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>

      {twoFactorData && (
        <TwoFactorVerificationModal
          isOpen={showTwoFactorModal}
          onClose={() => {
            setShowTwoFactorModal(false);
            setTwoFactorData(null);
          }}
          onSuccess={handleTwoFactorSuccess}
          tempToken={twoFactorData.tempToken}
          userId={twoFactorData.userId}
          email={twoFactorData.email}
        />
      )}
    </div>
  );
}
