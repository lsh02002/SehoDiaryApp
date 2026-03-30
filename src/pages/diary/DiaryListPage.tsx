import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { getDiariesByPublicApi } from '../../api/sehodiary-api';
import { DiaryResponseType } from '../../types/type';
import DiaryCard0 from '../../components/react-native-card/DiaryCard0';
import { useLogin } from '../../context/LoginContext';
import Layout from '../../layouts/Layout';
import { useFocusEffect } from '@react-navigation/native';

const DiaryListPage = () => {
  const { diary } = useLogin();
  const scrollRef = useRef<ScrollView>(null);
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      getDiariesByPublicApi()
        .then(res => {
          setDiaryList(res.data);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }, []),
  );

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
    <Layout>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {diaryList && diaryList.length > 0 ? (
            diaryList.map((diary0: DiaryResponseType) => (
              <DiaryCard0 key={diary0?.id} diary0={diary0} />
            ))
          ) : (
            <Text style={styles.emptyText}>해당 글이 없습니다!</Text>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
};

export default DiaryListPage;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingHorizontal: 12,
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
  emptyText: {},
});
