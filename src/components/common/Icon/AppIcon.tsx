import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconProvider } from '@/lib/icon';
import { COLORS, FONT_WEIGHTS, ICON_NAMES } from '@/constants';
import { AppIconProps } from '@/types';

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 24,
  color = COLORS.textDark,
}) => {
  return <IconProvider name={name as any} size={size} color={color} />;
};


export const GoogleIcon = ({ size = 24, color = COLORS.textDark }) => {
  return <AppIcon name={ICON_NAMES.GOOGLE} size={size} color={color} />;
};

export const PhoneIcon = ({ size = 24, color = COLORS.textDark }) => {
  return <AppIcon name={ICON_NAMES.MOBILE} size={size} color={color} />;
};

export const MailIcon = ({ size = 24, color = COLORS.textDark }) => {
  return <AppIcon name={ICON_NAMES.MAIL_OUTLINE} size={size} color={color} />;
};

export const ChevronDownIcon = ({ size = 14, color = COLORS.textSubtle }) => {
  return <AppIcon name={ICON_NAMES.CHEVRON_DOWN} size={size} color={color} />;
};

const styles = StyleSheet.create({
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontWeight: FONT_WEIGHTS.bold,
  },
});
