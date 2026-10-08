import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { styles, CARD_WIDTH } from './Swipe.styles';
import { AppIcon, Button } from '@/components';
import { COLORS, ICON_NAMES, SCREEN_NAMES } from '@/constants';
import {
  getDiscoveryUsers,
  recordSwipe,
  getCurrentUser,
} from '@/services';
import { UserProfile, MatchRecord } from '@/types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Loader from '@/components/common/Loader';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 0.25 * width;
const SWIPE_OUT_DURATION = 250;

export const Swipe = () => {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [matchedData, setMatchedData] = useState<{
    match: MatchRecord;
    user: UserProfile;
  } | null>(null);
  const [inspectUser, setInspectUser] = useState<UserProfile | null>(null);

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.uid || '';

  const position = useRef(new Animated.ValueXY()).current;
  const historyRef = useRef<{ user: UserProfile; action: 'like' | 'pass' }[]>([]);

  // Load feed users
  const loadUsers = useCallback(async () => {
    if (!currentUserId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const feed = await getDiscoveryUsers(currentUserId);
      setUsers(feed);
      setCurrentIndex(0);
      setPhotoIndex(0);
    } catch (error: any) {
      console.error('Error fetching discovery users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // If stack runs out, refresh on tab focus
  useFocusEffect(
    useCallback(() => {
      if (users.length === 0 || currentIndex >= users.length) {
        loadUsers();
      }
    }, [users.length, currentIndex, loadUsers]),
  );

  // Reset photo index when top card changes
  useEffect(() => {
    setPhotoIndex(0);
  }, [currentIndex]);

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? width + 100 : -width - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = async (direction: 'right' | 'left') => {
    const targetUser = users[currentIndex];
    const action = direction === 'right' ? 'like' : 'pass';

    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(prev => prev + 1);

    if (targetUser && currentUserId) {
      historyRef.current.push({ user: targetUser, action });
      try {
        const result = await recordSwipe(currentUserId, targetUser.uid, action);
        if (result.isMatch && result.match) {
          setMatchedData({
            match: result.match,
            user: result.targetUser || targetUser,
          });
        }
      } catch (err) {
        console.error('Error recording swipe:', err);
      }
    }
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  // PanResponder for card drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10;
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    }),
  ).current;

  // Rotation interpolations
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const rotateAndTranslate = {
    transform: [
      { rotate },
      ...position.getTranslateTransform(),
    ],
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0.95, 1],
    extrapolate: 'clamp',
  });

  // Photo segment navigation
  const handleNextPhoto = (totalPhotos: number) => {
    if (photoIndex < totalPhotos - 1) {
      setPhotoIndex(prev => prev + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex(prev => prev - 1);
    }
  };

  // Rewind
  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      historyRef.current.pop();
    } else {
      Alert.alert('Notice', 'No previous cards to rewind.');
    }
  };

  // Boost
  const handleBoost = () => {
    Alert.alert('⚡ Tinder Boost', 'Your profile is boosted for 30 minutes! Get ready for matches.');
  };

  // Super Like
  const handleSuperLike = () => {
    forceSwipe('right');
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  const activeUser = users[currentIndex];
  const nextUser = users[currentIndex + 1];
  const userPhotos = activeUser?.images || [];
  const currentPhoto = userPhotos[photoIndex] || userPhotos[0] || '';

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <AppIcon name={ICON_NAMES.HEART} size={28} color={COLORS.tinderRed} />
          <Text style={styles.headerTitle}>tinder</Text>
        </View>
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={loadUsers}
            activeOpacity={0.7}
          >
            <AppIcon name={ICON_NAMES.RELOAD} size={18} color={COLORS.textSubtle} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Deck Area */}
      <View style={styles.deckContainer}>
        {currentIndex >= users.length ? (
          /* Empty State */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyRadarCircle}>
              <AppIcon name={ICON_NAMES.HEART} size={54} color={COLORS.tinderRed} />
            </View>
            <Text style={styles.emptyTitle}>There's no one new around you</Text>
            <Text style={styles.emptySubtitle}>
              You've seen all potential matches nearby. Check back later for new people!
            </Text>
            <Button
              title="Refresh Discovery"
              variant="primary"
              onPress={loadUsers}
              style={styles.refreshButton}
            />
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {/* Next Card in Stack (Underneath) */}
            {nextUser && (
              <Animated.View
                style={[
                  styles.card,
                  styles.cardNext,
                  { transform: [{ scale: nextCardScale }] },
                ]}
              >
                <Image
                  source={{ uri: nextUser.images?.[0] }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardOverlay}>
                  <Text style={styles.userName}>
                    {nextUser.name || 'Nearby Match'}{' '}
                    <Text style={styles.userAge}>{nextUser.age || ''}</Text>
                  </Text>
                  {nextUser.city ? (
                    <View style={styles.infoLine}>
                      <AppIcon name={ICON_NAMES.LOCATION} size={14} color={COLORS.white} />
                      <Text style={styles.infoLineText}>Lives in {nextUser.city}</Text>
                    </View>
                  ) : null}
                </View>
              </Animated.View>
            )}

            {/* Top Interactive Card */}
            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.card, rotateAndTranslate]}
            >
              {/* Like Stamp */}
              <Animated.View style={[styles.stamp, styles.stampLike, { opacity: likeOpacity }]}>
                <Text style={[styles.stampText, styles.stampTextLike]}>LIKE</Text>
              </Animated.View>

              {/* Nope Stamp */}
              <Animated.View style={[styles.stamp, styles.stampNope, { opacity: nopeOpacity }]}>
                <Text style={[styles.stampText, styles.stampTextNope]}>NOPE</Text>
              </Animated.View>

              {/* Story Progress Indicators at Top */}
              {userPhotos.length > 1 && (
                <View style={styles.storyBarsContainer}>
                  {userPhotos.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.storyBar,
                        idx === photoIndex && styles.storyBarActive,
                      ]}
                    />
                  ))}
                </View>
              )}

              {/* Left/Right Photo Tap Areas */}
              <TouchableOpacity
                style={styles.photoTapLeft}
                activeOpacity={1}
                onPress={handlePrevPhoto}
              />
              <TouchableOpacity
                style={styles.photoTapRight}
                activeOpacity={1}
                onPress={() => handleNextPhoto(userPhotos.length)}
              />

              {/* Card Photo */}
              <Image
                source={{ uri: currentPhoto }}
                style={styles.cardImage}
                resizeMode="cover"
              />

              {/* Bottom Details Overlay */}
              <View style={styles.cardOverlay}>
                <View style={styles.nameRow}>
                  <View style={styles.nameTextRow}>
                    <Text style={styles.userName}>
                      {activeUser.name || 'New User'}
                    </Text>
                    {activeUser.age ? (
                      <Text style={styles.userAge}>{activeUser.age}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => setInspectUser(activeUser)}
                    activeOpacity={0.8}
                  >
                    <AppIcon
                      name={ICON_NAMES.INFORMATION_CIRCLE}
                      size={20}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                </View>

                {/* Location / Distance Line */}
                {activeUser.city ? (
                  <View style={styles.infoLine}>
                    <AppIcon name={ICON_NAMES.LOCATION} size={15} color={COLORS.white} />
                    <Text style={styles.infoLineText}>Lives in {activeUser.city}</Text>
                  </View>
                ) : null}

                {/* Bio Snippet */}
                {activeUser.bio || activeUser.about ? (
                  <Text style={styles.bioPreview} numberOfLines={2}>
                    {activeUser.bio || activeUser.about}
                  </Text>
                ) : null}

                {/* Passions & Hobbies Pills */}
                {activeUser.hobbies && activeUser.hobbies.length > 0 && (
                  <View style={styles.hobbiesRow}>
                    {activeUser.hobbies.slice(0, 3).map((h, i) => (
                      <View key={i} style={styles.hobbyPill}>
                        <Text style={styles.hobbyPillText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Animated.View>
          </View>
        )}
      </View>

      {/* Bottom Floating Action Buttons Bar */}
      {currentIndex < users.length && (
        <View style={styles.actionsBar}>
          {/* Rewind (Yellow) */}
          <TouchableOpacity
            style={styles.actionCircleSmall}
            activeOpacity={0.8}
            onPress={handleRewind}
          >
            <AppIcon name={ICON_NAMES.RELOAD} size={22} color="#F59E0B" />
          </TouchableOpacity>

          {/* Pass / Nope (Red Cross) */}
          <TouchableOpacity
            style={styles.actionCircleLarge}
            activeOpacity={0.8}
            onPress={() => forceSwipe('left')}
          >
            <AppIcon name={ICON_NAMES.CLOSE} size={30} color="#EF4444" />
          </TouchableOpacity>

          {/* Super Like (Blue Star) */}
          <TouchableOpacity
            style={styles.actionCircleSmall}
            activeOpacity={0.8}
            onPress={handleSuperLike}
          >
            <AppIcon name={ICON_NAMES.STAR} size={22} color="#3B82F6" />
          </TouchableOpacity>

          {/* Like / Heart (Green) */}
          <TouchableOpacity
            style={styles.actionCircleLarge}
            activeOpacity={0.8}
            onPress={() => forceSwipe('right')}
          >
            <AppIcon name={ICON_NAMES.HEART} size={30} color="#10B981" />
          </TouchableOpacity>

          {/* Boost (Purple Lightning) */}
          <TouchableOpacity
            style={styles.actionCircleSmall}
            activeOpacity={0.8}
            onPress={handleBoost}
          >
            <AppIcon name={ICON_NAMES.FLASH} size={22} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      )}

      {/* MATCH CELEBRATION MODAL */}
      <Modal
        visible={Boolean(matchedData)}
        transparent
        animationType="fade"
        onRequestClose={() => setMatchedData(null)}
      >
        <View style={styles.matchModalOverlay}>
          <Text style={styles.matchTitle}>It's a Match!</Text>
          <Text style={styles.matchSubtitle}>
            You and {matchedData?.user.name || 'your match'} have liked each other.
          </Text>

          {/* Overlapping Avatars */}
          <View style={styles.matchAvatarsRow}>
            {currentUser?.photoURL || currentUser?.email ? (
              <Image
                source={{
                  uri:
                    currentUser.photoURL ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
                }}
                style={[styles.matchAvatar, styles.matchAvatarLeft]}
              />
            ) : null}

            <Image
              source={{
                uri:
                  matchedData?.user.images?.[0] ||
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
              }}
              style={[styles.matchAvatar, styles.matchAvatarRight]}
            />

            <View style={styles.matchHeartBadge}>
              <AppIcon name={ICON_NAMES.HEART} size={20} color={COLORS.white} />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.matchButtonsContainer}>
            <Button
              title="Send a Message"
              variant="primary"
              onPress={() => {
                const target = matchedData;
                setMatchedData(null);
                navigation.navigate(SCREEN_NAMES.CHAT, {
                  openMatchId: target?.match.id,
                  targetUser: target?.user,
                });
              }}
            />
            <TouchableOpacity
              style={styles.keepSwipingButton}
              onPress={() => setMatchedData(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.keepSwipingText}>Keep Swiping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FULL PROFILE INSPECT MODAL */}
      <Modal
        visible={Boolean(inspectUser)}
        animationType="slide"
        onRequestClose={() => setInspectUser(null)}
      >
        {inspectUser && (
          <View style={styles.detailModalContainer}>
            <TouchableOpacity
              style={styles.detailModalCloseBtn}
              onPress={() => setInspectUser(null)}
              activeOpacity={0.8}
            >
              <AppIcon name={ICON_NAMES.CLOSE} size={22} color={COLORS.white} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.detailModalScroll} showsVerticalScrollIndicator={false}>
              <Image
                source={{ uri: inspectUser.images?.[0] }}
                style={styles.detailModalPhoto}
                resizeMode="cover"
              />

              <View style={styles.detailModalBody}>
                <Text style={styles.detailModalName}>
                  {inspectUser.name || 'User'}, {inspectUser.age || ''}
                </Text>

                {inspectUser.city ? (
                  <View style={[styles.infoLine, { marginTop: 8 }]}>
                    <AppIcon name={ICON_NAMES.LOCATION} size={16} color={COLORS.tinderRed} />
                    <Text style={[styles.infoLineText, { color: COLORS.textDark }]}>
                      Lives in {inspectUser.city}
                    </Text>
                  </View>
                ) : null}

                <Text style={styles.detailModalBioTitle}>About</Text>
                <Text style={styles.detailModalBio}>
                  {inspectUser.bio || inspectUser.about || 'No bio provided.'}
                </Text>

                {inspectUser.hobbies && inspectUser.hobbies.length > 0 && (
                  <>
                    <Text style={styles.detailModalBioTitle}>Passions</Text>
                    <View style={styles.hobbiesRow}>
                      {inspectUser.hobbies.map((h, i) => (
                        <View key={i} style={[styles.hobbyPill, { backgroundColor: '#FEE2E2' }]}>
                          <Text style={[styles.hobbyPillText, { color: COLORS.tinderRed }]}>
                            {h}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default Swipe;