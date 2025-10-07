/**
 * Hook personnalisé pour la gestion des notifications
 * Centralise la logique des notifications système
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { StorageService } from '@/services';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

export interface NotificationFilters {
  type?: NotificationType[];
  read?: boolean;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    info: number;
    success: number;
    warning: number;
    error: number;
  };
}

export interface UseNotificationsOptions {
  autoLoad?: boolean;
  maxNotifications?: number;
  autoMarkAsRead?: boolean;
  markAsReadDelay?: number; // en millisecondes
}

export interface UseNotificationsReturn {
  // État
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  stats: NotificationStats | null;
  
  // Actions
  loadNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  removeNotification: (id: string) => Promise<boolean>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  clearAll: () => Promise<boolean>;
  
  // Filtrage
  setFilters: (filters: NotificationFilters) => void;
  clearFilters: () => void;
  filteredNotifications: Notification[];
  
  // Utilitaires
  getNotificationById: (id: string) => Notification | null;
  getUnreadCount: () => number;
  refreshStats: () => Promise<void>;
  exportNotifications: () => Promise<string>;
  importNotifications: (jsonData: string) => Promise<boolean>;
}

export const useNotifications = (options: UseNotificationsOptions = {}): UseNotificationsReturn => {
  const { 
    autoLoad = true, 
    maxNotifications = 100,
    autoMarkAsRead = false,
    markAsReadDelay = 5000
  } = options;
  
  // État principal
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>({});

  // Charger toutes les notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await StorageService.load<Notification[]>('notifications', []);
      const allNotifications = result.data || [];
      
      // Limiter le nombre de notifications
      const limitedNotifications = allNotifications
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, maxNotifications);
      
      setNotifications(limitedNotifications);
      
      // Calculer les statistiques
      await calculateStats(limitedNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des notifications');
      console.error('Erreur useNotifications.loadNotifications:', err);
    } finally {
      setLoading(false);
    }
  }, [maxNotifications]);

  // Calculer les statistiques
  const calculateStats = useCallback(async (notificationList: Notification[]) => {
    try {
      const stats: NotificationStats = {
        total: notificationList.length,
        unread: notificationList.filter(n => !n.read).length,
        byType: {
          info: notificationList.filter(n => n.type === 'info').length,
          success: notificationList.filter(n => n.type === 'success').length,
          warning: notificationList.filter(n => n.type === 'warning').length,
          error: notificationList.filter(n => n.type === 'error').length
        }
      };
      
      setStats(stats);
    } catch (err) {
      console.error('Erreur useNotifications.calculateStats:', err);
    }
  }, []);

  // Sauvegarder les notifications
  const saveNotifications = useCallback(async (notificationList: Notification[]): Promise<boolean> => {
    try {
      const result = await StorageService.save('notifications', notificationList);
      return result.success;
    } catch (err) {
      console.error('Erreur useNotifications.saveNotifications:', err);
      return false;
    }
  }, []);

  // Ajouter une notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, maxNotifications);
      saveNotifications(updated);
      return updated;
    });
    
    // Marquer automatiquement comme lu si configuré
    if (autoMarkAsRead && !newNotification.persistent) {
      setTimeout(() => {
        markAsRead(newNotification.id);
      }, markAsReadDelay);
    }
    
    return newNotification.id;
  }, [maxNotifications, autoMarkAsRead, markAsReadDelay]);

  // Supprimer une notification
  const removeNotification = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const updatedNotifications = notifications.filter(n => n.id !== id);
      
      const success = await saveNotifications(updatedNotifications);
      
      if (success) {
        setNotifications(updatedNotifications);
        await calculateStats(updatedNotifications);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      console.error('Erreur useNotifications.removeNotification:', err);
      return false;
    }
  }, [notifications, saveNotifications, calculateStats]);

  // Marquer comme lu
  const markAsRead = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const updatedNotifications = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      
      const success = await saveNotifications(updatedNotifications);
      
      if (success) {
        setNotifications(updatedNotifications);
        await calculateStats(updatedNotifications);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du marquage');
      console.error('Erreur useNotifications.markAsRead:', err);
      return false;
    }
  }, [notifications, saveNotifications, calculateStats]);

  // Marquer toutes comme lues
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      
      const success = await saveNotifications(updatedNotifications);
      
      if (success) {
        setNotifications(updatedNotifications);
        await calculateStats(updatedNotifications);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du marquage global');
      console.error('Erreur useNotifications.markAllAsRead:', err);
      return false;
    }
  }, [notifications, saveNotifications, calculateStats]);

  // Effacer toutes les notifications
  const clearAll = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const success = await saveNotifications([]);
      
      if (success) {
        setNotifications([]);
        await calculateStats([]);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'effacement');
      console.error('Erreur useNotifications.clearAll:', err);
      return false;
    }
  }, [saveNotifications, calculateStats]);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: NotificationFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Effacer les filtres
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Actualiser les statistiques
  const refreshStats = useCallback(async () => {
    await calculateStats(notifications);
  }, [notifications, calculateStats]);

  // Obtenir une notification par ID
  const getNotificationById = useCallback((id: string): Notification | null => {
    return notifications.find(n => n.id === id) || null;
  }, [notifications]);

  // Obtenir le nombre de notifications non lues
  const getUnreadCount = useCallback((): number => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Exporter les notifications
  const exportNotifications = useCallback(async (): Promise<string> => {
    try {
      return JSON.stringify(notifications, null, 2);
    } catch (err) {
      console.error('Erreur useNotifications.exportNotifications:', err);
      return '';
    }
  }, [notifications]);

  // Importer les notifications
  const importNotifications = useCallback(async (jsonData: string): Promise<boolean> => {
    try {
      const importedNotifications = JSON.parse(jsonData);
      
      if (!Array.isArray(importedNotifications)) {
        throw new Error('Format de données invalide');
      }
      
      const success = await saveNotifications(importedNotifications);
      
      if (success) {
        setNotifications(importedNotifications);
        await calculateStats(importedNotifications);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import');
      console.error('Erreur useNotifications.importNotifications:', err);
      return false;
    }
  }, [saveNotifications, calculateStats]);

  // Notifications filtrées (calculé)
  const filteredNotifications = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return notifications;
    }

    return notifications.filter(notification => {
      // Filtre par type
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(notification.type)) return false;
      }
      
      // Filtre par statut de lecture
      if (filters.read !== undefined) {
        if (notification.read !== filters.read) return false;
      }
      
      // Filtre par date
      if (filters.dateFrom) {
        if (notification.timestamp < filters.dateFrom) return false;
      }
      
      if (filters.dateTo) {
        if (notification.timestamp > filters.dateTo) return false;
      }
      
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = notification.title.toLowerCase().includes(searchLower);
        const matchesMessage = notification.message.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesMessage) return false;
      }
      
      return true;
    });
  }, [notifications, filters]);

  // Chargement automatique
  useEffect(() => {
    if (autoLoad) {
      loadNotifications();
    }
  }, [autoLoad, loadNotifications]);

  return {
    // État
    notifications,
    loading,
    error,
    stats,
    
    // Actions
    loadNotifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    
    // Filtrage
    setFilters: updateFilters,
    clearFilters,
    filteredNotifications,
    
    // Utilitaires
    getNotificationById,
    getUnreadCount,
    refreshStats,
    exportNotifications,
    importNotifications
  };
};

export default useNotifications;
