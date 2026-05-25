'use client';

import { Button } from '@/components/ui/button';
import { Ban, MoreVertical, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ReservationHeaderProps {
  isConnected: boolean;
  totalCount: number;
  upcomingCount: number;
  pastCount: number;
  activeTab: 'upcoming' | 'past';
  onNewReservation: () => void;
}

export function ReservationHeader({
  isConnected,
  totalCount,
  upcomingCount,
  pastCount,
  activeTab,
  onNewReservation,
}: ReservationHeaderProps) {
  const router = useRouter();

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden px-4 pt-2 pb-1">
        <div>
          <h1 className="text-[34px] font-bold text-[#000000] leading-tight tracking-tight">Réservations</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-[13px] text-[#8E8E93]">
              {activeTab === 'upcoming' ? upcomingCount : pastCount} réservation{totalCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <Button
        onClick={onNewReservation}
        size="icon"
        className="md:hidden fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-[0_4px_20px_rgba(0,102,255,0.35)] active:scale-95 transition-transform"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Desktop Header */}
      <div className="hidden md:block relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0066FF]" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-light text-[#2A2A2A]">Réservations</h1>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}
                />
                <span className="text-xs text-[#666666] font-medium">
                  {isConnected ? 'Temps réel' : 'Hors ligne'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#666666]">
              <span>
                {totalCount} réservation{totalCount !== 1 ? 's' : ''}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">
                {activeTab === 'upcoming' ? 'À venir' : 'Passées'} (
                {activeTab === 'upcoming' ? upcomingCount : pastCount})
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="hidden sm:flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/reservations/blocked-days')}
                title="Gérer les jours bloqués"
              >
                <Ban className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={onNewReservation} className="min-w-[140px] sm:min-w-[180px]">
              <Plus className="h-4 w-4" />
              <span className="ml-2 hidden xs:inline">Nouvelle réservation</span>
              <span className="ml-2 xs:hidden">Nouvelle</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
