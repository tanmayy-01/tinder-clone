import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconProvider } from '@/lib/icon';
import { COLORS, FONT_WEIGHTS } from '@/constants';
import { AppIconProps } from '@/types';

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 24,
  color = COLORS.textDark,
}) => {
  try {
    return <IconProvider name={name as any} size={size} color={color} />;
  } catch {
    return (
      <View style={[styles.fallback, { width: size, height: size }]}>
        <Text style={[styles.fallbackText, { fontSize: size * 0.7, color }]}>•</Text>
      </View>
    );
  }
};

// Specialized custom icons for Google G and Back arrow to guarantee pixel-perfection
export const GoogleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <View style={[styles.googleContainer, { width: size, height: size }]}>
    <Text style={[styles.googleLetter, { fontSize: size * 0.95 }]}>G</Text>
  </View>
);

export const BackArrowIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = COLORS.textDark,
}) => {
  return <AppIcon name="arrow-back" size={size} color={color} />;
};

export const PhoneIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = COLORS.textDark,
}) => {
  return <AppIcon name="call" size={size} color={color} />;
};

export const MailIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = COLORS.textDark,
}) => {
  return <AppIcon name="mail-outline" size={size} color={color} />;
};

export const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 14,
  color = COLORS.textSubtle,
}) => {
  return <AppIcon name="chevron-down" size={size} color={color} />;
};

const styles = StyleSheet.create({
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontWeight: FONT_WEIGHTS.bold,
  },
  googleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleLetter: {
    color: COLORS.black,
    fontWeight: FONT_WEIGHTS.extraBold,
    textAlign: 'center',
  },
});
