/**
 * Configuration principale de l'application Postelma
 * Centralise toutes les constantes et paramètres de l'app
 */

// Informations de l'application
export const APP_INFO = {
  name: 'Postelma',
  version: '1.0.0',
  description: 'Plateforme de gestion de contenu social media',
  author: 'Postelma Team',
  website: 'https://postelma.com',
  support: 'support@postelma.com'
} as const;

// Configuration de l'environnement
export const ENV_CONFIG = {
  development: {
    apiUrl: 'http://localhost:3000',
    n8nWebhook: 'http://localhost:5678/webhook',
    debug: true,
    logLevel: 'debug' as const
  },
  production: {
    apiUrl: 'https://api.postelma.com',
    n8nWebhook: 'https://n8n.postelma.com/webhook',
    debug: false,
    logLevel: 'error' as const
  },
  staging: {
    apiUrl: 'https://staging-api.postelma.com',
    n8nWebhook: 'https://staging-n8n.postelma.com/webhook',
    debug: true,
    logLevel: 'warn' as const
  }
} as const;

// Configuration des limites
export const LIMITS = {
  // Posts
  maxPostsPerDay: 50,
  maxScheduledPosts: 100,
  maxDraftPosts: 200,
  
  // Médias
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxVideoSize: 50 * 1024 * 1024, // 50MB
  maxFilesPerUpload: 10,
  
  // Utilisateurs
  maxUsersPerTeam: 20,
  maxInvitationsPerDay: 10,
  
  // Analytics
  maxAnalyticsRetention: 365, // jours
  maxExportRecords: 10000,
  
  // Notifications
  maxNotifications: 100,
  maxNotificationHistory: 1000,
  
  // Cache
  maxCacheSize: 100 * 1024 * 1024, // 100MB
  cacheExpiry: 24 * 60 * 60 * 1000, // 24h
} as const;

// Configuration des rôles et permissions
export const ROLE_CONFIG = {
  owner: {
    name: 'Propriétaire',
    color: '#8B5CF6',
    permissions: ['all'],
    maxTeamMembers: 20,
    canDeleteAccount: true
  },
  manager: {
    name: 'Gestionnaire',
    color: '#3B82F6',
    permissions: ['manage_posts', 'manage_users', 'view_analytics', 'manage_team'],
    maxTeamMembers: 10,
    canDeleteAccount: false
  },
  creator: {
    name: 'Créateur',
    color: '#10B981',
    permissions: ['create_posts', 'view_own_posts', 'view_analytics'],
    maxTeamMembers: 0,
    canDeleteAccount: false
  },
  viewer: {
    name: 'Observateur',
    color: '#6B7280',
    permissions: ['view_posts', 'view_analytics'],
    maxTeamMembers: 0,
    canDeleteAccount: false
  }
} as const;

// Configuration des plateformes sociales
export const PLATFORM_CONFIG = {
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    icon: 'Instagram',
    maxCaptionLength: 2200,
    maxHashtags: 30,
    supportedFormats: ['image', 'video', 'carousel'],
    maxFileSize: 100 * 1024 * 1024, // 100MB
    dimensions: {
      square: { width: 1080, height: 1080 },
      story: { width: 1080, height: 1920 },
      reel: { width: 1080, height: 1920 }
    }
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    icon: 'Facebook',
    maxCaptionLength: 63206,
    maxHashtags: 0,
    supportedFormats: ['image', 'video', 'link'],
    maxFileSize: 100 * 1024 * 1024, // 100MB
    dimensions: {
      post: { width: 1200, height: 630 },
      story: { width: 1080, height: 1920 }
    }
  },
  twitter: {
    name: 'Twitter',
    color: '#1DA1F2',
    icon: 'Twitter',
    maxCaptionLength: 280,
    maxHashtags: 0,
    supportedFormats: ['image', 'video', 'text'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    dimensions: {
      tweet: { width: 1200, height: 675 }
    }
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0077B5',
    icon: 'Linkedin',
    maxCaptionLength: 3000,
    maxHashtags: 0,
    supportedFormats: ['image', 'video', 'link'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    dimensions: {
      post: { width: 1200, height: 627 }
    }
  },
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    icon: 'Youtube',
    maxCaptionLength: 5000,
    maxHashtags: 0,
    supportedFormats: ['video'],
    maxFileSize: 128 * 1024 * 1024, // 128MB
    dimensions: {
      video: { width: 1920, height: 1080 }
    }
  },
  tiktok: {
    name: 'TikTok',
    color: '#000000',
    icon: 'Music',
    maxCaptionLength: 2200,
    maxHashtags: 0,
    supportedFormats: ['video'],
    maxFileSize: 500 * 1024 * 1024, // 500MB
    dimensions: {
      video: { width: 1080, height: 1920 }
    }
  }
} as const;

