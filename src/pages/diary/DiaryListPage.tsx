/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Pressable,
  FlatList,
  ActivityIndicator,
  Button,
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

  const scrollRef = useRef<FlatList<DiaryResponseType> | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOpenedMessage = (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
    ) => {
      if (!remoteMessage) {
        return;
      }

      console.log('Notification open event:', remoteMessage);
      setLastMessage(JSON.stringify(remoteMessage, null, 2));

      if (remoteMessage.data?.type === 'POST_CREATED') {
        setHasNewDiary(true);
      }
    };

    const init = async () => {
      try {
        const token0 = await getToken(messaging);
        setToken(token0);
      } catch (err) {
        console.error('getToken error:', err);
      }

      try {
        const remoteMessage = await getInitialNotification(messaging);
        console.log('getInitialNotification result:', remoteMessage);
        handleOpenedMessage(remoteMessage);
      } catch (err) {
        console.error('getInitialNotification error:', err);
      }
    };

    init();

    const unsubscribeOpened = onNotificationOpenedApp(
      messaging,
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log(
          'Notification caused app to open from background:',
          remoteMessage,
        );
        handleOpenedMessage(remoteMessage);
      },
    );

    return () => {
      unsubscribeOpened();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mergeUniqueById = (
    prev: DiaryResponseType[],
    next: DiaryResponseType[],
  ) => {
    const map = new Map<number | string, DiaryResponseType>();

    [...prev, ...next].forEach(item => {
      map.set(item.id, item);
    });

    return Array.from(map.values());
  };

  const loadData = useCallback(
    async (options?: { refresh?: boolean }) => {
      const refresh = options?.refresh ?? false;

      if (loadingRef.current) return;
      if (!refresh && !hasMore) return;

      loadingRef.current = true;
      setLoading(true);

      const requestPage = refresh ? 0 : page;

      try {
        const url =
          isLogin && targetUser?.userId != null
            ? `/diary/${targetUser.userId}/user?page=${requestPage}&limit=10`
            : `/diary/public?page=${requestPage}&limit=10`;

        const res = await api.get(url);
        const content: DiaryResponseType[] = res.data?.content ?? [];

        setDiaryList(prev =>
          refresh ? content : mergeUniqueById(prev, content),
        );

        setHasMore(content.length > 0);
        setPage(requestPage + 1);
      } catch (err) {
        console.error(err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [hasMore, isLogin, page, targetUser?.userId],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setHasMore(true);
      await loadData({ refresh: true });
    } finally {
      setIsRefreshing(false);
    }
  }, [loadData]);

  const handleEndReached = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    loadData();
  }, [hasMore, loadData]);

  useEffect(() => {
    setDiaryList([]);
    setPage(0);
    setHasMore(true);
    loadData({ refresh: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, targetUser?.userId]);

  useEffect(() => {
    if (!diary?.id) return;

    setDiaryList(prev => prev.map(i => (i.id === diary.id ? diary : i)));
  }, [diary]);

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
            {hasNewDiary && (
              <Pressable
                style={{
                  backgroundColor: '#fff3cd',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderWidth: 1,
                  borderColor: '#ffe69c',
                  marginTop: 16,
                  marginBottom: 16,
                  borderRadius: 8,
                }}
                onPress={() => {
                  handleRefresh();
                  setHasNewDiary(false);
                }}
              >
                <Text>새로운 글이 올라와 있습니다. 눌러서 새로고침하세요.</Text>
              </Pressable>
            )}
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>데이터가 없습니다.</Text>
            </View>
          ) : null
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
