'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { toast } from 'sonner';
import { Download, Calendar, Loader2 } from 'lucide-react';

// Generate months for selection (1-12 with French names)
const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: format(new Date(2024, i, 1), 'MMMM', { locale: fr }),
}));

// Generate years (from 2020 to current year + 1)
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
      let startDate: Date;
      let endDate: Date;

      if (exportType === 'month') {
        // First day of selected month/year
        startDate = new Date(selectedYear, selectedMonth - 1, 1);
        // Last day of selected month/year
        endDate = new Date(selectedYear, selectedMonth, 0);
      } else {
        // First day of selected year
        startDate = new Date(selectedYear, 0, 1);
        // Last day of selected year
        endDate = new Date(selectedYear, 11, 31);
      }

      // Format dates as YYYY-MM-DD
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Fetch reservations for the selected period
      const response = await apiClient.getReservations({
        startDate: startDateStr,
        endDate: endDateStr,
      });

      const reservations = response.reservations;

      if (reservations.length === 0) {
        toast.error('Aucune réservation trouvée pour la période sélectionnée');
        setIsLoading(false);
        return;
      }

      // Status labels (same as in reservations page)
      const statusLabels = {
        pending: 'En attente',
        confirmed: 'Confirmée',
        cancelled: 'Annulée',
        completed: 'Terminée',
      };

      const headers = [
        'ID',
        'Nom du client',
        'Email',
        'Téléphone',
        'Date',
        'Heure',
        'Nombre de personnes',
        'Statut',
        'Notes',
        'Date de création',
      ];

      const rows = reservations.map((r) => [
        r._id,
        r.customerName,
        r.customerEmail,
        r.customerPhone,
        format(new Date(r.date), 'dd/MM/yyyy'),
        r.time,
        r.numberOfGuests.toString(),
        statusLabels[r.status as keyof typeof statusLabels] || r.status,
        r.notes || '',
        format(new Date(r.createdAt), 'dd/MM/yyyy HH:mm'),
      ]);

      const csvContent = [
        headers.join(';'),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(';')),
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const date = format(new Date(), 'yyyy-MM-dd_HHmm');

      const periodLabel =
        exportType === 'month'
          ? `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`
          : selectedYear.toString();

      link.setAttribute('href', url);
      link.setAttribute('download', `reservations_${periodLabel}_${date}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(
        `${reservations.length} réservation(s) exportée(s) pour ${exportType === 'month' ? 'le mois' : "l'année"} sélectionné(e)`
      );
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Erreur lors de l'export");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Export des données</h1>
        <p className="mt-2 text-gray-600">Exportez vos réservations par mois ou par année</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exporter les réservations</CardTitle>
          <CardDescription>
            Sélectionnez une période et téléchargez les données au format CSV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type d&apos;export</Label>
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value as 'month' | 'year')}
                className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="month">Export par mois</option>
                <option value="year">Export par année</option>
              </select>
            </div>

            {exportType === 'month' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mois</Label>
                  <select
                    value={selectedMonth.toString()}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value.toString()}>
                        {month.label.charAt(0).toUpperCase() + month.label.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Année</Label>
                  <select
                    value={selectedYear.toString()}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {years.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Année</Label>
                <select
                  value={selectedYear.toString()}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-4">
              <Button onClick={handleExport} disabled={isLoading} className="min-w-[200px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter les réservations
                  </>
                )}
              </Button>
              <p className="mt-2 text-sm text-gray-500">
                Les données seront exportées au format CSV (séparateur point-virgule)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations sur l&apos;export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-medium text-gray-900">Colonnes incluses</h4>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>ID de la réservation</li>
              <li>Nom du client</li>
              <li>Email</li>
              <li>Téléphone</li>
              <li>Date de la réservation</li>
              <li>Heure de la réservation</li>
              <li>Nombre de personnes</li>
              <li>Statut (En attente, Confirmée, Annulée, Terminée)</li>
              <li>Notes</li>
              <li>Date de création</li>
            </ul>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-gray-900">Format des dates</h4>
            <p className="text-sm text-gray-600">
              Les dates sont au format JJ/MM/AAAA et les heures au format HH:MM
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-gray-900">Période d&apos;export</h4>
            <p className="text-sm text-gray-600">
              Vous pouvez exporter les réservations pour un mois spécifique ou pour toute une année.
              Les exports incluent toutes les réservations (passées, à venir, et annulées) dans la
              période sélectionnée.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