// Configuration des statuts de posts
export const POST_STATUS_CONFIG = {
  draft: {
    name: 'Brouillon',
    color: '#6B7280',
    icon: 'FileText',
    description: 'Post en cours de création'
  },
  scheduled: {
    name: 'Programmé',
    color: '#3B82F6',
    icon: 'Clock',
    description: 'Post programmé pour publication'
  },
  published: {
    name: 'Publié',
    color: '#10B981',
    icon: 'CheckCircle',
    description: 'Post publié avec succès'
  },
  failed: {
    name: 'Échec',
    color: '#EF4444',
    icon: 'XCircle',
    description: 'Échec de publication'
  },
  pending: {
    name: 'En attente',
    color: '#F59E0B',
    icon: 'AlertCircle',
    description: 'En attente de validation'
  },
  rejected: {
    name: 'Rejeté',
    color: '#DC2626',
    icon: 'X',
    description: 'Post rejeté par le gestionnaire'
  }
} as const;

// Configuration des types de notifications
export const NOTIFICATION_TYPES = {
  info: {
    name: 'Information',
    color: '#3B82F6',
    icon: 'Info',
    duration: 5000
  },
  success: {
    name: 'Succès',
    color: '#10B981',
    icon: 'CheckCircle',
    duration: 3000
  },
  warning: {
    name: 'Avertissement',
    color: '#F59E0B',
    icon: 'AlertTriangle',
    duration: 7000
  },
  error: {
    name: 'Erreur',
    color: '#EF4444',
    icon: 'XCircle',
    duration: 10000
  }
} as const;

// Configuration des thèmes
export const THEME_CONFIG = {
  light: {
    name: 'Clair',
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280'
    }
  },
  dark: {
    name: 'Sombre',
    colors: {
      primary: '#3B82F6',
      secondary: '#9CA3AF',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF'
    }
  }
} as const;

// Configuration des couleurs
export const COLOR_SCHEMES = {
  blue: {
    name: 'Bleu',
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA'
  },
  green: {
    name: 'Vert',
    primary: '#10B981',
    secondary: '#047857',
    accent: '#34D399'
  },
  purple: {
    name: 'Violet',
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A78BFA'
  },
  orange: {
    name: 'Orange',
    primary: '#F59E0B',
    secondary: '#D97706',
    accent: '#FBBF24'
  },
  red: {
    name: 'Rouge',
    primary: '#EF4444',
    secondary: '#DC2626',
    accent: '#F87171'
  }
} as const;

// Configuration des tailles de police
export const FONT_SIZES = {
  small: {
    name: 'Petit',
    base: '14px',
    scale: 0.875
  },
  medium: {
    name: 'Moyen',
    base: '16px',
    scale: 1
  },
  large: {
    name: 'Grand',
    base: '18px',
    scale: 1.125
  }
} as const;

// Configuration des breakpoints
export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Configuration des animations
export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out'
  }
} as const;

// Configuration des API
export const API_CONFIG = {
  timeout: 30000, // 30 secondes
  retries: 3,
  retryDelay: 1000, // 1 seconde
  rateLimit: {
    requests: 100,
    window: 60000 // 1 minute
  }
} as const;

// Configuration du stockage
export const STORAGE_CONFIG = {
  prefix: 'postelma_',
  version: '1.0.0',
  maxSize: 50 * 1024 * 1024, // 50MB
  compression: true,
  encryption: false
} as const;

