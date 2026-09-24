import { User } from './user.model';

export interface Comment {
  id: number;
  content: string;
  userId: number;
  postId: number;
  parentId: number | null;
  createdAt: string;
  author?: User;
  replies?: Comment[];
}

export interface Post {
  id: number;
  content: string;
  mediaUrl: string | null;
  userId: number;
  createdAt: string;
  author?: User;
  comments?: Comment[];
  likeCount?: number;
  commentCount?: number;
  liked?: boolean;
}
