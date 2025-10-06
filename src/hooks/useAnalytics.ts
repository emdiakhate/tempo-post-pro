/**
 * Hook pour la gestion des analytics
 * Phase 3: Analytics Interface
 */

import { useState, useEffect, useCallback } from 'react';
import { AnalyticsSummary, AnalyticsFilters, SocialPlatform } from '@/types/analytics';

// Fonction pour générer des données mock cohérentes
const generateMockAnalytics = (
  period: { start: Date; end: Date },
  platforms: SocialPlatform[]
): AnalyticsSummary => {
  const days = Math.ceil((period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Générer des données quotidiennes
  const dailyEngagement = Array.from({ length: days }, (_, i) => {
    const date = new Date(period.start);
    date.setDate(date.getDate() + i);
    
    return {
      date: date.toISOString().split('T')[0],
      engagement: Math.floor(Math.random() * 500) + 100,
      impressions: Math.floor(Math.random() * 5000) + 1000,
      posts: Math.floor(Math.random() * 3) + 1
    };
  });

  // Calculer les totaux
  const totalLikes = dailyEngagement.reduce((sum, day) => sum + day.engagement, 0);
  const totalImpressions = dailyEngagement.reduce((sum, day) => sum + day.impressions, 0);
  const totalComments = Math.floor(totalLikes * 0.1);
  const totalShares = Math.floor(totalLikes * 0.05);
  const totalReach = Math.floor(totalImpressions * 0.8);
  const avgEngagementRate = (totalLikes + totalComments + totalShares) / totalImpressions * 100;

  // Performance par plateforme
  const platformPerformance = platforms.map(platform => ({
    platform,
    impressions: Math.floor(Math.random() * 10000) + 5000,
    engagementRate: Math.random() * 5 + 1
  }));

  // Top posts
  const topPosts = Array.from({ length: 5 }, (_, i) => ({
    postId: `post-${i + 1}`,
    platform: platforms[Math.floor(Math.random() * platforms.length)] as SocialPlatform,
    publishedAt: new Date(period.start.getTime() + Math.random() * (period.end.getTime() - period.start.getTime())),
    metrics: {
      likes: Math.floor(Math.random() * 2000) + 500,
      comments: Math.floor(Math.random() * 200) + 50,
      shares: Math.floor(Math.random() * 100) + 20,
      impressions: Math.floor(Math.random() * 10000) + 2000,
      reach: Math.floor(Math.random() * 8000) + 1500,
      engagement: Math.floor(Math.random() * 1500) + 300,
      engagementRate: Math.random() * 8 + 2,
      saves: Math.floor(Math.random() * 50) + 10,
      clicks: Math.floor(Math.random() * 100) + 20
    },
    lastUpdated: new Date()
  }));

  // Performance par type de contenu
  const contentTypePerformance = [
    { type: 'Image simple', avgEngagement: Math.random() * 200 + 100, count: 15 },
    { type: 'Carousel', avgEngagement: Math.random() * 300 + 200, count: 8 },
    { type: 'Reel', avgEngagement: Math.random() * 500 + 300, count: 12 },
    { type: 'Story', avgEngagement: Math.random() * 150 + 50, count: 25 }
  ];

  // Meilleurs moments
  const bestTimes = Array.from({ length: 20 }, () => ({
    day: Math.floor(Math.random() * 7),
    hour: Math.floor(Math.random() * 24),
    avgEngagement: Math.random() * 200 + 50
  }));

  return {
    totalLikes,
    totalComments,
    totalShares,
    totalImpressions,
    totalReach,
    avgEngagementRate,
    bestPerformingPlatform: platforms[0],
    bestPerformingPost: topPosts[0],
    dailyEngagement,
    platformPerformance,
    topPosts,
    contentTypePerformance,
    bestTimes
  };
};

export function useAnalytics(filters: AnalyticsFilters) {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    try {
      // TODO: Remplacer par Ayrshare API
      // Endpoint: GET /api/analytics/post?id=XXX
      // Documentation: https://docs.ayrshare.com/rest-api/endpoints/analytics
      
      const fetchRealAnalytics = async () => {
        // const response = await fetch(`https://app.ayrshare.com/api/analytics/post?id=${postId}`, {
        //   headers: { 'Authorization': `Bearer ${AYRSHARE_API_KEY}` }
        // });
        // return response.json();
      };

      // Simulation du délai API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockAnalytics(filters.period, filters.platforms);
      setData(mockData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.period, filters.platforms]);

  const refresh = useCallback(() => {
    const now = new Date();
    if (lastRefresh && now.getTime() - lastRefresh.getTime() < 10 * 60 * 1000) {
      // Rate limit: 10 minutes minimum entre les refresh
      return;
    }
    fetchData();
  }, [fetchData, lastRefresh]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    refresh,
    lastRefresh,
    canRefresh: !lastRefresh || new Date().getTime() - lastRefresh.getTime() >= 10 * 60 * 1000
  };
}
