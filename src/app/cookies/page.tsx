'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthNavbar from '@/components/auth/AuthNavbar';
import Footer from '@/components/layout/Footer';

export default function CookiesPage() {
  const [tarteaucitronReady, setTarteaucitronReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleTarteaucitronReady = () => {

      setTarteaucitronReady(true);
    };

    // Vérifier immédiatement si tarteaucitron est déjà prêt
    const checkImmediately = () => {
      if (typeof window === 'undefined' || !window.tarteaucitron) {
        return false;
      }
      
      const t = window.tarteaucitron;
      // Vérifier que l'interface utilisateur est disponible et que les services sont chargés
      const hasUserInterface = t.userInterface;
      const hasJob = t.job && Array.isArray(t.job) && t.job.length > 0;
      const hasServices = t.services && Object.keys(t.services).length > 0;
      
      // Vérifier que userInterface a les méthodes nécessaires
      const hasRequiredMethods = hasUserInterface && 
        typeof t.userInterface.openPanel === 'function' &&
        typeof t.userInterface.respondAll === 'function' &&
        typeof t.userInterface.closePanel === 'function';
      
      if (hasRequiredMethods && (hasJob || hasServices)) {

        setTarteaucitronReady(true);
        return true;
      }
      return false;
    };

    // Écouter l'événement tac.root_available qui est déclenché quand tarteaucitron est complètement initialisé
    window.addEventListener('tac.root_available', handleTarteaucitronReady);
    
    // Vérifier immédiatement
    if (!checkImmediately()) {
      // Fallback: vérifier périodiquement au cas où l'événement n'est pas déclenché
      const interval = setInterval(() => {
        if (checkImmediately()) {
          clearInterval(interval);
        }
      }, 500);
      
      return () => {
        window.removeEventListener('tac.root_available', handleTarteaucitronReady);
        clearInterval(interval);
      };
    }
    
    return () => {
       window.removeEventListener('tac.root_available', handleTarteaucitronReady);
    };
  }, []);

  const isTarteaucitronReady = () => {
    if (typeof window === 'undefined' || !window.tarteaucitron) {
      return false;
    }
    
    const t = window.tarteaucitron;
    // Vérifier que l'interface utilisateur est disponible et que les services sont chargés
    const hasUserInterface = t.userInterface;
    const hasJob = t.job && Array.isArray(t.job) && t.job.length > 0;
    const hasServices = t.services && Object.keys(t.services).length > 0;
    
    // Vérifier que userInterface a les méthodes nécessaires
    const hasRequiredMethods = hasUserInterface && 
      typeof t.userInterface.openPanel === 'function' &&
      typeof t.userInterface.respondAll === 'function' &&
      typeof t.userInterface.closePanel === 'function';
    
    // Vérifier également que l'élément DOM racine de tarteaucitron existe
    let hasRootElement = false;
    if (typeof document !== 'undefined') {
      hasRootElement = document.querySelector('.tarteaucitronRoot') !== null;
    }
    
    const isReady = hasRequiredMethods && (hasJob || hasServices);
    
    if (!isReady) {

    } else {

    }
    
    return isReady;
  };

  const openCookieSettings = () => {
    try {
      if (!isTarteaucitronReady()) {
        alert('Le gestionnaire de cookies est en cours de chargement. Veuillez réessayer dans quelques instants.');
        return;
      }
      

      
      // S'assurer que l'interface utilisateur est initialisée
      if (typeof window.tarteaucitron.userInterface.jsSizing === 'function') {
        try {
          window.tarteaucitron.userInterface.jsSizing('main');

        } catch (jsError) {
          console.warn('jsSizing failed, continuing anyway:', jsError);
        }
      }
      
      // Essayer plusieurs fois avec un délai (pour gérer les conditions de course)
      let retryCount = 0;
      const maxRetries = 3;
      
      const tryOpenPanel = () => {
        try {
          window.tarteaucitron.userInterface.openPanel();

        } catch (error) {
          retryCount++;
          if (retryCount < maxRetries) {

            setTimeout(tryOpenPanel, 100 * retryCount); // Backoff exponentiel
          } else {
            console.error('Error opening cookie panel after retries:', error);
            alert('Impossible d\'ouvrir les paramètres de cookies. Veuillez recharger la page et réessayer.');
          }
        }
      };
      
      // Premier essai
      setTimeout(tryOpenPanel, 0);
      
    } catch (error) {
      console.error('Error in openCookieSettings:', error);
      alert('Impossible d\'ouvrir les paramètres de cookies. Veuillez recharger la page et réessayer.');
    }
  };

  const acceptAllCookies = () => {
    try {
      if (!isTarteaucitronReady()) {
        alert('Le gestionnaire de cookies est en cours de chargement. Veuillez réessayer dans quelques instants.');
        return;
      }
      

      
      // S'assurer que l'interface utilisateur est initialisée
      if (typeof window.tarteaucitron.userInterface.jsSizing === 'function') {
        try {
          window.tarteaucitron.userInterface.jsSizing('main');

        } catch (jsError) {
          console.warn('jsSizing failed, continuing anyway:', jsError);
        }
      }
      
      // Essayer plusieurs fois avec un délai (pour gérer les conditions de course)
      let retryCount = 0;
      const maxRetries = 3;
      
      const tryAcceptAll = () => {
        try {
          window.tarteaucitron.userInterface.respondAll(true);
          window.tarteaucitron.userInterface.closePanel();

        } catch (error) {
          retryCount++;
          if (retryCount < maxRetries) {

            setTimeout(tryAcceptAll, 100 * retryCount); // Backoff exponentiel
          } else {
            console.error('Error accepting all cookies after retries:', error);
            alert('Impossible d\'accepter tous les cookies. Veuillez recharger la page et réessayer.');
          }
        }
      };
      
      // Premier essai
      setTimeout(tryAcceptAll, 0);
      
    } catch (error) {
      console.error('Error in acceptAllCookies:', error);
      alert('Impossible d\'accepter tous les cookies. Veuillez recharger la page et réessayer.');
    }
  };

  const refuseAllCookies = () => {
    try {
      if (!isTarteaucitronReady()) {
        alert('Le gestionnaire de cookies est en cours de chargement. Veuillez réessayer dans quelques instants.');
        return;
      }
      

      
      // S'assurer que l'interface utilisateur est initialisée
      if (typeof window.tarteaucitron.userInterface.jsSizing === 'function') {
        try {
          window.tarteaucitron.userInterface.jsSizing('main');

        } catch (jsError) {
          console.warn('jsSizing failed, continuing anyway:', jsError);
        }
      }
      
      // Essayer plusieurs fois avec un délai (pour gérer les conditions de course)
      let retryCount = 0;
      const maxRetries = 3;
      
      const tryRefuseAll = () => {
        try {
          window.tarteaucitron.userInterface.respondAll(false);
          window.tarteaucitron.userInterface.closePanel();

        } catch (error) {
          retryCount++;
          if (retryCount < maxRetries) {

            setTimeout(tryRefuseAll, 100 * retryCount); // Backoff exponentiel
          } else {
            console.error('Error refusing all cookies after retries:', error);
            alert('Impossible de refuser tous les cookies. Veuillez recharger la page et réessayer.');
          }
        }
      };
      
      // Premier essai
      setTimeout(tryRefuseAll, 0);
      
    } catch (error) {
      console.error('Error in refuseAllCookies:', error);
      alert('Impossible de refuser tous les cookies. Veuillez recharger la page et réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AuthNavbar activePage="home" />

      <main className="container mx-auto max-w-4xl px-6 py-16">
        <div className="bg-white border-2 border-[#E5E5E5] p-10">
          <div className="mb-10">
            <h1 className="text-4xl font-light text-[#2A2A2A] mb-4">Gestion des Cookies</h1>
            <p className="text-[#666666] font-light">
              Cette page vous explique comment nous utilisons les cookies et comment vous pouvez les gérer.
            </p>
          </div>

          <div className="space-y-8 font-light text-[#666666] leading-relaxed">
            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">Qu&apos;est-ce qu&apos;un cookie ?</h2>
              <p>
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d&apos;un site.
                Les cookies permettent de collecter des informations relatives à votre navigation et de vous offrir des services adaptés à votre terminal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">Les cookies que nous utilisons</h2>
              
              <div className="mt-6 space-y-6">
                <div className="p-5 bg-[#FAFAFA] border border-[#E5E5E5]">
                  <h3 className="text-xl font-light text-[#2A2A2A] mb-2">Cookies essentiels</h3>
                  <p className="text-sm">
                    Ces cookies sont strictement nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 mt-1.5 bg-[#0066FF] rounded-full flex-shrink-0"></span>
                      <span><strong>token :</strong> Maintient votre session utilisateur sécurisée</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 mt-1.5 bg-[#0066FF] rounded-full flex-shrink-0"></span>
                      <span><strong>auth :</strong> Gère l&apos;authentification et les permissions</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 bg-[#FAFAFA] border border-[#E5E5E5]">
                  <h3 className="text-xl font-light text-[#2A2A2A] mb-2">Cookies de préférences</h3>
                  <p className="text-sm">
                    Ces cookies permettent de mémoriser vos préférences et choix (langue, région, etc.).
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 mt-1.5 bg-[#10B981] rounded-full flex-shrink-0"></span>
                      <span><strong>tarteaucitron :</strong> Enregistre vos préférences de consentement aux cookies</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 bg-[#FAFAFA] border border-[#E5E5E5]">
                  <h3 className="text-xl font-light text-[#2A2A2A] mb-2">Cookies statistiques</h3>
                  <p className="text-sm">
                    Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site en collectant des informations anonymes.
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 mt-1.5 bg-[#F59E0B] rounded-full flex-shrink-0"></span>
                      <span><strong>_ga, _gid :</strong> Analytics (Google Analytics) - non activé actuellement</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 bg-[#FAFAFA] border border-[#E5E5E5]">
                  <h3 className="text-xl font-light text-[#2A2A2A] mb-2">Cookies marketing</h3>
                  <p className="text-sm">
                    Ces cookies sont utilisés pour diffuser des publicités plus pertinentes pour vous.
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 mt-1.5 bg-[#EF4444] rounded-full flex-shrink-0"></span>
                      <span><strong>Publicité ciblée :</strong> Nous n&apos;utilisons pas de cookies marketing actuellement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">Gérer vos préférences</h2>
              <p>
                Vous pouvez à tout moment modifier vos préférences concernant les cookies. Vos choix s&apos;appliqueront uniquement à ce site.
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button
                  onClick={acceptAllCookies}
                  disabled={!tarteaucitronReady}
                  className={`p-4 border-2 font-light transition-colors text-center ${
                    !tarteaucitronReady
                      ? 'border-[#CCCCCC] text-[#CCCCCC] cursor-not-allowed'
                      : 'border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white'
                  }`}
                  title={!tarteaucitronReady ? 'Le gestionnaire de cookies est en cours de chargement' : ''}
                >
                  {!tarteaucitronReady ? 'Chargement...' : 'Tout accepter'}
                </button>
                
                 <button
                  onClick={openCookieSettings}
                  disabled={!tarteaucitronReady}
                  className={`p-4 border-2 font-light transition-colors text-center ${
                    !tarteaucitronReady
                      ? 'border-[#CCCCCC] text-[#CCCCCC] cursor-not-allowed'
                      : 'border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white'
                  }`}
                  title={!tarteaucitronReady ? 'Le gestionnaire de cookies est en cours de chargement' : ''}
                >
                  {!tarteaucitronReady ? 'Chargement...' : 'Personnaliser'}
                </button>
                
                 <button
                  onClick={refuseAllCookies}
                  disabled={!tarteaucitronReady}
                  className={`p-4 border-2 font-light transition-colors text-center ${
                    !tarteaucitronReady
                      ? 'border-[#CCCCCC] text-[#CCCCCC] cursor-not-allowed'
                      : 'border-[#666666] text-[#666666] hover:bg-[#666666] hover:text-white'
                  }`}
                  title={!tarteaucitronReady ? 'Le gestionnaire de cookies est en cours de chargement' : ''}
                >
                  {!tarteaucitronReady ? 'Chargement...' : 'Tout refuser'}
                </button>
              </div>

              <div className="mt-6 p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                <p className="text-sm">
                  <strong>Note :</strong> Le refus des cookies essentiels rendra impossible l&apos;utilisation de certaines fonctionnalités du site,
                  comme la connexion à votre compte ou la gestion des réservations.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">Durée de conservation</h2>
              <p>
                Les cookies sont conservés pour des durées variables en fonction de leur type :
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Cookies de session :</strong> Supprimés à la fermeture du navigateur</li>
                 <li><strong>Cookies persistants :</strong> Conservés jusqu&apos;à leur date d&apos;expiration ou jusqu&apos;à ce que vous les supprimiez</li>
                <li><strong>Cookie de consentement :</strong> Conservé pendant 13 mois</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">Vos droits</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
                vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et d&apos;opposition aux données vous concernant.
              </p>
              <p className="mt-2">
                Pour exercer ces droits ou pour toute question relative à notre utilisation des cookies,
                contactez-nous à :{' '}
                <a href="mailto:privacy@tablemaster.fr" className="text-[#0066FF] hover:underline">privacy@tablemaster.fr</a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
            <Link 
              href="/privacy" 
              className="inline-flex items-center text-[#0066FF] hover:underline font-light"
            >
              ← Politique de confidentialité
            </Link>
          </div>
        </div>
      </main>

      <Footer />    </div>
  );
}