import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Post } from '@/types/Post';
import PostCard from './PostCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

  // Get the start of the week (Monday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Generate the 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const dayName = format(date, 'EEEE', { locale: fr });
    const dayNumber = format(date, 'd');
    const dayKey = format(date, 'EEEE').toLowerCase(); // monday, tuesday, etc.
    
    return {
      key: dayKey,
      name: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      number: dayNumber,
      date,
    };
  });

  // Group posts by day column
  const postsByDay = weekDays.reduce((acc, day) => {
    acc[day.key] = posts
      .filter(post => post.dayColumn === day.key)
      .sort((a, b) => a.timeSlot - b.timeSlot);
    return acc;
  }, {} as Record<string, Post[]>);

  const handleDragStart = (start: any) => {
    setDraggedPost(start.draggableId);
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggedPost(null);

    if (!result.destination) {
      return;
    }

    const { source, destination, draggableId } = result;

    // If dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the post being moved
    const postToMove = posts.find(post => post.id === draggableId);
    if (!postToMove) return;

    // Create a new array of posts
    const newPosts = posts.map(post => {
      if (post.id === draggableId) {
        return {
          ...post,
          dayColumn: destination.droppableId,
          timeSlot: destination.index,
        };
      }
      return post;
    });

    // Update other posts in the destination column if necessary
    const destinationPosts = newPosts.filter(
      post => post.dayColumn === destination.droppableId && post.id !== draggableId
    );

    // Reindex posts in destination column
    destinationPosts.forEach((post, index) => {
      if (index >= destination.index) {
        const postIndex = newPosts.findIndex(p => p.id === post.id);
        if (postIndex !== -1) {
          newPosts[postIndex] = { ...post, timeSlot: index + 1 };
        }
      }
    });

    onPostsChange(newPosts);
  };

  const handleEditPost = (post: Post) => {
    console.log('Edit post:', post);
    // TODO: Open edit modal
  };

  const handleDuplicatePost = (post: Post) => {
    const newPost: Post = {
      ...post,
      id: `${post.id}-copy-${Date.now()}`,
      content: `${post.content} (Copie)`,
      status: 'draft',
    };
    onPostsChange([...posts, newPost]);
  };

  const handleDeletePost = (post: Post) => {
    const newPosts = posts.filter(p => p.id !== post.id);
    onPostsChange(newPosts);
  };

  return (
    <div className="flex-1 bg-background">
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7 h-full">
          {weekDays.map((day) => (
            <div
              key={day.key}
              className="border-r border-border last:border-r-0 flex flex-col min-h-0"
            >
              {/* Day header */}
              <div className="p-3 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm text-foreground">
                      {day.name} {day.number}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCreatePost(day.key)}
                    className="h-6 w-6 p-0 hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Droppable area for posts */}
              <Droppable droppableId={day.key} type="POST">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 p-2 space-y-2 min-h-96 custom-scrollbar overflow-y-auto group",
                      snapshot.isDraggingOver && "bg-drop-zone-active/20 border-2 border-dashed border-primary/30"
                    )}
                  >
                    {postsByDay[day.key]?.map((post, index) => (
                      <Draggable
                        key={post.id}
                        draggableId={post.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "transition-all duration-200",
                              snapshot.isDragging && "opacity-75 rotate-2 shadow-lg scale-105"
                            )}
                          >
                            <PostCard
                              post={post}
                              isDragging={snapshot.isDragging}
                              onEdit={handleEditPost}
                              onDuplicate={handleDuplicatePost}
                              onDelete={handleDeletePost}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    
                    {provided.placeholder}
                    
                    {/* Drop zone indicator */}
                    {snapshot.isDraggingOver && postsByDay[day.key]?.length === 0 && (
                      <div className="border-2 border-dashed border-primary/50 rounded-lg p-4 text-center text-muted-foreground">
                        <Plus className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Déposer ici</p>
                      </div>
                    )}

                    {/* Add post button */}
                    {!snapshot.isDraggingOver && postsByDay[day.key]?.length === 0 && (
                      <Button
                        variant="ghost"
                        onClick={() => onCreatePost(day.key)}
                        className="w-full h-20 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50 transition-colors"
                      >
                        <div className="text-center">
                          <Plus className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Ajouter un post
                          </span>
                        </div>
                      </Button>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CalendarView;