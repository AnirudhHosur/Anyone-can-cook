import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation';
import { AuthProvider } from './src/navigation/AuthContext';
import OrderContextProvider from './src/navigation/OrderContext';

export default function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <OrderContextProvider>
            <Navigation />
            <StatusBar style="auto" />
          </OrderContextProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}