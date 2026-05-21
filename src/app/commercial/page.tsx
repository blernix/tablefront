'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';
import { Store, TrendingUp, Clock, DollarSign, AlertTriangle, Target, Users, Pencil, Check, X, UserCircle } from 'lucide-react';
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
    Promise.all([apiClient.commercial.getMyStats(), apiClient.commercial.getProfile()]).then(([statsData, profileData]: any) => {
      setData(statsData);
      setProfile((profileData as any)?.user);
      setObjValue(statsData.objectives?.monthlySignups || 10);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const saveObjectives = async () => {
    try {
      await apiClient.commercial.updateObjectives(objValue);
      toast.success('Objectif mis à jour');
      setEditingObj(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.message || 'Erreur');
    }
  };

  if (loading) return <div className="text-sm text-gray-400 py-10 text-center">Chargement...</div>;

  const s = data?.stats;
  const obj = data?.objectives;
  const progressPct = obj?.monthlySignups > 0 ? Math.min(100, Math.round(((s?.thisMonth || 0) / obj.monthlySignups) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
          ) : (
            <Link href="/commercial/profil">
              <div className="w-12 h-12 rounded-full bg-[#0066FF]/10 flex items-center justify-center hover:bg-[#0066FF]/20 transition-colors cursor-pointer">
                <UserCircle className="h-6 w-6 text-[#0066FF]" />
              </div>
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-light text-[#2A2A2A]">
              {profile?.firstName ? `Bonjour ${profile.firstName}` : 'Tableau de bord'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">Vue d&apos;ensemble de votre activité</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-[#0066FF]" />
              <span className="text-xs text-gray-400">Créés</span>
            </div>
            <div className="text-xl font-light mt-1">{s?.total || 0}</div>
            <div className="text-[10px] text-gray-400">{s?.active || 0} actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-gray-400">Ce mois</span>
            </div>
            <div className="text-xl font-light mt-1">{s?.thisMonth || 0}</div>
            <div className="text-[10px] text-gray-400">sur {obj?.monthlySignups || 10}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-xs text-gray-400">MRR</span>
            </div>
            <div className="text-xl font-light mt-1">{s?.revenue?.mrr || 0}€</div>
            <div className="text-[10px] text-gray-400">{s?.revenue?.activeStarter || 0} Starter · {s?.revenue?.activePro || 0} Pro</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-xs text-gray-400">Résiliés</span>
            </div>
            <div className="text-xl font-light mt-1">{s?.cancelled || 0}</div>
            <div className="text-[10px] text-gray-400">{s?.churnRate || 0}% de churn</div>
          </CardContent>
        </Card>
      </div>

      {/* Objective Progress */}
      <Card>
        <CardContent className="pt-5 pb-4 px-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[#0066FF]" />
              <h3 className="text-sm font-medium text-[#2A2A2A]">Objectif mensuel</h3>
            </div>
            {editingObj ? (
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={100} value={objValue} onChange={(e) => setObjValue(parseInt(e.target.value) || 1)} className="w-16 h-7 text-xs text-center" />
                <Button size="sm" variant="ghost" onClick={saveObjectives} className="h-7 w-7 p-0"><Check className="h-3 w-3 text-green-600" /></Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditingObj(false); setObjValue(obj?.monthlySignups || 10); }} className="h-7 w-7 p-0"><X className="h-3 w-3 text-gray-400" /></Button>
              </div>
            ) : (
              <button onClick={() => setEditingObj(true)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#0066FF] transition-colors">
                <Pencil className="h-3 w-3" />
                Modifier
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>{s?.thisMonth || 0} inscrits</span>
            <span>{obj?.monthlySignups || 10} visés</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-[#0066FF] rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
          {progressPct >= 100 && (
            <p className="text-xs text-green-600 mt-2">🎉 Objectif atteint ce mois-ci !</p>
          )}
        </CardContent>
      </Card>

      {/* Performance metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3 px-4 text-center">
            <div className="text-lg font-light text-green-600">{s?.conversionRate || 0}%</div>
            <div className="text-[10px] text-gray-400">Conversion</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4 text-center">
            <div className="text-lg font-light text-[#2A2A2A]">{s?.byPlan?.pro || 0}</div>
            <div className="text-[10px] text-gray-400">Pro</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4 text-center">
            <div className="text-lg font-light text-[#2A2A2A]">{s?.byPlan?.starter || 0}</div>
            <div className="text-[10px] text-gray-400">Starter</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4 text-center">
            <div className="text-lg font-light text-[#2A2A2A]">{s?.avgActivationDays || 0}j</div>
            <div className="text-[10px] text-gray-400">Délai activation</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      {s?.recent?.length > 0 && (
        <Card>
          <CardContent className="pt-5 pb-2 px-5">
            <h3 className="text-sm font-medium text-[#2A2A2A] mb-3">Activité récente</h3>
            <div className="space-y-1">
              {s.recent.map((r: any) => (
                <div key={r._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-[#2A2A2A] truncate">{r.name}</div>
                    <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'inactive' ? 'bg-amber-100 text-amber-700' : r.subscription?.plan === 'pro' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {r.status === 'inactive' ? 'En attente' : r.subscription?.plan === 'pro' ? 'Pro' : 'Starter'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
