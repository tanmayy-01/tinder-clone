import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAMES } from '@/constants';
import SignUp from '@/screens/auth/SignUp/SignUp';
import Login from '@/screens/auth/Login/Login';
import Email from '@/screens/auth/Email';

const Stack = createNativeStackNavigator();

interface AuthStackProps {
  initialRoute?: (typeof SCREEN_NAMES)[keyof typeof SCREEN_NAMES];
}

const AuthStack: React.FC<AuthStackProps> = ({
  initialRoute = SCREEN_NAMES.SIGNUP,
}) => {
  return (
    <Stack.Navigator
      key={initialRoute}
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name={SCREEN_NAMES.SIGNUP} component={SignUp} />
      <Stack.Screen name={SCREEN_NAMES.EMAIL} component={Email} />
      <Stack.Screen name={SCREEN_NAMES.LOGIN} component={Login} />
    </Stack.Navigator>
  );
};

export default AuthStack;
