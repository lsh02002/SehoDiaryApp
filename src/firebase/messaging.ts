import { PermissionsAndroid, Platform } from 'react-native';
import {
  FirebaseMessagingTypes,
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  requestPermission,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import { registerFcmToken } from '../api/fcmApi';
import { showToast } from '../layouts/Toast';

const app = getApp();
const messaging = getMessaging(app);

export async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      return false;
    }
  }

  const authStatus = await requestPermission(messaging);

  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
}

export async function initFcm() {
  const enabled = await requestNotificationPermission();

  if (!enabled) {
    console.log('알림 권한 거부됨');
    return () => {};
  }

  try {
    const token = await getToken(messaging);
    console.log('FCM token:', token);
    await registerFcmToken(token);
  } catch (err) {
    console.error('FCM token registration error:', err);
  }

  const unsubscribeOnMessage = onMessage(
    messaging,
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('Foreground message:', remoteMessage);

      const title =
        remoteMessage.notification?.title ||
        remoteMessage.data?.title ||
        '알림';

      const body =
        remoteMessage.notification?.body ||
        remoteMessage.data?.body ||
        '메시지가 도착했습니다.';

      if (typeof title === 'string' && typeof body === 'string') {
        showToast(`${title}: ${body}`, 'info');
      } else {
        showToast('새 알림이 도착했습니다.', 'info');
      }
    },
  );

  const unsubscribeOnTokenRefresh = onTokenRefresh(
    messaging,
    async (newToken: string) => {
      try {
        console.log('FCM token refreshed:', newToken);
        await registerFcmToken(newToken);
      } catch (err) {
        console.error('FCM token refresh registration error:', err);
      }
    },
  );

  return () => {
    unsubscribeOnMessage();
    unsubscribeOnTokenRefresh();
  };
}