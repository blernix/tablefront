'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type PlanType = 'starter' | 'pro';
type SignupStep = 'plan' | 'restaurant' | 'account';

interface PlanInfo {
  id: PlanType; name: string; price: number; features: string[]; popular?: boolean; trial?: boolean; subtitle?: string; buttonText?: string;
}
interface RestaurantFormData { restaurantName: string; restaurantAddress: string; restaurantPhone: string; restaurantEmail: string; }
interface AccountFormData { ownerEmail: string; ownerPassword: string; confirmPassword: string; acceptedTerms: boolean; }
interface FormErrors { restaurantName?: string; restaurantAddress?: string; restaurantPhone?: string; restaurantEmail?: string; ownerEmail?: string; ownerPassword?: string; confirmPassword?: string; acceptedTerms?: string; }

const PLANS: Record<PlanType, PlanInfo> = {
  starter: { id: 'starter', name: 'Pack Gestion', subtitle: "L'essentiel pour organiser votre salle", price: 39, trial: true, buttonText: 'Commencer avec le pack gestion', features: ['400 réservations / mois', 'Notifications push en temps réel', 'Widget & URL de réservation non personnalisable', 'Emails de confirmation automatiques aux clients', 'Export CSV', 'Support par email'] },
  pro: { id: 'pro', name: 'Pack Croissance', subtitle: 'Le moteur de croissance qui se rentabilise seul', price: 69, trial: true, buttonText: 'Commencer avec le pack croissance', features: ['Réservations illimitées', 'Toutes les fonctionnalités du Pack Gestion', 'Comptes serveurs illimités', 'Support prioritaire', 'Personnalisation couleur et texte du widget', 'Personnalisation couleur et texte du formulaire', 'Personnalisation de votre url', "Demandes d'avis automatiques"], popular: true },
};

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^[\d\s\-\+\(\)\.]+$/.test(phone) && phone.replace(/\D/g, '').length >= 9;
const validatePassword = (password: string) => password.length < 6 ? { valid: false, message: 'Minimum 6 caractères' } : { valid: true };

