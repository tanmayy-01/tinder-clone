import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAMES } from '@/constants';
import TabStack from './TabStack';
import UploadImage from '@/screens/main/UploadImage';

const Stack = createNativeStackNavigator();

interface MainStackProps {
  initialRoute?: string;
}

const MainStack: React.FC<MainStackProps> = ({
  initialRoute = SCREEN_NAMES.MAIN,
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
      <Stack.Screen name={SCREEN_NAMES.MAIN} component={TabStack} />
      <Stack.Screen name={SCREEN_NAMES.UPLOAD_IMAGE} component={UploadImage} />
    </Stack.Navigator>
  );
};

export default MainStack;
