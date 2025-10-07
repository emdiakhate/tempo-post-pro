/**
 * Service pour la gestion des utilisateurs
 * Utilise StorageService pour la persistance
 */

import { StorageService } from './storage';
import { User, UserRole, TeamMember, Invitation } from '@/types/user';

export interface UserFilters {
  role?: UserRole[];
  isActive?: boolean;
  search?: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<UserRole, number>;
  lastActivity: Date | null;
}

export class UsersService {
  private static readonly USERS_KEY = 'users';
  private static readonly TEAM_KEY = 'team_members';
  private static readonly INVITATIONS_KEY = 'invitations';
  private static readonly STATS_KEY = 'users_stats';

  /**
   * Récupérer tous les utilisateurs
   */
  static async getAllUsers(): Promise<User[]> {
    const result = await StorageService.load<User[]>(this.USERS_KEY, []);
    return result.data || [];
  }

  /**
   * Récupérer un utilisateur par ID
   */
  static async getUserById(id: string): Promise<User | null> {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  /**
   * Récupérer un utilisateur par email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  /**
   * Sauvegarder un utilisateur
   */
  static async saveUser(user: User): Promise<boolean> {
    try {
      const users = await this.getAllUsers();
      const existingIndex = users.findIndex(u => u.id === user.id);
      
      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }
      
      const result = await StorageService.save(this.USERS_KEY, users);
      
      if (result.success) {
        await this.updateStats();
      }
      
      return result.success;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
      return false;
    }
  }

  /**
   * Supprimer un utilisateur
   */
  static async deleteUser(id: string): Promise<boolean> {
    try {
      const users = await this.getAllUsers();
      const filteredUsers = users.filter(user => user.id !== id);
      
      const result = await StorageService.save(this.USERS_KEY, filteredUsers);
      
      if (result.success) {
        await this.updateStats();
      }
      
      return result.success;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      return false;
    }
  }

  /**
   * Filtrer les utilisateurs
   */
  static async getFilteredUsers(filters: UserFilters): Promise<User[]> {
    const users = await this.getAllUsers();
    
    return users.filter(user => {
      // Filtre par rôle
      if (filters.role && filters.role.length > 0) {
        if (!filters.role.includes(user.role)) return false;
      }
      
      // Filtre par statut actif
      if (filters.isActive !== undefined) {
        if (user.isActive !== filters.isActive) return false;
      }
      
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(searchLower);
        const matchesEmail = user.email.toLowerCase().includes(searchLower);
        
        if (!matchesName && !matchesEmail) return false;
      }
      
      return true;
    });
  }

  /**
   * Récupérer les membres de l'équipe
   */
  static async getTeamMembers(): Promise<TeamMember[]> {
    const result = await StorageService.load<TeamMember[]>(this.TEAM_KEY, []);
    return result.data || [];
  }

  /**
   * Ajouter un membre à l'équipe
   */
  static async addTeamMember(member: TeamMember): Promise<boolean> {
    try {
      const members = await this.getTeamMembers();
      members.push(member);
      
      const result = await StorageService.save(this.TEAM_KEY, members);
      return result.success;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
      return false;
    }
  }

  /**
   * Supprimer un membre de l'équipe
   */
  static async removeTeamMember(id: string): Promise<boolean> {
    try {
      const members = await this.getTeamMembers();
      const filteredMembers = members.filter(member => member.id !== id);
      
      const result = await StorageService.save(this.TEAM_KEY, filteredMembers);
      return result.success;
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error);
      return false;
    }
  }

  /**
   * Mettre à jour le rôle d'un utilisateur
   */
  static async updateUserRole(id: string, role: UserRole): Promise<boolean> {
    try {
      const user = await this.getUserById(id);
      if (!user) return false;
      
      user.role = role;
      user.lastActivity = new Date();
      
      return this.saveUser(user);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      return false;
    }
  }

  /**
   * Activer/Désactiver un utilisateur
   */
  static async toggleUserStatus(id: string): Promise<boolean> {
    try {
      const user = await this.getUserById(id);
      if (!user) return false;
      
      user.isActive = !user.isActive;
      user.lastActivity = new Date();
      
      return this.saveUser(user);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      return false;
    }
  }

  /**
   * Récupérer les invitations
   */
  static async getInvitations(): Promise<Invitation[]> {
    const result = await StorageService.load<Invitation[]>(this.INVITATIONS_KEY, []);
    return result.data || [];
  }

  /**
   * Créer une invitation
   */
  static async createInvitation(invitation: Invitation): Promise<boolean> {
    try {
      const invitations = await this.getInvitations();
      invitations.push(invitation);
      
      const result = await StorageService.save(this.INVITATIONS_KEY, invitations);
      return result.success;
    } catch (error) {
      console.error('Erreur lors de la création de l\'invitation:', error);
      return false;
    }
  }

  /**
   * Supprimer une invitation
   */
  static async removeInvitation(id: string): Promise<boolean> {
    try {
      const invitations = await this.getInvitations();
      const filteredInvitations = invitations.filter(inv => inv.id !== id);
      
      const result = await StorageService.save(this.INVITATIONS_KEY, filteredInvitations);
      return result.success;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'invitation:', error);
      return false;
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async updateUserProfile(id: string, updates: Partial<User>): Promise<boolean> {
    try {
      const user = await this.getUserById(id);
      if (!user) return false;
      
      const updatedUser = { ...user, ...updates, lastActivity: new Date() };
      return this.saveUser(updatedUser);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return false;
    }
  }

  /**
   * Mettre à jour la dernière activité
   */
  static async updateLastActivity(id: string): Promise<boolean> {
    try {
      const user = await this.getUserById(id);
      if (!user) return false;
      
      user.lastActivity = new Date();
      return this.saveUser(user);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'activité:', error);
      return false;
    }
  }

  /**
   * Mettre à jour les statistiques
   */
  private static async updateStats(): Promise<void> {
    try {
      const users = await this.getAllUsers();
      
      const stats: UserStats = {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length,
        byRole: {
          owner: users.filter(u => u.role === 'owner').length,
          manager: users.filter(u => u.role === 'manager').length,
          creator: users.filter(u => u.role === 'creator').length,
          viewer: users.filter(u => u.role === 'viewer').length
        },
        lastActivity: users.length > 0 
          ? new Date(Math.max(...users.map(u => u.lastActivity.getTime())))
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
  static async getStats(): Promise<UserStats> {
    const result = await StorageService.load<UserStats>(this.STATS_KEY);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    // Recalculer si pas de stats sauvegardées
    await this.updateStats();
    const newResult = await StorageService.load<UserStats>(this.STATS_KEY);
    return newResult.data || {
      total: 0,
      active: 0,
      inactive: 0,
      byRole: { owner: 0, manager: 0, creator: 0, viewer: 0 },
      lastActivity: null
    };
  }

  /**
   * Rechercher des utilisateurs
   */
  static async searchUsers(query: string): Promise<User[]> {
    return this.getFilteredUsers({ search: query });
  }

  /**
   * Obtenir les utilisateurs par rôle
   */
  static async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.getFilteredUsers({ role: [role] });
  }

  /**
   * Obtenir les utilisateurs actifs
   */
  static async getActiveUsers(): Promise<User[]> {
    return this.getFilteredUsers({ isActive: true });
  }
}

export default UsersService;