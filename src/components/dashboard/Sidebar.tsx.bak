'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Utensils, Calendar, Settings, X, Users, CalendarX, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useRestaurantStore, useRestaurantPlan } from '@/store/restaurantStore';
import { useCanAccessMenus, useFeatureAccess } from '@/features';

const navigation = [
  {
    name: 'Tableau de bord',
    href: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin', 'restaurant', 'server'] as const,
  },
  {
    name: 'Réservations',
    href: '/dashboard/reservations',
    icon: Calendar,
    allowedRoles: ['admin', 'restaurant', 'server'] as const,
  },
  {
    name: 'Gestion des serveurs',
    href: '/dashboard/settings/servers',
    icon: Users,
    allowedRoles: ['admin', 'restaurant'] as const,
  },
  {
    name: 'Fermetures exceptionnelles',
    href: '/dashboard/settings/closures',
    icon: CalendarX,
    allowedRoles: ['admin', 'restaurant'] as const,
  },
  {
    name: 'Menus',
    href: '/dashboard/menus?tab=dashboard',
    icon: Utensils,
    allowedRoles: ['admin', 'restaurant'] as const,
  },
  {
    name: 'Contact',
    href: '/dashboard/contact',
    icon: MessageSquare,
    allowedRoles: ['restaurant', 'server'] as const,
  },
  {
    name: 'Paramètres',
    href: '/dashboard/settings',
    icon: Settings,
    allowedRoles: ['admin', 'restaurant'] as const,
  },
];

interface DashboardSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

// Skeleton component for loading state
function SidebarSkeleton() {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[#E5E5E5] bg-white md:relative">
      {/* Header skeleton */}
      <div className="relative flex h-16 items-center justify-between border-b border-[#E5E5E5] px-6">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-slate-200 rounded" />
          <div className="h-6 w-32 bg-slate-200 rounded" />
        </div>
      </div>
      
      {/* Navigation skeleton */}
      <nav className="flex-1 space-y-1 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
        ))}
      </nav>
      
      {/* Footer skeleton */}
      <div className="border-t border-[#E5E5E5] p-4">
        <div className="flex items-center gap-3 border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-2">
          <div className="h-8 w-8 bg-slate-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="h-2 w-16 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardSidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { restaurant, isLoading } = useRestaurantStore();
  const { isSelfService } = useRestaurantPlan();
  const menuAccess = useFeatureAccess('menus');
  const canAccessMenus = menuAccess.hasAccess;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Filter navigation based on user role and feature access
  const filteredNavigation = useMemo(() => {
    let filtered = navigation.filter((item) =>
      user?.role ? item.allowedRoles.includes(user.role as any) : false
    );

    // Keep "Menus" for all users (marketing approach)
    // We'll show it with a Pro badge if user doesn't have access
    return filtered;
  }, [user?.role]);

  // Show skeleton while loading
  if (isLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0A0A0A]/50 md:hidden animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#E5E5E5] bg-white transition-transform duration-300 md:relative md:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="relative flex h-16 items-center justify-between border-b border-[#E5E5E5] px-6">
          {/* Accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#0066FF]" />

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center border border-[#E5E5E5] bg-[#0066FF]">
              <span className="text-sm font-bold text-white">TM</span>
            </div>
            <h1 className="text-lg font-light text-[#2A2A2A]">TableMaster</h1>
          </div>

          {/* Close button - mobile only */}
          <Button variant="ghost" size="icon-sm" onClick={closeMobileMenu} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {filteredNavigation.map((item) => {
            // Extract base path without query params
            const baseHref = item.href.split('?')[0];
            const isActive = pathname === baseHref || pathname.startsWith(baseHref + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  'group flex items-center gap-3 border px-3 py-2.5 text-sm font-light transition-colors',
                  isActive
                    ? 'border-[#0066FF] bg-[#FAFAFA] text-[#0066FF]'
                    : 'border-transparent text-[#666666] hover:bg-[#FAFAFA] hover:text-[#2A2A2A]'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-[#0066FF]' : 'text-[#666666] group-hover:text-[#2A2A2A]'
                  )}
                />
                <div className="flex items-center justify-between flex-1">
                  <span>{item.name}</span>
                  {item.name === 'Menus' && !canAccessMenus && (
                    <Badge variant="outline" className="ml-2 text-xs border-[#0066FF] text-[#0066FF]">
                      {menuAccess.reason === 'account-type' ? 'Managed' : 'Pro'}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#E5E5E5] p-4">
          <div className="flex items-center gap-3 border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center border border-[#0066FF] bg-[#0066FF] text-sm font-semibold text-white">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2A2A2A] truncate">{user?.email}</p>
              <p className="text-xs text-[#666666] uppercase tracking-[0.1em]">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
