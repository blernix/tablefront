'use client';

import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useCustomerById, useUpdateCustomer } from '@/hooks/api/useCustomers';
import { formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Users, Clock, Ban, CheckCircle, XCircle, Star, CalendarPlus, ChevronRight } from 'lucide-react';

const statusConfig: Record<string, { label: string; icon: typeof Calendar; className: string; bgClass: string }> = {
  pending: { label: 'En attente', icon: Clock, className: 'text-amber-600', bgClass: 'bg-amber-50 border-amber-200' },
  confirmed: { label: 'Confirmée', icon: CheckCircle, className: 'text-emerald-600', bgClass: 'bg-emerald-50 border-emerald-200' },
  cancelled: { label: 'Annulée', icon: XCircle, className: 'text-red-600', bgClass: 'bg-red-50 border-red-200' },
  completed: { label: 'Terminée', icon: CheckCircle, className: 'text-[#0066FF]', bgClass: 'bg-blue-50 border-blue-200' },
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading } = useCustomerById(id);
  const updateCustomer = useUpdateCustomer();

  const customer = data?.customer;
  const reservations = data?.reservations ?? [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-[#666666]">Chargement...</div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-[#666666]">
        <p className="text-lg font-light">Client introuvable</p>
        <Button variant="outline" onClick={() => router.push('/dashboard/customers')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/customers')}>
          <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Retour</span>
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="p-4 sm:p-10">
            <CardTitle className="text-lg sm:text-xl font-light">{customer.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-10 sm:pt-0">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#999999]">Email</p>
                <p className="break-all text-sm sm:text-base text-[#2A2A2A]">{customer.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#999999]">Téléphone</p>
                <p className="text-sm sm:text-base text-[#2A2A2A]">{customer.phone || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-[#E5E5E5] pt-4">
              <div className="rounded-lg bg-[#0066FF]/5 p-3 text-center">
                <p className="text-xl sm:text-2xl font-light text-[#0066FF]">{customer.totalReservations}</p>
                <p className="text-xs text-[#666666]">Total résas</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3 text-center">
                <p className="text-xl sm:text-2xl font-light text-emerald-600">{customer.completedReservations}</p>
                <p className="text-xs text-[#666666]">Terminées</p>
              </div>
              <div className="rounded-lg bg-red-50 p-3 text-center">
                <p className="text-xl sm:text-2xl font-light text-red-600">{customer.cancelledReservations}</p>
                <p className="text-xs text-[#666666]">Annulées</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3 text-center">
                <p className="text-xl sm:text-2xl font-light text-purple-600">{customer.averageGuests}</p>
                <p className="text-xs text-[#666666]">Pers. / résa</p>
              </div>
            </div>

            <div className="border-t border-[#E5E5E5] pt-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#999999] mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {customer.tags.length > 0 ? customer.tags.map((t) => (
                  <Badge key={t} variant={t === 'VIP' ? 'warning' : t === 'À risque' ? 'danger' : t === 'Fidèle' ? 'success' : 'info'}>
                    {t}
                  </Badge>
                )) : (
                  <p className="text-sm text-[#999999]">Aucun tag</p>
                )}
              </div>
            </div>

            <div className="border-t border-[#E5E5E5] pt-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#999999]">Visites</p>
              <div className="mt-2 space-y-1 text-xs sm:text-sm">
                <p className="text-[#2A2A2A]">
                  Première : {format(new Date(customer.firstVisit), 'dd MMM yyyy', { locale: fr })}
                </p>
                <p className="text-[#2A2A2A]">
                  Dernière : {customer.lastVisit ? format(new Date(customer.lastVisit), 'dd MMM yyyy', { locale: fr }) : '-'}
                </p>
              </div>
            </div>

            {(customer.cancellationRate ?? 0) > 0 && (
              <div className="border-t border-[#E5E5E5] pt-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#999999]">Taux d&apos;annulation</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-[#E5E5E5]">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${customer.cancellationRate}%`,
                        backgroundColor: (customer.cancellationRate ?? 0) > 30 ? '#DC2626' : (customer.cancellationRate ?? 0) > 15 ? '#D97706' : '#059669',
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[#2A2A2A]">{customer.cancellationRate}%</span>
                </div>
              </div>
            )}

            <div className="border-t border-[#E5E5E5] pt-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#999999]">Marketing</p>
              <p className="mt-2 text-sm">
                {customer.marketingConsent ? (
                  <span className="text-emerald-600 font-medium">✓ Accepte les emails promotionnels</span>
                ) : (
                  <span className="text-red-500 font-medium">✗ Ne souhaite pas recevoir d&apos;offres</span>
                )}
              </p>
            </div>

            {customer.notes && (
              <div className="border-t border-[#E5E5E5] pt-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#999999]">Notes internes</p>
                <p className="mt-2 text-sm text-[#666666]">{customer.notes}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 sm:p-10 sm:pt-0">
            <a
              href={`/dashboard/reservations?customerName=${encodeURIComponent(customer.name)}&customerEmail=${encodeURIComponent(customer.email)}&customerPhone=${encodeURIComponent(customer.phone || '')}`}
              className="inline-flex w-full items-center justify-center gap-2 border border-[#0066FF] bg-[#0066FF] px-4 py-2.5 sm:py-2 text-sm font-medium text-white transition-colors hover:bg-[#0052EB]"
            >
              <CalendarPlus className="h-4 w-4" />
              Créer une réservation
            </a>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="p-4 sm:p-10">
            <CardTitle className="text-lg sm:text-xl font-light">Historique des réservations</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-10 sm:pt-0">
            {reservations.length === 0 ? (
              <p className="text-[#666666]">Aucune réservation trouvée.</p>
            ) : (
              <>
                {/* Mobile: card list */}
                <div className="space-y-3 md:hidden">
                  {reservations.map((r) => {
                    const status = statusConfig[r.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    return (
                      <div
                        key={r._id}
                        className={`cursor-pointer rounded-lg border p-3 transition-colors active:bg-[#FAFAFA] ${status.bgClass}`}
                        onClick={() => router.push(`/dashboard/reservations/${r._id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#2A2A2A]">
                              {format(new Date(r.date), 'dd MMM yyyy', { locale: fr })}
                            </p>
                            <p className="text-xs text-[#666666]">{r.time} · {r.numberOfGuests} pers.</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 text-xs ${status.className}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span className="hidden xs:inline">{status.label}</span>
                            </span>
                            <ChevronRight className="h-4 w-4 text-[#CCCCCC]" />
                          </div>
                        </div>
                        {r.notes && (
                          <p className="mt-1 text-xs text-[#999999] truncate">{r.notes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Desktop: table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E5E5] text-left text-xs font-medium uppercase tracking-[0.2em] text-[#666666]">
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Heure</th>
                        <th className="px-4 py-3">Couverts</th>
                        <th className="px-4 py-3">Statut</th>
                        <th className="px-4 py-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {reservations.map((r) => {
                        const status = statusConfig[r.status] || statusConfig.pending;
                        const StatusIcon = status.icon;
                        return (
                          <tr
                            key={r._id}
                            className="cursor-pointer transition-colors hover:bg-[#FAFAFA]"
                            onClick={() => router.push(`/dashboard/reservations/${r._id}`)}
                          >
                            <td className="px-4 py-3 font-medium text-[#2A2A2A]">
                              {format(new Date(r.date), 'dd MMM yyyy', { locale: fr })}
                            </td>
                            <td className="px-4 py-3 text-[#666666]">{r.time}</td>
                            <td className="px-4 py-3 text-[#666666]">{r.numberOfGuests}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 text-xs ${status.className}`}>
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[#999999] max-w-[200px] truncate">
                              {r.notes || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
