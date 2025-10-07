/**
 * Configuration Centralisée des Plateformes Sociales
 * Remplace toutes les configurations dupliquées
 */

import { PLATFORM_COLORS } from './designSystem';

export interface PlatformConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient?: string;
  isSupported: boolean;
  isProOnly: boolean;
  features: {
    posts: boolean;
    stories: boolean;
    reels: boolean;
    live: boolean;
    analytics: boolean;
  };
  limits: {
    maxPostsPerDay: number;
    maxCharacters: number;
    maxImages: number;
    maxVideos: number;
  };
}

export const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    description: 'Partagez vos moments avec des photos et vidéos',
    icon: 'Instagram',
    color: '#E4405F',
    gradient: 'from-purple-500 to-pink-500',
    isSupported: true,
    isProOnly: false,
    features: {
      posts: true,
      stories: true,
      reels: true,
      live: true,
      analytics: true
    },
    limits: {
      maxPostsPerDay: 25,
      maxCharacters: 2200,
      maxImages: 10,
      maxVideos: 1
    }
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    description: 'Connectez-vous avec votre communauté',
    icon: 'Facebook',
    color: '#1877F2',
    isSupported: true,
    isProOnly: false,
    features: {
      posts: true,
      stories: true,
      reels: false,
      live: true,
      analytics: true
    },
    limits: {
      maxPostsPerDay: 25,
      maxCharacters: 63206,
      maxImages: 10,
      maxVideos: 1
    }
  },
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    description: 'Partagez vos pensées en temps réel',
    icon: 'Twitter',
    color: '#1DA1F2',
    isSupported: true,
    isProOnly: false,
    features: {
      posts: true,
      stories: false,
      reels: false,
      live: false,
      analytics: true
    },
    limits: {
      maxPostsPerDay: 300,
      maxCharacters: 280,
      maxImages: 4,
      maxVideos: 1
    }
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Développez votre réseau professionnel',
    icon: 'Linkedin',
    color: '#0A66C2',
    isSupported: true,
    isProOnly: false,
    features: {
      posts: true,
      stories: false,
      reels: false,
      live: false,
      analytics: true
    },
    limits: {
      maxPostsPerDay: 25,
      maxCharacters: 3000,
      maxImages: 9,
      maxVideos: 1
    }
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Créez des vidéos courtes et engageantes',
    icon: 'TikTok',
    color: '#000000',
    isSupported: true,
    isProOnly: true,
    features: {
      posts: false,
      stories: false,
      reels: true,
      live: true,
      analytics: true
    },
    limits: {
      maxPostsPerDay: 10,
      maxCharacters: 2200,
      maxImages: 0,
      maxVideos: 1
    }
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    description: 'Partagez vos vidéos avec le monde',
    icon: 'Youtube',
    color: '#FF0000',
    isSupported: true,
    isProOnly: true,
    features: {
      posts: false,
      stories: false,
      reels: false,
      live: true,
      analytics: true
    },
    limits: {
      maxPostsPerDay: 5,
      maxCharacters: 5000,
      maxImages: 0,
      maxVideos: 1
    }
  }
};

// Helper functions
export const getPlatformConfig = (platformId: string): PlatformConfig | undefined => {
  return PLATFORM_CONFIGS[platformId];
};

export const getSupportedPlatforms = (): PlatformConfig[] => {
  return Object.values(PLATFORM_CONFIGS).filter(platform => platform.isSupported);
};

export const getFreePlatforms = (): PlatformConfig[] => {
  return Object.values(PLATFORM_CONFIGS).filter(platform => platform.isSupported && !platform.isProOnly);
};

export const getProPlatforms = (): PlatformConfig[] => {
  return Object.values(PLATFORM_CONFIGS).filter(platform => platform.isProOnly);
};

export const getPlatformFeatures = (platformId: string) => {
  const platform = getPlatformConfig(platformId);
  return platform?.features;
};

export const getPlatformLimits = (platformId: string) => {
  const platform = getPlatformConfig(platformId);
  return platform?.limits;
};