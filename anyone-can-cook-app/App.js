import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation';
import BasketContextProvider from './src/navigation/BasketContext';
import OrderContextProvider from './src/navigation/OrderContext';
import AuthContextProvider from './src/navigation/AuthContext';

export default function App() {
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <BasketContextProvider>
          <OrderContextProvider>
            <RootNavigator />
          </OrderContextProvider>
        </BasketContextProvider>
      </AuthContextProvider>

      <StatusBar style="light" />
    </NavigationContainer>
  );
}