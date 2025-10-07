/**
 * Hook personnalisé pour la gestion des utilisateurs
 * Centralise la logique métier des utilisateurs avec les services
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { UsersService, UserFilters, UserStats } from '@/services';
import { User, UserRole, TeamMember, Invitation } from '@/types/user';

export interface UseUsersOptions {
  autoLoad?: boolean;
  initialFilters?: UserFilters;
}

export interface UseUsersReturn {
  // État
  users: User[];
  teamMembers: TeamMember[];
  invitations: Invitation[];
  loading: boolean;
  error: string | null;
  stats: UserStats | null;
  
  // Actions utilisateurs
  loadUsers: () => Promise<void>;
  saveUser: (user: User) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  updateUserRole: (id: string, role: UserRole) => Promise<boolean>;
  toggleUserStatus: (id: string) => Promise<boolean>;
  updateUserProfile: (id: string, updates: Partial<User>) => Promise<boolean>;
  
  // Actions équipe
  loadTeamMembers: () => Promise<void>;
  addTeamMember: (member: TeamMember) => Promise<boolean>;
  removeTeamMember: (id: string) => Promise<boolean>;
  
  // Actions invitations
  loadInvitations: () => Promise<void>;
  createInvitation: (invitation: Invitation) => Promise<boolean>;
  removeInvitation: (id: string) => Promise<boolean>;
  
  // Filtrage
  setFilters: (filters: UserFilters) => void;
  clearFilters: () => void;
  filteredUsers: User[];
  
  // Utilitaires
  getUserById: (id: string) => User | null;
  getUserByEmail: (email: string) => User | null;
  getUsersByRole: (role: UserRole) => User[];
  getActiveUsers: () => User[];
  searchUsers: (query: string) => User[];
  refreshStats: () => Promise<void>;
}

export const useUsers = (options: UseUsersOptions = {}): UseUsersReturn => {
  const { autoLoad = true, initialFilters = {} } = options;
  
  // État principal
  const [users, setUsers] = useState<User[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  // Charger tous les utilisateurs
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allUsers = await UsersService.getAllUsers();
      setUsers(allUsers);
      
      // Charger les statistiques
      const userStats = await UsersService.getStats();
      setStats(userStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs');
      console.error('Erreur useUsers.loadUsers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les membres de l'équipe
  const loadTeamMembers = useCallback(async () => {
    try {
      setError(null);
      const members = await UsersService.getTeamMembers();
      setTeamMembers(members);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'équipe');
      console.error('Erreur useUsers.loadTeamMembers:', err);
    }
  }, []);

  // Charger les invitations
  const loadInvitations = useCallback(async () => {
    try {
      setError(null);
      const allInvitations = await UsersService.getInvitations();
      setInvitations(allInvitations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des invitations');
      console.error('Erreur useUsers.loadInvitations:', err);
    }
  }, []);

  // Sauvegarder un utilisateur
  const saveUser = useCallback(async (user: User): Promise<boolean> => {
    try {
      setError(null);
      const success = await UsersService.saveUser(user);
      
      if (success) {
        await loadUsers(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      console.error('Erreur useUsers.saveUser:', err);
      return false;
    }
  }, [loadUsers]);

  // Supprimer un utilisateur
  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await UsersService.deleteUser(id);
      
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== id));
        await refreshStats();
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      console.error('Erreur useUsers.deleteUser:', err);
      return false;
    }
  }, []);

  // Mettre à jour le rôle d'un utilisateur
  const updateUserRole = useCallback(async (id: string, role: UserRole): Promise<boolean> => {
    try {
      setError(null);
      const success = await UsersService.updateUserRole(id, role);
      
      if (success) {
        await loadUsers(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du rôle');
      console.error('Erreur useUsers.updateUserRole:', err);
      return false;
    }
  }, [loadUsers]);

  // Activer/Désactiver un utilisateur
  const toggleUserStatus = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await UsersService.toggleUserStatus(id);
      
      if (success) {
        await loadUsers(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de statut');
      console.error('Erreur useUsers.toggleUserStatus:', err);
      return false;
    }
  }, [loadUsers]);

  // Mettre à jour le profil utilisateur
  const updateUserProfile = useCallback(async (id: string, updates: Partial<User>): Promise<boolean> => {
    try {
      setError(null);
      const success = await UsersService.updateUserProfile(id, updates);
      
      if (success) {
        await loadUsers(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du profil');
      console.error('Erreur useUsers.updateUserProfile:', err);
      return false;
    }
  }, [loadUsers]);

  // Ajouter un membre à l'équipe
  const addTeamMember = useCallback(async (member: TeamMember): Promise<boolean> => {
    try {
      setError(null);
      const success = await UsersService.addTeamMember(member);
      
      if (success) {
        await loadTeamMembers(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du membre');
      console.error('Erreur useUsers.addTeamMember:', err);
      return false;
    }
  }, [loadTeamMembers]);

  // Supprimer un membre de l'équipe
  const removeTeamMember = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await UsersService.removeTeamMember(id);
      
      if (success) {
        setTeamMembers(prev => prev.filter(member => member.id !== id));
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du membre');
      console.error('Erreur useUsers.removeTeamMember:', err);
      return false;
    }
  }, []);

  // Créer une invitation
  const createInvitation = useCallback(async (invitation: Invitation): Promise<boolean> => {
    try {
      setError(null);
      const success = await UsersService.createInvitation(invitation);
      
      if (success) {
        await loadInvitations(); // Recharger la liste
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'invitation');
      console.error('Erreur useUsers.createInvitation:', err);
      return false;
    }
  }, [loadInvitations]);

  // Supprimer une invitation
  const removeInvitation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await UsersService.removeInvitation(id);
      
      if (success) {
        setInvitations(prev => prev.filter(inv => inv.id !== id));
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'invitation');
      console.error('Erreur useUsers.removeInvitation:', err);
      return false;
    }
  }, []);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: UserFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Effacer les filtres
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Actualiser les statistiques
  const refreshStats = useCallback(async () => {
    try {
      const userStats = await UsersService.getStats();
      setStats(userStats);
    } catch (err) {
      console.error('Erreur useUsers.refreshStats:', err);
    }
  }, []);

  // Obtenir un utilisateur par ID
  const getUserById = useCallback((id: string): User | null => {
    return users.find(user => user.id === id) || null;
  }, [users]);

  // Obtenir un utilisateur par email
  const getUserByEmail = useCallback((email: string): User | null => {
    return users.find(user => user.email === email) || null;
  }, [users]);

  // Obtenir les utilisateurs par rôle
  const getUsersByRole = useCallback((role: UserRole): User[] => {
    return users.filter(user => user.role === role);
  }, [users]);

  // Obtenir les utilisateurs actifs
  const getActiveUsers = useCallback((): User[] => {
    return users.filter(user => user.isActive);
  }, [users]);

  // Rechercher des utilisateurs
  const searchUsers = useCallback((query: string): User[] => {
    return users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  }, [users]);

  // Utilisateurs filtrés (calculé)
  const filteredUsers = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return users;
    }

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
  }, [users, filters]);

  // Chargement automatique
  useEffect(() => {
    if (autoLoad) {
      loadUsers();
      loadTeamMembers();
      loadInvitations();
    }
  }, [autoLoad, loadUsers, loadTeamMembers, loadInvitations]);

  return {
    // État
    users,
    teamMembers,
    invitations,
    loading,
    error,
    stats,
    
    // Actions utilisateurs
    loadUsers,
    saveUser,
    deleteUser,
    updateUserRole,
    toggleUserStatus,
    updateUserProfile,
    
    // Actions équipe
    loadTeamMembers,
    addTeamMember,
    removeTeamMember,
    
    // Actions invitations
    loadInvitations,
    createInvitation,
    removeInvitation,
    
    // Filtrage
    setFilters: updateFilters,
    clearFilters,
    filteredUsers,
    
    // Utilitaires
    getUserById,
    getUserByEmail,
    getUsersByRole,
    getActiveUsers,
    searchUsers,
    refreshStats
  };
};

export default useUsers;
