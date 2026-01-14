'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TimeSlotsChartProps {
  data: Array<{
    hour: string;
    count: number;
  }>;
  title?: string;
  description?: string;
}

export function TimeSlotsChart({ data, title = 'Créneaux horaires les plus populaires', description = 'Heures avec le plus de réservations' }: TimeSlotsChartProps) {
  const chartData = data.map(slot => ({
    ...slot,
    hourFormatted: `${slot.hour}:00`,
    percentage: data.reduce((total, s) => total + s.count, 0) > 0 
      ? (slot.count / data.reduce((total, s) => total + s.count, 0)) * 100 
      : 0,
  }));

  const getColor = (index: number) => {
    const colors = [
      '#3b82f6', '#1d4ed8', '#60a5fa', '#93c5fd',
      '#10b981', '#059669', '#34d399', '#6ee7b7',
      '#8b5cf6', '#7c3aed', '#a78bfa', '#c4b5fd',
    ];
    return colors[index % colors.length];
  };

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
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
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
                dataKey="hourFormatted"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e5e5' }}
                width={50}
              />
              <Tooltip 
                 formatter={(value: any, name: any) => {
                   if (name === 'count') return [value, 'Réservations'];
                  if (name === 'percentage') return [`${value.toFixed(1)}%`, 'Part des réservations'];
                  return [value, name];
                }}
                labelFormatter={(label) => `Heure: ${label}`}
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
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {chartData.slice(0, 8).map((slot, index) => (
            <div key={slot.hour} className="flex flex-col p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(index) }} />
                <span className="font-medium text-sm">{slot.hourFormatted}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-xl font-bold">{slot.count}</div>
                <div className="text-xs text-gray-500">réservations</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {slot.percentage.toFixed(1)}% du total
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}