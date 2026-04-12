import { BASE_URL } from './BASE_URL';
import { api } from './sehodiary-api';

export async function registerFcmToken(token: string) {
  try {
    const res = await api.post(
      `${BASE_URL}/api/fcm/register-token`,
      { token },
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