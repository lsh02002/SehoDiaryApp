import React from 'react';
import { View, Text } from 'react-native';
import Layout from '../../layouts/Layout';

const HomeScreen = ({ route }: any) => {
  const tab = route?.params?.tab ?? 'home';

  return (
    <Layout>
      <View>
        <Text>홈페이지</Text>
        <Text>현재 탭: {tab}</Text>
      </View>
    </Layout>
  );
};

export default HomeScreen;
