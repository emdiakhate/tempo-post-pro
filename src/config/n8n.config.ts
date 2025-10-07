/**
 * Configuration N8N
 * Centralise tous les webhooks et endpoints N8N
 */

// Configuration des webhooks N8N
export const N8N_WEBHOOKS = {
  // Génération de contenu
  generateCaptions: {
    url: '/webhook/generate-captions',
    method: 'POST',
    timeout: 30000,
    retries: 3
  },
  generateImages: {
    url: '/webhook/generate-images',
    method: 'POST',
    timeout: 60000,
    retries: 2
  },
  analyzeContent: {
    url: '/webhook/analyze-content',
    method: 'POST',
    timeout: 15000,
    retries: 2
  },
  
  // Publication
  schedulePost: {
    url: '/webhook/schedule-post',
    method: 'POST',
    timeout: 10000,
    retries: 3
  },
  publishPost: {
    url: '/webhook/publish-post',
    method: 'POST',
    timeout: 15000,
    retries: 3
  },
  
  // Analytics
  getAnalytics: {
    url: '/webhook/get-analytics',
    method: 'GET',
    timeout: 20000,
    retries: 2
  },
  updateAnalytics: {
    url: '/webhook/update-analytics',
    method: 'POST',
    timeout: 10000,
    retries: 2
  },
  
  // Comptes sociaux
  connectAccount: {
    url: '/webhook/connect-account',
    method: 'POST',
    timeout: 30000,
    retries: 2
  },
  disconnectAccount: {
    url: '/webhook/disconnect-account',
    method: 'POST',
    timeout: 10000,
    retries: 2
  },
  syncAccount: {
    url: '/webhook/sync-account',
    method: 'POST',
    timeout: 20000,
    retries: 2
  },
  
  // Leads
  searchLeads: {
    url: '/webhook/search-leads',
    method: 'POST',
    timeout: 45000,
    retries: 2
  },
  importLeads: {
    url: '/webhook/import-leads',
    method: 'POST',
    timeout: 60000,
    retries: 2
  }
} as const;

// Configuration des types de génération IA
export const AI_GENERATION_TYPES = {
  simple: {
    name: 'Simple',
    description: 'Génération basique de contenu',
    webhook: N8N_WEBHOOKS.generateCaptions,
    timeout: 30000
  },
  imageEditing: {
    name: 'Édition d\'image',
    description: 'Édition et amélioration d\'images',
    webhook: N8N_WEBHOOKS.generateImages,
    timeout: 60000
  },
  combination: {
    name: 'Combinaison',
    description: 'Combinaison de contenu et d\'images',
    webhook: N8N_WEBHOOKS.generateImages,
    timeout: 60000
  },
  ugc: {
    name: 'UGC',
    description: 'Contenu généré par les utilisateurs',
    webhook: N8N_WEBHOOKS.generateCaptions,
    timeout: 30000
  }
} as const;

// Configuration des tons de voix
export const VOICE_TONES = {
  professional: {
    name: 'Professionnel',
    description: 'Ton formel et professionnel',
    emoji: '💼',
    prompt: 'Écris dans un ton professionnel et formel'
  },
  casual: {
    name: 'Décontracté',
    description: 'Ton décontracté et amical',
    emoji: '😊',
    prompt: 'Écris dans un ton décontracté et amical'
  },
  inspiring: {
    name: 'Inspirant',
    description: 'Ton motivant et inspirant',
    emoji: '⚡',
    prompt: 'Écris dans un ton inspirant et motivant'
  },
  sales: {
    name: 'Vendeur',
    description: 'Ton commercial et persuasif',
    emoji: '💰',
    prompt: 'Écris dans un ton commercial et persuasif'
  },
  storytelling: {
    name: 'Storytelling',
    description: 'Ton narratif et captivant',
    emoji: '📖',
    prompt: 'Écris dans un ton narratif et captivant'
  },
  automatic: {
    name: 'Automatique',
    description: 'Laisse l\'IA choisir le ton',
    emoji: '🎭',
    prompt: 'Choisis automatiquement le ton le plus approprié'
  }
} as const;

