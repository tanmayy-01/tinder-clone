import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './Splash.styles';
import { IMAGES } from '@/constants/images';
import { AppImage } from '@/components';

export const Splash = () => {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <AppImage
          source={IMAGES.SPLASH_LOGO}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          from <Text style={styles.footerBold}>MatchGroup</Text>
        </Text>
      </View>
    </View>
  );
};

export default Splash;
