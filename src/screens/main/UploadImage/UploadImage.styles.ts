import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { scale } from '@/lib/size';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_GAP = 12;
export const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP * 2) / 3;
export const CARD_HEIGHT = CARD_WIDTH * 1.38;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight:FONT_WEIGHTS.extraBold,
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor:COLORS.cardBorder,
    borderStyle: 'dashed',
    marginBottom: 16,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFilled: {
    borderStyle: 'solid',
    borderColor: COLORS.cardFilledBorder,
    backgroundColor: COLORS.cardFilledBackground,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  plusBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.tinderRed,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  removeBadge: {
    backgroundColor: COLORS.tinderRed,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  counterBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor:COLORS.cardFilledBorder,
    backgroundColor: COLORS.cardFilledBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: scale.ms(13),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  infoText: {
    fontSize: scale.ms(13),
    color: COLORS.textSubtle,
    lineHeight: 18,
  },
  bottomContainer: {
    paddingBottom: 24,
    paddingTop: 10,
  },
  cityInputContainer: {
    marginTop: 10,
    marginBottom: 14,
  },
  nameInputContainer: {
    marginTop: 10,
    marginBottom: 14,
  },
  helperText: {
    fontSize: scale.ms(13),
    color: COLORS.textSubtle,
    lineHeight: 18,
  },
  subtitle: {
    fontSize: scale.ms(14),
    color: COLORS.textSubtle,
    marginTop: -14,
    marginBottom: 20,
    lineHeight: 20,
  },
  stepScroll: {
    flex: 1,
  },
  stepScrollContent: {
    paddingBottom: 16,
  },
  bioInputContainer: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    padding: 14,
    minHeight: scale.h(130),
    justifyContent: 'space-between',
  },
  bioInput: {
    fontSize: scale.ms(15),
    color: COLORS.textDark,
    textAlignVertical: 'top',
    minHeight: scale.h(90),
    padding: 0,
  },
  bioFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  charCount: {
    fontSize: scale.ms(12),
    color: COLORS.textSubtle,
  },
  hobbiesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hobbiesCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFF0F2',
  },
  hobbiesCountText: {
    fontSize: scale.ms(12),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.tinderRed,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: COLORS.tinderRed,
    backgroundColor: '#FFF0F2',
  },
  chipText: {
    fontSize: scale.ms(14),
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.medium,
  },
  chipTextSelected: {
    color: COLORS.tinderRed,
    fontWeight: FONT_WEIGHTS.bold,
  },
});