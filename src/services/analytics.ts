/**
 * Service pour la gestion des analytics
 * Utilise StorageService pour la persistance
 */

import { StorageService } from './storage';
import { PostAnalytics, AccountAnalytics, AnalyticsSummary } from '@/types/analytics';

export interface AnalyticsFilters {
  dateFrom?: Date;
  dateTo?: Date;
  platforms?: string[];
  accounts?: string[];
}

export interface AnalyticsPeriod {
  label: string;
  days: number;
  startDate: Date;
  endDate: Date;
}

export class AnalyticsService {
  private static readonly ANALYTICS_KEY = 'analytics_data';
  private static readonly SUMMARY_KEY = 'analytics_summary';

  /**
   * Récupérer les analytics d'un post
   */
  static async getPostAnalytics(postId: string): Promise<PostAnalytics | null> {
    const result = await StorageService.load<PostAnalytics[]>(this.ANALYTICS_KEY, []);
    const analytics = result.data || [];
    return analytics.find(a => a.postId === postId) || null;
  }

  /**
   * Sauvegarder les analytics d'un post
   */
  static async savePostAnalytics(analytics: PostAnalytics): Promise<boolean> {
    try {
      const allAnalytics = await StorageService.load<PostAnalytics[]>(this.ANALYTICS_KEY, []);
      const analyticsList = allAnalytics.data || [];
      
      const existingIndex = analyticsList.findIndex(a => a.postId === analytics.postId);
      
      if (existingIndex >= 0) {
        analyticsList[existingIndex] = analytics;
      } else {
        analyticsList.push(analytics);
      }
      
      const result = await StorageService.save(this.ANALYTICS_KEY, analyticsList);
      
      if (result.success) {
        await this.updateSummary();
      }
      
      return result.success;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des analytics:', error);
      return false;
    }
  }

  /**
   * Récupérer les analytics filtrés
   */
  static async getFilteredAnalytics(filters: AnalyticsFilters): Promise<PostAnalytics[]> {
    const result = await StorageService.load<PostAnalytics[]>(this.ANALYTICS_KEY, []);
    const analytics = result.data || [];
    
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
  }

  /**
   * Récupérer les analytics par période
   */
  static async getAnalyticsForPeriod(period: AnalyticsPeriod): Promise<PostAnalytics[]> {
    return this.getFilteredAnalytics({
      dateFrom: period.startDate,
      dateTo: period.endDate
    });
  }

  /**
   * Récupérer les analytics par plateforme
   */
  static async getAnalyticsByPlatform(platform: string): Promise<PostAnalytics[]> {
    return this.getFilteredAnalytics({ platforms: [platform] });
  }

  /**
   * Récupérer les analytics par compte
   */
  static async getAnalyticsByAccount(accountId: string): Promise<PostAnalytics[]> {
    return this.getFilteredAnalytics({ accounts: [accountId] });
  }

  /**
   * Calculer les métriques agrégées
   */
  static async calculateAggregatedMetrics(analytics: PostAnalytics[]): Promise<{
    totalEngagement: number;
    totalImpressions: number;
    totalReach: number;
    averageEngagementRate: number;
    totalPosts: number;
    topPerformingPost: PostAnalytics | null;
  }> {
    if (analytics.length === 0) {
      return {
        totalEngagement: 0,
        totalImpressions: 0,
        totalReach: 0,
        averageEngagementRate: 0,
        totalPosts: 0,
        topPerformingPost: null
      };
    }

    const totalEngagement = analytics.reduce((sum, a) => sum + a.engagement, 0);
    const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0);
    const totalReach = analytics.reduce((sum, a) => sum + a.reach, 0);
    const averageEngagementRate = analytics.reduce((sum, a) => sum + a.engagementRate, 0) / analytics.length;
    
    const topPerformingPost = analytics.reduce((top, current) => 
      current.engagement > top.engagement ? current : top
    );

