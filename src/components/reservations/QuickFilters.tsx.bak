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
  const activeCount = filters.filter(f => f.isActive).length;

  return (
    <div className="flex gap-2 flex-wrap items-center">
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
  );
};
