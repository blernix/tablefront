'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewRestaurantPage() {
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '', plan: 'starter' as 'starter' | 'pro', totalTables: 10, averageCapacity: 20, trialDays: 14, discountPercent: 0 });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone || !form.email) { toast.error('Tous les champs sont requis'); return; }
    try { setSaving(true); const r = await apiClient.commercial.createRestaurant({ name: form.name, address: form.address, phone: form.phone, email: form.email, plan: form.plan, trialDays: form.trialDays, discountPercent: form.discountPercent, tablesConfig: { totalTables: form.totalTables, averageCapacity: form.averageCapacity } }) as any; setSuccess({ restaurant: r.restaurant, checkout: r.checkout }); } catch (e: any) { toast.error(e?.message || 'Erreur'); } finally { setSaving(false); }
  };

  const update = (f: Partial<typeof form>) => setForm((p) => ({ ...p, ...f }));
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://tablemaster.fr';

  const Input = ({ label, value, onChange, placeholder, type }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">{label}</label>
      <input type={type || 'text'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
    </div>
  );

  if (success) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 text-center md:rounded-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-emerald-600" /></div>
          <h2 className="text-[22px] font-bold text-[#000000] mb-2 md:text-xl">Restaurant créé !</h2>
          <p className="text-[13px] text-[#8E8E93] md:text-sm"><strong className="text-[#000000]">{success.restaurant.name}</strong> est prêt.</p>

          <div className="mt-5 space-y-3 text-left">
            <div className="rounded-xl bg-[#F2F2F7] p-3">
              <p className="text-[11px] text-[#8E8E93] md:text-xs">Plan</p>
              <p className="text-[14px] font-medium text-[#000000] md:text-sm">{success.restaurant.plan === 'pro' ? 'Pro (69€/mois)' : 'Starter (39€/mois)'}{form.trialDays > 0 ? ` — ${form.trialDays} jours d'essai` : ''}</p>
              {form.discountPercent > 0 && <p className="text-[13px] text-amber-600 font-medium mt-0.5 md:text-xs">-{form.discountPercent}% le premier mois</p>}
            </div>
            <div className="rounded-xl bg-[#0066FF]/5 p-3">
              <p className="text-[11px] text-[#8E8E93] md:text-xs">Lien de réservation</p>
              <code className="text-[13px] text-[#0066FF] break-all md:text-sm">{frontendUrl}/{success.restaurant.publicSlug}</code>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
              <p className="text-[13px] text-emerald-700 md:text-sm">✅ Email envoyé à <strong>{success.restaurant.email}</strong> avec le lien de paiement.</p>
            </div>
            <div className="rounded-xl bg-[#F2F2F7] p-3">
              <p className="text-[11px] text-[#8E8E93] md:text-xs">Lien de paiement</p>
              <a href={success.checkout.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-[#0066FF] break-all md:text-sm">{success.checkout.url.length > 50 ? success.checkout.url.slice(0, 50) + '...' : success.checkout.url}<ExternalLink className="h-3 w-3 flex-shrink-0" /></a>
            </div>
          </div>

          <div className="flex gap-2 justify-center mt-5">
            <Button variant="outline" onClick={() => { setSuccess(null); setForm({ name: '', address: '', phone: '', email: '', plan: 'starter', totalTables: 10, averageCapacity: 20, trialDays: 14, discountPercent: 0 }); }} className="rounded-xl h-10 text-[13px] md:text-xs">Créer un autre</Button>
            <Link href="/commercial"><Button className="rounded-xl h-10 text-[13px] md:text-xs">Dashboard</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/commercial" className="h-9 w-9 flex items-center justify-center rounded-lg text-[#8E8E93] active:bg-[#F2F2F7]"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Nouveau</h1>
          <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Créez un compte pour un restaurateur</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-4">
          <Input label="Nom du restaurant *" value={form.name} onChange={(v) => update({ name: v })} placeholder="Le Bistrot Parisien" />
          <Input label="Adresse *" value={form.address} onChange={(v) => update({ address: v })} placeholder="1 rue de la Paix, 75001 Paris" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Téléphone *" value={form.phone} onChange={(v) => update({ phone: v })} placeholder="01 23 45 67 89" />
            <Input label="Email *" value={form.email} onChange={(v) => update({ email: v })} placeholder="contact@restaurant.fr" type="email" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Plan</label>
            <div className="flex gap-2">
              {(['starter', 'pro'] as const).map((p) => (
                <button key={p} type="button" onClick={() => update({ plan: p })}
                  className={`flex-1 h-10 rounded-lg text-[13px] font-medium border transition-colors md:text-xs ${form.plan === p ? 'border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF]' : 'border-[#E5E5EA] text-[#8E8E93] active:bg-[#F2F2F7]'}`}>
                  {p === 'starter' ? 'Starter 39€' : 'Pro 69€'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Période d&apos;essai</label>
              <div className="flex gap-2">
                {([0, 14, 30] as const).map((d) => (
                  <button key={d} type="button" onClick={() => update({ trialDays: d })}
                    className={`flex-1 h-10 rounded-lg text-[13px] font-medium border transition-colors md:text-xs ${form.trialDays === d ? 'border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF]' : 'border-[#E5E5EA] text-[#8E8E93] active:bg-[#F2F2F7]'}`}>
                    {d === 0 ? 'Aucun' : `${d} jours`}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Réduction 1er mois</label>
              <div className="flex items-center gap-2">
                <input type="number" min={0} max={70} value={form.discountPercent} onChange={(e) => update({ discountPercent: Math.min(70, Math.max(0, parseInt(e.target.value) || 0)) })}
                  className="w-20 h-10 text-center rounded-lg border border-[#E5E5EA] bg-white text-sm focus:outline-none focus:border-[#0066FF] md:text-xs" />
                <span className="text-[#8E8E93] md:text-sm">%</span>
                {form.discountPercent > 0 && <span className="text-[12px] text-amber-600 font-medium md:text-xs">Valable 24h</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Tables" value={String(form.totalTables)} onChange={(v) => update({ totalTables: parseInt(v) || 0 })} />
            <Input label="Couverts moyens" value={String(form.averageCapacity)} onChange={(v) => update({ averageCapacity: parseInt(v) || 0 })} />
          </div>

          <Button type="submit" disabled={saving} className="w-full h-11 rounded-xl text-[15px] font-medium md:h-10 md:text-sm">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Création...</> : 'Créer le restaurant'}
          </Button>
        </form>
      </div>
    </div>
  );
}
