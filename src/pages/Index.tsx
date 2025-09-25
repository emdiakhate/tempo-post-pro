import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import CalendarHeader from '@/components/CalendarHeader';
import CalendarView from '@/components/CalendarView';
import PostCreationModal from '@/components/PostCreationModal';
import { Post } from '@/types/Post';
import { samplePosts } from '@/data/sampleData';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDayColumn, setSelectedDayColumn] = useState<string>('monday');
  const { toast } = useToast();

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handlePostsChange = (newPosts: Post[]) => {
    setPosts(newPosts);
  };

  const handleCreatePost = (dayColumn: string) => {
    setSelectedDayColumn(dayColumn);
    setIsCreateModalOpen(true);
  };

  const handleSavePost = (newPost: Omit<Post, 'id'>) => {
    const post: Post = {
      ...newPost,
      id: `post-${Date.now()}`,
    };
    
    setPosts(prevPosts => [...prevPosts, post]);
    
    toast({
      title: "Publication créée",
      description: "Votre publication a été programmée avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <CalendarHeader
          currentDate={currentDate}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Calendar View */}
        <CalendarView
          posts={posts}
          currentDate={currentDate}
          onPostsChange={handlePostsChange}
          onCreatePost={handleCreatePost}
        />
      </div>

      {/* Post Creation Modal */}
      <PostCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSavePost}
        initialDayColumn={selectedDayColumn}
      />
    </div>
  );
};

export default Index;
