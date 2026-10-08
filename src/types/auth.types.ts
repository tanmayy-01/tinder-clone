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
}

export interface AuthContextType {
  user: User | null;
  isInitializing: boolean;
}
