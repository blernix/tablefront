'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusDistributionChartProps {
  data: Record<string, number>;
  totalReservations: number;
  title?: string;
  description?: string;
}

export function StatusDistributionChart({ data, totalReservations, title = 'Répartition par statut', description = 'Distribution des réservations selon leur statut' }: StatusDistributionChartProps) {
  const statusColors: Record<string, string> = {
    'confirmed': '#10b981',
    'pending': '#f59e0b',
    'completed': '#3b82f6',
    'cancelled': '#ef4444',
  };

  const statusLabels: Record<string, string> = {
    'confirmed': 'Confirmées',
    'pending': 'En attente',
    'completed': 'Terminées',
    'cancelled': 'Annulées',
  };

  const chartData = Object.entries(data).map(([status, count]) => ({
    status,
    count,
    percentage: totalReservations > 0 ? (count / totalReservations) * 100 : 0,
    label: statusLabels[status] || status,
    color: statusColors[status] || '#6b7280',
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis 
                type="number" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e5e5' }}
                allowDecimals={false}
              />
              <YAxis 
                type="category" 
                dataKey="label"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e5e5' }}
                width={70}
              />
              <Tooltip 
                 formatter={(value: any, name: any) => {
                   if (name === 'count') return [value, 'Nombre'];
                   if (name === 'percentage') return [`${(value as number).toFixed(1)}%`, 'Pourcentage'];
                   return [value, name];
                 }}
                labelFormatter={(label) => `Statut: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]}
                name="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {chartData.map((entry) => (
            <div key={entry.status} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="font-medium text-sm">{entry.label}</span>
              </div>
              <div className="text-xl font-bold">{entry.count}</div>
              <div className="text-xs text-gray-500">{entry.percentage.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}