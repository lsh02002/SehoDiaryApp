import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MyPage from '../pages/mypage/MyPage';
import { MypageStackParamList } from '../types/type';

const Stack = createNativeStackNavigator<MypageStackParamList>();

const MypageNatigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Mypage" component={MyPage} />      
    </Stack.Navigator>
  );
};

export default MypageNatigator;
