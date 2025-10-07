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

export const YouTubePreview: React.FC<PreviewProps> = memo(({ 
  content, 
  image, 
  author, 
  profilePicture, 
  timestamp = '2h' 
}) => {
  const { imageUrl: profileImageUrl } = useImageLoader(profilePicture);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-md mx-auto">
      {/* Video thumbnail */}
      {image && (
        <div className="relative w-full">
          <OptimizedImage
            src={image}
            alt="YouTube video thumbnail"
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">▶️</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
          {content}
        </h3>
        
        <div className="flex items-center space-x-3">
          <img
            src={profileImageUrl || profilePicture}
            alt={author}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-900 font-medium">{author}</p>
            <p className="text-xs text-gray-500">1.2K vues • {timestamp}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
            <span>👍</span>
            <span className="text-sm">1.2K</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
            <span>👎</span>
            <span className="text-sm">12</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
            <span>💬</span>
            <span className="text-sm">45</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
            <span>🔄</span>
            <span className="text-sm">Partager</span>
          </button>
        </div>
      </div>
    </div>
  );
}, arePreviewPropsEqual);

export default YouTubePreview;
