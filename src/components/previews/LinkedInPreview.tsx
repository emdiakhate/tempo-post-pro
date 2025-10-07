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

export const LinkedInPreview: React.FC<PreviewProps> = memo(({ 
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
        <div className="flex items-center space-x-3">
          <img
            src={profileImageUrl || profilePicture}
            alt={author}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{author}</h3>
            <p className="text-xs text-gray-500">Développeur Full Stack</p>
            <p className="text-xs text-gray-500">{timestamp}</p>
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
            <span>👍</span>
            <span>J'aime</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
            <span>💬</span>
            <span>Commenter</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
            <span>🔄</span>
            <span>Partager</span>
          </button>
        </div>
      </div>
    </div>
  );
}, arePreviewPropsEqual);

export default LinkedInPreview;
