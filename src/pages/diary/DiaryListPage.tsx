import React, { useCallback, useEffect, useState } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { getDiariesByPublicApi } from '../../api/sehodiary-api';
import { DiaryResponseType } from '../../types/type';
import DiaryCard0 from '../../components/react-native-card/DiaryCard0';
import { useLogin } from '../../context/LoginContext';
import Layout from '../../layouts/Layout';
import { useFocusEffect } from '@react-navigation/native';

const DiaryListPage = () => {
  const { diary } = useLogin();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);

  useFocusEffect(
    useCallback(() => {
      getDiariesByPublicApi()
        .then(res => {
          setDiaryList(res.data);
        })
        .catch(() => {});
    }, []),
  );

  useEffect(() => {
    setDiaryList(prev => {
      if (!prev) return prev;
      return prev.map(i => (i.id === diary?.id ? diary : i));
    });
  }, [diary]);

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        {diaryList && diaryList.length > 0 ? (
          diaryList.map((diary0: DiaryResponseType) => (
            <DiaryCard0 key={diary0?.id} diary0={diary0} />
          ))
        ) : (
          <Text style={styles.emptyText}>해당 글이 없습니다!</Text>
        )}
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
  emptyText: {},
});
