/**
 * Hook personnalisé pour la gestion des comptes sociaux
 * Centralise la logique métier des comptes sociaux avec les services
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { SocialAccountsService, SocialAccountFilters, SocialAccountStats } from '@/services';
import { SocialAccount, SocialPlatform, ConnectionStatus } from '@/types/socialAccount';

export interface UseSocialAccountsOptions {
  autoLoad?: boolean;
  initialFilters?: SocialAccountFilters;
}

export interface UseSocialAccountsReturn {
  // État
  accounts: SocialAccount[];
  loading: boolean;
  error: string | null;
  stats: SocialAccountStats | null;
  
  // Actions
  loadAccounts: () => Promise<void>;
  saveAccount: (account: SocialAccount) => Promise<boolean>;
  deleteAccount: (id: string) => Promise<boolean>;
  connectAccount: (account: Omit<SocialAccount, 'id' | 'connectedAt' | 'lastSync'>) => Promise<SocialAccount | null>;
  disconnectAccount: (id: string) => Promise<boolean>;
  updateConnectionStatus: (id: string, status: ConnectionStatus) => Promise<boolean>;
  syncAccount: (id: string) => Promise<boolean>;
  syncAllAccounts: () => Promise<{ success: number; failed: number }>;
  renameAccount: (id: string, newDisplayName: string) => Promise<boolean>;
  
  // Filtrage
  setFilters: (filters: SocialAccountFilters) => void;
  clearFilters: () => void;
  filteredAccounts: SocialAccount[];
  
  // Utilitaires
  getAccountById: (id: string) => SocialAccount | null;
  getAccountsByPlatform: (platform: SocialPlatform) => SocialAccount[];
  getConnectedAccounts: () => SocialAccount[];
  hasConnectedAccountsForPlatform: (platform: SocialPlatform) => Promise<boolean>;
  refreshStats: () => Promise<void>;
}

export const useSocialAccounts = (options: UseSocialAccountsOptions = {}): UseSocialAccountsReturn => {
  const { autoLoad = true, initialFilters = {} } = options;
  
  // État principal
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SocialAccountStats | null>(null);
  const [filters, setFilters] = useState<SocialAccountFilters>(initialFilters);

  // Charger tous les comptes
  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allAccounts = await SocialAccountsService.getAllAccounts();
      setAccounts(allAccounts);
      
      // Charger les statistiques
      const accountStats = await SocialAccountsService.getStats();
      setStats(accountStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des comptes');
      console.error('Erreur useSocialAccounts.loadAccounts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sauvegarder un compte
  const saveAccount = useCallback(async (account: SocialAccount): Promise<boolean> => {
    try {
      setError(null);
      const success = await SocialAccountsService.saveAccount(account);
      
      if (success) {
        await loadAccounts(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      console.error('Erreur useSocialAccounts.saveAccount:', err);
      return false;
    }
  }, [loadAccounts]);

  // Supprimer un compte
  const deleteAccount = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await SocialAccountsService.deleteAccount(id);
      
      if (success) {
        setAccounts(prev => prev.filter(account => account.id !== id));
        await refreshStats();
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      console.error('Erreur useSocialAccounts.deleteAccount:', err);
      return false;
    }
  }, []);

  // Connecter un compte
  const connectAccount = useCallback(async (account: Omit<SocialAccount, 'id' | 'connectedAt' | 'lastSync'>): Promise<SocialAccount | null> => {
    try {
      setError(null);
      const newAccount = await SocialAccountsService.connectAccount(account);
      
      if (newAccount) {
        await loadAccounts(); // Recharger la liste
      }
      
      return newAccount;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la connexion');
      console.error('Erreur useSocialAccounts.connectAccount:', err);
      return null;
    }
  }, [loadAccounts]);

  // Déconnecter un compte
  const disconnectAccount = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await SocialAccountsService.disconnectAccount(id);
      
      if (success) {
        await loadAccounts(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la déconnexion');
      console.error('Erreur useSocialAccounts.disconnectAccount:', err);
      return false;
    }
  }, [loadAccounts]);

  // Mettre à jour le statut de connexion
  const updateConnectionStatus = useCallback(async (id: string, status: ConnectionStatus): Promise<boolean> => {
    try {
      setError(null);
      const success = await SocialAccountsService.updateConnectionStatus(id, status);
      
      if (success) {
        await loadAccounts(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut');
      console.error('Erreur useSocialAccounts.updateConnectionStatus:', err);
      return false;
    }
  }, [loadAccounts]);

  // Synchroniser un compte
  const syncAccount = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await SocialAccountsService.syncAccount(id);
      
      if (success) {
        await loadAccounts(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la synchronisation');
      console.error('Erreur useSocialAccounts.syncAccount:', err);
      return false;
    }
  }, [loadAccounts]);

  // Synchroniser tous les comptes
  const syncAllAccounts = useCallback(async (): Promise<{ success: number; failed: number }> => {
    try {
      setError(null);
      const result = await SocialAccountsService.syncAllAccounts();
      
      if (result.success > 0 || result.failed > 0) {
        await loadAccounts(); // Recharger la liste
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la synchronisation globale');
      console.error('Erreur useSocialAccounts.syncAllAccounts:', err);
      return { success: 0, failed: 0 };
    }
  }, [loadAccounts]);

  // Renommer un compte
  const renameAccount = useCallback(async (id: string, newDisplayName: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await SocialAccountsService.renameAccount(id, newDisplayName);
      
      if (success) {
        await loadAccounts(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du renommage');
      console.error('Erreur useSocialAccounts.renameAccount:', err);
      return false;
    }
  }, [loadAccounts]);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: SocialAccountFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Effacer les filtres
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Actualiser les statistiques
  const refreshStats = useCallback(async () => {
    try {
      const accountStats = await SocialAccountsService.getStats();
      setStats(accountStats);
    } catch (err) {
      console.error('Erreur useSocialAccounts.refreshStats:', err);
    }
  }, []);

  // Obtenir un compte par ID
  const getAccountById = useCallback((id: string): SocialAccount | null => {
    return accounts.find(account => account.id === id) || null;
  }, [accounts]);

  // Obtenir les comptes par plateforme
  const getAccountsByPlatform = useCallback((platform: SocialPlatform): SocialAccount[] => {
    return accounts.filter(account => account.platform === platform);
  }, [accounts]);

  // Obtenir les comptes connectés
  const getConnectedAccounts = useCallback((): SocialAccount[] => {
    return accounts.filter(account => account.status === 'connected');
  }, [accounts]);

  // Vérifier si une plateforme a des comptes connectés
  const hasConnectedAccountsForPlatform = useCallback(async (platform: SocialPlatform): Promise<boolean> => {
    try {
      return await SocialAccountsService.hasConnectedAccountsForPlatform(platform);
    } catch (err) {
      console.error('Erreur useSocialAccounts.hasConnectedAccountsForPlatform:', err);
      return false;
    }
  }, []);

  // Comptes filtrés (calculé)
  const filteredAccounts = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return accounts;
    }

    return accounts.filter(account => {
      // Filtre par plateforme
      if (filters.platform && filters.platform.length > 0) {
        if (!filters.platform.includes(account.platform)) return false;
      }
      
      // Filtre par statut de connexion
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(account.status as unknown as ConnectionStatus)) return false;
      }
      
      // Filtre par statut actif
      if (filters.isActive !== undefined) {
        if (account.status === 'connected' !== filters.isActive) return false;
      }
      
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesUsername = account.username.toLowerCase().includes(searchLower);
        const matchesDisplayName = account.displayName?.toLowerCase().includes(searchLower);
        
        if (!matchesUsername && !matchesDisplayName) return false;
      }
      
      return true;
    });
  }, [accounts, filters]);

  // Chargement automatique
  useEffect(() => {
    if (autoLoad) {
      loadAccounts();
    }
  }, [autoLoad, loadAccounts]);

  return {
    // État
    accounts,
    loading,
    error,
    stats,
    
    // Actions
    loadAccounts,
    saveAccount,
    deleteAccount,
    connectAccount,
    disconnectAccount,
    updateConnectionStatus,
    syncAccount,
    syncAllAccounts,
    renameAccount,
    
    // Filtrage
    setFilters: updateFilters,
    clearFilters,
    filteredAccounts,
    
    // Utilitaires
    getAccountById,
    getAccountsByPlatform,
    getConnectedAccounts,
    hasConnectedAccountsForPlatform,
    refreshStats
  };
};

export default useSocialAccounts;
