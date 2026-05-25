'use client';

import { Reservation } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Users,
  Phone,
  Mail,
  Edit2,
  Trash2,
  StickyNote,
  Check,
  X,
  CheckCircle,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReservationCardProps {
  reservation: Reservation;
  variant?: 'compact' | 'full';
  onEdit?: (reservation: Reservation) => void;
  onDelete?: (reservation: Reservation) => void;
  onClick?: () => void;
  showActions?: boolean;
  onConfirm?: (reservation: Reservation) => void;
  onCancel?: (reservation: Reservation) => void;
  onComplete?: (reservation: Reservation) => void;
  onStatusChange?: (
    reservation: Reservation,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ) => void;
}

const statusConfig = {
  pending: {
    label: 'En attente',
    variant: 'warning' as const,
    bgColor: 'bg-amber-50/60',
    borderColor: 'border-l-amber-400',
    iconColor: 'text-amber-500',
    bgLight: 'bg-amber-50',
    barColor: '#D97706',
  },
  confirmed: {
    label: 'Confirmée',
    variant: 'success' as const,
    bgColor: 'bg-emerald-50/60',
    borderColor: 'border-l-emerald-400',
    iconColor: 'text-emerald-500',
    bgLight: 'bg-emerald-50',
    barColor: '#059669',
  },
  cancelled: {
    label: 'Annulée',
    variant: 'danger' as const,
    bgColor: 'bg-red-50/60',
    borderColor: 'border-l-red-400',
    iconColor: 'text-red-500',
    bgLight: 'bg-red-50',
    barColor: '#DC2626',
  },
  completed: {
    label: 'Terminée',
    variant: 'default' as const,
    bgColor: 'bg-blue-50/60',
    borderColor: 'border-l-blue-400',
    iconColor: 'text-[#0066FF]',
    bgLight: 'bg-blue-50',
    barColor: '#0066FF',
  },
};

export const ReservationCard = ({
  reservation,
  variant = 'compact',
  onEdit,
  onDelete,
  onClick,
  showActions = true,
  onConfirm,
  onCancel,
  onComplete,
  onStatusChange,
}: ReservationCardProps) => {
  const config = statusConfig[reservation.status];

  if (variant === 'compact') {
    return (
      // Mobile/tablet: native app row — edge-to-edge, separator lines, no cards
      <div
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 px-4 py-3 transition-colors',
          'bg-white active:bg-gray-50/80',
          'border-b border-gray-100',
          onClick && 'cursor-pointer'
        )}
      >
        {/* Status indicator dot */}
        <div className="flex-shrink-0 self-start mt-1">
          <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: config.barColor }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-medium text-[#000000] truncate">{reservation.customerName}</h3>
            <span
              className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${config.barColor}14`, color: config.barColor }}
            >
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[15px] text-[#8E8E93]">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              {reservation.time}
            </span>
            <span className="text-[#C6C6C8]">·</span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 flex-shrink-0" />
              {reservation.numberOfGuests} pers.
            </span>
          </div>
          {reservation.notes && (
            <p className="mt-1 text-[13px] text-[#8E8E93] truncate">
              {reservation.notes}
            </p>
          )}
        </div>

        {/* Chevron */}
        <svg className="h-4 w-4 text-[#C7C7CC] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    );
  }

  // Full variant — desktop
  return (
    <div
      className={cn(
        'rounded-xl bg-white transition-all duration-200',
        'shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]',
        'border border-[#E5E5E5] hover:border-[var(--card-border)]',
        'overflow-hidden'
      )}
      style={{ borderLeft: `3px solid ${config.barColor}`, '--card-border': config.barColor } as React.CSSProperties}
    >
      <div className="p-4 sm:p-5">
        {/* Top row: name + time + guests + status + actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-medium text-[#2A2A2A] truncate">{reservation.customerName}</h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1.5 text-sm font-mono font-medium text-[#2A2A2A]">
                <Clock className="h-4 w-4 text-[#999999]" />
                {reservation.time}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-[#666666]">
                <Users className="h-4 w-4 text-[#999999]" />
                {reservation.numberOfGuests} pers.
              </span>
              <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-0.5', config.bgLight, config.iconColor)}>
                <Circle className="h-2 w-2 fill-current" />
                {config.label}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {(onConfirm || onCancel || onComplete) && (
              <div className="flex gap-1 mr-2">
                {reservation.status === 'pending' && onConfirm && (
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 h-8 text-xs" onClick={(e) => { e.stopPropagation(); onConfirm(reservation); }}>
                    <Check className="h-3.5 w-3.5 mr-1" /> Confirmer
                  </Button>
                )}
                {reservation.status === 'pending' && onCancel && (
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 h-8 text-xs" onClick={(e) => { e.stopPropagation(); onCancel(reservation); }}>
                    <X className="h-3.5 w-3.5 mr-1" /> Refuser
                  </Button>
                )}
                {reservation.status === 'confirmed' && onComplete && (
                  <Button size="sm" variant="default" className="h-8 text-xs" onClick={(e) => { e.stopPropagation(); onComplete(reservation); }}>
                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> Terminer
                  </Button>
                )}
                {reservation.status === 'confirmed' && onCancel && (
                  <Button size="sm" variant="outline" className="h-8 text-xs border-red-300 text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); onCancel(reservation); }}>
                    <X className="h-3.5 w-3.5 mr-1" /> Annuler
                  </Button>
                )}
              </div>
            )}
            {showActions && (
              <div className="flex gap-1">
                {onEdit && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); onEdit(reservation); }} title="Modifier">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); onDelete(reservation); }} title="Supprimer">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-2 flex items-center gap-4 text-xs text-[#999999]">
          <a href={`mailto:${reservation.customerEmail}`} className="flex items-center gap-1 hover:text-[#0066FF] transition-colors" onClick={(e) => e.stopPropagation()}>
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate max-w-[180px]">{reservation.customerEmail}</span>
          </a>
          <a href={`tel:${reservation.customerPhone}`} className="flex items-center gap-1 hover:text-[#0066FF] transition-colors" onClick={(e) => e.stopPropagation()}>
            <Phone className="h-3.5 w-3.5" />
            {reservation.customerPhone}
          </a>
        </div>

        {reservation.notes && (
          <div className="mt-2 pt-2 border-t border-[#E5E5E5] flex items-start gap-1.5">
            <StickyNote className="h-3.5 w-3.5 text-[#CCCCCC] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#666666]">{reservation.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
