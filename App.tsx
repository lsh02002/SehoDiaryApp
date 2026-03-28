import { NavigationContainer } from '@react-navigation/native';
import { LoginProvider, useLogin } from './src/context/LoginContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/layouts/RootNavigator';
import { ScrollProvider } from './src/context/ScrollContext';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootSiblingParent } from 'react-native-root-siblings';

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

  return <RootNavigator />;
}

function App() {
  return (
    <RootSiblingParent>
      <SafeAreaProvider>
        <NavigationContainer>
          <ScrollProvider>
            <LoginProvider>
              <AppContent />
            </LoginProvider>
          </ScrollProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </RootSiblingParent>
  );
}

export default App;
