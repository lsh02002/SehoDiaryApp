import { NavigationContainer } from '@react-navigation/native';
import { LoginProvider } from './src/context/LoginContext';
import BottomTabNavigator from './src/layouts/BottomTabNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <LoginProvider>
          <BottomTabNavigator />
        </LoginProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
