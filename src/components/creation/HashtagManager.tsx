/**
 * HashtagManager - Composant pour gérer les hashtags
 * Extrait de PostCreationModal pour améliorer la maintenabilité
 */

import React, { useState, useCallback } from 'react';
import { Hash, Plus, X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HashtagManagerProps {
  hashtags: string[];
  onHashtagsChange: (hashtags: string[]) => void;
  suggestedHashtags?: string[];
  maxHashtags?: number;
  disabled?: boolean;
}

export const HashtagManager: React.FC<HashtagManagerProps> = ({
  hashtags,
  onHashtagsChange,
  suggestedHashtags = [],
  maxHashtags = 30,
  disabled = false
}) => {
  const [newHashtag, setNewHashtag] = useState('');
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const addHashtag = useCallback(() => {
    if (!newHashtag.trim() || hashtags.length >= maxHashtags) return;
    
    const hashtag = newHashtag.trim().startsWith('#') 
      ? newHashtag.trim() 
      : `#${newHashtag.trim()}`;
    
    if (!hashtags.includes(hashtag)) {
      onHashtagsChange([...hashtags, hashtag]);
    }
    setNewHashtag('');
  }, [newHashtag, hashtags, maxHashtags, onHashtagsChange]);

  const removeHashtag = useCallback((hashtagToRemove: string) => {
    onHashtagsChange(hashtags.filter(hashtag => hashtag !== hashtagToRemove));
  }, [hashtags, onHashtagsChange]);

  const addSuggestedHashtag = useCallback((suggestedHashtag: string) => {
    if (hashtags.length >= maxHashtags) return;
    
    const hashtag = suggestedHashtag.startsWith('#') 
      ? suggestedHashtag 
      : `#${suggestedHashtag}`;
    
    if (!hashtags.includes(hashtag)) {
      onHashtagsChange([...hashtags, hashtag]);
    }
  }, [hashtags, maxHashtags, onHashtagsChange]);

  const copyHashtags = useCallback(() => {
    const hashtagsText = hashtags.join(' ');
    navigator.clipboard.writeText(hashtagsText);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  }, [hashtags]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Hashtags ({hashtags.length}/{maxHashtags})
        </label>
        {hashtags.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyHashtags}
            className="h-8"
          >
            {copiedHashtags ? (
              <Check className="w-3 h-3 mr-1" />
            ) : (
              <Copy className="w-3 h-3 mr-1" />
            )}
            {copiedHashtags ? 'Copié' : 'Copier'}
          </Button>
        )}
      </div>

      {/* Input pour ajouter des hashtags */}
      <div className="flex space-x-2">
        <Input
          value={newHashtag}
          onChange={(e) => setNewHashtag(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ajouter un hashtag..."
          disabled={disabled || hashtags.length >= maxHashtags}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addHashtag}
          disabled={disabled || !newHashtag.trim() || hashtags.length >= maxHashtags}
          size="sm"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Hashtags actuels */}
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((hashtag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center space-x-1 px-2 py-1"
            >
              <Hash className="w-3 h-3" />
              <span>{hashtag}</span>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeHashtag(hashtag)}
                  className="h-4 w-4 p-0 hover:bg-red-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Hashtags suggérés */}
      {suggestedHashtags.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500">
            Suggestions
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestedHashtags.slice(0, 10).map((suggested, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSuggestedHashtag(suggested)}
                disabled={disabled || hashtags.length >= maxHashtags}
                className="h-7 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                {suggested}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HashtagManager;
