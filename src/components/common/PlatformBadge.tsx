/**
 * PlatformBadge - Composant réutilisable pour afficher les plateformes
 * Utilise la configuration centralisée des plateformes
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PlatformIcon } from '@/config/socialIcons';
import { getPlatformConfig, getPlatformColor } from '@/config/platforms';
import { cn } from '@/lib/utils';

interface PlatformBadgeProps {
  platform: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  platform,
  size = 'md',
  showIcon = true,
  className
}) => {
  const platformConfig = getPlatformConfig(platform);
  const platformColor = getPlatformColor(platform);

  if (!platformConfig) {
    return (
      <Badge variant="secondary" className={className}>
        {platform}
      </Badge>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <Badge
      className={cn(
        platformColor.primary,
        platformColor.text,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <PlatformIcon
          platform={platform}
          size={size === 'sm' ? 12 : size === 'md' ? 16 : 20}
          className={cn(iconSizes[size], 'mr-1')}
        />
      )}
      {platformConfig.name}
    </Badge>
  );
};

export default PlatformBadge;
