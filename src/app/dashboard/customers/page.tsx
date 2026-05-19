'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useCustomers, useUpdateCustomer, useCreateCustomer } from '@/hooks/api/useCustomers';
import { formatDate } from '@/lib/formatters';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Search,
  Eye,
  Pencil,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Ban,
  Download,
  FileSpreadsheet,
  UserPlus,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

const TAG_OPTIONS = ['VIP', 'Fidèle', 'Régulier', 'À risque'];

export default function CustomersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [tag, setTag] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', tags: [] as string[], notes: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    tags: [] as string[],
    notes: '',
    marketingConsent: false,
  });

  const { data, isLoading } = useCustomers({ page, limit: 20, search: search || undefined, sort: sort || undefined, tag: tag || undefined });
  const updateCustomer = useUpdateCustomer();
  const createCustomer = useCreateCustomer();

  const customers = data?.customers ?? [];
  const pagination = data?.pagination;

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditForm({
      name: customer.name,
      phone: customer.phone,
      tags: [...customer.tags],
      notes: customer.notes || '',
    });
  };

  const handleCloseEdit = () => {
    setEditingCustomer(null);
  };

  const handleOpenCreate = () => {
    setCreateForm({ name: '', email: '', phone: '', tags: [], notes: '', marketingConsent: false });
    setShowCreateModal(true);
  };

  const handleCloseCreate = () => {
    setShowCreateModal(false);
  };

  const handleCreate = async () => {
    await createCustomer.mutateAsync(createForm);
    handleCloseCreate();
  };

  const handleSave = async () => {
    if (!editingCustomer) return;
    await updateCustomer.mutateAsync({ id: editingCustomer._id, data: editForm });
    handleCloseEdit();
  };

  const toggleTag = (tagName: string) => {
    setEditForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagName) ? prev.tags.filter((t) => t !== tagName) : [...prev.tags, tagName],
    }));
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const response = await apiClient.customers.exportCustomers({ tag: tag || undefined, format });
      if (!response.ok) throw new Error('Erreur export');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clients.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export téléchargé');
    } catch {
      toast.error('Erreur lors de l\'export');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-light tracking-tight text-[#2A2A2A]">Clients</h1>
          <p className="mt-1 text-sm sm:text-base text-[#666666] font-light">
            {pagination ? `${pagination.total} client${pagination.total !== 1 ? 's' : ''} enregistré${pagination.total !== 1 ? 's' : ''}` : 'Chargement...'}
          </p>
        </div>
        {(customers.length > 0 || tag) && (
          <div className="flex gap-2">
            <Button onClick={handleOpenCreate} size="sm" className="bg-[#0066FF] hover:bg-[#0052CC]">
              <UserPlus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Client</span>
            </Button>
            {(customers.length > 0 || tag) && (
              <>
                <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                  <Download className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">CSV</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                  <FileSpreadsheet className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">JSON</span>
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {(customers.length > 0 || tag) && (
        <p className="text-xs text-[#999999] -mt-2">
          L&apos;export inclut uniquement les clients ayant accepté de recevoir des emails marketing (RGPD).
        </p>
      )}

      <Card>
        <CardHeader className="p-4 sm:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
              <Users className="h-5 w-5 text-[#666666]" />
              <span className="hidden sm:inline">Fichier clients</span>
              <span className="sm:hidden">Clients</span>
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666666]" />
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full sm:w-48 pl-9"
                />
              </div>
              <select
                className="w-full sm:w-auto border border-[#E5E5E5] bg-white px-3 py-2 text-sm font-light text-[#2A2A2A]"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
              >
                <option value="">Tri: Fréquentation ↓</option>
                <option value="recent">Dernière visite ↓</option>
                <option value="oldest">Dernière visite ↑</option>
                <option value="name">Nom A-Z</option>
                <option value="first">Première visite</option>
              </select>
              <select
                className="w-full sm:w-auto border border-[#E5E5E5] bg-white px-3 py-2 text-sm font-light text-[#2A2A2A]"
                value={tag}
                onChange={(e) => { setTag(e.target.value); setPage(1); }}
              >
                <option value="">Tous les tags</option>
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-10 sm:pt-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-[#666666]">Chargement...</div>
          ) : customers.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-[#666666]">
              <Users className="h-10 w-10" />
              <p className="text-lg font-light">Aucun client trouvé</p>
              <p className="text-sm text-center">Les clients apparaîtront automatiquement après vos premières réservations.</p>
            </div>
          ) : (
            <>
              {/* Mobile: card list */}
              <div className="space-y-3 md:hidden">
                {customers.map((customer) => (
                  <div
                    key={customer._id}
                    className="rounded-lg border border-[#E5E5E5] p-3 transition-colors active:bg-[#FAFAFA]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1" onClick={() => router.push(`/dashboard/customers/${customer._id}`)}>
                        <p className="font-medium text-[#2A2A2A] truncate">{customer.name}</p>
                        <p className="text-xs text-[#666666] truncate">{customer.email}</p>
                        {customer.phone && (
                          <p className="text-xs text-[#999999]">{customer.phone}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => router.push(`/dashboard/customers/${customer._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleOpenEdit(customer)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-[#666666]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {customer.totalReservations} résa{customer.totalReservations > 1 ? 's' : ''}
                      </span>
                      {customer.cancelledReservations > 0 && (
                        <span className="flex items-center gap-1 text-red-600">
                          <Ban className="h-3 w-3" />
                          {customer.cancelledReservations}
                        </span>
                      )}
                      <span>
                        {customer.lastVisit ? format(new Date(customer.lastVisit), 'dd MMM', { locale: fr }) : '-'}
                      </span>
                    </div>
                    {customer.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {customer.tags.map((t) => (
                          <Badge key={t} variant={t === 'VIP' ? 'warning' : t === 'À risque' ? 'danger' : t === 'Fidèle' ? 'success' : 'info'}>
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E5E5] text-left text-xs font-medium uppercase tracking-[0.2em] text-[#666666]">
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Réservations</th>
                      <th className="px-4 py-3">Annulations</th>
                      <th className="px-4 py-3">Dernière visite</th>
                      <th className="px-4 py-3">Tags</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {customers.map((customer) => (
                      <tr key={customer._id} className="transition-colors hover:bg-[#FAFAFA]">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-[#2A2A2A]">{customer.name}</p>
                            <p className="text-xs text-[#666666]">{customer.email}</p>
                            {customer.phone && (
                              <p className="text-xs text-[#999999]">{customer.phone}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-center">
                            <p className="text-lg font-light text-[#2A2A2A]">{customer.totalReservations}</p>
                            <p className="text-xs text-[#666666]">{customer.averageGuests} pers./résa</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-center">
                            <p className="text-lg font-light text-[#2A2A2A]">{customer.cancelledReservations}</p>
                            {(customer.cancellationRate ?? 0) > 0 && (
                              <Badge variant={((customer.cancellationRate ?? 0) > 30) ? 'danger' : 'outline'}>
                                {customer.cancellationRate}%
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#666666]">
                          {customer.lastVisit ? format(new Date(customer.lastVisit), 'dd MMM yyyy', { locale: fr }) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {customer.tags.map((t) => (
                              <Badge key={t} variant={t === 'VIP' ? 'warning' : t === 'À risque' ? 'danger' : t === 'Fidèle' ? 'success' : 'info'}>
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dashboard/customers/${customer._id}`)}
                              title="Voir détails"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(customer)}
                              title="Modifier"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E5E5] pt-4">
                  <p className="text-sm text-[#666666]">
                    Page {pagination.page} sur {pagination.pages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                      disabled={page === pagination.pages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
          <Card className="w-full sm:max-w-lg rounded-b-none sm:rounded-b-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-4 sm:p-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-2xl">Modifier {editingCustomer.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCloseEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-10 sm:pt-0">
              <div>
                <Label>Nom</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <Label className="mb-2 block">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`inline-flex items-center gap-1 border px-3 py-1.5 sm:py-1 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                        editForm.tags.includes(t)
                          ? 'border-[#0066FF] bg-[#0066FF] text-white'
                          : 'border-[#E5E5E5] bg-white text-[#666666] hover:border-[#CCCCCC]'
                      }`}
                    >
                      {editForm.tags.includes(t) && <Check className="h-3 w-3" />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Notes internes</Label>
                <Textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Notes visibles uniquement par le restaurant..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={handleCloseEdit}>Annuler</Button>
                <Button onClick={handleSave} disabled={updateCustomer.isPending}>
                  {updateCustomer.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
          <Card className="w-full sm:max-w-lg rounded-b-none sm:rounded-b-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-4 sm:p-10">
              <div className="flex items-center justify-between">
                <CardTitle>Nouveau client</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCloseCreate}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:px-10 sm:pb-10 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Nom complet *</Label>
                <Input
                  id="create-name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">Email *</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="jean@exemple.fr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-phone">Téléphone *</Label>
                <Input
                  id="create-phone"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_OPTIONS.map((t) => {
                    const active = createForm.tags.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setCreateForm((p) => ({
                            ...p,
                            tags: active ? p.tags.filter((x) => x !== t) : [...p.tags, t],
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          active
                            ? 'bg-[#0066FF]/10 border-[#0066FF]/30 text-[#0066FF]'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {active && <Check className="h-3 w-3 inline mr-1" />}
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-notes">Notes</Label>
                <Textarea
                  id="create-notes"
                  value={createForm.notes}
                  onChange={(e) => setCreateForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Préférences, remarques..."
                  rows={2}
                />
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createForm.marketingConsent}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, marketingConsent: e.target.checked }))
                  }
                  className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#0066FF]"
                />
                <span className="text-xs text-gray-500">
                  Consentement marketing — le client accepte de recevoir des offres par email
                </span>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={handleCloseCreate}>
                  Annuler
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={createCustomer.isPending || !createForm.name || !createForm.email || !createForm.phone}
                  className="bg-[#0066FF] hover:bg-[#0052CC]"
                >
                  {createCustomer.isPending ? 'Création...' : 'Créer le client'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
