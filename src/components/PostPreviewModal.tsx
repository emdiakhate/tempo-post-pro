import React, { memo } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Post } from '@/types/Post';
import { FacebookPreview, TwitterPreview, InstagramPreview, LinkedInPreview, TikTokPreview, YouTubePreview } from './previews';

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

// Comparateur personnalisé pour la mémorisation
const areModalPropsEqual = (prevProps: PostPreviewModalProps, nextProps: PostPreviewModalProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.content === nextProps.post.content &&
    prevProps.post.image === nextProps.post.image &&
    prevProps.post.platforms.length === nextProps.post.platforms.length &&
    prevProps.post.platforms.every((platform, index) => platform === nextProps.post.platforms[index]) &&
    prevProps.onClose === nextProps.onClose
  );
};

// Composant principal PostPreviewModal mémorisé
const PostPreviewModal: React.FC<PostPreviewModalProps> = memo(({ 
  isOpen, 
  onClose, 
  post 
}) => {
  if (!isOpen) return null;

  const renderPreview = (platform: string) => {
    const props = {
      content: post.content,
      image: post.image || '',
      author: post.author,
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      timestamp: post.scheduledTime ? 
        new Date(post.scheduledTime).toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }) : 
        'Maintenant'
    };
    
    switch (platform) {
      case 'facebook':
        return <FacebookPreview {...props} />;
      case 'twitter':
        return <TwitterPreview {...props} />;
      case 'instagram':
        return <InstagramPreview {...props} />;
      case 'linkedin':
        return <LinkedInPreview {...props} />;
      case 'tiktok':
        return <TikTokPreview {...props} />;
      case 'youtube':
        return <YouTubePreview {...props} />;
      default:
        return <FacebookPreview {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Aperçu de la publication</h2>
            <p className="text-sm text-gray-500 mt-1">
              Statut: <span className="font-medium capitalize">{post.status}</span>
              {post.scheduledTime && (
                <span className="ml-2">
                  • Programmé pour le {new Date(post.scheduledTime).toLocaleDateString('fr-FR')}
                </span>
              )}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {post.platforms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {post.platforms.map((platform) => (
                <div key={platform} className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 capitalize">
                    {platform === 'twitter' ? 'X (Twitter)' : platform}
                  </h3>
                  <div className="scale-90 origin-top-left">
                    {renderPreview(platform)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Aucune plateforme sélectionnée pour cette publication</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}, areModalPropsEqual);

// Export du composant mémorisé
export default PostPreviewModal;