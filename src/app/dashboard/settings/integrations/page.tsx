'use client';
/* eslint-disable react/no-unescaped-entities */

import {
  Copy,
  Check,
  ExternalLink,
  Code2,
  Globe,
  Zap,
  Palette,
  Crown,
  Eye,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { useRestaurantStore } from '@/store/restaurantStore';
import { useCanCustomizeWidget, getPlanDisplay, FeatureUpgradeSection } from '@/features';
import { apiClient } from '@/lib/api';
import { generateShortCode } from '@/utils/slugGenerator';

export default function IntegrationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth, isInitialized } = useAuthStore();
  const {
    restaurant,
    isLoading: isRestaurantLoading,
    error: restaurantError,
    fetchRestaurant,
  } = useRestaurantStore();
  const canCustomizeWidget = useCanCustomizeWidget();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchRestaurant();
  }, [isInitialized, isAuthenticated, router, fetchRestaurant]);

  // Handle scroll detection for mobile tabs
  useEffect(() => {
    const tabsList = tabsListRef.current;
    if (!tabsList) return;

    const handleScroll = () => {
      const scrollLeft = tabsList.scrollLeft;
      setShowLeftGradient(scrollLeft > 10);
    };

    tabsList.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      tabsList.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

  // Générer le code court si disponible, sinon utiliser l'API key
  const shortCode = restaurant?.publicSlug || generateShortCode(8);
  const widgetCodeMinimal = `<script src="${API_URL}/widget.js" data-api-key="${restaurant?.apiKey}"></script>`;
  const widgetCodeSlug = `<script src="${API_URL}/widget.js" data-slug="${shortCode}" data-use-slug="true"></script>`;

  const embedUrl = `${FRONTEND_URL}/${shortCode}`;

  // Check if user can customize widget (Pro plan) - using feature flag hook

  const integrations = [
    {
      id: 'direct-link',
      name: 'Lien Direct',
      icon: ExternalLink,
      description: 'Pour réseaux sociaux, emails, QR codes',
      color: 'bg-blue-500',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-[#666666]">
            Partagez ce lien directement avec vos clients. Il ouvre le formulaire de réservation
            dans une nouvelle page.
          </p>

          <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#2A2A2A]">URL de réservation</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(embedUrl, 'direct-link')}
              >
                {copiedItem === 'direct-link' ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
            <code className="text-xs break-all text-[#0066FF]">{embedUrl}</code>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[#2A2A2A]">Utilisations recommandées :</p>
            <ul className="space-y-2 text-sm text-[#666666]">
              <li className="flex items-start gap-2">
                <span className="text-[#0066FF] mt-0.5">•</span>
                <span>
                  <strong>Instagram/Facebook Bio :</strong> Ajoutez le lien dans votre bio
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0066FF] mt-0.5">•</span>
                <span>
                  <strong>QR Code :</strong> Générez un QR code pointant vers ce lien
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0066FF] mt-0.5">•</span>
                <span>
                  <strong>Email Marketing :</strong> Bouton &quot;Réserver maintenant&quot;
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0066FF] mt-0.5">•</span>
                <span>
                  <strong>Google Maps :</strong> Lien de réservation dans votre profil
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'html',
      name: 'Site HTML / Vanilla',
      icon: Code2,
      description: 'Intégration via script JavaScript - Bouton flottant ou intégré',
      color: 'bg-orange-500',
      content: (
        <div className="space-y-6">
          {/* Intégration Bouton Flottant */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-[#2A2A2A]">Intégration recommandée</p>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#0066FF] rounded-full flex items-center justify-center text-white text-lg">
                  🎯
                </div>
                <div>
                  <h4 className="font-medium text-[#2A2A2A]">Bouton Flottant</h4>
                  <p className="text-sm text-[#666666]">
                    Bouton toujours visible qui flotte sur votre site. Recommandé pour une meilleure
                    conversion.
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-blue-700">
                  ✅ <strong>Avantages :</strong> Toujours visible, meilleur taux de conversion, pas
                  de conflit avec la mise en page, personnalisable sans code
                </p>
              </div>
            </div>
          </div>

          {/* Customize Widget Button */}
          <FeatureUpgradeSection feature="widget-customization">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-[#0066FF] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-[#0066FF]" />
                  <div>
                    <p className="font-medium text-[#2A2A2A]">Personnaliser l&apos;apparence</p>
                    <p className="text-sm text-[#666666]">
                      Modifiez les couleurs, la police et le style de votre widget
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/settings/widget')}
                  className="border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white"
                  disabled={!canCustomizeWidget}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Personnaliser
                </Button>
              </div>
            </div>
          </FeatureUpgradeSection>

          {/* Code Display */}
          <div className="space-y-6">
            {/* Nouveau système avec code court */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-[#2A2A2A] flex items-center gap-2">
                    🔗 Lien Court (Recommandé)
                    {restaurant?.subscription?.plan && (
                      <span
                        className={`text-xs ${getPlanDisplay(restaurant.subscription.plan).badgeClass} px-2 py-1 rounded`}
                      >
                        {getPlanDisplay(restaurant.subscription.plan).name}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-blue-700 mt-1">URL professionnelle et mémorisable</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(widgetCodeSlug, 'short-code')}
                >
                  {copiedItem === 'short-code' ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" /> Copié
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copier
                    </>
                  )}
                </Button>
              </div>
              <pre className="text-xs bg-[#2A2A2A] text-white p-3 rounded overflow-x-auto">
                <code>{`<script src="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/widget.js" data-slug="${shortCode}" data-use-slug="true"></script>`}</code>
              </pre>
              <p className="text-xs text-blue-700 mt-2">
                💡 Votre lien unique :{' '}
                {process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/{shortCode}
              </p>
            </div>

            {/* Ancien système avec API key (gardé pour compatibilité) */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-[#2A2A2A] flex items-center gap-2">
                    🔐 Système Classique
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Legacy
                    </span>
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Compatible avec les anciennes intégrations
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(widgetCodeMinimal, 'legacy')}
                >
                  {copiedItem === 'legacy' ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" /> Copié
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copier
                    </>
                  )}
                </Button>
              </div>
              <pre className="text-xs bg-[#2A2A2A] text-white p-3 rounded overflow-x-auto">
                <code>{`<script src="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/widget.js" data-api-key="${restaurant?.apiKey || 'VOTRE_CLE_API'}"></script>`}</code>
              </pre>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-md">
              <p className="text-sm text-green-900">
                🎯 <strong>Système Dynamique :</strong> Ces codes récupèrent automatiquement vos
                configurations depuis le dashboard. Modifiez les couleurs ou le style → ça se met à
                jour instantanément sur votre site sans recopier le code !
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <p className="text-sm text-blue-900">
              💡 <strong>Astuce :</strong> Placez ce code juste avant la balise{' '}
              <code>&lt;/body&gt;</code> pour de meilleures performances.
            </p>
          </div>
        </div>
      ),
    },

    {
      id: 'wordpress',
      name: 'WordPress',
      icon: Globe,
      description: 'Bloc HTML personnalisé',
      color: 'bg-blue-600',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-[#666666]">
            Intégrez le widget dans WordPress en utilisant un bloc HTML personnalisé ou le Custom
            HTML widget.
          </p>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[#2A2A2A]">
              Méthode 1 : Éditeur de blocs (Gutenberg)
            </p>
            <ol className="space-y-2 text-sm text-[#666666] list-decimal list-inside">
              <li>Créez ou modifiez une page/article</li>
              <li>Cliquez sur &quot;+&quot; pour ajouter un bloc</li>
              <li>Recherchez et sélectionnez &quot;HTML personnalisé&quot;</li>
              <li>Collez le code ci-dessous</li>
              <li>Publiez la page</li>
            </ol>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[#2A2A2A]">Méthode 2 : Widget Sidebar</p>
            <ol className="space-y-2 text-sm text-[#666666] list-decimal list-inside">
              <li>Allez dans Apparence → Widgets</li>
              <li>Ajoutez un widget "HTML personnalisé"</li>
              <li>Collez le code ci-dessous</li>
              <li>Enregistrez</li>
            </ol>
          </div>

          {/* Customize Widget Button */}
          <FeatureUpgradeSection feature="widget-customization">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-[#0066FF] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-[#0066FF]" />
                  <div>
                    <p className="font-medium text-[#2A2A2A]">Personnaliser l'apparence</p>
                    <p className="text-sm text-[#666666]">
                      Modifiez les couleurs, la police et le style de votre widget
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/settings/widget')}
                  className="border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white"
                  disabled={!canCustomizeWidget}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Personnaliser
                </Button>
              </div>
            </div>
          </FeatureUpgradeSection>

          <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#2A2A2A]">Code à copier</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(widgetCodeSlug, 'wordpress')}
              >
                {copiedItem === 'wordpress' ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
            <pre className="text-xs bg-[#2A2A2A] text-white p-3 rounded overflow-x-auto">
              <code>{widgetCodeSlug}</code>
            </pre>
          </div>
        </div>
      ),
    },

    {
      id: 'wix',
      name: 'Wix',
      icon: Zap,
      description: 'Élément HTML intégré',
      color: 'bg-purple-600',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-[#666666]">
            Intégrez le widget dans votre site Wix en utilisant l&apos;élément &quot;HTML
            intégré&quot;.
          </p>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[#2A2A2A]">Instructions :</p>
            <ol className="space-y-2 text-sm text-[#666666] list-decimal list-inside">
              <li>Ouvrez l'éditeur Wix</li>
              <li>Cliquez sur "Ajouter +" dans la barre latérale gauche</li>
              <li>Sélectionnez "Intégrer" → "HTML intégré"</li>
              <li>Cliquez sur "Saisir le code"</li>
              <li>Collez le code ci-dessous</li>
              <li>Cliquez sur "Mettre à jour"</li>
              <li>Ajustez la taille du cadre (recommandé : hauteur 800px)</li>
              <li>Publiez votre site</li>
            </ol>
          </div>

          {/* Customize Widget Button */}
          <FeatureUpgradeSection feature="widget-customization">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-[#0066FF] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-[#0066FF]" />
                  <div>
                    <p className="font-medium text-[#2A2A2A]">Personnaliser l'apparence</p>
                    <p className="text-sm text-[#666666]">
                      Modifiez les couleurs, la police et le style de votre widget
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/settings/widget')}
                  className="border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white"
                  disabled={!canCustomizeWidget}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Personnaliser
                </Button>
              </div>
            </div>
          </FeatureUpgradeSection>

          <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#2A2A2A]">Code à copier</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(widgetCodeSlug, 'wix')}
              >
                {copiedItem === 'wix' ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
            <pre className="text-xs bg-[#2A2A2A] text-white p-3 rounded overflow-x-auto">
              <code>{widgetCodeSlug}</code>
            </pre>
          </div>
        </div>
      ),
    },

    {
      id: 'shopify',
      name: 'Shopify',
      icon: Zap,
      description: 'Section HTML personnalisée',
      color: 'bg-green-600',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-[#666666]">
            Intégrez le widget dans votre boutique Shopify en utilisant une section HTML
            personnalisée.
          </p>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[#2A2A2A]">Instructions :</p>
            <ol className="space-y-2 text-sm text-[#666666] list-decimal list-inside">
              <li>Allez dans Boutique en ligne → Thèmes</li>
              <li>Cliquez sur "Personnaliser" sur votre thème actif</li>
              <li>Ajoutez une section "HTML personnalisé" où vous le souhaitez</li>
              <li>Collez le code ci-dessous</li>
              <li>Enregistrez</li>
            </ol>
          </div>

          {/* Customize Widget Button */}
          <FeatureUpgradeSection feature="widget-customization">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-[#0066FF] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-[#0066FF]" />
                  <div>
                    <p className="font-medium text-[#2A2A2A]">Personnaliser l'apparence</p>
                    <p className="text-sm text-[#666666]">
                      Modifiez les couleurs, la police et le style de votre widget
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/settings/widget')}
                  className="border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white"
                  disabled={!canCustomizeWidget}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Personnaliser
                </Button>
              </div>
            </div>
          </FeatureUpgradeSection>

          <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#2A2A2A]">Code à copier</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(widgetCodeSlug, 'shopify')}
              >
                {copiedItem === 'shopify' ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
            <pre className="text-xs bg-[#2A2A2A] text-white p-3 rounded overflow-x-auto">
              <code>{widgetCodeSlug}</code>
            </pre>
          </div>
        </div>
      ),
    },

    {
      id: 'webflow',
      name: 'Webflow',
      icon: Code2,
      description: 'Élément Embed',
      color: 'bg-blue-600',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-[#666666]">
            Intégrez le widget dans votre site Webflow en utilisant l'élément "Embed".
          </p>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[#2A2A2A]">Instructions :</p>
            <ol className="space-y-2 text-sm text-[#666666] list-decimal list-inside">
              <li>Ouvrez l'éditeur Webflow</li>
              <li>Cliquez sur "Ajouter +" dans la barre latérale gauche</li>
              <li>Sélectionnez "Intégrer" → "HTML intégré"</li>
              <li>Cliquez sur "Saisir le code"</li>
              <li>Collez le code ci-dessous</li>
              <li>Cliquez sur "Mettre à jour"</li>
              <li>Ajustez la taille du cadre (recommandé : hauteur 800px)</li>
              <li>Publiez votre site</li>
            </ol>
          </div>

          {/* Customize Widget Button */}
          <FeatureUpgradeSection feature="widget-customization">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-[#0066FF] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-[#0066FF]" />
                  <div>
                    <p className="font-medium text-[#2A2A2A]">Personnaliser l'apparence</p>
                    <p className="text-sm text-[#666666]">
                      Modifiez les couleurs, la police et le style de votre widget
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/settings/widget')}
                  className="border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white"
                  disabled={!canCustomizeWidget}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Personnaliser
                </Button>
              </div>
            </div>
          </FeatureUpgradeSection>

          <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#2A2A2A]">Code à copier</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(widgetCodeSlug, 'webflow')}
              >
                {copiedItem === 'webflow' ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
            <pre className="text-xs bg-[#2A2A2A] text-white p-3 rounded overflow-x-auto">
              <code>{widgetCodeSlug}</code>
            </pre>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0066FF]" />
        <div className="flex items-center gap-3 pt-4">
          <Code2 className="h-8 w-8 text-[#0066FF]" />
          <div>
            <h1 className="text-4xl font-light text-[#2A2A2A]">Intégrations</h1>
            <p className="mt-2 text-[#666666] font-light">
              Intégrez TableMaster sur votre site web, vos réseaux sociaux et bien plus
            </p>
          </div>
        </div>
      </div>

      {/* Integration Tabs */}
      <Tabs defaultValue="direct-link" className="space-y-6">
        <div className="relative px-2 lg:px-0 border-b lg:border-none pb-2 lg:pb-0">
          <TabsList
            ref={tabsListRef}
            className="relative flex flex-nowrap overflow-x-auto space-x-1 pb-3 scroll-smooth lg:grid lg:grid-cols-6 lg:gap-2 lg:overflow-visible"
          >
            {integrations.map((integration) => (
              <TabsTrigger
                key={integration.id}
                value={integration.id}
                className="flex-shrink-0 min-w-[100px] sm:min-w-[120px] px-3 py-2 text-sm sm:text-base rounded-md data-[state=active]:bg-[#0066FF] data-[state=active]:text-white hover:bg-gray-100 transition-colors"
              >
                {integration.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* Gradient indicateur droit (toujours visible) */}
          <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-10 lg:hidden" />
          {/* Gradient indicateur gauche (masqué par défaut) */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-10 lg:hidden transition-opacity duration-300 ${showLeftGradient ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        {integrations.map((integration) => (
          <TabsContent key={integration.id} value={integration.id} className="space-y-6">
            <Card className="border-[#E5E5E5]">
              <CardContent className="p-6">{integration.content}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
