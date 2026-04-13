import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import { api } from './sehodiary-api';
import { BASE_URL } from './BASE_URL';

const DEVICE_ID_KEY = 'DEVICE_ID';

async function getOrCreateDeviceId(): Promise<string> {
  let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = uuidv4();
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

export async function registerFcmToken(token: string) {
  try {
    const deviceId = await getOrCreateDeviceId();

    const res = await api.post(
      `${BASE_URL}/api/fcm/register-token`,
      {
        token,
        deviceId, // ✅ 핵심 추가
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error('register token failed:', error);
    throw error;
  }
}