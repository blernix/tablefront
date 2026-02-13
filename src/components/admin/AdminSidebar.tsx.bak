'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  BarChart3,
  Activity,
  Settings,
  ChevronLeft,
  LogOut,
  User,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    label: 'Tableau de bord',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Restaurants',
    href: '/admin/restaurants',
    icon: Store,
  },
  {
    label: 'Monitoring',
    href: '/admin/monitoring',
    icon: Activity,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics/notifications',
    icon: BarChart3,
  },
];

interface AdminSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function AdminSidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    logout();
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50',
          'md:z-40',
          collapsed ? 'w-20' : 'w-64',
          // Mobile responsive
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-900">
            TableMaster
            <span className="block text-xs font-normal text-gray-500">Admin</span>
          </h1>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {/* Close button - mobile only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileMenu}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
          {/* Collapse button - desktop only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex"
          >
            <ChevronLeft className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')} />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', active && 'text-blue-700')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-gray-200 px-3 py-4 space-y-1">
        <Link
          href="/admin/settings"
          onClick={closeMobileMenu}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
            isActive('/admin/settings')
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Paramètres' : undefined}
        >
          <Settings className={cn('w-5 h-5 flex-shrink-0', isActive('/admin/settings') && 'text-blue-700')} />
          {!collapsed && <span>Paramètres</span>}
        </Link>
      </div>

      {/* User Section */}
      <div className="border-t border-gray-200 p-3">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Admin
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </div>
    </aside>
    </>
  );
}
