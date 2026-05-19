'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewRestaurantPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '', plan: 'trial' as 'trial' | 'starter' | 'pro', totalTables: 10, averageCapacity: 20 });
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
        tablesConfig: { totalTables: form.totalTables, averageCapacity: form.averageCapacity },
      }) as any;
      setSuccess({ restaurant: result.restaurant, credentials: result.credentials });
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
        <p className="text-sm text-gray-500 mb-6">
          <strong>{success.restaurant.name}</strong> est maintenant actif.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
          <div>
            <div className="text-xs text-gray-400 mb-1">Lien de réservation :</div>
            <code className="text-sm text-[#0066FF] break-all">{(process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://tablemaster.fr')}/{success.restaurant.publicSlug}</code>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="text-xs text-gray-400 mb-1">Identifiants restaurateur (à transmettre) :</div>
            <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
              <div>Email : <strong>{success.credentials.email}</strong></div>
              <div>Mot de passe : <strong className="font-mono">{success.credentials.password}</strong></div>
              <div className="text-xs text-amber-600 mt-1">⚠️ Le restaurateur devra changer son mot de passe au premier login.</div>
            </div>
          </div>
          {success.restaurant.plan !== 'trial' && (
            <div className="border-t border-gray-200 pt-3">
              <div className="text-xs text-blue-600 bg-blue-50 rounded-lg p-3">
                💡 Compte géré — le plan {success.restaurant.plan === 'pro' ? 'Pro (69€/mois)' : 'Starter (39€/mois)'} est activé. La facturation sera gérée par TableMaster.
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => { setSuccess(null); setForm({ name: '', address: '', phone: '', email: '', plan: 'trial', totalTables: 10, averageCapacity: 20 }); }}>
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
                {(['trial', 'starter', 'pro'] as const).map((p) => (
                  <button key={p} type="button" onClick={() => setForm({ ...form, plan: p })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm border transition-colors ${form.plan === p ? 'border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF] font-medium' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                  >
                    {p === 'trial' ? 'Essai 14j' : p === 'starter' ? 'Starter 39€' : 'Pro 69€'}
                  </button>
                ))}
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
