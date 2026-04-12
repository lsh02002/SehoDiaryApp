/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { DiaryResponseType, HomeStackParamList } from '../../types/type';
import DiaryCard0 from '../../components/react-native-card/DiaryCard0';
import { useLogin } from '../../context/LoginContext';
import Layout from '../../layouts/Layout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import UserProfileCard from '../../components/react-native-card/UserProfileCard';
import {
  getMessaging,
  getToken,
  onNotificationOpenedApp,
  getInitialNotification,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import { Button } from 'react-native';
import { api } from '../../api/sehodiary-api';

const DiaryListPage = ({
  route,
}: NativeStackScreenProps<HomeStackParamList, 'DiaryList'>) => {
  const targetUser = route.params?.targetUser;

  const { isLogin, diary } = useLogin();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [hasNewDiary, setHasNewDiary] = useState(false);

  const [now, setNow] = useState(Date.now());

  const [token, setToken] = useState<string>('');
  const [lastMessage, setLastMessage] = useState<string>('없음');

  const messaging = getMessaging(getApp());

  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000); // 1분

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    getToken(messaging)
      .then(token0 => {
        if (mounted) {
          setToken(token0);
        }
      })
      .catch(err => console.error(err));

    const unsubscribeOpened = onNotificationOpenedApp(
      messaging,
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log(
          'Notification caused app to open from background:',
          remoteMessage,
        );

        if (mounted) {
          setLastMessage(JSON.stringify(remoteMessage, null, 2));
        }
      },
    );

    getInitialNotification(messaging)
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );

          if (mounted) {
            setLastMessage(JSON.stringify(remoteMessage, null, 2));
          }
        }
      })
      .catch(err => console.error(err));

    return () => {
      mounted = false;
      unsubscribeOpened();
    };
  }, [messaging]);

  const loadData = useCallback(() => {
    if (isLogin && targetUser?.userId != null) {
      if (loading || !hasMore) return;

      setLoading(true);
      api
        .get(`/diary/${targetUser?.userId}/user?page=${page}&limit=10`)
        .then(res => {
          setDiaryList(prev => [...prev, ...(res.data?.content ?? [])]);
          setHasMore(res.data?.content.length > 0);
          setPage(prev => prev + 1);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (loading || !hasMore) return;
      setLoading(true);
      api
        .get(`/diary/public?page=${page}&limit=10`)
        .then(res => {
          setDiaryList(prev => [...prev, ...(res.data?.content ?? [])]);
          setHasMore(res.data?.content.length > 0);
          setPage(prev => prev + 1);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [hasMore, isLogin, loading, page, targetUser?.userId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      setDiaryList([]);
      await loadData();
    } catch (e) {
      console.error(e);
      // maybe show a toast or restore previous data
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEndReached = useCallback(() => {
    if (loading || !hasMore) return;
    loadData();
  }, [loading, hasMore, loadData]);

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
    <Layout ref={scrollRef} isScrollView={false}>
      <FlatList
        ref={scrollRef}
        data={diaryList}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <DiaryCard0 diary0={item} now={now} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.content}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <>
            <UserProfileCard user={targetUser ?? null} />

            {hasNewDiary && (
              <Pressable
                style={{
                  backgroundColor: '#fff3cd',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderWidth: 1,
                  borderColor: '#ffe69c',
                  marginBottom: 16,
                  borderRadius: 8,
                }}
                onPress={() => {
                  loadData();
                  setHasNewDiary(false);
                }}
              >
                <Text>새로운 글이 올라와 있습니다. 눌러서 새로고침하세요.</Text>
              </Pressable>
            )}

            <View>
              <Text selectable style={{ marginBottom: 24 }}>
                {token || '불러오는 중...'}
              </Text>

              <Text style={{ fontWeight: '700', marginBottom: 8 }}>
                마지막 메시지
              </Text>

              <Text style={{ marginBottom: 24 }}>{lastMessage}</Text>

              <Button
                title="토큰 다시 조회"
                onPress={async () => {
                  const newToken = await messaging.getToken();
                  setToken(newToken);
                }}
              />
            </View>
          </>
        }
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ paddingVertical: 20 }} /> : null
        }
      />
    </Layout>
  );
};

export default DiaryListPage;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  content: {
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
