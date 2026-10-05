import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAMES } from '@/constants';
import SignUp from '@/screens/auth/SignUp/SignUp';
import Login from '@/screens/auth/Login/Login';

const Stack = createNativeStackNavigator();

interface AppNavigationProps {
  initialRoute?: typeof SCREEN_NAMES[keyof typeof SCREEN_NAMES];
}

const AppNavigation: React.FC<AppNavigationProps> = ({
  initialRoute = SCREEN_NAMES.LOGIN,
}) => {
  return (
    <Stack.Navigator
      key={initialRoute}
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={SCREEN_NAMES.LOGIN} component={Login} />
      <Stack.Screen name={SCREEN_NAMES.SIGNUP} component={SignUp} />
    </Stack.Navigator>
  );
};

export default AppNavigation;