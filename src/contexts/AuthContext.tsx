/**
 * Contexte d'Authentification Unifié - Postelma
 * Fusionne useAuth et UserContext en un seul contexte
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, UserRole, UserPermissions, TeamMember, Invitation, ROLE_PERMISSIONS } from '@/types/user';

// Types pour le contexte unifié
interface AuthState {
  currentUser: User | null;
  teamMembers: TeamMember[];
  invitations: Invitation[];
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  // Actions d'authentification
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  
  // Gestion des permissions
  hasPermission: (permission: keyof UserPermissions) => boolean;
  isRole: (role: UserRole) => boolean;
  canAccess: (resource: string, action?: string) => boolean;
  
  // Gestion d'équipe
  inviteUser: (email: string, role: UserRole, message?: string) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  activateUser: (userId: string) => Promise<void>;
  
  // Gestion des invitations
  acceptInvitation: (token: string) => Promise<void>;
  rejectInvitation: (token: string) => Promise<void>;
  resendInvitation: (invitationId: string) => Promise<void>;
  cancelInvitation: (invitationId: string) => Promise<void>;
  
  // Statistiques d'équipe
  getTeamStats: () => {
    totalMembers: number;
    activeMembers: number;
    pendingInvitations: number;
    roleDistribution: Record<UserRole, number>;
  };
  
  // Helpers
  isOwner: boolean;
  isManager: boolean;
  isCreator: boolean;
  isViewer: boolean;
  isAdmin: boolean;
  role: UserRole;
  permissions: UserPermissions;
}

// Actions du reducer
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TEAM_MEMBERS'; payload: TeamMember[] }
  | { type: 'SET_INVITATIONS'; payload: Invitation[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'UPDATE_TEAM_MEMBER'; payload: { id: string; updates: Partial<TeamMember> } }
  | { type: 'REMOVE_TEAM_MEMBER'; payload: string }
  | { type: 'ADD_INVITATION'; payload: Invitation }
  | { type: 'REMOVE_INVITATION'; payload: string };

// Reducer pour la gestion d'état
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_TEAM_MEMBERS':
      return { ...state, teamMembers: action.payload };
    case 'SET_INVITATIONS':
      return { ...state, invitations: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_TEAM_MEMBER':
      return { ...state, teamMembers: [...state.teamMembers, action.payload] };
    case 'UPDATE_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: state.teamMembers.map(member =>
          member.id === action.payload.id
            ? { ...member, ...action.payload.updates }
            : member
        )
      };
    case 'REMOVE_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: state.teamMembers.filter(member => member.id !== action.payload)
      };
    case 'ADD_INVITATION':
      return { ...state, invitations: [...state.invitations, action.payload] };
    case 'REMOVE_INVITATION':
      return {
        ...state,
        invitations: state.invitations.filter(invitation => invitation.id !== action.payload)
      };
    default:
      return state;
  }
};

// Contexte d'authentification
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider d'authentification
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    currentUser: null,
    teamMembers: [],
    invitations: [],
    isLoading: true,
    error: null
  });

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const storedUser = localStorage.getItem('postelma_current_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          dispatch({ type: 'SET_USER', payload: user });
        }
        
        // Charger les membres d'équipe
        const storedMembers = localStorage.getItem('postelma_team_members');
        if (storedMembers) {
          const members = JSON.parse(storedMembers);
          dispatch({ type: 'SET_TEAM_MEMBERS', payload: members });
        }
        
        // Charger les invitations
        const storedInvitations = localStorage.getItem('postelma_invitations');
        if (storedInvitations) {
          const invitations = JSON.parse(storedInvitations);
          dispatch({ type: 'SET_INVITATIONS', payload: invitations });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erreur de chargement' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  // Actions d'authentification
  const login = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
    localStorage.setItem('postelma_current_user', JSON.stringify(user));
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    localStorage.removeItem('postelma_current_user');
  };

  // Gestion des permissions
  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!state.currentUser) return false;
    const userPermissions = ROLE_PERMISSIONS[state.currentUser.role];
    return userPermissions[permission] || false;
  };

  const isRole = (role: UserRole): boolean => {
    return state.currentUser?.role === role;
  };

  const canAccess = (resource: string, action?: string): boolean => {
    if (!state.currentUser) return false;
    
    // Logique d'accès basée sur le rôle et la ressource
    const userPermissions = ROLE_PERMISSIONS[state.currentUser.role];
    
    switch (resource) {
      case 'posts':
        return userPermissions.canPublish || userPermissions.canSchedule;
      case 'analytics':
        return userPermissions.canViewAnalytics;
      case 'team':
        return userPermissions.canManageUsers;
      case 'accounts':
        return userPermissions.canManageAccounts;
      default:
        return false;
    }
  };

  // Gestion d'équipe (implémentation simplifiée pour MVP)
  const inviteUser = async (email: string, role: UserRole, message?: string) => {
    // TODO: Implémenter l'invitation d'utilisateur
    console.log('Inviter utilisateur:', { email, role, message });
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    // TODO: Implémenter la mise à jour du rôle
    console.log('Mettre à jour le rôle:', { userId, role });
  };

  const removeUser = async (userId: string) => {
    // TODO: Implémenter la suppression d'utilisateur
    console.log('Supprimer utilisateur:', userId);
  };

  const suspendUser = async (userId: string) => {
    // TODO: Implémenter la suspension d'utilisateur
    console.log('Suspendre utilisateur:', userId);
  };

  const activateUser = async (userId: string) => {
    // TODO: Implémenter l'activation d'utilisateur
    console.log('Activer utilisateur:', userId);
  };

  // Gestion des invitations (implémentation simplifiée pour MVP)
  const acceptInvitation = async (token: string) => {
    // TODO: Implémenter l'acceptation d'invitation
    console.log('Accepter invitation:', token);
  };

  const rejectInvitation = async (token: string) => {
    // TODO: Implémenter le rejet d'invitation
    console.log('Rejeter invitation:', token);
  };

  const resendInvitation = async (invitationId: string) => {
    // TODO: Implémenter le renvoi d'invitation
    console.log('Renvoyer invitation:', invitationId);
  };

  const cancelInvitation = async (invitationId: string) => {
    // TODO: Implémenter l'annulation d'invitation
    console.log('Annuler invitation:', invitationId);
  };

  // Statistiques d'équipe
  const getTeamStats = () => {
    const totalMembers = state.teamMembers.length;
    const activeMembers = state.teamMembers.filter(member => member.isActive).length;
    const pendingInvitations = state.invitations.filter(invitation => invitation.status === 'pending').length;
    
    const roleDistribution = state.teamMembers.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<UserRole, number>);

    return {
      totalMembers,
      activeMembers,
      pendingInvitations,
      roleDistribution
    };
  };

  // Helpers
  const isOwner = isRole('owner');
  const isManager = isRole('manager');
  const isCreator = isRole('creator');
  const isViewer = isRole('viewer');
  const isAdmin = isOwner || isManager;
  const role = state.currentUser?.role || 'viewer';
  const permissions = state.currentUser ? ROLE_PERMISSIONS[state.currentUser.role] : ROLE_PERMISSIONS.viewer;

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    isAuthenticated: !!state.currentUser,
    hasPermission,
    isRole,
    canAccess,
    inviteUser,
    updateUserRole,
    removeUser,
    suspendUser,
    activateUser,
    acceptInvitation,
    rejectInvitation,
    resendInvitation,
    cancelInvitation,
    getTeamStats,
    isOwner,
    isManager,
    isCreator,
    isViewer,
    isAdmin,
    role,
    permissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte d'authentification
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export du contexte pour compatibilité
export { AuthContext };
