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
  CheckCircle
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
    borderColor: 'border-amber-200'
  },
  confirmed: {
    label: 'Confirmée',
    variant: 'success' as const,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  cancelled: {
    label: 'Annulée',
    variant: 'danger' as const,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  completed: {
    label: 'Terminée',
    variant: 'default' as const,
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200'
  },
};

export const ReservationDetailView = ({
  reservation,
  onEdit,
  onDelete,
  onStatusChange
}: ReservationDetailViewProps) => {
  const config = statusConfig[reservation.status];

  const formattedDate = format(new Date(reservation.date), 'EEEE d MMMM yyyy', { locale: fr });

  return (
    <div className="space-y-6">
      {/* Header Card */}
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
          {/* Date & Time */}
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

          {/* Guests */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <Users className="h-5 w-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-500">Nombre de personnes</p>
              <p className="font-medium">
                {reservation.numberOfGuests} {reservation.numberOfGuests > 1 ? 'personnes' : 'personne'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
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
              onClick={() => window.location.href = `tel:${reservation.customerPhone}`}
            >
              Appeler
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
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

      {/* Quick Actions */}
      {onStatusChange && (
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {reservation.status !== 'confirmed' && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => onStatusChange('confirmed')}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirmer
                </Button>
              )}
              {reservation.status !== 'cancelled' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onStatusChange('cancelled')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              )}
              {reservation.status === 'confirmed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange('completed')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Terminer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
