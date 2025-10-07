/**
 * Hook personnalisé pour la gestion des posts
 * Centralise la logique métier des posts avec les services
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PostsService, PostFilters, PostStats } from '@/services';
import { Post } from '@/types/Post';

export interface UsePostsOptions {
  autoLoad?: boolean;
  initialFilters?: PostFilters;
}

export interface UsePostsReturn {
  // État
  posts: Post[];
  loading: boolean;
  error: string | null;
  stats: PostStats | null;
  
  // Actions
  loadPosts: () => Promise<void>;
  savePost: (post: Post) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  duplicatePost: (id: string) => Promise<Post | null>;
  publishPost: (id: string) => Promise<boolean>;
  approvePost: (id: string) => Promise<boolean>;
  rejectPost: (id: string, reason?: string) => Promise<boolean>;
  
  // Filtrage
  setFilters: (filters: PostFilters) => void;
  clearFilters: () => void;
  filteredPosts: Post[];
  
  // Utilitaires
  getPostById: (id: string) => Post | null;
  getPostsByStatus: (status: string) => Post[];
  getPostsByPlatform: (platform: string) => Post[];
  refreshStats: () => Promise<void>;
}

export const usePosts = (options: UsePostsOptions = {}): UsePostsReturn => {
  const { autoLoad = true, initialFilters = {} } = options;
  
  // État principal
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PostStats | null>(null);
  const [filters, setFilters] = useState<PostFilters>(initialFilters);

  // Charger tous les posts
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allPosts = await PostsService.getAllPosts();
      setPosts(allPosts);
      
      // Charger les statistiques
      const postStats = await PostsService.getStats();
      setStats(postStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des posts');
      console.error('Erreur usePosts.loadPosts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sauvegarder un post
  const savePost = useCallback(async (post: Post): Promise<boolean> => {
    try {
      setError(null);
      const success = await PostsService.savePost(post);
      
      if (success) {
        await loadPosts(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      console.error('Erreur usePosts.savePost:', err);
      return false;
    }
  }, [loadPosts]);

  // Supprimer un post
  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await PostsService.deletePost(id);
      
      if (success) {
        setPosts(prev => prev.filter(post => post.id !== id));
        await refreshStats();
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      console.error('Erreur usePosts.deletePost:', err);
      return false;
    }
  }, []);

  // Dupliquer un post
  const duplicatePost = useCallback(async (id: string): Promise<Post | null> => {
    try {
      setError(null);
      const duplicated = await PostsService.duplicatePost(id);
      
      if (duplicated) {
        await loadPosts(); // Recharger la liste
      }
      
      return duplicated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la duplication');
      console.error('Erreur usePosts.duplicatePost:', err);
      return null;
    }
  }, [loadPosts]);

  // Publier un post
  const publishPost = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await PostsService.publishPost(id);
      
      if (success) {
        await loadPosts(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la publication');
      console.error('Erreur usePosts.publishPost:', err);
      return false;
    }
  }, [loadPosts]);

  // Approuver un post
  const approvePost = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await PostsService.approvePost(id);
      
      if (success) {
        await loadPosts(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'approbation');
      console.error('Erreur usePosts.approvePost:', err);
      return false;
    }
  }, [loadPosts]);

  // Rejeter un post
  const rejectPost = useCallback(async (id: string, reason?: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await PostsService.rejectPost(id, reason);
      
      if (success) {
        await loadPosts(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du rejet');
      console.error('Erreur usePosts.rejectPost:', err);
      return false;
    }
  }, [loadPosts]);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: PostFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Effacer les filtres
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Actualiser les statistiques
  const refreshStats = useCallback(async () => {
    try {
      const postStats = await PostsService.getStats();
      setStats(postStats);
    } catch (err) {
      console.error('Erreur usePosts.refreshStats:', err);
    }
  }, []);

  // Obtenir un post par ID
  const getPostById = useCallback((id: string): Post | null => {
    return posts.find(post => post.id === id) || null;
  }, [posts]);

  // Obtenir les posts par statut
  const getPostsByStatus = useCallback((status: string): Post[] => {
    return posts.filter(post => post.status === status);
  }, [posts]);

  // Obtenir les posts par plateforme
  const getPostsByPlatform = useCallback((platform: string): Post[] => {
    return posts.filter(post => post.platforms.includes(platform as any));
  }, [posts]);

  // Posts filtrés (calculé)
  const filteredPosts = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return posts;
    }

    return posts.filter(post => {
      // Filtre par statut
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(post.status)) return false;
      }
      
      // Filtre par plateformes
      if (filters.platforms && filters.platforms.length > 0) {
        const hasMatchingPlatform = post.platforms.some(platform => 
          filters.platforms!.includes(platform)
        );
        if (!hasMatchingPlatform) return false;
      }
      
      // Filtre par auteur
      if (filters.author) {
        if (post.author !== filters.author) return false;
      }
      
      // Filtre par date
      if (filters.dateFrom) {
        const postDate = new Date(post.scheduledTime);
        if (postDate < filters.dateFrom) return false;
      }
      
      if (filters.dateTo) {
        const postDate = new Date(post.scheduledTime);
        if (postDate > filters.dateTo) return false;
      }
      
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesContent = post.content.toLowerCase().includes(searchLower);
        const matchesCaption = post.caption?.toLowerCase().includes(searchLower);
        const matchesHashtags = post.hashtags?.some(tag => 
          tag.toLowerCase().includes(searchLower)
        );
        
        if (!matchesContent && !matchesCaption && !matchesHashtags) return false;
      }
      
      return true;
    });
  }, [posts, filters]);

  // Chargement automatique
  useEffect(() => {
    if (autoLoad) {
      loadPosts();
    }
  }, [autoLoad, loadPosts]);

  return {
    // État
    posts,
    loading,
    error,
    stats,
    
    // Actions
    loadPosts,
    savePost,
    deletePost,
    duplicatePost,
    publishPost,
    approvePost,
    rejectPost,
    
    // Filtrage
    setFilters: updateFilters,
    clearFilters,
    filteredPosts,
    
    // Utilitaires
    getPostById,
    getPostsByStatus,
    getPostsByPlatform,
    refreshStats
  };
};

export default usePosts;
