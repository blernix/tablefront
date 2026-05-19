'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { Store, TrendingUp, Clock } from 'lucide-react';

export default function CommercialDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.commercial.getMyStats().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-gray-400 py-10 text-center">Chargement...</div>;

  const s = stats?.stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-[#2A2A2A]">Tableau de bord</h1>
        <p className="text-sm text-gray-400 mt-1">Vue d&apos;ensemble de votre activité commerciale</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0066FF]/10 rounded-lg flex items-center justify-center"><Store className="h-5 w-5 text-[#0066FF]" /></div>
              <div>
                <div className="text-2xl font-light">{s?.total || 0}</div>
                <div className="text-xs text-gray-400">Restaurants créés</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><TrendingUp className="h-5 w-5 text-green-600" /></div>
              <div>
                <div className="text-2xl font-light">{s?.byPlan?.pro || 0}</div>
                <div className="text-xs text-gray-400">En plan Pro</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><Clock className="h-5 w-5 text-amber-600" /></div>
              <div>
                <div className="text-2xl font-light">{s?.byPlan?.trial || 0}</div>
                <div className="text-xs text-gray-400">En essai</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {s?.recent?.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-[#2A2A2A] mb-3">Derniers restaurants créés</h3>
            <div className="space-y-2">
              {s.recent.map((r: any) => (
                <div key={r._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm text-[#2A2A2A]">{r.name}</div>
                    <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.subscription?.plan === 'pro' ? 'bg-green-100 text-green-700' : r.subscription?.plan === 'starter' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {r.subscription?.plan === 'trial' ? 'Essai' : r.subscription?.plan === 'pro' ? 'Pro' : 'Starter'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
