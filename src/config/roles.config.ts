/**
 * Configuration des rôles et permissions
 * Centralise la gestion des rôles et des permissions
 */

// Types de rôles
export type UserRole = 'owner' | 'manager' | 'creator' | 'viewer';

// Types de permissions
export type Permission = 
  | 'create_posts'
  | 'read_posts'
  | 'update_posts'
  | 'delete_posts'
  | 'publish_posts'
  | 'schedule_posts'
  | 'create_users'
  | 'read_users'
  | 'update_users'
  | 'delete_users'
  | 'manage_roles'
  | 'manage_team'
  | 'invite_members'
  | 'remove_members'
  | 'view_analytics'
  | 'export_analytics'
  | 'view_settings'
  | 'update_settings'
  | 'manage_social_accounts'
  | 'manage_media'
  | 'manage_leads'
  | 'view_leads'
  | 'create_leads'
  | 'update_leads'
  | 'delete_leads';

// Configuration des rôles
export const ROLE_CONFIG = {
  owner: {
    name: 'Propriétaire',
    description: 'Accès complet à toutes les fonctionnalités',
    color: '#8B5CF6',
    icon: 'Crown',
    permissions: [
      'create_posts',
      'read_posts',
      'update_posts',
      'delete_posts',
      'publish_posts',
      'schedule_posts',
      'create_users',
      'read_users',
      'update_users',
      'delete_users',
      'manage_roles',
      'manage_team',
      'invite_members',
      'remove_members',
      'view_analytics',
      'export_analytics',
      'view_settings',
      'update_settings',
      'manage_social_accounts',
      'manage_media',
      'manage_leads',
      'view_leads',
      'create_leads',
      'update_leads',
      'delete_leads'
    ],
    maxTeamMembers: 20,
    canDeleteAccount: true,
    canManageBilling: true,
    canAccessAdvancedFeatures: true
  },
  manager: {
    name: 'Gestionnaire',
    description: 'Gestion des posts et de l\'équipe',
    color: '#3B82F6',
    icon: 'Shield',
    permissions: [
      'create_posts',
      'read_posts',
      'update_posts',
      'delete_posts',
      'publish_posts',
      'schedule_posts',
      'read_users',
      'update_users',
      'manage_team',
      'invite_members',
      'remove_members',
      'view_analytics',
      'export_analytics',
      'view_settings',
      'manage_social_accounts',
      'manage_media',
      'manage_leads',
      'view_leads',
      'create_leads',
      'update_leads',
      'delete_leads'
    ],
    maxTeamMembers: 10,
    canDeleteAccount: false,
    canManageBilling: false,
    canAccessAdvancedFeatures: true
  },
  creator: {
    name: 'Créateur',
    description: 'Création et gestion de contenu',
    color: '#10B981',
    icon: 'Pencil',
    permissions: [
      'create_posts',
      'read_posts',
      'update_posts',
      'schedule_posts',
      'view_analytics',
      'manage_media',
      'view_leads',
      'create_leads',
      'update_leads'
    ],
    maxTeamMembers: 0,
    canDeleteAccount: false,
    canManageBilling: false,
    canAccessAdvancedFeatures: false
  },
  viewer: {
    name: 'Observateur',
    description: 'Consultation uniquement',
    color: '#6B7280',
    icon: 'Eye',
    permissions: [
      'read_posts',
      'view_analytics',
      'view_leads'
    ],
    maxTeamMembers: 0,
    canDeleteAccount: false,
    canManageBilling: false,
    canAccessAdvancedFeatures: false
  }
} as const;

