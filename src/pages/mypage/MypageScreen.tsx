import React from 'react';
import { View, Text } from 'react-native';
import Layout from '../../layouts/Layout';

const MypageScreen = ({ route }: any) => {
  const tab = route?.params?.tab ?? 'mypage';

  return (
    <Layout>
      <View>
        <Text>마이페이지</Text>
        <Text>현재 탭: {tab}</Text>
      </View>
    </Layout>
  );
};

export default MypageScreen;
