'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { BarChart3, Store, PlusCircle, UserCircle } from 'lucide-react';

const tabs = [
  { name: 'Dashboard', href: '/commercial', icon: BarChart3, pattern: /^\/commercial$/ },
  { name: 'Restos', href: '/commercial/restaurants', icon: Store, pattern: /^\/commercial\/restaurants/ },
  { name: 'Nouveau', href: '/commercial/restaurants/new', icon: PlusCircle, pattern: /^\/commercial\/restaurants\/new$/ },
  { name: 'Profil', href: '/commercial/profil', icon: UserCircle, pattern: /^\/commercial\/profil/ },
];

export default function CommercialMobileTabBar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isActive = (pattern: RegExp) => pattern.test(pathname);

  if (!user || user.role !== 'commercial') return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E5EA]"
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
                active ? 'text-[#0066FF]' : 'text-[#8E8E93] active:text-[#0066FF]'
              )}
            >
              {active && <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-[#0066FF] rounded-full" />}
              <tab.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.5} />
              <span className={cn('text-[10px] font-medium', active ? 'text-[#0066FF]' : 'text-[#8E8E93]')}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
