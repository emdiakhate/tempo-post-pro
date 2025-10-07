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

export const TikTokPreview: React.FC<PreviewProps> = memo(({ 
  content, 
  image, 
  author, 
  profilePicture, 
  timestamp = '2h' 
}) => {
  const { imageUrl: profileImageUrl } = useImageLoader(profilePicture);

  return (
    <div className="bg-black rounded-lg shadow-sm max-w-sm mx-auto relative overflow-hidden">
      {/* Video/Image */}
      {image && (
        <div className="relative w-full h-96">
          <OptimizedImage
            src={image}
            alt="TikTok video"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute bottom-4 left-4 right-16 text-white">
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={profileImageUrl || profilePicture}
            alt={author}
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
          />
          <span className="font-semibold text-sm">@{author.toLowerCase().replace(/\s+/g, '')}</span>
        </div>
        <p className="text-sm leading-relaxed mb-2">
          {content}
        </p>
        <div className="flex items-center space-x-4 text-xs text-gray-300">
          <span>❤️ 1.2K</span>
          <span>💬 45</span>
          <span>🔄 23</span>
        </div>
      </div>

      {/* Right side actions */}
      <div className="absolute right-4 bottom-4 flex flex-col space-y-4">
        <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/30 transition-colors">
          ❤️
        </button>
        <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/30 transition-colors">
          💬
        </button>
        <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/30 transition-colors">
          🔄
        </button>
        <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/30 transition-colors">
          📤
        </button>
      </div>
    </div>
  );
}, arePreviewPropsEqual);

export default TikTokPreview;
