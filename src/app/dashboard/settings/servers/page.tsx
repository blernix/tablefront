'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api';
import { ServerUser } from '@/types';
import { toast } from 'sonner';
import { UserPlus, Trash2, Edit2, Eye, EyeOff, ArrowLeft, Loader2, X } from 'lucide-react';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { FeatureUpgradeSection } from '@/features';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/formatters';

export default function ServersPage() {
  const router = useRouter();
  const [servers, setServers] = useState<ServerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const isFetchingRef = useRef(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { isOpen: isDeleteModalOpen, itemToDelete, isDeleting, openDeleteModal, closeDeleteModal, confirmDelete } = useDeleteConfirm({
    onDelete: async (id) => { await apiClient.deleteServerUser(id); toast.success('Serveur supprimé ✓'); loadServers(); },
  });

  useEffect(() => { loadServers(); }, []); // eslint-disable-line

  const loadServers = async () => {
    if (isFetchingRef.current) return;
    try { isFetchingRef.current = true; setLoading(true); const r = await apiClient.getServerUsers(); setServers(r.servers); }
    catch (e: any) { toast.error(e.message || 'Erreur'); }
    finally { setLoading(false); isFetchingRef.current = false; }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { toast.error('Email et mot de passe requis'); return; }
    if (formData.password.length < 6) { toast.error('Mot de passe : 6 caractères minimum'); return; }
    try { await apiClient.createServerUser({ email: formData.email, password: formData.password }); toast.success('Serveur créé ✓'); setShowAddModal(false); setFormData({ email: '', password: '' }); loadServers(); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer) return;
    const d: any = {};
    if (formData.email && formData.email !== selectedServer.email) d.email = formData.email;
    if (formData.password) { if (formData.password.length < 6) { toast.error('6 caractères minimum'); return; } d.password = formData.password; }
    if (!Object.keys(d).length) { toast.error('Aucune modification'); return; }
    try { await apiClient.updateServerUser(selectedServer.id, d); toast.success('Serveur mis à jour ✓'); closeModals(); loadServers(); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleToggleStatus = async (s: ServerUser) => {
    const ns = s.status === 'active' ? 'inactive' : 'active';
    try { await apiClient.updateServerUser(s.id, { status: ns }); toast.success(`Serveur ${ns === 'active' ? 'activé' : 'désactivé'}`); loadServers(); }
    catch (e: any) { toast.error(e.message); }
  };

  const openEditModal = (s: ServerUser) => { setSelectedServer(s); setFormData({ email: s.email, password: '' }); setShowEditModal(true); };
  const closeModals = () => { setShowAddModal(false); setShowEditModal(false); setSelectedServer(null); setFormData({ email: '', password: '' }); setShowPassword(false); };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded-lg w-40 animate-pulse" />
        <div className="h-48 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <FeatureUpgradeSection feature="team-management">
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Serveurs</h1>
            <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">{servers.length} compte{servers.length !== 1 ? 's' : ''} serveur{servers.length !== 1 ? 's' : ''}</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="h-10 rounded-xl text-[13px] font-medium md:h-9 md:text-xs"><UserPlus className="h-4 w-4 md:mr-1.5" /><span className="hidden md:inline">Ajouter</span></Button>
        </div>

        {servers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-8 text-center md:rounded-xl">
            <div className="h-14 w-14 rounded-2xl bg-[#F2F2F7] flex items-center justify-center mx-auto mb-4"><UserPlus className="h-6 w-6 text-[#C7C7CC]" /></div>
            <p className="text-[15px] font-medium text-[#8E8E93] mb-4 md:text-sm">Aucun serveur créé</p>
            <Button onClick={() => setShowAddModal(true)} className="rounded-xl"><UserPlus className="mr-1.5 h-4 w-4" /> Créer un serveur</Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E5EA] text-left text-xs font-medium uppercase tracking-wider text-[#8E8E93]">
                    <th className="px-4 py-3">Email</th><th className="px-4 py-3">Statut</th><th className="px-4 py-3">Créé le</th><th className="px-4 py-3 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5EA]">
                  {servers.map((s, i) => (
                    <tr key={s.id || i} className="hover:bg-[#F2F2F7]/50">
                      <td className="px-4 py-3 font-medium text-[#000000]">{s.email}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggleStatus(s)} className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                          {s.status === 'active' ? 'Actif' : 'Inactif'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-[#8E8E93]">{formatDate(s.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEditModal(s)} className="h-8 w-8 flex items-center justify-center rounded-lg text-[#8E8E93] hover:bg-[#F2F2F7]"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => openDeleteModal({ id: s.id, name: s.email })} className="h-8 w-8 flex items-center justify-center rounded-lg text-[#8E8E93] hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-[#E5E5EA] md:hidden">
              {servers.map((s, i) => (
                <div key={s.id || i} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-[#000000] truncate">{s.email}</p>
                      <p className="text-[12px] text-[#8E8E93] mt-0.5">Créé le {formatDate(s.createdAt)}</p>
                    </div>
                    <button onClick={() => handleToggleStatus(s)} className={`ml-2 px-2.5 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {s.status === 'active' ? 'Actif' : 'Inactif'}
                    </button>
                  </div>
                  <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-[#E5E5EA]">
                    <button onClick={() => openEditModal(s)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] text-[#8E8E93] active:bg-[#F2F2F7] active:text-[#0066FF]"><Edit2 className="h-4 w-4" />Modifier</button>
                    <button onClick={() => openDeleteModal({ id: s.id, name: s.email })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] text-[#8E8E93] active:bg-red-50 active:text-red-500"><Trash2 className="h-4 w-4" />Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={closeModals}>
            <div className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#E5E5EA]">
                <h3 className="text-[17px] font-semibold text-[#000000] md:text-lg">Ajouter un serveur</h3>
                <button onClick={closeModals} className="h-8 w-8 rounded-full flex items-center justify-center text-[#8E8E93] active:bg-[#F2F2F7]"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="p-4 md:p-5 space-y-4 pb-[calc(1rem+3.5rem+env(safe-area-inset-bottom,0px))] md:pb-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Mot de passe (min. 6)</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} minLength={6}
                      className="w-full h-11 px-3 pr-10 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] active:text-[#0066FF]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={closeModals} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:h-10 md:text-sm">Annuler</Button>
                  <Button type="submit" className="flex-1 h-11 rounded-xl text-[15px] font-medium md:h-10 md:text-sm">Valider</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit modal */}
        {showEditModal && selectedServer && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={closeModals}>
            <div className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#E5E5EA]">
                <h3 className="text-[17px] font-semibold text-[#000000] md:text-lg">Modifier</h3>
                <button onClick={closeModals} className="h-8 w-8 rounded-full flex items-center justify-center text-[#8E8E93] active:bg-[#F2F2F7]"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleEdit} className="p-4 md:p-5 space-y-4 pb-[calc(1rem+3.5rem+env(safe-area-inset-bottom,0px))] md:pb-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Nouveau mot de passe (optionnel)</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Laisser vide = inchangé" minLength={6}
                      className="w-full h-11 px-3 pr-10 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] active:text-[#0066FF]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={closeModals} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:h-10 md:text-sm">Annuler</Button>
                  <Button type="submit" className="flex-1 h-11 rounded-xl text-[15px] font-medium md:h-10 md:text-sm">Valider</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={confirmDelete} title="Supprimer le serveur" itemName={itemToDelete?.name} isLoading={isDeleting} />
      </div>
    </FeatureUpgradeSection>
  );
}
