import { SignUpData, UpdateUserData } from '@/types';
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
  city,
}: UpdateUserData) => {
  const db = getFirestore();
  const userRef = doc(db, 'users', uid);

  await setDoc(
    userRef,
    {
      images,
      city: city.trim(),
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
