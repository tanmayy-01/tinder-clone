import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { scale } from '@/lib/size';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  container: {
    flex: 1,
    paddingHorizontal: scale.w(22),
    justifyContent: 'space-between',
    paddingBottom: scale.h(28),
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: scale.ms(30),
    fontWeight: FONT_WEIGHTS.extraBold,
    color: COLORS.textDark,
    marginTop: scale.h(12),
    marginBottom: scale.h(28),
    letterSpacing: -0.5,
  },
  inputContainer: {
    marginTop: scale.h(4),
  },
  helperText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSubtle,
    lineHeight: scale.h(19),
    marginTop: scale.h(14),
    fontWeight: FONT_WEIGHTS.regular,
  },
  linkText: {
    color: COLORS.linkBlue,
    textDecorationLine: 'underline',
    fontWeight: FONT_WEIGHTS.semibold,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale.w(12),
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.borderLine,
    paddingVertical: scale.h(8),
    paddingHorizontal: scale.w(4),
    gap: scale.w(6),
  },
  countryPickerText: {
    fontSize: scale.ms(17),
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textDark,
  },
  chevron: {
    fontSize: scale.ms(10),
    color: COLORS.textSubtle,
    marginLeft: scale.w(2),
  },
  phoneInputContainer: {
    flex: 1,
  },
  phoneInput: {
    fontSize: FONT_SIZES.lg,
    letterSpacing: 0.5,
  },
  eyeButton: {
    padding: scale.w(4),
  },
  passwordRequirements: {
    marginTop: scale.h(16),
    gap: scale.h(6),
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale.w(8),
  },
  reqCheck: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
  },
  reqValid: {
    color: COLORS.reqValid,
  },
  reqInvalid: {
    color: COLORS.textMuted,
  },
  reqText: {
    fontSize: scale.ms(13),
    color: COLORS.textSubtle,
  },
  dobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale.w(14),
  },
  dobSegment: {
    alignItems: 'center',
  },
  dobInput: {
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.borderLine,
    fontSize: scale.ms(22),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
    textAlign: 'center',
    paddingVertical: scale.h(6),
  },
  dobInputFocused: {
    borderBottomColor: COLORS.borderFocused,
  },
  dobDay: {
    width: scale.w(56),
  },
  dobMonth: {
    width: scale.w(56),
  },
  dobYear: {
    width: scale.w(86),
  },
  dobSeparator: {
    fontSize: scale.ms(22),
    color: COLORS.textMuted,
    fontWeight: '300',
  },
  ageBadgeContainer: {
    marginTop: scale.h(16),
  },
  ageBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.ageBadge,
    paddingHorizontal: scale.w(12),
    paddingVertical: scale.h(4),
    borderRadius: scale.ms(12),
  },
  ageBadgeText: {
    color: COLORS.ageBadgeText,
    fontSize: scale.ms(13),
    fontWeight: FONT_WEIGHTS.bold,
  },
  ageErrorBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.ageErrorBadge,
    paddingHorizontal: scale.w(12),
    paddingVertical: scale.h(4),
    borderRadius: scale.ms(12),
  },
  ageErrorText: {
    color: COLORS.ageErrorText,
    fontSize: scale.ms(13),
    fontWeight: FONT_WEIGHTS.bold,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: scale.h(16),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: scale.ms(20),
    borderTopRightRadius: scale.ms(20),
    paddingHorizontal: scale.w(20),
    paddingVertical: scale.h(24),
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
    marginBottom: scale.h(16),
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale.h(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderLine,
  },
  countryName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.medium,
  },
  countryDial: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSubtle,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});
