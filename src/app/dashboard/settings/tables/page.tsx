'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { Restaurant, TableType } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Plus, Trash2, Table2, Check, Loader2, Grid3X3, List } from 'lucide-react';

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
  const isFetchingRef = useRef(false);
  const [mode, setMode] = useState<'simple' | 'detailed'>('simple');
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
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      const response = await apiClient.getMyRestaurant();
      setRestaurant(response.restaurant);
      const config = response.restaurant.tablesConfig;
      setMode(config.mode || 'simple');
      if (config.mode === 'simple') {
        reset({ totalTables: (config.totalTables || 10).toString(), averageCapacity: (config.averageCapacity || 4).toString() });
      } else {
        setTables(config.tables || []);
      }
    } catch (err) {
      console.error('Error fetching restaurant:', err);
      toast.error('Erreur lors du chargement de la configuration');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [reset]);

  useEffect(() => { fetchRestaurant(); }, []); // eslint-disable-line

  const handleAddTableType = () => {
    if (!tableType || !tableQuantity || !tableCapacity) { toast.error('Tous les champs sont requis'); return; }
    const quantity = parseInt(tableQuantity, 10);
    const capacity = parseInt(tableCapacity, 10);
    if (isNaN(quantity) || quantity < 1) { toast.error('La quantité doit être au moins 1'); return; }
    if (isNaN(capacity) || capacity < 1) { toast.error('La capacité doit être au moins 1'); return; }
    setTables([...tables, { type: tableType, quantity, capacity }]);
    setTableType(''); setTableQuantity(''); setTableCapacity('');
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
      if (isNaN(totalTables) || totalTables < 1) { toast.error('Le nombre de tables doit être au moins 1'); return; }
      if (isNaN(averageCapacity) || averageCapacity < 1) { toast.error('La capacité moyenne doit être au moins 1'); return; }
      const response = await apiClient.updateTablesConfig({ totalTables, averageCapacity });
      setRestaurant((prev) => prev ? { ...prev, tablesConfig: response.tablesConfig } : null);
      toast.success('Configuration mise à jour ✓');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally { setIsSaving(false); }
  };

  const handleSaveDetailed = async () => {
    if (tables.length === 0) { toast.error('Ajoutez au moins un type de table'); return; }
    try {
      setIsSaving(true);
      const response = await apiClient.updateTablesConfig({ mode: 'detailed', tables });
      setRestaurant((prev) => prev ? { ...prev, tablesConfig: response.tablesConfig } : null);
      toast.success('Configuration mise à jour ✓');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally { setIsSaving(false); }
  };

  const handleSwitchMode = async (newMode: 'simple' | 'detailed') => {
    try {
      setIsSaving(true);
      if (newMode === 'simple') {
        const response = await apiClient.updateTablesConfig({ mode: 'simple', totalTables: 10, averageCapacity: 4 });
        setRestaurant((prev) => prev ? { ...prev, tablesConfig: response.tablesConfig } : null);
        reset({ totalTables: '10', averageCapacity: '4' });
      } else {
        const response = await apiClient.updateTablesConfig({ mode: 'detailed', tables: [] });
        setRestaurant((prev) => prev ? { ...prev, tablesConfig: response.tablesConfig } : null);
        setTables([]);
      }
      setMode(newMode);
      toast.success(`Mode ${newMode === 'simple' ? 'simple' : 'détaillé'} activé`);
    } catch (err) {
      toast.error('Erreur lors du changement de mode');
    } finally { setIsSaving(false); }
  };

  const getTotalCapacity = () => mode === 'simple' && restaurant
    ? (restaurant.tablesConfig.totalTables || 0) * (restaurant.tablesConfig.averageCapacity || 0)
    : tables.reduce((sum, t) => sum + t.quantity * t.capacity, 0);

  const getTotalTables = () => mode === 'simple' && restaurant
    ? restaurant.tablesConfig.totalTables || 0
    : tables.reduce((sum, t) => sum + t.quantity, 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded-lg w-32 hidden md:block animate-pulse" />
        <div className="h-8 bg-slate-200 rounded-lg w-52 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
        <div className="h-52 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="hidden md:block">
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button>
      </div>

      <div>
        <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Configuration des tables</h1>
        <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Définissez vos tables et leur capacité</p>
      </div>

      {/* Mode selector */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="grid grid-cols-2 divide-x divide-[#E5E5EA]">
          <button
            onClick={() => mode !== 'simple' && handleSwitchMode('simple')}
            disabled={isSaving}
            className={`p-4 text-left transition-colors ${mode === 'simple' ? 'bg-[#0066FF]/5' : ''} ${isSaving ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${mode === 'simple' ? 'border-[#0066FF] bg-[#0066FF]' : 'border-[#E5E5EA]'}`}>
                {mode === 'simple' && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className={`text-[14px] font-semibold ${mode === 'simple' ? 'text-[#0066FF]' : 'text-[#000000]'}`}>Simple</span>
            </div>
            <p className="text-[11px] text-[#8E8E93] leading-snug md:text-xs">Total de tables + capacité moyenne</p>
          </button>
          <button
            onClick={() => mode !== 'detailed' && handleSwitchMode('detailed')}
            disabled={isSaving}
            className={`p-4 text-left transition-colors ${mode === 'detailed' ? 'bg-[#0066FF]/5' : ''} ${isSaving ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${mode === 'detailed' ? 'border-[#0066FF] bg-[#0066FF]' : 'border-[#E5E5EA]'}`}>
                {mode === 'detailed' && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className={`text-[14px] font-semibold ${mode === 'detailed' ? 'text-[#0066FF]' : 'text-[#000000]'}`}>Détaillé</span>
            </div>
            <p className="text-[11px] text-[#8E8E93] leading-snug md:text-xs">Types de tables précis</p>
          </button>
        </div>
      </div>

      {/* Simple mode */}
      {mode === 'simple' && (
        <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
          <div className="p-4 md:p-5">
            <h2 className="text-[17px] font-semibold text-[#000000] mb-4 md:text-lg">Configuration simple</h2>
            <form onSubmit={handleSubmit(onSubmitSimple)} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="totalTables" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Nombre total de tables</label>
                <input
                  id="totalTables" type="number" min="1" placeholder="Ex: 20"
                  {...register('totalTables')} disabled={isSaving}
                  className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm"
                />
                {errors.totalTables && <p className="text-[12px] text-red-500">{errors.totalTables.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="averageCapacity" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Capacité moyenne par table</label>
                <input
                  id="averageCapacity" type="number" min="1" placeholder="Ex: 4"
                  {...register('averageCapacity')} disabled={isSaving}
                  className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm"
                />
                {errors.averageCapacity && <p className="text-[12px] text-red-500">{errors.averageCapacity.message}</p>}
              </div>

              <Button type="submit" disabled={isSaving} className="w-full h-11 rounded-xl text-[15px] font-medium md:w-auto md:h-10 md:text-sm">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSaving ? 'Enregistrement...' : 'Valider'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Detailed mode */}
      {mode === 'detailed' && (
        <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
          <div className="p-4 md:p-5 space-y-5">
            <h2 className="text-[17px] font-semibold text-[#000000] md:text-lg">Configuration détaillée</h2>

            {/* Add form */}
            <div className="bg-[#F2F2F7] rounded-2xl p-4 space-y-3 md:rounded-xl md:p-4">
              <p className="text-[13px] font-semibold text-[#000000] md:text-sm">Ajouter un type de table</p>
              <div className="space-y-2">
                <input
                  placeholder="Type (ex: Table 2 places)"
                  value={tableType} onChange={(e) => setTableType(e.target.value)} disabled={isSaving}
                  className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number" min="1" placeholder="Quantité"
                    value={tableQuantity} onChange={(e) => setTableQuantity(e.target.value)} disabled={isSaving}
                    className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm"
                  />
                  <input
                    type="number" min="1" placeholder="Capacité"
                    value={tableCapacity} onChange={(e) => setTableCapacity(e.target.value)} disabled={isSaving}
                    className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm"
                  />
                </div>
              </div>
              <Button onClick={handleAddTableType} disabled={isSaving} variant="outline" className="w-full h-11 rounded-xl text-[15px] font-medium md:w-auto md:h-10 md:text-sm">
                <Plus className="mr-1.5 h-4 w-4" /> Ajouter
              </Button>
            </div>

            {/* Tables list */}
            {tables.length > 0 ? (
              <div className="space-y-2">
                {tables.map((table, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-[#F2F2F7] md:rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                        <Table2 className="h-4 w-4 text-[#0066FF]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium text-[#000000] truncate md:text-base">{table.type}</p>
                        <p className="text-[12px] text-[#8E8E93] md:text-xs">{table.quantity} × {table.capacity} pers.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[13px] font-semibold text-[#0066FF] md:text-sm">{table.quantity * table.capacity} pl.</span>
                      <button onClick={() => handleRemoveTableType(index)} disabled={isSaving} className="h-8 w-8 flex items-center justify-center rounded-lg text-[#8E8E93] active:bg-red-50 active:text-red-500 transition-colors" aria-label="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Table2 className="h-8 w-8 text-[#E5E5EA] mx-auto mb-2" />
                <p className="text-[13px] text-[#8E8E93] md:text-sm">Aucun type de table — ajoutez-en un</p>
              </div>
            )}

            <Button onClick={handleSaveDetailed} disabled={isSaving || tables.length === 0} className="w-full h-11 rounded-xl text-[15px] font-medium md:w-auto md:h-10 md:text-sm">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Enregistrement...' : 'Valider'}
            </Button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-4 md:p-5">
          <h2 className="text-[17px] font-semibold text-[#000000] mb-4 md:text-lg">Résumé</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#8E8E93] md:text-sm">Mode</span>
              <span className="text-[13px] font-medium text-[#000000] capitalize md:text-sm">{mode === 'simple' ? 'Simple' : 'Détaillé'}</span>
            </div>
            <div className="border-t border-[#E5E5EA]" />
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#8E8E93] md:text-sm">Nombre de tables</span>
              <span className="text-[15px] font-semibold text-[#000000] md:text-base">{getTotalTables()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#8E8E93] md:text-sm">Capacité totale</span>
              <span className="text-[15px] font-semibold text-[#0066FF] md:text-base">{getTotalCapacity()} personnes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
