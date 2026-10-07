import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from './SignUp.styles';
import { AppImage, Button, GoogleIcon, MailIcon } from '@/components';
import { SCREEN_NAMES } from '@/constants';
import { navigate } from '@/utils';
import { IMAGES } from '@/constants';

export const SignUp = () => {
  const handleContinueWithEmail = () => {
    navigate(SCREEN_NAMES.EMAIL);
  };

  const handleGoToLogin = () => {
    navigate(SCREEN_NAMES.LOGIN);
  };

  const handleContinueWithGoogle = () => {
    Alert.alert('Google Sign-In', 'Google sign-in pressed.');
  };

  const handleTroubleSigningIn = () => {
    Alert.alert(
      'Trouble Signing In?',
      'Please check your account recovery options.',
    );
  };

  const handleTermsPress = () => {
    Alert.alert('Terms', 'Tinder Terms of Service.');
  };

  const handlePrivacyPress = () => {
    Alert.alert('Privacy Policy', 'Tinder Privacy Policy.');
  };

  const handleCookiesPress = () => {
    Alert.alert('Cookies Policy', 'Tinder Cookies Policy.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <AppImage
          source={IMAGES.TINDER_TEXT_LOGO}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.disclaimerText}>
          By tapping 'Continue' you agree to our{' '}
          <Text style={styles.underlinedLink} onPress={handleTermsPress}>
            Terms
          </Text>
          . Learn how we process your data in our{' '}
          <Text style={styles.underlinedLink} onPress={handlePrivacyPress}>
            Privacy Policy
          </Text>{' '}
          and{' '}
          <Text style={styles.underlinedLink} onPress={handleCookiesPress}>
            Cookies Policy
          </Text>
          .
        </Text>

        <View style={styles.buttonsContainer}>
          <Button
            title="Continue with Google"
            variant="social"
            leftIcon={<GoogleIcon />}
            onPress={handleContinueWithGoogle}
            style={styles.socialButton}
          />
          <Button
            title="Continue with Email"
            variant="social"
            leftIcon={<MailIcon />}
            onPress={handleContinueWithEmail}
            style={styles.socialButton}
          />
        </View>

        <TouchableOpacity
          onPress={handleGoToLogin}
          style={styles.loginRow}
          activeOpacity={0.7}
        >
          <Text style={styles.loginPromptText}>Already registered? </Text>
          <Text style={styles.loginLinkText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleTroubleSigningIn}
          style={styles.troubleTextContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.troubleText}>Trouble signing in?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;
