'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { shouldShowCookieConsent } from '@/utils/pageDetection';

declare global {
  interface Window {
    tarteaucitron: any;
  }
}

export default function TarteaucitronProvider() {
  const pathname = usePathname();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [tarteaucitronReady, setTarteaucitronReady] = useState(false);

  // Determine if cookie consent should be shown on this page
  const showConsent = shouldShowCookieConsent(pathname || '');

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Tarteaucitron] Pathname:', pathname, 'Show consent:', showConsent);
  }

  useEffect(() => {
    // Don't initialize on reservation pages
    if (!showConsent) return;

    // Initialize tarteaucitron after script loads
    if (scriptLoaded && typeof window !== 'undefined' && window.tarteaucitron) {
      // Check if already initialized
      if (window.tarteaucitron.job) {
        setTarteaucitronReady(true);
        return;
      }

      // Listen for when tarteaucitron root is available
      const handleRootAvailable = () => {
        // tarteaucitron UI ready
      };
      window.addEventListener('tac.root_available', handleRootAvailable);

      // Listen for when banner opens
      const handleOpenAlert = () => {
        // banner opened
      };
      window.addEventListener('tac.open_alert', handleOpenAlert);

      // Listen for when banner closes
      const handleCloseAlert = () => {
        // banner closed
      };
      window.addEventListener('tac.close_alert', handleCloseAlert);

      // Define custom services BEFORE initialization
      // Session service (mandatory, no consent needed)
      window.tarteaucitron.services.session = {
        key: 'session',
        type: 'other',
        name: 'Session & Authentification',
        uri: '',
        needConsent: false, // Mandatory, no consent required
        cookies: ['token', 'auth', 'session', 'next-auth.session-token'],
        js: function () {
          'use strict';
          // Nothing to load, session cookies are handled by the server
        },
        fallback: function () {
          'use strict';
          // No fallback needed for mandatory service
        },
      };

      // Widget service (mandatory, no consent needed)
      window.tarteaucitron.services.widget = {
        key: 'widget',
        type: 'other',
        name: 'Widget de Réservation',
        uri: '',
        needConsent: false, // Mandatory, no consent required
        cookies: ['tablemaster_widget', 'reservation_session'],
        js: function () {
          'use strict';
          // Widget is loaded by the embed script, nothing to do here
        },
        fallback: function () {
          'use strict';
          // No fallback needed for mandatory service
        },
      };

      // Analytics placeholder service (optional, requires consent)
      // This ensures the banner appears since there's at least one service that needs consent
      window.tarteaucitron.services.analytics = {
        key: 'analytics',
        type: 'analytic',
        name: 'Analytics (Placeholder)',
        uri: '',
        needConsent: true, // Optional, requires consent
        cookies: ['_ga', '_gid', '_gat'],
        js: function () {
          'use strict';
          // We don't actually load analytics, this is just a placeholder for GDPR compliance
        },
        fallback: function () {
          'use strict';
        },
      };

      // Define job array - this tells tarteaucitron which services to manage
      // Without this, the banner won't show because job.length === 0
      window.tarteaucitron.job = ['session', 'widget', 'analytics'];

      window.tarteaucitron.init({
        privacyUrl: '/privacy',
        language: 'fr',
        orientation: 'bottom', // popup, middle, bottom, top
        hashtag: '#tarteaucitron',

        // Banner styling for Swiss clean design
        bodyPosition: 'bottom',
        closeStyle: 'icon',
        showIcon: false, // No cookie icon after banner closes
        iconPosition: 'BottomRight',
        closePopup: false,

        // Colors matching TableMaster design system
        backgroundColor: '#FAFAFA', // Background color
        textColor: '#2A2A2A', // Text color
        buttonBackgroundColor: '#0066FF', // Primary button color
        buttonTextColor: '#FFFFFF', // Button text color
        linkColor: '#0066FF', // Link color

        // Button styling
        buttonRadius: '2px', // Slightly rounded corners
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        fontWeight: '300',

        // Behavior
        highPrivacy: true,
        mandatory: true,
        cookieslist: true,
        adblocker: false,
        showAlertSmall: false, // Show full banner, not small icon
        showDetailsOnClick: true,
        AcceptAllCta: true,
        DenyAllCta: true,
        handleBrowserDNTRequest: false,
        useExternalCss: false,
        useExternalJs: false,
        serviceDefaultState: 'wait',
        groupServices: false,
        mandatoryCta: true,

        // Remove credit link
        removeCredit: true,

        // Custom translations
        moreInfoLink: true,
        mandatoryText:
          'Les cookies nécessaires sont essentiels au fonctionnement du site et ne peuvent pas être désactivés.',

        // No services in init, they are already defined
        services: {},

        // Callbacks
        onAccept: function () {
          setTarteaucitronReady(true);
        },
        onDecline: function () {
          setTarteaucitronReady(true);
        },
      });

      // Set ready after a short delay to ensure UI is initialized
      setTimeout(() => {
        if (window.tarteaucitron.userInterface) {
          setTarteaucitronReady(true);
        } else {
          console.warn('Tarteaucitron userInterface not available after initialization');
        }
      }, 500);

      // Cleanup function
      return () => {
        window.removeEventListener('tac.root_available', handleRootAvailable);
        window.removeEventListener('tac.open_alert', handleOpenAlert);
        window.removeEventListener('tac.close_alert', handleCloseAlert);
      };
    } else if (scriptLoaded && typeof window !== 'undefined' && !window.tarteaucitron) {
      console.error('Tarteaucitron script loaded but window.tarteaucitron is undefined');
    }
  }, [scriptLoaded, showConsent]);

  // Expose tarteaucitron ready state globally for other components
  useEffect(() => {
    // Don't expose on reservation pages
    if (!showConsent) return;

    if (typeof window !== 'undefined') {
      (window as any).tarteaucitronReady = tarteaucitronReady;
      (window as any).tarteaucitronDebug = {
        ready: tarteaucitronReady,
        scriptLoaded,
        job: window.tarteaucitron?.job,
        services: window.tarteaucitron?.services ? Object.keys(window.tarteaucitron.services) : [],
        config: window.tarteaucitron?.parameters,
      };
    }
  }, [tarteaucitronReady, scriptLoaded, showConsent]);

  // Don't load tarteaucitron script on reservation pages
  if (!showConsent) {
    return null;
  }

  return (
    <>
      {/* Load tarteaucitron JS */}
      <Script
        src="/tarteaucitron/tarteaucitron.js"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptLoaded(true);
        }}
      />
    </>
  );
}
