'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, Calendar, Loader2, FileText, Clock, Hash } from 'lucide-react';

const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: format(new Date(2024, i, 1), 'MMMM', { locale: fr }) }));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2019 + 1 }, (_, i) => currentYear - i);

export default function ExportPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [exportType, setExportType] = useState<'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      let startDate: Date, endDate: Date;
      if (exportType === 'month') {
        startDate = new Date(selectedYear, selectedMonth - 1, 1);
        endDate = new Date(selectedYear, selectedMonth, 0);
      } else {
        startDate = new Date(selectedYear, 0, 1);
        endDate = new Date(selectedYear, 11, 31);
      }
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      const response = await apiClient.getReservations({ startDate: startDateStr, endDate: endDateStr });
      const reservations = response.reservations;
      if (reservations.length === 0) { toast.error('Aucune réservation trouvée pour cette période'); setIsLoading(false); return; }

      const statusLabels: Record<string, string> = { pending: 'En attente', confirmed: 'Confirmée', cancelled: 'Annulée', completed: 'Terminée' };
      const headers = ['ID', 'Nom du client', 'Email', 'Téléphone', 'Date', 'Heure', 'Nb personnes', 'Statut', 'Notes', 'Date de création'];
      const rows = reservations.map((r) => [
        r._id, r.customerName, r.customerEmail, r.customerPhone,
        format(new Date(r.date), 'dd/MM/yyyy'), r.time, r.numberOfGuests.toString(),
        statusLabels[r.status as keyof typeof statusLabels] || r.status, r.notes || '',
        format(new Date(r.createdAt), 'dd/MM/yyyy HH:mm'),
      ]);
      const csvContent = [headers.join(';'), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(';'))].join('\n');
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const periodLabel = exportType === 'month' ? `${selectedYear}-${String(selectedMonth).padStart(2, '0')}` : selectedYear.toString();
      link.setAttribute('href', url); link.setAttribute('download', `reservations_${periodLabel}_${format(new Date(), 'yyyy-MM-dd_HHmm')}.csv`);
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      toast.success(`${reservations.length} réservation(s) exportée(s)`);
    } catch (error) { console.error('Export error:', error); toast.error("Erreur lors de l'export"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Export</h1>
        <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Téléchargez vos réservations au format CSV</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-4 md:p-5 space-y-4">
          <h2 className="text-[17px] font-semibold text-[#000000] md:text-lg">Exporter les réservations</h2>

          {/* Type selector */}
          <div className="flex bg-[#F2F2F7] rounded-xl p-0.5 w-fit">
            {(['month', 'year'] as const).map((t) => (
              <button key={t} onClick={() => setExportType(t)}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-lg transition-colors ${exportType === t ? 'bg-white text-[#000000] shadow-sm' : 'text-[#8E8E93]'}`}>
                {t === 'month' ? 'Par mois' : 'Par année'}
              </button>
            ))}
          </div>

          {/* Date selects */}
          <div className="grid grid-cols-2 gap-3">
            {exportType === 'month' && (
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Mois</label>
                <select value={selectedMonth.toString()} onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                  className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 appearance-none md:h-10 md:text-sm">
                  {months.map((m) => (<option key={m.value} value={m.value}>{m.label.charAt(0).toUpperCase() + m.label.slice(1)}</option>))}
                </select>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Année</label>
              <select value={selectedYear.toString()} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 appearance-none md:h-10 md:text-sm">
                {years.map((y) => (<option key={y} value={y}>{y}</option>))}
              </select>
            </div>
          </div>

          <Button onClick={handleExport} disabled={isLoading} className="w-full h-12 rounded-xl text-[15px] font-semibold md:w-auto md:h-10 md:text-sm md:font-medium">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isLoading ? 'Export en cours...' : 'Exporter au format CSV'}
          </Button>
          <p className="text-[11px] text-[#8E8E93] md:text-xs">Format CSV — séparateur point-virgule, encodage UTF-8</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-4 md:p-5">
          <h2 className="text-[17px] font-semibold text-[#000000] mb-4 md:text-lg">Fichier exporté</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#F2F2F7] flex items-center justify-center flex-shrink-0"><FileText className="h-4 w-4 text-[#8E8E93]" /></div>
              <div>
                <p className="text-[14px] font-medium text-[#000000] md:text-sm">Colonnes incluses</p>
                <p className="text-[12px] text-[#8E8E93] mt-1 md:text-xs">ID, Nom, Email, Téléphone, Date, Heure, Nb personnes, Statut, Notes, Création</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#F2F2F7] flex items-center justify-center flex-shrink-0"><Calendar className="h-4 w-4 text-[#8E8E93]" /></div>
              <div>
                <p className="text-[14px] font-medium text-[#000000] md:text-sm">Format des dates</p>
                <p className="text-[12px] text-[#8E8E93] mt-1 md:text-xs">JJ/MM/AAAA pour les dates, HH:MM pour les heures</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#F2F2F7] flex items-center justify-center flex-shrink-0"><Clock className="h-4 w-4 text-[#8E8E93]" /></div>
              <div>
                <p className="text-[14px] font-medium text-[#000000] md:text-sm">Période</p>
                <p className="text-[12px] text-[#8E8E93] mt-1 md:text-xs">Toutes les réservations (passées, à venir, annulées) de la période choisie</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
