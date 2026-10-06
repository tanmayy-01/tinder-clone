import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { scale } from '@/lib/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tinderRed,
    justifyContent: 'space-between',
    paddingHorizontal: scale.w(24),
    paddingTop: scale.h(20),
    paddingBottom: scale.h(32),
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: scale.w(230),
    height: scale.h(60),
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  disclaimerText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
    lineHeight: scale.h(18),
    marginBottom: scale.h(22),
    paddingHorizontal: scale.w(8),
    fontWeight: FONT_WEIGHTS.medium,
  },
  underlinedLink: {
    textDecorationLine: 'underline',
    fontWeight: FONT_WEIGHTS.bold,
  },
  buttonsContainer: {
    width: '100%',
    gap: scale.h(12),
  },
  socialButton: {
    height: scale.h(50),
    borderRadius: scale.ms(25),
  },
  troubleTextContainer: {
    marginTop: scale.h(22),
    paddingVertical: scale.h(6),
  },
  troubleText: {
    color: COLORS.white,
    fontSize: scale.ms(15),
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
  },
});