// Configuration des permissions
export const PERMISSION_CONFIG = {
  // Posts
  create_posts: {
    name: 'Créer des posts',
    description: 'Créer de nouveaux posts',
    category: 'posts'
  },
  read_posts: {
    name: 'Lire les posts',
    description: 'Consulter les posts',
    category: 'posts'
  },
  update_posts: {
    name: 'Modifier les posts',
    description: 'Modifier les posts existants',
    category: 'posts'
  },
  delete_posts: {
    name: 'Supprimer les posts',
    description: 'Supprimer les posts',
    category: 'posts'
  },
  publish_posts: {
    name: 'Publier les posts',
    description: 'Publier des posts immédiatement',
    category: 'posts'
  },
  schedule_posts: {
    name: 'Programmer les posts',
    description: 'Programmer des posts',
    category: 'posts'
  },
  
  // Utilisateurs
  create_users: {
    name: 'Créer des utilisateurs',
    description: 'Créer de nouveaux utilisateurs',
    category: 'users'
  },
  read_users: {
    name: 'Lire les utilisateurs',
    description: 'Consulter les utilisateurs',
    category: 'users'
  },
  update_users: {
    name: 'Modifier les utilisateurs',
    description: 'Modifier les utilisateurs',
    category: 'users'
  },
  delete_users: {
    name: 'Supprimer les utilisateurs',
    description: 'Supprimer les utilisateurs',
    category: 'users'
  },
  manage_roles: {
    name: 'Gérer les rôles',
    description: 'Modifier les rôles des utilisateurs',
    category: 'users'
  },
  
  // Équipe
  manage_team: {
    name: 'Gérer l\'équipe',
    description: 'Gérer les membres de l\'équipe',
    category: 'team'
  },
  invite_members: {
    name: 'Inviter des membres',
    description: 'Inviter de nouveaux membres',
    category: 'team'
  },
  remove_members: {
    name: 'Retirer des membres',
    description: 'Retirer des membres de l\'équipe',
    category: 'team'
  },
  
  // Analytics
  view_analytics: {
    name: 'Voir les analytics',
    description: 'Consulter les statistiques',
    category: 'analytics'
  },
  export_analytics: {
    name: 'Exporter les analytics',
    description: 'Exporter les données d\'analytics',
    category: 'analytics'
  },
  
  // Paramètres
  view_settings: {
    name: 'Voir les paramètres',
    description: 'Consulter les paramètres',
    category: 'settings'
  },
  update_settings: {
    name: 'Modifier les paramètres',
    description: 'Modifier les paramètres',
    category: 'settings'
  },
  
  // Comptes sociaux
  manage_social_accounts: {
    name: 'Gérer les comptes sociaux',
    description: 'Gérer les connexions aux réseaux sociaux',
    category: 'social'
  },
  
  // Médias
  manage_media: {
    name: 'Gérer les médias',
    description: 'Gérer la bibliothèque de médias',
    category: 'media'
  },
  
  // Leads
  manage_leads: {
    name: 'Gérer les leads',
    description: 'Gérer la base de données de leads',
    category: 'leads'
  },
  view_leads: {
    name: 'Voir les leads',
    description: 'Consulter les leads',
    category: 'leads'
  },
  create_leads: {
    name: 'Créer des leads',
    description: 'Créer de nouveaux leads',
    category: 'leads'
  },
  update_leads: {
    name: 'Modifier les leads',
    description: 'Modifier les leads existants',
    category: 'leads'
  },
  delete_leads: {
    name: 'Supprimer les leads',
    description: 'Supprimer les leads',
    category: 'leads'
  }
} as const;

// Configuration des catégories de permissions
export const PERMISSION_CATEGORIES = {
  posts: {
    name: 'Posts',
    description: 'Gestion des publications',
    icon: 'FileText',
    color: '#3B82F6'
  },
  users: {
    name: 'Utilisateurs',
    description: 'Gestion des utilisateurs',
    icon: 'Users',
    color: '#8B5CF6'
  },
  team: {
    name: 'Équipe',
    description: 'Gestion de l\'équipe',
    icon: 'UserPlus',
    color: '#10B981'
  },
  analytics: {
    name: 'Analytics',
    description: 'Statistiques et rapports',
    icon: 'BarChart3',
    color: '#F59E0B'
  },
  settings: {
    name: 'Paramètres',
    description: 'Configuration de l\'application',
    icon: 'Settings',
    color: '#6B7280'
  },
  social: {
    name: 'Réseaux sociaux',
    description: 'Gestion des comptes sociaux',
    icon: 'Share2',
    color: '#EF4444'
  },
  media: {
    name: 'Médias',
    description: 'Gestion des médias',
    icon: 'Image',
    color: '#8B5CF6'
  },
  leads: {
    name: 'Leads',
    description: 'Gestion des prospects',
    icon: 'Target',
    color: '#10B981'
  }
} as const;

