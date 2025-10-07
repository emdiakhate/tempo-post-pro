/**
 * Hook personnalisé pour les statistiques globales
 * Centralise les statistiques de l'ensemble de l'application
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PostsService, UsersService, SocialAccountsService, AnalyticsService } from '@/services';

export interface GlobalStats {
  posts: {
    total: number;
    published: number;
    scheduled: number;
    draft: number;
    pending: number;
    rejected: number;
    failed: number;
  };
  users: {
    total: number;
    active: number;
    inactive: number;
    byRole: {
      owner: number;
      manager: number;
      creator: number;
      viewer: number;
    };
  };
  socialAccounts: {
    total: number;
    connected: number;
    disconnected: number;
    byPlatform: {
      instagram: number;
      facebook: number;
      twitter: number;
      linkedin: number;
      youtube: number;
      tiktok: number;
      pinterest: number;
    };
  };
  analytics: {
    totalEngagement: number;
    totalImpressions: number;
    totalReach: number;
    averageEngagementRate: number;
    totalPosts: number;
  };
  media: {
    total: number;
    images: number;
    videos: number;
    totalSize: number;
  };
  lastUpdated: Date;
}

export interface UseGlobalStatsOptions {
  autoLoad?: boolean;
  refreshInterval?: number; // en millisecondes
}

export interface UseGlobalStatsReturn {
  // État
  stats: GlobalStats | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadStats: () => Promise<void>;
  refreshStats: () => Promise<void>;
  
  // Utilitaires
  getStatsForPeriod: (days: number) => Promise<Partial<GlobalStats>>;
  exportStats: () => Promise<string>;
}

export const useGlobalStats = (options: UseGlobalStatsOptions = {}): UseGlobalStatsReturn => {
  const { autoLoad = true, refreshInterval = 300000 } = options; // 5 minutes par défaut
  
  // État principal
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les statistiques
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les statistiques de tous les services en parallèle
      const [
        postsStats,
        usersStats,
        socialAccountsStats,
        analyticsSummary
      ] = await Promise.all([
        PostsService.getStats(),
        UsersService.getStats(),
        SocialAccountsService.getStats(),
        AnalyticsService.getAnalyticsSummary()
      ]);
      
      // Calculer les statistiques des médias (simulation)
      const mediaStats = {
        total: 0,
        images: 0,
        videos: 0,
        totalSize: 0
      };
      
      // Créer l'objet de statistiques globales
      const globalStats: GlobalStats = {
        posts: postsStats,
        users: usersStats,
        socialAccounts: socialAccountsStats,
        analytics: {
          totalEngagement: (analyticsSummary as any).totalEngagement || 0,
          totalImpressions: (analyticsSummary as any).totalImpressions || 0,
          totalReach: (analyticsSummary as any).totalReach || 0,
          averageEngagementRate: (analyticsSummary as any).avgEngagementRate || 0,
          totalPosts: (analyticsSummary as any).topPosts?.length || 0
        },
        media: mediaStats,
        lastUpdated: new Date()
      };
      
      setStats(globalStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
      console.error('Erreur useGlobalStats.loadStats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualiser les statistiques
  const refreshStats = useCallback(async () => {
    await loadStats();
  }, [loadStats]);

  // Obtenir les statistiques pour une période
  const getStatsForPeriod = useCallback(async (days: number): Promise<Partial<GlobalStats>> => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Récupérer les analytics pour la période
      const analytics = await AnalyticsService.getFilteredAnalytics({
        dateFrom: startDate,
        dateTo: endDate
      });
      
      // Calculer les métriques pour la période
      const periodMetrics = await AnalyticsService.calculateAggregatedMetrics(analytics);
      
      return {
        analytics: {
          totalEngagement: periodMetrics.totalEngagement,
          totalImpressions: periodMetrics.totalImpressions,
          totalReach: periodMetrics.totalReach,
          averageEngagementRate: periodMetrics.averageEngagementRate,
          totalPosts: periodMetrics.totalPosts
        },
        lastUpdated: new Date()
      };
    } catch (err) {
      console.error('Erreur useGlobalStats.getStatsForPeriod:', err);
      return {};
    }
  }, []);

  // Exporter les statistiques
  const exportStats = useCallback(async (): Promise<string> => {
    try {
      if (!stats) return '';
      return JSON.stringify(stats, null, 2);
    } catch (err) {
      console.error('Erreur useGlobalStats.exportStats:', err);
      return '';
    }
  }, [stats]);

  // Calculer les tendances (memoized)
  const trends = useMemo(() => {
    if (!stats) return null;
    
    // Calculer les tendances par rapport aux statistiques précédentes
    // Pour l'instant, on retourne des valeurs simulées
    return {
      posts: {
        trend: 'up' as const,
        percentage: 12.5
      },
      users: {
        trend: 'up' as const,
        percentage: 8.3
      },
      engagement: {
        trend: 'up' as const,
        percentage: 15.2
      },
      reach: {
        trend: 'down' as const,
        percentage: -3.1
      }
    };
  }, [stats]);

  // Chargement automatique
  useEffect(() => {
    if (autoLoad) {
      loadStats();
    }
  }, [autoLoad, loadStats]);

  // Actualisation automatique
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        refreshStats();
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [refreshInterval, refreshStats]);

  return {
    // État
    stats,
    loading,
    error,
    
    // Actions
    loadStats,
    refreshStats,
    
    // Utilitaires
    getStatsForPeriod,
    exportStats
  };
};

export default useGlobalStats;
