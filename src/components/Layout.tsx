import React, { useState, memo, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Clock, FolderOpen, Target, Hash, LayoutDashboard, Users, 
  BarChart3, Menu, UserPlus, Search, TrendingUp, Crown, Shield, Pencil, Eye, FileText, Settings, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout commun avec sidebar permanente
 * Utilisé par toutes les pages de l'application
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Hooks React Router
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Déterminer la page active basée sur l'URL
  const activePage = useMemo(() => {
    const path = location.pathname;
    
    if (path === '/dashboard') return 'dashboard';
    if (path === '/calendar') return 'calendar';
    if (path === '/analytics') return 'analytics';
    if (path === '/queue') return 'queue';
    if (path === '/archives') return 'archives';
    if (path === '/competitors') return 'competitors';
    if (path === '/team') return 'team';
    if (path === '/settings') return 'settings';
    if (path === '/settings/accounts') return 'accounts';
    if (path === '/leads') return 'leads';
    if (path === '/publications') return 'publications';
    
    return 'dashboard'; // Par défaut sur dashboard
  }, [location.pathname]);

  // Callbacks optimisés pour la sidebar
  const handlePageChange = useCallback((page: string) => {
    switch (page) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'calendar':
        navigate('/calendar');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'queue':
        navigate('/queue');
        break;
      case 'archives':
        navigate('/archives');
        break;
      case 'competitors':
        navigate('/competitors');
        break;
      case 'leads':
        navigate('/leads');
        break;
      case 'publications':
        navigate('/publications');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        navigate('/logout');
        break;
      default:
        navigate('/dashboard');
    }
  }, [navigate]);

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  // Composant Sidebar mémorisé
  const Sidebar = memo<{
    sidebarCollapsed: boolean;
    activePage: string;
    onPageChange: (page: string) => void;
    onToggleCollapse: () => void;
  }>(({ sidebarCollapsed, activePage, onPageChange, onToggleCollapse }) => {
    // Items de sidebar avec vérification des permissions
    const allSidebarItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: activePage === 'dashboard', permission: null },
      { id: 'calendar', label: 'Calendrier', icon: Calendar, active: activePage === 'calendar', permission: 'canSchedule' },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, active: activePage === 'analytics', permission: 'canViewAnalytics' },
      { id: 'queue', label: 'File d\'attente', icon: Clock, count: 12, active: activePage === 'queue', permission: 'canApproveContent' },
      { id: 'archives', label: 'Archives', icon: FolderOpen, active: activePage === 'archives', permission: 'canPublish' },
      { id: 'competitors', label: 'Concurrents', icon: Target, active: activePage === 'competitors', permission: 'canViewAnalytics' },
      { id: 'team', label: 'Équipe', icon: Users, active: activePage === 'team', permission: 'canManageUsers' },
      { id: 'accounts', label: 'Comptes Sociaux', icon: Users, active: activePage === 'accounts', permission: 'canManageAccounts' },
      { id: 'leads', label: 'Lead Generation', icon: UserPlus, active: activePage === 'leads', permission: 'canPublish' },
      { id: 'publications', label: 'Mes Publications', icon: FileText, active: activePage === 'publications', permission: 'canPublish' },
      { id: 'settings', label: 'Paramètres', icon: Settings, active: activePage === 'settings', permission: null },
      { id: 'logout', label: 'Déconnexion', icon: LogOut, active: false, permission: null },
    ];

    // Filtrer les items selon les permissions
    const sidebarItems = allSidebarItems.filter(item => {
      if (!item.permission) return true; // Toujours visible
      return hasPermission(item.permission as any);
    });


    return (
      <div className={cn(
        "bg-[#2c3548] text-white transition-all duration-300 flex flex-col",
        sidebarCollapsed ? "w-16" : "w-72"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg font-semibold">Postelma</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1">
          <div className="p-4">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                // Déterminer l'URL basée sur l'ID de l'item
                const getItemUrl = (id: string) => {
                  switch (id) {
                    case 'dashboard': return '/dashboard';
                    case 'calendar': return '/calendar';
                    case 'analytics': return '/analytics';
                    case 'publications': return '/publications';
                    case 'logout': return '/logout';
                    case 'settings': return '/settings';
                    case 'queue': return '/queue';
                    case 'archives': return '/archives';
                    case 'competitors': return '/competitors';
                    case 'users': return '/users';
                    case 'team': return '/team';
                    case 'accounts': return '/settings/accounts';
                    case 'leads': return '/leads';
                    case 'leads-analytics': return '/leads/analytics';
                    case 'leads-search': return '/leads/search';
                    default: return '/dashboard';
                  }
                };

                return (
                  <Link
                    key={item.id}
                    to={getItemUrl(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      item.active 
                        ? "bg-green-500 text-white" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.count && (
                          <span className="bg-gray-600 text-xs px-2 py-1 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>

          </div>
        </div>

        {/* Toggle Button */}
        <div className="p-4 border-t border-gray-600">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
            {!sidebarCollapsed && <span>Masquer</span>}
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Composant mémorisé */}
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed}
        activePage={activePage}
        onPageChange={handlePageChange}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <h1 className="text-lg font-semibold text-gray-900">
                {activePage === 'dashboard' && 'Dashboard'}
                {activePage === 'calendar' && 'Calendrier'}
                {activePage === 'analytics' && 'Analytics'}
                {activePage === 'queue' && 'File d\'attente'}
                {activePage === 'archives' && 'Archives'}
                {activePage === 'competitors' && 'Concurrents'}
                {activePage === 'team' && 'Équipe'}
                {activePage === 'accounts' && 'Comptes Sociaux'}
                {activePage === 'leads' && 'Lead Generation'}
                {activePage === 'publications' && 'Mes Publications'}
                {activePage === 'settings' && 'Paramètres'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
