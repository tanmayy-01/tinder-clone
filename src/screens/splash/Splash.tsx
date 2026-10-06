import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { styles } from './Splash.styles';
import { SCREEN_NAMES } from '@/constants';
import { replace } from '@/utils';
import { IMAGES } from '@/constants/images';
import { AppImage } from '@/components';

export const Splash = () => {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      replace(SCREEN_NAMES.SIGNUP);
    }, 2200);

    return () => clearTimeout(timer);
  }, [opacityAnim, scaleAnim]);

  const handlePress = () => {
    replace(SCREEN_NAMES.SIGNUP);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      style={styles.container}
    >
      <View style={styles.centerContent}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          <AppImage
            source={IMAGES.SPLASH_LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          from <Text style={styles.footerBold}>MatchGroup</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Splash;
