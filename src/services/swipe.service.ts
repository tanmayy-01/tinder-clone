import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  limit,
} from '@react-native-firebase/firestore';
import {
  MatchRecord,
  MatchWithUser,
  SwipeResult,
  SwipeType,
  UserProfile,
} from '@/types';
import { getAllBlockedUserIds, getMatchId } from './block.service';

/**
 * Fetch discovery users for the Swipe card deck:
 * - Excludes current user
 * - Excludes users already swiped on (liked or passed)
 * - Excludes blocked users and users who blocked current user
 */
export const getDiscoveryUsers = async (
  currentUserId: string,
  fetchLimit: number = 30,
): Promise<UserProfile[]> => {
  if (!currentUserId) return [];

  const db = getFirestore();

  // 1. Get blocked user IDs
  const blockedIds = await getAllBlockedUserIds(currentUserId);
  const blockedSet = new Set(blockedIds);
  blockedSet.add(currentUserId);

  // 2. Get all user IDs current user has already swiped on
  const swipedQuery = query(
    collection(db, 'swipes'),
    where('fromUserId', '==', currentUserId),
  );
  const swipedSnap = await getDocs(swipedQuery);
  const swipedSet = new Set<string>();
  swipedSnap.forEach(docSnap => {
    const data = docSnap.data();
    if (data?.toUserId) {
      swipedSet.add(data.toUserId);
    }
  });

  // 3. Query all users from 'users' collection
  const usersQuery = query(collection(db, 'users'), limit(fetchLimit * 2));
  const usersSnap = await getDocs(usersQuery);

  const discoveryList: UserProfile[] = [];

  usersSnap.forEach(docSnap => {
    const userData = docSnap.data() as UserProfile;
    const uid = userData.uid || docSnap.id;

    // Filter out: self, blocked users, already swiped users
    if (
      !blockedSet.has(uid) &&
      !swipedSet.has(uid) &&
      userData.images &&
      userData.images.length > 0
    ) {
      discoveryList.push({
        ...userData,
        uid,
      });
    }
  });

  return discoveryList.slice(0, fetchLimit);
};

/**
 * Record a swipe (like or pass):
 * - Writes swipe to 'swipes' collection
 * - If action is 'like', checks if target user has already liked current user (mutual like)
 * - If mutual like -> creates match in 'matches' collection
 * - Returns SwipeResult with isMatch and match details
 */
export const recordSwipe = async (
  currentUserId: string,
  targetUserId: string,
  action: SwipeType,
): Promise<SwipeResult> => {
  if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
    throw new Error('Invalid user IDs for swipe.');
  }

  const db = getFirestore();
  const swipeId = `${currentUserId}_${targetUserId}`;
  const swipeRef = doc(db, 'swipes', swipeId);

  // 1. Record this swipe
  await setDoc(swipeRef, {
    id: swipeId,
    fromUserId: currentUserId,
    toUserId: targetUserId,
    action,
    createdAt: serverTimestamp(),
  });

  // 2. If it's a pass, no match is possible
  if (action === 'pass') {
    return { isMatch: false };
  }

  // 3. Check if target user previously swiped 'like' on current user
  const reciprocalSwipeId = `${targetUserId}_${currentUserId}`;
  const reciprocalSwipeRef = doc(db, 'swipes', reciprocalSwipeId);
  const reciprocalSwipeSnap = await getDoc(reciprocalSwipeRef);

  if (reciprocalSwipeSnap.exists()) {
    const reciprocalData = reciprocalSwipeSnap.data();

    if (reciprocalData?.action === 'like') {
      // It's a MATCH!
      const matchId = getMatchId(currentUserId, targetUserId);
      const matchRef = doc(db, 'matches', matchId);

      const matchData: MatchRecord = {
        id: matchId,
        users: [currentUserId, targetUserId],
        matchedAt: serverTimestamp(),
        lastMessage: 'You matched! Say hello 👋',
        lastMessageAt: serverTimestamp(),
        lastMessageSenderId: '',
        isBlocked: false,
        blockedBy: null,
      };

      await setDoc(matchRef, matchData, { merge: true });

      // Fetch target user profile for the match modal
      const targetUserRef = doc(db, 'users', targetUserId);
      const targetUserDoc = await getDoc(targetUserRef);
      const targetUserProfile = targetUserDoc.exists()
        ? (targetUserDoc.data() as UserProfile)
        : undefined;

      return {
        isMatch: true,
        match: matchData,
        targetUser: targetUserProfile,
      };
    }
  }

  return { isMatch: false };
};

/**
 * Fetch all matches for the current user:
 * - Excludes blocked matches
 * - Populates the other user's profile
 */
export const getMatches = async (
  currentUserId: string,
): Promise<MatchWithUser[]> => {
  if (!currentUserId) return [];

  const db = getFirestore();
  const matchesQuery = query(
    collection(db, 'matches'),
    where('users', 'array-contains', currentUserId),
  );

  const snapshot = await getDocs(matchesQuery);
  const matchesList: MatchWithUser[] = [];

  for (const docSnap of snapshot.docs) {
    const matchData = docSnap.data() as MatchRecord;

    // Skip if blocked
    if (matchData.isBlocked) continue;

    // Find the other user's UID
    const otherUid = matchData.users.find(id => id !== currentUserId);
    if (!otherUid) continue;

    const otherUserDoc = await getDoc(doc(db, 'users', otherUid));
    if (otherUserDoc.exists()) {
      matchesList.push({
        ...matchData,
        otherUser: otherUserDoc.data() as UserProfile,
      });
    }
  }

  // Sort by matchedAt descending
  return matchesList.sort((a, b) => {
    const timeA = a.matchedAt?.seconds || 0;
    const timeB = b.matchedAt?.seconds || 0;
    return timeB - timeA;
  });
};

/**
 * Real-time listener for current user's matches:
 * - Filters out blocked matches
 * - Automatically populates each match partner's profile
 */
export const onMatchesSnapshot = (
  currentUserId: string,
  onUpdate: (matches: MatchWithUser[]) => void,
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
        const matchesList: MatchWithUser[] = [];

        for (const docSnap of snapshot.docs) {
          const matchData = docSnap.data() as MatchRecord;

          if (matchData.isBlocked) continue;

          const otherUid = matchData.users.find(id => id !== currentUserId);
          if (!otherUid) continue;

          const otherUserDoc = await getDoc(doc(db, 'users', otherUid));
          if (otherUserDoc.exists()) {
            matchesList.push({
              ...matchData,
              otherUser: otherUserDoc.data() as UserProfile,
            });
          }
        }

        matchesList.sort((a, b) => {
          const timeA = a.matchedAt?.seconds || 0;
          const timeB = b.matchedAt?.seconds || 0;
          return timeB - timeA;
        });

        onUpdate(matchesList);
      } catch (err) {
        if (onError) onError(err);
      }
    },
    error => {
      if (onError) onError(error);
    },
  );
};
