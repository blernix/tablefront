'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, Menu } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface DashboardHeaderProps {
  onToggleMobileMenu: () => void;
}

export default function DashboardHeader({ onToggleMobileMenu }: DashboardHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout on client even if API call fails
      logout();
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#E5E5E5] bg-white px-4 sm:px-6">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleMobileMenu}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications (future feature) */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {/* <span className="absolute right-2 top-2 h-2 w-2 bg-red-600" /> */}
        </Button>

        {/* User menu */}
        <div className="hidden sm:flex items-center gap-3 border-l border-[#E5E5E5] pl-4">
          <div className="text-right">
            <p className="text-sm font-medium text-[#2A2A2A]">{user?.email}</p>
            <p className="text-xs text-[#666666] uppercase tracking-[0.1em]">{user?.role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Déconnexion">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="sm:hidden"
          title="Déconnexion"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
