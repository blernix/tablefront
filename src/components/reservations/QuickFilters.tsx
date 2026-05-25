'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface QuickFilter {
  id: string;
  label: string;
  action: () => void;
  isActive: boolean;
}

interface QuickFiltersProps {
  filters: QuickFilter[];
  onClearAll?: () => void;
}

export const QuickFilters = ({ filters, onClearAll }: QuickFiltersProps) => {
  const activeCount = filters.filter((f) => f.isActive).length;

  return (
    <>
      {/* Mobile: horizontal scrollable pill chips */}
      <div className="md:hidden flex gap-2 items-center overflow-x-auto no-scrollbar -mx-4 px-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={filter.action}
            className={`flex items-center gap-1 px-3.5 py-2 text-[15px] font-medium rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${
              filter.isActive
                ? 'bg-[#0066FF] text-white'
                : 'bg-[#F2F2F7] text-[#000000] active:bg-[#E5E5EA]'
            }`}
          >
            {filter.label}
            {filter.isActive && <X className="h-3.5 w-3.5" />}
          </button>
        ))}
        {activeCount > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            className="flex-shrink-0 text-[15px] text-[#0066FF] font-medium"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Desktop: standard buttons */}
      <div className="hidden md:flex gap-2 flex-wrap items-center">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={filter.isActive ? 'default' : 'outline'}
            size="sm"
            onClick={filter.action}
            className="transition-all"
          >
            {filter.label}
            {filter.isActive && <X className="h-3 w-3 ml-1.5" />}
          </Button>
        ))}

        {activeCount > 0 && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-slate-500 hover:text-slate-700"
          >
            Effacer tout ({activeCount})
          </Button>
        )}
      </div>
    </>
  );
};
