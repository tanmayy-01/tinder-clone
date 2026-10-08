import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '@/screens/splash';

import TabStack from './TabStack';
import { useAuth } from './AuthProvider';
import { navigationRef } from '@/utils';
import AuthStack from './AuthStack';

const AppNavigation = () => {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return <Splash />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {user ? <TabStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;
