import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

const messaging = getMessaging(getApp());

setBackgroundMessageHandler(
  messaging,
  async (remoteMessage) => {
    console.log('Background message:', remoteMessage);

    const title =
      remoteMessage.notification?.title ||
      remoteMessage.data?.title ||
      '알림';

    const body =
      remoteMessage.notification?.body ||
      remoteMessage.data?.body ||
      '메시지가 도착했습니다.';

    console.log('title:', title);
    console.log('body:', body);
    console.log('data:', remoteMessage.data);
  },
);

AppRegistry.registerComponent(appName, () => App);
