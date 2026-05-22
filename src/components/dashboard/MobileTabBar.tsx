'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, UserCheck, Settings, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const restaurantTabs = [
  { name: 'Accueil', href: '/dashboard', icon: LayoutDashboard, pattern: /^\/dashboard$/ },
  { name: 'Résas', href: '/dashboard/reservations', icon: Calendar, pattern: /^\/dashboard\/reservations/ },
  { name: 'Clients', href: '/dashboard/customers', icon: UserCheck, pattern: /^\/dashboard\/customers/ },
  { name: 'Réglages', href: '/dashboard/settings', icon: Settings, pattern: /^\/dashboard\/settings/ },
];

const serverTabs = [
  { name: 'Accueil', href: '/dashboard', icon: LayoutDashboard, pattern: /^\/dashboard$/ },
  { name: 'Résas', href: '/dashboard/reservations', icon: Calendar, pattern: /^\/dashboard\/reservations/ },
  { name: 'Clients', href: '/dashboard/customers', icon: UserCheck, pattern: /^\/dashboard\/customers/ },
  { name: 'Profil', href: '/dashboard/profil', icon: User, pattern: /^\/dashboard\/profil/ },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isActive = (pattern: RegExp) => pattern.test(pathname);

  if (!user || (user.role !== 'restaurant' && user.role !== 'server')) return null;

  const tabs = user.role === 'server' ? serverTabs : restaurantTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = isActive(tab.pattern);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-1 transition-colors relative',
                active ? 'text-[#0066FF]' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {active && <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-[#0066FF] rounded-full" />}
              <tab.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.5} />
              <span className={cn('text-[10px] font-medium', active ? 'text-[#0066FF]' : 'text-gray-400')}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
