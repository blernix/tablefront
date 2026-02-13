'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Restaurant, User, RestaurantAnalytics } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { Edit2, Trash2 } from 'lucide-react';

const userFormSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated, user, initAuth, isInitialized } = useAuthStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'users' | 'analytics'>('info');
  const [analytics, setAnalytics] = useState<RestaurantAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{show: boolean, userId: string | null}>({show: false, userId: null});
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  });

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [isInitialized, isAuthenticated, user, router]);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoadingUsers(true);
      const response = await apiClient.getRestaurantUsers(params.id);
      setUsers(response.users);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [params.id]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getRestaurant(params.id);
        setRestaurant(response.restaurant);
        await loadUsers();
       } catch (err) {
        toast.error('Erreur lors du chargement du restaurant');
        router.push('/admin/restaurants');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurant();
  }, [params.id, router, loadUsers]);

  useEffect(() => {
    if (activeTab === 'analytics' && restaurant) {
      const loadAnalytics = async () => {
        try {
          setIsLoadingAnalytics(true);
          const response = await apiClient.getRestaurantAnalytics(params.id, '30d');
          setAnalytics(response.analytics);
         } catch (err) {
          toast.error(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
        } finally {
          setIsLoadingAnalytics(false);
        }
      };
      loadAnalytics();
    }
  }, [activeTab, restaurant, params.id]);

  const handleCreateUser = async (data: UserFormData) => {
    try {
      setIsCreatingUser(true);
      await apiClient.createRestaurantUser(params.id, data.email, data.password);
       toast.success('Utilisateur créé avec succès !');
       reset();
     } catch (err) {
       toast.error(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setShowDeleteConfirm({ show: true, userId });
  };

  const confirmDeleteUser = async () => {
    if (!showDeleteConfirm.userId) return;
    
    try {
      setIsDeletingUser(true);
      await apiClient.deleteUser(showDeleteConfirm.userId);
      toast.success('Utilisateur supprimé avec succès');
      loadUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setIsDeletingUser(false);
      setShowDeleteConfirm({ show: false, userId: null });
    }
  };

  const handleUpdateUser = async (userId: string, data: { email?: string; password?: string }) => {
    try {
      setIsUpdatingUser(true);
      await apiClient.updateUser(userId, data);
       toast.success('Utilisateur mis à jour avec succès');
       setEditingUser(null);
       loadUsers();
     } catch (err) {
       toast.error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleRegenerateApiKey = () => {
    setShowRegenerateConfirm(true);
  };

  const confirmRegenerateApiKey = async () => {
    try {
      setIsRegeneratingKey(true);
      const response = await apiClient.regenerateApiKey(params.id);
      setNewApiKey(response.apiKey);
      toast.success('Clé API régénérée avec succès');
    } catch (err) {
      toast.error('Erreur lors de la régénération');
    } finally {
      setIsRegeneratingKey(false);
      setShowRegenerateConfirm(false);
    }
  };

  if (!isInitialized) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="p-8">Chargement...</div>;
  }

  if (isLoading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/admin/restaurants')}>
              ← Retour à la liste
            </Button>
            <div>
              <h1 className="text-xl font-bold">{restaurant.name}</h1>
              <p className="text-sm text-muted-foreground">{restaurant.address}</p>
            </div>
          </div>
        </div>
        <div className="border-t">
          <div className="container mx-auto px-4">
            <div className="flex border-b">
              <button
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('info')}
              >
                Informations
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('users')}
              >
                Utilisateurs
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Statistiques
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'info' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du restaurant</CardTitle>
                <CardDescription>Détails et configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" value={restaurant.name} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={restaurant.email} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" value={restaurant.phone} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" value={restaurant.address} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <Input id="status" value={restaurant.status} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="createdAt">Créé le</Label>
                    <Input
                      id="createdAt"
                      value={new Date(restaurant.createdAt).toLocaleDateString('fr-FR')}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Clé API</h3>
                      <p className="text-sm text-muted-foreground">
                        Utilisée pour l&apos;intégration avec les applications externes
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleRegenerateApiKey}>
                      Régénérer la clé
                    </Button>
                  </div>
                  {newApiKey && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm font-medium text-green-800">Nouvelle clé générée :</p>
                      <code className="text-sm font-mono bg-white p-2 rounded border block mt-1">
                        {newApiKey}
                      </code>
                      <p className="text-xs text-green-600 mt-1">
                        Copiez cette clé maintenant, elle ne sera plus affichée.
                      </p>
                    </div>
                  )}
                  {restaurant.apiKey && !newApiKey && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">
                        Une clé API existe déjà pour ce restaurant.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs du restaurant</CardTitle>
                <CardDescription>Gérez les accès au tableau de bord du restaurant</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="email@exemple.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        placeholder="Minimum 6 caractères"
                      />
                      {errors.password && (
                        <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" disabled={isCreatingUser}>
                        {isCreatingUser ? 'Création...' : 'Créer utilisateur'}
                      </Button>
                    </div>
                  </div>
                </form>

                {isLoadingUsers ? (
                  <div className="text-center py-4">Chargement des utilisateurs...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun utilisateur. Créez-en un pour permettre l&apos;accès au tableau de bord du restaurant.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between border rounded-lg p-4"
                      >
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.role} • Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mt-1 ${
                              user.status === 'active'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques du restaurant</CardTitle>
                <CardDescription>
                  Analyse des réservations et performance du restaurant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Consultez les statistiques détaillées de votre restaurant pour analyser les tendances, 
                    les créneaux horaires les plus populaires et les performances globales.
                  </p>
                  <Button onClick={() => router.push(`/admin/restaurants/${params.id}/analytics`)}>
                    Voir les statistiques détaillées
                  </Button>
                </div>

                {isLoadingAnalytics ? (
                  <div className="text-center py-8">Chargement des statistiques...</div>
                ) : analytics ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-2xl">{analytics.summary.totalReservations}</CardTitle>
                          <CardDescription>Réservations totales</CardDescription>
                        </CardHeader>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-2xl">{analytics.summary.totalGuests}</CardTitle>
                          <CardDescription>Total couverts</CardDescription>
                        </CardHeader>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-2xl">{analytics.summary.occupationRate}%</CardTitle>
                          <CardDescription>Taux d&apos;occupation</CardDescription>
                        </CardHeader>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-2xl">{analytics.summary.estimatedRevenue.toFixed(2)} €</CardTitle>
                          <CardDescription>Revenu estimé</CardDescription>
                        </CardHeader>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Répartition par statut</CardTitle>
                          <CardDescription>Distribution des réservations</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {Object.entries(analytics.statusDistribution).map(([status, count]) => (
                              <div key={status} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    status === 'confirmed' ? 'bg-green-500' :
                                    status === 'pending' ? 'bg-yellow-500' :
                                    status === 'completed' ? 'bg-blue-500' : 'bg-gray-500'
                                  }`} />
                                  <span className="font-medium capitalize">{status}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="font-bold">{count}</span>
                                  <span className="text-sm text-muted-foreground">
                                    ({((count / analytics.summary.totalReservations) * 100).toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Créneaux horaires populaires</CardTitle>
                          <CardDescription>Top 3 des heures les plus réservées</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {analytics.topTimeSlots.slice(0, 3).map((slot) => (
                              <div key={slot.hour} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="font-bold text-blue-700">{slot.hour}</span>
                                  </div>
                                  <span className="font-medium">{slot.hour}:00</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-lg font-bold">{slot.count}</span>
                                  <p className="text-sm text-muted-foreground">réservations</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune donnée statistique disponible pour le moment.
                    Les statistiques apparaîtront après les premières réservations.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modal d'édition d'utilisateur */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Modifier l&apos;utilisateur</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleUpdateUser(editingUser.id, {
                email: formData.get('email') as string,
                password: formData.get('password') as string || undefined,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={editingUser.email}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-password">Mot de passe (laisser vide pour ne pas changer)</Label>
                  <Input
                    id="edit-password"
                    name="password"
                    type="password"
                    placeholder="Nouveau mot de passe"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isUpdatingUser}>
                    {isUpdatingUser ? 'Mise à jour...' : 'Mettre à jour'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation pour suppression d'utilisateur */}
      <ConfirmationModal
        isOpen={showDeleteConfirm.show}
        onClose={() => setShowDeleteConfirm({ show: false, userId: null })}
        onConfirm={confirmDeleteUser}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        confirmText="Supprimer"
        variant="destructive"
        isLoading={isDeletingUser}
      />

      {/* Modal de confirmation pour régénération de clé API */}
      <ConfirmationModal
        isOpen={showRegenerateConfirm}
        onClose={() => setShowRegenerateConfirm(false)}
        onConfirm={confirmRegenerateApiKey}
        title="Régénérer la clé API"
        message="Régénérer la clé API ? L'ancienne clé ne fonctionnera plus. Assurez-vous de mettre à jour toutes les applications utilisant cette clé."
        confirmText="Régénérer"
        variant="default"
        isLoading={isRegeneratingKey}
      />
    </div>
  );
}
