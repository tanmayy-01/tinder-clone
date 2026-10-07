import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { scale } from '@/lib/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tinderRed,
    paddingHorizontal: scale.w(24),
    paddingTop: scale.h(16),
    paddingBottom: scale.h(32),
    justifyContent: 'space-between',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    height: scale.h(40),
    justifyContent: 'center',
  },
  backButton: {
    width: scale.w(36),
    height: scale.h(36),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: scale.h(120),
  },
  logo: {
    width: scale.w(230),
    height: scale.h(60),
  },
  formSection: {
    width: '100%',
    alignItems: 'center',
  },
  inputCard: {
    width: '100%',
    height: scale.h(50),
    borderRadius: scale.ms(25),
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale.w(18),
    marginBottom: scale.h(14),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: scale.w(12),
  },
  textInput: {
    flex: 1,
    fontSize: scale.ms(15),
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.medium,
    paddingVertical: scale.h(6),
  },
  eyeButton: {
    padding: scale.w(4),
    marginLeft: scale.w(6),
  },
  loginButton: {
    width: '100%',
    height: scale.h(50),
    borderRadius: scale.ms(25),
    marginTop: scale.h(4),
    backgroundColor: COLORS.white,
  },
  loginButtonText: {
    color: COLORS.textDark,
    fontSize: scale.ms(16),
    fontWeight: FONT_WEIGHTS.bold,
  },
  linksContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: scale.h(20),
    gap: scale.h(12),
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpPromptText: {
    color: COLORS.promptText,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  signUpLinkText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    textDecorationLine: 'underline',
  },
  troubleText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
  },
});