import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, User } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import { AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isInitializing: true,
  isProfileCompleted: false,
  isOnboarding: false,
  setIsOnboarding: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProfileCompleted, setIsProfileCompleted] = useState<boolean>(false);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribeAuth = getAuth().onAuthStateChanged(async currentUser => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const db = getFirestore();
          const userRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const completed = Boolean(
              data?.profileCompleted === true ||
              (data?.images && data.images.length >= 2 && data?.city)
            );
            setIsProfileCompleted(completed);
            if (!completed) {
              setIsOnboarding(true);
            } else {
              setIsOnboarding(false);
            }
          } else {
            setIsProfileCompleted(false);
            setIsOnboarding(true);
          }
        } catch (error) {
          console.error('Error fetching user profile status:', error);
          setIsProfileCompleted(false);
        }
      } else {
        setIsProfileCompleted(false);
        setIsOnboarding(false);
      }

      setIsInitializing(false);
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitializing,
        isProfileCompleted,
        isOnboarding,
        setIsOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
