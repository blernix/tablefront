'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TabNavigation from '@/components/menus/TabNavigation';
import DashboardTab from '@/components/menus/DashboardTab';
import PlatsTab from '@/components/menus/PlatsTab';
import PublicationTab from '@/components/menus/PublicationTab';

function MenusContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  
  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Desktop: onglets en haut, Mobile: bottom-bar */}
      <TabNavigation activeTab={activeTab} />
      
      {/* Contenu de l'onglet actif */}
      <div className="flex-1 overflow-auto pb-16 md:pb-0 px-4 md:px-6 pt-4 md:pt-6">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'plats' && <PlatsTab />}
        {activeTab === 'publication' && <PublicationTab />}
      </div>
    </div>
  );
}

export default function MenusPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-full min-h-screen">
        {/* Skeleton navigation */}
        <div className="hidden md:block sticky top-0 z-40 bg-white border-b border-slate-200">
          <div className="px-4 md:px-6">
            <div className="flex overflow-x-auto py-2 -mx-1">
              {['Dashboard', 'Plats', 'PDF & QR'].map((label, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2.5 mx-1 rounded-lg bg-slate-100 animate-pulse w-32 h-10" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            <div className="h-8 bg-slate-100 rounded animate-pulse w-48" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <MenusContent />
    </Suspense>
  );
}