import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { styles } from './Button.styles';
import { COLORS } from '@/constants';
import { ButtonProps } from '@/types';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  leftIcon,
  style,
  textStyle,
  testID,
  activeOpacity = 0.8,
}) => {
  const isInteractive = !disabled && !loading;

  const getContainerStyle = () => {
    switch (variant) {
      case 'social':
        return [styles.baseButton, styles.socialButton, disabled && styles.disabledButton, style];
      case 'outline':
        return [styles.baseButton, styles.outlineButton, disabled && styles.disabledButton, style];
      case 'primary':
      default:
        return [
          styles.baseButton,
          disabled ? styles.primaryDisabledButton : styles.primaryButton,
          style,
        ];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'social':
        return [styles.baseText, styles.socialText, disabled && styles.disabledText, textStyle];
      case 'outline':
        return [styles.baseText, styles.outlineText, disabled && styles.disabledText, textStyle];
      case 'primary':
      default:
        return [
          styles.baseText,
          disabled ? styles.primaryDisabledText : styles.primaryText,
          textStyle,
        ];
    }
  };

  const getIndicatorColor = () => {
    if (variant === 'social') return COLORS.textDark;
    if (disabled) return COLORS.buttonDisabledText;
    return COLORS.white;
  };

  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive }}
      activeOpacity={activeOpacity}
      onPress={isInteractive ? onPress : undefined}
      style={getContainerStyle()}
      disabled={!isInteractive}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIndicatorColor()} />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon ? <View style={styles.iconContainer}>{leftIcon}</View> : null}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
