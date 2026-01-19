'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, QrCode, Share2, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface QrCodeDisplayProps {
  pdfUrl: string;
  restaurantName?: string;
  restaurantId: string;
  qrCodeGenerated?: boolean;
  onGenerate?: () => void;
}

export default function QrCodeDisplay({
  pdfUrl,
  restaurantName = 'Menu',
  restaurantId,
  qrCodeGenerated = false,
  onGenerate
}: QrCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  // Generate stable QR code URL that redirects to current PDF
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const qrCodeUrl = `${backendUrl}/api/public/menu/pdf/${restaurantId}`;

  const handleDownload = () => {
    const svg = document.getElementById('menu-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code-menu-${restaurantName.toLowerCase().replace(/\s+/g, '-')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeUrl);
      setCopied(true);
      toast.success('URL copiée dans le presse-papier');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erreur lors de la copie');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Menu - ${restaurantName}`,
          text: 'Scannez ce QR code pour accéder au menu',
          url: qrCodeUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyUrl();
    }
  };

  return (
    <div className="rounded-2xl border-2 border-gold-light/30 bg-white/80 backdrop-blur-sm p-6 md:p-8 shadow-elevated animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold text-navy">QR Code du Menu</h3>
            <p className="text-sm text-muted-foreground">
              {qrCodeGenerated ? 'Scannez ce code pour accéder au menu sur mobile' : 'Générez votre QR code permanent'}
            </p>
          </div>
        </div>
        {!qrCodeGenerated && onGenerate && (
          <Button
            onClick={onGenerate}
            className="bg-gold hover:bg-gold/90 text-navy font-semibold"
          >
            Générer le QR Code
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code Display */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative p-8 bg-white rounded-2xl border-2 border-decorative shadow-subtle">
            {qrCodeGenerated ? (
              <QRCodeSVG
                id="menu-qr-code"
                value={qrCodeUrl}
                size={220}
                level="H"
                includeMargin={true}
                bgColor="#F8F4E9"
                fgColor="#0A1D3F"
                className="animate-scale-in"
              />
            ) : (
              <div className="flex items-center justify-center w-[220px] h-[220px] bg-slate-100 rounded-lg">
                <div className="text-center p-4">
                  <QrCode className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600">
                    Cliquez sur &quot;Générer le QR Code&quot; pour créer votre QR code permanent
                  </p>
                </div>
              </div>
            )}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <div className="px-4 py-1 bg-gold text-xs font-medium text-navy rounded-full">
                {restaurantName}
              </div>
            </div>
          </div>

          <div className="text-center max-w-xs">
            <p className="text-sm text-muted-foreground">
              Imprimez ce QR code pour le placer sur vos tables. Vos clients pourront scanner et consulter le menu directement sur leur téléphone.
            </p>
          </div>
        </div>

        {/* Actions and Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-lg text-navy">Actions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="h-12 justify-start gap-3 rounded-xl hover:bg-gold-light/20"
              >
                <Download className="w-4 h-4" />
                Télécharger le QR Code
              </Button>
              
              <Button
                onClick={handleShare}
                variant="outline"
                className="h-12 justify-start gap-3 rounded-xl hover:bg-gold-light/20"
              >
                <Share2 className="w-4 h-4" />
                Partager l&apos;URL
              </Button>

              <Button
                onClick={handleCopyUrl}
                variant={copied ? "default" : "outline"}
                className={`h-12 justify-start gap-3 rounded-xl ${copied ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-gold-light/20'}`}
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copié !' : 'Copier l\'URL'}
              </Button>

              <Button
                onClick={() => window.open(pdfUrl, '_blank')}
                variant="outline"
                className="h-12 justify-start gap-3 rounded-xl hover:bg-gold-light/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Voir le PDF
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gold-light/30">
            <h4 className="font-heading font-semibold text-lg text-navy">Conseils d&apos;utilisation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>
                <span>Imprimez le QR code en taille minimale 10x10cm pour une lecture facile</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>
                <span>Placez-le sur chaque table, à la caisse ou à l&apos;entrée</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>
                <span>Testez le QR code avec plusieurs applications de scan pour vérifier la compatibilité</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>
                <span>
                  <strong>Important :</strong> Le QR code reste valide même si vous remplacez le PDF - vous n&apos;avez pas besoin de le régénérer !
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-navy/5 to-gold-light/10 rounded-xl p-4 border border-decorative">
            <p className="text-sm text-navy font-medium">
              📱 <span className="font-semibold">Astuce :</span> Vous pouvez également générer des QR codes individuels pour chaque table avec des URLs spécifiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}