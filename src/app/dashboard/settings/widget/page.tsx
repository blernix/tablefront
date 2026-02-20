'use client';
/* eslint-disable react/no-unescaped-entities */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { generateShortCode } from '@/utils/slugGenerator';
import { Restaurant } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Crown,
  Save,
  RotateCcw,
  Palette,
  Eye,
  Smartphone,
  Monitor,
  Copy,
  Check,
  Square,
  Type,
  Radius,
  Layout,
  Settings,
  Globe,
} from 'lucide-react';
import { useRestaurantStore } from '@/store/restaurantStore';
import { useCanCustomizeWidget, useHasCustomSlug, ProBadge } from '@/features';

// Liste des polices système disponibles
const AVAILABLE_FONTS = [
  { value: 'system-ui, sans-serif', label: 'Système (par défaut)' },
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Times New Roman, Times, serif', label: 'Times New Roman' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
  { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
  { value: 'Palatino, Palatino Linotype, serif', label: 'Palatino' },
  { value: 'Garamond, serif', label: 'Garamond' },
  { value: 'Courier New, Courier, monospace', label: 'Courier New' },
  { value: 'Impact, sans-serif', label: 'Impact' },
];
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function WidgetSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth, isInitialized } = useAuthStore();
  const { restaurant, isLoading: isRestaurantLoading, fetchRestaurant } = useRestaurantStore();
  const canCustomizeWidget = useCanCustomizeWidget();
  const hasCustomSlug = useHasCustomSlug();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'floating-button' | 'form' | 'advanced'>(
    'floating-button'
  );

  // Form state (affecte le formulaire de réservation)
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#2A2A2A');
  const [fontFamily, setFontFamily] = useState('system-ui, sans-serif');
  const [borderRadius, setBorderRadius] = useState('4px');

  // Button specific colors (bouton flottant uniquement)
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState('#000000');
  const [buttonTextColor, setButtonTextColor] = useState('#FFFFFF');
  const [buttonHoverColor, setButtonHoverColor] = useState('#333333');

  // Floating button general state
  const [buttonText, setButtonText] = useState('Réserver une table');
  const buttonPosition = 'bottom-right'; // Forcé à bottom-right
  const [buttonStyle, setButtonStyle] = useState<'round' | 'square' | 'minimal'>('round');
  const [buttonIcon, setButtonIcon] = useState(false); // Désactivé par défaut
  const [modalWidth, setModalWidth] = useState('500px');
  const [modalHeight, setModalHeight] = useState('600px');

  // Preview state
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Vanity URL system
  const [customSlug, setCustomSlug] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [slugAvailability, setSlugAvailability] = useState<{
    available: boolean;
    message: string;
  } | null>(null);
  const currentSlug = restaurant?.publicSlug || generateShortCode(8);

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Échec de la copie.');
    }
  };

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isInitialized, isAuthenticated, router]);

  // Fetch restaurant data when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.restaurantId) {
      fetchRestaurant();
    }
  }, [isAuthenticated, user?.restaurantId, fetchRestaurant]);

  // Set form values from restaurant widget config when restaurant data loads
  useEffect(() => {
    const widgetConfig = restaurant?.widgetConfig;
    if (widgetConfig) {
      // Form colors
      setPrimaryColor(widgetConfig.primaryColor || '#000000');
      setSecondaryColor(widgetConfig.secondaryColor || '#2A2A2A');
      setFontFamily(widgetConfig.fontFamily || 'system-ui, sans-serif');
      setBorderRadius(widgetConfig.borderRadius || '4px');

      // Button specific colors - avec valeurs par défaut si manquantes
      setButtonBackgroundColor(
        widgetConfig.buttonBackgroundColor || widgetConfig.primaryColor || '#000000'
      );
      setButtonTextColor(widgetConfig.buttonTextColor || '#FFFFFF');
      setButtonHoverColor(widgetConfig.buttonHoverColor || '#333333');

      // Floating button configs - avec valeurs par défaut si manquantes
      setButtonText(widgetConfig.buttonText || 'Réserver une table');
      // buttonPosition est forcé à 'bottom-right'
      setButtonStyle(widgetConfig.buttonStyle || 'round');
      setButtonIcon(widgetConfig.buttonIcon !== undefined ? widgetConfig.buttonIcon : false);
      setModalWidth(widgetConfig.modalWidth || '500px');
      setModalHeight(widgetConfig.modalHeight || '600px');
    } else if (restaurant) {
    }
  }, [restaurant]);

  useEffect(() => {}, [restaurant]);

  const handleReset = () => {
    // Form colors
    setPrimaryColor('#000000');
    setSecondaryColor('#2A2A2A');
    setFontFamily('system-ui, sans-serif');
    setBorderRadius('4px');

    // Button specific colors
    setButtonBackgroundColor('#000000');
    setButtonTextColor('#FFFFFF');
    setButtonHoverColor('#333333');

    // Floating button configs
    setButtonText('Réserver une table');
    // buttonPosition reste 'bottom-right'
    setButtonStyle('round');
    setButtonIcon(false);
    setModalWidth('500px');
    setModalHeight('600px');
  };

  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailability(null);
      return;
    }

    setIsCheckingAvailability(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/public/check-slug-availability/${slug}`
      );
      const data = await response.json();

      setSlugAvailability({
        available: data.available,
        message: data.message,
      });
    } catch (error) {
      setSlugAvailability({
        available: false,
        message: 'Erreur lors de la vérification',
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleCustomSlugChange = (value: string) => {
    const cleanedValue = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    setCustomSlug(cleanedValue);

    // Vérifier la disponibilité en temps réel
    if (cleanedValue.length >= 3) {
      checkSlugAvailability(cleanedValue);
    } else {
      setSlugAvailability(null);
    }
  };

  const handleSlugUpdate = async () => {
    if (!customSlug || customSlug.length < 3) {
      setError('Le slug doit faire au moins 3 caractères');
      return;
    }

    setIsSaving(true);

    try {
      await apiClient.restaurants.updateSlug({ slug: customSlug });
      setSuccess(true);
      setSlugAvailability(null);
      setCustomSlug('');
      await fetchRestaurant(); // Rafraîchir les données

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du slug');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess(false);

    // Prevent saving if not Pro user
    if (!isProUser) {
      setError('Cette fonctionnalité nécessite un abonnement Pro.');
      return;
    }

    // Validate border radius format
    if (!/^\d+px$/.test(borderRadius)) {
      setError('Le border radius doit être au format "4px", "8px", etc.');
      return;
    }

    // Validate hex colors
    if (!/^#[0-9A-Fa-f]{6}$/.test(primaryColor) || !/^#[0-9A-Fa-f]{6}$/.test(secondaryColor)) {
      setError('Les couleurs doivent être au format hexadécimal (#RRGGBB).');
      return;
    }

    setIsSaving(true);

    try {
      await apiClient.restaurants.updateWidgetConfig({
        // Form colors
        primaryColor,
        secondaryColor,
        fontFamily,
        borderRadius,
        // Button specific colors
        buttonBackgroundColor,
        buttonTextColor,
        buttonHoverColor,
        // Floating button configs
        buttonText,
        buttonPosition: 'bottom-right', // Forcé à bottom-right
        buttonStyle,
        buttonIcon,
        modalWidth,
        modalHeight,
      });

      setSuccess(true);
      await fetchRestaurant(); // Refresh restaurant data

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving widget config:', err);
      setError(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isInitialized || isRestaurantLoading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  if (!isAuthenticated) {
    return <LoadingSkeleton type="dashboard" />;
  }

  // Check if user has access using feature flag system

  const isProUser = canCustomizeWidget;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0066FF]" />
        <div className="flex items-center gap-3 pt-4">
          <Crown className="h-8 w-8 text-[#0066FF]" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-light text-[#2A2A2A]">
                Personnalisation du bouton flottant
              </h1>
              <ProBadge />
            </div>
            <p className="mt-2 text-[#666666] font-light">
              {isProUser
                ? "Personnalisez l'apparence du bouton flottant de réservation (Plan Pro)"
                : 'Fonctionnalité Pro - Personnalisez les couleurs et la police de votre bouton flottant'}
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Banner for non-Pro users */}
      {!isProUser && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Crown className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-amber-900">Fonctionnalité Pro</h3>
                <p className="text-sm text-amber-800">
                  Passez au plan Pro pour personnaliser les couleurs, la police et le style de votre
                  bouton flottant.
                  {!isProUser && ' Vous pouvez visualiser les options mais pas les modifier.'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <Crown className="h-4 w-4 mr-2" />
              Passer au Pro
            </Button>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-[#E5E5E5]">
        <nav className="flex space-x-8">
          <button
            type="button"
            onClick={() => {
              setActiveTab('floating-button');
            }}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'floating-button'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-[#666666] hover:text-[#2A2A2A]'
            }`}
          >
            <Layout className="h-4 w-4" />
            Style du bouton
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('form');
            }}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'form'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-[#666666] hover:text-[#2A2A2A]'
            }`}
          >
            <Square className="h-4 w-4" />
            Style du formulaire
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('advanced');
            }}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'advanced'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-[#666666] hover:text-[#2A2A2A]'
            }`}
          >
            <Settings className="h-4 w-4" />
            Personnalisation du lien
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeTab === 'floating-button' && <Layout className="h-5 w-5" />}
              {activeTab === 'form' && <Square className="h-5 w-5" />}
              {activeTab === 'advanced' && <Settings className="h-5 w-5" />}
              {activeTab === 'floating-button' && 'Style du bouton'}
              {activeTab === 'form' && 'Style du formulaire'}
              {activeTab === 'advanced' && 'Personnalisation du lien'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'floating-button' && "Personnalisez l'apparence du bouton flottant"}
              {activeTab === 'form' && "Personnalisez l'apparence du formulaire de réservation"}
              {activeTab === 'advanced' && 'Personnalisez votre lien de réservation'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4 border border-green-200">
                <p className="text-sm text-green-800">✓ Configuration sauvegardée avec succès !</p>
              </div>
            )}

            <div className="space-y-4">
              {activeTab === 'floating-button' && (
                <>
                  {/* Button Text */}
                  <div>
                    <Label htmlFor="buttonText">Texte du bouton flottant</Label>
                    <Input
                      id="buttonText"
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Réserver une table"
                      className="mt-2"
                      disabled={!isProUser}
                    />
                    <p className="text-xs text-[#666666] mt-1">
                      Texte qui apparaît sur le bouton flottant
                    </p>
                  </div>

                  {/* Button Colors Section */}
                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-[#2A2A2A] mb-4 flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Couleurs du bouton
                    </h3>

                    {/* Button Background Color */}
                    <div className="mb-4">
                      <Label htmlFor="buttonBackgroundColor">Couleur du bouton</Label>
                      <div className="flex gap-3 mt-2">
                        <Input
                          id="buttonBackgroundColor"
                          type="color"
                          value={buttonBackgroundColor}
                          onChange={(e) => setButtonBackgroundColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                          disabled={!isProUser}
                        />
                        <Input
                          type="text"
                          value={buttonBackgroundColor}
                          onChange={(e) => setButtonBackgroundColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                          disabled={!isProUser}
                        />
                      </div>
                      <p className="text-xs text-[#666666] mt-1">
                        Couleur de fond du bouton flottant
                      </p>
                    </div>

                    {/* Button Text Color */}
                    <div className="mb-4">
                      <Label htmlFor="buttonTextColor">Couleur du texte</Label>
                      <div className="flex gap-3 mt-2">
                        <Input
                          id="buttonTextColor"
                          type="color"
                          value={buttonTextColor}
                          onChange={(e) => setButtonTextColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={buttonTextColor}
                          onChange={(e) => setButtonTextColor(e.target.value)}
                          placeholder="#FFFFFF"
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-[#666666] mt-1">
                        Couleur du texte sur le bouton flottant
                      </p>
                    </div>

                    {/* Button Hover Color */}
                    <div className="mb-4">
                      <Label htmlFor="buttonHoverColor">Couleur au survol</Label>
                      <div className="flex gap-3 mt-2">
                        <Input
                          id="buttonHoverColor"
                          type="color"
                          value={buttonHoverColor}
                          onChange={(e) => setButtonHoverColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={buttonHoverColor}
                          onChange={(e) => setButtonHoverColor(e.target.value)}
                          placeholder="#333333"
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-[#666666] mt-1">
                        Couleur du bouton flottant au survol de la souris
                      </p>
                    </div>
                  </div>

                  {/* Button Style */}
                  <div>
                    <Label htmlFor="buttonStyle">Forme du bouton</Label>
                    <select
                      id="buttonStyle"
                      value={buttonStyle}
                      onChange={(e) => setButtonStyle(e.target.value as any)}
                      className="mt-2 w-full p-2 border border-[#E5E5E5] rounded-md"
                      disabled={!isProUser}
                    >
                      <option value="round">Arrondi</option>
                      <option value="square">Carré</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>

                  {/* Modal Size */}
                  <div>
                    <Label htmlFor="modalWidth">Taille de la fenêtre de réservation</Label>
                    <Input
                      id="modalWidth"
                      type="text"
                      value={modalWidth}
                      onChange={(e) => setModalWidth(e.target.value)}
                      placeholder="500px"
                      className="mt-2"
                      disabled={!isProUser}
                    />
                    <p className="text-xs text-[#666666] mt-1">
                      Largeur de la fenêtre de réservation (ex: 500px, 600px, 80%)
                    </p>
                  </div>

                  {/* Button Icon */}
                  <div className="flex items-center gap-3">
                    <input
                      id="buttonIcon"
                      type="checkbox"
                      checked={buttonIcon}
                      onChange={(e) => setButtonIcon(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="buttonIcon" className="mb-0">
                      Ajouter une icône 🍽️ devant le texte
                    </Label>
                  </div>
                </>
              )}

              {activeTab === 'form' && (
                <>
                  {/* Primary Color */}
                  <div>
                    <Label htmlFor="primaryColor">Couleur des boutons et éléments actifs</Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-[#666666] mt-1">
                      Couleur des boutons de validation, champs actifs et éléments interactifs
                    </p>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <Label htmlFor="secondaryColor">Couleur des titres et textes importants</Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        placeholder="#2A2A2A"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-[#666666] mt-1">
                      Couleur des titres, labels et textes principaux
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'form' && (
                <>
                  {/* Font Family */}
                  <div>
                    <Label htmlFor="fontFamily">Police du widget</Label>
                    <select
                      id="fontFamily"
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="mt-2 w-full p-2 border border-[#E5E5E5] rounded-md"
                    >
                      {AVAILABLE_FONTS.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-[#666666] mt-1">
                      Police utilisée pour tous les textes du widget (bouton et formulaire)
                    </p>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <Label htmlFor="borderRadius">Arrondi des coins</Label>
                    <Input
                      id="borderRadius"
                      type="text"
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(e.target.value)}
                      placeholder="4px"
                      className="mt-2"
                    />
                    <p className="text-xs text-[#666666] mt-1">
                      Arrondi des coins des boutons et champs (ex: 0px carré, 4px légèrement
                      arrondi, 8px arrondi)
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'advanced' && (
                <>
                  {/* Vanity URL System - Personnalisation du slug */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-[#2A2A2A] mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Personnalisation du Lien
                      </h3>

                      {/* Affichage du lien actuel */}
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                        <p className="text-sm text-blue-900 mb-2">
                          Votre lien de réservation actuel :
                        </p>
                        <div className="flex items-center justify-between bg-white p-3 rounded border overflow-hidden">
                          <code className="text-sm text-blue-700 break-all">
                            {process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/
                            {currentSlug}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/${currentSlug}`,
                                'current-link'
                              )
                            }
                          >
                            {copiedItem === 'current-link' ? (
                              <>
                                <Check className="h-4 w-4" /> Copié
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" /> Copier
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Personnalisation du slug (Pro & Enterprise) */}
                      {hasCustomSlug ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="customSlug">Personnaliser mon lien</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-sm text-gray-500 flex-shrink min-w-0 truncate">
                                {process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/
                              </span>
                              <Input
                                id="customSlug"
                                type="text"
                                value={customSlug}
                                onChange={(e) => handleCustomSlugChange(e.target.value)}
                                placeholder="mon-restaurant"
                                className="rounded-none pointer-events-auto flex-1 z-10"
                              />
                              <Button
                                onClick={handleSlugUpdate}
                                disabled={
                                  isSaving ||
                                  !customSlug ||
                                  customSlug.length < 3 ||
                                  !slugAvailability?.available
                                }
                                className="flex-shrink-0 min-w-[120px]"
                              >
                                {isSaving ? 'Mise à jour...' : 'Mettre à jour'}
                              </Button>
                            </div>

                            {/* Indicateur de disponibilité */}
                            {isCheckingAvailability && (
                              <p className="text-xs text-blue-600 mt-2">
                                Vérification de la disponibilité...
                              </p>
                            )}
                            {slugAvailability && !isCheckingAvailability && (
                              <p
                                className={`text-xs mt-2 ${
                                  slugAvailability.available ? 'text-green-600' : 'text-red-600'
                                }`}
                              >
                                {slugAvailability.message}
                              </p>
                            )}

                            <p className="text-xs text-gray-500 mt-2">
                              Utilisez uniquement des lettres minuscules, des chiffres et des tirets
                              (3-50 caractères)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Crown className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="font-medium text-[#2A2A2A]">
                                  Personnalisation du lien
                                </p>
                                <p className="text-sm text-[#666666]">
                                  Personnalisez votre lien de réservation avec le nom de votre choix
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => router.push('/dashboard')}
                              className="border-gray-300 text-gray-600"
                            >
                              <Crown className="h-4 w-4 mr-2" />
                              Passer au Pro
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message d'avertissement */}
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Options avancées : Ces paramètres nécessitent une compréhension technique.
                      Pour des modifications plus poussées, contactez le support.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={!isProUser || isSaving} className="flex-1">
                <Save className="h-4 w-4" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
            <CardDescription>
              Prévisualisation du bouton flottant avec vos paramètres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Device Toggle */}
              <div className="flex justify-center">
                <div className="inline-flex rounded-lg border border-[#E5E5E5] p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                      previewDevice === 'desktop'
                        ? 'bg-[#0066FF] text-white'
                        : 'text-[#666666] hover:text-[#2A2A2A]'
                    }`}
                  >
                    <Monitor className="h-4 w-4" />
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                      previewDevice === 'mobile'
                        ? 'bg-[#0066FF] text-white'
                        : 'text-[#666666] hover:text-[#2A2A2A]'
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </button>
                </div>
              </div>

              {/* Preview Container */}
              <div
                className={`border border-[#E5E5E5] rounded-lg overflow-hidden bg-white shadow-sm ${
                  previewDevice === 'mobile' ? 'max-w-sm mx-auto' : ''
                }`}
              >
                <div
                  className="relative bg-gradient-to-br from-gray-50 to-gray-100"
                  style={{ height: '400px' }}
                >
                  {/* Floating Button Preview */}
                  <div className="absolute bottom-4 right-4">
                    <button
                      id="preview-button"
                      type="button"
                      className={`px-4 py-2 font-medium shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                        buttonStyle === 'minimal' ? 'border-2 backdrop-blur-sm' : ''
                      }`}
                      style={{
                        backgroundColor:
                          buttonStyle === 'minimal'
                            ? 'rgba(255, 255, 255, 0.9)'
                            : buttonBackgroundColor,
                        color: buttonStyle === 'minimal' ? buttonBackgroundColor : buttonTextColor,
                        fontFamily: fontFamily,
                        borderRadius:
                          buttonStyle === 'round'
                            ? '25px'
                            : buttonStyle === 'square'
                              ? '4px'
                              : '20px',
                        borderColor:
                          buttonStyle === 'minimal' ? buttonBackgroundColor : 'transparent',
                        boxShadow:
                          buttonStyle === 'minimal'
                            ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                            : '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                      onMouseEnter={(e) => {
                        if (buttonHoverColor) {
                          e.currentTarget.style.backgroundColor =
                            buttonStyle === 'minimal' ? buttonHoverColor : buttonHoverColor;
                          e.currentTarget.style.color =
                            buttonStyle === 'minimal' ? '#FFFFFF' : buttonTextColor;
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          buttonStyle === 'minimal'
                            ? 'rgba(255, 255, 255, 0.9)'
                            : buttonBackgroundColor;
                        e.currentTarget.style.color =
                          buttonStyle === 'minimal' ? buttonBackgroundColor : buttonTextColor;
                        e.currentTarget.style.boxShadow =
                          buttonStyle === 'minimal'
                            ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                            : '0 4px 12px rgba(0, 0, 0, 0.15)';
                      }}
                    >
                      {buttonIcon ? '🍽️ ' : ''}
                      {buttonText}
                    </button>
                  </div>

                  {/* Sample website content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div
                        className="h-6 bg-gray-300 rounded mb-2"
                        style={{ fontFamily: fontFamily }}
                      ></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Modal Button */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir le formulaire
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Test du bouton avec animation
                    const button = document.querySelector('#preview-button') as HTMLButtonElement;
                    if (button) {
                      button.style.transform = 'scale(0.95)';
                      setTimeout(() => {
                        button.style.transform = 'scale(1)';
                      }, 150);
                    }
                  }}
                  className="w-full"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Tester le style
                </Button>
              </div>
            </div>
            <p className="text-xs text-[#666666] mt-3 text-center">
              Les modifications seront visibles après sauvegarde
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Full Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
              <h3 className="text-lg font-medium text-[#2A2A2A]">Aperçu du widget</h3>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {/* Preview of the reservation form with current colors */}
              <div
                className="bg-white rounded-lg shadow-lg"
                style={{
                  width: modalWidth,
                  maxWidth: '95vw',
                  margin: '0 auto',
                  fontFamily: fontFamily,
                }}
              >
                <div className="p-6 border-b" style={{ borderColor: '#E5E5E5' }}>
                  <h2 className="text-xl font-semibold" style={{ color: secondaryColor }}>
                    Formulaire de Réservation
                  </h2>
                  <p className="text-sm mt-1" style={{ color: '#666666' }}>
                    {restaurant?.name || 'Restaurant'}
                    {activeTab !== 'floating-button' && (
                      <span className="block text-xs text-amber-600 mt-1">
                        Aperçu simulé - les couleurs et styles sont ceux configurés
                      </span>
                    )}
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: secondaryColor }}
                    >
                      Nom
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      style={{ borderRadius: borderRadius, borderColor: '#E5E5E5' }}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: secondaryColor }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-3 border rounded-lg"
                        style={{ borderRadius: borderRadius, borderColor: '#E5E5E5' }}
                        placeholder="jean@example.com"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: secondaryColor }}
                      >
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        className="w-full p-3 border rounded-lg"
                        style={{ borderRadius: borderRadius, borderColor: '#E5E5E5' }}
                        placeholder="+33612345678"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: secondaryColor }}
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-3 border rounded-lg"
                        style={{ borderRadius: borderRadius, borderColor: '#E5E5E5' }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: secondaryColor }}
                      >
                        Personnes
                      </label>
                      <select
                        className="w-full p-3 border rounded-lg"
                        style={{ borderRadius: borderRadius, borderColor: '#E5E5E5' }}
                      >
                        <option>2 personnes</option>
                      </select>
                    </div>
                  </div>
                  <button
                    className="w-full py-3 text-white font-medium rounded-lg transition-colors"
                    style={{
                      backgroundColor: primaryColor,
                      borderRadius: borderRadius,
                    }}
                  >
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
