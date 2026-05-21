'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Store, BarChart3, PlusCircle, LogOut, UserCircle } from 'lucide-react';

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, initAuth, isInitialized, logout } = useAuthStore();

  useEffect(() => { initAuth(); }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user?.role !== 'commercial') { router.push('/dashboard'); return; }
  }, [isInitialized, isAuthenticated, user, router]);

  if (!isInitialized) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Chargement...</div>;
  if (!isAuthenticated || user?.role !== 'commercial') return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-light text-[#2A2A2A]">TableMaster</span>
            <span className="text-xs bg-[#0066FF]/10 text-[#0066FF] px-2 py-0.5 rounded-full font-medium">
              Commercial
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <Link href="/commercial">
              <Button variant="ghost" size="sm"><BarChart3 className="h-4 w-4 mr-1.5" /> Dashboard</Button>
            </Link>
            <Link href="/commercial/restaurants">
              <Button variant="ghost" size="sm"><Store className="h-4 w-4 mr-1.5" /> Mes restaurants</Button>
            </Link>
            <Link href="/commercial/restaurants/new">
              <Button size="sm" className="bg-[#0066FF] hover:bg-[#0052CC] ml-2"><PlusCircle className="h-4 w-4 mr-1.5" /> Nouveau</Button>
            </Link>
            <Link href="/commercial/profil">
              <Button variant="ghost" size="sm"><UserCircle className="h-4 w-4 mr-1.5" /> Profil</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => { logout(); router.push('/login'); }} className="ml-4"><LogOut className="h-4 w-4" /></Button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
