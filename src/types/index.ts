export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;        
  bio?: string;               
  posts_count?: number;       
  comments_count?: number;    
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  created_by: number;
  creator: User;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  topic_id: number;
  topic?: Topic;
  title: string;
  content: string;
  created_by: number;
  creator: User;
  created_at: string;
  updated_at: string;
  vote_count: number;      
  user_vote: number;
}

export interface Comment {
  id: number;
  post_id: number;
  post?: Post;
  content: string;
  created_by: number;
  creator: User;
  parent_id: number | null;
  parent?: Comment;
  replies?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}
export type NotificationType = 'vote' | 'comment' | 'reply';

export interface Notification {
  id: number;
  user_id: number;
  actor_id: number;
  actor: User;
  type: NotificationType;
  post_id?: number;
  post?: Post;
  comment_id?: number;
  comment?: Comment;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}