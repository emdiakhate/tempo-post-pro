/**
 * MediaUploader - Composant pour gérer l'upload de médias
 * Extrait de PostCreationModal pour améliorer la maintenabilité
 */

import React, { useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
  size: number;
}

interface MediaUploaderProps {
  mediaFiles: MediaFile[];
  onMediaChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // en MB
  acceptedTypes?: string[];
  disabled?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  mediaFiles,
  onMediaChange,
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = ['image/*', 'video/*'],
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Vérifier le nombre de fichiers
    if (mediaFiles.length + files.length > maxFiles) {
      alert(`Vous ne pouvez pas ajouter plus de ${maxFiles} fichiers`);
      return;
    }

    // Vérifier la taille et le type des fichiers
    const validFiles: File[] = [];
    for (const file of files) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Le fichier ${file.name} est trop volumineux (max ${maxSize}MB)`);
        continue;
      }
      
      if (!acceptedTypes.some(type => file.type.match(type))) {
        alert(`Le fichier ${file.name} n'est pas d'un type supporté`);
        continue;
      }
      
      validFiles.push(file);
    }

    // Créer les objets MediaFile
    const newMediaFiles: MediaFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size
    }));

    onMediaChange([...mediaFiles, ...newMediaFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [mediaFiles, maxFiles, maxSize, acceptedTypes, onMediaChange]);

  const removeMedia = useCallback((id: string) => {
    const fileToRemove = mediaFiles.find(file => file.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    onMediaChange(mediaFiles.filter(file => file.id !== id));
  }, [mediaFiles, onMediaChange]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const openFileDialog = useCallback(() => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Médias ({mediaFiles.length}/{maxFiles})
        </label>
        <span className="text-xs text-gray-500">
          Max {maxSize}MB par fichier
        </span>
      </div>

      {/* Zone d'upload */}
      <Card
        className={cn(
          "border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            Cliquez pour ajouter des médias
          </p>
          <p className="text-xs text-gray-500">
            Images et vidéos supportés
          </p>
        </CardContent>
      </Card>

      {/* Input caché */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Liste des médias */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {mediaFiles.map((mediaFile) => (
            <Card key={mediaFile.id} className="relative">
              <CardContent className="p-2">
                <div className="relative">
                  {mediaFile.type === 'image' ? (
                    <img
                      src={mediaFile.url}
                      alt="Upload preview"
                      className="w-full h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
                      <Video className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  
                  {!disabled && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMedia(mediaFile.id);
                      }}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium truncate">
                    {mediaFile.file.name}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(mediaFile.size)}</span>
                    <div className="flex items-center space-x-1">
                      {mediaFile.type === 'image' ? (
                        <ImageIcon className="w-3 h-3" />
                      ) : (
                        <Video className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bouton d'ajout si pas de médias */}
      {mediaFiles.length === 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={openFileDialog}
          disabled={disabled}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter des médias
        </Button>
      )}
    </div>
  );
};

export default MediaUploader;
