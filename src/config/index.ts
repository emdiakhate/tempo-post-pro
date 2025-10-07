/**
 * Index des configurations
 * Exporte toutes les configurations centralisées
 */

// Configuration principale
export { default as APP_CONFIG } from './app.config';
export * from './app.config';

// Constantes
export { default as CONSTANTS } from './constants';
export * from './constants';

// Design system
export { default as DESIGN_SYSTEM } from './designSystem';
export * from './designSystem';

// Plateformes
export { default as PLATFORMS } from './platforms';
export * from './platforms';

// Icônes sociales
export { default as SOCIAL_ICONS } from './socialIcons';
export * from './socialIcons';

// Configuration des statuts
export { default as STATUS_CONFIG } from './statusConfig';
export * from './statusConfig';

// Configuration N8N
export { default as N8N_CONFIG } from './n8n.config';
export * from './n8n.config';

// Configuration des rôles
export { default as ROLES_CONFIG } from './roles.config';
export * from './roles.config';

// Export principal
export const CONFIG = {
  app: APP_CONFIG,
  constants: CONSTANTS,
  design: DESIGN_SYSTEM,
  platforms: PLATFORMS,
  socialIcons: SOCIAL_ICONS,
  status: STATUS_CONFIG,
  n8n: N8N_CONFIG,
  roles: ROLES_CONFIG
} as const;

export default CONFIG;