// Configuration des plateformes pour N8N
export const N8N_PLATFORMS = {
  instagram: {
    name: 'Instagram',
    webhook: '/webhook/instagram',
    supportedActions: ['post', 'story', 'reel', 'carousel'],
    maxCaptionLength: 2200,
    maxHashtags: 30
  },
  facebook: {
    name: 'Facebook',
    webhook: '/webhook/facebook',
    supportedActions: ['post', 'story', 'page_post'],
    maxCaptionLength: 63206,
    maxHashtags: 0
  },
  twitter: {
    name: 'Twitter',
    webhook: '/webhook/twitter',
    supportedActions: ['tweet', 'thread'],
    maxCaptionLength: 280,
    maxHashtags: 0
  },
  linkedin: {
    name: 'LinkedIn',
    webhook: '/webhook/linkedin',
    supportedActions: ['post', 'article'],
    maxCaptionLength: 3000,
    maxHashtags: 0
  },
  youtube: {
    name: 'YouTube',
    webhook: '/webhook/youtube',
    supportedActions: ['video', 'short'],
    maxCaptionLength: 5000,
    maxHashtags: 0
  },
  tiktok: {
    name: 'TikTok',
    webhook: '/webhook/tiktok',
    supportedActions: ['video'],
    maxCaptionLength: 2200,
    maxHashtags: 0
  }
} as const;

// Configuration des erreurs N8N
export const N8N_ERRORS = {
  TIMEOUT: 'N8N_TIMEOUT',
  CONNECTION_ERROR: 'N8N_CONNECTION_ERROR',
  INVALID_RESPONSE: 'N8N_INVALID_RESPONSE',
  RATE_LIMIT: 'N8N_RATE_LIMIT',
  AUTHENTICATION_ERROR: 'N8N_AUTH_ERROR',
  VALIDATION_ERROR: 'N8N_VALIDATION_ERROR',
  PROCESSING_ERROR: 'N8N_PROCESSING_ERROR'
} as const;

// Configuration des retry
export const N8N_RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
} as const;

// Configuration des timeouts
export const N8N_TIMEOUTS = {
  default: 30000,
  imageGeneration: 60000,
  analytics: 20000,
  leadSearch: 45000,
  accountSync: 20000
} as const;

// Configuration des headers
export const N8N_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Postelma/1.0.0'
} as const;

// Configuration des endpoints
export const N8N_ENDPOINTS = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://n8n.postelma.com' 
    : 'http://localhost:5678',
  webhookPath: '/webhook',
  apiPath: '/api'
} as const;

// Configuration des webhooks par environnement
export const N8N_ENVIRONMENT_CONFIG = {
  development: {
    baseUrl: 'http://localhost:5678',
    timeout: 60000,
    retries: 5,
    debug: true
  },
  staging: {
    baseUrl: 'https://staging-n8n.postelma.com',
    timeout: 45000,
    retries: 3,
    debug: true
  },
  production: {
    baseUrl: 'https://n8n.postelma.com',
    timeout: 30000,
    retries: 3,
    debug: false
  }
} as const;

// Configuration des payloads
export const N8N_PAYLOAD_TEMPLATES = {
  generateCaptions: {
    prompt: '',
    tone: 'professional',
    platform: '',
    context: {
      product: '',
      target: '',
      goal: ''
    }
  },
  generateImages: {
    prompt: '',
    style: 'realistic',
    size: '1024x1024',
    count: 1
  },
  publishPost: {
    content: '',
    platforms: [],
    scheduledTime: '',
    image: '',
    captions: {}
  },
  searchLeads: {
    query: '',
    location: '',
    industry: '',
    maxResults: 50,
    includeEmail: true,
    includePhone: true,
    includeSocial: true
  }
} as const;

// Configuration des réponses
export const N8N_RESPONSE_TEMPLATES = {
  generateCaptions: {
    success: true,
    captions: {},
    error: null
  },
  generateImages: {
    success: true,
    images: [],
    error: null
  },
  publishPost: {
    success: true,
    postId: '',
    publishedAt: '',
    error: null
  },
  searchLeads: {
    success: true,
    leads: [],
    total: 0,
    error: null
  }
} as const;

// Export principal
export const N8N_CONFIG = {
  webhooks: N8N_WEBHOOKS,
  aiGeneration: AI_GENERATION_TYPES,
  voiceTones: VOICE_TONES,
  platforms: N8N_PLATFORMS,
  errors: N8N_ERRORS,
  retry: N8N_RETRY_CONFIG,
  timeouts: N8N_TIMEOUTS,
  headers: N8N_HEADERS,
  endpoints: N8N_ENDPOINTS,
  environment: N8N_ENVIRONMENT_CONFIG,
  payloads: N8N_PAYLOAD_TEMPLATES,
  responses: N8N_RESPONSE_TEMPLATES
} as const;

export default N8N_CONFIG;
