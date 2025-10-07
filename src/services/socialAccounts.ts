/**
 * Service pour la gestion des comptes sociaux
 * Utilise StorageService pour la persistance
 */

import { StorageService } from './storage';
import { SocialAccount, SocialPlatform, ConnectionStatus } from '@/types/socialAccount';

export interface SocialAccountFilters {
  platform?: SocialPlatform[];
  status?: ConnectionStatus[];
  isActive?: boolean;
  search?: string;
}

export interface SocialAccountStats {
  total: number;
  connected: number;
  disconnected: number;
  byPlatform: Record<SocialPlatform, number>;
  lastSync: Date | null;
}

export class SocialAccountsService {
  private static readonly ACCOUNTS_KEY = 'social_accounts';
  private static readonly STATS_KEY = 'social_accounts_stats';

  /**
   * Récupérer tous les comptes sociaux
   */
  static async getAllAccounts(): Promise<SocialAccount[]> {
    const result = await StorageService.load<SocialAccount[]>(this.ACCOUNTS_KEY, []);
    return result.data || [];
  }

  /**
   * Récupérer un compte par ID
   */
  static async getAccountById(id: string): Promise<SocialAccount | null> {
    const accounts = await this.getAllAccounts();
    return accounts.find(account => account.id === id) || null;
  }

  /**
   * Récupérer les comptes par plateforme
   */
  static async getAccountsByPlatform(platform: SocialPlatform): Promise<SocialAccount[]> {
    const accounts = await this.getAllAccounts();
    return accounts.filter(account => account.platform === platform);
  }

  /**
   * Sauvegarder un compte
   */
  static async saveAccount(account: SocialAccount): Promise<boolean> {
    try {
      const accounts = await this.getAllAccounts();
      const existingIndex = accounts.findIndex(a => a.id === account.id);
      
      if (existingIndex >= 0) {
        accounts[existingIndex] = account;
      } else {
        accounts.push(account);
      }
      
      const result = await StorageService.save(this.ACCOUNTS_KEY, accounts);
      
      if (result.success) {
        await this.updateStats();
      }
      
      return result.success;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du compte:', error);
      return false;
    }
  }

  /**
   * Supprimer un compte
   */
  static async deleteAccount(id: string): Promise<boolean> {
    try {
      const accounts = await this.getAllAccounts();
      const filteredAccounts = accounts.filter(account => account.id !== id);
      
      const result = await StorageService.save(this.ACCOUNTS_KEY, filteredAccounts);
      
      if (result.success) {
        await this.updateStats();
      }
      
      return result.success;
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      return false;
    }
  }

