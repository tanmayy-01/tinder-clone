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