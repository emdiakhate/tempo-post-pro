/**
 * Constantes globales de l'application Postelma
 * Centralise toutes les valeurs constantes utilisées dans l'app
 */

// Constantes de validation
export const VALIDATION = {
  // Emails
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMAIL_MAX_LENGTH: 254,
  
  // Mots de passe
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  
  // Noms
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  NAME_REGEX: /^[a-zA-ZÀ-ÿ\s'-]+$/,
  
  // URLs
  URL_REGEX: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  
  // Hashtags
  HASHTAG_REGEX: /^#[a-zA-Z0-9_]+$/,
  HASHTAG_MAX_LENGTH: 100,
  MAX_HASHTAGS: 30,
  
  // Captions
  CAPTION_MAX_LENGTH: 2200,
  CAPTION_MIN_LENGTH: 1,
  
  // Fichiers
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_VIDEO_SIZE: 500 * 1024 * 1024, // 500MB
} as const;

// Constantes de formatage
export const FORMATTING = {
  // Dates
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
  
  // Nombres
  CURRENCY_SYMBOL: '€',
  CURRENCY_DECIMALS: 2,
  
  // Tailles de fichiers
  FILE_SIZE_UNITS: ['B', 'KB', 'MB', 'GB', 'TB'],
  FILE_SIZE_THRESHOLD: 1024,
  
  // Pourcentages
  PERCENTAGE_DECIMALS: 1,
  
  // Durées
  DURATION_FORMAT: 'HH:mm:ss',
  DURATION_SHORT_FORMAT: 'mm:ss',
} as const;

// Constantes de navigation
export const NAVIGATION = {
  // Routes principales
  ROUTES: {
    HOME: '/',
    CALENDAR: '/calendar',
    ANALYTICS: '/analytics',
    POSTS: '/posts',
    QUEUE: '/queue',
    ARCHIVES: '/archives',
    LEADS: '/leads',
    TEAM: '/team',
    SETTINGS: '/settings',
    LOGIN: '/login',
    LOGOUT: '/logout'
  },
  
  // Routes protégées
  PROTECTED_ROUTES: [
    '/calendar',
    '/analytics',
    '/posts',
    '/queue',
    '/archives',
    '/leads',
    '/team',
    '/settings'
  ],
  
  // Routes publiques
  PUBLIC_ROUTES: [
    '/login',
    '/logout'
  ]
} as const;

// Constantes de stockage
export const STORAGE_KEYS = {
  // Utilisateur
  USER: 'user',
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  
  // Application
  THEME: 'theme',
  LANGUAGE: 'language',
  SETTINGS: 'settings',
  
  // Données
  POSTS: 'posts',
  USERS: 'users',
  SOCIAL_ACCOUNTS: 'social_accounts',
  ANALYTICS: 'analytics',
  MEDIA: 'media',
  NOTIFICATIONS: 'notifications',
  LEADS: 'leads',
  
  // Cache
  CACHE_PREFIX: 'cache_',
  CACHE_EXPIRY: 'cache_expiry'
} as const;

// Constantes d'API
export const API = {
  // Endpoints
  ENDPOINTS: {
    AUTH: '/auth',
    USERS: '/users',
    POSTS: '/posts',
    ANALYTICS: '/analytics',
    MEDIA: '/media',
    SOCIAL_ACCOUNTS: '/social-accounts',
    LEADS: '/leads',
    NOTIFICATIONS: '/notifications'
  },
  
  // Codes de statut
  STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
  },
  
  // Timeouts
  TIMEOUT: 30000, // 30 secondes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 seconde
  
  // Rate limiting
  RATE_LIMIT: {
    REQUESTS: 100,
    WINDOW: 60000 // 1 minute
  }
} as const;

// Constantes de notifications
export const NOTIFICATIONS = {
  // Types
  TYPES: {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
  },
  
  // Durées (en millisecondes)
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 10000,
    PERSISTENT: 0 // Ne disparaît pas automatiquement
  },
  
  // Positions
  POSITION: {
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right'
  }
} as const;

