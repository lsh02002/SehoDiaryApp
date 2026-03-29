import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLogin } from '../context/LoginContext';
import MyPage from '../pages/mypage/MyPage';
import RootNavigator from './RootNavigator';

const Tab = createBottomTabNavigator();

const iconStyle = {
  width: 24,
  height: 24,
};

const BottomTabNavigator = () => {
  const { isLogin } = useLogin();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#0d6efd',
        tabBarInactiveTintColor: '#6c757d',
      }}
    >
      <Tab.Screen
        name="Home"
        component={RootNavigator}
        options={{
          tabBarLabel: '홈',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/home.svg')}
              style={[iconStyle, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />

      {isLogin && (
        <Tab.Screen
          name="MyPage"
          component={MyPage}
          initialParams={{ tab: 'info' }}
          options={{
            tabBarLabel: '마이페이지',
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({ color }) => (
              <Image
                source={require('../assets/dashboard.svg')}
                style={[iconStyle, { tintColor: color }]}
                resizeMode="contain"
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
