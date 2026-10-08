import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, User } from '@react-native-firebase/auth';
import { AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType>({
    user: null,
    isInitializing: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(user => {
      setUser(user);
      setIsInitializing(false);
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={{ user, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 