// Constantes de thème
export const THEME = {
  // Modes
  MODES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  },
  
  // Schémas de couleurs
  COLOR_SCHEMES: {
    BLUE: 'blue',
    GREEN: 'green',
    PURPLE: 'purple',
    ORANGE: 'orange',
    RED: 'red'
  },
  
  // Tailles de police
  FONT_SIZES: {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
  }
} as const;

// Constantes de permissions
export const PERMISSIONS = {
  // Posts
  POSTS: {
    CREATE: 'create_posts',
    READ: 'read_posts',
    UPDATE: 'update_posts',
    DELETE: 'delete_posts',
    PUBLISH: 'publish_posts',
    SCHEDULE: 'schedule_posts'
  },
  
  // Utilisateurs
  USERS: {
    CREATE: 'create_users',
    READ: 'read_users',
    UPDATE: 'update_users',
    DELETE: 'delete_users',
    MANAGE_ROLES: 'manage_roles'
  },
  
  // Équipe
  TEAM: {
    MANAGE: 'manage_team',
    INVITE: 'invite_members',
    REMOVE: 'remove_members'
  },
  
  // Analytics
  ANALYTICS: {
    VIEW: 'view_analytics',
    EXPORT: 'export_analytics'
  },
  
  // Paramètres
  SETTINGS: {
    VIEW: 'view_settings',
    UPDATE: 'update_settings'
  }
} as const;

// Constantes de rôles
export const ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  CREATOR: 'creator',
  VIEWER: 'viewer'
} as const;

// Constantes de statuts
export const STATUS = {
  // Posts
  POSTS: {
    DRAFT: 'draft',
    SCHEDULED: 'scheduled',
    PUBLISHED: 'published',
    FAILED: 'failed',
    PENDING: 'pending',
    REJECTED: 'rejected'
  },
  
  // Utilisateurs
  USERS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended'
  },
  
  // Comptes sociaux
  SOCIAL_ACCOUNTS: {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    ERROR: 'error',
    PENDING: 'pending'
  },
  
  // Leads
  LEADS: {
    NEW: 'new',
    CONTACTED: 'contacted',
    QUALIFIED: 'qualified',
    CONVERTED: 'converted',
    LOST: 'lost'
  }
} as const;

// Constantes de plateformes
export const PLATFORMS = {
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  PINTEREST: 'pinterest'
} as const;

// Constantes de médias
export const MEDIA = {
  // Types
  TYPES: {
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    DOCUMENT: 'document'
  },
  
  // Sources
  SOURCES: {
    UPLOAD: 'upload',
    AI: 'ai',
    IMPORT: 'import',
    URL: 'url'
  },
  
  // Formats supportés
  SUPPORTED_FORMATS: {
    IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    VIDEO: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    AUDIO: ['mp3', 'wav', 'ogg', 'm4a'],
    DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'rtf']
  }
} as const;

// Constantes de temps
export const TIME = {
  // Unités
  UNITS: {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000,
    YEAR: 365 * 24 * 60 * 60 * 1000
  },
  
  // Formats
  FORMATS: {
    DATE: 'YYYY-MM-DD',
    TIME: 'HH:mm:ss',
    DATETIME: 'YYYY-MM-DD HH:mm:ss',
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
  }
} as const;

// Constantes de pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZES: [10, 25, 50, 100],
  DEFAULT_PAGE: 1
} as const;

// Constantes de tri
export const SORT = {
  DIRECTIONS: {
    ASC: 'asc',
    DESC: 'desc'
  },
  
  // Champs de tri communs
  FIELDS: {
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    NAME: 'name',
    EMAIL: 'email',
    STATUS: 'status',
    DATE: 'date'
  }
} as const;

// Constantes de filtres
export const FILTERS = {
  // Opérateurs
  OPERATORS: {
    EQUALS: 'equals',
    NOT_EQUALS: 'not_equals',
    CONTAINS: 'contains',
    NOT_CONTAINS: 'not_contains',
    STARTS_WITH: 'starts_with',
    ENDS_WITH: 'ends_with',
    GREATER_THAN: 'greater_than',
    LESS_THAN: 'less_than',
    IN: 'in',
    NOT_IN: 'not_in',
    BETWEEN: 'between',
    IS_NULL: 'is_null',
    IS_NOT_NULL: 'is_not_null'
  },
  
  // Types de filtres
  TYPES: {
    TEXT: 'text',
    NUMBER: 'number',
    DATE: 'date',
    SELECT: 'select',
    MULTI_SELECT: 'multi_select',
    BOOLEAN: 'boolean'
  }
} as const;

