import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
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
import {
  AGE,
  COLORS,
  COUNTRIES,
  DOB_FIELDS,
  GENDER_OPTIONS,
  ICON_NAMES,
  SCREEN_NAMES,
  SIGNUP_STEPS,
} from '@/constants';
import { goBack, isIOS, isValidEmail, resetAndNavigate } from '@/utils';
import { CountryOption, Step } from '@/types';
import { signUpWithEmail } from '@/services';
import { useAuth } from '@/navigation/AuthProvider';

export const Email = () => {
  const { setIsOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(SIGNUP_STEPS.EMAIL);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Form states
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    COUNTRIES[0],
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isSecure, setIsSecure] = useState(true);
  const [gender, setGender] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // DOB states
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [focusedDobField, setFocusedDobField] = useState<
    (typeof DOB_FIELDS)[keyof typeof DOB_FIELDS] | null
  >(DOB_FIELDS.DAY);

  // Country modal
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);

  // DOB Refs
  const monthRef = useRef<any>(null);
  const yearRef = useRef<any>(null);
  const dayRef = useRef<any>(null);

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

  const isEmailValid = isValidEmail(email);

  const cleanDigits = phoneNumber.replace(/\D/g, '');
  const isPhoneValid = cleanDigits.length >= 10;

  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  // DOB Validation & Age Calculation
  const calculateAge = (): { age: number | null; isValidDate: boolean } => {
    if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
      return { age: null, isValidDate: false };
    }

    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (
      m < 1 ||
      m > 12 ||
      d < 1 ||
      d > 31 ||
      y < 1900 ||
      y > new Date().getFullYear()
    ) {
      return { age: null, isValidDate: false };
    }

    const birthDate = new Date(y, m - 1, d);
    if (birthDate.getMonth() !== m - 1 || birthDate.getDate() !== d) {
      return { age: null, isValidDate: false };
    }

    const today = new Date();
    let computedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      computedAge--;
    }

    return { age: computedAge, isValidDate: true };
  };

  const { age, isValidDate } = calculateAge();
  const isAdult = isValidDate && age !== null && age >= AGE.MIN;
  const isDobValid = isAdult;

  const handleBack = useCallback(() => {
    if (loading) return true;
    if (currentStep === SIGNUP_STEPS.GENDER) {
      transitionToStep(SIGNUP_STEPS.DOB);
      return true;
    }
    if (currentStep === SIGNUP_STEPS.DOB) {
      transitionToStep(SIGNUP_STEPS.PASSWORD);
      return true;
    }
    if (currentStep === SIGNUP_STEPS.PASSWORD) {
      transitionToStep(SIGNUP_STEPS.PHONE);
      return true;
    }
    if (currentStep === SIGNUP_STEPS.PHONE) {
      transitionToStep(SIGNUP_STEPS.EMAIL);
      return true;
    }

    goBack();
    return true;
  }, [currentStep]);

  useEffect(() => {
    const backAction = () => {
      return handleBack();
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [handleBack]);

  const handleNext = () => {
    if (currentStep === SIGNUP_STEPS.EMAIL) {
      if (!isEmailValid) return;
      transitionToStep(SIGNUP_STEPS.PHONE);
    } else if (currentStep === SIGNUP_STEPS.PHONE) {
      if (!isPhoneValid) return;
      transitionToStep(SIGNUP_STEPS.PASSWORD);
    } else if (currentStep === SIGNUP_STEPS.PASSWORD) {
      if (!isPasswordValid) return;
      transitionToStep(SIGNUP_STEPS.DOB);
    } else if (currentStep === SIGNUP_STEPS.DOB) {
      if (!isDobValid) return;
      transitionToStep(SIGNUP_STEPS.GENDER);
    } else if (currentStep === SIGNUP_STEPS.GENDER) {
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    if (!gender || loading) return;
    Keyboard.dismiss();

    try {
      setLoading(true);
      const fullDob = `${day}/${month}/${year}`;
      const fullPhone = `${selectedCountry.dialCode} ${cleanDigits}`;
      setIsOnboarding(true);
      await signUpWithEmail({
        email,
        password,
        phoneNumber: fullPhone,
        dob: fullDob,
        age,
        gender,
      });
      resetAndNavigate(SCREEN_NAMES.UPLOAD_IMAGE);
    } catch (error: any) {
      setIsOnboarding(false);
      let errorMessage = 'An error occurred during signup.';
      if (error?.code === 'auth/email-already-in-use') {
        errorMessage = 'That email address is already in use!';
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
      } else if (error?.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      Alert.alert('Sign Up Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case SIGNUP_STEPS.EMAIL:
        return isEmailValid;
      case SIGNUP_STEPS.PHONE:
        return isPhoneValid;
      case SIGNUP_STEPS.PASSWORD:
        return isPasswordValid;
      case SIGNUP_STEPS.DOB:
        return isDobValid;
      case SIGNUP_STEPS.GENDER:
        return !!gender;
      default:
        return false;
    }
  };

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
          keyboardVerticalOffset={isIOS ? 20 : 10}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* STEP 1: EMAIL */}
            {currentStep === SIGNUP_STEPS.EMAIL && (
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
                  We'll send you a code to verify your email. You may need to
                  check your spam email folder.
                </Text>
              </View>
            )}

            {/* STEP 2: MOBILE / PHONE */}
            {currentStep === SIGNUP_STEPS.PHONE && (
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
                    <AppIcon
                      name={ICON_NAMES.CHEVRON_DOWN}
                      size={16}
                      color={COLORS.textDark}
                    />
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
                  We'll send you a code to verify your phone. Message and data
                  rates may apply.{' '}
                  <Text style={styles.linkText} onPress={handleLinkPress}>
                    What happens if your number changes?
                  </Text>
                </Text>
              </View>
            )}

            {/* STEP 3: PASSWORD */}
            {currentStep === SIGNUP_STEPS.PASSWORD && (
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
                        name={
                          isSecure
                            ? ICON_NAMES.EYE_OFF_OUTLINE
                            : ICON_NAMES.EYE_OUTLINE
                        }
                        size={20}
                        color={COLORS.textSubtle}
                      />
                    </TouchableOpacity>
                  }
                />
                <Text style={styles.helperText}>
                  Must contain at least 8 characters, including letters and
                  numbers. Don't share it with anyone.
                </Text>

                <View style={styles.passwordRequirements}>
                  <View style={styles.reqItem}>
                    <Text
                      style={[
                        styles.reqCheck,
                        hasMinLength ? styles.reqValid : styles.reqInvalid,
                      ]}
                    >
                      {hasMinLength ? '✓' : '•'}
                    </Text>
                    <Text style={styles.reqText}>At least 8 characters</Text>
                  </View>
                  <View style={styles.reqItem}>
                    <Text
                      style={[
                        styles.reqCheck,
                        hasLetter && hasNumber
                          ? styles.reqValid
                          : styles.reqInvalid,
                      ]}
                    >
                      {hasLetter && hasNumber ? '✓' : '•'}
                    </Text>
                    <Text style={styles.reqText}>
                      Contains letters and numbers
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* STEP 4: DOB */}
            {currentStep === SIGNUP_STEPS.DOB && (
              <View>
                <Text style={styles.title}>When's your birthday?</Text>
                <View style={styles.dobContainer}>
                  <View style={styles.dobSegment}>
                    <TextInput
                      ref={dayRef}
                      style={[
                        styles.dobInput,
                        styles.dobDay,
                        focusedDobField === DOB_FIELDS.DAY &&
                          styles.dobInputFocused,
                      ]}
                      value={day}
                      onChangeText={handleDayChange}
                      placeholder="DD"
                      placeholderTextColor={COLORS.textMuted}
                      keyboardType="number-pad"
                      maxLength={2}
                      onFocus={() => setFocusedDobField(DOB_FIELDS.DAY)}
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
                        focusedDobField === DOB_FIELDS.MONTH &&
                          styles.dobInputFocused,
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
                      onFocus={() => setFocusedDobField(DOB_FIELDS.MONTH)}
                    />
                  </View>

                  <Text style={styles.dobSeparator}>/</Text>

                  <View style={styles.dobSegment}>
                    <TextInput
                      ref={yearRef}
                      style={[
                        styles.dobInput,
                        styles.dobYear,
                        focusedDobField === DOB_FIELDS.YEAR &&
                          styles.dobInputFocused,
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
                      onFocus={() => setFocusedDobField(DOB_FIELDS.YEAR)}
                    />
                  </View>
                </View>

                {isValidDate && age !== null ? (
                  <View style={styles.ageBadgeContainer}>
                    {age >= AGE.MIN ? (
                      <View style={styles.ageBadge}>
                        <Text style={styles.ageBadgeText}>
                          Age: {age} years old
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.ageErrorBadge}>
                        <Text style={styles.ageErrorText}>
                          You must be at least {AGE.MIN} years old to use
                          Tinder.
                        </Text>
                      </View>
                    )}
                  </View>
                ) : null}

                <Text style={styles.helperText}>
                  Your age will be public, not your birthday. You must be at
                  least {AGE.MIN} years old to use Tinder.
                </Text>
              </View>
            )}

            {/* STEP 5: GENDER */}
            {currentStep === SIGNUP_STEPS.GENDER && (
              <View>
                <Text style={styles.title}>What's your gender?</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.genderButton,
                      gender === GENDER_OPTIONS.WOMAN &&
                        styles.genderButtonSelected,
                    ]}
                    onPress={() => setGender(GENDER_OPTIONS.WOMAN)}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === GENDER_OPTIONS.WOMAN &&
                          styles.genderTextSelected,
                      ]}
                    >
                      {GENDER_OPTIONS.WOMAN}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.genderButton,
                      gender === GENDER_OPTIONS.MAN &&
                        styles.genderButtonSelected,
                    ]}
                    onPress={() => setGender(GENDER_OPTIONS.MAN)}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === GENDER_OPTIONS.MAN &&
                          styles.genderTextSelected,
                      ]}
                    >
                      {GENDER_OPTIONS.MAN}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>

          {/* Bottom Action Button */}
          <View style={styles.bottomContainer}>
            <Button
              title={currentStep === SIGNUP_STEPS.GENDER ? 'Sign Up' : 'Next'}
              variant="primary"
              disabled={!isCurrentStepValid() || loading}
              loading={loading}
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
                keyExtractor={item => item.code + item.dialCode}
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
