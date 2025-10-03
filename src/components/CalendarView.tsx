import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Post } from '@/types/Post';
import PostCard from './PostCard';
import PostCreationModal from './PostCreationModal';
import PostPreviewModal from './PostPreviewModal';
import Analytics from '@/pages/Analytics';
import QueuePage from '@/pages/QueuePage';
import ArchivesPage from '@/pages/ArchivesPage';
import { Button } from '@/components/ui/button';
import { Plus, Edit3, Calendar, Clock, FileText, CheckCircle, XCircle, Megaphone, Search, Archive, Instagram, Rss, AlertTriangle, Menu, ChevronLeft, ChevronRight, BarChart3, FolderOpen } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  posts: Post[];
  currentDate: Date;
  onPostsChange: (posts: Post[]) => void;
  onCreatePost: (dayColumn: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  currentDate,
  onPostsChange,
  onCreatePost,
}) => {
  const [draggedPost, setDraggedPost] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDayForPost, setSelectedDayForPost] = useState<string>('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [previewingPost, setPreviewingPost] = useState<Post | null>(null);
  const [activePage, setActivePage] = useState<string>('calendar');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const dayName = format(date, 'EEEE', { locale: fr });
    const dayNumber = format(date, 'd');
    const dayKey = format(date, 'EEEE', { locale: fr }).toLowerCase();
    
    return {
      key: dayKey,
      name: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      number: dayNumber,
      date,
    };
  });

  const postsByDay = weekDays.reduce((acc, day) => {
    acc[day.key] = posts
      .filter(post => post.dayColumn === day.key)
      .sort((a, b) => a.timeSlot - b.timeSlot);
    return acc;
  }, {} as Record<string, Post[]>);

  const handleDragStart = (result: any) => {
    setDraggedPost(result.draggableId);
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggedPost(null);

    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const post = posts.find(p => p.id === draggableId);
    if (!post) return;

    const newTimeSlot = destination.index * 30; // 30 minutes per slot
    const newDayColumn = destination.droppableId;

    const updatedPost = {
          ...post,
      dayColumn: newDayColumn,
      timeSlot: newTimeSlot,
    };

    const newPosts = posts.map(p => p.id === draggableId ? updatedPost : p);
    onPostsChange(newPosts);
  };

  const handleCreatePost = (dayColumn?: string) => {
    setSelectedDayForPost(dayColumn || '');
    setShowCreateModal(true);
  };

  const handleSavePost = (postData: any) => {
    console.log('Save post:', postData);
    
    // Si c'est un post programmé, l'ajouter au calendrier
    if (postData.status === 'scheduled') {
    const newPost: Post = {
        id: postData.id,
        content: postData.content,
        platforms: postData.platforms,
        image: postData.image,
        scheduledTime: postData.scheduledTime,
        dayColumn: postData.dayColumn,
        timeSlot: postData.timeSlot,
        status: 'scheduled',
        author: 'Postelma',
        campaign: '',
        captions: postData.captions
      };

    onPostsChange([...posts, newPost]);
    }
    
    setShowCreateModal(false);
  };

  const handlePostClick = (post: Post) => {
    setEditingPost(post);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    const newPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
    onPostsChange(newPosts);
    setEditingPost(null);
  };

  const handlePreview = (post: Post) => {
    setPreviewingPost(post);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
  };

  const handleDuplicate = (post: Post) => {
    const duplicatedPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
      status: 'draft' as const,
    };
    onPostsChange([...posts, duplicatedPost]);
  };

  const handleDelete = (post: Post) => {
    const newPosts = posts.filter(p => p.id !== post.id);
    onPostsChange(newPosts);
  };



  const sidebarItems = [
    { id: 'publishing', label: 'Publication', icon: Edit3, active: activePage === 'publishing' },
    { id: 'calendar', label: 'Calendrier', icon: Calendar, active: activePage === 'calendar' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, active: activePage === 'analytics' },
    { id: 'queue', label: 'File d\'attente', icon: Clock, count: 12, active: activePage === 'queue' },
    { id: 'archives', label: 'Archives', icon: FolderOpen, active: activePage === 'archives' },
    { id: 'drafts', label: 'Brouillons', icon: FileText, count: 3, active: activePage === 'drafts' },
    { id: 'published', label: 'Publié', icon: CheckCircle, count: 45, active: activePage === 'published' },
    { id: 'failed', label: 'Échec', icon: XCircle, count: 2, active: activePage === 'failed' },
    { id: 'campaigns', label: 'Campagnes', icon: Megaphone, active: activePage === 'campaigns' },
    { id: 'discovery', label: 'Découverte', icon: Search, active: activePage === 'discovery' },
  ];

  const socialItems = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, count: 8 },
    { id: 'facebook', label: 'Facebook', icon: Rss, count: 5 },
    { id: 'twitter', label: 'Twitter', icon: Rss, count: 3 },
    { id: 'linkedin', label: 'LinkedIn', icon: Rss, count: 2 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
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
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    item.active 
                      ? "bg-green-500 text-white" 
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
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
                </button>
              ))}
            </div>

            {/* Social Media Section */}
            {!sidebarCollapsed && (
              <div className="mt-8">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Réseaux sociaux
                </h3>
                <div className="space-y-1">
                  {socialItems.map((item) => (
                    <button
                      key={item.id}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <span className="bg-gray-600 text-xs px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-lg font-semibold">
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </h1>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button variant="ghost" size="sm" className="text-xs">Semaine</Button>
                <Button variant="ghost" size="sm" className="text-xs">Mois</Button>
                <Button variant="ghost" size="sm" className="text-xs">Liste</Button>
              </div>
              
              <Button 
                onClick={() => handleCreatePost()}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Créer un post
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activePage === 'analytics' && <Analytics />}
          {activePage === 'queue' && <QueuePage />}
          {activePage === 'archives' && <ArchivesPage />}
          {activePage === 'calendar' && (
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="flex h-full">
          {weekDays.map((day) => (
                  <div key={day.key} className="flex-1 border-r border-gray-200 flex flex-col min-w-0">
                    {/* Day Header */}
                    <div className="p-2 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                          <h3 className="font-medium text-xs text-gray-700">
                      {day.name} {day.number}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                          onClick={() => handleCreatePost(day.key)}
                          className="h-5 w-5 p-0 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

                    {/* Posts Column */}
                    <Droppable droppableId={day.key}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                            "flex-1 px-1 py-1 space-y-1 h-[calc(100vh-180px)] group",
                            snapshot.isDraggingOver && "bg-blue-50 border-2 border-dashed border-blue-300"
                    )}
                  >
                    {postsByDay[day.key]?.map((post, index) => (
                            <Draggable key={post.id} draggableId={post.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                                  className="w-full"
                          >
                            <PostCard
                              post={post}
                              isDragging={snapshot.isDragging}
                                    onPreview={handlePreview}
                                    onEdit={handleEdit}
                                    onDuplicate={handleDuplicate}
                                    onDelete={handleDelete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
          )}
        </div>
      </div>
      
      {/* Post Creation Modal */}
      {showCreateModal && (
        <PostCreationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSavePost}
          selectedDay={selectedDayForPost}
        />
      )}

      {/* Post Edit Modal */}
      {editingPost && (
        <PostCreationModal
          isOpen={true}
          onClose={() => setEditingPost(null)}
          onSave={handleUpdatePost}
          initialData={editingPost}
          isEditing={true}
        />
      )}

      {/* Post Preview Modal */}
      {previewingPost && (
        <PostPreviewModal
          post={{
            ...previewingPost,
            createdAt: new Date().toISOString(),
            platforms: previewingPost.platforms || [],
            status: (previewingPost.status === 'pending' ? 'scheduled' : previewingPost.status) || 'draft'
          }}
          isOpen={true}
          onClose={() => setPreviewingPost(null)}
        />
      )}
    </div>
  );
};

export default CalendarView;