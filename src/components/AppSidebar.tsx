import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Edit3, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Megaphone,
  Search,
  Archive,
  Instagram,
  Rss,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  count?: number;
  active?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { id: 'publishing', label: 'Publication', icon: Edit3, active: true },
  { id: 'calendar', label: 'Calendrier', icon: Calendar },
  { id: 'queue', label: 'File d\'attente Sprout', icon: Clock, count: 12 },
  { id: 'drafts', label: 'Brouillons', icon: FileText, count: 8 },
  { id: 'approval', label: 'En attente d\'approbation', icon: CheckCircle, count: 3 },
  { id: 'rejected', label: 'Rejetés', icon: XCircle, count: 1 },
  { id: 'campaigns', label: 'Campagnes', icon: Megaphone },
  { id: 'content', label: 'Trouver du contenu', icon: Search },
  { id: 'library', label: 'Bibliothèque de ressources', icon: Archive },
  { id: 'notifications', label: 'Notifications Instagram', icon: Instagram },
  { id: 'bio', label: 'SproutLink dans la bio', icon: Rss },
  { id: 'rss', label: 'Publier via RSS', icon: Rss },
  { id: 'failed', label: 'Publications échouées', icon: AlertTriangle, count: 2 },
];

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed, onToggle }) => {
  return (
    <div className={cn(
      "sidebar bg-sidebar h-screen flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out z-40",
      isCollapsed ? "w-15" : "w-70"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-sidebar-foreground font-semibold text-sm truncate">Postelma</h1>
                <p className="text-sidebar-foreground/70 text-xs">Publication</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-muted flex-shrink-0"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 custom-scrollbar overflow-y-auto">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "w-full flex items-center rounded-md text-sm transition-colors mb-1 relative group",
              isCollapsed ? "justify-center px-2 py-3" : "justify-between px-3 py-2.5",
              item.active 
                ? "bg-sidebar-muted text-sidebar-accent font-medium" 
                : "text-sidebar-foreground hover:bg-sidebar-muted/50 hover:text-sidebar-foreground"
            )}
          >
            <div className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "gap-3"
            )}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </div>
            
            {!isCollapsed && item.count && (
              <span className="bg-sidebar-muted text-sidebar-foreground text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                {item.count}
              </span>
            )}
            
            {isCollapsed && item.count && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-4 flex items-center justify-center">
                {item.count}
              </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
                {item.count && <span className="ml-1">({item.count})</span>}
              </div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AppSidebar;