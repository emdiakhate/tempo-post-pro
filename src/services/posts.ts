/**
 * Service pour la gestion des posts
 * Utilise StorageService pour la persistance
 */

import { StorageService } from './storage';
import { Post } from '@/types/Post';

export interface PostFilters {
  status?: string[];
  platforms?: string[];
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface PostStats {
  total: number;
  published: number;
  scheduled: number;
  draft: number;
  pending: number;
  rejected: number;
  failed: number;
}

export class PostsService {
  private static readonly STORAGE_KEY = 'posts';
  private static readonly STATS_KEY = 'posts_stats';

  /**
   * Récupérer tous les posts
   */
  static async getAllPosts(): Promise<Post[]> {
    const result = await StorageService.load<Post[]>(this.STORAGE_KEY, []);
    return result.data || [];
  }

  /**
   * Récupérer un post par ID
   */
  static async getPostById(id: string): Promise<Post | null> {
    const posts = await this.getAllPosts();
    return posts.find(post => post.id === id) || null;
  }

  /**
   * Sauvegarder un post
   */
  static async savePost(post: Post): Promise<boolean> {
    try {
      const posts = await this.getAllPosts();
      const existingIndex = posts.findIndex(p => p.id === post.id);
      
      if (existingIndex >= 0) {
        posts[existingIndex] = post;
      } else {
        posts.push(post);
      }
      
      const result = await StorageService.save(this.STORAGE_KEY, posts);
      
      if (result.success) {
        await this.updateStats();
      }
      
      return result.success;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du post:', error);
      return false;
    }
  }

  /**
   * Supprimer un post
   */
  static async deletePost(id: string): Promise<boolean> {
    try {
      const posts = await this.getAllPosts();
      const filteredPosts = posts.filter(post => post.id !== id);
      
      const result = await StorageService.save(this.STORAGE_KEY, filteredPosts);
      
      if (result.success) {
        await this.updateStats();
      }
      
      return result.success;
    } catch (error) {
      console.error('Erreur lors de la suppression du post:', error);
      return false;
    }
  }

  /**
   * Filtrer les posts
   */
  static async getFilteredPosts(filters: PostFilters): Promise<Post[]> {
    const posts = await this.getAllPosts();
    
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
  }

  /**
   * Récupérer les posts par statut
   */
  static async getPostsByStatus(status: string): Promise<Post[]> {
    return this.getFilteredPosts({ status: [status] });
  }

  /**
   * Récupérer les posts par plateforme
   */
  static async getPostsByPlatform(platform: string): Promise<Post[]> {
    return this.getFilteredPosts({ platforms: [platform] });
  }

  /**
   * Récupérer les posts programmés pour une date
   */
  static async getScheduledPostsForDate(date: Date): Promise<Post[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.getFilteredPosts({
      status: ['scheduled'],
      dateFrom: startOfDay,
      dateTo: endOfDay
    });
  }

  /**
   * Récupérer les posts en attente d'approbation
   */
  static async getPendingPosts(): Promise<Post[]> {
    return this.getFilteredPosts({ status: ['pending'] });
  }

  /**
   * Publier un post (changer le statut)
   */
  static async publishPost(id: string): Promise<boolean> {
    const post = await this.getPostById(id);
    if (!post) return false;
    
    post.status = 'published';
    post.publishedAt = new Date();
    
    return this.savePost(post);
  }

  /**
   * Approuver un post en attente
   */
  static async approvePost(id: string): Promise<boolean> {
    const post = await this.getPostById(id);
    if (!post || post.status !== 'pending') return false;
    
    post.status = 'scheduled';
    post.approvedAt = new Date();
    post.approvedBy = 'current_user'; // TODO: Récupérer l'utilisateur actuel
    
    return this.savePost(post);
  }

  /**
   * Rejeter un post en attente
   */
  static async rejectPost(id: string, reason?: string): Promise<boolean> {
    const post = await this.getPostById(id);
    if (!post || post.status !== 'pending') return false;
    
    post.status = 'rejected';
    post.rejectedAt = new Date();
    post.rejectedBy = 'current_user'; // TODO: Récupérer l'utilisateur actuel
    post.rejectionReason = reason;
    
    return this.savePost(post);
  }

  /**
   * Dupliquer un post
   */
  static async duplicatePost(id: string): Promise<Post | null> {
    const originalPost = await this.getPostById(id);
    if (!originalPost) return null;
    
    const duplicatedPost: Post = {
      ...originalPost,
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      createdAt: new Date(),
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Demain
      publishedAt: undefined,
      approvedAt: undefined,
      approvedBy: undefined,
      rejectedAt: undefined,
      rejectedBy: undefined,
      rejectionReason: undefined
    };
    
    const saved = await this.savePost(duplicatedPost);
    return saved ? duplicatedPost : null;
  }

  /**
   * Mettre à jour les statistiques
   */
  private static async updateStats(): Promise<void> {
    try {
      const posts = await this.getAllPosts();
      
      const stats: PostStats = {
        total: posts.length,
        published: posts.filter(p => p.status === 'published').length,
        scheduled: posts.filter(p => p.status === 'scheduled').length,
        draft: posts.filter(p => p.status === 'draft').length,
        pending: posts.filter(p => p.status === 'pending').length,
        rejected: posts.filter(p => p.status === 'rejected').length,
        failed: posts.filter(p => p.status === 'failed').length
      };
      
      await StorageService.save(this.STATS_KEY, stats);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
    }
  }

  /**
   * Récupérer les statistiques
   */
  static async getStats(): Promise<PostStats> {
    const result = await StorageService.load<PostStats>(this.STATS_KEY);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    // Recalculer si pas de stats sauvegardées
    await this.updateStats();
    const newResult = await StorageService.load<PostStats>(this.STATS_KEY);
    return newResult.data || {
      total: 0,
      published: 0,
      scheduled: 0,
      draft: 0,
      pending: 0,
      rejected: 0,
      failed: 0
    };
  }

  /**
   * Exporter les posts en JSON
   */
  static async exportPosts(): Promise<string> {
    const posts = await this.getAllPosts();
    return JSON.stringify(posts, null, 2);
  }

  /**
   * Importer des posts depuis JSON
   */
  static async importPosts(jsonData: string): Promise<boolean> {
    try {
      const importedPosts = JSON.parse(jsonData);
      
      if (!Array.isArray(importedPosts)) {
        throw new Error('Format de données invalide');
      }
      
      // Valider la structure des posts
      for (const post of importedPosts) {
        if (!post.id || !post.content || !post.platforms) {
          throw new Error('Structure de post invalide');
        }
      }
      
      const result = await StorageService.save(this.STORAGE_KEY, importedPosts);
      
      if (result.success) {
        await this.updateStats();
      }
      
      return result.success;
    } catch (error) {
      console.error('Erreur lors de l\'import des posts:', error);
      return false;
    }
  }
}

export default PostsService;
