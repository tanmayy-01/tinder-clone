import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { BlockedUserWithProfile, UserProfile } from '@/types';

/**
 * Deterministic match ID generator
 */
export const getMatchId = (uidA: string, uidB: string): string => {
  return [uidA, uidB].sort().join('_');
};

/**
 * Block a user:
 * - Records block in 'blocks' collection
 * - Updates any active match to isBlocked: true so it won't appear in chats
 */
export const blockUser = async (
  currentUserId: string,
  targetUserId: string,
  reason?: string,
): Promise<void> => {
  if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
    throw new Error('Invalid user IDs for block operation.');
  }

  const db = getFirestore();
  const blockId = `${currentUserId}_${targetUserId}`;
  const blockRef = doc(db, 'blocks', blockId);

  // 1. Create block record
  await setDoc(blockRef, {
    id: blockId,
    blockerId: currentUserId,
    blockedUserId: targetUserId,
    reason: reason || 'Blocked by user',
    blockedAt: serverTimestamp(),
  });

  // 2. If a match exists between them, mark it blocked
  const matchId = getMatchId(currentUserId, targetUserId);
  const matchRef = doc(db, 'matches', matchId);
  const matchDoc = await getDoc(matchRef);

  if (matchDoc.exists()) {
    await setDoc(
      matchRef,
      {
        isBlocked: true,
        blockedBy: currentUserId,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
};

/**
 * Unblock a user:
 * - Deletes block record from 'blocks' collection
 * - If a match exists and other user has not blocked, resets isBlocked: false
 */
export const unblockUser = async (
  currentUserId: string,
  targetUserId: string,
): Promise<void> => {
  if (!currentUserId || !targetUserId) {
    throw new Error('Invalid user IDs for unblock operation.');
  }

  const db = getFirestore();
  const blockId = `${currentUserId}_${targetUserId}`;
  const blockRef = doc(db, 'blocks', blockId);

  // 1. Delete block record
  await deleteDoc(blockRef);

  // 2. Check if the other user has blocked the current user
  const otherBlockRef = doc(db, 'blocks', `${targetUserId}_${currentUserId}`);
  const otherBlockDoc = await getDoc(otherBlockRef);
  const isOtherBlocking = otherBlockDoc.exists();

  // 3. Update match if exists
  const matchId = getMatchId(currentUserId, targetUserId);
  const matchRef = doc(db, 'matches', matchId);
  const matchDoc = await getDoc(matchRef);

  if (matchDoc.exists()) {
    if (!isOtherBlocking) {
      await setDoc(
        matchRef,
        {
          isBlocked: false,
          blockedBy: null,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    } else {
      await setDoc(
        matchRef,
        {
          isBlocked: true,
          blockedBy: targetUserId,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }
  }
};

/**
 * Check if current user has blocked target user
 */
export const hasBlocked = async (
  currentUserId: string,
  targetUserId: string,
): Promise<boolean> => {
  const db = getFirestore();
  const blockRef = doc(db, 'blocks', `${currentUserId}_${targetUserId}`);
  const blockDoc = await getDoc(blockRef);
  return blockDoc.exists();
};

/**
 * Check if either user has blocked the other
 */
export const hasBlockRelationship = async (
  userA: string,
  userB: string,
): Promise<boolean> => {
  const [blockedA, blockedB] = await Promise.all([
    hasBlocked(userA, userB),
    hasBlocked(userB, userA),
  ]);
  return blockedA || blockedB;
};

/**
 * Get all user IDs involved in blocks (both blocked by me and blocked me)
 */
export const getAllBlockedUserIds = async (
  currentUserId: string,
): Promise<string[]> => {
  const db = getFirestore();
  const blockedIds = new Set<string>();

  // 1. Users I blocked
  const myBlocksQuery = query(
    collection(db, 'blocks'),
    where('blockerId', '==', currentUserId),
  );
  const myBlocksSnap = await getDocs(myBlocksQuery);
  myBlocksSnap.forEach(docSnap => {
    const data = docSnap.data();
    if (data?.blockedUserId) {
      blockedIds.add(data.blockedUserId);
    }
  });

  // 2. Users who blocked me
  const blockedMeQuery = query(
    collection(db, 'blocks'),
    where('blockedUserId', '==', currentUserId),
  );
  const blockedMeSnap = await getDocs(blockedMeQuery);
  blockedMeSnap.forEach(docSnap => {
    const data = docSnap.data();
    if (data?.blockerId) {
      blockedIds.add(data.blockerId);
    }
  });

  return Array.from(blockedIds);
};

/**
 * Fetch all blocked users for the current user with populated profiles (for Profile > Blocked Users section)
 */
export const getBlockedUsersWithProfiles = async (
  currentUserId: string,
): Promise<BlockedUserWithProfile[]> => {
  const db = getFirestore();
  const myBlocksQuery = query(
    collection(db, 'blocks'),
    where('blockerId', '==', currentUserId),
  );

  const snapshot = await getDocs(myBlocksQuery);
  const results: BlockedUserWithProfile[] = [];

  for (const docSnap of snapshot.docs) {
    const blockData = docSnap.data();
    const blockedUserId = blockData.blockedUserId;

    if (blockedUserId) {
      const userRef = doc(db, 'users', blockedUserId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userProfile = userDoc.data() as UserProfile;
        results.push({
          id: blockData.id || docSnap.id,
          blockerId: blockData.blockerId,
          blockedUserId: blockData.blockedUserId,
          blockedAt: blockData.blockedAt,
          reason: blockData.reason,
          user: userProfile,
        });
      }
    }
  }

  return results;
};

/**
 * Real-time listener for blocked users of current user (for Profile > Blocked Users screen)
 */
export const onBlockedUsersSnapshot = (
  currentUserId: string,
  onUpdate: (blockedUsers: BlockedUserWithProfile[]) => void,
  onError?: (error: any) => void,
): (() => void) => {
  const db = getFirestore();
  const myBlocksQuery = query(
    collection(db, 'blocks'),
    where('blockerId', '==', currentUserId),
  );

  return onSnapshot(
    myBlocksQuery,
    async snapshot => {
      try {
        const list: BlockedUserWithProfile[] = [];
        for (const docSnap of snapshot.docs) {
          const blockData = docSnap.data();
          const blockedUserId = blockData.blockedUserId;

          if (blockedUserId) {
            const userRef = doc(db, 'users', blockedUserId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              list.push({
                id: blockData.id || docSnap.id,
                blockerId: blockData.blockerId,
                blockedUserId: blockData.blockedUserId,
                blockedAt: blockData.blockedAt,
                reason: blockData.reason,
                user: userDoc.data() as UserProfile,
              });
            }
          }
        }
        onUpdate(list);
      } catch (err) {
        if (onError) onError(err);
      }
    },
    error => {
      if (onError) onError(error);
    },
  );
};
