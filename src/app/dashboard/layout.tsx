'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useRestaurantStore } from '@/store/restaurantStore';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/Header';

// Skeleton for dashboard loading
function DashboardSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
      {/* Sidebar skeleton */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[#E5E5E5] bg-white md:relative">
        <div className="relative flex h-16 items-center justify-between border-b border-[#E5E5E5] px-6">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-slate-200 rounded" />
            <div className="h-6 w-32 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="flex flex-1 flex-col overflow-hidden w-full md:w-auto">
        {/* Header skeleton */}
        <div className="border-b border-[#E5E5E5] bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-slate-200 rounded" />
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-200 rounded-full" />
              <div className="h-10 w-24 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="h-64 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, initAuth, isInitialized } = useAuthStore();
  const { fetchRestaurant, isLoading: isLoadingRestaurant, restaurant } = useRestaurantStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Only admin users should go to /admin (but don't redirect if already there)
    if (user?.role === 'admin' && !pathname.startsWith('/admin')) {
      router.push('/admin');
    }
  }, [isInitialized, isAuthenticated, user?.role, pathname, router]);

  // Fetch restaurant data when authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated && (user?.role === 'restaurant' || user?.role === 'server')) {
      fetchRestaurant();
    }
  }, [isInitialized, isAuthenticated, user?.role, fetchRestaurant]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Wait for auth initialization
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="text-[#666666]">Chargement...</div>
      </div>
    );
  }

  // Allow restaurant and server roles to access dashboard
  if (!isAuthenticated || (user?.role !== 'restaurant' && user?.role !== 'server')) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="text-[#666666]">Chargement...</div>
      </div>
    );
  }

  // Show skeleton while loading restaurant data
  if (isLoadingRestaurant) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
      <DashboardSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex flex-1 flex-col overflow-hidden w-full md:w-auto">
        <DashboardHeader onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
