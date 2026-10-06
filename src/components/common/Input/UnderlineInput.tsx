import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { scale } from '@/lib/size';
import { UnderlineInputProps } from '@/types';

export const UnderlineInput: React.FC<UnderlineInputProps> = ({
  leftComponent,
  rightComponent,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        isFocused ? styles.focusedBorder : styles.defaultBorder,
        containerStyle,
      ]}
    >
      {leftComponent ? (
        <View style={styles.leftContainer}>{leftComponent}</View>
      ) : null}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor={COLORS.textMuted}
        selectionColor={COLORS.textDark}
        onFocus={e => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={e => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {rightComponent ? (
        <View style={styles.rightContainer}>{rightComponent}</View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    paddingVertical: scale.h(6),
  },
  defaultBorder: {
    borderBottomColor: COLORS.borderLine,
  },
  focusedBorder: {
    borderBottomColor: COLORS.borderFocused,
  },
  leftContainer: {
    marginRight: scale.w(8),
  },
  rightContainer: {
    marginLeft: scale.w(8),
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textDark,
    paddingVertical: scale.h(4),
    fontWeight: FONT_WEIGHTS.medium,
  },
});

export default UnderlineInput;
