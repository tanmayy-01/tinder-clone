import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_WEIGHTS } from '@/constants';
import { scale } from '@/lib/size';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: scale.h(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale.w(18),
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale.w(8),
  },
  headerTitle: {
    fontSize: scale.ms(22),
    fontWeight: FONT_WEIGHTS.extraBold,
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  headerBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: scale.w(8),
    paddingVertical: scale.h(2),
    borderRadius: scale.ms(10),
  },
  headerBadgeText: {
    fontSize: scale.ms(12),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.tinderRed,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale.w(8),
  },
  headerIconButton: {
    width: scale.w(38),
    height: scale.w(38),
    borderRadius: scale.w(19),
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Main scroll content
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale.h(30),
  },

  // Search Bar
  searchContainer: {
    paddingHorizontal: scale.w(16),
    paddingVertical: scale.h(10),
    backgroundColor: COLORS.white,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: scale.ms(20),
    paddingHorizontal: scale.w(12),
    height: scale.h(40),
    gap: scale.w(8),
  },
  searchInput: {
    flex: 1,
    fontSize: scale.ms(14),
    color: COLORS.textDark,
    padding: 0,
  },

  // New Matches Horizontal Section
  matchesSection: {
    paddingVertical: scale.h(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale.w(18),
    marginBottom: scale.h(10),
  },
  sectionTitle: {
    fontSize: scale.ms(14),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionCount: {
    fontSize: scale.ms(12),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.tinderRed,
  },
  matchesScrollContent: {
    paddingHorizontal: scale.w(14),
    gap: scale.w(14),
  },
  newMatchCard: {
    alignItems: 'center',
    width: scale.w(76),
  },
  newMatchAvatarRing: {
    width: scale.w(68),
    height: scale.w(68),
    borderRadius: scale.w(34),
    borderWidth: 2.5,
    borderColor: COLORS.tinderRed,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  newMatchAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: scale.w(32),
    backgroundColor: '#E2E8F0',
  },
  newMatchOnlineDot: {
    position: 'absolute',
    bottom: scale.h(2),
    right: scale.w(4),
    width: scale.w(14),
    height: scale.w(14),
    borderRadius: scale.w(7),
    backgroundColor: '#22C55E',
    borderWidth: 2.5,
    borderColor: COLORS.white,
  },
  newMatchName: {
    fontSize: scale.ms(12),
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textDark,
    marginTop: scale.h(6),
    textAlign: 'center',
  },

  // Messages List
  messagesSection: {
    flex: 1,
    paddingTop: scale.h(6),
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale.w(18),
    paddingVertical: scale.h(12),
    backgroundColor: COLORS.white,
  },
  conversationAvatarContainer: {
    position: 'relative',
    marginRight: scale.w(14),
  },
  conversationAvatar: {
    width: scale.w(58),
    height: scale.w(58),
    borderRadius: scale.w(29),
    backgroundColor: '#E2E8F0',
  },
  conversationOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale.w(14),
    height: scale.w(14),
    borderRadius: scale.w(7),
    backgroundColor: '#22C55E',
    borderWidth: 2.5,
    borderColor: COLORS.white,
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale.h(4),
  },
  conversationName: {
    fontSize: scale.ms(16),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
  },
  conversationTime: {
    fontSize: scale.ms(12),
    color: COLORS.textSubtle,
    fontWeight: FONT_WEIGHTS.regular,
  },
  conversationBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conversationLastMessage: {
    fontSize: scale.ms(13),
    color: COLORS.textSubtle,
    flex: 1,
    marginRight: scale.w(8),
  },
  conversationLastMessageUnread: {
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.bold,
  },
  unreadDot: {
    width: scale.w(9),
    height: scale.w(9),
    borderRadius: scale.w(4.5),
    backgroundColor: COLORS.tinderRed,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale.w(36),
    paddingVertical: scale.h(48),
  },
  emptyIconContainer: {
    width: scale.w(100),
    height: scale.w(100),
    borderRadius: scale.w(50),
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale.h(20),
  },
  emptyTitle: {
    fontSize: scale.ms(20),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: scale.h(8),
  },
  emptySubtitle: {
    fontSize: scale.ms(14),
    color: COLORS.textSubtle,
    textAlign: 'center',
    lineHeight: scale.h(20),
    marginBottom: scale.h(24),
  },
  emptyActionButton: {
    backgroundColor: COLORS.tinderRed,
    paddingHorizontal: scale.w(24),
    paddingVertical: scale.h(12),
    borderRadius: scale.ms(24),
  },
  emptyActionText: {
    fontSize: scale.ms(14),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },

  // CHAT ROOM MODAL STYLES
  chatRoomContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatRoomHeader: {
    height: scale.h(58),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale.w(12),
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  chatRoomHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatRoomBackBtn: {
    width: scale.w(38),
    height: scale.w(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatRoomUserSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale.w(4),
    flex: 1,
  },
  chatRoomHeaderAvatar: {
    width: scale.w(38),
    height: scale.w(38),
    borderRadius: scale.w(19),
    backgroundColor: '#E2E8F0',
    marginRight: scale.w(10),
  },
  chatRoomUserName: {
    fontSize: scale.ms(16),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
  },
  chatRoomUserStatus: {
    fontSize: scale.ms(11),
    color: '#22C55E',
    fontWeight: FONT_WEIGHTS.medium,
  },
  chatRoomHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatRoomMenuBtn: {
    width: scale.w(38),
    height: scale.w(38),
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Match Intro Banner inside chat
  chatMatchIntro: {
    alignItems: 'center',
    paddingVertical: scale.h(24),
    paddingHorizontal: scale.w(24),
  },
  chatMatchIntroAvatar: {
    width: scale.w(76),
    height: scale.w(76),
    borderRadius: scale.w(38),
    borderWidth: 2,
    borderColor: COLORS.tinderRed,
    marginBottom: scale.h(8),
  },
  chatMatchIntroTitle: {
    fontSize: scale.ms(17),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
  },
  chatMatchIntroSubtitle: {
    fontSize: scale.ms(13),
    color: COLORS.textSubtle,
    textAlign: 'center',
    marginTop: scale.h(4),
  },

  // Messages List
  chatMessagesList: {
    paddingHorizontal: scale.w(16),
    paddingVertical: scale.h(12),
  },
  messageRow: {
    marginVertical: scale.h(3),
    maxWidth: '80%',
  },
  messageRowMe: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: scale.ms(18),
    paddingHorizontal: scale.w(14),
    paddingVertical: scale.h(10),
  },
  bubbleMe: {
    backgroundColor: COLORS.tinderRed,
    borderBottomRightRadius: scale.ms(4),
  },
  bubbleOther: {
    backgroundColor: '#F0F2F5',
    borderBottomLeftRadius: scale.ms(4),
  },
  messageTextMe: {
    fontSize: scale.ms(14),
    color: COLORS.white,
    lineHeight: scale.h(20),
  },
  messageTextOther: {
    fontSize: scale.ms(14),
    color: COLORS.textDark,
    lineHeight: scale.h(20),
  },
  messageTimeMe: {
    fontSize: scale.ms(10),
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: scale.h(2),
    alignSelf: 'flex-end',
  },
  messageTimeOther: {
    fontSize: scale.ms(10),
    color: COLORS.textMuted,
    marginTop: scale.h(2),
    alignSelf: 'flex-start',
  },

  // Input Bar
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale.w(12),
    paddingVertical: scale.h(8),
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F2',
    gap: scale.w(8),
  },
  chatInputField: {
    flex: 1,
    backgroundColor: '#F1F3F5',
    borderRadius: scale.ms(22),
    paddingHorizontal: scale.w(16),
    paddingVertical: scale.h(8),
    maxHeight: scale.h(100),
    fontSize: scale.ms(14),
    color: COLORS.textDark,
  },
  chatSendButton: {
    width: scale.w(40),
    height: scale.w(40),
    borderRadius: scale.w(20),
    backgroundColor: COLORS.tinderRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },

  // Options / Action Modal (3-Dots Menu)
  actionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: scale.ms(20),
    borderTopRightRadius: scale.ms(20),
    paddingHorizontal: scale.w(20),
    paddingTop: scale.h(18),
    paddingBottom: scale.h(32),
  },
  actionModalHandle: {
    width: scale.w(40),
    height: scale.h(4),
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: scale.h(16),
  },
  actionModalTitle: {
    fontSize: scale.ms(17),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: scale.h(16),
  },
  actionModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale.h(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: scale.w(12),
  },
  actionModalOptionText: {
    fontSize: scale.ms(15),
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textDark,
  },
  actionModalOptionDestructive: {
    color: '#EF4444',
  },
  actionModalCancelBtn: {
    marginTop: scale.h(14),
    paddingVertical: scale.h(12),
    borderRadius: scale.ms(12),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  actionModalCancelText: {
    fontSize: scale.ms(15),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textSubtle,
  },
});