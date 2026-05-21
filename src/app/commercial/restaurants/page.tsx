'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { ChevronLeft, ChevronRight, Store } from 'lucide-react';
import Link from 'next/link';

export default function CommercialRestaurantsPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    setLoading(true);
    apiClient.commercial.getMyRestaurants({ page, limit: 20 }).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [page]);

  const allRestaurants = data?.restaurants || [];
  const restaurants = statusFilter === 'all' ? allRestaurants : allRestaurants.filter((r: any) => r.status === statusFilter);
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#2A2A2A]">Mes restaurants</h1>
          <p className="text-sm text-gray-400 mt-1">
            {pagination ? `${pagination.total} restaurant${pagination.total > 1 ? 's' : ''} créé${pagination.total > 1 ? 's' : ''}` : 'Chargement...'}
          </p>
        </div>
        <Link href="/commercial/restaurants/new">
          <Button className="bg-[#0066FF] hover:bg-[#0052CC]">+ Nouveau</Button>
        </Link>
      </div>

      <div className="flex gap-2">
        {(['all', 'active', 'inactive'] as const).map((f) => (
          <button key={f} onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === f ? 'bg-[#0066FF] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : 'En attente'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 py-10 text-center">Chargement...</div>
      ) : restaurants.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-10">
            <Store className="h-10 w-10 mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Aucun restaurant créé pour le moment</p>
            <Link href="/commercial/restaurants/new" className="inline-block mt-3">
              <Button size="sm">Créer un premier restaurant</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {restaurants.map((r: any) => (
              <Card key={r._id} className="hover:shadow-sm transition-shadow cursor-pointer" onClick={() => window.location.href = `/commercial/restaurants/${r._id}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[#2A2A2A] truncate">{r.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate">{r.address}</div>
                      <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                        <span>{r.email}</span>
                        <span>·</span>
                        <span>Créé le {new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'inactive' ? 'bg-amber-100 text-amber-700' : r.subscription?.plan === 'pro' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {r.status === 'inactive' ? 'Paiement en attente' : r.subscription?.plan === 'pro' ? 'Pro actif' : 'Starter actif'}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="text-sm text-gray-400">Page {page} / {pagination.pages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
