import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from './Chat.styles';
import { AppIcon } from '@/components';
import { COLORS, ICON_NAMES, SCREEN_NAMES } from '@/constants';
import {
  getCurrentUser,
  onChatConversationsSnapshot,
  onMatchesSnapshot,
  onMessagesSnapshot,
  sendMessage,
  blockUser,
} from '@/services';
import {
  ChatConversation,
  ChatMessage,
  MatchWithUser,
  UserProfile,
} from '@/types';
import Loader from '@/components/common/Loader';

export const Chat = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.uid || '';

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [matches, setMatches] = useState<MatchWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Chat Room State
  const [activeConversation, setActiveConversation] =
    useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // 3-dots Menu Modal
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  // Profile View Modal from Chat
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  // Subscribe to Conversations and Matches
  useEffect(() => {
    if (!currentUserId) {
      setIsLoading(false);
      return;
    }

    let unsubConversations = () => {};
    let unsubMatches = () => {};

    try {
      unsubConversations = onChatConversationsSnapshot(
        currentUserId,
        convs => {
          setConversations(convs);
          setIsLoading(false);
        },
        err => {
          console.error('Conversations error:', err);
          setIsLoading(false);
        },
      );

      unsubMatches = onMatchesSnapshot(
        currentUserId,
        mList => {
          setMatches(mList);
        },
        err => {
          console.error('Matches error:', err);
        },
      );
    } catch (e) {
      console.error('Subscription error:', e);
      setIsLoading(false);
    }

    return () => {
      unsubConversations();
      unsubMatches();
    };
  }, [currentUserId]);

  // Handle route params (e.g. from Swipe "Send a Message")
  useEffect(() => {
    if (route.params?.openMatchId && route.params?.targetUser) {
      const matchId = route.params.openMatchId;
      const targetUser = route.params.targetUser as UserProfile;

      setActiveConversation({
        id: matchId,
        otherUser: targetUser,
        lastMessage: 'You matched! Say hello 👋',
        matchedAt: new Date(),
      });
    }
  }, [route.params]);

  // Subscribe to messages when active conversation opens
  useEffect(() => {
    if (!activeConversation?.id) {
      setMessages([]);
      return;
    }

    const unsubMessages = onMessagesSnapshot(
      activeConversation.id,
      msgs => {
        setMessages(msgs);
      },
      err => {
        console.error('Messages snapshot error:', err);
      },
    );

    return () => unsubMessages();
  }, [activeConversation?.id]);

  // Filter conversations & matches based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase().trim();
    return conversations.filter(c =>
      c.otherUser?.name?.toLowerCase().includes(query),
    );
  }, [conversations, searchQuery]);

  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return matches;
    const query = searchQuery.toLowerCase().trim();
    return matches.filter(m =>
      m.otherUser?.name?.toLowerCase().includes(query),
    );
  }, [matches, searchQuery]);

  // Open Chat Room from Matches Row
  const handleOpenMatchChat = (match: MatchWithUser) => {
    setActiveConversation({
      id: match.id,
      otherUser: match.otherUser,
      lastMessage: match.lastMessage || 'Say hello 👋',
      lastMessageAt: match.lastMessageAt || match.matchedAt,
      matchedAt: match.matchedAt,
    });
  };

  // Open Chat Room from Conversation List
  const handleOpenConversation = (item: ChatConversation) => {
    setActiveConversation(item);
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeConversation || !currentUserId || isSending)
      return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      await sendMessage(activeConversation.id, currentUserId, messageText);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not send message.');
    } finally {
      setIsSending(false);
    }
  };

  // Block User action with confirmation
  const handleBlockUser = () => {
    if (!activeConversation || !currentUserId) return;

    const targetUser = activeConversation.otherUser;
    const userName = targetUser?.name || 'this user';

    setIsActionModalVisible(false);

    Alert.alert(
      `Block ${userName}?`,
      `They will no longer appear in your chat or swipe stack. You can unblock them anytime from your Profile settings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block User',
          style: 'destructive',
          onPress: async () => {
            try {
              await blockUser(currentUserId, targetUser.uid);
              setActiveConversation(null);
              Alert.alert(
                'User Blocked',
                `${userName} has been blocked and removed from your chats.`,
              );
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Could not block user.');
            }
          },
        },
      ],
    );
  };

  // Timestamp formatter helper
  const formatTime = (ts: any) => {
    if (!ts) return '';
    let date: Date;
    if (ts?.toDate && typeof ts.toDate === 'function') {
      date = ts.toDate();
    } else if (ts?.seconds) {
      date = new Date(ts.seconds * 1000);
    } else if (typeof ts === 'number') {
      date = new Date(ts);
    } else {
      date = new Date(ts);
    }
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const isToday =
      now.getDate() === date.getDate() &&
      now.getMonth() === date.getMonth() &&
      now.getFullYear() === date.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <Loader/>
    );
  }

  const hasAnyMatches = matches.length > 0 || conversations.length > 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Messages</Text>
          {conversations.length > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {conversations.length}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate(SCREEN_NAMES.SWIPE)}
            activeOpacity={0.7}
          >
            <AppIcon name={ICON_NAMES.HEART} size={22} color={COLORS.tinderRed} />
          </TouchableOpacity>
        </View>
      </View>

      {!hasAnyMatches ? (
        /* Empty State */
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <AppIcon
              name={ICON_NAMES.CHAT_BUBBLE}
              size={48}
              color={COLORS.tinderRed}
            />
          </View>
          <Text style={styles.emptyTitle}>Get Swiping</Text>
          <Text style={styles.emptySubtitle}>
            When you match with other people on Tinder, you'll be able to chat
            with them right here.
          </Text>
          <TouchableOpacity
            style={styles.emptyActionButton}
            onPress={() => navigation.navigate(SCREEN_NAMES.SWIPE)}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyActionText}>Start Swiping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Box */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputRow}>
              <AppIcon
                name={ICON_NAMES.SEARCH}
                size={18}
                color={COLORS.textSubtle}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search matches..."
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <AppIcon
                    name={ICON_NAMES.CLOSE}
                    size={16}
                    color={COLORS.textSubtle}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* New Matches Row (Horizontal) */}
          {filteredMatches.length > 0 && (
            <View style={styles.matchesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New Matches</Text>
                <Text style={styles.sectionCount}>
                  {filteredMatches.length}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.matchesScrollContent}
              >
                {filteredMatches.map(matchItem => {
                  const partner = matchItem.otherUser;
                  const photoUri = partner?.images?.[0] || '';
                  return (
                    <TouchableOpacity
                      key={matchItem.id}
                      style={styles.newMatchCard}
                      onPress={() => handleOpenMatchChat(matchItem)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.newMatchAvatarRing}>
                        {photoUri ? (
                          <Image
                            source={{ uri: photoUri }}
                            style={styles.newMatchAvatar}
                          />
                        ) : (
                          <View
                            style={[
                              styles.newMatchAvatar,
                              {
                                justifyContent: 'center',
                                alignItems: 'center',
                              },
                            ]}
                          >
                            <AppIcon
                              name={ICON_NAMES.PERSON}
                              size={26}
                              color={COLORS.textSubtle}
                            />
                          </View>
                        )}
                      </View>
                      <View style={styles.newMatchOnlineDot} />
                      <Text style={styles.newMatchName} numberOfLines={1}>
                        {partner?.name || 'Match'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Conversations Vertical List */}
          <View style={styles.messagesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Messages</Text>
            </View>

            {filteredConversations.length === 0 ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ color: COLORS.textSubtle, fontSize: 14 }}>
                  {searchQuery
                    ? 'No conversations found.'
                    : 'Tap on a new match above to say hello!'}
                </Text>
              </View>
            ) : (
              filteredConversations.map(conv => {
                const partner = conv.otherUser;
                const photoUri = partner?.images?.[0] || '';
                const isUnread = Boolean(conv.unreadCount && conv.unreadCount > 0);

                return (
                  <TouchableOpacity
                    key={conv.id}
                    style={styles.conversationItem}
                    onPress={() => handleOpenConversation(conv)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.conversationAvatarContainer}>
                      {photoUri ? (
                        <Image
                          source={{ uri: photoUri }}
                          style={styles.conversationAvatar}
                        />
                      ) : (
                        <View
                          style={[
                            styles.conversationAvatar,
                            {
                              justifyContent: 'center',
                              alignItems: 'center',
                            },
                          ]}
                        >
                          <AppIcon
                            name={ICON_NAMES.PERSON}
                            size={26}
                            color={COLORS.textSubtle}
                          />
                        </View>
                      )}
                      <View style={styles.conversationOnlineDot} />
                    </View>

                    <View style={styles.conversationContent}>
                      <View style={styles.conversationTopRow}>
                        <Text style={styles.conversationName}>
                          {partner?.name || 'Match'}{' '}
                          {partner?.age ? `, ${partner.age}` : ''}
                        </Text>
                        <Text style={styles.conversationTime}>
                          {formatTime(conv.lastMessageAt)}
                        </Text>
                      </View>

                      <View style={styles.conversationBottomRow}>
                        <Text
                          style={[
                            styles.conversationLastMessage,
                            isUnread && styles.conversationLastMessageUnread,
                          ]}
                          numberOfLines={1}
                        >
                          {conv.lastMessage || 'Say hello 👋'}
                        </Text>
                        {isUnread && <View style={styles.unreadDot} />}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      {/* CHAT ROOM MODAL (FULL-SCREEN 1-ON-1 CHAT) */}
      <Modal
        visible={Boolean(activeConversation)}
        animationType="slide"
        onRequestClose={() => setActiveConversation(null)}
      >
        {activeConversation && (
          <KeyboardAvoidingView
            style={styles.chatRoomContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Chat Room Header */}
            <View style={styles.chatRoomHeader}>
              <View style={styles.chatRoomHeaderLeft}>
                <TouchableOpacity
                  style={styles.chatRoomBackBtn}
                  onPress={() => setActiveConversation(null)}
                >
                  <AppIcon
                    name={ICON_NAMES.BACK_ARROW}
                    size={24}
                    color={COLORS.textDark}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chatRoomUserSection}
                  onPress={() => setIsProfileModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{
                      uri: activeConversation.otherUser?.images?.[0] || '',
                    }}
                    style={styles.chatRoomHeaderAvatar}
                  />
                  <View>
                    <Text style={styles.chatRoomUserName}>
                      {activeConversation.otherUser?.name || 'Match'}
                    </Text>
                    <Text style={styles.chatRoomUserStatus}>Active Now</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* 3-Dots Action Button */}
              <View style={styles.chatRoomHeaderRight}>
                <TouchableOpacity
                  style={styles.chatRoomMenuBtn}
                  onPress={() => setIsActionModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <AppIcon
                    name={ICON_NAMES.ELLIPSIS_VERTICAL}
                    size={22}
                    color={COLORS.textDark}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Inverted Messages List */}
            <FlatList
              data={messages}
              keyExtractor={item => item.id}
              inverted
              contentContainerStyle={styles.chatMessagesList}
              ListFooterComponent={
                /* Intro Banner at Top of Chat (rendered as footer because list is inverted) */
                <View style={styles.chatMatchIntro}>
                  <Image
                    source={{
                      uri: activeConversation.otherUser?.images?.[0] || '',
                    }}
                    style={styles.chatMatchIntroAvatar}
                  />
                  <Text style={styles.chatMatchIntroTitle}>
                    You matched with {activeConversation.otherUser?.name || 'them'}!
                  </Text>
                  <Text style={styles.chatMatchIntroSubtitle}>
                    {activeConversation.otherUser?.city
                      ? `Lives in ${activeConversation.otherUser.city}`
                      : 'Send a message to break the ice!'}
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const isMe = item.senderId === currentUserId;
                return (
                  <View
                    style={[
                      styles.messageRow,
                      isMe ? styles.messageRowMe : styles.messageRowOther,
                    ]}
                  >
                    <View
                      style={[
                        styles.bubble,
                        isMe ? styles.bubbleMe : styles.bubbleOther,
                      ]}
                    >
                      <Text
                        style={
                          isMe ? styles.messageTextMe : styles.messageTextOther
                        }
                      >
                        {item.text}
                      </Text>
                    </View>
                    <Text
                      style={
                        isMe ? styles.messageTimeMe : styles.messageTimeOther
                      }
                    >
                      {formatTime(item.createdAt)}
                    </Text>
                  </View>
                );
              }}
            />

            {/* Input Bar */}
            <View style={styles.chatInputBar}>
              <TextInput
                style={styles.chatInputField}
                placeholder="Type a message..."
                placeholderTextColor={COLORS.textMuted}
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.chatSendButton,
                  (!inputText.trim() || isSending) &&
                    styles.chatSendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isSending}
                activeOpacity={0.8}
              >
                <AppIcon name={ICON_NAMES.SEND} size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </Modal>

      {/* 3-DOTS ACTION SHEET MODAL */}
      <Modal
        visible={isActionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsActionModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.actionModalOverlay}
          activeOpacity={1}
          onPress={() => setIsActionModalVisible(false)}
        >
          <View style={styles.actionModalContent}>
            <View style={styles.actionModalHandle} />
            <Text style={styles.actionModalTitle}>
              {activeConversation?.otherUser?.name || 'User'} Options
            </Text>

            {/* View Profile */}
            <TouchableOpacity
              style={styles.actionModalOption}
              onPress={() => {
                setIsActionModalVisible(false);
                setIsProfileModalVisible(true);
              }}
            >
              <AppIcon
                name={ICON_NAMES.PERSON_OUTLINE}
                size={22}
                color={COLORS.textDark}
              />
              <Text style={styles.actionModalOptionText}>View Profile</Text>
            </TouchableOpacity>

            {/* Block User */}
            <TouchableOpacity
              style={styles.actionModalOption}
              onPress={handleBlockUser}
            >
              <AppIcon name={ICON_NAMES.BAN} size={22} color="#EF4444" />
              <Text
                style={[
                  styles.actionModalOptionText,
                  styles.actionModalOptionDestructive,
                ]}
              >
                Block {activeConversation?.otherUser?.name || 'User'}
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.actionModalCancelBtn}
              onPress={() => setIsActionModalVisible(false)}
            >
              <Text style={styles.actionModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* VIEW PROFILE MODAL FROM CHAT */}
      <Modal
        visible={isProfileModalVisible}
        animationType="slide"
        onRequestClose={() => setIsProfileModalVisible(false)}
      >
        {activeConversation?.otherUser && (
          <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 44,
                right: 18,
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 20,
              }}
              onPress={() => setIsProfileModalVisible(false)}
            >
              <AppIcon name={ICON_NAMES.CLOSE} size={22} color={COLORS.white} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              <Image
                source={{
                  uri: activeConversation.otherUser.images?.[0] || '',
                }}
                style={{ width: '100%', height: 420 }}
                resizeMode="cover"
              />
              <View style={{ padding: 20 }}>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: 'bold',
                    color: COLORS.textDark,
                  }}
                >
                  {activeConversation.otherUser.name || 'User'}
                  {activeConversation.otherUser.age
                    ? `, ${activeConversation.otherUser.age}`
                    : ''}
                </Text>
                {activeConversation.otherUser.city ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 8,
                    }}
                  >
                    <AppIcon
                      name={ICON_NAMES.LOCATION}
                      size={16}
                      color={COLORS.tinderRed}
                    />
                    <Text style={{ fontSize: 14, color: COLORS.textDark }}>
                      Lives in {activeConversation.otherUser.city}
                    </Text>
                  </View>
                ) : null}

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 18,
                    marginBottom: 6,
                  }}
                >
                  About
                </Text>
                <Text
                  style={{ fontSize: 14, color: COLORS.textSubtle, lineHeight: 22 }}
                >
                  {activeConversation.otherUser.bio ||
                    activeConversation.otherUser.about ||
                    'No bio provided.'}
                </Text>

                {activeConversation.otherUser.hobbies &&
                  activeConversation.otherUser.hobbies.length > 0 && (
                    <>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginTop: 18,
                          marginBottom: 8,
                        }}
                      >
                        Passions
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: 8,
                        }}
                      >
                        {activeConversation.otherUser.hobbies.map((h, i) => (
                          <View
                            key={i}
                            style={{
                              backgroundColor: '#FEE2E2',
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 14,
                            }}
                          >
                            <Text
                              style={{
                                color: COLORS.tinderRed,
                                fontWeight: '600',
                                fontSize: 12,
                              }}
                            >
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

export default Chat;