/**
 * Design System Centralisé - Postelma
 * Remplace toutes les couleurs hardcodées par des constantes centralisées
 */

// Couleurs des plateformes sociales
export const PLATFORM_COLORS = {
  twitter: {
    primary: 'bg-[#1DA1F2]',
    hover: 'hover:bg-[#1A91DA]',
    text: 'text-white',
    border: 'border-[#1DA1F2]'
  },
  instagram: {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500',
    hover: 'hover:from-purple-600 hover:to-pink-600',
    text: 'text-white',
    border: 'border-purple-500'
  },
  facebook: {
    primary: 'bg-[#1877F2]',
    hover: 'hover:bg-[#166FE5]',
    text: 'text-white',
    border: 'border-[#1877F2]'
  },
  linkedin: {
    primary: 'bg-[#0A66C2]',
    hover: 'hover:bg-[#0956A3]',
    text: 'text-white',
    border: 'border-[#0A66C2]'
  },
  tiktok: {
    primary: 'bg-[#000000]',
    hover: 'hover:bg-[#333333]',
    text: 'text-white',
    border: 'border-[#000000]'
  },
  youtube: {
    primary: 'bg-[#FF0000]',
    hover: 'hover:bg-[#E60000]',
    text: 'text-white',
    border: 'border-[#FF0000]'
  }
} as const;

// Couleurs des statuts
export const STATUS_COLORS = {
  published: {
    primary: 'bg-green-500',
    hover: 'hover:bg-green-600',
    text: 'text-white',
    border: 'border-green-500'
  },
  scheduled: {
    primary: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    text: 'text-white',
    border: 'border-blue-500'
  },
  draft: {
    primary: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    text: 'text-white',
    border: 'border-gray-500'
  },
  failed: {
    primary: 'bg-red-500',
    hover: 'hover:bg-red-600',
    text: 'text-white',
    border: 'border-red-500'
  },
  pending: {
    primary: 'bg-yellow-500',
    hover: 'hover:bg-yellow-600',
    text: 'text-white',
    border: 'border-yellow-500'
  }
} as const;

// Couleurs des rôles
export const ROLE_COLORS = {
  owner: {
    primary: 'bg-purple-500',
    hover: 'hover:bg-purple-600',
    text: 'text-white',
    border: 'border-purple-500'
  },
  manager: {
    primary: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    text: 'text-white',
    border: 'border-blue-500'
  },
  creator: {
    primary: 'bg-green-500',
    hover: 'hover:bg-green-600',
    text: 'text-white',
    border: 'border-green-500'
  },
  viewer: {
    primary: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    text: 'text-white',
    border: 'border-gray-500'
  }
} as const;

// Couleurs des actions
export const ACTION_COLORS = {
  primary: {
    primary: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    text: 'text-white',
    border: 'border-blue-500'
  },
  success: {
    primary: 'bg-green-500',
    hover: 'hover:bg-green-600',
    text: 'text-white',
    border: 'border-green-500'
  },
  danger: {
    primary: 'bg-red-500',
    hover: 'hover:bg-red-600',
    text: 'text-white',
    border: 'border-red-500'
  },
  warning: {
    primary: 'bg-yellow-500',
    hover: 'hover:bg-yellow-600',
    text: 'text-white',
    border: 'border-yellow-500'
  }
} as const;

// Couleurs des états
export const STATE_COLORS = {
  active: {
    primary: 'bg-green-500',
    hover: 'hover:bg-green-600',
    text: 'text-white',
    border: 'border-green-500'
  },
  inactive: {
    primary: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    text: 'text-white',
    border: 'border-gray-500'
  },
  loading: {
    primary: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    text: 'text-white',
    border: 'border-blue-500'
  }
} as const;

// Types pour TypeScript
export type PlatformColor = keyof typeof PLATFORM_COLORS;
export type StatusColor = keyof typeof STATUS_COLORS;
export type RoleColor = keyof typeof ROLE_COLORS;
export type ActionColor = keyof typeof ACTION_COLORS;
export type StateColor = keyof typeof STATE_COLORS;

// Helper functions
export const getPlatformColor = (platform: PlatformColor) => PLATFORM_COLORS[platform];
export const getStatusColor = (status: StatusColor) => STATUS_COLORS[status];
export const getRoleColor = (role: RoleColor) => ROLE_COLORS[role];
export const getActionColor = (action: ActionColor) => ACTION_COLORS[action];
export const getStateColor = (state: StateColor) => STATE_COLORS[state];