// Configuration des restrictions par rôle
export const ROLE_RESTRICTIONS = {
  owner: {
    canAccessAllPages: true,
    canManageBilling: true,
    canDeleteAccount: true,
    canExportAllData: true,
    canImportData: true,
    canManageIntegrations: true
  },
  manager: {
    canAccessAllPages: true,
    canManageBilling: false,
    canDeleteAccount: false,
    canExportAllData: true,
    canImportData: true,
    canManageIntegrations: false
  },
  creator: {
    canAccessAllPages: false,
    canManageBilling: false,
    canDeleteAccount: false,
    canExportAllData: false,
    canImportData: false,
    canManageIntegrations: false
  },
  viewer: {
    canAccessAllPages: false,
    canManageBilling: false,
    canDeleteAccount: false,
    canExportAllData: false,
    canImportData: false,
    canManageIntegrations: false
  }
} as const;

// Configuration des pages accessibles par rôle
export const ROLE_PAGE_ACCESS = {
  owner: [
    '/calendar',
    '/analytics',
    '/posts',
    '/queue',
    '/archives',
    '/leads',
    '/team',
    '/settings'
  ],
  manager: [
    '/calendar',
    '/analytics',
    '/posts',
    '/queue',
    '/archives',
    '/leads',
    '/team',
    '/settings'
  ],
  creator: [
    '/calendar',
    '/analytics',
    '/posts',
    '/archives',
    '/leads'
  ],
  viewer: [
    '/calendar',
    '/analytics',
    '/posts',
    '/leads'
  ]
} as const;

// Configuration des actions disponibles par rôle
export const ROLE_ACTIONS = {
  owner: [
    'create_post',
    'edit_post',
    'delete_post',
    'publish_post',
    'schedule_post',
    'approve_post',
    'reject_post',
    'create_user',
    'edit_user',
    'delete_user',
    'invite_user',
    'remove_user',
    'export_data',
    'import_data',
    'manage_settings'
  ],
  manager: [
    'create_post',
    'edit_post',
    'delete_post',
    'publish_post',
    'schedule_post',
    'approve_post',
    'reject_post',
    'edit_user',
    'invite_user',
    'remove_user',
    'export_data',
    'manage_settings'
  ],
  creator: [
    'create_post',
    'edit_post',
    'schedule_post',
    'submit_for_approval'
  ],
  viewer: [
    'view_post',
    'view_analytics'
  ]
} as const;

// Fonctions utilitaires
export const ROLE_UTILS = {
  /**
   * Vérifier si un rôle a une permission
   */
  hasPermission: (role: UserRole, permission: Permission): boolean => {
    return ROLE_CONFIG[role].permissions.includes(permission);
  },

  /**
   * Vérifier si un rôle peut accéder à une page
   */
  canAccessPage: (role: UserRole, page: string): boolean => {
    return ROLE_PAGE_ACCESS[role].includes(page);
  },

  /**
   * Vérifier si un rôle peut effectuer une action
   */
  canPerformAction: (role: UserRole, action: string): boolean => {
    return ROLE_ACTIONS[role].includes(action);
  },

  /**
   * Obtenir toutes les permissions d'un rôle
   */
  getRolePermissions: (role: UserRole): Permission[] => {
    return ROLE_CONFIG[role].permissions;
  },

  /**
   * Obtenir les pages accessibles pour un rôle
   */
  getRolePages: (role: UserRole): string[] => {
    return ROLE_PAGE_ACCESS[role];
  },

  /**
   * Obtenir les actions disponibles pour un rôle
   */
  getRoleActions: (role: UserRole): string[] => {
    return ROLE_ACTIONS[role];
  },

  /**
   * Vérifier si un rôle peut gérer d'autres utilisateurs
   */
  canManageUsers: (role: UserRole): boolean => {
    return ['owner', 'manager'].includes(role);
  },

  /**
   * Vérifier si un rôle peut publier des posts
   */
  canPublishPosts: (role: UserRole): boolean => {
    return ['owner', 'manager'].includes(role);
  },

  /**
   * Vérifier si un rôle peut approuver des posts
   */
  canApprovePosts: (role: UserRole): boolean => {
    return ['owner', 'manager'].includes(role);
  }
} as const;

// Export principal
export const ROLES_CONFIG = {
  roles: ROLE_CONFIG,
  permissions: PERMISSION_CONFIG,
  categories: PERMISSION_CATEGORIES,
  restrictions: ROLE_RESTRICTIONS,
  pageAccess: ROLE_PAGE_ACCESS,
  actions: ROLE_ACTIONS,
  utils: ROLE_UTILS
} as const;

export default ROLES_CONFIG;
