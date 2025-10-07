import React, { memo } from 'react';
import { useImageLoader } from '@/hooks/useImageLoader';

interface PreviewProps {
  content: string;
  image: string;
  author: string;
  profilePicture: string;
  timestamp?: string;
}

const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = memo(({ src, alt, className }) => {
  const { imageUrl, loading, error } = useImageLoader(src);

  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`}>
        <div className="w-full h-48 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 ${className}`}>
        <div className="w-full h-48 flex items-center justify-center text-gray-500">
          Image non disponible
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
});

const arePreviewPropsEqual = (prevProps: PreviewProps, nextProps: PreviewProps) => {
  return (
    prevProps.content === nextProps.content &&
    prevProps.image === nextProps.image &&
    prevProps.author === nextProps.author &&
    prevProps.profilePicture === nextProps.profilePicture &&
    prevProps.timestamp === nextProps.timestamp
  );
};

export const InstagramPreview: React.FC<PreviewProps> = memo(({ 
  content, 
  image, 
  author, 
  profilePicture, 
  timestamp = '2h' 
}) => {
  const { imageUrl: profileImageUrl } = useImageLoader(profilePicture);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-sm mx-auto">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <img
            src={profileImageUrl || profilePicture}
            alt={author}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{author}</h3>
          </div>
          <span className="text-gray-500 text-sm">{timestamp}</span>
        </div>
      </div>

      {/* Image */}
      {image && (
        <div className="w-full">
          <OptimizedImage
            src={image}
            alt="Post image"
            className="w-full h-80 object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          <button className="text-2xl hover:opacity-70 transition-opacity">❤️</button>
          <button className="text-2xl hover:opacity-70 transition-opacity">💬</button>
          <button className="text-2xl hover:opacity-70 transition-opacity">📤</button>
          <button className="text-2xl hover:opacity-70 transition-opacity">🔖</button>
        </div>
        
        <div className="text-sm text-gray-900 mb-2">
          <span className="font-semibold">{author}</span> {content}
        </div>
        
        <div className="text-xs text-gray-500">
          Voir les 12 commentaires
        </div>
      </div>
    </div>
  );
}, arePreviewPropsEqual);

export default InstagramPreview;
