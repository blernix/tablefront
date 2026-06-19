'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/umami';

export function useSectionView(id: string, eventName: string, threshold = 0.3) {
  var firedRef = useRef(false);

  useEffect(function () {
    if (firedRef.current) return;

    var el = document.getElementById(id);
    if (!el) return;

    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting && !firedRef.current) {
          firedRef.current = true;
          track(eventName);
          observer.disconnect();
        }
      },
      { threshold: threshold }
    );

    observer.observe(el);
    return function () {
      observer.disconnect();
    };
  }, [id, eventName, threshold]);

  return null;
}
