'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CommercialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/commercials/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-sm text-gray-400 py-10 text-center">Chargement...</div>;
  if (!data?.user) return <div className="text-sm text-red-400 py-10 text-center">Commercial introuvable.</div>;

  const handleDelete = async () => {
    if (!confirm(`Supprimer définitivement ce commercial ? Les restaurants qu'il a créés ne seront pas affectés.`)) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/commercials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur');
      toast.success('Commercial supprimé');
      router.push('/admin/commercials');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const { user, stats, restaurants } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/commercials"><ArrowLeft className="h-5 w-5 text-gray-400 hover:text-gray-600" /></Link>
        <div className="flex-1">
          <h1 className="text-xl font-light text-[#2A2A2A]">{user.firstName || user.email}</h1>
          <p className="text-xs text-gray-400">Code : {user.referralCode || 'N/A'}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light">{stats.total}</div><div className="text-[10px] text-gray-400">Créés</div></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light text-green-600">{stats.active}</div><div className="text-[10px] text-gray-400">Actifs</div></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light text-amber-600">{stats.inactive}</div><div className="text-[10px] text-gray-400">En attente</div></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light text-red-500">{stats.cancelled}</div><div className="text-[10px] text-gray-400">Résiliés</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light text-green-600">{stats.conversionRate}%</div><div className="text-[10px] text-gray-400">Conversion</div></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light">{stats.mrr}€</div><div className="text-[10px] text-gray-400">MRR généré</div></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light">{stats.byPlan?.starter || 0}</div><div className="text-[10px] text-gray-400">Starter</div></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4 text-center"><div className="text-lg font-light">{stats.byPlan?.pro || 0}</div><div className="text-[10px] text-gray-400">Pro</div></CardContent></Card>
      </div>

      {restaurants?.length > 0 && (
        <Card>
          <CardContent className="pt-5 pb-2 px-5">
            <h3 className="text-sm font-medium text-[#2A2A2A] mb-3">Restaurants créés</h3>
            <div className="space-y-1">
              {restaurants.map((r: any) => (
                <div key={r._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-[#2A2A2A] truncate">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.email}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'inactive' ? 'bg-amber-100 text-amber-700' : r.subscription?.plan === 'pro' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {r.status === 'inactive' ? 'En attente' : r.subscription?.plan === 'pro' ? 'Pro' : 'Starter'}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>
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
