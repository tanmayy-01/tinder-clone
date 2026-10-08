import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { styles } from './Profile.styles';
import { AppIcon } from '@/components';
import { COLORS, ICON_NAMES, SCREEN_NAMES } from '@/constants';
import { getCurrentUser, updateUserFullProfile, signOutUser } from '@/services';
import { UserProfile } from '@/types';
import { isIOS } from '@/utils';
import { getFirestore, doc, onSnapshot } from '@react-native-firebase/firestore';
import { useAuth } from '@/navigation/AuthProvider';

const MAX_PHOTOS = 6;

export const Profile = () => {
  const { setIsOnboarding } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal States
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAbout, setEditAbout] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const currentUser = getCurrentUser();

  // Real-time listener for current user profile
  useEffect(() => {
    if (!currentUser?.uid) {
      setIsLoading(false);
      return;
    }

    const db = getFirestore();
    const userRef = doc(db, 'users', currentUser.uid);

    const unsubscribe = onSnapshot(
      userRef,
      docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile(data);
        }
        setIsLoading(false);
      },
      error => {
        console.error('Profile fetch error:', error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Open Edit Profile modal with populated values
  const handleOpenEdit = () => {
    const currentName =
      profile?.name ||
      '';
    setEditName(currentName);
    setEditPhone(profile?.phoneNumber || '');
    setEditAbout( profile?.about || '');
    setEditAge(profile?.age ? String(profile.age) : '');
    setEditCity(profile?.city || '');

    // Fill array up to 6 slots
    const photos = profile?.images ? [...profile.images] : [];
    while (photos.length < MAX_PHOTOS) {
      photos.push('');
    }
    setEditImages(photos);
    setIsEditModalVisible(true);
  };

  // Add or change photo at slot
  const handlePickPhoto = async (index: number) => {
    try {
      const result = await ImageCropPicker.openPicker({
        width: 600,
        height: 800,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      if (result?.path) {
        setEditImages(prev => {
          const updated = [...prev];
          updated[index] = result.path;
          return updated;
        });
      }
    } catch (error: any) {
      if (error?.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Notice', error?.message || 'Could not select photo.');
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    setEditImages(prev => {
      const updated = [...prev];
      updated[index] = '';
      return updated;
    });
  };

  // Save updated profile
  const handleSaveProfile = async () => {
    if (!currentUser?.uid) return;

    try {
      setIsSaving(true);
      const cleanedImages = editImages.filter(img => Boolean(img));
      const parsedAge = editAge ? parseInt(editAge, 10) : profile?.age || null;

      await updateUserFullProfile(currentUser.uid, {
        name: editName.trim(),
        phoneNumber: editPhone.trim(),
        about: editAbout.trim(),
        bio: editAbout.trim(),
        age: parsedAge,
        city: editCity.trim(),
        images: cleanedImages,
      });

      setIsEditModalVisible(false);
      Alert.alert('Profile Updated', 'Your profile changes have been saved.');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Could not save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Logout
  const handleLogoutPress = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Tinder?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsOnboarding(false);
            await signOutUser();
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Could not log out.');
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.safeArea,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.tinderRed} />
      </View>
    );
  }

  const displayName =
    profile?.name ||
    profile?.email?.split('@')[0] ||
    currentUser?.displayName ||
    'User';
  const displayAge = profile?.age ? `, ${profile.age}` : '';
  const profilePic =
    profile?.images && profile.images.length > 0 ? profile.images[0] : null;

  return (
    <View style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={handleLogoutPress}
          activeOpacity={0.7}
        >
          <AppIcon
            name={ICON_NAMES.LOG_OUT}
            size={22}
            color={COLORS.textDark}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleOpenEdit}
            activeOpacity={0.9}
          >
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <AppIcon
                  name={ICON_NAMES.PERSON}
                  size={54}
                  color={COLORS.textSubtle}
                />
              </View>
            )}
            <View style={styles.avatarEditBadge}>
              <AppIcon name={ICON_NAMES.PENCIL} size={16} color={COLORS.white} />
            </View>
          </TouchableOpacity>

          {/* User Name & Age */}
          <View style={styles.nameRow}>
            <Text style={styles.userName}>
              {displayName}
              {displayAge}
            </Text>
            <View style={styles.verifiedBadge}>
              <AppIcon
                name={ICON_NAMES.CHECKMARK_CIRCLE}
                size={20}
                color="#3B82F6"
              />
            </View>
          </View>

          {/* City / Location */}
          <Text style={styles.userCity}>
            {profile?.city ? `📍 Lives in ${profile.city}` : '📍 Add your location'}
          </Text>

          {/* 3 Floating Action Buttons */}
          <View style={styles.actionButtonsRow}>
          
            {/* Edit Profile Button (Central Red Button) */}
            <View style={styles.actionItemContainer}>
              <TouchableOpacity
                style={[styles.circleActionButton, styles.circleActionEdit]}
                onPress={handleOpenEdit}
                activeOpacity={0.8}
              >
                <AppIcon
                  name={ICON_NAMES.PENCIL}
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.circleActionLabel,
                  { color: COLORS.tinderRed, fontWeight: '700' },
                ]}
              >
                EDIT PROFILE
              </Text>
            </View>

            {/* Add Media Button */}
            <View style={styles.actionItemContainer}>
              <TouchableOpacity
                style={styles.circleActionButton}
                onPress={handleOpenEdit}
                activeOpacity={0.8}
              >
                <AppIcon
                  name={ICON_NAMES.CAMERA}
                  size={24}
                  color={COLORS.textSubtle}
                />
              </TouchableOpacity>
              <Text style={styles.circleActionLabel}>ADD MEDIA</Text>
            </View>
          </View>
        </View>

        {/* Profile Detail Cards */}
        <View style={styles.cardsContainer}>
          {/* About Me Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <AppIcon
                  name={ICON_NAMES.INFORMATION_CIRCLE_OUTLINE}
                  size={20}
                  color={COLORS.tinderRed}
                />
                <Text style={styles.cardTitle}>About Me</Text>
              </View>
              <TouchableOpacity onPress={handleOpenEdit}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            </View>
            {profile?.about ? (
              <Text style={styles.aboutText}>
                {profile.about}
              </Text>
            ) : (
              <Text style={styles.emptyAboutText}>
                No bio added yet. Tell potential matches about yourself!
              </Text>
            )}
          </View>

          {/* Passions & Hobbies Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <AppIcon
                  name={ICON_NAMES.HEART}
                  size={20}
                  color={COLORS.tinderRed}
                />
                <Text style={styles.cardTitle}>Passions & Hobbies</Text>
              </View>
              <TouchableOpacity onPress={handleOpenEdit}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            </View>
            {profile?.hobbies && profile.hobbies.length > 0 ? (
              <View style={styles.hobbiesContainer}>
                {profile.hobbies.map((hobby, idx) => (
                  <View key={idx} style={styles.hobbyBadge}>
                    <Text style={styles.hobbyBadgeText}>{hobby}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyAboutText}>
                No passions selected yet.
              </Text>
            )}
          </View>

          {/* Personal Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <AppIcon
                  name={ICON_NAMES.PERSON_OUTLINE}
                  size={20}
                  color={COLORS.tinderRed}
                />
                <Text style={styles.cardTitle}>Personal Info</Text>
              </View>
              <TouchableOpacity onPress={handleOpenEdit}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Phone */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <AppIcon
                  name={ICON_NAMES.MOBILE}
                  size={16}
                  color={COLORS.textSubtle}
                />
              </View>
              <View style={styles.infoLabelContainer}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>
                  {profile?.phoneNumber || 'Not provided'}
                </Text>
              </View>
            </View>

            {/* Email */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <AppIcon
                  name={ICON_NAMES.MAIL_OUTLINE}
                  size={16}
                  color={COLORS.textSubtle}
                />
              </View>
              <View style={styles.infoLabelContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>
                  {profile?.email || currentUser?.email || 'Not provided'}
                </Text>
              </View>
            </View>

            {/* Age & Birthday */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <AppIcon
                  name={ICON_NAMES.HEART_OUTLINE}
                  size={16}
                  color={COLORS.textSubtle}
                />
              </View>
              <View style={styles.infoLabelContainer}>
                <Text style={styles.infoLabel}>Age & Birthday</Text>
                <Text style={styles.infoValue}>
                  {profile?.age
                    ? `${profile.age} years old ${
                        profile.dob ? `(${profile.dob})` : ''
                      }`
                    : 'Not provided'}
                </Text>
              </View>
            </View>

            {/* City */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <AppIcon
                  name={ICON_NAMES.LOCATION}
                  size={16}
                  color={COLORS.textSubtle}
                />
              </View>
              <View style={styles.infoLabelContainer}>
                <Text style={styles.infoLabel}>City</Text>
                <Text style={styles.infoValue}>
                  {profile?.city || 'Not provided'}
                </Text>
              </View>
            </View>

            {/* Gender */}
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <View style={styles.infoIconContainer}>
                <AppIcon
                  name={ICON_NAMES.PERSON}
                  size={16}
                  color={COLORS.textSubtle}
                />
              </View>
              <View style={styles.infoLabelContainer}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>
                  {profile?.gender || 'Not provided'}
                </Text>
              </View>
            </View>
          </View>

          {/* Photo Gallery Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <AppIcon
                  name={ICON_NAMES.CAMERA}
                  size={20}
                  color={COLORS.tinderRed}
                />
                <Text style={styles.cardTitle}>Recent Photos</Text>
              </View>
              <TouchableOpacity onPress={handleOpenEdit}>
                <Text style={styles.editLink}>Manage</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.galleryGrid}>
              {profile?.images && profile.images.length > 0 ? (
                profile.images.map((imgUri, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: imgUri }}
                    style={styles.galleryPhoto}
                  />
                ))
              ) : (
                <TouchableOpacity
                  style={styles.galleryEmptySlot}
                  onPress={handleOpenEdit}
                >
                  <AppIcon
                    name={ICON_NAMES.ADD}
                    size={28}
                    color={COLORS.tinderRed}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={isIOS ? 'padding' : undefined}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setIsEditModalVisible(false)}
              disabled={isSaving}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator size="small" color={COLORS.tinderRed} />
              ) : (
                <Text style={styles.modalSaveText}>Done</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Photos Management */}
            <Text style={styles.modalSectionLabel}>Profile Photos</Text>
            <View style={styles.galleryGrid}>
              {editImages.map((uri, index) => {
                const hasImg = Boolean(uri);
                return (
                  <View key={index} style={styles.photoSlotContainer}>
                    <TouchableOpacity
                      style={[
                        styles.galleryPhoto,
                        !hasImg && styles.galleryEmptySlot,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => handlePickPhoto(index)}
                    >
                      {hasImg ? (
                        <Image source={{ uri }} style={styles.galleryPhoto} />
                      ) : (
                        <AppIcon
                          name={ICON_NAMES.ADD}
                          size={24}
                          color={COLORS.textSubtle}
                        />
                      )}
                    </TouchableOpacity>

                    {hasImg ? (
                      <TouchableOpacity
                        style={styles.photoSlotDeleteButton}
                        onPress={() => handleRemovePhoto(index)}
                      >
                        <AppIcon
                          name={ICON_NAMES.CLOSE}
                          size={14}
                          color={COLORS.white}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.photoSlotAddButton}
                        onPress={() => handlePickPhoto(index)}
                      >
                        <AppIcon
                          name={ICON_NAMES.ADD}
                          size={14}
                          color={COLORS.white}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Name */}
            <Text style={styles.modalSectionLabel}>Name</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalTextInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Your full name"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            {/* About Me / Bio */}
            <Text style={styles.modalSectionLabel}>About Me</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={[styles.modalTextInput, styles.modalTextArea]}
                value={editAbout}
                onChangeText={setEditAbout}
                placeholder="Write a bio to share who you are..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                maxLength={300}
              />
              <Text style={styles.charCountText}>
                {editAbout.length} / 300
              </Text>
            </View>

            {/* Phone Number */}
            <Text style={styles.modalSectionLabel}>Phone Number</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalTextInput}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Phone number"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
              />
            </View>

            {/* Age */}
            <Text style={styles.modalSectionLabel}>Age</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalTextInput}
                value={editAge}
                onChangeText={setEditAge}
                placeholder="Your age"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            {/* City */}
            <Text style={styles.modalSectionLabel}>City / Location</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalTextInput}
                value={editCity}
                onChangeText={setEditCity}
                placeholder="City name"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default Profile;