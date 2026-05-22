'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Check, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewRestaurantPage() {
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '', plan: 'starter' as 'starter' | 'pro', totalTables: 10, averageCapacity: 20, trialDays: 14, discountPercent: 0 });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone || !form.email) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    try {
      setSaving(true);
      const result = await apiClient.commercial.createRestaurant({
        name: form.name,
        address: form.address,
        phone: form.phone,
        email: form.email,
        plan: form.plan,
        trialDays: form.trialDays,
        discountPercent: form.discountPercent,
        tablesConfig: { totalTables: form.totalTables, averageCapacity: form.averageCapacity },
      }) as any;
      setSuccess({ restaurant: result.restaurant, checkout: result.checkout });
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-light text-[#2A2A2A] mb-2">Restaurant créé !</h2>
        <p className="text-sm text-gray-500 mb-2">
          <strong>{success.restaurant.name}</strong> est prêt. Il ne reste plus qu&apos;à finaliser le paiement.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
          <div>
            <div className="text-xs text-gray-400 mb-1">Plan sélectionné :</div>
            <span className="text-sm font-medium">{success.restaurant.plan === 'pro' ? 'Pro (69€/mois)' : 'Starter (39€/mois)'}
              {form.trialDays > 0 ? ` — ${form.trialDays} jours d'essai` : ' — Sans essai'}
            </span>
            {form.discountPercent > 0 && (
              <div className="text-sm text-amber-600 font-medium mt-1">-{form.discountPercent}% le premier mois · valable 24h</div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="text-xs text-gray-400 mb-1">Lien de réservation (actif après paiement) :</div>
            <code className="text-sm text-[#0066FF] break-all">{(process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://tablemaster.fr')}/{success.restaurant.publicSlug}</code>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="text-xs text-green-600 bg-green-50 rounded-lg p-3">
              ✅ Un email a été envoyé à <strong>{success.restaurant.email}</strong> avec le lien de paiement et ses identifiants de connexion.
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="text-xs text-gray-400 mb-1">Lien de paiement (à transmettre si l&apos;email n&apos;arrive pas) :</div>
            <a href={success.checkout.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#0066FF] hover:underline break-all">
              {success.checkout.url.length > 60 ? success.checkout.url.slice(0, 60) + '...' : success.checkout.url}
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => { setSuccess(null); setForm({ name: '', address: '', phone: '', email: '', plan: 'starter', totalTables: 10, averageCapacity: 20, trialDays: 14, discountPercent: 0 }); }}>
            Créer un autre
          </Button>
          <Link href="/commercial">
            <Button>Retour au dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/commercial"><ArrowLeft className="h-5 w-5 text-gray-400 hover:text-gray-600" /></Link>
        <div>
          <h1 className="text-xl font-light text-[#2A2A2A]">Nouveau restaurant</h1>
          <p className="text-xs text-gray-400 mt-0.5">Créez un compte pour un restaurateur</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-[#2A2A2A]">Nom du restaurant *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Le Bistrot Parisien" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-[#2A2A2A]">Adresse *</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="1 rue de la Paix, 75001 Paris" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-[#2A2A2A]">Téléphone *</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01 23 45 67 89" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-medium text-[#2A2A2A]">Email *</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="contact@restaurant.fr" className="mt-1" />
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-[#2A2A2A]">Plan</Label>
              <div className="flex gap-2 mt-1">
                {(['starter', 'pro'] as const).map((p) => (
                  <button key={p} type="button" onClick={() => setForm({ ...form, plan: p })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm border transition-colors ${form.plan === p ? 'border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF] font-medium' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                  >
                    {p === 'starter' ? 'Starter 39€/mois' : 'Pro 69€/mois'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-[#2A2A2A]">Période d&apos;essai</Label>
                <div className="flex gap-2 mt-1">
                  {([0, 14, 30] as const).map((d) => (
                    <button key={d} type="button" onClick={() => setForm({ ...form, trialDays: d })}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm border transition-colors ${form.trialDays === d ? 'border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF] font-medium' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                      {d === 0 ? 'Aucun' : `${d} jours`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-[#2A2A2A]">Réduction 1er mois</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input type="number" min={0} max={70} value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: Math.min(70, Math.max(0, parseInt(e.target.value) || 0)) })} className="w-20 text-center" />
                  <span className="text-sm text-gray-400">%</span>
                  {form.discountPercent > 0 && (
                    <span className="text-xs text-amber-600 font-medium">Valable 24h</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-[#2A2A2A]">Tables</Label>
                <Input type="number" min={1} value={form.totalTables} onChange={(e) => setForm({ ...form, totalTables: parseInt(e.target.value) || 0 })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-medium text-[#2A2A2A]">Couverts moyens</Label>
                <Input type="number" min={1} value={form.averageCapacity} onChange={(e) => setForm({ ...form, averageCapacity: parseInt(e.target.value) || 0 })} className="mt-1" />
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full bg-[#0066FF] hover:bg-[#0052CC]">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Création...</> : 'Créer le restaurant'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
