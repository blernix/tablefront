'use client';

import { useEffect } from 'react';

export default function ServiceWorkerUpdater() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Force update check on every page load so PWA users get the latest SW
    // without waiting for the 24h browser cache expiry
    navigator.serviceWorker.getRegistration('/push-sw.js').then(function (reg) {
      if (reg) reg.update();
    });
    navigator.serviceWorker.getRegistration().then(function (reg) {
      if (reg) reg.update();
    });
  }, []);

  return null;
}
