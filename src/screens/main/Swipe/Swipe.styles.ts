import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_WEIGHTS } from '@/constants';
import { scale } from '@/lib/size';

const { width, height } = Dimensions.get('window');

export const CARD_WIDTH = width - 20;
export const CARD_HEIGHT = height * 0.70;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    height: scale.h(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale.w(18),
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale.w(6),
  },
  headerTitle: {
    fontSize: scale.ms(22),
    fontWeight: FONT_WEIGHTS.extraBold,
    color: COLORS.tinderRed,
    letterSpacing: -0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale.w(12),
  },
  headerIconButton: {
    width: scale.w(36),
    height: scale.w(36),
    borderRadius: scale.w(18),
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Deck Container
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale.h(6),
  },

  // Card Styles
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: scale.ms(20),
    overflow: 'hidden',
    backgroundColor: COLORS.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
    position: 'absolute',
  },
  cardNext: {
    transform: [{ scale: 0.95 }],
    opacity: 0.85,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },

  // Story Progress Bars at Top
  storyBarsContainer: {
    position: 'absolute',
    top: scale.h(10),
    left: scale.w(12),
    right: scale.w(12),
    flexDirection: 'row',
    gap: scale.w(5),
    zIndex: 10,
  },
  storyBar: {
    flex: 1,
    height: scale.h(4),
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  storyBarActive: {
    backgroundColor: COLORS.white,
  },

  // Tap areas to change photos
  photoTapLeft: {
    position: 'absolute',
    top: scale.h(24),
    left: 0,
    width: '45%',
    bottom: scale.h(120),
    zIndex: 5,
  },
  photoTapRight: {
    position: 'absolute',
    top: scale.h(24),
    right: 0,
    width: '45%',
    bottom: scale.h(120),
    zIndex: 5,
  },

  // Bottom Gradient / Overlay on Card
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale.w(16),
    paddingBottom: scale.h(18),
    paddingTop: scale.h(40),
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
    gap: scale.w(8),
  },
  userName: {
    fontSize: scale.ms(26),
    fontWeight: FONT_WEIGHTS.extraBold,
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  userAge: {
    fontSize: scale.ms(24),
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.white,
  },
  infoButton: {
    width: scale.w(34),
    height: scale.w(34),
    borderRadius: scale.w(17),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale.h(5),
    gap: scale.w(6),
  },
  infoLineText: {
    fontSize: scale.ms(14),
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: FONT_WEIGHTS.medium,
  },
  bioPreview: {
    fontSize: scale.ms(13),
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: scale.h(6),
    lineHeight: scale.h(18),
  },
  hobbiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale.w(6),
    marginTop: scale.h(8),
  },
  hobbyPill: {
    paddingHorizontal: scale.w(10),
    paddingVertical: scale.h(4),
    borderRadius: scale.ms(12),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  hobbyPillText: {
    fontSize: scale.ms(11),
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.semiBold,
  },

  // Swipe Stamps (LIKE & NOPE)
  stamp: {
    position: 'absolute',
    top: scale.h(40),
    paddingHorizontal: scale.w(14),
    paddingVertical: scale.h(4),
    borderRadius: 8,
    borderWidth: 4,
    zIndex: 20,
  },
  stampLike: {
    left: scale.w(24),
    borderColor: '#22C55E',
    transform: [{ rotate: '-18deg' }],
  },
  stampNope: {
    right: scale.w(24),
    borderColor: '#EF4444',
    transform: [{ rotate: '18deg' }],
  },
  stampText: {
    fontSize: scale.ms(30),
    fontWeight: FONT_WEIGHTS.extraBold,
    letterSpacing: 2,
  },
  stampTextLike: {
    color: '#22C55E',
  },
  stampTextNope: {
    color: '#EF4444',
  },

  // Bottom Floating Action Buttons
  actionsBar: {
    height: scale.h(74),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale.w(16),
    paddingBottom: scale.h(6),
  },
  actionCircleSmall: {
    width: scale.w(46),
    height: scale.w(46),
    borderRadius: scale.w(23),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  actionCircleLarge: {
    width: scale.w(58),
    height: scale.w(58),
    borderRadius: scale.w(29),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },

  // Empty State (No cards left)
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale.w(32),
  },
  emptyRadarCircle: {
    width: scale.w(120),
    height: scale.w(120),
    borderRadius: scale.w(60),
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
  refreshButton: {
    minWidth: scale.w(180),
  },

  // Match Modal Styles
  matchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale.w(24),
  },
  matchTitle: {
    fontSize: scale.ms(34),
    fontWeight: FONT_WEIGHTS.extraBold,
    color: '#FF4458',
    marginBottom: scale.h(8),
    letterSpacing: 1,
  },
  matchSubtitle: {
    fontSize: scale.ms(15),
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: scale.h(32),
  },
  matchAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale.h(40),
  },
  matchAvatar: {
    width: scale.w(110),
    height: scale.w(110),
    borderRadius: scale.w(55),
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  matchAvatarLeft: {
    marginRight: -scale.w(16),
    zIndex: 1,
  },
  matchAvatarRight: {
    marginLeft: -scale.w(16),
    zIndex: 2,
  },
  matchHeartBadge: {
    position: 'absolute',
    width: scale.w(36),
    height: scale.w(36),
    borderRadius: scale.w(18),
    backgroundColor: COLORS.tinderRed,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  matchButtonsContainer: {
    width: '100%',
    gap: scale.h(12),
  },
  keepSwipingButton: {
    height: scale.h(48),
    borderRadius: scale.ms(24),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keepSwipingText: {
    fontSize: scale.ms(15),
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.white,
  },

  // Detailed Profile Modal
  detailModalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  detailModalScroll: {
    paddingBottom: scale.h(40),
  },
  detailModalPhoto: {
    width: width,
    height: height * 0.55,
  },
  detailModalCloseBtn: {
    position: 'absolute',
    top: scale.h(44),
    right: scale.w(18),
    width: scale.w(38),
    height: scale.w(38),
    borderRadius: scale.w(19),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  detailModalBody: {
    padding: scale.w(20),
  },
  detailModalName: {
    fontSize: scale.ms(26),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
  },
  detailModalBioTitle: {
    fontSize: scale.ms(15),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
    marginTop: scale.h(16),
    marginBottom: scale.h(6),
  },
  detailModalBio: {
    fontSize: scale.ms(14),
    color: COLORS.textSubtle,
    lineHeight: scale.h(22),
  },
});