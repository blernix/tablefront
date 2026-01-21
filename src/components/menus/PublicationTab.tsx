'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Restaurant } from '@/types';
import QrCodeDisplay from '@/components/menu/QrCodeDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Eye, Smartphone, Table, Printer, Share2, QrCode, FileUp } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicationTab() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isGeneratingQrCode, setIsGeneratingQrCode] = useState(false);

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
      toast.error('Erreur lors du chargement des informations du restaurant');
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
      
      toast.success('Menu PDF mis à jour avec succès');
    } catch (err) {
      setUploadStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erreur lors du téléchargement',
      });
      toast.error('Erreur lors du téléchargement du PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateQrCode = async () => {
    try {
      setIsGeneratingQrCode(true);
      await apiClient.generateMenuQrCode();
      toast.success('QR code généré avec succès !');
      await fetchRestaurant();
    } catch (err) {
      console.error('Error generating QR code:', err);
      toast.error('Erreur lors de la génération du QR code');
    } finally {
      setIsGeneratingQrCode(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-lg" />
        <div className="h-64 bg-slate-200 rounded-lg" />
        <div className="h-48 bg-slate-200 rounded-lg" />
      </div>
    );
  }

  const hasPdf = !!restaurant?.menu.pdfUrl;

  return (
    <div className="space-y-8 pb-20 md:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">PDF & QR Codes</h1>
        <p className="text-slate-600 mt-1">
          Publiez votre menu en ligne et générez des QR codes pour vos tables
        </p>
      </div>

      {/* PDF Upload Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Menu PDF
          </CardTitle>
          <CardDescription>
            {hasPdf 
              ? 'Votre menu PDF est disponible sur votre site web' 
              : 'Téléchargez votre menu au format PDF pour l\'affichage en ligne'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current PDF Status */}
          {hasPdf ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg text-slate-900">Menu PDF disponible</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Votre menu est visible sur votre site web et accessible via QR code
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <a
                      href={restaurant!.menu.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Voir le menu
                    </a>
                    <a
                      href={restaurant!.menu.pdfUrl}
                      download={`menu-${restaurant!.name.replace(/\s+/g, '-').toLowerCase()}.pdf`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-medium text-amber-800">
                  ⚠️ Note : Le téléchargement d&apos;un nouveau PDF remplacera le menu actuel. Le QR code restera valide.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="font-semibold text-lg text-slate-900">Aucun menu PDF</p>
                <p className="text-sm text-slate-600 mt-1">
                  Téléchargez un PDF pour activer le mode PDF et générer des QR codes
                </p>
              </div>
            </div>
          )}

          {/* Upload Form */}
          <div className="space-y-4">
            <Label htmlFor="pdf-upload" className="text-sm font-medium text-slate-900">
              {hasPdf ? 'Remplacer le menu PDF' : 'Télécharger un menu PDF'}
            </Label>
            <div className="relative">
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className="pl-10 py-6 border-2 border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 rounded-xl"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="w-5 h-5 text-slate-500" />
              </div>
            </div>
            {selectedFile && (
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-sm font-medium text-slate-900">
                  📄 Fichier sélectionné : <span className="font-semibold">{selectedFile.name}</span>
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Taille : {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
                </p>
              </div>
            )}
          </div>

          {uploadStatus.type && (
            <div
              className={`flex items-center gap-3 rounded-xl p-4 border-2 ${
                uploadStatus.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
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
            className="w-full py-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-lg shadow-sm hover:shadow transition-all duration-300"
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
                {hasPdf ? 'Remplacer le menu PDF' : 'Télécharger le menu PDF'}
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Section (conditionnelle) */}
      {hasPdf ? (
        <>
          <QrCodeDisplay
            pdfUrl={restaurant!.menu.pdfUrl!}
            restaurantName={restaurant!.name}
            restaurantId={restaurant!._id}
            qrCodeGenerated={restaurant!.menu.qrCodeGenerated}
            onGenerate={handleGenerateQrCode}
          />

          {/* Guide d'utilisation */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Guide d&apos;utilisation
              </CardTitle>
              <CardDescription>
                Comment utiliser efficacement vos QR codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Table className="h-6 w-6 text-slate-900" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Pour les tables</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 flex-shrink-0"></div>
                      <span>Imprimez un QR code par table</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 flex-shrink-0"></div>
                      <span>Utilisez un support rigide et imperméable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 flex-shrink-0"></div>
                      <span>Placez-le bien visible sur la table</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Printer className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Impression</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                      <span>Téléchargez en PNG pour l&apos;impression numérique</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                      <span>Utilisez SVG pour l&apos;impression vectorielle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                      <span>Testez la lecture avant impression en série</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Share2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Marketing</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                      <span>Ajoutez aux cartes de visite et flyers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                      <span>Intégrez dans les vitrines et menus extérieurs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                      <span>Partagez sur les réseaux sociaux</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Codes
            </CardTitle>
            <CardDescription>
              Les QR codes seront disponibles après le téléchargement de votre menu PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Smartphone className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">QR Codes non disponibles</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Les QR codes nécessitent un menu PDF pour fonctionner. Téléchargez d&apos;abord votre menu PDF ci-dessus.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 mb-2">Pourquoi utiliser les QR codes ?</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                  <span>Économisez sur l&apos;impression des menus</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                  <span>Mettez à jour votre menu en temps réel</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                  <span>Offrez une expérience moderne à vos clients</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                  <span>Réduisez les contacts physiques</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}