const Input = ({ type, value, onChange, placeholder, error, valid, className }: { type?: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string; valid?: boolean; className?: string }) => (
  <div>
    <input type={type || 'text'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className={cn('w-full h-11 px-3 rounded-xl border bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 transition-colors md:h-10 md:text-sm', error ? 'border-red-300' : valid ? 'border-emerald-300' : 'border-[#E5E5EA]', className)} />
    {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
    {valid && value && <p className="text-[12px] text-emerald-500 mt-1">✓ Valide</p>}
  </div>
);

function StepIndicator({ steps, currentStep, onStepClick }: { steps: { id: SignupStep; label: string; short: string }[]; currentStep: SignupStep; onStepClick?: (s: SignupStep) => void }) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button type="button" onClick={() => onStepClick?.(step.id)}
              className={cn('flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border-2 transition-all flex-shrink-0', index < currentIndex ? 'bg-[#0066FF]/10 border-[#0066FF] text-[#0066FF]' : index === currentIndex ? 'bg-[#0066FF] border-[#0066FF] text-white' : 'bg-white border-[#E5E5EA] text-[#8E8E93]')}>
              {index < currentIndex ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{index + 1}</span>}
            </button>
            {index < steps.length - 1 && <div className={cn('h-0.5 flex-1 min-w-[32px] md:min-w-[60px] transition-colors', index < currentIndex ? 'bg-[#0066FF]' : 'bg-[#E5E5EA]')} />}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-3 md:mt-4 px-2">
        {steps.map((step, i) => (
          <div key={step.id} className={cn('text-center', step.id === currentStep ? 'text-[#0066FF] font-medium' : 'text-[#8E8E93]')}>
            <span className="hidden md:inline text-sm">{step.label}</span>
            <span className="md:hidden text-[11px]">{step.short}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanSelectionStep({ selectedPlan, onPlanSelect, onNext }: { selectedPlan: PlanType; onPlanSelect: (p: PlanType) => void; onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#000000] md:text-2xl md:font-semibold">Choisissez votre offre</h3>
        <p className="mt-2 text-[15px] text-[#8E8E93] md:text-gray-600">Sélectionnez le plan qui correspond à votre restaurant.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.values(PLANS).map((plan) => (
          <div key={plan.id} onClick={() => onPlanSelect(plan.id)}
            className={cn('relative border-2 rounded-2xl p-5 cursor-pointer transition-all active:scale-[0.99] md:rounded-xl md:p-6', selectedPlan === plan.id ? 'border-[#0066FF] bg-[#0066FF]/[0.04]' : 'border-[#E5E5EA] hover:border-[#0066FF]/30', plan.popular && 'border-[#0066FF]/30')}>
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-[#0066FF] text-white px-3 py-1 rounded-full text-xs font-semibold md:text-sm">Populaire</span></div>}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-[#000000] md:text-xl">{plan.name}</h4>
              {plan.subtitle && <p className="mt-1.5 text-[13px] text-[#8E8E93] md:text-sm md:text-gray-600">{plan.subtitle}</p>}
              <div className="mt-4 flex items-baseline justify-center"><span className="text-3xl font-bold text-[#000000]">{plan.price}€</span><span className="ml-1 text-[#8E8E93] md:text-gray-600">/mois</span></div>
              {plan.trial && <div className="mt-2"><span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full md:text-sm">14 jours d&apos;essai gratuit</span></div>}
            </div>
            <ul className="mt-5 space-y-2">
              {plan.features.map((f, i) => (<li key={i} className="flex items-start text-[14px] text-[#000000] md:text-sm"><Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />{f}</li>))}
            </ul>
            <div className="mt-5">
              <button type="button" onClick={() => onPlanSelect(plan.id)}
                className={cn('w-full h-11 rounded-xl text-[15px] font-medium transition-colors md:h-10 md:text-sm', selectedPlan === plan.id ? 'bg-[#0066FF] text-white' : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#E5E5EA]')}>{selectedPlan === plan.id ? 'Sélectionné' : plan.buttonText || 'Choisir'}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-2">
        <Button onClick={onNext} className="w-full md:w-auto md:min-w-[160px] h-12 rounded-xl text-[15px] font-semibold md:h-10 md:text-sm">Continuer <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}

function RestaurantInfoStep({ data, errors, onChange, onBack, onNext }: { data: RestaurantFormData; errors: FormErrors; onChange: (d: Partial<RestaurantFormData>) => void; onBack: () => void; onNext: () => void }) {
  const valid = data.restaurantName.trim() && data.restaurantAddress.trim() && validatePhone(data.restaurantPhone) && validateEmail(data.restaurantEmail);
  return (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#000000] md:text-2xl md:font-semibold">Votre restaurant</h3>
        <p className="mt-2 text-[15px] text-[#8E8E93] md:text-gray-600">Ces informations seront visibles par vos clients.</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Nom *</label>
            <Input value={data.restaurantName} onChange={(v) => onChange({ restaurantName: v })} placeholder="Le Petit Gourmet" error={errors.restaurantName} valid={!errors.restaurantName && !!data.restaurantName} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Téléphone *</label>
            <Input type="tel" value={data.restaurantPhone} onChange={(v) => onChange({ restaurantPhone: v })} placeholder="01 42 34 56 78" error={errors.restaurantPhone} valid={validatePhone(data.restaurantPhone)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Adresse complète *</label>
          <Input value={data.restaurantAddress} onChange={(v) => onChange({ restaurantAddress: v })} placeholder="123 Rue de la Paix, 75001 Paris" error={errors.restaurantAddress} valid={!errors.restaurantAddress && !!data.restaurantAddress} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Email du restaurant *</label>
          <Input type="email" value={data.restaurantEmail} onChange={(v) => onChange({ restaurantEmail: v })} placeholder="contact@restaurant.fr" error={errors.restaurantEmail} valid={validateEmail(data.restaurantEmail)} />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:flex-none md:h-10 md:text-sm"><ArrowLeft className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Retour</span></Button>
        <Button onClick={onNext} disabled={!valid} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:flex-none md:min-w-[140px] md:h-10 md:text-sm">Continuer <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}

function OwnerAccountStep({ data, errors, onChange, onBack, onSubmit, isLoading }: { data: AccountFormData; errors: FormErrors; onChange: (d: Partial<AccountFormData>) => void; onBack: () => void; onSubmit: () => void; isLoading: boolean }) {
  const pw = validatePassword(data.ownerPassword);
  const pwMatch = data.ownerPassword === data.confirmPassword && data.ownerPassword.length > 0;
  const emailValid = validateEmail(data.ownerEmail);
  const valid = emailValid && pw.valid && pwMatch && data.acceptedTerms;
  return (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#000000] md:text-2xl md:font-semibold">Votre compte</h3>
        <p className="mt-2 text-[15px] text-[#8E8E93] md:text-gray-600">Ces identifiants vous permettront de vous connecter.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Votre email *</label>
          <Input type="email" value={data.ownerEmail} onChange={(v) => onChange({ ownerEmail: v })} placeholder="votre.email@exemple.com" error={errors.ownerEmail} valid={emailValid} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Mot de passe *</label>
            <Input type="password" value={data.ownerPassword} onChange={(v) => onChange({ ownerPassword: v })} placeholder="Minimum 6 caractères" error={errors.ownerPassword || (data.ownerPassword && !pw.valid ? pw.message : undefined)} valid={pw.valid} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Confirmer *</label>
            <Input type="password" value={data.confirmPassword} onChange={(v) => onChange({ confirmPassword: v })} placeholder="Confirmez le mot de passe" error={errors.confirmPassword || (data.confirmPassword && !pwMatch ? 'Les mots de passe ne correspondent pas' : undefined)} valid={pwMatch} />
          </div>
        </div>

        <div className="rounded-xl bg-[#0066FF]/5 border border-[#0066FF]/10 p-4">
          <p className="text-[13px] text-[#0066FF] md:text-sm">💡 Utilisez un mot de passe unique pour TableMaster.</p>
        </div>

        <div className="rounded-xl bg-[#F2F2F7] p-4">
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={data.acceptedTerms} onChange={(e) => onChange({ acceptedTerms: e.target.checked })} className="mt-0.5 h-5 w-5 rounded border-[#E5E5EA] text-[#0066FF] flex-shrink-0" />
            <span className="text-[13px] text-[#8E8E93] md:text-sm">J&apos;accepte les <a href="/cgv" target="_blank" rel="noopener noreferrer" className="text-[#0066FF] hover:underline">CGV</a>, les <a href="/legal#cgu" target="_blank" rel="noopener noreferrer" className="text-[#0066FF] hover:underline">CGU</a> et la <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0066FF] hover:underline">Politique de Confidentialité</a>. *</span>
          </label>
          {errors.acceptedTerms && <p className="mt-2 text-[12px] text-red-500">{errors.acceptedTerms}</p>}
        </div>

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
          <p className="text-[13px] text-emerald-700 md:text-sm">🎉 14 jours d&apos;essai gratuit — aucun paiement avant la fin de l&apos;essai. Annulez à tout moment.</p>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:flex-none md:h-10 md:text-sm"><ArrowLeft className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Retour</span></Button>
        <Button onClick={onSubmit} disabled={!valid || isLoading} className="flex-1 h-11 rounded-xl text-[15px] font-semibold md:flex-none md:min-w-[180px] md:h-10 md:text-sm">
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />En cours...</> : <>Finaliser <Check className="w-4 h-4 ml-2" /></>}
        </Button>
      </div>
    </div>
  );
}

interface SignupWizardProps { onSuccess?: () => void; onError?: (error: string) => void; }

export default function SignupWizard({ onSuccess, onError }: SignupWizardProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<SignupStep>('plan');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('starter');
  const [restaurantData, setRestaurantData] = useState<RestaurantFormData>({ restaurantName: '', restaurantAddress: '', restaurantPhone: '', restaurantEmail: '' });
  const [accountData, setAccountData] = useState<AccountFormData>({ ownerEmail: '', ownerPassword: '', confirmPassword: '', acceptedTerms: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const steps = [
    { id: 'plan' as SignupStep, label: 'Plan', short: 'Plan' },
    { id: 'restaurant' as SignupStep, label: 'Restaurant', short: 'Resto' },
    { id: 'account' as SignupStep, label: 'Compte', short: 'Compte' },
  ];

  const scrollToTop = () => { formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  const goToStep = (step: SignupStep) => {
    setCurrentStep(step); setSubmitError('');
    scrollToTop();
  };
  const goToNextStep = () => { const map: Record<SignupStep, SignupStep> = { plan: 'restaurant', restaurant: 'account', account: 'account' }; if (currentStep === 'restaurant' && !validateRestaurantStep()) return; setCurrentStep(map[currentStep]); scrollToTop(); };
  const goToPrevStep = () => { const map: Record<SignupStep, SignupStep> = { plan: 'plan', restaurant: 'plan', account: 'restaurant' }; setCurrentStep(map[currentStep]); scrollToTop(); };

  const validateRestaurantStep = () => {
    const errs: FormErrors = {};
    if (!restaurantData.restaurantName.trim()) errs.restaurantName = 'Le nom du restaurant est requis';
    if (!restaurantData.restaurantAddress.trim()) errs.restaurantAddress = "L'adresse est requise";
    if (!restaurantData.restaurantPhone.trim()) errs.restaurantPhone = 'Le téléphone est requis';
    else if (!validatePhone(restaurantData.restaurantPhone)) errs.restaurantPhone = 'Format de téléphone invalide';
    if (!restaurantData.restaurantEmail.trim()) errs.restaurantEmail = "L'email est requis";
    else if (!validateEmail(restaurantData.restaurantEmail)) errs.restaurantEmail = 'Format email invalide';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async () => {
    const errs: FormErrors = {};
    if (!validateEmail(accountData.ownerEmail)) errs.ownerEmail = 'Email invalide';
    const pw = validatePassword(accountData.ownerPassword);
    if (!pw.valid) errs.ownerPassword = pw.message;
    if (accountData.ownerPassword !== accountData.confirmPassword) errs.confirmPassword = 'Les mots de passe ne correspondent pas';
    if (!accountData.acceptedTerms) errs.acceptedTerms = 'Vous devez accepter les conditions';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsLoading(true); setSubmitError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantName: restaurantData.restaurantName, restaurantAddress: restaurantData.restaurantAddress, restaurantPhone: restaurantData.restaurantPhone, restaurantEmail: restaurantData.restaurantEmail, ownerEmail: accountData.ownerEmail, ownerPassword: accountData.ownerPassword, acceptedTerms: accountData.acceptedTerms, plan: selectedPlan }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Erreur lors de l'inscription");
      if (data.checkout?.url) window.location.href = data.checkout.url;
      else throw new Error('URL de paiement manquante');
    } catch (err: any) { console.error(err); setSubmitError(err.message); onError?.(err.message); setIsLoading(false); }
  };

  return (
    <div className="w-full" ref={formRef}>
      <StepIndicator steps={steps} currentStep={currentStep} onStepClick={goToStep} />

      {submitError && <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 md:rounded-xl"><p className="text-[13px] text-red-800 md:text-sm">{submitError}</p></div>}

      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 md:p-6 md:rounded-xl">
        {currentStep === 'plan' && <PlanSelectionStep selectedPlan={selectedPlan} onPlanSelect={setSelectedPlan} onNext={goToNextStep} />}
        {currentStep === 'restaurant' && <RestaurantInfoStep data={restaurantData} errors={errors} onChange={(d) => { setRestaurantData((p) => ({ ...p, ...d })); const k = Object.keys(d)[0] as keyof FormErrors; if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined })); }} onBack={goToPrevStep} onNext={goToNextStep} />}
        {currentStep === 'account' && <OwnerAccountStep data={accountData} errors={errors} onChange={(d) => { setAccountData((p) => ({ ...p, ...d })); const k = Object.keys(d)[0] as keyof FormErrors; if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined })); }} onBack={goToPrevStep} onSubmit={handleSubmit} isLoading={isLoading} />}
      </div>
    </div>
  );
}
