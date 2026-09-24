import { User } from './user.model';

export interface Message {
  id: number;
  content: string;
  read: boolean;
  senderId: number;
  receiverId: number;
  createdAt: string;
}

export interface Conversation {
  user: User;
  lastMessage: Message;
}
