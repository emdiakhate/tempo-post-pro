/**
 * ToneSelector - Composant pour sélectionner le ton de voix
 * Extrait de PostCreationModal pour améliorer la maintenabilité
 */

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Smile, Zap, DollarSign, BookOpen, Sparkles } from 'lucide-react';

export interface ToneOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TONE_OPTIONS: ToneOption[] = [
  {
    value: 'professional',
    label: '💼 Professionnel',
    icon: <Briefcase className="w-4 h-4" />,
    description: 'Ton formel et professionnel'
  },
  {
    value: 'casual',
    label: '😊 Décontracté',
    icon: <Smile className="w-4 h-4" />,
    description: 'Ton amical et décontracté'
  },
  {
    value: 'inspiring',
    label: '⚡ Inspirant',
    icon: <Zap className="w-4 h-4" />,
    description: 'Ton motivant et inspirant'
  },
  {
    value: 'sales',
    label: '💰 Vendeur',
    icon: <DollarSign className="w-4 h-4" />,
    description: 'Ton commercial et persuasif'
  },
  {
    value: 'storytelling',
    label: '📖 Storytelling',
    icon: <BookOpen className="w-4 h-4" />,
    description: 'Ton narratif et captivant'
  },
  {
    value: 'auto',
    label: '🎭 Automatique',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Laisse l\'IA choisir le ton'
  }
];

interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (tone: string) => void;
  disabled?: boolean;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onToneChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Ton de voix
      </label>
      <Select
        value={selectedTone}
        onValueChange={onToneChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner un ton" />
        </SelectTrigger>
        <SelectContent>
          {TONE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center space-x-2">
                {option.icon}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedTone && (
        <p className="text-xs text-gray-500">
          {TONE_OPTIONS.find(option => option.value === selectedTone)?.description}
        </p>
      )}
    </div>
  );
};

export default ToneSelector;
