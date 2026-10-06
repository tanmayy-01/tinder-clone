import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS } from '@/constants';
import { scale } from '@/lib/size';

export const styles = StyleSheet.create({
  baseButton: {
    height: scale.h(52),
    borderRadius: scale.ms(26),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: scale.w(18),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    position: 'absolute',
    left: scale.w(6),
    alignItems: 'center',
    justifyContent: 'center',
    width: scale.w(24),
  },
  primaryButton: {
    backgroundColor: COLORS.buttonBlack,
  },
  primaryDisabledButton: {
    backgroundColor: COLORS.buttonDisabled,
  },

  socialButton: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  outlineButton: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  disabledButton: {
    opacity: 0.6,
  },
  baseText: {
    fontSize: scale.ms(16),
    textAlign: 'center',
  },
  primaryText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.bold,
  },
  primaryDisabledText: {
    color: COLORS.buttonDisabledText,
    fontWeight: FONT_WEIGHTS.medium,
  },
  socialText: {
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: scale.ms(15),
  },
  outlineText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.bold,
  },
  disabledText: {
    color: COLORS.buttonDisabledText,
  },
});
