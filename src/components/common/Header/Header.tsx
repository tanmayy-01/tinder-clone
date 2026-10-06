import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BackArrowIcon } from '../Icon';
import { scale } from '@/lib/size';
import { goBack } from '@/utils';
import { HeaderProps } from '@/types';

export const Header: React.FC<HeaderProps> = ({
  onBackPress,
  showBack = true,
}) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      goBack();
    }
  };

  if (!showBack) {
    return <View style={styles.headerSpacer} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButton}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <BackArrowIcon size={scale.ms(26)} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: scale.h(48),
    justifyContent: 'center',
    paddingHorizontal: scale.w(16),
  },
  headerSpacer: {
    height: scale.h(20),
  },
  backButton: {
    width: scale.w(36),
    height: scale.h(36),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default Header;
