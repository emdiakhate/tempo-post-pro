import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Image as ImageIcon, X } from 'lucide-react';
import { Post, SocialPlatform } from '@/types/Post';
import { cn } from '@/lib/utils';

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Omit<Post, 'id'>) => void;
  initialDayColumn?: string;
}

const platformOptions: { key: SocialPlatform; label: string; color: string }[] = [
  { key: 'instagram', label: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { key: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
  { key: 'twitter', label: 'Twitter', color: 'bg-blue-500' },
  { key: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700' },
  { key: 'youtube', label: 'YouTube', color: 'bg-red-600' },
  { key: 'tiktok', label: 'TikTok', color: 'bg-black' },
];

const PostCreationModal: React.FC<PostCreationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDayColumn = 'monday',
}) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['instagram']);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [author, setAuthor] = useState('Boucherie Halal');
  const [campaign, setCampaign] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handlePlatformToggle = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImagePreview('');
  };

  const handleSave = () => {
    if (!content.trim() || selectedPlatforms.length === 0) {
      return;
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    
    const newPost: Omit<Post, 'id'> = {
      content: content.trim(),
      scheduledTime: scheduledDateTime,
      platforms: selectedPlatforms,
      status: 'scheduled',
      image: imagePreview || undefined,
      campaign: campaign || undefined,
      campaignColor: campaign ? '#3B82F6' : undefined,
      author,
      dayColumn: initialDayColumn,
      timeSlot: 0,
    };

    onSave(newPost);
    
    // Reset form
    setContent('');
    setSelectedPlatforms(['instagram']);
    setScheduledDate('');
    setScheduledTime('12:00');
    setAuthor('Boucherie Halal');
    setCampaign('');
    setUploadedImage(null);
    setImagePreview('');
    
    onClose();
  };

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle publication</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu de la publication</Label>
            <Textarea
              id="content"
              placeholder="Rédigez votre message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-24 resize-none"
            />
            <div className="text-right text-sm text-muted-foreground">
              {content.length}/2200 caractères
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Image (optionnel)</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm">Cliquer pour télécharger une image</span>
                </Label>
              </div>
              
              {imagePreview && (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <Label>Plateformes</Label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((platform) => (
                <Badge
                  key={platform.key}
                  variant={selectedPlatforms.includes(platform.key) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all text-white border-0',
                    selectedPlatforms.includes(platform.key) 
                      ? platform.color 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                  onClick={() => handlePlatformToggle(platform.key)}
                >
                  {platform.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={scheduledDate}
                  min={currentDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Author and Campaign */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nom de l'auteur"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campaign">Campagne (optionnel)</Label>
              <Input
                id="campaign"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="Nom de la campagne"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!content.trim() || selectedPlatforms.length === 0}
            >
              Programmer la publication
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostCreationModal;