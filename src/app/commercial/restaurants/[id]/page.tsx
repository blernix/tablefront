'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Store, Mail, Phone, MapPin, Calendar, CreditCard, Clock, BarChart3, Link as LinkIcon, ExternalLink, StickyNote } from 'lucide-react';

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const noteTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { apiClient.commercial.getRestaurantDetail(id).then((d: any) => setData(d)).catch(() => {}).finally(() => setLoading(false)); apiClient.commercial.getRestaurantNote(id).then((d: any) => setNote(d?.note || '')).catch(() => {}); }, [id]);

  const handleNoteChange = (v: string) => { setNote(v); if (noteTimeout.current) clearTimeout(noteTimeout.current); noteTimeout.current = setTimeout(() => { apiClient.commercial.updateRestaurantNote(id, v).catch(() => {}); }, 500); };

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 bg-slate-200 rounded-lg w-32 animate-pulse" />
      <div className="grid grid-cols-2 gap-2">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="h-20 bg-slate-200 rounded-2xl animate-pulse" />))}</div>
      <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
      <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
    </div>
  );
  if (!data?.restaurant) return <div className="text-center py-10"><p className="text-[15px] text-red-500 md:text-sm">Restaurant introuvable.</p><Link href="/commercial/restaurants" className="text-[#0066FF] mt-2 inline-block md:text-sm">← Retour</Link></div>;

  const r = data.restaurant; const s = data.stats; const sub = r.subscription || {}; const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://tablemaster.fr';

  const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-2 mb-4"><div className="h-8 w-8 rounded-lg bg-[#0066FF]/10 flex items-center justify-center">{icon}</div><h3 className="text-[15px] font-semibold text-[#000000] md:text-base">{title}</h3></div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/commercial/restaurants" className="h-9 w-9 flex items-center justify-center rounded-lg text-[#8E8E93] active:bg-[#F2F2F7]"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-[24px] font-bold text-[#000000] leading-tight truncate md:text-2xl">{r.name}</h1>
        </div>
        <span className={`text-[12px] px-2.5 py-1 rounded-full font-medium flex-shrink-0 md:text-xs ${r.status === 'active' ? 'bg-emerald-50 text-emerald-700' : sub.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
          {r.status === 'active' ? 'Actif' : sub.status === 'cancelled' ? 'Résilié' : 'En attente'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {[
          { v: s?.activeReservations || 0, l: 'Résas en cours', c: 'text-[#0066FF]' },
          { v: s?.totalReservations || 0, l: 'Total résas' },
          { v: sub.plan === 'pro' ? 'Pro' : sub.plan === 'starter' ? 'Starter' : '—', l: 'Plan' },
          { v: sub.status === 'active' ? 'Actif' : sub.status === 'trial' ? 'Essai' : sub.status || '—', l: 'Abonnement' },
        ].map((x) => (
          <div key={x.l} className="bg-white rounded-2xl border border-[#E5E5EA] p-3 text-center md:rounded-xl md:p-4">
            <div className={`text-xl font-bold ${x.c || 'text-[#000000]'} md:text-2xl md:font-light`}>{x.v}</div>
            <div className="text-[11px] text-[#8E8E93] mt-0.5 md:text-xs">{x.l}</div>
          </div>
        ))}
      </div>

      <Section icon={<Store className="h-4 w-4 text-[#0066FF]" />} title="Informations">
        <div className="space-y-2 text-[14px] md:text-sm">
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#8E8E93] flex-shrink-0" /><span className="text-[#8E8E93]">Email :</span><span className="text-[#000000]">{r.email}</span></div>
          <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#8E8E93] flex-shrink-0" /><span className="text-[#8E8E93]">Tél :</span><span className="text-[#000000]">{r.phone}</span></div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#8E8E93] flex-shrink-0" /><span className="text-[#8E8E93]">Adresse :</span><span className="text-[#000000]">{r.address}</span></div>
        </div>
        {r.publicSlug && (
          <div className="mt-3 flex items-center gap-2 bg-[#0066FF]/5 rounded-xl p-3">
            <LinkIcon className="h-4 w-4 text-[#0066FF] flex-shrink-0" />
            <code className="text-[13px] text-[#0066FF] truncate flex-1 md:text-sm">{frontendUrl}/{r.publicSlug}</code>
            <a href={`${frontendUrl}/${r.publicSlug}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0"><ExternalLink className="h-4 w-4 text-[#8E8E93] active:text-[#0066FF]" /></a>
          </div>
        )}
      </Section>

      <Section icon={<CreditCard className="h-4 w-4 text-[#0066FF]" />} title="Abonnement">
        <div className="grid grid-cols-1 gap-2 text-[14px] md:grid-cols-2 md:text-sm">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#8E8E93]" /><span className="text-[#8E8E93]">Créé le :</span><span className="text-[#000000]">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span></div>
          <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-[#8E8E93]" /><span className="text-[#8E8E93]">Plan :</span><span className="font-medium text-[#000000]">{sub.plan === 'pro' ? 'Pro (69€/mois)' : sub.plan === 'starter' ? 'Starter (39€/mois)' : '—'}</span></div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#8E8E93]" /><span className="text-[#8E8E93]">Statut :</span><span className="text-[#000000]">{sub.status === 'active' ? 'Actif' : sub.status === 'trial' ? "Période d'essai" : sub.status === 'cancelled' ? 'Résilié' : sub.status || '—'}</span></div>
          {sub.currentPeriodEnd && <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#8E8E93]" /><span className="text-[#8E8E93]">Prochain paiement :</span><span className="text-[#000000]">{new Date(sub.currentPeriodEnd).toLocaleDateString('fr-FR')}</span></div>}
        </div>
      </Section>

      <Section icon={<BarChart3 className="h-4 w-4 text-[#0066FF]" />} title="Activité">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {[
            { v: s?.activeReservations || 0, l: 'En cours', c: 'text-[#0066FF]' },
            { v: s?.totalReservations || 0, l: 'Total' },
            { v: r.tablesConfig?.totalTables || '—', l: 'Tables' },
            { v: r.tablesConfig?.averageCapacity || '—', l: 'Couverts' },
          ].map((x) => (
            <div key={x.l} className="bg-[#F2F2F7] rounded-xl p-3 text-center">
              <div className={`text-lg font-bold ${x.c || 'text-[#000000]'} md:text-xl md:font-light`}>{x.v}</div>
              <div className="text-[11px] text-[#8E8E93] md:text-xs">{x.l}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={<StickyNote className="h-4 w-4 text-amber-500" />} title="Notes privées">
        <textarea value={note} onChange={(e) => handleNoteChange(e.target.value)} placeholder="Rappeler vendredi, le chef hésite sur le Pro..." rows={4} maxLength={2000}
          className="w-full px-3 py-2.5 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 resize-none md:text-sm" />
        <p className="text-[11px] text-[#8E8E93] text-right mt-1 md:text-xs">Sauvegarde automatique · Visible uniquement par vous</p>
      </Section>
    </div>
  );
}
