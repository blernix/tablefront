import Link from 'next/link';
import { ChevronRight, Building2, Clock, CalendarX, Utensils, Calendar, Users, Bell, Code2, Palette, Download, Key, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const settingsCategories: { title: string; desc: string; icon: any; href: string; highlight?: boolean }[] = [
  { title: 'Guide de démarrage', desc: 'Premiers pas avec TableMaster', icon: HelpCircle, href: '/dashboard/guide', highlight: true },
  { title: 'Informations', desc: 'Nom, adresse, téléphone, email', icon: Building2, href: '/dashboard/settings/basic-info' },
  { title: 'Horaires', desc: 'Horaires par jour de la semaine', icon: Clock, href: '/dashboard/settings/opening-hours' },
  { title: 'Fermetures', desc: 'Vacances, jours fériés, événements', icon: CalendarX, href: '/dashboard/settings/closures' },
  { title: 'Tables', desc: 'Nombre de tables et capacité', icon: Utensils, href: '/dashboard/settings/tables' },
  { title: 'Créneaux', desc: 'Durée et créneaux de réservation', icon: Calendar, href: '/dashboard/settings/reservations' },
  { title: 'Serveurs', desc: 'Comptes serveurs avec accès limité', icon: Users, href: '/dashboard/settings/servers' },
  { title: 'Notifications', desc: 'Préférences push et email', icon: Bell, href: '/dashboard/settings/notifications' },
  { title: 'Intégrations', desc: 'Widget, WordPress, Wix, Shopify...', icon: Code2, href: '/dashboard/settings/integrations' },
  { title: 'Personnalisation', desc: 'Couleurs, police et style du widget', icon: Palette, href: '/dashboard/settings/widget' },
  { title: 'Export', desc: 'Exportez vos réservations', icon: Download, href: '/dashboard/settings/export' },
  { title: 'Compte & abonnement', desc: 'Plan et facturation', icon: Key, href: '/dashboard/settings/account' },
];

export default function SettingsPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Paramètres</h1>
        <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Configurez votre restaurant</p>
      </div>

      <div className="space-y-2 md:space-y-2 md:grid md:grid-cols-2 md:gap-2">
        {settingsCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.title}
              href={cat.href}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-2xl border border-[#E5E5EA] active:bg-[#F2F2F7] transition-colors text-left md:rounded-xl md:p-4',
                cat.highlight && 'bg-[#0066FF]/[0.03] border-[#0066FF]/20'
              )}
            >
              <div className="h-11 w-11 rounded-xl bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-[#0066FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#000000] md:text-base">{cat.title}</p>
                <p className="text-[12px] text-[#8E8E93] mt-0.5 truncate md:text-sm">{cat.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-[#C7C7CC] flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
