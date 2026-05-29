'use client';
/* eslint-disable react/no-unescaped-entities */

import { Copy, Check, ExternalLink, Code2, Globe, Zap, Palette, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { useRestaurantStore } from '@/store/restaurantStore';
import { useCanCustomizeWidget, getPlanDisplay, FeatureUpgradeSection } from '@/features';
import { generateShortCode } from '@/utils/slugGenerator';

export default function IntegrationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth, isInitialized } = useAuthStore();
  const { restaurant, isLoading: isRestaurantLoading, fetchRestaurant } = useRestaurantStore();
  const canCustomizeWidget = useCanCustomizeWidget();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => { initAuth(); }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchRestaurant();
  }, [isInitialized, isAuthenticated, router, fetchRestaurant]);

  useEffect(() => {
    const tabsList = tabsListRef.current;
    if (!tabsList) return;
    const handleScroll = () => setShowLeftGradient(tabsList.scrollLeft > 10);
    tabsList.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => tabsList.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) { console.error('Failed to copy:', err); }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  const shortCode = restaurant?.publicSlug || generateShortCode(8);
  const widgetCodeSlug = `<script src="${API_URL}/widget.js" data-slug="${shortCode}" data-use-slug="true"></script>`;
  const widgetCodeMinimal = `<script src="${API_URL}/widget.js" data-api-key="${restaurant?.apiKey}"></script>`;
  const embedUrl = `${FRONTEND_URL}/${shortCode}`;

  const CodeBlock = ({ code, itemId }: { code: string; itemId: string }) => (
    <div className="rounded-xl bg-[#1C1C1E] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2C2C2E]">
        <span className="text-[11px] text-[#8E8E93] uppercase font-medium md:text-xs">Code</span>
        <button
          onClick={() => copyToClipboard(code, itemId)}
          className="flex items-center gap-1.5 text-[12px] font-medium text-[#8E8E93] active:text-[#0066FF] transition-colors md:text-xs"
        >
          {copiedItem === itemId ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copiedItem === itemId ? 'Copié' : 'Copier'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-[12px] text-[#E5E5EA] leading-relaxed md:text-xs">{code}</code>
      </pre>
    </div>
  );

  const CustomizeSection = () => (
    <FeatureUpgradeSection feature="widget-customization">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-[#0066FF]/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
              <Palette className="h-5 w-5 text-[#0066FF]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#000000] md:text-sm">Personnaliser le widget</p>
              <p className="text-[12px] text-[#8E8E93] md:text-xs">Modifiez les couleurs et le style</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings/widget')} disabled={!canCustomizeWidget} className="border-[#0066FF] text-[#0066FF] active:bg-[#0066FF] active:text-white rounded-xl h-10 text-[13px] md:h-9 md:text-xs">
            <Palette className="h-3.5 w-3.5 mr-1.5 md:mr-1" /> Ouvrir
          </Button>
        </div>
      </div>
    </FeatureUpgradeSection>
  );

  const integrations = [
    {
      id: 'direct-link', name: 'Lien direct', icon: ExternalLink, desc: 'Réseaux sociaux, emails, QR codes',
      content: (
        <div className="space-y-4">
          <p className="text-[13px] text-[#8E8E93] leading-relaxed md:text-sm md:text-gray-600">
            Partagez ce lien directement avec vos clients. Il ouvre le formulaire de réservation dans une nouvelle page.
          </p>
          <div className="rounded-xl border border-[#E5E5EA] overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-[#F2F2F7]">
              <span className="text-[13px] font-medium text-[#000000] md:text-sm">URL de réservation</span>
              <button onClick={() => copyToClipboard(embedUrl, 'direct-link')} className="flex items-center gap-1.5 text-[12px] font-medium text-[#8E8E93] active:text-[#0066FF] md:text-xs">
                {copiedItem === 'direct-link' ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copié</> : <><Copy className="h-3.5 w-3.5" /> Copier</>}
              </button>
            </div>
            <div className="p-4">
              <code className="text-[13px] text-[#0066FF] break-all font-mono md:text-sm">{embedUrl}</code>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[13px] font-medium text-[#000000] md:text-sm">Utilisations :</p>
            {[['Instagram / Facebook', 'Ajoutez le lien dans votre bio'], ['QR Code', 'Générez un QR code vers ce lien'], ['Email marketing', 'Bouton « Réserver maintenant »'], ['Google Maps', 'Lien dans votre profil établissement']].map(([title, desc]) => (
              <div key={title} className="flex items-start gap-2 text-[13px] text-[#8E8E93] md:text-sm">
                <span className="text-[#0066FF] font-bold mt-0.5">•</span>
                <span><strong className="text-[#000000]">{title}</strong> — {desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'html', name: 'Site HTML', icon: Code2, desc: 'Script JavaScript — bouton flottant',
      content: (
        <div className="space-y-5">
          <div className="rounded-xl bg-[#0066FF]/5 border border-[#0066FF]/10 p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#0066FF] flex items-center justify-center flex-shrink-0 text-white text-lg">🎯</div>
              <div>
                <p className="text-[14px] font-semibold text-[#000000] md:text-sm">Bouton flottant</p>
                <p className="text-[12px] text-[#8E8E93] mt-1 md:text-xs">Toujours visible sur votre site, meilleur taux de conversion.</p>
              </div>
            </div>
          </div>

          <CustomizeSection />

          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">🔗</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-[#000000] md:text-sm">Lien court (recommandé)</p>
                    {restaurant?.subscription?.plan && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getPlanDisplay(restaurant.subscription.plan).badgeClass}`}>{getPlanDisplay(restaurant.subscription.plan).name}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8E8E93] mt-0.5 md:text-xs">URL professionnelle avec votre slug</p>
                </div>
              </div>
              <div className="mt-3">
                <CodeBlock code={widgetCodeSlug} itemId="short-code" />
              </div>
              <p className="text-[11px] text-emerald-700 mt-2 md:text-xs">💡 Votre lien : {FRONTEND_URL}/{shortCode}</p>
            </div>

            <div className="rounded-xl bg-[#F2F2F7] p-3">
              <div className="flex items-start gap-2">
                <span className="mt-0.5">🔐</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-[#000000] md:text-sm">Système classique</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E5E5EA] text-[#8E8E93] font-medium">Legacy</span>
                  </div>
                  <p className="text-[11px] text-[#8E8E93] mt-0.5 md:text-xs">Compatible avec les anciennes intégrations</p>
                </div>
              </div>
              <div className="mt-3">
                <CodeBlock code={widgetCodeMinimal} itemId="legacy" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#0066FF]/5 border border-[#0066FF]/10 p-3">
            <p className="text-[12px] text-[#0066FF] md:text-xs">💡 Placez ce code juste avant <code className="text-[#0066FF] font-mono bg-[#0066FF]/10 px-1 rounded">&lt;/body&gt;</code> pour de meilleures performances.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'wordpress', name: 'WordPress', icon: Globe, desc: 'Bloc HTML personnalisé',
      content: (
        <div className="space-y-5">
          <p className="text-[13px] text-[#8E8E93] leading-relaxed md:text-sm">Intégrez le widget en utilisant un bloc HTML personnalisé.</p>

          <div className="space-y-3">
            <div>
              <p className="text-[14px] font-semibold text-[#000000] mb-2 md:text-sm">Méthode 1 : Bloc Gutenberg</p>
              <ol className="space-y-1.5 text-[13px] text-[#8E8E93] list-decimal list-inside md:text-sm">
                <li>Créez ou modifiez une page</li>
                <li>Ajoutez un bloc « HTML personnalisé »</li>
                <li>Collez le code ci-dessous</li>
                <li>Publiez</li>
              </ol>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#000000] mb-2 md:text-sm">Méthode 2 : Widget sidebar</p>
              <ol className="space-y-1.5 text-[13px] text-[#8E8E93] list-decimal list-inside md:text-sm">
                <li>Apparence → Widgets</li>
                <li>Ajoutez « HTML personnalisé »</li>
                <li>Collez le code</li>
                <li>Enregistrez</li>
              </ol>
            </div>
          </div>

          <CustomizeSection />
          <CodeBlock code={widgetCodeSlug} itemId="wordpress" />
        </div>
      ),
    },
    {
      id: 'wix', name: 'Wix', icon: Zap, desc: 'Élément HTML intégré',
      content: (
        <div className="space-y-5">
          <p className="text-[13px] text-[#8E8E93] leading-relaxed md:text-sm">Intégrez via l'élément « HTML intégré ».</p>
          <div>
            <p className="text-[14px] font-semibold text-[#000000] mb-2 md:text-sm">Instructions</p>
            <ol className="space-y-1.5 text-[13px] text-[#8E8E93] list-decimal list-inside md:text-sm">
              <li>Ouvrez l'éditeur Wix</li>
              <li>Ajouter + → Intégrer → HTML intégré</li>
              <li>Collez le code ci-dessous</li>
              <li>Hauteur recommandée : 800px</li>
              <li>Publiez</li>
            </ol>
          </div>
          <CustomizeSection />
          <CodeBlock code={widgetCodeSlug} itemId="wix" />
        </div>
      ),
    },
    {
      id: 'shopify', name: 'Shopify', icon: Zap, desc: 'Section HTML personnalisée',
      content: (
        <div className="space-y-5">
          <p className="text-[13px] text-[#8E8E93] leading-relaxed md:text-sm">Intégrez via une section HTML personnalisée.</p>
          <div>
            <p className="text-[14px] font-semibold text-[#000000] mb-2 md:text-sm">Instructions</p>
            <ol className="space-y-1.5 text-[13px] text-[#8E8E93] list-decimal list-inside md:text-sm">
              <li>Boutique en ligne → Thèmes</li>
              <li>Personnaliser → Ajouter une section</li>
              <li>Sélectionnez « HTML personnalisé »</li>
              <li>Collez le code</li>
              <li>Enregistrez</li>
            </ol>
          </div>
          <CustomizeSection />
          <CodeBlock code={widgetCodeSlug} itemId="shopify" />
        </div>
      ),
    },
    {
      id: 'webflow', name: 'Webflow', icon: Code2, desc: 'Élément Embed',
      content: (
        <div className="space-y-5">
          <p className="text-[13px] text-[#8E8E93] leading-relaxed md:text-sm">Intégrez via l'élément « Embed ».</p>
          <div>
            <p className="text-[14px] font-semibold text-[#000000] mb-2 md:text-sm">Instructions</p>
            <ol className="space-y-1.5 text-[13px] text-[#8E8E93] list-decimal list-inside md:text-sm">
              <li>Ouvrez l'éditeur Webflow</li>
              <li>Ajouter + → Intégrer</li>
              <li>Sélectionnez « HTML intégré »</li>
              <li>Collez le code</li>
              <li>Hauteur recommandée : 800px</li>
              <li>Publiez</li>
            </ol>
          </div>
          <CustomizeSection />
          <CodeBlock code={widgetCodeSlug} itemId="webflow" />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="hidden md:block">
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button>
      </div>

      <div>
        <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Intégrations</h1>
        <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Intégrez TableMaster sur votre site web</p>
      </div>

      <Tabs defaultValue="direct-link" className="space-y-4">
        <div className="relative">
          <TabsList ref={tabsListRef} className="relative flex flex-nowrap overflow-x-auto gap-1 pb-3 scroll-smooth no-scrollbar lg:grid lg:grid-cols-6 lg:gap-2 lg:overflow-visible">
            {integrations.map((int) => (
              <TabsTrigger key={int.id} value={int.id} className="flex-shrink-0 px-4 py-2 text-[13px] font-medium rounded-xl data-[state=active]:bg-[#0066FF] data-[state=active]:text-white text-[#8E8E93] active:bg-[#F2F2F7] transition-colors md:text-sm">
                {int.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none lg:hidden" />
          <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none lg:hidden transition-opacity duration-300 ${showLeftGradient ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {integrations.map((int) => (
          <TabsContent key={int.id} value={int.id}>
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 md:p-6 md:rounded-xl">
              {int.content}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
