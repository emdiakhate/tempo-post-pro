/**
 * Index des hooks personnalisés
 * Exporte tous les hooks de gestion d'état
 */

// Hooks de données
import usePosts from './usePosts';
export { default as usePosts } from './usePosts';
export type { UsePostsOptions, UsePostsReturn } from './usePosts';

import useUsers from './useUsers';
export { default as useUsers } from './useUsers';
export type { UseUsersOptions, UseUsersReturn } from './useUsers';

import useSocialAccounts from './useSocialAccounts';
export { default as useSocialAccounts } from './useSocialAccounts';
export type { UseSocialAccountsOptions, UseSocialAccountsReturn } from './useSocialAccounts';

import useAnalytics from './useAnalytics';
export { default as useAnalytics } from './useAnalytics';
export type { UseAnalyticsOptions, UseAnalyticsReturn } from './useAnalytics';

import useMedia from './useMedia';
export { default as useMedia } from './useMedia';
export type { UseMediaOptions, UseMediaReturn, MediaItem, MediaFilters, MediaStats } from './useMedia';

// Hooks globaux
import useGlobalStats from './useGlobalStats';
export { default as useGlobalStats } from './useGlobalStats';
export type { UseGlobalStatsOptions, UseGlobalStatsReturn, GlobalStats } from './useGlobalStats';

import useNotifications from './useNotifications';
export { default as useNotifications } from './useNotifications';
export type { UseNotificationsOptions, UseNotificationsReturn, Notification, NotificationType, NotificationFilters, NotificationStats } from './useNotifications';

import useTheme from './useTheme';
export { default as useTheme } from './useTheme';
export type { UseThemeOptions, UseThemeReturn, ThemeMode, ColorScheme, FontSize, ThemePreferences } from './useTheme';

import useSettings from './useSettings';
export { default as useSettings } from './useSettings';
export type { UseSettingsOptions, UseSettingsReturn, AppSettings } from './useSettings';

// Hook d'authentification (existant)
import { useAuth } from '@/contexts/AuthContext';
export { useAuth } from '@/contexts/AuthContext';

// Hook pour le chargement d'images (existant)
import useImageLoader from './useImageLoader';
export { default as useImageLoader } from './useImageLoader';

// Hook pour les services
import { useService } from '@/services';
export { useService } from '@/services';

// Hook principal pour l'injection de dépendances
export const useHooks = () => {
  return {
    // Hooks de données
    usePosts: usePosts,
    useUsers: useUsers,
    useSocialAccounts: useSocialAccounts,
    useAnalytics: useAnalytics,
    useMedia: useMedia,
    
    // Hooks globaux
    useGlobalStats: useGlobalStats,
    useNotifications: useNotifications,
    useTheme: useTheme,
    useSettings: useSettings,
    
    // Hooks existants
    useAuth: useAuth,
    useImageLoader: useImageLoader,
    useService: useService
  };
};

export default {
  usePosts: usePosts,
  useUsers: useUsers,
  useSocialAccounts: useSocialAccounts,
  useAnalytics: useAnalytics,
  useMedia: useMedia,
  useGlobalStats: useGlobalStats,
  useNotifications: useNotifications,
  useTheme: useTheme,
  useSettings: useSettings,
  useAuth: useAuth,
  useImageLoader: useImageLoader,
  useService: useService,
  useHooks: useHooks
};
