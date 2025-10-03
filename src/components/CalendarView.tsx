import React, { useState, memo, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { Post } from '@/types/Post';
import PostCard from './PostCard';
import PostCreationModal from './PostCreationModal';
import PostPreviewModal from './PostPreviewModal';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
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
  // Hooks React Router
  const navigate = useNavigate();
  
  const [draggedPost, setDraggedPost] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDayForPost, setSelectedDayForPost] = useState<string>('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [previewingPost, setPreviewingPost] = useState<Post | null>(null);

  // Calculs optimisés avec useMemo pour éviter les recalculs inutiles
  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 0 }), [currentDate]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => {
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
  }), [weekStart]);

  const postsByDay = useMemo(() => {
    const grouped: Record<string, Post[]> = {};
    weekDays.forEach(day => {
      grouped[day.key] = posts.filter(post => {
        const postDate = new Date(post.scheduledTime);
        return postDate.toDateString() === day.date.toDateString();
      });
    });
    return grouped;
  }, [posts, weekDays]);

  // Callbacks optimisés avec useCallback
  const handleDragStart = useCallback((result: any) => {
    setDraggedPost(result.draggableId);
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    setDraggedPost(null);

    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;
    
    const post = posts.find(p => p.id === draggableId);
    if (!post) return;
    
    const newScheduledTime = new Date(post.scheduledTime);
    const dayIndex = weekDays.findIndex(day => day.key === destination.droppableId);
    if (dayIndex === -1) return;
    
    const targetDate = weekDays[dayIndex].date;
    newScheduledTime.setDate(targetDate.getDate());
    newScheduledTime.setMonth(targetDate.getMonth());
    newScheduledTime.setFullYear(targetDate.getFullYear());
    
    const updatedPost = { ...post, scheduledTime: newScheduledTime };
    const newPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
    onPostsChange(newPosts);
  }, [posts, onPostsChange, weekDays]);

  const handleCreatePost = useCallback((dayColumn?: string) => {
    if (dayColumn) {
      setSelectedDayForPost(dayColumn);
    }
    setShowCreateModal(true);
  }, []);

  const handleSavePost = useCallback((postData: Partial<Post>) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      content: postData.content || '',
      author: postData.author || 'Utilisateur',
      image: postData.image || undefined,
      scheduledTime: postData.scheduledTime || new Date(),
      platforms: postData.platforms || ['facebook'],
      status: 'scheduled' as const,
      dayColumn: selectedDayForPost || 'lundi',
      timeSlot: 9,
    };
    
    onPostsChange([...posts, newPost]);
    setShowCreateModal(false);
    setSelectedDayForPost('');
  }, [posts, onPostsChange, selectedDayForPost]);

  const handlePostClick = useCallback((post: Post) => {
    setPreviewingPost(post);
  }, []);

  const handleUpdatePost = useCallback((updatedPost: Post) => {
    const newPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
    onPostsChange(newPosts);
    setEditingPost(null);
  }, [posts, onPostsChange]);

  const handlePreview = useCallback((post: Post) => {
    // Navigation vers la page de détail du post
    navigate(`/post/${post.id}`);
  }, [navigate]);

  const handleEdit = useCallback((post: Post) => {
    setEditingPost(post);
  }, []);

  const handleDuplicate = useCallback((post: Post) => {
    const duplicatedPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
      status: 'draft' as const,
    };
    onPostsChange([...posts, duplicatedPost]);
  }, [posts, onPostsChange]);

  const handleDelete = useCallback((post: Post) => {
    const newPosts = posts.filter(p => p.id !== post.id);
    onPostsChange(newPosts);
  }, [posts, onPostsChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Header du calendrier */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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

      {/* Contenu du calendrier */}
      <div className="flex-1 overflow-y-auto">
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
                      ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                        "flex-1 p-2 space-y-2 min-h-[200px]",
                        snapshot.isDraggingOver && "bg-blue-50"
                    )}
                  >
                    {postsByDay[day.key]?.map((post, index) => (
                        <Draggable key={post.id} draggableId={post.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                                "transition-transform",
                                snapshot.isDragging && "rotate-2 scale-105"
                            )}
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
      </div>

      {/* Modales */}
      {showCreateModal && (
        <PostCreationModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedDayForPost('');
          }}
          onSave={handleSavePost}
          initialData={{
            scheduledTime: selectedDayForPost ? 
              weekDays.find(d => d.key === selectedDayForPost)?.date : 
              new Date()
          }}
        />
      )}

      {editingPost && (
        <PostCreationModal
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleUpdatePost}
          initialData={editingPost}
          isEditing={true}
        />
      )}

      {previewingPost && (
        <PostPreviewModal
          isOpen={!!previewingPost}
          onClose={() => setPreviewingPost(null)}
          post={{
            ...previewingPost,
            createdAt: new Date().toISOString(),
            platforms: previewingPost.platforms,
            status: (previewingPost.status === 'pending' ? 'scheduled' : previewingPost.status) || 'draft'
          }}
        />
      )}
    </div>
  );
};

export default CalendarView;