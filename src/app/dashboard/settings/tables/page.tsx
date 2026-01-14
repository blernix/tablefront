'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { Restaurant, TableType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Plus, Trash2, Table2 } from 'lucide-react';

const simpleFormSchema = z.object({
  totalTables: z.string().min(1, 'Le nombre de tables est requis'),
  averageCapacity: z.string().min(1, 'La capacité moyenne est requise'),
});

type SimpleFormData = z.infer<typeof simpleFormSchema>;

export default function TablesConfigPage() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Mode management
  const [mode, setMode] = useState<'simple' | 'detailed'>('simple');

  // Detailed mode state
  const [tables, setTables] = useState<TableType[]>([]);
  const [tableType, setTableType] = useState('');
  const [tableQuantity, setTableQuantity] = useState('');
  const [tableCapacity, setTableCapacity] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SimpleFormData>({
    resolver: zodResolver(simpleFormSchema),
  });

  const fetchRestaurant = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getMyRestaurant();
      setRestaurant(response.restaurant);

      const config = response.restaurant.tablesConfig;
      setMode(config.mode || 'simple');

      if (config.mode === 'simple') {
        reset({
          totalTables: (config.totalTables || 10).toString(),
          averageCapacity: (config.averageCapacity || 4).toString(),
        });
      } else {
        setTables(config.tables || []);
      }
    } catch (err) {
      console.error('Error fetching restaurant:', err);
      toast.error('Erreur lors du chargement de la configuration');
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  const handleAddTableType = () => {
    if (!tableType || !tableQuantity || !tableCapacity) {
      toast.error('Tous les champs sont requis');
      return;
    }

    const quantity = parseInt(tableQuantity, 10);
    const capacity = parseInt(tableCapacity, 10);

    if (isNaN(quantity) || quantity < 1) {
      toast.error('La quantité doit être au moins 1');
      return;
    }

    if (isNaN(capacity) || capacity < 1) {
      toast.error('La capacité doit être au moins 1');
      return;
    }

    setTables([...tables, { type: tableType, quantity, capacity }]);
    setTableType('');
    setTableQuantity('');
    setTableCapacity('');
    toast.success('Type de table ajouté');
  };

  const handleRemoveTableType = (index: number) => {
    setTables(tables.filter((_, i) => i !== index));
    toast.success('Type de table supprimé');
  };

  const onSubmitSimple = async (data: SimpleFormData) => {
    try {
      setIsSaving(true);

      const totalTables = parseInt(data.totalTables, 10);
      const averageCapacity = parseInt(data.averageCapacity, 10);

      if (isNaN(totalTables) || totalTables < 1) {
        toast.error('Le nombre de tables doit être au moins 1');
        setIsSaving(false);
        return;
      }

      if (isNaN(averageCapacity) || averageCapacity < 1) {
        toast.error('La capacité moyenne doit être au moins 1');
        setIsSaving(false);
        return;
      }

      const response = await apiClient.updateTablesConfig({
        totalTables,
        averageCapacity,
      });

      setRestaurant(prev => prev ? {
        ...prev,
        tablesConfig: response.tablesConfig,
      } : null);

      toast.success('Configuration des tables mise à jour avec succès');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDetailed = async () => {
    if (tables.length === 0) {
      toast.error('Ajoutez au moins un type de table');
      return;
    }

    try {
      setIsSaving(true);

      const response = await apiClient.updateTablesConfig({
        mode: 'detailed',
        tables,
      });

      setRestaurant(prev => prev ? {
        ...prev,
        tablesConfig: response.tablesConfig,
      } : null);

      toast.success('Configuration des tables mise à jour avec succès');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwitchMode = async (newMode: 'simple' | 'detailed') => {
    try {
      setIsSaving(true);

      if (newMode === 'simple') {
        const response = await apiClient.updateTablesConfig({
          mode: 'simple',
          totalTables: 10,
          averageCapacity: 4,
        });

        setRestaurant(prev => prev ? {
          ...prev,
          tablesConfig: response.tablesConfig,
        } : null);

        reset({
          totalTables: '10',
          averageCapacity: '4',
        });
      } else {
        const response = await apiClient.updateTablesConfig({
          mode: 'detailed',
          tables: [],
        });

        setRestaurant(prev => prev ? {
          ...prev,
          tablesConfig: response.tablesConfig,
        } : null);

        setTables([]);
      }

      setMode(newMode);
      toast.success(`Basculé en mode ${newMode === 'simple' ? 'simple' : 'détaillé'}`);
    } catch (err) {
      toast.error('Erreur lors du changement de mode');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Chargement...</div>;
  }

  const getTotalCapacity = () => {
    if (mode === 'simple' && restaurant) {
      return (restaurant.tablesConfig.totalTables || 0) * (restaurant.tablesConfig.averageCapacity || 0);
    } else {
      return tables.reduce((sum, table) => sum + (table.quantity * table.capacity), 0);
    }
  };

  const getTotalTables = () => {
    if (mode === 'simple' && restaurant) {
      return restaurant.tablesConfig.totalTables || 0;
    } else {
      return tables.reduce((sum, table) => sum + table.quantity, 0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/settings')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuration des tables</h1>
          <p className="mt-2 text-gray-600">
            Définissez le nombre de tables et la capacité de votre restaurant
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Mode de gestion</CardTitle>
          <CardDescription>
            Choisissez comment vous souhaitez gérer vos tables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => mode !== 'simple' && handleSwitchMode('simple')}
              disabled={isSaving}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                mode === 'simple'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  mode === 'simple' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                  {mode === 'simple' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                </div>
                <span className="font-semibold">Mode Simple</span>
              </div>
              <p className="text-sm text-gray-600">
                Gestion unifiée avec un nombre total de tables et une capacité moyenne
              </p>
            </button>

            <button
              onClick={() => mode !== 'detailed' && handleSwitchMode('detailed')}
              disabled={isSaving}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                mode === 'detailed'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  mode === 'detailed' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                  {mode === 'detailed' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                </div>
                <span className="font-semibold">Mode Détaillé</span>
              </div>
              <p className="text-sm text-gray-600">
                Gestion précise avec différents types de tables (2 places, 4 places, etc.)
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Simple Mode */}
      {mode === 'simple' && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration simple</CardTitle>
            <CardDescription>Définissez le nombre total de tables et leur capacité moyenne</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitSimple)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalTables">Nombre total de tables *</Label>
                  <Input
                    id="totalTables"
                    type="number"
                    min="1"
                    {...register('totalTables')}
                    disabled={isSaving}
                  />
                  {errors.totalTables && (
                    <p className="text-sm text-destructive">{errors.totalTables.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Le nombre de tables disponibles dans votre restaurant
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averageCapacity">Capacité moyenne par table *</Label>
                  <Input
                    id="averageCapacity"
                    type="number"
                    min="1"
                    {...register('averageCapacity')}
                    disabled={isSaving}
                  />
                  {errors.averageCapacity && (
                    <p className="text-sm text-destructive">{errors.averageCapacity.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Le nombre moyen de personnes par table
                  </p>
                </div>
              </div>

              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Detailed Mode */}
      {mode === 'detailed' && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration détaillée</CardTitle>
            <CardDescription>Gérez différents types de tables avec leurs capacités spécifiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add table type form */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="font-semibold">Ajouter un type de table</Label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Type (ex: Table 2 places)"
                    value={tableType}
                    onChange={(e) => setTableType(e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Quantité"
                    value={tableQuantity}
                    onChange={(e) => setTableQuantity(e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Capacité"
                    value={tableCapacity}
                    onChange={(e) => setTableCapacity(e.target.value)}
                    disabled={isSaving}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTableType}
                    disabled={isSaving}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tables list */}
            {tables.length > 0 && (
              <div className="space-y-2">
                <Label className="font-semibold">Types de tables configurés:</Label>
                {tables.map((table, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Table2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{table.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {table.quantity} table{table.quantity > 1 ? 's' : ''} × {table.capacity} personne{table.capacity > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-blue-600">
                        = {table.quantity * table.capacity} places
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTableType(index)}
                        disabled={isSaving}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tables.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun type de table configuré. Ajoutez-en un ci-dessus.
              </p>
            )}

            <Button onClick={handleSaveDetailed} disabled={isSaving || tables.length === 0}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Enregistrement...' : 'Enregistrer la configuration'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé de la configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Mode de gestion</span>
            <span className="font-semibold capitalize">{mode === 'simple' ? 'Simple' : 'Détaillé'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Nombre total de tables</span>
            <span className="font-semibold">{getTotalTables()}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground">Capacité totale</span>
            <span className="font-semibold text-blue-600">{getTotalCapacity()} personnes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
