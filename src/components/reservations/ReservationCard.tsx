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
  // Status change actions
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
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-900',
  },
  confirmed: {
    label: 'Confirmée',
    variant: 'success' as const,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
  },
  cancelled: {
    label: 'Annulée',
    variant: 'danger' as const,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
  },
  completed: {
    label: 'Terminée',
    variant: 'default' as const,
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-900',
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
      <div
        onClick={onClick}
        className={cn(
          'border rounded-lg p-4 transition-all',
          config.bgColor,
          config.borderColor,
          onClick && 'cursor-pointer hover:shadow-md active:scale-[0.98]'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{reservation.customerName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={config.variant} className="text-xs">
                {config.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">{reservation.time}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>
              {reservation.numberOfGuests}{' '}
              {reservation.numberOfGuests > 1 ? 'personnes' : 'personne'}
            </span>
          </div>
        </div>

        {/* Notes preview */}
        {reservation.notes && (
          <div className="mt-3 flex items-start gap-2">
            <StickyNote className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-500 italic truncate">{reservation.notes}</p>
          </div>
        )}

        {/* Quick actions for compact view */}
        {(onConfirm || onCancel || onComplete) && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
            {reservation.status === 'pending' && onConfirm && (
              <button
                className="flex-1 py-1.5 px-2 bg-emerald-500 text-white text-xs font-medium rounded hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm(reservation);
                }}
                title="Confirmer la réservation"
              >
                <Check className="h-3 w-3" />
                Confirmer
              </button>
            )}
            {reservation.status === 'pending' && onCancel && (
              <button
                className="flex-1 py-1.5 px-2 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel(reservation);
                }}
                title="Refuser la réservation"
              >
                <X className="h-3 w-3" />
                Refuser
              </button>
            )}
            {reservation.status === 'confirmed' && onComplete && (
              <button
                className="flex-1 py-1.5 px-2 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(reservation);
                }}
                title="Marquer comme terminée"
              >
                <CheckCircle className="h-3 w-3" />
                Terminer
              </button>
            )}
            {reservation.status === 'confirmed' && onCancel && (
              <button
                className="flex-1 py-1.5 px-2 bg-amber-500 text-white text-xs font-medium rounded hover:bg-amber-600 transition-colors flex items-center justify-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel(reservation);
                }}
                title="Annuler la réservation"
              >
                <X className="h-3 w-3" />
                Annuler
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn('border rounded-lg p-6 bg-white', config.borderColor)}>
      {/* Header with actions */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{reservation.customerName}</h2>
          <Badge variant={config.variant} className="mt-2">
            {config.label}
          </Badge>
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* Quick actions */}
          {(onConfirm || onCancel || onComplete) && (
            <div className="flex gap-2">
              {reservation.status === 'pending' && onConfirm && (
                <Button
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConfirm(reservation);
                  }}
                  title="Confirmer la réservation"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Confirmer
                </Button>
              )}
              {reservation.status === 'pending' && onCancel && (
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel(reservation);
                  }}
                  title="Refuser la réservation"
                >
                  <X className="h-3 w-3 mr-1" />
                  Refuser
                </Button>
              )}
              {reservation.status === 'confirmed' && onComplete && (
                <Button
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete(reservation);
                  }}
                  title="Marquer comme terminée"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Terminer
                </Button>
              )}
              {reservation.status === 'confirmed' && onCancel && (
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel(reservation);
                  }}
                  title="Annuler la réservation"
                >
                  <X className="h-3 w-3 mr-1" />
                  Annuler
                </Button>
              )}
            </div>
          )}
          {/* Edit/Delete actions */}
          {showActions && (onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(reservation);
                  }}
                  title="Modifier"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(reservation);
                  }}
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-sm text-slate-500">Heure</p>
            <p className="font-medium">{reservation.time}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-sm text-slate-500">Nombre de personnes</p>
            <p className="font-medium">{reservation.numberOfGuests}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-slate-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-500">Email</p>
            <a
              href={`mailto:${reservation.customerEmail}`}
              className="font-medium text-blue-600 hover:underline truncate block"
              onClick={(e) => e.stopPropagation()}
            >
              {reservation.customerEmail}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-sm text-slate-500">Téléphone</p>
            <a
              href={`tel:${reservation.customerPhone}`}
              className="font-medium text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {reservation.customerPhone}
            </a>
          </div>
        </div>

        {reservation.notes && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 mb-1">
              <StickyNote className="h-4 w-4 text-slate-400" />
              <p className="text-sm text-slate-500 font-medium">Notes</p>
            </div>
            <p className="text-slate-700 text-sm">{reservation.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
