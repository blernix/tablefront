'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Utensils,
  Calendar,
  Settings,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

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
    name: 'Menus',
    href: '/dashboard/menus?tab=dashboard',
    icon: Utensils,
    allowedRoles: ['admin', 'restaurant'] as const,
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

export default function DashboardSidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Filter navigation based on user role - memoized to prevent recalculation
  const filteredNavigation = useMemo(() => {
    return navigation.filter((item) =>
      user?.role ? item.allowedRoles.includes(user.role as any) : false
    );
  }, [user?.role]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:relative md:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm font-bold text-white">TM</span>
            </div>
            <h1 className="text-lg font-semibold text-slate-900">TableMaster</h1>
          </div>

          {/* Close button - mobile only */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={closeMobileMenu}
            className="md:hidden"
          >
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
                  'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
