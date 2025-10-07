/**
 * Configuration Centralisée des Statuts
 * Remplace toutes les configurations de statuts dupliquées
 */

import { STATUS_COLORS } from './designSystem';

export interface StatusConfig {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  isEditable: boolean;
  isDeletable: boolean;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canPublish: boolean;
    canSchedule: boolean;
  };
}

export const STATUS_CONFIGS: Record<string, StatusConfig> = {
  published: {
    id: 'published',
    label: 'Publié',
    description: 'Post publié avec succès',
    color: 'green',
    icon: 'CheckCircle',
    isActive: true,
    isEditable: false,
    isDeletable: true,
    permissions: {
      canView: true,
      canEdit: false,
      canDelete: true,
      canPublish: false,
      canSchedule: false
    }
  },
  scheduled: {
    id: 'scheduled',
    label: 'Programmé',
    description: 'Post programmé pour publication',
    color: 'blue',
    icon: 'Clock',
    isActive: true,
    isEditable: true,
    isDeletable: true,
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true,
      canPublish: false,
      canSchedule: true
    }
  },
  draft: {
    id: 'draft',
    label: 'Brouillon',
    description: 'Post en cours de rédaction',
    color: 'gray',
    icon: 'Edit',
    isActive: true,
    isEditable: true,
    isDeletable: true,
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true,
      canPublish: true,
      canSchedule: true
    }
  },
  failed: {
    id: 'failed',
    label: 'Échec',
    description: 'Échec de publication',
    color: 'red',
    icon: 'XCircle',
    isActive: false,
    isEditable: true,
    isDeletable: true,
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true,
      canPublish: true,
      canSchedule: true
    }
  },
  pending: {
    id: 'pending',
    label: 'En attente',
    description: 'En attente de validation',
    color: 'yellow',
    icon: 'Clock',
    isActive: true,
    isEditable: true,
    isDeletable: true,
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true,
      canPublish: false,
      canSchedule: false
    }
  },
  approved: {
    id: 'approved',
    label: 'Approuvé',
    description: 'Approuvé par le manager',
    color: 'green',
    icon: 'CheckCircle',
    isActive: true,
    isEditable: false,
    isDeletable: false,
    permissions: {
      canView: true,
      canEdit: false,
      canDelete: false,
      canPublish: true,
      canSchedule: true
    }
  },
  rejected: {
    id: 'rejected',
    label: 'Rejeté',
    description: 'Rejeté par le manager',
    color: 'red',
    icon: 'XCircle',
    isActive: false,
    isEditable: true,
    isDeletable: true,
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true,
      canPublish: false,
      canSchedule: false
    }
  }
};

// Helper functions
export const getStatusConfig = (statusId: string): StatusConfig | undefined => {
  return STATUS_CONFIGS[statusId];
};

export const getStatusColor = (statusId: string) => {
  const status = getStatusConfig(statusId);
  return status ? STATUS_COLORS[status.color as keyof typeof STATUS_COLORS] : STATUS_COLORS.draft;
};

export const getStatusIcon = (statusId: string) => {
  const status = getStatusConfig(statusId);
  return status?.icon || 'Hash';
};

export const getStatusLabel = (statusId: string) => {
  const status = getStatusConfig(statusId);
  return status?.label || statusId;
};

export const getStatusDescription = (statusId: string) => {
  const status = getStatusConfig(statusId);
  return status?.description || '';
};

export const getStatusPermissions = (statusId: string) => {
  const status = getStatusConfig(statusId);
  return status?.permissions;
};

export const isStatusEditable = (statusId: string) => {
  const status = getStatusConfig(statusId);
  return status?.isEditable || false;
};

export const isStatusDeletable = (statusId: string) => {
  const status = getStatusConfig(statusId);
  return status?.isDeletable || false;
};

export const isStatusActive = (statusId: string) => {
  const status = getStatusConfig(statusId);
  return status?.isActive || false;
};