import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants';
import { scale } from '@/lib/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tinderRed,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale.h(40),
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: scale.w(110),
    height: scale.h(110),
  },
  footerContainer: {
    paddingBottom: scale.h(24),
  },
  footerText: {
    color: COLORS.white,
    fontSize: scale.ms(16),
    letterSpacing: 0.3,
    fontWeight: '400',
  },
  footerBold: {
    fontWeight: '700',
  },
});
