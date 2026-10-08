import {
  getFirestore,
  doc,
  collection,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { ChatConversation, ChatMessage, MatchRecord, UserProfile } from '@/types';

/**
 * Fetch all active chat conversations for the current user:
 * - Excludes blocked conversations
 * - Populates the partner's profile
 * - Sorted by last message timestamp descending
 */
export const getChatConversations = async (
  currentUserId: string,
): Promise<ChatConversation[]> => {
  if (!currentUserId) return [];

  const db = getFirestore();
  const matchesQuery = query(
    collection(db, 'matches'),
    where('users', 'array-contains', currentUserId),
  );

  const snapshot = await getDocs(matchesQuery);
  const conversations: ChatConversation[] = [];

  for (const docSnap of snapshot.docs) {
    const matchData = docSnap.data() as MatchRecord;

    // Filter out blocked users
    if (matchData.isBlocked) continue;

    const otherUid = matchData.users.find(id => id !== currentUserId);
    if (!otherUid) continue;

    const otherUserDoc = await getDoc(doc(db, 'users', otherUid));
    if (otherUserDoc.exists()) {
      conversations.push({
        id: docSnap.id,
        otherUser: otherUserDoc.data() as UserProfile,
        lastMessage: matchData.lastMessage || 'Say hello 👋',
        lastMessageAt: matchData.lastMessageAt || matchData.matchedAt,
        lastMessageSenderId: matchData.lastMessageSenderId,
        matchedAt: matchData.matchedAt,
        isBlocked: matchData.isBlocked,
      });
    }
  }

  return conversations.sort((a, b) => {
    const timeA = a.lastMessageAt?.seconds || a.matchedAt?.seconds || 0;
    const timeB = b.lastMessageAt?.seconds || b.matchedAt?.seconds || 0;
    return timeB - timeA;
  });
};

/**
 * Real-time listener for current user's chat conversations list:
 * - Automatically ignores blocked users
 * - Re-sorts when new messages arrive
 */
export const onChatConversationsSnapshot = (
  currentUserId: string,
  onUpdate: (conversations: ChatConversation[]) => void,
  onError?: (error: any) => void,
): (() => void) => {
  if (!currentUserId) {
    onUpdate([]);
    return () => {};
  }

  const db = getFirestore();
  const matchesQuery = query(
    collection(db, 'matches'),
    where('users', 'array-contains', currentUserId),
  );

  return onSnapshot(
    matchesQuery,
    async snapshot => {
      try {
        const conversations: ChatConversation[] = [];

        for (const docSnap of snapshot.docs) {
          const matchData = docSnap.data() as MatchRecord;

          // Blocked users will not appear in the chat section
          if (matchData.isBlocked) continue;

          const otherUid = matchData.users.find(id => id !== currentUserId);
          if (!otherUid) continue;

          const otherUserDoc = await getDoc(doc(db, 'users', otherUid));
          if (otherUserDoc.exists()) {
            conversations.push({
              id: docSnap.id,
              otherUser: otherUserDoc.data() as UserProfile,
              lastMessage: matchData.lastMessage || 'Say hello 👋',
              lastMessageAt: matchData.lastMessageAt || matchData.matchedAt,
              lastMessageSenderId: matchData.lastMessageSenderId,
              matchedAt: matchData.matchedAt,
              isBlocked: matchData.isBlocked,
            });
          }
        }

        conversations.sort((a, b) => {
          const timeA = a.lastMessageAt?.seconds || a.matchedAt?.seconds || 0;
          const timeB = b.lastMessageAt?.seconds || b.matchedAt?.seconds || 0;
          return timeB - timeA;
        });

        onUpdate(conversations);
      } catch (err) {
        if (onError) onError(err);
      }
    },
    error => {
      if (onError) onError(error);
    },
  );
};

/**
 * Send a message inside a match/chat:
 * - Appends message to subcollection 'matches/{chatId}/messages'
 * - Updates parent match record with lastMessage and lastMessageAt
 */
export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
  imageUri?: string,
): Promise<string> => {
  const cleanText = text.trim();
  if (!chatId || !senderId || (!cleanText && !imageUri)) {
    throw new Error('Message cannot be empty.');
  }

  const db = getFirestore();

  // Verify match is not blocked
  const matchRef = doc(db, 'matches', chatId);
  const matchSnap = await getDoc(matchRef);

  if (!matchSnap.exists()) {
    throw new Error('Chat does not exist.');
  }

  const matchData = matchSnap.data() as MatchRecord;
  if (matchData.isBlocked) {
    throw new Error('Cannot send message. This chat is blocked.');
  }

  // 1. Add message to subcollection
  const messagesCol = collection(db, 'matches', chatId, 'messages');
  const messageDocRef = await addDoc(messagesCol, {
    chatId,
    senderId,
    text: cleanText,
    imageUri: imageUri || null,
    createdAt: serverTimestamp(),
    read: false,
  });

  // 2. Update parent match doc
  await setDoc(
    matchRef,
    {
      lastMessage: cleanText || '📷 Photo',
      lastMessageAt: serverTimestamp(),
      lastMessageSenderId: senderId,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return messageDocRef.id;
};

/**
 * Real-time listener for messages in a chat conversation
 */
export const onMessagesSnapshot = (
  chatId: string,
  onUpdate: (messages: ChatMessage[]) => void,
  onError?: (error: any) => void,
): (() => void) => {
  if (!chatId) {
    onUpdate([]);
    return () => {};
  }

  const db = getFirestore();
  const messagesQuery = query(
    collection(db, 'matches', chatId, 'messages'),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    messagesQuery,
    snapshot => {
      const messages: ChatMessage[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        messages.push({
          id: docSnap.id,
          chatId: data.chatId || chatId,
          senderId: data.senderId,
          text: data.text || '',
          imageUri: data.imageUri || undefined,
          createdAt: data.createdAt,
          read: data.read || false,
        });
      });
      onUpdate(messages);
    },
    error => {
      if (onError) onError(error);
    },
  );
};
