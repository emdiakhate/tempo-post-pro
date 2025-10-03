import React, { useState, memo, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Edit3, Calendar, Clock, FileText, CheckCircle, XCircle, Megaphone, 
  Search, Archive, Instagram, Rss, AlertTriangle, Menu, BarChart3, FolderOpen, Target, Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Déterminer la page active basée sur l'URL
  const activePage = useMemo(() => {
    const path = location.pathname;
    if (path === '/analytics') return 'analytics';
    if (path === '/hashtags') return 'hashtags';
    if (path === '/queue') return 'queue';
    if (path === '/archives') return 'archives';
    if (path === '/competitors') return 'competitors';
    return 'calendar';
  }, [location.pathname]);

  // Callbacks optimisés pour la sidebar
  const handlePageChange = useCallback((page: string) => {
    switch (page) {
      case 'calendar':
        navigate('/');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'hashtags':
        navigate('/hashtags');
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
      default:
        navigate('/');
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
    const sidebarItems = [
      { id: 'publishing', label: 'Publication', icon: Edit3, active: activePage === 'publishing' },
      { id: 'calendar', label: 'Calendrier', icon: Calendar, active: activePage === 'calendar' },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, active: activePage === 'analytics' },
      { id: 'hashtags', label: 'Hashtags', icon: Hash, active: activePage === 'hashtags' },
      { id: 'queue', label: 'File d\'attente', icon: Clock, count: 12, active: activePage === 'queue' },
      { id: 'archives', label: 'Archives', icon: FolderOpen, active: activePage === 'archives' },
      { id: 'competitors', label: 'Concurrents', icon: Target, active: activePage === 'competitors' },
      { id: 'drafts', label: 'Brouillons', icon: FileText, count: 3, active: activePage === 'drafts' },
      { id: 'published', label: 'Publié', icon: CheckCircle, count: 45, active: activePage === 'published' },
      { id: 'failed', label: 'Échec', icon: XCircle, count: 2, active: activePage === 'failed' },
      { id: 'campaigns', label: 'Campagnes', icon: Megaphone, active: activePage === 'campaigns' },
      { id: 'discovery', label: 'Découverte', icon: Search, active: activePage === 'discovery' },
    ];

    const socialItems = [
      { id: 'instagram', label: 'Instagram', icon: Instagram, count: 15 },
      { id: 'facebook', label: 'Facebook', count: 8 },
      { id: 'twitter', label: 'Twitter', icon: Rss, count: 3 },
      { id: 'linkedin', label: 'LinkedIn', icon: Rss, count: 2 },
    ];

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
                    case 'calendar': return '/';
                    case 'analytics': return '/analytics';
                    case 'hashtags': return '/hashtags';
                    case 'queue': return '/queue';
                    case 'archives': return '/archives';
                    case 'competitors': return '/competitors';
                    default: return '/';
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

            {/* Social Networks */}
            {!sidebarCollapsed && (
              <div className="mt-8">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Réseaux sociaux
                </h3>
                <div className="space-y-1">
                  {socialItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                    >
                      {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count && (
                        <span className="bg-gray-600 text-xs px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                {activePage === 'calendar' && 'Calendrier'}
                {activePage === 'analytics' && 'Analytics'}
                {activePage === 'queue' && 'File d\'attente'}
                {activePage === 'archives' && 'Archives'}
                {activePage === 'competitors' && 'Concurrents'}
              </h1>
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
