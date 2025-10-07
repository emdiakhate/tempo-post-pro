/**
 * Icônes Centralisées des Plateformes Sociales
 * Remplace toutes les icônes dupliquées
 */

import React from 'react';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube,
  Hash,
  Calendar,
  Clock,
  Users,
  BarChart3,
  Target,
  FolderOpen,
  LayoutDashboard,
  Menu,
  UserPlus,
  Search,
  TrendingUp,
  Crown,
  Shield,
  Pencil,
  Eye,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';

// Interface pour les icônes de plateformes
export interface PlatformIconProps {
  platform: string;
  size?: number;
  className?: string;
  color?: string;
}

// Composant d'icône de plateforme
export const PlatformIcon: React.FC<PlatformIconProps> = ({ 
  platform, 
  size = 20, 
  className = '', 
  color 
}) => {
  const iconProps = {
    size,
    className: `${className} ${color ? `text-${color}` : ''}`,
    style: color ? { color } : undefined
  };

  switch (platform.toLowerCase()) {
    case 'instagram':
      return <Instagram {...iconProps} />;
    case 'facebook':
      return <Facebook {...iconProps} />;
    case 'twitter':
    case 'x':
      return <Twitter {...iconProps} />;
    case 'linkedin':
      return <Linkedin {...iconProps} />;
    case 'youtube':
      return <Youtube {...iconProps} />;
    default:
      return <Hash {...iconProps} />;
  }
};

// Icônes de navigation
export const NavigationIcons = {
  Calendar,
  Clock,
  Users,
  BarChart3,
  Target,
  Hash,
  FolderOpen,
  LayoutDashboard,
  Menu,
  UserPlus,
  Search,
  TrendingUp,
  Crown,
  Shield,
  Pencil,
  Eye,
  FileText,
  Settings,
  LogOut
};

// Icônes des plateformes avec couleurs
export const PlatformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube
};

// Helper function pour obtenir l'icône d'une plateforme
export const getPlatformIcon = (platform: string) => {
  return PlatformIcons[platform.toLowerCase() as keyof typeof PlatformIcons] || Hash;
};

// Helper function pour obtenir l'icône de navigation
export const getNavigationIcon = (iconName: string) => {
  return NavigationIcons[iconName as keyof typeof NavigationIcons] || Hash;
};