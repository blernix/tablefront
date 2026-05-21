'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Store, Mail, Phone, MapPin, Calendar, CreditCard, Clock, BarChart3, Link as LinkIcon, ExternalLink } from 'lucide-react';

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.commercial.getRestaurantDetail(id).then((d: any) => setData(d)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-sm text-gray-400 py-10 text-center">Chargement...</div>;
  if (!data?.restaurant) return <div className="text-sm text-red-400 py-10 text-center">Restaurant introuvable.</div>;

  const r = data.restaurant;
  const s = data.stats;
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://tablemaster.fr';

  const sub = r.subscription || {};
  const isActive = r.status === 'active';
  const isCancelled = sub.status === 'cancelled';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/commercial/restaurants"><ArrowLeft className="h-5 w-5 text-gray-400 hover:text-gray-600" /></Link>
        <h1 className="text-xl font-light text-[#2A2A2A]">{r.name}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100 text-green-700' : isCancelled ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
          {isActive ? 'Actif' : isCancelled ? 'Résilié' : 'En attente'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light text-[#0066FF]">{s?.activeReservations || 0}</div><div className="text-[10px] text-gray-400">Résas en cours</div></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light">{s?.totalReservations || 0}</div><div className="text-[10px] text-gray-400">Total réservations</div></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light">{sub.plan === 'pro' ? 'Pro' : sub.plan === 'starter' ? 'Starter' : '—'}</div><div className="text-[10px] text-gray-400">Plan</div></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light">{sub.status === 'active' ? 'Actif' : sub.status === 'trial' ? 'Essai' : sub.status || '—'}</div><div className="text-[10px] text-gray-400">Abonnement</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-5 space-y-3">
          <h3 className="text-sm font-medium text-[#2A2A2A] flex items-center gap-2"><Store className="h-4 w-4 text-[#0066FF]" /> Informations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-400">Email :</span><span>{r.email}</span></div>
            <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-400">Tél :</span><span>{r.phone}</span></div>
            <div className="flex items-center gap-2 sm:col-span-2"><MapPin className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-400">Adresse :</span><span>{r.address}</span></div>
          </div>
          {r.publicSlug && (
            <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2.5">
              <LinkIcon className="h-3.5 w-3.5 text-[#0066FF]" />
              <code className="text-[#0066FF] text-xs truncate flex-1">{frontendUrl}/{r.publicSlug}</code>
              <a href={`${frontendUrl}/${r.publicSlug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 text-gray-400 hover:text-[#0066FF]" /></a>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 space-y-3">
          <h3 className="text-sm font-medium text-[#2A2A2A] flex items-center gap-2"><CreditCard className="h-4 w-4 text-[#0066FF]" /> Abonnement</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-400">Crée le :</span><span>{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span></div>
            <div className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-400">Plan :</span><span className="font-medium">{sub.plan === 'pro' ? 'Pro (69€/mois)' : sub.plan === 'starter' ? 'Starter (39€/mois)' : '—'}</span></div>
            <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-400">Statut :</span><span>{sub.status === 'active' ? 'Actif' : sub.status === 'trial' ? 'Période d\'essai' : sub.status === 'cancelled' ? 'Résilié' : sub.status || '—'}</span></div>
            {sub.currentPeriodEnd && <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-400">Prochain paiement :</span><span>{new Date(sub.currentPeriodEnd).toLocaleDateString('fr-FR')}</span></div>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 space-y-3">
          <h3 className="text-sm font-medium text-[#2A2A2A] flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#0066FF]" /> Activité</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="font-medium text-[#0066FF]">{s?.activeReservations || 0}</div><div className="text-xs text-gray-400">En cours</div></div>
            <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="font-medium">{s?.totalReservations || 0}</div><div className="text-xs text-gray-400">Total</div></div>
            <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="font-medium">{r.tablesConfig?.totalTables || '—'}</div><div className="text-xs text-gray-400">Tables</div></div>
            <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="font-medium">{r.tablesConfig?.averageCapacity || '—'}</div><div className="text-xs text-gray-400">Couverts</div></div>
          </div>
        </CardContent>
      </Card>

      <Link href="/commercial/restaurants">
        <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" /> Retour à la liste</Button>
      </Link>
    </div>
  );
}
