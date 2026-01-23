'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { ServerUser } from '@/types';
import { toast } from 'sonner';
import { UserPlus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';

export default function ServersPage() {
  const router = useRouter();
  const [servers, setServers] = useState<ServerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const isFetchingRef = useRef(false); // Prevent multiple simultaneous calls

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Delete confirmation hook
  const { isOpen: isDeleteModalOpen, itemToDelete, isDeleting, openDeleteModal, closeDeleteModal, confirmDelete } = useDeleteConfirm({
    onDelete: async (id) => {
      await apiClient.deleteServerUser(id);
      toast.success('Serveur supprimé avec succès');
      loadServers();
    },
  });

  useEffect(() => {
    loadServers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const loadServers = async () => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) {
      console.log('Already fetching servers data, skipping...');
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      const response = await apiClient.getServerUsers();
      console.log('[ServersPage] Servers loaded:', response.servers);
      console.log('[ServersPage] Server IDs:', response.servers.map(s => ({ id: s.id, email: s.email })));
      setServers(response.servers);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des serveurs');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const handleAddServer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Email et mot de passe requis');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await apiClient.createServerUser({
        email: formData.email,
        password: formData.password,
      });

      toast.success('Serveur créé avec succès');
      setShowAddModal(false);
      setFormData({ email: '', password: '' });
      loadServers();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création du serveur');
    }
  };

  const handleEditServer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedServer) return;

    const updateData: any = {};
    if (formData.email && formData.email !== selectedServer.email) {
      updateData.email = formData.email;
    }
    if (formData.password) {
      if (formData.password.length < 6) {
        toast.error('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
      updateData.password = formData.password;
    }

    if (Object.keys(updateData).length === 0) {
      toast.error('Aucune modification détectée');
      return;
    }

    try {
      await apiClient.updateServerUser(selectedServer.id, updateData);
      toast.success('Serveur mis à jour avec succès');
      setShowEditModal(false);
      setSelectedServer(null);
      setFormData({ email: '', password: '' });
      loadServers();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour du serveur');
    }
  };

  const handleToggleStatus = async (server: ServerUser) => {
    try {
      const newStatus = server.status === 'active' ? 'inactive' : 'active';
      await apiClient.updateServerUser(server.id, { status: newStatus });
      toast.success(`Serveur ${newStatus === 'active' ? 'activé' : 'désactivé'}`);
      loadServers();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du changement de statut');
    }
  };

  const handleDeleteServer = (server: ServerUser) => {
    openDeleteModal({ id: server.id, name: server.email });
  };

  const openEditModal = (server: ServerUser) => {
    setSelectedServer(server);
    setFormData({ email: server.email, password: '' });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedServer(null);
    setFormData({ email: '', password: '' });
    setShowPassword(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Serveurs</h1>
            <p className="text-gray-600 mt-1">
              Créez des comptes serveurs avec accès limité aux réservations
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            <UserPlus size={20} />
            Ajouter un serveur
          </button>
        </div>
      </div>

      {servers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Aucun serveur créé</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer le premier serveur
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                <tr key="header">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                {servers.map((server, index) => (
                  <tr key={server.id || `server-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{server.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(server)}
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          server.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } transition-colors cursor-pointer`}
                      >
                        {server.status === 'active' ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(server.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(server)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteServer(server)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

           {/* Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {servers.map((server, index) => (
              <div key={server.id || `server-mobile-${index}`} className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {server.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Créé le {new Date(server.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(server)}
                    className={`ml-2 px-2.5 py-1 text-xs font-semibold rounded-full ${
                      server.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    } transition-colors cursor-pointer flex-shrink-0`}
                  >
                    {server.status === 'active' ? 'Actif' : 'Inactif'}
                  </button>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    onClick={() => openEditModal(server)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => handleDeleteServer(server)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Server Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ajouter un serveur</h2>
            <form onSubmit={handleAddServer}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe (min. 6 caractères)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Server Modal */}
      {showEditModal && selectedServer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Modifier le serveur</h2>
            <form onSubmit={handleEditServer}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe (optionnel, min. 6 caractères)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Laissez vide pour ne pas changer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Supprimer le serveur"
        itemName={itemToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
