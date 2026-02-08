'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
type PlanType = 'starter' | 'pro';
type SignupStep = 'plan' | 'restaurant' | 'account';

interface PlanInfo {
  id: PlanType;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

interface RestaurantFormData {
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  restaurantEmail: string;
}

interface AccountFormData {
  ownerEmail: string;
  ownerPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  restaurantName?: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
  restaurantEmail?: string;
  ownerEmail?: string;
  ownerPassword?: string;
  confirmPassword?: string;
}

const PLANS: Record<PlanType, PlanInfo> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 39,
    features: [
      '50 réservations par mois',
      'Widget standard',
      'Gestion horaires et jours fermés',
      'Support par email',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 69,
    features: [
      'Réservations illimitées',
      'Widget personnalisable (couleurs, police)',
      'Gestion horaires et jours fermés',
      'Support prioritaire',
      'Analytics avancées',
    ],
    popular: true,
  },
};

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)\.]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 9;
};

const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Minimum 6 caractères' };
  }
  return { valid: true };
};

// Step indicator component
interface StepIndicatorProps {
  steps: { id: SignupStep; label: string; description: string }[];
  currentStep: SignupStep;
  onStepClick?: (step: SignupStep) => void;
}

function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <button
              type="button"
              onClick={() => onStepClick?.(step.id)}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                index < currentIndex
                  ? 'bg-blue-100 border-blue-600 text-blue-600'
                  : index === currentIndex
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400',
                onStepClick && 'cursor-pointer hover:border-blue-400'
              )}
            >
              {index < currentIndex ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="font-medium">{index + 1}</span>
              )}
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-24 h-1 transition-colors duration-300',
                  index < currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-between mt-6 px-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              'text-center w-24',
              step.id === currentStep
                ? 'text-blue-600 font-medium'
                : 'text-gray-500'
            )}
          >
            <div className="text-sm">{step.label}</div>
            <div className="text-xs mt-1">{step.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Plan selection step
interface PlanSelectionStepProps {
  selectedPlan: PlanType;
  onPlanSelect: (plan: PlanType) => void;
  onNext: () => void;
}

function PlanSelectionStep({ selectedPlan, onPlanSelect, onNext }: PlanSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900">Choisissez votre plan</h3>
        <p className="mt-2 text-gray-600">
          Sélectionnez le plan qui correspond à vos besoins. Vous pouvez changer à tout moment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {Object.values(PLANS).map((plan) => (
          <div
            key={plan.id}
            onClick={() => onPlanSelect(plan.id)}
            className={cn(
              'relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg',
              selectedPlan === plan.id
                ? 'border-blue-600 bg-blue-50/50'
                : 'border-gray-200 hover:border-blue-300'
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                  Populaire
                </span>
              </div>
            )}

            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">{plan.name}</span>
                  {selectedPlan === plan.id && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}€</span>
                  <span className="text-gray-600 ml-2">/mois</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {plan.id === 'pro' ? (
                    <>
                      <span className="font-medium text-green-600">✓ Recommandé</span> pour les établissements actifs
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-blue-600">✓ Parfait</span> pour débuter
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <div></div> {/* Spacer for alignment */}
        <Button onClick={onNext} className="min-w-32">
          Continuer
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Restaurant info step
interface RestaurantInfoStepProps {
  data: RestaurantFormData;
  errors: FormErrors;
  onChange: (data: Partial<RestaurantFormData>) => void;
  onBack: () => void;
  onNext: () => void;
}

function RestaurantInfoStep({ data, errors, onChange, onBack, onNext }: RestaurantInfoStepProps) {
  const handleChange = (field: keyof RestaurantFormData, value: string) => {
    onChange({ [field]: value });
  };

  const validateStep = () => {
    return (
      data.restaurantName.trim() &&
      data.restaurantAddress.trim() &&
      validatePhone(data.restaurantPhone) &&
      validateEmail(data.restaurantEmail)
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900">Informations de votre restaurant</h3>
        <p className="mt-2 text-gray-600">
          Ces informations seront visibles par vos clients et utilisées pour la communication.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nom du restaurant *
            </label>
            <input
              type="text"
              value={data.restaurantName}
              onChange={(e) => handleChange('restaurantName', e.target.value)}
              className={cn(
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
                errors.restaurantName
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              )}
              placeholder="Le Petit Gourmet"
            />
            {errors.restaurantName && (
              <p className="text-sm text-red-600">{errors.restaurantName}</p>
            )}
            {data.restaurantName && !errors.restaurantName && (
              <p className="text-sm text-green-600">✓ Nom valide</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Téléphone *
            </label>
            <input
              type="tel"
              value={data.restaurantPhone}
              onChange={(e) => handleChange('restaurantPhone', e.target.value)}
              className={cn(
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
                errors.restaurantPhone
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              )}
              placeholder="+33142345678"
            />
            {errors.restaurantPhone && (
              <p className="text-sm text-red-600">{errors.restaurantPhone}</p>
            )}
            {data.restaurantPhone && validatePhone(data.restaurantPhone) && (
              <p className="text-sm text-green-600">✓ Format téléphone valide</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Adresse complète *
          </label>
          <input
            type="text"
            value={data.restaurantAddress}
            onChange={(e) => handleChange('restaurantAddress', e.target.value)}
            className={cn(
              'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
              errors.restaurantAddress
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            )}
            placeholder="123 Rue de la Paix, 75001 Paris"
          />
          {errors.restaurantAddress && (
            <p className="text-sm text-red-600">{errors.restaurantAddress}</p>
          )}
          {data.restaurantAddress && !errors.restaurantAddress && (
            <p className="text-sm text-green-600">✓ Adresse valide</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email du restaurant *
          </label>
          <input
            type="email"
            value={data.restaurantEmail}
            onChange={(e) => handleChange('restaurantEmail', e.target.value)}
            className={cn(
              'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
              errors.restaurantEmail
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            )}
            placeholder="contact@restaurant.fr"
          />
          {errors.restaurantEmail && (
            <p className="text-sm text-red-600">{errors.restaurantEmail}</p>
          )}
          {data.restaurantEmail && validateEmail(data.restaurantEmail) && (
            <p className="text-sm text-green-600">✓ Format email valide</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button onClick={onNext} disabled={!validateStep()} className="min-w-32">
          Continuer
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Owner account step
interface OwnerAccountStepProps {
  data: AccountFormData;
  errors: FormErrors;
  onChange: (data: Partial<AccountFormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

function OwnerAccountStep({ data, errors, onChange, onBack, onSubmit, isLoading }: OwnerAccountStepProps) {
  const handleChange = (field: keyof AccountFormData, value: string) => {
    onChange({ [field]: value });
  };

  const passwordValidation = validatePassword(data.ownerPassword);
  const passwordsMatch = data.ownerPassword === data.confirmPassword && data.ownerPassword.length > 0;
  const emailValid = validateEmail(data.ownerEmail);

  const validateStep = () => {
    return (
      emailValid &&
      passwordValidation.valid &&
      passwordsMatch
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900">Votre compte propriétaire</h3>
        <p className="mt-2 text-gray-600">
          Ces identifiants vous permettront de vous connecter à votre espace TableMaster.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Votre email (connexion) *
          </label>
          <input
            type="email"
            value={data.ownerEmail}
            onChange={(e) => handleChange('ownerEmail', e.target.value)}
            className={cn(
              'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
              errors.ownerEmail
                ? 'border-red-300 focus:ring-red-500'
                : emailValid
                ? 'border-green-300 focus:ring-green-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            )}
            placeholder="votre.email@example.com"
          />
          {errors.ownerEmail && (
            <p className="text-sm text-red-600">{errors.ownerEmail}</p>
          )}
          {data.ownerEmail && emailValid && (
            <p className="text-sm text-green-600">✓ Email valide</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe *
            </label>
            <input
              type="password"
              value={data.ownerPassword}
              onChange={(e) => handleChange('ownerPassword', e.target.value)}
              className={cn(
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
                errors.ownerPassword
                  ? 'border-red-300 focus:ring-red-500'
                  : passwordValidation.valid
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              )}
              placeholder="Minimum 6 caractères"
            />
            {errors.ownerPassword && (
              <p className="text-sm text-red-600">{errors.ownerPassword}</p>
            )}
            {data.ownerPassword && !passwordValidation.valid && (
              <p className="text-sm text-red-600">{passwordValidation.message}</p>
            )}
            {data.ownerPassword && passwordValidation.valid && (
              <p className="text-sm text-green-600">✓ Mot de passe sécurisé</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe *
            </label>
            <input
              type="password"
              value={data.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={cn(
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
                errors.confirmPassword
                  ? 'border-red-300 focus:ring-red-500'
                  : passwordsMatch
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              )}
              placeholder="Confirmez votre mot de passe"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
            {data.confirmPassword && passwordsMatch && (
              <p className="text-sm text-green-600">✓ Les mots de passe correspondent</p>
            )}
            {data.confirmPassword && !passwordsMatch && (
              <p className="text-sm text-red-600">Les mots de passe ne correspondent pas</p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">💡 Conseil de sécurité</h4>
          <p className="text-sm text-blue-700">
            Utilisez un mot de passe unique pour TableMaster. Nous vous recommandons d&apos;utiliser un gestionnaire de mots de passe pour générer et stocker des mots de passe sécurisés.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!validateStep() || isLoading}
          className="min-w-32 bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Chargement...
            </>
          ) : (
            <>
               Finaliser l&apos;inscription
              <Check className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Main wizard component
interface SignupWizardProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function SignupWizard({ onSuccess, onError }: SignupWizardProps) {
  // State
  const [currentStep, setCurrentStep] = useState<SignupStep>('plan');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('starter');
  const [restaurantData, setRestaurantData] = useState<RestaurantFormData>({
    restaurantName: '',
    restaurantAddress: '',
    restaurantPhone: '',
    restaurantEmail: '',
  });
  const [accountData, setAccountData] = useState<AccountFormData>({
    ownerEmail: '',
    ownerPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Steps configuration
  const steps = [
    { id: 'plan' as SignupStep, label: 'Plan', description: 'Choisissez votre offre' },
    { id: 'restaurant' as SignupStep, label: 'Restaurant', description: 'Informations établissement' },
    { id: 'account' as SignupStep, label: 'Compte', description: 'Identifiants propriétaire' },
  ];

  // Navigation
  const goToStep = (step: SignupStep) => {
    // Validate current step before allowing navigation
    if (currentStep === 'restaurant' && step === 'account') {
      if (!validateRestaurantStep()) {
        return;
      }
    }
    setCurrentStep(step);
    setSubmitError('');
  };

  const goToNextStep = () => {
    switch (currentStep) {
      case 'plan':
        setCurrentStep('restaurant');
        break;
      case 'restaurant':
        if (validateRestaurantStep()) {
          setCurrentStep('account');
        }
        break;
    }
  };

  const goToPrevStep = () => {
    switch (currentStep) {
      case 'restaurant':
        setCurrentStep('plan');
        break;
      case 'account':
        setCurrentStep('restaurant');
        break;
    }
  };

  // Validation
  const validateRestaurantStep = () => {
    const newErrors: FormErrors = {};

    if (!restaurantData.restaurantName.trim()) {
      newErrors.restaurantName = 'Le nom du restaurant est requis';
    }

    if (!restaurantData.restaurantAddress.trim()) {
      newErrors.restaurantAddress = "L'adresse est requise";
    }

    if (!restaurantData.restaurantPhone.trim()) {
      newErrors.restaurantPhone = 'Le téléphone est requis';
    } else if (!validatePhone(restaurantData.restaurantPhone)) {
      newErrors.restaurantPhone = 'Format de téléphone invalide';
    }

    if (!restaurantData.restaurantEmail.trim()) {
      newErrors.restaurantEmail = "L'email du restaurant est requis";
    } else if (!validateEmail(restaurantData.restaurantEmail)) {
      newErrors.restaurantEmail = 'Format email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Data handlers
  const handleRestaurantDataChange = (updates: Partial<RestaurantFormData>) => {
    setRestaurantData(prev => ({ ...prev, ...updates }));
    // Clear error for updated field
    const field = Object.keys(updates)[0] as keyof FormErrors;
    if (field && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAccountDataChange = (updates: Partial<AccountFormData>) => {
    setAccountData(prev => ({ ...prev, ...updates }));
    // Clear error for updated field
    const field = Object.keys(updates)[0] as keyof FormErrors;
    if (field && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Submit
  const handleSubmit = async () => {
    // Final validation
    const newErrors: FormErrors = {};

    if (!validateEmail(accountData.ownerEmail)) {
      newErrors.ownerEmail = 'Email invalide';
    }

    const passwordValidation = validatePassword(accountData.ownerPassword);
    if (!passwordValidation.valid) {
      newErrors.ownerPassword = passwordValidation.message;
    }

    if (accountData.ownerPassword !== accountData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantName: restaurantData.restaurantName,
          restaurantAddress: restaurantData.restaurantAddress,
          restaurantPhone: restaurantData.restaurantPhone,
          restaurantEmail: restaurantData.restaurantEmail,
          ownerEmail: accountData.ownerEmail,
          ownerPassword: accountData.ownerPassword,
          plan: selectedPlan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur lors de l&apos;inscription');
      }

      // Redirect to Stripe Checkout
      if (data.checkout?.url) {
        window.location.href = data.checkout.url;
      } else {
        throw new Error('URL de paiement manquante');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setSubmitError(err.message || 'Une erreur est survenue');
      onError?.(err.message || 'Une erreur est survenue');
      setIsLoading(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'plan':
        return (
          <PlanSelectionStep
            selectedPlan={selectedPlan}
            onPlanSelect={setSelectedPlan}
            onNext={goToNextStep}
          />
        );
      case 'restaurant':
        return (
          <RestaurantInfoStep
            data={restaurantData}
            errors={errors}
            onChange={handleRestaurantDataChange}
            onBack={goToPrevStep}
            onNext={goToNextStep}
          />
        );
      case 'account':
        return (
          <OwnerAccountStep
            data={accountData}
            errors={errors}
            onChange={handleAccountDataChange}
            onBack={goToPrevStep}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {/* Progress indicator */}
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={goToStep}
      />

      {/* Error display */}
      {submitError && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      {/* Current step content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        {renderStep()}
      </div>

      {/* Additional info */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          En continuant, vous acceptez nos{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500 underline">
            conditions d&apos;utilisation
          </a>{' '}
          et notre{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500 underline">
            politique de confidentialité
          </a>.
        </p>
        <p className="mt-2">
          Vous serez redirigé vers Stripe pour finaliser le paiement de manière sécurisée.
        </p>
      </div>
    </div>
  );
}