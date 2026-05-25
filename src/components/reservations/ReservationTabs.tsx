'use client';

interface ReservationTabsProps {
  activeTab: 'upcoming' | 'past';
  upcomingCount: number;
  pastCount: number;
  onTabChange: (tab: 'upcoming' | 'past') => void;
}

export function ReservationTabs({
  activeTab,
  upcomingCount,
  pastCount,
  onTabChange,
}: ReservationTabsProps) {
  return (
    <>
      {/* Mobile: iOS-style pill segmented control — full width, no outer border */}
      <div className="md:hidden mx-4" role="tablist">
        <div className="flex p-0.5 bg-[#E5E5EA] rounded-lg">
          <button
            role="tab"
            aria-selected={activeTab === 'upcoming'}
            onClick={() => onTabChange('upcoming')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[15px] font-medium rounded-md transition-all duration-200 ${
              activeTab === 'upcoming'
                ? 'bg-white text-[#000000] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-[#6D6D72]'
            }`}
          >
            À venir
            <span className={`text-[13px] font-semibold ${
              activeTab === 'upcoming' ? 'text-[#0066FF]' : 'text-[#8E8E93]'
            }`}>
              {upcomingCount}
            </span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'past'}
            onClick={() => onTabChange('past')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[15px] font-medium rounded-md transition-all duration-200 ${
              activeTab === 'past'
                ? 'bg-white text-[#000000] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-[#6D6D72]'
            }`}
          >
            Passées
            <span className={`text-[13px] font-semibold ${
              activeTab === 'past' ? 'text-[#0066FF]' : 'text-[#8E8E93]'
            }`}>
              {pastCount}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop: keep original */}
      <div className="hidden md:flex gap-1 p-1 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl w-full sm:w-fit" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'upcoming'}
          onClick={() => onTabChange('upcoming')}
          className={`flex-1 sm:flex-initial flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'upcoming'
              ? 'bg-[#0066FF] text-white shadow-[0_2px_8px_rgba(0,102,255,0.3)]'
              : 'text-[#666666] hover:text-[#2A2A2A] hover:bg-white'
          }`}
        >
          À venir
          <span className={`px-1.5 py-0.5 rounded-md text-[11px] font-medium ${
            activeTab === 'upcoming'
              ? 'bg-white/20 text-white'
              : 'bg-[#E5E5E5] text-[#666666]'
          }`}>
            {upcomingCount}
          </span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'past'}
          onClick={() => onTabChange('past')}
          className={`flex-1 sm:flex-initial flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'past'
              ? 'bg-[#0066FF] text-white shadow-[0_2px_8px_rgba(0,102,255,0.3)]'
              : 'text-[#666666] hover:text-[#2A2A2A] hover:bg-white'
          }`}
        >
          Passées
          <span className={`px-1.5 py-0.5 rounded-md text-[11px] font-medium ${
            activeTab === 'past'
              ? 'bg-white/20 text-white'
              : 'bg-[#E5E5E5] text-[#666666]'
          }`}>
            {pastCount}
          </span>
        </button>
      </div>
    </>
  );
}
