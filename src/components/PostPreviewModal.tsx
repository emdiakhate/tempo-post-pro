import React from 'react';
import { Post, SocialPlatform } from '@/types/Post';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PostPreviewModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

const platformNames: Record<SocialPlatform, string> = {
  twitter: 'X (Twitter)',
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
};

const platformColors: Record<SocialPlatform, string> = {
  twitter: 'bg-black text-white',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  facebook: 'bg-[#1877F2] text-white',
  linkedin: 'bg-[#0A66C2] text-white',
  youtube: 'bg-[#FF0000] text-white',
  tiktok: 'bg-black text-white',
};

const PostPreviewModal: React.FC<PostPreviewModalProps> = ({ post, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Aperçu de la publication</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Statut:</span>
              <Badge 
                variant={post.status === 'published' ? 'default' : 'secondary'}
                className={cn(
                  post.status === 'published' && 'bg-green-500',
                  post.status === 'scheduled' && 'bg-blue-500',
                  post.status === 'draft' && 'bg-gray-500',
                  post.status === 'failed' && 'bg-red-500'
                )}
              >
                {post.status === 'published' && 'Publié'}
                {post.status === 'scheduled' && 'Programmé'}
                {post.status === 'draft' && 'Brouillon'}
                {post.status === 'failed' && 'Échec'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Date:</span>
              <span className="text-sm">
                {format(post.scheduledTime, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Auteur:</span>
              <span className="text-sm">{post.author}</span>
            </div>

            {post.campaign && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Campagne:</span>
                <Badge style={{ backgroundColor: post.campaignColor }}>
                  {post.campaign}
                </Badge>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Plateformes:</span>
              {post.platforms.map((platform) => (
                <Badge 
                  key={platform} 
                  className={platformColors[platform]}
                >
                  {platformNames[platform]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Contenu</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>

          {/* Image */}
          {post.image && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Image</h3>
              <div className="relative w-full rounded-lg overflow-hidden border">
                <img 
                  src={post.image} 
                  alt="Post content" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          {/* Captions par plateforme */}
          {post.captions && Object.keys(post.captions).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Légendes personnalisées par plateforme</h3>
              <div className="space-y-3">
                {Object.entries(post.captions).map(([platform, caption]) => (
                  <div key={platform} className="bg-muted p-3 rounded-lg">
                    <Badge className={cn("mb-2", platformColors[platform as SocialPlatform])}>
                      {platformNames[platform as SocialPlatform]}
                    </Badge>
                    <p className="text-sm whitespace-pre-wrap">{caption}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistiques d'engagement */}
          {post.engagement && post.status === 'published' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Engagement</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{post.engagement.views}</div>
                  <div className="text-xs text-muted-foreground">Vues</div>
                </div>
                <div className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{post.engagement.likes}</div>
                  <div className="text-xs text-muted-foreground">J'aime</div>
                </div>
                <div className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{post.engagement.comments}</div>
                  <div className="text-xs text-muted-foreground">Commentaires</div>
                </div>
                <div className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{post.engagement.shares}</div>
                  <div className="text-xs text-muted-foreground">Partages</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostPreviewModal;