  /**
   * Filtrer les comptes
   */
  static async getFilteredAccounts(filters: SocialAccountFilters): Promise<SocialAccount[]> {
    const accounts = await this.getAllAccounts();
    
    return accounts.filter(account => {
      // Filtre par plateforme
      if (filters.platform && filters.platform.length > 0) {
        if (!filters.platform.includes(account.platform)) return false;
      }
      
      // Filtre par statut de connexion
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(account.status)) return false;
      }
      
      // Filtre par statut actif
      if (filters.isActive !== undefined) {
        if (account.isActive !== filters.isActive) return false;
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
  }

  /**
   * Connecter un compte
   */
  static async connectAccount(account: Omit<SocialAccount, 'id' | 'connectedAt' | 'lastSync'>): Promise<SocialAccount | null> {
    try {
      const newAccount: SocialAccount = {
        ...account,
        id: `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'connected',
        connectedAt: new Date(),
        lastSync: new Date(),
        isActive: true
      };
      
      const saved = await this.saveAccount(newAccount);
      return saved ? newAccount : null;
    } catch (error) {
      console.error('Erreur lors de la connexion du compte:', error);
      return null;
    }
  }

  /**
   * Déconnecter un compte
   */
  static async disconnectAccount(id: string): Promise<boolean> {
    try {
      const account = await this.getAccountById(id);
      if (!account) return false;
      
      account.status = 'disconnected';
      account.disconnectedAt = new Date();
      account.isActive = false;
      
      return this.saveAccount(account);
    } catch (error) {
      console.error('Erreur lors de la déconnexion du compte:', error);
      return false;
    }
  }

  /**
   * Mettre à jour le statut de connexion
   */
  static async updateConnectionStatus(id: string, status: ConnectionStatus): Promise<boolean> {
    try {
      const account = await this.getAccountById(id);
      if (!account) return false;
      
      account.status = status;
      account.lastSync = new Date();
      
      if (status === 'connected') {
        account.connectedAt = new Date();
        account.isActive = true;
      } else if (status === 'disconnected') {
        account.disconnectedAt = new Date();
        account.isActive = false;
      }
      
      return this.saveAccount(account);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return false;
    }
  }

  /**
   * Synchroniser un compte
   */
  static async syncAccount(id: string): Promise<boolean> {
    try {
      const account = await this.getAccountById(id);
      if (!account || account.status !== 'connected') return false;
      
      // Simulation de la synchronisation
      account.lastSync = new Date();
      account.followersCount = Math.floor(Math.random() * 10000) + 1000; // Mock data
      account.followingCount = Math.floor(Math.random() * 1000) + 100;
      account.postsCount = Math.floor(Math.random() * 100) + 10;
      
      return this.saveAccount(account);
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      return false;
    }
  }

  /**
   * Synchroniser tous les comptes connectés
   */
  static async syncAllAccounts(): Promise<{ success: number; failed: number }> {
    try {
      const connectedAccounts = await this.getFilteredAccounts({ 
        status: ['connected'] 
      });
      
      let success = 0;
      let failed = 0;
      
      for (const account of connectedAccounts) {
        const synced = await this.syncAccount(account.id);
        if (synced) {
          success++;
        } else {
          failed++;
        }
      }
      
      return { success, failed };
    } catch (error) {
      console.error('Erreur lors de la synchronisation globale:', error);
      return { success: 0, failed: 0 };
    }
  }

  /**
   * Renommer un compte
   */
  static async renameAccount(id: string, newDisplayName: string): Promise<boolean> {
    try {
      const account = await this.getAccountById(id);
      if (!account) return false;
      
      account.displayName = newDisplayName;
      account.lastSync = new Date();
      
      return this.saveAccount(account);
    } catch (error) {
      console.error('Erreur lors du renommage:', error);
      return false;
    }
  }

  /**
   * Obtenir les comptes connectés
   */
  static async getConnectedAccounts(): Promise<SocialAccount[]> {
    return this.getFilteredAccounts({ status: ['connected'] });
  }

  /**
   * Obtenir les comptes par plateforme
   */
  static async getAccountsByPlatform(platform: SocialPlatform): Promise<SocialAccount[]> {
    return this.getFilteredAccounts({ platform: [platform] });
  }

  /**
   * Vérifier si une plateforme a des comptes connectés
   */
  static async hasConnectedAccountsForPlatform(platform: SocialPlatform): Promise<boolean> {
    const accounts = await this.getAccountsByPlatform(platform);
    return accounts.some(account => account.status === 'connected');
  }

  /**
   * Mettre à jour les statistiques
   */
  private static async updateStats(): Promise<void> {
    try {
      const accounts = await this.getAllAccounts();
      
      const stats: SocialAccountStats = {
        total: accounts.length,
        connected: accounts.filter(a => a.status === 'connected').length,
        disconnected: accounts.filter(a => a.status === 'disconnected').length,
        byPlatform: {
          instagram: accounts.filter(a => a.platform === 'instagram').length,
          facebook: accounts.filter(a => a.platform === 'facebook').length,
          twitter: accounts.filter(a => a.platform === 'twitter').length,
          linkedin: accounts.filter(a => a.platform === 'linkedin').length,
          youtube: accounts.filter(a => a.platform === 'youtube').length,
          tiktok: accounts.filter(a => a.platform === 'tiktok').length,
          pinterest: accounts.filter(a => a.platform === 'pinterest').length
        },
        lastSync: accounts.length > 0 
          ? new Date(Math.max(...accounts.map(a => a.lastSync?.getTime() || 0)))
          : null
      };
      
      await StorageService.save(this.STATS_KEY, stats);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
    }
  }

  /**
   * Récupérer les statistiques
   */
  static async getStats(): Promise<SocialAccountStats> {
    const result = await StorageService.load<SocialAccountStats>(this.STATS_KEY);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    // Recalculer si pas de stats sauvegardées
    await this.updateStats();
    const newResult = await StorageService.load<SocialAccountStats>(this.STATS_KEY);
    return newResult.data || {
      total: 0,
      connected: 0,
      disconnected: 0,
      byPlatform: {
        instagram: 0,
        facebook: 0,
        twitter: 0,
        linkedin: 0,
        youtube: 0,
        tiktok: 0,
        pinterest: 0
      },
      lastSync: null
    };
  }
}

export default SocialAccountsService;