    return {
      totalEngagement,
      totalImpressions,
      totalReach,
      averageEngagementRate,
      totalPosts: analytics.length,
      topPerformingPost
    };
  }

  /**
   * Récupérer le résumé des analytics
   */
  static async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const result = await StorageService.load<AnalyticsSummary>(this.SUMMARY_KEY);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    // Recalculer si pas de résumé sauvegardé
    await this.updateSummary();
    const newResult = await StorageService.load<AnalyticsSummary>(this.SUMMARY_KEY);
    return newResult.data || {
      totalEngagement: 0,
      totalImpressions: 0,
      totalReach: 0,
      averageEngagementRate: 0,
      totalPosts: 0,
      period: {
        startDate: new Date(),
        endDate: new Date()
      }
    };
  }

  /**
   * Mettre à jour le résumé des analytics
   */
  private static async updateSummary(): Promise<void> {
    try {
      const result = await StorageService.load<PostAnalytics[]>(this.ANALYTICS_KEY, []);
      const analytics = result.data || [];
      
      if (analytics.length === 0) {
        const emptySummary: AnalyticsSummary = {
          totalEngagement: 0,
          totalImpressions: 0,
          totalReach: 0,
          averageEngagementRate: 0,
          totalPosts: 0,
          period: {
            startDate: new Date(),
            endDate: new Date()
          }
        };
        
        await StorageService.save(this.SUMMARY_KEY, emptySummary);
        return;
      }

      const metrics = await this.calculateAggregatedMetrics(analytics);
      
      const dates = analytics.map(a => new Date(a.postDate));
      const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
      const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
      
      const summary: AnalyticsSummary = {
        ...metrics,
        period: {
          startDate,
          endDate
        }
      };
      
      await StorageService.save(this.SUMMARY_KEY, summary);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du résumé:', error);
    }
  }

  /**
   * Obtenir les périodes prédéfinies
   */
  static getPredefinedPeriods(): AnalyticsPeriod[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return [
      {
        label: 'Aujourd\'hui',
        days: 1,
        startDate: today,
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
      },
      {
        label: '7 derniers jours',
        days: 7,
        startDate: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
      },
      {
        label: '30 derniers jours',
        days: 30,
        startDate: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
      },
      {
        label: '90 derniers jours',
        days: 90,
        startDate: new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
      }
    ];
  }

  /**
   * Générer des données mock pour les tests
   */
  static async generateMockData(): Promise<void> {
    try {
      const mockAnalytics: PostAnalytics[] = [];
      const platforms = ['instagram', 'facebook', 'twitter', 'linkedin'];
      const accounts = ['account_1', 'account_2', 'account_3'];
      
      // Générer 30 jours de données
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // 1-3 posts par jour
        const postsCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < postsCount; j++) {
          const platform = platforms[Math.floor(Math.random() * platforms.length)];
          const account = accounts[Math.floor(Math.random() * accounts.length)];
          
          const analytics: PostAnalytics = {
            postId: `post_${date.getTime()}_${j}`,
            accountId: account,
            platforms: [platform],
            postDate: date,
            engagement: Math.floor(Math.random() * 1000) + 50,
            impressions: Math.floor(Math.random() * 5000) + 500,
            reach: Math.floor(Math.random() * 3000) + 300,
            likes: Math.floor(Math.random() * 500) + 20,
            comments: Math.floor(Math.random() * 100) + 5,
            shares: Math.floor(Math.random() * 50) + 2,
            clicks: Math.floor(Math.random() * 200) + 10,
            engagementRate: Math.random() * 10 + 2, // 2-12%
            lastUpdated: new Date()
          };
          
          mockAnalytics.push(analytics);
        }
      }
      
      await StorageService.save(this.ANALYTICS_KEY, mockAnalytics);
      await this.updateSummary();
    } catch (error) {
      console.error('Erreur lors de la génération des données mock:', error);
    }
  }

  /**
   * Exporter les analytics
   */
  static async exportAnalytics(): Promise<string> {
    const result = await StorageService.load<PostAnalytics[]>(this.ANALYTICS_KEY, []);
    return JSON.stringify(result.data || [], null, 2);
  }

  /**
   * Importer les analytics
   */
  static async importAnalytics(jsonData: string): Promise<boolean> {
    try {
      const importedAnalytics = JSON.parse(jsonData);
      
      if (!Array.isArray(importedAnalytics)) {
        throw new Error('Format de données invalide');
      }
      
      const result = await StorageService.save(this.ANALYTICS_KEY, importedAnalytics);
      
      if (result.success) {
        await this.updateSummary();
      }
      
      return result.success;
    } catch (error) {
      console.error('Erreur lors de l\'import des analytics:', error);
      return false;
    }
  }
}

export default AnalyticsService;
