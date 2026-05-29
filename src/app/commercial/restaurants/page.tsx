'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { ChevronLeft, ChevronRight, Store, Search, X, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CommercialRestaurantsPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setLoading(true); apiClient.commercial.getMyRestaurants({ page, limit: 20, search: searchQuery || undefined }).then(setData).catch(() => {}).finally(() => setLoading(false)); }, [page, searchQuery]);

  const handleSearch = (v: string) => { setSearchInput(v); if (timeout.current) clearTimeout(timeout.current); timeout.current = setTimeout(() => { setSearchQuery(v); setPage(1); }, 300); };

  const all = data?.restaurants || [];
  const restaurants = statusFilter === 'all' ? all : all.filter((r: any) => r.status === statusFilter);
  const pagination = data?.pagination;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Restaurants</h1>
          <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">{pagination ? `${pagination.total} restaurant${pagination.total > 1 ? 's' : ''}` : 'Chargement...'}</p>
        </div>
        <Link href="/commercial/restaurants/new"><Button className="h-10 rounded-xl text-[13px] font-medium md:h-9 md:text-xs hidden md:inline-flex"><Plus className="h-4 w-4 mr-1.5" /> Nouveau</Button></Link>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors md:text-xs ${statusFilter === f ? 'bg-[#0066FF] text-white' : 'text-[#8E8E93] active:bg-[#F2F2F7]'}`}>
              {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : 'En attente'}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" />
          <input value={searchInput} onChange={(e) => handleSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] md:text-sm" />
          {searchInput && <button onClick={() => { setSearchInput(''); setSearchQuery(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full text-[#8E8E93] active:bg-[#F2F2F7]"><X className="h-3.5 w-3.5" /></button>}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => (<div key={i} className="h-20 bg-slate-200 rounded-2xl animate-pulse" />))}</div>
      ) : restaurants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-8 text-center md:rounded-xl">
          <div className="h-12 w-12 rounded-2xl bg-[#F2F2F7] flex items-center justify-center mx-auto mb-4"><Store className="h-6 w-6 text-[#C7C7CC]" /></div>
          <p className="text-[15px] font-medium text-[#8E8E93] mb-4 md:text-sm">Aucun restaurant</p>
          <Link href="/commercial/restaurants/new"><Button size="sm" className="rounded-xl">Créer un restaurant</Button></Link>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {restaurants.map((r: any) => (
              <Link key={r._id} href={`/commercial/restaurants/${r._id}`} className="block bg-white rounded-2xl border border-[#E5E5EA] p-4 active:bg-[#F2F2F7] transition-colors md:rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-[#000000] truncate md:text-base">{r.name}</p>
                    <p className="text-[12px] text-[#8E8E93] mt-0.5 truncate md:text-sm">{r.address}</p>
                    <p className="text-[12px] text-[#8E8E93] mt-1 md:text-sm">{r.email} · {new Date(r.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ml-2 flex-shrink-0 md:text-xs ${r.status === 'inactive' ? 'bg-amber-50 text-amber-700' : r.subscription?.plan === 'pro' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-[#0066FF]'}`}>
                    {r.status === 'inactive' ? 'En attente' : r.subscription?.plan === 'pro' ? 'Pro' : 'Starter'}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="h-9 w-9 p-0 rounded-lg md:h-8 md:w-8"><ChevronLeft className="h-4 w-4" /></Button>
              <span className="text-[13px] text-[#8E8E93] md:text-xs">Page {page} / {pagination.pages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages} className="h-9 w-9 p-0 rounded-lg md:h-8 md:w-8"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
