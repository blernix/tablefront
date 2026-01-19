'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  UtensilsCrossed,
  FileText,
  QrCode,
  Home,
  ChefHat,
  Upload
} from 'lucide-react';

const tabs = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
    mobileIcon: Home,
    href: '/dashboard/menus?tab=dashboard'
  },
  {
    id: 'plats',
    label: 'Plats',
    icon: UtensilsCrossed,
    mobileIcon: ChefHat,
    href: '/dashboard/menus?tab=plats'
  },
  {
    id: 'publication',
    label: 'PDF & QR',
    icon: FileText,
    mobileIcon: Upload,
    href: '/dashboard/menus?tab=publication'
  }
];

interface TabNavigationProps {
  activeTab: string;
}

export default function TabNavigation({ activeTab }: TabNavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Construire l'URL avec les paramètres existants
  const createTabUrl = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      {/* Desktop Navigation - Tabs at top */}
      <div className="hidden md:block sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="px-4 md:px-6">
          <nav className="flex overflow-x-auto py-2 -mx-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              
              return (
                <Link
                  key={tab.id}
                  href={createTabUrl(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 mx-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-amber-50 text-slate-900 border border-amber-200 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md',
                    isActive 
                      ? 'bg-amber-100 text-amber-600' 
                      : 'bg-slate-100 text-slate-500'
                  )}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="ml-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation - Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-200 shadow-lg">
        <div className="flex items-center justify-around px-2 py-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const MobileIcon = tab.mobileIcon;
            
            return (
              <Link
                key={tab.id}
                href={createTabUrl(tab.id)}
                className={cn(
                  'flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-all',
                  isActive
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-slate-600 hover:text-slate-900'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full mb-1',
                  isActive
                    ? 'bg-amber-100'
                    : 'bg-slate-100'
                )}>
                  <MobileIcon className={cn(
                    'h-5 w-5',
                    isActive ? 'text-amber-600' : 'text-slate-500'
                  )} />
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="absolute -top-1 w-10 h-1 rounded-full bg-amber-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}