import {
  FirebaseMessagingTypes,
  getMessaging,
  onMessage,
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { getApp } from '@react-native-firebase/app';

type MessageData = Record<string, string | object>;

const messaging = getMessaging(getApp());

function getString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

async function saveDiaryEvent(data?: MessageData) {
  const type = getString(data?.type);

  if (type !== 'POST_CREATED') return;

  const postId = getString(data?.postId);
  const screen = getString(data?.screen);

  await AsyncStorage.setItem(
    'PENDING_DIARY_EVENT',
    JSON.stringify({
      hasNewDiary: true,
      postId: postId ?? null,
      screen: screen ?? null,
      receivedAt: Date.now(),
    }),
  );
}

export async function initFcm(setHasNewDiary: (value: boolean) => void) {
  const unsubscribeOnMessage = onMessage(
    messaging,
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('Foreground message:', remoteMessage);

      // 클릭 안 해도 즉시 반영
      if (remoteMessage.data?.type === 'POST_CREATED') {
        setHasNewDiary(true);
      }

      // 앱 재시작 대비 저장
      await saveDiaryEvent(remoteMessage.data);

      // 필요하면 포그라운드에서도 notifee 표시
      const channelId = await notifee.createChannel({
        id: 'default',
        name: '기본 알림',
        importance: AndroidImportance.HIGH,
      });

      const rawTitle =
        remoteMessage.notification?.title ?? remoteMessage.data?.title;
      const rawBody =
        remoteMessage.notification?.body ?? remoteMessage.data?.body;

      const title = typeof rawTitle === 'string' ? rawTitle : '알림';
      const body =
        typeof rawBody === 'string' ? rawBody : '메시지가 도착했습니다.';

      await notifee.displayNotification({
        title,
        body,
        data: remoteMessage.data,
        android: {
          channelId,
          pressAction: { id: 'default' },
        },
      });
    },
  );

  return () => {
    unsubscribeOnMessage();
  };
}
