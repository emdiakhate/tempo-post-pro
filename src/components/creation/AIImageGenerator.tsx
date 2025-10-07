/**
 * AIImageGenerator - Composant pour la génération d'images IA
 * Extrait de PostCreationModal pour améliorer la maintenabilité
 */

import React, { useState, useCallback } from 'react';
import { Sparkles, Upload, Image as ImageIcon, Loader2, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface AIGenerationType {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const AI_GENERATION_TYPES: AIGenerationType[] = [
  {
    id: 'simple',
    label: 'Simple',
    description: 'Génération d\'image à partir d\'un prompt',
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'image_editing',
    label: 'Édition d\'image',
    description: 'Modifier une image existante',
    icon: <ImageIcon className="w-4 h-4" />
  },
  {
    id: 'combination',
    label: 'Combinaison',
    description: 'Combiner plusieurs images',
    icon: <Plus className="w-4 h-4" />
  },
  {
    id: 'ugc',
    label: 'UGC',
    description: 'Contenu généré par l\'utilisateur',
    icon: <Upload className="w-4 h-4" />
  }
];

interface AIImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
  disabled?: boolean;
}

export const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({
  onImageGenerated,
  disabled = false
}) => {
  const [selectedType, setSelectedType] = useState<string>('simple');
  const [prompt, setPrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleSourceImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSourceImage(file);
    }
  }, []);

  const generateImage = useCallback(async () => {
    if (!prompt.trim() && selectedType !== 'ugc') return;

    setIsGenerating(true);
    
    try {
      // Simulation de l'appel à l'API N8N
      const response = await fetch('/api/n8n/ai-image-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          prompt: prompt.trim(),
          sourceImage: sourceImage ? await fileToBase64(sourceImage) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const data = await response.json();
      
      if (data.images && data.images.length > 0) {
        setGeneratedImages(data.images);
      }
    } catch (error) {
      console.error('Erreur génération IA:', error);
      alert('Erreur lors de la génération de l\'image');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedType, prompt, sourceImage]);

  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }, []);

  const useGeneratedImage = useCallback((imageUrl: string) => {
    onImageGenerated(imageUrl);
  }, [onImageGenerated]);

  const clearGeneration = useCallback(() => {
    setGeneratedImages([]);
    setPrompt('');
    setSourceImage(null);
  }, []);

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <CardTitle className="text-sm text-purple-800">
            🤖 Générer avec IA
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Types de génération */}
        <Tabs value={selectedType} onValueChange={setSelectedType}>
          <TabsList className="grid w-full grid-cols-4">
            {AI_GENERATION_TYPES.map((type) => (
              <TabsTrigger key={type.id} value={type.id} className="text-xs">
                <div className="flex items-center space-x-1">
                  {type.icon}
                  <span className="hidden sm:inline">{type.label}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Contenu pour chaque type */}
          {AI_GENERATION_TYPES.map((type) => (
            <TabsContent key={type.id} value={type.id} className="space-y-3">
              <div className="text-sm text-gray-600">
                {type.description}
              </div>

              {/* Prompt input */}
              {type.id !== 'ugc' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Prompt
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Décrivez l'image que vous souhaitez générer..."
                    disabled={disabled || isGenerating}
                    rows={3}
                  />
                </div>
              )}

              {/* Upload d'image source */}
              {(type.id === 'image_editing' || type.id === 'combination') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Image source
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleSourceImageUpload}
                      disabled={disabled || isGenerating}
                      className="flex-1"
                    />
                    {sourceImage && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSourceImage(null)}
                        disabled={disabled || isGenerating}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  {sourceImage && (
                    <p className="text-xs text-gray-500">
                      {sourceImage.name}
                    </p>
                  )}
                </div>
              )}

              {/* Bouton de génération */}
              <Button
                type="button"
                onClick={generateImage}
                disabled={disabled || isGenerating || (!prompt.trim() && type.id !== 'ugc')}
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isGenerating ? 'Génération...' : 'Générer une image'}
              </Button>
            </TabsContent>
          ))}
        </Tabs>

        {/* Images générées */}
        {generatedImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Images générées
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearGeneration}
                disabled={disabled}
              >
                <X className="w-3 h-3 mr-1" />
                Effacer
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {generatedImages.map((imageUrl, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-2">
                    <img
                      src={imageUrl}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => useGeneratedImage(imageUrl)}
                      disabled={disabled}
                      className="w-full mt-2"
                    >
                      Utiliser
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIImageGenerator;
