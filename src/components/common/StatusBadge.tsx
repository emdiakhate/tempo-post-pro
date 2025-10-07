/**
 * StatusBadge - Composant réutilisable pour afficher les statuts
 * Utilise la configuration centralisée des statuts
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getStatusConfig, getStatusColor } from '@/config/statusConfig';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = false,
  className
}) => {
  const statusConfig = getStatusConfig(status);
  const statusColor = getStatusColor(status);

  if (!statusConfig) {
    return (
      <Badge variant="secondary" className={className}>
        {status}
      </Badge>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge
      className={cn(
        statusColor.primary,
        statusColor.text,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && statusConfig.icon && (
        <span className="mr-1">{statusConfig.icon}</span>
      )}
      {statusConfig.label}
    </Badge>
  );
};

export default StatusBadge;
