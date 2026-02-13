'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useMenuData } from '@/hooks/useMenuData';
import QrCodeDisplay from '@/components/menu/QrCodeDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Smartphone,
  Table,
  Printer,
  Share2,
  QrCode,
  FileUp,
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Onglet de publication du menu
 * Gestion du PDF et du QR code
 */
export default function PublicationTab() {
  // Data hooks (centralized API calls)
  const { restaurant, isLoading, refetch } = useMenuData();

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isGeneratingQrCode, setIsGeneratingQrCode] = useState(false);

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
      await refetch();

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
      await refetch();
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
        <div className="h-20 bg-[#E5E5E5]" />
        <div className="h-64 bg-[#E5E5E5]" />
        <div className="h-48 bg-[#E5E5E5]" />
      </div>
    );
  }

  const hasPdf = !!restaurant?.menu.pdfUrl;

  return (
    <div className="space-y-8 pb-20 md:pb-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0066FF]" />
        <h1 className="text-2xl font-light text-[#2A2A2A] pt-4">PDF & QR Codes</h1>
        <p className="text-[#666666] mt-1 font-light">
          Publiez votre menu en ligne et générez des QR codes pour vos tables
        </p>
      </div>

      {/* PDF Upload Section */}
      <Card className="p-8">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="flex items-center gap-2 font-light text-[#2A2A2A]">
            <div className="h-8 w-8 border border-[#E5E5E5] flex items-center justify-center">
              <FileUp className="h-5 w-5 text-[#0066FF]" />
            </div>
            Menu PDF
          </CardTitle>
          <CardDescription className="text-[#666666] font-light">
            {hasPdf
              ? 'Votre menu PDF est disponible sur votre site web'
              : "Téléchargez votre menu au format PDF pour l'affichage en ligne"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current PDF Status */}
          {hasPdf ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 bg-[#FAFAFA] border border-emerald-600">
                <div className="flex h-14 w-14 items-center justify-center border border-emerald-600 bg-emerald-600">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-lg text-[#2A2A2A]">Menu PDF disponible</p>
                  <p className="text-sm text-[#666666] mt-1 font-light">
                    Votre menu est visible sur votre site web et accessible via QR code
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <a
                      href={restaurant!.menu.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] text-sm font-medium text-[#2A2A2A] hover:border-[#0066FF] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Voir le menu
                    </a>
                    <a
                      href={restaurant!.menu.pdfUrl}
                      download={`menu-${restaurant!.name.replace(/\s+/g, '-').toLowerCase()}.pdf`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white border border-emerald-600 text-sm font-medium hover:bg-white hover:text-emerald-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAFAFA] border border-amber-600 p-4">
                <p className="text-sm font-medium text-amber-600">
                  ⚠️ Note : Le téléchargement d&apos;un nouveau PDF remplacera le menu actuel. Le QR
                  code restera valide.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-6 bg-[#FAFAFA] border border-amber-600">
              <div className="flex h-14 w-14 items-center justify-center border border-amber-600 bg-amber-600">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="font-medium text-lg text-[#2A2A2A]">Aucun menu PDF</p>
                <p className="text-sm text-[#666666] mt-1 font-light">
                  Téléchargez un PDF pour activer le mode PDF et générer des QR codes
                </p>
              </div>
            </div>
          )}

          {/* Upload Form */}
          <div className="space-y-4">
            <Label htmlFor="pdf-upload">
              {hasPdf ? 'Remplacer le menu PDF' : 'Télécharger un menu PDF'}
            </Label>
            <div className="relative">
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className="pl-10 py-6 border border-[#E5E5E5] focus:border-[#0066FF] transition-colors"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="w-5 h-5 text-[#666666]" />
              </div>
            </div>
            {selectedFile && (
              <div className="bg-[#FAFAFA] p-4 border border-[#E5E5E5]">
                <p className="text-sm font-medium text-[#2A2A2A]">
                  📄 Fichier sélectionné :{' '}
                  <span className="font-semibold">{selectedFile.name}</span>
                </p>
                <p className="text-xs text-[#666666] mt-1">
                  Taille : {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
                </p>
              </div>
            )}
          </div>

          {uploadStatus.type && (
            <div
              className={`flex items-center gap-3 p-4 border ${
                uploadStatus.type === 'success'
                  ? 'bg-[#FAFAFA] border-emerald-600 text-emerald-600'
                  : 'bg-[#FAFAFA] border-red-600 text-red-600'
              }`}
            >
              {uploadStatus.type === 'success' ? (
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600" />
              )}
              <p className="text-sm font-medium">{uploadStatus.message}</p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full py-6 font-medium text-base"
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
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
          <Card className="p-8">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="flex items-center gap-2 font-light text-[#2A2A2A]">
                <div className="h-8 w-8 border border-[#E5E5E5] flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-[#0066FF]" />
                </div>
                Guide d&apos;utilisation
              </CardTitle>
              <CardDescription className="text-[#666666] font-light">Comment utiliser efficacement vos QR codes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center border border-[#E5E5E5]">
                    <Table className="h-6 w-6 text-[#666666]" />
                  </div>
                  <h3 className="font-medium text-[#2A2A2A] uppercase tracking-[0.1em] text-xs">Pour les tables</h3>
                  <ul className="space-y-2 text-sm text-[#666666] font-light">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-600 mt-1.5 flex-shrink-0"></div>
                      <span>Imprimez un QR code par table</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-600 mt-1.5 flex-shrink-0"></div>
                      <span>Utilisez un support rigide et imperméable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-600 mt-1.5 flex-shrink-0"></div>
                      <span>Placez-le bien visible sur la table</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center border border-[#0066FF]">
                    <Printer className="h-6 w-6 text-[#0066FF]" />
                  </div>
                  <h3 className="font-medium text-[#2A2A2A] uppercase tracking-[0.1em] text-xs">Impression</h3>
                  <ul className="space-y-2 text-sm text-[#666666] font-light">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#0066FF] mt-1.5 flex-shrink-0"></div>
                      <span>Téléchargez en PNG pour l&apos;impression numérique</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#0066FF] mt-1.5 flex-shrink-0"></div>
                      <span>Utilisez SVG pour l&apos;impression vectorielle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#0066FF] mt-1.5 flex-shrink-0"></div>
                      <span>Testez la lecture avant impression en série</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center border border-[#E5E5E5]">
                    <Share2 className="h-6 w-6 text-[#666666]" />
                  </div>
                  <h3 className="font-medium text-[#2A2A2A] uppercase tracking-[0.1em] text-xs">Marketing</h3>
                  <ul className="space-y-2 text-sm text-[#666666] font-light">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#666666] mt-1.5 flex-shrink-0"></div>
                      <span>Ajoutez aux cartes de visite et flyers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#666666] mt-1.5 flex-shrink-0"></div>
                      <span>Intégrez dans les vitrines et menus extérieurs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#666666] mt-1.5 flex-shrink-0"></div>
                      <span>Partagez sur les réseaux sociaux</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="p-8">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="flex items-center gap-2 font-light text-[#2A2A2A]">
              <div className="h-8 w-8 border border-[#E5E5E5] flex items-center justify-center">
                <QrCode className="h-5 w-5 text-[#666666]" />
              </div>
              QR Codes
            </CardTitle>
            <CardDescription className="text-[#666666] font-light">
              Les QR codes seront disponibles après le téléchargement de votre menu PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            <div className="bg-[#FAFAFA] border border-amber-600 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-amber-600">
                  <Smartphone className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#2A2A2A]">QR Codes non disponibles</h3>
                  <p className="text-sm text-[#666666] mt-1 font-light">
                    Les QR codes nécessitent un menu PDF pour fonctionner. Téléchargez d&apos;abord
                    votre menu PDF ci-dessus.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-6">
              <h4 className="text-xs font-medium text-[#666666] mb-2 uppercase tracking-[0.2em]">Pourquoi utiliser les QR codes ?</h4>
              <ul className="space-y-2 text-sm text-[#666666] font-light">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#0066FF] mt-1.5 flex-shrink-0"></div>
                  <span>Économisez sur l&apos;impression des menus</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#0066FF] mt-1.5 flex-shrink-0"></div>
                  <span>Mettez à jour votre menu en temps réel</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#0066FF] mt-1.5 flex-shrink-0"></div>
                  <span>Offrez une expérience moderne à vos clients</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#0066FF] mt-1.5 flex-shrink-0"></div>
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
