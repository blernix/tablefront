'use client';
/* eslint-disable react/no-unescaped-entities */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { generateShortCode } from '@/utils/slugGenerator';
import { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { useRestaurantStore } from '@/store/restaurantStore';
import { useCanCustomizeWidget, useHasCustomSlug, ProBadge } from '@/features';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Crown, Save, RotateCcw, Palette, Eye, Smartphone, Monitor, Copy, Check, Square, Type, Radius, Layout, Settings, Globe, ArrowLeft, X, Loader2 } from 'lucide-react';

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

export default function WidgetSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth, isInitialized } = useAuthStore();
  const { restaurant, isLoading: isRestaurantLoading, fetchRestaurant } = useRestaurantStore();
  const canCustomizeWidget = useCanCustomizeWidget();
  const hasCustomSlug = useHasCustomSlug();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'floating-button' | 'form' | 'advanced'>('floating-button');
  const [primaryColor, setPrimaryColor] = useState('#0066FF');
  const [secondaryColor, setSecondaryColor] = useState('#2A2A2A');
  const [fontFamily, setFontFamily] = useState('system-ui, sans-serif');
  const [borderRadius, setBorderRadius] = useState('8px');
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState('#0066FF');
  const [buttonTextColor, setButtonTextColor] = useState('#FFFFFF');
  const [buttonHoverColor, setButtonHoverColor] = useState('#0052CC');
  const [buttonText, setButtonText] = useState('Réserver une table');
  const buttonPosition = 'bottom-right';
  const [buttonStyle, setButtonStyle] = useState<'round' | 'square' | 'minimal'>('round');
  const [buttonIcon, setButtonIcon] = useState(false);
  const [modalWidth, setModalWidth] = useState('500px');
  const [modalHeight, setModalHeight] = useState('600px');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [customSlug, setCustomSlug] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [slugAvailability, setSlugAvailability] = useState<{ available: boolean; message: string } | null>(null);
  const currentSlug = restaurant?.publicSlug || generateShortCode(8);
  const isProUser = canCustomizeWidget;

  const copyToClipboard = async (text: string, itemId: string) => {
    try { await navigator.clipboard.writeText(text); setCopiedItem(itemId); setTimeout(() => setCopiedItem(null), 2000); }
    catch (err) { console.error('Failed to copy:', err); setError('Échec de la copie.'); }
  };

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => { if (isInitialized && !isAuthenticated) router.push('/login'); }, [isInitialized, isAuthenticated, router]);
  useEffect(() => { if (isAuthenticated && user?.restaurantId) fetchRestaurant(); }, [isAuthenticated, user?.restaurantId, fetchRestaurant]);

  useEffect(() => {
    const widgetConfig = restaurant?.widgetConfig;
    if (widgetConfig) {
      setPrimaryColor(widgetConfig.primaryColor || '#000000');
      setSecondaryColor(widgetConfig.secondaryColor || '#2A2A2A');
      setFontFamily(widgetConfig.fontFamily || 'system-ui, sans-serif');
      setBorderRadius(widgetConfig.borderRadius || '4px');
      setButtonBackgroundColor(widgetConfig.buttonBackgroundColor || widgetConfig.primaryColor || '#000000');
      setButtonTextColor(widgetConfig.buttonTextColor || '#FFFFFF');
      setButtonHoverColor(widgetConfig.buttonHoverColor || '#333333');
      setButtonText(widgetConfig.buttonText || 'Réserver une table');
      setButtonStyle(widgetConfig.buttonStyle || 'round');
      setButtonIcon(widgetConfig.buttonIcon !== undefined ? widgetConfig.buttonIcon : false);
      setModalWidth(widgetConfig.modalWidth || '500px');
      setModalHeight(widgetConfig.modalHeight || '600px');
    }
  }, [restaurant]);
  useEffect(() => {}, [restaurant]);

  const handleReset = () => {
    setPrimaryColor('#0066FF'); setSecondaryColor('#2A2A2A'); setFontFamily('system-ui, sans-serif');
    setBorderRadius('8px'); setButtonBackgroundColor('#0066FF'); setButtonTextColor('#FFFFFF');
    setButtonHoverColor('#0052CC'); setButtonText('Réserver une table'); setButtonStyle('round');
    setButtonIcon(false); setModalWidth('500px'); setModalHeight('600px');
  };

  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) { setSlugAvailability(null); return; }
    setIsCheckingAvailability(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/public/check-slug-availability/${slug}`);
      const data = await response.json();
      setSlugAvailability({ available: data.available, message: data.message });
    } catch { setSlugAvailability({ available: false, message: 'Erreur lors de la vérification' }); }
    finally { setIsCheckingAvailability(false); }
  };

  const handleCustomSlugChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setCustomSlug(cleaned);
    if (cleaned.length >= 3) checkSlugAvailability(cleaned); else setSlugAvailability(null);
  };

  const handleSlugUpdate = async () => {
    if (!customSlug || customSlug.length < 3) { setError('Le slug doit faire au moins 3 caractères'); return; }
    setIsSaving(true);
    try {
      await apiClient.restaurants.updateSlug({ slug: customSlug });
      setSuccess(true); setSlugAvailability(null); setCustomSlug(''); await fetchRestaurant();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) { setError(err.message || 'Erreur lors de la mise à jour du slug'); }
    finally { setIsSaving(false); }
  };

  const handleSave = async () => {
    setError(''); setSuccess(false);
    if (!isProUser) { setError('Cette fonctionnalité nécessite un abonnement Pro.'); return; }
    if (!/^\d+px$/.test(borderRadius)) { setError('Le border radius doit être au format "4px", "8px", etc.'); return; }
    if (!/^#[0-9A-Fa-f]{6}$/.test(primaryColor) || !/^#[0-9A-Fa-f]{6}$/.test(secondaryColor)) { setError('Les couleurs doivent être au format hexadécimal (#RRGGBB).'); return; }
    setIsSaving(true);
    try {
      await apiClient.restaurants.updateWidgetConfig({
        primaryColor, secondaryColor, fontFamily, borderRadius,
        buttonBackgroundColor, buttonTextColor, buttonHoverColor,
        buttonText, buttonPosition: 'bottom-right', buttonStyle, buttonIcon,
        modalWidth, modalHeight,
      });
      setSuccess(true); await fetchRestaurant(); setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) { console.error(err); setError(err.message || 'Erreur lors de la sauvegarde.'); }
    finally { setIsSaving(false); }
  };

  const ColorInput = ({ id, label, value, onChange, desc, disabled }: { id: string; label: string; value: string; onChange: (v: string) => void; desc: string; disabled?: boolean }) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-[#8E8E93] md:text-sm">{label}</label>
      <div className="flex gap-2">
        <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="w-11 h-11 rounded-xl border border-[#E5E5EA] cursor-pointer flex-shrink-0 disabled:opacity-50" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" disabled={disabled} className="flex-1 h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] font-mono focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 disabled:opacity-50 md:h-10 md:text-sm" />
      </div>
      <p className="text-[11px] text-[#8E8E93] md:text-xs">{desc}</p>
    </div>
  );

  const TabButton = ({ tab, icon, label }: { tab: typeof activeTab; icon: React.ReactNode; label: string }) => (
    <button type="button" onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${activeTab === tab ? 'bg-[#0066FF] text-white' : 'text-[#8E8E93] active:bg-[#F2F2F7]'} md:text-sm`}>{icon}{label}</button>
  );

  if (!isInitialized || isRestaurantLoading) return <LoadingSkeleton type="dashboard" />;
  if (!isAuthenticated) return <LoadingSkeleton type="dashboard" />;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="hidden md:block">
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Personnalisation</h1>
          <ProBadge />
        </div>
        <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">
          {isProUser ? "Personnalisez l'apparence du bouton et du formulaire de réservation" : 'Fonctionnalité Pro — personnalisez votre bouton flottant'}
        </p>
      </div>

      {!isProUser && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 md:p-5 md:rounded-xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0"><Crown className="h-5 w-5 text-amber-600" /></div>
              <div>
                <p className="text-[15px] font-semibold text-amber-900 md:text-sm">Fonctionnalité Pro</p>
                <p className="text-[12px] text-amber-800 md:text-xs">Passez au plan Pro pour personnaliser les couleurs et le style. Vous pouvez prévisualiser les options.</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="border-amber-300 text-amber-700 active:bg-amber-100 rounded-xl h-10 text-[13px] md:h-9 md:text-xs"><Crown className="h-4 w-4 mr-1.5" /> Passer au Pro</Button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 md:rounded-xl"><p className="text-[13px] text-red-800 md:text-sm">{error}</p></div>
      )}
      {success && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-center md:rounded-xl"><p className="text-[13px] font-medium text-emerald-700 md:text-sm">✓ Configuration sauvegardée</p></div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
        <TabButton tab="floating-button" icon={<Layout className="h-4 w-4" />} label="Style du bouton" />
        <TabButton tab="form" icon={<Square className="h-4 w-4" />} label="Style du formulaire" />
        <TabButton tab="advanced" icon={<Settings className="h-4 w-4" />} label="Lien personnalisé" />
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Config card */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
          <div className="p-4 md:p-5 space-y-5">
            {activeTab === 'floating-button' && (
              <>
                {/* Texte du bouton */}
                <div className="space-y-1.5">
                  <label htmlFor="buttonText" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Texte du bouton</label>
                  <input id="buttonText" type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="Réserver une table" disabled={!isProUser}
                    className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 disabled:opacity-50 md:h-10 md:text-sm" />
                  <p className="text-[11px] text-[#8E8E93] md:text-xs">Texte affiché sur le bouton flottant</p>
                </div>

                {/* Couleurs du bouton */}
                <div className="pt-2">
                  <p className="text-[14px] font-semibold text-[#000000] mb-4 md:text-sm flex items-center gap-2"><Palette className="h-4 w-4" /> Couleurs du bouton</p>
                  <div className="space-y-4">
                    <ColorInput id="buttonBackgroundColor" label="Couleur du bouton" value={buttonBackgroundColor} onChange={setButtonBackgroundColor} desc="Fond du bouton flottant" disabled={!isProUser} />
                    <ColorInput id="buttonTextColor" label="Couleur du texte" value={buttonTextColor} onChange={setButtonTextColor} desc="Texte sur le bouton" />
                    <ColorInput id="buttonHoverColor" label="Couleur au survol" value={buttonHoverColor} onChange={setButtonHoverColor} desc="Quand la souris passe dessus" />
                  </div>
                </div>

                {/* Forme */}
                <div className="space-y-1.5">
                  <label htmlFor="buttonStyle" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Forme du bouton</label>
                  <select id="buttonStyle" value={buttonStyle} onChange={(e) => setButtonStyle(e.target.value as any)} disabled={!isProUser}
                    className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 disabled:opacity-50 appearance-none md:h-10 md:text-sm">
                    <option value="round">Arrondi</option>
                    <option value="square">Carré</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>

                {/* Taille fenêtre */}
                <div className="space-y-1.5">
                  <label htmlFor="modalWidth" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Largeur de la fenêtre</label>
                  <input id="modalWidth" type="text" value={modalWidth} onChange={(e) => setModalWidth(e.target.value)} placeholder="500px" disabled={!isProUser}
                    className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 disabled:opacity-50 md:h-10 md:text-sm" />
                  <p className="text-[11px] text-[#8E8E93] md:text-xs">Ex: 500px, 600px, 80%</p>
                </div>

                {/* Icône */}
                <div className="flex items-center gap-3">
                  <input id="buttonIcon" type="checkbox" checked={buttonIcon} onChange={(e) => setButtonIcon(e.target.checked)} className="h-5 w-5 rounded border-[#E5E5EA] text-[#0066FF] focus:ring-[#0066FF]" />
                  <label htmlFor="buttonIcon" className="text-[15px] text-[#000000] md:text-sm">Ajouter une icône 🍽️</label>
                </div>
              </>
            )}

            {activeTab === 'form' && (
              <>
                <ColorInput id="primaryColor" label="Couleur principale" value={primaryColor} onChange={setPrimaryColor} desc="Boutons de validation, champs actifs, éléments interactifs" />
                <ColorInput id="secondaryColor" label="Couleur secondaire" value={secondaryColor} onChange={setSecondaryColor} desc="Titres, labels et textes principaux" />

                <div className="space-y-1.5">
                  <label htmlFor="fontFamily" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Police du widget</label>
                  <select id="fontFamily" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 appearance-none md:h-10 md:text-sm">
                    {AVAILABLE_FONTS.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
                  </select>
                  <p className="text-[11px] text-[#8E8E93] md:text-xs">Police pour tous les textes du widget</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="borderRadius" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Arrondi des coins</label>
                  <input id="borderRadius" type="text" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} placeholder="8px"
                    className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
                  <p className="text-[11px] text-[#8E8E93] md:text-xs">Ex: 0px (carré), 4px, 8px (arrondi)</p>
                </div>
              </>
            )}

            {activeTab === 'advanced' && (
              <>
                <div className="space-y-1.5">
                  <p className="text-[14px] font-semibold text-[#000000] md:text-sm flex items-center gap-2"><Globe className="h-4 w-4" /> Votre lien actuel</p>
                  <div className="rounded-xl bg-[#0066FF]/5 border border-[#0066FF]/10 p-3 flex items-center justify-between gap-2">
                    <code className="text-[13px] text-[#0066FF] break-all md:text-sm">{(process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000')}/{currentSlug}</code>
                    <button onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/${currentSlug}`, 'current-link')}
                      className="flex items-center gap-1 text-[12px] font-medium text-[#8E8E93] active:text-[#0066FF] flex-shrink-0 md:text-xs">
                      {copiedItem === 'current-link' ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copié</> : <><Copy className="h-3.5 w-3.5" /> Copier</>}
                    </button>
                  </div>
                </div>

                {hasCustomSlug ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="customSlug" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Personnaliser mon lien</label>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center h-11 px-3 rounded-l-xl border border-r-0 border-[#E5E5EA] bg-[#F2F2F7] text-[13px] text-[#8E8E93] md:h-10 md:text-sm">{process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/</span>
                        <input id="customSlug" type="text" value={customSlug} onChange={(e) => handleCustomSlugChange(e.target.value)} placeholder="mon-restaurant"
                          className="h-11 px-3 border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 flex-1 md:h-10 md:text-sm" />
                        <Button onClick={handleSlugUpdate} disabled={isSaving || !customSlug || customSlug.length < 3 || !slugAvailability?.available} className="h-11 rounded-xl text-[13px] md:h-10 md:text-xs flex-shrink-0">
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Valider'}
                        </Button>
                      </div>
                      {isCheckingAvailability && <p className="text-[11px] text-[#0066FF]">Vérification...</p>}
                      {slugAvailability && !isCheckingAvailability && <p className={`text-[11px] ${slugAvailability.available ? 'text-emerald-600' : 'text-red-500'}`}>{slugAvailability.message}</p>}
                      <p className="text-[11px] text-[#8E8E93] md:text-xs">Lettres minuscules, chiffres et tirets (3-50 caractères)</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-[#F2F2F7] p-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <Crown className="h-5 w-5 text-[#8E8E93]" />
                        <div>
                          <p className="text-[15px] font-medium text-[#000000] md:text-sm">Lien personnalisé</p>
                          <p className="text-[12px] text-[#8E8E93] md:text-xs">Disponible avec le plan Pro</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => router.push('/dashboard')} className="rounded-xl h-10 text-[13px] md:h-9 md:text-xs"><Crown className="h-3.5 w-3.5 mr-1.5" /> Passer au Pro</Button>
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <p className="text-[12px] text-amber-800 md:text-xs">⚠️ Options avancées — une modification de lien peut impacter vos intégrations existantes.</p>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={!isProUser || isSaving} className="flex-1 h-11 rounded-xl text-[15px] font-medium md:h-10 md:text-sm">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSaving ? 'Sauvegarde...' : 'Valider'}
              </Button>
              <Button variant="outline" onClick={handleReset} className="h-11 rounded-xl text-[15px] font-medium md:h-10 md:text-sm">
                <RotateCcw className="h-4 w-4 md:mr-1.5" />
                <span className="hidden md:inline">Réinitialiser</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
          <div className="p-4 md:p-5">
            <h2 className="text-[17px] font-semibold text-[#000000] mb-4 md:text-lg">Aperçu</h2>

            {/* Device toggle */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex bg-[#F2F2F7] rounded-xl p-0.5">
                <button onClick={() => setPreviewDevice('desktop')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${previewDevice === 'desktop' ? 'bg-white text-[#000000] shadow-sm' : 'text-[#8E8E93]'}`}>
                  <Monitor className="h-4 w-4" />Desktop
                </button>
                <button onClick={() => setPreviewDevice('mobile')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${previewDevice === 'mobile' ? 'bg-white text-[#000000] shadow-sm' : 'text-[#8E8E93]'}`}>
                  <Smartphone className="h-4 w-4" />Mobile
                </button>
              </div>
            </div>

            {/* Preview container */}
            <div className={`rounded-2xl border border-[#E5E5EA] overflow-hidden bg-[#F2F2F7] ${previewDevice === 'mobile' ? 'max-w-[280px] mx-auto' : ''}`}>
              <div className="relative" style={{ height: '320px' }}>
                {/* Sample content */}
                <div className="p-5">
                  <div className="mb-4">
                    <div className="h-4 bg-[#E5E5EA] rounded w-24 mb-2" />
                    <div className="h-3 bg-[#E5E5EA] rounded w-40" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-2.5 bg-[#E5E5EA] rounded" />
                    <div className="h-2.5 bg-[#E5E5EA] rounded w-5/6" />
                    <div className="h-2.5 bg-[#E5E5EA] rounded w-4/5" />
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="h-3 bg-[#E5E5EA] rounded w-20 mb-2" />
                    <div className="h-2.5 bg-[#E5E5EA] rounded mb-1.5" />
                    <div className="h-2.5 bg-[#E5E5EA] rounded w-4/5" />
                  </div>
                </div>

                {/* Floating button */}
                <div className="absolute bottom-4 right-4">
                  <button type="button" id="preview-button"
                    className={`px-4 py-2 font-medium transition-all duration-300 hover:scale-105 ${buttonStyle === 'minimal' ? 'border-2 backdrop-blur-sm' : ''}`}
                    style={{
                      backgroundColor: buttonStyle === 'minimal' ? 'rgba(255,255,255,0.9)' : buttonBackgroundColor,
                      color: buttonStyle === 'minimal' ? buttonBackgroundColor : buttonTextColor,
                      fontFamily, borderRadius: buttonStyle === 'round' ? '25px' : buttonStyle === 'square' ? '4px' : '20px',
                      borderColor: buttonStyle === 'minimal' ? buttonBackgroundColor : 'transparent',
                      boxShadow: buttonStyle === 'minimal' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = buttonHoverColor;
                      if (buttonStyle === 'minimal') e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = buttonStyle === 'minimal' ? 'rgba(255,255,255,0.9)' : buttonBackgroundColor;
                      e.currentTarget.style.color = buttonStyle === 'minimal' ? buttonBackgroundColor : buttonTextColor;
                      e.currentTarget.style.boxShadow = buttonStyle === 'minimal' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                  >
                    {buttonIcon ? '🍽️ ' : ''}{buttonText}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowPreviewModal(true)} className="h-11 rounded-xl text-[13px] font-medium md:h-10 md:text-sm"><Eye className="h-4 w-4 mr-1.5" /> Formulaire</Button>
              <Button variant="outline" onClick={() => { const btn = document.querySelector('#preview-button') as HTMLButtonElement; if (btn) { btn.style.transform = 'scale(0.95)'; setTimeout(() => btn.style.transform = 'scale(1)', 150); } }} className="h-11 rounded-xl text-[13px] font-medium md:h-10 md:text-sm"><Palette className="h-4 w-4 mr-1.5" /> Tester</Button>
            </div>
            <p className="text-[11px] text-[#8E8E93] text-center mt-3 md:text-xs">Les modifications sont visibles après sauvegarde</p>
          </div>
        </div>
      </div>

      {/* Full preview modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPreviewModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#E5E5EA]">
              <h3 className="text-[17px] font-semibold text-[#000000] md:text-lg">Aperçu du formulaire</h3>
              <button onClick={() => setShowPreviewModal(false)} className="h-8 w-8 rounded-full flex items-center justify-center text-[#8E8E93] active:bg-[#F2F2F7] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-60px)]">
              <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden mx-auto" style={{ width: modalWidth, maxWidth: '95vw', fontFamily }}>
                <div className="p-4 md:p-5 border-b border-[#E5E5EA]">
                  <h2 className="text-lg font-semibold" style={{ color: secondaryColor }}>Formulaire de Réservation</h2>
                  <p className="text-[13px] mt-1" style={{ color: '#8E8E93' }}>{restaurant?.name || 'Restaurant'}</p>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium mb-1.5" style={{ color: secondaryColor }}>Nom</label>
                    <input type="text" className="w-full h-11 px-3 rounded-xl border text-[15px] bg-white" style={{ borderRadius, borderColor: '#E5E5EA' }} placeholder="Jean Dupont" readOnly />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-medium mb-1.5" style={{ color: secondaryColor }}>Email</label>
                      <input type="email" className="w-full h-11 px-3 rounded-xl border text-[15px] bg-white" style={{ borderRadius, borderColor: '#E5E5EA' }} placeholder="jean@mail.com" readOnly />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium mb-1.5" style={{ color: secondaryColor }}>Téléphone</label>
                      <input type="tel" className="w-full h-11 px-3 rounded-xl border text-[15px] bg-white" style={{ borderRadius, borderColor: '#E5E5EA' }} placeholder="06..." readOnly />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-medium mb-1.5" style={{ color: secondaryColor }}>Date</label>
                      <input type="date" className="w-full h-11 px-3 rounded-xl border text-[15px] bg-white" style={{ borderRadius, borderColor: '#E5E5EA' }} readOnly />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium mb-1.5" style={{ color: secondaryColor }}>Personnes</label>
                      <select className="w-full h-11 px-3 rounded-xl border text-[15px] bg-white appearance-none" style={{ borderRadius, borderColor: '#E5E5EA' }}><option>2 personnes</option></select>
                    </div>
                  </div>
                  <button className="w-full h-11 rounded-xl text-white text-[15px] font-medium transition-colors" style={{ backgroundColor: primaryColor, borderRadius }}>Réserver</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
