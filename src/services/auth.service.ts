import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';

export interface SignUpData {
  email: string;
  password: string;
  phoneNumber: string;
  dob: string;
  age: number | null;
  gender: string;
  city?: string;
}

/**
 * Sign up a user with email and password and store user profile data in Firestore.
 */
export const signUpWithEmail = async (data: SignUpData) => {
  const { email, password, phoneNumber, dob, age, gender } = data;

  const auth = getAuth();
  const db = getFirestore();

  // 1. Create user in Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  const uid = userCredential.user.uid;

  // 2. Store user data in Firestore 'users' collection/table
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    uid,
    email: email.trim(),
    phoneNumber,
    dob,
    age,
    gender,
    city: '', // Placeholder for city, can be updated later
    images: [], // Column for multiple images to be added in next step
    createdAt: serverTimestamp(),
  });

  return userCredential.user;
};

export interface UpdateUserData {
  uid: string;
  images: string[];
  city: string;
}

/**
 * Update user table/document in Firestore with images and city.
 */
export const updateUserProfile = async ({ uid, images, city }: UpdateUserData) => {
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

export const getCurrentUser = () => {
  return getAuth().currentUser;
};

