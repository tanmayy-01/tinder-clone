import { SignUpData, UpdateUserData, UserProfile } from '@/types';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

/**
 * Sign up a user with email and password
 */
export const signUpWithEmail = async (data: SignUpData) => {
  const { email, password, phoneNumber, dob, age, gender } = data;

  const auth = getAuth();
  const db = getFirestore();

  // 1. Create user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  const uid = userCredential.user.uid;

  // 2. Store user data in 'users' collection
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    uid,
    email: email.trim(),
    phoneNumber,
    dob,
    age,
    gender,
    city: '',
    images: [],
    profileCompleted: false,
    createdAt: serverTimestamp(),
  });

  return userCredential.user;
};

/**
 * Update user profile with images and city.
 */
export const updateUserProfile = async ({
  uid,
  images,
  city ='',
  name,
  about,
  hobbies,
}: UpdateUserData) => {
  const db = getFirestore();
  const userRef = doc(db, 'users', uid);

  const finalBio = (about || '').trim();

  await setDoc(
    userRef,
    {
      images,
      city: city.trim(),
      ...(name && name.trim() ? { name: name.trim() } : {}),
      ...(finalBio ? { about: finalBio, bio: finalBio } : {}),
      ...(hobbies && hobbies.length > 0 ? { hobbies } : {}),
      profileCompleted: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

/**
 * Get the currently authenticated user
 */
export const getCurrentUser = () => {
  return getAuth().currentUser;
};

/**
 * Sign in user with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  return userCredential.user;
};

/**
 * Update full user profile details (name, phone, about, age, city, images, etc.)
 */
export const updateUserFullProfile = async (
  uid: string,
  profileData: Record<string, any>,
) => {
  const db = getFirestore();
  const userRef = doc(db, 'users', uid);

  await setDoc(
    userRef,
    {
      ...profileData,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

/**
 * Sign out the currently authenticated user
 */
export const signOutUser = async () => {
  const auth = getAuth();
  await auth.signOut();
};

