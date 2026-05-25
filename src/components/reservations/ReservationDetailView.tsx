'use client';

import { Reservation } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Clock,
  Users,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  StickyNote,
  Edit2,
  Trash2,
  Check,
  XCircle,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReservationDetailViewProps {
  reservation: Reservation;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => void;
}

const statusConfig = {
  pending: {
    label: 'En attente',
    variant: 'warning' as const,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  confirmed: {
    label: 'Confirmée',
    variant: 'success' as const,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  cancelled: {
    label: 'Annulée',
    variant: 'danger' as const,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  completed: {
    label: 'Terminée',
    variant: 'default' as const,
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
  },
};

export const ReservationDetailView = ({
  reservation,
  onEdit,
  onDelete,
  onStatusChange,
}: ReservationDetailViewProps) => {
  const config = statusConfig[reservation.status];

  const formattedDate = format(new Date(reservation.date), 'EEEE d MMMM yyyy', { locale: fr });

  const getQuickActions = () => {
    if (!onStatusChange) return [];

    switch (reservation.status) {
      case 'pending':
        return [
          {
            label: 'Confirmer',
            icon: <Check className="h-5 w-5" />,
            variant: 'success' as const,
            handler: () => onStatusChange('confirmed'),
          },
          {
            label: 'Annuler',
            icon: <XCircle className="h-5 w-5" />,
            variant: 'destructive' as const,
            handler: () => onStatusChange('cancelled'),
          },
        ];
      case 'confirmed':
        return [
          {
            label: 'Terminer',
            icon: <CheckCircle className="h-5 w-5" />,
            variant: 'outline' as const,
            handler: () => onStatusChange('completed'),
          },
          {
            label: 'Annuler',
            icon: <XCircle className="h-5 w-5" />,
            variant: 'destructive' as const,
            handler: () => onStatusChange('cancelled'),
          },
        ];
      case 'cancelled':
        return [
          {
            label: 'Re-confirmer',
            icon: <Check className="h-5 w-5" />,
            variant: 'success' as const,
            handler: () => onStatusChange('confirmed'),
          },
        ];
      case 'completed':
        return [];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <>
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="md:hidden pb-24">
        {/* Header row: name + modifier */}
        <div className="flex items-start justify-between px-1 pt-1 pb-1">
          <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight">{reservation.customerName}</h1>
          {onEdit && (
            <button onClick={onEdit} className="h-10 w-10 rounded-xl flex items-center justify-center text-[#8E8E93] active:bg-[#F2F2F7] active:text-[#0066FF] transition-colors flex-shrink-0">
              <Edit2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Status badge + quick action icons */}
        <div className="flex items-center justify-between px-1 pb-4">
          <Badge variant={config.variant} className="mt-1">
            {config.label}
          </Badge>
          {quickActions.length > 0 && (
            <div className="flex items-center gap-1">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.handler}
                  className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-[#8E8E93] active:bg-[#F2F2F7] active:text-[#0066FF] transition-colors"
                  aria-label={action.label}
                >
                  {action.icon}
                  <span className="text-[9px] font-medium mt-0.5">{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info sections */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E5EA]">
          <div className="grid grid-cols-2 divide-x divide-[#E5E5EA]">
            <div className="p-4">
              <p className="text-[11px] font-medium text-[#8E8E93] uppercase tracking-wide mb-1">Date</p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[#0066FF] flex-shrink-0" />
                <p className="text-[15px] font-medium text-[#000000] capitalize leading-tight">{formattedDate}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-[11px] font-medium text-[#8E8E93] uppercase tracking-wide mb-1">Heure</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0066FF] flex-shrink-0" />
                <p className="text-[15px] font-medium text-[#000000]">{reservation.time}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E5E5EA] p-4">
            <p className="text-[11px] font-medium text-[#8E8E93] uppercase tracking-wide mb-1">Couverts</p>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#0066FF] flex-shrink-0" />
              <p className="text-[15px] font-medium text-[#000000]">
                {reservation.numberOfGuests} {reservation.numberOfGuests > 1 ? 'personnes' : 'personne'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E5EA] mt-3">
          <div className="p-4">
            <p className="text-[11px] font-medium text-[#8E8E93] uppercase tracking-wide mb-3">Contact</p>
            <a
              href={`tel:${reservation.customerPhone}`}
              className="flex items-center gap-3 py-2.5 -mx-1 px-1 rounded-xl active:bg-[#F2F2F7] transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-[#0066FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#8E8E93]">Téléphone</p>
                <p className="text-[15px] font-medium text-[#000000]">{reservation.customerPhone}</p>
              </div>
              <span className="text-[13px] text-[#0066FF] font-medium">Appeler</span>
            </a>
            <div className="border-t border-[#E5E5EA] my-1" />
            <a
              href={`mailto:${reservation.customerEmail}`}
              className="flex items-center gap-3 py-2.5 -mx-1 px-1 rounded-xl active:bg-[#F2F2F7] transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-[#0066FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#8E8E93]">Email</p>
                <p className="text-[15px] font-medium text-[#000000] truncate">{reservation.customerEmail}</p>
              </div>
              <span className="text-[13px] text-[#0066FF] font-medium">Écrire</span>
            </a>
          </div>
        </div>

        {/* Notes */}
        {reservation.notes && (
          <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E5EA] mt-3 p-4">
            <div className="flex items-start gap-3">
              <StickyNote className="h-5 w-5 text-[#8E8E93] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-medium text-[#8E8E93] uppercase tracking-wide mb-1">Notes</p>
                <p className="text-[15px] text-[#1C1C1E] leading-relaxed">{reservation.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Delete */}
        {onDelete && (
          <div className="flex justify-center mt-4">
            <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] text-[#8E8E93] active:bg-[#F2F2F7] transition-colors">
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          </div>
        )}
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden md:block space-y-6">
        <Card className={config.borderColor}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{reservation.customerName}</CardTitle>
                <Badge variant={config.variant} className="mt-2">
                  {config.label}
                </Badge>
              </div>
              {(onEdit || onDelete) && (
                <div className="flex gap-2">
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={onEdit}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="outline" size="sm" onClick={onDelete}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <CalendarIcon className="h-5 w-5 text-slate-600" />
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="font-medium capitalize">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Clock className="h-5 w-5 text-slate-600" />
                <div>
                  <p className="text-sm text-slate-500">Heure</p>
                  <p className="font-medium">{reservation.time}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <Users className="h-5 w-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">Nombre de personnes</p>
                <p className="font-medium">
                  {reservation.numberOfGuests}{' '}
                  {reservation.numberOfGuests > 1 ? 'personnes' : 'personne'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Email</p>
                <a
                  href={`mailto:${reservation.customerEmail}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {reservation.customerEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Téléphone</p>
                <a
                  href={`tel:${reservation.customerPhone}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {reservation.customerPhone}
                </a>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = `tel:${reservation.customerPhone}`)}
              >
                Appeler
              </Button>
            </div>
          </CardContent>
        </Card>

        {reservation.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{reservation.notes}</p>
            </CardContent>
          </Card>
        )}

        {quickActions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <Button key={index} variant={action.variant} size="sm" onClick={action.handler}>
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};
