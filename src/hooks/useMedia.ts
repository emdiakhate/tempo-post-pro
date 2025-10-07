/**
 * Hook personnalisé pour la gestion des médias
 * Centralise la logique métier des médias avec les services
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { StorageService } from '@/services';

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: number;
  createdAt: Date;
  tags?: string[];
  description?: string;
  isAIGenerated?: boolean;
  source?: 'upload' | 'ai' | 'import';
}

export interface MediaFilters {
  type?: 'image' | 'video';
  tags?: string[];
  source?: 'upload' | 'ai' | 'import';
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface MediaStats {
  total: number;
  images: number;
  videos: number;
  totalSize: number;
  bySource: {
    upload: number;
    ai: number;
    import: number;
  };
}

export interface UseMediaOptions {
  autoLoad?: boolean;
  initialFilters?: MediaFilters;
}

export interface UseMediaReturn {
  // État
  media: MediaItem[];
  loading: boolean;
  error: string | null;
  stats: MediaStats | null;
  
  // Actions
  loadMedia: () => Promise<void>;
  saveMedia: (media: MediaItem) => Promise<boolean>;
  deleteMedia: (id: string) => Promise<boolean>;
  updateMedia: (id: string, updates: Partial<MediaItem>) => Promise<boolean>;
  
  // Upload
  uploadFile: (file: File, metadata?: Partial<MediaItem>) => Promise<MediaItem | null>;
  uploadFiles: (files: File[], metadata?: Partial<MediaItem>) => Promise<MediaItem[]>;
  
  // Filtrage
  setFilters: (filters: MediaFilters) => void;
  clearFilters: () => void;
  filteredMedia: MediaItem[];
  
  // Utilitaires
  getMediaById: (id: string) => MediaItem | null;
  getMediaByType: (type: 'image' | 'video') => MediaItem[];
  getMediaBySource: (source: 'upload' | 'ai' | 'import') => MediaItem[];
  searchMedia: (query: string) => MediaItem[];
  refreshStats: () => Promise<void>;
  exportMedia: () => Promise<string>;
  importMedia: (jsonData: string) => Promise<boolean>;
}

export const useMedia = (options: UseMediaOptions = {}): UseMediaReturn => {
  const { autoLoad = true, initialFilters = {} } = options;
  
  // État principal
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [filters, setFilters] = useState<MediaFilters>(initialFilters);

  // Charger tous les médias
  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await StorageService.load<MediaItem[]>('media', []);
      const allMedia = result.data || [];
      setMedia(allMedia);
      
      // Calculer les statistiques
      await calculateStats(allMedia);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des médias');
      console.error('Erreur useMedia.loadMedia:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculer les statistiques
  const calculateStats = useCallback(async (mediaList: MediaItem[]) => {
    try {
      const stats: MediaStats = {
        total: mediaList.length,
        images: mediaList.filter(m => m.type === 'image').length,
        videos: mediaList.filter(m => m.type === 'video').length,
        totalSize: mediaList.reduce((sum, m) => sum + m.size, 0),
        bySource: {
          upload: mediaList.filter(m => m.source === 'upload').length,
          ai: mediaList.filter(m => m.source === 'ai').length,
          import: mediaList.filter(m => m.source === 'import').length
        }
      };
      
      setStats(stats);
    } catch (err) {
      console.error('Erreur useMedia.calculateStats:', err);
    }
  }, []);

  // Sauvegarder un média
  const saveMedia = useCallback(async (mediaItem: MediaItem): Promise<boolean> => {
    try {
      setError(null);
      const result = await StorageService.load<MediaItem[]>('media', []);
      const mediaList = result.data || [];
      
      const existingIndex = mediaList.findIndex(m => m.id === mediaItem.id);
      
      if (existingIndex >= 0) {
        mediaList[existingIndex] = mediaItem;
      } else {
        mediaList.push(mediaItem);
      }
      
      const saveResult = await StorageService.save('media', mediaList);
      
      if (saveResult.success) {
        setMedia(mediaList);
        await calculateStats(mediaList);
      }
      
      return saveResult.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      console.error('Erreur useMedia.saveMedia:', err);
      return false;
    }
  }, [calculateStats]);

  // Supprimer un média
  const deleteMedia = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await StorageService.load<MediaItem[]>('media', []);
      const mediaList = result.data || [];
      
      const filteredMedia = mediaList.filter(m => m.id !== id);
      const saveResult = await StorageService.save('media', filteredMedia);
      
      if (saveResult.success) {
        setMedia(filteredMedia);
        await calculateStats(filteredMedia);
      }
      
      return saveResult.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      console.error('Erreur useMedia.deleteMedia:', err);
      return false;
    }
  }, [calculateStats]);

  // Mettre à jour un média
  const updateMedia = useCallback(async (id: string, updates: Partial<MediaItem>): Promise<boolean> => {
    try {
      setError(null);
      const result = await StorageService.load<MediaItem[]>('media', []);
      const mediaList = result.data || [];
      
      const existingIndex = mediaList.findIndex(m => m.id === id);
      
      if (existingIndex >= 0) {
        mediaList[existingIndex] = { ...mediaList[existingIndex], ...updates };
        
        const saveResult = await StorageService.save('media', mediaList);
        
        if (saveResult.success) {
          setMedia(mediaList);
          await calculateStats(mediaList);
        }
        
        return saveResult.success;
      }
      
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      console.error('Erreur useMedia.updateMedia:', err);
      return false;
    }
  }, [calculateStats]);

  // Uploader un fichier
  const uploadFile = useCallback(async (file: File, metadata?: Partial<MediaItem>): Promise<MediaItem | null> => {
    try {
      setError(null);
      
      // Créer l'URL du fichier
      const url = URL.createObjectURL(file);
      
      // Déterminer le type
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      // Créer l'objet média
      const mediaItem: MediaItem = {
        id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type,
        url,
        size: file.size,
        createdAt: new Date(),
        source: 'upload',
        ...metadata
      };
      
      const success = await saveMedia(mediaItem);
      return success ? mediaItem : null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
      console.error('Erreur useMedia.uploadFile:', err);
      return null;
    }
  }, [saveMedia]);

  // Uploader plusieurs fichiers
  const uploadFiles = useCallback(async (files: File[], metadata?: Partial<MediaItem>): Promise<MediaItem[]> => {
    try {
      setError(null);
      const uploadedMedia: MediaItem[] = [];
      
      for (const file of files) {
        const mediaItem = await uploadFile(file, metadata);
        if (mediaItem) {
          uploadedMedia.push(mediaItem);
        }
      }
      
      return uploadedMedia;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload multiple');
      console.error('Erreur useMedia.uploadFiles:', err);
      return [];
    }
  }, [uploadFile]);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: MediaFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Effacer les filtres
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Actualiser les statistiques
  const refreshStats = useCallback(async () => {
    await calculateStats(media);
  }, [media, calculateStats]);

  // Obtenir un média par ID
  const getMediaById = useCallback((id: string): MediaItem | null => {
    return media.find(m => m.id === id) || null;
  }, [media]);

  // Obtenir les médias par type
  const getMediaByType = useCallback((type: 'image' | 'video'): MediaItem[] => {
    return media.filter(m => m.type === type);
  }, [media]);

  // Obtenir les médias par source
  const getMediaBySource = useCallback((source: 'upload' | 'ai' | 'import'): MediaItem[] => {
    return media.filter(m => m.source === source);
  }, [media]);

  // Rechercher des médias
  const searchMedia = useCallback((query: string): MediaItem[] => {
    const searchLower = query.toLowerCase();
    return media.filter(m => 
      m.name.toLowerCase().includes(searchLower) ||
      m.description?.toLowerCase().includes(searchLower) ||
      m.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }, [media]);

  // Exporter les médias
  const exportMedia = useCallback(async (): Promise<string> => {
    try {
      return JSON.stringify(media, null, 2);
    } catch (err) {
      console.error('Erreur useMedia.exportMedia:', err);
      return '';
    }
  }, [media]);

  // Importer les médias
  const importMedia = useCallback(async (jsonData: string): Promise<boolean> => {
    try {
      const importedMedia = JSON.parse(jsonData);
      
      if (!Array.isArray(importedMedia)) {
        throw new Error('Format de données invalide');
      }
      
      const result = await StorageService.save('media', importedMedia);
      
      if (result.success) {
        setMedia(importedMedia);
        await calculateStats(importedMedia);
      }
      
      return result.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import');
      console.error('Erreur useMedia.importMedia:', err);
      return false;
    }
  }, [calculateStats]);

  // Médias filtrés (calculé)
  const filteredMedia = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return media;
    }

    return media.filter(mediaItem => {
      // Filtre par type
      if (filters.type && mediaItem.type !== filters.type) return false;
      
      // Filtre par source
      if (filters.source && mediaItem.source !== filters.source) return false;
      
      // Filtre par tags
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = mediaItem.tags?.some(tag => 
          filters.tags!.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }
      
      // Filtre par date
      if (filters.dateFrom) {
        if (mediaItem.createdAt < filters.dateFrom) return false;
      }
      
      if (filters.dateTo) {
        if (mediaItem.createdAt > filters.dateTo) return false;
      }
      
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = mediaItem.name.toLowerCase().includes(searchLower);
        const matchesDescription = mediaItem.description?.toLowerCase().includes(searchLower);
        const matchesTags = mediaItem.tags?.some(tag => 
          tag.toLowerCase().includes(searchLower)
        );
        
        if (!matchesName && !matchesDescription && !matchesTags) return false;
      }
      
      return true;
    });
  }, [media, filters]);

  // Chargement automatique
  useEffect(() => {
    if (autoLoad) {
      loadMedia();
    }
  }, [autoLoad, loadMedia]);

  return {
    // État
    media,
    loading,
    error,
    stats,
    
    // Actions
    loadMedia,
    saveMedia,
    deleteMedia,
    updateMedia,
    
    // Upload
    uploadFile,
    uploadFiles,
    
    // Filtrage
    setFilters: updateFilters,
    clearFilters,
    filteredMedia,
    
    // Utilitaires
    getMediaById,
    getMediaByType,
    getMediaBySource,
    searchMedia,
    refreshStats,
    exportMedia,
    importMedia
  };
};

export default useMedia;
