import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { AndroidImportance } from '@notifee/react-native';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

const messaging = getMessaging(getApp());

async function displayNotification(remoteMessage) {
  await notifee.createChannel({
    id: 'default',
    name: '기본 알림',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title:
      remoteMessage.notification?.title || remoteMessage.data?.title || '알림',
    body:
      remoteMessage.notification?.body ||
      remoteMessage.data?.body ||
      '메시지가 도착했습니다.',
    android: {
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
    },
    data: remoteMessage.data,
  });
}

setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log('Background message:', remoteMessage);
  await displayNotification(remoteMessage);

  const data = remoteMessage.data ?? {};

  await AsyncStorage.setItem(
    'PENDING_DIARY_EVENT',
    JSON.stringify({
      hasNewDiary: true,
      postId: typeof data.postId === 'string' ? data.postId : null,
      screen: typeof data.screen === 'string' ? data.screen : null,
      receivedAt: Date.now(),
    }),
  );
});

AppRegistry.registerComponent(appName, () => App);
