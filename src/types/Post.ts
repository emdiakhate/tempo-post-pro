export type SocialPlatform = 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok';

export type PostStatus = 'scheduled' | 'published' | 'draft' | 'failed' | 'pending';

export interface Post {
  id: string;
  content: string;
  scheduledTime: Date;
  platforms: SocialPlatform[];
  status: PostStatus;
  image?: string;
  campaign?: string;
  campaignColor?: string;
  author: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  dayColumn: string; // e.g., 'sunday', 'monday', etc.
  timeSlot: number; // position in the day column
}

export interface Campaign {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
}