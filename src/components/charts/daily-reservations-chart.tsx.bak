'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DailyReservationsChartProps {
  data: Array<{
    date: string;
    reservations: number;
    guests: number;
    revenue: number;
  }>;
  title?: string;
  description?: string;
}

export function DailyReservationsChart({ data, title = 'Réservations quotidiennes', description = 'Évolution des réservations sur la période sélectionnée' }: DailyReservationsChartProps) {
  const chartData = data.map(day => ({
    ...day,
    dateFormatted: new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dateFormatted" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e5e5' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e5e5' }}
                allowDecimals={false}
              />
              <Tooltip 
                labelFormatter={(value) => `Date: ${value}`}
                 formatter={(value: any, name: any) => {
                   const label = name === 'reservations' ? 'Réservations' : 
                                name === 'guests' ? 'Couverts' : 
                                'Revenu (€)';
                   return [value ?? 0, label];
                 }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => {
                  if (value === 'reservations') return 'Réservations';
                  if (value === 'guests') return 'Couverts';
                  if (value === 'revenue') return 'Revenu';
                  return value;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="reservations" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="reservations"
              />
              <Line 
                type="monotone" 
                dataKey="guests" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="guests"
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="revenue"
                yAxisId="right"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}