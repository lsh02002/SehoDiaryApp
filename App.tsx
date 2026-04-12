import { NavigationContainer } from '@react-navigation/native';
import { LoginProvider, useLogin } from './src/context/LoginContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootSiblingParent } from 'react-native-root-siblings';
import BottomTabNavigator from './src/layouts/BottomTabNavigator';
import {
  initFcm,
  requestNotificationPermission,
} from './src/firebase/messaging';

function AppContent() {
  const { setIsLogin } = useLogin();

  useEffect(() => {
    const getAccessToken = async () => {
      return await AsyncStorage.getItem('accessToken');
    };

    const init = async () => {
      const accessToken = await getAccessToken();

      if (accessToken) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    };

    init();
  }, [setIsLogin]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupFcm = async () => {
      try {
        const hasPermission = await requestNotificationPermission();

        if (!hasPermission) {
          console.log('알림 권한 없음');
          return;
        }

        unsubscribe = await initFcm();
      } catch (error) {
        console.error('FCM init error:', error);
      }
    };

    setupFcm();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return <BottomTabNavigator />;
}

function App() {
  return (
    <RootSiblingParent>
      <SafeAreaProvider>
        <NavigationContainer>
          <LoginProvider>
            <AppContent />
          </LoginProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </RootSiblingParent>
  );
}

export default App;
