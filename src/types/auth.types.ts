import { User } from '@react-native-firebase/auth';

export interface SignUpData {
  email: string;
  password: string;
  phoneNumber: string;
  dob: string;
  age: number | null;
  gender: string;
  city?: string;
}

export interface UpdateUserData {
  uid: string;
  images: string[];
  city: string;
  name: string;
  about: string;
  bio?: string;
  hobbies: string[];
  profileCompleted?: boolean;
}

export interface UserProfile {
  uid: string;
  name?: string;
  email: string;
  phoneNumber?: string;
  dob?: string;
  age?: number | null;
  gender?: string;
  about?: string;
  bio?: string;
  city?: string;
  images: string[];
  hobbies: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface AuthContextType {
  user: User | null;
  isInitializing: boolean;
  isProfileCompleted: boolean;
  isOnboarding: boolean;
  setIsOnboarding: (val: boolean) => void;
}

