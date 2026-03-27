import { NavigationContainer } from '@react-navigation/native';
import { LoginProvider } from './src/context/LoginContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/layouts/RootNavigator';
import { ReactNativeToast } from './src/layouts/Toast';

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <LoginProvider>
          <RootNavigator />
          <ReactNativeToast />
        </LoginProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
