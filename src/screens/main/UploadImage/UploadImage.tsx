import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  ScrollView,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { styles } from './UploadImage.styles';
import { Header, Button, UnderlineInput, AppIcon } from '@/components';
import {
  COLORS,
  ICON_NAMES,
  MIN_REQUIRED_PHOTOS,
  POPULAR_HOBBIES,
  SCREEN_NAMES,
  TOTAL_SLOTS,
  UPLOAD_IMAGE_STEPS,
} from '@/constants';
import { isIOS, resetAndNavigate } from '@/utils';
import { getCurrentUser, updateUserProfile } from '@/services';
import { ImageStep } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/navigation/AuthProvider';

const MAX_HOBBIES = 5;

export const UploadImage = () => {
  const navigation = useNavigation();
  const { setIsOnboarding } = useAuth();
  const [step, setStep] = useState<ImageStep>(UPLOAD_IMAGE_STEPS.IMAGES);
  const [images, setImages] = useState<string[]>(Array(TOTAL_SLOTS).fill(''));
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const isNavigatingAway = useRef(false);

  const selectedCount = images.filter(img => Boolean(img)).length;
  const isImageStepValid = selectedCount >= MIN_REQUIRED_PHOTOS;
  const isCityStepValid = city.trim().length > 0;
  const isNameStepValid = name.trim().length >= 2;
  const isBioStepValid = bio.trim().length >= 3;
  const isHobbiesStepValid = selectedHobbies.length >= 1;

  const isCurrentStepValid = () => {
    switch (step) {
      case UPLOAD_IMAGE_STEPS.IMAGES:
        return isImageStepValid;
      case UPLOAD_IMAGE_STEPS.CITY:
        return isCityStepValid;
      case UPLOAD_IMAGE_STEPS.NAME:
        return isNameStepValid;
      case UPLOAD_IMAGE_STEPS.BIO:
        return isBioStepValid;
      case UPLOAD_IMAGE_STEPS.HOBBIES:
        return isHobbiesStepValid;
      default:
        return false;
    }
  };

  const transitionToStep = (nextStep: ImageStep) => {
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
    setStep(nextStep);
  };

  const handleBack = useCallback(() => {
    if (isSaving) return true;
    if (step === UPLOAD_IMAGE_STEPS.HOBBIES) {
      transitionToStep(UPLOAD_IMAGE_STEPS.BIO);
      return true;
    }
    if (step === UPLOAD_IMAGE_STEPS.BIO) {
      transitionToStep(UPLOAD_IMAGE_STEPS.NAME);
      return true;
    }
    if (step === UPLOAD_IMAGE_STEPS.NAME) {
      transitionToStep(UPLOAD_IMAGE_STEPS.CITY);
      return true;
    }
    if (step === UPLOAD_IMAGE_STEPS.CITY) {
      transitionToStep(UPLOAD_IMAGE_STEPS.IMAGES);
      return true;
    }
    // IMAGES step: back disabled!
    return true;
  }, [step, isSaving]);

  useEffect(() => {
    const backAction = () => handleBack();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [handleBack]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isNavigatingAway.current) {
        return;
      }
      e.preventDefault();
      if (step === UPLOAD_IMAGE_STEPS.HOBBIES) {
        transitionToStep(UPLOAD_IMAGE_STEPS.BIO);
      } else if (step === UPLOAD_IMAGE_STEPS.BIO) {
        transitionToStep(UPLOAD_IMAGE_STEPS.NAME);
      } else if (step === UPLOAD_IMAGE_STEPS.NAME) {
        transitionToStep(UPLOAD_IMAGE_STEPS.CITY);
      } else if (step === UPLOAD_IMAGE_STEPS.CITY) {
        transitionToStep(UPLOAD_IMAGE_STEPS.IMAGES);
      }
    });
    return unsubscribe;
  }, [navigation, step]);

  const handlePickImage = async (index: number) => {
    try {
      const result = await ImageCropPicker.openPicker({
        width: 600,
        height: 800,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      if (result?.path) {
        setImages(prev => {
          const updated = [...prev];
          updated[index] = result.path;
          return updated;
        });
      }
    } catch (error: any) {
      if (error?.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Notice', error?.message || 'Could not select image.');
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const updated = [...prev];
      updated[index] = '';
      return updated;
    });
  };

  const handleSlotPress = (index: number) => {
    if (images[index]) {
      Alert.alert('Photo Options', 'What would you like to do?', [
        {
          text: 'Change Photo',
          onPress: () => handlePickImage(index),
        },
        {
          text: 'Remove Photo',
          style: 'destructive',
          onPress: () => handleRemoveImage(index),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      handlePickImage(index);
    }
  };

  const handleToggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(prev => prev.filter(h => h !== hobby));
    } else {
      if (selectedHobbies.length >= MAX_HOBBIES) {
        Alert.alert('Limit Reached', `You can select up to ${MAX_HOBBIES} passions.`);
        return;
      }
      setSelectedHobbies(prev => [...prev, hobby]);
    }
  };

  const handleNext = () => {
    if (step === UPLOAD_IMAGE_STEPS.IMAGES) {
      if (!isImageStepValid) return;
      transitionToStep(UPLOAD_IMAGE_STEPS.CITY);
    } else if (step === UPLOAD_IMAGE_STEPS.CITY) {
      if (!isCityStepValid) return;
      transitionToStep(UPLOAD_IMAGE_STEPS.NAME);
    } else if (step === UPLOAD_IMAGE_STEPS.NAME) {
      if (!isNameStepValid) return;
      transitionToStep(UPLOAD_IMAGE_STEPS.BIO);
    } else if (step === UPLOAD_IMAGE_STEPS.BIO) {
      if (!isBioStepValid) return;
      transitionToStep(UPLOAD_IMAGE_STEPS.HOBBIES);
    } else if (step === UPLOAD_IMAGE_STEPS.HOBBIES) {
      handleSave();
    }
  };

  const handleSave = async () => {
    if (!isHobbiesStepValid || isSaving) return;

    const user = getCurrentUser();
    const uid = user?.uid;

    if (!uid) {
      Alert.alert(
        'Authentication Required',
        'Could not find active user session. Please sign in.',
        [{ text: 'OK', onPress: () => resetAndNavigate(SCREEN_NAMES.SIGNUP) }],
      );
      return;
    }

    try {
      setIsSaving(true);
      const validImages = images.filter(img => Boolean(img));

      await updateUserProfile({
        uid,
        images: validImages,
        city: city.trim(),
        name: name.trim(),
        bio: bio.trim(),
        about: bio.trim(),
        hobbies: selectedHobbies,
      });

      setIsOnboarding(false);
      isNavigatingAway.current = true;
      resetAndNavigate(SCREEN_NAMES.MAIN);
    } catch (error: any) {
      Alert.alert('Update Failed', error?.message || 'Could not save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.safeArea}>
        <Header
          onBackPress={handleBack}
          showBack={step !== UPLOAD_IMAGE_STEPS.IMAGES}
        />

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={isIOS ? 'padding' : 'height'}
          keyboardVerticalOffset={isIOS ? 20 : 10}
        >
          <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              {step === UPLOAD_IMAGE_STEPS.IMAGES && (
                <View>
                  <Text style={styles.title}>Add your recent pics</Text>

                  {/* 6 Photo Slots Grid */}
                  <View style={styles.gridContainer}>
                    {images.map((imgUri, index) => {
                      const hasImage = Boolean(imgUri);
                      return (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.85}
                          style={[styles.card, hasImage && styles.cardFilled]}
                          onPress={() => handleSlotPress(index)}
                        >
                          {hasImage ? (
                            <Image
                              source={{ uri: imgUri }}
                              style={styles.image}
                              resizeMode="cover"
                            />
                          ) : null}

                          <TouchableOpacity
                            style={[
                              styles.plusBadge,
                              hasImage && styles.removeBadge,
                            ]}
                            activeOpacity={0.8}
                            onPress={() =>
                              hasImage
                                ? handleRemoveImage(index)
                                : handlePickImage(index)
                            }
                          >
                            <AppIcon
                              name={
                                hasImage ? ICON_NAMES.CLOSE : ICON_NAMES.ADD
                              }
                              size={18}
                              color={COLORS.white}
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Info / Counter Section */}
                  <View style={styles.infoSection}>
                    <View style={styles.counterBadge}>
                      <Text style={styles.counterText}>
                        {selectedCount} / {TOTAL_SLOTS}
                      </Text>
                    </View>
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoText}>
                        Hey! Let's add 2 to start. We{'\n'}recommend a face pic.
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Step 2: City Step */}
              {step === UPLOAD_IMAGE_STEPS.CITY && (
                <View>
                  <Text style={styles.title}>What's your city?</Text>
                  <UnderlineInput
                    value={city}
                    onChangeText={setCity}
                    placeholder="Enter city name"
                    autoCapitalize="words"
                    autoFocus
                    containerStyle={styles.cityInputContainer}
                  />
                  <Text style={styles.helperText}>
                    This is how it will appear on your Tinder profile to connect
                    you with matches nearby.
                  </Text>
                </View>
              )}

              {/* Step 3: Name Step */}
              {step === UPLOAD_IMAGE_STEPS.NAME && (
                <View>
                  <Text style={styles.title}>My first name is</Text>
                  <UnderlineInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    autoCapitalize="words"
                    autoFocus
                    containerStyle={styles.nameInputContainer}
                  />
                  <Text style={styles.helperText}>
                    This is how it will appear on your Tinder profile. Be yourself!
                  </Text>
                </View>
              )}

              {/* Step 4: Bio Step */}
              {step === UPLOAD_IMAGE_STEPS.BIO && (
                <View>
                  <Text style={styles.title}>About me</Text>
                  <Text style={styles.subtitle}>
                    Write a short bio to introduce yourself to your potential matches.
                  </Text>
                  <View style={styles.bioInputContainer}>
                    <TextInput
                      style={styles.bioInput}
                      value={bio}
                      onChangeText={setBio}
                      placeholder="Tell others what you love, what you're looking for, or a fun fact about you..."
                      placeholderTextColor={COLORS.textSubtle}
                      multiline
                      numberOfLines={4}
                      maxLength={300}
                      autoFocus
                    />
                    <View style={styles.bioFooter}>
                      <Text style={styles.charCount}>{bio.length} / 300</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Step 5: Hobbies Step */}
              {step === UPLOAD_IMAGE_STEPS.HOBBIES && (
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>What are your passions?</Text>
                  <Text style={styles.subtitle}>
                    Select up to 5 passions to help matches discover what you have in common.
                  </Text>
                  <View style={styles.hobbiesHeaderRow}>
                    <Text style={styles.helperText}>Tap to select</Text>
                    <View style={styles.hobbiesCountBadge}>
                      <Text style={styles.hobbiesCountText}>
                        {selectedHobbies.length} / {MAX_HOBBIES} selected
                      </Text>
                    </View>
                  </View>

                  <ScrollView
                    style={styles.stepScroll}
                    contentContainerStyle={styles.stepScrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    <View style={styles.chipsContainer}>
                      {POPULAR_HOBBIES.map((hobby) => {
                        const isSelected = selectedHobbies.includes(hobby);
                        return (
                          <TouchableOpacity
                            key={hobby}
                            activeOpacity={0.75}
                            style={[
                              styles.chip,
                              isSelected && styles.chipSelected,
                            ]}
                            onPress={() => handleToggleHobby(hobby)}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                isSelected && styles.chipTextSelected,
                              ]}
                            >
                              {hobby}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              )}
            </Animated.View>

            {/* Bottom Button */}
            <View style={styles.bottomContainer}>
              <Button
                title={
                  step === UPLOAD_IMAGE_STEPS.HOBBIES ? 'Save' : 'Next'
                }
                variant="primary"
                disabled={!isCurrentStepValid() || isSaving}
                loading={isSaving}
                onPress={handleNext}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UploadImage;
