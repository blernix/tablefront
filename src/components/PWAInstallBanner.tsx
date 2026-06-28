'use client';

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const stored = localStorage.getItem('pwa_banner_dismissed');
    if (stored) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      setDeferredPrompt(null);
    } else {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa_banner_dismissed', '1');
  };

  if (!showBanner || dismissed) return null;

  return (
    <div className="fixed bottom-16 left-3 right-3 z-40 md:hidden animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#1A1A1A] text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">Installer TableMaster</p>
          <p className="text-xs text-white/60 leading-tight mt-0.5">
            Accédez à vos réservations en un clic
          </p>
        </div>
        <button
          onClick={handleInstall}
          className="flex-shrink-0 px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-xl active:bg-[#0052CC] transition-colors"
        >
          Installer
        </button>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-2 text-white/40 active:text-white/70 transition-colors"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
