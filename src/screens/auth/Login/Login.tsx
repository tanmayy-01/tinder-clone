import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { styles } from './Login.styles';
import { AppImage, Button, AppIcon, MailIcon } from '@/components';
import { COLORS, ICON_NAMES, IMAGES, SCREEN_NAMES } from '@/constants';
import { goBack, isIOS, isValidEmail, navigate } from '@/utils';
import { signInWithEmail } from '@/services';
import { scale } from '@/lib/size';
import { useAuth } from '@/navigation/AuthProvider';

export const Login = () => {
  const { setIsOnboarding } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSecure, setIsSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const isEmailValid = isValidEmail(email);
  const isPasswordValid = password.trim().length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLogin = async () => {
    if (!isFormValid || loading) return;
    Keyboard.dismiss();

    try {
      setLoading(true);
      setIsOnboarding(false);
      await signInWithEmail(email, password);
    } catch (error: any) {
      let message = 'An error occurred while logging in.';
      if (error?.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error?.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (error?.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (error?.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      } else if (error?.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else if (error?.message) {
        message = error.message;
      }

      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const handleTroubleSigningIn = () => {
    Alert.alert(
      'Trouble Signing In?',
      'Please check your email or contact support to recover your account.',
    );
  };

  const handleGoToSignUp = () => {
    navigate(SCREEN_NAMES.SIGNUP);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={isIOS ? 'padding' : 'height'}
        >
          {/* Top Header Back Button */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
            >
              <AppIcon
                name={ICON_NAMES.BACK_ARROW}
                size={scale.ms(26)}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Centered Tinder Text Logo */}
          <View style={styles.logoContainer}>
            <AppImage
              source={IMAGES.TINDER_TEXT_LOGO}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Bottom Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputCard}>
              <View style={styles.inputIcon}>
                <MailIcon size={20} color={COLORS.textSubtle} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputCard}>
              <View style={styles.inputIcon}>
                <AppIcon
                  name={ICON_NAMES.LOCK_CLOSED_OUTLINE}
                  size={20}
                  color={COLORS.textSubtle}
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={isSecure}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setIsSecure(!isSecure)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <AppIcon
                  name={
                    isSecure
                      ? ICON_NAMES.EYE_OFF_OUTLINE
                      : ICON_NAMES.EYE_OUTLINE
                  }
                  size={20}
                  color={COLORS.textSubtle}
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Button
              title="Log In"
              variant="social"
              disabled={!isFormValid || loading}
              loading={loading}
              onPress={handleLogin}
              style={styles.loginButton}
              textStyle={styles.loginButtonText}
            />

            {/* Bottom Links */}
            <View style={styles.linksContainer}>
              <TouchableOpacity
                onPress={handleGoToSignUp}
                activeOpacity={0.7}
                style={styles.signUpRow}
              >
                <Text style={styles.signUpPromptText}>
                  Don't have an account?{' '}
                </Text>
                <Text style={styles.signUpLinkText}>Sign up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleTroubleSigningIn}
                activeOpacity={0.7}
              >
                <Text style={styles.troubleText}>Trouble signing in?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;