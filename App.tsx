import { NavigationContainer } from '@react-navigation/native';
import { LoginProvider, useLogin } from './src/context/LoginContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootSiblingParent } from 'react-native-root-siblings';
import BottomTabNavigator from './src/layouts/BottomTabNavigator';
import { initFcm } from './src/firebase/messaging';

function AppContent() {
  const { setIsLogin } = useLogin();
  const { setHasNewDiary } = useLogin();

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
    const bootstrap = async () => {
      const saved = await AsyncStorage.getItem('PENDING_DIARY_EVENT');

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed?.hasNewDiary) {
          setHasNewDiary(true);
        }
      }
    };

    bootstrap();

    const unsubscribe = initFcm(setHasNewDiary);

    return () => {
      Promise.resolve(unsubscribe).then(fn => fn?.());
    };
  }, [setHasNewDiary]);

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
