'use client';

import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-slate-100 p-4">
          <Icon className="h-12 w-12 text-slate-400" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>

      <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">{description}</p>

      {actionLabel && onAction && (
        <Button onClick={onAction} size="default">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
