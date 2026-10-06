import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  BackHandler,
  Animated,
} from 'react-native';
import { styles } from './Email.styles';
import { Header, UnderlineInput, Button, AppIcon } from '@/components';
import { COLORS, SCREEN_NAMES, THEME } from '@/constants';
import { goBack, isIOS, resetAndNavigate } from '@/utils';

type Step = 'email' | 'phone' | 'password' | 'dob';

interface CountryOption {
  code: string;
  dialCode: string;
  name: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 'IN', dialCode: '+91', name: 'India' },
  { code: 'US', dialCode: '+1', name: 'United States' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom' },
  { code: 'CA', dialCode: '+1', name: 'Canada' },
  { code: 'AU', dialCode: '+61', name: 'Australia' },
  { code: 'DE', dialCode: '+49', name: 'Germany' },
  { code: 'FR', dialCode: '+33', name: 'France' },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates' },
];

export const Email = () => {
  // Step state: handles email -> phone -> password -> dob conditionally in this one screen
  const [currentStep, setCurrentStep] = useState<Step>('email');

  // Animation for smooth step transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Form states
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isSecure, setIsSecure] = useState(true);

  // DOB states
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [focusedDobField, setFocusedDobField] = useState<'day' | 'month' | 'year' | null>('day');

  // Country modal
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);

  // DOB Refs
  const monthRef = useRef<any>(null);
  const yearRef = useRef<any>(null);
  const dayRef = useRef<any>(null);

  // Step transition animation
  const transitionToStep = (nextStep: Step) => {
    Keyboard.dismiss();
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
    setCurrentStep(nextStep);
  };

  // Step 1: Email Validation
  const isValidEmail = (val: string) => {
    const trimmed = val.trim();
    return trimmed.length > 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  };
  const isEmailValid = isValidEmail(email);

  // Step 2: Phone Validation
  const cleanDigits = phoneNumber.replace(/\D/g, '');
  const isPhoneValid = cleanDigits.length >= 10;

  // Step 3: Password Validation
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  // Step 4: DOB Validation & Age Calculation
  const calculateAge = (): { age: number | null; isValidDate: boolean } => {
    if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
      return { age: null, isValidDate: false };
    }

    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear()) {
      return { age: null, isValidDate: false };
    }

    const birthDate = new Date(y, m - 1, d);
    if (birthDate.getMonth() !== m - 1 || birthDate.getDate() !== d) {
      return { age: null, isValidDate: false };
    }

    const today = new Date();
    let computedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      computedAge--;
    }

    return { age: computedAge, isValidDate: true };
  };

  const { age, isValidDate } = calculateAge();
  const isAdult = isValidDate && age !== null && age >= 18;
  const isDobValid = isAdult;

  // Back navigation handler (goes back step-by-step conditionally)
  const handleBack = useCallback(() => {
    if (currentStep === 'dob') {
      transitionToStep('password');
      return true;
    }
    if (currentStep === 'password') {
      transitionToStep('phone');
      return true;
    }
    if (currentStep === 'phone') {
      transitionToStep('email');
      return true;
    }
    // If on email, navigate back to SignUp screen
    goBack();
    return true;
  }, [currentStep]);

  // Hardware back press on Android
  useEffect(() => {
    const backAction = () => {
      return handleBack();
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [handleBack]);

  // Next button click handler (switches step conditionally)
  const handleNext = () => {
    if (currentStep === 'email') {
      if (!isEmailValid) return;
      transitionToStep('phone');
    } else if (currentStep === 'phone') {
      if (!isPhoneValid) return;
      transitionToStep('password');
    } else if (currentStep === 'password') {
      if (!isPasswordValid) return;
      transitionToStep('dob');
    } else if (currentStep === 'dob') {
      if (!isDobValid) return;
      Keyboard.dismiss();

      const summary = [
        `Email: ${email.trim()}`,
        `Mobile: ${selectedCountry.dialCode} ${cleanDigits}`,
        `Birthday: ${day}/${month}/${year} (Age: ${age})`,
      ].join('\n');

      Alert.alert(
        'Account Created!',
        `Welcome to Tinder!\n\n${summary}`,
        [
          {
            text: 'Get Started',
            onPress: () => {
              resetAndNavigate(SCREEN_NAMES.SIGNUP);
            },
          },
        ],
      );
    }
  };

  // Determine button enabled state for current step
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 'email':
        return isEmailValid;
      case 'phone':
        return isPhoneValid;
      case 'password':
        return isPasswordValid;
      case 'dob':
        return isDobValid;
      default:
        return false;
    }
  };

  // DOB Handlers
  const handleDayChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setDay(cleaned);
    if (cleaned.length === 2) {
      monthRef.current?.focus();
    }
  };

  const handleMonthChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setMonth(cleaned);
    if (cleaned.length === 2) {
      yearRef.current?.focus();
    }
  };

  const handleYearChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setYear(cleaned);
  };

  const handleLinkPress = () => {
    Alert.alert(
      'Account Recovery',
      'If your number has changed, you can verify via your linked email account or contact support.',
    );
  };

  const handleSelectCountry = (country: CountryOption) => {
    setSelectedCountry(country);
    setIsCountryModalVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.safeArea}>
        <Header onBackPress={handleBack} />

        <KeyboardAvoidingView
          style={styles.container}
          behavior={isIOS ? 'padding' : 'height'}
          keyboardVerticalOffset={isIOS ? 20 : 0}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* STEP 1: EMAIL */}
            {currentStep === 'email' && (
              <View>
                <Text style={styles.title}>What's your email?</Text>
                <UnderlineInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                  containerStyle={styles.inputContainer}
                />
                <Text style={styles.helperText}>
                  We'll send you a code to verify your email. You may need to check your spam email folder.
                </Text>
              </View>
            )}

            {/* STEP 2: MOBILE / PHONE */}
            {currentStep === 'phone' && (
              <View>
                <Text style={styles.title}>What's your number?</Text>
                <View style={styles.phoneRow}>
                  <TouchableOpacity
                    style={styles.countryPickerButton}
                    onPress={() => setIsCountryModalVisible(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.countryPickerText}>
                      {selectedCountry.code} {selectedCountry.dialCode}
                    </Text>
                    <Text style={styles.chevron}>▼</Text>
                  </TouchableOpacity>

                  <View style={styles.phoneInputContainer}>
                    <UnderlineInput
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      placeholder="Phone number"
                      keyboardType="phone-pad"
                      autoFocus
                      maxLength={15}
                      inputStyle={styles.phoneInput}
                    />
                  </View>
                </View>

                <Text style={styles.helperText}>
                  We'll send you a code to verify your phone. Message and data rates may apply.{' '}
                  <Text style={styles.linkText} onPress={handleLinkPress}>
                    What happens if your number changes?
                  </Text>
                </Text>
              </View>
            )}

            {/* STEP 3: PASSWORD */}
            {currentStep === 'password' && (
              <View>
                <Text style={styles.title}>Create a password</Text>
                <UnderlineInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  secureTextEntry={isSecure}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                  containerStyle={styles.inputContainer}
                  rightComponent={
                    <TouchableOpacity
                      onPress={() => setIsSecure(!isSecure)}
                      style={styles.eyeButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <AppIcon
                        name={isSecure ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={COLORS.textSubtle}
                      />
                    </TouchableOpacity>
                  }
                />
                <Text style={styles.helperText}>
                  Must contain at least 8 characters, including letters and numbers. Don't share it with anyone.
                </Text>

                <View style={styles.passwordRequirements}>
                  <View style={styles.reqItem}>
                    <Text style={[styles.reqCheck, hasMinLength ? styles.reqValid : styles.reqInvalid]}>
                      {hasMinLength ? '✓' : '•'}
                    </Text>
                    <Text style={styles.reqText}>At least 8 characters</Text>
                  </View>
                  <View style={styles.reqItem}>
                    <Text style={[styles.reqCheck, hasLetter && hasNumber ? styles.reqValid : styles.reqInvalid]}>
                      {hasLetter && hasNumber ? '✓' : '•'}
                    </Text>
                    <Text style={styles.reqText}>Contains letters and numbers</Text>
                  </View>
                </View>
              </View>
            )}

            {/* STEP 4: DOB */}
            {currentStep === 'dob' && (
              <View>
                <Text style={styles.title}>When's your birthday?</Text>
                <View style={styles.dobContainer}>
                  <View style={styles.dobSegment}>
                    <TextInput
                      ref={dayRef}
                      style={[
                        styles.dobInput,
                        styles.dobDay,
                        focusedDobField === 'day' && styles.dobInputFocused,
                      ]}
                      value={day}
                      onChangeText={handleDayChange}
                      placeholder="DD"
                      placeholderTextColor={COLORS.textMuted}
                      keyboardType="number-pad"
                      maxLength={2}
                      onFocus={() => setFocusedDobField('day')}
                      autoFocus
                    />
                  </View>

                  <Text style={styles.dobSeparator}>/</Text>

                  <View style={styles.dobSegment}>
                    <TextInput
                      ref={monthRef}
                      style={[
                        styles.dobInput,
                        styles.dobMonth,
                        focusedDobField === 'month' && styles.dobInputFocused,
                      ]}
                      value={month}
                      onChangeText={handleMonthChange}
                      onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace' && month === '') {
                          dayRef.current?.focus();
                        }
                      }}
                      placeholder="MM"
                      placeholderTextColor={COLORS.textMuted}
                      keyboardType="number-pad"
                      maxLength={2}
                      onFocus={() => setFocusedDobField('month')}
                    />
                  </View>

                  <Text style={styles.dobSeparator}>/</Text>

                  <View style={styles.dobSegment}>
                    <TextInput
                      ref={yearRef}
                      style={[
                        styles.dobInput,
                        styles.dobYear,
                        focusedDobField === 'year' && styles.dobInputFocused,
                      ]}
                      value={year}
                      onChangeText={handleYearChange}
                      onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace' && year === '') {
                          monthRef.current?.focus();
                        }
                      }}
                      placeholder="YYYY"
                      placeholderTextColor={COLORS.textMuted}
                      keyboardType="number-pad"
                      maxLength={4}
                      onFocus={() => setFocusedDobField('year')}
                    />
                  </View>
                </View>

                {isValidDate && age !== null ? (
                  <View style={styles.ageBadgeContainer}>
                    {age >= 18 ? (
                      <View style={styles.ageBadge}>
                        <Text style={styles.ageBadgeText}>Age: {age} years old</Text>
                      </View>
                    ) : (
                      <View style={styles.ageErrorBadge}>
                        <Text style={styles.ageErrorText}>You must be at least 18 years old to use Tinder.</Text>
                      </View>
                    )}
                  </View>
                ) : null}

                <Text style={styles.helperText}>
                  Your age will be public, not your birthday. You must be at least 18 years old to use Tinder.
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Bottom Action Button (Common to all steps) */}
          <View style={styles.bottomContainer}>
            <Button
              title="Next"
              variant="primary"
              disabled={!isCurrentStepValid()}
              onPress={handleNext}
            />
          </View>
        </KeyboardAvoidingView>

        {/* Country Picker Modal */}
        <Modal
          visible={isCountryModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsCountryModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsCountryModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <FlatList
                data={COUNTRIES}
                keyExtractor={(item) => item.code + item.dialCode}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => handleSelectCountry(item)}
                  >
                    <Text style={styles.countryName}>
                      {item.name} ({item.code})
                    </Text>
                    <Text style={styles.countryDial}>{item.dialCode}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Email;
