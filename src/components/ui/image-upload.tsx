'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from './button';
import Image from 'next/image';

interface ImageUploadProps {
  currentImageUrl?: string;
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  disabled?: boolean;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  maxSizeMB?: number;
}

export default function ImageUpload({
  currentImageUrl,
  onUpload,
  onDelete,
  disabled = false,
  aspectRatio = 'square',
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'landscape':
        return 'aspect-video';
      case 'portrait':
        return 'aspect-[3/4]';
      default:
        return 'aspect-square';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image');
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`L'image ne doit pas dépasser ${maxSizeMB}MB`);
      return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
      setPreview(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await onDelete();
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const displayImage = preview || currentImageUrl;

  return (
    <div className="space-y-3">
      <div className={`relative w-full ${getAspectRatioClass()} rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50`}>
        {displayImage ? (
          <>
            <Image
              src={displayImage}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
            {(isUploading || isDeleting) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
            {!isUploading && !isDeleting && onDelete && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleDelete}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 mb-2 animate-spin" />
                <p className="text-sm">Upload en cours...</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 mb-2" />
                <p className="text-sm">Aucune image</p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploading}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        {displayImage ? 'Remplacer l\'image' : 'Ajouter une image'}
      </Button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        Formats acceptés : JPG, PNG, WebP, GIF • Max {maxSizeMB}MB
      </p>
    </div>
  );
}
