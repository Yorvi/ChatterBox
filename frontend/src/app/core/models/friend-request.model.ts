import { User } from './user.model';

export interface FriendRequest {
  id: number;
  status: 'pending' | 'accepted' | 'rejected';
  senderId: number;
  receiverId: number;
  createdAt: string;
  sender?: User;
  receiver?: User;
}
