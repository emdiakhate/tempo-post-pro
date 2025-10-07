import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/User';

// Interface pour le hook d'authentification
interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isRole: (role: UserRole) => boolean;
  loading: boolean;
}

// Hook d'authentification simple
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('postelma_current_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        localStorage.removeItem('postelma_current_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('postelma_current_user', JSON.stringify(userData));
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('postelma_current_user');
  };

  // Vérifier les permissions
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Vérifier les permissions basées sur le rôle
    const rolePermissions = {
      owner: ['canPublish', 'canSchedule', 'canDelete', 'canManageUsers', 'canManageAccounts', 'canViewAnalytics', 'canApproveContent', 'canManageBilling'],
      manager: ['canPublish', 'canSchedule', 'canDelete', 'canManageUsers', 'canManageAccounts', 'canViewAnalytics', 'canApproveContent'],
      creator: ['canSchedule', 'canViewAnalytics'],
      viewer: ['canViewAnalytics']
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  // Vérifier le rôle
  const isRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    isRole,
    loading
  };
};

export default useAuth;