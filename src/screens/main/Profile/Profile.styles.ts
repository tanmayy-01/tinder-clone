import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_WEIGHTS } from '@/constants';
import { scale } from '@/lib/size';

const { width } = Dimensions.get('window');
const PHOTO_GRID_GAP = 10;
export const PHOTO_SLOT_WIDTH = (width - 48 - PHOTO_GRID_GAP * 2) / 3;
export const PHOTO_SLOT_HEIGHT = PHOTO_SLOT_WIDTH * 1.35;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: scale.h(54),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale.w(20),
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  headerTitle: {
    fontSize: scale.ms(20),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
  },
  headerIconButton: {
    width: scale.w(40),
    height: scale.h(40),
    borderRadius: scale.ms(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
  },
  scrollContent: {
    paddingBottom: scale.h(40),
  },

  // Hero Avatar Section
  heroSection: {
    alignItems: 'center',
    paddingVertical: scale.h(24),
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: scale.ms(24),
    borderBottomRightRadius: scale.ms(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: scale.h(16),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: scale.h(14),
  },
  avatar: {
    width: scale.w(120),
    height: scale.w(120),
    borderRadius: scale.w(60),
    backgroundColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    width: scale.w(120),
    height: scale.w(120),
    borderRadius: scale.w(60),
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: scale.h(4),
    right: scale.w(4),
    width: scale.w(36),
    height: scale.w(36),
    borderRadius: scale.w(18),
    backgroundColor: COLORS.tinderRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale.w(6),
    marginBottom: scale.h(4),
  },
  userName: {
    fontSize: scale.ms(22),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
  },
  verifiedBadge: {
    marginLeft: scale.w(2),
  },
  userCity: {
    fontSize: scale.ms(14),
    color: COLORS.textSubtle,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: scale.h(16),
  },

  // Action Buttons (Tinder Circular Buttons)
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale.w(28),
    marginTop: scale.h(4),
  },
  circleActionButton: {
    width: scale.w(52),
    height: scale.w(52),
    borderRadius: scale.w(26),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  circleActionEdit: {
    backgroundColor: COLORS.tinderRed,
    borderColor: COLORS.tinderRed,
    transform: [{ scale: 1.08 }],
  },
  circleActionLabel: {
    fontSize: scale.ms(11),
    color: COLORS.textSubtle,
    fontWeight: FONT_WEIGHTS.medium,
    textAlign: 'center',
    marginTop: scale.h(6),
  },
  actionItemContainer: {
    alignItems: 'center',
  },

  // Cards Section
  cardsContainer: {
    paddingHorizontal: scale.w(18),
    gap: scale.h(16),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: scale.ms(18),
    padding: scale.w(18),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale.h(12),
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale.w(8),
  },
  cardTitle: {
    fontSize: scale.ms(16),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
  },
  editLink: {
    fontSize: scale.ms(13),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.tinderRed,
  },
  aboutText: {
    fontSize: scale.ms(14),
    color: COLORS.textDark,
    lineHeight: scale.h(22),
  },
  emptyAboutText: {
    fontSize: scale.ms(14),
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale.w(8),
    marginTop: scale.h(4),
  },
  hobbyBadge: {
    paddingHorizontal: scale.w(14),
    paddingVertical: scale.h(8),
    borderRadius: scale.ms(18),
    backgroundColor: '#FFF0F2',
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  hobbyBadgeText: {
    fontSize: scale.ms(13),
    color: COLORS.tinderRed,
    fontWeight: FONT_WEIGHTS.semibold,
  },

  // Info Items inside Card
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale.h(10),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIconContainer: {
    width: scale.w(32),
    height: scale.w(32),
    borderRadius: scale.w(16),
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale.w(12),
  },
  infoLabelContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: scale.ms(12),
    color: COLORS.textSubtle,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: scale.h(2),
  },
  infoValue: {
    fontSize: scale.ms(14),
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.bold,
  },

  // Photos Gallery Horizontal / Grid
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PHOTO_GRID_GAP,
    marginTop: scale.h(4),
  },
  galleryPhoto: {
    width: PHOTO_SLOT_WIDTH,
    height: PHOTO_SLOT_HEIGHT,
    borderRadius: scale.ms(12),
    backgroundColor: '#ECEFF1',
  },
  galleryEmptySlot: {
    width: PHOTO_SLOT_WIDTH,
    height: PHOTO_SLOT_HEIGHT,
    borderRadius: scale.ms(12),
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Edit Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    height: scale.h(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale.w(18),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  modalTitle: {
    fontSize: scale.ms(18),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
  },
  modalCancelText: {
    fontSize: scale.ms(15),
    color: COLORS.textSubtle,
    fontWeight: FONT_WEIGHTS.medium,
  },
  modalSaveText: {
    fontSize: scale.ms(15),
    color: COLORS.tinderRed,
    fontWeight: FONT_WEIGHTS.bold,
  },
  modalScroll: {
    padding: scale.w(18),
    paddingBottom: scale.h(40),
  },
  modalSectionLabel: {
    fontSize: scale.ms(14),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
    marginTop: scale.h(16),
    marginBottom: scale.h(8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInputContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: scale.ms(14),
    paddingHorizontal: scale.w(16),
    paddingVertical: scale.h(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: scale.h(12),
  },
  modalTextInput: {
    fontSize: scale.ms(15),
    color: COLORS.textDark,
    padding: 0,
    fontWeight: FONT_WEIGHTS.medium,
  },
  modalTextArea: {
    minHeight: scale.h(80),
    textAlignVertical: 'top',
  },
  charCountText: {
    fontSize: scale.ms(11),
    color: COLORS.textMuted,
    textAlign: 'right',
    marginTop: scale.h(4),
  },
  photoSlotContainer: {
    position: 'relative',
    marginBottom: PHOTO_GRID_GAP,
  },
  photoSlotDeleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  photoSlotAddButton: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.tinderRed,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});