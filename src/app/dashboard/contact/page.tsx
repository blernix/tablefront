'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContact } from '@/hooks/api/useContact';
import { MessageSquare } from 'lucide-react';

// Validation schema matching backend
const contactSchema = z.object({
  subject: z
    .string()
    .min(1, 'Le sujet est requis')
    .max(200, 'Le sujet ne doit pas dépasser 200 caractères'),
  category: z.enum(['question', 'problem', 'other'], {
    errorMap: () => ({ message: 'Veuillez sélectionner une catégorie valide' }),
  }),
  message: z
    .string()
    .min(1, 'Le message est requis')
    .max(5000, 'Le message ne doit pas dépasser 5000 caractères'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { mutate: sendContact, isPending } = useContact();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: '',
      category: 'question',
      message: '',
    },
  });

  const onSubmit = (data: ContactFormData) => {
    sendContact(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-50 p-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-light text-[#2A2A2A]">Contact</h1>
          <p className="text-sm text-[#666666]">
            Contactez l&apos;équipe TableMaster pour toute question, problème ou suggestion.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-[#E5E5E5] bg-white p-6">
        <div className="mb-8">
          <h2 className="text-lg font-light text-[#2A2A2A]">Envoyer un message</h2>
          <p className="text-sm text-[#666666]">
            Votre message sera envoyé à contact@tablemaster.fr. Nous vous répondrons dans les plus
            brefs délais.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Sujet *</Label>
            <Input
              id="subject"
              placeholder="Ex: Problème avec les réservations"
              {...register('subject')}
              className={errors.subject ? 'border-destructive' : ''}
              disabled={isPending}
            />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <select
              id="category"
              {...register('category')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isPending}
            >
              <option value="question">Question</option>
              <option value="problem">Problème</option>
              <option value="other">Autre</option>
            </select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Décrivez votre question ou problème en détail..."
              rows={6}
              {...register('message')}
              className={errors.message ? 'border-destructive' : ''}
              disabled={isPending}
            />
            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
            <p className="text-xs text-[#666666]">
              Maximum 5000 caractères. Incluez toutes les informations utiles pour nous aider à vous
              répondre.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending} className="min-w-[160px]">
              {isPending ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </div>
        </form>

        {/* Information Box */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-medium text-blue-800">À propos de cette fonctionnalité</h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• Les messages sont envoyés directement à l&apos;équipe TableMaster</li>
            <li>• Nous nous engageons à vous répondre dans les 24-48 heures ouvrées</li>
            <li>• Pour les problèmes urgents, précisez &quot;URGENT&quot; dans le sujet</li>
            <li>• Vous recevrez une copie de votre message par email</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
