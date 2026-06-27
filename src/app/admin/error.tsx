'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Une erreur est survenue</h2>
        <p className="text-sm text-gray-500">Impossible de charger cette page.</p>
        <Button onClick={reset} variant="outline">
          Réessayer
        </Button>
      </div>
    </div>
  );
}