// Constantes d'export
export const EXPORT = {
  // Formats
  FORMATS: {
    JSON: 'json',
    CSV: 'csv',
    XLSX: 'xlsx',
    PDF: 'pdf'
  },
  
  // Options
  OPTIONS: {
    INCLUDE_METADATA: 'include_metadata',
    INCLUDE_IMAGES: 'include_images',
    COMPRESS: 'compress'
  }
} as const;

// Constantes d'import
export const IMPORT = {
  // Formats supportés
  SUPPORTED_FORMATS: ['json', 'csv', 'xlsx'],
  
  // Tailles maximales
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  
  // Options
  OPTIONS: {
    VALIDATE_DATA: 'validate_data',
    SKIP_DUPLICATES: 'skip_duplicates',
    OVERWRITE_EXISTING: 'overwrite_existing'
  }
} as const;

// Constantes de cache
export const CACHE = {
  // Clés
  KEYS: {
    USER_PROFILE: 'user_profile',
    POSTS_LIST: 'posts_list',
    ANALYTICS_DATA: 'analytics_data',
    MEDIA_LIST: 'media_list',
    SETTINGS: 'settings'
  },
  
  // Durées (en millisecondes)
  DURATION: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 30 * 60 * 1000, // 30 minutes
    LONG: 2 * 60 * 60 * 1000, // 2 heures
    VERY_LONG: 24 * 60 * 60 * 1000 // 24 heures
  }
} as const;

// Constantes d'erreurs
export const ERRORS = {
  // Codes
  CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
    CONFLICT_ERROR: 'CONFLICT_ERROR',
    RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    SERVER_ERROR: 'SERVER_ERROR'
  },
  
  // Messages
  MESSAGES: {
    INVALID_EMAIL: 'Adresse email invalide',
    INVALID_PASSWORD: 'Mot de passe invalide',
    USER_NOT_FOUND: 'Utilisateur non trouvé',
    UNAUTHORIZED: 'Non autorisé',
    FORBIDDEN: 'Accès interdit',
    NETWORK_ERROR: 'Erreur de réseau',
    SERVER_ERROR: 'Erreur du serveur',
    VALIDATION_ERROR: 'Erreur de validation'
  }
} as const;

// Constantes de succès
export const SUCCESS = {
  // Messages
  MESSAGES: {
    LOGIN_SUCCESS: 'Connexion réussie',
    LOGOUT_SUCCESS: 'Déconnexion réussie',
    POST_CREATED: 'Post créé avec succès',
    POST_UPDATED: 'Post mis à jour avec succès',
    POST_DELETED: 'Post supprimé avec succès',
    POST_PUBLISHED: 'Post publié avec succès',
    USER_CREATED: 'Utilisateur créé avec succès',
    USER_UPDATED: 'Utilisateur mis à jour avec succès',
    USER_DELETED: 'Utilisateur supprimé avec succès',
    SETTINGS_UPDATED: 'Paramètres mis à jour avec succès',
    DATA_EXPORTED: 'Données exportées avec succès',
    DATA_IMPORTED: 'Données importées avec succès'
  }
} as const;

// Export de toutes les constantes
export const CONSTANTS = {
  validation: VALIDATION,
  formatting: FORMATTING,
  navigation: NAVIGATION,
  storage: STORAGE_KEYS,
  api: API,
  notifications: NOTIFICATIONS,
  theme: THEME,
  permissions: PERMISSIONS,
  roles: ROLES,
  status: STATUS,
  platforms: PLATFORMS,
  media: MEDIA,
  time: TIME,
  pagination: PAGINATION,
  sort: SORT,
  filters: FILTERS,
  export: EXPORT,
  import: IMPORT,
  cache: CACHE,
  errors: ERRORS,
  success: SUCCESS
} as const;

export default CONSTANTS;
