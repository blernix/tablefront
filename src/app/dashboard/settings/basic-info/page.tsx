'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { Restaurant } from '@/types';
import { useHasFeature } from '@/features/hooks';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, Check } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  address: z.string().min(1, "L'adresse est requise"),
  phone: z.string().min(1, 'Le téléphone est requis'),
  email: z.string().email('Email invalide'),
  googleReviewLink: z.string().url('URL invalide').optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

export default function BasicInfoPage() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const isFetchingRef = useRef(false);
  const hasGoogleReviewFeature = useHasFeature('google-review-link');

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const fetchRestaurant = useCallback(async () => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      const response = await apiClient.getMyRestaurant();
      setRestaurant(response.restaurant);
      reset({ name: response.restaurant.name, address: response.restaurant.address, phone: response.restaurant.phone, email: response.restaurant.email, googleReviewLink: response.restaurant.googleReviewLink || '' });
    } catch (err) { console.error('Error fetching restaurant:', err); }
    finally { setIsLoading(false); isFetchingRef.current = false; }
  }, [reset]);

  useEffect(() => { fetchRestaurant(); }, []); // eslint-disable-line

  const onSubmit = async (data: FormData) => {
    try {
      setIsSaving(true); setSuccessMessage('');
      const response = await apiClient.updateBasicInfo(data);
      setRestaurant(response.restaurant); reset(data);
      setSuccessMessage('Informations mises à jour ✓');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) { alert(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'); }
    finally { setIsSaving(false); }
  };

  const InputField = ({ id, label, type, placeholder, error, disabled }: { id: keyof FormData; label: string; type?: string; placeholder: string; error?: string; disabled?: boolean }) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-[#8E8E93] md:text-sm">{label}</label>
      <input id={id} type={type || 'text'} {...register(id)} placeholder={placeholder} disabled={disabled}
        className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 disabled:opacity-50 md:h-10 md:text-sm" />
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded-lg w-32 hidden md:block animate-pulse" />
        <div className="h-8 bg-slate-200 rounded-lg w-44 animate-pulse" />
        <div className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="hidden md:block">
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button>
      </div>

      <div>
        <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Informations</h1>
        <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Modifiez les coordonnées de votre restaurant</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-4 md:p-5">
          <h2 className="text-[17px] font-semibold text-[#000000] mb-4 md:text-lg">Coordonnées</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField id="name" label="Nom du restaurant" placeholder="Restaurant Le Bon Goût" error={errors.name?.message} disabled={isSaving} />
            <InputField id="address" label="Adresse complète" placeholder="123 Rue de la Paix, 75001 Paris" error={errors.address?.message} disabled={isSaving} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField id="phone" label="Téléphone" placeholder="01 23 45 67 89" error={errors.phone?.message} disabled={isSaving} />
              <InputField id="email" label="Email" type="email" placeholder="contact@restaurant.fr" error={errors.email?.message} disabled={isSaving} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="googleReviewLink" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Lien Google Review (optionnel)</label>
              <input id="googleReviewLink" type="url" {...register('googleReviewLink')} placeholder="https://g.page/votre-restaurant/review"
                disabled={isSaving || !hasGoogleReviewFeature}
                className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 disabled:opacity-50 md:h-10 md:text-sm" />
              {errors.googleReviewLink && <p className="text-[12px] text-red-500">{errors.googleReviewLink.message}</p>}
              <p className="text-[11px] text-[#8E8E93] md:text-xs">Envoyé aux clients après leur visite pour qu&apos;ils laissent un avis Google</p>
              {!hasGoogleReviewFeature && <p className="text-[12px] text-amber-600 mt-1 md:text-xs">Nécessite un abonnement Pro ou supérieur</p>}
            </div>

            {successMessage && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-center md:rounded-xl"><p className="text-[15px] font-medium text-emerald-700 md:text-sm">{successMessage}</p></div>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => reset()} disabled={isSaving || !isDirty} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:flex-none md:h-10 md:text-sm">Annuler</Button>
              <Button type="submit" disabled={isSaving || !isDirty} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:flex-none md:h-10 md:text-sm">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                {isSaving ? 'Enregistrement...' : 'Valider'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
