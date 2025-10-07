/**
 * Hook personnalisé pour la gestion des analytics
 * Centralise la logique métier des analytics avec les services
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnalyticsService, AnalyticsFilters, AnalyticsPeriod } from '@/services';
import { PostAnalytics, AnalyticsSummary } from '@/types/analytics';

export interface UseAnalyticsOptions {
  autoLoad?: boolean;
  initialFilters?: AnalyticsFilters;
}

export interface UseAnalyticsReturn {
  // État
  analytics: PostAnalytics[];
  summary: AnalyticsSummary | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadAnalytics: () => Promise<void>;
  savePostAnalytics: (analytics: PostAnalytics) => Promise<boolean>;
  getPostAnalytics: (postId: string) => Promise<PostAnalytics | null>;
  generateMockData: () => Promise<void>;
  exportAnalytics: () => Promise<string>;
  importAnalytics: (jsonData: string) => Promise<boolean>;
  
  // Filtrage
  setFilters: (filters: AnalyticsFilters) => void;
  clearFilters: () => void;
  filteredAnalytics: PostAnalytics[];
  
  // Métriques
  calculateAggregatedMetrics: (analytics: PostAnalytics[]) => Promise<{
    totalEngagement: number;
    totalImpressions: number;
    totalReach: number;
    averageEngagementRate: number;
    totalPosts: number;
    topPerformingPost: PostAnalytics | null;
  }>;
  
  // Utilitaires
  getAnalyticsForPeriod: (period: AnalyticsPeriod) => Promise<PostAnalytics[]>;
  getAnalyticsByPlatform: (platform: string) => Promise<PostAnalytics[]>;
  getAnalyticsByAccount: (accountId: string) => Promise<PostAnalytics[]>;
  getPredefinedPeriods: () => AnalyticsPeriod[];
  refreshSummary: () => Promise<void>;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}): UseAnalyticsReturn => {
  const { autoLoad = true, initialFilters = {} } = options;
  
  // État principal
  const [analytics, setAnalytics] = useState<PostAnalytics[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters);

  // Charger tous les analytics
  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allAnalytics = await AnalyticsService.getFilteredAnalytics(filters);
      setAnalytics(allAnalytics);
      
      // Charger le résumé
      const analyticsSummary = await AnalyticsService.getAnalyticsSummary();
      setSummary(analyticsSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des analytics');
      console.error('Erreur useAnalytics.loadAnalytics:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Sauvegarder les analytics d'un post
  const savePostAnalytics = useCallback(async (analytics: PostAnalytics): Promise<boolean> => {
    try {
      setError(null);
      const success = await AnalyticsService.savePostAnalytics(analytics);
      
      if (success) {
        await loadAnalytics(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      console.error('Erreur useAnalytics.savePostAnalytics:', err);
      return false;
    }
  }, [loadAnalytics]);

  // Récupérer les analytics d'un post
  const getPostAnalytics = useCallback(async (postId: string): Promise<PostAnalytics | null> => {
    try {
      setError(null);
      return await AnalyticsService.getPostAnalytics(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération');
      console.error('Erreur useAnalytics.getPostAnalytics:', err);
      return null;
    }
  }, []);

  // Générer des données mock
  const generateMockData = useCallback(async () => {
    try {
      setError(null);
      await AnalyticsService.generateMockData();
      await loadAnalytics(); // Recharger la liste
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération des données mock');
      console.error('Erreur useAnalytics.generateMockData:', err);
    }
  }, [loadAnalytics]);

  // Exporter les analytics
  const exportAnalytics = useCallback(async (): Promise<string> => {
    try {
      setError(null);
      return await AnalyticsService.exportAnalytics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'export');
      console.error('Erreur useAnalytics.exportAnalytics:', err);
      return '';
    }
  }, []);

  // Importer les analytics
  const importAnalytics = useCallback(async (jsonData: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await AnalyticsService.importAnalytics(jsonData);
      
      if (success) {
        await loadAnalytics(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import');
      console.error('Erreur useAnalytics.importAnalytics:', err);
      return false;
    }
  }, [loadAnalytics]);

  // Calculer les métriques agrégées
  const calculateAggregatedMetrics = useCallback(async (analytics: PostAnalytics[]) => {
    try {
      return await AnalyticsService.calculateAggregatedMetrics(analytics);
    } catch (err) {
      console.error('Erreur useAnalytics.calculateAggregatedMetrics:', err);
      return {
        totalEngagement: 0,
        totalImpressions: 0,
        totalReach: 0,
        averageEngagementRate: 0,
        totalPosts: 0,
        topPerformingPost: null
      };
    }
  }, []);

  // Récupérer les analytics pour une période
  const getAnalyticsForPeriod = useCallback(async (period: AnalyticsPeriod): Promise<PostAnalytics[]> => {
    try {
      return await AnalyticsService.getAnalyticsForPeriod(period);
    } catch (err) {
      console.error('Erreur useAnalytics.getAnalyticsForPeriod:', err);
      return [];
    }
  }, []);

  // Récupérer les analytics par plateforme
  const getAnalyticsByPlatform = useCallback(async (platform: string): Promise<PostAnalytics[]> => {
    try {
      return await AnalyticsService.getAnalyticsByPlatform(platform);
    } catch (err) {
      console.error('Erreur useAnalytics.getAnalyticsByPlatform:', err);
      return [];
    }
  }, []);

  // Récupérer les analytics par compte
  const getAnalyticsByAccount = useCallback(async (accountId: string): Promise<PostAnalytics[]> => {
    try {
      return await AnalyticsService.getAnalyticsByAccount(accountId);
    } catch (err) {
      console.error('Erreur useAnalytics.getAnalyticsByAccount:', err);
      return [];
    }
  }, []);

  // Obtenir les périodes prédéfinies
  const getPredefinedPeriods = useCallback((): AnalyticsPeriod[] => {
    return AnalyticsService.getPredefinedPeriods();
  }, []);

  // Actualiser le résumé
  const refreshSummary = useCallback(async () => {
    try {
      const analyticsSummary = await AnalyticsService.getAnalyticsSummary();
      setSummary(analyticsSummary);
    } catch (err) {
      console.error('Erreur useAnalytics.refreshSummary:', err);
    }
  }, []);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: AnalyticsFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Effacer les filtres
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Analytics filtrés (calculé)
  const filteredAnalytics = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return analytics;
    }

    return analytics.filter(analytic => {
      // Filtre par date
      if (filters.dateFrom) {
        const postDate = new Date(analytic.postDate);
        if (postDate < filters.dateFrom) return false;
      }
      
      if (filters.dateTo) {
        const postDate = new Date(analytic.postDate);
        if (postDate > filters.dateTo) return false;
      }
      
      // Filtre par plateformes
      if (filters.platforms && filters.platforms.length > 0) {
        const hasMatchingPlatform = analytic.platforms.some(platform => 
          filters.platforms!.includes(platform)
        );
        if (!hasMatchingPlatform) return false;
      }
      
      // Filtre par comptes
      if (filters.accounts && filters.accounts.length > 0) {
        if (!filters.accounts.includes(analytic.accountId)) return false;
      }
      
      return true;
    });
  }, [analytics, filters]);

  // Chargement automatique
  useEffect(() => {
    if (autoLoad) {
      loadAnalytics();
    }
  }, [autoLoad, loadAnalytics]);

  // Recharger quand les filtres changent
  useEffect(() => {
    if (autoLoad) {
      loadAnalytics();
    }
  }, [filters, autoLoad, loadAnalytics]);

  return {
    // État
    analytics,
    summary,
    loading,
    error,
    
    // Actions
    loadAnalytics,
    savePostAnalytics,
    getPostAnalytics,
    generateMockData,
    exportAnalytics,
    importAnalytics,
    
    // Filtrage
    setFilters: updateFilters,
    clearFilters,
    filteredAnalytics,
    
    // Métriques
    calculateAggregatedMetrics,
    
    // Utilitaires
    getAnalyticsForPeriod,
    getAnalyticsByPlatform,
    getAnalyticsByAccount,
    getPredefinedPeriods,
    refreshSummary
  };
};

export default useAnalytics;