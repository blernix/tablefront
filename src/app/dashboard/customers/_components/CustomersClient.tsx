'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useCustomers, useUpdateCustomer, useCreateCustomer } from '@/hooks/api/useCustomers';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Eye, Pencil, X, Check, ChevronLeft, ChevronRight, Calendar, Ban, Download, FileSpreadsheet, UserPlus, Loader2, Filter } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

const TAG_OPTIONS = ['VIP', 'Fidèle', 'Régulier', 'À risque'];

export default function CustomersClient() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [tag, setTag] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', tags: [] as string[], notes: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', phone: '', tags: [] as string[], notes: '', marketingConsent: false });

  const { data, isLoading } = useCustomers({ page, limit: 20, search: search || undefined, sort: sort || undefined, tag: tag || undefined });
  const updateCustomer = useUpdateCustomer();
  const createCustomer = useCreateCustomer();
  const customers = data?.customers ?? [];
  const pagination = data?.pagination;

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditForm({ name: customer.name, phone: customer.phone, tags: [...customer.tags], notes: customer.notes || '' });
  };
  const handleCloseEdit = () => setEditingCustomer(null);
  const handleOpenCreate = () => { setCreateForm({ name: '', email: '', phone: '', tags: [], notes: '', marketingConsent: false }); setShowCreateModal(true); };
  const handleCloseCreate = () => setShowCreateModal(false);
  const handleCreate = async () => { await createCustomer.mutateAsync(createForm); handleCloseCreate(); };
  const handleSave = async () => { if (!editingCustomer) return; await updateCustomer.mutateAsync({ id: editingCustomer._id, data: editForm }); handleCloseEdit(); };
  const toggleTag = (tagName: string) => setEditForm((prev) => ({ ...prev, tags: prev.tags.includes(tagName) ? prev.tags.filter((t) => t !== tagName) : [...prev.tags, tagName] }));

  const handleExport = async (fmt: 'csv' | 'json') => {
    try {
      const response = await apiClient.customers.exportCustomers({ tag: tag || undefined, format: fmt });
      if (!response.ok) throw new Error('Erreur export');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `clients.${fmt}`; a.click();
      URL.revokeObjectURL(url); toast.success('Export téléchargé');
    } catch { toast.error("Erreur lors de l'export"); }
  };

  const tagVariant = (t: string) => t === 'VIP' ? 'warning' : t === 'À risque' ? 'danger' : t === 'Fidèle' ? 'success' : 'info';

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Clients</h1>
          <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">
            {pagination ? `${pagination.total} client${pagination.total !== 1 ? 's' : ''}` : 'Chargement...'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleOpenCreate} size="sm" className="h-10 rounded-xl text-[13px] font-medium md:h-9 md:text-xs"><UserPlus className="h-4 w-4 md:mr-1.5" /><span className="hidden md:inline">Client</span></Button>
          {(customers.length > 0 || tag) && (
            <>
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')} className="h-10 rounded-xl text-[13px] font-medium md:h-9 md:text-xs"><Download className="h-4 w-4 md:mr-1.5" /><span className="hidden md:inline">CSV</span></Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('json')} className="h-10 rounded-xl text-[13px] font-medium md:h-9 md:text-xs"><FileSpreadsheet className="h-4 w-4 md:mr-1.5" /><span className="hidden md:inline">JSON</span></Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-3 md:p-4 flex flex-col gap-2 md:flex-row border-b border-[#E5E5EA]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" />
            <input placeholder="Rechercher..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] md:text-sm" />
          </div>
          <div className="flex gap-2">
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="h-10 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[13px] text-[#000000] focus:outline-none focus:border-[#0066FF] appearance-none md:text-xs">
              <option value="">Tri: Fréquentation ↓</option>
              <option value="recent">Dernière visite ↓</option>
              <option value="oldest">Dernière visite ↑</option>
              <option value="name">Nom A-Z</option>
              <option value="first">Première visite</option>
            </select>
            <select value={tag} onChange={(e) => { setTag(e.target.value); setPage(1); }}
              className="h-10 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[13px] text-[#000000] focus:outline-none focus:border-[#0066FF] appearance-none md:text-xs">
              <option value="">Tous les tags</option>
              {TAG_OPTIONS.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
        </div>

        <div className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-[#8E8E93]"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : customers.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 px-4">
              <div className="h-12 w-12 rounded-2xl bg-[#F2F2F7] flex items-center justify-center"><Users className="h-6 w-6 text-[#C7C7CC]" /></div>
              <p className="text-[15px] font-medium text-[#8E8E93] md:text-sm">Aucun client trouvé</p>
              <p className="text-[12px] text-[#C7C7CC] text-center md:text-xs">Les clients apparaissent après vos premières réservations.</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-[#E5E5EA] md:hidden">
                {customers.map((customer) => (
                  <div key={customer._id} className="p-4 active:bg-[#F2F2F7] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1" onClick={() => router.push(`/dashboard/customers/${customer._id}`)}>
                        <p className="text-[15px] font-semibold text-[#000000] truncate">{customer.name}</p>
                        <p className="text-[12px] text-[#8E8E93] truncate mt-0.5">{customer.email}</p>
                        {customer.phone && <p className="text-[12px] text-[#C7C7CC]">{customer.phone}</p>}
                      </div>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <button onClick={() => router.push(`/dashboard/customers/${customer._id}`)} className="h-9 w-9 flex items-center justify-center rounded-lg text-[#8E8E93] active:bg-[#F2F2F7]"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleOpenEdit(customer)} className="h-9 w-9 flex items-center justify-center rounded-lg text-[#8E8E93] active:bg-[#F2F2F7]"><Pencil className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-[12px] text-[#8E8E93] md:text-xs">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{customer.totalReservations} résa{customer.totalReservations > 1 ? 's' : ''}</span>
                      {customer.cancelledReservations > 0 && <span className="flex items-center gap-1 text-red-500"><Ban className="h-3 w-3" />{customer.cancelledReservations}</span>}
                      <span>{customer.lastVisit ? format(new Date(customer.lastVisit), 'dd MMM', { locale: fr }) : '-'}</span>
                    </div>
                    {customer.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {customer.tags.map((t) => (<Badge key={t} variant={tagVariant(t)}>{t}</Badge>))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E5EA] text-left text-xs font-medium uppercase tracking-wider text-[#8E8E93]">
                      <th className="px-4 py-3">Client</th><th className="px-4 py-3 text-center">Résas</th><th className="px-4 py-3 text-center">Annul.</th>
                      <th className="px-4 py-3">Dernière visite</th><th className="px-4 py-3">Tags</th><th className="px-4 py-3 w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5EA]">
                    {customers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-[#F2F2F7]/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#000000]">{customer.name}</p>
                          <p className="text-xs text-[#8E8E93]">{customer.email}</p>
                          {customer.phone && <p className="text-xs text-[#C7C7CC]">{customer.phone}</p>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <p className="font-semibold text-[#000000]">{customer.totalReservations}</p>
                          <p className="text-[10px] text-[#8E8E93]">{customer.averageGuests} pers./résa</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <p className="font-semibold text-[#000000]">{customer.cancelledReservations}</p>
                          {(customer.cancellationRate ?? 0) > 0 && <Badge variant={((customer.cancellationRate ?? 0) > 30) ? 'danger' : 'outline'}>{customer.cancellationRate}%</Badge>}
                        </td>
                        <td className="px-4 py-3 text-[#8E8E93]">{customer.lastVisit ? format(new Date(customer.lastVisit), 'dd MMM yyyy', { locale: fr }) : '-'}</td>
                        <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{customer.tags.map((t) => (<Badge key={t} variant={tagVariant(t)}>{t}</Badge>))}</div></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => router.push(`/dashboard/customers/${customer._id}`)} className="h-8 w-8 flex items-center justify-center rounded-lg text-[#8E8E93] hover:bg-[#F2F2F7]"><Eye className="h-4 w-4" /></button>
                            <button onClick={() => handleOpenEdit(customer)} className="h-8 w-8 flex items-center justify-center rounded-lg text-[#8E8E93] hover:bg-[#F2F2F7]"><Pencil className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between border-t border-[#E5E5EA] p-3 md:p-4">
                  <p className="text-[12px] text-[#8E8E93] md:text-xs">Page {pagination.page} / {pagination.pages}</p>
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="h-9 w-9 p-0 rounded-lg md:h-8 md:w-8"><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(Math.min(pagination.pages, page + 1))} disabled={page === pagination.pages} className="h-9 w-9 p-0 rounded-lg md:h-8 md:w-8"><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={handleCloseEdit}>
          <div className="w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#E5E5EA]">
              <h3 className="text-[17px] font-semibold text-[#000000] md:text-lg">{editingCustomer.name}</h3>
              <button onClick={handleCloseEdit} className="h-8 w-8 rounded-full flex items-center justify-center text-[#8E8E93] active:bg-[#F2F2F7]"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 md:p-5 space-y-4 pb-[calc(1rem+3.5rem+env(safe-area-inset-bottom,0px))] md:pb-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Nom</label>
                <input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Téléphone</label>
                <input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_OPTIONS.map((t) => (
                    <button key={t} type="button" onClick={() => toggleTag(t)}
                      className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${editForm.tags.includes(t) ? 'bg-[#0066FF] text-white' : 'bg-[#F2F2F7] text-[#8E8E93] active:bg-[#E5E5EA]'} md:text-xs`}>
                      {editForm.tags.includes(t) && <Check className="h-3 w-3 inline mr-1" />}{t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Notes</label>
                <textarea value={editForm.notes} onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes visibles uniquement par le restaurant..." rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 resize-none md:text-sm" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={handleCloseEdit} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:flex-none md:h-10 md:text-sm">Annuler</Button>
                <Button onClick={handleSave} disabled={updateCustomer.isPending} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:flex-none md:h-10 md:text-sm">
                  {updateCustomer.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}{updateCustomer.isPending ? 'Enregistrement...' : 'Valider'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={handleCloseCreate}>
          <div className="w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#E5E5EA]">
              <h3 className="text-[17px] font-semibold text-[#000000] md:text-lg">Nouveau client</h3>
              <button onClick={handleCloseCreate} className="h-8 w-8 rounded-full flex items-center justify-center text-[#8E8E93] active:bg-[#F2F2F7]"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 md:p-5 space-y-4 pb-[calc(1rem+3.5rem+env(safe-area-inset-bottom,0px))] md:pb-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Nom complet *</label>
                <input value={createForm.name} onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))} placeholder="Jean Dupont"
                  className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Email *</label>
                <input type="email" value={createForm.email} onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))} placeholder="jean@exemple.fr"
                  className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Téléphone *</label>
                <input value={createForm.phone} onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))} placeholder="06 12 34 56 78"
                  className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_OPTIONS.map((t) => {
                    const active = createForm.tags.includes(t);
                    return (
                      <button key={t} type="button" onClick={() => setCreateForm((p) => ({ ...p, tags: active ? p.tags.filter((x) => x !== t) : [...p.tags, t] }))}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${active ? 'bg-[#0066FF] text-white' : 'bg-[#F2F2F7] text-[#8E8E93] active:bg-[#E5E5EA]'} md:text-xs`}>
                        {active && <Check className="h-3 w-3 inline mr-1" />}{t}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Notes</label>
                <textarea value={createForm.notes} onChange={(e) => setCreateForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Préférences, remarques..." rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 resize-none md:text-sm" />
              </div>
              <label className="flex items-start gap-2">
                <input type="checkbox" checked={createForm.marketingConsent} onChange={(e) => setCreateForm((p) => ({ ...p, marketingConsent: e.target.checked }))} className="mt-0.5 h-5 w-5 rounded border-[#E5E5EA] text-[#0066FF] flex-shrink-0" />
                <span className="text-[12px] text-[#8E8E93] md:text-xs">Consentement marketing — le client accepte de recevoir des offres par email</span>
              </label>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={handleCloseCreate} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:flex-none md:h-10 md:text-sm">Annuler</Button>
                <Button onClick={handleCreate} disabled={createCustomer.isPending || !createForm.name || !createForm.email || !createForm.phone} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:flex-none md:h-10 md:text-sm">
                  {createCustomer.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}{createCustomer.isPending ? 'Création...' : 'Valider'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