// Configuration des webhooks N8N
export const N8N_WEBHOOKS = {
  generateCaptions: '/webhook/generate-captions',
  generateImages: '/webhook/generate-images',
  analyzeContent: '/webhook/analyze-content',
  schedulePost: '/webhook/schedule-post',
  publishPost: '/webhook/publish-post'
} as const;

// Configuration des intégrations
export const INTEGRATIONS = {
  ayrshare: {
    name: 'Ayrshare',
    description: 'API de publication sur les réseaux sociaux',
    website: 'https://ayrshare.com',
    required: true
  },
  openai: {
    name: 'OpenAI',
    description: 'IA pour la génération de contenu',
    website: 'https://openai.com',
    required: false
  },
  n8n: {
    name: 'N8N',
    description: 'Automatisation des workflows',
    website: 'https://n8n.io',
    required: true
  }
} as const;

// Configuration des plans
export const PLAN_CONFIG = {
  free: {
    name: 'Gratuit',
    price: 0,
    maxPosts: 10,
    maxUsers: 1,
    maxStorage: 100 * 1024 * 1024, // 100MB
    features: ['basic_posting', 'basic_analytics']
  },
  pro: {
    name: 'Pro',
    price: 29,
    maxPosts: 1000,
    maxUsers: 10,
    maxStorage: 10 * 1024 * 1024 * 1024, // 10GB
    features: ['advanced_posting', 'advanced_analytics', 'team_management', 'ai_features']
  },
  enterprise: {
    name: 'Entreprise',
    price: 99,
    maxPosts: -1, // Illimité
    maxUsers: -1, // Illimité
    maxStorage: -1, // Illimité
    features: ['unlimited_posting', 'unlimited_analytics', 'unlimited_team', 'all_features', 'priority_support']
  }
} as const;

// Configuration des langues
export const LANGUAGES = {
  fr: {
    name: 'Français',
    code: 'fr',
    flag: '🇫🇷',
    rtl: false
  },
  en: {
    name: 'English',
    code: 'en',
    flag: '🇺🇸',
    rtl: false
  },
  es: {
    name: 'Español',
    code: 'es',
    flag: '🇪🇸',
    rtl: false
  }
} as const;

// Configuration des fuseaux horaires
export const TIMEZONES = {
  'Europe/Paris': 'Paris (UTC+1)',
  'Europe/London': 'Londres (UTC+0)',
  'America/New_York': 'New York (UTC-5)',
  'America/Los_Angeles': 'Los Angeles (UTC-8)',
  'Asia/Tokyo': 'Tokyo (UTC+9)',
  'Australia/Sydney': 'Sydney (UTC+10)'
} as const;

// Configuration des formats de date
export const DATE_FORMATS = {
  'DD/MM/YYYY': '31/12/2023',
  'MM/DD/YYYY': '12/31/2023',
  'YYYY-MM-DD': '2023-12-31',
  'DD-MM-YYYY': '31-12-2023'
} as const;

// Configuration des formats d'heure
export const TIME_FORMATS = {
  '12h': '12:00 PM',
  '24h': '14:00'
} as const;

// Export de toutes les configurations
export const APP_CONFIG = {
  info: APP_INFO,
  env: ENV_CONFIG,
  limits: LIMITS,
  roles: ROLE_CONFIG,
  platforms: PLATFORM_CONFIG,
  postStatus: POST_STATUS_CONFIG,
  notifications: NOTIFICATION_TYPES,
  themes: THEME_CONFIG,
  colors: COLOR_SCHEMES,
  fonts: FONT_SIZES,
  breakpoints: BREAKPOINTS,
  animations: ANIMATION_CONFIG,
  api: API_CONFIG,
  storage: STORAGE_CONFIG,
  webhooks: N8N_WEBHOOKS,
  integrations: INTEGRATIONS,
  plans: PLAN_CONFIG,
  languages: LANGUAGES,
  timezones: TIMEZONES,
  dateFormats: DATE_FORMATS,
  timeFormats: TIME_FORMATS
} as const;

export default APP_CONFIG;
