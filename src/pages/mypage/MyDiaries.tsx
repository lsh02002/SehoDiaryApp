import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getDiariesByUserApi } from '../../api/sehodiary-api';
import { DiaryResponseType } from '../../types/type';
import DiaryCard0 from '../../components/react-native-card/DiaryCard0';
import { useLogin } from '../../context/LoginContext';

const MyDiaries = ({ reloadKey }: { reloadKey?: number }) => {
  const { diary } = useLogin();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000); // 1분

    return () => clearInterval(timer);
  }, []);

  const loadData = useCallback(() => {
    setLoading(true);

    getDiariesByUserApi()
      .then(res => {
        setDiaryList(res.data?.content ?? []);
      })
      .catch(() => {
        setDiaryList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, reloadKey]);

  useEffect(() => {
    setDiaryList(prev =>
      prev.map(item => (item.id === diary?.id ? diary : item)),
    );
  }, [diary]);

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내가쓴일기 ({diaryList.length})</Text>

      {diaryList.length > 0 ? (
        diaryList.map((diary0: DiaryResponseType) => (
          <DiaryCard0 key={String(diary0?.id)} diary0={diary0} now={now} />
        ))
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>해당 글이 없습니다!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  emptyBox: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
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

export default MyDiaries;
