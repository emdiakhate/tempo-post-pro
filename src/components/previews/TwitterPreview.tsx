import React, { memo } from 'react';
import { useImageLoader } from '@/hooks/useImageLoader';

// Interface pour les props des composants de prévisualisation
interface PreviewProps {
  content: string;
  image: string;
  author: string;
  profilePicture: string;
  timestamp?: string;
}

// Composant d'image optimisé pour les prévisualisations
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

// Comparateur personnalisé pour la mémorisation
const arePreviewPropsEqual = (prevProps: PreviewProps, nextProps: PreviewProps) => {
  return (
    prevProps.content === nextProps.content &&
    prevProps.image === nextProps.image &&
    prevProps.author === nextProps.author &&
    prevProps.profilePicture === nextProps.profilePicture &&
    prevProps.timestamp === nextProps.timestamp
  );
};

// Composant TwitterPreview mémorisé
export const TwitterPreview: React.FC<PreviewProps> = memo(({ 
  content, 
  image, 
  author, 
  profilePicture, 
  timestamp = '2h' 
}) => {
  const { imageUrl: profileImageUrl } = useImageLoader(profilePicture);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-md mx-auto">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <img
            src={profileImageUrl || profilePicture}
            alt={author}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 text-sm">{author}</h3>
              <span className="text-gray-500 text-sm">@{author.toLowerCase().replace(/\s+/g, '')}</span>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-sm">{timestamp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>

      {/* Image */}
      {image && (
        <div className="px-4 pb-4">
          <OptimizedImage
            src={image}
            alt="Post image"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
            <span>💬</span>
            <span>12</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-green-600 transition-colors">
            <span>🔄</span>
            <span>5</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-red-600 transition-colors">
            <span>❤️</span>
            <span>24</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
            <span>📤</span>
          </button>
        </div>
      </div>
    </div>
  );
}, arePreviewPropsEqual);

export default TwitterPreview;
