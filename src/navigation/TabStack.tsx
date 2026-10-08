import { AppIcon } from '@/components';
import { COLORS, ICON_NAMES, SCREEN_NAMES } from '@/constants';
import { scale } from '@/lib/size';
import Chat from '@/screens/main/Chat';
import Profile from '@/screens/main/Profile';
import Swipe from '@/screens/main/Swipe';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

const Tab = createBottomTabNavigator();

const TabStack = () => {

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.black,
        tabBarStyle: { 
          height: 60,
          paddingTop: 5
        }
      }}
    >
      <Tab.Screen
        name={SCREEN_NAMES.SWIPE}
        component={Swipe}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AppIcon
              name={focused ? ICON_NAMES.HEART : ICON_NAMES.HEART_OUTLINE}
              size={scale.ms(26)}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.CHAT}
        component={Chat}
        options={{
         
          tabBarIcon: ({ color, focused }) => (
            <AppIcon
              name={focused ? ICON_NAMES.CHAT_BUBBLE : ICON_NAMES.CHAT_BUBBLE_OUTLINE}
              size={scale.ms(25)}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.PROFILE}
        component={Profile}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AppIcon
              name={focused ? ICON_NAMES.PERSON : ICON_NAMES.PERSON_OUTLINE}
              size={scale.ms(25)}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabStack;