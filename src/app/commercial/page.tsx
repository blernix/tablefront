'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { Store, TrendingUp, DollarSign, AlertTriangle, Target, Pencil, Check, X, UserCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CommercialDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingObj, setEditingObj] = useState(false);
  const [objValue, setObjValue] = useState(10);

  const fetchData = () => {
    setLoading(true);
    Promise.all([apiClient.commercial.getMyStats(), apiClient.commercial.getProfile()]).then(([s, p]: any) => { setData(s); setProfile(p?.user); setObjValue(s.objectives?.monthlySignups || 10); }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const saveObj = async () => { try { await apiClient.commercial.updateObjectives(objValue); toast.success('Objectif mis à jour ✓'); setEditingObj(false); fetchData(); } catch (e: any) { toast.error(e?.message || 'Erreur'); } };

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse" />
      <div className="grid grid-cols-2 gap-2"><div className="h-24 bg-slate-200 rounded-2xl animate-pulse" /><div className="h-24 bg-slate-200 rounded-2xl animate-pulse" /><div className="h-24 bg-slate-200 rounded-2xl animate-pulse" /><div className="h-24 bg-slate-200 rounded-2xl animate-pulse" /></div>
      <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" /><div className="h-40 bg-slate-200 rounded-2xl animate-pulse" /></div>
  );

  const s = data?.stats; const o = data?.objectives;
  const pct = o?.monthlySignups > 0 ? Math.min(100, Math.round(((s?.thisMonth || 0) / o.monthlySignups) * 100)) : 0;

  const Kpi = ({ icon, label, value, sub, bg }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; bg: string }) => (
    <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 md:rounded-xl">
      <div className="flex items-center gap-2 mb-2"><div className={`h-8 w-8 rounded-lg flex items-center justify-center ${bg}`}>{icon}</div><span className="text-[12px] text-[#8E8E93] md:text-xs">{label}</span></div>
      <div className="text-2xl font-bold text-[#000000] md:text-3xl md:font-light">{value}</div>
      {sub && <div className="text-[11px] text-[#8E8E93] mt-1 md:text-xs">{sub}</div>}
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-4">
        {profile?.photoUrl ? <img src={profile.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-[#E5E5EA]" /> : (
          <Link href="/commercial/profil" className="h-12 w-12 rounded-full bg-[#0066FF]/10 flex items-center justify-center active:bg-[#0066FF]/20"><UserCircle className="h-6 w-6 text-[#0066FF]" /></Link>
        )}
        <div>
          <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">{profile?.firstName ? `Bonjour ${profile.firstName}` : 'Tableau de bord'}</h1>
          <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Vue d&apos;ensemble</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <Kpi icon={<Store className="h-4 w-4 text-[#0066FF]" />} label="Créés" value={s?.total || 0} sub={`${s?.active || 0} actifs`} bg="bg-[#0066FF]/10" />
        <Kpi icon={<Target className="h-4 w-4 text-orange-500" />} label="Ce mois" value={s?.thisMonth || 0} sub={`sur ${o?.monthlySignups || 10}`} bg="bg-orange-50" />
        <Kpi icon={<DollarSign className="h-4 w-4 text-emerald-500" />} label="MRR" value={`${s?.revenue?.mrr || 0}€`} sub={`${s?.revenue?.activeStarter || 0} S · ${s?.revenue?.activePro || 0} P`} bg="bg-emerald-50" />
        <Kpi icon={<AlertTriangle className="h-4 w-4 text-red-400" />} label="Résiliés" value={s?.cancelled || 0} sub={`${s?.churnRate || 0}% churn`} bg="bg-red-50" />
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-lg bg-[#0066FF]/10 flex items-center justify-center"><Target className="h-4 w-4 text-[#0066FF]" /></div><h3 className="text-[15px] font-semibold text-[#000000] md:text-base">Objectif mensuel</h3></div>
            {editingObj ? (
              <div className="flex items-center gap-1.5">
                <input type="number" min={1} max={100} value={objValue} onChange={(e) => setObjValue(parseInt(e.target.value) || 1)} className="w-16 h-9 rounded-lg border border-[#E5E5EA] bg-white text-sm text-center focus:outline-none focus:border-[#0066FF]" />
                <button onClick={saveObj} className="h-9 w-9 rounded-lg text-emerald-500 active:bg-emerald-50 flex items-center justify-center"><Check className="h-4 w-4" /></button>
                <button onClick={() => { setEditingObj(false); setObjValue(o?.monthlySignups || 10); }} className="h-9 w-9 rounded-lg text-[#8E8E93] active:bg-[#F2F2F7] flex items-center justify-center"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <button onClick={() => setEditingObj(true)} className="flex items-center gap-1 text-[13px] text-[#8E8E93] active:text-[#0066FF] md:text-xs"><Pencil className="h-3.5 w-3.5" /> Modifier</button>
            )}
          </div>
          <div className="flex justify-between text-[12px] text-[#8E8E93] mb-1.5 md:text-xs"><span>{s?.thisMonth || 0} inscrits</span><span>{o?.monthlySignups || 10} visés</span></div>
          <div className="w-full bg-[#F2F2F7] rounded-full h-2.5 overflow-hidden"><div className="h-full bg-[#0066FF] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} /></div>
          {pct >= 100 && <p className="text-[13px] text-emerald-600 font-medium mt-2 md:text-xs">🎉 Objectif atteint ce mois-ci !</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {[{ v: `${s?.conversionRate || 0}%`, l: 'Conversion', c: 'text-emerald-600' }, { v: s?.byPlan?.pro || 0, l: 'Pro' }, { v: s?.byPlan?.starter || 0, l: 'Starter' }, { v: `${s?.avgActivationDays || 0}j`, l: 'Délai activation' }].map((x) => (
          <div key={x.l} className="bg-white rounded-2xl border border-[#E5E5EA] p-3 text-center md:rounded-xl md:p-4">
            <div className={`text-xl font-bold ${x.c || 'text-[#000000]'} md:text-2xl md:font-light`}>{x.v}</div>
            <div className="text-[11px] text-[#8E8E93] mt-0.5 md:text-xs">{x.l}</div>
          </div>
        ))}
      </div>

      {s?.recent?.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3"><div className="h-8 w-8 rounded-lg bg-[#0066FF]/10 flex items-center justify-center"><TrendingUp className="h-4 w-4 text-[#0066FF]" /></div><h3 className="text-[15px] font-semibold text-[#000000] md:text-base">Activité récente</h3></div>
            <div className="divide-y divide-[#E5E5EA]">
              {s.recent.map((r: any) => (
                <Link key={r._id} href={`/commercial/restaurants/${r._id}`} className="flex items-center justify-between py-3 active:bg-[#F2F2F7] -mx-4 px-4 md:-mx-5 md:px-5">
                  <div className="min-w-0 flex-1"><p className="text-[15px] font-medium text-[#000000] truncate md:text-sm">{r.name}</p><p className="text-[12px] text-[#8E8E93] mt-0.5 md:text-xs">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</p></div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium md:text-xs ${r.status === 'inactive' ? 'bg-amber-50 text-amber-700' : r.subscription?.plan === 'pro' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-[#0066FF]'}`}>{r.status === 'inactive' ? 'En attente' : r.subscription?.plan === 'pro' ? 'Pro' : 'Starter'}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#C7C7CC]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
