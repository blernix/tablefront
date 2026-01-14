'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Building2, Clock, CalendarX, Utensils, Calendar, Users } from 'lucide-react';

const settingsCategories = [
  {
    title: 'Informations de base',
    description: 'Nom, adresse, téléphone et email',
    icon: Building2,
    href: '/dashboard/settings/basic-info',
    available: true,
  },
  {
    title: 'Horaires d\'ouverture',
    description: 'Définissez vos horaires par jour de la semaine',
    icon: Clock,
    href: '/dashboard/settings/opening-hours',
    available: true,
  },
  {
    title: 'Fermetures exceptionnelles',
    description: 'Vacances, jours fériés, événements',
    icon: CalendarX,
    href: '/dashboard/settings/closures',
    available: true,
  },
  {
    title: 'Configuration des tables',
    description: 'Nombre de tables et capacité',
    icon: Utensils,
    href: '/dashboard/settings/tables',
    available: true,
  },
  {
    title: 'Configuration des réservations',
    description: 'Durée et créneaux de réservation',
    icon: Calendar,
    href: '/dashboard/settings/reservations',
    available: true,
  },
  {
    title: 'Gestion des serveurs',
    description: 'Créez des comptes serveurs avec accès limité',
    icon: Users,
    href: '/dashboard/settings/servers',
    available: true,
  },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-2 text-gray-600">
          Configurez votre restaurant
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsCategories.map((category) => {
          const Icon = category.icon;

          return (
            <Card
              key={category.title}
              className={category.available ? 'cursor-pointer hover:border-gray-400' : 'opacity-60'}
              onClick={() => category.available && router.push(category.href)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{category.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                  {category.available && (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              {!category.available && (
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Disponible prochainement
                  </p>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
