'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Store, BarChart3, PlusCircle, LogOut, UserCircle, Menu, X } from 'lucide-react';
import CommercialMobileTabBar from '@/components/commercial/CommercialMobileTabBar';

const navItems = [
  { href: '/commercial', icon: BarChart3, label: 'Dashboard' },
  { href: '/commercial/restaurants', icon: Store, label: 'Mes restaurants' },
  { href: '/commercial/restaurants/new', icon: PlusCircle, label: 'Nouveau', primary: true },
  { href: '/commercial/profil', icon: UserCircle, label: 'Profil' },
];

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, initAuth, isInitialized, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { initAuth(); }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user?.role !== 'commercial') { router.push('/dashboard'); return; }
  }, [isInitialized, isAuthenticated, user, router]);

  useEffect(() => { setMenuOpen(false); }, []);

  if (!isInitialized) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Chargement...</div>;
  if (!isAuthenticated || user?.role !== 'commercial') return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-white border-b border-[#E5E5EA] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-light text-[#2A2A2A]">TableMaster</span>
            <span className="text-xs bg-[#0066FF]/10 text-[#0066FF] px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
              Commercial
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant={item.primary ? 'default' : 'ghost'} size="sm" className={item.primary ? 'bg-[#0066FF] hover:bg-[#0052CC]' : ''}>
                  <item.icon className="h-4 w-4 mr-1.5" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="sm" onClick={() => { logout(); router.push('/login'); }} className="ml-2">
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile menu sidebar */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMenuOpen(false)}>
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute top-0 right-0 h-full w-72 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-light text-[#2A2A2A]">TableMaster</span>
                  <button onClick={() => setMenuOpen(false)}><X className="h-5 w-5 text-gray-400" /></button>
                </div>
                <div className="p-4 space-y-1">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                      <Button variant={item.primary ? 'default' : 'ghost'} className={`w-full justify-start ${item.primary ? 'bg-[#0066FF] hover:bg-[#0052CC]' : ''}`}>
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  <Button variant="ghost" className="w-full justify-start text-red-500 mt-4" onClick={() => { logout(); router.push('/login'); setMenuOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-3" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
      <main className="max-w-6xl mx-auto px-4 pt-6 pb-20 md:py-6">{children}</main>
      <CommercialMobileTabBar />
    </div>
  );
}
