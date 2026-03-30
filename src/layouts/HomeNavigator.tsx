import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../pages/user/LoginPage';
import SignupPage from '../pages/user/SignupPage';
import DiaryCreatePage from '../pages/diary/DiaryCreatePage';
import DiaryEditPage from '../pages/diary/DiaryEditPage';
import { HomeStackParamList } from '../types/type';
import DiaryListPage from '../pages/diary/DiaryListPage';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiaryList" component={DiaryListPage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Signup" component={SignupPage} />
      <Stack.Screen name="DiaryCreate" component={DiaryCreatePage} />
      <Stack.Screen name="DiaryEdit" component={DiaryEditPage} />      
    </Stack.Navigator>
  );
};

export default HomeNavigator;
