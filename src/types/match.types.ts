import { UserProfile } from './auth.types';

export type SwipeType = 'like' | 'pass';

export interface SwipeRecord {
  id: string; // `${fromUserId}_${toUserId}`
  fromUserId: string;
  toUserId: string;
  action: SwipeType;
  createdAt: any;
}

export interface MatchRecord {
  id: string; // `${minUid}_${maxUid}`
  users: [string, string];
  matchedAt: any;
  lastMessage?: string;
  lastMessageAt?: any;
  lastMessageSenderId?: string;
  isBlocked?: boolean;
  blockedBy?: string | null;
}

export interface MatchWithUser extends MatchRecord {
  otherUser: UserProfile;
}

export interface BlockRecord {
  id: string; // `${blockerId}_${blockedUserId}`
  blockerId: string;
  blockedUserId: string;
  blockedAt: any;
  reason?: string;
}

export interface BlockedUserWithProfile extends BlockRecord {
  user: UserProfile;
}

export interface SwipeResult {
  isMatch: boolean;
  match?: MatchRecord;
  targetUser?: UserProfile;
}
