import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '@/screens/splash';
import { useAuth } from './AuthProvider';
import { navigationRef } from '@/utils';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { SCREEN_NAMES } from '@/constants';

const AppNavigation = () => {
  const { user, isInitializing, isOnboarding } = useAuth();

  if (isInitializing) {
    return <Splash />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {!user ? (
        <AuthStack />
      ) : (
        <MainStack
          initialRoute={
            isOnboarding ? SCREEN_NAMES.UPLOAD_IMAGE : SCREEN_NAMES.MAIN
          }
        />
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;
