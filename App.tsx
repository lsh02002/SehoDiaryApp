import { NavigationContainer } from '@react-navigation/native';
import LoginPage from './src/pages/user/LoginPage';
import { LoginProvider } from './src/context/LoginContext';
import { ReactNativeToast } from './src/layouts/Toast';

function App() {
  return (
    <NavigationContainer>
      <LoginProvider>
        <LoginPage />
        <ReactNativeToast />
      </LoginProvider>
    </NavigationContainer>
  );
}

export default App;
