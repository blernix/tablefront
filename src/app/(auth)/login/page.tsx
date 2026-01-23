'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 animate-fade-in">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Background elements removed for minimalist design */}
       </div>

      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-elevated border border-decorative animate-scale-in">
        {/* Left decorative panel */}
         <div className="hidden lg:flex lg:w-2/5 bg-gray-900 p-12 flex-col justify-between relative overflow-hidden">

          <div className="relative z-10">
            <h1 className="text-5xl font-heading font-bold text-white mb-6">TableMaster</h1>
             <p className="text-gray-300 text-xl font-light mb-8">
              L&apos;art de gérer votre restaurant, sublimé.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
                <span className="text-white/90">Réservations élégantes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
                <span className="text-white/90">Menus raffinés</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
                <span className="text-white/90">Analyses précises</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-12">
            <div className="w-24 h-1 bg-gray-300 mb-4"></div>
            <p className="text-white/70 text-sm">
              Plateforme d&apos;administration pour restaurants — gestion des réservations, menus et paramètres
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="lg:w-3/5 bg-white/95 backdrop-blur-sm p-8 md:p-12 flex flex-col justify-center">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-4xl font-heading font-bold text-gradient mb-2">TableMaster</h1>
            <p className="text-muted-foreground">Connectez-vous à votre compte</p>
          </div>
          
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-heading font-bold text-navy mb-2">Connexion</h2>
              <p className="text-muted-foreground">Accédez à votre espace d&apos;administration</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-navy/80 mb-2 block">
                    Email
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                      required
                      className="pl-10 py-6 border-2 border-gray-300/50 focus:border-gray-600 focus:ring-2 focus:ring-gray-600/20 transition-all duration-300 rounded-xl bg-white/50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-navy/80 mb-2 block">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="current-password"
                      required
                      className="pl-10 py-6 border-2 border-gray-300/50 focus:border-gray-600 focus:ring-2 focus:ring-gray-600/20 transition-all duration-300 rounded-xl bg-white/50"
                    />
                  </div>
                </div>
              </div>

              {displayError && (
                <div className="rounded-xl bg-destructive/10 p-4 border border-destructive/20 text-destructive animate-slide-up">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {displayError}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800/80 hover:from-gray-700 hover:to-gray-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Se connecter
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/forgot-password"
                className="text-gray-600 hover:text-gray-600/80 font-medium hover:underline transition-colors inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                </svg>
                Mot de passe oublié ?
              </Link>
            </div>


           </div>
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
