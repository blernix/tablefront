'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import QrCodeDisplay from '@/components/menu/QrCodeDisplay';
import { Upload, FileText, CheckCircle, AlertCircle, List, ChevronRight, QrCode } from 'lucide-react';

export default function MenusPage() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getMyRestaurant();
      setRestaurant(response.restaurant);
    } catch (err) {
      console.error('Error fetching restaurant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadStatus({
        type: 'error',
        message: 'Seuls les fichiers PDF sont acceptés',
      });
      setSelectedFile(null);
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({
        type: 'error',
        message: 'Le fichier ne doit pas dépasser 10 Mo',
      });
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadStatus({ type: null, message: '' });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadStatus({ type: null, message: '' });

      const response = await apiClient.uploadMenuPdf(selectedFile);

      setUploadStatus({
        type: 'success',
        message: response.message || 'Menu PDF téléchargé avec succès',
      });

      setSelectedFile(null);

      // Reset file input
      const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Refresh restaurant data
      await fetchRestaurant();
    } catch (err) {
      setUploadStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erreur lors du téléchargement',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSwitchMode = async (mode: 'pdf' | 'detailed' | 'both') => {
    if (mode === 'pdf' && !restaurant?.menu.pdfUrl) {
      if (!confirm('Vous n\'avez pas encore téléchargé de PDF. Voulez-vous passer en mode PDF quand même ?')) {
        return;
      }
    }

    if (mode === 'both' && !restaurant?.menu.pdfUrl) {
      alert('Vous devez d\'abord télécharger un PDF pour activer le mode combiné.');
      return;
    }

    try {
      await apiClient.switchMenuMode(mode);
      await fetchRestaurant();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors du changement de mode');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-lg" />
        <div className="h-64 bg-slate-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Gestion du Menu</h1>
        <p className="mt-2 text-slate-600">
          Mode: <span className="font-medium capitalize">{restaurant?.menu.displayMode === 'pdf' ? 'PDF' : restaurant?.menu.displayMode === 'detailed' ? 'Détaillé' : 'Combiné (PDF + Détaillé)'}</span>
        </p>
      </div>

      {/* QR Code Section - Only show if PDF exists */}
      {restaurant?.menu.pdfUrl && (
        <QrCodeDisplay 
          pdfUrl={restaurant.menu.pdfUrl} 
          restaurantName={restaurant.name}
        />
      )}

      {/* Current Menu Status */}
      <Card className="border-decorative shadow-elevated">
        <CardHeader>
          <CardTitle>Menu actuel</CardTitle>
          <CardDescription className="text-muted-foreground">
            Mode d&apos;affichage : <span className="font-semibold text-gold">
              {restaurant?.menu.displayMode === 'pdf' ? 'PDF' : restaurant?.menu.displayMode === 'both' ? 'PDF + Détaillé' : 'Détaillé'}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(restaurant?.menu.displayMode === 'pdf' || restaurant?.menu.displayMode === 'both') && restaurant?.menu.pdfUrl ? (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/30 border border-green-200/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-heading font-semibold text-lg text-navy">Menu PDF téléchargé</p>
                <div className="flex items-center gap-4 mt-2">
                  <a
                    href={restaurant.menu.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold/80 hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    Voir le menu
                  </a>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    Accès public via QR code
                  </span>
                </div>
              </div>
              {restaurant?.menu.displayMode === 'both' && (
                <div className="px-3 py-1 bg-gradient-to-r from-gold to-gold/80 text-white text-xs font-medium rounded-full">
                  Mode combiné
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50/50 to-yellow-50/30 border border-amber-200/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="font-heading font-semibold text-lg text-navy">Aucun menu PDF</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Téléchargez un PDF pour activer le mode PDF et générer des QR codes
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mode Switcher */}
      <Card className="border-decorative shadow-elevated">
        <CardHeader>
          <CardTitle>Mode d&apos;affichage</CardTitle>
          <CardDescription>
            Choisissez comment afficher votre menu sur votre site web
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleSwitchMode('pdf')}
              disabled={restaurant?.menu.displayMode === 'pdf'}
              className={`relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                restaurant?.menu.displayMode === 'pdf'
                  ? 'border-gold bg-gradient-to-br from-gold-light/20 to-gold/10 shadow-inner'
                  : 'border-gold-light/30 hover:border-gold hover:shadow-lg'
              } disabled:opacity-100 group`}
            >
              {restaurant?.menu.displayMode === 'pdf' && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 rounded-full bg-gold animate-pulse-subtle"></div>
                </div>
              )}
              <div className="font-heading font-semibold text-lg text-navy mb-2">Mode PDF</div>
              <div className="text-sm text-muted-foreground">
                Affichez uniquement votre menu PDF sur votre site
              </div>
              {restaurant?.menu.displayMode === 'pdf' && (
                <div className="absolute bottom-4 right-4">
                  <div className="text-xs font-medium text-gold bg-gold-light/30 px-3 py-1 rounded-full">Mode actuel</div>
                </div>
              )}
            </button>

            <button
              onClick={() => handleSwitchMode('detailed')}
              disabled={restaurant?.menu.displayMode === 'detailed'}
              className={`relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                restaurant?.menu.displayMode === 'detailed'
                  ? 'border-gold bg-gradient-to-br from-gold-light/20 to-gold/10 shadow-inner'
                  : 'border-gold-light/30 hover:border-gold hover:shadow-lg'
              } disabled:opacity-100 group`}
            >
              {restaurant?.menu.displayMode === 'detailed' && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 rounded-full bg-gold animate-pulse-subtle"></div>
                </div>
              )}
              <div className="font-heading font-semibold text-lg text-navy mb-2">Mode Détaillé</div>
              <div className="text-sm text-muted-foreground">
                Gérez vos catégories et plats individuellement
              </div>
              {restaurant?.menu.displayMode === 'detailed' && (
                <div className="absolute bottom-4 right-4">
                  <div className="text-xs font-medium text-gold bg-gold-light/30 px-3 py-1 rounded-full">Mode actuel</div>
                </div>
              )}
            </button>

            <button
              onClick={() => handleSwitchMode('both')}
              disabled={restaurant?.menu.displayMode === 'both'}
              className={`relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                restaurant?.menu.displayMode === 'both'
                  ? 'border-gold bg-gradient-to-br from-gold-light/20 to-gold/10 shadow-inner'
                  : 'border-gold-light/30 hover:border-gold hover:shadow-lg'
              } disabled:opacity-100 group`}
            >
              {restaurant?.menu.displayMode === 'both' && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 rounded-full bg-gold animate-pulse-subtle"></div>
                </div>
              )}
              <div className="font-heading font-semibold text-lg text-navy mb-2">Mode Combiné</div>
              <div className="text-sm text-muted-foreground">
                Affichez le PDF ET le menu détaillé
              </div>
              {restaurant?.menu.displayMode === 'both' && (
                <div className="absolute bottom-4 right-4">
                  <div className="text-xs font-medium text-gold bg-gold-light/30 px-3 py-1 rounded-full">Mode actuel</div>
                </div>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Menu Management - Show in detailed or both mode */}
      {(restaurant?.menu.displayMode === 'detailed' || restaurant?.menu.displayMode === 'both') && (
        <Card className="border-decorative shadow-elevated">
          <CardHeader>
            <CardTitle>Gestion du menu détaillé</CardTitle>
            <CardDescription>
              Gérez les catégories et les plats de votre menu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex items-center justify-between border-2 border-gold-light/30 rounded-2xl p-5 cursor-pointer hover:border-gold hover:shadow-lg transition-all duration-300 group"
              onClick={() => router.push('/dashboard/menus/categories')}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <List className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-lg text-navy">Catégories</p>
                  <p className="text-sm text-muted-foreground">
                    Organisez votre menu en sections
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gold group-hover:translate-x-1 transition-transform" />
            </div>

            <div
              className="flex items-center justify-between border-2 border-gold-light/30 rounded-2xl p-5 cursor-pointer hover:border-gold hover:shadow-lg transition-all duration-300 group"
              onClick={() => router.push('/dashboard/menus/dishes')}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-lg text-navy">Plats</p>
                  <p className="text-sm text-muted-foreground">
                    Gérez vos plats par catégorie
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gold group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Form */}
      <Card className="border-decorative shadow-elevated">
        <CardHeader>
          <CardTitle>Télécharger un nouveau menu PDF</CardTitle>
          <CardDescription>
            Le fichier doit être au format PDF et ne pas dépasser 10 Mo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="pdf-upload" className="text-sm font-medium text-navy/80">
              Choisir un fichier PDF
            </Label>
            <div className="relative">
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className="pl-10 py-6 border-2 border-gold-light/50 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 rounded-xl bg-white/50"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="w-5 h-5 text-gold" />
              </div>
            </div>
            {selectedFile && (
              <div className="rounded-xl bg-gradient-to-r from-navy/5 to-gold-light/10 p-4 border border-decorative">
                <p className="text-sm font-medium text-navy">
                  📄 Fichier sélectionné : <span className="font-semibold">{selectedFile.name}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Taille : {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
                </p>
              </div>
            )}
          </div>

          {uploadStatus.type && (
            <div
              className={`flex items-center gap-3 rounded-xl p-4 border-2 animate-slide-up ${
                uploadStatus.type === 'success'
                  ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/50 border-green-200 text-green-800'
                  : 'bg-gradient-to-r from-red-50/80 to-rose-50/50 border-red-200 text-red-800'
              }`}
            >
              {uploadStatus.type === 'success' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600" />
              )}
              <p className="text-sm font-medium">{uploadStatus.message}</p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full py-6 rounded-xl bg-gradient-to-r from-gold to-gold/80 hover:from-gold hover:to-gold text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Téléchargement en cours...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Upload className="mr-3 h-5 w-5" />
                Télécharger le menu PDF
              </span>
            )}
          </Button>

          {restaurant?.menu.displayMode === 'pdf' && restaurant?.menu.pdfUrl && (
            <div className="rounded-xl bg-gradient-to-r from-amber-50/50 to-yellow-50/30 p-4 border border-amber-200/50">
              <p className="text-sm font-medium text-amber-800">
                ⚠️ Note : Le téléchargement d&apos;un nouveau PDF remplacera le menu actuel. Le QR code restera valide.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-decorative shadow-elevated">
        <CardHeader>
          <CardTitle>À propos du mode PDF et des QR codes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-heading font-semibold text-gold">Mode PDF</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>
                  <span>Idéal pour les restaurants qui ont déjà un menu au format PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>
                  <span>Le menu sera automatiquement affiché sur votre site web public</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>
                  <span>Vous pouvez remplacer le PDF à tout moment</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-heading font-semibold text-gold">QR Codes</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>
                  <span>Générez des QR codes à imprimer pour vos tables</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>
                  <span>Vos clients scannent et accèdent directement au menu sur mobile</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>
                  <span>Pas besoin d&apos;application supplémentaire</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
