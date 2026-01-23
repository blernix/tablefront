'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, user, initAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  }, [isInitialized, isAuthenticated, user, router]);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return <div className="min-h-screen flex items-center justify-center">Redirection...</div>;
}