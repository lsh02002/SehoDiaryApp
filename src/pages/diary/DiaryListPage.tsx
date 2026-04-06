import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import {
  getDiariesByPublicApi,
  getDiariesTargetFollowingUserIdByUser,
} from '../../api/sehodiary-api';
import { DiaryResponseType, HomeStackParamList } from '../../types/type';
import DiaryCard0 from '../../components/react-native-card/DiaryCard0';
import { useLogin } from '../../context/LoginContext';
import Layout from '../../layouts/Layout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import UserProfileCard from '../../components/react-native-card/UserProfileCard';

const DiaryListPage = ({
  route,
}: NativeStackScreenProps<HomeStackParamList, 'DiaryList'>) => {
  const targetUser = route.params?.targetUser;

  const { isLogin, diary } = useLogin();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    if (isLogin && targetUser?.userId != null) {
      setLoading(true);

      getDiariesTargetFollowingUserIdByUser(targetUser?.userId ?? -1)
        .then(res => {
          setDiaryList(res.data ?? []);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);

      getDiariesByPublicApi()
        .then(res => {
          setDiaryList(res.data);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isLogin, targetUser?.userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setDiaryList(prev => {
      if (!prev) return prev;
      return prev.map(i => (i.id === diary?.id ? diary : i));
    });
  }, [diary]);

  if (loading) {
    return (
      <Layout>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>불러오는 중...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout onRefresh={loadData}>
      <View style={styles.container}>
        <View style={styles.content}>
          <UserProfileCard user={targetUser ?? null} />
          {diaryList && diaryList.length > 0 ? (
            diaryList.map((diary0: DiaryResponseType) => (
              <DiaryCard0 key={diary0?.id} diary0={diary0} />
            ))
          ) : (
            <Text style={styles.emptyText}>해당 글이 없습니다!</Text>
          )}
        </View>
      </View>
    </Layout>
  );
};

export default DiaryListPage;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,    
    marginBottom: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
  },
});
