import { UserProfile } from './auth.types';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  imageUri?: string;
  createdAt: any;
  read?: boolean;
}

export interface ChatConversation {
  id: string; // same as matchId
  otherUser: UserProfile;
  lastMessage?: string;
  lastMessageAt?: any;
  lastMessageSenderId?: string;
  unreadCount?: number;
  matchedAt: any;
  isBlocked?: boolean;
}
